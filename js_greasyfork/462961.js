// ==UserScript==
// @name         GPT-4 手动请求计数器（Chatgpt-GPT-4-Request-Counter-Manual-only
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  让你可以手动记录过去三小时内gpt-4的使用次数，方便规划管理，显示于右上角  You can manually record the usage frequency of GPT-4 during the past three hours, facilitating planning and management.
// @author       Your Name
// @match        https://chat.openai.com/chat/*
// @icon         https://chat.openai.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462961/GPT-4%20%E6%89%8B%E5%8A%A8%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8%EF%BC%88Chatgpt-GPT-4-Request-Counter-Manual-only.user.js
// @updateURL https://update.greasyfork.org/scripts/462961/GPT-4%20%E6%89%8B%E5%8A%A8%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8%EF%BC%88Chatgpt-GPT-4-Request-Counter-Manual-only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SECONDS_IN_3_HOURS = 3 * 60 * 60;

    // 创建包含按钮和请求次数的 div
    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.position = 'fixed';
    wrapperDiv.style.top = '20px';
    wrapperDiv.style.right = '20px';
    wrapperDiv.style.zIndex = '9999';
    document.body.appendChild(wrapperDiv);


    // 在页面上创建一个计数器按钮
    const counterButton = document.createElement('button');
    counterButton.style.padding = '10px';
    counterButton.style.backgroundColor = '#007bff';
    counterButton.style.color = '#ffffff';
    counterButton.style.border = 'none';
    counterButton.style.cursor = 'pointer';
    counterButton.textContent = '记录 GPT-4 请求';
    wrapperDiv.appendChild(counterButton);

    // 创建显示当前请求次数的 span
    const requestCountSpan = document.createElement('span');
    requestCountSpan.style.display = 'block';
    requestCountSpan.style.marginTop = '10px';
    requestCountSpan.style.color = '#007bff';
    requestCountSpan.style.fontSize = '16px';
    wrapperDiv.appendChild(requestCountSpan);

    // 创建显示倒计时的 span
    const countdownSpan = document.createElement('span');
    countdownSpan.style.display = 'block';
    countdownSpan.style.marginTop = '5px';
    countdownSpan.style.color = '#007bff';
    countdownSpan.style.fontSize = '14px';
    wrapperDiv.appendChild(countdownSpan);


    // 从 localStorage 中获取之前的计数值和首次请求时间
    let requestCount = parseInt(localStorage.getItem('gpt4RequestCount')) || 0;
    let firstRequestTimestamp = parseInt(localStorage.getItem('gpt4FirstRequestTimestamp')) || 0;

    // 更新显示的请求次数
    function updateRequestCountDisplay() {
        requestCountSpan.textContent = `已请求次数：${requestCount}`;
    }

    // 更新倒计时显示
    function updateCountdownDisplay() {
        if (firstRequestTimestamp === 0) {
            countdownSpan.textContent = '';
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        const elapsedTime = now - firstRequestTimestamp;
        const remainingTime = SECONDS_IN_3_HOURS - elapsedTime;

        if (remainingTime <= 0) {
            countdownSpan.textContent = '倒计时已结束，请求次数已刷新';
            firstRequestTimestamp = 0;
            requestCount = 0;
            localStorage.removeItem('gpt4FirstRequestTimestamp');
            localStorage.removeItem('gpt4RequestCount');
        } else {
            const remainingHours = Math.floor(remainingTime / 3600);
            const remainingMinutes = Math.floor((remainingTime % 3600) / 60);
            const remainingSeconds = remainingTime % 60;
            countdownSpan.textContent = `${remainingHours}小时${remainingMinutes}分${remainingSeconds}秒后回复`;
        }
    }

    // 初始化显示
    updateRequestCountDisplay();
    updateCountdownDisplay();

    // 每秒更新倒计时
    setInterval(updateCountdownDisplay, 1000);

    // 当按钮被点击时，增加计数值并显示弹出框
    counterButton.addEventListener('click', () => {
        requestCount++;
        localStorage.setItem('gpt4RequestCount', requestCount);
        updateRequestCountDisplay();

        if (firstRequestTimestamp === 0) {
            firstRequestTimestamp = Math.floor(Date.now() / 1000);
            localStorage.setItem('gpt4FirstRequestTimestamp', firstRequestTimestamp);
        }

        updateCountdownDisplay();
    });
})();
