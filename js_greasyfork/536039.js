// ==UserScript==
// @name         Discord Token Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  一键提取并复制Discord Token到剪贴板
// @author       cwser
// @match        https://discord.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/536039/Discord%20Token%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/536039/Discord%20Token%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动按钮
    function createButton() {
        const button = document.createElement('button');
        button.id = 'discord-token-extractor';
        button.textContent = '📌 获取Discord Token';
        button.style.cssText = `
            position: fixed;
            bottom: 74px;
            right: 20px;
            z-index: 9999;
            background-color: #5865F2;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 按钮悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 15px rgba(88, 101, 242, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        });

        // 添加按钮到页面
        document.body.appendChild(button);
        return button;
    }

    // 创建通知元素
    function createNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 9999;
            background-color: #2C2F33;
            color: white;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 显示通知
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // 自动隐藏通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(10px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        return notification;
    }

    // 提取并复制Token
    function extractAndCopyToken() {
        const notification = createNotification('正在查找Token...');

        // 尝试从localStorage提取
        try {
            const token = JSON.parse(localStorage.getItem('token')).replace(/"/g, '');
            if (token) {
                GM_setClipboard(token);
                notification.textContent = '✅ Token已复制到剪贴板！';
                console.log('[Discord Token Extractor] 已成功提取并复制Token:', token);
                return;
            }
        } catch (e) {
            console.log('[Discord Token Extractor] 无法从localStorage提取Token:', e);
        }

        // 如果localStorage方法失败，尝试从网络请求提取
        try {
            // 创建一个临时的XHR拦截器
            const originalXhr = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
                const xhr = new originalXhr();
                xhr.addEventListener('readystatechange', function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const authHeader = xhr.getResponseHeader('Authorization');
                        if (authHeader) {
                            GM_setClipboard(authHeader);
                            notification.textContent = '✅ Token已复制到剪贴板！';
                            console.log('[Discord Token Extractor] 已成功从XHR请求提取并复制Token:', authHeader);
                            // 恢复原始XHR
                            window.XMLHttpRequest = originalXhr;
                        }
                    }
                });
                return xhr;
            };

            // 触发一个无害的请求来尝试获取Token
            fetch('https://discord.com/api/v9/users/@me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            }).catch(() => {}); // 忽略错误，只关心是否能获取到Token

            notification.textContent = '🔍 正在监听网络请求，请稍候...';
            notification.textContent = '⚠️ 未能自动提取Token，请确保已登录或尝试刷新页面';

        } catch (e) {
            console.error('[Discord Token Extractor] 提取Token时出错:', e);
            notification.textContent = '❌ 提取Token失败，请手动检查控制台';
        }
    }

    // 初始化
    window.addEventListener('load', function() {
        const button = createButton();
        button.addEventListener('click', extractAndCopyToken);
    });
})();