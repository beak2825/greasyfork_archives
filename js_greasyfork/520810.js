// ==UserScript==
// @name               Change code style
// @name:zh-CN         改变代码块样式
// @name:zh-TW         改變代碼塊樣式
// @namespace          ling921
// @version            0.2.0
// @description        Script to change code style for web pages specified in the match section
// @description:zh-CN  脚本用于改变匹配部分网页中的代码块样式
// @description:zh-TW  腳本用於改變匹配部分網頁中的代碼塊樣式
// @author             ling921
// @match              https://devblogs.microsoft.com/*
// @icon               http://microsoft.com/favicon.ico
// @grant              none
// @run-at             document-start
// @tag                utilities
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/520810/Change%20code%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/520810/Change%20code%20style.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
        code {
            font-family: 'Cascadia Code', 'Cascadia Mono', Consolas, 'Courier New', monospace !important;
        }
    `;
  document.head.appendChild(style);
})();
