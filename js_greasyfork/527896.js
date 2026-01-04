// ==UserScript==
// @name         QQ拦截跳转
// @namespace    https://github.com/YourGithub
// @version      2.4
// @license      MIT
// @description  自动解析腾讯安全页面的真实链接并跳转（含可视化提示）
// @author       GyCz
// @match        https://c.pc.qq.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527896/QQ%E6%8B%A6%E6%88%AA%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527896/QQ%E6%8B%A6%E6%88%AA%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // iOS风格模糊弹窗
    const showiOSToast = (message, type) => {
        const colors = {
            success: '#30D158',
            warning: '#FF9F0A',
            error: '#FF453A',
            info: '#0A84FF'
        };

        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="
                backdrop-filter: blur(20px);
                background: rgba(255,255,255,0.7);
                border-radius: 14px;
                padding: 12px 24px;
                border: 1px solid rgba(0,0,0,0.1);
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                color: ${colors[type]};
                font: 500 17px/-apple-system, 'SF Pro Text', sans-serif;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <span style="
                    font-size: 21px;
                    margin-top: -2px;
                ">${getIcon(type)}</span>
                ${message}
            </div>
        `;

        toast.style = `
            position: fixed;
            top: 25px;
            right: 20px;
            z-index: 99999;
            animation: toastEntry 0.5s ease, toastExit 0.5s ease 2s forwards;
        `;

        // 动态样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes toastEntry {
                0% { transform: translateX(120%); }
                80% { transform: translateX(-10px); }
                100% { transform: translateX(0); }
            }
            @keyframes toastExit {
                0% { opacity: 1; }
                100% { opacity: 0; transform: translateY(-30px); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    };

    // 获取对应图标
    const getIcon = (type) => {
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: '🔗'
        };
        return icons[type] || '❕';
    };

    // 主处理流程
    const processRedirect = () => {
        try {
            const params = new URLSearchParams(location.search);
            const encodedUrl = params.get('url');

            if (!encodedUrl) {
                showiOSToast('缺少链接参数', 'error');
                return;
            }

            const decodedUrl = decodeURIComponent(decodeURIComponent(encodedUrl));
            
            if (!decodedUrl.startsWith('http')) {
                showiOSToast('不支持的链接类型', 'warning');
                return;
            }

            showiOSToast('准备跳转中...', 'success');
            
            setTimeout(() => {
                window.location.replace(decodedUrl);
            }, 1500);

        } catch (error) {
            showiOSToast('解析发生错误', 'error');
            console.error('[iOS Redirect]', error);
        }
    };

    // 启动控制
    if (document.readyState === 'complete') {
        processRedirect();
    } else {
        window.addEventListener('load', processRedirect);
    }
})();