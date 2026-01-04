// ==UserScript==
// @name         DeepSeek自动重试
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  检测到"服务器繁忙"时自动点击重试按钮
// @author       dy
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/526067/DeepSeek%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/526067/DeepSeek%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        BUSY_TEXT: '服务器繁忙，请稍后再试。',
        RATE_LIMIT_TEXT: '你发送消息的频率过快，请稍后再发',
        CHECK_INTERVAL: 1000,
        MAX_RETRIES: 10,
        MIN_DELAY: 1500,
        MAX_DELAY: 3000,
        DEBOUNCE_DELAY: 5000  // 防抖延迟时间
    };

    // 状态管理
    const state = {
        retryCount: 0,
        isRetrying: false,
        isPaused: false,
        activeNotification: null,
        debounceTimer: null,
        lastRetryTime: 0,
        observer: null
    };

    // 创建提示元素
    function createNotification(message, temporary = true) {
        if (state.activeNotification && !temporary) {
            return state.activeNotification;
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            transition: opacity 0.3s;
        `;
        
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
                state.retryCount = 0;
                state.isPaused = false;
            };
            notification.appendChild(closeButton);
        }

        notification.textContent = message;
        document.body.appendChild(notification);
        
        if (!temporary) {
            state.activeNotification = notification;
        }
        
        return notification;
    }

    // 查找重试按钮
    function findRetryButton(container) {
        if (!container) return null;

        const btns = Array.from(container.querySelectorAll('.ds-icon-button'));
        return btns.find(btn => {
            const svg = btn.querySelector('svg');
            return svg && svg.querySelector('#重新生成');
        });
    }

    // 创建 MutationObserver 来监控页面变化
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

        // 监控整个聊天区域
        const chatArea = document.querySelector('.f72b0bab');
        if (chatArea) {
            state.observer.observe(chatArea, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    // 检查服务器繁忙
    function checkBusyStatus() {
        // 检查频率限制
        const rateLimitElements = document.querySelectorAll('.ds-toast__content');
        for (const el of rateLimitElements) {
            if (el.textContent && el.textContent.includes(CONFIG.RATE_LIMIT_TEXT)) {
                state.isPaused = true;
                createNotification('检测到频率过快，稍等一会吧', false);
                return null;
            }
        }

        // 查找所有 f9bf7997 类的元素
        const elements = document.querySelectorAll('.f9bf7997');
        
        for (const el of elements) {
            // 在每个元素中查找服务器繁忙消息
            const busyMessage = el.querySelector('.ds-markdown.ds-markdown--block p');
            if (busyMessage && busyMessage.textContent.trim() === CONFIG.BUSY_TEXT) {
                // 如果找到服务器繁忙消息，返回包含该消息的元素
                return el;
            }
        }
        
        return null; // 如果没有找到服务器繁忙消息，返回 null
    }

    // 自动重试主函数
    function autoRetry() {
        if (state.isPaused) return;

        const busyContainer = checkBusyStatus();
        if (busyContainer) {
            const now = Date.now();
            if (!state.isRetrying && (now - state.lastRetryTime) >= CONFIG.DEBOUNCE_DELAY) {
                state.retryCount++;
                state.isRetrying = true;
                state.lastRetryTime = now;

                const retryButton = findRetryButton(busyContainer);
                
                if (retryButton) {
                    if (state.retryCount >= CONFIG.MAX_RETRIES) {
                        createNotification('已达到最大重试次数，DeepSeek可能当前算力不足', false);
                        return;
                    }

                    const notification = createNotification(`检测到服务器繁忙，即将自动重试(${state.retryCount}/${CONFIG.MAX_RETRIES})...`);
                    
                    // 随机延迟
                    const delay = Math.floor(Math.random() * (CONFIG.MAX_DELAY - CONFIG.MIN_DELAY + 1)) + CONFIG.MIN_DELAY;
                    
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
                    }, delay);
                } else {
                    console.log('在服务器繁忙消息所在元素中未找到重试按钮');
                    state.isRetrying = false;
                }
            }
        } else {
            state.isRetrying = false;
        }
    }

    // 初始化
    function init() {
        // 设置 MutationObserver
        setupObserver();
        
        // 页面加载完成后检查一次
        autoRetry();
        
        // 定期检查作为备份机制
        setInterval(autoRetry, CONFIG.CHECK_INTERVAL);
        
        // 监听页面变化重新设置 observer
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

    // 启动脚本
    init();
})();
