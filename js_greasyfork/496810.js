// ==UserScript==
// @name         防沉迷
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  老年人防沉迷
// @author       https://chatgpt.com
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496810/%E9%98%B2%E6%B2%89%E8%BF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/496810/%E9%98%B2%E6%B2%89%E8%BF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const time = 60 // 分钟
    const timeLimit = time * 60 * 1000; // 1 hour in milliseconds
    const currentDate = new Date().toLocaleDateString('en-CA'); // Format date as YYYY-MM-DD
    let alertTriggered = false;  // Flag to prevent multiple alerts
    const websites = [
        'https://github.com',
        'https://leetcode.cn',
        'https://google.com',
        'https://pornhub.com',
    ];
    // Retrieve stored usage data
    let usageData = JSON.parse(localStorage.getItem('linuxDoUsage')) || {};

    // Reset daily usage if the date has changed
    if (usageData.date !== currentDate) {
        usageData = { date: currentDate, timeSpent: 0 };
        localStorage.setItem('linuxDoUsage', JSON.stringify(usageData)); // Save reset data
    }

    let lastTime = Date.now();

    // Create a timer element
    const timerElement = document.createElement('div');
    timerElement.style.position = 'fixed';
    timerElement.style.bottom = '10px';
    timerElement.style.right = '10px';
    timerElement.style.padding = '10px 20px';
    timerElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    timerElement.style.color = '#fff';
    timerElement.style.zIndex = '1000';
    timerElement.style.borderRadius = '8px';
    timerElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    timerElement.style.fontFamily = 'Arial, sans-serif';
    timerElement.style.fontSize = '14px';
    timerElement.style.textAlign = 'center';
    timerElement.style.transition = 'all 0.3s ease';
    document.body.appendChild(timerElement);

    function updateTimer() {
        if (alertTriggered) return; // Check if the alert has already been triggered
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastTime;
        lastTime = currentTime; // Update lastTime to the current time
        usageData.timeSpent += elapsedTime;
        localStorage.setItem('linuxDoUsage', JSON.stringify(usageData));

        const remainingTime = timeLimit - usageData.timeSpent;
        if (remainingTime <= 0) {
            alert('不能在摸鱼了！我要去学习😡😡😡');
            const randomIndex = Math.floor(Math.random() * websites.length); // Get random index
            window.location.href = websites[randomIndex]; // Redirect to random website
            alertTriggered = true;  // Set the flag to true after the alert
        } else {
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            timerElement.textContent = `还可以摸鱼: ${minutes}m ${seconds}s`;
        }
    }

    window.addEventListener('beforeunload', updateTimer);
    setInterval(updateTimer, 1000); // Update timer every second
})();
