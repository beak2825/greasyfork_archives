// ==UserScript==
// @name         起点阅读手柄控制
// @namespace    https://github.com/ended_world
// @version      1.1
// @license      MIT
// @description  在起点中文网使用游戏手柄控制阅读体验，支持章节切换、页面滚动等功能
// @author       ended_world
// @match        *://*.qidian.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545161/%E8%B5%B7%E7%82%B9%E9%98%85%E8%AF%BB%E6%89%8B%E6%9F%84%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/545161/%E8%B5%B7%E7%82%B9%E9%98%85%E8%AF%BB%E6%89%8B%E6%9F%84%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        scrollSpeed: 30,          // 滚动速度提升1.5倍（原20*1.5=30）
        deadZone: 0.3,            // 摇杆死区阈值
        pageScrollDuration: 500,  // 翻页动画持续时间(ms)
        vibrationDuration: 30,    // 按钮振动反馈持续时间(ms)
        panelAutoCloseTime: 5000, // 面板自动关闭时间(毫秒)
        chapterSwitchThreshold: 0.7 // 章节切换阈值
    };

    // 手柄状态
    let gamepadState = {
        connected: false,
        gamepad: null,
        prevButtons: [],
        prevAxes: [],
        panelVisible: false,
        panelTimeout: null,
        chapterSwitchCooldown: false // 章节切换冷却状态
    };

    // 初始化手柄连接
    function initGamepad() {
        window.addEventListener("gamepadconnected", (e) => {
            gamepadState.connected = true;
            gamepadState.gamepad = e.gamepad;
            gamepadState.prevButtons = new Array(e.gamepad.buttons.length).fill(false);
            gamepadState.prevAxes = new Array(e.gamepad.axes.length).fill(0);

            updateStatusIndicator();
            startGamepadLoop();
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            gamepadState.connected = false;
            gamepadState.panelVisible = false;
            updateStatusIndicator();
            updateInstructions();

            if (gamepadState.panelTimeout) {
                clearTimeout(gamepadState.panelTimeout);
                gamepadState.panelTimeout = null;
            }
        });
    }

    // 开始游戏手柄轮询
    function startGamepadLoop() {
        if (!gamepadState.connected) return;

        const gamepad = navigator.getGamepads()[gamepadState.gamepad.index];
        if (!gamepad) return;

        // 处理摇杆输入
        handleJoystickInput(gamepad);

        // 处理按钮输入
        handleButtonInput(gamepad);

        // 更新前一帧状态
        gamepadState.prevButtons = [...gamepad.buttons.map(b => b.pressed)];
        gamepadState.prevAxes = [...gamepad.axes];

        requestAnimationFrame(startGamepadLoop);
    }

    // 处理摇杆输入
    function handleJoystickInput(gamepad) {
        // 左摇杆 - 垂直滚动 (axes[1])
        const leftStickY = gamepad.axes[1];
        if (Math.abs(leftStickY) > config.deadZone) {
            const scrollAmount = leftStickY * config.scrollSpeed;
            window.scrollBy(0, scrollAmount);
        }

        // 左摇杆 - 水平控制章节切换 (axes[0])
        const leftStickX = gamepad.axes[0];
        if (Math.abs(leftStickX) > config.chapterSwitchThreshold && !gamepadState.chapterSwitchCooldown) {
            if (leftStickX < -config.deadZone) {
                navigateToPreviousChapter();
            } else if (leftStickX > config.deadZone) {
                navigateToNextChapter();
            }

            // 添加冷却时间防止连续触发
            gamepadState.chapterSwitchCooldown = true;
            setTimeout(() => {
                gamepadState.chapterSwitchCooldown = false;
            }, 500);
        }

        // 右摇杆 - 水平滚动 (axes[2])
        const rightStickX = gamepad.axes[2];
        if (Math.abs(rightStickX) > config.deadZone) {
            const scrollAmount = rightStickX * config.scrollSpeed;
            window.scrollBy(scrollAmount, 0);
        }
    }

    // 处理按钮输入
    function handleButtonInput(gamepad) {
        // 方向键上 - 向上翻页
        if (buttonPressed(gamepad, 12) && !gamepadState.prevButtons[12]) {
            scrollPage('up');
        }

        // 方向键下 - 向下翻页
        if (buttonPressed(gamepad, 13) && !gamepadState.prevButtons[13]) {
            scrollPage('down');
        }

        // A按钮 - 网页前进
        if (buttonPressed(gamepad, 0) && !gamepadState.prevButtons[0]) {
            window.history.forward();
            vibrate();
        }

        // B按钮 - 返回上一页
        if (buttonPressed(gamepad, 1) && !gamepadState.prevButtons[1]) {
            window.history.back();
            vibrate();
        }

        // X按钮 - 刷新页面
        if (buttonPressed(gamepad, 2) && !gamepadState.prevButtons[2]) {
            window.location.reload();
            vibrate();
        }

        // Y按钮 - 打开新标签页
        if (buttonPressed(gamepad, 3) && !gamepadState.prevButtons[3]) {
            window.open('', '_blank');
            vibrate();
        }

        // R1按钮（索引5）打开控制面板
        if (buttonPressed(gamepad, 5) && !gamepadState.prevButtons[5]) {
            toggleInstructionsPanel(true);
        }
    }

    // 导航到上一章
    function navigateToPreviousChapter() {
        const prevChapterBtn = document.querySelector('.nav-btn.relative');
        if (prevChapterBtn && prevChapterBtn.textContent.includes('上一章')) {
            prevChapterBtn.click();
            vibrate();
        }
    }

    // 导航到下一章
    function navigateToNextChapter() {
        const nextChapterBtn = document.querySelector('.nav-btn:not(.relative)');
        if (nextChapterBtn && nextChapterBtn.textContent.includes('下一章')) {
            nextChapterBtn.click();
            vibrate();
        }
    }

    // 检查按钮是否按下
    function buttonPressed(gamepad, buttonIndex) {
        return gamepad.buttons[buttonIndex]?.pressed || false;
    }

    // 翻页滚动
    function scrollPage(direction) {
        const currentPosition = window.scrollY;
        const pageHeight = window.innerHeight;
        const targetPosition = direction === 'down' ?
            currentPosition + pageHeight :
            Math.max(0, currentPosition - pageHeight);

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        vibrate();
    }

    // 手柄振动反馈
    function vibrate() {
        if (gamepadState.gamepad && gamepadState.gamepad.vibrationActuator) {
            gamepadState.gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: config.vibrationDuration,
                weakMagnitude: 0.8,
                strongMagnitude: 0.5
            });
        }
    }

    // 创建状态指示器
    function createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'gamepad-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #4CAF50;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
            z-index: 10000;
            transition: all 0.3s;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0.8;
        `;
        indicator.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2"/>
                <path d="M12 16V12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 8H12.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        document.body.appendChild(indicator);

        // 添加点击事件
        indicator.addEventListener('click', () => toggleInstructionsPanel(true));
    }

    // 切换控制面板显示状态
    function toggleInstructionsPanel(show) {
        if (!gamepadState.connected) return;

        gamepadState.panelVisible = show !== undefined ? show : !gamepadState.panelVisible;
        updateInstructions();

        if (gamepadState.panelTimeout) {
            clearTimeout(gamepadState.panelTimeout);
            gamepadState.panelTimeout = null;
        }

        if (gamepadState.panelVisible) {
            gamepadState.panelTimeout = setTimeout(() => {
                gamepadState.panelVisible = false;
                updateInstructions();
            }, config.panelAutoCloseTime);
        }
    }

    // 更新状态指示器
    function updateStatusIndicator() {
        const indicator = document.getElementById('gamepad-indicator');
        if (indicator) {
            indicator.style.display = gamepadState.connected ? 'flex' : 'none';
        }
    }

    // 创建控制说明
    function createInstructions() {
        const panel = document.createElement('div');
        panel.id = 'gamepad-instructions';
        panel.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 15px;
            font-family: "Microsoft YaHei", sans-serif;
            z-index: 9999;
            max-width: 280px;
            display: none;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.7);
            border: 2px solid #4CAF50;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease-out;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        `;

        panel.innerHTML = `
            <div style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 22px; color: #aaa; transition: color 0.2s;"
                 onmouseover="this.style.color='white'">×</div>
            <h3 style="margin:0 0 15px; color:#4CAF50; font-size:20px; border-bottom:1px solid #333; padding-bottom:10px; text-align:center;">
                起点阅读手柄控制
            </h3>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center;">
                <div style="background: #333; padding: 8px; border-radius: 8px; text-align: center;">
                    <div>←→</div>
                    <div style="font-size: 12px; color: #aaa;">左摇杆</div>
                </div>
                <div>切换章节</div>

                <div style="background: #333; padding: 8px; border-radius: 8px; text-align: center;">
                    <div>↑↓</div>
                    <div style="font-size: 12px; color: #aaa;">方向键</div>
                </div>
                <div>翻页</div>

                <div style="background: #333; padding: 8px; border-radius: 8px; text-align: center;">
                    <div>A</div>
                    <div style="font-size: 12px; color: #aaa;">按钮</div>
                </div>
                <div>前进</div>

                <div style="background: #333; padding: 8px; border-radius: 8px; text-align: center;">
                    <div>B</div>
                    <div style="font-size: 12px; color: #aaa;">按钮</div>
                </div>
                <div>后退</div>

                <div style="background: #333; padding: 8px; border-radius: 8px; text-align: center;">
                    <div>R1</div>
                    <div style="font-size: 12px; color: #aaa;">按钮</div>
                </div>
                <div>打开本面板</div>
            </div>
            <div style="margin-top:20px; padding-top:15px; border-top:1px solid #333; text-align:center; font-size:13px; color:#888;">
                面板将在5秒后自动关闭
            </div>
        `;

        document.body.appendChild(panel);

        // 添加关闭按钮事件
        panel.querySelector('div').addEventListener('click', () => {
            toggleInstructionsPanel(false);
        });
    }

    // 更新说明面板
    function updateInstructions() {
        const panel = document.getElementById('gamepad-instructions');
        if (panel) {
            if (gamepadState.panelVisible && gamepadState.connected) {
                panel.style.display = 'block';
                setTimeout(() => {
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(0) scale(1)';
                }, 10);
            } else {
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => {
                    panel.style.display = 'none';
                }, 300);
            }
        }
    }

    // 添加点击外部关闭面板的功能
    function setupDocumentClickListener() {
        document.addEventListener('click', (e) => {
            const indicator = document.getElementById('gamepad-indicator');
            const panel = document.getElementById('gamepad-instructions');

            if (panel && gamepadState.panelVisible &&
                e.target !== indicator &&
                e.target !== panel &&
                !panel.contains(e.target)) {
                toggleInstructionsPanel(false);
            }
        });
    }

    // 初始化
    function init() {
        initGamepad();
        createStatusIndicator();
        createInstructions();
        setupDocumentClickListener();

        // 定期检查连接状态
        setInterval(() => {
            updateStatusIndicator();
        }, 1000);
    }

    // 启动脚本
    init();
})();