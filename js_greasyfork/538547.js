// ==UserScript==
// @name         随机鼠标移动器 (调试版-修复view属性)
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  在5-10秒随机时间内（用于测试），挪动鼠标至随机位置，右侧贴边有启动/关闭开关、记录移动次数和下次移动倒计时。
// @author       Your Name (替换成你的名字)
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MPL-2.0 License
// @downloadURL https://update.greasyfork.org/scripts/538547/%E9%9A%8F%E6%9C%BA%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E5%99%A8%20%28%E8%B0%83%E8%AF%95%E7%89%88-%E4%BF%AE%E5%A4%8Dview%E5%B1%9E%E6%80%A7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538547/%E9%9A%8F%E6%9C%BA%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E5%99%A8%20%28%E8%B0%83%E8%AF%95%E7%89%88-%E4%BF%AE%E5%A4%8Dview%E5%B1%9E%E6%80%A7%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let moveTimeoutId; // 用于 setTimeout 的 ID
    let countdownIntervalId; // 用于 setInterval 更新倒计时的 ID
    let isRunning = false;
    let moveCount = GM_getValue('mouseMoveCount', 0) || 0;
    let nextMoveTime = 0; // 下次移动的精确时间戳

    // --- 样式 ---
    GM_addStyle(`
        #mouseMoverControlPanel {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 15px;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            z-index: 99999999; /* 确保非常高 */
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: -2px 0px 5px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        #mouseMoverControlPanel button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }

        #mouseMoverControlPanel button:hover {
            background-color: #45a049;
        }

        #mouseMoverControlPanel button.stop {
            background-color: #f44336;
        }

        #mouseMoverControlPanel button.stop:hover {
            background-color: #da190b;
        }

        #mouseMoverControlPanel div[id$="Text"] {
            font-weight: normal;
            text-align: center;
            padding: 3px 0;
        }
         #mouseMoverControlPanel #statusText {
            font-weight: bold;
        }
        #mouseMoverControlPanel #countdownText {
            font-style: italic;
            color: #c8ff00;
        }
    `);

    // --- 创建控制面板 ---
    const controlPanel = document.createElement('div');
    controlPanel.id = 'mouseMoverControlPanel';
    document.body.appendChild(controlPanel);

    const statusText = document.createElement('div');
    statusText.id = 'statusText';
    statusText.textContent = '状态: 已停止';
    controlPanel.appendChild(statusText);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleButton';
    toggleButton.textContent = '启动';
    controlPanel.appendChild(toggleButton);

    const countText = document.createElement('div');
    countText.id = 'countText';
    countText.textContent = `移动次数: ${moveCount}`;
    controlPanel.appendChild(countText);

    const countdownTextElement = document.createElement('div');
    countdownTextElement.id = 'countdownText';
    countdownTextElement.textContent = '下次移动: --:--';
    controlPanel.appendChild(countdownTextElement);

    const resetButton = document.createElement('button');
    resetButton.textContent = '重置计数';
    resetButton.style.backgroundColor = '#ff9800';
    resetButton.addEventListener('mouseover', () => resetButton.style.backgroundColor = '#e68a00');
    resetButton.addEventListener('mouseout', () => resetButton.style.backgroundColor = '#ff9800');
    controlPanel.appendChild(resetButton);


    // --- 功能函数 ---

    function moveMouse(x, y) {
        console.log(`[调试] moveMouse: 准备移动到 (${x}, ${y})`);
        const event = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            view: unsafeWindow // 修改: 使用 unsafeWindow 代替 window
        });
        try {
            let dispatchedOn = null;
            if (document.activeElement && document.activeElement !== document.body) {
                 // 尝试派发到当前活动元素，如果它不是 body
                document.activeElement.dispatchEvent(event);
                dispatchedOn = "document.activeElement";
            } else if (document.documentElement) {
                document.documentElement.dispatchEvent(event);
                dispatchedOn = "document.documentElement";
            } else if (document.body) { // 如果 documentElement 不存在，则尝试 body
                document.body.dispatchEvent(event);
                dispatchedOn = "document.body";
            }

            if (dispatchedOn) {
                console.log(`[调试] moveMouse: 鼠标移动事件已派发到 ${dispatchedOn} 到: (${x}, ${y})`);
                // 为了更明显地看到效果，可以临时添加一个视觉反馈，比如闪烁背景色
                // document.body.style.transition = 'background-color 0.1s ease-out';
                // const originalBg = document.body.style.backgroundColor;
                // document.body.style.backgroundColor = 'rgba(255,0,0,0.2)';
                // setTimeout(() => { document.body.style.backgroundColor = originalBg; }, 100);
            } else {
                 console.warn("[调试] moveMouse: 未找到合适的元素来派发鼠标事件。");
            }

        } catch (e) {
            console.error("[调试] moveMouse: 派发鼠标移动事件时出错:", e);
        }
    }

    function getRandomPosition() {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * window.innerHeight);
        return { x, y };
    }

    // 获取随机时间 (修改为5-10秒用于测试)
    function getRandomTime() {
        // 原来的: 5-10分钟 (300000 - 600000毫秒)
        // return Math.floor(Math.random() * (600000 - 300000 + 1)) + 300000;

        // 测试用: 5-10秒 (5000 - 10000毫秒)
        const randomShortTime = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
        console.log(`[调试] getRandomTime: 生成的随机延时为 ${randomShortTime} ms`);
        return randomShortTime;
    }

    function updateCountdownDisplay() {
        if (!isRunning || nextMoveTime <= 0) {
            countdownTextElement.textContent = '下次移动: --:--';
            return;
        }

        const now = Date.now();
        const timeLeftMs = nextMoveTime - now;

        if (timeLeftMs <= 0) {
            countdownTextElement.textContent = '下次移动: 即将...';
            return;
        }

        const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        countdownTextElement.textContent = `下次移动: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startMoving() {
        if (isRunning) {
            console.log('[调试] startMoving: 已在运行，无需再次启动。');
            return;
        }
        isRunning = true;
        statusText.textContent = '状态: 运行中';
        toggleButton.textContent = '停止';
        toggleButton.classList.add('stop');
        console.log('[调试] startMoving: 随机鼠标移动已启动');

        scheduleMove(); // 直接开始调度
    }

    function scheduleMove() {
        if (!isRunning) {
            console.log('[调试] scheduleMove: isRunning 为 false, 停止调度。');
            return;
        }

        const randomTimeDelay = getRandomTime();
        nextMoveTime = Date.now() + randomTimeDelay;
        console.log(`[调试] scheduleMove: 下一次移动操作将在 ${randomTimeDelay} ms (即 ${(randomTimeDelay / 1000).toFixed(1)} 秒) 后执行。`);

        if (countdownIntervalId) clearInterval(countdownIntervalId);
        countdownIntervalId = setInterval(updateCountdownDisplay, 1000);
        updateCountdownDisplay(); // 立即更新一次

        moveTimeoutId = setTimeout(() => {
            console.log('[调试] setTimeout 回调: 准备执行移动。');
            if (!isRunning) {
                console.log('[调试] setTimeout 回调: isRunning 为 false, 取消本次移动。');
                clearInterval(countdownIntervalId); // 确保倒计时也停止
                nextMoveTime = 0;
                updateCountdownDisplay();
                return;
            }

            const position = getRandomPosition();
            console.log(`[调试] setTimeout 回调: 获取到随机位置 (${position.x}, ${position.y})。`);
            moveMouse(position.x, position.y);
            moveCount++;
            GM_setValue('mouseMoveCount', moveCount);
            countText.textContent = `移动次数: ${moveCount}`;
            console.log(`[调试] setTimeout 回调: 移动次数更新为 ${moveCount}。`);

            if (isRunning) {
                console.log('[调试] setTimeout 回调: 准备调度下一次移动。');
                scheduleMove();
            } else {
                console.log('[调试] setTimeout 回调: isRunning 变为 false, 停止后续调度。');
                clearInterval(countdownIntervalId);
                nextMoveTime = 0;
                updateCountdownDisplay();
            }
        }, randomTimeDelay);
        console.log(`[调试] scheduleMove: setTimeout 已设置，ID: ${moveTimeoutId}`);
    }

    function stopMoving() {
        if (!isRunning) {
            console.log('[调试] stopMoving: 已停止，无需再次操作。');
            return;
        }
        isRunning = false;
        console.log(`[调试] stopMoving: 准备清除 setTimeout (ID: ${moveTimeoutId}) 和 setInterval (ID: ${countdownIntervalId})。`);
        clearTimeout(moveTimeoutId);
        clearInterval(countdownIntervalId);
        nextMoveTime = 0;
        statusText.textContent = '状态: 已停止';
        toggleButton.textContent = '启动';
        toggleButton.classList.remove('stop');
        updateCountdownDisplay();
        console.log('[调试] stopMoving: 随机鼠标移动已停止。');
    }

    function resetCounter() {
        if (confirm('确定要重置移动次数吗？')) {
            moveCount = 0;
            GM_setValue('mouseMoveCount', moveCount);
            countText.textContent = `移动次数: ${moveCount}`;
            console.log('[调试] resetCounter: 移动次数已重置。');
        }
    }

    // --- 事件监听 ---
    toggleButton.addEventListener('click', () => {
        if (isRunning) {
            stopMoving();
        } else {
            startMoving();
        }
    });

    resetButton.addEventListener('click', resetCounter);

    // 脚本加载时，默认是停止状态
    console.log('[调试] 脚本已加载并初始化。');

})();
