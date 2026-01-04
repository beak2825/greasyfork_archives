// ==UserScript==
// @name         WhatsApp 输入框翻译并发送 (v3.1.9-WA - Detailed Chinese Logging)
// @namespace    http://tampermonkey.net/
// @version      3.1.9
// @description  [WhatsApp Adapt Fix] v3.1.8 基础上，将所有控制台日志(console.log/warn/error)改为中文并提供更详细的执行信息，特别是文本替换细节。
// @author       Your Name / AI Assistant (Adapted for WhatsApp)
// @match        https://web.whatsapp.com/
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.ohmygpt.com
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/48px-WhatsApp.svg.png
// @downloadURL https://update.greasyfork.org/scripts/534443/WhatsApp%20%E8%BE%93%E5%85%A5%E6%A1%86%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%28v319-WA%20-%20Detailed%20Chinese%20Logging%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534443/WhatsApp%20%E8%BE%93%E5%85%A5%E6%A1%86%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%28v319-WA%20-%20Detailed%20Chinese%20Logging%29.meta.js
// ==/UserScript==

(function() {
'use strict';

// --- 配置 ---
const SCRIPT_VERSION = '3.1.9-WA'; // 脚本版本日志
const OHMYGPT_API_KEY = "sk-RK1MU6Cg6a48fBecBBADT3BlbKFJ4C209a954d3b4428b54b"; // 请替换为你自己的API Key
const OHMYGPT_API_ENDPOINT = "https://api.ohmygpt.com/v1/chat/completions";
const INPUT_TRANSLATE_MODEL = "gpt-4o-mini";
const MAX_CACHE_SIZE = 100;
const STORAGE_KEY_AUTOSEND = 'whatsAppTranslateAutoSendPref_v312';

// --- 翻译提示 (Unchanged) ---
const TRANSLATION_PROMPT = `


Role: Translator to US English.
Task: Translate/Abbreviate the input following strict rules. Prioritize translating any Chinese/Burmese text, even if short or mixed with numbers/English (e.g., "输入 123" -> "Input 123"). Also abbreviate existing English.
Strict Rules:

Style: Sophisticated US English.

Abbreviations (ONLY these letters): u, ur, r, thx, &, bfr, frst, tmrw, nxt.

Capitalization: Correct sentence start (e.g., "U r here").

NO Number Abbreviations: Use "to", "for". Absolutely no "2", "4". Double-check.

Punctuation: NO period (.) at the end. Keep original question marks (?).

Output: ONLY the final processed text. No explanations or extra words.

Untranslatable Input: If input is entirely code, numbers, etc., return original unmodified.

Input Text:
{text_to_translate}
`;

// --- 选择器 (Unchanged) ---
const INPUT_SELECTOR = 'footer div[contenteditable="true"][role="textbox"][data-lexical-editor="true"]';
const SEND_BUTTON_SELECTOR = 'button[data-testid="send"], button[aria-label="发送"], button[aria-label="Send"]';
const FOOTER_SELECTOR = 'footer._ak1i';
const UI_PARENT_SELECTOR = `${FOOTER_SELECTOR} div.copyable-area`;
const INPUT_AREA_SELECTOR = `${UI_PARENT_SELECTOR} > div.xh8yej3`;

// --- UI 元素 ID (Unchanged) ---
const CONTROLS_WRAPPER_ID = 'custom-controls-wrapper';
const STATUS_BAR_ID = 'custom-input-status-bar';
const AUTO_SEND_TOGGLE_ID = 'custom-auto-send-toggle';
const RETRY_BUTTON_ID = 'custom-translate-retry-button';
const RETRY_ABBREVIATION_BUTTON_ID = 'custom-abbreviation-retry-button';

// --- 语言检测正则 (Unchanged) ---
const CHINESE_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;
const BURMESE_REGEX = /[\u1000-\u109F]/;

// --- 状态变量 (Unchanged) ---
let controlsWrapperElement = null;
let statusBarElement = null;
let autoSendToggleElement = null;
let currentInputApiXhr = null;
let isTranslatingAndSending = false;
let sendButtonClickListenerAttached = false;
let lastOriginalText = null;
const translationCache = new Map();

// --- 自动发送状态变量 (Unchanged, Log Modified) ---
let autoSendEnabled = true;
const savedAutoSendState = localStorage.getItem(STORAGE_KEY_AUTOSEND);
if (savedAutoSendState !== null) {
    autoSendEnabled = savedAutoSendState === 'true';
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [配置] 已加载自动发送偏好设置: ${autoSendEnabled}`);
} else {
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [配置] 未找到已保存的自动发送偏好设置，使用默认值: ${autoSendEnabled}`);
}

// --- CSS (Unchanged from v3.1.6) ---
GM_addStyle(`
    ${UI_PARENT_SELECTOR} { display: flex !important; flex-direction: column !important; }
    #${CONTROLS_WRAPPER_ID} { order: 0 !important; display: flex; flex-direction: column; width: 100%; padding: 0 8px; box-sizing: border-box; margin-top: 0; margin-bottom: 4px; position: relative; z-index: 148; }
    ${INPUT_AREA_SELECTOR} { order: 1 !important; }
    #${STATUS_BAR_ID} { width: 100%; padding: 4px 8px; font-size: 12px; color: #ccc; background-color: rgba(20, 20, 20, 0.85); backdrop-filter: blur(2px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; line-height: 1.3; text-align: left; transition: opacity 0.2s ease-in-out, max-height 0.2s ease-in-out; opacity: 0; max-height: 0; overflow: hidden; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; }
    #${STATUS_BAR_ID}.visible { opacity: 1; max-height: 50px; margin-top: 2px; }
    #${STATUS_BAR_ID} .status-text { flex-grow: 1; margin-right: 8px; }
    #${STATUS_BAR_ID} .status-buttons { display: flex; gap: 5px; flex-shrink: 0; }
    #${STATUS_BAR_ID} .status { font-style: italic; color: #a0a0a0; }
    #${STATUS_BAR_ID} .info { font-style: italic; color: #87cefa; }
    #${STATUS_BAR_ID} .error { font-weight: bold; color: #ff8a8a; }
    #${STATUS_BAR_ID} .success { font-weight: bold; color: #8ade8a; }
    #${RETRY_BUTTON_ID}, #${RETRY_ABBREVIATION_BUTTON_ID} { padding: 2px 6px; font-size: 11px; font-weight: bold; color: #d0d0d0; background-color: rgba(80, 80, 80, 0.9); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 3px; cursor: pointer; flex-shrink: 0; transition: background-color 0.2s ease, color 0.2s ease; white-space: nowrap; }
    #${RETRY_BUTTON_ID}:hover, #${RETRY_ABBREVIATION_BUTTON_ID}:hover { background-color: rgba(100, 100, 100, 0.9); color: #fff; }
    #${RETRY_BUTTON_ID}:active, #${RETRY_ABBREVIATION_BUTTON_ID}:active { background-color: rgba(60, 60, 60, 0.9); }
    #${AUTO_SEND_TOGGLE_ID} { align-self: flex-end; padding: 3px 8px; font-size: 11px; font-weight: bold; background-color: rgba(80, 80, 80, 0.9); color: #ccc; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 5px; cursor: pointer; user-select: none; transition: background-color 0.2s ease, color 0.2s ease; opacity: 1; max-height: 30px; }
    #${AUTO_SEND_TOGGLE_ID}.autosend-on { background-color: rgba(70, 130, 180, 0.95); color: #fff; }
    #${AUTO_SEND_TOGGLE_ID}:hover { filter: brightness(1.1); }
`);

// --- 辅助函数 ---
function detectLanguage(text) { /* ... (代码不变) ... */ if (!text) return null; if (CHINESE_REGEX.test(text)) return 'Chinese'; if (BURMESE_REGEX.test(text)) return 'Burmese'; return 'Other'; }
function setCursorToEnd(element) { /* ... (代码不变 v3.1.7) ... */ try { const sel = window.getSelection(); if (!sel) return; const focusElement = element; let targetNode = element; const textSpan = element.querySelector('p span[data-lexical-text="true"]'); if (textSpan) { if (textSpan.lastChild && textSpan.lastChild.nodeType === Node.TEXT_NODE) { targetNode = textSpan.lastChild; } else { targetNode = textSpan; } } else { if (element.lastChild && element.lastChild.nodeType === Node.TEXT_NODE) { targetNode = element.lastChild; } else { targetNode = element; } } const range = document.createRange(); if (targetNode.nodeType === Node.TEXT_NODE) { range.setStart(targetNode, targetNode.length); range.collapse(true); } else { range.selectNodeContents(targetNode); range.collapse(false); } sel.removeAllRanges(); sel.addRange(range); focusElement.focus(); } catch (e) { console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [错误] 设置光标时出错:`, e); try { element.focus(); } catch (fe) {} } }

// --- <<< MODIFIED ensureControlsExist (Log Han Hua) >>> ---
function ensureControlsExist() {
    const footerElement = document.querySelector(FOOTER_SELECTOR);
    if (!footerElement) { /* console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI检查] 未找到 Footer 元素 ('${FOOTER_SELECTOR}')。`); */ return false; }
    const inputElement = footerElement.querySelector(INPUT_SELECTOR);
    if (!inputElement) { /* console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI检查] 在 Footer 内未找到 Input 元素 ('${INPUT_SELECTOR}')。`); */ return false; }
    const targetContainer = footerElement.querySelector('div.copyable-area');
    if (!targetContainer) {
         console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI检查] [错误] 在 Footer 内未找到目标容器 ('div.copyable-area')。`);
         return false;
    }
    // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI检查] 找到目标容器:`, targetContainer);

    controlsWrapperElement = document.getElementById(CONTROLS_WRAPPER_ID);
    if (!controlsWrapperElement) {
        controlsWrapperElement = document.createElement('div');
        controlsWrapperElement.id = CONTROLS_WRAPPER_ID;
        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] 准备将 UI Wrapper 附加到:`, targetContainer);
        targetContainer.appendChild(controlsWrapperElement);
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] UI Wrapper 已创建并附加到目标容器。`);
    } else if (controlsWrapperElement.parentNode !== targetContainer) {
         // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] 准备将 UI Wrapper 移动 (通过附加) 到:`, targetContainer);
        targetContainer.appendChild(controlsWrapperElement);
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] UI Wrapper 已移动到目标容器。`);
    } else {
         if (controlsWrapperElement !== targetContainer.lastChild) {
             // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] 确保 UI Wrapper 是目标容器的最后一个子元素。`);
             targetContainer.appendChild(controlsWrapperElement);
         }
    }

    autoSendToggleElement = document.getElementById(AUTO_SEND_TOGGLE_ID);
    if (!autoSendToggleElement) {
        autoSendToggleElement = document.createElement('button');
        autoSendToggleElement.id = AUTO_SEND_TOGGLE_ID;
        autoSendToggleElement.addEventListener('click', toggleAutoSend);
        controlsWrapperElement.appendChild(autoSendToggleElement);
        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] 自动发送切换按钮已创建。`);
    } else if (!controlsWrapperElement.contains(autoSendToggleElement)){
        controlsWrapperElement.appendChild(autoSendToggleElement);
        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] 自动发送切换按钮已附加到 Wrapper。`);
    }
    updateAutoSendButtonVisual();

    statusBarElement = document.getElementById(STATUS_BAR_ID);
    if (!statusBarElement) {
        statusBarElement = document.createElement('div');
        statusBarElement.id = STATUS_BAR_ID;
        controlsWrapperElement.appendChild(statusBarElement);
        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] 状态栏元素已创建。`);
    } else if (!controlsWrapperElement.contains(statusBarElement)){
         controlsWrapperElement.appendChild(statusBarElement);
         // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [UI操作] 状态栏元素已附加到 Wrapper。`);
    }

    return true;
}

