// ==UserScript==
// @name         NovelAI防侦测自动刷图V2.5
// @namespace    http://tampermonkey.net/
// @version      2.5.1
// @description  自动生成图片，带有重试、计时器和主题切换功能
// @author       JaND
// @match        https://novelai.net/image
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532936/NovelAI%E9%98%B2%E4%BE%A6%E6%B5%8B%E8%87%AA%E5%8A%A8%E5%88%B7%E5%9B%BEV25.user.js
// @updateURL https://update.greasyfork.org/scripts/532936/NovelAI%E9%98%B2%E4%BE%A6%E6%B5%8B%E8%87%AA%E5%8A%A8%E5%88%B7%E5%9B%BEV25.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const baseIntervalSeconds = 120;
    const randomRange = 10;
    const maxRetryCount = 5;
    const retryDelay = 5000;

    // 全局变量
    let isRunning = true;
    let timerId = null;
    let nextExecutionTime = 0;
    let isDarkTheme = false;

    // 正态分布随机生成函数
    function getNormalRandom(mean, stdDev) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * stdDev + mean;
    }

    // 更新计时器显示
    function updateTimerDisplay() {
        const timerElement = document.getElementById('timerDisplay');
        if (!isRunning) {
            timerElement.textContent = '已暂停';
            return;
        }

        const remaining = Math.max(0, Math.floor((nextExecutionTime - Date.now()) / 1000));
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // 主题切换功能
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        const panel = document.getElementById('controlPanel');
        if (isDarkTheme) {
            panel.style.background = 'rgba(0, 0, 0, 0.9)';
            panel.style.color = '#fff';
            document.body.style.backgroundColor = '#333';
            document.body.style.color = '#fff';
        } else {
            panel.style.background = 'rgba(255, 255, 255, 0.9)';
            panel.style.color = '#000';
            document.body.style.backgroundColor = '#fff';
            document.body.style.color = '#000';
        }
        document.getElementById('themeBtn').textContent = isDarkTheme ? '亮色主题' : '暗色主题';
    }

    // 智能查找生成按钮
    function findGenerateButton(retryCount = 0) {
        const classButton = document.querySelector('.cursor-pointer[tabindex="0"].bg-blue-600');
        if (classButton) return classButton;

        const textButton = Array.from(document.querySelectorAll('button')).find(btn => {
            const text = btn.textContent.toLowerCase();
            return text.includes('generate') || text.includes('生成');
        });

        if (!textButton && retryCount < maxRetryCount) {
            setTimeout(() => findGenerateButton(retryCount + 1), retryDelay);
            return null;
        }
        return textButton;
    }

    function scheduleClick() {
        if (!isRunning) return;

        let randomOffset = getNormalRandom(0, randomRange/3);
        randomOffset = Math.max(-randomRange, Math.min(randomRange, randomOffset));
        const actualWait = Math.max(10, baseIntervalSeconds + randomOffset) * 1000;
        nextExecutionTime = Date.now() + actualWait;

        timerId = setTimeout(() => {
            const generateBtn = findGenerateButton();
            generateBtn?.click();
            scheduleClick();
        }, actualWait);

        // 每秒更新计时器
        const timerInterval = setInterval(updateTimerDisplay, 1000);
        setTimeout(() => clearInterval(timerInterval), actualWait);
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'controlPanel';
        panel.style = `
            position: fixed;
            top: 60px;
            right: 200px;
            z-index: 9999;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            transition: all 0.3s;
        `;

        // 计时器显示
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timerDisplay';
        timerDisplay.style.marginBottom = '10px';
        timerDisplay.textContent = '00:00';

        // 控制按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '暂停';
        toggleBtn.style = `
            padding: 8px 15px;
            margin-right: 10px;
            cursor: pointer;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
        `;

        // 主题切换按钮
        const themeBtn = document.createElement('button');
        themeBtn.id = 'themeBtn';
        themeBtn.textContent = '暗色主题';
        themeBtn.style = `
            padding: 8px 15px;
            cursor: pointer;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
        `;

        // 事件绑定
        toggleBtn.addEventListener('click', () => {
            isRunning = !isRunning;
            toggleBtn.textContent = isRunning ? '暂停' : '继续';
            if (isRunning) scheduleClick();
            else clearTimeout(timerId);
            updateTimerDisplay();
        });

        themeBtn.addEventListener('click', toggleTheme);

        panel.append(timerDisplay, toggleBtn, themeBtn);
        document.body.appendChild(panel);
    }

    // 初始化
    setTimeout(() => {
        createControlPanel();
        scheduleClick();
        setInterval(updateTimerDisplay, 1000);
    }, 3000);
})();

