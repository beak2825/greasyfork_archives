// ==UserScript==
// @name         Nút Picture-in-Picture (PIP) Đa Năng
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  Bản tối ưu: Giao diện cài đặt mới. Hỗ trợ shortcut, cài đặt, tự động dịch và tự đóng. Tối ưu cấu trúc và sửa lỗi tương thích.
// @author       Lu (Refactored by Gemini)
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533203/N%C3%BAt%20Picture-in-Picture%20%28PIP%29%20%C4%90a%20N%C4%83ng.user.js
// @updateURL https://update.greasyfork.org/scripts/533203/N%C3%BAt%20Picture-in-Picture%20%28PIP%29%20%C4%90a%20N%C4%83ng.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Gom các giá trị hằng số vào một nơi để dễ quản lý.
    const CONSTANTS = {
        SETTINGS_PANEL_Z_INDEX: 10001,
        BUTTON_CONTAINER_Z_INDEX: 10000,
        SETTINGS_PANEL_HIDE_DELAY: 3000, // ms
        SETTINGS_PANEL_FORCE_HIDE_DELAY: 7000, // ms
    };

    // --- MODULE QUẢN LÝ CÀI ĐẶT ---
    const Settings = {
        config: {},
        defaults: {
            isAlwaysOn: false,
            customShortcut: 'CMD+SHIFT+P',
            language: 'auto',
            loopButtonEnabled: true,
        },
        load() {
            for (const key in this.defaults) {
                this.config[key] = GM_getValue(key, this.defaults[key]);
            }
        },
        save(key, value) {
            this.config[key] = value;
            GM_setValue(key, value);
        }
    };

    // --- MODULE ĐA NGÔN NGỮ ---
    const I18n = {
        translations: {
            en: { settingsTitle: "PIP Settings", alwaysOnLabel: "Always show buttons", shortcutLabel: "Shortcut Key", shortcutPrefix: "CMD/CTRL + SHIFT +", languageLabel: "Language", autoLang: "Auto-detect", loopButtonLabel: "Show Loop button", loopButtonTitle: "Toggle Loop", recordingShortcut: "Press a key...", blockedWarning: "This shortcut is blocked by the browser!", conflictWarning: "Note: May conflict with other extensions.", settingButtonTitle: "PIP Settings" },
            vi: { settingsTitle: "Cài đặt PIP", alwaysOnLabel: "Luôn hiển thị nút", shortcutLabel: "Phím tắt", shortcutPrefix: "CMD/CTRL + SHIFT +", languageLabel: "Ngôn ngữ", autoLang: "Tự động", loopButtonLabel: "Hiển thị nút Lặp lại", loopButtonTitle: "Bật/Tắt Lặp lại", recordingShortcut: "Nhấn một phím...", blockedWarning: "Phím tắt này bị trình duyệt chặn!", conflictWarning: "Lưu ý: Có thể trùng với tiện ích khác.", settingButtonTitle: "Cài đặt PIP" }
        },
        getLang() {
            const lang = Settings.config.language;
            return lang === 'auto' ? (navigator.language.startsWith('vi') ? 'vi' : 'en') : lang;
        },
        t(key) {
            const lang = this.getLang();
            // Sửa lỗi tương thích ESLint bằng cách bỏ Optional Chaining (`?.`)
            return (this.translations[lang] && this.translations[lang][key]) || this.translations.en[key];
        }
    };

    // --- MODULE QUẢN LÝ GIAO DIỆN ---
    const UI = {
        settingsPanel: null,
        panelCloseTimer: null,
        isRecordingShortcut: false,
        BLOCKED_SHORTCUTS: ['CMD+SHIFT+Q', 'CTRL+SHIFT+Q', 'CMD+SHIFT+W', 'CTRL+SHIFT+W', 'CMD+SHIFT+T', 'CTRL+SHIFT+T', 'CMD+SHIFT+R', 'CTRL+SHIFT+R', 'CMD+SHIFT+L', 'CTRL+SHIFT+L', 'CMD+SHIFT+F', 'CTRL+SHIFT+F', 'CMD+SHIFT+N', 'CTRL+SHIFT+N'],

        createIcon(type, size = 'default') {
            const iconSizes = {
                small: { iconSize: 16, dimensions: { w: 16, h: 11, lw: 1.2, rW: 6, rH: 4, rX: 8, rY: 5 } },
                medium: { iconSize: 18, dimensions: { w: 18, h: 13, lw: 1.5, rW: 7, rH: 5, rX: 9, rY: 6 } },
                default: { iconSize: 22, dimensions: { w: 22, h: 16, lw: 2, rW: 9, rH: 6, rX: 11, rY: 8 } }
            };
            const { iconSize, dimensions } = iconSizes[size];

            if (type === 'pip') {
                const canvas = document.createElement('canvas');
                canvas.width = dimensions.w;
                canvas.height = dimensions.h;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = dimensions.lw;
                    ctx.strokeRect(1, 1, dimensions.w - 2, dimensions.h - 2);
                    ctx.fillStyle = 'white';
                    ctx.fillRect(dimensions.rX, dimensions.rY, dimensions.rW, dimensions.rH);
                }
                return canvas;
            }
            // Sử dụng template literal để SVG dễ đọc hơn.
            if (type === 'settings') return `
                <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10c0-2.28-.81-4.4-2.18-6.08a10.04 10.04 0 0 0-1.82-2.32A10.04 10.04 0 0 0 12 2zm0 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>`;
            if (type === 'loop') return `
                <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>`;
        },

        injectStyles() {
            const styles = `
                .Lu-pip-settings-panel {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    position: fixed; z-index: ${CONSTANTS.SETTINGS_PANEL_Z_INDEX};
                    background-color: rgba(40, 40, 40, 0.8);
                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                    color: white; border-radius: 0.75rem; padding: 1rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: none;
                    width: 17.5rem; border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .Lu-pip-settings-panel h3 { margin: 0 0 0.75rem 0; font-size: 1rem; border-bottom: 1px solid #444; padding-bottom: 0.5rem; }
                .Lu-pip-settings-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem; padding: 0.5rem 0.25rem; }
                .settings-group { margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
                .shortcut-container { display: flex; align-items: center; gap: 0.3125rem; }
                #Lu-pip-language-select { background-color: #333; color: white; border: 1px solid #555; border-radius: 0.375rem; padding: 0.375rem; cursor: pointer; }
                #Lu-pip-shortcut-input { border: 1px solid #555; background-color: #333; padding: 0.375rem 0.625rem; border-radius: 0.375rem; text-align: center; font-weight: 500; min-width: 3.125rem; transition: all 0.2s; cursor: pointer; }
                #Lu-pip-shortcut-input.recording { background-color: #007aff; color: white; border-color: #007aff; }
                #Lu-pip-shortcut-warning { color: #ffcc00; font-size: 0.6875rem; text-align: right; margin-top: 0.25rem; height: 0.875rem; }
                .Lu-pip-control-button { background-color: transparent; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out; }
                .Lu-pip-control-button:hover { background-color: rgba(255, 255, 255, 0.15); transform: scale(1.1); }
                .Lu-pip-loop-button.active { background-color: #007aff; }
                .Lu-pip-loop-button.active:hover { background-color: #0056b3; }
                .switch { position: relative; display: inline-block; width: 34px; height: 20px; flex-shrink: 0; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .4s; border-radius: 20px; }
                .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider { background-color: #007aff; }
                input:checked + .slider:before { transform: translateX(14px); }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        },

        createSettingsPanel() {
            this.injectStyles();
            const panel = document.createElement('div');
            panel.className = 'Lu-pip-settings-panel';
            panel.innerHTML = `
                <h3 data-lang-key="settingsTitle"></h3>
                <div class="Lu-pip-settings-row">
                    <span data-lang-key="languageLabel"></span>
                    <select id="Lu-pip-language-select">
                        <option value="auto" data-lang-key="autoLang"></option>
                        <option value="en">English</option><option value="vi">Tiếng Việt</option>
                    </select>
                </div>
                <div class="settings-group">
                    <div class="Lu-pip-settings-row">
                        <span data-lang-key="alwaysOnLabel"></span>
                        <label class="switch"><input type="checkbox" id="Lu-pip-always-on"><span class="slider"></span></label>
                    </div>
                    <div class="Lu-pip-settings-row">
                        <span data-lang-key="loopButtonLabel"></span>
                        <label class="switch"><input type="checkbox" id="Lu-pip-loop-enabled"><span class="slider"></span></label>
                    </div>
                </div>
                <div class="settings-group">
                    <div class="Lu-pip-settings-row">
                        <span data-lang-key="shortcutLabel"></span>
                        <div class="shortcut-container">
                            <span data-lang-key="shortcutPrefix"></span>
                            <div id="Lu-pip-shortcut-input"></div>
                        </div>
                    </div>
                    <div class="Lu-pip-settings-row" style="justify-content: flex-end;">
                        <small id="Lu-pip-shortcut-warning"></small>
                    </div>
                </div>
            `;
            document.body.appendChild(panel);
            this.settingsPanel = panel;
            this.bindPanelEvents();
            this.updatePanelUI();
        },

        updatePanelUI() {
            this.settingsPanel.querySelectorAll('[data-lang-key]').forEach(el => {
                el.textContent = I18n.t(el.dataset.langKey);
            });
            this.settingsPanel.querySelector('#Lu-pip-always-on').checked = Settings.config.isAlwaysOn;
            this.settingsPanel.querySelector('#Lu-pip-loop-enabled').checked = Settings.config.loopButtonEnabled;
            this.settingsPanel.querySelector('#Lu-pip-shortcut-input').textContent = Settings.config.customShortcut.split('+').pop();
            this.settingsPanel.querySelector('#Lu-pip-language-select').value = Settings.config.language;
        },

        bindPanelEvents() {
            const { settingsPanel } = this;
            const alwaysOnCheckbox = settingsPanel.querySelector('#Lu-pip-always-on');
            const loopCheckbox = settingsPanel.querySelector('#Lu-pip-loop-enabled');
            const shortcutInput = settingsPanel.querySelector('#Lu-pip-shortcut-input');
            const langSelect = settingsPanel.querySelector('#Lu-pip-language-select');

            const hidePanel = () => {
                if (settingsPanel.style.display === 'block') {
                    settingsPanel.style.display = 'none';
                }
                clearTimeout(this.panelCloseTimer);
                if (this.isRecordingShortcut) {
                    this.stopRecordingShortcut(shortcutInput, true); // Cancel recording
                }
            };

            document.addEventListener('click', hidePanel);
            settingsPanel.addEventListener('click', (e) => e.stopPropagation());
            settingsPanel.addEventListener('mouseenter', () => clearTimeout(this.panelCloseTimer));
            settingsPanel.addEventListener('mouseleave', () => {
                this.panelCloseTimer = setTimeout(hidePanel, CONSTANTS.SETTINGS_PANEL_HIDE_DELAY);
            });

            langSelect.addEventListener('change', () => {
                Settings.save('language', langSelect.value);
                this.updatePanelUI();
            });

            alwaysOnCheckbox.addEventListener('change', () => {
                Settings.save('isAlwaysOn', alwaysOnCheckbox.checked);
                document.querySelectorAll('.Lu-pip-button-container').forEach(container => {
                    this.updateButtonVisibility(container, container.parentElement);
                });
            });

            loopCheckbox.addEventListener('change', () => {
                Settings.save('loopButtonEnabled', loopCheckbox.checked);
                document.querySelectorAll('.Lu-pip-loop-button').forEach(btn => {
                    btn.style.display = Settings.config.loopButtonEnabled ? 'flex' : 'none';
                });
            });

            shortcutInput.addEventListener('click', () => this.startRecordingShortcut(shortcutInput));
        },

        startRecordingShortcut(inputEl) {
            if (this.isRecordingShortcut) return;
            this.isRecordingShortcut = true;

            inputEl.textContent = '...';
            inputEl.classList.add('recording');
            this.settingsPanel.querySelector('#Lu-pip-shortcut-warning').textContent = I18n.t('recordingShortcut');

            const handleRecording = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const key = e.key.toUpperCase();
                if (!['CONTROL', 'SHIFT', 'ALT', 'META'].includes(key) && key.length === 1 && /[A-Z0-9]/.test(key)) {
                    const newShortcut = `CMD+SHIFT+${key}`;
                    const newShortcutCtrl = `CTRL+SHIFT+${key}`;
                    if (this.BLOCKED_SHORTCUTS.includes(newShortcut) || this.BLOCKED_SHORTCUTS.includes(newShortcutCtrl)) {
                        this.settingsPanel.querySelector('#Lu-pip-shortcut-warning').textContent = I18n.t('blockedWarning');
                    } else {
                        Settings.save('customShortcut', newShortcut);
                        this.settingsPanel.querySelector('#Lu-pip-shortcut-warning').textContent = I18n.t('conflictWarning');
                    }
                }
                this.stopRecordingShortcut(inputEl);
            };

            const captureOptions = { capture: true, once: true };
            window.addEventListener('keydown', handleRecording, captureOptions);
        },

        stopRecordingShortcut(inputEl, cancelled = false) {
            if (!this.isRecordingShortcut) return;
            if (!cancelled) {
                inputEl.textContent = Settings.config.customShortcut.split('+').pop();
            } else {
                // Restore previous text if cancelled
                this.updatePanelUI();
                this.settingsPanel.querySelector('#Lu-pip-shortcut-warning').textContent = '';
            }
            inputEl.classList.remove('recording');
            this.isRecordingShortcut = false;
        },
        
        showSettingsPanel(anchorButton) {
            clearTimeout(this.panelCloseTimer);
            const buttonRect = anchorButton.getBoundingClientRect();

            // Calculate position before showing to avoid flicker
            this.settingsPanel.style.visibility = 'hidden';
            this.settingsPanel.style.display = 'block';
            const panelRect = this.settingsPanel.getBoundingClientRect();
            
            let top = buttonRect.top - panelRect.height - 10; // Position above button
            let left = buttonRect.right - panelRect.width;

            // Adjust if out of viewport
            if (top < 10) top = buttonRect.bottom + 10;
            if (top + panelRect.height > window.innerHeight - 10) top = window.innerHeight - panelRect.height - 10;
            if (left < 10) left = 10;
            
            this.settingsPanel.style.top = `${top}px`;
            this.settingsPanel.style.left = `${left}px`;
            
            this.settingsPanel.style.visibility = 'visible';
            
            this.panelCloseTimer = setTimeout(() => {
                this.settingsPanel.style.display = 'none';
            }, CONSTANTS.SETTINGS_PANEL_FORCE_HIDE_DELAY);
        },

        updateButtonVisibility(container, parent) {
            const isHovering = parent.matches(':hover');
            const shouldBeVisible = Settings.config.isAlwaysOn || isHovering;
            container.style.opacity = shouldBeVisible ? '1' : '0';
            container.style.pointerEvents = shouldBeVisible ? 'auto' : 'none';
        },

        addButtonsToVideo(videoElement) {
            if (videoElement.dataset.pipButtonsAdded) return;
            videoElement.dataset.pipButtonsAdded = 'true';

            const parent = videoElement.parentElement;
            if (getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'Lu-pip-button-container';
            Object.assign(buttonContainer.style, {
                position: 'absolute', top: '10px', right: '10px',
                zIndex: CONSTANTS.BUTTON_CONTAINER_Z_INDEX,
                backgroundColor: 'rgba(28, 28, 28, 0.8)',
                borderRadius: '9999px', padding: '4px',
                display: 'flex', gap: '4px',
                opacity: '0', pointerEvents: 'none',
                transition: 'opacity 0.2s ease-in-out, right 0.2s ease-in-out, top 0.2s ease-in-out',
            });

            const createButton = (className, title, innerHTML) => {
                const button = document.createElement('button');
                button.className = `Lu-pip-control-button ${className}`;
                button.title = title;
                if (innerHTML) button.innerHTML = innerHTML;
                buttonContainer.appendChild(button);
                return button;
            };

            const loopButton = createButton('Lu-pip-loop-button', I18n.t('loopButtonTitle'));
            const pipButton = createButton('Lu-pip-button', 'Picture-in-Picture');
            const settingsButton = createButton('Lu-pip-settings-button', I18n.t('settingButtonTitle'));
            parent.appendChild(buttonContainer);
            
            const updateButtonAttributes = () => {
                const videoHeight = videoElement.clientHeight;
                let size = 'default';
                if (videoHeight < 200) size = 'small';
                else if (videoHeight < 360) size = 'medium';

                const buttonSizes = { small: 28, medium: 32, default: 40 };
                const buttonSize = buttonSizes[size];

                pipButton.innerHTML = ''; pipButton.appendChild(this.createIcon('pip', size));
                settingsButton.innerHTML = this.createIcon('settings', size);
                loopButton.innerHTML = this.createIcon('loop', size);

                [pipButton, settingsButton, loopButton].forEach(btn => {
                    btn.style.width = `${buttonSize}px`;
                    btn.style.height = `${buttonSize}px`;
                });

                // Logic to avoid overlapping existing buttons
                let topPos = 10;
                const parentRect = parent.getBoundingClientRect();
                const nativeControls = parent.querySelectorAll('button, [role="button"]');
                for (const control of nativeControls) {
                    if (control.closest('.Lu-pip-button-container') || control.offsetParent === null) continue;
                    const controlRect = control.getBoundingClientRect();
                    // If a control is in the top-right corner area
                    if (controlRect.top - parentRect.top < 45 && parentRect.right - controlRect.right < 150) {
                        topPos = 50;
                        break;
                    }
                }
                buttonContainer.style.top = `${topPos}px`;
            };

            updateButtonAttributes();
            new ResizeObserver(updateButtonAttributes).observe(videoElement);

            pipButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    if (videoElement !== document.pictureInPictureElement) {
                        await videoElement.requestPictureInPicture();
                    } else {
                        await document.exitPictureInPicture();
                    }
                } catch (error) {
                    console.error('PIP Error:', error);
                }
            });
            
            settingsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSettingsPanel(settingsButton);
            });
            
            loopButton.addEventListener('click', (e) => {
                e.stopPropagation();
                videoElement.loop = !videoElement.loop;
                loopButton.classList.toggle('active', videoElement.loop);
            });

            loopButton.style.display = Settings.config.loopButtonEnabled ? 'flex' : 'none';
            loopButton.classList.toggle('active', videoElement.loop);

            parent.addEventListener('mouseenter', () => this.updateButtonVisibility(buttonContainer, parent));
            parent.addEventListener('mouseleave', () => this.updateButtonVisibility(buttonContainer, parent));
            
            // Initial visibility check
            this.updateButtonVisibility(buttonContainer, parent);
        }
    };

    // --- MODULE ỨNG DỤNG CHÍNH ---
    const App = {
        uiInitialized: false,

        isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
        },

        async handlePipShortcut(e) {
            if (UI.isRecordingShortcut) return;

            const shortcutParts = Settings.config.customShortcut.split('+');
            const key = shortcutParts.pop();
            const isModifierPressed = e.shiftKey && (e.metaKey || e.ctrlKey);

            if (e.key.toUpperCase() === key && isModifierPressed) {
                e.preventDefault();
                try {
                    if (document.pictureInPictureElement) {
                        await document.exitPictureInPicture();
                        return;
                    }
                    
                    const videos = Array.from(document.querySelectorAll('video'))
                        .filter(v => this.isElementInViewport(v) && v.readyState > 2 && v.disablePictureInPicture === false)
                        .sort((a, b) => {
                            // Ưu tiên video đang phát
                            if (!a.paused && b.paused) return -1;
                            if (a.paused && !b.paused) return 1;
                            // Ưu tiên video có diện tích lớn hơn
                            const areaA = a.clientWidth * a.clientHeight;
                            const areaB = b.clientWidth * b.clientHeight;
                            return areaB - areaA;
                        });

                    if (videos.length > 0) {
                        await videos[0].requestPictureInPicture();
                    }
                } catch (error) {
                    console.error('PIP Shortcut Error:', error);
                }
            }
        },

        scanForVideos() {
            const videos = document.querySelectorAll('video:not([data-pip-buttons-added])');
            if (videos.length > 0) {
                if (!this.uiInitialized) {
                    this.activateFeatures();
                }
                videos.forEach(video => UI.addButtonsToVideo(video));
            }
        },

        activateFeatures() {
            if (this.uiInitialized) return;
            this.uiInitialized = true;
            UI.createSettingsPanel();
            document.addEventListener('keydown', (e) => this.handlePipShortcut(e));
        },

        init() {
            Settings.load();
            
            this.scanForVideos();

            const observer = new MutationObserver(() => this.scanForVideos());
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    // --- KHỞI CHẠY SCRIPT ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();