// ==UserScript==
// @name              Gemini & AI Studio Enter Key Customizer
// @name:en           Gemini & AI Studio Enter Key Customizer
// @name:ja           Gemini & AI Studio Enterキーカスタマイザー
// @name:zh-TW        Gemini 與 AI Studio Enter 鍵自訂器
// @namespace         https://greasyfork.org/en/users/1467948-stonedkhajiit
// @version           1.1.0
// @description       Modifies Enter key behavior in Gemini (incl. edit mode) & AI Studio (main input). Configurable send keys (Ctrl/Cmd, Shift, Alt) + Enter for send/save, Enter for newline; or native behaviors. Enhanced settings panel.
// @description:en    Modifies Enter key behavior in Gemini (incl. edit mode) & AI Studio (main input). Configurable send keys (Ctrl/Cmd, Shift, Alt) + Enter for send/save, Enter for newline; or native behaviors. Enhanced settings panel.
// @description:ja    Gemini（編集モード含む）およびAI Studio（メイン入力）のEnterキー動作を変更。送信/保存キーを選択可 (Ctrl/Cmd, Shift, Alt) + Enter、Enterで改行。または標準動作。強化された設定パネルあり。
// @description:zh-TW 調整 Gemini (包含編輯模式) 與 AI Studio (主要輸入框) 的 Enter 鍵行為。可自訂傳送/儲存鍵 (Ctrl/Cmd, Shift, Alt) + Enter，Enter 鍵換行；或原生行為。附強化設定面板。
// @author            StonedKhajiit
// @match             https://gemini.google.com/*
// @match             https://aistudio.google.com/*
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/536916/Gemini%20%20AI%20Studio%20Enter%20Key%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/536916/Gemini%20%20AI%20Studio%20Enter%20Key%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'GeminiEnterNewlineMultiSite_v1.1.0';
    const DEBUG_MODE = false; 

    const GEMINI_INPUT_SELECTOR_PRIMARY = 'div.ql-editor[contenteditable="true"]';
    const GEMINI_INPUT_SELECTORS_FALLBACK = [
        'textarea[enterkeyhint="send"]', 'textarea[aria-label*="Prompt"]',
        'textarea[placeholder*="Message Gemini"]', 'div[role="textbox"][contenteditable="true"]'
    ];
    const AISTUDIO_INPUT_SELECTORS = [
        'ms-autosize-textarea textarea[aria-label="Type something or tab to choose an example prompt"]',
        'ms-autosize-textarea textarea',
        'ms-autosize-textarea textarea[aria-label="Start typing a prompt"]'
    ];

    const GEMINI_EDIT_INPUT_SELECTORS = ['user-query-content.edit-mode textarea.mat-mdc-input-element'];

    const GEMINI_SEND_BUTTON_SELECTORS = [
        'button[aria-label*="Send"]', 'button[aria-label*="傳送"]',
        'button[aria-label*="送信"]', 'button[data-test-id="send-button"]',
    ];
    const GEMINI_SAVE_EDIT_BUTTON_SELECTORS = ['user-query-content.edit-mode button.update-button'];

    const AISTUDIO_SEND_BUTTON_SELECTORS = ['button[aria-label="Run"]', 'button[aria-label="Submit"]'];
    const AISTUDIO_SEND_BUTTON_MODIFIER_HINT_SELECTOR = 'span.secondary-key';

    const GM_GLOBAL_ENABLE_KEY_STORAGE = 'geminiEnterGlobalEnable_v1_5';
    const SITE_MODES = { CUSTOM: 'custom', NATIVE: 'native' };
    const INPUT_TYPES = { MAIN: 'main', EDIT: 'edit', UNKNOWN: 'unknown' };

    const GM_GEMINI_CONFIG_STORAGE = 'geminiEnterConfig_v1_5_gemini';
    const DEFAULT_GEMINI_CONFIG = {
        mode: SITE_MODES.CUSTOM,
        keys: { ctrlOrCmd: true, shift: false, alt: false }
    };

    const GM_AISTUDIO_CONFIG_STORAGE = 'aiStudioEnterConfig_v1_5_aistudio';
    const DEFAULT_AISTUDIO_CONFIG = {
        mode: SITE_MODES.NATIVE,
        keys: { ctrlOrCmd: true, shift: false, alt: false }
    };

    let activeInputInfo = { element: null, type: INPUT_TYPES.UNKNOWN };
    let isScriptGloballyEnabled = true;
    let currentGeminiConfig = JSON.parse(JSON.stringify(DEFAULT_GEMINI_CONFIG));
    let currentAIStudioConfig = JSON.parse(JSON.stringify(DEFAULT_AISTUDIO_CONFIG));
    let menuCommandIds = [];

    function logDebug(...args) {
        if (DEBUG_MODE) {
            console.log(`[${SCRIPT_ID}]`, ...args);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const i18n = {
        currentLang: 'en',
        strings: {
            'en': {
                notifySettingsSaved: 'Settings saved!',
                notifyScriptEnabled: 'Custom Enter key behavior enabled. Reload page if needed.',
                notifyScriptDisabled: 'Custom Enter key behavior disabled. Reload page if needed.',
                settingsTitle: 'Script Settings', closeButton: 'Close', saveButton: 'Save',
                openSettingsMenu: 'Configure Enter Key Behavior...',
                enableScriptMenu: 'Enable Custom Enter Key Behavior',
                disableScriptMenu: 'Disable Custom Enter Key Behavior',
                geminiSectionTitle: 'Gemini (gemini.google.com):',
                aiStudioSectionTitle: 'AI Studio (aistudio.google.com):',
                behaviorLabel: 'Enter Key Behavior:',
                customBehavior: 'Custom (Enter for newline, select send/save keys below)',
                nativeBehavior: 'Use Native Site Behavior (Script does nothing)',
                geminiNativeBehaviorSpecific: 'Use Gemini Native Behavior (Enter sends/saves)',
                aiStudioNativeBehaviorSpecific: 'Use AI Studio Native Behavior (Default: Ctrl/Cmd+Enter sends)',
                sendKeysLabel: 'Send/Save with (Modifier + Enter):',
                keyCtrlCmd: 'Ctrl / ⌘ Cmd',
                keyShift: 'Shift',
                keyAlt: 'Alt',
                hintCtrlCmd: 'Ctrl/Cmd', hintShift: 'Shift', hintAlt: 'Alt',
                hintOr: 'or',
                hintPreviewWillUse: 'Will use:',
                hintPreviewToSend: 'to send/save.',
                hintPreviewNoKeySelected: 'No send/save key selected. Enter for newline.',
                hintPreviewNative: 'Script will not modify Enter key behavior.',
            },
            'zh-TW': {
                notifySettingsSaved: '設定已儲存！',
                notifyScriptEnabled: '自訂 Enter 鍵行為已啟用。若未立即生效請重載頁面。',
                notifyScriptDisabled: '自訂 Enter 鍵行為已停用。若未立即生效請重載頁面。',
                settingsTitle: '腳本設定', closeButton: '關閉', saveButton: '儲存',
                openSettingsMenu: '設定 Enter 鍵行為...',
                enableScriptMenu: '啟用自訂 Enter 鍵行為',
                disableScriptMenu: '停用自訂 Enter 鍵行為',
                geminiSectionTitle: 'Gemini (gemini.google.com):',
                aiStudioSectionTitle: 'AI Studio (aistudio.google.com):',
                behaviorLabel: 'Enter 鍵行為:',
                customBehavior: '自訂 (Enter 換行，於下方選擇傳送/儲存鍵)',
                nativeBehavior: '使用網站原生行為 (腳本不介入)',
                geminiNativeBehaviorSpecific: '使用 Gemini 原生行為 (Enter 即送出/儲存)',
                aiStudioNativeBehaviorSpecific: '使用 AI Studio 原生行為 (預設 Ctrl/Cmd+Enter 送出)',
                sendKeysLabel: '使用組合鍵傳送/儲存 (組合鍵 + Enter):',
                keyCtrlCmd: 'Ctrl / ⌘ Cmd',
                keyShift: 'Shift',
                keyAlt: 'Alt',
                hintCtrlCmd: 'Ctrl/Cmd', hintShift: 'Shift', hintAlt: 'Alt',
                hintOr: '或',
                hintPreviewWillUse: '將使用：',
                hintPreviewToSend: '進行傳送/儲存。',
                hintPreviewNoKeySelected: '未選擇傳送/儲存鍵。Enter 鍵將用於換行。',
                hintPreviewNative: '腳本不會修改 Enter 鍵行為。',
            },
            'ja': {
                notifySettingsSaved: '設定を保存しました！',
                notifyScriptEnabled: 'Enterキーのカスタム動作が有効になりました。必要に応じてページを再読み込みしてください。',
                notifyScriptDisabled: 'Enterキーのカスタム動作が無効になりました。必要に応じてページを再読み込みしてください。',
                settingsTitle: 'スクリプト設定', closeButton: '閉じる', saveButton: '保存',
                openSettingsMenu: 'Enterキーの動作を設定...',
                enableScriptMenu: 'Enterキーのカスタム動作を有効化',
                disableScriptMenu: 'Enterキーのカスタム動作を無効化',
                geminiSectionTitle: 'Gemini (gemini.google.com):',
                aiStudioSectionTitle: 'AI Studio (aistudio.google.com):',
                behaviorLabel: 'Enterキーの動作:',
                customBehavior: 'カスタム (Enterで改行、送信/保存キーを以下で選択)',
                nativeBehavior: 'サイトのネイティブ動作を使用 (スクリプトは何もしません)',
                geminiNativeBehaviorSpecific: 'Geminiネイティブ動作を使用 (Enterで送信/保存)',
                aiStudioNativeBehaviorSpecific: 'AI Studioネイティブ動作を使用 (デフォルトはCtrl/Cmd+Enterで送信)',
                sendKeysLabel: '修飾キーで送信/保存 (修飾キー + Enter):',
                keyCtrlCmd: 'Ctrl / ⌘ Cmd',
                keyShift: 'Shift',
                keyAlt: 'Alt',
                hintCtrlCmd: 'Ctrl/Cmd', hintShift: 'Shift', hintAlt: 'Alt',
                hintOr: 'または',
                hintPreviewWillUse: '使用するキー：',
                hintPreviewToSend: 'で送信/保存します。',
                hintPreviewNoKeySelected: '送信/保存キーが選択されていません。Enterキーは改行に使用されます。',
                hintPreviewNative: 'スクリプトはEnterキーの動作を変更しません。',
            }
        },
        detectLanguage() {
            const lang = navigator.language || navigator.userLanguage;
            if (lang) {
                if (lang.startsWith('ja')) this.currentLang = 'ja';
                else if (lang.startsWith('zh-TW') || lang.startsWith('zh-Hant')) this.currentLang = 'zh-TW';
                else if (lang.startsWith('en')) this.currentLang = 'en';
                else this.currentLang = 'en';
            } else { this.currentLang = 'en'; }
        },
        get(key, ...args) {
            const langStrings = this.strings[this.currentLang] || this.strings.en;
            const template = langStrings[key] || (this.strings.en && this.strings.en[key]);
            if (typeof template === 'function') return template(...args);
            if (typeof template === 'string') return template;
            logDebug(`Missing i18n string for key: ${key} in lang: ${this.currentLang}`);
            return `Missing string: ${key}`;
        }
    };

    function createSettingsUI() {
        if (document.getElementById('gemini-ai-settings-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'gemini-ai-settings-overlay';
        overlay.classList.add('hidden');
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            #gemini-ai-settings-overlay {
                position: fixed; inset: 0px; background-color: rgba(0, 0, 0, 0.6);
                display: flex; align-items: center; justify-content: center;
                z-index: 2147483647; font-family: 'Inter', Arial, sans-serif;
                opacity: 0; transition: opacity 0.2s ease-in-out;
            }
            #gemini-ai-settings-overlay.visible { opacity: 1; }
            #gemini-ai-settings-overlay.hidden { display: none !important; }
            #gemini-ai-settings-panel {
                background-color: #ffffff; color: #1f2937;
                padding: 18px; border-radius: 8px;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
                width: 90%; max-width: 460px;
                position: relative; overflow-y: auto; max-height: 90vh;
            }
            body.userscript-dark-mode #gemini-ai-settings-panel { background-color: #2d3748; color: #e2e8f0; }
            body.userscript-dark-mode #gemini-ai-settings-panel h2,
            body.userscript-dark-mode #gemini-ai-settings-panel h3,
            body.userscript-dark-mode #gemini-ai-settings-panel p,
            body.userscript-dark-mode #gemini-ai-settings-panel label { color: #e2e8f0; }
            body.userscript-dark-mode #gemini-ai-settings-panel button#gemini-ai-close-btn { background-color: #4a5568; color: #e2e8f0; }
            body.userscript-dark-mode #gemini-ai-settings-panel button#gemini-ai-close-btn:hover { background-color: #718096; }
            body.userscript-dark-mode #gemini-ai-settings-panel input[type="radio"],
            body.userscript-dark-mode #gemini-ai-settings-panel input[type="checkbox"] { filter: invert(1) hue-rotate(180deg); }

            #gemini-ai-settings-panel h2 { font-size: 1.15rem; font-weight: 600; margin-bottom: 0.8rem; }
            #gemini-ai-settings-panel h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
            #gemini-ai-settings-panel .section-divider { border-top: 1px solid #e5e7eb; margin-top: 1rem; margin-bottom: 1rem; }
            body.userscript-dark-mode #gemini-ai-settings-panel .section-divider { border-top-color: #4a5568; }

            #gemini-ai-settings-panel .options-group > div { margin-bottom: 0.4rem; }
            #gemini-ai-settings-panel label { display: inline-flex; align-items: center; cursor: pointer; font-size: 0.875rem; }
            #gemini-ai-settings-panel label[title] { cursor: help; border-bottom: 1px dotted; }
            body.userscript-dark-mode #gemini-ai-settings-panel label[title] { border-bottom-color: #718096; }
            #gemini-ai-settings-panel input[type="radio"],
            #gemini-ai-settings-panel input[type="checkbox"] { margin-right: 0.5rem; cursor: pointer; transform: scale(0.95); }
            #gemini-ai-settings-panel input[type="checkbox"]:disabled + label { color: #9ca3af !important; cursor: not-allowed; }
            body.userscript-dark-mode #gemini-ai-settings-panel input[type="checkbox"]:disabled + label { color: #718096 !important; }
            
            .settings-preview-text { font-size: 0.8rem; color: #6b7280; margin-top: 0.5rem; padding-left: 0.5rem; min-height: 1em; font-style: italic; }
            body.userscript-dark-mode .settings-preview-text { color: #9ca3af; }

            .settings-buttons-container { display: flex; justify-content: flex-end; margin-top: 1.2rem; gap: 0.5rem; }
            #gemini-ai-settings-panel button {
                padding: 0.4rem 0.9rem; border-radius: 6px;
                font-weight: 500; transition: background-color 0.2s ease, box-shadow 0.2s ease;
                border: none; cursor: pointer; font-size: 0.875rem;
            }
            #gemini-ai-settings-panel button#gemini-ai-close-btn { background-color: #e5e7eb; color: #374151; }
            #gemini-ai-settings-panel button#gemini-ai-close-btn:hover { background-color: #d1d5db; }
            #gemini-ai-settings-panel button#gemini-ai-save-btn { background-color: #3b82f6; color: white; }
            #gemini-ai-settings-panel button#gemini-ai-save-btn:hover { background-color: #2563eb; }

            #gemini-ai-notification {
                position: fixed; bottom: 25px; left: 50%;
                transform: translateX(-50%);
                background-color: #10b981; color: white;
                padding: 0.8rem 1.5rem; border-radius: 6px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                z-index: 2147483647; opacity: 0;
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                font-family: 'Inter', Arial, sans-serif; font-size: 0.9rem;
            }
            #gemini-ai-notification.visible { opacity: 1; transform: translateX(-50%) translateY(0px); }
            #gemini-ai-notification.hidden { display: none !important; }
        `;
        document.head.appendChild(style);
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'gemini-ai-settings-panel';
        const titleElement = document.createElement('h2');
        titleElement.textContent = i18n.get('settingsTitle');
        settingsPanel.appendChild(titleElement);
        const geminiTitle = document.createElement('h3');
        settingsPanel.appendChild(geminiTitle);
        const geminiOptionsDiv = document.createElement('div');
        geminiOptionsDiv.id = 'gemini-key-options';
        geminiOptionsDiv.className = 'options-group';
        settingsPanel.appendChild(geminiOptionsDiv);
        settingsPanel.appendChild(document.createElement('div')).className = 'section-divider';
        const aistudioTitle = document.createElement('h3');
        settingsPanel.appendChild(aistudioTitle);
        const aistudioOptionsDiv = document.createElement('div');
        aistudioOptionsDiv.id = 'aistudio-key-options';
        aistudioOptionsDiv.className = 'options-group';
        settingsPanel.appendChild(aistudioOptionsDiv);
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'settings-buttons-container';
        const closeButton = document.createElement('button');
        closeButton.id = 'gemini-ai-close-btn';
        closeButton.textContent = i18n.get('closeButton');
        buttonDiv.appendChild(closeButton);
        const saveButton = document.createElement('button');
        saveButton.id = 'gemini-ai-save-btn';
        saveButton.textContent = i18n.get('saveButton');
        buttonDiv.appendChild(saveButton);
        settingsPanel.appendChild(buttonDiv);
        overlay.appendChild(settingsPanel);
        document.body.appendChild(overlay);
        const notificationDiv = document.createElement('div');
        notificationDiv.id = 'gemini-ai-notification';
        notificationDiv.classList.add('hidden');
        document.body.appendChild(notificationDiv);
        closeButton.addEventListener('click', closeSettings);
        saveButton.addEventListener('click', saveSettingsFromUI);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSettings(); });
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('userscript-dark-mode');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            document.body.classList.toggle('userscript-dark-mode', e.matches);
        });
    }

    function populateSettingsUI() {
        const geminiOptionsDiv = document.getElementById('gemini-key-options');
        const aistudioOptionsDiv = document.getElementById('aistudio-key-options');
        if (!geminiOptionsDiv || !aistudioOptionsDiv) return;

        while (geminiOptionsDiv.firstChild) geminiOptionsDiv.removeChild(geminiOptionsDiv.firstChild);
        while (aistudioOptionsDiv.firstChild) aistudioOptionsDiv.removeChild(aistudioOptionsDiv.firstChild);

        const createSiteSettingSection = (container, siteConfig, siteName) => {
            const behaviorTitle = document.createElement('p');
            behaviorTitle.textContent = i18n.get('behaviorLabel');
            behaviorTitle.style.fontWeight = '500'; behaviorTitle.style.marginBottom = '0.3rem';
            container.appendChild(behaviorTitle);

            const modes = [
                { value: SITE_MODES.CUSTOM, labelKey: 'customBehavior' },
                { value: SITE_MODES.NATIVE, labelKey: siteName === 'gemini' ? 'geminiNativeBehaviorSpecific' : (siteName === 'aistudio' ? 'aiStudioNativeBehaviorSpecific' : 'nativeBehavior') }
            ];

            if (siteName === 'aistudio' && siteConfig.mode === 'site_specific') {
                 logDebug('Mapping obsolete AI Studio SITE_SPECIFIC mode to CUSTOM for settings UI.');
                 siteConfig.mode = SITE_MODES.CUSTOM;
            }

            modes.forEach(modeInfo => {
                const div = document.createElement('div');
                const input = document.createElement('input');
                input.type = 'radio'; input.name = `${siteName}KeyModeBehavior`;
                input.id = `${siteName}-mode-${modeInfo.value}`; input.value = modeInfo.value;
                if (siteConfig.mode === modeInfo.value) input.checked = true;
                const label = document.createElement('label');
                label.htmlFor = input.id; label.textContent = i18n.get(modeInfo.labelKey);
                div.appendChild(input); div.appendChild(label);
                container.appendChild(div);
            });

            const sendKeysLabelEl = document.createElement('p');
            sendKeysLabelEl.textContent = i18n.get('sendKeysLabel');
            sendKeysLabelEl.style.fontWeight = '500'; sendKeysLabelEl.style.marginTop = '0.7rem'; sendKeysLabelEl.style.marginBottom = '0.3rem';
            container.appendChild(sendKeysLabelEl);

            const keysContainer = document.createElement('div');
            keysContainer.id = `${siteName}-custom-keys-container`;
            container.appendChild(keysContainer);

            const modifierCheckboxesSetup = [
                { keyName: 'ctrlOrCmd', labelKey: 'keyCtrlCmd' },
                { keyName: 'shift', labelKey: 'keyShift' },
                { keyName: 'alt', labelKey: 'keyAlt' },
            ];

            modifierCheckboxesSetup.forEach(opt => {
                const div = document.createElement('div');
                const input = document.createElement('input');
                input.type = 'checkbox'; input.name = `${siteName}SendKey`; input.id = `${siteName}-key-${opt.keyName}`; input.value = opt.keyName;
                if (siteConfig.keys && typeof siteConfig.keys[opt.keyName] === 'boolean') {
                    input.checked = siteConfig.keys[opt.keyName];
                }
                const label = document.createElement('label');
                label.htmlFor = input.id; label.textContent = i18n.get(opt.labelKey);
                div.appendChild(input); div.appendChild(label);
                keysContainer.appendChild(div);
            });

            const previewTextEl = document.createElement('p');
            previewTextEl.className = 'settings-preview-text';
            keysContainer.appendChild(previewTextEl);

            const updatePreviewText = () => {
                const currentMode = container.querySelector(`input[name="${siteName}KeyModeBehavior"]:checked`)?.value;
                if (currentMode === SITE_MODES.NATIVE) {
                    previewTextEl.textContent = i18n.get('hintPreviewNative'); return;
                }
                const selectedKeys = [];
                modifierCheckboxesSetup.forEach(opt => {
                    const checkbox = container.querySelector(`#${siteName}-key-${opt.keyName}`);
                    if (checkbox && checkbox.checked) selectedKeys.push(i18n.get(opt.labelKey));
                });
                if (selectedKeys.length > 0) {
                    previewTextEl.textContent = `${i18n.get('hintPreviewWillUse')} ${selectedKeys.join(` ${i18n.get('hintOr')} `)} + Enter ${i18n.get('hintPreviewToSend')}`;
                } else { previewTextEl.textContent = i18n.get('hintPreviewNoKeySelected');}
            };

            const customModeRadio = container.querySelector(`input[value="${SITE_MODES.CUSTOM}"]`);
            const toggleCheckboxesAndPreview = () => {
                const currentMode = container.querySelector(`input[name="${siteName}KeyModeBehavior"]:checked`)?.value;
                const useCustomBehavior = currentMode === SITE_MODES.CUSTOM;

                sendKeysLabelEl.style.color = useCustomBehavior ? '' : (document.body.classList.contains('userscript-dark-mode') ? '#718096':'#9ca3af');
                keysContainer.style.opacity = useCustomBehavior ? '1' : '0.5';
                previewTextEl.style.display = 'block';

                modifierCheckboxesSetup.forEach(opt => {
                    const checkbox = container.querySelector(`#${siteName}-key-${opt.keyName}`);
                    if (checkbox) {
                        checkbox.disabled = !useCustomBehavior;
                        checkbox.addEventListener('change', updatePreviewText);
                    }
                });
                updatePreviewText();
            };
            container.querySelectorAll(`input[name="${siteName}KeyModeBehavior"]`).forEach(radio => {
                radio.addEventListener('change', toggleCheckboxesAndPreview);
            });
            toggleCheckboxesAndPreview();
        };

        const geminiSectionTitleEl = geminiOptionsDiv.previousElementSibling;
        if (geminiSectionTitleEl && geminiSectionTitleEl.tagName === 'H3') geminiSectionTitleEl.textContent = i18n.get('geminiSectionTitle');
        createSiteSettingSection(geminiOptionsDiv, currentGeminiConfig, 'gemini');

        const aiStudioSectionTitleEl = aistudioOptionsDiv.previousElementSibling;
        if (aiStudioSectionTitleEl && aiStudioSectionTitleEl.tagName === 'H3') aiStudioSectionTitleEl.textContent = i18n.get('aiStudioSectionTitle');
        createSiteSettingSection(aistudioOptionsDiv, currentAIStudioConfig, 'aistudio');
    }

    function openSettings() {
        loadSettings(); populateSettingsUI();
        const overlay = document.getElementById('gemini-ai-settings-overlay');
        if (overlay) { overlay.classList.remove('hidden'); void overlay.offsetWidth; overlay.classList.add('visible'); }
    }
    function closeSettings() {
        const overlay = document.getElementById('gemini-ai-settings-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => { if (!overlay.classList.contains('visible')) overlay.classList.add('hidden'); }, 200);
        }
    }
    function showNotification(message) {
        const notificationDiv = document.getElementById('gemini-ai-notification');
        if (notificationDiv) {
            notificationDiv.textContent = message;
            notificationDiv.classList.remove('hidden'); void notificationDiv.offsetWidth; notificationDiv.classList.add('visible');
            setTimeout(() => {
                notificationDiv.classList.remove('visible');
                setTimeout(() => { if (!notificationDiv.classList.contains('visible')) notificationDiv.classList.add('hidden'); }, 300);
            }, 2500);
        }
    }

    function loadConfigForSite(storageKey, defaultConfig, siteName) {
        const savedConfigString = GM_getValue(storageKey);
        let configToReturn = JSON.parse(JSON.stringify(defaultConfig));
        if (savedConfigString) {
            try {
                const savedConfig = JSON.parse(savedConfigString);
                if (siteName === 'aistudio' && savedConfig.mode === 'site_specific') {
                    logDebug(`Migrating AI Studio mode from 'site_specific' to '${DEFAULT_AISTUDIO_CONFIG.mode}' for key ${storageKey}`);
                    configToReturn.mode = DEFAULT_AISTUDIO_CONFIG.mode;
                    configToReturn.keys = {
                        ctrlOrCmd: typeof savedConfig.keys?.ctrlOrCmd === 'boolean' ? savedConfig.keys.ctrlOrCmd : DEFAULT_AISTUDIO_CONFIG.keys.ctrlOrCmd,
                        shift: typeof savedConfig.keys?.shift === 'boolean' ? savedConfig.keys.shift : DEFAULT_AISTUDIO_CONFIG.keys.shift,
                        alt: typeof savedConfig.keys?.alt === 'boolean' ? savedConfig.keys.alt : DEFAULT_AISTUDIO_CONFIG.keys.alt,
                    };
                } else {
                    configToReturn.mode = Object.values(SITE_MODES).includes(savedConfig.mode) ? savedConfig.mode : defaultConfig.mode;
                    configToReturn.keys = {
                        ctrlOrCmd: typeof savedConfig.keys?.ctrlOrCmd === 'boolean' ? savedConfig.keys.ctrlOrCmd : defaultConfig.keys.ctrlOrCmd,
                        shift: typeof savedConfig.keys?.shift === 'boolean' ? savedConfig.keys.shift : defaultConfig.keys.shift,
                        alt: typeof savedConfig.keys?.alt === 'boolean' ? savedConfig.keys.alt : defaultConfig.keys.alt,
                    };
                }
            } catch (e) { logDebug(`Error parsing config from ${storageKey}, using defaults.`, e); }
        }
        return configToReturn;
    }
    function loadSettings() {
        isScriptGloballyEnabled = GM_getValue(GM_GLOBAL_ENABLE_KEY_STORAGE, true);
        currentGeminiConfig = loadConfigForSite(GM_GEMINI_CONFIG_STORAGE, DEFAULT_GEMINI_CONFIG, 'gemini');
        currentAIStudioConfig = loadConfigForSite(GM_AISTUDIO_CONFIG_STORAGE, DEFAULT_AISTUDIO_CONFIG, 'aistudio');
    }

    function saveConfigForSite(storageKey, newConfig, defaultConfig) {
        if (!Object.values(SITE_MODES).includes(newConfig.mode)) newConfig.mode = defaultConfig.mode;
        newConfig.keys = {
            ctrlOrCmd: typeof newConfig.keys?.ctrlOrCmd === 'boolean' ? newConfig.keys.ctrlOrCmd : false,
            shift: typeof newConfig.keys?.shift === 'boolean' ? newConfig.keys.shift : false,
            alt: typeof newConfig.keys?.alt === 'boolean' ? newConfig.keys.alt : false,
        };
        GM_setValue(storageKey, JSON.stringify(newConfig));
        return newConfig;
    }
    function saveSettingsFromUI() {
        const selectedGeminiMode = document.querySelector('input[name="geminiKeyModeBehavior"]:checked')?.value || DEFAULT_GEMINI_CONFIG.mode;
        const newGeminiKeys = {
            ctrlOrCmd: document.getElementById('gemini-key-ctrlOrCmd')?.checked || false,
            shift: document.getElementById('gemini-key-shift')?.checked || false,
            alt: document.getElementById('gemini-key-alt')?.checked || false,
        };
        currentGeminiConfig = saveConfigForSite(GM_GEMINI_CONFIG_STORAGE, { mode: selectedGeminiMode, keys: newGeminiKeys }, DEFAULT_GEMINI_CONFIG);

        const selectedAIStudioMode = document.querySelector('input[name="aistudioKeyModeBehavior"]:checked')?.value || DEFAULT_AISTUDIO_CONFIG.mode;
        const newAIStudioKeys = {
            ctrlOrCmd: document.getElementById('aistudio-key-ctrlOrCmd')?.checked || false,
            shift: document.getElementById('aistudio-key-shift')?.checked || false,
            alt: document.getElementById('aistudio-key-alt')?.checked || false,
        };
        currentAIStudioConfig = saveConfigForSite(GM_AISTUDIO_CONFIG_STORAGE, { mode: selectedAIStudioMode, keys: newAIStudioKeys }, DEFAULT_AISTUDIO_CONFIG);

        updateActiveInputListener(); updateAIStudioButtonModifierHint(); registerMenuCommand();
        showNotification(i18n.get('notifySettingsSaved')); closeSettings();
    }

    function updateAIStudioButtonModifierHint() {
        if (!window.location.hostname.includes('aistudio.google.com')) return;
        const mainSendButton = document.querySelector(AISTUDIO_SEND_BUTTON_SELECTORS.join(', '));
        if (!mainSendButton) return;
        const hintSpan = mainSendButton.querySelector(AISTUDIO_SEND_BUTTON_MODIFIER_HINT_SELECTOR);
        if (!hintSpan) return;

        if (activeInputInfo.element && activeInputInfo.type === INPUT_TYPES.EDIT) {
            hintSpan.style.display = 'none'; return;
        }
        hintSpan.style.display = 'inline'; let hintText = '';

        if (currentAIStudioConfig.mode === SITE_MODES.NATIVE) {
            hintText = i18n.get('hintCtrlCmd');
        } else if (currentAIStudioConfig.mode === SITE_MODES.CUSTOM) {
            const keyLabels = [];
            if (currentAIStudioConfig.keys.ctrlOrCmd) keyLabels.push(i18n.get('hintCtrlCmd'));
            if (currentAIStudioConfig.keys.shift) keyLabels.push(i18n.get('hintShift'));
            if (currentAIStudioConfig.keys.alt) keyLabels.push(i18n.get('hintAlt'));
            if (keyLabels.length > 0) hintText = keyLabels.join(` ${i18n.get('hintOr')} `);
            else hintSpan.style.display = 'none';
        } else {
            hintSpan.style.display = 'none';
        }
        hintSpan.textContent = hintSpan.style.display !== 'none' ? hintText + ' ' : '';
    }

    function insertNewline(element) {
        if (!element) return;
        if (element.isContentEditable) {
            element.focus(); let success = false;
            try { success = document.execCommand('insertParagraph', false, null); } catch (e) {}
            if (!success) {
                try {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0); const br = document.createElement('br');
                        range.deleteContents(); range.insertNode(br);
                        range.setStartAfter(br); range.collapse(true);
                        selection.removeAllRanges(); selection.addRange(range); element.focus();
                    } else { document.execCommand('insertHTML', false, '<br>');}
                } catch (e) {}
            }
        } else if (element.tagName === 'TEXTAREA') {
            const start = element.selectionStart; const end = element.selectionEnd;
            element.value = `${element.value.substring(0, start)}\n${element.value.substring(end)}`;
            element.selectionStart = element.selectionEnd = start + 1;
            element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        }
    }
    function clickSubmitButtonForInput(targetElement, inputType) {
        const button = findSubmitButtonForInput({element: targetElement, type: inputType });
        logDebug('[clickSubmitButtonForInput] Target Element:', targetElement, 'Input Type:', inputType, 'Found Button:', button);
        if (button && !button.disabled) {
            button.click();
        } else {
            logDebug('[clickSubmitButtonForInput] Button not found or disabled. Fallback to form submit if applicable.');
            const form = targetElement?.closest('form');
            if (form) { if (typeof form.requestSubmit === 'function') form.requestSubmit(); else form.submit(); }
        }
    }

    function processEnterKeyForSite(event, configuredSendKeys, isCtrlOrCmdPressed, isShiftPressed, isAltPressed, isPlainEnter, isAnyModifierPressed, activeInput) {
        let shouldSend = false;
        if (configuredSendKeys.ctrlOrCmd && isCtrlOrCmdPressed) shouldSend = true;
        else if (configuredSendKeys.shift && isShiftPressed) shouldSend = true;
        else if (configuredSendKeys.alt && isAltPressed) shouldSend = true;

        logDebug('[processEnterKeyForSite] Should Send:', shouldSend, 'Plain Enter:', isPlainEnter, 'Any Modifier:', isAnyModifierPressed, 'Config:', configuredSendKeys, 'Active Input:', activeInput);

        if (shouldSend) {
            event.preventDefault(); event.stopImmediatePropagation();
            clickSubmitButtonForInput(activeInput.element, activeInput.type);
        } else if (isPlainEnter) {
            event.preventDefault(); event.stopImmediatePropagation();
            insertNewline(activeInput.element);
        } else if (isAnyModifierPressed) {
            event.preventDefault(); event.stopImmediatePropagation();
        }
    }

    function handleKeydown(event) {
        logDebug('[handleKeydown] Event on:', event.target, 'Active Input Element:', activeInputInfo.element, 'Type:', activeInputInfo.type);
        if (event.isComposing) return;
        if (!isScriptGloballyEnabled) return;
        if (!activeInputInfo.element || (event.target !== activeInputInfo.element && !activeInputInfo.element.contains(event.target))) {
             return;
        }

        const currentHost = window.location.hostname;
        const isCtrlOrCmdPressed = (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey;
        const isShiftPressed = event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey;
        const isAltPressed = event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
        const plainEnter = !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
        const anyModifierPressed = event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;

        if (event.key === 'Enter') {
            logDebug('[handleKeydown] Enter pressed. Ctrl/Cmd:', isCtrlOrCmdPressed, 'Shift:', isShiftPressed, 'Alt:', isAltPressed, 'Plain:', plainEnter);
            if (currentHost.includes('gemini.google.com')) {
                if (currentGeminiConfig.mode === SITE_MODES.NATIVE) return;
                if (currentGeminiConfig.mode === SITE_MODES.CUSTOM) {
                    processEnterKeyForSite(event, currentGeminiConfig.keys, isCtrlOrCmdPressed, isShiftPressed, isAltPressed, plainEnter, anyModifierPressed, activeInputInfo);
                }
            } else if (currentHost.includes('aistudio.google.com')) {
                if (currentAIStudioConfig.mode === SITE_MODES.NATIVE) return;
                if (currentAIStudioConfig.mode === SITE_MODES.CUSTOM && activeInputInfo.type === INPUT_TYPES.MAIN) {
                    logDebug('[handleKeydown] AI Studio CUSTOM mode for MAIN input.');
                    processEnterKeyForSite(event, currentAIStudioConfig.keys, isCtrlOrCmdPressed, isShiftPressed, isAltPressed, plainEnter, anyModifierPressed, activeInputInfo);
                }
                // AI Studio edit mode is no longer specifically handled by custom logic in this simplified version
            }
        }
    }

    function updateActiveInputListener() {
        if (activeInputInfo.element) {
            const listenerAttached = activeInputInfo.element.dataset.keydownListenerAttached === 'true';
            let shouldCurrentlyBeAttached = false;

            if (isScriptGloballyEnabled) {
                const onGemini = window.location.hostname.includes('gemini.google.com');
                const onAIStudio = window.location.hostname.includes('aistudio.google.com');
                if (onGemini && currentGeminiConfig.mode === SITE_MODES.CUSTOM) {
                    shouldCurrentlyBeAttached = true;
                } else if (onAIStudio && currentAIStudioConfig.mode === SITE_MODES.CUSTOM && activeInputInfo.type === INPUT_TYPES.MAIN) {
                    shouldCurrentlyBeAttached = true;
                }
            }
            logDebug('[updateActiveInputListener] Element:', activeInputInfo.element, 'Type:', activeInputInfo.type, 'Listener Attached:', listenerAttached, 'Should be attached:', shouldCurrentlyBeAttached);
            if (listenerAttached && !shouldCurrentlyBeAttached) {
                activeInputInfo.element.removeEventListener('keydown', handleKeydown, true);
                delete activeInputInfo.element.dataset.keydownListenerAttached;
                logDebug('[updateActiveInputListener] Listener REMOVED from:', activeInputInfo.element);
            } else if (!listenerAttached && shouldCurrentlyBeAttached) {
                activeInputInfo.element.addEventListener('keydown', handleKeydown, true);
                activeInputInfo.element.dataset.keydownListenerAttached = 'true';
                logDebug('[updateActiveInputListener] Listener ADDED to:', activeInputInfo.element);
            }
        } else {
            logDebug('[updateActiveInputListener] No active input element to update listener for.');
        }
    }
    function toggleScriptGlobally() {
        isScriptGloballyEnabled = !isScriptGloballyEnabled;
        GM_setValue(GM_GLOBAL_ENABLE_KEY_STORAGE, isScriptGloballyEnabled);
        if (activeInputInfo.element) {
            updateActiveInputListener();
        }
        registerMenuCommand();
        showNotification(isScriptGloballyEnabled ? i18n.get('notifyScriptEnabled') : i18n.get('notifyScriptDisabled'));
    }
    function registerMenuCommand() {
        menuCommandIds.forEach(id => { if (typeof GM_unregisterMenuCommand === 'function') try { GM_unregisterMenuCommand(id); } catch (e) {} });
        menuCommandIds = [];
        try { const sId = GM_registerMenuCommand(i18n.get('openSettingsMenu'), openSettings, 's'); if (sId) menuCommandIds.push(sId); } catch (e) { console.error(`[${SCRIPT_ID}] Error registering 'Open Settings' menu command:`, e); }
        try { const tId = GM_registerMenuCommand(isScriptGloballyEnabled ? i18n.get('disableScriptMenu') : i18n.get('enableScriptMenu'), toggleScriptGlobally, 't'); if (tId) menuCommandIds.push(tId); } catch (e) { console.error(`[${SCRIPT_ID}] Error registering toggle script menu command:`, e); }
    }

    function findActiveInputElement() {
        const host = window.location.hostname;
        let el;
        logDebug('[findActiveInputElement] Searching on host:', host);

        const focusedElement = document.activeElement;
        if (focusedElement && (focusedElement.tagName === 'TEXTAREA' || focusedElement.isContentEditable)) {
            logDebug('[findActiveInputElement] Focused element:', focusedElement, 'Tag:', focusedElement.tagName, 'ContentEditable:', focusedElement.isContentEditable);
            if (host.includes('gemini.google.com')) {
                 const geminiEditParent = focusedElement.closest('user-query-content.edit-mode');
                 if (geminiEditParent && GEMINI_EDIT_INPUT_SELECTORS.some(s => focusedElement.matches(s))) {
                     logDebug('[findActiveInputElement] Found Gemini Edit Input via document.activeElement:', focusedElement);
                     return { element: focusedElement, type: INPUT_TYPES.EDIT };
                 }
            }
            // AI Studio edit detection via activeElement removed due to complexity and unreliability
        }

        if (host.includes('gemini.google.com')) {
            for (const selector of GEMINI_EDIT_INPUT_SELECTORS) {
                el = document.querySelector(selector);
                if (el && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)) {
                    logDebug('[findActiveInputElement] Found Gemini Edit Input (Selector):', el, 'Selector:', selector);
                    return { element: el, type: INPUT_TYPES.EDIT };
                }
            }
        }
        // AI Studio edit input search via general selectors removed

        if (host.includes('gemini.google.com')) {
            el = document.querySelector(GEMINI_INPUT_SELECTOR_PRIMARY);
            if (el && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)) {
                 logDebug('[findActiveInputElement] Found Gemini Main Input (Primary):', el);
                 return { element: el, type: INPUT_TYPES.MAIN };
            }
            for (const selector of GEMINI_INPUT_SELECTORS_FALLBACK) {
                el = document.querySelector(selector);
                 if (el && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)) {
                    logDebug('[findActiveInputElement] Found Gemini Main Input (Fallback):', el, 'Selector:', selector);
                    return { element: el, type: INPUT_TYPES.MAIN };
                }
            }
        } else if (host.includes('aistudio.google.com')) {
            for (const selector of AISTUDIO_INPUT_SELECTORS) {
                el = document.querySelector(selector);
                if (el && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)) {
                    logDebug('[findActiveInputElement] Found AI Studio Main Input:', el, 'Selector:', selector);
                     return { element: el, type: INPUT_TYPES.MAIN };
                }
            }
        }
        logDebug('[findActiveInputElement] No specific active input found by selectors.');
        return { element: null, type: INPUT_TYPES.UNKNOWN };
    }

    function findSubmitButtonForInput(inputInfo) {
        if (!inputInfo || !inputInfo.element) {
            logDebug('[findSubmitButtonForInput] No inputInfo or element provided.');
            return null;
        }
        const host = window.location.hostname;
        let selectors = [];
        let searchContext = document;

        if (host.includes('gemini.google.com')) {
            selectors = inputInfo.type === INPUT_TYPES.EDIT ? GEMINI_SAVE_EDIT_BUTTON_SELECTORS : GEMINI_SEND_BUTTON_SELECTORS;
            if (inputInfo.type === INPUT_TYPES.EDIT) {
                const userQueryContent = inputInfo.element.closest('user-query-content.edit-mode');
                if (userQueryContent) searchContext = userQueryContent;
            }
        } else if (host.includes('aistudio.google.com')) {
             // Only main send buttons for AI Studio in this simplified version
            if (inputInfo.type === INPUT_TYPES.MAIN) {
                selectors = AISTUDIO_SEND_BUTTON_SELECTORS;
            } else {
                logDebug('[findSubmitButtonForInput] AI Studio: Edit mode buttons no longer specifically targeted by script.');
                return null; // No button to find for AI Studio edit mode via script
            }
        }
        logDebug('[findSubmitButtonForInput] Input Type:', inputInfo.type, 'Host:', host, 'Attempting selectors:', selectors, 'Search Context:', searchContext.tagName || 'document');

        for (const selector of selectors) {
            let button = null;
            try {
                button = searchContext.querySelector(selector);
            } catch (e) {
                logDebug('[findSubmitButtonForInput] Error using selector:', selector, e);
                continue;
            }

            if (button && (button.offsetWidth > 0 || button.offsetHeight > 0 || button.getClientRects().length > 0)) {
                logDebug('[findSubmitButtonForInput] Found visible button with selector:', selector, button);
                return button;
            } else if (button) {
                logDebug('[findSubmitButtonForInput] Found button with selector but it is NOT VISIBLE:', selector, button);
            } else {
                 logDebug('[findSubmitButtonForInput] No button found for selector:', selector, 'in context:', searchContext.tagName || 'document');
            }
        }
        logDebug('[findSubmitButtonForInput] No submit button found for input type:', inputInfo.type, 'on host:', host);
        return null;
    }

    const mutationObserverCallback = (mutationsList, observer) => {
        logDebug('[MutationObserver] Generic DOM change detected, triggering debounced handler.');
        debouncedDOMChangeHandler();
    };

    const debouncedDOMChangeHandler = debounce(() => {
        logDebug('[debouncedDOMChangeHandler] Running...');
        const oldActiveElement = activeInputInfo.element;
        const oldActiveType = activeInputInfo.type;
        const newActiveInfo = findActiveInputElement();

        if (oldActiveElement !== newActiveInfo.element || oldActiveType !== newActiveInfo.type) {
            logDebug('[debouncedDOMChangeHandler] Active input changed. Old:', {el: oldActiveElement?.tagName, type: oldActiveType}, 'New:', {el: newActiveInfo.element?.tagName, type: newActiveInfo.type});
            if (oldActiveElement && oldActiveElement.dataset.keydownListenerAttached === 'true') {
                oldActiveElement.removeEventListener('keydown', handleKeydown, true);
                delete oldActiveElement.dataset.keydownListenerAttached;
                logDebug('[debouncedDOMChangeHandler] Removed listener from old active input:', oldActiveElement);
            }
            activeInputInfo = newActiveInfo;
            updateActiveInputListener();
        } else if (newActiveInfo.element && newActiveInfo.element.dataset.keydownListenerAttached !== 'true' && isScriptGloballyEnabled) {
             logDebug('[debouncedDOMChangeHandler] Same element, but listener needs re-evaluation for:', newActiveInfo.element);
            updateActiveInputListener();
        } else if (!newActiveInfo.element && oldActiveElement) { 
            logDebug('[debouncedDOMChangeHandler] Active element disappeared. Clearing activeInputInfo.');
             if (oldActiveElement && oldActiveElement.dataset.keydownListenerAttached === 'true') {
                oldActiveElement.removeEventListener('keydown', handleKeydown, true);
                delete oldActiveElement.dataset.keydownListenerAttached;
            }
            activeInputInfo = {element: null, type: INPUT_TYPES.UNKNOWN};
        } else {
            logDebug('[debouncedDOMChangeHandler] No change in active input or listener status seems fine.');
        }
        if (window.location.hostname.includes('aistudio.google.com')) {
            updateAIStudioButtonModifierHint();
        }
    }, 250);

    const observeDOM = function() {
        const observer = new MutationObserver(mutationObserverCallback);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'disabled', 'aria-hidden', 'contenteditable'] });
        logDebug('[observeDOM] MutationObserver started.');
    };

    function init() {
        i18n.detectLanguage(); loadSettings(); createSettingsUI(); registerMenuCommand(); observeDOM();
        activeInputInfo = findActiveInputElement();
        updateActiveInputListener();
        if (window.location.hostname.includes('aistudio.google.com')) setTimeout(updateAIStudioButtonModifierHint, 500);
        logDebug(`Initialized. Global Enable: ${isScriptGloballyEnabled}. Gemini: ${JSON.stringify(currentGeminiConfig)}. AI Studio: ${JSON.stringify(currentAIStudioConfig)}.`);
        logDebug('Initial active input element:', activeInputInfo.element, 'Type:', activeInputInfo.type);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();