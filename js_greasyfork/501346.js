// ==UserScript==
// @name         Bilibili adblocker
// @namespace    http://tampermonkey.net/
// @version      2024-07-21
// @description  屏蔽“检测到您的页面展示可能受到浏览器插件影响，建议您将当前页面加入插件白名单，以保障您的浏览体验～”部分
// @author       vhxb
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501346/Bilibili%20adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/501346/Bilibili%20adblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAdblockTips() {
        var adblockTips = document.querySelector('.adblock-tips');
        if (adblockTips) {
            adblockTips.style.display = 'none';
        }
    }

    // 初始调用隐藏函数
    hideAdblockTips();

    // 使用 MutationObserver 监听 DOM 变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0 || mutation.type === 'attributes') {
                hideAdblockTips();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
})();
