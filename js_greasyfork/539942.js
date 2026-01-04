// ==UserScript==
// @name 网页抖音体验增强
// @namespace Violentmonkey Scripts
// @match https://www.douyin.com/?*
// @match *://*.douyin.com/*
// @match *://*.iesdouyin.com/*
// @exclude *://lf-zt.douyin.com*
// @grant none
// @version 3.4
// @changelog 优化文档描述，调整跨域配置指引
// @description 自动跳过直播、智能屏蔽关键字（自动不感兴趣）、跳过广告、最高分辨率、分辨率筛选、AI智能筛选（自动点赞）、极速模式
// @author Frequenk
// @license GPL-3.0 License
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/539942/%E7%BD%91%E9%A1%B5%E6%8A%96%E9%9F%B3%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/539942/%E7%BD%91%E9%A1%B5%E6%8A%96%E9%9F%B3%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isElementInViewport(el, text = "") {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < window.innerHeight &&
            rect.left < window.innerWidth
        );
    }

    function getBestVisibleElement(elements) {
        if (!elements || elements.length === 0) {
            return null;
        }

        const visibleElements = Array.from(elements).filter(isElementInViewport);

        if (visibleElements.length === 0) {
            return null;
        }

        if (visibleElements.length === 1) {
            return visibleElements[0];
        }

        let bestCandidate = null;
        let minDistance = Infinity;

        for (const el of visibleElements) {
            const rect = el.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (distance < minDistance) {
                minDistance = distance;
                bestCandidate = el;
            }
        }
        return bestCandidate;
    }

    // ========== 通知管理器 ==========
    class NotificationManager {
        constructor() {
            this.container = null;
        }

        createContainer() {
            if (this.container && document.body.contains(this.container)) return;
            this.container = document.createElement('div');
            Object.assign(this.container.style, {
                position: 'fixed',
                top: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '10001',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
            });
            document.body.appendChild(this.container);
        }

        showMessage(message, duration = 2000) {
            this.createContainer();

            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            Object.assign(messageElement.style, {
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                opacity: '0',
                transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                transform: 'translateY(-20px)'
            });

            this.container.appendChild(messageElement);

            // Animate in
            setTimeout(() => {
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            }, 10);

            // Animate out and remove
            setTimeout(() => {
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (messageElement.parentElement) {
                        messageElement.remove();
                    }
                    if (this.container && this.container.childElementCount === 0) {
                        this.container.remove();
                        this.container = null;
                    }
                }, 300);
            }, duration);
        }
    }

    // ========== 配置管理模块 ==========
    class ConfigManager {
        constructor() {
            this.config = {
                skipLive: { enabled: true, key: 'skipLive' },
                autoHighRes: { enabled: true, key: 'autoHighRes' },
                blockKeywords: {
                    enabled: true,
                    key: 'blockKeywords',
                    keywords: this.loadKeywords(),
                    pressR: this.loadPressRSetting(),
                    blockName: this.loadBlockNameSetting(),
                    blockDesc: this.loadBlockDescSetting(),
                    blockTags: this.loadBlockTagsSetting()
                },
                skipAd: { enabled: true, key: 'skipAd' },
                onlyResolution: {
                    enabled: false,
                    key: 'onlyResolution',
                    resolution: this.loadTargetResolution()
                },
                aiPreference: {
                    enabled: false,
                    key: 'aiPreference',
                    content: this.loadAiContent(),
                    model: this.loadAiModel(),
                    autoLike: this.loadAutoLikeSetting()
                },
                speedMode: {
                    enabled: false,
                    key: 'speedMode',
                    seconds: this.loadSpeedSeconds(),
                    mode: this.loadSpeedModeType(),
                    minSeconds: this.loadSpeedMinSeconds(),
                    maxSeconds: this.loadSpeedMaxSeconds()
                }
            };
        }

        loadKeywords() {
            return JSON.parse(localStorage.getItem('douyin_blocked_keywords') || '["店", "甄选"]');
        }

        loadSpeedSeconds() {
            const value = parseInt(localStorage.getItem('douyin_speed_mode_seconds') || '6', 10);
            return Number.isFinite(value) ? Math.min(Math.max(value, 1), 3600) : 6;
        }

        loadSpeedModeType() {
            const mode = localStorage.getItem('douyin_speed_mode_type') || 'fixed';
            return mode === 'random' ? 'random' : 'fixed';
        }

        loadSpeedMinSeconds() {
            const value = parseInt(localStorage.getItem('douyin_speed_mode_min_seconds') || '5', 10);
            return Number.isFinite(value) ? Math.min(Math.max(value, 1), 3600) : 5;
        }

        loadSpeedMaxSeconds() {
            const value = parseInt(localStorage.getItem('douyin_speed_mode_max_seconds') || '10', 10);
            return Number.isFinite(value) ? Math.min(Math.max(value, 1), 3600) : 10;
        }

        loadAiContent() {
            return localStorage.getItem('douyin_ai_content') || '露脸的美女';
        }

        loadAiModel() {
            return localStorage.getItem('douyin_ai_model') || 'qwen3-vl:8b';
        }

        loadTargetResolution() {
            return localStorage.getItem('douyin_target_resolution') || '4K';
        }

        loadPressRSetting() {
            return localStorage.getItem('douyin_press_r_enabled') !== 'false'; // 默认开启
        }

        loadAutoLikeSetting() {
            return localStorage.getItem('douyin_auto_like_enabled') !== 'false'; // 默认开启
        }

        loadBlockNameSetting() {
            return localStorage.getItem('douyin_block_name_enabled') !== 'false'; // 默认开启
        }

        loadBlockDescSetting() {
            return localStorage.getItem('douyin_block_desc_enabled') !== 'false'; // 默认开启
        }

        loadBlockTagsSetting() {
            return localStorage.getItem('douyin_block_tags_enabled') !== 'false'; // 默认开启
        }

        saveKeywords(keywords) {
            this.config.blockKeywords.keywords = keywords;
            localStorage.setItem('douyin_blocked_keywords', JSON.stringify(keywords));
        }

        saveSpeedSeconds(seconds) {
            this.config.speedMode.seconds = seconds;
            localStorage.setItem('douyin_speed_mode_seconds', seconds.toString());
        }

        saveSpeedModeType(mode) {
            this.config.speedMode.mode = mode;
            localStorage.setItem('douyin_speed_mode_type', mode);
        }

        saveSpeedModeRange(minSeconds, maxSeconds) {
            this.config.speedMode.minSeconds = minSeconds;
            this.config.speedMode.maxSeconds = maxSeconds;
            localStorage.setItem('douyin_speed_mode_min_seconds', minSeconds.toString());
            localStorage.setItem('douyin_speed_mode_max_seconds', maxSeconds.toString());
        }

        saveAiContent(content) {
            this.config.aiPreference.content = content;
            localStorage.setItem('douyin_ai_content', content);
        }

        saveAiModel(model) {
            this.config.aiPreference.model = model;
            localStorage.setItem('douyin_ai_model', model);
        }

        saveTargetResolution(resolution) {
            this.config.onlyResolution.resolution = resolution;
            localStorage.setItem('douyin_target_resolution', resolution);
        }

        savePressRSetting(enabled) {
            this.config.blockKeywords.pressR = enabled;
            localStorage.setItem('douyin_press_r_enabled', enabled.toString());
        }

        saveAutoLikeSetting(enabled) {
            this.config.aiPreference.autoLike = enabled;
            localStorage.setItem('douyin_auto_like_enabled', enabled.toString());
        }

        saveBlockNameSetting(enabled) {
            this.config.blockKeywords.blockName = enabled;
            localStorage.setItem('douyin_block_name_enabled', enabled.toString());
        }

        saveBlockDescSetting(enabled) {
            this.config.blockKeywords.blockDesc = enabled;
            localStorage.setItem('douyin_block_desc_enabled', enabled.toString());
        }

        saveBlockTagsSetting(enabled) {
            this.config.blockKeywords.blockTags = enabled;
            localStorage.setItem('douyin_block_tags_enabled', enabled.toString());
        }

        get(key) {
            return this.config[key];
        }

        setEnabled(key, value) {
            if (this.config[key]) {
                this.config[key].enabled = value;
            }
        }

        isEnabled(key) {
            return this.config[key]?.enabled || false;
        }
    }

    // ========== DOM选择器常量 ==========
    const SELECTORS = {
        activeVideo: "[data-e2e='feed-active-video']:has(video[src])",
        resolutionOptions: ".xgplayer-playing div.virtual > div.item",
        accountName: '[data-e2e="feed-video-nickname"]',
        settingsPanel: 'xg-icon.xgplayer-autoplay-setting',
        adIndicator: 'svg[viewBox="0 0 30 16"]',
        videoElement: 'video[src]',
        videoDesc: '[data-e2e="video-desc"]'
    };

    // ========== 视频控制器 ==========
    class VideoController {
        constructor(notificationManager) {
            this.skipCheckInterval = null;
            this.skipAttemptCount = 0;
            this.notificationManager = notificationManager;
        }

        skip(reason) {
            const tip = `跳过视频，原因：${reason}`;
            if (reason) {
                this.notificationManager.showMessage(tip);
            }
            console.log(tip);
            if (!document.body) return;

            const videoBefore = this.getCurrentVideoUrl();
            this.sendKeyEvent('ArrowDown');

            this.clearSkipCheck();
            this.startSkipCheck(videoBefore);
        }

        like() {
            this.notificationManager.showMessage('AI喜好: ❤️ 自动点赞');
            this.sendKeyEvent('z', 'KeyZ', 90);
        }

        pressR() {
            this.notificationManager.showMessage('屏蔽账号: 🚫 不感兴趣');
            this.sendKeyEvent('r', 'KeyR', 82);
        }

        sendKeyEvent(key, code = null, keyCode = null) {
            try {
                const event = new KeyboardEvent('keydown', {
                    key: key,
                    code: code || (key === 'ArrowDown' ? 'ArrowDown' : code),
                    keyCode: keyCode || (key === 'ArrowDown' ? 40 : keyCode),
                    which: keyCode || (key === 'ArrowDown' ? 40 : keyCode),
                    bubbles: true,
                    cancelable: true
                });
                document.body.dispatchEvent(event);
            } catch (error) {
                console.log('发送键盘事件失败:', error);
            }
        }

        getCurrentVideoUrl() {
            const activeContainers = document.querySelectorAll(SELECTORS.activeVideo);
            const lastActiveContainer = getBestVisibleElement(activeContainers);
            if (!lastActiveContainer) return '';
            const videoEl = lastActiveContainer.querySelector(SELECTORS.videoElement);
            return videoEl?.src || '';
        }

        clearSkipCheck() {
            if (this.skipCheckInterval) {
                clearInterval(this.skipCheckInterval);
                this.skipCheckInterval = null;
            }
            this.skipAttemptCount = 0;
        }

        startSkipCheck(urlBefore) {
            this.skipCheckInterval = setInterval(() => {
                if (this.skipAttemptCount >= 5) {
                    this.notificationManager.showMessage('⚠️ 跳过失败，请手动操作');
                    this.clearSkipCheck();
                    return;
                }

                this.skipAttemptCount++;
                const urlAfter = this.getCurrentVideoUrl();
                if (urlAfter && urlAfter !== urlBefore) {
                    console.log('视频已成功切换');
                    this.clearSkipCheck();
                    return;
                }

                const attemptMessage = `跳过失败，正在重试 (${this.skipAttemptCount}/5)`;
                this.notificationManager.showMessage(attemptMessage, 1000);
                console.log(attemptMessage);
                this.sendKeyEvent('ArrowDown');
            }, 500);
        }
    }

    // ========== UI组件工厂 ==========
    class UIFactory {
        static createDialog(className, title, content, onSave, onCancel) {
            const existingDialog = document.querySelector(`.${className}`);
            if (existingDialog) {
                existingDialog.remove();
                return;
            }

            const dialog = document.createElement('div');
            dialog.className = className;
            Object.assign(dialog.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '20px',
                zIndex: '10000',
                minWidth: '250px'
            });

            dialog.innerHTML = `
                <div style="color: white; margin-bottom: 15px; font-size: 14px;">${title}</div>
                ${content}
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="dialog-confirm" style="flex: 1; padding: 5px; background: #fe2c55;
                            color: white; border: none; border-radius: 4px; cursor: pointer;">确定</button>
                    <button class="dialog-cancel" style="flex: 1; padding: 5px; background: rgba(255, 255, 255, 0.1);
                            color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px; cursor: pointer;">取消</button>
                </div>
            `;

            document.body.appendChild(dialog);

            dialog.querySelector('.dialog-confirm').addEventListener('click', () => {
                if (onSave()) dialog.remove();
            });

            dialog.querySelector('.dialog-cancel').addEventListener('click', () => {
                dialog.remove();
                if (onCancel) onCancel();
            });

            setTimeout(() => {
                document.addEventListener('click', function closeDialog(e) {
                    if (!dialog.contains(e.target)) {
                        dialog.remove();
                        document.removeEventListener('click', closeDialog);
                    }
                });
            }, 100);

            return dialog;
        }

        static createToggleButton(text, className, isEnabled, onToggle, onClick = null, shortcut = null) {
            const btnContainer = document.createElement('xg-icon');
            btnContainer.className = `xgplayer-autoplay-setting ${className}`;

            const shortcutHint = shortcut
                ? `<div class="xgTips"><span>${text.replace(/<[^>]*>/g, '')}</span><span class="shortcutKey">${shortcut}</span></div>`
                : '';

            btnContainer.innerHTML = `
                <div class="xgplayer-icon">
                    <div class="xgplayer-setting-label">
                        <button aria-checked="${isEnabled}" class="xg-switch ${isEnabled ? 'xg-switch-checked' : ''}">
                            <span class="xg-switch-inner"></span>
                        </button>
                        <span class="xgplayer-setting-title" style="${onClick ? 'cursor: pointer; text-decoration: underline;' : ''}">${text}</span>
                    </div>
                </div>${shortcutHint}`;

            btnContainer.querySelector('button').addEventListener('click', (e) => {
                const newState = e.currentTarget.getAttribute('aria-checked') === 'false';
                UIManager.updateToggleButtons(className, newState);
                onToggle(newState);
            });

            if (onClick) {
                btnContainer.querySelector('.xgplayer-setting-title').addEventListener('click', (e) => {
                    e.stopPropagation();
                    onClick();
                });
            }

            return btnContainer;
        }

        static showErrorDialog() {
            const dialog = document.createElement('div');
            dialog.className = 'error-dialog-' + Date.now();
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid rgba(254, 44, 85, 0.8);
                color: white;
                padding: 25px;
                border-radius: 12px;
                z-index: 10001;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                text-align: left;
                font-size: 14px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            `;

            const commonStyle = `background: rgba(255, 255, 255, 0.1); padding: 8px; border-radius: 4px; font-family: monospace; margin: 5px 0; display: block; user-select: text;`;
            const h3Style = `color: #fe2c55; margin: 15px 0 8px 0; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;`;

            dialog.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 32px; margin-bottom: 10px;">⚠️ 连接失败</div>
                    <p style="color: #aaa; font-size: 13px;">请确保 <a href="https://ollama.com/" target="_blank" style="color: #fe2c55;">Ollama</a> 已运行并配置跨域访问</p>
                </div>

                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="${h3Style}">🖥️ Windows 配置</h3>
                    <ol style="padding-left: 20px; margin: 0; line-height: 1.6;">
                        <li>打开 <strong>控制面板</strong> -> 系统 -> 高级系统设置 -> 环境变量</li>
                        <li>在 <strong>用户变量</strong> 点击新建，添加两个变量：
                            <div style="${commonStyle}">
                                OLLAMA_HOST = 0.0.0.0<br>
                                OLLAMA_ORIGINS = *
                            </div>
                        </li>
                        <li>点击确定保存，重启 Ollama</li>
                    </ol>

                    <h3 style="${h3Style}">🍎 macOS 配置</h3>
                    <div style="margin-bottom: 5px;">打开终端运行以下命令，然后重启 Ollama：</div>
                    <code style="${commonStyle}">
                        launchctl setenv OLLAMA_HOST "0.0.0.0"<br>
                        launchctl setenv OLLAMA_ORIGINS "*"
                    </code>

                    <h3 style="${h3Style}">🐧 Linux (systemd) 配置</h3>
                    <div style="margin-bottom: 5px;">1. 编辑服务配置: <code style="background:rgba(255,255,255,0.1); px-1">sudo systemctl edit ollama.service</code></div>
                    <div style="margin-bottom: 5px;">2. 在 <code style="color:#aaa">[Service]</code> 下方添加：</div>
                    <code style="${commonStyle}">
                        [Service]<br>
                        Environment="OLLAMA_HOST=0.0.0.0"<br>
                        Environment="OLLAMA_ORIGINS=*"
                    </code>
                    <div style="margin-top: 5px;">3. 重启服务: <code style="background:rgba(255,255,255,0.1); px-1">sudo systemctl daemon-reload && sudo systemctl restart ollama</code></div>
                </div>

                <div style="text-align: center;">
                    <div class="error-dialog-close" style="margin-top: 10px; font-size: 14px; color: #fe2c55; cursor: pointer; text-decoration: underline;">关闭</div>
                </div>
            `;

            document.body.appendChild(dialog);

            // 点击关闭文字
            dialog.querySelector('.error-dialog-close').addEventListener('click', () => {
                dialog.remove();
            });

            // 点击背景关闭
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) dialog.remove();
            });
        }
    }

    // ========== UI管理器 ==========
    class UIManager {
        constructor(config, videoController, notificationManager) {
            this.config = config;
            this.videoController = videoController;
            this.notificationManager = notificationManager;
            this.initButtons();
        }

        initButtons() {
            this.buttonConfigs = [
                {
                    text: '跳直播',
                    className: 'skip-live-button',
                    configKey: 'skipLive',
                    shortcut: '='
                },
                {
                    text: '跳广告',
                    className: 'skip-ad-button',
                    configKey: 'skipAd'
                },
                {
                    text: '账号屏蔽',
                    className: 'block-account-keyword-button',
                    configKey: 'blockKeywords',
                    onClick: () => this.showKeywordDialog()
                },
                {
                    text: '最高清',
                    className: 'auto-high-resolution-button',
                    configKey: 'autoHighRes'
                },
                {
                    text: `${this.config.get('onlyResolution').resolution}筛选`,
                    className: 'resolution-filter-button',
                    configKey: 'onlyResolution',
                    onClick: () => this.showResolutionDialog()
                },
                {
                    text: 'AI喜好',
                    className: 'ai-preference-button',
                    configKey: 'aiPreference',
                    onClick: () => this.showAiPreferenceDialog()
                },
                {
                    text: this.getSpeedModeLabel(),
                    className: 'speed-mode-button',
                    configKey: 'speedMode',
                    onClick: () => this.showSpeedDialog()
                }
            ];
        }

        insertButtons() {
            document.querySelectorAll(SELECTORS.settingsPanel).forEach(panel => {
                const parent = panel.parentNode;
                if (!parent) return;

                let lastButton = panel;
                this.buttonConfigs.forEach(config => {
                    let button = parent.querySelector(`.${config.className}`);
                    if (!button) {
                        button = UIFactory.createToggleButton(
                            config.text,
                            config.className,
                            this.config.isEnabled(config.configKey),
                            (state) => {
                                this.config.setEnabled(config.configKey, state);
                                if (config.configKey === 'skipLive') {
                                    this.notificationManager.showMessage(`功能开关: 跳过直播已 ${state ? '✅' : '❌'}`);
                                } else if (config.configKey === 'speedMode') {
                                    document.dispatchEvent(new CustomEvent('douyin-speed-mode-updated'));
                                }
                            },
                            config.onClick,
                            config.shortcut
                        );
                        parent.insertBefore(button, lastButton.nextSibling);
                    }
                    const isEnabled = this.config.isEnabled(config.configKey);
                    const switchEl = button.querySelector('.xg-switch');
                    if (switchEl) {
                        switchEl.classList.toggle('xg-switch-checked', isEnabled);
                        switchEl.setAttribute('aria-checked', String(isEnabled));
                    }
                    const titleEl = button.querySelector('.xgplayer-setting-title');
                    if (titleEl && typeof config.text === 'string') {
                        titleEl.textContent = config.text;
                    }
                    lastButton = button;
                });
            });
        }

        static updateToggleButtons(className, isEnabled) {
            document.querySelectorAll(`.${className} .xg-switch`).forEach(sw => {
                sw.classList.toggle('xg-switch-checked', isEnabled);
                sw.setAttribute('aria-checked', String(isEnabled));
            });
        }

        updateSpeedModeText() {
            const label = this.getSpeedModeLabel();
            const speedButtonConfig = this.buttonConfigs?.find(config => config.configKey === 'speedMode');
            if (speedButtonConfig) {
                speedButtonConfig.text = label;
            }
            document.querySelectorAll('.speed-mode-button .xgplayer-setting-title').forEach(el => {
                el.textContent = label;
            });
        }

        getSpeedModeLabel() {
            const speedConfig = this.config.get('speedMode');
            console.log('speedConfig', speedConfig)
            if (speedConfig.mode === 'random') {
                return `随机${speedConfig.minSeconds}-${speedConfig.maxSeconds}秒`;
            }
            return `${speedConfig.seconds}秒切`;
        }

        updateResolutionText() {
            const resolution = this.config.get('onlyResolution').resolution;
            const resolutionButtonConfig = this.buttonConfigs?.find(config => config.configKey === 'onlyResolution');
            if (resolutionButtonConfig) {
                resolutionButtonConfig.text = `${resolution}筛选`;
            }
            document.querySelectorAll('.resolution-filter-button .xgplayer-setting-title').forEach(el => {
                el.textContent = `${resolution}筛选`;
            });
        }

        showSpeedDialog() {
            const speedConfig = this.config.get('speedMode');
            const isRandom = speedConfig.mode === 'random';
            const content = `
                <div style="margin-bottom: 15px; color: rgba(255, 255, 255, 0.8); font-size: 13px;">
                    <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                        <input type="radio" name="speed-mode-type" value="fixed" ${isRandom ? '' : 'checked'}
                               style="margin-right: 8px;">
                        固定时间模式
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="speed-mode-type" value="random" ${isRandom ? 'checked' : ''}
                               style="margin-right: 8px;">
                        随机时间模式
                    </label>
                </div>
                <div class="speed-fixed-wrapper" style="display: ${isRandom ? 'none' : 'block'};">
                    <input type="number" class="speed-input" min="1" max="3600" value="${speedConfig.seconds}"
                        style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.1);
                               color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;">
                </div>
                <div class="speed-random-wrapper" style="display: ${isRandom ? 'flex' : 'none'}; gap: 10px; align-items: center;">
                    <input type="number" class="speed-min-input" min="1" max="3600" value="${speedConfig.minSeconds}"
                        style="flex: 1; padding: 8px; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;">
                    <span style="color: rgba(255, 255, 255, 0.6);">—</span>
                    <input type="number" class="speed-max-input" min="1" max="3600" value="${speedConfig.maxSeconds}"
                        style="flex: 1; padding: 8px; background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;">
                </div>
                <div style="color: rgba(255, 255, 255, 0.5); font-size: 11px; margin-top: 12px;">
                    范围需在 1-3600 秒之间，随机模式将在区间内为每个视频生成一个等待时间
                </div>
            `;

            const dialog = UIFactory.createDialog('speed-mode-time-dialog', '设置极速模式', content, () => {
                const modeInput = dialog.querySelector('input[name="speed-mode-type"]:checked');
                const mode = modeInput ? modeInput.value : 'fixed';

                if (mode === 'fixed') {
                    const input = dialog.querySelector('.speed-input');
                    const value = parseInt(input.value, 10);
                    if (!Number.isFinite(value) || value < 1 || value > 3600) {
                        alert('请输入 1 - 3600 秒之间的整数');
                        return false;
                    }
                    this.config.saveSpeedModeType('fixed');
                    this.config.saveSpeedSeconds(value);
                    this.notificationManager.showMessage(`⚙️ 极速模式: 播放时间已设为 ${value} 秒`);
                } else {
                    const minInput = dialog.querySelector('.speed-min-input');
                    const maxInput = dialog.querySelector('.speed-max-input');
                    const minValue = parseInt(minInput.value, 10);
                    const maxValue = parseInt(maxInput.value, 10);
                    if (!Number.isFinite(minValue) || minValue < 1 || minValue > 3600 ||
                        !Number.isFinite(maxValue) || maxValue < 1 || maxValue > 3600) {
                        alert('随机范围需在 1 - 3600 秒之间');
                        return false;
                    }
                    if (minValue > maxValue) {
                        alert('最小时间不能大于最大时间');
                        return false;
                    }
                    this.config.saveSpeedModeType('random');
                    this.config.saveSpeedModeRange(minValue, maxValue);
                    this.notificationManager.showMessage(`⚙️ 极速模式: 已设为随机 ${minValue}-${maxValue} 秒`);
                }

                this.updateSpeedModeText();
                document.dispatchEvent(new CustomEvent('douyin-speed-mode-updated'));
                return true;
            });

            if (!dialog) return;

            const toggleVisibility = () => {
                const modeInput = dialog.querySelector('input[name="speed-mode-type"]:checked');
                const isRandomMode = modeInput && modeInput.value === 'random';
                dialog.querySelector('.speed-fixed-wrapper').style.display = isRandomMode ? 'none' : 'block';
                dialog.querySelector('.speed-random-wrapper').style.display = isRandomMode ? 'flex' : 'none';
            };

            dialog.querySelectorAll('input[name="speed-mode-type"]').forEach(radio => {
                radio.addEventListener('change', toggleVisibility);
            });
        }

        showAiPreferenceDialog() {
            const currentContent = this.config.get('aiPreference').content;
            const currentModel = this.config.get('aiPreference').model;
            const autoLikeEnabled = this.config.get('aiPreference').autoLike;

            const content = `
                <div style="margin-bottom: 15px;">
                    <label style="color: rgba(255, 255, 255, 0.7); font-size: 12px; display: block; margin-bottom: 5px;">
                        想看什么内容？（例如：露脸的美女、猫咪）
                    </label>
                    <input type="text" class="ai-content-input" value="${currentContent}" placeholder="输入你想看的内容"
                        style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.1);
                               color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="color: rgba(255, 255, 255, 0.7); font-size: 12px; display: block; margin-bottom: 5px;">
                        AI模型选择
                    </label>
                    <div style="position: relative;">
                        <select class="ai-model-select"
                            style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.1);
                                   color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;
                                   appearance: none; cursor: pointer;">
                            <option value="qwen3-vl:8b" style="background: rgba(0, 0, 0, 0.9); color: white;" ${currentModel === 'qwen3-vl:8b' ? 'selected' : ''}>qwen3-vl:8b (推荐)</option>
                            <option value="qwen2.5vl:7b" style="background: rgba(0, 0, 0, 0.9); color: white;" ${currentModel === 'qwen2.5vl:7b' ? 'selected' : ''}>qwen2.5vl:7b</option>
                            <option value="custom" style="background: rgba(0, 0, 0, 0.9); color: white;" ${currentModel !== 'qwen3-vl:8b' && currentModel !== 'qwen2.5vl:7b' ? 'selected' : ''}>自定义模型</option>
                        </select>
                        <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                                   pointer-events: none; color: rgba(255, 255, 255, 0.5);">▼</span>
                    </div>
                    <input type="text" class="ai-model-input" value="${currentModel !== 'qwen3-vl:8b' && currentModel !== 'qwen2.5vl:7b' ? currentModel : ''}"
                        placeholder="输入自定义模型名称"
                        style="width: 100%; padding: 8px; margin-top: 10px; background: rgba(255, 255, 255, 0.1);
                               color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;
                               display: ${currentModel !== 'qwen3-vl:8b' && currentModel !== 'qwen2.5vl:7b' ? 'block' : 'none'};">
                </div>

                <div style="margin-bottom: 15px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 6px;">
                    <label style="display: flex; align-items: center; cursor: pointer; color: white; font-size: 13px;">
                        <input type="checkbox" class="auto-like-checkbox" ${autoLikeEnabled ? 'checked' : ''}
                               style="margin-right: 8px; transform: scale(1.2);">
                        AI判定为喜欢的内容将自动点赞（Z键）
                    </label>
                    <div style="color: rgba(255, 255, 255, 0.5); font-size: 11px; margin-top: 5px; margin-left: 24px;">
                        帮助抖音算法了解你喜欢此类内容
                    </div>
                </div>

                <div style="color: rgba(255, 255, 255, 0.5); font-size: 11px; margin-bottom: 10px;">
                    提示：需要安装 <a href="https://ollama.com/" target="_blank" style="color: #fe2c55;">Ollama</a> 并下载视觉模型
                </div>
            `;

            const dialog = UIFactory.createDialog('ai-preference-dialog', '设置AI喜好', content, () => {
                const contentInput = dialog.querySelector('.ai-content-input');
                const modelSelect = dialog.querySelector('.ai-model-select');
                const modelInput = dialog.querySelector('.ai-model-input');
                const autoLikeCheckbox = dialog.querySelector('.auto-like-checkbox');

                const content = contentInput.value.trim();
                let model = modelSelect.value === 'custom'
                    ? modelInput.value.trim()
                    : modelSelect.value;

                if (!content) {
                    alert('请输入想看的内容');
                    return false;
                }

                if (!model) {
                    alert('请选择或输入模型名称');
                    return false;
                }

                this.config.saveAiContent(content);
                this.config.saveAiModel(model);
                this.config.saveAutoLikeSetting(autoLikeCheckbox.checked);

                this.notificationManager.showMessage('🤖 AI喜好: 设置已保存');
                return true;
            });

            // 处理模型选择切换
            const modelSelect = dialog.querySelector('.ai-model-select');
            const modelInput = dialog.querySelector('.ai-model-input');

            modelSelect.addEventListener('change', (e) => {
                if (e.target.value === 'custom') {
                    modelInput.style.display = 'block';
                } else {
                    modelInput.style.display = 'none';
                    modelInput.value = '';
                }
            });

            // 防止复选框点击时关闭弹窗
            dialog.querySelector('.auto-like-checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        showKeywordDialog() {
            const keywords = this.config.get('blockKeywords').keywords;
            let tempKeywords = [...keywords];

            const updateList = () => {
                const container = document.querySelector('.keyword-list');
                if (!container) return;

                container.innerHTML = tempKeywords.length === 0
                    ? '<div style="color: rgba(255, 255, 255, 0.5); text-align: center;">暂无关键字</div>'
                    : tempKeywords.map((keyword, index) => `
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="flex: 1; color: white; padding: 5px 10px; background: rgba(255, 255, 255, 0.1);
                                   border-radius: 4px; margin-right: 10px;">${keyword}</span>
                            <button data-index="${index}" class="delete-keyword" style="padding: 5px 10px; background: #ff4757;
                                    color: white; border: none; border-radius: 4px; cursor: pointer;">删除</button>
                        </div>
                    `).join('');

                // 使用事件委托来处理删除按钮点击
                container.onclick = (e) => {
                    if (e.target.classList.contains('delete-keyword')) {
                        e.stopPropagation(); // 阻止事件冒泡，防止触发弹窗关闭
                        const index = parseInt(e.target.dataset.index);
                        tempKeywords.splice(index, 1);
                        updateList();
                    }
                };
            };

            const pressREnabled = this.config.get('blockKeywords').pressR;
            const blockNameEnabled = this.config.get('blockKeywords').blockName;
            const blockDescEnabled = this.config.get('blockKeywords').blockDesc;
            const blockTagsEnabled = this.config.get('blockKeywords').blockTags;

            const content = `
                <div style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px; font-size: 12px;">
                    包含这些关键字的内容将被自动跳过
                </div>

                <div style="margin-bottom: 15px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 6px;">
                    <label style="display: flex; align-items: center; cursor: pointer; color: white; font-size: 13px;">
                        <input type="checkbox" class="press-r-checkbox" ${pressREnabled ? 'checked' : ''}
                               style="margin-right: 8px; transform: scale(1.2);">
                        跳过时自动按R键（不感兴趣）
                    </label>
                    <div style="color: rgba(255, 255, 255, 0.5); font-size: 11px; margin-top: 5px; margin-left: 24px;">
                        勾选：告诉抖音你不喜欢，优化推荐算法<br>
                        不勾：仅跳到下一个视频
                    </div>
                </div>

                <div style="margin-bottom: 15px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 6px;">
                    <div style="color: rgba(255, 255, 255, 0.7); font-size: 12px; margin-bottom: 8px;">检测范围：</div>
                    <label style="display: flex; align-items: center; cursor: pointer; color: white; font-size: 13px; margin-bottom: 6px;">
                        <input type="checkbox" class="block-name-checkbox" ${blockNameEnabled ? 'checked' : ''}
                               style="margin-right: 8px; transform: scale(1.2);">
                        屏蔽名称（账号昵称）
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer; color: white; font-size: 13px; margin-bottom: 6px;">
                        <input type="checkbox" class="block-desc-checkbox" ${blockDescEnabled ? 'checked' : ''}
                               style="margin-right: 8px; transform: scale(1.2);">
                        屏蔽简介（视频描述文案）
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer; color: white; font-size: 13px;">
                        <input type="checkbox" class="block-tags-checkbox" ${blockTagsEnabled ? 'checked' : ''}
                               style="margin-right: 8px; transform: scale(1.2);">
                        屏蔽标签（#话题标签）
                    </label>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" class="keyword-input" placeholder="输入新关键字"
                        style="flex: 1; padding: 8px; background: rgba(255, 255, 255, 0.1);
                               color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;">
                    <button class="add-keyword" style="padding: 8px 15px; background: #00d639;
                            color: white; border: none; border-radius: 4px; cursor: pointer;">添加</button>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button class="import-keywords" style="flex: 1; padding: 8px 12px; background: rgba(52, 152, 219, 0.8);
                            color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        📁 导入关键字
                    </button>
                    <button class="export-keywords" style="flex: 1; padding: 8px 12px; background: rgba(155, 89, 182, 0.8);
                            color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        💾 导出关键字
                    </button>
                </div>
                <div class="keyword-list" style="margin-bottom: 15px; max-height: 200px; overflow-y: auto;"></div>
            `;

            const dialog = UIFactory.createDialog('keyword-setting-dialog', '管理屏蔽关键字', content, () => {
                const pressRCheckbox = dialog.querySelector('.press-r-checkbox');
                const blockNameCheckbox = dialog.querySelector('.block-name-checkbox');
                const blockDescCheckbox = dialog.querySelector('.block-desc-checkbox');
                const blockTagsCheckbox = dialog.querySelector('.block-tags-checkbox');

                this.config.saveKeywords(tempKeywords);
                this.config.savePressRSetting(pressRCheckbox.checked);
                this.config.saveBlockNameSetting(blockNameCheckbox.checked);
                this.config.saveBlockDescSetting(blockDescCheckbox.checked);
                this.config.saveBlockTagsSetting(blockTagsCheckbox.checked);

                this.notificationManager.showMessage('🚫 屏蔽关键字: 设置已更新');
                return true;
            });

            const addKeyword = () => {
                const input = dialog.querySelector('.keyword-input');
                const keyword = input.value.trim();
                if (keyword && !tempKeywords.includes(keyword)) {
                    tempKeywords.push(keyword);
                    updateList();
                    input.value = '';
                }
            };

            dialog.querySelector('.add-keyword').addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡，防止触发弹窗关闭
                addKeyword();
            });
            dialog.querySelector('.keyword-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.stopPropagation(); // 阻止事件冒泡
                    addKeyword();
                }
            });

            // 防止在输入框内点击时关闭弹窗
            dialog.querySelector('.keyword-input').addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // 防止复选框点击时关闭弹窗
            dialog.querySelector('.press-r-checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
            });
            dialog.querySelector('.block-name-checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
            });
            dialog.querySelector('.block-desc-checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
            });
            dialog.querySelector('.block-tags-checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // 导出功能
            const exportKeywords = () => {
                const content = tempKeywords.join('\n');
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `抖音屏蔽关键字_${new Date().toISOString().split('T')[0]}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                this.notificationManager.showMessage('💾 屏蔽账号: 关键字已导出');
            };

            dialog.querySelector('.export-keywords').addEventListener('click', (e) => {
                e.stopPropagation();
                exportKeywords();
            });

            // 导入功能
            const importKeywords = () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt';
                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const content = e.target.result;
                            const importedKeywords = content.split('\n')
                                .map(line => line.trim())
                                .filter(line => line.length > 0);

                            if (importedKeywords.length > 0) {
                                // 合并关键字，去重
                                const allKeywords = [...new Set([...tempKeywords, ...importedKeywords])];
                                tempKeywords.splice(0, tempKeywords.length, ...allKeywords);
                                updateList();
                                this.notificationManager.showMessage('📁 屏蔽账号: 关键字导入成功');
                            } else {
                                alert('文件内容为空或格式不正确！');
                            }
                        };
                        reader.onerror = () => {
                            alert('文件读取失败！');
                        };
                        reader.readAsText(file, 'utf-8');
                    }
                });
                input.click();
            };

            dialog.querySelector('.import-keywords').addEventListener('click', (e) => {
                e.stopPropagation();
                importKeywords();
            });

            updateList();
        }

        showResolutionDialog() {
            const currentResolution = this.config.get('onlyResolution').resolution;
            const resolutions = ['4K', '2K', '1080P', '720P', '540P'];

            const content = `
                <div style="margin-bottom: 15px;">
                    <label style="color: rgba(255, 255, 255, 0.7); font-size: 12px; display: block; margin-bottom: 5px;">
                        选择要筛选的分辨率
                    </label>
                    <div style="position: relative;">
                        <select class="resolution-select"
                            style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.1);
                                   color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;
                                   appearance: none; cursor: pointer;">
                            ${resolutions.map(res =>
                `<option value="${res}" style="background: rgba(0, 0, 0, 0.9); color: white;" ${currentResolution === res ? 'selected' : ''}>${res}</option>`
            ).join('')}
                        </select>
                        <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                                   pointer-events: none; color: rgba(255, 255, 255, 0.5);">▼</span>
                    </div>
                </div>

                <div style="color: rgba(255, 255, 255, 0.5); font-size: 11px; margin-bottom: 10px;">
                    提示：只播放包含所选分辨率关键字的视频，没有找到则自动跳过
                </div>
            `;

            const dialog = UIFactory.createDialog('resolution-dialog', '分辨率筛选设置', content, () => {
                const resolutionSelect = dialog.querySelector('.resolution-select');
                const resolution = resolutionSelect.value;

                this.config.saveTargetResolution(resolution);
                this.updateResolutionText();
                this.notificationManager.showMessage(`⚙️ 分辨率筛选: 已设为 ${resolution}`);
                return true;
            });
        }
    }

    // ========== AI检测器 ==========
    class AIDetector {
        constructor(videoController, config) {
            this.videoController = videoController;
            this.config = config;
            this.API_URL = 'http://localhost:11434/api/generate';
            this.checkSchedule = [0, 1000, 2500, 4000, 6000, 8000];
            this.reset();
        }

        reset() {
            this.currentCheckIndex = 0;
            this.checkResults = [];
            this.consecutiveYes = 0;
            this.consecutiveNo = 0;
            this.hasSkipped = false;
            this.stopChecking = false;
            this.hasLiked = false;
            this.isProcessing = false;
        }

        shouldCheck(videoPlayTime) {
            return !this.isProcessing &&
                !this.stopChecking &&
                !this.hasSkipped &&
                this.currentCheckIndex < this.checkSchedule.length &&
                videoPlayTime >= this.checkSchedule[this.currentCheckIndex];
        }

        async processVideo(videoEl) {
            if (this.isProcessing || this.stopChecking || this.hasSkipped) return;
            this.isProcessing = true;

            try {
                const base64Image = await this.captureVideoFrame(videoEl);
                const aiResponse = await this.callAI(base64Image);
                this.handleResponse(aiResponse);
                this.currentCheckIndex++;
            } catch (error) {
                console.error('AI判断功能出错:', error);
                // 显示错误提示
                UIFactory.showErrorDialog();
                // 关闭AI喜好模式
                this.config.setEnabled('aiPreference', false);
                UIManager.updateToggleButtons('ai-preference-button', false);
                this.stopChecking = true;
            } finally {
                this.isProcessing = false;
            }
        }

        async captureVideoFrame(videoEl) {
            const canvas = document.createElement('canvas');
            const maxSize = 500;
            const aspectRatio = videoEl.videoWidth / videoEl.videoHeight;

            let targetWidth, targetHeight;
            if (videoEl.videoWidth > videoEl.videoHeight) {
                targetWidth = Math.min(videoEl.videoWidth, maxSize);
                targetHeight = Math.round(targetWidth / aspectRatio);
            } else {
                targetHeight = Math.min(videoEl.videoHeight, maxSize);
                targetWidth = Math.round(targetHeight * aspectRatio);
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoEl, 0, 0, targetWidth, targetHeight);

            return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        }

        async callAI(base64Image) {
            const content = this.config.get('aiPreference').content;
            const model = this.config.get('aiPreference').model;

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    prompt: `这是${content}吗?回答『是』或者『不是』,不要说任何多余的字符`,
                    images: [base64Image],
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`AI请求失败: ${response.status}`);
            }

            const result = await response.json();
            return result.response?.trim();
        }

        handleResponse(aiResponse) {
            const content = this.config.get('aiPreference').content;
            this.checkResults.push(aiResponse);
            console.log(`AI检测结果[${this.checkResults.length}]：${aiResponse}`);

            if (aiResponse === '是') {
                this.consecutiveYes++;
                this.consecutiveNo = 0;
            } else {
                this.consecutiveYes = 0;
                this.consecutiveNo++;
            }

            if (this.consecutiveNo >= 1) {
                this.hasSkipped = true;
                this.stopChecking = true;
                this.videoController.skip(`🤖 AI筛选: 非'${content}'`);
            } else if (this.consecutiveYes >= 2) {
                console.log(`【停止检测】连续2次判定为${content}，安心观看`);
                this.stopChecking = true;

                // 检查是否开启了自动点赞功能
                const autoLikeEnabled = this.config.get('aiPreference').autoLike;
                if (!this.hasLiked && autoLikeEnabled) {
                    this.videoController.like();
                    this.hasLiked = true;
                } else if (!autoLikeEnabled) {
                    console.log('【自动点赞】功能已关闭，跳过点赞');
                }
            }
        }
    }

    // ========== 视频检测策略 ==========
    class VideoDetectionStrategies {
        constructor(config, videoController, notificationManager) {
            this.config = config;
            this.videoController = videoController;
            this.notificationManager = notificationManager;
            this.resolutionSkipped = false;
        }

        reset() {
            this.resolutionSkipped = false;
        }

        checkAd(container) {
            if (!this.config.isEnabled('skipAd')) return false;

            const adIndicator = container.querySelector(SELECTORS.adIndicator);
            if (adIndicator) {
                this.videoController.skip('⏭️ 自动跳过: 广告视频');
                return true;
            }
            return false;
        }

        checkBlockedAccount(container) {
            if (!this.config.isEnabled('blockKeywords')) return false;

            const blockConfig = this.config.get('blockKeywords');
            const keywords = blockConfig.keywords;
            const pressREnabled = blockConfig.pressR;
            const blockName = blockConfig.blockName;
            const blockDesc = blockConfig.blockDesc;
            const blockTags = blockConfig.blockTags;

            // 如果三个检测选项都没开启，直接返回
            if (!blockName && !blockDesc && !blockTags) return false;

            let matchedKeyword = null;
            let matchType = '';

            // 检测名称（账号昵称）
            if (blockName && !matchedKeyword) {
                const accountEl = container.querySelector(SELECTORS.accountName);
                const accountName = accountEl?.textContent.trim();
                if (accountName) {
                    matchedKeyword = keywords.find(kw => accountName.includes(kw));
                    if (matchedKeyword) matchType = '名称';
                }
            }

            // 检测简介（视频描述文案，排除标签）
            if (blockDesc && !matchedKeyword) {
                const descEl = container.querySelector(SELECTORS.videoDesc);
                if (descEl) {
                    // 获取纯文本，然后移除 #xxx 标签
                    const descText = descEl.textContent.replace(/#\S+/g, '').trim();
                    if (descText) {
                        matchedKeyword = keywords.find(kw => descText.includes(kw));
                        if (matchedKeyword) matchType = '简介';
                    }
                }
            }

            // 检测标签（#话题标签）
            if (blockTags && !matchedKeyword) {
                const descEl = container.querySelector(SELECTORS.videoDesc);
                if (descEl) {
                    // 提取所有 #xxx 标签
                    const tags = descEl.textContent.match(/#\S+/g) || [];
                    const tagsText = tags.join(' ');
                    if (tagsText) {
                        matchedKeyword = keywords.find(kw => tagsText.includes(kw));
                        if (matchedKeyword) matchType = '标签';
                    }
                }
            }

            // 如果匹配到关键字，执行跳过操作
            if (matchedKeyword) {
                if (pressREnabled) {
                    // 如果开启了按R键功能，按R键（视频会直接消失）
                    this.videoController.pressR();
                } else {
                    // 如果没开启R键功能，则使用下键跳过
                    this.videoController.skip(`🚫 屏蔽${matchType}: 关键字"${matchedKeyword}"`);
                }
                return true;
            }
            return false;
        }

        checkResolution(container) {
            if (!this.config.isEnabled('autoHighRes') && !this.config.isEnabled('onlyResolution')) return false;

            const priorityOrder = ["4K", "2K", "1080P", "720P", "540P", "智能"];
            const options = Array.from(container.querySelectorAll(SELECTORS.resolutionOptions))
                .map(el => {
                    const text = el.textContent.trim().toUpperCase();
                    return {
                        element: el,
                        text,
                        priority: priorityOrder.findIndex(p => text.includes(p))
                    };
                })
                .filter(opt => opt.priority !== -1)
                .sort((a, b) => a.priority - b.priority);

            // 只看指定分辨率模式：只选择指定分辨率，没有就跳过
            if (this.config.isEnabled('onlyResolution')) {
                const targetResolution = this.config.get('onlyResolution').resolution.toUpperCase();
                const hasTarget = options.some(opt => opt.text.includes(targetResolution));
                if (!hasTarget) {
                    if (!this.resolutionSkipped) {
                        this.videoController.skip(`📺 分辨率筛选：非 ${targetResolution} 分辨率`);
                        this.resolutionSkipped = true;
                    }
                    return true;
                }
                const targetOption = options.find(opt => opt.text.includes(targetResolution));
                if (targetOption && !targetOption.element.classList.contains("selected")) {
                    targetOption.element.click();
                    this.notificationManager.showMessage(`📺 分辨率: 已切换至 ${targetResolution}`);
                    return true;
                }
                return false;
            }

            // 原有的最高分辨率逻辑
            if (this.config.isEnabled('autoHighRes')) {
                if (options.length > 0 && !options[0].element.classList.contains("selected")) {
                    const bestOption = options[0];
                    bestOption.element.click();
                    const resolutionText = bestOption.element.textContent.trim();
                    this.notificationManager.showMessage(`📺 分辨率: 已切换至最高档 ${resolutionText}`);

                    if (bestOption.text.includes("4K")) {
                        this.config.setEnabled('autoHighRes', false);
                        UIManager.updateToggleButtons('auto-high-resolution-button', false);
                        this.notificationManager.showMessage("📺 分辨率: 已锁定4K，自动切换已关闭");
                    }
                    return true;
                }
            }
            return false;
        }
    }

    // ========== 主应用程序 ==========
    class DouyinEnhancer {
        constructor() {
            this.notificationManager = new NotificationManager();
            this.config = new ConfigManager();
            this.videoController = new VideoController(this.notificationManager);
            this.uiManager = new UIManager(this.config, this.videoController, this.notificationManager);
            this.aiDetector = new AIDetector(this.videoController, this.config);
            this.strategies = new VideoDetectionStrategies(this.config, this.videoController, this.notificationManager);

            this.lastVideoUrl = '';
            this.videoStartTime = 0;
            this.speedModeSkipped = false;
            this.lastSkippedLiveUrl = '';
            this.isCurrentlySkipping = false;
            this.currentSpeedDuration = null;
            this.currentSpeedMode = this.config.get('speedMode').mode;

            this.init();
        }

        init() {
            this.injectStyles();

            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                    return;
                }

                if (e.key === '=') {
                    const isEnabled = !this.config.isEnabled('skipLive');
                    this.config.setEnabled('skipLive', isEnabled);
                    UIManager.updateToggleButtons('skip-live-button', isEnabled);
                    this.notificationManager.showMessage(`功能开关: 跳过直播已 ${isEnabled ? '✅' : '❌'}`);
                }
            });

            document.addEventListener('douyin-speed-mode-updated', () => {
                this.assignSpeedModeDuration(false);
                this.speedModeSkipped = false;
                this.videoStartTime = Date.now();
            });

            setInterval(() => this.mainLoop(), 300);
        }

        assignSpeedModeDuration(isNewVideo) {
            const speedConfig = this.config.get('speedMode');

            if (!this.config.isEnabled('speedMode')) {
                this.currentSpeedDuration = null;
                this.currentSpeedMode = speedConfig.mode;
                return;
            }

            if (speedConfig.mode === 'random') {
                const min = Math.min(speedConfig.minSeconds, speedConfig.maxSeconds);
                const max = Math.max(speedConfig.minSeconds, speedConfig.maxSeconds);
                const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
                this.currentSpeedDuration = randomValue;
                this.currentSpeedMode = 'random';
            } else {
                this.currentSpeedDuration = speedConfig.seconds;
                this.currentSpeedMode = 'fixed';
            }
        }

        injectStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                /* 让右侧按钮容器高度自适应，防止按钮换行时被隐藏 */
                .xg-right-grid {
                    height: auto !important;
                    max-height: none !important;
                    overflow: visible !important;
                }

                /* 确保按钮容器可以正确换行显示 */
                .xg-right-grid xg-icon {
                    display: inline-block !important;
                    margin: -12px 0 !important;
                }

                /* 防止父容器限制高度导致内容被裁剪 */
                .xgplayer-controls {
                    overflow: visible !important;
                }

                /* 让控制栏底部区域高度自适应 */
                .xgplayer-controls-bottom {
                    height: auto !important;
                    min-height: 50px !important;
                }


            `;
            document.head.appendChild(style);
        }

        mainLoop() {
            this.uiManager.insertButtons();

            const elementsWithText = Array.from(document.querySelectorAll('div,span'))
                .filter(el => el.textContent.includes('进入直播间'));
            const innermostElements = elementsWithText.filter(el => {
                return !elementsWithText.some(otherEl => el !== otherEl && el.contains(otherEl));
            });
            const isLive = innermostElements.some(el => isElementInViewport(el));
            if (isLive) {
                this.lastVideoUrl = "直播";
                if (this.config.isEnabled('skipLive')) {
                    if (!this.isCurrentlySkipping) {
                        this.videoController.skip('⏭️ 自动跳过: 直播间');
                        this.isCurrentlySkipping = true;
                    }
                }
                return;
            }
            this.isCurrentlySkipping = false;
            const activeContainers = document.querySelectorAll(SELECTORS.activeVideo);
            const activeContainer = getBestVisibleElement(activeContainers);
            if (!activeContainer) {
                return;
            }

            const videoEl = activeContainer.querySelector(SELECTORS.videoElement);
            if (!videoEl || !videoEl.src) return;

            const currentVideoUrl = videoEl.src;

            if (this.handleNewVideo(currentVideoUrl)) {
                return;
            }

            if (this.handleSpeedMode(videoEl)) {
                return;
            }

            if (this.handleAIDetection(videoEl)) {
                return;
            }

            if (this.strategies.checkAd(activeContainer)) return;
            if (this.strategies.checkBlockedAccount(activeContainer)) return;
            this.strategies.checkResolution(activeContainer);
        }

        handleNewVideo(currentVideoUrl) {
            if (currentVideoUrl !== this.lastVideoUrl) {
                this.lastVideoUrl = currentVideoUrl;
                this.videoStartTime = Date.now();
                this.speedModeSkipped = false;
                this.aiDetector.reset();
                this.strategies.reset();
                this.assignSpeedModeDuration(true);
                console.log('===== 新视频开始 =====');
                return true;
            }
            return false;
        }

        handleSpeedMode(videoEl) {
            if (!this.config.isEnabled('speedMode') || this.speedModeSkipped || this.aiDetector.hasSkipped) {
                return false;
            }

            const speedConfig = this.config.get('speedMode');
            if (this.currentSpeedMode !== speedConfig.mode) {
                this.assignSpeedModeDuration(false);
            }

            if (speedConfig.mode === 'fixed') {
                if (this.currentSpeedDuration !== speedConfig.seconds) {
                    this.currentSpeedDuration = speedConfig.seconds;
                }
            } else if (speedConfig.mode === 'random') {
                if (this.currentSpeedDuration === null) {
                    this.assignSpeedModeDuration(false);
                }
            }

            const playbackTime = Number.isFinite(videoEl.currentTime) ? videoEl.currentTime : 0;
            const targetSeconds = this.currentSpeedDuration ?? speedConfig.seconds;

            if (playbackTime >= targetSeconds) {
                this.speedModeSkipped = true;
                this.videoController.skip(`⚡️ 极速模式: ${targetSeconds}秒已到`);
                return true;
            }
            return false;
        }

        handleAIDetection(videoEl) {
            if (!this.config.isEnabled('aiPreference')) return false;

            const videoPlayTime = Date.now() - this.videoStartTime;

            if (this.aiDetector.shouldCheck(videoPlayTime)) {
                if (videoEl.readyState >= 2 && !videoEl.paused) {
                    const timeInSeconds = (this.aiDetector.checkSchedule[this.aiDetector.currentCheckIndex] / 1000).toFixed(1);
                    console.log(`【AI检测】第${this.aiDetector.currentCheckIndex + 1}次检测，时间点：${timeInSeconds}秒`);
                    this.aiDetector.processVideo(videoEl);
                    return true;
                }
            }

            if (videoPlayTime >= 10000 && !this.aiDetector.stopChecking) {
                console.log('【超时停止】视频播放已超过10秒，停止AI检测');
                this.aiDetector.stopChecking = true;
            }

            return false;
        }
    }

    // 启动应用
    const app = new DouyinEnhancer();




})();