// --- <<< MODIFIED updateStatusDisplay (Log Han Hua) >>> ---
function updateStatusDisplay(content, type = 'status', duration = 0, showRetryButton = false, showRetryAbbreviationButton = false) {
    if (!ensureControlsExist()) { console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [状态栏] [错误] 更新状态失败: 无法创建或找到 UI 控件。`); return; }
    if (!statusBarElement) { console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [状态栏] [错误] 更新状态失败: 状态栏元素无效。`); return; }

    let buttonsHtml = '';
    if (showRetryButton && lastOriginalText) { buttonsHtml += `<button id="${RETRY_BUTTON_ID}" type="button">重试原文</button>`; }
    if (showRetryAbbreviationButton) { buttonsHtml += `<button id="${RETRY_ABBREVIATION_BUTTON_ID}" type="button">重试缩写</button>`; }

    statusBarElement.innerHTML = `<span class="status-text ${type}">${content}</span>${buttonsHtml ? `<div class="status-buttons">${buttonsHtml}</div>` : ''}`;
    statusBarElement.classList.add('visible');
    // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [状态栏] 显示: [${type}] ${content}`);

    if (showRetryButton && lastOriginalText) { const retryBtn = statusBarElement.querySelector(`#${RETRY_BUTTON_ID}`); if (retryBtn) retryBtn.addEventListener('click', handleRetryOriginalClick); }
    if (showRetryAbbreviationButton) { const retryAbbrBtn = statusBarElement.querySelector(`#${RETRY_ABBREVIATION_BUTTON_ID}`); if (retryAbbrBtn) retryAbbrBtn.addEventListener('click', handleRetryAbbreviationClick); }

    if (statusBarElement.hideTimeout) clearTimeout(statusBarElement.hideTimeout);
    statusBarElement.hideTimeout = duration > 0 ? setTimeout(hideStatusDisplay, duration) : null;
}

