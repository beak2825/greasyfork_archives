// ==UserScript==
// @name         DeepSeek自动无限重试
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  无限版自动重试一直到成功为止
// @author       Bigface_cat
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      Copyright Bigface_cat
// @downloadURL https://update.greasyfork.org/scripts/526185/DeepSeek%E8%87%AA%E5%8A%A8%E6%97%A0%E9%99%90%E9%87%8D%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/526185/DeepSeek%E8%87%AA%E5%8A%A8%E6%97%A0%E9%99%90%E9%87%8D%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        BUSY_TEXT: '服务器繁忙，请稍后再试。',
        RATE_LIMIT_TEXT: '你发送消息的频率过快，请稍后再发',
        CHECK_INTERVAL: 1000,
        RETRY_DELAY: 60000,  // 固定1分钟重试
        DEBOUNCE_DELAY: 5000
    };

    const state = {
        isRetrying: false,
        isPaused: false,
        activeNotification: null,
        debounceTimer: null,
        lastRetryTime: 0,
        observer: null
    };

    function createNotification(message, temporary = true, countdown = 0) {
        if (state.activeNotification && !temporary) {
            return state.activeNotification;
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            transition: opacity 0.3s;
        `;
        
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        notification.appendChild(messageSpan);

        if (countdown > 0) {
            const countdownSpan = document.createElement('span');
            countdownSpan.style.marginLeft = '10px';
            notification.appendChild(countdownSpan);

            let remainingSeconds = countdown;
            const updateCountdown = () => {
                const minutes = Math.floor(remainingSeconds / 60);
                const seconds = remainingSeconds % 60;
                countdownSpan.textContent = `(${minutes}:${seconds.toString().padStart(2, '0')})`;
                if (remainingSeconds > 0) {
                    remainingSeconds--;
                    setTimeout(updateCountdown, 1000);
                }
            };
            updateCountdown();
        }

        if (!temporary) {
            const closeButton = document.createElement('span');
            closeButton.innerHTML = '&times;';
            closeButton.style.cssText = `
                margin-left: 10px;
                cursor: pointer;
                font-weight: bold;
            `;
            closeButton.onclick = () => {
                notification.remove();
                state.activeNotification = null;
                state.isPaused = false;
            };
            notification.appendChild(closeButton);
        }

        document.body.appendChild(notification);
        
        if (!temporary) {
            state.activeNotification = notification;
        }
        
        return notification;
    }

    function findRetryButton() {
        let parent = document.activeElement;
        while (parent && !parent.querySelector('.ds-icon-button')) {
            parent = parent.parentElement;
        }

        if (!parent) {
            const chatArea = document.querySelector('.f6004764');
            if (chatArea) {
                parent = chatArea;
            }
        }

        if (!parent) return null;

        const btns = Array.from(parent.querySelectorAll('.ds-icon-button'));
        const retryBtns = btns.filter(btn => {
            const svg = btn.querySelector('svg');
            return svg && svg.querySelector('#重新生成');
        });
        
        return retryBtns[retryBtns.length - 1];
    }

    function setupObserver() {
        if (state.observer) {
            state.observer.disconnect();
        }

        state.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    autoRetry();
                }
            }
        });

        const chatArea = document.querySelector('.f72b0bab');
        if (chatArea) {
            state.observer.observe(chatArea, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    function checkBusyStatus() {
        const rateLimitElements = document.querySelectorAll('.ds-toast__content');
        for (const el of rateLimitElements) {
            if (el.textContent && el.textContent.includes(CONFIG.RATE_LIMIT_TEXT)) {
                if (state.isRetrying) {
                    clearTimeout(state.debounceTimer);
                    state.isRetrying = false;
                }
                
                state.isPaused = true;
                createNotification('检测到频率过快，将在1.5分钟后继续尝试', false, 90);
                
                setTimeout(() => {
                    if (state.activeNotification) {
                        state.activeNotification.remove();
                        state.activeNotification = null;
                    }
                    state.isPaused = false;
                    autoRetry();
                }, 90000);
                
                return true;
            }
        }

        const chatArea = document.querySelector('.f6004764');
        if (!chatArea) return false;

        const busyMessages = chatArea.querySelectorAll('.ds-markdown.ds-markdown--block p');
        
        const retryButton = findRetryButton();
        if (!retryButton) return false;
        
        const messageBlock = retryButton.closest('.f9bf7997');
        const busyText = messageBlock?.querySelector('.ds-markdown.ds-markdown--block p');
        
        return busyText?.textContent.trim() === CONFIG.BUSY_TEXT;
    }

    function autoRetry() {
        if (state.isPaused) {
            console.log('系统当前处于暂停状态，跳过重试检查');
            return;
        }

        if (!checkBusyStatus() && state.activeNotification) {
            state.activeNotification.remove();
            state.activeNotification = null;
            state.isPaused = false;
            return;
        }

        if (checkBusyStatus()) {
            const now = Date.now();
            if (!state.isRetrying && (now - state.lastRetryTime) >= CONFIG.DEBOUNCE_DELAY) {
                state.isRetrying = true;
                state.lastRetryTime = now;

                const retryButton = findRetryButton();
                
                if (retryButton) {
                    const notification = createNotification(
                        '检测到服务器繁忙，即将自动重试...',
                        true,
                        60
                    );
                    
                    clearTimeout(state.debounceTimer);
                    state.debounceTimer = setTimeout(() => {
                        console.log('找到重试按钮,自动点击');
                        retryButton.dispatchEvent(new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        }));
                        
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 300);
                        state.isRetrying = false;
                    }, CONFIG.RETRY_DELAY);
                }
            }
        } else {
            state.isRetrying = false;
        }
    }

    function init() {
        setupObserver();
        
        autoRetry();
        
        setInterval(autoRetry, CONFIG.CHECK_INTERVAL);
        
        const bodyObserver = new MutationObserver(() => {
            if (!document.querySelector('.f72b0bab')) {
                setupObserver();
            }
        });
        
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    init();
})(); 