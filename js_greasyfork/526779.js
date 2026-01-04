// ==UserScript==
// @name         抖音10分钟跳转 (可配置时长)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  当你使用抖音达到配置时长后，自动跳转到其他网页 (可配置时长)
// @author       https://github.com/H-T-H
// @match        *://*.douyin.com/*
// @match        *://*.tiktok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526779/%E6%8A%96%E9%9F%B310%E5%88%86%E9%92%9F%E8%B7%B3%E8%BD%AC%20%28%E5%8F%AF%E9%85%8D%E7%BD%AE%E6%97%B6%E9%95%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526779/%E6%8A%96%E9%9F%B310%E5%88%86%E9%92%9F%E8%B7%B3%E8%BD%AC%20%28%E5%8F%AF%E9%85%8D%E7%BD%AE%E6%97%B6%E9%95%BF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置你想跳转到的网址，替换成你想要的网址
    const redirectURL = "https://github.com/"; // 例如： https://www.google.com 或者 https://www.baidu.com

    // 从 localStorage 获取用户配置的时长，如果没有则使用默认值
    let timeLimitMinutes = localStorage.getItem('douyinTimeLimitMinutes');

    if (!timeLimitMinutes) {
        // 首次运行或配置被清除，弹出对话框让用户输入时长
        timeLimitMinutes = prompt("请输入你想使用抖音的最长时间（分钟）：", "10"); // 默认值设置为 10 分钟

        // 检查用户是否取消了输入或者输入了非数字
        if (timeLimitMinutes === null || isNaN(parseInt(timeLimitMinutes)) || parseInt(timeLimitMinutes) <= 0) {
            timeLimitMinutes = 10; // 如果取消或输入无效，则默认设置为 10 分钟
            alert("时间设置无效，已设置为默认值 10 分钟。"); // 可选：提示用户
        } else {
            timeLimitMinutes = parseInt(timeLimitMinutes); // 转换为数字
        }

        localStorage.setItem('douyinTimeLimitMinutes', timeLimitMinutes); // 保存用户设置的时长
    } else {
        timeLimitMinutes = parseInt(timeLimitMinutes); // 从 localStorage 中读取的是字符串，需要转换为数字
    }

    const timeLimitMilliseconds = timeLimitMinutes * 60 * 1000;

    let startTime = localStorage.getItem('douyinStartTime');

    if (!startTime) {
        startTime = Date.now();
        localStorage.setItem('douyinStartTime', startTime);
    }

    const elapsedTime = Date.now() - parseInt(startTime);

    if (elapsedTime >= timeLimitMilliseconds) {
        localStorage.removeItem('douyinStartTime'); // 清除记录，下次重新计时
        window.location.href = redirectURL;
    } else {
        // 如果时间未到，设置一个定时器，在剩余时间后检查是否需要跳转
        const remainingTime = timeLimitMilliseconds - elapsedTime;
        setTimeout(function() {
            localStorage.removeItem('douyinStartTime'); // 确保定时器触发后清除记录
            window.location.href = redirectURL;
        }, remainingTime);

        // 可选：添加一个倒计时提示，显示剩余时间 (可以根据需要添加或删除)
        function updateTimerDisplay() {
            const currentElapsedTime = Date.now() - parseInt(startTime);
            const remaining = timeLimitMilliseconds - currentElapsedTime;
            if (remaining <= 0) {
                clearInterval(timerInterval);
                return; // 倒计时结束，不再更新
            }

            const minutes = Math.floor(remaining / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            // 你可以自定义显示方式，这里简单地在页面顶部显示
            const timerElement = document.getElementById('douyin-timer');
            if (timerElement) {
                timerElement.textContent = `抖音剩余使用时间：${minutes}分钟 ${seconds}秒 (总时长: ${timeLimitMinutes}分钟)`; // 显示总时长
            } else {
                const newTimerElement = document.createElement('div');
                newTimerElement.id = 'douyin-timer';
                newTimerElement.style.cssText = `
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    z-index: 9999; /* 确保在最上层 */
                `;
                newTimerElement.textContent = `抖音剩余使用时间：${minutes}分钟 ${seconds}秒 (总时长: ${timeLimitMinutes}分钟)`; // 显示总时长
                document.body.appendChild(newTimerElement);
            }
        }

        updateTimerDisplay(); // 立即更新一次
        const timerInterval = setInterval(updateTimerDisplay, 1000); // 每秒更新倒计时
    }

})();