// ==UserScript==
// @name         通义千问去除对话框
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  去除 通义千问的对话框 ，从而避免了页面被遮挡
// @author       古咩.
// @match        *://tongyi.aliyun.com/*
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/485065/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E5%8E%BB%E9%99%A4%E5%AF%B9%E8%AF%9D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/485065/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E5%8E%BB%E9%99%A4%E5%AF%B9%E8%AF%9D%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面上的对话栏元素
    const dialogBar = document.querySelector('.side--L0W1WdHl');
    
    // 如果找到该元素，则隐藏它
    if (dialogBar) {
        dialogBar.style.display = 'none';
    }
})();