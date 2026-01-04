// ==UserScript==
// @name         U校园自动挂机脚本 
// @namespace    https://github.com/Yishun3762/UnipusAutoScript
// @version      2.0.0
// @description  U校园挂机脚本。自动处理"长时间未操作"弹窗，保持学习时长有效计算。
// @author       AsagiYuumoya
// @match        *://*.unipus.cn/*
// @match        *://u.unipus.cn/*
// @match        *://ucontent.unipus.cn/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541003/U%E6%A0%A1%E5%9B%AD%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541003/U%E6%A0%A1%E5%9B%AD%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const CONFIG = {
        APP_NAME: 'U校园自动挂机',
        INACTIVITY_PROMPT_TEXT: '由于你长时间未操作，请点确定继续使用。',
        POPUP_CONFIRM_TEXT: '确定',
        DEFAULT_DURATION_MIN: 600,
    };

    // --- 日志 ---
    class Logger {
        constructor(prefix) {
            this.prefix = `[${prefix}]`;
        }
        log(...args) {
            console.log(this.prefix, ...args);
        }
        warn(...args) {
            console.warn(this.prefix, ...args);
        }
        error(...args) {
            console.error(this.prefix, ...args);
        }
    }

    // --- 挂机处理器 ---
    class InactivityHandler {
        constructor(logger) {
            this.logger = logger;
            this.observer = null;
            this.timer = null;
        }

        start() {
            const check = this._checkAndClick.bind(this);
            
            // 立即检查一次
            check();

            // 使用 MutationObserver 监视弹窗出现
            this.observer = new MutationObserver(check);
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            // 同时使用 setInterval 作为备用方案
            this.timer = setInterval(check, 2000); // 2秒检查一次

            this.logger.log('长时间未操作检测已启动。');
        }

        stop() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.logger.log('长时间未操作检测已停止。');
        }

        _checkAndClick() {
            try {
                const paragraphs = Array.from(document.querySelectorAll('p'));
                const targetNotice = paragraphs.find(p => p.textContent.includes(CONFIG.INACTIVITY_PROMPT_TEXT));

                if (!targetNotice) return;
                
                const container = targetNotice.closest('div');
                if (!container) return;

                // 查找按钮
                const button = container.querySelector('button[id^="_mask_notice_id_"]') ||
                               Array.from(container.querySelectorAll('button')).find(
                                   btn => btn.textContent.includes(CONFIG.POPUP_CONFIRM_TEXT)
                               );

                if (button) {
                    button.click();
                    this.logger.log('已自动点击按钮。');
                }
            } catch (e) {
                this.logger.error('处理未操作提示时出错:', e);
            }
        }
    }

    // --- UI面板 ---
    class UIPanel {
        constructor(appName, defaultDuration) {
            this.appName = appName;
            this.defaultDuration = defaultDuration;
            this.callbacks = {};
            this._injectCSS();
            this._createPanel();
            this._addEventListeners();
        }

        on(event, callback) {
            this.callbacks[event] = callback;
        }

        getDuration() {
            const duration = parseInt(this.durationInput.value, 10);
            return isNaN(duration) || duration < 1 ? this.defaultDuration : duration;
        }

        updateState({ isRunning, elapsedTime = 0, statusText }) {
            this.statusText.textContent = statusText;
            this.elapsedTime.textContent = elapsedTime;
            if (isRunning) {
                this.startBtn.textContent = '停止挂机';
                this.startBtn.classList.add('stop');
            } else {
                this.startBtn.textContent = '开始挂机';
                this.startBtn.classList.remove('stop');
            }
        }
        
        _injectCSS() {
            GM_addStyle(`
                #unipus-auto-panel {
                    position: fixed; top: 10px; right: 10px; background: rgba(255, 255, 255, 0.95);
                    border: 1px solid #ccc; border-radius: 8px; padding: 15px; z-index: 9999;
                    font-size: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease;
                    cursor: move; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }
                #unipus-auto-panel.minimized {
                    padding: 5px; width: auto; height: auto;
                }
                #unipus-auto-panel.minimized .controls { display: none; }
                #unipus-auto-panel h3 {
                    margin: 0 0 10px 0; font-size: 16px; user-select: none; display: flex;
                    justify-content: space-between; align-items: center; color: #333;
                }
                #unipus-auto-panel .toggle-btn {
                    cursor: pointer; margin-left: 10px; font-size: 20px; width: 22px; height: 22px;
                    line-height: 22px; text-align: center; color: #888;
                }
                #unipus-auto-panel .controls {
                    display: flex; flex-direction: column; gap: 10px;
                }
                #unipus-auto-panel input[type="number"] {
                    width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd;
                    border-radius: 4px;
                }
                #unipus-auto-panel button {
                    padding: 8px 12px; cursor: pointer; background: #28a745; color: white;
                    border: none; border-radius: 4px; font-size: 14px; transition: background 0.2s ease;
                }
                #unipus-auto-panel button:hover { background: #218838; }
                #unipus-auto-panel button.stop { background: #dc3545; }
                #unipus-auto-panel button.stop:hover { background: #c82333; }
                #unipus-auto-panel .status {
                    margin-top: 8px; font-size: 12px; color: #555; line-height: 1.5;
                }
                #unipus-auto-panel .elapsed { font-weight: bold; color: #28a745; }
            `);
        }

        _createPanel() {
            const panel = document.createElement('div');
            panel.id = 'unipus-auto-panel';
            panel.innerHTML = `
                <h3>
                    <span class="title">${this.appName}</span>
                    <span class="toggle-btn">-</span>
                </h3>
                <div class="controls">
                    <div>
                        <label for="duration">挂机时长(分钟):</label>
                        <input type="number" id="duration" min="1" value="${this.defaultDuration}">
                    </div>
                    <button id="start-btn">开始挂机</button>
                    <div class="status">
                        状态: <span id="status-text">未运行</span><br>
                        已挂机: <span id="elapsed-time" class="elapsed">0</span> 分钟
                    </div>
                </div>
            `;
            document.body.appendChild(panel);
            this.panel = panel;
            this.durationInput = panel.querySelector('#duration');
            this.startBtn = panel.querySelector('#start-btn');
            this.statusText = panel.querySelector('#status-text');
            this.elapsedTime = panel.querySelector('#elapsed-time');
        }

        _addEventListeners() {
            this.startBtn.addEventListener('click', () => {
                const isRunning = this.startBtn.classList.contains('stop');
                if (isRunning) {
                    this.callbacks.stop && this.callbacks.stop();
                } else {
                    this.callbacks.start && this.callbacks.start();
                }
            });

            const toggleBtn = this.panel.querySelector('.toggle-btn');
            toggleBtn.addEventListener('click', () => {
                this.panel.classList.toggle('minimized');
                toggleBtn.textContent = this.panel.classList.contains('minimized') ? '+' : '-';
            });
            
            this._makeDraggable();
        }

        _makeDraggable() {
            let isDragging = false;
            let offsetX, offsetY;

            const header = this.panel.querySelector('h3');
            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - this.panel.getBoundingClientRect().left;
                offsetY = e.clientY - this.panel.getBoundingClientRect().top;
                this.panel.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.panel.style.left = `${e.clientX - offsetX}px`;
                    this.panel.style.top = `${e.clientY - offsetY}px`;
                    this.panel.style.right = 'auto';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                this.panel.style.userSelect = 'auto';
            });
        }
    }

    // --- 主控制器 ---
    class MainController {
        constructor() {
            this.logger = new Logger(CONFIG.APP_NAME);
            this.inactivityHandler = new InactivityHandler(this.logger);
            this.uiPanel = new UIPanel(CONFIG.APP_NAME, CONFIG.DEFAULT_DURATION_MIN);
            
            this.isRunning = false;
            this.startTime = null;
            this.elapsedTimer = null;
            this.targetDuration = CONFIG.DEFAULT_DURATION_MIN;
        }

        init() {
            this.uiPanel.on('start', this.start.bind(this));
            this.uiPanel.on('stop', this.stop.bind(this));

            window.addEventListener('beforeunload', (e) => {
                if (this.isRunning) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });

            this.logger.log('脚本已加载并初始化。');
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            
            this.targetDuration = this.uiPanel.getDuration();
            this.startTime = new Date();

            this.inactivityHandler.start();
            
            // 每分钟更新一次UI时间
            this.elapsedTimer = setInterval(this._updateElapsedTime.bind(this), 60000);
            this._updateElapsedTime(); // 立即更新一次

            this.uiPanel.updateState({
                isRunning: true,
                statusText: '运行中'
            });
            
            this.logger.log(`挂机已启动, 目标时长: ${this.targetDuration}分钟`);
        }

        stop(reason = '用户手动停止') {
            if (!this.isRunning) return;
            this.isRunning = false;

            this.inactivityHandler.stop();

            clearInterval(this.elapsedTimer);
            this.elapsedTimer = null;
            this.startTime = null;

            this.uiPanel.updateState({
                isRunning: false,
                statusText: '未运行',
                elapsedTime: 0
            });
            
            this.logger.log(`挂机已停止。原因: ${reason}`);
        }

        _updateElapsedTime() {
            if (!this.startTime) return;
            
            const now = new Date();
            const elapsedMinutes = Math.floor((now - this.startTime) / 60000);
            
            this.uiPanel.updateState({
                isRunning: true,
                statusText: '运行中',
                elapsedTime: elapsedMinutes
            });

            if (elapsedMinutes >= this.targetDuration) {
                this.stop(`达到目标时长 ${this.targetDuration} 分钟`);
                alert(`已完成设定的挂机时长: ${this.targetDuration}分钟！`);
            }
        }
    }

    // --- 启动脚本 ---
    function bootstrap() {
        try {
            new MainController().init();
        } catch (e) {
            console.error(`[${CONFIG.APP_NAME}] 启动失败:`, e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

})();
