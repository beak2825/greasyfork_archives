// ==UserScript==
// @name         OpenRouter Inline Translator
// @name:en         OpenRouter Inline Translator
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.3
// @description  Translate selected text on the page into Japanese( is hard-coded) using OpenRouter API( model type is also hard-coded). 
// @description:en  Translate selected text on the page into Japanese( is hard-coded) using OpenRouter API( model type is also hard-coded). 
// @author       chainsaw-clara-beau
// @match        *://*/*
// @connect      openrouter.ai
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541766/OpenRouter%20Inline%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/541766/OpenRouter%20Inline%20Translator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CSS Styles from content.css ---
    const styles = `
        #openrouter-translator-small-icon-popup {
          all: unset;
          display: block;
          position: absolute;
          z-index: 2147483647;
          cursor: pointer;
          background-color: rgba(240, 240, 240, 0.95);
          border: 1px solid #ccc;
          border-radius: 15px;
          padding: 3px 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1;
        }
        #openrouter-translator-small-icon-popup .emoji-trigger {
        }
        .openrouter-translator-detailed-popup {
          all: unset;
          display: block;
          position: absolute;
          z-index: 2147483647;
          background-color: #0b0d0f;
          color: #abb2bf;
          border: 1px solid #444c56;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-family: sans-serif;
          font-size: 14px;
          width: 400px;
          min-width: 200px;
          min-height: 100px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .openrouter-translator-detailed-popup .popup-close-button {
          position: absolute;
          top: 8px;
          right: 10px;
          background: none;
          border: none;
          font-size: 22px;
          color: #abb2bf;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          z-index: 10;
          font-weight: bold;
        }
        .openrouter-translator-detailed-popup .popup-close-button:hover {
          color: #e06c75;
        }
        .openrouter-translator-detailed-popup .resize-handle {
          position: absolute;
          background: transparent;
          z-index: 5;
        }
        .openrouter-translator-detailed-popup .resize-handle-e {
          top: 0;
          right: 0;
          width: 10px;
          height: 100%;
          cursor: e-resize;
        }
        .openrouter-translator-detailed-popup .resize-handle-s {
          bottom: 0;
          left: 0;
          width: 100%;
          height: 10px;
          cursor: s-resize;
        }
        .openrouter-translator-detailed-popup .resize-handle-se {
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          cursor: se-resize;
          z-index: 6;
        }
        .openrouter-translator-detailed-popup .translator-popup-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          overflow: hidden;
          margin-top: 15px;
        }
        .openrouter-translator-detailed-popup .language-selector {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .openrouter-translator-detailed-popup .language-selector label {
          margin-right: 8px;
          color: #98c379;
        }
        .openrouter-translator-detailed-popup select {
          flex-grow: 1;
          padding: 8px;
          border: 1px solid #444c56;
          border-radius: 4px;
          background-color: #0b0d0f;
          color: #abb2bf;
        }
        .openrouter-translator-detailed-popup button:not(.popup-close-button) {
          background-color: #61afef;
          color: #282c34;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 10px;
        }
        .openrouter-translator-detailed-popup button:not(.popup-close-button):hover {
          background-color: #5299d8;
        }
        .openrouter-translator-detailed-popup #inlineLoadingIndicator {
          text-align: center;
          color: #e5c07b;
          margin: 10px 0;
        }
        .openrouter-translator-detailed-popup .translation-output {
          background-color: #0b0d0f;
          padding: 10px;
          border-radius: 4px;
          min-height: 40px;
          overflow-wrap: break-word;
          white-space: pre-wrap;
          font-size: 0.95em;
          max-height: 400px;
          overflow-y: auto;
          flex-grow: 1;
          scrollbar-width: thin;
          scrollbar-color: #6e7886 #0b0d0f;
        }
        .openrouter-translator-detailed-popup .translation-output::-webkit-scrollbar {
          width: 8px;
        }
        .openrouter-translator-detailed-popup .translation-output::-webkit-scrollbar-track {
          background: #0b0d0f;
          border-radius: 10px;
          margin: 2px 0;
        }
        .openrouter-translator-detailed-popup .translation-output::-webkit-scrollbar-thumb {
          background-color: #6e7886;
          border-radius: 10px;
          border: 2px solid #0b0d0f;
        }
        .openrouter-translator-detailed-popup .translation-output::-webkit-scrollbar-thumb:hover {
          background-color: #818c99;
        }
        .openrouter-translator-detailed-popup .translation-output::-webkit-scrollbar-button {
          display: none;
        }
        .openrouter-translator-detailed-popup .translation-output::-webkit-scrollbar-corner {
          background: transparent;
          display: none;
        }
    `;
    GM_addStyle(styles);

    // --- Logic from background.js and content.js ---

    // Configuration
    const DEFAULT_POPUP_WIDTH = 400;
    const DEFAULT_POPUP_HEIGHT = 300;

    // Global state
    let smallIconPopup = null;
    let selectedTextGlobal = '';
    let popupIdCounter = 0;
    let activeInteraction = {
        element: null,
        isDragging: false,
        isResizing: false,
        resizeType: '',
        dragStartX: 0,
        dragStartY: 0,
        popupStartX: 0,
        popupStartY: 0,
        startWidth: 0,
        startHeight: 0,
        startX: 0,
        startY: 0,
    };

    // --- API & Storage Handling (was background.js) ---

    async function getApiKey() {
        return await GM_getValue('openrouterApiKey', null);
    }

    async function saveApiKey(apiKey) {
        await GM_setValue('openrouterApiKey', apiKey);
        return { success: true };
    }

    async function translateTextWithOpenRouter(text, targetLanguage, apiKey) {
        if (!apiKey) {
            return { error: 'APIキーが設定されていません。ユーザースクリプトのメニューから設定してください。' };
        }
        if (!text) {
            return { error: '翻訳するテキストが入力されていません。' };
        }

        const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
        let systemPrompt = `Please translate the following text to ${targetLanguage}. Make it natural and avoid literal translation.`;

        switch (targetLanguage) {
            case 'Japanese': systemPrompt = '以下の文章を日本語訳してください。なるべく直訳は避け自然な日本語にしてください。'; break;
            case 'English': systemPrompt = 'Please translate the following text to English. Make it natural and avoid literal translation.'; break;
            case 'Korean': systemPrompt = '다음 문장을 한국어로 번역해주세요. 직역보다는 자연스러운 한국어로 번역해주세요.'; break;
            case 'Chinese': systemPrompt = '请将以下文本翻译成中文。请避免直译，使用自然的中文表达。'; break;
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'X-Title': 'OpenRouter Translator Userscript'
                },
                data: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: text }
                    ],
                    max_tokens: 4000,
                    temperature: 0.3
                }),
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                            resolve({ translatedText: data.choices[0].message.content.trim() });
                        } else {
                            console.error('OpenRouter API Response format error:', data);
                            resolve({ error: 'APIからの応答形式が正しくありません。' });
                        }
                    } else {
                        const errorData = JSON.parse(response.responseText);
                        console.error('OpenRouter API Error:', errorData);
                        let errorMessage = `APIエラー: ${response.status}`;
                        if (errorData && errorData.error && errorData.error.message) {
                            errorMessage += ` - ${errorData.error.message}`;
                        }
                        resolve({ error: errorMessage });
                    }
                },
                onerror: function (error) {
                    console.error('Fetch Error:', error);
                    resolve({ error: `ネットワークエラーまたはリクエスト失敗: ${error.statusText}` });
                }
            });
        });
    }


    // --- UI and Interaction Logic (was content.js) ---

    function removeDetailedPopup(popupElement) {
        if (popupElement) popupElement.remove();
    }

    function removeSmallIconPopup() {
        if (smallIconPopup) {
            smallIconPopup.remove();
            smallIconPopup = null;
        }
    }

    async function getSavedPopupSize() {
        const width = await GM_getValue('popupWidth', DEFAULT_POPUP_WIDTH);
        const height = await GM_getValue('popupHeight', DEFAULT_POPUP_HEIGHT);
        return { width, height };
    }

    function savePopupSize(width, height) {
        GM_setValue('popupWidth', width);
        GM_setValue('popupHeight', height);
    }

    // Core function to trigger translation
    async function triggerTranslation(text, x, y) {
        if (!text || text.length === 0) {
            alert("No text selected.");
            return;
        }
        selectedTextGlobal = text;

        if (typeof x !== "number" || typeof y !== "number") {
            x = window.innerWidth / 2 - (DEFAULT_POPUP_WIDTH / 2);
            y = window.innerHeight / 2 - (DEFAULT_POPUP_HEIGHT / 2);
        }

        const newDetailedPopup = await createDetailedPopup(x, y, text, true);
        const apiKey = await getApiKey();
        const response = await translateTextWithOpenRouter(text, "Japanese", apiKey);

        if (!newDetailedPopup) return;
        const loadingIndicator = newDetailedPopup.querySelector('#inlineLoadingIndicator');
        const outputArea = newDetailedPopup.querySelector('#inlineTranslationOutput');

        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (!outputArea) return;

        if (response.error) {
            outputArea.textContent = 'エラー: ' + response.error;
        } else if (response.translatedText) {
            outputArea.textContent = response.translatedText;
        } else {
            outputArea.textContent = '翻訳結果がありません。';
        }
    }


    function createSmallIconPopup(x, y) {
        removeSmallIconPopup();

        smallIconPopup = document.createElement('div');
        smallIconPopup.id = 'openrouter-translator-small-icon-popup';
        smallIconPopup.innerHTML = `<span class="emoji-trigger" title="翻訳する">🌐</span>`;
        document.body.appendChild(smallIconPopup);
        smallIconPopup.style.left = `${x}px`;
        smallIconPopup.style.top = `${y}px`;

        smallIconPopup.addEventListener('click', async (event) => {
            event.stopPropagation();
            if (selectedTextGlobal) {
                const iconRect = smallIconPopup.getBoundingClientRect();
                if (smallIconPopup) smallIconPopup.style.display = 'none';
                await triggerTranslation(selectedTextGlobal, iconRect.left + window.scrollX, iconRect.bottom + window.scrollY + 5);
            }
        });
    }

    async function createDetailedPopup(x, y, originalText, isLoading = false) {
        const popupElement = document.createElement('div');
        popupElement.className = 'openrouter-translator-detailed-popup';
        popupElement.dataset.popupId = `popup-translator-${popupIdCounter++}`;
        popupElement.innerHTML = `
            <button class="popup-close-button" title="閉じる">&times;</button>
            <div class="translator-popup-content">
              <div id="inlineLoadingIndicator" style="display: ${isLoading ? 'block' : 'none'};">...</div>
              <div id="inlineTranslationOutput" class="translation-output"></div>
            </div>
            <div class="resize-handle resize-handle-e"></div>
            <div class="resize-handle resize-handle-s"></div>
            <div class="resize-handle resize-handle-se"></div>
        `;
        document.body.appendChild(popupElement);
        popupElement.style.left = `${x}px`;
        popupElement.style.top = `${y}px`;
        popupElement.style.zIndex = 10000 + popupIdCounter;

        const { width, height } = await getSavedPopupSize();
        popupElement.style.width = `${width}px`;
        popupElement.style.height = `${height}px`;

        setupPopupInteractions(popupElement);
        return popupElement;
    }

    function setupPopupInteractions(popupElement) {
        const dragHandle = popupElement;

        popupElement.addEventListener('mousedown', () => {
            popupElement.style.zIndex = 10000 + popupIdCounter++;
        }, true);

        dragHandle.addEventListener('mousedown', (e) => {
            if (e.target.closest('button, .translation-output, .resize-handle, .popup-close-button')) return;
            e.preventDefault();
            activeInteraction = {
                isDragging: true,
                element: popupElement,
                dragStartX: e.clientX,
                dragStartY: e.clientY,
                popupStartX: popupElement.offsetLeft,
                popupStartY: popupElement.offsetTop,
            };
            popupElement.style.userSelect = 'none';
        });

        popupElement.querySelector('.popup-close-button').addEventListener('click', (e) => {
            e.stopPropagation();
            removeDetailedPopup(popupElement);
        });

        setupResizeHandlers(popupElement);
    }

    function setupResizeHandlers(popupElement) {
        const eastResize = popupElement.querySelector('.resize-handle-e');
        const southResize = popupElement.querySelector('.resize-handle-s');
        const southEastResize = popupElement.querySelector('.resize-handle-se');
        if (!eastResize || !southResize || !southEastResize) return;

        const startResize = (e, type) => {
            e.preventDefault();
            e.stopPropagation();
            activeInteraction = {
                isResizing: true,
                resizeType: type,
                element: popupElement,
                startX: e.clientX,
                startY: e.clientY,
                startWidth: popupElement.offsetWidth,
                startHeight: popupElement.offsetHeight,
            };
            document.body.style.cursor = `${type}-resize`;
        };
        eastResize.addEventListener('mousedown', (e) => startResize(e, 'e'));
        southResize.addEventListener('mousedown', (e) => startResize(e, 's'));
        southEastResize.addEventListener('mousedown', (e) => startResize(e, 'se'));
    }

    document.addEventListener('mousemove', (e) => {
        if (!activeInteraction.element) return;
        if (activeInteraction.isDragging) {
            const dx = e.clientX - activeInteraction.dragStartX;
            const dy = e.clientY - activeInteraction.dragStartY;
            activeInteraction.element.style.left = `${activeInteraction.popupStartX + dx}px`;
            activeInteraction.element.style.top = `${activeInteraction.popupStartY + dy}px`;
        }
        if (activeInteraction.isResizing) {
            if (activeInteraction.resizeType.includes('e')) {
                const width = activeInteraction.startWidth + (e.clientX - activeInteraction.startX);
                if (width >= 200) activeInteraction.element.style.width = `${width}px`;
            }
            if (activeInteraction.resizeType.includes('s')) {
                const height = activeInteraction.startHeight + (e.clientY - activeInteraction.startY);
                if (height >= 100) activeInteraction.element.style.height = `${height}px`;
            }
        }
    });

    document.addEventListener('mouseup', () => {
        if (!activeInteraction.element) return;
        if (activeInteraction.isDragging) {
            activeInteraction.element.style.userSelect = 'auto';
        }
        if (activeInteraction.isResizing) {
            document.body.style.cursor = 'default';
            const width = activeInteraction.element.offsetWidth;
            const height = activeInteraction.element.offsetHeight;
            savePopupSize(width, height);
        }
        activeInteraction = { element: null, isDragging: false, isResizing: false };
    });

    document.addEventListener('mousedown', (event) => {
        if (event.target.closest('.openrouter-translator-detailed-popup, #openrouter-translator-small-icon-popup')) {
            return;
        }
        removeSmallIconPopup();
    });

    document.addEventListener('mouseup', (event) => {
        if (event.target.closest('.openrouter-translator-detailed-popup, #openrouter-translator-small-icon-popup')) {
            return;
        }
        setTimeout(() => {
            const currentSelectedText = window.getSelection().toString().trim();
            if (currentSelectedText.length > 0) {
                selectedTextGlobal = currentSelectedText;
                const selection = window.getSelection();
                if (selection.rangeCount === 0) return;
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                createSmallIconPopup(rect.right + window.scrollX - 10, rect.top + window.scrollY - 10);
            }
        }, 0);
    });

    // --- Context Menu ---
    GM_registerMenuCommand("Set OpenRouter API Key", async () => {
        const currentKey = await getApiKey() || '';
        const newKey = prompt("Enter your OpenRouter API Key:", currentKey);
        if (newKey !== null) { // Check if user cancelled
            await saveApiKey(newKey.trim());
            alert("API Key saved.");
        }
    });

})();