// ==UserScript==
// @name         B站防沉迷助手
// @namespace    http://tampermonkey.net/ 
// @version      0.1
// @description  防止你在B站刷视频停不下来！
// @author       shisan
// @match        https://www.bilibili.com/video/* 
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503068/B%E7%AB%99%E9%98%B2%E6%B2%89%E8%BF%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503068/B%E7%AB%99%E9%98%B2%E6%B2%89%E8%BF%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户自定义间隔时间（分钟）
    let intervalMinutes = prompt("请输入间隔时间（分钟）：", "30");
    if (intervalMinutes === null || intervalMinutes === "") {
        intervalMinutes = 30; // 默认30分钟
    }
    let intervalMilliseconds = intervalMinutes * 60 * 1000;

    // 创建弹窗
    function createReminderPopup() {
        const div = document.createElement('div');
        div.id = 'reminder-popup';
        div.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.95);
            padding: 30px 40px;
            border-radius: 10px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            text-align: center;
            font-family: 'Microsoft YaHei', sans-serif;
        `;
        div.innerHTML = `
            <h3 style="font-size: 24px; margin-bottom: 20px;">看这个视频对你有帮助吗？工作做完了吗？</h3>
            <button id="stop-watching" style="background-color: #f44336; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">不看了</button>
            <button id="remind-later" style="background-color: #4CAF50; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer;">10分钟之后喊我</button>
        `;
        document.body.appendChild(div);

        // 按钮事件监听
        document.getElementById('stop-watching').addEventListener('click', () => {
            document.body.removeChild(div);
            clearInterval(reminderInterval);
        });
        document.getElementById('remind-later').addEventListener('click', () => {
            document.body.removeChild(div);
            setTimeout(createReminderPopup, 10 * 60 * 1000); // 10分钟后再次弹窗
        });
    }

    // 定时弹窗
    let reminderInterval = setInterval(createReminderPopup, intervalMilliseconds);
})();