// ==UserScript==
// @name         倒计时提醒器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  页面打开时输入时间进行倒计时，时间到时播放提示音
// @author       zonahaha
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544246/%E5%80%92%E8%AE%A1%E6%97%B6%E6%8F%90%E9%86%92%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544246/%E5%80%92%E8%AE%A1%E6%97%B6%E6%8F%90%E9%86%92%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建倒计时界面
    function createCountdownUI() {
        // 创建容器
        const container = document.createElement('div');
        container.id = 'countdown-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            z-index: 9999;
            min-width: 200px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = '输入分钟数';
        input.id = 'countdown-input';
        input.style.cssText = `
            width: 80px;
            padding: 5px;
            margin-right: 10px;
            border: none;
            border-radius: 3px;
            font-size: 14px;
            color: black;
        `;

        // 创建开始按钮
        const startBtn = document.createElement('button');
        startBtn.textContent = '开始倒计时';
        startBtn.id = 'countdown-start';
        startBtn.style.cssText = `
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        `;

        // 创建停止按钮
        const stopBtn = document.createElement('button');
        stopBtn.textContent = '停止';
        stopBtn.id = 'countdown-stop';
        stopBtn.style.cssText = `
            padding: 5px 10px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 5px;
            display: none;
        `;

        // 创建显示时间的div
        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'countdown-display';
        timeDisplay.style.cssText = `
            margin-top: 10px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            min-height: 25px;
        `;

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        `;

        // 组装界面
        container.appendChild(closeBtn);
        container.appendChild(input);
        container.appendChild(startBtn);
        container.appendChild(stopBtn);
        container.appendChild(timeDisplay);

        // 添加到页面
        document.body.appendChild(container);

        return {
            container,
            input,
            startBtn,
            stopBtn,
            timeDisplay,
            closeBtn
        };
    }

    // 倒计时逻辑
    let countdownInterval = null;
    let remainingTime = 0;

    function startCountdown(minutes) {
        remainingTime = minutes * 60; // 转换为秒
        updateDisplay();

        countdownInterval = setInterval(() => {
            remainingTime--;
            updateDisplay();

            if (remainingTime <= 0) {
                stopCountdown();
                playAlarm();
                showNotification();
            }
        }, 1000);

        // 更新按钮状态
        document.getElementById('countdown-start').style.display = 'none';
        document.getElementById('countdown-stop').style.display = 'inline-block';
    }

    function stopCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        // 更新按钮状态
        document.getElementById('countdown-start').style.display = 'inline-block';
        document.getElementById('countdown-stop').style.display = 'none';

        // 清空显示
        document.getElementById('countdown-display').textContent = '';
    }

    function updateDisplay() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const display = document.getElementById('countdown-display');
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // 根据剩余时间改变颜色
        if (remainingTime <= 30) {
            display.style.color = '#ff4444';
        } else if (remainingTime <= 60) {
            display.style.color = '#ffaa00';
        } else {
            display.style.color = 'white';
        }
    }

    // 播放提示音
    function playAlarm() {
        try {
            const audio = new Audio('https://img.tukuppt.com/newpreview_music/08/99/00/5c88d4ac45bb536047.mp3');
            audio.volume = 0.5;
            audio.play().catch(error => {
                console.log('音频播放失败:', error);
                // 备用方案：使用浏览器内置提示音
                playFallbackAlarm();
            });
        } catch (error) {
            console.log('创建音频对象失败:', error);
            playFallbackAlarm();
        }
    }

    // 备用提示音方案
    function playFallbackAlarm() {
        // 创建简单的提示音
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // 显示通知
    function showNotification() {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: pulse 1s infinite;
        `;

        notification.textContent = '⏰ 时间到！';

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 3秒后移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 初始化
    function init() {
        const ui = createCountdownUI();

        // 绑定事件
        ui.startBtn.addEventListener('click', () => {
            const minutes = parseInt(ui.input.value);
            if (minutes > 0) {
                startCountdown(minutes);
            } else {
                alert('请输入有效的分钟数！');
            }
        });

        ui.stopBtn.addEventListener('click', stopCountdown);

        ui.closeBtn.addEventListener('click', () => {
            stopCountdown();
            if (ui.container.parentNode) {
                ui.container.parentNode.removeChild(ui.container);
            }
        });

        // 回车键开始倒计时
        ui.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                ui.startBtn.click();
            }
        });

        // 自动聚焦到输入框
        ui.input.focus();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();