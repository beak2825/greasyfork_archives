// ==UserScript==
// @name         屏蔽萌娘百科移动端APP打开提示
// @namespace    https://greasyfork.org/
// @version      1.1.1
// @description  屏蔽萌娘百科移动端APP打开提示，直接删除###moe-open-in-app元素
// @author       迪普希克
// @license      MIT
// @match        *://moegirl.*.*/*
// @match        *://moegirl.*/*
// @match        *://*.moegirl.*.*/*
// @match        *://*.moegirl.*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533966/%E5%B1%8F%E8%94%BD%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E7%A7%BB%E5%8A%A8%E7%AB%AFAPP%E6%89%93%E5%BC%80%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/533966/%E5%B1%8F%E8%94%BD%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E7%A7%BB%E5%8A%A8%E7%AB%AFAPP%E6%89%93%E5%BC%80%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_ID = 'moe-open-in-app';
    const CHECK_INTERVAL = 10000; // 10秒

    function nuclearOption() {
        const target = document.getElementById(TARGET_ID);
        if (target) {
            // 彻底删除元素而非隐藏
            target.parentNode.removeChild(target);
            console.log('检测到弹窗元素，已永久移除');
        }
    }

    // 增强型监控系统
    function initObserver() {
        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!mutation.addedNodes) return;
                nuclearOption(); // 发现任何DOM变化立即检查
            });
        }).observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    // 立即执行 + 定时器双重保障
    window.addEventListener('DOMContentLoaded', () => {
        // 首次核打击
        nuclearOption();
        
        // 定时复查
        const safetyCheck = setInterval(nuclearOption, CHECK_INTERVAL);
        
        // 页面卸载时清理定时器
        window.addEventListener('unload', () => {
            clearInterval(safetyCheck);
        });

        // 启动DOM监视
        initObserver();
    });

    // 针对SPA的额外防护
    if (window.history && window.history.pushState) {
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            nuclearOption();
        };

        window.addEventListener('popstate', nuclearOption);
    }
})();