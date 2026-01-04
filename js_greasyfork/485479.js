// ==UserScript==
// @name         Button click event
// @namespace    https://github.com/W-Dragoner/tiktokdemo
// @version      2024-01-23
// @description  Click the button to display text
// @author       You
// @match        file:///C:/Users/%E9%AD%8F%E5%BE%B7%E9%9A%86/Desktop/%E8%84%9A%E6%9C%ACdemo/demo2.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485479/Button%20click%20event.user.js
// @updateURL https://update.greasyfork.org/scripts/485479/Button%20click%20event.meta.js
// ==/UserScript==

// 获取原始按钮、新按钮和隐藏文本的元素
var originalButton = document.getElementById("originalButton");
var newButton = document.getElementById("newButton");
var hiddenText = document.getElementById("hiddenText");

// 添加原始按钮的点击事件监听器
originalButton.addEventListener("click", function() {
  // 显示新按钮
  setTimeout(function() {
    newButton.click();
  }, 2000);
  newButton.style.display = "block";
});

// 添加新按钮的点击事件监听器
newButton.addEventListener("click", function() {
  // 显示隐藏文本
  hiddenText.style.display = "block";
});
