// ==UserScript==
// @name         Telegram 输入框翻译并发送 缅甸语
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  修复版：支持发送按钮点击翻译，支持图片/文件发送弹窗中的翻译，移除发送锁，检测到源语言时自动触发翻译
// @author       Your Name / AI Assistant
// @match        https://web.telegram.org/k/*
// @match        https://web.telegram.org/a/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.lhfcb.com
// @downloadURL https://update.greasyfork.org/scripts/534552/Telegram%20%E8%BE%93%E5%85%A5%E6%A1%86%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%E7%BC%85%E7%94%B8%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/534552/Telegram%20%E8%BE%93%E5%85%A5%E6%A1%86%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%E7%BC%85%E7%94%B8%E8%AF%AD.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    console.log('=== Telegram 翻译脚本 v3.3.3 修复版加载 ===');
 
    // --- 常量定义 ---
    const SCRIPT_VERSION = '3.3.3';
    const OHMYGPT_API_KEY = "sk-1zm9YotucF60cHkzLgf9fDHHU9qAGAqzwGv4N7cLkJVfl0rU";
    const OHMYGPT_API_ENDPOINT = "https://api.lhfcb.com/v1/chat/completions";
    const INPUT_TRANSLATE_MODEL = "gemini-2.5-flash-nothinking";
 
    const STORAGE_KEY_PREFIX = 'tg_translate_v3_';
    const STORAGE_KEY_API_ENDPOINT = STORAGE_KEY_PREFIX + 'api_endpoint';
    const STORAGE_KEY_API_KEY = STORAGE_KEY_PREFIX + 'api_key';
    const STORAGE_KEY_MODEL = STORAGE_KEY_PREFIX + 'model';
    const STORAGE_KEY_MODE = STORAGE_KEY_PREFIX + 'mode';
    const STORAGE_KEY_AUTOSEND = STORAGE_KEY_PREFIX + 'autosend';
 
    const MODE_ABBREVIATED = 'abbr';
    const MODE_STANDARD = 'std';
 
    // 选择器定义
    const INPUT_AREA_CONTAINER_SELECTOR = '.chat-input-main'; // 确保只匹配聊天输入区域
    const INPUT_SELECTOR = '.input-message-input';
    const SEND_BUTTON_SELECTOR = '.btn-send';
    
    // 图片/文件发送弹窗选择器
    const POPUP_CONTAINER_SELECTOR = '.popup-send-photo, .popup-new-media';
    const POPUP_INPUT_SELECTOR = '.popup-send-photo .input-message-input, .popup-new-media .input-message-input';
    const POPUP_SEND_BUTTON_SELECTOR = '.popup-send-photo .btn-primary, .popup-new-media .btn-primary, .popup-send-photo .btn-send, .popup-new-media .btn-send';
    
    // 辅助函数：判断输入框是否在弹窗中
    function isInPopup(element) {
        return element && element.closest(POPUP_CONTAINER_SELECTOR);
    }
    
    // 辅助函数：获取对应的发送按钮
    function getSendButton(inputElement) {
        if (isInPopup(inputElement)) {
            // 弹窗中的发送按钮
            const popup = inputElement.closest(POPUP_CONTAINER_SELECTOR);
            return popup ? popup.querySelector('.btn-primary, .btn-send, button.btn-primary') : null;
        }
        return document.querySelector(SEND_BUTTON_SELECTOR);
    }
 
    // UI ID 定义
    const FLOATING_BUTTON_ID = 'tg-trans-float-btn';
    const SETTINGS_PANEL_ID = 'tg-trans-settings-panel';
    const STATUS_BAR_ID = 'tg-trans-status-bar';
    const RETRY_BUTTON_ID = 'tg-trans-retry-btn';
    const RETRY_PROCESSING_BUTTON_ID = 'tg-trans-retry-proc-btn';
    const MODE_BUTTON_ABBR_ID = 'tg-trans-mode-abbr';
    const MODE_BUTTON_STD_ID = 'tg-trans-mode-std';
    const AUTO_SEND_TOGGLE_ID = 'tg-trans-autosend-toggle';
    const CONTROLS_CONTAINER_ID = 'tg-trans-controls';
 
    // 正则表达式
    const BURMESE_REGEX = /[\u1000-\u109F]/;
    const CHINESE_REGEX = /[\u4e00-\u9fa5]/;
 
    // 基础翻译提示词 (用于API调用，缩写模式在此基础上进行脚本后处理)
    const TRANSLATION_PROMPT = `Translate the following Burmese (Myanmar language) text into English
Be mindful of the formality or informality of the original text and reflect that tone in your English translation
Consider whether the Burmese text uses honorifics, colloquialisms, or slang and ensure your English translation conveys a similar level of formality or informality
Pay attention to verb conjugations and sentence structures in Burmese that might indicate politeness or casualness and find appropriate equivalents in English
Choose vocabulary and sentence structures that appropriately match the original style and avoid overly literal translations that do not capture the intended level of formality or informality
Do not end the translated sentence with a period
If parts of the input are untranslatable (like codes, specific IDs, numbers, proper nouns), keep them unchanged
If the entire input is untranslatable (e.g., just numbers, code, already valid English, emojis), return the original text
Return only the final translated text. No explanations, no notes. Just the translation.
Input Text:
{text_to_translate}`;
 
    const MAX_CACHE_SIZE = 100;
    const translationCache = new Map();
 
    // --- 状态变量 ---
    let isPanelOpen = false;
    let autoSendEnabled = localStorage.getItem(STORAGE_KEY_AUTOSEND) === 'true';
    let currentTranslationMode = localStorage.getItem(STORAGE_KEY_MODE) || MODE_ABBREVIATED;
    let lastOriginalText = '';
    let isTranslatingAndSending = false;
    let justTranslated = false;
    let currentInputApiXhr = null;
    let floatingButtonElement = null;
    let settingsPanelElement = null;
    let statusBarElement = null;
 
    // --- API 配置状态 ---
    let currentApiEndpoint = localStorage.getItem(STORAGE_KEY_API_ENDPOINT) || OHMYGPT_API_ENDPOINT;
    let currentApiKey = localStorage.getItem(STORAGE_KEY_API_KEY) || OHMYGPT_API_KEY;
    let currentApiModel = localStorage.getItem(STORAGE_KEY_MODEL) || INPUT_TRANSLATE_MODEL;
 
    console.log(`[输入翻译 v${SCRIPT_VERSION}] 加载配置: Model=${currentApiModel}, Endpoint=${currentApiEndpoint}`);
 
    // --- CSS 样式 ---
    GM_addStyle(`
    /* 缅甸文字体支持 */
    #${SETTINGS_PANEL_ID}, #${STATUS_BAR_ID}, #${RETRY_BUTTON_ID}, #${RETRY_PROCESSING_BUTTON_ID} {
        font-family: "Pyidaungsu", "Myanmar Text", "Padauk", "Noto Sans Myanmar", sans-serif !important;
    }
    
    ${INPUT_AREA_CONTAINER_SELECTOR} { position: relative !important; overflow: visible !important; }
    
    /* 悬浮设置按钮 */
    #${FLOATING_BUTTON_ID} {
        position: fixed; bottom: 80px; right: 20px; width: 48px; height: 48px;
        border-radius: 50%; background: linear-gradient(135deg, #5e72e4, #825ee4);
        color: #fff; border: none; cursor: move; box-shadow: 0 4px 12px rgba(94, 114, 228, 0.4);
        z-index: 9999; display: flex; align-items: center; justify-content: center;
        font-size: 20px; font-weight: bold; transition: box-shadow 0.3s ease;
        user-select: none; touch-action: none;
    }
    #${FLOATING_BUTTON_ID}:hover { box-shadow: 0 6px 16px rgba(94, 114, 228, 0.5); }
    #${FLOATING_BUTTON_ID}.dragging { transition: none; box-shadow: 0 8px 20px rgba(94, 114, 228, 0.6); }
    #${FLOATING_BUTTON_ID}.panel-open { background: linear-gradient(135deg, #ff6b6b, #ee5a52); }
    
    /* 设置面板 */
    #${SETTINGS_PANEL_ID} {
        position: fixed; width: 280px;
        background: linear-gradient(135deg, rgba(30, 30, 35, 0.98), rgba(40, 40, 45, 0.98));
        backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        z-index: 9998; padding: 16px; display: none; opacity: 0;
        transform: scale(0.95); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: "Pyidaungsu", "Myanmar Text", "Padauk", "Noto Sans Myanmar", sans-serif !important;
    }
    #${SETTINGS_PANEL_ID}.visible { display: block; opacity: 1; transform: scale(1); }
    #${SETTINGS_PANEL_ID} .panel-title { font-size: 16px; font-weight: 700; color: #e8eaed; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-family: inherit; }
    #${SETTINGS_PANEL_ID} .setting-group { margin-bottom: 16px; }
    #${SETTINGS_PANEL_ID} .setting-label { font-size: 13px; font-weight: 600; color: #b8bdc4; margin-bottom: 8px; display: block; font-family: inherit; }
    #${SETTINGS_PANEL_ID} .button-group { display: flex; gap: 8px; }
    #${SETTINGS_PANEL_ID} .setting-button {
        flex: 1; padding: 8px 12px; font-size: 13px; font-weight: 600; color: #b8bdc4;
        background: rgba(60, 60, 70, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px; cursor: pointer; transition: all 0.2s ease; text-align: center;
        font-family: inherit;
    }
    #${SETTINGS_PANEL_ID} .setting-button:hover { background: rgba(80, 80, 90, 0.8); border-color: rgba(255, 255, 255, 0.2); }
    #${SETTINGS_PANEL_ID} .setting-button.active { background: linear-gradient(135deg, #5e72e4, #825ee4); color: #fff; border-color: transparent; box-shadow: 0 2px 8px rgba(94, 114, 228, 0.3); }
    #${SETTINGS_PANEL_ID} .toggle-button {
        width: 100%; padding: 10px 16px; font-size: 14px; font-weight: 600;
        border-radius: 8px; cursor: pointer; transition: all 0.2s ease; text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-family: inherit;
    }
    #${SETTINGS_PANEL_ID} .toggle-button.off { background: rgba(60, 60, 70, 0.6); color: #b8bdc4; }
    #${SETTINGS_PANEL_ID} .toggle-button.on { background: linear-gradient(135deg, #51cf66, #37b24d); color: #fff; border-color: transparent; box-shadow: 0 2px 8px rgba(81, 207, 102, 0.3); }
    #${SETTINGS_PANEL_ID} .toggle-button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
    
    /* 状态栏 */
    #${STATUS_BAR_ID} { 
        position: absolute; top: -40px; left: 8px; right: 8px; display: none; 
        padding: 6px 12px; font-size: 12px; color: #e8eaed; 
        background: linear-gradient(135deg, rgba(30, 30, 35, 0.95), rgba(40, 40, 45, 0.95)); 
        backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); 
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); 
        z-index: 149; line-height: 1.4; text-align: left; 
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        opacity: 0; pointer-events: none; transform: translateY(-5px);
        font-family: "Pyidaungsu", "Myanmar Text", "Padauk", "Noto Sans Myanmar", sans-serif !important;
    }
    #${STATUS_BAR_ID}.visible { display: flex; justify-content: space-between; align-items: center; opacity: 1; pointer-events: auto; transform: translateY(0); }
    #${STATUS_BAR_ID} .status-text { flex-grow: 1; margin-right: 10px; font-weight: 500; font-family: inherit; }
    #${STATUS_BAR_ID} .status-buttons { display: flex; gap: 6px; flex-shrink: 0; }
    #${STATUS_BAR_ID} .status { font-style: italic; color: #b8bdc4; }
    #${STATUS_BAR_ID} .info { font-style: italic; color: #64b5f6; font-weight: 600; }
    #${STATUS_BAR_ID} .error { font-weight: 600; color: #ff6b6b; }
    #${STATUS_BAR_ID} .success { font-weight: 600; color: #51cf66; }
    
    /* 重试按钮 */
    #${RETRY_BUTTON_ID}, #${RETRY_PROCESSING_BUTTON_ID} { 
        padding: 4px 10px; font-size: 11px; font-weight: 600; color: #e8eaed; 
        background: linear-gradient(135deg, rgba(70, 70, 80, 0.9), rgba(60, 60, 70, 0.9)); 
        border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 5px; cursor: pointer; 
        flex-shrink: 0; transition: all 0.2s ease; white-space: nowrap; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        font-family: "Pyidaungsu", "Myanmar Text", "Padauk", "Noto Sans Myanmar", sans-serif !important;
    }
    #${RETRY_BUTTON_ID}:hover, #${RETRY_PROCESSING_BUTTON_ID}:hover { background: linear-gradient(135deg, rgba(90, 90, 100, 0.95), rgba(80, 80, 90, 0.95)); transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3); }
    #${RETRY_BUTTON_ID}:active, #${RETRY_PROCESSING_BUTTON_ID}:active { transform: translateY(0); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); }
    `);
 
    // --- 辅助函数 ---
    function detectLanguage(text) {
        if (!text || text.trim().length === 0) return null;
        const trimmedText = text.trim();
        if (BURMESE_REGEX.test(trimmedText)) return 'Burmese';
        if (CHINESE_REGEX.test(trimmedText)) return 'Chinese';
        return 'Other';
    }
    function setCursorToEnd(element) { try { const range = document.createRange(); const sel = window.getSelection(); range.selectNodeContents(element); range.collapse(false); sel.removeAllRanges(); sel.addRange(range); element.focus(); } catch (e) { console.warn(`[输入翻译 v${SCRIPT_VERSION}] 设置光标时出错:`, e); } }
 
    // 标记是否是脚本触发的发送
    let isScriptTriggeredSend = false;
 
    // 安全发送消息 - 使用 Telegram 的内部 API
    // skipValidation: 是否跳过语言验证（用于 Ctrl+Enter 发送原文）
    function safeSendMessage(inputElement, skipValidation = false) {
        if (!inputElement) return false;
        
        // 检查是否在弹窗中
        const inPopup = isInPopup(inputElement);
 
        // 关键：发送前验证内容不是缅甸文或中文（除非明确跳过验证）
        if (!skipValidation) {
            const currentText = inputElement.textContent?.trim();
            const currentLang = detectLanguage(currentText);
            if (currentLang === 'Burmese' || currentLang === 'Chinese') {
                console.warn(`[输入翻译 v${SCRIPT_VERSION}] 阻止发送：检测到源语言 ${currentLang}，触发翻译${inPopup ? ' (弹窗)' : ''}`);
                // 不显示错误，而是自动触发翻译
                const sendButton = getSendButton(inputElement);
                if (sendButton && currentText) {
                    translateAndSend(currentText, inputElement, sendButton);
                }
                return false;
            }
        }
 
        try {
            isScriptTriggeredSend = true;
            console.log(`[输入翻译 v${SCRIPT_VERSION}] 尝试发送消息`);
 
            // 1. 确保文本已更新并触发 input 事件
            inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
 
            // 2. 模拟回车键发送
            const sendKeyEvent = (type) => {
                const event = new KeyboardEvent(type, {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
                    bubbles: true, cancelable: true, composed: true, isTrusted: false
                });
                Object.defineProperty(event, '_scriptTriggered', { value: true });
                return event;
            };
 
            setTimeout(() => {
                inputElement.dispatchEvent(sendKeyEvent('keydown'));
                inputElement.dispatchEvent(sendKeyEvent('keypress'));
                inputElement.dispatchEvent(sendKeyEvent('keyup'));
                console.log(`[输入翻译 v${SCRIPT_VERSION}] 已触发键盘事件序列`);
                setTimeout(() => { isScriptTriggeredSend = false; }, 300);
            }, 100); // 延迟 100ms 确保 input 事件被处理
 
            return true;
        } catch (e) {
            console.error(`[输入翻译 v${SCRIPT_VERSION}] 发送消息失败:`, e);
            isScriptTriggeredSend = false;
            return false;
        }
    }
 
    // 拖动相关变量
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let buttonStartX = 0;
    let buttonStartY = 0;
 
    function ensureControlsExist() {
        const inputMainContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR);
        if (!inputMainContainer) return;
        if (window.getComputedStyle(inputMainContainer).position !== 'relative') { inputMainContainer.style.position = 'relative'; }
 
        // 创建悬浮按钮
        if (!floatingButtonElement || !document.body.contains(floatingButtonElement)) {
            floatingButtonElement = document.createElement('button');
            floatingButtonElement.id = FLOATING_BUTTON_ID;
            floatingButtonElement.type = 'button';
            floatingButtonElement.innerHTML = '⚙️';
            floatingButtonElement.title = 'ဘာသာပြန်ဆက်တင်များ (ဆွဲနိုင်သည်)';
            floatingButtonElement.addEventListener('mousedown', startDrag);
            floatingButtonElement.addEventListener('touchstart', startDrag, { passive: false });
            document.body.appendChild(floatingButtonElement);
        }
 
        // 创建设置面板
        if (!settingsPanelElement || !document.body.contains(settingsPanelElement)) {
            settingsPanelElement = document.createElement('div');
            settingsPanelElement.id = SETTINGS_PANEL_ID;
            settingsPanelElement.innerHTML = `
                <div class="panel-title">ဘာသာပြန်ဆက်တင်များ</div>
                <div class="setting-group">
                    <label class="setting-label">API ဆက်တင်များ</label>
                    <input type="text" id="custom-api-endpoint" class="setting-input" placeholder="API Endpoint" value="${currentApiEndpoint}">
                    <!-- 修改：使用 type="text" 并添加 autocomplete="off" 防止密码管理器自动填充 -->
                    <input type="text" id="custom-api-key" class="setting-input" placeholder="API Key" value="${currentApiKey}" autocomplete="off" data-lpignore="true">
                    <input type="text" id="custom-api-model" class="setting-input" placeholder="Model Name" value="${currentApiModel}">
                </div>
                <div class="setting-group">
                    <label class="setting-label">ဘာသာပြန်မုဒ်</label>
                    <div class="button-group">
                        <button class="setting-button" id="${MODE_BUTTON_ABBR_ID}" data-mode="${MODE_ABBREVIATED}">အတိုကောက်</button>
                        <button class="setting-button" id="${MODE_BUTTON_STD_ID}" data-mode="${MODE_STANDARD}">ပုံမှန်</button>
                    </div>
                </div>
                <div class="setting-group">
                    <label class="setting-label">အလိုအလျောက်ပို့ရန်</label>
                    <button class="toggle-button" id="${AUTO_SEND_TOGGLE_ID}">အလိုအလျောက်ပို့ရန်: ဖွင့်ထားသည်</button>
                </div>
                <style>
                    .setting-input {
                        width: 100%; padding: 8px; margin-bottom: 8px;
                        background: rgba(60, 60, 70, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 6px; color: #e8eaed; font-size: 12px;
                        box-sizing: border-box;
                    }
                    .setting-input:focus { border-color: #5e72e4; outline: none; }
                </style>
            `;
            document.body.appendChild(settingsPanelElement);
 
            const abbrBtn = settingsPanelElement.querySelector(`#${MODE_BUTTON_ABBR_ID}`);
            const stdBtn = settingsPanelElement.querySelector(`#${MODE_BUTTON_STD_ID}`);
            const autoSendBtn = settingsPanelElement.querySelector(`#${AUTO_SEND_TOGGLE_ID}`);
 
            const endpointInput = settingsPanelElement.querySelector('#custom-api-endpoint');
            const keyInput = settingsPanelElement.querySelector('#custom-api-key');
            const modelInput = settingsPanelElement.querySelector('#custom-api-model');
 
            if (abbrBtn) abbrBtn.addEventListener('click', () => switchMode(MODE_ABBREVIATED));
            if (stdBtn) stdBtn.addEventListener('click', () => switchMode(MODE_STANDARD));
            if (autoSendBtn) autoSendBtn.addEventListener('click', toggleAutoSend);
 
            if (endpointInput) endpointInput.addEventListener('change', (e) => {
                currentApiEndpoint = e.target.value.trim();
                localStorage.setItem(STORAGE_KEY_API_ENDPOINT, currentApiEndpoint);
                updateStatusDisplay('API Endpoint သိမ်းဆည်းပြီးပါပြီ', 'success', 2000);
            });
            if (keyInput) keyInput.addEventListener('change', (e) => {
                currentApiKey = e.target.value.trim();
                localStorage.setItem(STORAGE_KEY_API_KEY, currentApiKey);
                updateStatusDisplay('API Key သိမ်းဆည်းပြီးပါပြီ', 'success', 2000);
            });
            if (modelInput) modelInput.addEventListener('change', (e) => {
                currentApiModel = e.target.value.trim();
                localStorage.setItem(STORAGE_KEY_MODEL, currentApiModel);
                updateStatusDisplay('Model Name သိမ်းဆည်းပြီးပါပြီ', 'success', 2000);
            });
 
            updateModeButtonVisuals();
            updateAutoSendButtonVisual();
        }
 
        // 创建状态栏
        if (!statusBarElement || !inputMainContainer.contains(statusBarElement)) {
            statusBarElement = document.createElement('div');
            statusBarElement.id = STATUS_BAR_ID;
            inputMainContainer.appendChild(statusBarElement);
        }
    }
 
    // 拖动功能
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        const touch = e.touches ? e.touches[0] : e;
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        const rect = floatingButtonElement.getBoundingClientRect();
        buttonStartX = rect.left;
        buttonStartY = rect.top;
        floatingButtonElement.classList.add('dragging');
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }
 
    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = touch.clientX - dragStartX;
        const deltaY = touch.clientY - dragStartY;
        const newX = buttonStartX + deltaX;
        const newY = buttonStartY + deltaY;
        floatingButtonElement.style.left = newX + 'px';
        floatingButtonElement.style.top = newY + 'px';
        floatingButtonElement.style.right = 'auto';
        floatingButtonElement.style.bottom = 'auto';
        updatePanelPosition();
    }
 
    function stopDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        floatingButtonElement.classList.remove('dragging');
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        const deltaX = Math.abs(touch.clientX - dragStartX);
        const deltaY = Math.abs(touch.clientY - dragStartY);
        if (deltaX < 5 && deltaY < 5) { toggleSettingsPanel(); }
    }
 
    function updatePanelPosition() {
        if (!settingsPanelElement || !floatingButtonElement) return;
        const buttonRect = floatingButtonElement.getBoundingClientRect();
        const panelWidth = 280;
        const panelHeight = settingsPanelElement.offsetHeight || 200;
        const margin = 10;
        let panelLeft = buttonRect.left - panelWidth - margin;
        let panelTop = buttonRect.top;
        if (panelLeft < margin) { panelLeft = buttonRect.right + margin; }
        if (panelLeft + panelWidth > window.innerWidth - margin) {
            panelLeft = buttonRect.left;
            panelTop = buttonRect.top - panelHeight - margin;
        }
        panelLeft = Math.max(margin, Math.min(panelLeft, window.innerWidth - panelWidth - margin));
        panelTop = Math.max(margin, Math.min(panelTop, window.innerHeight - panelHeight - margin));
        settingsPanelElement.style.left = panelLeft + 'px';
        settingsPanelElement.style.top = panelTop + 'px';
    }
 
    function toggleSettingsPanel() {
        isPanelOpen = !isPanelOpen;
        if (settingsPanelElement) {
            if (isPanelOpen) {
                updatePanelPosition();
                settingsPanelElement.classList.add('visible');
            } else {
                settingsPanelElement.classList.remove('visible');
            }
        }
        if (floatingButtonElement) {
            if (isPanelOpen) {
                floatingButtonElement.classList.add('panel-open');
                floatingButtonElement.innerHTML = '✕';
            } else {
                floatingButtonElement.classList.remove('panel-open');
                floatingButtonElement.innerHTML = '⚙️';
            }
        }
    }
 
    document.addEventListener('click', (e) => {
        if (isPanelOpen && settingsPanelElement && floatingButtonElement) {
            if (!settingsPanelElement.contains(e.target) && !floatingButtonElement.contains(e.target)) {
                toggleSettingsPanel();
            }
        }
    }, true);
 
    function updateStatusDisplay(content, type = 'status', duration = 0, showRetryButton = false, showRetryProcessingButton = false) {
        ensureControlsExist();
        if (!statusBarElement) return;
        let buttonsHtml = '';
        if (showRetryButton && lastOriginalText) { buttonsHtml += `<button id="${RETRY_BUTTON_ID}" type="button">မူရင်းကိုပြန်စမ်းကြည့်ရန်</button>`; }
        if (showRetryProcessingButton) { buttonsHtml += `<button id="${RETRY_PROCESSING_BUTTON_ID}" type="button">ပြန်လုပ်ကြည့်ရန်</button>`; }
        statusBarElement.innerHTML = `<span class="status-text ${type}">${content}</span>${buttonsHtml ? `<div class="status-buttons">${buttonsHtml}</div>` : ''}`;
        statusBarElement.classList.add('visible');
        if (showRetryButton && lastOriginalText) { const retryBtn = statusBarElement.querySelector(`#${RETRY_BUTTON_ID}`); if (retryBtn) retryBtn.addEventListener('click', handleRetryOriginalClick); }
        if (showRetryProcessingButton) { const retryProcBtn = statusBarElement.querySelector(`#${RETRY_PROCESSING_BUTTON_ID}`); if (retryProcBtn) retryProcBtn.addEventListener('click', handleRetryProcessingClick); }
        if (statusBarElement.hideTimeout) clearTimeout(statusBarElement.hideTimeout);
        statusBarElement.hideTimeout = duration > 0 ? setTimeout(hideStatusDisplay, duration) : null;
    }
 
    function hideStatusDisplay() {
        if (statusBarElement) { if (statusBarElement.hideTimeout) clearTimeout(statusBarElement.hideTimeout); statusBarElement.hideTimeout = null; statusBarElement.classList.remove('visible'); setTimeout(() => { if (statusBarElement && !statusBarElement.classList.contains('visible')) { statusBarElement.innerHTML = ''; } }, 250); }
    }
 
    function replaceContentAndSend(inputElement, newText, autoSend, originalText) {
        // 最大重试次数
        const MAX_RETRY = 3;
        let retryCount = 0;
 
        function doReplace() {
            // 使用 execCommand 替换内容，这是最可靠的方法来触发 React/框架的更新
            inputElement.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('insertText', false, newText);
 
            // 兜底：如果 execCommand 失败，使用 textContent 并触发事件
            if (inputElement.textContent?.trim() !== newText.trim()) {
                console.log(`[输入翻译 v${SCRIPT_VERSION}] execCommand 可能失败，尝试手动设置 textContent`);
                inputElement.textContent = newText;
                inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            }
 
            setCursorToEnd(inputElement);
        }
 
        // 验证内容是否正确替换
        function verifyReplacement() {
            const currentText = inputElement.textContent?.trim();
            const originalLang = detectLanguage(originalText);
            const currentLang = detectLanguage(currentText);
            
            // 检查是否替换成功：
            // 1. 当前内容不能是原文
            // 2. 如果原文是缅甸文/中文，当前内容不能仍然是缅甸文/中文
            // 3. 当前内容应该等于翻译后的文本
            const isOriginalText = currentText === originalText?.trim();
            const stillHasSourceLang = (originalLang === 'Burmese' && currentLang === 'Burmese') ||
                                       (originalLang === 'Chinese' && currentLang === 'Chinese');
            const matchesNewText = currentText === newText.trim();
            
            if (isOriginalText || stillHasSourceLang || !matchesNewText) {
                console.warn(`[输入翻译 v${SCRIPT_VERSION}] 内容验证失败: isOriginal=${isOriginalText}, stillHasSourceLang=${stillHasSourceLang}, matchesNewText=${matchesNewText}`);
                return false;
            }
            return true;
        }
 
        doReplace();
 
        if (autoSend) {
            // 增加延迟，确保 DOM 更新和 React 状态同步
            setTimeout(function checkAndSend() {
                if (!isTranslatingAndSending) return;
 
                // --- 关键修复：发送前严格校验 ---
                if (!verifyReplacement()) {
                    retryCount++;
                    console.warn(`[输入翻译 v${SCRIPT_VERSION}] 检测到内容未正确更新，重试 ${retryCount}/${MAX_RETRY}`);
                    
                    if (retryCount < MAX_RETRY) {
                        updateStatusDisplay(`အကြောင်းအရာမပြောင်းလဲကြောင်းတွေ့ရှိသည်၊ ပြန်စမ်းနေသည်... (${retryCount}/${MAX_RETRY})`, 'error');
                        doReplace();
                        // 递增延迟重试
                        setTimeout(checkAndSend, 200 + retryCount * 100);
                        return;
                    } else {
                        // 达到最大重试次数，阻止发送，让用户手动处理
                        console.error(`[输入翻译 v${SCRIPT_VERSION}] 达到最大重试次数，阻止自动发送`);
                        updateStatusDisplay("စာသားအစားထိုးမှုမအောင်မြင်ပါ၊ ကိုယ်တိုင်ပို့ပါ", 'error', 0, true);
                        isTranslatingAndSending = false;
                        lastTranslationEndTime = Date.now();
                        justTranslated = true; // 允许用户按 Enter 发送当前内容
                        return;
                    }
                }
 
                finishSend();
            }, 300); // 延迟 300ms
        } else {
            updateStatusDisplay(`လုပ်ဆောင်မှုပြီးစီးပါပြီ ✓ (ကိုယ်တိုင်ပို့ပါ)`, 'success', 0, true, true);
            isTranslatingAndSending = false;
            lastTranslationEndTime = Date.now();
            justTranslated = true;
        }
 
        function finishSend() {
            // 最终发送前再次验证
            const finalText = inputElement.textContent?.trim();
            const originalLang = detectLanguage(originalText);
            const finalLang = detectLanguage(finalText);
            
            // 如果最终内容仍然是原文语言，阻止发送
            if (originalText && finalText === originalText.trim()) {
                console.error(`[输入翻译 v${SCRIPT_VERSION}] 最终验证失败：内容仍是原文，阻止发送`);
                updateStatusDisplay("ပို့မှုပိတ်ဆို့ထားသည်: မူရင်းစာသားတွေ့ရှိသည်", 'error', 0, true);
                isTranslatingAndSending = false;
                lastTranslationEndTime = Date.now();
                justTranslated = true;
                return;
            }
            
            if ((originalLang === 'Burmese' && finalLang === 'Burmese') ||
                (originalLang === 'Chinese' && finalLang === 'Chinese')) {
                console.error(`[输入翻译 v${SCRIPT_VERSION}] 最终验证失败：内容仍包含源语言，阻止发送`);
                updateStatusDisplay("ပို့မှုပိတ်ဆို့ထားသည်: ဘာသာပြန်မပြီးသေးပါ", 'error', 0, true);
                isTranslatingAndSending = false;
                lastTranslationEndTime = Date.now();
                justTranslated = true;
                return;
            }
 
            // 立即隐藏状态栏
            hideStatusDisplay();
            isTranslatingAndSending = false;
            lastTranslationEndTime = Date.now();
            justTranslated = false;
            safeSendMessage(inputElement);
        }
    }
 
 
    function performAbbreviationPreservingEmojis(inputElement, textToProcess) {
        const emojiMap = new Map();
        let placeholderIndex = 0;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = inputElement.innerHTML;
        const emojiNodes = [];
        const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_ELEMENT);
        let elementNode;
        while (elementNode = walker.nextNode()) {
            if (elementNode.tagName === 'IMG' && elementNode.classList.contains('emoji')) {
                emojiNodes.push(elementNode);
            }
        }
        for (const emojiNode of emojiNodes) {
            const placeholder = `__EMOJI_PLACEHOLDER_${placeholderIndex++}__`;
            emojiMap.set(placeholder, emojiNode.outerHTML);
            const textNode = document.createTextNode(placeholder);
            if (emojiNode.parentNode) {
                emojiNode.parentNode.replaceChild(textNode, emojiNode);
            }
        }
        const textWithPlaceholders = tempDiv.textContent || "";
        let abbreviatedText = applyLetterAbbreviations(fixNumberAbbreviations(textWithPlaceholders));
        const resultFragment = document.createDocumentFragment();
        let lastIndex = 0;
        const placeholderRegex = /__EMOJI_PLACEHOLDER_\d+__/g;
        let match;
        while ((match = placeholderRegex.exec(abbreviatedText)) !== null) {
            if (match.index > lastIndex) {
                resultFragment.appendChild(document.createTextNode(abbreviatedText.substring(lastIndex, match.index)));
            }
            const placeholder = match[0];
            if (emojiMap.has(placeholder)) {
                const emojiHtml = emojiMap.get(placeholder);
                const tempContainer = document.createElement('span');
                tempContainer.innerHTML = emojiHtml;
                resultFragment.appendChild(tempContainer.firstChild);
            }
            lastIndex = match.index + placeholder.length;
        }
        if (lastIndex < abbreviatedText.length) {
            resultFragment.appendChild(document.createTextNode(abbreviatedText.substring(lastIndex)));
        }
 
        // 对于包含 emoji 的复杂 HTML，execCommand 可能处理不好，这里保持原样但增加事件触发
        inputElement.innerHTML = '';
        inputElement.appendChild(resultFragment);
        setCursorToEnd(inputElement);
        inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
 
        // 不显示状态，直接发送
        setTimeout(() => {
            hideStatusDisplay();
            justTranslated = true;
            safeSendMessage(inputElement);
            isTranslatingAndSending = false;
            lastTranslationEndTime = Date.now();
        }, 100);
    }
 
    function fixNumberAbbreviations(text) {
        if (!text) return text; let originalText = text;
        text = text.replace(/\b2\b/gi, "to"); text = text.replace(/\b4\b/gi, "for"); text = text.replace(/\b(be?|b)4\b/gi, "before"); text = text.replace(/\b2day\b/gi, "today"); text = text.replace(/\b2nite\b/gi, "tonight"); text = text.replace(/\b2night\b/gi, "tonight"); text = text.replace(/\b2mrw\b/gi, "tomorrow"); text = text.replace(/\b2moro\b/gi, "tomorrow"); text = text.replace(/\bgr8\b/gi, "great"); text = text.replace(/\bl8r\b/gi, "later"); text = text.replace(/\bw8\b/gi, "wait"); text = text.replace(/\bh8\b/gi, "hate"); text = text.replace(/\bsk8\b/gi, "skate"); text = text.replace(/\bm8\b/gi, "mate");
        if (text !== originalText) { console.log(`[输入翻译 v${SCRIPT_VERSION}] 数字缩写修正: "${originalText}" -> "${text}"`); } return text;
    }
 
    function applyLetterAbbreviations(text) {
        if (!text) return text;
        text = text.replace(/\b[Tt]hank you\b/g, m => m.charAt(0) === 'T' ? 'Thx u' : 'thx u');
        let originalText = text; let modifiedText = text; let initialCapitalizationApplied = false; let changesMade = false;
        const abbrMap = { "you": "u", "your": "ur", "yours": "urs", "yourself": "urself", "are": "r", "thanks": "thx", "thank": "thx", "and": "&", "before": "bfr", "first": "frst", "tomorrow": "tmrw", "next": "nxt" };
        const capitalizeAtStart = ["u", "ur", "urs", "r", "thx", "bfr", "frst", "tmrw", "nxt", "urself"];
        let firstWordIndex = -1; let firstWord = ""; let leadingChars = ""; const match = modifiedText.match(/^(\s*[^a-zA-Z\s]*)?([a-zA-Z]+)/);
        if (match) {
            leadingChars = match[1] || ""; firstWord = match[2]; firstWordIndex = leadingChars.length; const lowerFirstWord = firstWord.toLowerCase();
            if (abbrMap.hasOwnProperty(lowerFirstWord)) {
                const abbreviation = abbrMap[lowerFirstWord]; let replacementMade = false;
                if (capitalizeAtStart.includes(abbreviation)) { const capitalizedAbbr = abbreviation.charAt(0).toUpperCase() + abbreviation.slice(1); modifiedText = leadingChars + capitalizedAbbr + modifiedText.substring(firstWordIndex + firstWord.length); initialCapitalizationApplied = true; replacementMade = true; }
                else if (abbreviation === '&') { modifiedText = leadingChars + abbreviation + modifiedText.substring(firstWordIndex + firstWord.length); initialCapitalizationApplied = true; replacementMade = true; }
                if (replacementMade) changesMade = true;
            }
        }
        const replaceRemaining = (fullWord, abbr) => { const regexLower = new RegExp(`\\b${fullWord}\\b`, 'g'); const regexUpper = new RegExp(`\\b${fullWord.charAt(0).toUpperCase() + fullWord.slice(1)}\\b`, 'g'); let startIndex = 0; if (initialCapitalizationApplied && firstWord.toLowerCase() === fullWord) { startIndex = firstWordIndex + (abbrMap[fullWord] ? abbrMap[fullWord].length : firstWord.length); } let targetStringPart = modifiedText.substring(startIndex); let prefix = modifiedText.substring(0, startIndex); let replacedPart = targetStringPart; let currentChangesMade = false; const originalLength = replacedPart.length; if (abbr === '&') { replacedPart = replacedPart.replace(/\b[Aa]nd\b/g, '&'); } else { replacedPart = replacedPart.replace(regexLower, abbr); replacedPart = replacedPart.replace(regexUpper, abbr); } if (replacedPart.length !== originalLength || replacedPart !== targetStringPart) currentChangesMade = true; modifiedText = prefix + replacedPart; if (currentChangesMade) changesMade = true; };
        for (const word in abbrMap) { replaceRemaining(word, abbrMap[word]); }
        if (/^\s*&/.test(modifiedText)) { modifiedText = modifiedText.replace(/^(\s*)&/, '$1And'); }
        if (changesMade) { console.log(`[输入翻译 v${SCRIPT_VERSION}] 字母缩写: "${originalText}" -> "${modifiedText}"`); } return modifiedText;
    }
 
    function handleRetryOriginalClick(event) {
        event.preventDefault(); event.stopPropagation();
        if (isTranslatingAndSending) return;
        if (!lastOriginalText) return;
        const inputElement = document.querySelector(INPUT_SELECTOR);
        const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
        if (!inputElement || !sendButton) return;
        translateAndSend(lastOriginalText, inputElement, sendButton, true);
    }
 
    function handleRetryProcessingClick(event) {
        event.preventDefault(); event.stopPropagation();
        if (isTranslatingAndSending) return;
        const inputElement = document.querySelector(INPUT_SELECTOR);
        const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
        if (!inputElement || !sendButton) return;
        const currentText = inputElement.textContent?.trim();
        if (!currentText) return;
        translateAndSend(currentText, inputElement, sendButton, true);
    }
 
    function updateAutoSendButtonVisual() {
        const autoSendBtn = document.getElementById(AUTO_SEND_TOGGLE_ID);
        if (!autoSendBtn) return;
        autoSendBtn.textContent = autoSendEnabled ? "အလိုအလျောက်ပို့ရန်: ဖွင့်ထားသည်" : "အလိုအလျောက်ပို့ရန်: ပိတ်ထားသည်";
        autoSendBtn.className = autoSendEnabled ? 'toggle-button on' : 'toggle-button off';
    }
 
    function toggleAutoSend() {
        autoSendEnabled = !autoSendEnabled;
        updateAutoSendButtonVisual();
        updateStatusDisplay(`အလိုအလျောက်ပို့ရန် ${autoSendEnabled ? 'ဖွင့်ပြီးပါပြီ' : 'ပိတ်ပြီးပါပြီ'}`, 'status', 2000);
        localStorage.setItem(STORAGE_KEY_AUTOSEND, autoSendEnabled.toString());
    }
 
    function updateModeButtonVisuals() {
        const abbrButton = document.getElementById(MODE_BUTTON_ABBR_ID);
        const stdButton = document.getElementById(MODE_BUTTON_STD_ID);
        if (!abbrButton || !stdButton) return;
        if (currentTranslationMode === MODE_ABBREVIATED) {
            abbrButton.classList.add('active');
            stdButton.classList.remove('active');
        } else {
            abbrButton.classList.remove('active');
            stdButton.classList.add('active');
        }
    }
 
    function switchMode(newMode) {
        if (newMode === currentTranslationMode) return;
        currentTranslationMode = newMode;
        updateModeButtonVisuals();
        updateStatusDisplay(`မုဒ်ပြောင်းပြီးပါပြီ: ${currentTranslationMode === MODE_ABBREVIATED ? 'အတိုကောက်' : 'ပုံမှန်'}`, 'status', 2000);
        localStorage.setItem(STORAGE_KEY_MODE, currentTranslationMode);
    }
 
    function translateAndSend(textToProcess, inputElement, sendButton, forceApi = false) {
        if (isTranslatingAndSending) return;
        if (!inputElement || !sendButton) { updateStatusDisplay("အမှား: input box သို့မဟုတ် send button ကိုရှာမတွေ့ပါ", 'error', 4000, true, true); return; }
        isTranslatingAndSending = true;
        hideStatusDisplay();
        const detectedLang = detectLanguage(textToProcess);
        const currentModeText = currentTranslationMode === MODE_ABBREVIATED ? 'အတိုကောက်' : 'ပုံမှန်';
 
        // 修改：只有在缩写模式下且是其他语言（非缅甸文、非中文）时才只做缩写处理
        if (currentTranslationMode === MODE_ABBREVIATED && detectedLang === 'Other') {
            performAbbreviationPreservingEmojis(inputElement, textToProcess);
            return;
        }
        if (detectedLang === 'Chinese' || detectedLang === 'Burmese') { lastOriginalText = textToProcess; }
 
        const useCache = !forceApi && (detectedLang === 'Chinese' || detectedLang === 'Burmese');
        const cacheKey = `${currentTranslationMode}::${textToProcess}`;
 
        if (useCache && translationCache.has(cacheKey)) {
            const finalText = translationCache.get(cacheKey);
            console.log(`[输入翻译 v${SCRIPT_VERSION}][缓存命中]`);
            updateStatusDisplay(`[${currentModeText}] cache မှတင်ပြီးပါပြီ ✓`, 'info', 3000, false, !autoSendEnabled);
            replaceContentAndSend(inputElement, finalText, autoSendEnabled, textToProcess);
            return;
        }
 
        const finalPrompt = TRANSLATION_PROMPT.replace('{text_to_translate}', textToProcess);
        updateStatusDisplay(`[${currentModeText}] ဘာသာပြန်နေသည်...`, 'status');
 
        const requestBody = { model: currentApiModel, messages: [{ "role": "user", "content": finalPrompt }], temperature: 0.6 };
        if (currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') { currentInputApiXhr.abort(); }
 
        currentInputApiXhr = GM_xmlhttpRequest({
            method: "POST", url: currentApiEndpoint,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentApiKey}` },
            data: JSON.stringify(requestBody),
            onload: function (response) {
                currentInputApiXhr = null;
                try {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const rawTranslation = data.choices?.[0]?.message?.content?.trim();
                        if (rawTranslation) {
                            let finalProcessedText;
                            if (currentTranslationMode === MODE_ABBREVIATED) {
                                finalProcessedText = applyLetterAbbreviations(fixNumberAbbreviations(rawTranslation));
                            } else {
                                finalProcessedText = rawTranslation.trim();
                            }
 
                            if (!forceApi && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
                                if (translationCache.size >= MAX_CACHE_SIZE) { const oldestKey = translationCache.keys().next().value; translationCache.delete(oldestKey); }
                                translationCache.set(cacheKey, finalProcessedText);
                            }
 
                            replaceContentAndSend(inputElement, finalProcessedText, autoSendEnabled, textToProcess);
                        } else { throw new Error(`API 返回空内容`); }
                    } else { throw new Error(`HTTP ${response.status}`); }
                } catch (e) {
                    console.error(`[输入翻译 v${SCRIPT_VERSION}] API Error:`, e);
                    updateStatusDisplay(`လုပ်ဆောင်မှုမအောင်မြင်ပါ: ${e.message}`, 'error', 5000, true, true);
                    isTranslatingAndSending = false;
                }
            },
            onerror: function (response) { currentInputApiXhr = null; updateStatusDisplay(`ကွန်ရက်အမှား`, 'error', 5000, true, true); isTranslatingAndSending = false; },
            ontimeout: function () { currentInputApiXhr = null; updateStatusDisplay("တောင်းဆိုမှုအချိန်ကုန်ဆုံးသွားပါပြီ", 'error', 5000, true, true); isTranslatingAndSending = false; },
            timeout: 45000
        });
    }
 
    function handleInputKeyDown(event) {
        const inputElement = event.target;
        if (!inputElement) return;
 
        // 第一层检查：URL 包含 search
        if (window.location.hash.includes('search')) {
            console.log(`[输入翻译] URL包含search，跳过处理`);
            return;
        }
 
        // 第二层检查：元素在搜索相关容器内
        if (inputElement.closest('.search-group') ||
            inputElement.closest('.sidebar-search') ||
            inputElement.closest('#search-container') ||
            inputElement.closest('[class*="search"]') ||
            inputElement.closest('.input-search')) {
            console.log(`[输入翻译] 元素在搜索容器内，跳过处理`);
            return;
        }
 
        // 第三层检查：元素本身的属性
        const elementClasses = inputElement.className || '';
        const elementId = inputElement.id || '';
        if (elementClasses.toLowerCase().includes('search') ||
            elementId.toLowerCase().includes('search')) {
            console.log(`[输入翻译] 元素包含search属性，跳过处理`);
            return;
        }
        
        // 检查是否在弹窗中（图片/文件发送弹窗）
        const inPopup = isInPopup(inputElement);
 
        // 第四层检查：必须在聊天输入容器内或弹窗内
        const chatInputContainer = inputElement.closest(INPUT_AREA_CONTAINER_SELECTOR);
        if (!chatInputContainer && !inPopup) {
            console.log(`[输入翻译] 不在聊天输入容器或弹窗内，跳过处理`);
            return;
        }
 
        // 第五层检查：必须是正确的输入框类型
        if (!inputElement.matches('div.input-message-input[contenteditable="true"]')) {
            console.log(`[输入翻译] 不是聊天输入框，跳过处理`);
            return;
        }
        
        if (inPopup) {
            console.log(`[输入翻译] 检测到弹窗输入框`);
        }
 
        if (isScriptTriggeredSend || event._scriptTriggered) return;
 
        // 新增功能：Ctrl+Enter 或 Alt+Enter 发送原文（跳过语言验证）
        if (event.key === 'Enter' && (event.ctrlKey || event.altKey)) {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
            justTranslated = false;
            safeSendMessage(inputElement, true); // skipValidation = true
            return;
        }
 
        if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.ctrlKey && justTranslated) {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
            // 即使 justTranslated 为 true，也要验证内容
            if (safeSendMessage(inputElement)) {
                justTranslated = false;
                hideStatusDisplay();
            }
            return;
        }
 
        if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.ctrlKey) {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
            if (isTranslatingAndSending) return;
 
            let text = inputElement.textContent?.trim() || inputElement.innerText?.trim() || "";
            const detectedLang = detectLanguage(text);
            // 使用辅助函数获取对应的发送按钮
            const sendButton = getSendButton(inputElement);
 
            if (!sendButton || sendButton.disabled) {
                updateStatusDisplay("အမှား: ပို့ရန်ခလုတ်မရနိုင်ပါ!", 'error', 5000, true, true);
                return;
            }
 
            // 修改：所有缅甸文都必须翻译
            const needsProcessing = text && text.length > 0 && (
                detectedLang === 'Burmese' ||  // 缅甸文必须翻译
                detectedLang === 'Chinese' ||   // 中文必须翻译
                (currentTranslationMode === MODE_ABBREVIATED && detectedLang === 'Other')  // 缩写模式下的其他语言做缩写处理
            );
 
            if (needsProcessing) {
                translateAndSend(text, inputElement, sendButton);
            } else {
                justTranslated = false;
                safeSendMessage(inputElement);
            }
        }
        else if (isTranslatingAndSending && !['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab'].includes(event.key)) {
            hideStatusDisplay();
            if (currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') { currentInputApiXhr.abort(); }
            isTranslatingAndSending = false;
        } else if (!isTranslatingAndSending) {
            if (statusBarElement && statusBarElement.classList.contains('visible')) {
                const statusSpan = statusBarElement.querySelector('span.status');
                if (statusSpan) hideStatusDisplay();
            }
        }
    }
 
    let lastTranslationEndTime = 0;
    const VOICE_BLOCK_DURATION = 500;
 
    function preventVoiceRecording(event) {
        const target = event.target;
        const isVoiceButton = target.closest('.btn-icon.rp') || target.closest('button[title*="录音"]') || target.closest('button[title*="Record"]') || target.closest('.record-control');
        const shouldBlock = isVoiceButton && (isTranslatingAndSending || (Date.now() - lastTranslationEndTime < VOICE_BLOCK_DURATION));
        if (shouldBlock) {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
            return false;
        }
    }
 
    function globalEventInterceptor(event) {
        if (!isTranslatingAndSending) return;
        const target = event.target;
        const isInputArea = target.closest(INPUT_AREA_CONTAINER_SELECTOR);
        if (isInputArea && (event.type === 'mousedown' || event.type === 'touchstart')) {
            const isControlButton = target.closest(`#${CONTROLS_CONTAINER_ID}`);
            const isSendButton = target.closest(SEND_BUTTON_SELECTOR);
            if (!isControlButton && !isSendButton) {
                event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
            }
        }
    }
    
    // 拦截发送按钮点击，检查是否需要翻译
    function handleSendButtonClick(event) {
        const target = event.target;
        
        // 检查是否点击了发送按钮（主输入框或弹窗）
        const sendButton = target.closest('.btn-send, .btn-primary');
        if (!sendButton) return;
        
        // 检查是否在弹窗中
        const popup = sendButton.closest(POPUP_CONTAINER_SELECTOR);
        const inMainChat = sendButton.closest(INPUT_AREA_CONTAINER_SELECTOR);
        
        let inputElement = null;
        
        if (popup) {
            // 弹窗中的发送按钮
            inputElement = popup.querySelector('div.input-message-input[contenteditable="true"]');
        } else if (inMainChat) {
            // 主聊天区域的发送按钮
            inputElement = inMainChat.querySelector('div.input-message-input[contenteditable="true"]');
        }
        
        if (!inputElement) return;
        
        const text = inputElement.textContent?.trim() || '';
        const detectedLang = detectLanguage(text);
        
        // 如果包含中文或缅甸文，拦截点击并触发翻译
        if (text && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            
            console.log(`[输入翻译 v${SCRIPT_VERSION}] 拦截发送按钮点击，检测到 ${detectedLang}，触发翻译`);
            
            if (!isTranslatingAndSending) {
                translateAndSend(text, inputElement, sendButton);
            }
            return false;
        }
    }
    
    // 为弹窗添加发送按钮监听器
    function attachPopupSendButtonListener(popupNode) {
        if (popupNode.dataset.sendButtonListenerAttached) return;
        
        const sendButtons = popupNode.querySelectorAll('.btn-primary, .btn-send');
        sendButtons.forEach(btn => {
            btn.addEventListener('click', handleSendButtonClick, { capture: true });
            btn.addEventListener('mousedown', handleSendButtonClick, { capture: true });
        });
        
        popupNode.dataset.sendButtonListenerAttached = 'true';
        console.log(`[输入翻译] 已为弹窗发送按钮添加监听器`);
    }
 
    function initialize() {
        console.log(`[输入翻译 v${SCRIPT_VERSION}] 初始化...`);
 
        document.body.addEventListener('mousedown', preventVoiceRecording, { capture: true, passive: false });
        document.body.addEventListener('touchstart', preventVoiceRecording, { capture: true, passive: false });
        document.body.addEventListener('click', preventVoiceRecording, { capture: true, passive: false });
        document.body.addEventListener('mousedown', globalEventInterceptor, { capture: true, passive: false });
        document.body.addEventListener('touchstart', globalEventInterceptor, { capture: true, passive: false });
        
        // 全局监听发送按钮点击，拦截中文/缅甸文发送
        document.body.addEventListener('click', handleSendButtonClick, { capture: true });
        document.body.addEventListener('mousedown', handleSendButtonClick, { capture: true });
 
        const observer = new MutationObserver(mutations => {
            let controlsNeedCheck = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
 
                        // 跳过搜索区域的变化
                        if (node.closest && (node.closest('.search-group') ||
                            node.closest('.sidebar-search') ||
                            node.closest('#search-container') ||
                            node.closest('[class*="search"]'))) {
                            return;
                        }
 
                        // 检查聊天输入容器
                        const containerNode = node.matches && node.matches(INPUT_AREA_CONTAINER_SELECTOR) ? node : node.querySelector && node.querySelector(INPUT_AREA_CONTAINER_SELECTOR);
                        if (containerNode) controlsNeedCheck = true;
                        
                        // 检查弹窗容器（图片/文件发送弹窗）
                        const popupNode = node.matches && node.matches(POPUP_CONTAINER_SELECTOR) ? node : node.querySelector && node.querySelector(POPUP_CONTAINER_SELECTOR);
                        if (popupNode) {
                            console.log(`[输入翻译] 检测到弹窗出现`);
                            // 查找弹窗中的输入框
                            const popupInputs = popupNode.querySelectorAll('div.input-message-input[contenteditable="true"]');
                            popupInputs.forEach(popupInput => {
                                if (!popupInput.dataset.customInputTranslateListener) {
                                    attachInputListeners(popupInput);
                                }
                            });
                            // 拦截弹窗发送按钮的点击事件
                            attachPopupSendButtonListener(popupNode);
                        }
 
                        // 只在聊天输入容器内或弹窗内查找输入框
                        const inPopupContainer = node.closest && node.closest(POPUP_CONTAINER_SELECTOR);
                        if (containerNode || (node.closest && node.closest(INPUT_AREA_CONTAINER_SELECTOR)) || inPopupContainer) {
                            const inputElementNode = node.matches && node.matches('div.input-message-input[contenteditable="true"]') ? node : node.querySelector && node.querySelector('div.input-message-input[contenteditable="true"]');
                            if (inputElementNode && !inputElementNode.dataset.customInputTranslateListener) {
                                attachInputListeners(inputElementNode);
                                if (!inPopupContainer) controlsNeedCheck = true;
                            }
                        }
                    });
                }
            });
            if (controlsNeedCheck) setTimeout(ensureControlsExist, 50);
        });
 
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            const initialContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR);
            if (initialContainer) ensureControlsExist();
            const initialInputElement = document.querySelector(INPUT_SELECTOR);
            if (initialInputElement) attachInputListeners(initialInputElement);
        }, 1000);
    }
 
    function attachInputListeners(inputElement) {
        if (inputElement.dataset.customInputTranslateListener) return;
 
        // URL 检查
        if (window.location.hash.includes('search')) {
            console.log(`[输入翻译] URL包含search，不附加监听器`);
            return;
        }
 
        // 容器检查
        if (inputElement.closest('.search-group') ||
            inputElement.closest('.sidebar-search') ||
            inputElement.closest('#search-container') ||
            inputElement.closest('[class*="search"]') ||
            inputElement.closest('.input-search')) {
            console.log(`[输入翻译] 跳过搜索框元素`);
            return;
        }
 
        // 元素属性检查
        const elementClasses = inputElement.className || '';
        const elementId = inputElement.id || '';
        if (elementClasses.toLowerCase().includes('search') ||
            elementId.toLowerCase().includes('search')) {
            console.log(`[输入翻译] 元素包含search属性，跳过`);
            return;
        }
        
        // 检查是否在弹窗中
        const inPopup = isInPopup(inputElement);
 
        // 必须在聊天输入容器内或弹窗内
        const chatInputContainer = inputElement.closest(INPUT_AREA_CONTAINER_SELECTOR);
        if (!chatInputContainer && !inPopup) {
            console.log(`[输入翻译] 跳过非聊天输入框`);
            return;
        }
 
        if (inPopup) {
            console.log(`[输入翻译] 附加监听器到弹窗输入框（图片/文件发送）`);
        } else {
            console.log(`[输入翻译] 附加监听器到聊天输入框`);
        }
        inputElement.addEventListener('keydown', handleInputKeyDown, { capture: true, passive: false });
        inputElement.dataset.customInputTranslateListener = 'true';
        
        // 只有主聊天输入框才需要创建控件
        if (!inPopup) {
            console.log(`[输入翻译] 准备调用 ensureControlsExist`);
            ensureControlsExist();
            console.log(`[输入翻译] ensureControlsExist 调用完成`);
        }
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
 
    function showInlineStatus(el, msg, duration = 2000) {
        const parent = el.parentElement;
        if (!parent) return;
        parent.style.position = parent.style.position || 'relative';
        const tip = document.createElement('div');
        tip.textContent = msg;
        tip.style.cssText = 'position:absolute;top:-24px;right:0;padding:4px 8px;background:rgba(0,0,0,0.7);color:#fff;border-radius:4px;font-size:12px;z-index:500;';
        parent.appendChild(tip);
        setTimeout(() => { if (tip && tip.parentElement) tip.parentElement.removeChild(tip); }, duration);
    }
 
})();