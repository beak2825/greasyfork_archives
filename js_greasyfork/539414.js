// ==UserScript==
// @name         抖音/Tiktok终极防护套件-视觉优化与强制防沉迷，对抗时间黑洞，节约生命
// @namespace    https://github.com/ZhuningS
// @version      3.1
// @description  综合反色模式/强制防沉迷/活动保护三合一系统 请关注Telegram新频道：https://t.me/ShareFreely2025
// @author       Arthur
// @license MIT
// @match        https://*.douyin.com/*
// @match        https://*.*tiktok.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539414/%E6%8A%96%E9%9F%B3Tiktok%E7%BB%88%E6%9E%81%E9%98%B2%E6%8A%A4%E5%A5%97%E4%BB%B6-%E8%A7%86%E8%A7%89%E4%BC%98%E5%8C%96%E4%B8%8E%E5%BC%BA%E5%88%B6%E9%98%B2%E6%B2%89%E8%BF%B7%EF%BC%8C%E5%AF%B9%E6%8A%97%E6%97%B6%E9%97%B4%E9%BB%91%E6%B4%9E%EF%BC%8C%E8%8A%82%E7%BA%A6%E7%94%9F%E5%91%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/539414/%E6%8A%96%E9%9F%B3Tiktok%E7%BB%88%E6%9E%81%E9%98%B2%E6%8A%A4%E5%A5%97%E4%BB%B6-%E8%A7%86%E8%A7%89%E4%BC%98%E5%8C%96%E4%B8%8E%E5%BC%BA%E5%88%B6%E9%98%B2%E6%B2%89%E8%BF%B7%EF%BC%8C%E5%AF%B9%E6%8A%97%E6%97%B6%E9%97%B4%E9%BB%91%E6%B4%9E%EF%BC%8C%E8%8A%82%E7%BA%A6%E7%94%9F%E5%91%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心配置（可修改）
    const CONFIG = {
        DAILY_LIMIT: 2500,      // 每日使用限制（秒）
        BREAK_TIME: 900,        // 强制休息时间（秒）
        CHECK_INTERVAL: 20000,   // 检测间隔（毫秒）
        AES_KEY: "DouyinSafe@2025"  // AES加密密钥
    };

    // 加密存储系统
    const encryptData = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.AES_KEY).toString();
    const decryptData = (cipher) => JSON.parse(CryptoJS.AES.decrypt(cipher, CONFIG.AES_KEY).toString(CryptoJS.enc.Utf8));

    // 状态管理器
    class StateManager {
        constructor() {
            this.state = this.loadState();
            this.lastActive = Date.now();
        }

        loadState() {
            const encrypted = GM_getValue('encryptedState', null);
            return encrypted ? decryptData(encrypted) : {
                totalTime: 0,
                lastDate: new Date().toDateString(),
                isDarkMode: true,
                blackToWhite: false
            };
        }

        saveState() {
            GM_setValue('encryptedState', encryptData(this.state));
        }

        checkDailyReset() {
            if (new Date().toDateString() !== this.state.lastDate) {
                this.state.totalTime = 0;
                this.state.lastDate = new Date().toDateString();
                this.saveState();
            }
        }
    }

    // 视觉控制系统
    class VisualSystem {
        constructor() {
            this.styleTag = document.createElement('style');
            document.head.appendChild(this.styleTag);
        }

        updateStyle(darkMode, blackToWhite) {
            let css = '';
            if (darkMode) {
                css = `html { filter: invert(1) hue-rotate(180deg) ${blackToWhite ? 'brightness(1.5)' : ''}; }
                    img,video,canvas { filter: invert(1) hue-rotate(180deg) !important; }`;
            }
            this.styleTag.textContent = css;
        }
    }

    // 防沉迷系统
    class AddictionPrevention {
        constructor(stateManager) {
            this.stateManager = stateManager;
            this.breakTimer = null;
            this.initListeners();
        }

        initListeners() {
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) this.stateManager.lastActive = Date.now();
            });
        }

        startMonitoring() {
            setInterval(() => {
                const currentTime = Date.now();
                const activeDuration = Math.floor((currentTime - this.stateManager.lastActive) / 1000);

                this.stateManager.state.totalTime += activeDuration;
                this.stateManager.lastActive = currentTime;
                this.stateManager.saveState();

                if (this.stateManager.state.totalTime >= CONFIG.DAILY_LIMIT) {
                    this.triggerBreak();
                }
            }, CONFIG.CHECK_INTERVAL);
        }

        triggerBreak() {
            document.body.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                    background:#1a1a1a;color:#fff;display:flex;align-items:center;
                    justify-content:center;font-size:24px;z-index:99999;">
                    <div style="text-align:center">
                        <h2>⏰ 健康提醒 ⏰</h2>
                        <p>已连续使用 ${CONFIG.DAILY_LIMIT/60} 分钟，请休息 ${CONFIG.BREAK_TIME/60} 分钟！</p>
                        <p>剩余休息时间：<span id="breakTimer">${CONFIG.BREAK_TIME}</span>秒</p>
                    </div>
                </div>
            `;

            let remaining = CONFIG.BREAK_TIME;
            this.breakTimer = setInterval(() => {
                remaining--;
                document.getElementById('breakTimer').textContent = remaining;
                if (remaining <= 0) {
                    clearInterval(this.breakTimer);
                    location.reload();
                }
            }, 1000);
        }
    }

    // 控制面板
    class ControlPanel {
        constructor(stateManager, visualSystem) {
            this.stateManager = stateManager;
            this.visualSystem = visualSystem;
            this.panel = this.createPanel();
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.style = `position:fixed;top:20px;right:20px;background:rgba(0,0,0,0.9);
                color:#fff;padding:15px;border-radius:8px;z-index:9999;font-family:Arial;`;

            this.createModeSwitch(panel);
            this.createTimeDisplay(panel);
            document.body.appendChild(panel);
            return panel;
        }

        createModeSwitch(container) {
            const modeBtn = document.createElement('button');
            modeBtn.style = 'margin:5px;padding:8px;border-radius:4px;cursor:pointer;';
            modeBtn.textContent = this.stateManager.state.isDarkMode ? '🌞 明亮模式' : '🌙 深色模式';

            modeBtn.onclick = () => {
                this.stateManager.state.isDarkMode = !this.stateManager.state.isDarkMode;
                this.visualSystem.updateStyle(
                    this.stateManager.state.isDarkMode,
                    this.stateManager.state.blackToWhite
                );
                modeBtn.textContent = this.stateManager.state.isDarkMode ? '🌞 明亮模式' : '🌙 深色模式';
                this.stateManager.saveState();
            };

            container.appendChild(modeBtn);
        }

        createTimeDisplay(container) {
            const timeDisplay = document.createElement('div');
            setInterval(() => {
                const remain = CONFIG.DAILY_LIMIT - this.stateManager.state.totalTime;
                timeDisplay.innerHTML = `今日已用：${Math.floor(this.stateManager.state.totalTime/60)}分钟<br>
                                        剩余时间：${Math.floor(remain/60)}分钟`;
            }, 1000);
            container.appendChild(timeDisplay);
        }
    }

    // 主程序
    const stateManager = new StateManager();
    const visualSystem = new VisualSystem();
    const preventionSystem = new AddictionPrevention(stateManager);
    stateManager.checkDailyReset();
    visualSystem.updateStyle(stateManager.state.isDarkMode, stateManager.state.blackToWhite);
    new ControlPanel(stateManager, visualSystem);
    preventionSystem.startMonitoring();

    // 注册调试命令
    GM_registerMenuCommand('重置计时', () => {
        stateManager.state.totalTime = 0;
        stateManager.saveState();
        location.reload();
    });

})();