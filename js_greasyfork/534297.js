// ==UserScript==
// @name         Telegram 输入框 Google 翻译并发送 (v3.0 - 切换至非官方 Google API)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  按回车或点击发送按钮时使用非官方 Google API 翻译(中/缅->英文)并替换。提供开关控制是否自动发送。
// @author       Your Name / AI Assistant (Modified for Google Translate)
// @match        https://web.telegram.org/k/*
// @match        https://web.telegram.org/a/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/48px-Telegram_logo.svg.png
// @downloadURL https://update.greasyfork.org/scripts/534297/Telegram%20%E8%BE%93%E5%85%A5%E6%A1%86%20Google%20%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%28v30%20-%20%E5%88%87%E6%8D%A2%E8%87%B3%E9%9D%9E%E5%AE%98%E6%96%B9%20Google%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534297/Telegram%20%E8%BE%93%E5%85%A5%E6%A1%86%20Google%20%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%28v30%20-%20%E5%88%87%E6%8D%A2%E8%87%B3%E9%9D%9E%E5%AE%98%E6%96%B9%20Google%20API%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const GOOGLE_TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t";
    const TARGET_LANGUAGE = "en"; // 目标翻译语言 (英文)

    // Selectors
    const INPUT_SELECTOR = 'div.input-message-input[contenteditable="true"]';
    const SEND_BUTTON_SELECTOR = 'button.btn-send';
    const INPUT_AREA_CONTAINER_SELECTOR = '.chat-input-main';

    // UI Element IDs
    const INPUT_OVERLAY_ID = 'custom-input-translate-overlay';
    const AUTO_SEND_TOGGLE_ID = 'custom-auto-send-toggle';

    // Language Detection Regex
    const CHINESE_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;
    const BURMESE_REGEX = /[\u1000-\u109F]/;

    // State Variables
    let inputTranslationOverlayElement = null;
    let autoSendToggleElement = null;
    let currentInputApiXhr = null;
    let isTranslatingAndSending = false;
    let sendButtonClickListenerAttached = false;
    let autoSendEnabled = false;

    // --- CSS Styles ---
    GM_addStyle(`
        #${INPUT_OVERLAY_ID} { /* ...样式代码不变... */
            position: absolute; bottom: 100%; left: 10px; right: 120px;
            background-color: rgba(30, 30, 30, 0.9); backdrop-filter: blur(3px);
            border: 1px solid rgba(255, 255, 255, 0.2); border-bottom: none;
            padding: 4px 8px; font-size: 13px; color: #e0e0e0;
            border-radius: 6px 6px 0 0; box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
            z-index: 150; display: none; max-height: 60px; overflow-y: auto;
            line-height: 1.3; text-align: left; transition: opacity 0.2s ease-in-out;
        }
        #${INPUT_OVERLAY_ID}.visible { display: block; opacity: 1; }
        #${INPUT_OVERLAY_ID} .status { font-style: italic; color: #aaa; }
        #${INPUT_OVERLAY_ID} .error { font-weight: bold; color: #ff8a8a; }
        #${INPUT_OVERLAY_ID} .success { font-weight: bold; color: #90ee90; }

        #${AUTO_SEND_TOGGLE_ID} { /* ...样式代码不变... */
            position: absolute; bottom: 100%; right: 10px; z-index: 151;
            padding: 4px 10px; font-size: 12px; font-weight: bold;
            border: 1px solid rgba(255, 255, 255, 0.2); border-bottom: none;
            border-radius: 6px 6px 0 0; cursor: pointer; user-select: none;
            transition: background-color 0.2s ease, color 0.2s ease;
        }
        #${AUTO_SEND_TOGGLE_ID}.autosend-off { background-color: rgba(80, 80, 80, 0.9); color: #ccc; }
        #${AUTO_SEND_TOGGLE_ID}.autosend-on { background-color: rgba(70, 130, 180, 0.95); color: #fff; }
        #${AUTO_SEND_TOGGLE_ID}:hover { filter: brightness(1.1); }
    `);

    // --- Helper Functions ---
    // 语言检测和光标设置函数保持不变
    function detectLanguage(text) { if (!text) return null; if (CHINESE_REGEX.test(text)) return 'zh-CN'; if (BURMESE_REGEX.test(text)) return 'my'; return null; }
    function setCursorToEnd(element) { const range = document.createRange(); const sel = window.getSelection(); range.selectNodeContents(element); range.collapse(false); sel.removeAllRanges(); sel.addRange(range); element.focus(); }
    // 界面控制函数保持不变
    function ensureControlsExist(inputMainContainer) {
        if (!inputMainContainer) return;
        if (window.getComputedStyle(inputMainContainer).position === 'static') { inputMainContainer.style.position = 'relative'; console.log("[GoogleTranslate] Set input container to relative positioning."); }
        if (!inputTranslationOverlayElement || !inputMainContainer.contains(inputTranslationOverlayElement)) { inputTranslationOverlayElement = document.createElement('div'); inputTranslationOverlayElement.id = INPUT_OVERLAY_ID; inputMainContainer.appendChild(inputTranslationOverlayElement); console.log("[GoogleTranslate] Overlay element created."); }
        if (!autoSendToggleElement || !inputMainContainer.contains(autoSendToggleElement)) { autoSendToggleElement = document.createElement('button'); autoSendToggleElement.id = AUTO_SEND_TOGGLE_ID; updateAutoSendButtonVisual(); autoSendToggleElement.addEventListener('click', toggleAutoSend); inputMainContainer.appendChild(autoSendToggleElement); console.log("[GoogleTranslate] Auto-send toggle button created."); }
    }
    function updateInputOverlay(content, type = 'status', duration = 0) {
        const inputContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR);
        ensureControlsExist(inputContainer);
        if (!inputTranslationOverlayElement) return;
        inputTranslationOverlayElement.innerHTML = `<span class="${type}">${content}</span>`;
        inputTranslationOverlayElement.classList.add('visible');
        inputTranslationOverlayElement.scrollTop = inputTranslationOverlayElement.scrollHeight;
        if (duration > 0) { setTimeout(hideInputOverlay, duration); }
    }
    function hideInputOverlay() {
        if (inputTranslationOverlayElement) {
            inputTranslationOverlayElement.classList.remove('visible');
            setTimeout(() => { if (inputTranslationOverlayElement && !inputTranslationOverlayElement.classList.contains('visible')) { inputTranslationOverlayElement.textContent = ''; } }, 250);
        }
    }
    function updateAutoSendButtonVisual() {
        if (!autoSendToggleElement) return;
        if (autoSendEnabled) { autoSendToggleElement.textContent = "自动发送: 开"; autoSendToggleElement.className = 'autosend-on'; }
        else { autoSendToggleElement.textContent = "自动发送: 关"; autoSendToggleElement.className = 'autosend-off'; }
        autoSendToggleElement.id = AUTO_SEND_TOGGLE_ID; // 确保ID始终存在
    }
    function toggleAutoSend() {
        autoSendEnabled = !autoSendEnabled;
        console.log(`[GoogleTranslate] Auto Send Toggled: ${autoSendEnabled ? 'ON' : 'OFF'}`);
        updateAutoSendButtonVisual();
        updateInputOverlay(`自动发送已${autoSendEnabled ? '开启' : '关闭'}`, 'status', 2000);
    }

    // --- 翻译与发送逻辑 (使用 Google API) ---
    function translateAndSend(originalText, inputElement, sendButton, sourceLang) {
        if (isTranslatingAndSending) { console.warn("[GoogleTranslate] Already processing..."); return; }
        if (!inputElement || !sendButton) { console.error("[GoogleTranslate] Input/Send button missing."); updateInputOverlay("错误: 输入/发送按钮丢失", 'error', 4000); return; }

        isTranslatingAndSending = true;
        hideInputOverlay();
        updateInputOverlay("翻译中 (Google)...", 'status');

        const url = `${GOOGLE_TRANSLATE_ENDPOINT}&sl=${sourceLang}&tl=${TARGET_LANGUAGE}&q=${encodeURIComponent(originalText)}`;
        console.log(`[GoogleTranslate] Calling Google API: ${url.substring(0, 100)}...`);

        if (currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') { currentInputApiXhr.abort(); }

        currentInputApiXhr = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json" },
            onload: function(response) {
                currentInputApiXhr = null;
                try {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const translation = data?.[0]?.[0]?.[0];
                        if (translation && typeof translation === 'string') {
                            console.log("[GoogleTranslate] API Success:", translation);
                            inputElement.textContent = translation;
                            setCursorToEnd(inputElement);
                            inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                            console.log("[GoogleTranslate] Input event dispatched.");

                            if (autoSendEnabled) {
                                const sendDelay = 150;
                                console.log(`[GoogleTranslate] Auto-sending ON. Timeout ${sendDelay}ms.`);
                                setTimeout(() => {
                                     if (!isTranslatingAndSending) { console.log("[GoogleTranslate][Timeout] Sending aborted."); return; }
                                    if (sendButton && sendButton.isConnected) { console.log("[GoogleTranslate][Timeout] Clicking Send."); sendButton.click(); hideInputOverlay(); isTranslatingAndSending = false; }
                                    else { console.warn("[GoogleTranslate][Timeout] Send button gone."); updateInputOverlay("发送失败: 按钮失效", 'error', 3000); isTranslatingAndSending = false; }
                                }, sendDelay);
                            } else {
                                console.log("[GoogleTranslate] Auto-sending OFF."); updateInputOverlay("翻译完成 ✓ (请手动发送)", 'success', 3500); isTranslatingAndSending = false;
                            }
                        } else { throw new Error("Google API 返回无效内容"); }
                    } else { throw new Error(`HTTP ${response.status}: ${response.statusText}`); }
                } catch (e) {
                    console.error("[GoogleTranslate] API/Parse/Send Error:", e); updateInputOverlay(`处理失败: ${e.message.substring(0, 80)}`, 'error', 5000); isTranslatingAndSending = false;
                }
            },
            onerror: function(response) { currentInputApiXhr = null; console.error("[GoogleTranslate] Request Error:", response); updateInputOverlay(`翻译失败: 网络错误 (${response.statusText || 'N/A'})`, 'error', 4000); isTranslatingAndSending = false; },
            ontimeout: function() { currentInputApiXhr = null; console.error("[GoogleTranslate] Timeout"); updateInputOverlay("翻译失败: 请求超时", 'error', 4000); isTranslatingAndSending = false; },
            onabort: function() { currentInputApiXhr = null; console.log("[GoogleTranslate] API request aborted."); isTranslatingAndSending = false; },
            timeout: 15000
        });
    }

    // --- Event Listeners ---
    function handleInputKeyDown(event) {
        const inputElement = event.target;
        if (!inputElement || !inputElement.matches(INPUT_SELECTOR)) return;
        if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.ctrlKey) {
            if (isTranslatingAndSending) { event.preventDefault(); event.stopPropagation(); return; }
            const text = inputElement.textContent?.trim() || "";
            const detectedLang = detectLanguage(text);
            if (text && detectedLang) {
                console.log(`[GoogleTranslate][Enter] Detected ${detectedLang}. Translating...`);
                event.preventDefault(); event.stopPropagation();
                const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
                if (!sendButton) { updateInputOverlay("错误: 未找到发送按钮!", 'error', 5000); return; }
                if (sendButton.disabled) { updateInputOverlay("错误: 发送按钮不可用!", 'error', 5000); return;}
                translateAndSend(text, inputElement, sendButton, detectedLang);
            } else { hideInputOverlay(); }
        }
        else if (!['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Escape'].includes(event.key)) {
            if (isTranslatingAndSending && currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') { console.log("[GoogleTranslate] User typed, aborting translation."); currentInputApiXhr.abort(); }
            else if (!isTranslatingAndSending) { if (inputTranslationOverlayElement && inputTranslationOverlayElement.classList.contains('visible')) { const overlayContent = inputTranslationOverlayElement.querySelector('span'); if (overlayContent && !overlayContent.classList.contains('status')) { hideInputOverlay(); } } }
        }
    }
    function handleSendButtonClick(event) {
         const sendButton = event.target.closest(SEND_BUTTON_SELECTOR);
         if (!sendButton) return;
         const inputElement = document.querySelector(INPUT_SELECTOR);
         if (!inputElement) { return; }
         const text = inputElement.textContent?.trim() || "";
         const detectedLang = detectLanguage(text);
         if (text && detectedLang) {
             if (isTranslatingAndSending) { event.preventDefault(); event.stopPropagation(); return; }
             console.log(`[GoogleTranslate][Click] Detected ${detectedLang}. Translating...`);
             event.preventDefault(); event.stopPropagation();
             if (sendButton.disabled) { updateInputOverlay("错误: 发送按钮不可用!", 'error', 5000); return;}
             translateAndSend(text, inputElement, sendButton, detectedLang);
         } else { if (!isTranslatingAndSending) { hideInputOverlay(); } }
    }

    // --- Initialization & Attaching Listeners ---
    function initialize() {
        console.log("[Telegram Google Translator v3.0 - Fix Attempt] Initializing...");
        const observer = new MutationObserver(mutations => {
             let inputFound = false; let controlsContainerFound = false;
             mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        if (node.matches(INPUT_SELECTOR) && !node.dataset.customInputTranslateListener) { attachInputListeners(node); inputFound = true; }
                        else { const inputElement = node.querySelector(INPUT_SELECTOR); if (inputElement && !inputElement.dataset.customInputTranslateListener) { attachInputListeners(inputElement); inputFound = true; } }
                         if (node.matches(INPUT_AREA_CONTAINER_SELECTOR)) { ensureControlsExist(node); controlsContainerFound = true; }
                         else { const containerElement = node.querySelector(INPUT_AREA_CONTAINER_SELECTOR); if(containerElement) { ensureControlsExist(containerElement); controlsContainerFound = true; } }
                    });
                }
            });
             if (inputFound && !controlsContainerFound) { const inputContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR); if (inputContainer) ensureControlsExist(inputContainer); }
            if (!sendButtonClickListenerAttached) { const sendButton = document.querySelector(SEND_BUTTON_SELECTOR); if (sendButton && !sendButton.dataset.customSendClickListener) { attachSendButtonListener(sendButton); } }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial Check
        const initialInputElement = document.querySelector(INPUT_SELECTOR);
        if (initialInputElement && !initialInputElement.dataset.customInputTranslateListener) { attachInputListeners(initialInputElement); const initialContainer = initialInputElement.closest(INPUT_AREA_CONTAINER_SELECTOR); if (initialContainer) ensureControlsExist(initialContainer); }
        else { const initialContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR); if (initialContainer) ensureControlsExist(initialContainer); }
        const initialSendButton = document.querySelector(SEND_BUTTON_SELECTOR);
        if(initialSendButton && !initialSendButton.dataset.customSendClickListener) { attachSendButtonListener(initialSendButton); }

        console.log("[Telegram Google Translator v3.0 - Fix Attempt] Observer active. Using NON-OFFICIAL Google endpoint.");
    }
    function attachInputListeners(inputElement) {
         if (inputElement.dataset.customInputTranslateListener) return;
         console.log("[GoogleTranslate] Attaching Keydown listener to input:", inputElement);
         inputElement.addEventListener('keydown', handleInputKeyDown, true);
         inputElement.dataset.customInputTranslateListener = 'true';
         const inputContainer = inputElement.closest(INPUT_AREA_CONTAINER_SELECTOR);
         if (inputContainer) ensureControlsExist(inputContainer);
    }
    function attachSendButtonListener(sendButton) {
        if (sendButton.dataset.customSendClickListener) return;
         console.log("[GoogleTranslate] Attaching Click listener to Send button:", sendButton);
         sendButton.addEventListener('click', handleSendButtonClick, true);
         sendButton.dataset.customSendClickListener = 'true';
         sendButtonClickListenerAttached = true;
         const buttonObserver = new MutationObserver(() => {
             if (!sendButton.isConnected) {
                 console.log("[GoogleTranslate] Send button removed. Resetting listener flag.");
                 buttonObserver.disconnect();
                 if (sendButton.dataset.customSendClickListener) { delete sendButton.dataset.customSendClickListener; }
                 sendButtonClickListenerAttached = false;
             }
         });
         if (sendButton.parentNode) { buttonObserver.observe(sendButton.parentNode, { childList: true, subtree: false }); }
         else { console.warn("[GoogleTranslate] Send button parent node not found for observer."); }
    }

    // --- Start Initialization ---
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 1500)); }
    else { setTimeout(initialize, 1500); }

})();