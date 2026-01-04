// ==UserScript==
// @name         小红书自动刷新脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license MIT
// @description  Automatically refresh page when there is no user activity in the last 5 minutes
// @author       You
// @match        https://*.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462821/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462821/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var timeoutId;

    function resetTimer() {
        clearTimeout(timeoutId);
        console.log("刷新了")
        timeoutId = setTimeout(refreshPage, 5 * 60 * 1000); // 5 minutes
        resetCountdown();
    }

    function refreshPage() {
        location.reload();
    }

    function resetCountdown() {
        countdown = 5 * 60; // 5 minutes in seconds
        countdownElement.textContent = `页面将在 ${countdown} 秒后刷新`;
    }

    //document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);
    document.addEventListener('click', resetTimer);

    const countdownElement = document.createElement('div');
    countdownElement.style.position = 'fixed';
    countdownElement.style.bottom = '20px';
    countdownElement.style.right = '20px';
    countdownElement.style.backgroundColor = '#fff';
    countdownElement.style.padding = '10px';
    countdownElement.style.borderRadius = '5px';
    countdownElement.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
    document.body.appendChild(countdownElement);

    let countdown = 5 * 60; // 5 minutes in seconds
    countdownElement.textContent = `页面将在 ${countdown} 秒后刷新`;
    resetTimer()
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = `页面将在 ${countdown} 秒后刷新`;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownElement.style.display = 'none';
        }
    }, 1000);
})();