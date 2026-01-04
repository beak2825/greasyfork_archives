// ==UserScript==
// @name        【知轩藏书】优化
// @namespace   Violentmonkey Scripts
// @match       https://www.zxcs.info/*
// @grant       none
// @version     1.0.4
// @author      Liao Brant
// @description 2025/1/4 18:11:03
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/522799/%E3%80%90%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6%E3%80%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522799/%E3%80%90%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6%E3%80%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
 
function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
 
  const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
 
  return mobileRegex.test(userAgent);
}
 
// 添加自定义样式
function addStyle(styleStr) {
  const styleSheet = document.createElement("style");
  document.head.appendChild(styleSheet);
  styleSheet.textContent = styleStr;
}
 
// 初始化
function init() {
  addStyle(`
    body {
      user-select: unset;
    }
`);
}
 
(function () {
  "use strict";
  window.onload = init();
})();