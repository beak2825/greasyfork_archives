// ==UserScript==
// @name         Telegram 输入框翻译并发送 (v2.4 - 融合v2.2发送逻辑)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  按回车或点击发送按钮时翻译(中/缅->指定风格英文)并替换。提供开关控制是否自动发送(采用v2.2的发送逻辑尝试修复)。
// @author       Your Name / AI Assistant
// @match        https://web.telegram.org/k/*
// @match        https://web.telegram.org/a/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.ohmygpt.com
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/48px-Telegram_logo.svg.png
// @downloadURL https://update.greasyfork.org/scripts/534282/Telegram%20%E8%BE%93%E5%85%A5%E6%A1%86%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%28v24%20-%20%E8%9E%8D%E5%90%88v22%E5%8F%91%E9%80%81%E9%80%BB%E8%BE%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534282/Telegram%20%E8%BE%93%E5%85%A5%E6%A1%86%E7%BF%BB%E8%AF%91%E5%B9%B6%E5%8F%91%E9%80%81%20%28v24%20-%20%E8%9E%8D%E5%90%88v22%E5%8F%91%E9%80%81%E9%80%BB%E8%BE%91%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const OHMYGPT_API_KEY = "sk-RK1MU6Cg6a48fBecBBADT3BlbKFJ4C209a954d3b4428b54b"; // 你的 OhMyGPT API Key
    const OHMYGPT_API_ENDPOINT = "https://api.ohmygpt.com/v1/chat/completions";
    const INPUT_TRANSLATE_MODEL = "gpt-4o-mini"; // 输入框翻译模型

    // --- NEW TRANSLATION PROMPT (Using the gentle one from your v2.2) ---
    const TRANSLATION_PROMPT = `Act as a professional translator. Your task is to translate the user's text according to these rules:
1.  **Target Language & Style:** Translate into authentic, standard American English.
2.  **Tone:** Use a gentle, kind, and polite tone. Aim for natural, conversational warmth often associated with polite female speech, but maintain standard grammar and avoid slang or overly casual abbreviations.
3.  **Fluency:** Ensure the translation sounds natural and fluent, avoiding any stiffness or "machine translation" feel.
4.  **Punctuation:**
    *   Do NOT end sentences with a period (.).
    *   RETAIN the question mark (?) if the original is a question.
5.  **Output:** Provide ONLY the final translated text. No explanations, introductions, or labels.

Text to translate:
{text_to_translate}`;

    // Selectors
    const INPUT_SELECTOR = 'div.input-message-input[contenteditable="true"]';
    const SEND_BUTTON_SELECTOR = 'button.btn-send';
    const INPUT_AREA_CONTAINER_SELECTOR = '.chat-input-main'; // Container for input and overlay/button

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
    let isTranslatingAndSending = false; // Flag to prevent conflicts/loops
    let sendButtonClickListenerAttached = false; // Track if click listener is attached
    let autoSendEnabled = false; // State for auto-send toggle

    // --- CSS Styles (Overlay and Toggle Button) ---
    GM_addStyle(`
        #${INPUT_OVERLAY_ID} {
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

        #${AUTO_SEND_TOGGLE_ID} {
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
    function detectLanguage(text) { if (!text) return null; if (CHINESE_REGEX.test(text)) return 'Chinese'; if (BURMESE_REGEX.test(text)) return 'Burmese'; return 'Other'; }
    function setCursorToEnd(element) { const range = document.createRange(); const sel = window.getSelection(); range.selectNodeContents(element); range.collapse(false); sel.removeAllRanges(); sel.addRange(range); element.focus(); } // Keep focus here for consistency

    function ensureControlsExist(inputMainContainer) {
        if (!inputMainContainer) return;
        if (window.getComputedStyle(inputMainContainer).position === 'static') {
            inputMainContainer.style.position = 'relative';
            console.log("[InputTranslate] Set input container to relative positioning.");
        }
        if (!inputTranslationOverlayElement || !inputMainContainer.contains(inputTranslationOverlayElement)) {
            inputTranslationOverlayElement = document.createElement('div');
            inputTranslationOverlayElement.id = INPUT_OVERLAY_ID;
            inputMainContainer.appendChild(inputTranslationOverlayElement);
            console.log("[InputTranslate] Overlay element created.");
        }
        if (!autoSendToggleElement || !inputMainContainer.contains(autoSendToggleElement)) {
            autoSendToggleElement = document.createElement('button');
            autoSendToggleElement.id = AUTO_SEND_TOGGLE_ID;
            updateAutoSendButtonVisual();
            autoSendToggleElement.addEventListener('click', toggleAutoSend);
            inputMainContainer.appendChild(autoSendToggleElement);
            console.log("[InputTranslate] Auto-send toggle button created.");
        }
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
             setTimeout(() => {
                 if (inputTranslationOverlayElement && !inputTranslationOverlayElement.classList.contains('visible')) {
                    inputTranslationOverlayElement.textContent = '';
                 }
             }, 250);
        }
    }

    function updateAutoSendButtonVisual() {
        if (!autoSendToggleElement) return;
        if (autoSendEnabled) {
            autoSendToggleElement.textContent = "自动发送: 开";
            autoSendToggleElement.className = 'autosend-on';
            autoSendToggleElement.id = AUTO_SEND_TOGGLE_ID;
        } else {
            autoSendToggleElement.textContent = "自动发送: 关";
            autoSendToggleElement.className = 'autosend-off';
             autoSendToggleElement.id = AUTO_SEND_TOGGLE_ID;
        }
    }

    function toggleAutoSend() {
        autoSendEnabled = !autoSendEnabled;
        console.log(`[InputTranslate] Auto Send Toggled: ${autoSendEnabled ? 'ON' : 'OFF'}`);
        updateAutoSendButtonVisual();
        updateInputOverlay(`自动发送已${autoSendEnabled ? '开启' : '关闭'}`, 'status', 2000);
    }


    // --- Shared Translate -> Replace -> Send Logic (v2.4 - Using v2.2 Send Logic) ---
    function translateAndSend(originalText, inputElement, sendButton) {
        if (isTranslatingAndSending) {
            console.warn("[InputTranslate] Already processing, ignoring translateAndSend call.");
            return;
        }
        if (!inputElement || !sendButton) {
            console.error("[InputTranslate] Input element or send button missing in translateAndSend.");
            updateInputOverlay("错误: 输入/发送按钮丢失", 'error', 4000);
            return;
        }

        isTranslatingAndSending = true;
        hideInputOverlay();
        updateInputOverlay("翻译中...", 'status');

        const finalPrompt = TRANSLATION_PROMPT.replace('{text_to_translate}', originalText);
        // Using temperature from v2.2 prompt code
        const requestBody = { model: INPUT_TRANSLATE_MODEL, messages: [{"role": "user", "content": finalPrompt }], temperature: 0.7 };

        console.log(`[InputTranslate] Calling API (${INPUT_TRANSLATE_MODEL}) for translateAndSend`);

        if (currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') { currentInputApiXhr.abort(); }

        currentInputApiXhr = GM_xmlhttpRequest({
            method: "POST", url: OHMYGPT_API_ENDPOINT,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OHMYGPT_API_KEY}` },
            data: JSON.stringify(requestBody),
            onload: function(response) {
                currentInputApiXhr = null;
                try {
                    // Check status properly (like in v2.2)
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        const translation = data.choices?.[0]?.message?.content?.trim();

                        if (translation) {
                            console.log("[InputTranslate] API Success:", translation);
                            inputElement.textContent = translation; // Replace content
                            setCursorToEnd(inputElement);          // Move cursor and focus
                            // Trigger input event for framework updates
                            inputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                            console.log("[InputTranslate] Input event dispatched after text replacement.");

                            // <<< Check Auto-Send Toggle >>>
                            console.log(`[InputTranslate] Checking autoSendEnabled state: ${autoSendEnabled}`);

                            if (autoSendEnabled) {
                                // --- Use the simpler v2.2 sending logic ---
                                const sendDelay = 150; // Use v2.2 delay
                                console.log(`[InputTranslate] Auto-sending ON. Using v2.2 logic. Setting timeout (${sendDelay}ms) for click.`);

                                setTimeout(() => {
                                     // Check flag *inside* timeout to handle potential aborts after timeout was set but before execution
                                     if (!isTranslatingAndSending) {
                                          console.log("[InputTranslate][Timeout] Sending aborted before programmatic click.");
                                          return;
                                     }
                                    console.log("[InputTranslate][Timeout] Checking send button...");
                                    // Use the original sendButton reference, check connection
                                    if (sendButton && sendButton.isConnected) {
                                        console.log("[InputTranslate][Timeout] Send button connected. Programmatically clicking NOW (v2.2 logic).");
                                        sendButton.click(); // Directly click, no disabled check
                                        hideInputOverlay(); // Clear "翻译中..."
                                        isTranslatingAndSending = false; // Reset flag *after* initiating send
                                    } else {
                                        console.warn("[InputTranslate][Timeout] Send button disappeared before click (v2.2 logic).");
                                        updateInputOverlay("发送失败: 按钮失效", 'error', 3000);
                                        isTranslatingAndSending = false; // Reset flag
                                    }
                                }, sendDelay); // Use 150ms delay

                            } else {
                                // Auto-send is OFF
                                console.log("[InputTranslate] Auto-sending OFF. Translation replaced, awaiting manual send.");
                                updateInputOverlay("翻译完成 ✓ (请手动发送)", 'success', 3500);
                                // Reset flag now
                                isTranslatingAndSending = false;
                            }
                        } else {
                            let errorMsg = data.error?.message || "API返回空内容";
                            console.error("[InputTranslate] API Error (Empty Content):", response.responseText);
                            throw new Error(errorMsg);
                        }
                    } else {
                         // Handle non-2xx status codes (like in v2.2)
                         console.error("[InputTranslate] API Error (Status):", response.status, response.statusText, response.responseText);
                         let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
                         try { const errData = JSON.parse(response.responseText); errorDetail = errData.error?.message || errorDetail; }
                         catch (e) { /* ignore parse error */ }
                         throw new Error(errorDetail);
                    }
                } catch (e) {
                    console.error("[InputTranslate] API/Parse/Send Error:", e);
                    updateInputOverlay(`处理失败: ${e.message.substring(0, 80)}`, 'error', 5000);
                    isTranslatingAndSending = false; // Reset flag on error
                }
            },
            onerror: function(response) { currentInputApiXhr = null; console.error("[InputTranslate] Request Error:", response); updateInputOverlay(`翻译失败: 网络错误 (${response.status || 'N/A'})`, 'error', 4000); isTranslatingAndSending = false; },
            ontimeout: function() { currentInputApiXhr = null; console.error("[InputTranslate] Timeout"); updateInputOverlay("翻译失败: 请求超时", 'error', 4000); isTranslatingAndSending = false; },
            onabort: function() { currentInputApiXhr = null; console.log("[InputTranslate] API request aborted."); /* hideInputOverlay(); Already hidden? */ isTranslatingAndSending = false; }, // Reset flag on abort
            timeout: 30000
        });
    }

    // --- Event Listeners (Mostly from v2.3.x, seem fine) ---
    function handleInputKeyDown(event) {
        const inputElement = event.target;
        if (!inputElement || !inputElement.matches(INPUT_SELECTOR)) return;

        if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.ctrlKey) {
            if (isTranslatingAndSending) {
                console.log("[InputTranslate][Enter] Ignored, already processing.");
                event.preventDefault(); event.stopPropagation(); return;
            }
            const text = inputElement.textContent?.trim() || "";
            const detectedLang = detectLanguage(text);
            if (text && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
                console.log(`[InputTranslate][Enter] Detected ${detectedLang}. Translating...`);
                event.preventDefault(); event.stopPropagation();
                const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
                if (!sendButton) { updateInputOverlay("错误: 未找到发送按钮!", 'error', 5000); console.error("[InputTranslate][Enter] Send button not found!"); return; }
                // Add the disabled check from v2.2 here before calling translateAndSend
                if (sendButton.disabled) { updateInputOverlay("错误: 发送按钮不可用!", 'error', 5000); return;}
                translateAndSend(text, inputElement, sendButton);
            } else { console.log(`[InputTranslate][Enter] Allowing normal send for ${detectedLang || 'empty'}.`); hideInputOverlay(); }
        }
        else if (!['Shift', 'Control', 'Alt', 'Meta', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Escape'].includes(event.key)) {
            // Abort logic from v2.2 / v2.3
            if (isTranslatingAndSending && currentInputApiXhr && typeof currentInputApiXhr.abort === 'function') {
                 console.log("[InputTranslate] User typed, aborting translation.");
                 currentInputApiXhr.abort(); // onabort will reset the flag
            } else if (!isTranslatingAndSending) {
                 // Hide status/error messages if user starts typing again
                 if (inputTranslationOverlayElement && inputTranslationOverlayElement.classList.contains('visible')) {
                      const overlayContent = inputTranslationOverlayElement.querySelector('span');
                      if (overlayContent && !overlayContent.classList.contains('status')) { // Hide error/success, keep 'Translating...'
                           hideInputOverlay();
                      }
                 }
            }
        }
    }

    function handleSendButtonClick(event) {
         const sendButton = event.target.closest(SEND_BUTTON_SELECTOR);
         if (!sendButton) return;

         const inputElement = document.querySelector(INPUT_SELECTOR);
         if (!inputElement) { console.error("[InputTranslate][Click] Input element not found."); return; }

         const text = inputElement.textContent?.trim() || "";
         const detectedLang = detectLanguage(text);

         if (text && (detectedLang === 'Chinese' || detectedLang === 'Burmese')) {
             if (isTranslatingAndSending) {
                 console.log("[InputTranslate][Click] Intercepted, translation already in progress.");
                 event.preventDefault(); event.stopPropagation(); return;
             }
             console.log(`[InputTranslate][Click] Detected ${detectedLang}. Translating...`);
             event.preventDefault(); event.stopPropagation();
             // Check disabled state here too before calling
             if (sendButton.disabled) { updateInputOverlay("错误: 发送按钮不可用!", 'error', 5000); return;}
             translateAndSend(text, inputElement, sendButton);
         } else {
             if (!isTranslatingAndSending) {
                 console.log(`[InputTranslate][Click] Allowing normal send for ${detectedLang || 'empty'}.`);
                 hideInputOverlay();
             }
         }
    }

    // --- Initialization & Attaching Listeners (Using robust observer from v2.3.x) ---
    function initialize() {
        console.log("[Telegram Input Translator v2.4] Initializing...");
        const observer = new MutationObserver(mutations => {
             let inputFound = false; let controlsContainerFound = false;
             mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        // Find Input
                        if (node.matches(INPUT_SELECTOR) && !node.dataset.customInputTranslateListener) { attachInputListeners(node); inputFound = true; }
                        else { const inputElement = node.querySelector(INPUT_SELECTOR); if (inputElement && !inputElement.dataset.customInputTranslateListener) { attachInputListeners(inputElement); inputFound = true; } }
                        // Find Container for Controls
                         if (node.matches(INPUT_AREA_CONTAINER_SELECTOR)) { ensureControlsExist(node); controlsContainerFound = true; }
                         else { const containerElement = node.querySelector(INPUT_AREA_CONTAINER_SELECTOR); if(containerElement) { ensureControlsExist(containerElement); controlsContainerFound = true; } }
                    });
                }
            });
             // Fallback check for container if input found but container wasn't
             if (inputFound && !controlsContainerFound) { const inputContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR); if (inputContainer) ensureControlsExist(inputContainer); }
             // Check Send Button periodically
            if (!sendButtonClickListenerAttached) { const sendButton = document.querySelector(SEND_BUTTON_SELECTOR); if (sendButton && !sendButton.dataset.customSendClickListener) { attachSendButtonListener(sendButton); } }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial check
        const initialInputElement = document.querySelector(INPUT_SELECTOR);
        if (initialInputElement && !initialInputElement.dataset.customInputTranslateListener) { attachInputListeners(initialInputElement); const initialContainer = initialInputElement.closest(INPUT_AREA_CONTAINER_SELECTOR); if (initialContainer) ensureControlsExist(initialContainer); }
        else { const initialContainer = document.querySelector(INPUT_AREA_CONTAINER_SELECTOR); if (initialContainer) ensureControlsExist(initialContainer); } // Try container anyway
        const initialSendButton = document.querySelector(SEND_BUTTON_SELECTOR);
        if(initialSendButton && !initialSendButton.dataset.customSendClickListener) { attachSendButtonListener(initialSendButton); }

        console.log("[Telegram Input Translator v2.4] Observer active.");
    }

    function attachInputListeners(inputElement) {
         if (inputElement.dataset.customInputTranslateListener) return;
         console.log("[InputTranslate] Attaching Keydown listener to input:", inputElement);
         inputElement.addEventListener('keydown', handleInputKeyDown, true);
         inputElement.dataset.customInputTranslateListener = 'true';
         const inputContainer = inputElement.closest(INPUT_AREA_CONTAINER_SELECTOR);
         if (inputContainer) ensureControlsExist(inputContainer);
    }

    function attachSendButtonListener(sendButton) {
        if (sendButton.dataset.customSendClickListener) return;
         console.log("[InputTranslate] Attaching Click listener to Send button:", sendButton);
         sendButton.addEventListener('click', handleSendButtonClick, true);
         sendButton.dataset.customSendClickListener = 'true';
         sendButtonClickListenerAttached = true;
         // Monitor button removal (simple version)
         const buttonObserver = new MutationObserver(() => {
             if (!sendButton.isConnected) {
                 console.log("[InputTranslate] Send button removed. Resetting listener flag.");
                 buttonObserver.disconnect();
                 if (sendButton.dataset.customSendClickListener) { delete sendButton.dataset.customSendClickListener; }
                 sendButtonClickListenerAttached = false;
             }
         });
         if (sendButton.parentNode) { buttonObserver.observe(sendButton.parentNode, { childList: true, subtree: false }); }
         else { console.warn("[InputTranslate] Send button parent node not found for observer."); }
    }

    // --- Start Initialization ---
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 1500)); }
    else { setTimeout(initialize, 1500); }

})();