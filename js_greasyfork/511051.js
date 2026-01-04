// ==UserScript==
// @name         bilibili快捷键
// @name:en      bilibili shortcut
// @version      1.2.2
// @description  bilibili快捷键，按A聚焦弹幕输入框，按B重新开始播放视频，按G切换网页全屏模式，按R刷新推荐视频，按S聚焦搜索框，按T切换宽屏模式，按V隐藏/显示小窗口，首页按1-6点击推荐视频，自动30秒后点赞
// @description:en  press key 'A' to focus on the bullet chat input box, 'B' to replay video from the start, 'G' to toggle web full screen mode, 'R' to refresh recommended videos,'S' to focus on the search box, 'T' to toggle wide screen mode, 'V' to toggle mini window player display, home page 1-6 to click recommended videos, automatically like videos after 30 seconds
// @license      MIT
// @author       elgordo
// @match        https://www.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace    https://greasyfork.org/users/1375421
// @downloadURL https://update.greasyfork.org/scripts/511051/bilibili%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/511051/bilibili%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

const BilibiliShortcuts = (() => {
    // ==================== 配置常量 ====================
    const SELECTORS = {
        SEARCH_INPUT: location.href.includes('keyword') ? '.search-input-el' : '.nav-search-input',
        VIDEO_CONTAINER: '.video-toolbar-left',
        THUMB_BUTTON: '.video-like.video-toolbar-left-item',
        RECOMMEND_VIDEOS: '.bili-video-card__info--tit',
        VIDEO_ELEMENT: 'video',
        CONTROLS: {
            DANMAKU_INPUT: '.bpx-player-dm-input',
            WEB_FULLSCREEN: '.bpx-player-ctrl-web',
            WIDE_SCREEN: '.bpx-player-ctrl-wide',
            MINI_WINDOW: '.mini-player-window.fixed-sidenav-storage-item',
            REFRESH_BUTTON: '.primary-btn.roll-btn'
        }
    };

    const DEFAULT_CONFIG = {
        focus: { enabled: true, key: 'a' },
        replay: { enabled: true, key: 'b' },
        fullscreen: { enabled: true, key: 'g' }, // 恢复为 G 键
        refresh: { enabled: true, key: 'r' },
        search: { enabled: true, key: 's' },
        wide: { enabled: true, key: 't' },
        toggleWindow: { enabled: true, key: 'v' },
        number: { enabled: true },
        thumb: { enabled: true }
    };

    // ==================== 全局状态 ====================
    let config = { ...DEFAULT_CONFIG };
    let isTyping = false;
    let observers = [];

    // ==================== 核心模块 ====================
    const InputHandler = {
        init(inputElement) {
            if (!inputElement?._shortcutListeners) {
                const updateState = (state) => {
                    return () => { isTyping = state; };
                };
                inputElement.addEventListener('focus', updateState(true));
                inputElement.addEventListener('blur', updateState(false));
                inputElement._shortcutListeners = true;
            }
        }
    };

    const ThumbManager = {
        intervalId: null,
        retryCount: 0,

        start() {
            this.clear();
            this.intervalId = setInterval(() => {
                const thumbBtn = document.querySelector(SELECTORS.THUMB_BUTTON);
                if (!thumbBtn) {
                    if (this.retryCount++ > 5) this.clear();
                    return;
                }

                if (!thumbBtn.classList.contains('on')) {
                    thumbBtn.click();
                    this.clear();
                }
            }, 30000);
        },

        clear() {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.retryCount = 0;
        }
    };

    // ==================== 工具函数 ====================
    const createKeyMap = () => ({
        [config.focus.key]: SELECTORS.CONTROLS.DANMAKU_INPUT,
        [config.replay.key]: SELECTORS.VIDEO_ELEMENT,
        [config.fullscreen.key]: SELECTORS.CONTROLS.WEB_FULLSCREEN,
        [config.refresh.key]: SELECTORS.CONTROLS.REFRESH_BUTTON,
        [config.search.key]: SELECTORS.SEARCH_INPUT,
        [config.wide.key]: SELECTORS.CONTROLS.WIDE_SCREEN,
        [config.toggleWindow.key]: SELECTORS.CONTROLS.MINI_WINDOW
    });

    const handleVideoChange = () => {
        if (config.thumb.enabled && !document.querySelector(`${SELECTORS.THUMB_BUTTON}.on`)) {
            ThumbManager.start();
        }
    };

    // ==================== 观察器管理 ====================
    const ObserverManager = {
        init() {
            this.setupSearchObserver();
            if (config.thumb.enabled) this.setupVideoObserver();
        },

        setupSearchObserver() {
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    const input = mutation.target.querySelector(SELECTORS.SEARCH_INPUT);
                    if (input) {
                        InputHandler.init(input);
                        observer.disconnect();
                        observers = observers.filter(obs => obs !== observer);
                        break;
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            observers.push(observer);
        },

        setupVideoObserver() {
            const observer = new MutationObserver(mutations => {
                if (mutations.some(m => m.type === 'attributes' && m.attributeName === 'class')) {
                    handleVideoChange();
                }
            });

            const container = document.querySelector(SELECTORS.VIDEO_CONTAINER);
            if (container) {
                observer.observe(container, {
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
                observers.push(observer);
            }
        },

        cleanup() {
            observers.forEach(obs => obs.disconnect());
            observers = [];
        }
    };

    // ==================== 事件处理 ====================
    const KeyHandler = {
        keyMap: {},

        init(keyMap) {
            this.keyMap = keyMap;
            document.addEventListener('keydown', this.handleKeyPress.bind(this));
        },

        handleKeyPress(event) {
            if (event.key === 'Escape') this.handleEscape();
            if (this.shouldIgnore(event)) return;

            // 阻止按G键关注UP主的功能
            if (event.key.toLowerCase() === 'g') {
                event.preventDefault();
                event.stopPropagation();

                // 执行全屏切换功能
                const element = document.querySelector(this.keyMap['g']);
                if (element) {
                    element.click();
                }
                return;
            }

            try {
                if (this.handleNumberKeys(event)) return;
                this.processFunctionKey(event);
            } catch (error) {
                console.error('[Bilibili Shortcuts] Error:', error);
            }
        },

        handleEscape() {
            document.querySelector('.search-panel')?.style?.setProperty('display', 'none');
            document.activeElement?.blur();
        },

        shouldIgnore(event) {
            return isTyping || event.ctrlKey || event.altKey || event.metaKey || event.repeat;
        },

        handleNumberKeys(event) {
            if (config.number.enabled && event.key >= '1' && event.key <= '6') {
                const index = parseInt(event.key) - 1;
                const target = document.querySelectorAll(SELECTORS.RECOMMEND_VIDEOS)[index];
                target?.querySelector('a')?.click();
                return true;
            }
            return false;
        },

        processFunctionKey(event) {
            const key = event.key.toLowerCase();
            const selector = this.keyMap[key];
            if (!selector) return;

            event.preventDefault();
            const element = document.querySelector(selector);
            if (!element) return;

            switch (key) {
                case config.replay.key:
                    element.currentTime = 0;
                    element.play();
                    break;
                case config.focus.key:
                case config.search.key:
                    element.focus();
                    break;
                default:
                    element.click();
            }
        }
    };

    // ==================== 配置管理 ====================
    const ConfigManager = {
        init() {
            this.loadConfig();
            this.registerMenu();
        },

        loadConfig() {
            try {
                const saved = GM_getValue('bilibili-shortcuts-config', {});
                config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                Object.keys(saved).forEach(key => {
                    if (config[key]) {
                        config[key] = { ...config[key], ...saved[key] };
                    }
                });
            } catch (e) {
                console.error('加载配置失败:', e);
                config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            }
        },

        saveConfig() {
            GM_setValue('bilibili-shortcuts-config', JSON.parse(JSON.stringify(config)));
        },

        registerMenu() {
            GM_registerMenuCommand('⚙️ 快捷键设置', () => this.showConfigDialog());
        },

        showConfigDialog() {
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                min-width: 300px;
                font-family: system-ui, sans-serif;
            `;

            const features = [
                { name: 'focus', label: '弹幕输入框聚焦 (A)' },
                { name: 'replay', label: '重新播放 (B)' },
                { name: 'fullscreen', label: '网页全屏 (G)' }, // 恢复为 G 键
                { name: 'refresh', label: '刷新推荐 (R)' },
                { name: 'search', label: '搜索框聚焦 (S)' },
                { name: 'wide', label: '宽屏模式 (T)' },
                { name: 'toggleWindow', label: '小窗模式 (V)' },
                { name: 'number', label: '数字选择推荐' },
                { name: 'thumb', label: '自动点赞' }
            ];

            let html = `
                <h3 style="margin:0 0 15px; color: #00a1d6;">B站快捷键设置</h3>
                <div style="max-height: 60vh; overflow-y: auto;">
            `;

            features.forEach(feat => {
                html += `
                    <div style="margin: 10px 0; display: flex; align-items: center;">
                        <input type="checkbox"
                            id="${feat.name}"
                            ${config[feat.name].enabled ? 'checked' : ''}
                            style="margin-right: 8px;">
                        <label for="${feat.name}" style="font-size: 14px;">${feat.label}</label>
                    </div>
                `;
            });

            // 添加关于G键的说明
            html += `
                <div style="margin-top: 15px; padding: 10px; background: #f8f8f8; border-radius: 4px;">
                    <p style="margin: 0; font-size: 12px; color: #666;">
                        <strong>注意：</strong>按G键切换网页全屏，已禁用原生的关注功能
                    </p>
                </div>
            `;

            html += `</div>
                <div style="margin-top: 15px; text-align: right;">
                    <button id="bili-cancel" style="
                        padding: 6px 12px;
                        margin-right: 8px;
                        background: #f0f0f0;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        cursor: pointer;">
                        取消
                    </button>
                    <button id="bili-save" style="
                        padding: 6px 12px;
                        background: #00a1d6;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;">
                        保存
                    </button>
                </div>
            `;

            dialog.innerHTML = html;
            document.body.appendChild(dialog);

            // 添加遮罩层
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            `;
            document.body.appendChild(overlay);

            // 事件处理
            features.forEach(feat => {
                dialog.querySelector(`#${feat.name}`).addEventListener('change', e => {
                    config[feat.name].enabled = e.target.checked;
                });
            });

            dialog.querySelector('#bili-save').addEventListener('click', () => {
                this.saveConfig();
                dialog.remove();
                overlay.remove();
            });

            dialog.querySelector('#bili-cancel').addEventListener('click', () => {
                dialog.remove();
                overlay.remove();
                this.loadConfig();
            });

            overlay.addEventListener('click', () => {
                dialog.remove();
                overlay.remove();
                this.loadConfig();
            });
        }
    };

    // ==================== 初始化入口 ====================
    const init = () => {
        ConfigManager.init();
        ObserverManager.init();
        KeyHandler.init(createKeyMap());

        if (config.thumb.enabled && location.href.includes('/video/')) {
            ThumbManager.start();
        }

        // 清理监听器
        window.addEventListener('unload', () => {
            ObserverManager.cleanup();
            ThumbManager.clear();
        });
    };

    return { init };
})();

// ==================== 执行初始化 ====================
BilibiliShortcuts.init();