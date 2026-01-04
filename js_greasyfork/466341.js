// ==UserScript==
// @name         隐藏今日头条的置顶新闻
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide sticky-cell class elements on Toutiao
// @author       You
// @match        https://www.toutiao.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466341/%E9%9A%90%E8%97%8F%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E7%9A%84%E7%BD%AE%E9%A1%B6%E6%96%B0%E9%97%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/466341/%E9%9A%90%E8%97%8F%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E7%9A%84%E7%BD%AE%E9%A1%B6%E6%96%B0%E9%97%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.sticky-cell { display: none !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);
})();
