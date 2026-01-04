// ==UserScript==
// @name         哔哩哔哩直播去马赛克
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove live streaming mosaic
// @author       320012762
// @match        *.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497294/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/497294/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

// 在页面加载完成之后
window.onload = function () {
  // 找到并隐藏元素
  var maskPanel = document.getElementById("web-player-module-area-mask-panel");
  if (maskPanel) {
    maskPanel.style.display = "none"; // 使用 CSS 属性 hide the element
  }

  // 设置一个3秒的定时器
  setTimeout(function () {
    // 再次隐藏元素
    maskPanel.style.display = "none";
    // 重新设置定时器
    setTimeout(arguments.callee, 1000); // 递归调用自己，每隔3秒重复一次
  }, 3000); // 3秒后执行
};

})();

