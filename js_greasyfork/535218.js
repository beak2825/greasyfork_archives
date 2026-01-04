// ==UserScript==
// @name         移除B站动态页右侧话题栏
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  移除B站动态页面右侧的话题推荐栏和新版侧边栏
// @author       Kazeharu
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535218/%E7%A7%BB%E9%99%A4B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E5%8F%B3%E4%BE%A7%E8%AF%9D%E9%A2%98%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535218/%E7%A7%BB%E9%99%A4B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E5%8F%B3%E4%BE%A7%E8%AF%9D%E9%A2%98%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        // 移除右侧话题栏
        const rightSidebar = document.querySelector('aside.right');
        if (rightSidebar) {
            rightSidebar.remove();
            console.log('已成功移除右侧话题栏');
        }

        // 仅移除"回到旧版"按钮（第一个按钮）
        const backToOldBtn = document.querySelector('.bili-dyn-sidebar__btn:first-child');
        if (backToOldBtn) {
            backToOldBtn.remove();
            console.log('已移除回到旧版按钮');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeElements);
    } else {
        removeElements();
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('aside.right') || 
            document.querySelector('.bili-dyn-sidebar__btn:first-child')) {
            removeElements();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();