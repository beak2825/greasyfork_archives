// ==UserScript==
// @name         Steam Trade Acknowledge Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Steam同意撤回协议
// @author       You
// @match        https://steamcommunity.com/profiles/*/inventory*
// @match        https://steamcommunity.com/id/*/inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543084/Steam%20Trade%20Acknowledge%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/543084/Steam%20Trade%20Acknowledge%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮样式
    const buttonStyle = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        font-family: Arial, sans-serif;
    `;

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '确认交易';
    button.style.cssText = buttonStyle;

    // 添加悬停效果
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    });

    // 获取当前页面的 sessionID
    function getCurrentSessionID() {
        // 尝试从全局变量获取
        if (typeof g_sessionID !== 'undefined' && g_sessionID) {
            return g_sessionID;
        }
        
        // 尝试从 window 对象获取
        if (window.g_sessionID) {
            return window.g_sessionID;
        }
        
        // 尝试从 unsafeWindow 获取（油猴脚本环境）
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.g_sessionID) {
            return unsafeWindow.g_sessionID;
        }
        
        // 如果都获取不到，返回 null
        return null;
    }

    // 点击事件处理
    button.addEventListener('click', function() {
        // 获取当前的 sessionID
        const sessionID = getCurrentSessionID();
        
        if (!sessionID) {
            showNotification('无法获取 sessionID，请确保在 Steam 页面上操作', 'error');
            return;
        }
        
        console.log('当前 sessionID:', sessionID);
        
        // 禁用按钮防止重复点击
        this.disabled = true;
        this.textContent = '提交中...';
        this.style.background = '#ccc';

        // 执行请求
        fetch('https://steamcommunity.com//trade/new/acknowledge', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://steamcommunity.com',
                'Pragma': 'no-cache',
                'Referer': window.location.href,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            },
            body: `sessionid=${sessionID}&message=1`, // 使用动态获取的 sessionID
            credentials: 'include' // 包含cookies
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('网络请求失败');
        })
        .then(data => {
            console.log('请求成功:', data);

            // 显示结果
            if (data.success) {
                this.textContent = '✓ 成功';
                this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

                // 显示成功通知
                showNotification('交易确认成功！', 'success');
            } else {
                this.textContent = '✗ 失败';
                this.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';

                // 显示失败通知
                showNotification('交易确认失败：' + (data.message || '未知错误'), 'error');
            }

            // 3秒后恢复按钮
            setTimeout(() => {
                this.disabled = false;
                this.textContent = '确认交易';
                this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 3000);
        })
        .catch(error => {
            console.error('请求失败:', error);
            this.textContent = '✗ 错误';
            this.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';

            // 显示错误通知
            showNotification('请求失败：' + error.message, 'error');

            // 3秒后恢复按钮
            setTimeout(() => {
                this.disabled = false;
                this.textContent = '确认交易';
                this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 3000);
        });
    });

    // 通知函数
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            font-family: Arial, sans-serif;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background: #4CAF50;' : 'background: #f44336;'}
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 3秒后自动移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 将按钮添加到页面
    document.body.appendChild(button);

    console.log('Steam交易确认按钮已加载');
    
    // 显示当前检测到的 sessionID（用于调试）
    const currentSessionID = getCurrentSessionID();
    if (currentSessionID) {
        console.log('检测到 sessionID:', currentSessionID);
    } else {
        console.warn('未检测到 sessionID，请确保在正确的 Steam 页面上');
    }
})();