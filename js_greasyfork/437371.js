// ==UserScript==
// @name         隐藏 GitHub 账单警告
// @namespace    dongdong
// @version      0.1
// @description  对于 GitHub 欠费账户，隐藏始终显示在头部的账单警告。
// @author       dongdong
// @match        https://*github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437371/%E9%9A%90%E8%97%8F%20GitHub%20%E8%B4%A6%E5%8D%95%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/437371/%E9%9A%90%E8%97%8F%20GitHub%20%E8%B4%A6%E5%8D%95%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = '.flash-full { display: none; }';
    document.head.appendChild(style);
})();