// ==UserScript==
// @name         小鸟自动化脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动化小鸟躲避管道游戏的智能助手，支持移动端和桌面端
// @author       FlappyBird Bot
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNGRkQ3MDAiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgZmlsbD0iIzAwMCIvPgo8cGF0aCBkPSJNMjAgMTZMMjQgMjBMMjAgMjRWMTZaIiBmaWxsPSIjRkY4QzAwIi8+Cjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/539353/%E5%B0%8F%E9%B8%9F%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/539353/%E5%B0%8F%E9%B8%9F%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 小鸟自动化机器人类
    class FlappyBirdBot {
        constructor() {
            this.isRunning = false;
            this.gameCanvas = null;
            this.bird = null;
            this.pipes = [];
            this.score = 0;
            this.gameSpeed = 120; // FPS - 提高检测频率
            this.jumpThreshold = 0.3; // 跳跃阈值
        }

        // 初始化机器人
        init() {
            this.findGameCanvas();
            if (this.gameCanvas) {
                this.setupEventListeners();
                this.startBot();
                console.log('🤖 小鸟自动化脚本已启动！');
            }
        }

        // 查找游戏画布
        findGameCanvas() {
            // 查找常见的游戏画布选择器
            const selectors = [
                'canvas#gameCanvas',
                'canvas[id*="game"]',
                'canvas[class*="game"]',
                '#game canvas',
                '.game canvas',
                'canvas'
            ];

            for (let selector of selectors) {
                const canvas = document.querySelector(selector);
                if (canvas) {
                    this.gameCanvas = canvas;
                    break;
                }
            }
        }

        // 设置事件监听器
        setupEventListeners() {
            // 检测是否为移动设备
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            
            if (isMobile) {
                // 移动端：监听触摸事件
                document.addEventListener('touchstart', (e) => {
                    // 双击控制机器人开关
                    const now = Date.now();
                    if (this.lastTouchTime && now - this.lastTouchTime < 300) {
                        e.preventDefault();
                        if (!this.isRunning) {
                            this.startBot();
                        } else {
                            this.stopBot();
                        }
                    }
                    this.lastTouchTime = now;
                });
                
                // 防止页面滚动影响游戏
                document.addEventListener('touchmove', (e) => {
                    if (this.isRunning) {
                        e.preventDefault();
                    }
                }, { passive: false });
                
                console.log('📱 移动端事件监听器已设置（双击切换机器人状态）');
            } else {
                // 桌面端：监听键盘事件
                document.addEventListener('keydown', (e) => {
                    if (e.code === 'Space') {
                        e.preventDefault();
                        if (!this.isRunning) {
                            this.startBot();
                        } else {
                            this.stopBot();
                        }
                    }
                });
                
                console.log('🖥️ 桌面端事件监听器已设置（空格键切换机器人状态）');
            }

            // 添加控制面板
            this.createControlPanel();
        }

        // 创建控制面板
        createControlPanel() {
            const panel = document.createElement('div');
            panel.id = 'flappy-bot-panel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                z-index: 10000;
                min-width: 200px;
            `;

            panel.innerHTML = `
                <h3>🤖 小鸟自动化</h3>
                <div>状态: <span id="bot-status">待机</span></div>
                <div>得分: <span id="bot-score">0</span></div>
                <div>跳跃次数: <span id="jump-count">0</span></div>
                <button id="toggle-bot" style="margin-top: 10px; padding: 5px 10px;">启动机器人</button>
                <button id="reset-bot" style="margin-top: 5px; padding: 5px 10px;">重置游戏</button>
                <div style="margin-top: 10px;">
                    <label>灵敏度: </label>
                    <input type="range" id="sensitivity" min="0.1" max="0.8" step="0.1" value="0.3">
                </div>
            `;

            document.body.appendChild(panel);

            // 绑定按钮事件
            document.getElementById('toggle-bot').addEventListener('click', () => {
                if (this.isRunning) {
                    this.stopBot();
                } else {
                    this.startBot();
                }
            });

            document.getElementById('reset-bot').addEventListener('click', () => {
                this.resetGame();
            });

            document.getElementById('sensitivity').addEventListener('input', (e) => {
                this.jumpThreshold = parseFloat(e.target.value);
            });
        }

        // 启动机器人
        startBot() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            this.jumpCount = 0;
            this.updateStatus('运行中', 'green');
            document.getElementById('toggle-bot').textContent = '停止机器人';
            
            // 开始游戏循环
            this.gameLoop();
        }

        // 停止机器人
        stopBot() {
            this.isRunning = false;
            this.updateStatus('已停止', 'red');
            document.getElementById('toggle-bot').textContent = '启动机器人';
        }

        // 游戏主循环
        gameLoop() {
            if (!this.isRunning) return;

            try {
                // 首先检测游戏状态
                if (this.detectGameStatus()) {
                    // 如果检测到开始/重新开始状态，处理后继续
                    setTimeout(() => this.gameLoop(), 1000);
                    return;
                }
                
                this.analyzeGameState();
                this.makeDecision();
            } catch (error) {
                console.error('游戏分析错误:', error);
            }

            // 继续循环 - 优化性能，降低频率
            setTimeout(() => this.gameLoop(), 1000 / 30); // 30 FPS，降低CPU占用
        }

        // 分析游戏状态
        analyzeGameState() {
            if (!this.gameCanvas) return;

            const ctx = this.gameCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, this.gameCanvas.width, this.gameCanvas.height);
            
            // 检测小鸟和管道
            this.detectBird(imageData);
            this.detectPipes(imageData);
            
            // 更新调试信息
            const transitionY = this.detectColorTransition(imageData);
            if (transitionY && this.bird) {
                console.log(`🔍 小鸟位置: Y=${this.bird.y}, 交接线: Y=${transitionY}, 距离: ${Math.abs(this.bird.y - transitionY)}`);
            }
        }

        // 检测小鸟位置
        detectBird(imageData) {
            const { width, height, data } = imageData;
            
            // 查找黄色像素（假设小鸟是黄色的）- 简化检测
            for (let y = 0; y < height; y += 10) {
                for (let x = 0; x < width; x += 10) {
                    const index = (y * width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    
                    // 检测黄色范围
                    if (r > 200 && g > 150 && b < 100) {
                        this.bird = { x, y };
                        return;
                    }
                }
            }
        }

        // 检测绿色和淡黄色交接区域
        detectColorTransition(imageData) {
            const { width, height, data } = imageData;
            
            // 扫描画布寻找绿色和淡黄色的交接线 - 降低扫描精度以提高性能
            for (let y = height * 0.2; y < height * 0.9; y += 5) { // 增大步长降低精度
                let hasGreen = false;
                let hasLightYellow = false;
                
                for (let x = 0; x < width; x += 8) { // 增大步长降低精度
                    const index = (y * width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    
                    // 检测绿色 (更宽松的绿色范围)
                    if (g > 120 && r < 150 && b < 150 && g > r && g > b) {
                        hasGreen = true;
                    }
                    
                    // 检测淡黄色 (浅黄色到黄绿色过渡)
                    if (r > 180 && g > 160 && b < 120 && r > b && g > b) {
                        hasLightYellow = true;
                    }
                }
                
                // 如果这一行同时包含绿色和淡黄色，认为是交接区域
                if (hasGreen && hasLightYellow) {
                    return y;
                }
            }
            
            return null;
        }

        // 检测游戏状态（开始/重新开始）
        detectGameStatus() {
            // 检查页面上 id="status" 的DOM元素来获取当前游戏状态文本
            const statusElement = document.getElementById('status');
            let statusText = '';
            
            if (statusElement) {
                statusText = statusElement.innerText || statusElement.textContent || '';
            } else {
                // 如果没有找到status元素，检测页面中的文本内容
                statusText = document.body.innerText || document.body.textContent || '';
            }
            
            // 重启游戏状态 → 自动重启
            const needRestart = statusText === '🔄 重新开始' ||
                               statusText === '点击开始' ||
                               statusText === '💥 撞到管道' ||
                               statusText.includes('重新开始') || 
                               statusText.includes('重新') || 
                               statusText.includes('再来一次') ||
                               statusText.includes('撞到管道') ||
                               statusText.includes('Game Over') ||
                               statusText.includes('restart') || 
                               statusText.includes('Restart') || 
                               statusText.includes('RESTART') ||
                               statusText.includes('start') || 
                               statusText.includes('Start') || 
                               statusText.includes('START') ||
                               statusText.includes('play') || 
                               statusText.includes('Play') || 
                               statusText.includes('PLAY');
            
            if (needRestart) {
                console.log(`🎮 检测到游戏状态: ${statusText}`);
                this.handleGameRestart();  // 执行重启逻辑
                return true;
            }
            
            return false;
        }

        // 重启游戏的具体实现：handleGameRestart()
        // 采用多重保险策略，确保游戏能够成功重启
        handleGameRestart() {
            // 1. 立即尝试点击游戏区域和按空格
            this.clickGameAreaAndSpace();
            
            // 2. 50ms后再次尝试
            setTimeout(() => {
                this.clickGameAreaAndSpace();
            }, 50);
            
            // 3. 100ms后尝试查找并点击重启按钮
            setTimeout(() => {
                this.clickRestartButton();
            }, 100);
            
            // 4. 200ms后最后一次尝试点击游戏区域
            setTimeout(() => {
                this.clickGameAreaAndSpace();
            }, 200);
        }
        
        // 点击游戏区域并按空格键的组合操作
        clickGameAreaAndSpace() {
            // 检测是否为移动设备
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            
            // 尝试点击游戏画布
            if (this.gameCanvas) {
                const rect = this.gameCanvas.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                if (isMobile) {
                    // 移动端：触摸事件
                    this.simulateTouchClick(this.gameCanvas, centerX, centerY);
                } else {
                    // 桌面端：鼠标事件
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        clientX: centerX,
                        clientY: centerY
                    });
                    
                    this.gameCanvas.click();
                    this.gameCanvas.dispatchEvent(clickEvent);
                    
                    // 同时按空格键
                    const spaceEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: ' ',
                        code: 'Space'
                    });
                    document.dispatchEvent(spaceEvent);
                }
                console.log('🎯 点击游戏画布中心并触发空格键');
            } else {
                // 如果没有画布，尝试点击页面中心
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                
                if (isMobile) {
                    // 移动端：触摸页面中心
                    const element = document.elementFromPoint(centerX, centerY);
                    if (element) {
                        this.simulateTouchClick(element, centerX, centerY);
                    }
                } else {
                    // 桌面端：鼠标点击和空格键
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        clientX: centerX,
                        clientY: centerY
                    });
                    
                    document.elementFromPoint(centerX, centerY)?.click();
                    
                    // 按空格键
                    const spaceEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: ' ',
                        code: 'Space'
                    });
                    document.dispatchEvent(spaceEvent);
                }
                console.log('🎯 点击页面中心并触发空格键');
            }
        }
        
        // 点击重新开始按钮
        clickRestartButton() {
            const restartSelectors = [
                'button:contains("重新开始")',
                'button:contains("重新")',
                'button:contains("再来一次")',
                'button:contains("restart")',
                'button:contains("Restart")',
                'button:contains("RESTART")',
                '[class*="restart"]',
                '[id*="restart"]',
                '[class*="again"]',
                '[id*="again"]',
                '[class*="start"]',
                '[id*="start"]'
            ];
            
            // 尝试通过选择器找到按钮
            for (let selector of restartSelectors) {
                const button = document.querySelector(selector.replace(':contains', ''));
                if (button && (button.innerText.includes('重新') || 
                              button.innerText.includes('restart') || 
                              button.innerText.includes('Restart') ||
                              button.innerText.includes('开始') ||
                              button.innerText.includes('start') ||
                              button.innerText.includes('Start'))) {
                    button.click();
                    console.log('✅ 成功点击重新开始按钮');
                    return;
                }
            }
            
            // 如果找不到特定按钮，尝试点击画布或页面
            this.clickGameAreaAndSpace();
        }

        // 点击开始按钮（已整合到handleGameRestart方法中）
        clickStartButton() {
            // 直接调用重启处理方法，因为开始和重启逻辑相同
            this.handleGameRestart();
        }

        // 点击游戏区域（通用方法）- 已被clickGameAreaAndSpace方法替代
        clickGameArea() {
            // 直接调用增强版的点击方法
            this.clickGameAreaAndSpace();
        }

        
        // 模拟触摸点击
        simulateTouchClick(element, x, y) {
            const touchStartEvent = new TouchEvent('touchstart', {
                bubbles: true,
                cancelable: true,
                touches: [new Touch({
                    identifier: 0,
                    target: element,
                    clientX: x,
                    clientY: y,
                    pageX: x,
                    pageY: y
                })]
            });
            
            const touchEndEvent = new TouchEvent('touchend', {
                bubbles: true,
                cancelable: true,
                changedTouches: [new Touch({
                    identifier: 0,
                    target: element,
                    clientX: x,
                    clientY: y,
                    pageX: x,
                    pageY: y
                })]
            });
            
            // 触发触摸事件
            element.dispatchEvent(touchStartEvent);
            setTimeout(() => {
                element.dispatchEvent(touchEndEvent);
            }, 50);
            
            // 备用点击事件
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            });
            element.dispatchEvent(clickEvent);
        }

        // 检测管道
        detectPipes(imageData) {
            const { width, height, data } = imageData;
            this.pipes = [];
            
            // 查找绿色像素（假设管道是绿色的）- 简化检测逻辑，只检测主要颜色
            for (let x = 0; x < width; x += 12) { // 进一步增大步长提高性能
                let topPipe = null;
                let bottomPipe = null;
                
                for (let y = 0; y < height; y += 12) {
                    const index = (y * width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    
                    // 检测绿色范围
                    if (g > 100 && r < 100 && b < 100) {
                        if (!topPipe) {
                            topPipe = y;
                        }
                        bottomPipe = y;
                    }
                }
                
                if (topPipe && bottomPipe) {
                    this.pipes.push({ x, top: topPipe, bottom: bottomPipe });
                }
            }
        }

        // 做出决策
        makeDecision() {
            if (!this.gameCanvas) return;
            
            const ctx = this.gameCanvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, this.gameCanvas.width, this.gameCanvas.height);
            
            // 检测绿色和淡黄色交接区域
            const transitionY = this.detectColorTransition(imageData);
            
            if (this.bird && transitionY) {
                // 如果小鸟位置接近或处于交接区域，执行跳跃
                const distanceToTransition = Math.abs(this.bird.y - transitionY);
                
                // 当小鸟距离交接线30像素以内时跳跃 - 适中的触发距离
                if (distanceToTransition <= 30) { // 调整到30像素平衡性能和准确性
                    // 添加防抖动机制，避免连续跳跃 - 增加防抖时间以降低跳跃频率
                    const now = Date.now();
                    if (!this.lastColorJumpTime || now - this.lastColorJumpTime > 400) { // 增加到400ms降低频率
                        this.jump();
                        this.lastColorJumpTime = now;
                        console.log(`🎯 检测到颜色交接区域跳跃! 小鸟Y:${this.bird.y}, 交接线Y:${transitionY}`);
                    }
                    return;
                }
            }
            
            // 如果没有检测到小鸟或交接区域，使用备用逻辑
            if (!this.bird) {
                this.simpleJumpPattern();
                return;
            }
            
            // 备用管道检测逻辑
            if (this.pipes.length > 0) {
                const nearestPipe = this.pipes
                    .filter(pipe => pipe.x > this.bird.x)
                    .sort((a, b) => a.x - b.x)[0];

                if (nearestPipe) {
                    const gapCenter = (nearestPipe.top + nearestPipe.bottom) / 2;
                    const birdToPipeDistance = nearestPipe.x - this.bird.x;
                    const verticalDistance = this.bird.y - gapCenter;
                    
                    if (verticalDistance > this.jumpThreshold * 50 && birdToPipeDistance < 100) {
                        this.jump();
                    }
                }
            }
        }

        // 简单的跳跃模式（当无法检测游戏元素时）
        simpleJumpPattern() {
            // 每隔一定时间跳跃
            if (!this.lastJumpTime) this.lastJumpTime = Date.now();
            
            const now = Date.now();
            if (now - this.lastJumpTime > 800) { // 每800ms跳跃一次
                this.jump();
                this.lastJumpTime = now;
            }
        }

        // 执行跳跃
        jump() {
            if (!this.gameCanvas) return;
            
            // 检测是否为移动设备
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            
            if (isMobile) {
                // 移动端：使用触摸事件
                this.simulateTouchEvent();
            } else {
                // 桌面端：使用鼠标和键盘事件
                this.simulateDesktopEvent();
            }
            
            // 更新跳跃计数
            this.jumpCount++;
            document.getElementById('jump-count').textContent = this.jumpCount;
            
            console.log('🐦 执行跳跃!');
        }
        
        // 模拟移动端触摸事件
        simulateTouchEvent() {
            const rect = this.gameCanvas.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 创建触摸事件
            const touchStartEvent = new TouchEvent('touchstart', {
                bubbles: true,
                cancelable: true,
                touches: [new Touch({
                    identifier: 0,
                    target: this.gameCanvas,
                    clientX: centerX,
                    clientY: centerY,
                    pageX: centerX,
                    pageY: centerY
                })]
            });
            
            const touchEndEvent = new TouchEvent('touchend', {
                bubbles: true,
                cancelable: true,
                changedTouches: [new Touch({
                    identifier: 0,
                    target: this.gameCanvas,
                    clientX: centerX,
                    clientY: centerY,
                    pageX: centerX,
                    pageY: centerY
                })]
            });
            
            // 触发触摸事件
            this.gameCanvas.dispatchEvent(touchStartEvent);
            setTimeout(() => {
                this.gameCanvas.dispatchEvent(touchEndEvent);
            }, 50);
            
            // 同时尝试点击事件作为备用
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
            });
            this.gameCanvas.dispatchEvent(clickEvent);
            
            console.log('📱 执行移动端触摸跳跃');
        }
        
        // 模拟桌面端事件
        simulateDesktopEvent() {
            // 模拟点击或按键
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            
            const keyEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: ' ',
                code: 'Space'
            });
            
            // 尝试多种触发方式
            this.gameCanvas.dispatchEvent(clickEvent);
            document.dispatchEvent(keyEvent);
            
            console.log('🖥️ 执行桌面端跳跃');
        }

        // 重置游戏
        resetGame() {
            // 尝试找到重置按钮
            const resetSelectors = [
                'button[id*="reset"]',
                'button[class*="reset"]',
                'button[id*="restart"]',
                'button[class*="restart"]',
                'button[id*="start"]',
                'button[class*="start"]'
            ];
            
            for (let selector of resetSelectors) {
                const button = document.querySelector(selector);
                if (button) {
                    button.click();
                    break;
                }
            }
            
            // 重置计数器
            this.jumpCount = 0;
            this.score = 0;
            document.getElementById('jump-count').textContent = '0';
            document.getElementById('bot-score').textContent = '0';
        }

        // 更新状态显示
        updateStatus(status, color = 'white') {
            const statusElement = document.getElementById('bot-status');
            if (statusElement) {
                statusElement.textContent = status;
                statusElement.style.color = color;
            }
        }
    }

    // 等待页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => new FlappyBirdBot().init(), 1000);
        });
    } else {
        setTimeout(() => new FlappyBirdBot().init(), 1000);
    }

    // 导出到全局作用域以便调试
    window.FlappyBirdBot = FlappyBirdBot;
    
})();