// --- <<< MODIFIED hideStatusDisplay (Log Han Hua) >>> ---
function hideStatusDisplay() {
    if (!statusBarElement) statusBarElement = document.getElementById(STATUS_BAR_ID);
    if (!statusBarElement) return;
    if (statusBarElement.hideTimeout) clearTimeout(statusBarElement.hideTimeout);
    statusBarElement.hideTimeout = null;
    if (statusBarElement.classList.contains('visible')) {
        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [状态栏] 隐藏状态栏。`);
        statusBarElement.classList.remove('visible');
    }
}

// --- <<< MODIFIED Helper Functions (Log Han Hua & Detail) >>> ---
function fixNumberAbbreviations(text) {
    if (!text) return text;
    let originalText = text;
    text = text.replace(/\b2\b/gi,"to")
               .replace(/\b4\b/gi,"for")
               .replace(/\b(be?|b)4\b/gi,"before") // More specific before "4"
               .replace(/\b2day\b/gi,"today")
               .replace(/\b2nite\b/gi,"tonight")
               .replace(/\b2night\b/gi,"tonight")
               .replace(/\b2mrw\b/gi,"tomorrow")
               .replace(/\b2moro\b/gi,"tomorrow")
               .replace(/\bgr8\b/gi,"great")
               .replace(/\bl8r\b/gi,"later")
               .replace(/\bw8\b/gi,"wait")
               .replace(/\bh8\b/gi,"hate")
               .replace(/\bsk8\b/gi,"skate")
               .replace(/\bm8\b/gi,"mate");
    if (text !== originalText) {
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [文本处理] [数字修正] 是: 原文="${originalText}" -> 改为="${text}"`);
    } else {
        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [文本处理] [数字修正] 否: "${originalText}" (无需修正)`);
    }
    return text;
}
function applyLetterAbbreviations(text) {
    if (!text) return text;
    let originalText = text;
    let modifiedText = text;
    let firstWordAbbr = false;
    let otherAbbr = false;

    const abbreviations = {"you":"u","your":"ur","are":"r","thanks":"thx","and":"&","before":"bfr","first":"frst","tomorrow":"tmrw","next":"nxt"};
    const capitalizeList = ["u","ur","r","thx","bfr","frst","tmrw","nxt"]; // Abbreviations that need capitalization if at start

    // Handle first word specially for capitalization
    let firstWordOffset = -1;
    let firstWord = "";
    let prefix = "";
    const firstWordMatch = modifiedText.match(/^(\s*[^a-zA-Z\s]*)?([a-zA-Z]+)/);
    if (firstWordMatch) {
        prefix = firstWordMatch[1] || "";
        firstWord = firstWordMatch[2];
        firstWordOffset = prefix.length;
        const lowerFirstWord = firstWord.toLowerCase();
        if (abbreviations.hasOwnProperty(lowerFirstWord)) {
            const abbr = abbreviations[lowerFirstWord];
            let replacement = abbr;
            if (capitalizeList.includes(abbr)) {
                replacement = abbr.charAt(0).toUpperCase() + abbr.slice(1);
            }
            modifiedText = prefix + replacement + modifiedText.substring(firstWordOffset + firstWord.length);
            firstWordAbbr = true;
        }
    }

    // Handle remaining words (skip the first word if it was already abbreviated)
    const processStartIndex = firstWordAbbr ? (firstWordOffset + abbreviations[firstWord.toLowerCase()].length) : 0;
    let textToProcess = modifiedText.substring(processStartIndex);
    const originalTextToProcess = textToProcess; // Keep original part for comparison

    for (const word in abbreviations) {
        const abbr = abbreviations[word];
        const regexWord = new RegExp(`\\b${word}\\b`, 'gi'); // Case-insensitive word boundary replace
        textToProcess = textToProcess.replace(regexWord, abbr);
    }

    if (textToProcess !== originalTextToProcess) {
        otherAbbr = true;
        modifiedText = modifiedText.substring(0, processStartIndex) + textToProcess;
    }

    // Log results
    if (firstWordAbbr || otherAbbr) {
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [文本处理] [字母缩写] 是: 原文="${originalText}" -> 改为="${modifiedText}"`);
    } else {
        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [文本处理] [字母缩写] 否: "${originalText}" (无需缩写)`);
    }
    return modifiedText;
}

// --- <<< MODIFIED 重试按钮处理程序 (Log Han Hua) >>> ---
function handleRetryOriginalClick(event) {
    event.preventDefault(); event.stopPropagation();
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [按钮点击] “重试原文”按钮被点击。`);
    if (isTranslatingAndSending) { console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [按钮点击] [警告] 正在翻译中，忽略“重试原文”请求。`); return; }
    if (!lastOriginalText) { console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [按钮点击] [警告] 没有可重试的原文文本。`); hideStatusDisplay(); return; }
    const currentInputElement = document.querySelector(INPUT_SELECTOR);
    const currentSendButton = document.querySelector(SEND_BUTTON_SELECTOR);
    if (!currentInputElement || !currentSendButton) { updateStatusDisplay("重试失败：UI 元素丢失", 'error', 4000, true, false); return; }
    if (!currentSendButton.offsetParent) { updateStatusDisplay("重试失败：发送按钮隐藏？", 'error', 4000, true, false); return; }
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [按钮点击] 准备使用原文重试翻译:`, lastOriginalText);
    translateAndSend(lastOriginalText, currentInputElement, currentSendButton, true); // Force API call
}
function handleRetryAbbreviationClick(event) {
    event.preventDefault(); event.stopPropagation();
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [按钮点击] “重试缩写”按钮被点击。`);
    if (isTranslatingAndSending) { console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [按钮点击] [警告] 正在翻译中，忽略“重试缩写”请求。`); return; }
    const currentInputElement = document.querySelector(INPUT_SELECTOR);
    const currentSendButton = document.querySelector(SEND_BUTTON_SELECTOR);
    if (!currentInputElement || !currentSendButton) { updateStatusDisplay("重试失败：UI 元素丢失", 'error', 4000, true, true); return; }
    const text = currentInputElement.textContent?.trim(); // Get current text, might be already translated
    if (!text) { console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [按钮点击] [警告] 输入框为空，无法重试缩写。`); hideStatusDisplay(); return; }
    if (!currentSendButton.offsetParent) { updateStatusDisplay("重试失败：发送按钮隐藏？", 'error', 4000, true, true); return; }
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [按钮点击] 准备使用当前文本重试翻译/缩写:`, text);
    translateAndSend(text, currentInputElement, currentSendButton, true); // Force API call
}

// --- <<< MODIFIED 自动发送切换逻辑 (Log Han Hua) >>> ---
function updateAutoSendButtonVisual() {
     if (!autoSendToggleElement) autoSendToggleElement = document.getElementById(AUTO_SEND_TOGGLE_ID);
     if(!autoSendToggleElement) return;
     autoSendToggleElement.textContent = autoSendEnabled ? "自动发送: 开" : "自动发送: 关";
     autoSendToggleElement.className = autoSendEnabled ? 'autosend-on' : '';
     autoSendToggleElement.id = AUTO_SEND_TOGGLE_ID;
}
function toggleAutoSend() {
    autoSendEnabled = !autoSendEnabled;
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [设置] 自动发送切换为: ${autoSendEnabled ? '开启' : '关闭'}`);
    updateAutoSendButtonVisual();
    updateStatusDisplay(`自动发送已${autoSendEnabled ? '开启' : '关闭'}`, 'status', 2000);
    try {
        localStorage.setItem(STORAGE_KEY_AUTOSEND, autoSendEnabled.toString());
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [设置] 自动发送偏好已保存到 localStorage。`);
    } catch (e) {
        console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [设置] [错误] 保存自动发送偏好到 localStorage 时出错:`, e);
        updateStatusDisplay("保存设置失败", 'error', 3000);
    }
}

