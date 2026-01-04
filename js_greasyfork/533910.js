// ==UserScript==
// @name         飞书多维表格开启自动化
// @namespace    http://tampermonkey.net/
// @version     0.0.1
// @description  页面包含“自动化中心”文本后才开始，仅点击未启用的自动化开关，显示飞书风格提示。
// @author       Jason
// @match        https://mah2eds8ab.feishu.cn/base/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533910/%E9%A3%9E%E4%B9%A6%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E5%BC%80%E5%90%AF%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533910/%E9%A3%9E%E4%B9%A6%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E5%BC%80%E5%90%AF%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加提示样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes feishuSlideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes feishuFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .feishu-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 260px;
            max-width: 360px;
            padding: 14px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            font-size: 14px;
            z-index: 999999;
            animation: feishuSlideIn 0.4s ease-out;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .feishu-toast::before {
            content: '';
            display: block;
            width: 20px;
            height: 20px;
            background-size: contain;
        }
        .success {
            background: #2dae36;
            color: white;
        }
        .success::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
        }
        .error {
            background: #f54a45;
            color: white;
        }
        .error::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
        }
    `;
    document.head.appendChild(style);

    function showFeishuToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `feishu-toast ${type}`;
        toast.innerHTML = `<div>${message}</div>`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'feishuFadeOut 0.4s ease-out';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    function startAutomationWatcher() {
        let attemptCount = 0;
        const intervalId = setInterval(() => {
            const inactiveButtons = Array.from(document.querySelectorAll('button.ud__switch.ud__switch-sm'))
                .filter(btn => !btn.classList.contains('ud__switch-checked'));

            if (inactiveButtons.length > 0) {
                inactiveButtons.forEach((btn, index) => {
                    try {
                        btn.click();
                        showFeishuToast(`✅ 成功启用第 ${index + 1} 个自动化`, 'success');
                    } catch (e) {
                        showFeishuToast(`⚠️ 点击失败: ${e.message}`, 'error');
                    }
                });
                attemptCount = 0;
            } else {
                attemptCount++;
                showFeishuToast(`⏳ 第 ${attemptCount} 次检测中`, 'error');
                if (attemptCount >= 2) {
                    clearInterval(intervalId);
                    showFeishuToast('连续 2 次未执行<br>脚本已终止', 'error');
                }
            }
        }, 5000);
    }

    // 页面加载监听：确保出现“自动化中心”再启动逻辑
    const observer = new MutationObserver(() => {
        const autoTitle = document.querySelector('.bitable-automation-flow__container__header__title-text');
        if (autoTitle && autoTitle.textContent.includes('自动化中心')) {
            showFeishuToast('🟢 检测到打开“自动化中心”，自动化任务脚本已加载', 'success');
            startAutomationWatcher();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
