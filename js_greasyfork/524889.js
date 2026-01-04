// ==UserScript==
// @name         修复贴吧网址
// @namespace    https://github.com/CandyTea
// @license      GPLv3
// @version      1.0
// @description  jump2.bdimg替换为tieba.baidu
// @author       me
// @match        https://jump2.bdimg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524889/%E4%BF%AE%E5%A4%8D%E8%B4%B4%E5%90%A7%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/524889/%E4%BF%AE%E5%A4%8D%E8%B4%B4%E5%90%A7%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    let currentUrl = window.location.href;

    // 替换'jump2.bdimg'为'tieba.baidu'
    let newUrl = currentUrl.replace('jump2.bdimg', 'tieba.baidu');

    // 跳转到新的URL
    window.location.href = newUrl;
})();