// --- <<< MODIFIED translateAndSend (Log Han Hua) >>> ---
function translateAndSend(textToProcess, originalInputElementRef, originalSendButtonRef, forceApi = false) {
    if (isTranslatingAndSending) { console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [警告] 正在进行翻译，忽略新的请求: "${textToProcess.substring(0, 30)}..."`); return; }
    if (!originalInputElementRef || !originalSendButtonRef) { updateStatusDisplay("错误：初始输入/发送按钮丢失", 'error', 4000, true, false); return; }

    isTranslatingAndSending = true; // 设置繁忙状态
    const detectedLang = detectLanguage(textToProcess);
    if (detectedLang === 'Chinese' || detectedLang === 'Burmese') {
        lastOriginalText = textToProcess; // 记录原文以备重试
        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] 检测到 ${detectedLang}，原文已记录。`);
    }
    hideStatusDisplay(); // 清除旧状态
    updateStatusDisplay("正在翻译/缩写...", 'status'); // 显示当前状态

    // --- 缓存检查 ---
    const useCache = !forceApi && (detectedLang === 'Chinese' || detectedLang === 'Burmese');
    if (useCache && translationCache.has(textToProcess)) {
        const cachedTranslationRaw = translationCache.get(textToProcess);
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存命中] 原文: "${textToProcess}", 缓存结果 (待处理): "${cachedTranslationRaw}"`);
        const finalCachedText = applyLetterAbbreviations(cachedTranslationRaw); // 对缓存结果应用缩写
        updateStatusDisplay("已从缓存加载 ✓", 'info', autoSendEnabled ? 3000 : 5000, !autoSendEnabled, !autoSendEnabled);

        const currentInputElement = document.querySelector(INPUT_SELECTOR);
        if (!currentInputElement) {
            console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存] [错误] 输入元素在更新前消失！`);
            updateStatusDisplay("错误：输入元素丢失！", 'error', 4000);
            isTranslatingAndSending = false; return;
        }

        // 更新输入框 (Lexical 兼容)
        const textSpanCache = currentInputElement.querySelector('p span[data-lexical-text="true"]');
        if (textSpanCache) { textSpanCache.textContent = finalCachedText; } else { currentInputElement.textContent = finalCachedText; }
        setCursorToEnd(currentInputElement);
        currentInputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存] 输入框内容已更新 (通过 span/fallback)。`);

        // 自动发送逻辑
        if (autoSendEnabled) {
             const sendDelay = 100;
             console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存] 自动发送已开启。延迟 ${sendDelay}ms 后发送。`);
             setTimeout(() => {
                 if (!isTranslatingAndSending) { console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存] 发送超时回调时，翻译状态已重置，取消发送。`); isTranslatingAndSending = false; return; } // 检查状态是否被中断
                 const currentSendButton = document.querySelector(SEND_BUTTON_SELECTOR);
                 if (currentSendButton && currentSendButton.isConnected && currentSendButton.offsetParent) {
                     console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存] 正在点击发送按钮...`);
                     currentSendButton.click();
                     // 尝试清空输入框
                     setTimeout(() => {
                         const inputAfterSend = document.querySelector(INPUT_SELECTOR);
                         const spanAfterSend = inputAfterSend?.querySelector('p span[data-lexical-text="true"]');
                         if (inputAfterSend && (inputAfterSend.textContent === finalCachedText || spanAfterSend?.textContent === finalCachedText)) {
                             if (spanAfterSend) { spanAfterSend.textContent = ''; } else { inputAfterSend.textContent = ''; }
                             inputAfterSend.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                             // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存] 发送后尝试清空输入框。`);
                         }
                     }, 50);
                 } else {
                     console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存] [错误] 发送失败，发送按钮不可用或已消失。`);
                     updateStatusDisplay("发送失败（按钮不可用？）", 'error', 4000, true, true);
                 }
                 isTranslatingAndSending = false; // 重置繁忙状态
             }, sendDelay);
        } else {
            console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [缓存] 自动发送已关闭。`);
            isTranslatingAndSending = false; // 重置繁忙状态
        }
        return; // 缓存处理完毕，退出函数
    }
    // --- 结束缓存检查 ---

    // --- API 调用 ---
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] ${forceApi ? '[强制API]' : '[缓存未命中]'} 调用 API (${INPUT_TRANSLATE_MODEL}) 处理: "${textToProcess.substring(0, 30)}..."`);
    const finalPrompt = TRANSLATION_PROMPT.replace('{text_to_translate}', textToProcess);
    const requestBody = { model: INPUT_TRANSLATE_MODEL, messages: [{"role": "user", "content": finalPrompt }], temperature: 0.6 };
    if (currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') {
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 检测到正在进行的 API 请求，正在中止旧请求...`);
        currentInputApiXhr.abort();
    }
    currentInputApiXhr = GM_xmlhttpRequest({
        method: "POST", url: OHMYGPT_API_ENDPOINT,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OHMYGPT_API_KEY}` },
        data: JSON.stringify(requestBody),
        onload: function(response) {
            currentInputApiXhr = null; // 清除当前请求引用
            let updateSuccessful = false;
            try {
                console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 收到响应，状态码: ${response.status}`);
                const currentInputElement = document.querySelector(INPUT_SELECTOR);
                if (!currentInputElement) {
                     console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [错误] 输入元素在处理响应时消失！`);
                     updateStatusDisplay("错误：翻译后输入元素丢失！", 'error', 5000, true, false);
                     return; // 退出 try
                }

                if (response.status >= 200 && response.status < 300) {
                    const data = JSON.parse(response.responseText);
                    const rawTranslation = data.choices?.[0]?.message?.content?.trim();
                    if (rawTranslation) {
                        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 成功获取原始翻译结果: "${rawTranslation}"`);
                        const checkedTranslation = fixNumberAbbreviations(rawTranslation); // 先修正数字
                        const finalApiText = applyLetterAbbreviations(checkedTranslation); // 再应用缩写
                        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 处理后最终文本: "${finalApiText}"`);

                        // 缓存处理后的结果 (数字修正后，缩写前)
                        if (!forceApi && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
                             if (translationCache.size >= MAX_CACHE_SIZE) {
                                 const oldestKey = translationCache.keys().next().value;
                                 translationCache.delete(oldestKey);
                                 console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 缓存已满，移除最旧条目: "${oldestKey}"`);
                             }
                             translationCache.set(textToProcess, checkedTranslation); // 缓存修正数字后的文本
                             console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 翻译结果 (数字修正后) 已缓存: "${textToProcess}" -> "${checkedTranslation}"`);
                        }

                        // 更新输入框 (Lexical 兼容)
                        // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 准备更新输入元素 (通过 span/p/fallback):`, currentInputElement);
                        const textSpanApi = currentInputElement.querySelector('p span[data-lexical-text="true"]');
                        if (textSpanApi) {
                            // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 找到文本 span，正在更新其内容。`);
                            textSpanApi.textContent = finalApiText;
                            updateSuccessful = true;
                        } else {
                             const paragraph = currentInputElement.querySelector('p.selectable-text');
                             if(paragraph){
                                 console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [警告] 未找到文本 span，但段落存在。正在重建结构。`);
                                 paragraph.innerHTML = `<span data-lexical-text="true">${finalApiText}</span>`;
                                 updateSuccessful = true;
                             } else {
                                 console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [警告] 未找到文本 span 和段落。回退到设置 textContent。`);
                                 currentInputElement.textContent = finalApiText;
                                 updateSuccessful = true;
                             }
                        }
                        setCursorToEnd(currentInputElement);
                        currentInputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 输入更新事件已分派 (通过 span/p/fallback)。`);

                        // 自动发送逻辑
                        if (autoSendEnabled) {
                             const sendDelay = 200; // API 调用后延迟稍长
                             console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 自动发送已开启。延迟 ${sendDelay}ms 后发送。`);
                             updateStatusDisplay("翻译完成 ✓", 'success', sendDelay + 1000); // 显示成功状态
                             setTimeout(() => {
                                 if (!isTranslatingAndSending) { console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 发送超时回调时，翻译状态已重置，取消发送。`); isTranslatingAndSending = false; return; }
                                 const currentSendButton = document.querySelector(SEND_BUTTON_SELECTOR);
                                 if (currentSendButton && currentSendButton.isConnected && currentSendButton.offsetParent) {
                                     console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 正在点击发送按钮...`);
                                     currentSendButton.click();
                                     // 尝试清空输入框
                                     setTimeout(() => {
                                         const inputAfterSend = document.querySelector(INPUT_SELECTOR);
                                         const spanAfterSend = inputAfterSend?.querySelector('p span[data-lexical-text="true"]');
                                         if (inputAfterSend && (inputAfterSend.textContent === finalApiText || spanAfterSend?.textContent === finalApiText)) {
                                             if(spanAfterSend){ spanAfterSend.textContent = ''; } else { inputAfterSend.textContent = '';}
                                             inputAfterSend.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                                             // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 发送后尝试清空输入框。`);
                                         }
                                     }, 50);
                                 } else {
                                     console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [错误] 发送失败，发送按钮不可用或已消失。`);
                                     updateStatusDisplay("发送失败（按钮不可用？）", 'error', 4000, true, true);
                                 }
                                 isTranslatingAndSending = false; // 重置繁忙状态
                             }, sendDelay);
                        } else {
                            console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 自动发送已关闭。`);
                            updateStatusDisplay("完成 ✓ (请手动发送或重试)", 'success', 5000, true, true);
                        }
                    } else {
                        // API 返回成功但内容为空
                        const reason = data.choices?.[0]?.finish_reason || 'N/A';
                        console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [错误] API 返回成功但 choices 内容为空或无效。结束原因: ${reason}`);
                        throw new Error(`API 错误：无有效翻译内容 (结束原因: ${reason === 'content_filter' ? '内容过滤' : reason})`);
                    }
                } else {
                    // HTTP 状态码错误
                    let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
                    try {
                        const errorData = JSON.parse(response.responseText);
                        errorMsg = errorData.error?.message || errorMsg;
                        console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [错误] API 错误详情:`, errorData);
                    } catch(_) {
                        console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [错误] 非 JSON 错误响应:`, response.responseText);
                    }
                    throw new Error(errorMsg);
                }
            } catch (e) {
                console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [错误] 处理 API 响应或更新输入框时出错:`, e);
                updateStatusDisplay(`处理失败: ${e.message.substring(0, 60)}`, 'error', 5000, true, false);
                 const currentInputElementOnError = document.querySelector(INPUT_SELECTOR); // 检查元素是否存在
                 if (!currentInputElementOnError) { console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [错误处理] 输入元素在错误处理期间也丢失了。`); }
            } finally {
                 // 无论成功失败，如果不是自动发送模式，或更新未成功，都要在这里重置状态
                 if (!autoSendEnabled || !updateSuccessful) {
                    isTranslatingAndSending = false;
                 }
            }
        }, // End onload
        onerror: function(r) { currentInputApiXhr = null; console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [错误] 网络请求失败:`, r); updateStatusDisplay(`失败：网络错误 (${r.status||'N/A'})`, 'error', 5000, true, false); isTranslatingAndSending = false; },
        ontimeout: function() { currentInputApiXhr = null; console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] [错误] 请求超时。`); updateStatusDisplay("失败：请求超时", 'error', 5000, true, false); isTranslatingAndSending = false; },
        onabort: function() { currentInputApiXhr = null; console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [翻译流程] [API] 请求被中止。`); hideStatusDisplay(); isTranslatingAndSending = false; },
        timeout: 30000
    }); // End GM_xmlhttpRequest
}

