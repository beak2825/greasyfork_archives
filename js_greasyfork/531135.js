// ==UserScript==
// @name         隐藏抖音登录弹窗-SYL
// @namespace    隐藏抖音登录弹窗-SYL
// @version      1.2.1
// @description  隐藏抖音上的登录弹窗、评论登录提示和验证码容器（彻底移除视频卡片登录提示及打开评论后评论显示异常）
// @author       SYL
// @license      MIT
// @match        https://www.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531135/%E9%9A%90%E8%97%8F%E6%8A%96%E9%9F%B3%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97-SYL.user.js
// @updateURL https://update.greasyfork.org/scripts/531135/%E9%9A%90%E8%97%8F%E6%8A%96%E9%9F%B3%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97-SYL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要彻底移除的元素选择器
    const removeSelectors = [
        '#related-video-card-login-guide'
    ];

    // 需要隐藏的元素选择器
    const hideSelectors = [
        '[id^="login-full-panel-"]',
        'pace-island[id^="island_"]',
        '[id^="pace-island"]',
        'pace-island[id^=""]',
        '[id^="island_"]',
        '[class*="login-guide"]',
        '[class*="login-prompt"]',
        '#captcha_container'
    ];

    // 需要移除的类名及其作用范围
    const classesToRemove = [
        { className: 'vf0ddEkg', selector: '#videoSideCard .vf0ddEkg' }//, // 特定于videoSideCard内部
        //{ className: 'vf0ddEkg', selector: '.vf0ddEkg' } // 全局移除
    ];

    // 在DOM结构加载完成时尽早尝试处理元素
    document.addEventListener('DOMContentLoaded', function() {
        handleElements();
        startMutationObserver();
    });

    function startChecking() {
        function check() {
            handleElements();
            requestAnimationFrame(check);
        }
        requestAnimationFrame(check);
    }

    function handleElements() {
        // 彻底移除元素
        removeSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (isElementVisible(element)) element.remove();
            });
        });

        // 隐藏其他元素
        hideSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (isElementVisible(element)) element.style.display = 'none';
            });
        });

        // 移除指定类名（精确作用域）
        classesToRemove.forEach(({ className, selector }) => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.remove(className);
                // 修复可能存在的重复类名问题
                const cleanedClass = element.className
                    .replace(/\s+/g, ' ')
                    .replace(new RegExp(`\\b${className}\\b`, 'g'), '')
                    .trim();
                element.className = cleanedClass;
            });
        });
    }

    function isElementVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    function startMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    handleElements();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', function() {
        handleElements();
        showGreetingsMessage();
    });

    function showGreetingsMessage() {
        const greetingsMessage = document.createElement('div');
        greetingsMessage.textContent = '你好同学! - SYL';
        Object.assign(greetingsMessage.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
            color: '#fff',
            zIndex: '9999',
        });
        document.body.appendChild(greetingsMessage);
        setTimeout(() => greetingsMessage.remove(), 4000);
    }

    startChecking();
})();