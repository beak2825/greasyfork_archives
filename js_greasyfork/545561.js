// ==UserScript==
// @name         去除hanime1的点击跳转广告
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  删除hanime1中点击就跳转的广告
// @author       MLFK
// @include      *://hanime*.*/*
// @include      *://www.hanime*.*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545561/%E5%8E%BB%E9%99%A4hanime1%E7%9A%84%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/545561/%E5%8E%BB%E9%99%A4hanime1%E7%9A%84%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 阻止页面跳转的核心函数
    function blockNavigation(event) {
        // 阻止所有新窗口打开
        if (event.target.tagName === 'A' && event.target.target === '_blank') {
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
        }

        // 阻止可能引起跳转的元素
        const forbiddenTags = ['A', 'AREA', 'LINK'];
        if (forbiddenTags.includes(event.target.tagName)) {
            const href = event.target.href || '';
            // 允许内部链接，阻止外部广告链接
            if (href && !href.includes(window.location.hostname)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                return false;
            }
        }

        return true;
    }

    // 移除点击劫持层
    function removeClickjackingOverlay() {
        // 常见劫持层选择器
        const overlaySelectors = [
            'div[data-cl-overlay]',
            'div[onclick*="window.open"]',
            'div[style*="z-index: 9999"]',
            'div[style*="position: fixed"]',
            'div[style*="position: absolute"][style*="inset: 0"]'
        ];

        let removed = false;
        overlaySelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
                removed = true;
            });
        });

        return removed;
    }

    // 禁用可疑的JavaScript跳转
    function disableNavigationMethods() {
        // 重写打开新窗口的方法
        const originalOpen = window.open;
        window.open = function() {
            console.warn('[Hanime1 Anti-Clickjacking] window.open blocked');
            return null;
        };

        // 重写location跳转方法
        const originalAssign = window.location.assign;
        window.location.assign = function(url) {
            if (!url.includes(window.location.hostname)) {
                console.warn('[Hanime1 Anti-Clickjacking] Navigation blocked:', url);
                return;
            }
            return originalAssign.apply(this, arguments);
        };

        // 阻止通过meta标签跳转
        document.addEventListener('beforescriptexecute', function(event) {
            const script = event.target;
            if (script.textContent.includes('window.location') ||
                script.textContent.includes('window.open')) {
                event.preventDefault();
                script.remove();
            }
        });
    }

    // 主保护函数
    function activateProtection() {
        // 1. 尽早禁用导航方法
        disableNavigationMethods();

        // 2. 监听点击事件
        document.addEventListener('click', blockNavigation, {
            capture: true, // 使用捕获阶段确保最先处理
            passive: false
        });

        // 3. 移除点击劫持层
        const observer = new MutationObserver(() => {
            removeClickjackingOverlay();
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // 4. 持续监控劫持层
        setInterval(removeClickjackingOverlay, 1000);
    }

    // 在DOM加载前启动保护
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', activateProtection);
    } else {
        activateProtection();
    }

    // 防止iframe劫持
    if (window.top !== window.self) {
        window.stop();
        document.body.innerHTML = '';
    }
})();