// --- 事件监听器 (Log Han Hua) ---
function handleInputKeyDown(event) {
    const targetElement = event.target;
    if (!targetElement || !targetElement.matches(INPUT_SELECTOR)) return;

    // --- Enter 键逻辑 ---
    if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.ctrlKey) {
         console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 检测到 Enter 按键。`);
         if (statusBarElement && statusBarElement.classList.contains('visible') && !isTranslatingAndSending && !autoSendEnabled) {
              const nonBlockingStatus = statusBarElement.querySelector('span.success, span.info');
              if (nonBlockingStatus) { console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 检测到非阻塞状态，允许手动发送。`); hideStatusDisplay(); return; }
         }
         if (isTranslatingAndSending) { event.preventDefault(); event.stopPropagation(); console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] [警告] 正在翻译中，已阻止 Enter 发送。`); return; }

         const text = targetElement.textContent?.trim() || "";
         const detectedLang = detectLanguage(text);
         if (text && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
             console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 检测到 ${detectedLang} 文本，准备触发翻译...`);
             event.preventDefault(); event.stopPropagation(); // 阻止默认发送行为
             const currentInputElement = document.querySelector(INPUT_SELECTOR);
             const currentSendButton = document.querySelector(SEND_BUTTON_SELECTOR);
             if (!currentInputElement) { console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] [错误] 无法找到输入元素！无法翻译。`); updateStatusDisplay("错误：输入元素丢失！", 'error', 4000); return; }
             if (!currentSendButton || !currentSendButton.offsetParent) { console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] [错误] 发送按钮丢失或隐藏！无法翻译。`); updateStatusDisplay("错误：发送按钮不可用！", 'error', 5000, true, false); return; }
             // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 调用 translateAndSend 处理文本: "${text.substring(0,20)}..."`);
             translateAndSend(text, currentInputElement, currentSendButton);
         } else {
              // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 无需翻译 (语言: ${detectedLang}, 文本空: ${!text})。允许 Enter 默认行为或隐藏状态栏。`);
              if (!isTranslatingAndSending) { hideStatusDisplay(); } // 如果不繁忙，隐藏可能存在的旧状态
         }
    }
    // --- 输入时中止翻译逻辑 ---
    else if (isTranslatingAndSending && !['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Tab'].includes(event.key)) {
         console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 检测到在翻译过程中输入 (${event.key})，正在中止 API 请求...`);
         if (currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') {
             currentInputApiXhr.abort(); // Abort 会触发 onabort 回调，在那里重置状态
         } else {
             // 如果没有活动的 XHR (可能 API 已完成但在等待发送超时)，直接重置状态
             isTranslatingAndSending = false;
             hideStatusDisplay();
             console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 没有活动的 API 请求可中止，直接重置翻译状态。`);
         }
    }
    // --- 不繁忙时输入隐藏状态栏 ---
    else if (!isTranslatingAndSending) {
         // 如果状态栏可见且显示的不是“正在进行”的状态，则隐藏它
         if (statusBarElement && statusBarElement.classList.contains('visible') && !statusBarElement.querySelector('span.status')) {
             hideStatusDisplay();
         }
    }
}
function handleSendButtonClick(event) {
     const sendButton = event.target.closest(SEND_BUTTON_SELECTOR);
     if (!sendButton) return;
     console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 检测到发送按钮点击。`);
      if (statusBarElement && statusBarElement.classList.contains('visible') && !isTranslatingAndSending && !autoSendEnabled) {
          const nonBlockingStatus = statusBarElement.querySelector('span.success, span.info');
          if (nonBlockingStatus) { console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 检测到非阻塞状态，允许手动发送。`); hideStatusDisplay(); return; }
     }
     const currentInputElement = document.querySelector(INPUT_SELECTOR);
     if (!currentInputElement) { console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] [错误] 无法找到输入元素！无法检查内容。`); return; } // 允许 WA 处理丢失输入框的情况

     const text = currentInputElement.textContent?.trim() || "";
     const detectedLang = detectLanguage(text);
     if (text && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
         if (isTranslatingAndSending) { console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] [警告] 正在翻译中，已阻止发送按钮点击。`); event.preventDefault(); event.stopPropagation(); return; }
         console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 检测到 ${detectedLang} 文本，拦截点击以触发翻译...`);
         event.preventDefault(); event.stopPropagation(); // 阻止默认发送行为
         if (!sendButton.offsetParent) { console.error(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] [错误] 发送按钮在点击处理时变得不可见！无法翻译。`); updateStatusDisplay("错误：发送按钮不可用！", 'error', 5000, true, false); return; }
         // console.log(`[InputTranslate-WA v${SCRIPT_VERSION} [事件] 调用 translateAndSend 处理文本: "${text.substring(0,20)}..."`);
         translateAndSend(text, currentInputElement, sendButton);
     } else {
         // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [事件] 无需翻译 (语言: ${detectedLang}, 文本空: ${!text}, 翻译中: ${isTranslatingAndSending})。允许发送按钮默认行为。`);
         if (!isTranslatingAndSending) { hideStatusDisplay(); } // 如果不繁忙，隐藏可能存在的旧状态
     }
}

