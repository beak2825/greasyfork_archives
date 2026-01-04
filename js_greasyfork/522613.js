// ==UserScript==
// @name         阻止 iocoder 弹窗(终极版2)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  阻止文档网站弹窗并处理相关存储
// @author       You
// @match        https://doc.iocoder.cn/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522613/%E9%98%BB%E6%AD%A2%20iocoder%20%E5%BC%B9%E7%AA%97%28%E7%BB%88%E6%9E%81%E7%89%882%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522613/%E9%98%BB%E6%AD%A2%20iocoder%20%E5%BC%B9%E7%AA%97%28%E7%BB%88%E6%9E%81%E7%89%882%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 阻止路由检查
    function hijackRouter() {
        if (window.history) {
            const originalPushState = window.history.pushState;
            window.history.pushState = function() {
                const result = originalPushState.apply(this, arguments);
                // 阻止路由检查
                return result;
            };
        }
    }

    // 移除弹窗检查函数
    function removePopupCheck() {
        if (window.c) {
            window.c = function() { return true; };
        }
    }

    // 注入 Cookie
    function injectCookie() {
        const cookieId = "88974ed8-6aff-48ab-a7d1-4af5ffea88bb";
        const fakeCookie = "fake.userid";
        document.cookie = `${cookieId}=${fakeCookie}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    }

    // 移除弹窗元素
    function removePopup() {
        const selectors = [
            '.vip-mask',
            '.modal-overlay',
            '[class*="vip"]',
            '[class*="modal"]',
            '[class*="popup"]',
            '[class*="mask"]',
            '.window-box',
            '.jqueryAlert'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        // 处理内容
        const content = document.querySelector('.content-wrapper');
        if (content && content.innerHTML.includes('仅 VIP 可见')) {
            // 标记已处理，避免重复处理
            if (content.getAttribute('data-processed')) {
                return;
            }
            content.setAttribute('data-processed', 'true');
            
            // 直接修改内容可见性
            content.style.display = 'block';
            content.style.visibility = 'visible';
            content.style.opacity = '1';
            
            // 移除 VIP 提示文本
            content.innerHTML = content.innerHTML.replace(/仅\s*VIP\s*可见！?/g, '');
            
            // 尝试恢复原始内容
            const mainContent = document.querySelector('.theme-default-content');
            if (mainContent) {
                mainContent.style.display = 'block';
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';
            }
        }
    }

    // 修改注入样式
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .vip-mask, .modal-overlay, 
            [class*="vip"], [class*="modal"],
            [class*="popup"], [class*="mask"],
            .window-box, .jqueryAlert { 
                display: none !important; 
                opacity: 0 !important;
                visibility: hidden !important;
            }
            body, html { 
                overflow: auto !important;
                position: static !important;
            }
            * {
                pointer-events: auto !important;
            }
            .content-wrapper,
            .theme-default-content {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            .page-nav,
            .page-edit,
            .custom-block {
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 阻止定时器
    function preventTimers() {
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay, ...args) {
            if (typeof callback === 'function' && callback.toString().includes('.content-wrapper')) {
                return;
            }
            return originalSetTimeout(callback, delay, ...args);
        };
    }

    // 修改初始化函数
    function init() {
        hijackRouter();
        removePopupCheck();
        injectCookie();
        injectStyles();
        preventTimers();
        
        // 降低清理频率
        setInterval(removePopup, 1000);
    }

    // 尽早执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                removePopup();
            }
        });
    });

    // 开始观察
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})(); 