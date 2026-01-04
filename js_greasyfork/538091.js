// ==UserScript==
// @name         Twitter send to Telegram
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为每个Twitter推文添加推送到Telegram机器人的按钮
// @author       zy668
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538091/Twitter%20send%20to%20Telegram.user.js
// @updateURL https://update.greasyfork.org/scripts/538091/Twitter%20send%20to%20Telegram.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置区域 - 请在这里设置你的Telegram Bot信息
    let TELEGRAM_BOT_TOKEN = GM_getValue('telegram_bot_token', '');
    let TELEGRAM_CHAT_ID = GM_getValue('telegram_chat_id', '');

    // 如果未设置Bot信息，提示用户设置
    function checkBotConfig() {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            const token = prompt('请输入Telegram Bot Token:');
            const chatId = prompt('请输入Telegram Chat ID:');

            if (token && chatId) {
                TELEGRAM_BOT_TOKEN = token;
                TELEGRAM_CHAT_ID = chatId;
                GM_setValue('telegram_bot_token', token);
                GM_setValue('telegram_chat_id', chatId);
            } else {
                alert('需要设置Bot Token和Chat ID才能使用推送功能');
                return false;
            }
        }
        return true;
    }

    // 发送消息到Telegram
    function sendToTelegram(message) {
        if (!checkBotConfig()) return;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            }),
            onload: function(response) {
                if (response.status === 200) {
                    console.log('推送成功');
                    // 可以添加成功提示
                    showNotification('推送成功！', 'success');
                } else {
                    console.error('推送失败:', response.responseText);
                    showNotification('推送失败，请检查配置', 'error');
                }
            },
            onerror: function(error) {
                console.error('网络错误:', error);
                showNotification('网络错误', 'error');
            }
        });
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 获取推文链接
    function getTweetUrl(tweetElement) {
        // 查找时间链接元素
        const timeLink = tweetElement.querySelector('time')?.closest('a');
        if (timeLink && timeLink.href) {
            return timeLink.href;
        }

        // 备用方法：查找包含状态链接的a标签
        const statusLinks = tweetElement.querySelectorAll('a[href*="/status/"]');
        if (statusLinks.length > 0) {
            return statusLinks[0].href;
        }

        return null;
    }



    // 创建推送按钮
    function createPushButton(tweetElement) {
        const button = document.createElement('button');
        button.innerHTML = '📤';
        button.title = '推送到Telegram';
        button.style.cssText = `
            background: #1DA1F2;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            margin-left: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;

        button.onmouseover = () => {
            button.style.background = '#0d8bd9';
            button.style.transform = 'scale(1.1)';
        };

        button.onmouseout = () => {
            button.style.background = '#1DA1F2';
            button.style.transform = 'scale(1)';
        };

        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const tweetUrl = getTweetUrl(tweetElement);

            if (tweetUrl) {
                sendToTelegram(tweetUrl);
            } else {
                showNotification('无法获取推文链接', 'error');
            }
        };

        return button;
    }

    // 为推文添加推送按钮
    function addPushButtonToTweet(tweetElement) {
        // 避免重复添加
        if (tweetElement.querySelector('.telegram-push-button')) {
            return;
        }

        // 查找推文的操作按钮区域
        const actionBar = tweetElement.querySelector('[role="group"]');
        if (actionBar) {
            const pushButton = createPushButton(tweetElement);
            pushButton.classList.add('telegram-push-button');
            actionBar.appendChild(pushButton);
        }
    }

    // 处理新的推文元素
    function processTweets() {
        const tweets = document.querySelectorAll('[data-testid="tweet"]:not(.processed)');
        tweets.forEach(tweet => {
            addPushButtonToTweet(tweet);
            tweet.classList.add('processed');
        });
    }

    // 监听DOM变化
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches('[data-testid="tweet"]') ||
                            node.querySelector('[data-testid="tweet"]')) {
                            shouldProcess = true;
                        }
                    }
                });
            });

            if (shouldProcess) {
                setTimeout(processTweets, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 添加设置按钮到页面
    function addSettingsButton() {
        const settingsButton = document.createElement('button');
        settingsButton.innerHTML = '⚙️ Telegram设置';
        settingsButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1DA1F2;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 9999;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        settingsButton.onclick = () => {
            const newToken = prompt('输入新的Telegram Bot Token:', TELEGRAM_BOT_TOKEN);
            const newChatId = prompt('输入新的Telegram Chat ID:', TELEGRAM_CHAT_ID);

            if (newToken && newChatId) {
                TELEGRAM_BOT_TOKEN = newToken;
                TELEGRAM_CHAT_ID = newChatId;
                GM_setValue('telegram_bot_token', newToken);
                GM_setValue('telegram_chat_id', newChatId);
                showNotification('设置已保存', 'success');
            }
        };

        document.body.appendChild(settingsButton);
    }

    // 初始化
    function init() {
        // 等待页面加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 处理现有推文
        setTimeout(processTweets, 1000);

        // 开始监听DOM变化
        observeDOMChanges();

        // 添加设置按钮
        setTimeout(addSettingsButton, 2000);

        console.log('Twitter推送到Telegram脚本已启动');
    }

    // 启动脚本
    init();

})();