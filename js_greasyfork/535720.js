// ==UserScript==
// @name         Anti-Idle Script
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  防止网页挂机的脚本，检测用户无操作时自动刷新或提示
// @author       wooluo
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535720/Anti-Idle%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/535720/Anti-Idle%20Script.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 设置无操作时间阈值（毫秒）
    const IDLE_TIME_THRESHOLD = 300000; // 5分钟
    let lastActivityTime = Date.now();
    let warningShown = false;

    // 检测用户活动
    function updateActivityTime() {
        lastActivityTime = Date.now();
        warningShown = false;
    }

    // 添加事件监听器
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
        window.addEventListener(event, updateActivityTime, true);
    });

    // 模拟用户活动 - 每30秒轻微移动鼠标1像素
    setInterval(() => {
        const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: Math.random() * 10,
            clientY: Math.random() * 10
        });
        document.dispatchEvent(event);
    }, 30000);
    // 定期检查活动状态
    setInterval(() => {
        const currentTime = Date.now();
        const idleTime = currentTime - lastActivityTime;

        if (idleTime > IDLE_TIME_THRESHOLD) {
            if (!warningShown) {
                // 显示警告
                const confirmed = confirm('检测到您长时间无操作，页面将在30秒后自动刷新！点击确定取消自动刷新。');
                if (confirmed) {
                    lastActivityTime = Date.now(); // 重置活动时间
                } else {
                    warningShown = true;
                    setTimeout(() => {
                        window.location.reload();
                    }, 30000); // 30秒后刷新
                }
            }
        }
    }, 60000); // 每分钟检查一次
    
    // 2倍速倒计时功能
    setInterval(() => {
        const timeElements = document.querySelectorAll('*');
        timeElements.forEach(el => {
            if (el.textContent.includes('还需') && el.textContent.includes('分钟') && el.textContent.includes('秒')) {
                const text = el.textContent;
                const matches = text.match(/(\d+)分钟(\d+)秒/);
                if (matches) {
                    let minutes = parseInt(matches[1]);
                    let seconds = parseInt(matches[2]);
                    
                    // 计算2倍速后的时间
                    let totalSeconds = minutes * 60 + seconds;
                    totalSeconds = Math.max(0, totalSeconds - 2); // 每秒减2实现2倍速
                    
                    minutes = Math.floor(totalSeconds / 60);
                    seconds = totalSeconds % 60;
                    
                    el.textContent = text.replace(/(\d+)分钟(\d+)秒/, `${minutes}分钟${seconds}秒`);
                }
            }
        });
    }, 1000);
})();