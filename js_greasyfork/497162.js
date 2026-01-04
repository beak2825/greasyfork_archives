// ==UserScript==
// @name        bots 隐藏左侧边栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically collapse the sidebar on page load
// @match        https://www.coze.com/store/bot/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497162/bots%20%E9%9A%90%E8%97%8F%E5%B7%A6%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/497162/bots%20%E9%9A%90%E8%97%8F%E5%B7%A6%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待侧边栏元素加载
    const observer = new MutationObserver(function(mutations, me) {
        const sidebar = document.querySelector('.nXcwv8nm1GoEIrwhPbSP');
        if (sidebar) {
            // 改变侧边栏的样式
            sidebar.style.width = '0';
            sidebar.style.overflow = 'hidden';
            sidebar.style.padding = '0';
            sidebar.style.transition = 'width 0.3s ease';

            // 停止观察
            me.disconnect();
            return;
        }
    });

    // 开始观察文档
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();