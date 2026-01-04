// ==UserScript==
// @name         隐藏抖音登录弹窗
// @namespace    隐藏抖音登录弹窗
// @version      1.7.4
// @description  隐藏抖音上的登录弹窗、评论登录提示和验证码容器
// @author       LR
// @license      MIT
// @match        https://www.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479000/%E9%9A%90%E8%97%8F%E6%8A%96%E9%9F%B3%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/479000/%E9%9A%90%E8%97%8F%E6%8A%96%E9%9F%B3%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = [
        '[id^="login-full-panel-"]',
        '#related-video-card-login-guide',
        'pace-island[id^="island_"]',
        '[id^="pace-island"]',
        'pace-island[id^=""]',
        '[id^="island_"]',
        '[class*="login-guide"]',
        '[class*="login-prompt"]',
        '#captcha_container' // 添加验证码容器选择器
    ];

    // 在DOM结构加载完成时尽早尝试隐藏弹窗
    document.addEventListener('DOMContentLoaded', function() {
        hideLoginPopup();
        startMutationObserver();
    });

    // 使用 requestAnimationFrame 优化定期检查
    function startChecking() {
        function check() {
            hideLoginPopup();
            requestAnimationFrame(check);
        }
        requestAnimationFrame(check);
    }

    // 隐藏登录弹窗和相关提示的函数
    function hideLoginPopup() {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (isElementVisible(element)) {
                    element.style.display = 'none';
                }
            });
        });
    }

    // 检查元素是否可见
    function isElementVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    // 使用 MutationObserver 观察 DOM 变化
    function startMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    hideLoginPopup();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 页面完全加载后再次隐藏弹窗，确保未被遗漏的弹窗被隐藏
    window.addEventListener('load', function() {
        hideLoginPopup();
    });

    // 提示欢迎消息
    window.addEventListener('load', function() {
        showGreetingsMessage();
    });

    // 弹出消息的函数
    function showGreetingsMessage() {
        const greetingsMessage = document.createElement('div');
        greetingsMessage.textContent = '你好同学! - LR';
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

        setTimeout(() => greetingsMessage.remove(), 3500);
    }

    startChecking(); // 启动定期检查
})();