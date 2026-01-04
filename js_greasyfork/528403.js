// ==UserScript==
// @name         红豆饭种子自动认领
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  红豆饭自动认领种子，带美化UI
// @author       bitptpt
// @match        *://*/userdetails.php*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528403/%E7%BA%A2%E8%B1%86%E9%A5%AD%E7%A7%8D%E5%AD%90%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/528403/%E7%BA%A2%E8%B1%86%E9%A5%AD%E7%A7%8D%E5%AD%90%E8%87%AA%E5%8A%A8%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建优化后的控制面板
    function createControlPanel() {
        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            .auto-claim-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                background: linear-gradient(135deg, #2b5876, #4e4376);
                border-radius: 10px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                color: white;
                font-family: Arial, sans-serif;
                padding: 15px;
                width: 220px;
                transition: all 0.3s ease;
                opacity: 0.95;
            }
            .auto-claim-panel:hover {
                opacity: 1;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            }
            .auto-claim-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
                text-align: center;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            .auto-claim-buttons {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
            }
            .auto-claim-btn {
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s;
                width: 45%;
                box-shadow: 0 3px 6px rgba(0,0,0,0.1);
            }
            .auto-claim-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 10px rgba(0,0,0,0.15);
            }
            .auto-claim-start {
                background-color: #4CAF50;
                color: white;
            }
            .auto-claim-start:disabled {
                background-color: #888;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            .auto-claim-stop {
                background-color: #f44336;
                color: white;
            }
            .auto-claim-status {
                background-color: rgba(0,0,0,0.2);
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                min-height: 20px;
                font-size: 14px;
            }
            .auto-claim-stats {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
                padding-top: 10px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }
            .auto-claim-stat {
                text-align: center;
                flex: 1;
            }
            .auto-claim-stat-value {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .auto-claim-stat-label {
                font-size: 12px;
                opacity: 0.8;
            }
            .auto-claim-footer {
                font-size: 11px;
                text-align: center;
                margin-top: 15px;
                opacity: 0.7;
            }
            .auto-claim-progress {
                height: 6px;
                background-color: rgba(255,255,255,0.2);
                border-radius: 3px;
                margin: 10px 0;
                overflow: hidden;
            }
            .auto-claim-progress-bar {
                height: 100%;
                background-color: #4CAF50;
                width: 0%;
                transition: width 0.3s ease;
            }
            .blink-status {
                animation: blink 1s linear infinite;
            }
            @keyframes blink {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // 创建面板
        const panel = document.createElement('div');
        panel.className = 'auto-claim-panel';

        panel.innerHTML = `
            <div class="auto-claim-title">自动认领工具</div>
            <div class="auto-claim-buttons">
                <button class="auto-claim-btn auto-claim-start">开始认领</button>
                <button class="auto-claim-btn auto-claim-stop">停止</button>
            </div>
            <div class="auto-claim-status">状态: 准备就绪</div>
            <div class="auto-claim-progress">
                <div class="auto-claim-progress-bar"></div>
            </div>
            <div class="auto-claim-stats">
                <div class="auto-claim-stat">
                    <div class="auto-claim-stat-value" id="claimed-count">0</div>
                    <div class="auto-claim-stat-label">已认领</div>
                </div>
                <div class="auto-claim-stat">
                    <div class="auto-claim-stat-value" id="remaining-count">0</div>
                    <div class="auto-claim-stat-label">待认领</div>
                </div>
            </div>
            <div class="auto-claim-footer">© 自动化认领工具 v1.2</div>
        `;

        document.body.appendChild(panel);

        return {
            panel,
            startButton: panel.querySelector('.auto-claim-start'),
            stopButton: panel.querySelector('.auto-claim-stop'),
            statusText: panel.querySelector('.auto-claim-status'),
            claimedCount: panel.querySelector('#claimed-count'),
            remainingCount: panel.querySelector('#remaining-count'),
            progressBar: panel.querySelector('.auto-claim-progress-bar')
        };
    }

    // 主要功能函数
    function initAutoClaimButtons() {
        let intervalId = null;
        let waitTime = 1000; // 初始等待时间1秒
        let currentState = 'idle'; // 状态：idle, claiming, waitingForPopup, confirmingPopup
        let running = false;
        let claimedCount = 0;
        let processingAnimation = null;

        const {
            startButton,
            stopButton,
            statusText,
            claimedCount: claimedCountElement,
            remainingCount: remainingCountElement,
            progressBar
        } = createControlPanel();

        // 更新认领统计
        function updateStats() {
            // 计算剩余可认领数量
            const remainingButtons = document.querySelectorAll('button[data-action="addClaim"][style*="display: flex"]').length;
            remainingCountElement.textContent = remainingButtons;

            // 更新进度条（如果有可认领按钮）
            const totalButtons = claimedCount + remainingButtons;
            if (totalButtons > 0) {
                const progress = (claimedCount / totalButtons) * 100;
                progressBar.style.width = `${progress}%`;
            }
        }

        // 点击认领按钮
        function clickClaimButton() {
            // 更新统计
            updateStats();

            // 寻找所有显示的认领按钮
            const claimButtons = document.querySelectorAll('button[data-action="addClaim"][style*="display: flex"]');

            if (claimButtons.length > 0) {
                currentState = 'claiming';
                statusText.textContent = `状态: 正在点击认领按钮...`;
                statusText.classList.add('blink-status');

                // 点击第一个可见的认领按钮
                claimButtons[0].click();

                // 等待确认弹窗出现
                currentState = 'waitingForPopup';
                waitTime = 500; // 短暂等待确认弹窗
            } else {
                statusText.textContent = `状态: 未找到认领按钮`;
                statusText.classList.remove('blink-status');
                waitTime = 1000; // 重置等待时间
            }
        }

        // 处理确认弹窗
        function handleConfirmPopup() {
            // 查找确认弹窗中的OK按钮
            const confirmButtons = document.querySelectorAll('.layui-layer-btn .layui-layer-btn0');

            if (confirmButtons.length > 0) {
                statusText.textContent = '状态: 确认认领中...';
                confirmButtons[0].click();
                claimedCount++;
                claimedCountElement.textContent = claimedCount;

                // 更新统计
                updateStats();

                // 确认完成后，设置状态为idle，短暂等待后继续寻找下一个认领按钮
                currentState = 'idle';
                waitTime = 1000; // 确认后等待1秒再继续
            } else {
                // 如果没找到确认按钮，可能弹窗未加载或已消失
                if (currentState === 'waitingForPopup') {
                    // 继续等待弹窗出现
                    waitTime = 300; // 短暂等待
                    statusText.textContent = '状态: 等待确认框出现...';
                } else {
                    // 重置状态
                    currentState = 'idle';
                    waitTime = 1000;
                }
            }
        }

        // 主循环函数
        function mainLoop() {
            if (!running) return;

            switch (currentState) {
                case 'idle':
                    clickClaimButton();
                    break;
                case 'waitingForPopup':
                case 'claiming':
                    handleConfirmPopup();
                    break;
                default:
                    currentState = 'idle';
            }

            // 设置下一次执行
            clearTimeout(intervalId);
            intervalId = setTimeout(mainLoop, waitTime);
        }

        // 开始自动点击
        startButton.addEventListener('click', function() {
            if (running) return;

            running = true;
            currentState = 'idle';
            statusText.textContent = '状态: 开始自动认领';
            startButton.disabled = true;

            // 更新初始统计
            updateStats();

            // 开始主循环
            mainLoop();

            // 定时更新统计信息
            processingAnimation = setInterval(updateStats, 2000);
        });

        // 停止自动点击
        stopButton.addEventListener('click', function() {
            if (intervalId) {
                clearTimeout(intervalId);
                intervalId = null;
            }

            if (processingAnimation) {
                clearInterval(processingAnimation);
                processingAnimation = null;
            }

            running = false;
            currentState = 'idle';
            startButton.disabled = false;
            statusText.textContent = '状态: 已停止';
            statusText.classList.remove('blink-status');
        });

        // 初始统计
        updateStats();
    }

    // 初始化
    if (window.location.href.includes('details.php') || window.location.href.includes('userdetails.php')) {
        // 确保页面完全加载后再初始化
        window.addEventListener('load', function() {
            setTimeout(initAutoClaimButtons, 500);
        });
    }
})();