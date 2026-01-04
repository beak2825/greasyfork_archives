// ==UserScript==
// @name         hire
// @namespace    https://greasyfork.org/users/hire
// @version      2023121102
// @description  自动检测表格内容变化
// @author       Taiyuan
// @include      *trophymanager.com/scouts/hire/
// @include	   
// @downloadURL https://update.greasyfork.org/scripts/481759/hire.user.js
// @updateURL https://update.greasyfork.org/scripts/481759/hire.meta.js
// ==/UserScript==

// 定义全局变量来存储上一次表格内容
var previousContent = document.querySelector('table.hover.border_bottom').innerHTML;

// 定义函数进行表格内容检测
function checkTableChanges() {
  // 获取当前的表格内容
  var currentContent = document.querySelector('table.hover.border_bottom').innerHTML;

  // 如果表格内容发生变化，则弹窗提醒
  if (currentContent !== previousContent) {
    // 更新上一次表格内容
    previousContent = currentContent;

    // 弹窗提醒表格内容已更新
    alert("表格内容已更新！");
  }
}

// 设置定时器，每秒执行一次表格内容检测函数
setInterval(checkTableChanges, 1000);