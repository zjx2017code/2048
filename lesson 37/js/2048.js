//游戏状态常量
//const 常量
const PLAYING = 0; //游戏进行中
const CELL_MOVING = 1; //方块正在移动,键盘事件不响应
const GAME_OVER = 2; //游戏结束，键盘事件不响应

//积分
var score = 0;

//游戏当前状态
var state = PLAYING;

//初始化
window.onload = function() {
	newGame.addEventListener('click', init);
	restart.addEventListener('click', init);
	window.addEventListener('keydown', onKeyPress)
	init();
}

//保存数据的单元格数组
var cells

//初始化函数
function init() {
	//初始化单元格数据
	cells = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	//隐藏结束菜单
	gameOver.style.display = 'none';
	//重新记分
	score = 0;
	state = PLAYING; //重置游戏状态
	//生成两个随机数，并写入cells中
	randomNumber();
	randomNumber();

	//根据数据模型更新视图
	updateView();
}
//在数组中随机生成一个数字
function randomNumber() {
	//判断是否填满单元格，
	if(full()) {
		return;
	}
	while(true) { //如果没有填充随机数就继续循环
		var row = Math.floor(Math.random() * 4)
		var col = Math.floor(Math.random() * 4)
		if(cells[row][col] == 0) { //当前位置为空
			//随机赋值2或4
			cells[row][col] = Math.random() >= 0.5 ? 4 : 2;
			break;
		}
		
	}
}
//检测单元格是否填满（每个位置均有数字）
//满了返回true，否则false
function full() {
	for(var row = 0; row < 4; row++) {
		for(var col = 0; col < 4; col++) {
			if(cells[row][col] == 0) {
				return false;
			}
		}
	}
	//循环结束仍然没有任何一个等于0，说明满了
	return true;
}
//更新视图
function updateView() {
	//遍历cells,将其中非0的数字显示到cell中
	for(var row = 0; row < 4; row++) {
		for(var col = 0; col < 4; col++) {
			//单元格的值
			var n = cells[row][col];
			//获取细胞单元格
			var cell = $('cell' + row + col);
			//设置其内容和类名
			cell.innerHTML = '';
			cell.className = 'cell';
			//如果值不是0，还要追加num*类名
			if(n > 0) {
				cell.className = 'cell num' + n;
				cell.innerHTML = n;
			}
		}

	}
	//设置积分
	$('score').innerHTML = score
	$('finalScore').innerHTML = score
}

//工厂函数：根据提供的id获取dom对象
function $(id) {
	return document.getElementById(id)
}
//键盘处理函数
function onKeyPress(event) {
	if(state == PLAYING) { //游戏进行中响应
		switch(event.key) {
			case 'ArrowUp':
				upAction();
				break;
			case 'ArrowDown':
				downAction();
				break;
			case 'ArrowLeft':
				leftAction();
				break;
			case 'ArrowRight':
				rightAction();
				break;

		}
		//游戏结束判断
		isGameOver();
	}
}

function upAction() {
	if(canMoveUp()) {
		//开始移动
		for(var col = 0; col < 4; col++) {
			for(var row = 0; row < 3;) {
				var current = cells[row][col]; //当前值
				//查找下一个非零数字
				var nextRow = getNextInCol(col, row + 1,1);
				//1.如果nextRow是-1，没有需要合并和移动的
				if(nextRow == -1) {
					break;
				}
				//2.判断非零数的值和当前值的关系
				var next = cells[nextRow][col];
				if(current == 0) { //当前是0，将next替换当前（移动）
					cells[row][col] = next;
					//next 变为0
					cells[nextRow][col] = 0;
				} else if(current == next) {
					//两者相等，则合并
					cells[row][col] = current + next;
					//对next清零
					cells[nextRow][col] = 0;
					//加分
					score += cells[row][col];
					//合并时行号变，移动时不变
					row++;
				} else {
					//下个数和当前不同
					row++;
				}
			}
		}
		//生成新数字
		randomNumber();
		//更新新页面
		updateView();
	}
}
//判断能否向上移动
function canMoveUp() {
	for(var col = 0; col < 4; col++) {
		for(var row = 1; row < 4; row++) {
			//格子上方是空位：当前格子不空，上方空
			if(cells[row][col] != 0 && cells[row - 1][col] == 0) {
				return true;
			}
			//格子上方相邻数字相等可合并
			if(cells[row][col] != 0 && cells[row - 1][col] == cells[row][col]) {
				return true;
			}
		}
	}
	return false;
}


