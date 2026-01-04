// ==UserScript==
// @name         隐藏 网易buff中 的价格
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏 f_Strong 元素
// @author       moon
// @match        https://buff.163.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537538/%E9%9A%90%E8%97%8F%20%E7%BD%91%E6%98%93buff%E4%B8%AD%20%E7%9A%84%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/537538/%E9%9A%90%E8%97%8F%20%E7%BD%91%E6%98%93buff%E4%B8%AD%20%E7%9A%84%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏所有 class 为 f_Strong 的元素
    function hideFStrongElements() {
        const elements = document.getElementsByClassName('f_Strong');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }

    // 初始执行
    hideFStrongElements();

    // 监听 DOM 变化，防止动态加载的内容
    const observer = new MutationObserver(hideFStrongElements);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();