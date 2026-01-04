// ==UserScript==
// @name        路透社弹窗关闭
// @namespace   Violentmonkey Scripts
// @match       https://www.reuters.com/*
// @grant       none
// @version     1.3
// @author      -
// @description 2023/11/14 12:35:28
// @downloadURL https://update.greasyfork.org/scripts/479810/%E8%B7%AF%E9%80%8F%E7%A4%BE%E5%BC%B9%E7%AA%97%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/479810/%E8%B7%AF%E9%80%8F%E7%A4%BE%E5%BC%B9%E7%AA%97%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==



// 定时器每0.5秒检测一次目标元素
var checkElementInterval = setInterval(function() {
  console.log('未发现弹窗');
  // 选择要删除的元素
  var element = document.getElementsByClassName("fEy1Z2XT")[0];

  // 获取 <html> 元素
  var htmlElement = document.documentElement;

  // 允许滚动
  htmlElement.style.overflow = "auto";

  // 或者，如果你想完全移除 overflow 样式，让浏览器采用默认行为
  // htmlElement.style.overflow = "";

  // 检查是否成功获取到元素
  if (element) {
    // 停止定时器
    //clearInterval(checkElementInterval);
    // 删除元素
    element.remove();
  }
}, 100); // 100 毫秒（即 0.1 秒）之后执行一次检测

// 20 秒后停止定时器
setTimeout(function() {
  clearInterval(checkElementInterval);
  console.log('结束检测弹窗');
}, 10000); // 10000 毫秒（即 10 秒）之后执行关闭检测