// --- 初始化与附加监听器 (Log Han Hua) ---
function initialize() {
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [初始化] 脚本开始执行...`);
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [初始化] 5秒后执行首次元素检查...`);
    setTimeout(() => {
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [初始化] 正在执行首次元素检查...`);
        if (ensureControlsExist()) {
             console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [初始化] 首次检查成功，尝试附加初始监听器。`);
             attachInitialListeners();
        } else {
             console.warn("[InputTranslate-WA v${SCRIPT_VERSION}] [初始化] [警告] 首次检查未能找到所需元素，将依赖 MutationObserver。");
        }
    }, 5000);

    const observer = new MutationObserver(mutations => {
         let needsRecheck = false;
         for (const mutation of mutations) {
              if (mutation.type === 'childList') {
                 let footerChanged = false;
                 const parentFooter = mutation.target.closest(FOOTER_SELECTOR); // 检查变更是否发生在 footer 内部或其子孙节点
                 if (parentFooter) {
                    footerChanged = true;
                 } else { // 如果变更发生在外部，检查是否添加/删除了关键元素
                     const checkNodes = (nodes) => {
                         for (const node of nodes) {
                             if (node.nodeType !== 1) continue;
                             if (node.matches && (node.matches(INPUT_SELECTOR) || node.matches(SEND_BUTTON_SELECTOR) || node.matches(FOOTER_SELECTOR) || node.id === CONTROLS_WRAPPER_ID)) return true;
                             if (node.querySelector && (node.querySelector(INPUT_SELECTOR) || node.querySelector(SEND_BUTTON_SELECTOR) || node.querySelector(FOOTER_SELECTOR) || node.querySelector(`#${CONTROLS_WRAPPER_ID}`))) return true;
                             if (node.matches && node.matches('div.copyable-area') && node.closest(FOOTER_SELECTOR)) return true;
                             if (node.querySelector && node.querySelector('div.copyable-area')) return true;
                         }
                         return false;
                     };
                     if (checkNodes(mutation.addedNodes) || checkNodes(mutation.removedNodes)) {
                         footerChanged = true;
                     }
                 }

                 if (footerChanged) {
                    needsRecheck = true;
                    // console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [Observer] 检测到相关 DOM 变动。`, mutation);
                    break; // 找到相关变动，无需检查此批次剩余 mutation
                 }
              }
         }

         if (needsRecheck) {
             // console.log("[InputTranslate-WA v${SCRIPT_VERSION}] [Observer] 触发元素重新检查...");
             if (window.waTranslateRecheckTimeout) clearTimeout(window.waTranslateRecheckTimeout);
             window.waTranslateRecheckTimeout = setTimeout(() => {
                 // console.log("[InputTranslate-WA v${SCRIPT_VERSION}] [Observer] 执行防抖后的元素重新检查和监听器附加。");
                 if(ensureControlsExist()) {
                    attachInitialListeners();
                 } else {
                     // console.log("[InputTranslate-WA v${SCRIPT_VERSION}] [Observer] 重新检查失败，未找到所需元素。");
                 }
             }, 150); // 防抖处理
         }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [初始化] MutationObserver 已激活，监视 document.body。`);
}
function attachInitialListeners() {
     const inputElement = document.querySelector(INPUT_SELECTOR);
     if (inputElement && !inputElement.dataset.customInputTranslateListener) {
        attachInputListeners(inputElement);
     } else if (!inputElement) {
         // console.log("[InputTranslate-WA v${SCRIPT_VERSION}] [监听器] attachInitialListeners: 未找到输入元素。");
     }

     const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
     if(sendButton && !sendButtonClickListenerAttached) { // 使用 flag 检查
        attachSendButtonListener(sendButton);
     } else if (!sendButton) {
         // console.log("[InputTranslate-WA v${SCRIPT_VERSION}] [监听器] attachInitialListeners: 未找到发送按钮。");
     }
}
function attachInputListeners(inputElement) {
     if (inputElement.dataset.customInputTranslateListener) return;
     console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [监听器] 正在向输入元素附加 Keydown 监听器:`, inputElement);
     inputElement.addEventListener('keydown', handleInputKeyDown, { capture: true });
     inputElement.dataset.customInputTranslateListener = 'true'; // 标记已附加

     // 监视输入元素自身是否被移除
     const inputObserver = new MutationObserver(() => {
        if (!inputElement.isConnected) {
            console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [监听器] 检测到输入元素被移除。监听器自动失效。`);
            inputObserver.disconnect(); // 停止监视
        }
     });
     if (inputElement.parentNode) {
         inputObserver.observe(inputElement.parentNode, { childList: true, subtree: false }); // 监视父节点的变化
     } else {
        console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [监听器] [警告] 输入元素没有父节点，无法启动移除监视。`);
     }
}
function attachSendButtonListener(sendButton) {
    if (sendButtonClickListenerAttached) return; // 再次检查 flag
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [监听器] 正在向发送按钮附加 Click 监听器:`, sendButton);
    sendButton.addEventListener('click', handleSendButtonClick, { capture: true });
    sendButtonClickListenerAttached = true; // 设置 flag

    // 监视发送按钮是否被移除或替换
     const buttonObserver = new MutationObserver(() => {
         // 需要重新查询按钮，因为原始 sendButton 变量可能指向已移除的元素
         const currentSendButton = sendButton.parentNode?.querySelector(SEND_BUTTON_SELECTOR);
         if (!currentSendButton || !currentSendButton.isConnected) {
             console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [监听器] 检测到发送按钮被移除或替换。重置监听器附加标志。`);
             buttonObserver.disconnect();
             sendButtonClickListenerAttached = false; // 重置 flag 是关键！
         }
     });
     if (sendButton.parentNode) {
         buttonObserver.observe(sendButton.parentNode, { childList: true, subtree: true }); // 监视父节点及其子树
     } else {
         console.warn(`[InputTranslate-WA v${SCRIPT_VERSION}] [监听器] [警告] 发送按钮没有父节点，无法启动移除监视。`);
     }
}

// --- 启动初始化 ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [初始化] DOMContentLoaded 事件触发，准备执行 initialize()。`);
        initialize();
    });
} else {
    console.log(`[InputTranslate-WA v${SCRIPT_VERSION}] [初始化] DOM 已加载，直接执行 initialize()。`);
    initialize();
}

})();