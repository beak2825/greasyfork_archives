// ==UserScript==
// @name        bing华容道键盘控件
// @namespace   Violentmonkey Scripts
// @match       https://cn.bing.com/spotlight/imagepuzzle*
// @grant       none
// @version     1.0
// @author      FourthDing
// @description 数字华容道的键盘控件还是没有推出。给微软写一个好了（笑）
// @license     GPL3.0
// @downloadURL https://update.greasyfork.org/scripts/507155/bing%E5%8D%8E%E5%AE%B9%E9%81%93%E9%94%AE%E7%9B%98%E6%8E%A7%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/507155/bing%E5%8D%8E%E5%AE%B9%E9%81%93%E9%94%AE%E7%9B%98%E6%8E%A7%E4%BB%B6.meta.js
// ==/UserScript==
document.querySelector(".insText2text").textContent = "键盘控件: 现已推出!";
var position = [0, 0]; //空格位置
var matrix = //二维3*3元素网格
  [
    [
      document.getElementById("00"),
      document.getElementById("10"),
      document.getElementById("20"),
    ],
    [
      document.getElementById("01"),
      document.getElementById("11"),
      document.getElementById("21"),
    ],
    [
      document.getElementById("02"),
      document.getElementById("12"),
      document.getElementById("22"),
    ],
  ];
getEmpty();
function getEmpty() {//获得空块的位置，好像可以优化一下
  for (let x in matrix) {
    for (let y in matrix[x]) {
      if (matrix[x][y].childNodes.length == 0) {
        position = [Number(x), Number(y)];
        console.log(position);
      }
    }
  }
}
document.addEventListener("keydown", puzzleKeyEvent);//监听按键

function puzzleKeyEvent(event) {//判断按键
  if (0 <= position[0] - 1 <= 2 && event.key === "ArrowRight") {
    //console.log("Left");
    var clickPos = posAdd(position, [-1, 0]);
    moveTile(clickPos);
  } else if (0 <= position[0] + 1 <= 2 && event.key === "ArrowLeft") {
    //console.log("Right");
    var clickPos = posAdd(position, [1, 0]);
    moveTile(clickPos);
  } else if (0 <= position[1] - 1 <= 2 && event.key === "ArrowDown") {
    //console.log("Up");
    var clickPos = posAdd(position, [0, -1]);
    moveTile(clickPos);
  } else if (0 <= position[1] + 1 <= 2 && event.key === "ArrowUp") {
    //console.log("Down");
    var clickPos = posAdd(position, [0, 1]);
    moveTile(clickPos);
  } else {
    return;
  }
}
function moveTile(pos) {//挪动块
  //console.log(pos);
  matrix[pos[0]][pos[1]].click();
  getEmpty();
}
function posAdd(pos1, pos2) {//位置运算
  //debugger;
  return [Number(pos1[0] + pos2[0]), Number(pos1[1] + pos2[1])];
}

