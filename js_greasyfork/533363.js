// ==UserScript==
// @name         Threads Master Bot 2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  全功能 Threads 自動化腳本 - 支持智能滾動、愛心追蹤、多模式操作
// @match        https://www.threads.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533363/Threads%20Master%20Bot%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/533363/Threads%20Master%20Bot%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== 全局配置 ======
    const CONFIG = {
        AUTO_MODE: 'THREADS_AUTO_MODE',
        TARGETS: 'TARGET_POSTS',
        INDEX: 'CURRENT_INDEX',
        HOME_URL: 'HOME_URL',
        STATS: 'OPERATION_STATS',
        SCROLL: {
            MODES: ['mouse', 'key', 'touch', 'random'],
            BASE_DELAY: [1200, 2500],
            HUMAN_JITTER: 0.35
        },
        INTERACTION: {
            LIKE_RETRY: 3,
            FOLLOW_CHANCE: 0.65
        }
    };

    // ====== 系統狀態 ======
    let state = {
        active: false,
        currentTask: null,
        elements: {
            panel: null,
            logs: null,
            status: null
        }
    };

    // ====== 核心引擎 ======
    class ThreadsBot {
        constructor() {
            this.scrollHandler = this.scroll.bind(this);
            this.navigationHandler = this.handleNavigation.bind(this);
        }

        // 主控制流程
        async start() {
            state.active = true;
            this.setupListeners();
            await this.processPage();
        }

        stop() {
            state.active = false;
            this.removeListeners();
            this.updateStatus('已停止');
        }

        // 頁面類型判斷
        getPageType() {
            return window.location.pathname.includes('/post/') ? 'post' : 'home';
        }

        // 主要處理邏輯
        async processPage() {
            while(state.active) {
                try {
                    const pageType = this.getPageType();
                    this.updateStatus(`處理 ${pageType} 頁面`);

                    pageType === 'post' ? 
                        await this.handlePost() : 
                        await this.handleHome();

                    await this.randomDelay(...CONFIG.SCROLL.BASE_DELAY);
                } catch(error) {
                    this.log(`系統錯誤: ${error.message}`, 'error');
                    await this.safeNavigate('home');
                }
            }
        }

        // 貼文處理
        async handlePost() {
            await this.untilDOMReady();
            
            // 愛心互動
            const likeSuccess = await this.interactLike();
            if(!likeSuccess) return;

            // 追蹤作者
            if(Math.random() < CONFIG.INTERACTION.FOLLOW_CHANCE) {
                await this.interactFollow();
            }

            // 智能停留
            await this.engageContent();

            // 返回首頁
            await this.safeNavigate('home');
        }

        // 首頁處理
        async handleHome() {
            await this.untilDOMReady();
            
            // 隨機互動
            if(Math.random() < 0.4) {
                await this.randomBrowse();
            }

            // 導向目標
            await this.navigateToTarget();
        }

        // ====== 互動模組 ======
        async interactLike() {
            const selectors = [
                'button[aria-label="喜歡"][role="switch"]',
                'button[data-testid="like-button"]',
                'div[role="button"][aria-label*="Like"]'
            ];

            for(let attempt = 1; attempt <= CONFIG.INTERACTION.LIKE_RETRY; attempt++) {
                try {
                    const button = this.findElement(selectors);
                    if(!button) throw new Error('找不到愛心按鈕');

                    const isLiked = button.getAttribute('aria-pressed') === 'true';
                    if(isLiked) {
                        this.log('已點過愛心，跳過');
                        return true;
                    }

                    this.simulateHumanClick(button);
                    this.log(`❤️ 愛心點擊成功 (第 ${attempt} 次嘗試)`);
                    return true;
                } catch(error) {
                    this.log(`愛心失敗: ${error.message} (${attempt}/${CONFIG.INTERACTION.LIKE_RETRY})`, 'warn');
                    await this.randomDelay(2000, 4000);
                }
            }
            return false;
        }

        async interactFollow() {
            const followButton = this.findElement([
                'button:has(div > div > span:contains("追蹤"))',
                'button[aria-label^="Follow "]'
            ]);

            if(followButton && !followButton.textContent.includes('已追蹤')) {
                this.simulateHumanClick(followButton);
                this.log('✅ 成功追蹤作者');
                this.updateStats('follows');
            }
        }

        // ====== 滾動系統 ======
        async scroll(mode = 'random') {
            const effectiveMode = mode === 'random' ? 
                CONFIG.SCROLL.MODES[Math.floor(Math.random()*3)] : 
                mode;

            const distance = this.calculateScrollDistance();
            this.log(`啟用 ${effectiveMode} 滾動模式 (${distance}px)`);

            switch(effectiveMode) {
                case 'mouse':
                    await this.scrollByMouse(distance);
                    break;
                case 'key':
                    await this.scrollByKeys(distance);
                    break;
                case 'touch':
                    await this.scrollByTouch(distance);
                    break;
            }

            this.addHumanNoise();
        }

        async scrollByMouse(distance) {
            const steps = this.calculateSteps(distance);
            for(let i = 0; i < steps; i++) {
                window.scrollBy({
                    top: distance / steps * (Math.random() > 0.2 ? 1 : -1),
                    behavior: 'smooth'
                });
                await this.randomDelay(80, 150);
            }
        }

        // ====== 導航系統 ======
        async safeNavigate(target) {
            const urlMap = {
                home: GM_getValue(CONFIG.HOME_URL, window.location.origin),
                next: this.getNextTarget()
            };

            this.log(`導航至 ${target}...`);
            window.location.href = urlMap[target];
            await this.untilDOMReady();
        }

        // ====== 工具方法 ======
        simulateHumanClick(element) {
            const rect = element.getBoundingClientRect();
            element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            element.dispatchEvent(new MouseEvent('mousedown', { 
                clientX: rect.left + rect.width/2,
                clientY: rect.top + rect.height/2
            }));
            element.click();
            element.dispatchEvent(new MouseEvent('mouseup'));
        }

        calculateScrollDistance() {
            const viewport = window.innerHeight;
            return Math.floor(viewport * (0.3 + Math.random()*0.4));
        }

        randomDelay(min, max) {
            const delay = Math.random()*(max - min) + min;
            return new Promise(r => setTimeout(r, delay));
        }

        // ====== UI 控制面板 ======
        initControlPanel() {
            const panel = document.createElement('div');
            // ... 完整UI初始化代码 ...
            document.body.appendChild(panel);
        }

        updateStatus(text) {
            if(state.elements.status) {
                state.elements.status.textContent = `狀態: ${text}`;
            }
        }

        log(message, type = 'info') {
            const logEntry = document.createElement('div');
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logEntry.className = `log-${type}`;
            state.elements.logs.appendChild(logEntry);
        }
    }

    // ====== 啟動程序 ======
    function initialize() {
        GM_addStyle(`
            .threads-bot-panel {
                /* 樣式細節 */
            }
        `);

        const bot = new ThreadsBot();
        bot.initControlPanel();

        if(GM_getValue(CONFIG.AUTO_MODE, false)) {
            bot.start();
        }
    }

    // 頁面加載完成後執行
    window.addEventListener('load', initialize);
    // SPA 路由監聽
    window.addEventListener('popstate', () => {
        if(GM_getValue(CONFIG.AUTO_MODE)) {
            new ThreadsBot().processPage();
        }
    });
})();