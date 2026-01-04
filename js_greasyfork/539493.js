// ==UserScript==
// @name         CR-NOQQ
// @namespace    github.com/jidan233awa
// @version      1.0
// @description  CR-NOQQ 自动跳转QQ链接到目标域名
// @author       CRWorld
// @match        https://c.pc.qq.com/ios.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539493/CR-NOQQ.user.js
// @updateURL https://update.greasyfork.org/scripts/539493/CR-NOQQ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置变量：0=显示动画弹窗，1=直接跳转
    const SKIP_ANIMATION = 0;
    //======↑↑↑配置变量↑↑↑==================================
    //=====================================================
    //=====================================================
    // 检查当前URL是否匹配目标模式
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const targetUrl = urlParams.get('url');

    if (targetUrl) {
        // 如果设置为直接跳转模式
        if (SKIP_ANIMATION === 1) {
            let cleanUrl = targetUrl;
            
            // 如果URL不包含协议，添加https://
            if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
                cleanUrl = 'https://' + cleanUrl;
            }
            
            // 直接跳转到目标URL
            window.location.href = cleanUrl;
            return;
        }
        
        // 默认模式：显示动画弹窗
        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.className = 'cr-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            left: auto !important;
            width: 260px;
            height: 110px;
            background: linear-gradient(120deg, rgba(163, 187, 227, 0.18) 0%, rgba(189, 231, 250, 0.14) 100%);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-family: Arial, sans-serif;
            color: #333;
            font-weight: 500;
            box-sizing: border-box;
            overflow: hidden;
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            .cr-modal {
                animation: modalShow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .cr-modal.hide {
                animation: modalHide 0.5s ease forwards;
            }
            @keyframes modalShow {
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            @keyframes modalHide {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.9);
                }
            }
            .cr-modal::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 9px;
                background-color: #e8e8e8;
                border-radius: 0 0 16px 16px;
            }
            .cr-modal::before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                height: 9px;
                background-color: #67c23a;
                border-radius: 0 0 16px 16px;
                z-index: 1;
                width: 100%;
                transform-origin: left;
                animation: progressShrink 3s linear forwards;
            }
            @keyframes progressShrink {
                from {
                    transform: scaleX(1);
                }
                to {
                    transform: scaleX(0);
                }
            }
            .tooltip-content {
                font-size: 18px;
                text-align: center;
                line-height: 1.4;
                color: #34495e;
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);

        // 创建内容区域
        const contentArea = document.createElement('div');
        contentArea.className = 'tooltip-content';
        contentArea.innerHTML = `
            <span id="countdown">3</span> 秒后跳转
        `;

        // 组装弹窗
        modal.appendChild(contentArea);
        document.body.appendChild(modal);

        // 倒计时功能
        let countdown = 3;
        const countdownElement = modal.querySelector('#countdown');
        
        // 数字倒计时定时器（每秒更新）
        const numberTimer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(numberTimer);
                // 倒计时结束后10ms延迟触发消失动画
                setTimeout(() => {
                    modal.classList.add('hide');
                    setTimeout(() => {
                        // 提取并跳转到目标域名
                        let cleanUrl = targetUrl;
                        
                        // 如果URL不包含协议，添加https://
                        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
                            cleanUrl = 'https://' + cleanUrl;
                        }
                        
                        // 跳转到目标URL
                        window.location.href = cleanUrl;
                    }, 500);
                }, 10);
            }
        }, 1000);
    }
})();