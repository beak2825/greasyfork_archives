// ==UserScript==
// @name         仿青轻查词
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  在英文句子上左滑显示弹窗 (修复高亮冲突及句子识别不精确问题，目标：精确到句子，兼容复杂网站，解决沉浸式翻译冲突，添加全选按钮，并附带翻译) - 扁平化UI (无关闭按钮) - AI缓存自动显示
// @author       YourName
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/539003/%E4%BB%BF%E9%9D%92%E8%BD%BB%E6%9F%A5%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/539003/%E4%BB%BF%E9%9D%92%E8%BD%BB%E6%9F%A5%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Tampermonkey GM Functions Check ---
    // Ensure GM_ functions are available, as they might not be in all environments
    if (typeof GM_getValue === 'undefined' || typeof GM_setValue === 'undefined' || typeof GM_registerMenuCommand === 'undefined' || typeof GM_xmlhttpRequest === 'undefined') {
        console.error('Tampermonkey GM functions are not available. Please ensure the script is running in a compatible environment with GM_xmlhttpRequest support.');
        return;
    }

    // --- AI Model & API Configuration ---
    const GROQ_API_KEY = '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';
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    const AI_MODELS = {
        MAVERICK: 'meta-llama/llama-4-maverick-17b-128e-instruct',
        VERSATILE: 'llama-3.3-70b-versatile'
    };

    const DEFAULT_AI_MODEL_KEY = 'groqDefaultAIModel';
    let currentAIModel = GM_getValue(DEFAULT_AI_MODEL_KEY, AI_MODELS.MAVERICK); // Default to Maverick

    // --- AI Cache Configuration ---
    const AI_CACHE_KEY = 'aiAnalysisCache';
    const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    /**
     * Retrieves a cached AI response if available and not expired.
     * @param {string} key - The key for the cache entry (e.g., the sentence and model).
     * @returns {string|null} The cached response or null if not found/expired.
     */
    function getCachedAIResponse(key) {
        const cache = GM_getValue(AI_CACHE_KEY, {});
        const entry = cache[key];
        if (entry && (Date.now() - entry.timestamp < CACHE_EXPIRATION_MS)) {
            console.log('AI response loaded from cache.');
            return entry.data;
        }
        return null;
    }

    /**
     * Caches an AI response.
     * @param {string} key - The key for the cache entry.
     * @param {string} data - The AI response to cache.
     */
    function setCachedAIResponse(key, data) {
        const cache = GM_getValue(AI_CACHE_KEY, {});
        cache[key] = {
            data: data,
            timestamp: Date.now()
        };
        GM_setValue(AI_CACHE_KEY, cache);
        console.log('AI response cached.');
    }

    // --- Helper to escape HTML entities for display in innerHTML ---
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // --- AI Call Function ---
    async function callGroqAI(prompt, model, retries = 1) {
        const cacheKey = `${prompt}_${model}`;
        const cachedResponse = getCachedAIResponse(cacheKey);
        if (cachedResponse) {
            return cachedResponse;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        };

        const body = JSON.stringify({
            model: model,
            messages: [{
                role: 'user',
                content: prompt
            }],
            temperature: 0.7,
            max_tokens: 1000,
            stream: false
        });

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: GROQ_API_URL,
                headers: headers,
                data: body,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
                                const aiResponse = data.choices[0].message.content;
                                setCachedAIResponse(cacheKey, aiResponse);
                                resolve(aiResponse);
                            } else {
                                reject(new Error('Invalid AI response format.'));
                            }
                        } catch (e) {
                            reject(new Error(`Failed to parse AI response: ${e.message}`));
                        }
                    } else {
                        console.error(`AI API Error: Status ${response.status}, Response: ${response.responseText}`);
                        // Retry with the alternate model if available and it's the first retry
                        if (retries > 0) {
                            const alternateModel = model === AI_MODELS.MAVERICK ? AI_MODELS.VERSATILE : AI_MODELS.MAVERICK;
                            console.warn(`Retrying AI call with alternate model: ${alternateModel}`);
                            callGroqAI(prompt, alternateModel, retries - 1)
                                .then(resolve)
                                .catch(reject);
                        } else {
                            reject(new Error(`AI request failed with status ${response.status}: ${response.statusText || response.responseText}`));
                        }
                    }
                },
                onerror: function(error) {
                    console.error(`AI API Network Error: ${error.statusText || error.responseText}`);
                    if (retries > 0) {
                        const alternateModel = model === AI_MODELS.MAVERICK ? AI_MODELS.VERSATILE : AI_MODELS.MAVERICK;
                        console.warn(`Retrying AI call with alternate model: ${alternateModel}`);
                        callGroqAI(prompt, alternateModel, retries - 1)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject(new Error(`AI request failed (network error): ${error.statusText || 'Unknown Error'}`));
                    }
                }
            });
        });
    }

    // --- AI Response Formatting Function ---
    /**
     * 【关键修改】此函数被修改以格式化标题颜色
     */
    function formatAIResponse(text) {
        // 将 Markdown 标题 (h1-h6) 替换为带颜色的 span，并移除 '#' 前缀
        // 'm' 标志允许 '^' 匹配每一行的开头
        let formattedText = text.replace(/^(#{1,6})\s(.*)/gm, '<span style="color: #ffe680;">$2</span>');

        // 将 **text** 替换为 <strong>text</strong>
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // 将 *text* 替换为 <em>text</em> (确保不与 **text** 冲突)
        formattedText = formattedText.replace(/\*(?!\*)(.*?)\*(?!\*)/g, '<em>$1</em>');
        // 将换行符转换为 <br> 以在 HTML 中正确显示
        formattedText = formattedText.replace(/\n/g, '<br>');
        return formattedText;
    }


    /**
     * 【新功能】生成用于AI分析的标准化Prompt。
     * @param {string} sentence - 要分析的句子。
     * @returns {string} - 完整的Prompt。
     */
    function getAIPrompt(sentence) {
        return `你是一个智能助手，请用中文分析下面的内容。请根据内容类型（单词或句子）按以下要求进行分析：

如果是**句子或段落**，请：
1. 给出难度等级（A1-C2）并解释
2. 核心语法结构分析
3. 准确翻译
4. 重点短语及例句和例句翻译

用 **加粗** 标出重点内容，保持回答简洁实用。

内容如下："${sentence}"
`;
    }


    // --- User Settings ---
    // Default to 'bottom' if not set
    const POPUP_POSITION_KEY = 'sentencePopupPosition';
    let popupPosition = GM_getValue(POPUP_POSITION_KEY, 'bottom'); // 'top' or 'bottom'
    // Target language for translation
    const TARGET_LANGUAGE_KEY = 'translationTargetLanguage';
    let targetLanguage = GM_getValue(TARGET_LANGUAGE_KEY, 'zh-CN'); // Default to Simplified Chinese

    // --- Core State Variables ---
    let popup = null;             // The main popup DOM element
    let isDraggingPopup = false;  // Flag for tracking popup drag state
    let initialTouchY = 0;        // Initial Y coordinate of touch for drag
    let initialPopupTranslateY = 0; // Initial translateY of popup for drag
    let currentTranslateY = 0;    // Current translateY of the popup (0 when fully visible, POPUP_HEIGHT when hidden)

    // --- UI/Layout Constants ---
    // Minimum and maximum heights for adaptive popup
    const MIN_POPUP_HEIGHT_RATIO = 0.2; // 20% of screen height
    const MAX_POPUP_HEIGHT_RATIO = 0.95; // 95% of screen height - increased for full screen height
    const INITIAL_POPUP_HEIGHT = window.innerHeight * 0.4; // Initial 40% of screen height
    const POPUP_MIN_Z_INDEX = 2147483640; // Max possible z-index minus a small buffer

    // --- Highlighting State ---
    let highlightedElements = []; // Stores elements that have been highlighted

    // --- Sentence Context ---
    let lastFoundSentence = null; // The last sentence text found
    let lastRelevantElement = null; // The DOM element where the last sentence was found

    // --- Immersion Translate Specific Selectors (for robust exclusion) ---
    const IMMERSION_TRANSLATE_TARGET_TEXT_CLASS = 'it-target-text';
    const IMMERSION_TRANSLATE_ORIGINAL_TEXT_CLASS = 'it-original-text';
    const IMMERSION_TRANSLATE_UI_CLASSES = [
        'immersion-translate-tool-bar',
        'immersion-translate-select-tip',
        'immersion-translate-original',
        'immersion-translate-target'
    ];
    const IMMERSION_TRANSLATE_SENTENCE_WRAP_CLASS = 'immersion-translate-sentence-wrap';

    // --- Tampermonkey Menu Commands ---
    function registerMenuCommands() {
        GM_registerMenuCommand(`Popup Position: ${popupPosition === 'bottom' ? 'Bottom (Current)' : 'Bottom'}`, () => {
            if (popupPosition !== 'bottom') {
                popupPosition = 'bottom';
                GM_setValue(POPUP_POSITION_KEY, 'bottom');
                alert('Popup position set to Bottom. Please refresh the page for changes to take effect.');
                if (popup) hidePopup(); // Hide current popup if visible
            }
        });

        GM_registerMenuCommand(`Popup Position: ${popupPosition === 'top' ? 'Top (Current)' : 'Top'}`, () => {
            if (popupPosition !== 'top') {
                popupPosition = 'top';
                GM_setValue(POPUP_POSITION_KEY, 'top');
                alert('Popup position set to Top. Please refresh the page for changes to take effect.');
                if (popup) hidePopup(); // Hide current popup if visible
            }
        });

        GM_registerMenuCommand(`Set Translation Language (Current: ${targetLanguage})`, () => {
            const newLang = prompt(`Enter target language code (e.g., 'zh-CN' for Simplified Chinese, 'ja' for Japanese, 'ko' for Korean, 'fr' for French). Current: ${targetLanguage}`, targetLanguage);
            if (newLang && newLang.trim() !== '') {
                targetLanguage = newLang.trim();
                GM_setValue(TARGET_LANGUAGE_KEY, targetLanguage);
                alert(`Translation target language set to: ${targetLanguage}.`);
            }
        });

        GM_registerMenuCommand(`AI Model: ${currentAIModel === AI_MODELS.MAVERICK ? 'Maverick (Current)' : 'Maverick'}`, () => {
            if (currentAIModel !== AI_MODELS.MAVERICK) {
                currentAIModel = AI_MODELS.MAVERICK;
                GM_setValue(DEFAULT_AI_MODEL_KEY, AI_MODELS.MAVERICK);
                alert(`AI model set to Maverick.`);
            }
        });

        GM_registerMenuCommand(`AI Model: ${currentAIModel === AI_MODELS.VERSATILE ? 'Versatile (Current)' : 'Versatile'}`, () => {
            if (currentAIModel !== AI_MODELS.VERSATILE) {
                currentAIModel = AI_MODELS.VERSATILE;
                GM_setValue(DEFAULT_AI_MODEL_KEY, AI_MODELS.VERSATILE);
                alert(`AI model set to Versatile.`);
            }
        });

    }


    /**
     * Checks if the user's system is in dark mode.
     * @returns {boolean} True if dark mode is preferred, false otherwise.
     */
    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Applies a translateY transform to the popup, updating its visual position.
     * @param {number} y - The Y-offset in pixels for the transform.
     */
    function applyPopupTransform(y) {
        if (popup) {
            popup.style.transform = `translateY(${y}px)`;
            currentTranslateY = y;
        }
    }

    /**
     * Creates and initializes the main popup element if it doesn't already exist.
     * Applies flat UI styles and attaches drag/swipe-to-dismiss event listeners.
     * @returns {HTMLElement} The created or existing popup element.
     */
    function createPopup() {
        if (popup) return popup;

        popup = document.createElement('div');
        popup.id = 'sentence-swipe-popup';
        popup.style.cssText = `
            position: fixed;
            left: 0;
            width: 100vw;
            max-width: 100%;
            height: ${INITIAL_POPUP_HEIGHT}px; /* Initial height, will be adaptive */
            background-color: rgba(0, 0, 0, 0.95); /* Pure black with slight transparency */
            border-${popupPosition === 'bottom' ? 'top' : 'bottom'}: 1px solid #333333; /* Darker border */
            border-radius: ${popupPosition === 'bottom' ? '12px 12px 0 0' : '0 0 12px 12px'}; /* Rounded corners based on position */
            box-shadow: 0 ${popupPosition === 'bottom' ? '-2px' : '2px'} 12px rgba(0,0,0,0.2); /* Softer shadow for dark theme */
            z-index: ${POPUP_MIN_Z_INDEX};
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 15px; /* Slightly smaller font for compactness */
            line-height: 1.6;
            color: #ffffff; /* White text for dark background */
            display: flex;
            flex-direction: column;
            ${popupPosition}: 0; /* Position at top or bottom */
            transform: translateY(${popupPosition === 'bottom' ? INITIAL_POPUP_HEIGHT : -INITIAL_POPUP_HEIGHT}px); /* Initially hidden off-screen */
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s ease; /* Add height transition */
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            box-sizing: border-box;
            cursor: text;
            overscroll-behavior-y: contain;
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
            backdrop-filter: blur(8px); /* Frosted glass effect */
            -webkit-backdrop-filter: blur(8px); /* For Safari */
        `;
        // Ensure the popup itself isn't translated by other tools
        popup.setAttribute('translate', 'no');
        popup.classList.add('notranslate');

        // --- Drag Handle (New Flat UI Element) ---
        const dragHandle = document.createElement('div');
        dragHandle.style.cssText = `
            width: 40px;
            height: 4px;
            background-color: #666666; /* Dark gray for drag handle */
            border-radius: 2px;
            margin: ${popupPosition === 'bottom' ? '0 auto 12px auto' : '12px auto 0 auto'}; /* Centered with spacing based on position */
            cursor: grab;
            flex-shrink: 0;
        `;
        popup.appendChild(dragHandle);

        // --- Content Area ---
        const contentArea = document.createElement('div');
        contentArea.id = 'sentence-popup-content';
        contentArea.style.cssText = `
            flex-grow: 1;
            overflow-y: auto;
            padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
            ${popupPosition === 'top' ? 'order: 2;' : ''} /* Order content after drag handle for top position */
        `;
        popup.appendChild(contentArea);

        // --- Controls Area ---
        const controlsArea = document.createElement('div');
        controlsArea.id = 'sentence-popup-controls';
        controlsArea.style.cssText = `
            flex-shrink: 0;
            padding-top: 12px; /* Increased padding for better separation */
            display: flex;
            justify-content: flex-end; /* Align to the right */
            gap: 10px; /* Space between buttons */
            ${popupPosition === 'top' ? 'order: 3;' : ''} /* Order controls after content for top position */
        `;
        popup.appendChild(controlsArea);

        // --- AI Analyze Button ---
        const aiButton = document.createElement('button');
        aiButton.textContent = 'AI Analyze';
        aiButton.style.cssText = `
            background-color: #4a7bed; /* Blue button for AI */
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            outline: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            transition: background-color 0.2s ease, transform 0.1s ease;
            &:hover {
                background-color: #5a8eee;
            }
            &:active {
                transform: scale(0.98);
            }
        `;
        aiButton.addEventListener('click', async () => {
            const originalSentenceDiv = contentArea.querySelector('.original-content');
            if (originalSentenceDiv) {
                const sentence = originalSentenceDiv.textContent.trim();
                if (sentence) {
                    let aiResponseDiv = contentArea.querySelector('.ai-response-content');
                    if (!aiResponseDiv) {
                        aiResponseDiv = document.createElement('div');
                        aiResponseDiv.classList.add('ai-response-content');
                        aiResponseDiv.style.marginTop = '10px';
                        aiResponseDiv.style.fontSize = '14px';
                        aiResponseDiv.style.color = '#c0c0c0'; // Lighter grey for AI text
                        contentArea.appendChild(aiResponseDiv);
                    }
                    aiResponseDiv.innerHTML = 'AI analyzing...';
                    contentArea.scrollTop = contentArea.scrollHeight; // Scroll to bottom to show AI response
                    adjustPopupHeight(); // Adjust height immediately for loading text

                    try {
                        // 【改动】使用辅助函数生成 prompt
                        const prompt = getAIPrompt(sentence);
                        const aiAnalysis = await callGroqAI(prompt, currentAIModel);
                        aiResponseDiv.innerHTML = `<hr style="border-top: 1px solid #444444; margin: 10px 0;"><strong>AI Analysis (${currentAIModel.split('/').pop()}):</strong><br>${formatAIResponse(aiAnalysis)}`;
                        contentArea.scrollTop = contentArea.scrollHeight; // Scroll to bottom again after content loads
                        adjustPopupHeight(); // Adjust height after AI content is loaded
                    } catch (error) {
                        aiResponseDiv.innerHTML = `AI analysis failed: ${error.message}`;
                        aiResponseDiv.style.color = 'red';
                        console.error('AI analysis error:', error);
                        adjustPopupHeight(); // Adjust height even on error
                    }
                } else {
                    alert('No sentence to analyze.');
                }
            }
        });
        controlsArea.appendChild(aiButton);


        // --- Select All Button (Flat UI Styling) ---
        const selectAllButton = document.createElement('button');
        selectAllButton.textContent = 'Select All';
        selectAllButton.style.cssText = `
            background-color: #555555; /* Flat button background */
            color: #e0e0e0; /* Lighter text for button */
            border: none;
            padding: 8px 16px;
            border-radius: 6px; /* Slightly less rounded */
            cursor: pointer;
            font-size: 14px;
            font-weight: 500; /* Slightly bolder text */
            outline: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            transition: background-color 0.2s ease, transform 0.1s ease; /* Smooth hover/active */
            &:hover {
                background-color: #666666;
            }
            &:active {
                transform: scale(0.98);
            }
        `;
        selectAllButton.addEventListener('click', () => {
            const selection = window.getSelection();
            const range = document.createRange();
            selection.removeAllRanges();

            const originalContentNode = contentArea.querySelector('.original-content');

            if (originalContentNode) {
                // Directly select the content of the original-content div
                range.selectNodeContents(originalContentNode);
                selection.addRange(range);
            } else {
                console.warn('Original content div not found for selection.');
                // Fallback: If original-content class is somehow missing,
                // try to select only the text nodes that are direct children of contentArea
                // or are not within a 'translation-content' class.
                const tempDiv = document.createElement('div');
                contentArea.childNodes.forEach(node => {
                    // Only append if it's a text node, or an element not marked as translation
                    if (node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('translation-content') && !node.classList.contains('ai-response-content'))) { // Exclude AI response too
                        tempDiv.appendChild(node.cloneNode(true));
                    }
                });
                document.body.appendChild(tempDiv);
                range.selectNodeContents(tempDiv);
                selection.addRange(range);
                setTimeout(() => document.body.removeChild(tempDiv), 0);
            }
        });
        controlsArea.appendChild(selectAllButton);


        // --- Popup Transition End Listener ---
        popup.addEventListener('transitionend', () => {
            // Ensure currentTranslateY is accurately updated after transitions
            const transformStyle = window.getComputedStyle(popup).getPropertyValue('transform');
            const matrix = new DOMMatrixReadOnly(transformStyle);
            currentTranslateY = matrix.m42;
        });

        // --- Popup Touch Start (Drag) Listener ---
        popup.addEventListener('touchstart', function(e) {
            // Only allow dragging if it's a single touch and not on buttons
            if (e.touches.length === 1 && !e.target.closest('button')) {
                initialTouchY = e.touches[0].clientY;
                initialPopupTranslateY = currentTranslateY;
                isDraggingPopup = false; // Reset drag flag

                popup.style.transition = 'none'; // Disable transition during drag

                // Prevent scrolling page behind popup when at the top/bottom of content area
                const isAtScrollLimit = popupPosition === 'bottom' ? (contentArea.scrollTop <= 0) : (contentArea.scrollHeight - contentArea.scrollTop <= contentArea.clientHeight + 1); // +1 for pixel perfect comparison
                const isScrollingTowardsLimit = popupPosition === 'bottom' ? (e.touches[0].clientY > initialTouchY) : (e.touches[0].clientY < initialTouchY); // Down for bottom, Up for top
                const canContentScroll = contentArea.scrollHeight > contentArea.clientHeight;

                if (isAtScrollLimit && isScrollingTowardsLimit && canContentScroll) {
                    e.preventDefault();
                }
            }
        }, { passive: false }); // Needs to be non-passive to prevent default

        // --- Popup Touch Move (Drag) Listener ---
        popup.addEventListener('touchmove', function(e) {
            if (e.touches.length === 1 && !e.target.closest('button')) {
                const currentY = e.touches[0].clientY;
                const deltaYFromInitialTouch = currentY - initialTouchY;
                const absDeltaY = Math.abs(deltaYFromInitialTouch);

                const isAtScrollLimit = popupPosition === 'bottom' ? (contentArea.scrollTop <= 0) : (contentArea.scrollHeight - contentArea.scrollTop <= contentArea.clientHeight + 1);
                const isScrollingTowardsLimit = popupPosition === 'bottom' ? (deltaYFromInitialTouch > 0) : (deltaYFromInitialTouch < 0);
                const dragStartThreshold = 5; // Minimum drag distance to initiate dragging

                // Start dragging if conditions met
                const isReadyToDrag = !isDraggingPopup && isAtScrollLimit && isScrollingTowardsLimit && absDeltaY > dragStartThreshold;

                if (isReadyToDrag) {
                    isDraggingPopup = true;
                    initialTouchY = currentY; // Reset initialTouchY for smoother drag after threshold
                    initialPopupTranslateY = currentTranslateY;
                    e.preventDefault(); // Prevent page scroll
                }

                // If dragging, update popup position
                if (isDraggingPopup) {
                    let newTranslateY = initialPopupTranslateY + (currentY - initialTouchY);

                    // Constrain popup movement
                    if (popupPosition === 'bottom') {
                        newTranslateY = Math.max(0, Math.min(parseFloat(popup.style.height), newTranslateY));
                    } else { // top position
                        newTranslateY = Math.min(0, Math.max(-parseFloat(popup.style.height), newTranslateY));
                    }
                    applyPopupTransform(newTranslateY);
                    e.preventDefault(); // Prevent page scroll
                } else if (isAtScrollLimit && isScrollingTowardsLimit) {
                    // If not dragging yet but at scroll limit and trying to scroll away, prevent page scroll
                    e.preventDefault();
                }
            }
        }, { passive: false }); // Needs to be non-passive to allow `e.preventDefault()`

        // --- Popup Touch End (Drag) Listener ---
        popup.addEventListener('touchend', function(e) {
            if (isDraggingPopup) {
                isDraggingPopup = false;
                popup.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s ease'; // Re-enable transition

                // Determine whether to hide or show based on drag distance
                if (popupPosition === 'bottom') {
                    if (currentTranslateY > parseFloat(popup.style.height) * 0.2) { // Dragged more than 20% down
                        hidePopup();
                    } else {
                        applyPopupTransform(0); // Snap back to fully visible
                    }
                } else { // top position
                    if (currentTranslateY < -parseFloat(popup.style.height) * 0.2) { // Dragged more than 20% up
                        hidePopup();
                    } else {
                        applyPopupTransform(0); // Snap back to fully visible
                    }
                }
            } else {
                // If no drag occurred, just ensure transition is enabled for subsequent interactions
                popup.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s ease';
            }
        });

        document.body.appendChild(popup);
        return popup;
    }

    /**
     * Adjusts the popup height based on its content.
     */
    function adjustPopupHeight() {
        if (!popup) return;

        const contentArea = popup.querySelector('#sentence-popup-content');
        const controlsArea = popup.querySelector('#sentence-popup-controls');
        const dragHandle = popup.querySelector('div'); // The drag handle is the first div

        // Calculate required height based on content
        // Temporarily unset overflow-y to get full scrollHeight
        const originalOverflow = contentArea.style.overflowY;
        contentArea.style.overflowY = 'hidden';
        const requiredContentHeight = contentArea.scrollHeight;
        contentArea.style.overflowY = originalOverflow; // Restore overflow-y

        const padding = 16 * 2; // top and bottom padding
        const handleHeight = dragHandle ? dragHandle.offsetHeight + parseFloat(window.getComputedStyle(dragHandle).marginBottom || '0') + parseFloat(window.getComputedStyle(dragHandle).marginTop || '0') : 0;
        const controlsHeight = controlsArea ? controlsArea.offsetHeight + parseFloat(window.getComputedStyle(controlsArea).paddingTop || '0') : 0;

        let desiredHeight = requiredContentHeight + handleHeight + controlsHeight + padding;

        // Clamp height between min and max allowed ratios
        const minHeight = window.innerHeight * MIN_POPUP_HEIGHT_RATIO;
        const maxHeight = window.innerHeight * MAX_POPUP_HEIGHT_RATIO; // Use updated MAX_POPUP_HEIGHT_RATIO

        desiredHeight = Math.max(minHeight, Math.min(maxHeight, desiredHeight));

        // Apply new height
        if (parseFloat(popup.style.height) !== desiredHeight) {
            popup.style.height = `${desiredHeight}px`;
            // If popup is currently shown, adjust its transform to keep it anchored to bottom/top
            if (popup.style.transform === `translateY(0px)` || popup.style.transform === `translateY(${currentTranslateY}px)`) {
                // Only adjust transform if not hidden or actively dragging
                if (!isDraggingPopup) {
                    if (popupPosition === 'bottom') {
                        applyPopupTransform(0); // Anchor to bottom
                    } else {
                        applyPopupTransform(0); // Anchor to top
                    }
                }
            }
        }
    }


    /**
     * Fetches translation using Google Translate's public interface.
     * @param {string} text - The text to translate.
     * @param {string} targetLang - The target language code (e.g., 'zh-CN').
     * @returns {Promise<string>} A promise that resolves with the translated text, or rejects on error.
     */
    function fetchTranslation(text, targetLang) {
        return new Promise((resolve, reject) => {
            if (!text || text.trim() === '') {
                resolve('');
                return;
            }

            const url = `https://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // The translation is usually in the first element of the first array
                        if (data && data[0] && data[0][0] && data[0][0][0]) {
                            resolve(data[0][0][0]);
                        } else {
                            reject(new Error('Translation data not found in response.'));
                        }
                    } catch (e) {
                        reject(new Error(`Failed to parse translation response: ${e.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Translation request failed: ${error.statusText || error.responseText || 'Network Error'}`));
                }
            });
        });
    }

    /**
     * Displays the popup with the given sentence and fetches its translation.
     * @param {string} cleanedSentence - The cleaned sentence to display.
     * @param {HTMLElement} sourceElement - The DOM element where the sentence was found.
     * @param {string} rawSentenceToHighlight - The raw sentence text to highlight in the DOM.
     */
    async function showPopup(cleanedSentence, sourceElement, rawSentenceToHighlight) {
        if (!popup) {
            createPopup();
        }

        const contentArea = popup.querySelector('#sentence-popup-content');
        if (contentArea) {
            // Clear previous content
            contentArea.innerHTML = '';

            // Add original sentence
            const originalContentDiv = document.createElement('div');
            originalContentDiv.classList.add('original-content');
            originalContentDiv.textContent = cleanedSentence;
            originalContentDiv.style.marginBottom = '10px'; // Space between original and translation
            originalContentDiv.style.fontWeight = 'bold'; // Make original text stand out
            originalContentDiv.style.fontSize = '16px';
            contentArea.appendChild(originalContentDiv);

            // Add placeholder for translation
            const translationDiv = document.createElement('div');
            translationDiv.classList.add('translation-content'); // Class to exclude from "Select All"
            translationDiv.style.fontSize = '14px';
            translationDiv.style.color = '#b0b0b0'; // Muted color for translation
            translationDiv.textContent = 'Translating...';
            contentArea.appendChild(translationDiv);

            contentArea.scrollTop = 0; // Scroll to top when new content is shown
        }

        // Add placeholder for AI response
        let aiResponseDiv = contentArea.querySelector('.ai-response-content');
        if (!aiResponseDiv) {
            aiResponseDiv = document.createElement('div');
            aiResponseDiv.classList.add('ai-response-content');
            aiResponseDiv.style.marginTop = '10px';
            aiResponseDiv.style.fontSize = '14px';
            aiResponseDiv.style.color = '#c0c0c0';
            contentArea.appendChild(aiResponseDiv);
        }
        aiResponseDiv.innerHTML = ''; // Clear AI content for fresh load/cache check

        // Apply smooth transition to show popup
        popup.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s ease';
        // Set initial height to minimum, then adjust after content
        popup.style.height = `${window.innerHeight * MIN_POPUP_HEIGHT_RATIO}px`;
        applyPopupTransform(0); // Move popup into view (0 translation means fully visible)

        lastFoundSentence = rawSentenceToHighlight;
        lastRelevantElement = sourceElement;

        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';
        document.body.style.overscrollBehaviorY = 'contain';
        document.documentElement.style.overscrollBehaviorY = 'contain';

        highlightSourceText(rawSentenceToHighlight, sourceElement);
        adjustPopupHeight(); // Adjust height after adding original content and before translation/AI to fit minimal content

        // --- 【新功能】检查并自动显示缓存的AI内容 ---
        const prompt = getAIPrompt(cleanedSentence);
        const cacheKey = `${prompt}_${currentAIModel}`;
        const cachedAIResponse = getCachedAIResponse(cacheKey);

        if (cachedAIResponse) {
            // 如果找到缓存，直接显示
            aiResponseDiv.innerHTML = `<hr style="border-top: 1px solid #444444; margin: 10px 0;"><strong>AI Analysis (Cached - ${currentAIModel.split('/').pop()}):</strong><br>${formatAIResponse(cachedAIResponse)}`;
            contentArea.scrollTop = 0; // 滚动到顶部以显示内容
            adjustPopupHeight(); // 调整弹窗高度以适应AI内容
        }


        // Fetch and display translation
        try {
            const translatedText = await fetchTranslation(cleanedSentence, targetLanguage);
            const translationDiv = popup.querySelector('.translation-content');
            if (translationDiv) {
                translationDiv.innerHTML = `<span style="font-size: 12px; opacity: 0.8;">(${targetLanguage})</span><br>${translatedText}`;
            }
            adjustPopupHeight(); // Adjust height after translation
        } catch (error) {
            console.error('Translation failed:', error);
            const translationDiv = popup.querySelector('.translation-content');
            if (translationDiv) {
                translationDiv.textContent = `Translation failed: ${error.message}`;
                translationDiv.style.color = 'red';
            }
            adjustPopupHeight(); // Adjust height even on translation error
        }
    }

    /**
     * Hides the popup by animating it off-screen.
     */
    function hidePopup() {
        if (popup) {
            popup.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s ease';
            applyPopupTransform(popupPosition === 'bottom' ? parseFloat(popup.style.height) : -parseFloat(popup.style.height)); // Move popup off-screen based on its current height
            removeHighlight(); // Remove text highlighting
        }
        lastFoundSentence = null;
        lastRelevantElement = null;

        // Restore body scroll behavior
        document.body.style.overflow = '';
        document.body.style.overscrollBehaviorY = '';
        document.documentElement.style.overscrollBehaviorY = '';
    }

    /**
     * Highlights the source text in the DOM.
     * @param {string} sentenceToHighlight - The exact sentence string to highlight.
     * @param {HTMLElement} sourceElement - The containing element where the sentence resides.
     */
    function highlightSourceText(sentenceToHighlight, sourceElement) {
        removeHighlight(); // Clear any existing highlights

        if (!sourceElement || !sentenceToHighlight) return;

        // Inject highlight style if not present
        let highlightStyle = document.getElementById('sentence-highlight-style');
        if (!highlightStyle) {
            highlightStyle = document.createElement('style');
            highlightStyle.id = 'sentence-highlight-style';
            highlightStyle.textContent = `
                .sentence-highlight {
                    background-color: rgba(98, 179, 255, 0.3) !important; /* Brighter, flat blue highlight */
                    transition: background-color 0.3s ease !important;
                    box-shadow: 0 0 8px rgba(98, 179, 255, 0.4); /* Softer, matching glow */
                    border-radius: 3px; /* Slightly rounded corners for highlight */
                    padding: 1px 0; /* Small padding for visual separation */
                    pointer-events: none; /* Do not interfere with mouse events */
                    user-select: text;
                    -webkit-user-select: text;
                    -moz-user-select: text;
                    -ms-user-select: text;
                }
                @media (prefers-color-scheme: dark) {
                    .sentence-highlight {
                        background-color: rgba(60, 130, 200, 0.4) !important; /* Darker blue for dark mode */
                        box-shadow: 0 0 8px rgba(60, 130, 200, 0.5);
                    }
                }
            `;
            document.head.appendChild(highlightStyle);
        }

        // Traverse and map text nodes within the source element
        const traversalResult = {
            currentOffset: 0,
            parts: [],
            nodeMap: []
        };
        traverseAndMapText(sourceElement, traversalResult, null);
        const fullRawTextInElement = traversalResult.parts.join('');
        const nodeMap = traversalResult.nodeMap;

        let startIndexInRaw = -1;
        let endIndexInRaw = -1;

        // Try to find exact match first
        startIndexInRaw = fullRawTextInElement.indexOf(sentenceToHighlight);
        if (startIndexInRaw !== -1) {
            endIndexInRaw = startIndexInRaw + sentenceToHighlight.length;
        } else {
            // Fallback to cleaned text matching
            const cleanedTarget = cleanText(sentenceToHighlight);
            const cleanedFullText = cleanText(fullRawTextInElement);
            const cleanedStartIndex = cleanedFullText.indexOf(cleanedTarget);

            if (cleanedStartIndex !== -1) {
                let currentCleanedLen = 0;
                for (let i = 0; i < fullRawTextInElement.length; i++) {
                    const charRaw = fullRawTextInElement[i];
                    const charCleaned = cleanText(charRaw); // Clean individual character for length tracking
                    if (startIndexInRaw === -1 && currentCleanedLen >= cleanedStartIndex) {
                        startIndexInRaw = i;
                    }
                    if (currentCleanedLen >= (cleanedStartIndex + cleanedTarget.length)) {
                        endIndexInRaw = i;
                        break;
                    }
                    currentCleanedLen += charCleaned.length;
                }
                // If end not found (target extends to end of raw text)
                if (startIndexInRaw !== -1 && endIndexInRaw === -1) {
                    endIndexInRaw = fullRawTextInElement.length;
                }
            } else {
                // Fallback to partial match for robustness
                const firstFewChars = sentenceToHighlight.substring(0, Math.min(sentenceToHighlight.length, 20));
                const lastFewChars = sentenceToHighlight.substring(Math.max(0, sentenceToHighlight.length - 20));

                const firstMatch = fullRawTextInElement.indexOf(firstFewChars);
                const lastMatch = fullRawTextInElement.lastIndexOf(lastFewChars);
                if (firstMatch !== -1 && lastMatch !== -1 && lastMatch >= firstMatch) {
                    startIndexInRaw = firstMatch;
                    endIndexInRaw = lastMatch + lastFewChars.length;
                }
            }
        }

        if (startIndexInRaw === -1 || endIndexInRaw === -1 || startIndexInRaw >= endIndexInRaw) {
            console.warn("Could not find robust raw boundaries for sentence to highlight after all attempts:", sentenceToHighlight);
            return;
        }

        tryHighlightRange(sourceElement, nodeMap, startIndexInRaw, endIndexInRaw, sentenceToHighlight);
    }

    /**
     * Attempts to highlight a specific range of text within the DOM using `Range` and `surroundContents`.
     * @param {HTMLElement} sourceElement - The root element containing the text to highlight.
     * @param {Array<Object>} nodeMap - An array of {node, start, end} mappings for text nodes.
     * @param {number} startIndexInRaw - The starting character offset in the full raw text.
     * @param {number} endIndexInRaw - The ending character offset in the full raw text.
     * @param {string} originalSentenceToHighlight - The original sentence text for validation.
     */
    function tryHighlightRange(sourceElement, nodeMap, startIndexInRaw, endIndexInRaw, originalSentenceToHighlight) {
        let currentOffset = 0;
        let startNode = null;
        let startOffset = 0;
        let endNode = null;
        let endOffset = 0;

        // Find the specific text nodes and offsets corresponding to the raw text range
        for (const mapEntry of nodeMap) {
            const node = mapEntry.node;
            const nodeTextLength = (node.nodeValue || '').length;

            if (node.nodeType === Node.TEXT_NODE) {
                // Determine start node and offset
                if (startIndexInRaw >= currentOffset && startIndexInRaw < currentOffset + nodeTextLength) {
                    startNode = node;
                    startOffset = startIndexInRaw - currentOffset;
                }
                // Determine end node and offset
                if (endIndexInRaw > currentOffset && endIndexInRaw <= currentOffset + nodeTextLength) {
                    endNode = node;
                    endOffset = endIndexInRaw - currentOffset;
                }
            }
            currentOffset += nodeTextLength;

            if (startNode && endNode) {
                break; // Found both start and end
            }
        }

        // Edge case: If the end node wasn't found but the sentence extends to the end of a text node
        if (!endNode && originalSentenceToHighlight.length > 0) {
            for (let i = nodeMap.length - 1; i >= 0; i--) {
                const mapEntry = nodeMap[i];
                if (mapEntry.node.nodeType === Node.TEXT_NODE && mapEntry.start < endIndexInRaw) {
                    endNode = mapEntry.node;
                    endOffset = mapEntry.node.nodeValue.length; // Use full length of the node
                    break;
                }
            }
        }
        // Edge case: If only start node found (sentence within a single text node or at its end)
        if (startNode && !endNode) {
             endNode = startNode;
             endOffset = startNode.nodeValue.length; // Use full length if no specific end found
        }

        if (!startNode || !endNode || (startNode === endNode && startOffset === endOffset)) {
            console.error("Failed to find valid start/end nodes or range is empty for highlight.", {startNode, endNode, startOffset, endOffset});
            return;
        }

        try {
            const range = document.createRange();
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);

            const rangeText = range.toString();
            const cleanedRangeText = cleanText(rangeText);
            const cleanedOriginalSentence = cleanText(originalSentenceToHighlight);

            // Robust validation before highlighting
            const isSubstantiallyContained = (cleanedRangeText.includes(cleanedOriginalSentence) || cleanedOriginalSentence.includes(cleanedRangeText));
            const lengthDiff = Math.abs(cleanedRangeText.length - cleanedOriginalSentence.length);
            const isSimilarLength = lengthDiff <= 3; // Allow small differences in length

            if (isSubstantiallyContained || (isSimilarLength && cleanedRangeText.length > 0 && cleanedOriginalSentence.length > 0 && cleanedRangeText.includes(cleanedOriginalSentence.substring(0, Math.min(cleanedOriginalSentence.length, 10))))) {
                const highlightSpan = document.createElement('span');
                highlightSpan.classList.add('sentence-highlight');
                highlightSpan.setAttribute('translate', 'no');
                highlightSpan.classList.add('notranslate');

                // Check if the common ancestor is an inline element or a block element.
                // If it's a small, likely inline element, we can directly surround.
                // Otherwise, extract contents and wrap text nodes for better behavior in complex layouts.
                if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE &&
                    !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'ARTICLE', 'SECTION', 'ASIDE', 'BODY', 'HTML'].includes(range.commonAncestorContainer.tagName.toUpperCase())) {
                    range.surroundContents(highlightSpan);
                    highlightedElements.push(highlightSpan);
                } else {
                    // For block-level or complex structures, extract content and wrap text nodes individually
                    const fragment = range.extractContents();
                    const textNodesToWrap = [];

                    const walker = document.createTreeWalker(
                        fragment,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    let node;
                    while ((node = walker.nextNode())) {
                        textNodesToWrap.push(node);
                    }

                    if (textNodesToWrap.length > 0) {
                        // Create a single span to wrap all relevant text nodes
                        const outerSpan = document.createElement('span');
                        outerSpan.classList.add('sentence-highlight');
                        outerSpan.setAttribute('translate', 'no');
                        outerSpan.classList.add('notranslate');

                        textNodesToWrap.forEach(tn => {
                            outerSpan.appendChild(tn.cloneNode(true)); // Append clone to avoid detaching
                        });

                        range.insertNode(outerSpan); // Insert the new span back into the document
                        highlightedElements.push(outerSpan);
                    } else {
                        range.insertNode(fragment); // If no text nodes, re-insert the fragment as is
                        console.error("Highlighting: Could not find text nodes within extracted range to wrap.");
                    }
                }

            } else {
                console.warn("Range text does not match sentence after cleaning or is not substantially contained. Skipping highlight:", {
                    original: originalSentenceToHighlight,
                    rangeText: rangeText,
                    cleanedOriginal: cleanedOriginalSentence,
                    cleanedRange: cleanedRangeText,
                    isSubstantiallyContained: isSubstantiallyContained,
                    isSimilarLength: isSimilarLength
                });
            }

        } catch (e) {
            console.error("Error highlighting sentence with Range API, likely due to complex DOM structure or invalid range. Details:", e);
        }
    }

    /**
     * Removes all current highlights from the DOM and cleans up.
     */
    function removeHighlight() {
        let needsNormalization = new Set(); // Keep track of parent nodes that need normalization
        highlightedElements.forEach(span => {
            if (span.parentNode) {
                const parent = span.parentNode;
                const fragment = document.createDocumentFragment();
                while (span.firstChild) {
                    fragment.appendChild(span.firstChild); // Move children out of the span
                }
                try {
                    parent.replaceChild(fragment, span); // Replace the span with its children
                    needsNormalization.add(parent);
                } catch (e) {
                    console.warn("Error replacing highlight span with fragment, parent or span might be detached:", e);
                }
            }
        });
        highlightedElements = []; // Clear the array

        // Normalize text nodes in affected parents to merge adjacent text nodes
        needsNormalization.forEach(parent => {
            if (parent && parent.normalize) {
                try {
                    parent.normalize();
                } catch (e) {
                    console.warn("Error normalizing parent node after highlight removal:", e);
                }
            }
        });

        // Remove the injected highlight style
        const style = document.getElementById('sentence-highlight-style');
        if (style) {
            style.remove();
        }
    }

    /**
     * Removes the entire popup element from the DOM.
     */
    function removePopup() {
        if (popup) {
            popup.remove();
            popup = null;
        }
        removeHighlight();
    }

    /**
     * Traverses the DOM tree to extract text content and map it back to its original text nodes.
     * Excludes elements based on Immersion Translate classes and general hidden/scripting elements.
     * @param {Node} node - The current node being traversed.
     * @param {Object} result - An object to store traversal results (parts: text chunks, nodeMap: text node to offset mapping).
     * @param {Node} lastVisitedNode - The last node visited in the traversal (for handling separators).
     * @returns {Node} The last node visited in the current branch of traversal.
     */
    function traverseAndMapText(node, result, lastVisitedNode) {
        if (!node || node.nodeType === Node.COMMENT_NODE) {
            return lastVisitedNode;
        }

        // --- Element Node Handling ---
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName ? node.tagName.toUpperCase() : '';

            // Immersion Translate Exclusion Logic (Prioritized)
            if (node.classList.contains(IMMERSION_TRANSLATE_TARGET_TEXT_CLASS) ||
                IMMERSION_TRANSLATE_UI_CLASSES.some(cls => node.classList.contains(cls)) ||
                node.getAttribute('translate') === 'no' || node.classList.contains('notranslate')) {
                return lastVisitedNode; // Skip this element and its children
            }

            // General DOM Traversal Filtering (elements that don't contain meaningful text)
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'IMG', 'VIDEO', 'AUDIO', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'HEAD', 'HTML', 'BODY'].includes(tagName)) {
                return lastVisitedNode;
            }
            try { // Check computed style for display/visibility (can throw for cross-origin iframes)
                const computedStyle = window.getComputedStyle(node);
                if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                    return lastVisitedNode;
                }
            } catch (e) { /* ignore error, continue traversal */ }

            // Add separators between block/inline elements for better sentence segmentation
            let separatorBefore = '';
            const isBlockElement = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'ARTICLE', 'SECTION', 'ASIDE', 'HEADER', 'FOOTER', 'MAIN', 'NAV', 'UL', 'OL', 'FORM', 'ADDRESS'].includes(tagName);
            const isLineBreak = ['BR'].includes(tagName);
            // Inline elements are those not typically block-level and not explicitly skipped
            const isInlineElement = !isBlockElement && !isLineBreak && !['IMG', 'BUTTON', 'INPUT'].includes(tagName);

            if (isBlockElement || isLineBreak) {
                if (result.parts.length > 0 && result.parts[result.parts.length - 1].slice(-1) !== '\n') {
                    separatorBefore = '\n'; // Add newline before block/line-break elements
                }
            } else if (isInlineElement) {
                // Add space between inline elements unless already a space or newline
                if (result.parts.length > 0 && !/\s|\n/.test(result.parts[result.parts.length - 1].slice(-1))) {
                    separatorBefore = ' ';
                }
            }

            if (separatorBefore) {
                result.parts.push(separatorBefore);
                result.currentOffset += separatorBefore.length;
            }

            // Special handling for Immersion Translate sentence wrappers: prioritize original text
            if (node.classList.contains(IMMERSION_TRANSLATE_SENTENCE_WRAP_CLASS)) {
                const originalTextChild = node.querySelector(`.${IMMERSION_TRANSLATE_ORIGINAL_TEXT_CLASS}`);
                if (originalTextChild) {
                    lastVisitedNode = traverseAndMapText(originalTextChild, result, lastVisitedNode);
                } else {
                    // If no explicit original text child, traverse all children, but be careful of translations
                    for (let i = 0; i < node.childNodes.length; i++) {
                        lastVisitedNode = traverseAndMapText(node.childNodes[i], result, lastVisitedNode);
                    }
                }
            } else {
                // Normal traversal for other elements
                for (let i = 0; i < node.childNodes.length; i++) {
                    lastVisitedNode = traverseAndMapText(node.childNodes[i], result, lastVisitedNode);
                }
            }

            // Recursively traverse Shadow DOM if present
            if (node.shadowRoot) {
                for (let i = 0; i < node.shadowRoot.childNodes.length; i++) {
                    lastVisitedNode = traverseAndMapText(node.shadowRoot.childNodes[i], result, lastVisitedNode);
                }
            }

            let separatorAfter = '';
            if (isBlockElement) {
                 if (result.parts.length > 0 && result.parts[result.parts.length - 1].slice(-1) !== '\n') {
                     separatorAfter = '\n';
                 }
            }

            if (separatorAfter) {
                result.parts.push(separatorAfter);
                result.currentOffset += separatorAfter.length;
            }
            return node; // Return the current node as the last visited for its children
        } else if (node.nodeType === Node.TEXT_NODE) {
            // --- Text Node Handling ---
            // Check parent elements for Immersion Translate specific classes or `translate="no"`
            let parent = node.parentNode;
            while(parent && parent.nodeType === Node.ELEMENT_NODE) {
                if (parent.classList.contains(IMMERSION_TRANSLATE_TARGET_TEXT_CLASS) ||
                    IMMERSION_TRANSLATE_UI_CLASSES.some(cls => parent.classList.contains(cls)) ||
                    parent.getAttribute('translate') === 'no' || parent.classList.contains('notranslate')) {
                    return lastVisitedNode; // Skip text node if within an excluded parent
                }
                if (parent.classList.contains(IMMERSION_TRANSLATE_SENTENCE_WRAP_CLASS)) {
                    const isOriginalChild = parent.querySelector(`.${IMMERSION_TRANSLATE_ORIGINAL_TEXT_CLASS}`);
                    if (isOriginalChild && !isOriginalChild.contains(node)) {
                         return lastVisitedNode; // Skip if it's a non-original text child within a wrapper
                    }
                }
                parent = parent.parentNode;
            }

            const textValue = node.nodeValue || '';
            // Skip empty or very short whitespace-only text nodes
            if (textValue.trim().length === 0 && textValue.length < 5) {
                return lastVisitedNode;
            }

            const start = result.currentOffset;
            const end = start + textValue.length;
            result.parts.push(textValue);
            result.nodeMap.push({ node: node, start: start, end: end }); // Map text node to its offset range
            result.currentOffset = end;
            return node;
        }
        return lastVisitedNode; // Return the last visited node for non-element/text nodes
    }

    /**
     * Cleans and normalizes text by removing unwanted characters, tags, and excessive whitespace.
     * @param {string} text - The input text to clean.
     * @returns {string} The cleaned text.
     */
    function cleanText(text) {
        const cleaned = text
            .replace(/\{[^}]*\}/g, '') // Remove curly brace content (e.g., dictionary entries)
            .replace(/<[^>]*>/g, '')   // Remove HTML tags
            .replace(/\[[^\]]*\]/g, '') // Remove square bracket content
            .replace(/[{}[\]<>]/g, '')  // Remove remaining brackets
            .replace(/[@#$%^&*+=\\]/g, '') // Remove special symbols
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces and similar
            .replace(/\s+/g, ' ')      // Replace multiple whitespace with single space
            .trim();                   // Trim leading/trailing whitespace
        return cleaned;
    }

    /**
     * Validates if a given text chunk is likely a meaningful sentence.
     * @param {string} text - The text to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    function isValidSentence(text) {
        text = text.trim();
        if (text.length < 10 || text.length > 1000) return false; // Length constraints
        if (!/[a-zA-Z]/.test(text)) return false; // Must contain letters
        if (/\d{4,}/.test(text)) return false; // Avoid large numbers (e.g., years)
        if (/^https?:\/\/\S+/.test(text)) return false; // Avoid URLs
        // Avoid code snippets or technical jargon if very short
        if (/\b(?:img|src|alt|data|aria|class|id|function|var|const|let|return|document|window)\b/i.test(text) && text.length < 100) return false;
        if (/^[\d\s.,;:'"?!-]+$/.test(text)) return false; // Avoid text that's mostly punctuation/numbers

        // Check alphanumeric character ratio
        const alphaNumCount = (text.match(/[a-zA-Z0-9]/g) || []).length;
        const totalCharCount = text.length;
        if (totalCharCount > 0 && (alphaNumCount / totalCharCount < 0.3)) return false;

        // Too many newlines in short text might indicate code or formatting issues
        if ((text.match(/\n/g) || []).length > 2 && text.length < 100) return false;

        return true;
    }

    /**
     * Finds the most relevant text container element for a given starting element.
     * It tries to find a parent element that likely holds a complete sentence.
     * @param {HTMLElement} startElement - The element from which to start searching up the DOM tree.
     * @returns {HTMLElement|null} The most relevant text container, or null if none found.
     */
    function findRelevantTextContainer(startElement) {
        let current = startElement;
        let bestCandidate = startElement; // Initialize with the starting element
        const maxDepth = 10; // Limit search depth to prevent traversing entire DOM

        for (let i = 0; i < maxDepth && current; i++) {
            // Immersion Translate & `translate="no"` exclusion during ancestor search
            if (current.classList && (
                current.classList.contains(IMMERSION_TRANSLATE_TARGET_TEXT_CLASS) ||
                IMMERSION_TRANSLATE_UI_CLASSES.some(cls => current.classList.contains(cls))
            )) {
                current = current.parentElement || (current.getRootNode && current.getRootNode().host);
                continue; // Skip this branch and move up
            }
             if (current.getAttribute && (current.getAttribute('translate') === 'no' || current.classList.contains('notranslate'))) {
                current = current.parentElement || (current.getRootNode && current.getRootNode().host);
                continue; // Skip this branch and move up
            }

            const tagName = current.tagName ? current.tagName.toUpperCase() : '';

            // Prioritize common text-containing block/inline elements
            if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'ARTICLE', 'SECTION', 'ASIDE', 'SPAN', 'A', 'STRONG', 'EM', 'PRE', 'CODE'].includes(tagName)) {
                const textContentLength = (current.textContent || '').length;
                const childElementCount = current.children ? current.children.length : 0;

                // Strong candidate: if it contains an Immersion Translate original text child and is visible
                if (current.querySelector(`.${IMMERSION_TRANSLATE_ORIGINAL_TEXT_CLASS}`)) {
                    try {
                        const computedStyle = window.getComputedStyle(current);
                        if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
                            return current;
                        }
                    } catch (e) { /* ignore */ }
                }

                // Heuristic for general text containers: decent text length, not too many children (i.e., not just a wrapper for many small elements)
                if (textContentLength > 20 && textContentLength < 5000 && childElementCount < textContentLength / 10) {
                    try {
                        const computedStyle = window.getComputedStyle(current);
                        if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
                            return current;
                        }
                    } catch (e) { /* ignore */ }
                }
            }

            // Always keep track of the most recent non-skipped element as a fallback
            if (current.nodeType === Node.ELEMENT_NODE && (current.textContent || '').trim().length > 0 &&
                !['SCRIPT', 'STYLE', 'NOSCRIPT', 'HEAD', 'BR', 'HR', 'IMG', 'BUTTON', 'INPUT', 'SVG', 'HEADER', 'FOOTER', 'NAV'].includes(tagName)) {
                bestCandidate = current;
            }

            current = current.parentElement || (current.getRootNode && current.getRootNode().host); // Move up to parent or shadow host
        }
        return bestCandidate;
    }

    /**
     * Extracts a full sentence from a given text string around a specific character index.
     * @param {string} text - The full text content of a relevant container.
     * @param {number} charIndex - The character index within the text to start sentence detection.
     * @returns {string|null} The extracted sentence, or null if no valid sentence is found.
     */
    function findSentenceInText(text, charIndex) {
        if (!text || text.length === 0 || charIndex < 0 || charIndex >= text.length) {
            return null;
        }

        const abbreviations = [
            "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Sr.", "Jr.", "Capt.", "Col.", "Gen.", "Lt.",
            "e.g.", "i.e.", "etc.", "vs.", "approx.", "fig.", "Jan.", "Feb.", "Mar.", "Apr.",
            "Aug.", "Sept.", "Oct.", "Nov.", "Dec.", "St.", "Ave.", "Rd.", "Blvd.", "P.S.",
            "U.S.", "U.K.", "Inc.", "Corp.", "Ltd.", "Co.", "Assoc.", "Vol.", "No.", "etc."
        ];

        // Helper to check if a substring ends with an abbreviation
        const isAbbreviationCheck = (subText) => {
            const wordMatch = subText.match(/\b([A-Za-z.]+)\.?$/); // Find last word-like sequence
            if (wordMatch && wordMatch[1]) {
                const word = wordMatch[1];
                // Check if it's a known abbreviation (case-insensitive)
                return abbreviations.some(abbr => abbr.toLowerCase() === word.toLowerCase());
            }
            return false;
        };

        let sentenceStart = -1;
        let sentenceEnd = -1;

        // Find sentence end by looking forward from charIndex
        for (let i = charIndex; i < text.length; i++) {
            const char = text[i];
            if (/[.!?]/.test(char)) { // Punctuation that typically ends sentences
                // Handle common exceptions: ellipses, numbers, abbreviations
                if (char === '.' && (
                    (i < text.length - 2 && text[i+1] === '.' && text[i+2] === '.') || // Ellipses "..."
                    (i < text.length - 1 && /\d/.test(text[i+1])) || // Numbers "1.23"
                    (i > 0 && /\d/.test(text[i-1]) && i < text.length - 1 && /\d/.test(text[i+1])) || // "1. 2"
                    isAbbreviationCheck(text.substring(0, i + 1)) // Abbreviation like "Mr."
                )) {
                    continue; // Not a sentence end, skip
                }

                let nextCharIndex = i + 1;
                while (nextCharIndex < text.length && /\s/.test(text[nextCharIndex])) {
                    nextCharIndex++; // Skip whitespace after punctuation
                }

                // If end of text, or next char is uppercase (start of new sentence), or newline
                if (nextCharIndex >= text.length || /[A-Z]/.test(text[nextCharIndex]) || text[nextCharIndex] === '\n') {
                    sentenceEnd = i + 1;
                    break;
                }
            } else if (char === '\n') { // Consider double newline as a sentence break
                if (i > 0 && /\n\s*\n/.test(text.substring(i -1, i + 2))) { // Detect `\n\s*\n`
                    sentenceEnd = i + 1;
                    break;
                }
            }
        }

        if (sentenceEnd === -1) {
            sentenceEnd = text.length; // If no end punctuation found, assume end of text
        }

        // Adjust search starting point for finding sentence start
        let searchFrom = charIndex;
        if (sentenceEnd !== -1 && charIndex >= sentenceEnd) {
             searchFrom = sentenceEnd - 1; // If charIndex is past sentence end, search back from there
        }
        searchFrom = Math.max(0, Math.min(text.length - 1, searchFrom)); // Clamp to valid index

        // Find sentence start by looking backward from charIndex (or adjusted searchFrom)
        for (let i = searchFrom; i >= 0; i--) {
            const char = text[i];
            if (/[.!?]/.test(char)) { // Punctuation that typically ends sentences
                 // Apply same abbreviation/number checks as for sentence end
                 if (char === '.' && (
                    (i < text.length - 2 && text[i+1] === '.' && text[i+2] === '.') ||
                    (i < text.length - 1 && /\d/.test(text[i+1]) && /\d/.test(text[i-1])) || // "1.2"
                    isAbbreviationCheck(text.substring(0, i + 1))
                )) {
                    continue;
                }

                let potentialSentenceStart = i + 1;
                while (potentialSentenceStart < text.length && /\s/.test(text[potentialSentenceStart])) {
                    potentialSentenceStart++;
                }
                // If next char is uppercase, it's a good candidate for sentence start
                if (potentialSentenceStart < text.length && /[A-Z]/.test(text[potentialSentenceStart])) {
                    sentenceStart = potentialSentenceStart;
                    break;
                }
            } else if (char === '\n') { // Consider double newline as a sentence break
                if (i > 0 && /\n\s*\n/.test(text.substring(i -1, i + 2))) {
                    let potentialSentenceStart = i + 1;
                    while (potentialSentenceStart < text.length && /\s/.test(text[potentialSentenceStart])) {
                        potentialSentenceStart++;
                    }
                    // If next char is alphanumeric, it's a good candidate for sentence start after a paragraph break
                    if (potentialSentenceStart < text.length && /[A-Za-z0-9]/.test(text[potentialSentenceStart])) {
                        sentenceStart = potentialSentenceStart;
                        break;
                    }
                }
            }
        }

        if (sentenceStart === -1) {
            sentenceStart = 0; // If no start punctuation found, assume beginning of text
            while (sentenceStart < text.length && /\s/.test(text[sentenceStart])) sentenceStart++; // Skip leading whitespace
        }

        let resultSentence = text.substring(sentenceStart, sentenceEnd).trim();

        // Final validation: if the result is not a valid sentence, try splitting by common delimiters
        if (!isValidSentence(cleanText(resultSentence))) {
            // Split text into potential sentences using more robust regex
            const sentences = text.split(/(?<=[.!?])(?=\s*[A-Z]|\n\s*\n\s*)/g)
                                .map(s => s.trim())
                                .filter(s => s.length > 0);

            let currentOffset = 0;
            for (const s of sentences) {
                // Check if the character index falls within this potential sentence
                if (charIndex >= currentOffset && charIndex <= currentOffset + s.length) {
                    if (isValidSentence(cleanText(s))) {
                        return s; // Return the first valid sentence found
                    }
                    break; // If current segment is invalid, stop searching
                }
                currentOffset += s.length;

                // Account for the separator length when updating offset
                const separatorMatch = text.substring(currentOffset).match(/^((?<=[.!?])(?=\s*[A-Z]|\n\s*\n\s*))/);
                if (separatorMatch) {
                    currentOffset += separatorMatch[0].length;
                }
            }
            return null; // No valid sentence found
        }

        return resultSentence;
    }

    /**
     * Identifies the sentence at the specified screen coordinates (x, y).
     * @param {number} x - The X coordinate.
     * @param {number} y - The Y coordinate.
     * @returns {Object|null} An object containing the cleaned and raw sentence, and its element, or null.
     */
    function getSentenceAtPoint(x, y) {
        let targetElement = document.elementFromPoint(x, y);
        if (!targetElement) {
            return null;
        }

        // Exclude interaction with popup or highlight elements
        if (targetElement.id === 'sentence-swipe-popup' || targetElement.closest('#sentence-swipe-popup') ||
            targetElement.classList.contains('sentence-highlight')) {
            return null;
        }

        const relevantElement = findRelevantTextContainer(targetElement);
        if (!relevantElement) {
            return null;
        }

        // Get full raw text and node map for the relevant element
        const traversalResult = {
            currentOffset: 0,
            parts: [],
            nodeMap: []
        };
        traverseAndMapText(relevantElement, traversalResult, null);
        const rawFullText = traversalResult.parts.join('');
        const nodeMap = traversalResult.nodeMap;

        if (rawFullText.trim().length === 0) {
             return null;
        }

        let caretNode = null;
        let caretOffset = -1;

        // Use `caretPositionFromPoint` or `caretRangeFromPoint` for precise character index
        try {
            if (document.caretPositionFromPoint) {
                const pos = document.caretPositionFromPoint(x, y);
                if (pos && pos.offsetNode) {
                    caretNode = pos.offsetNode;
                    caretOffset = pos.offset;
                }
            } else if (document.caretRangeFromPoint) {
                const range = document.caretRangeFromPoint(x, y);
                if (range && range.startContainer) {
                    caretNode = range.startContainer;
                    caretOffset = range.startOffset;
                }
            }
        } catch (e) {
            console.warn("Error getting caret position from point:", e);
        }

        let charIndexInRawText = -1;
        if (caretNode && caretOffset !== -1) {
            let foundNodeMapping = false;
            for (const mapEntry of nodeMap) {
                // If caretNode is the mapped text node or contained within it
                if (mapEntry.node === caretNode || (mapEntry.node.contains && mapEntry.node.contains(caretNode))) {
                    if (caretNode.nodeType === Node.TEXT_NODE) {
                        charIndexInRawText = mapEntry.start + caretOffset;
                    } else {
                        // If caretNode is an element node, try to infer offset by measuring text content up to caret
                        try {
                            const tempRange = document.createRange();
                            tempRange.setStart(mapEntry.node, 0); // Start from beginning of mapped node
                            tempRange.setEnd(caretNode, caretOffset); // End at caret position
                            charIndexInRawText = mapEntry.start + tempRange.toString().length;
                        } catch (e) {
                            // Fallback if range creation fails
                            charIndexInRawText = mapEntry.start + Math.floor(mapEntry.node.textContent.length / 2);
                        }
                    }
                    foundNodeMapping = true;
                    break;
                }
            }

            // If caretNode wasn't directly in the map, try to calculate its offset relative to the relevantElement
            if (!foundNodeMapping) {
                try {
                    const tempRange = document.createRange();
                    tempRange.setStart(relevantElement, 0);
                    tempRange.setEnd(caretNode, caretOffset);
                    charIndexInRawText = tempRange.toString().length;
                } catch (e) {
                    console.error("Critical: Failed to estimate char index from relevantElement start.", e);
                    charIndexInRawText = Math.floor(rawFullText.length / 2); // Last resort fallback
                }
            }

        } else {
            // Fallback if caret position API is not available or fails: use TreeWalker
            const treeWalker = document.createTreeWalker(
                relevantElement,
                NodeFilter.SHOW_TEXT,
                { acceptNode: (node) => {
                    const rect = node.parentElement ? node.parentElement.getBoundingClientRect() : node.getBoundingClientRect();
                    // Check if the point falls within the bounding box of the text node's parent
                    if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }},
                false
            );

            let textNodeAtPoint = null;
            while((textNodeAtPoint = treeWalker.nextNode())) {
                for (const mapEntry of nodeMap) {
                    if (mapEntry.node === textNodeAtPoint) {
                        // Estimate char index as middle of the text node if precise offset is unknown
                        charIndexInRawText = mapEntry.start + Math.floor(textNodeAtPoint.nodeValue.length / 2);
                        break;
                    }
                }
                if (charIndexInRawText !== -1) break;
            }

            if (charIndexInRawText === -1) {
                charIndexInRawText = Math.floor(rawFullText.length / 2); // Default to middle of text if no specific text node found
            }
        }

        // Clamp charIndex to valid range
        charIndexInRawText = Math.max(0, Math.min(rawFullText.length - 1, charIndexInRawText));

        const extractedSentenceRaw = findSentenceInText(rawFullText, charIndexInRawText);

        if (extractedSentenceRaw && isValidSentence(cleanText(extractedSentenceRaw))) {
            return {
                cleanedSentence: cleanText(extractedSentenceRaw),
                rawSentence: extractedSentenceRaw,
                element: relevantElement
            };
        }

        return null;
    }

    // --- Touch Event Variables ---
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwipeDetected = false;
    let isTextSelectionActive = false; // Flag to avoid triggering swipe on text selection

    // --- Global Event Listeners ---

    // Monitor text selection to avoid conflicts
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        // Check if there's a selection and it's not within our popup
        isTextSelectionActive = selection && selection.toString().length > 0 && selection.anchorNode !== popup && (!popup || !popup.contains(selection.anchorNode));
    });

    // Touch Start Listener: Initialize swipe tracking
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            isSwipeDetected = false; // Reset for each new touch start
        }
    }, { passive: true }); // Use passive: true as we won't prevent default initially

    // Touch Move Listener: Detect swipe gesture
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && !isDraggingPopup && !isSwipeDetected && !isTextSelectionActive) {
            // Do not trigger swipe if interacting with the popup itself or a highlight
            if (popup && (e.target.id === 'sentence-swipe-popup' || e.target.closest('#sentence-swipe-popup') || e.target.classList.contains('sentence-highlight'))) {
                return;
            }

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = Math.abs(touch.clientY - touchStartY); // Absolute Y movement
            const deltaTime = Date.now() - touchStartTime;

            // Define swipe thresholds: significant leftward movement, small vertical movement, quick action
            const SWIPE_THRESHOLD_X = -30; // Minimum leftward pixels
            const SWIPE_THRESHOLD_Y = 40; // Maximum vertical deviation
            const SWIPE_TIME_LIMIT = 800; // Maximum time for the swipe

            if (deltaX < SWIPE_THRESHOLD_X && deltaY < SWIPE_THRESHOLD_Y && deltaTime < SWIPE_TIME_LIMIT) {
                isSwipeDetected = true; // Mark as swipe detected

                const result = getSentenceAtPoint(touchStartX, touchStartY);
                if (result && result.cleanedSentence) {
                    showPopup(result.cleanedSentence, result.element, result.rawSentence);
                    if (navigator.vibrate) {
                        navigator.vibrate(30); // Haptic feedback
                    }
                    e.preventDefault(); // Prevent default browser action (e.g., back navigation)
                } else {
                    isSwipeDetected = false; // Reset if no valid sentence found
                }
            }
        }
    }, { passive: false }); // Needs to be non-passive to allow `e.preventDefault()`

    // Touch End Listener: Reset swipe state
    document.addEventListener('touchend', function(e) {
        isSwipeDetected = false;
        isTextSelectionActive = false; // Reset selection flag
    });

    // Double-click to close popup
    document.addEventListener('dblclick', function(e) {
        if (popup && popup.style.transform === `translateY(0px)`) { // Check if popup is currently visible
            if (!popup.contains(e.target)) { // If double-clicked outside the popup
                hidePopup();
            }
        }
    });

    // New: Click outside popup to hide it
    document.addEventListener('click', function(e) {
        // Check if the popup exists and is visible
        if (popup && popup.style.transform === `translateY(0px)`) {
            // Check if the click target is NOT the popup itself AND NOT a descendant of the popup
            if (!popup.contains(e.target) && e.target !== popup) {
                hidePopup();
            }
        }
    });


    // Dark mode change listener: Update popup styles dynamically (now pure black)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (popup) {
                const contentArea = popup.querySelector('#sentence-popup-content');
                const aiButton = popup.querySelector('#sentence-popup-controls button');
                const selectAllButton = popup.querySelector('#sentence-popup-controls button:last-of-type');
                const dragHandle = popup.querySelector('div');
                const translationDiv = contentArea.querySelector('.translation-content');

                // Apply pure black theme regardless of dark mode preference
                popup.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
                popup.style.color = '#ffffff';
                popup.style.borderTopColor = '#333333';
                if (dragHandle) {
                    dragHandle.style.backgroundColor = '#666666';
                }
                if (aiButton) {
                    aiButton.style.backgroundColor = '#4a7bed';
                    aiButton.style.color = '#ffffff';
                }
                if (selectAllButton) {
                    selectAllButton.style.backgroundColor = '#555555';
                    selectAllButton.style.color = '#e0e0e0';
                }
                if (translationDiv) {
                    translationDiv.style.color = '#b0b0b0';
                }
                const hrElement = contentArea.querySelector('hr');
                if (hrElement) {
                    hrElement.style.borderTopColor = '#444444';
                }
                const aiResponseContent = contentArea.querySelector('.ai-response-content');
                if (aiResponseContent) {
                    aiResponseContent.style.color = '#c0c0c0';
                }
            }
        });
    }

    // Cleanup: Remove popup on page unload
    window.addEventListener('beforeunload', function() {
        removePopup();
    });

    // Auto-hide popup on scroll (if popup is fully visible)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // If popup is currently fully visible (or nearly so, within 5px from its shown position)
            if (popup && Math.abs(currentTranslateY) < 5) {
                 hidePopup();
            }
        }, 300); // Debounce scroll event for performance
    }, { passive: true }); // Passive as we only read scroll position

    // Ensure only one instance of the popup exists if script is run multiple times
    const existingPopup = document.getElementById('sentence-swipe-popup');
    if (existingPopup) {
        existingPopup.remove();
        console.warn("Removed an existing instance of the sentence swipe popup to prevent duplicates.");
    }

    // Register Tampermonkey menu commands on script load
    registerMenuCommands();

})();
