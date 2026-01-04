// ==UserScript==
// @name         AcFun 自动签到
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  每日自动签到
// @author       ChatGPT
// @match        *://www.acfun.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @connect      acfun.cn
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/525932/AcFun%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/525932/AcFun%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SIGN_URL = 'https://www.acfun.cn/rest/pc-direct/user/signIn';
    const STORAGE_KEY = 'ACFUN_LAST_SIGN_DATE';

    // 带状态检测的签到
    const smartSign = async () => {
        // 读取上次签到日期
        const lastSignDate = GM_getValue(STORAGE_KEY, '');
        const today = new Date().toLocaleDateString();

        // 当日已签到则跳过
        if (lastSignDate === today) {
            return;
        }

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: SIGN_URL,
                    headers: { Referer: location.href },
                    onload: resolve,
                    onerror: reject
                });
            });

            const result = JSON.parse(response.responseText);
            if (response.status === 200) {
                if (result.result === 0) {
                    GM_setValue(STORAGE_KEY, today);
                    showNotification(`签到成功！获得＋ ${result.bananaDelta || '香蕉🍌'}`, true);
                } else if (result.result === 122) {
                    GM_setValue(STORAGE_KEY, today);
                } else if (result.result === -401) {
                    showNotification('请先登录', false);
                } else {
                    showNotification('签到失败，请稍后再试', false);
                }
            } else {
                showNotification('签到请求失败，请稍后再试', false);
            }
        } catch (error) {
            console.error('签到失败:', error);
            showNotification('签到失败，请稍后再试', false);
        }
    };

    // 状态提示（单例模式）
    let notificationElement = null;
    const showNotification = (message, isSuccess) => {
        if (notificationElement) return;

        notificationElement = document.createElement('div');
        notificationElement.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${isSuccess ? '#4CAF50' : '#ff5252'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16);
            z-index: 99999;
            animation: notificationSlide 0.3s ease-out;
        `;

        // 动态添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes notificationSlide {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);

        notificationElement.textContent = message;
        document.body.appendChild(notificationElement);

        // 自动移除
        setTimeout(() => {
            notificationElement.remove();
            style.remove();
            notificationElement = null;
        }, 3000);
    };

    // 智能触发（页面加载完成后执行）
    window.addEventListener('load', () => {
        if (location.host.includes('acfun.cn')) {
            smartSign();
        }
    }, { once: true });
})();