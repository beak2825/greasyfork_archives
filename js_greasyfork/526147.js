// ==UserScript==
// @name         Deepseek自动重试
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动每2分钟点击“重新生成”按钮
// @author       amzAsin
// @match        https://chat.deepseek.com/*
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/526147/Deepseek%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/526147/Deepseek%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板（启动、停止按钮、倒计时和点击次数显示）
    const controlDiv = document.createElement('div');
    controlDiv.style.position = 'fixed';
    controlDiv.style.bottom = '20px';
    controlDiv.style.right = '20px';
    controlDiv.style.backgroundColor = 'rgba(255,255,255,0.9)';
    controlDiv.style.border = '1px solid #000';
    controlDiv.style.padding = '10px';
    controlDiv.style.zIndex = '9999';
    controlDiv.innerHTML = `
        <button id="startAutoClicker">启动</button>
        <button id="stopAutoClicker" disabled>停止</button>
        <span style="margin-left:10px;">点击次数：<span id="clickCount">0</span></span>
        <br>
        <span>下次检测倒计时：<span id="countdown">120</span> 秒</span>
    `;
    document.body.appendChild(controlDiv);

    let autoClickCount = 0;
    let isRunning = false;
    let clickInterval = null;
    let countdownInterval = null;
    let countdown = 120;

    // 更新倒计时显示
    function updateCountdown() {
        document.getElementById('countdown').textContent = countdown;
        if (countdown > 0) {
            countdown--;
        } else {
            countdown = 120; // 重置倒计时
        }
    }

    // 检查页面中是否存在“服务器繁忙”提示，并找到兄弟节点中的按钮
    function checkAndClick() {
        if (!isRunning) return;

        const mdElement = document.querySelector('div.ds-markdown.ds-markdown--block');
        if (mdElement && mdElement.textContent.includes('服务器繁忙')) {
            const parent = mdElement.parentElement;
            if (parent) {
                const buttons = parent.querySelectorAll('div.ds-icon-button');
                for (const btn of buttons) {
                    if (btn.querySelector('rect#重新生成')) {
                        btn.click();
                        autoClickCount++;
                        document.getElementById('clickCount').textContent = autoClickCount;
                        console.log(`已点击重新生成按钮，累计点击次数：${autoClickCount}`);
                        break;
                    }
                }
            }
        }
    }

    // 启动自动点击功能（每2分钟检测一次）
    function startAutoClicker() {
        if (isRunning) return;
        isRunning = true;
        document.getElementById('startAutoClicker').disabled = true;
        document.getElementById('stopAutoClicker').disabled = false;

        countdown = 120;
        checkAndClick(); // 立即执行一次
        clickInterval = setInterval(() => {
            checkAndClick();
            countdown = 120; // 重置倒计时
        }, 120000); // 每2分钟执行一次

        countdownInterval = setInterval(updateCountdown, 1000); // 每秒更新倒计时
        console.log('自动点击功能已启动');
    }

    // 停止自动点击功能
    function stopAutoClicker() {
        isRunning = false;
        clearInterval(clickInterval);
        clearInterval(countdownInterval);
        document.getElementById('startAutoClicker').disabled = false;
        document.getElementById('stopAutoClicker').disabled = true;
        console.log('自动点击功能已停止');
    }

    // 绑定按钮事件
    document.getElementById('startAutoClicker').addEventListener('click', startAutoClicker);
    document.getElementById('stopAutoClicker').addEventListener('click', stopAutoClicker);
})();
