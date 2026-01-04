// ==UserScript==
// @name         移除Bing搜索页顶部标志
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏 Microsoft Bing 搜索页顶部的标志
// @author       You
// @match        *://www.bing.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526230/%E7%A7%BB%E9%99%A4Bing%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%A1%B6%E9%83%A8%E6%A0%87%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/526230/%E7%A7%BB%E9%99%A4Bing%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%A1%B6%E9%83%A8%E6%A0%87%E5%BF%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载
    function removeBingLogo() {
        let logo = document.querySelector('header'); // 选择 Bing 头部区域
        if (logo) {
            logo.style.display = 'none';
        }
    }

    // 观察 DOM 变化，确保动态加载时仍然能隐藏
    let observer = new MutationObserver(removeBingLogo);
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行
    removeBingLogo();
})();