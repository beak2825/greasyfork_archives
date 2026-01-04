// ==UserScript==
// @name         115去除全屏滚动条
// @namespace    http://ihead.info/
// @version      0.1
// @description  去除滚动条
// @author       @ihead
// @match        https://v.anxia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430838/115%E5%8E%BB%E9%99%A4%E5%85%A8%E5%B1%8F%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/430838/115%E5%8E%BB%E9%99%A4%E5%85%A8%E5%B1%8F%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==
var styleEl = document.createElement('style');
styleEl.type = 'text/css';
styleEl.innerHTML = '::-webkit-scrollbar {display: none; /* Chrome Safari */}';
document.documentElement.appendChild(styleEl);