function downAction() {
	if(canMoveDown()) {
		//开始移动
		for(var col = 0; col < 4; col++) {
			for(var row = 3; row > 0;) {
				var current = cells[row][col]; //当前值
				//查找下一个非零数字
				var nextRow = getNextInCol(col, row - 1,-1);
				//1.如果nextRow是-1，没有需要合并和移动的
				if(nextRow == -1) {
					break;
				}
				//2.判断非零数的值和当前值的关系
				var next = cells[nextRow][col];
				if(current == 0) { //当前是0，将next替换当前（移动）
					cells[row][col] = next;
					//next 变为0
					cells[nextRow][col] = 0;
				} else if(current == next) {
					//两者相等，则合并
					cells[row][col] = current + next;
					//对next清零
					cells[nextRow][col] = 0;
					//加分
					score += cells[row][col];
					//合并时行号变
					row--;
				} else {
					//下个数和当前不同
					row--;
				}
			}
		}
		//生成新数字
		randomNumber();
		
		//更新新页面
		updateView();
	}
}
//判断能否向下移动
function canMoveDown() {
	for(var col = 0; col < 4; col++) {
		for(var row = 0; row < 3; row++) {
			//格子上方是空位：当前格子不空，上方空
			if(cells[row][col] != 0 && cells[row + 1][col] == 0) {
				return true;
			}
			//格子上方相邻数字相等可合并
			if(cells[row][col] != 0 && cells[row + 1][col] == cells[row][col]) {
				return true;
			}
		}
	}
	return false;
}
//查找指定列中指定行起始的首个非零数字，并返回其行号
function getNextInCol(col, row,step) {
	while(true) {
		if(cells[row][col] != 0) { //找到非零数
			return row;
		}
		row += step //没找到去下一行接着找
		if(row == 4||row==-1) {
			return -1;
		}
	}
}

function leftAction() {

	if(canMoveLeft()) {
		//开始移动
		for(var row = 0; row <4;row++) {
		for(var col = 0; col <3;) {
			
				var current = cells[row][col]; //当前值
				//查找下一个非零数字
				var nextCol = getNextInRow(row, col+1,1);
				//1.如果nextRow是-1，没有需要合并和移动的
				if(nextCol == -1) {
					break;
				}
				//2.判断非零数的值和当前值的关系
				var next = cells[row][nextCol];
				if(current == 0) { //当前是0，将next替换当前（移动）
					cells[row][col] = next;
					//next 变为0
					cells[row][nextCol] = 0;
				} else if(current == next) {
					//两者相等，则合并
					cells[row][col] = current + next;
					//对next清零
					cells[row][nextCol] = 0;
					//加分
					score += cells[row][col];
					//合并时行号变
					col++;
				} else {
					//下个数和当前不同
					col++;
				}
			}
		}
		//生成新数字
		randomNumber();
		
		//更新新页面
		updateView();
	}
}
//判断能否向左移动
function canMoveLeft() {
	for(var row = 0; row <4;row++) {
		for(var col = 1; col <4;col++) {
			//格子上方是空位：当前格子不空，上方空
			if(cells[row][col] != 0 && cells[row ][col-1] == 0) {
				return true;
			}
			//格子上方相邻数字相等可合并
			if(cells[row][col] != 0 && cells[row ][col-1] == cells[row][col]) {
				return true;
			}
		}
	}
	return false;
}



function rightAction() {


	if(canMoveRight()) {
		//开始移动
		for(var row = 0; row <4;row++) {
		for(var col = 3; col >0;) {
			
				var current = cells[row][col]; //当前值
				//查找下一个非零数字
				var nextCol = getNextInRow(row, col-1,-1);
				//1.如果nextRow是-1，没有需要合并和移动的
				if(nextCol == -1) {
					break;
				}
				//2.判断非零数的值和当前值的关系
				var next = cells[row][nextCol];
				if(current == 0) { //当前是0，将next替换当前（移动）
					cells[row][col] = next;
					//next 变为0
					cells[row][nextCol] = 0;
				} else if(current == next) {
					//两者相等，则合并
					cells[row][col] = current + next;
					//对next清零
					cells[row][nextCol] = 0;
					//加分
					score += cells[row][col];
					//合并时行号变
					col--;
				} else {
					//下个数和当前不同
					col--;
				}
			}
		}
		//生成新数字
		randomNumber();
		
		//更新新页面
		updateView();
	}
}
//判断能否向左移动
function canMoveRight() {
	for(var row = 0; row <4;row++) {
		for(var col = 0; col <3;col++) {
			//格子上方是空位：当前格子不空，上方空
			if(cells[row][col] != 0 && cells[row ][col+1] == 0) {
				return true;
			}
			//格子上方相邻数字相等可合并
			if(cells[row][col] != 0 && cells[row ][col+1] == cells[row][col]) {
				return true;
			}
		}
	}
	return false;
}
//查找指定列中指定行起始的首个非零数字，并返回其行号
function getNextInRow( row, col, step) {
	while(true) {
		if(cells[row][col] != 0) { //找到非零数
			return col;
		}
		col += step //没找到去下一行接着找
		if(col == 4||col==-1) {
			return -1;
		}
	}
}

function isGameOver(){
	if (full()){//先判断是否填满
		if(!canMoveDown()&&!canMoveLeft()&&!canMoveRight()&&!canMoveUp()){
			//不能向各方向移动或合并
			state=GAME_OVER;
			//game over面板显示
			gameOver.style.display='block';
	}
}
}