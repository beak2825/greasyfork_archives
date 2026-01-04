// ==UserScript==
// @name         Rename Title
// @version      2024-05-11
// @description  rename title
// @author       Cocowwy
// @match        *://*/*
// @namespace https://greasyfork.org/users/1299821
// @downloadURL https://update.greasyfork.org/scripts/494642/Rename%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/494642/Rename%20Title.meta.js
// ==/UserScript==

// 重命名
function showPopup() {
  var input = prompt('Rename Title:');
  if (input !== null) {
     document.title = input;
  }
}
// 记录按键状态的变量
var isCommandPressed = false;
var isOptionPressed = false;
var isTPressed = false;

// 监听按键按下事件
document.addEventListener('keydown', function(event) {
  // 检查是否按下 Command 键
  if (event.keyCode === 91) {
    isCommandPressed = true;
  }

  // 检查是否按下 Option 键
  if (event.keyCode === 18) {
    isOptionPressed = true;
  }

  // 检查是否按下字母键 T
  if (event.keyCode === 84) {
    isTPressed = true;
  }

  // 检查是否同时按下了 Command、Option 和 T 键
  if (isCommandPressed && isOptionPressed && isTPressed) {
    // 在这里添加你想要执行的操作代码
    showPopup();
    isCommandPressed = false;
    isOptionPressed = false;
    isTPressed = false;
  }
});

// 监听按键释放事件
document.addEventListener('keyup', function(event) {
  // 检查是否释放了 Command 键
  if (event.keyCode === 91) {
    isCommandPressed = false;
  }

  // 检查是否释放了 Option 键
  if (event.keyCode === 18) {
    isOptionPressed = false;
  }

  // 检查是否释放了 T 键
  if (event.keyCode === 84) {
    isTPressed = false;
  }
});
