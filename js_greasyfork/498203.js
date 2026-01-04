// ==UserScript==
// @name         页面访问计时器
// @version      1.3
// @description  记录并显示用户在每个页面的停留时间
// @author       lbihhe
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1317293
// @downloadURL https://update.greasyfork.org/scripts/498203/%E9%A1%B5%E9%9D%A2%E8%AE%BF%E9%97%AE%E8%AE%A1%E6%97%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/498203/%E9%A1%B5%E9%9D%A2%E8%AE%BF%E9%97%AE%E8%AE%A1%E6%97%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义计时器相关变量
    let startTime, timerInterval, accumulatedTime = 0;
    const currentUrl = window.location.href;

    // 获取并解析存储的时间数据
    const getTimeData = () => {
        try {
            const storedData = localStorage.getItem('timeData');
            return storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error('获取时间数据失败:', error);
            return {};
        }
    };

    // 更新并存储页面时间数据
    const updatePageTime = (url, timeSpent) => {
        try {
            const timeData = getTimeData();
            timeData[url] = (timeData[url] || 0) + timeSpent;
            localStorage.setItem('timeData', JSON.stringify(timeData));
        } catch (error) {
            console.error('更新时间数据失败:', error);
        }
    };

    // 启动计时器
    const startTimer = () => {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    };

    // 更新计时器
    const updateTimer = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        accumulatedTime += elapsedTime;
        startTime = currentTime;
        updatePageTime(currentUrl, elapsedTime);
        updateDisplay();
    };

    // 更新显示时间
    const updateDisplay = () => {
        const displayElement = document.getElementById('timeSpentDisplay') || createDisplayElement();
        displayElement.innerHTML = `
            <div>您在此页面已停留</div>
            <div>${formatTime(accumulatedTime)}</div>
            <div id="controlButtons"></div>
        `;
        createControlButtons();
    };

    // 创建显示时间的元素
    const createDisplayElement = () => {
        const displayElement = document.createElement('div');
        displayElement.id = 'timeSpentDisplay';
        Object.assign(displayElement.style, {
            position: 'fixed',
            bottom: '0px',
            left: '0px',
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            fontSize: '14px',
            color: '#333',
            fontFamily: 'Arial, sans-serif',
            transition: 'all 0.3s ease'
        });
        document.body.appendChild(displayElement);
        return displayElement;
    };

    // 格式化时间
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours > 0 ? `${hours} 小时 ` : ''}${minutes > 0 ? `${minutes} 分钟 ` : ''}${seconds} 秒`;
    };

    // 创建控制按钮
    const createControlButton = (text, onClick, icon) => {
        const button = document.createElement('button');
        button.innerHTML = `${icon} ${text}`;
        Object.assign(button.style, {
            margin: '10px 10px 0 0', // 增加按钮之间的间距
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007BFF',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s ease'
        });
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#0056b3';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#007BFF';
        });
        button.addEventListener('click', onClick);
        return button;
    };

    // 创建控制面板
    const createControlButtons = () => {
        const controlPanel = document.getElementById('controlButtons');
        if (controlPanel) {
            controlPanel.innerHTML = '';
            const pauseButton = createControlButton('暂停', pauseTimer, '⏸️');
            const resumeButton = createControlButton('继续', resumeTimer, '▶️');
            const resetButton = createControlButton('重置', resetTimer, '🔄');
            resumeButton.style.display = 'none';
            controlPanel.append(pauseButton, resumeButton, resetButton);
        }
    };

    // 暂停计时器
    const pauseTimer = () => {
        clearInterval(timerInterval);
        document.querySelector('button:contains("暂停")').style.display = 'none';
        document.querySelector('button:contains("继续")').style.display = 'inline-block';
    };

    // 继续计时器
    const resumeTimer = () => {
        startTimer();
        document.querySelector('button:contains("继续")').style.display = 'none';
        document.querySelector('button:contains("暂停")').style.display = 'inline-block';
    };

    // 重置计时器
    const resetTimer = () => {
        accumulatedTime = 0;
        startTime = Date.now();
        updatePageTime(currentUrl, 0);
        updateDisplay();
    };

    // 页面加载完成后启动计时器
    window.addEventListener('load', startTimer);

    // 页面卸载前更新停留时间
    window.addEventListener('beforeunload', () => {
        const elapsedTime = Date.now() - startTime;
        updatePageTime(currentUrl, elapsedTime);
    });
})();