// ==UserScript==
// @name         水球倒计时
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一个优雅的水球倒计时插件
// @author       HaiTang
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530797/%E6%B0%B4%E7%90%83%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/530797/%E6%B0%B4%E7%90%83%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const styles = `
        .water-timer {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        }

        .water-timer:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .water-ball {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
        }

        .water-wave {
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 200%;
            height: 200%;
            margin-left: -100%;
            margin-bottom: -100%;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 40%;
            animation: wave 3s infinite linear;
        }

        .water-wave:nth-child(2) {
            animation: wave 5s infinite linear;
            opacity: 0.5;
        }

        .timer-text {
            position: absolute;
            width: 100%;
            text-align: center;
            color: white;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
            z-index: 1;
        }

        .timer-menu {
            position: absolute;
            bottom: 70px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 12px;
            display: none;
            z-index: 9999;
        }

        .timer-menu.show {
            display: block;
            animation: slideUp 0.3s ease;
        }

        .preset-times {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 12px;
        }

        .preset-button {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            background: #f0f2f5;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #333;
        }

        .preset-button:hover {
            background: #e4e6e9;
        }

        .custom-time {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }

        .time-input {
            width: 50px;
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
        }

        .control-buttons {
            display: flex;
            gap: 8px;
        }

        .control-button {
            flex: 1;
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .start-button {
            background: #4facfe;
            color: white;
        }

        .pause-button {
            background: #ff9a9e;
            color: white;
        }

        .reset-button {
            background: #f0f2f5;
            color: #333;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 16px;
            display: none;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        }

        .notification.show {
            display: block;
        }

        @keyframes wave {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;

    GM_addStyle(styles);

    // 创建DOM元素
    const createTimer = () => {
        const timer = document.createElement('div');
        timer.className = 'water-timer';
        timer.innerHTML = `
            <div class="water-ball">
                <div class="timer-text">00:00</div>
                <div class="water-wave"></div>
                <div class="water-wave"></div>
            </div>
        `;
        document.body.appendChild(timer);

        const menu = document.createElement('div');
        menu.className = 'timer-menu';
        menu.innerHTML = `
            <div class="preset-times">
                <button class="preset-button" data-time="60">1分钟</button>
                <button class="preset-button" data-time="300">5分钟</button>
                <button class="preset-button" data-time="600">10分钟</button>
            </div>
            <div class="custom-time">
                <input type="number" class="time-input" placeholder="时" min="0" id="hours">
                <input type="number" class="time-input" placeholder="分" min="0" max="59" id="minutes">
                <input type="number" class="time-input" placeholder="秒" min="0" max="59" id="seconds">
            </div>
            <div class="control-buttons">
                <button class="control-button start-button">开始</button>
                <button class="control-button pause-button">暂停</button>
                <button class="control-button reset-button">重置</button>
            </div>
        `;
        document.body.appendChild(menu);

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = '时间到！';
        document.body.appendChild(notification);

        return { timer, menu, notification };
    };

    // 初始化计时器
    let timeLeft = 0;
    let initialTime = 0;
    let timerInterval = null;
    let isRunning = false;

    const { timer, menu, notification } = createTimer();
    const timerText = timer.querySelector('.timer-text');
    const waterBall = timer.querySelector('.water-ball');

    // 格式化时间
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 更新水球高度
    const updateWaterHeight = () => {
        const progress = timeLeft / initialTime;
        waterBall.style.background = `linear-gradient(to top,
            #4facfe ${progress * 100}%,
            rgba(255, 255, 255, 0.9) ${progress * 100}%)`;
    };

    // 开始计时
    const startTimer = (seconds) => {
        clearInterval(timerInterval);
        timeLeft = seconds;
        initialTime = seconds;
        isRunning = true;
        updateWaterHeight();

        timerInterval = setInterval(() => {
            timeLeft--;
            timerText.textContent = formatTime(timeLeft);
            updateWaterHeight();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                showNotification();
            }
        }, 1000);
    };

    // 暂停计时
    const pauseTimer = () => {
        clearInterval(timerInterval);
        isRunning = false;
    };

    // 重置计时
    const resetTimer = () => {
        clearInterval(timerInterval);
        timeLeft = 0;
        initialTime = 0;
        isRunning = false;
        timerText.textContent = '00:00';
        waterBall.style.background = 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)';
    };

    // 显示通知
    const showNotification = () => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    };

    // 事件监听
    timer.addEventListener('mouseenter', () => {
        menu.classList.add('show');
    });

    menu.addEventListener('mouseleave', () => {
        menu.classList.remove('show');
    });

    // 预设时间按钮点击事件
    menu.querySelectorAll('.preset-button').forEach(button => {
        button.addEventListener('click', () => {
            const seconds = parseInt(button.dataset.time);
            startTimer(seconds);
        });
    });

    // 开始按钮点击事件
    menu.querySelector('.start-button').addEventListener('click', () => {
        if (!isRunning) {
            const hours = parseInt(document.getElementById('hours').value) || 0;
            const minutes = parseInt(document.getElementById('minutes').value) || 0;
            const seconds = parseInt(document.getElementById('seconds').value) || 0;
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            if (totalSeconds > 0) {
                startTimer(totalSeconds);
            }
        }
    });

    // 暂停按钮点击事件
    menu.querySelector('.pause-button').addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        }
    });

    // 重置按钮点击事件
    menu.querySelector('.reset-button').addEventListener('click', resetTimer);
})();