// ==UserScript==
// @name         Copy SPU Text 01
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Copy SPU Text的附件，监听清空剪切板。
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474772/Copy%20SPU%20Text%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/474772/Copy%20SPU%20Text%2001.meta.js
// ==/UserScript==

(function() {
  // 定义一个函数，用于清空剪贴板
  function clearClipboard() {
    // 创建一个隐藏的<textarea>元素并将其内容设置为空
    const textArea = document.createElement("textarea");
    textArea.value = " ";
    document.body.appendChild(textArea);

    // 选中文本并执行复制操作
    textArea.select();
    document.execCommand("copy");

    // 移除<textarea>元素
    document.body.removeChild(textArea);
  }

  // 使用事件委托将清空函数绑定到按钮的父元素
  const buttonContainer = document.getElementById("app"); // 请根据实际情况设置容器元素的选择器
  if (buttonContainer) {
    buttonContainer.addEventListener("click", function(event) {
      const targetButton = event.target.closest("button"); // 查找最近的按钮元素
      if (targetButton) {
        // 如果有按钮被点击
        clearClipboard(); // 执行清空剪贴板操作
      }
    });
  }
})();
