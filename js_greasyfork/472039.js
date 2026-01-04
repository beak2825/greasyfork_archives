// ==UserScript==
// @name         设置剪贴板为当前网页URL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按下快捷键Ctrl+Shift+Alt+F10时，将剪贴板设置为当前网页的URL
// @author       You
// @match        *://*/*
// @license MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/472039/%E8%AE%BE%E7%BD%AE%E5%89%AA%E8%B4%B4%E6%9D%BF%E4%B8%BA%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5URL.user.js
// @updateURL https://update.greasyfork.org/scripts/472039/%E8%AE%BE%E7%BD%AE%E5%89%AA%E8%B4%B4%E6%9D%BF%E4%B8%BA%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5URL.meta.js
// ==/UserScript==

// 注册菜单命令，在用户按下Ctrl+Shift+Alt+F10时执行setClipboard函数
GM_registerMenuCommand("设置剪贴板为当前网页URL", function() {
  setClipboard();
});

// 监听键盘按键事件
document.addEventListener('keydown', function(event) {
  // 检查是否按下Ctrl、Shift、Alt和F10键
  if (event.ctrlKey && event.shiftKey && event.altKey && event.key === 'F10') {
    setClipboard();
  }
});

// 设置剪贴板内容的函数
function setClipboard() {
  // 获取当前网页的URL
  var currentUrl = window.location.href;

  // 创建一个临时的textarea元素，并将URL复制到其中
  var tempTextArea = document.createElement("textarea");
  tempTextArea.value = currentUrl;
  document.body.appendChild(tempTextArea);

  // 选中并复制textarea中的内容
  tempTextArea.select();
  document.execCommand("copy");

  // 删除临时的textarea元素
  document.body.removeChild(tempTextArea);
}
