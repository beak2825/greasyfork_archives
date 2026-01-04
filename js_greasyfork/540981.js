// ==UserScript==
// @name               Force Native Browser Find (Restore Ctrl+F Search)
// @name:ar            فرض البحث الأصلي للمتصفح (استعادة Ctrl+F)
// @name:es            Forzar Búsqueda Nativa del Navegador (Restaurar Ctrl+F)
// @name:fr            Forcer la Recherche Native du Navigateur (Restaurer Ctrl+F)
// @name:hi            मूल ब्राउज़र खोज को सक्षम करें (Ctrl+F को पुनर्स्थापित करें)
// @name:id            Paksa Pencarian Asli Browser (Kembalikan Ctrl+F)
// @name:ja            ブラウザ標準検索を強制使用（Ctrl+F復元）
// @name:ko            브라우저 기본 검색 강제 사용 (Ctrl+F 복원)
// @name:nl            Forceer Standaard Browserzoeken (Herstel Ctrl+F)
// @name:pt-BR         Forçar Busca Nativa do Navegador (Restaurar Ctrl+F)
// @name:ru            Принудительный Поиск Браузера (Восстановить Ctrl+F)
// @name:vi            Bắt Buộc Tìm Kiếm Gốc Trình Duyệt (Khôi Phục Ctrl+F)
// @name:zh-CN         强制浏览器原生搜索（恢复 Ctrl+F）
// @name:zh-TW         強制瀏覽器原生搜尋（恢復 Ctrl+F）
// @description        Prevents websites from overriding the browser's built-in Ctrl+F search functionality.
// @description:ar     يمنع المواقع من تجاوز وظيفة البحث المدمجة Ctrl+F في المتصفح.
// @description:es     Evita que los sitios web anulen la función de búsqueda Ctrl+F integrada del navegador.
// @description:fr     Empêche les sites web de remplacer la fonction de recherche Ctrl+F intégrée du navigateur.
// @description:hi     वेबसाइटों को ब्राउज़र के अंतर्निहित Ctrl+F खोज कार्यक्षमता को बदलने से रोकता है।
// @description:id     Mencegah situs web mengganti fungsi pencarian Ctrl+F bawaan browser.
// @description:ja     ウェブサイトがブラウザ内蔵のCtrl+F検索機能を無効化することを防ぎます。
// @description:ko     웹사이트가 브라우저의 기본 Ctrl+F 검색 기능을 무력화하는 것을 방지합니다.
// @description:nl     Voorkomt dat websites de ingebouwde Ctrl+F zoekfunctie van de browser uitschakelen.
// @description:pt-BR  Impede que sites desabilitem a função de busca Ctrl+F integrada do navegador.
// @description:ru     Предотвращает отключение встроенной функции поиска Ctrl+F браузера сайтами.
// @description:vi     Ngăn các trang web vô hiệu hóa chức năng tìm kiếm Ctrl+F tích hợp của trình duyệt.
// @description:zh-CN  防止网站覆盖浏览器内置的 Ctrl+F 搜索功能。
// @description:zh-TW  防止網站覆蓋瀏覽器內建的 Ctrl+F 搜尋功能。
// @namespace    Bigrand
// @version      1.0.1
// @match        *://*/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540981/Force%20Native%20Browser%20Find%20%28Restore%20Ctrl%2BF%20Search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540981/Force%20Native%20Browser%20Find%20%28Restore%20Ctrl%2BF%20Search%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURATION
    const CONFIG = {
        shortcuts: {
            toggleUI: GM_getValue('shortcut_ui', 'ctrl+shift+s'),
            quickToggle: GM_getValue('shortcut_toggle', 'ctrl+shift+d')
        },
        keys: {
            SITE_PROTECTION: `ctrlf_${location.hostname}`,
            GLOBAL_PROTECTION: 'ctrlf_global',
            SHOW_UI: 'ctrlf_show_ui'
        },
        ui: {
            showDelay: 500,
            notificationDuration: 3000,
            shortcutRecordTimeout: 5000
        }
    };

    // STATE MANAGEMENT
    const state = {
        global: GM_getValue(CONFIG.keys.GLOBAL_PROTECTION, true),
        site: GM_getValue(CONFIG.keys.SITE_PROTECTION, null),
        showUI: GM_getValue(CONFIG.keys.SHOW_UI, true),
        uiVisible: false,
        recordingShortcut: null,
        panel: null,
        cleanupFunctions: new Set()
    };

    // CORE PROTECTION LOGIC
    const protection = {
        isEnabled() {
            return state.site !== null ? state.site : state.global;
        },

        getSource() {
            return state.site !== null ? 'site' : 'global';
        },

        toggle() {
            if (state.site !== null) {
                state.site = !state.site;
                GM_setValue(CONFIG.keys.SITE_PROTECTION, state.site);
            } else {
                state.global = !state.global;
                GM_setValue(CONFIG.keys.GLOBAL_PROTECTION, state.global);
            }

            ui.update();
            utils.showNotification(
                `Protection ${this.isEnabled() ? 'ON' : 'OFF'} ${this.getSource() === 'site' ? 'for this site' : 'globally'}`
            );
        },

        resetSite() {
            state.site = null;
            GM_setValue(CONFIG.keys.SITE_PROTECTION, null);
            ui.update();
        }
    };

    // KEYBOARD HANDLING
    const keyboard = {
        matchShortcut(e, shortcut) {
            const parts = shortcut.split('+');
            const key = parts.pop();
            return e.ctrlKey === parts.includes('ctrl') &&
                   e.shiftKey === parts.includes('shift') &&
                   e.altKey === parts.includes('alt') &&
                   !e.metaKey &&
                   e.key.toLowerCase() === key;
        },

        handleKeydown(e) {
            if (state.recordingShortcut) return;

            if (this.matchShortcut(e, CONFIG.shortcuts.toggleUI)) {
                e.preventDefault();
                e.stopImmediatePropagation();
                ui.toggle();
                return;
            }

            if (this.matchShortcut(e, CONFIG.shortcuts.quickToggle)) {
                e.preventDefault();
                e.stopImmediatePropagation();
                protection.toggle();
                return;
            }

            // Protect Ctrl+F
            if (e.ctrlKey && !e.altKey && !e.metaKey && e.key.toLowerCase() === 'f') {
                if (protection.isEnabled()) {
                    e.stopImmediatePropagation();
                }
            }
        },

        recordShortcut(btn) {
            if (state.recordingShortcut) return;

            const type = btn.dataset.type;
            const originalDisplay = btn.querySelector('.ctrlf-shortcut-display').textContent;
            state.recordingShortcut = type;

            btn.classList.add('recording');
            btn.querySelector('.ctrlf-shortcut-hint').textContent = 'Press keys...';

            let timeoutId;
            let keydownHandler;
            let escapeHandler;

            const cleanup = () => {
                btn.classList.remove('recording');
                btn.querySelector('.ctrlf-shortcut-hint').textContent = 'Click to change';

                if (keydownHandler) {
                    document.removeEventListener('keydown', keydownHandler, true);
                    keydownHandler = null;
                }
                if (escapeHandler) {
                    document.removeEventListener('keydown', escapeHandler, true);
                    escapeHandler = null;
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }

                state.recordingShortcut = null;
            };

            keydownHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Handle escape to cancel
                if (e.key === 'Escape') {
                    utils.showNotification('Shortcut recording cancelled');
                    cleanup();
                    return;
                }

                // Ignore modifier-only keys
                if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

                const parts = [];
                if (e.ctrlKey) parts.push('ctrl');
                if (e.shiftKey) parts.push('shift');
                if (e.altKey) parts.push('alt');

                // Validate key input
                const key = e.key.toLowerCase();
                if (key.length === 1 && /[a-z0-9]/.test(key)) {
                    parts.push(key);
                } else if (['enter', 'space', 'tab'].includes(key)) {
                    parts.push(key);
                } else {
                    utils.showNotification('Invalid key combination');
                    cleanup();
                    return;
                }

                const newShortcut = parts.join('+');

                if (parts.length >= 2) {
                    // Check for conflicts
                    const existingShortcuts = Object.values(CONFIG.shortcuts);
                    if (existingShortcuts.includes(newShortcut) && CONFIG.shortcuts[type] !== newShortcut) {
                        utils.showNotification('Shortcut already in use');
                        cleanup();
                        return;
                    }

                    CONFIG.shortcuts[type] = newShortcut;
                    GM_setValue(`shortcut_${type === 'toggleUI' ? 'ui' : 'toggle'}`, newShortcut);
                    btn.querySelector('.ctrlf-shortcut-display').textContent = newShortcut;
                    utils.showNotification(`Shortcut updated: ${newShortcut}`);
                    cleanup();
                } else {
                    utils.showNotification('Shortcut must include modifier key');
                    cleanup();
                }
            };

            document.addEventListener('keydown', keydownHandler, true);

            // Auto-cleanup after timeout
            timeoutId = setTimeout(() => {
                utils.showNotification('Shortcut recording timed out');
                cleanup();
            }, CONFIG.ui.shortcutRecordTimeout);
        }
    };

    // UI MANAGEMENT
    const ui = {
        toggle() {
            state.uiVisible ? this.hide() : this.show();
        },

        show() {
            if (state.panel) return;

            state.uiVisible = true;
            state.panel = utils.createElement('div', 'ctrlf-panel', this.getHTML());

            utils.addStyles();
            const cleanup = utils.makeDraggable(state.panel, state.panel.querySelector('.ctrlf-header'));
            state.cleanupFunctions.add(cleanup);
            this.setupEventListeners();
            document.body.appendChild(state.panel);
            this.update();
        },

        hide() {
            if (state.panel) {
                // Cleanup all event listeners
                state.cleanupFunctions.forEach(cleanup => cleanup());
                state.cleanupFunctions.clear();

                state.panel.remove();
                state.panel = null;
                state.uiVisible = false;
            }
        },

        getHTML() {
            return `
                <div class="ctrlf-header">
                    <span class="ctrlf-title">Ctrl+F Protection</span>
                    <button class="ctrlf-close" title="Close (${CONFIG.shortcuts.toggleUI})">&times;</button>
                </div>
                <div class="ctrlf-content">
                    <div class="ctrlf-status">
                        <div class="ctrlf-status-indicator"></div>
                        <span class="ctrlf-status-text"></span>
                    </div>

                    <div class="ctrlf-section">
                        <div class="ctrlf-control-group">
                            <label class="ctrlf-toggle-label">
                                <input type="checkbox" class="ctrlf-toggle" id="globalToggle">
                                <span class="ctrlf-toggle-slider"></span>
                                <span class="ctrlf-toggle-text">Global Protection</span>
                            </label>
                            <small class="ctrlf-control-desc">Default protection for all websites</small>
                        </div>

                        <div class="ctrlf-control-group">
                            <label class="ctrlf-toggle-label">
                                <input type="checkbox" class="ctrlf-toggle" id="siteToggle">
                                <span class="ctrlf-toggle-slider"></span>
                                <span class="ctrlf-toggle-text">Override for ${location.hostname}</span>
                            </label>
                            <small class="ctrlf-control-desc">Site-specific override (takes priority)</small>
                        </div>

                        <button class="ctrlf-reset-btn" id="resetSite">Reset to Global</button>
                    </div>

                    <div class="ctrlf-section">
                        <h4>Settings</h4>
                        <div class="ctrlf-control-group">
                            <label class="ctrlf-toggle-label">
                                <input type="checkbox" class="ctrlf-toggle" id="showUIToggle">
                                <span class="ctrlf-toggle-slider"></span>
                                <span class="ctrlf-toggle-text">Show UI on page load</span>
                            </label>
                        </div>
                    </div>

                    <div class="ctrlf-section">
                        <h4>Shortcuts</h4>
                        <div class="ctrlf-shortcut-item">
                            <label>Toggle UI:</label>
                            <button class="ctrlf-shortcut-btn" data-type="toggleUI">
                                <span class="ctrlf-shortcut-display">${CONFIG.shortcuts.toggleUI}</span>
                                <span class="ctrlf-shortcut-hint">Click to change</span>
                            </button>
                        </div>
                        <div class="ctrlf-shortcut-item">
                            <label>Quick toggle:</label>
                            <button class="ctrlf-shortcut-btn" data-type="quickToggle">
                                <span class="ctrlf-shortcut-display">${CONFIG.shortcuts.quickToggle}</span>
                                <span class="ctrlf-shortcut-hint">Click to change</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },

        update() {
            if (!state.panel) return;

            const isEnabled = protection.isEnabled();
            const source = protection.getSource();

            // Status indicator and text
            const indicator = state.panel.querySelector('.ctrlf-status-indicator');
            const statusText = state.panel.querySelector('.ctrlf-status-text');
            indicator.classList.toggle('active', isEnabled);
            statusText.textContent = `Protection ${isEnabled ? 'ON' : 'OFF'} (${source === 'site' ? 'site override' : 'global'})`;

            // Toggle states
            state.panel.querySelector('#globalToggle').checked = state.global;
            state.panel.querySelector('#siteToggle').checked = state.site !== null ? state.site : state.global;
            state.panel.querySelector('#showUIToggle').checked = state.showUI;

            // Reset button state
            const resetBtn = state.panel.querySelector('#resetSite');
            resetBtn.disabled = state.site === null;
            resetBtn.style.opacity = state.site === null ? '0.5' : '1';

            // Site toggle visual state
            const siteLabel = state.panel.querySelector('#siteToggle').closest('.ctrlf-toggle-label');
            const siteText = siteLabel.querySelector('.ctrlf-toggle-text');
            if (state.site !== null) {
                siteLabel.style.opacity = '1';
                siteText.textContent = `Override for ${location.hostname} (${state.site ? 'ON' : 'OFF'})`;
            } else {
                siteLabel.style.opacity = '0.7';
                siteText.textContent = `Override for ${location.hostname} (using global)`;
            }
        },

        setupEventListeners() {
            const panel = state.panel;

            // Close button
            panel.querySelector('.ctrlf-close').addEventListener('click', () => this.hide());

            // Global toggle
            panel.querySelector('#globalToggle').addEventListener('change', (e) => {
                state.global = e.target.checked;
                GM_setValue(CONFIG.keys.GLOBAL_PROTECTION, state.global);
                this.update();
            });

            // Site toggle
            panel.querySelector('#siteToggle').addEventListener('change', (e) => {
                if (state.site === null) {
                    state.site = !state.global;
                } else {
                    state.site = e.target.checked;
                }
                GM_setValue(CONFIG.keys.SITE_PROTECTION, state.site);
                this.update();
            });

            // Reset button
            panel.querySelector('#resetSite').addEventListener('click', () => {
                protection.resetSite();
            });

            // Show UI toggle
            panel.querySelector('#showUIToggle').addEventListener('change', (e) => {
                state.showUI = e.target.checked;
                GM_setValue(CONFIG.keys.SHOW_UI, state.showUI);
            });

            // Shortcut buttons
            panel.querySelectorAll('.ctrlf-shortcut-btn').forEach(btn => {
                btn.addEventListener('click', () => keyboard.recordShortcut(btn));
            });
        }
    };

    // UTILITY FUNCTIONS
    const utils = {
        createElement(tag, className, html) {
            const el = document.createElement(tag);
            el.className = className;
            el.innerHTML = html;
            return el;
        },

        makeDraggable(element, handle) {
            let isDragging = false;
            let startX, startY, startLeft, startTop;
            const controller = new AbortController();
            const options = { signal: controller.signal };

            const handleMouseDown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = element.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
                e.preventDefault();
            };

            const handleMouseMove = (e) => {
                if (!isDragging) return;
                const newLeft = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, startLeft + e.clientX - startX));
                const newTop = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, startTop + e.clientY - startY));
                element.style.left = newLeft + 'px';
                element.style.top = newTop + 'px';
                element.style.right = 'auto';
            };

            const handleMouseUp = () => {
                isDragging = false;
            };

            handle.addEventListener('mousedown', handleMouseDown, options);
            document.addEventListener('mousemove', handleMouseMove, options);
            document.addEventListener('mouseup', handleMouseUp, options);

            // Return cleanup function
            return () => controller.abort();
        },

        showNotification(message) {
            // Ensure styles are added before creating notification
            this.addStyles();

            const notification = this.createElement('div', 'ctrlf-notification', message);
            document.body.appendChild(notification);

            // Use requestAnimationFrame to ensure the element is in the DOM before animating
            requestAnimationFrame(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(-50%) translateY(0)';
            });

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(-10px)';

                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, CONFIG.ui.notificationDuration);
        },

        addStyles() {
            if (document.querySelector('#ctrlf-styles')) return;

            const style = document.createElement('style');
            style.id = 'ctrlf-styles';
            style.textContent = `
                .ctrlf-panel {
                    position: fixed; top: 20px; right: 20px; width: 340px;
                    background: rgba(255,255,255,0.95); color: #333; border-radius: 12px;
                    font: 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
                    z-index: 999999; box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    backdrop-filter: blur(20px); border: 1px solid rgba(0,0,0,0.1);
                    cursor: move; user-select: none;
                }

                @media (prefers-color-scheme: dark) {
                    .ctrlf-panel {
                        background: rgba(30,30,30,0.95); color: #fff;
                        border: 1px solid rgba(255,255,255,0.1);
                    }
                }

                .ctrlf-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.1);
                }

                @media (prefers-color-scheme: dark) {
                    .ctrlf-header { border-bottom: 1px solid rgba(255,255,255,0.1); }
                }

                .ctrlf-title { font-weight: 600; font-size: 16px; }

                .ctrlf-close {
                    background: none; border: none; color: currentColor; font-size: 24px;
                    cursor: pointer; padding: 4px; width: 32px; height: 32px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 6px; transition: background-color 0.2s;
                }

                .ctrlf-close:hover { background: rgba(0,0,0,0.1); }
                @media (prefers-color-scheme: dark) {
                    .ctrlf-close:hover { background: rgba(255,255,255,0.1); }
                }

                .ctrlf-content { padding: 20px; }
                .ctrlf-section { margin-bottom: 24px; }
                .ctrlf-section:last-child { margin-bottom: 0; }
                .ctrlf-section h4 { margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #666; }
                @media (prefers-color-scheme: dark) {
                    .ctrlf-section h4 { color: #999; }
                }

                .ctrlf-status {
                    display: flex; align-items: center; gap: 12px; padding: 16px;
                    background: rgba(0,0,0,0.05); border-radius: 8px; margin-bottom: 24px;
                }
                @media (prefers-color-scheme: dark) {
                    .ctrlf-status { background: rgba(255,255,255,0.05); }
                }

                .ctrlf-status-indicator {
                    width: 12px; height: 12px; border-radius: 50%; background: #ef4444;
                    transition: background-color 0.3s;
                }
                .ctrlf-status-indicator.active { background: #22c55e; }
                .ctrlf-status-text { font-weight: 500; font-size: 15px; }

                .ctrlf-control-group { margin-bottom: 16px; }
                .ctrlf-control-group:last-child { margin-bottom: 0; }

                .ctrlf-toggle-label {
                    display: flex; align-items: center; gap: 12px; cursor: pointer; margin-bottom: 4px;
                }

                .ctrlf-toggle { display: none; }

                .ctrlf-toggle-slider {
                    width: 44px; height: 24px; background: #ddd; border-radius: 12px;
                    position: relative; transition: background-color 0.3s; flex-shrink: 0;
                }

                .ctrlf-toggle-slider::before {
                    content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px;
                    background: white; border-radius: 50%; transition: transform 0.3s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .ctrlf-toggle:checked + .ctrlf-toggle-slider { background: #007acc; }
                .ctrlf-toggle:checked + .ctrlf-toggle-slider::before { transform: translateX(20px); }

                .ctrlf-toggle-text { font-weight: 500; }

                .ctrlf-control-desc {
                    font-size: 12px; color: #666; margin-left: 56px;
                }
                @media (prefers-color-scheme: dark) {
                    .ctrlf-control-desc { color: #999; }
                }

                .ctrlf-reset-btn {
                    background: none; border: 1px solid #ddd; color: #666; padding: 8px 16px;
                    border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s;
                    margin-left: 56px;
                }
                .ctrlf-reset-btn:hover { background: rgba(0,0,0,0.05); border-color: #999; }
                @media (prefers-color-scheme: dark) {
                    .ctrlf-reset-btn { border-color: #555; color: #999; }
                    .ctrlf-reset-btn:hover { background: rgba(255,255,255,0.05); border-color: #777; }
                }

                .ctrlf-shortcut-item {
                    display: flex; align-items: center; margin-bottom: 12px;
                }
                .ctrlf-shortcut-item label { width: 100px; font-size: 13px; color: #666; }
                @media (prefers-color-scheme: dark) {
                    .ctrlf-shortcut-item label { color: #999; }
                }

                .ctrlf-shortcut-btn {
                    flex: 1; padding: 8px 12px; background: rgba(0,0,0,0.05);
                    border: 1px solid #ddd; border-radius: 6px; color: currentColor;
                    font: 12px 'SF Mono',Monaco,monospace; cursor: pointer;
                    transition: all 0.2s; text-align: left;
                }
                .ctrlf-shortcut-btn:hover { background: rgba(0,0,0,0.1); border-color: #999; }
                .ctrlf-shortcut-btn:focus, .ctrlf-shortcut-btn.recording {
                    outline: none; border-color: #007acc; box-shadow: 0 0 0 3px rgba(0,122,204,0.1);
                    background: rgba(0,122,204,0.05);
                }

                .ctrlf-shortcut-display { font-weight: 500; }
                .ctrlf-shortcut-hint { font-size: 10px; opacity: 0.6; margin-left: 8px; }
                .ctrlf-shortcut-btn.recording .ctrlf-shortcut-hint { opacity: 1; color: #007acc; }

                .ctrlf-notification {
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-10px);
                    background: rgba(0,0,0,0.85); color: white; padding: 12px 20px;
                    border-radius: 8px; font-size: 14px; font-weight: 500;
                    z-index: 1000000; pointer-events: none;
                    backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    opacity: 0; transition: all 0.3s ease;
                }

                @media (prefers-color-scheme: dark) {
                    .ctrlf-shortcut-btn { background: rgba(255,255,255,0.05); border-color: #555; }
                    .ctrlf-shortcut-btn:hover { background: rgba(255,255,255,0.1); border-color: #777; }
                    .ctrlf-notification { background: rgba(255,255,255,0.9); color: #333; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // INITIALIZATION
    function init() {
        window.addEventListener('keydown', (e) => keyboard.handleKeydown(e), true);

        // Show UI after delay if enabled
        if (state.showUI) {
            setTimeout(() => ui.show(), CONFIG.ui.showDelay);
        }

        console.log(`Force Ctrl+F loaded - Protection: ${protection.isEnabled() ? 'ON' : 'OFF'} (${protection.getSource()}), UI: ${state.showUI ? 'ON' : 'OFF'}`);
    }

    init();
})();