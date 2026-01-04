// ==UserScript==
// @name         小鸟不带弹窗
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  自动化小鸟躲避管道游戏的智能助手，支持移动端和桌面端，新增全局控制面板
// @author       FlappyBird Bot
// @match        *://*/*
// @match        http://*/*
// @match        https://*/*
// @match        file://*/*
// @grant        none
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNGRkQ3MDAiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgZmlsbD0iIzAwMCIvPgo8cGF0aCBkPSJNMjAgMTZMMjQgMjBMMjAgMjRWMTZaIiBmaWxsPSIjRkY4QzAwIi8+Cjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/540756/%E5%B0%8F%E9%B8%9F%E4%B8%8D%E5%B8%A6%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/540756/%E5%B0%8F%E9%B8%9F%E4%B8%8D%E5%B8%A6%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 全局自动化控制器类
    class GlobalAutomationController {
        constructor() {
            this.isRunning = false;
            this.logs = [];
            this.maxLogs = 50;
            this.checkInterval = null;
            this.targetUrl = 'https://roobotcode.zxca.me/index.php?Uponm=ok';
            this.getLinkUrl = 'http://192.168.1.7:8080/get-link';
            this.signalUrl = 'http://192.168.1.7:8081/signal';
            
            // 从本地存储恢复状态
            this.loadState();
            
            // 创建控制面板
            this.createControlPanel();
            
            // 如果之前在运行状态，自动恢复
            if (this.isRunning) {
                this.addLog('检测到之前的运行状态，自动恢复运行', 'info');
                this.startAutomation();
            }
        }
        
        // 保存状态到本地存储
        saveState() {
            const state = {
                isRunning: this.isRunning,
                logs: this.logs.slice(-20) // 只保存最近20条日志
            };
            localStorage.setItem('globalAutomationState', JSON.stringify(state));
        }
        
        // 从本地存储加载状态
        loadState() {
            try {
                const savedState = localStorage.getItem('globalAutomationState');
                if (savedState) {
                    const state = JSON.parse(savedState);
                    this.isRunning = state.isRunning || false;
                    this.logs = state.logs || [];
                }
            } catch (error) {
                console.error('加载状态失败:', error);
                this.logs = [];
            }
        }
        
        // 添加日志
        addLog(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = {
                time: timestamp,
                message: message,
                type: type
            };
            
            this.logs.push(logEntry);
            
            // 限制日志数量
            if (this.logs.length > this.maxLogs) {
                this.logs = this.logs.slice(-this.maxLogs);
            }
            
            // 更新日志显示
            this.updateLogDisplay();
            
            // 保存状态
            this.saveState();
            
            // 输出到控制台
            console.log(`[${timestamp}] ${message}`);
        }
        
        // 创建控制面板
        createControlPanel() {
            // 检查是否已存在面板，避免重复创建
            if (document.getElementById('global-automation-panel')) {
                console.log('控制面板已存在，跳过创建');
                return;
            }
            
            // 创建主容器
            const panel = document.createElement('div');
            panel.id = 'global-automation-panel';
            panel.innerHTML = `
                <div class="panel-header">
                    <span>🤖 全局自动化控制器 v2.4</span>
                    <button id="panel-minimize">−</button>
                </div>
                <div class="panel-content">
                    <div class="button-group">
                        <button id="start-automation" class="btn btn-start">开始</button>
                        <button id="stop-automation" class="btn btn-stop">关闭</button>
                        <button id="toggle-logs" class="btn btn-logs">日志</button>
                    </div>
                    <div class="status-display">
                        <span id="status-text">状态: 已停止</span>
                    </div>
                    <div id="log-container" class="log-container" style="display: none;">
                        <div class="log-header">
                            <span>运行日志</span>
                            <button id="clear-logs" class="btn-small">清空</button>
                        </div>
                        <div id="log-content" class="log-content"></div>
                    </div>
                </div>
            `;
            
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                #global-automation-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 300px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    z-index: 999999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: white;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                }
                
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px 12px 0 0;
                    font-weight: bold;
                    font-size: 14px;
                    cursor: move;
                }
                
                #panel-minimize {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #panel-minimize:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                .panel-content {
                    padding: 16px;
                }
                
                .button-group {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                
                .btn {
                    flex: 1;
                    padding: 10px 12px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                }
                
                .btn-start {
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                }
                
                .btn-start:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
                }
                
                .btn-stop {
                    background: linear-gradient(135deg, #f44336, #da190b);
                    color: white;
                }
                
                .btn-stop:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
                }
                
                .btn-logs {
                    background: linear-gradient(135deg, #2196F3, #0b7dda);
                    color: white;
                }
                
                .btn-logs:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
                }
                
                .status-display {
                    text-align: center;
                    padding: 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 6px;
                    font-size: 12px;
                    margin-bottom: 12px;
                }
                
                .log-container {
                    background: rgba(0,0,0,0.3);
                    border-radius: 8px;
                    max-height: 200px;
                    overflow: hidden;
                }
                
                .log-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    background: rgba(255,255,255,0.1);
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .btn-small {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 10px;
                }
                
                .btn-small:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                .log-content {
                    max-height: 150px;
                    overflow-y: auto;
                    padding: 8px;
                    font-size: 11px;
                    line-height: 1.4;
                }
                
                .log-entry {
                    margin-bottom: 4px;
                    padding: 4px 6px;
                    border-radius: 4px;
                    background: rgba(255,255,255,0.05);
                }
                
                .log-entry.info {
                    border-left: 3px solid #2196F3;
                }
                
                .log-entry.success {
                    border-left: 3px solid #4CAF50;
                }
                
                .log-entry.error {
                    border-left: 3px solid #f44336;
                }
                
                .log-entry.warn {
                    border-left: 3px solid #FF9800;
                }
                
                .log-time {
                    color: rgba(255,255,255,0.7);
                    font-size: 10px;
                }
                
                /* 移动端适配 */
                @media (max-width: 768px) {
                    #global-automation-panel {
                        width: 280px;
                        top: 10px;
                        right: 10px;
                    }
                    
                    .btn {
                        padding: 12px;
                        font-size: 11px;
                    }
                }
                
                /* 最小化状态 */
                #global-automation-panel.minimized .panel-content {
                    display: none;
                }
                
                #global-automation-panel.minimized {
                    width: auto;
                }
            `;
            
            document.head.appendChild(style);
            
            // 确保DOM准备就绪后再添加面板
            const addPanelToDOM = () => {
                if (document.body) {
                    document.body.appendChild(panel);
                    
                    // 绑定事件
                    this.bindEvents();
                    
                    // 更新状态显示
                    this.updateStatusDisplay();
                    
                    // 使面板可拖拽
                    this.makeDraggable(panel);
                    
                    // 添加调试信息
                    console.log('✅ 全局控制面板已成功创建并添加到页面');
                    this.addLog('控制面板已加载', 'success');
                    
                    // 每次控制面板加载时，进行3次URL检测
                    this.performInitialUrlCheck();
                } else {
                    // 如果body还没准备好，等待一下再试
                    setTimeout(addPanelToDOM, 100);
                }
            };
            
            addPanelToDOM();
        }
        
        // 绑定事件
        bindEvents() {
            // 开始按钮
            document.getElementById('start-automation').addEventListener('click', () => {
                this.startAutomation();
            });
            
            // 停止按钮
            document.getElementById('stop-automation').addEventListener('click', () => {
                this.stopAutomation();
            });
            
            // 日志按钮
            document.getElementById('toggle-logs').addEventListener('click', () => {
                this.toggleLogs();
            });
            
            // 清空日志按钮
            document.getElementById('clear-logs').addEventListener('click', () => {
                this.clearLogs();
            });
            
            // 最小化按钮
            document.getElementById('panel-minimize').addEventListener('click', () => {
                this.toggleMinimize();
            });
        }
        
        // 开始自动化
        startAutomation() {
            if (this.isRunning) {
                this.addLog('自动化已在运行中', 'warn');
                return;
            }
            
            this.isRunning = true;
            this.saveState();
            this.updateStatusDisplay();
            this.addLog('开始自动化流程', 'success');
            
            // 开始第一次循环
            this.runCycle();
        }
        
        // 停止自动化
        stopAutomation() {
            this.isRunning = false;
            this.saveState();
            
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
            
            this.updateStatusDisplay();
            this.addLog('自动化已停止', 'info');
        }
        
        // 运行一个完整的循环
        async runCycle() {
            if (!this.isRunning) return;
            
            try {
                // 1. 获取链接
                this.addLog('正在获取新链接...', 'info');
                const link = await this.fetchLink();
                
                if (!link) {
                    this.addLog('获取链接失败，5秒后重试', 'error');
                    setTimeout(() => this.runCycle(), 5000);
                    return;
                }
                
                this.addLog(`获取到链接: ${link}`, 'success');
                
                // 2. 在当前标签页打开链接
                this.addLog('正在跳转到新页面...', 'info');
                window.location.href = link;
                
                // 3. 开始监控URL变化
                this.startUrlMonitoring();
                
            } catch (error) {
                this.addLog(`运行循环出错: ${error.message}`, 'error');
                setTimeout(() => this.runCycle(), 5000);
            }
        }
        
        // 获取链接
        async fetchLink() {
            try {
                const response = await fetch(this.getLinkUrl);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                
                return data.link;
                
            } catch (error) {
                this.addLog(`获取链接失败: ${error.message}`, 'error');
                return null;
            }
        }
        
        // 控制面板加载时进行3次URL检测
        async performInitialUrlCheck() {
            const currentUrl = window.location.href;
            
            // 检查当前URL是否包含 Uponm=ok 参数
            if (currentUrl.includes('Uponm=ok')) {
                this.addLog('检测到目标URL（包含Uponm=ok），准备发送完成信号...', 'success');
                
                // 进行3次检测确认
                let confirmCount = 0;
                const maxConfirms = 3;
                
                const confirmCheck = setInterval(() => {
                    confirmCount++;
                    const checkUrl = window.location.href;
                    
                    if (checkUrl.includes('Uponm=ok')) {
                        this.addLog(`第${confirmCount}次确认检测到目标URL`, 'info');
                        
                        if (confirmCount >= maxConfirms) {
                            clearInterval(confirmCheck);
                            this.addLog('3次检测确认完成，发送完成信号...', 'success');
                            this.sendCompletionSignal();
                        }
                    } else {
                        this.addLog(`第${confirmCount}次检测未发现目标URL`, 'warn');
                        clearInterval(confirmCheck);
                    }
                }, 500); // 每500ms检测一次
                
                // 5秒后自动停止检测
                setTimeout(() => {
                    clearInterval(confirmCheck);
                }, 5000);
            }
        }
        
        // 开始监控URL变化
        startUrlMonitoring() {
            this.addLog('开始监控页面URL变化...', 'info');
            
            // 清除之前的监控
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
            }
            
            // 每秒检查一次URL
            this.checkInterval = setInterval(() => {
                if (!this.isRunning) {
                    clearInterval(this.checkInterval);
                    return;
                }
                
                const currentUrl = window.location.href;
                
                // 检查URL是否包含 Uponm=ok 参数
                if (currentUrl.includes('Uponm=ok')) {
                    this.addLog('检测到目标URL（包含Uponm=ok），发送完成信号...', 'success');
                    clearInterval(this.checkInterval);
                    this.sendCompletionSignal();
                }
                
                // 检查是否到达特定的roobotcode网页
                if (currentUrl.includes('https://roobotcode.zxca.me/index.php') && 
                    currentUrl.includes('TGID=6686682773') &&
                    currentUrl.includes('Time=1751630465') &&
                    currentUrl.includes('Backid=1697') &&
                    currentUrl.includes('Fromid=yfpg') &&
                    currentUrl.includes('Singkey=e9d2d23f13f635f062251b349603a305')) {
                    this.addLog(`🎯 检测到特定roobotcode页面: ${currentUrl}`, 'success');
                    this.sendCompletionSignal();
                    // 立即获取新链接
                    setTimeout(() => {
                        this.fetchLink();
                    }, 500);
                }
            }, 1000);
        }
        
        // 发送完成信号
        async sendCompletionSignal() {
            try {
                const response = await fetch(this.signalUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    this.addLog('完成信号发送成功', 'success');
                    this.addLog(`服务器响应: ${result.message || 'OK'}`, 'info');
                } else {
                    this.addLog(`完成信号发送失败: HTTP ${response.status}`, 'error');
                }
                
            } catch (error) {
                this.addLog(`发送完成信号出错: ${error.message}`, 'error');
            }
            
            // 等待2秒后开始下一个循环
            setTimeout(() => {
                if (this.isRunning) {
                    this.addLog('开始下一个循环...', 'info');
                    this.runCycle();
                }
            }, 2000);
        }
        
        // 更新状态显示
        updateStatusDisplay() {
            const statusText = document.getElementById('status-text');
            if (statusText) {
                statusText.textContent = `状态: ${this.isRunning ? '运行中' : '已停止'}`;
                statusText.style.color = this.isRunning ? '#4CAF50' : '#f44336';
            }
        }
        
        // 切换日志显示
        toggleLogs() {
            const logContainer = document.getElementById('log-container');
            if (logContainer.style.display === 'none') {
                logContainer.style.display = 'block';
                this.updateLogDisplay();
            } else {
                logContainer.style.display = 'none';
            }
        }
        
        // 更新日志显示
        updateLogDisplay() {
            const logContent = document.getElementById('log-content');
            if (!logContent) return;
            
            const recentLogs = this.logs.slice(-20); // 显示最近20条日志
            
            logContent.innerHTML = recentLogs.map(log => `
                <div class="log-entry ${log.type}">
                    <span class="log-time">[${log.time}]</span>
                    <div>${log.message}</div>
                </div>
            `).join('');
            
            // 滚动到底部
            logContent.scrollTop = logContent.scrollHeight;
        }
        
        // 清空日志
        clearLogs() {
            this.logs = [];
            this.saveState();
            this.updateLogDisplay();
            this.addLog('日志已清空', 'info');
        }
        
        // 切换最小化
        toggleMinimize() {
            const panel = document.getElementById('global-automation-panel');
            panel.classList.toggle('minimized');
        }
        
        // 使面板可拖拽
        makeDraggable(element) {
            const header = element.querySelector('.panel-header');
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;
            
            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
            
            function dragStart(e) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                
                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                }
            }
            
            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    
                    xOffset = currentX;
                    yOffset = currentY;
                    
                    element.style.transform = `translate(${currentX}px, ${currentY}px)`;
                }
            }
            
            function dragEnd() {
                isDragging = false;
            }
        }
    }
    
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

            // 添加控制面板 - 已禁用
            // this.createControlPanel();
        }

        // 创建控制面板 - 已禁用弹窗显示
        createControlPanel() {
            // 控制面板已被禁用，不再显示弹窗
            // 保留灵敏度设置的默认值
            this.jumpThreshold = 0.3;
            console.log('🤖 小鸟自动化脚本已启动（无界面模式）');
        }

        // 启动机器人
        startBot() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            this.jumpCount = 0;
            this.updateStatus('运行中', 'green');
            
            // 开始游戏循环
            this.gameLoop();
        }

        // 停止机器人
        stopBot() {
            this.isRunning = false;
            this.updateStatus('已停止', 'red');
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
            console.log('🔄 游戏已重置');
        }

        // 更新状态显示 - 改为控制台输出
        updateStatus(status, color = 'white') {
            console.log(`🤖 机器人状态: ${status}`);
        }
    }

    // 强制启动函数
    function forceStart() {
        try {
            console.log('🚀 开始初始化全局自动化控制器...');
            
            // 启动全局自动化控制器
            if (!window.globalController) {
                window.globalController = new GlobalAutomationController();
                console.log('✅ 全局控制器已创建');
                
                // 立即开始URL监控
                window.globalController.startUrlMonitoring();
                console.log('🔍 URL监控已启动');
            } else {
                console.log('⚠️ 全局控制器已存在');
            }
            
            // 启动小鸟游戏机器人
            setTimeout(() => {
                try {
                    new FlappyBirdBot().init();
                    console.log('✅ 小鸟游戏机器人已启动');
                } catch (error) {
                    console.error('❌ 小鸟游戏机器人启动失败:', error);
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ 初始化失败:', error);
            // 如果失败，5秒后重试
            setTimeout(forceStart, 5000);
        }
    }
    
    // 多种启动方式确保兼容性
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceStart);
        // 备用启动
        setTimeout(forceStart, 2000);
    } else if (document.readyState === 'interactive') {
        setTimeout(forceStart, 100);
    } else {
        // 页面已完全加载
        forceStart();
    }
    
    // 额外的保险启动
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!document.getElementById('global-automation-panel')) {
                console.log('🔄 检测到控制面板未加载，尝试重新创建...');
                forceStart();
            }
        }, 1000);
    });
    
    // 手动启动函数（用于调试）
    window.manualStart = forceStart;

    // 导出到全局作用域以便调试
    window.FlappyBirdBot = FlappyBirdBot;
    window.GlobalAutomationController = GlobalAutomationController;
    
})();