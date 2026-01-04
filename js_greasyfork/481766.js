// ==UserScript==
// @name        跟着我一起扫雷吧
// @namespace   Violentmonkey Scripts
// @match       https://www.minesweeper.cn/
// @grant       none
// @version     1.1
// @author      -
// @description 2023/12/9 18:45:57
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481766/%E8%B7%9F%E7%9D%80%E6%88%91%E4%B8%80%E8%B5%B7%E6%89%AB%E9%9B%B7%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/481766/%E8%B7%9F%E7%9D%80%E6%88%91%E4%B8%80%E8%B5%B7%E6%89%AB%E9%9B%B7%E5%90%A7.meta.js
// ==/UserScript==
const start = document.createElement("button");
start.textContent = "不演直接开";
start.style.position = "fixed";
start.style.top = "10px";
start.style.right = "10px";
start.addEventListener("click", crack);
document.body.appendChild(start);

const uidInput = document.createElement("input");
uidInput.type = "text";
uidInput.placeholder = "自定义成绩榜ID";
uidInput.maxLength = 7;
uidInput.style.top = "40px";
uidInput.style.right = "60px";
uidInput.style.minWidth = "100px";
uidInput.style.position = "fixed";
document.body.appendChild(uidInput);

const confirmButton = document.createElement("button");
confirmButton.textContent = "确定";
confirmButton.style.top = "40px";
confirmButton.style.right = "10px";
confirmButton.style.position = "fixed";
uidInput.insertAdjacentElement("afterend", confirmButton);
confirmButton.addEventListener("click", function () {
  const id = uidInput.value.trim();
  if (/^\d{7}$/.test(id)) {
    localStorage.setItem("uid", id);
    alert(`ID 设置成功: ${id}`);
  } else {
    alert("ID 格式不正确, 仅支持7位数字");
  }
});



function mouseClick(mouseType, row, col) {
  console.log(`on: ${row + 1}行, ${col + 1}列`);
  var f = paf.getBoundingClientRect();
  var point_x = (col + 0.5) * 25 + f.left;
  var point_y = (row + 0.5) * 25 + f.top;

  if (mouseType === 'left') {
    let event1 = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: point_x,
      clientY: point_y,
    });
    paf.dispatchEvent(event1);

    // 确保 mousedown 事件已经处理
    setTimeout(() => {
      let event2 = new MouseEvent('mouseup', {
        button: 0,
        bubbles: true,
        cancelable: true,
        clientX: point_x,
        clientY: point_y,
      });
      paf.dispatchEvent(event2);
    }, 0); // 使用 setTimeout 确保顺序
  } else {
    let event1 = new MouseEvent('mousedown', {
      button: 2,
      bubbles: true,
      cancelable: true,
      clientX: point_x,
      clientY: point_y,
    });
    paf.dispatchEvent(event1);

    // 确保 mousedown 事件已经处理
    setTimeout(() => {
      let event2 = new MouseEvent('mouseup', {
        button: 2,
        bubbles: true,
        cancelable: true,
        clientX: point_x,
        clientY: point_y,
      });
      paf.dispatchEvent(event2);
    }, 0); // 使用 setTimeout 确保顺序
  }
}


function crack() {
  var i = 0;
  var j = 0;
  for (i = 0; i < v; ++i) {
    for (j = 0; j < m; ++j) {
      if (d[i][j][1] != 0) {
        console.log(`第${i + 1}行 第${j + 1}列 是雷`);
        // mouseClick('right', i, j); // 添加后就不是盲扫了哟
        continue;
      }
      else {
        mouseClick('left', i, j);
     }
    }
  }
}
