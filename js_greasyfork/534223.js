// ==UserScript==
// @name         Telegram 输入框翻译并发送 (v3.1.3 - 修复手动发送逻辑)
// @namespace    http://tampermonkey.net/
// @version      3.1.3
// @description  v3.1.1基础: 修复了当自动发送关闭时，上一次翻译成功后，输入新的待翻译文本会被直接发送的问题。
// @author       Your Name / AI Assistant
// @match        https://web.telegram.org/k/*
// @match        https://web.telegram.org/a/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.ohmygpt.com
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/48px-Telegram_logo.svg.png
// @downloadURL https://update.greasyfork.org/scripts/534223/Telegram%20%E8%BE%93%E5%85%A5%E6%A1%86%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%28v313%20-%20%E4%BF%AE%E5%A4%8D%E6%89%8B%E5%8A%A8%E5%8F%91%E9%80%81%E9%80%BB%E8%BE%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534223/Telegram%20%E8%BE%93%E5%85%A5%E6%A1%86%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%28v313%20-%20%E4%BF%AE%E5%A4%8D%E6%89%8B%E5%8A%A8%E5%8F%91%E9%80%81%E9%80%BB%E8%BE%91%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const SCRIPT_VERSION = '3.1.2'; // << MODIFIED v3.1.2 >> 脚本版本
    const OHMYGPT_API_KEY = "sk-RK1MU6Cg6a48fBecBBADT3BlbKFJ4C209a954d3b4428b54b"; // 如有不同，请替换为你的 API Key
    const OHMYGPT_API_ENDPOINT = "https://api.ohmygpt.com/v1/chat/completions";
    const INPUT_TRANSLATE_MODEL = "gpt-4o-mini"; // 使用的模型
    const MAX_CACHE_SIZE = 100; // 最大缓存条目数
    const STORAGE_KEY_AUTOSEND = 'telegramTranslateAutoSendPref'; // 自动发送设置的 localStorage 键名
    const STORAGE_KEY_MODE = 'telegramTranslateModePref';     // 翻译模式设置的 localStorage 键名

    // --- 翻译模式常量 ---
    const MODE_ABBREVIATED = 'abbreviated';
    const MODE_STANDARD = 'standard';

    // --- 翻译提示 (保持不变) ---
    // 缩写模式提示
    const ABBREVIATED_US_ENGLISH_PROMPT = `
Role: Translator/Abbreviator to US English.
Task: Translate/Abbreviate the input following strict rules. Prioritize translating any Chinese/Burmese text, even if short or mixed with numbers/English (e.g., "输入 123" -> "Input 123"). Also abbreviate existing English.
Strict Rules:
1. Style: Sophisticated US English.
2. Abbreviations (ONLY these letters): u, ur, r, thx, &, bfr, frst, tmrw, nxt. (Apply these to translated/original English).
3. Capitalization: Correct sentence start (e.g., "U r here").
4. NO Number Abbreviations: Use "to", "for". Absolutely no "2", "4". Double-check.
5. Punctuation: NO period (.) at the end. Keep original question marks (?).
6. Output: ONLY the final processed text. No explanations or extra words.
7. Untranslatable Input: If input is *entirely* code, numbers, etc., return original unmodified.

Input Text:
{text_to_translate}
`;
    // 标准美式英语提示
    const STANDARD_US_ENGLISH_PROMPT = `
Role: Direct Translator to US English.
Task: Translate the input text into standard, natural-sounding American English. Output the translation ONLY.
Strict Rules:
1. Translate only the parts that need translation. If parts of the input are untranslatable (like codes, numbers, proper nouns mixed with translatable text), translate the translatable parts and keep the untranslatable parts as they are. Example: "输入 123" -> "Input 123".
2. If the entire input is untranslatable (e.g., just numbers, code, already English), return the original text unmodified.
3. Punctuation: NO period (.) at the end. Keep original question marks (?).
4. Output: ONLY the final translated text. NO explanations. NO notes. NO extra words.

Input Text:
{text_to_translate}
`;

    // --- 选择器 (保持不变) ---
    const INPUT_SELECTOR = 'div.input-message-input[contenteditable="true"]';
    const SEND_BUTTON_SELECTOR = 'button.btn-send';
    const INPUT_AREA_CONTAINER_SELECTOR = '.chat-input-main';

    // --- UI 元素 ID (保持不变) ---
    const STATUS_BAR_ID = 'custom-input-status-bar';
    const CONTROLS_CONTAINER_ID = 'custom-input-controls-container';
    const AUTO_SEND_TOGGLE_ID = 'custom-auto-send-toggle';
    const MODE_SELECTOR_CONTAINER_ID = 'custom-mode-selector';
    const MODE_BUTTON_ABBR_ID = 'custom-mode-button-abbr';
    const MODE_BUTTON_STD_ID = 'custom-mode-button-std';
    const RETRY_BUTTON_ID = 'custom-translate-retry-button';
    const RETRY_PROCESSING_BUTTON_ID = 'custom-processing-retry-button';

    // --- 语言检测正则 (保持不变) ---
    const CHINESE_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;
    const BURMESE_REGEX = /[\u1000-\u109F]/;

    // --- 状态变量 (保持不变) ---
    let statusBarElement = null;
    let controlsContainerElement = null;
    let autoSendToggleElement = null;
    let modeSelectorContainerElement = null;
    let currentInputApiXhr = null;
    let isTranslatingAndSending = false;
    let sendButtonClickListenerAttached = false;
    let lastOriginalText = null;
    const translationCache = new Map();

    // --- 自动发送状态 (保持不变) ---
    let autoSendEnabled = true;
    const savedAutoSendState = localStorage.getItem(STORAGE_KEY_AUTOSEND);
    if (savedAutoSendState !== null) {
        autoSendEnabled = savedAutoSendState === 'true';
        console.log(`[输入翻译 v${SCRIPT_VERSION}] 已加载自动发送偏好: ${autoSendEnabled ? '开启' : '关闭'}`);
    } else {
        console.log(`[输入翻译 v${SCRIPT_VERSION}] 未找到自动发送偏好，使用默认值: ${autoSendEnabled ? '开启' : '关闭'}`);
    }

    // --- 翻译模式状态 (保持不变) ---
    let currentTranslationMode = MODE_ABBREVIATED;
    const savedModeState = localStorage.getItem(STORAGE_KEY_MODE);
    if (savedModeState === MODE_STANDARD || savedModeState === MODE_ABBREVIATED) {
        currentTranslationMode = savedModeState;
        console.log(`[输入翻译 v${SCRIPT_VERSION}] 已加载翻译模式偏好: ${currentTranslationMode === MODE_ABBREVIATED ? '缩写' : '标准'}`);
    } else {
        console.log(`[输入翻译 v${SCRIPT_VERSION}] 未找到翻译模式偏好，使用默认值: 缩写`);
    }

    // --- CSS 样式 (保持不变) ---
    GM_addStyle(`
        ${INPUT_AREA_CONTAINER_SELECTOR} { position: relative !important; overflow: visible !important; }
        #${STATUS_BAR_ID} { position: absolute; bottom: 2px; left: 8px; right: 8px; display: none; padding: 4px 8px; font-size: 12px; color: #ccc; background-color: rgba(20, 20, 20, 0.85); backdrop-filter: blur(2px); border-top: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; z-index: 149; line-height: 1.3; text-align: left; transition: opacity 0.2s ease-in-out, bottom 0.2s ease-in-out; opacity: 0; pointer-events: none; }
        #${STATUS_BAR_ID}.visible { display: flex; justify-content: space-between; align-items: center; opacity: 1; pointer-events: auto; }
        #${STATUS_BAR_ID} .status-text { flex-grow: 1; margin-right: 8px; }
        #${STATUS_BAR_ID} .status-buttons { display: flex; gap: 5px; flex-shrink: 0; }
        #${STATUS_BAR_ID} .status { font-style: italic; color: #a0a0a0; }
        #${STATUS_BAR_ID} .info { font-style: italic; color: #87cefa; }
        #${STATUS_BAR_ID} .error { font-weight: bold; color: #ff8a8a; }
        #${STATUS_BAR_ID} .success { font-weight: bold; color: #8ade8a; }
        #${RETRY_BUTTON_ID}, #${RETRY_PROCESSING_BUTTON_ID} { padding: 2px 6px; font-size: 11px; font-weight: bold; color: #d0d0d0; background-color: rgba(80, 80, 80, 0.9); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 3px; cursor: pointer; flex-shrink: 0; transition: background-color 0.2s ease, color 0.2s ease; white-space: nowrap; }
        #${RETRY_BUTTON_ID}:hover, #${RETRY_PROCESSING_BUTTON_ID}:hover { background-color: rgba(100, 100, 100, 0.9); color: #fff; }
        #${RETRY_BUTTON_ID}:active, #${RETRY_PROCESSING_BUTTON_ID}:active { background-color: rgba(60, 60, 60, 0.9); }
        #${CONTROLS_CONTAINER_ID} { position: absolute; bottom: 100%; right: 10px; margin-bottom: 0px; display: flex; align-items: flex-end; gap: 0px; z-index: 151; pointer-events: none; height: 26px; }
        #${MODE_SELECTOR_CONTAINER_ID} { display: flex; margin-right: 5px; pointer-events: auto; border: 1px solid rgba(255, 255, 255, 0.2); border-bottom: none; border-radius: 6px 6px 0 0; overflow: hidden; background-color: rgba(80, 80, 80, 0.9); }
        #${MODE_BUTTON_ABBR_ID}, #${MODE_BUTTON_STD_ID} { padding: 4px 8px; font-size: 12px; font-weight: bold; color: #ccc; background-color: transparent; border: none; cursor: pointer; user-select: none; transition: background-color 0.2s ease, color 0.2s ease; line-height: 16px; height: 24px; box-sizing: border-box; }
        #${MODE_BUTTON_ABBR_ID}.active, #${MODE_BUTTON_STD_ID}.active { background-color: rgba(70, 130, 180, 0.95); color: #fff; }
        #${MODE_BUTTON_ABBR_ID}:hover:not(.active), #${MODE_BUTTON_STD_ID}:hover:not(.active) { background-color: rgba(100, 100, 100, 0.9); }
        #${AUTO_SEND_TOGGLE_ID} { padding: 4px 10px; font-size: 12px; font-weight: bold; background-color: rgba(80, 80, 80, 0.9); color: #ccc; border: 1px solid rgba(255, 255, 255, 0.2); border-bottom: none; border-radius: 6px 6px 0 0; cursor: pointer; user-select: none; transition: background-color 0.2s ease, color 0.2s ease; pointer-events: auto; line-height: 16px; height: 24px; box-sizing: border-box; }
        #${AUTO_SEND_TOGGLE_ID}.autosend-on { background-color: rgba(70, 130, 180, 0.95); color: #fff; }
        #${AUTO_SEND_TOGGLE_ID}:hover { filter: brightness(1.1); }
    `);

    // --- 辅助函数 (保持不变) ---
    function detectLanguage(text) { if (!text) return null; if (CHINESE_REGEX.test(text)) return 'Chinese'; if (BURMESE_REGEX.test(text)) return 'Burmese'; return 'Other'; }
    function setCursorToEnd(element) { try { const range = document.createRange(); const sel = window.getSelection(); range.selectNodeContents(element); range.collapse(false); sel.removeAllRanges(); sel.addRange(range); element.focus(); } catch (e) { console.warn(`[输入翻译 v${SCRIPT_VERSION}] 设置光标时出错:`, e); } }
    function ensureControlsExist() {
        const inputMainContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR);
        if (!inputMainContainer) return;
        if (window.getComputedStyle(inputMainContainer).position !== 'relative') { inputMainContainer.style.position = 'relative'; }
        if (!controlsContainerElement || !inputMainContainer.contains(controlsContainerElement)) {
            controlsContainerElement = document.createElement('div');
            controlsContainerElement.id = CONTROLS_CONTAINER_ID;
            inputMainContainer.appendChild(controlsContainerElement);
            console.log(`[输入翻译 v${SCRIPT_VERSION}] 控制按钮容器已创建。`);
        }
        if (!modeSelectorContainerElement || !controlsContainerElement.contains(modeSelectorContainerElement)) {
            modeSelectorContainerElement = document.createElement('div');
            modeSelectorContainerElement.id = MODE_SELECTOR_CONTAINER_ID;
            const abbrButton = document.createElement('button'); abbrButton.id = MODE_BUTTON_ABBR_ID; abbrButton.textContent = '缩写'; abbrButton.type = 'button'; abbrButton.addEventListener('click', () => switchMode(MODE_ABBREVIATED)); modeSelectorContainerElement.appendChild(abbrButton);
            const stdButton = document.createElement('button'); stdButton.id = MODE_BUTTON_STD_ID; stdButton.textContent = '标准'; stdButton.type = 'button'; stdButton.addEventListener('click', () => switchMode(MODE_STANDARD)); modeSelectorContainerElement.appendChild(stdButton);
            controlsContainerElement.insertBefore(modeSelectorContainerElement, controlsContainerElement.firstChild);
            updateModeButtonVisuals();
            console.log(`[输入翻译 v${SCRIPT_VERSION}] 模式选择按钮已创建。`);
        }
        if (!autoSendToggleElement || !controlsContainerElement.contains(autoSendToggleElement)) {
            autoSendToggleElement = document.createElement('button'); autoSendToggleElement.id = AUTO_SEND_TOGGLE_ID; autoSendToggleElement.type = 'button'; autoSendToggleElement.addEventListener('click', toggleAutoSend);
            controlsContainerElement.appendChild(autoSendToggleElement);
            updateAutoSendButtonVisual();
            console.log(`[输入翻译 v${SCRIPT_VERSION}] 自动发送开关按钮已创建。`);
        }
        if (!statusBarElement || !inputMainContainer.contains(statusBarElement)) {
            statusBarElement = document.createElement('div'); statusBarElement.id = STATUS_BAR_ID;
            inputMainContainer.appendChild(statusBarElement);
            console.log(`[输入翻译 v${SCRIPT_VERSION}] 状态栏元素已创建。`);
        }
    }
    function updateStatusDisplay(content, type = 'status', duration = 0, showRetryButton = false, showRetryProcessingButton = false) {
        ensureControlsExist();
        if (!statusBarElement) { console.error(`[输入翻译 v${SCRIPT_VERSION}] 更新状态时未找到状态栏元素。`); return; }
        let buttonsHtml = '';
        if (showRetryButton && lastOriginalText) { buttonsHtml += `<button id="${RETRY_BUTTON_ID}" type="button">重试原文</button>`; }
        if (showRetryProcessingButton) { buttonsHtml += `<button id="${RETRY_PROCESSING_BUTTON_ID}" type="button">重试处理</button>`; }
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
    function fixNumberAbbreviations(text) {
        if (!text) return text; let originalText = text;
        text = text.replace(/\b2\b/gi, "to"); text = text.replace(/\b4\b/gi, "for"); text = text.replace(/\b(be?|b)4\b/gi, "before"); text = text.replace(/\b2day\b/gi, "today"); text = text.replace(/\b2nite\b/gi, "tonight"); text = text.replace(/\b2night\b/gi, "tonight"); text = text.replace(/\b2mrw\b/gi, "tomorrow"); text = text.replace(/\b2moro\b/gi, "tomorrow"); text = text.replace(/\bgr8\b/gi, "great"); text = text.replace(/\bl8r\b/gi, "later"); text = text.replace(/\bw8\b/gi, "wait"); text = text.replace(/\bh8\b/gi, "hate"); text = text.replace(/\bsk8\b/gi, "skate"); text = text.replace(/\bm8\b/gi, "mate");
        if (text !== originalText) { console.log(`[输入翻译 v${SCRIPT_VERSION}][缩写模式处理] 应用了数字/组合缩写修正: "${originalText}" -> "${text}"`); } return text;
    }
    function applyLetterAbbreviations(text) {
        if (!text) return text; let originalText = text; let modifiedText = text; let initialCapitalizationApplied = false; let changesMade = false; const abbrMap = { "you": "u", "your": "ur", "yours": "urs", "yourself": "urself", "are": "r", "thanks": "thx", "and": "&", "before": "bfr", "first": "frst", "tomorrow": "tmrw", "next": "nxt" }; const capitalizeAtStart = ["u", "ur", "urs", "urself", "r", "thx", "bfr", "frst", "tmrw", "nxt"];
        let firstWordIndex = -1; let firstWord = ""; let leadingChars = ""; const match = modifiedText.match(/^(\s*[^a-zA-Z\s]*)?([a-zA-Z]+)/);
        if (match) { leadingChars = match[1] || ""; firstWord = match[2]; firstWordIndex = leadingChars.length; const lowerFirstWord = firstWord.toLowerCase();
            if (abbrMap.hasOwnProperty(lowerFirstWord)) { const abbreviation = abbrMap[lowerFirstWord]; let replacementMade = false;
                if (capitalizeAtStart.includes(abbreviation)) { const capitalizedAbbr = abbreviation.charAt(0).toUpperCase() + abbreviation.slice(1); modifiedText = leadingChars + capitalizedAbbr + modifiedText.substring(firstWordIndex + firstWord.length); initialCapitalizationApplied = true; replacementMade = true; }
                else if (abbreviation === '&') { modifiedText = leadingChars + abbreviation + modifiedText.substring(firstWordIndex + firstWord.length); initialCapitalizationApplied = true; replacementMade = true; }
                if (replacementMade) changesMade = true;
            }
        }
        const replaceRemaining = (fullWord, abbr) => { const regexLower = new RegExp(`\\b${fullWord}\\b`, 'g'); const regexUpper = new RegExp(`\\b${fullWord.charAt(0).toUpperCase() + fullWord.slice(1)}\\b`, 'g'); let startIndex = 0; if (initialCapitalizationApplied && firstWord.toLowerCase() === fullWord) { startIndex = firstWordIndex + abbrMap[fullWord].length; } let targetStringPart = modifiedText.substring(startIndex); let prefix = modifiedText.substring(0, startIndex); let replacedPart = targetStringPart; let currentChangesMade = false; const originalLength = replacedPart.length; if (abbr === '&') { replacedPart = replacedPart.replace(/\b[Aa]nd\b/g, '&'); } else { replacedPart = replacedPart.replace(regexLower, abbr); replacedPart = replacedPart.replace(regexUpper, abbr); } if(replacedPart.length !== originalLength || replacedPart !== targetStringPart) currentChangesMade = true; modifiedText = prefix + replacedPart; if (currentChangesMade) changesMade = true; };
        for (const word in abbrMap) { replaceRemaining(word, abbrMap[word]); }
        if (changesMade) { console.log(`[输入翻译 v${SCRIPT_VERSION}][缩写模式处理] 应用了字母缩写。\n    输入: "${originalText}"\n    输出: "${modifiedText}"`); } else { console.log(`[输入翻译 v${SCRIPT_VERSION}][缩写模式处理] 未应用字母缩写。\n    输入: "${originalText}"`); } return modifiedText;
    }
    function handleRetryOriginalClick(event) {
         event.preventDefault(); event.stopPropagation(); console.log(`[输入翻译 v${SCRIPT_VERSION}] "重试原文"按钮被点击。`); if (isTranslatingAndSending) { console.warn(`[输入翻译 v${SCRIPT_VERSION}] 正在处理中，忽略"重试原文"点击。`); return; } if (!lastOriginalText) { console.warn(`[输入翻译 v${SCRIPT_VERSION}] 没有存储原文可供重试。`); hideStatusDisplay(); return; } const inputElement = document.querySelector(INPUT_SELECTOR); const sendButton = document.querySelector(SEND_BUTTON_SELECTOR); if (!inputElement || !sendButton) { updateStatusDisplay("重试失败: 界面元素丢失", 'error', 4000, true, true); return; } if (sendButton.disabled) { updateStatusDisplay("重试失败: 发送按钮不可用", 'error', 4000, true, true); return; } console.log(`[输入翻译 v${SCRIPT_VERSION}] 正在使用 [${currentTranslationMode === MODE_ABBREVIATED ? '缩写' : '标准'}] 模式重试原文翻译: "${lastOriginalText}"`); translateAndSend(lastOriginalText, inputElement, sendButton, true);
    }
    function handleRetryProcessingClick(event) {
        event.preventDefault(); event.stopPropagation(); console.log(`[输入翻译 v${SCRIPT_VERSION}] "重试处理"按钮被点击。`); if (isTranslatingAndSending) { console.warn(`[输入翻译 v${SCRIPT_VERSION}] 正在处理中，忽略"重试处理"点击。`); return; } const inputElement = document.querySelector(INPUT_SELECTOR); const sendButton = document.querySelector(SEND_BUTTON_SELECTOR); if (!inputElement || !sendButton) { updateStatusDisplay("重试失败: 界面元素丢失", 'error', 4000, true, true); return; } const currentText = inputElement.textContent?.trim(); if (!currentText) { console.warn(`[输入翻译 v${SCRIPT_VERSION}] 输入框为空，无法重试处理。`); hideStatusDisplay(); return; } if (sendButton.disabled) { updateStatusDisplay("重试失败: 发送按钮不可用", 'error', 4000, true, true); return; } console.log(`[输入翻译 v${SCRIPT_VERSION}] 正在使用 [${currentTranslationMode === MODE_ABBREVIATED ? '缩写' : '标准'}] 模式对当前文本重试处理: "${currentText}"`); translateAndSend(currentText, inputElement, sendButton, true);
    }
    function updateAutoSendButtonVisual() {
        if (!autoSendToggleElement) return; autoSendToggleElement.textContent = autoSendEnabled ? "自动:开" : "自动:关"; autoSendToggleElement.className = autoSendEnabled ? 'autosend-on' : '';
    }
    function toggleAutoSend() {
        autoSendEnabled = !autoSendEnabled; const statusText = autoSendEnabled ? '开启' : '关闭'; console.log(`[输入翻译 v${SCRIPT_VERSION}] 自动发送切换为: ${statusText}`); updateAutoSendButtonVisual(); updateStatusDisplay(`自动发送已${statusText}`, 'status', 2000); try { localStorage.setItem(STORAGE_KEY_AUTOSEND, autoSendEnabled.toString()); console.log(`[输入翻译 v${SCRIPT_VERSION}] 已将自动发送偏好 (${statusText}) 保存到 localStorage。`); } catch (e) { console.error(`[输入翻译 v${SCRIPT_VERSION}] 保存自动发送偏好到 localStorage 时出错:`, e); updateStatusDisplay("无法保存自动发送设置", 'error', 3000); }
    }
    function updateModeButtonVisuals() {
        const abbrButton = document.getElementById(MODE_BUTTON_ABBR_ID); const stdButton = document.getElementById(MODE_BUTTON_STD_ID); if (!abbrButton || !stdButton) return; if (currentTranslationMode === MODE_ABBREVIATED) { abbrButton.classList.add('active'); stdButton.classList.remove('active'); } else { abbrButton.classList.remove('active'); stdButton.classList.add('active'); }
    }
    function switchMode(newMode) {
        if (newMode === currentTranslationMode) return; const oldModeText = currentTranslationMode === MODE_ABBREVIATED ? '缩写' : '标准'; currentTranslationMode = newMode; const newModeText = currentTranslationMode === MODE_ABBREVIATED ? '缩写' : '标准'; console.log(`[输入翻译 v${SCRIPT_VERSION}] 翻译模式切换为: ${newModeText}`); updateModeButtonVisuals(); updateStatusDisplay(`模式切换为: ${newModeText}`, 'status', 2000); try { localStorage.setItem(STORAGE_KEY_MODE, currentTranslationMode); console.log(`[输入翻译 v${SCRIPT_VERSION}] 已将翻译模式偏好 (${newModeText}) 保存到 localStorage。`); } catch (e) { console.error(`[输入翻译 v${SCRIPT_VERSION}] 保存翻译模式偏好到 localStorage 时出错:`, e); updateStatusDisplay("无法保存模式设置", 'error', 3000); }
    }

    // --- << MODIFIED v3.1.1 >> 主要翻译逻辑 (修复自动发送) ---
    function translateAndSend(textToProcess, inputElement, sendButton, forceApi = false) {
        if (isTranslatingAndSending) { console.warn(`[输入翻译 v${SCRIPT_VERSION}] 已在处理中，忽略新的处理请求。`); return; }
        if (!inputElement || !sendButton) { updateStatusDisplay("错误: 无法找到输入框或发送按钮", 'error', 4000, true, true); return; }

        isTranslatingAndSending = true;
        const detectedLang = detectLanguage(textToProcess);
        if (detectedLang === 'Chinese' || detectedLang === 'Burmese') { lastOriginalText = textToProcess; }
        hideStatusDisplay();

        const currentModeText = currentTranslationMode === MODE_ABBREVIATED ? '缩写' : '标准';

        // --- 缓存检查 ---
        const useCache = !forceApi && (detectedLang === 'Chinese' || detectedLang === 'Burmese');
        if (useCache && translationCache.has(textToProcess)) {
            const cachedRawTranslation = translationCache.get(textToProcess);
            console.log(`[输入翻译 v${SCRIPT_VERSION}][缓存命中] 找到原文 "${textToProcess.substring(0,30)}..." 的缓存结果: "${cachedRawTranslation}"`);
            updateStatusDisplay(`[${currentModeText}] 已从缓存加载 ✓`, 'info', 3000, false, !autoSendEnabled);

            let finalText = cachedRawTranslation;
            if (currentTranslationMode === MODE_ABBREVIATED) {
                console.log(`[输入翻译 v${SCRIPT_VERSION}][缓存后处理] 应用缩写模式处理...`);
                finalText = applyLetterAbbreviations(fixNumberAbbreviations(cachedRawTranslation));
            } else {
                 console.log(`[输入翻译 v${SCRIPT_VERSION}][缓存后处理] 标准模式，直接使用缓存结果。`);
                 finalText = cachedRawTranslation.trim();
            }

            inputElement.textContent = finalText;
            setCursorToEnd(inputElement);
            inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

            if (autoSendEnabled) {
                const sendDelay = 50;
                console.log(`[输入翻译 v${SCRIPT_VERSION}][缓存][自动发送] 自动发送已开启。将在 ${sendDelay}ms 后模拟点击发送。`);
                setTimeout(() => {
                    // 首先检查处理状态是否已被打断 (例如用户开始输入)
                    if (!isTranslatingAndSending) {
                        console.log(`[输入翻译 v${SCRIPT_VERSION}][缓存][发送超时] 发送已中止 (可能被新操作打断)。`);
                        // 不需要再设置 isTranslatingAndSending = false; 因为它已经是 false 了
                        return;
                    }
                    // 检查发送按钮是否可用
                    if (sendButton && sendButton.isConnected && !sendButton.disabled) {
                         console.log(`[输入翻译 v${SCRIPT_VERSION}][缓存][自动发送] 重置状态并尝试发送...`);
                         // <<<<<<<< FIX v3.1.1 >>>>>>>>
                         isTranslatingAndSending = false; // 在模拟点击 *之前* 重置状态
                         // <<<<<<<<<<<<<<<<<<<<<<<<<<<<
                         sendButton.click(); // 模拟点击
                         hideStatusDisplay(); // 发送后隐藏状态栏
                    } else {
                         // 发送按钮不可用
                         console.error(`[输入翻译 v${SCRIPT_VERSION}][缓存][自动发送] 发送失败，按钮不可用或已消失。`);
                         updateStatusDisplay("发送失败 (按钮不可用?)", 'error', 4000, true, true);
                         isTranslatingAndSending = false; // 确保在失败时也重置状态
                    }
                }, sendDelay);
            } else {
                console.log(`[输入翻译 v${SCRIPT_VERSION}][缓存] 自动发送已关闭。`);
                updateStatusDisplay(`[${currentModeText}] 处理完成 ✓ (请手动发送)`, 'success', 5000, true, true);
                isTranslatingAndSending = false; // 非自动发送，处理完成后直接重置状态
            }
            return; // 缓存命中，结束函数
        }
        // --- 缓存检查结束 ---

        // --- API 调用 ---
        const promptToUse = currentTranslationMode === MODE_ABBREVIATED ? ABBREVIATED_US_ENGLISH_PROMPT : STANDARD_US_ENGLISH_PROMPT;
        const finalPrompt = promptToUse.replace('{text_to_translate}', textToProcess);
        console.log(`[输入翻译 v${SCRIPT_VERSION}] ${forceApi ? '强制 API 调用' : '缓存未命中'}。使用 [${currentModeText}] 模式调用 API (${INPUT_TRANSLATE_MODEL}) 处理: "${textToProcess.substring(0, 30)}..."`);
        updateStatusDisplay(`[${currentModeText}] 翻译处理中...`, 'status');

        const requestBody = { model: INPUT_TRANSLATE_MODEL, messages: [{"role": "user", "content": finalPrompt }], temperature: 0.6 };
        if (currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') { currentInputApiXhr.abort(); console.log(`[输入翻译 v${SCRIPT_VERSION}] 中止了之前的 API 请求。`);}

        currentInputApiXhr = GM_xmlhttpRequest({
            method: "POST", url: OHMYGPT_API_ENDPOINT,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OHMYGPT_API_KEY}` },
            data: JSON.stringify(requestBody),
            onload: function(response) {
                currentInputApiXhr = null;
                try {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const rawTranslation = data.choices?.[0]?.message?.content?.trim();
                        if (rawTranslation) {
                            console.log(`[输入翻译 v${SCRIPT_VERSION}][API 成功] 收到原始结果: "${rawTranslation}"`);

                            if (!forceApi && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
                                if (translationCache.size >= MAX_CACHE_SIZE) { const oldestKey = translationCache.keys().next().value; translationCache.delete(oldestKey); }
                                translationCache.set(textToProcess, rawTranslation);
                                console.log(`[输入翻译 v${SCRIPT_VERSION}] 已缓存 API 原始结果: "${textToProcess.substring(0,30)}..." -> "${rawTranslation}"`);
                            }

                            let finalApiText = rawTranslation;
                            if (currentTranslationMode === MODE_ABBREVIATED) {
                                console.log(`[输入翻译 v${SCRIPT_VERSION}][API 后处理] 应用缩写模式处理...`);
                                finalApiText = applyLetterAbbreviations(fixNumberAbbreviations(rawTranslation));
                            } else {
                                console.log(`[输入翻译 v${SCRIPT_VERSION}][API 后处理] 标准模式，仅修整结果。`);
                                finalApiText = rawTranslation.trim();
                            }
                            console.log(`[输入翻译 v${SCRIPT_VERSION}][API 处理后] 最终文本: "${finalApiText}"`);

                            inputElement.textContent = finalApiText;
                            setCursorToEnd(inputElement);
                            inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

                            if (autoSendEnabled) {
                                const sendDelay = 150; // API 延迟稍长
                                console.log(`[输入翻译 v${SCRIPT_VERSION}][API][自动发送] 自动发送已开启。将在 ${sendDelay}ms 后模拟点击发送。`);
                                setTimeout(() => {
                                    // 检查处理状态是否已被打断
                                    if (!isTranslatingAndSending) {
                                        console.log(`[输入翻译 v${SCRIPT_VERSION}][API][发送超时] 发送已中止。`);
                                        return;
                                    }
                                     // 检查发送按钮是否可用
                                    if (sendButton && sendButton.isConnected && !sendButton.disabled) {
                                        console.log(`[输入翻译 v${SCRIPT_VERSION}][API][自动发送] 重置状态并尝试发送...`);
                                        // <<<<<<<< FIX v3.1.1 >>>>>>>>
                                        isTranslatingAndSending = false; // 在模拟点击 *之前* 重置状态
                                        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                        sendButton.click(); // 模拟点击
                                        hideStatusDisplay(); // 发送后隐藏状态栏
                                    } else {
                                        console.error(`[输入翻译 v${SCRIPT_VERSION}][API][自动发送] 发送失败，按钮不可用或已消失。`);
                                        updateStatusDisplay("发送失败 (按钮不可用?)", 'error', 4000, true, true);
                                        isTranslatingAndSending = false; // 确保在失败时也重置状态
                                    }
                                }, sendDelay);
                            } else {
                                console.log(`[输入翻译 v${SCRIPT_VERSION}][API] 自动发送已关闭。`);
                                updateStatusDisplay(`[${currentModeText}] 处理完成 ✓ (请手动发送)`, 'success', 5000, true, true);
                                isTranslatingAndSending = false; // 非自动发送，处理完成后直接重置状态
                            }
                        } else { throw new Error(`API 返回空内容 (结束原因: ${data.choices?.[0]?.finish_reason || '未知'})`); }
                    } else { let errorDetail = `HTTP ${response.status}: ${response.statusText}`; try { const errData = JSON.parse(response.responseText); errorDetail = errData.error?.message || errorDetail; } catch (e) { /* 忽略解析错误 */ } throw new Error(errorDetail); }
                } catch (e) { console.error(`[输入翻译 v${SCRIPT_VERSION}][API 错误] 处理 API 响应时出错:`, e); updateStatusDisplay(`处理失败: ${e.message.substring(0, 60)}`, 'error', 5000, true, true); isTranslatingAndSending = false; } // 出错时重置状态
            },
            onerror: function(response) { currentInputApiXhr = null; console.error(`[输入翻译 v${SCRIPT_VERSION}][网络错误] 请求失败:`, response); updateStatusDisplay(`处理失败: 网络错误 (${response.status || 'N/A'})`, 'error', 5000, true, true); isTranslatingAndSending = false; }, // 出错时重置状态
            ontimeout: function() { currentInputApiXhr = null; console.error(`[输入翻译 v${SCRIPT_VERSION}][超时错误] API 请求超时。`); updateStatusDisplay("处理失败: 请求超时", 'error', 5000, true, true); isTranslatingAndSending = false; }, // 出错时重置状态
            onabort: function() { currentInputApiXhr = null; console.log(`[输入翻译 v${SCRIPT_VERSION}] API 请求已中止。`); hideStatusDisplay(); isTranslatingAndSending = false; }, // 中止时重置状态
            timeout: 30000
        });
    }

    // --- << MODIFIED v3.1.2 >> 事件监听器 (修复手动发送逻辑) ---
    function handleInputKeyDown(event) {
        const inputElement = event.target;
        if (!inputElement || !inputElement.matches(INPUT_SELECTOR)) return;

        // 回车键逻辑
        if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.ctrlKey) {
             // 检查是否允许手动发送 (仅当自动发送关闭且上次操作成功完成时)
             if (statusBarElement && statusBarElement.classList.contains('visible') && !isTranslatingAndSending && !autoSendEnabled) {
                  const nonBlockingStatus = statusBarElement.querySelector('span.success, span.info');
                  if (nonBlockingStatus) {
                      // <<<< FIX v3.1.2 >>>>
                      // 获取当前输入框的文本并检测语言
                      const currentText = inputElement.textContent?.trim() || "";
                      const currentLang = detectLanguage(currentText);

                      // 只有当当前文本 *不需要* 翻译时，才允许默认的回车发送行为
                      if (currentLang !== 'Chinese' && currentLang !== 'Burmese') {
                          console.log(`[输入翻译 v${SCRIPT_VERSION}][回车] 检测到非阻塞状态 (${nonBlockingStatus.textContent}) 且当前文本无需翻译 ("${currentText.substring(0,30)}...")，允许手动发送。`);
                          hideStatusDisplay(); // 清除旧状态
                          return; // 允许浏览器默认的回车行为
                      } else {
                          // 当前文本需要翻译，即使状态栏显示上次成功，也要阻止默认行为并继续处理
                          console.log(`[输入翻译 v${SCRIPT_VERSION}][回车] 检测到非阻塞状态，但当前文本 ("${currentText.substring(0,30)}...") 需要翻译，将继续处理。`);
                          hideStatusDisplay(); // 清除旧状态，准备显示新状态
                          // **不执行 return**，让代码继续向下执行语言检测和翻译逻辑
                      }
                      // <<<< END FIX v3.1.2 >>>>
                  }
             }

             // 如果正在翻译或处理中，阻止回车
             if (isTranslatingAndSending) {
                 console.log(`[输入翻译 v${SCRIPT_VERSION}][回车] 正在处理中，阻止发送。`);
                 event.preventDefault(); event.stopPropagation();
                 return;
             }

             // 检查当前文本是否需要翻译 (现在这个检查总会执行，除非上面允许了手动发送非待翻译文本)
             const text = inputElement.textContent?.trim() || ""; // 重新获取一次以防万一
             const detectedLang = detectLanguage(text);
             if (text && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
                 const currentModeText = currentTranslationMode === MODE_ABBREVIATED ? '缩写' : '标准';
                 console.log(`[输入翻译 v${SCRIPT_VERSION}][回车] 检测到 ${detectedLang} 文本。将使用 [${currentModeText}] 模式处理...`);
                 event.preventDefault(); event.stopPropagation(); // 阻止默认发送，进行翻译
                 const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
                 if (!sendButton) { updateStatusDisplay("错误: 未找到发送按钮!", 'error', 5000, true, true); return; }
                 if (sendButton.disabled) { updateStatusDisplay("错误: 发送按钮不可用!", 'error', 5000, true, true); return; }
                 translateAndSend(text, inputElement, sendButton); // 调用翻译处理函数
             } else {
                 // 如果是其他语言或空文本，并且没有被上面的手动发送逻辑处理掉，允许正常发送
                 // (理论上，如果上面没有return，这里检测到非中/缅文，也会走到这里)
                 console.log(`[输入翻译 v${SCRIPT_VERSION}][回车] 无需翻译的文本 ("${text.substring(0,30)}...") 或空内容，允许正常发送。`);
                 hideStatusDisplay(); // 清除可能存在的旧状态
             }
        }
        // 其他按键逻辑 (打断处理 - 保持不变)
        else if (isTranslatingAndSending && !['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab'].includes(event.key)) {
             console.log(`[输入翻译 v${SCRIPT_VERSION}][输入打断] 检测到输入，中止当前处理... (按键: ${event.key})`);
             hideStatusDisplay();
             if (currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') { currentInputApiXhr.abort(); }
             else { isTranslatingAndSending = false; console.log(`[输入翻译 v${SCRIPT_VERSION}][输入打断] 已设置 isTranslatingAndSending 为 false。`); }
        } else if (!isTranslatingAndSending) {
             // 输入时隐藏非持久性状态 (保持不变)
             if (statusBarElement && statusBarElement.classList.contains('visible')) {
                 const statusSpan = statusBarElement.querySelector('span.status');
                 const errorSpan = statusBarElement.querySelector('span.error');
                 const successSpan = statusBarElement.querySelector('span.success');
                 const infoSpan = statusBarElement.querySelector('span.info');
                 if (statusSpan && !errorSpan && !successSpan && !infoSpan) { hideStatusDisplay(); }
             }
        }
    }

    function handleSendButtonClick(event) {
         const sendButton = event.target.closest(SEND_BUTTON_SELECTOR);
         if (!sendButton) return;

         // 检查是否允许手动发送 (仅当自动发送关闭且上次操作成功完成时)
         if (statusBarElement && statusBarElement.classList.contains('visible') && !isTranslatingAndSending && !autoSendEnabled) {
              const nonBlockingStatus = statusBarElement.querySelector('span.success, span.info');
              if (nonBlockingStatus) {
                  // <<<< FIX v3.1.2 >>>>
                  // 获取当前输入框的文本并检测语言
                  const inputElement = document.querySelector(INPUT_SELECTOR);
                  if (!inputElement) return; // 安全检查
                  const currentText = inputElement.textContent?.trim() || "";
                  const currentLang = detectLanguage(currentText);

                  // 只有当当前文本 *不需要* 翻译时，才允许默认的点击发送行为
                  if (currentLang !== 'Chinese' && currentLang !== 'Burmese') {
                      console.log(`[输入翻译 v${SCRIPT_VERSION}][发送点击] 检测到非阻塞状态 (${nonBlockingStatus.textContent}) 且当前文本无需翻译 ("${currentText.substring(0,30)}...")，允许手动发送。`);
                      hideStatusDisplay();
                      return; // 允许浏览器默认的点击行为
                  } else {
                      // 当前文本需要翻译，即使状态栏显示上次成功，也要阻止默认行为并继续处理
                       console.log(`[输入翻译 v${SCRIPT_VERSION}][发送点击] 检测到非阻塞状态，但当前文本 ("${currentText.substring(0,30)}...") 需要翻译，将继续处理。`);
                       hideStatusDisplay(); // 清除旧状态
                       // **不执行 return**，让代码继续向下执行
                  }
                  // <<<< END FIX v3.1.2 >>>>
              }
         }

         // 如果正在处理中，阻止发送
         if (isTranslatingAndSending) {
             console.log(`[输入翻译 v${SCRIPT_VERSION}][发送点击] 正在处理中，阻止发送。`);
             event.preventDefault(); event.stopPropagation();
             return;
         }

         // 检查当前文本是否需要翻译
         const inputElement = document.querySelector(INPUT_SELECTOR); // 可能需要重新获取
         if (!inputElement) return;
         const text = inputElement.textContent?.trim() || "";
         const detectedLang = detectLanguage(text);

         // 只有当检测到需要翻译的语言时，才拦截点击并进行翻译
         if (text && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
             const currentModeText = currentTranslationMode === MODE_ABBREVIATED ? '缩写' : '标准';
             console.log(`[输入翻译 v${SCRIPT_VERSION}][发送点击] 检测到 ${detectedLang} 文本。将使用 [${currentModeText}] 模式处理...`);
             event.preventDefault(); event.stopPropagation(); // 阻止默认发送
             if (sendButton.disabled) { updateStatusDisplay("错误: 发送按钮不可用!", 'error', 5000, true, true); return; }
             translateAndSend(text, inputElement, sendButton); // 调用翻译处理函数
         } else {
             // 如果是其他语言或空文本，允许正常发送
             console.log(`[输入翻译 v${SCRIPT_VERSION}][发送点击] 无需翻译的文本 ("${text.substring(0,30)}...") 或空内容，允许正常发送。`);
             if (!isTranslatingAndSending) { // 确保在非处理状态下清除状态栏
                 hideStatusDisplay();
             }
             // 此处不调用 preventDefault，允许事件继续执行默认的发送操作
         }
    }

    // --- 初始化与附加监听器 (保持不变) ---
    function initialize() {
        console.log(`[输入翻译 v${SCRIPT_VERSION}] 初始化脚本...`); const observer = new MutationObserver(mutations => { let controlsNeedCheck = false; let sendButtonMaybeAppeared = false; mutations.forEach(mutation => { if (mutation.addedNodes) { mutation.addedNodes.forEach(node => { if (node.nodeType !== 1) return; const containerNode = node.matches(INPUT_AREA_CONTAINER_SELECTOR) ? node : node.querySelector(INPUT_AREA_CONTAINER_SELECTOR); if(containerNode) controlsNeedCheck = true; const inputElementNode = node.matches(INPUT_SELECTOR) ? node : node.querySelector(INPUT_SELECTOR); if (inputElementNode && !inputElementNode.dataset.customInputTranslateListener) { attachInputListeners(inputElementNode); controlsNeedCheck = true; } const sendButtonNode = node.matches(SEND_BUTTON_SELECTOR) ? node : node.querySelector(SEND_BUTTON_SELECTOR); if(sendButtonNode) sendButtonMaybeAppeared = true; }); } if (mutation.target && mutation.target.matches && mutation.target.matches(INPUT_AREA_CONTAINER_SELECTOR)) { controlsNeedCheck = true; } }); if (controlsNeedCheck) { setTimeout(ensureControlsExist, 50); } if (sendButtonMaybeAppeared || !sendButtonClickListenerAttached) { const sendButton = document.querySelector(SEND_BUTTON_SELECTOR); if (sendButton && !sendButton.dataset.customSendClickListener) { attachSendButtonListener(sendButton); } } }); observer.observe(document.body, { childList: true, subtree: true }); setTimeout(() => { const initialContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR); if (initialContainer) { ensureControlsExist(); } const initialInputElement = document.querySelector(INPUT_SELECTOR); if (initialInputElement && !initialInputElement.dataset.customInputTranslateListener) { attachInputListeners(initialInputElement); } const initialSendButton = document.querySelector(SEND_BUTTON_SELECTOR); if(initialSendButton && !initialSendButton.dataset.customSendClickListener) { attachSendButtonListener(initialSendButton); } console.log(`[输入翻译 v${SCRIPT_VERSION}] 初始检查完成，观察者已激活。`); }, 1800);
    }
    function attachInputListeners(inputElement) {
         if (inputElement.dataset.customInputTranslateListener) return; console.log(`[输入翻译 v${SCRIPT_VERSION}] 正在附加 Keydown 监听器到输入框:`, inputElement); inputElement.addEventListener('keydown', handleInputKeyDown, true); inputElement.dataset.customInputTranslateListener = 'true'; ensureControlsExist();
    }
    function attachSendButtonListener(sendButton) {
        if (sendButton.dataset.customSendClickListener) return; console.log(`[输入翻译 v${SCRIPT_VERSION}] 正在附加 Click 监听器到发送按钮:`, sendButton); sendButton.addEventListener('click', handleSendButtonClick, true); sendButton.dataset.customSendClickListener = 'true'; sendButtonClickListenerAttached = true; const buttonObserver = new MutationObserver(() => { if (!sendButton.isConnected) { console.log(`[输入翻译 v${SCRIPT_VERSION}] 发送按钮已从 DOM 移除。重置监听器标志。`); buttonObserver.disconnect(); if (sendButton.dataset.customSendClickListener) { delete sendButton.dataset.customSendClickListener; } sendButtonClickListenerAttached = false; } }); if (sendButton.parentNode) { buttonObserver.observe(sendButton.parentNode, { childList: true, subtree: false }); } else { console.warn(`[输入翻译 v${SCRIPT_VERSION}] 未找到发送按钮的父节点用于观察器。`); }
    }

    // --- 启动初始化 (保持不变) ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();