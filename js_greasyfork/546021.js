// ==UserScript==
// @name         Flightradar24 Remove YouTube Ad Panel
// @name:zh-CN   Flightradar24 移除右侧 YouTube 广告面板
// @namespace    https://www.xuxuclassmate.com/
// @author       XuXuClassMate
// @version      1.0
// @description  Automatically remove the YouTube ad panel on the right side of Flightradar24
// @description:zh-CN 自动移除 Flightradar24 右侧的 YouTube 广告视频面板
// @match        https://www.flightradar24.com/*
// @icon         https://cdn.brandfetch.io/id4dL2JtAC/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546021/Flightradar24%20Remove%20YouTube%20Ad%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/546021/Flightradar24%20Remove%20YouTube%20Ad%20Panel.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /**
     * 移除 Flightradar24 右侧广告面板
     * Remove the right-side advertisement panel on Flightradar24
     */
    function removeSidebar() {
        const sidebar = document.querySelector('aside[data-testid="sidebar__container"]');
        if (sidebar) {
            sidebar.remove();
            console.log('✅ Flightradar24 右侧广告面板已移除 / Ad panel removed');
        }
    }

    // 页面加载完成后执行一次
    // Run once after the page is fully loaded
    window.addEventListener('load', () => {
        removeSidebar();

        // 监听 DOM 变化，防止广告面板重新插入
        // Observe DOM changes to prevent the ad panel from reappearing
        const observer = new MutationObserver(removeSidebar);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
