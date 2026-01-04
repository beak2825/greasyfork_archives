// ==UserScript==
// @name         AI Fuck CC Enhanced Tools (v1.1 - Integrated Simplify Button)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license GPL-3.0
// @description  Combines AI Reply Simplification (last 1-2, visual & API) with a Draggable/Resizable Floating AI Assistant Panel. Simplify button integrated into panel header.
// @author       Shiroi Neko
// @match        https://aifuck.cc/*
// @match        https://aifuck.cc/explore/installed/* // Ensure both patterns are covered
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aifuck.cc
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      aifuck.cc // Needed for API calls
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534171/AI%20Fuck%20CC%20Enhanced%20Tools%20%28v11%20-%20Integrated%20Simplify%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534171/AI%20Fuck%20CC%20Enhanced%20Tools%20%28v11%20-%20Integrated%20Simplify%20Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & Constants ---
    const SCRIPT_NAME = 'AI Fuck CC Enhanced Tools (v1.1 - Integrated)';
    const DEBUG = false; // Set true for detailed console logs

    // --- General ---
    const LOCALSTORAGE_TOKEN_KEY = 'console_token';
    const CHAT_INPUT_SELECTOR = '#ai-chat-input';
    const AI_MESSAGE_SELECTOR = '#ai-chat-answer'; // Used by both features

    // --- Simplify Feature ---
    const SIMPLIFY_BUTTON_ID = 'simplify-ai-button'; // Keep ID for potential targeting
    // const SIMPLIFY_BUTTON_TEXT = '简化对话信息'; // Text is now part of title/icon
    const LOCALSTORAGE_CONVERSATION_MAP_KEY = 'conversationIdInfo';
    const SIMPLIFY_CONTENT_CONTAINER_SELECTOR = '.undefined.markdown-body';
    const SIMPLIFY_SELECTORS_TO_REMOVE_LATEST = 'details.thinking, details.statusbar';
    const SIMPLIFY_SELECTORS_TO_REMOVE_SECOND_LATEST = 'details.optionsarea, details.memoryarea, details.thinking, details.statusbar';
    const SIMPLIFY_API_BASE_URL = 'https://aifuck.cc/console/api/installed-apps/';
    const SIMPLIFIED_MARK_CLASS = 'script-simplified-mark'; // Class for visual mark

    // --- Floating Panel Feature ---
    const PANEL_ID = 'ai-helper-panel-afcc-merged-v1'; // Keep same panel ID
    const PANEL_CHAT_CONTAINER_SELECTOR = '.mx-auto.pt-24.w-full.max-w-\\[720px\\].px-4.relative';
    const PANEL_INTEGRAL_TEXT_PATTERN = /消耗\s*\d+\s*积分/;
    const PANEL_OPTION_BRACKET_PATTERN = /\[(.*?)\]/;
    const PANEL_SECTIONS_TO_EXTRACT = [
        { title: '记忆区', class: 'memoryarea', required: true },
        { title: '状态栏', class: 'statusbar', required: false },
        { title: '选项区', class: 'optionsarea', required: true, clickable: true }
    ];
    const PANEL_COLLAPSED_TAG_WIDTH = '50px';
    const PANEL_COLLAPSED_TAG_HEIGHT = '28px';
    const PANEL_MIN_WIDTH = 200;
    const PANEL_MIN_HEIGHT = 150;
    const PANEL_GM_POS_KEY = 'panelPosition_merged_v1';
    const PANEL_GM_SIZE_KEY = 'panelSize_merged_v1';
    const PANEL_GM_COLLAPSED_KEY = 'panelCollapsed_merged_v1';

    // --- State Variables ---
    // (Same as before)
    let panelIsDragging = false;
    let panelIsResizing = false;
    let panelOffsetX, panelOffsetY;
    let panelStartResizeX, panelStartResizeY, panelInitialWidth, panelInitialHeight;
    let panelCollapsed = GM_getValue(PANEL_GM_COLLAPSED_KEY, false);
    let panelPos = GM_getValue(PANEL_GM_POS_KEY, { top: '20px', right: '20px', left: 'auto', bottom: 'auto' });
    let panelSize = GM_getValue(PANEL_GM_SIZE_KEY, { width: '320px', height: 'auto' });
    let panelMainObserver = null;
    let panelContentObserver = null;
    let panelWatchingAiNode = null;
    let panelLatestFullyLoadedAiNode = null;
    let panelObserverRetryCount = 0;
    const PANEL_MAX_OBSERVER_RETRIES = 5;

    // UI Elements (defined later)
    let panel = null;
    let panelHeader = null;
    let panelHeaderTitle = null;
    let panelContentArea = null;
    let panelResizeHandle = null;
    let panelRefreshButton = null;
    let panelToggleCollapseButton = null;
    // Simplify Button element reference (can be null if not on correct page)
    let simplifyButtonElement = null;

    // --- Helper Functions ---
    const log = (...args) => DEBUG && console.log(`[${SCRIPT_NAME}]`, ...args);
    const logInfo = (...args) => console.log(`[${SCRIPT_NAME} INFO]`, ...args);
    const logError = (...args) => console.error(`[${SCRIPT_NAME} ERROR]`, ...args);

    // ==--- Simplify Feature Logic ---==
    // (getAuthToken, getAppId, getConversationId, fetchMessages, updateMessageApi, extractSimplifiedContent, updatePageElementVisuals remain IDENTICAL to the previous merged version)
    function simplify_getAuthToken() { /* ... (same as v1.0 merged) ... */
        const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
        if (!token) { logError('Simplify: Token not found:', LOCALSTORAGE_TOKEN_KEY); return null; }
        const finalToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        log('Simplify: Token found:', finalToken.substring(0, 20) + '...');
        return finalToken;
     }
    function simplify_getAppId() { /* ... (same as v1.0 merged) ... */
        const match = window.location.pathname.match(/\/explore\/installed\/([a-f0-9-]+)/);
        if (match && match[1]) { log('Simplify: App ID found:', match[1]); return match[1]; }
        logError('Simplify: App ID not found in URL:', window.location.href); return null;
     }
    function simplify_getConversationId(appId) { /* ... (same as v1.0 merged) ... */
        if (!appId) return null;
        const mapString = localStorage.getItem(LOCALSTORAGE_CONVERSATION_MAP_KEY);
        if (!mapString) { logError('Simplify: Conv ID map not found:', LOCALSTORAGE_CONVERSATION_MAP_KEY); return null; }
        try {
            const map = JSON.parse(mapString);
            const convId = map[appId];
            if (!convId) { logError('Simplify: Conv ID not found for App ID:', appId); log('Simplify: Conv ID map:', map); return null; }
            log('Simplify: Conv ID found:', convId); return convId;
        } catch (e) { logError('Simplify: Failed to parse Conv ID map:', e); log('Simplify: Original map string:', mapString); return null; }
     }
    function simplify_fetchMessages(appId, conversationId, authToken) { /* ... (same as v1.0 merged) ... */
        return new Promise((resolve, reject) => {
            if (!appId || !conversationId || !authToken) { return reject('Missing params for simplify_fetchMessages'); }
            const url = `${SIMPLIFY_API_BASE_URL}${appId}/messages?conversation_id=${conversationId}&limit=100`;
            log('Simplify: Fetching messages from:', url);
            GM_xmlhttpRequest({
                method: "GET", url: url, headers: {"Authorization": authToken, "Accept": "application/json"}, timeout: 15000,
                onload: function(response) {
                    log(`Simplify: Fetch messages status: ${response.status}`);
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const aiMessages = data.data.filter(msg => msg.hasOwnProperty('answer') && msg.answer !== null);
                            aiMessages.sort((a, b) => a.created_at - b.created_at); // Ascending
                            logInfo(`Simplify: Fetched ${aiMessages.length} AI messages.`);
                            resolve(aiMessages);
                        } catch (e) { logError('Simplify: Failed to parse messages response:', e); log('Simplify: Response text:', response.responseText); reject('Parse error'); }
                    } else { logError('Simplify: Fetch messages failed:', response.status, response.statusText); log('Simplify: Response text:', response.responseText); reject(`Fetch failed: ${response.status}`); }
                },
                onerror: function(error) { logError('Simplify: Fetch messages network error:', error); reject('Network error'); },
                ontimeout: function() { logError('Simplify: Fetch messages timeout.'); reject('Timeout'); }
            });
        });
     }
    function simplify_updateMessageApi(appId, messageId, newContent, authToken) { /* ... (same as v1.0 merged) ... */
        return new Promise((resolve, reject) => {
            if (!appId || !messageId || newContent === null || newContent === undefined || !authToken) { return reject('Missing params for simplify_updateMessageApi'); }
            const url = `${SIMPLIFY_API_BASE_URL}${appId}/messages/${messageId}`;
            const payload = JSON.stringify({ answer: newContent });
            log(`Simplify: PATCHing to ${url} with content (start): ${payload.substring(0, 100)}...`);
            GM_xmlhttpRequest({
                method: "PATCH", url: url, headers: {"Authorization": authToken, "Content-Type": "application/json", "Accept": "*/*"}, data: payload, timeout: 15000,
                onload: function(response) {
                    log(`Simplify: PATCH response status for ${messageId}:`, response.status);
                    if (response.status >= 200 && response.status < 300) { logInfo(`Simplify: Successfully updated message ${messageId} via API.`); resolve(response.responseText); }
                    else { logError(`Simplify: Failed to update message ${messageId} via API:`, response.status, response.statusText); log('Simplify: Response text:', response.responseText); reject(`API Update failed: ${response.status}`); }
                },
                onerror: function(error) { logError(`Simplify: Network error updating message ${messageId}:`, error); reject('Network error'); },
                ontimeout: function() { logError(`Simplify: Timeout updating message ${messageId}.`); reject('Timeout'); }
            });
        });
    }
    function simplify_extractSimplifiedContent(contentContainer, selectorsToRemove) { /* ... (same as v1.0 merged) ... */
        if (!contentContainer) {
            logError("    - Simplify: extractSimplifiedContent: contentContainer is null.");
            return null;
        }
        log(`    - Simplify: Cleaning container using selectors: "${selectorsToRemove}"`);
        try {
            const clonedContainer = contentContainer.cloneNode(true);
            if (selectorsToRemove && selectorsToRemove.trim() !== "") {
                 const elementsToRemove = clonedContainer.querySelectorAll(selectorsToRemove);
                 log(`    - Simplify: Found ${elementsToRemove.length} elements matching "${selectorsToRemove}" to remove.`);
                 elementsToRemove.forEach(el => {
                     log(`      - Simplify: Removing ${el.tagName}.${el.className || 'no-class'}`);
                     el.remove();
                 });
            } else {
                 log(`    - Simplify: No selectors specified for removal.`);
            }
            const simplifiedHtml = clonedContainer.innerHTML.trim();
            log(`    - Simplify: Simplified content (start): ${simplifiedHtml.substring(0, 150)}...`);
            return simplifiedHtml;
        } catch (error) {
            logError("    - Simplify: Error during content extraction/cleaning:", error);
            return null;
        }
     }
    function simplify_updatePageElementVisuals(pageElement, simplifiedHtml) { /* ... (same as v1.0 merged) ... */
         if (!pageElement || simplifiedHtml === null) return;
         const contentContainer = pageElement.querySelector(SIMPLIFY_CONTENT_CONTAINER_SELECTOR);
         if (contentContainer) {
            log(`    - Simplify: Updating page element visuals...`);
            contentContainer.innerHTML = simplifiedHtml;
            // Add visual mark
            if (!contentContainer.querySelector(`.${SIMPLIFIED_MARK_CLASS}`)) {
                 const mark = document.createElement('div');
                 mark.textContent = '(Simplified by script)';
                 mark.className = SIMPLIFIED_MARK_CLASS; // Use defined class
                 // Style is applied via GM_addStyle later
                 contentContainer.appendChild(mark);
            }
            logInfo(`    - Simplify: Successfully updated page element visuals.`);
         } else {
            logError(`    - Simplify: Could not find content container (${SIMPLIFY_CONTENT_CONTAINER_SELECTOR}) to update visuals.`);
         }
    }

    // **MODIFIED**: This function now runs when the button *in the panel* is clicked.
    async function simplify_processLastTwoReplies() {
        // Use the stored reference to the button element
        const button = simplifyButtonElement;
        if (button && button.disabled) { logInfo('Simplify: Processing already, please wait...'); return; }
        logInfo(`Simplify: Button clicked`);
        if (button) { button.disabled = true; /* Maybe change icon/tooltip instead of text */ button.title = 'Processing...'; }

        const authToken = simplify_getAuthToken();
        const appId = simplify_getAppId(); // This MUST return a valid ID because the button should only appear on installed app pages.

        if (!appId) {
             logError('Simplify: Button clicked, but App ID not found. This should not happen if button visibility is correct. Aborting.');
             if (button) { button.disabled = false; button.title = '简化对话信息'; } // Restore original title
             alert('Error: Could not get App ID for simplification. Please ensure you are on an installed app page.');
             return;
        }

        const conversationId = simplify_getConversationId(appId);
        if (!authToken || !conversationId) {
            logError('Simplify: Missing essential info (Token or Conv ID). Aborting.');
            if (button) { button.disabled = false; button.title = '简化对话信息'; }
            alert('Error: Could not get essential info (Token or Conversation ID). Check console logs.');
            return;
        }

        // --- Rest of the processing logic is IDENTICAL to v1.0 merged ---
        try {
            logInfo('Simplify: Fetching message list...');
            const apiMessages = await simplify_fetchMessages(appId, conversationId, authToken);
            const pageReplies = document.querySelectorAll(AI_MESSAGE_SELECTOR);
            logInfo(`Simplify: Found ${pageReplies.length} AI reply elements on page.`);

            const numApiMessages = apiMessages.length;
            const numPageReplies = pageReplies.length;

            if (numPageReplies === 0) {
                logInfo('Simplify: No AI replies found on page. Nothing to do.');
                alert('Simplify: No AI replies found on the page.');
                if (button) { button.disabled = false; button.title = '简化对话信息'; }
                return;
            }

            if (numApiMessages !== numPageReplies) {
                 logError(`Simplify: Warning: API message count (${numApiMessages}) differs from page element count (${numPageReplies}). Using page elements as reference for latest items.`);
            }

            let successCount = 0;
            let failCount = 0;
            const repliesToProcess = [];

            const lastPageIndex = numPageReplies - 1;
            if (lastPageIndex >= 0) {
                const latestPageElement = pageReplies[lastPageIndex];
                const latestApiMessage = (lastPageIndex < numApiMessages) ? apiMessages[lastPageIndex] : null;
                if (latestApiMessage) {
                    repliesToProcess.push({
                        index: lastPageIndex, element: latestPageElement, apiMessage: latestApiMessage,
                        selectorsToRemove: SIMPLIFY_SELECTORS_TO_REMOVE_LATEST, label: "Latest"
                    });
                } else {
                     logError(`Simplify: Could not find matching API message for the latest page element (index ${lastPageIndex}). Skipping.`);
                     failCount++;
                }
            }

            const secondLastPageIndex = numPageReplies - 2;
            if (secondLastPageIndex >= 0) {
                const secondLatestPageElement = pageReplies[secondLastPageIndex];
                const secondLatestApiMessage = (secondLastPageIndex < numApiMessages) ? apiMessages[secondLastPageIndex] : null;
                 if (secondLatestApiMessage) {
                    repliesToProcess.push({
                        index: secondLastPageIndex, element: secondLatestPageElement, apiMessage: secondLatestApiMessage,
                        selectorsToRemove: SIMPLIFY_SELECTORS_TO_REMOVE_SECOND_LATEST, label: "Second Latest"
                    });
                } else {
                     logError(`Simplify: Could not find matching API message for the second latest page element (index ${secondLastPageIndex}). Skipping.`);
                }
            }

            logInfo(`Simplify: Planning to process ${repliesToProcess.length} replies.`);

            for (const target of repliesToProcess) {
                logInfo(`--- Simplify: Processing ${target.label} Reply (Page Index: ${target.index}) ---`);
                // No button text update needed now

                const contentContainer = target.element.querySelector(SIMPLIFY_CONTENT_CONTAINER_SELECTOR);
                if (!contentContainer) {
                    logError(`  - Simplify: Could not find content container for ${target.label} reply. Skipping.`);
                    failCount++;
                    continue;
                }

                const newContent = simplify_extractSimplifiedContent(contentContainer, target.selectorsToRemove);

                if (newContent !== null && newContent !== "") {
                    try {
                        await simplify_updateMessageApi(appId, target.apiMessage.id, newContent, authToken);
                        simplify_updatePageElementVisuals(target.element, newContent);
                        successCount++;
                    } catch (updateError) {
                        logError(`  - Simplify: Failed to update ${target.label} reply (API or Visual):`, updateError);
                        failCount++;
                    }
                } else {
                    logError(`  - Simplify: Failed to extract valid content for ${target.label} reply. Skipping update.`);
                    failCount++;
                }
                 await new Promise(resolve => setTimeout(resolve, 150));
            }

            logInfo(`--- Simplify: Processing Finished --- Success: ${successCount}, Failures: ${failCount} (Processed ${repliesToProcess.length} targets)`);
            alert(`Simplification finished!\nSuccess: ${successCount}\nFailed: ${failCount}\n\nVisuals updated on page.`);

        } catch (error) {
            logError('Simplify: An overall error occurred during processing:', error);
            alert('Simplify: An unexpected error occurred. Check console logs.');
        } finally {
            if (button) {
                button.disabled = false;
                button.title = '简化对话信息'; // Restore title
            }
        }
    }

    // **MODIFIED**: Renamed, creates and returns the button element with panel styling.
    function simplify_getButtonElement() {
        const button = document.createElement('button');
        button.id = SIMPLIFY_BUTTON_ID; // Keep ID if needed for other selectors/styling
        // Use an icon instead of text
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-magic" viewBox="0 0 16 16">
           <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0v1.829Zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707L14 2.707ZM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707L7.293 4Zm-.621 2.5a.5.5 0 0 0 0-1H4.843a.5.5 0 1 0 0 1h1.829Zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1h1.829ZM10.828 7.293A.5.5 0 1 0 11.535 8L10 9.535a.5.5 0 1 0-.707-.707L10.828 7.293ZM10 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0v1.829Zm1.828 1.828a.5.5 0 1 0-1-1L9.293 13.5a.5.5 0 1 0 .707.707l1.828-1.828Zm-3.087 1.414a.5.5 0 0 0 0-1H7.843a.5.5 0 1 0 0 1h1.829Zm-2.828 0a.5.5 0 1 0 0-1H3.172a.5.5 0 0 0 0 1H5Zm-.621-2.5a.5.5 0 1 0-1 1L5 13.707a.5.5 0 0 0 .707-.707L4.379 11.5Zm2.828-1.828a.5.5 0 1 0-1-1L4.5 10.207a.5.5 0 1 0 .707.707l1.828-1.828Z"/>
           <path d="M6.096 7.096a1.028 1.028 0 0 1 1.451-.039 1.028 1.028 0 0 1 .04 1.451l-3.96 3.96a1.028 1.028 0 0 1-1.49.04 1.028 1.028 0 0 1-.04-1.49l3.96-3.96Zm3.84 3.84a1.028 1.028 0 0 1 1.451-.039 1.028 1.028 0 0 1 .04 1.451l-1.08 1.08a1.028 1.028 0 0 1-1.49.04 1.028 1.028 0 0 1-.04-1.49l1.08-1.08Z"/>
         </svg>`; // Magic Wand Icon
        button.title = '简化对话信息 (Removes Status/Options/Memory)';
        button.classList.add('ai-helper-button'); // Apply panel button styling
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering panel collapse/expand if clicked
            simplify_processLastTwoReplies();
        });
        logInfo("Simplify: Button element created for panel integration.");
        return button;
    }


    // ==--- Floating Panel Feature Logic ---==
    // (panel_setReactInputValue, panel_applyCollapsedState, panel_updateContent, panel_disconnectContentObserver, panel_contentObserverCallback, panel_setupObservers remain IDENTICAL to v1.0 merged)
    function panel_setReactInputValue(element, value) { /* ... (same as v1.0 merged) ... */
        if (!element) {
             logError("Panel: setReactInputValue: Target element is null.");
             return;
        }
        try {
            log("Panel: Attempting to set input value for:", element.id || element.tagName);
            const elementPrototype = Object.getPrototypeOf(element);
            const valueSetter = Object.getOwnPropertyDescriptor(elementPrototype, 'value')?.set;
            if (valueSetter) {
                valueSetter.call(element, value);
                log("Panel: Used value setter.");
            } else {
                element.value = value; // Fallback
                log("Panel: Used direct value assignment (fallback).");
            }

            // Trigger events React listens for
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            const changeEvent = new Event('change', { bubbles: true, cancelable: true });
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(changeEvent);
            log("Panel: Input value set and events dispatched.");
        } catch (error) {
            logError("Panel: Failed to set React input value:", error);
            element.value = value; // Final fallback
        }
     }
    function panel_applyCollapsedState(collapsed, immediate = false) { /* ... (same as v1.0 merged) ... */
        if (!panel || !panelHeader || !panelHeaderTitle || !panelContentArea || !panelResizeHandle || !panelRefreshButton || !panelToggleCollapseButton) {
            logError("Panel: Cannot apply collapsed state, UI elements not ready.");
            return;
        }

        const transitionDuration = immediate ? 'none' : '0.35s';
        const headerTransitionDuration = immediate ? 'none' : '0.3s';

        // Temporarily disable transitions if immediate
        if (immediate) {
             panel.style.transition = 'none'; panelHeader.style.transition = 'none';
             panelHeaderTitle.style.transition = 'none'; panelContentArea.style.transition = 'none';
             panelResizeHandle.style.transition = 'none';
             // Also disable for buttons if they have transitions
             if(simplifyButtonElement) simplifyButtonElement.style.transition = 'none';
             panelRefreshButton.style.transition = 'none';
             panelToggleCollapseButton.style.transition = 'none';
        } else {
             // Ensure transitions are set
             panel.style.transition = `width ${transitionDuration} ease-out, height ${transitionDuration} ease-out, min-height ${transitionDuration} ease-out, border-radius ${transitionDuration} ease-out, background-color ${headerTransitionDuration} ease, transform ${transitionDuration} ease-out, opacity 0.3s ease`;
             panelHeader.style.transition = `padding ${headerTransitionDuration} ease, background-color ${headerTransitionDuration} ease, height ${headerTransitionDuration} ease, justify-content ${headerTransitionDuration} ease, border-bottom ${headerTransitionDuration} ease`;
             panelHeaderTitle.style.transition = `opacity ${headerTransitionDuration} ease`;
             panelContentArea.style.transition = `opacity 0.3s ease-in-out, padding ${headerTransitionDuration} ease-out`;
             panelResizeHandle.style.transition = `opacity 0.3s ease`;
              // Restore button transitions
             const buttonTransition = 'background-color 0.2s ease, transform 0.1s ease';
             if(simplifyButtonElement) simplifyButtonElement.style.transition = buttonTransition;
             panelRefreshButton.style.transition = buttonTransition;
             panelToggleCollapseButton.style.transition = buttonTransition;
        }

        if (collapsed) {
            panel.classList.add('collapsed');
            if (!panelIsResizing) {
                 panelSize.width = panel.style.width || `${panel.offsetWidth}px`;
                 panelSize.height = panel.style.height || `${panel.offsetHeight}px`;
                 log("Panel: Saving size before collapse:", panelSize);
            }
            Object.assign(panel.style, {
                width: PANEL_COLLAPSED_TAG_WIDTH, height: PANEL_COLLAPSED_TAG_HEIGHT,
                minHeight: PANEL_COLLAPSED_TAG_HEIGHT,
                borderRadius: '20px', cursor: 'pointer', opacity: '0.85'
            });
             Object.assign(panelHeader.style, { padding: '0 8px', cursor: 'pointer', height: '100%', justifyContent: 'center', borderBottom: 'none', backgroundColor: 'transparent' });
            panelHeaderTitle.style.opacity = '0';
            panelRefreshButton.style.display = 'none';
            if(simplifyButtonElement) simplifyButtonElement.style.display = 'none'; // Hide simplify button too
            panelContentArea.style.opacity = '0'; panelContentArea.style.padding = '0 15px';
            panelResizeHandle.style.opacity = '0'; panelResizeHandle.style.pointerEvents = 'none';
            panelToggleCollapseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V8.5H15a.5.5 0 0 0 0-1H8.5V1a.5.5 0 0 0-1 0v6.5H1a.5.5 0 0 0 0 1h6.5V14.5a.5.5 0 0 0 .5.5z"/></svg>`;
            panelToggleCollapseButton.title = 'Expand Panel';
        } else {
            panel.classList.remove('collapsed');
            Object.assign(panel.style, {
                width: panelSize.width, height: panelSize.height,
                minHeight: `${PANEL_MIN_HEIGHT}px`,
                borderRadius: '12px', cursor: 'default', opacity: '1'
            });
            Object.assign(panelHeader.style, { padding: '10px 15px', cursor: 'move', height: 'auto', justifyContent: 'space-between', borderBottom: '1px solid rgba(74, 85, 104, 0.4)', backgroundColor: 'rgba(26, 32, 44, 0.8)'});
            panelHeaderTitle.style.opacity = '1';
            panelRefreshButton.style.display = 'flex'; // Restore display: flex
            if(simplifyButtonElement) simplifyButtonElement.style.display = 'flex'; // Restore simplify button display
            panelContentArea.style.opacity = '1'; panelContentArea.style.padding = '15px';
            panelResizeHandle.style.opacity = '1'; panelResizeHandle.style.pointerEvents = 'auto';
            panelToggleCollapseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/></svg>`;
            panelToggleCollapseButton.title = '折叠面板';
        }

        // Restore transitions after a short delay if immediate
        if (immediate) {
            setTimeout(() => {
                // Re-apply the standard transitions
                panel.style.transition = `width 0.35s ease-out, height 0.35s ease-out, min-height 0.35s ease-out, border-radius 0.35s ease-out, background-color 0.3s ease, transform 0.35s ease-out, opacity 0.3s ease`;
                 panelHeader.style.transition = `padding 0.3s ease, background-color 0.3s ease, height 0.3s ease, justify-content 0.3s ease, border-bottom 0.3s ease`;
                 panelHeaderTitle.style.transition = `opacity 0.3s ease`;
                 panelContentArea.style.transition = `opacity 0.3s ease-in-out, padding 0.3s ease-out`;
                 panelResizeHandle.style.transition = `opacity 0.3s ease`;
                 const buttonTransition = 'background-color 0.2s ease, transform 0.1s ease';
                 if(simplifyButtonElement) simplifyButtonElement.style.transition = buttonTransition;
                 panelRefreshButton.style.transition = buttonTransition;
                 panelToggleCollapseButton.style.transition = buttonTransition;
            }, 50);
        }
    }
    function panel_updateContent(forceUpdate = false) { /* ... (same as v1.0 merged, including check for SIMPLIFIED_MARK_CLASS) ... */
        if (!panel || !panelContentArea) return;

        const isCollapsed = panel.classList.contains('collapsed');
        // If collapsed and not forced, don't update visually, but maybe record the node
        if (isCollapsed && !forceUpdate) {
            // Check if latestFullyLoadedNode needs updating even when collapsed
             const chatContainer = document.querySelector(PANEL_CHAT_CONTAINER_SELECTOR);
             if (chatContainer) {
                 const aiMessages = chatContainer.querySelectorAll(AI_MESSAGE_SELECTOR);
                 const latestOnPage = aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null;
                 // If the latest on page is different from what we recorded, update our record
                 if (latestOnPage && latestOnPage !== panelLatestFullyLoadedAiNode) {
                      // We can't confirm it's "fully loaded" without the observer, but
                      // update it anyway, so expanding shows the *latest* known message.
                      panelLatestFullyLoadedAiNode = latestOnPage;
                      log("Panel: Collapsed, updated latest known AI node record.");
                 }
             }
            return;
        }

        // Show loading state only when expanded
        if (!isCollapsed) {
            panelContentArea.classList.add('ai-helper-content-updating');
        }

        const chatContainer = document.querySelector(PANEL_CHAT_CONTAINER_SELECTOR);
        let latestAiMessageOnPage = null;
        if (chatContainer) {
            const aiMessages = chatContainer.querySelectorAll(AI_MESSAGE_SELECTOR);
            latestAiMessageOnPage = aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null;
        } else {
            logError("Panel: Chat container not found during update.");
            panelContentArea.innerHTML = '<p style="opacity: 0.7; color: #f56565;">Error: Chat container not found.</p>';
            if (!isCollapsed) panelContentArea.classList.remove('ai-helper-content-updating');
            return;
        }

        // Determine which message to actually parse content from
        const messageToUpdateFrom = (forceUpdate || !panelLatestFullyLoadedAiNode) ? latestAiMessageOnPage : panelLatestFullyLoadedAiNode;

        log(`Panel: Attempting to update content from node: ${messageToUpdateFrom?.id || 'None'}. Forced: ${forceUpdate}, LatestFullyLoaded: ${!!panelLatestFullyLoadedAiNode}`);

        if (!messageToUpdateFrom) {
            if (!panelContentArea.innerHTML.trim() || forceUpdate || panelContentArea.querySelector('p')?.textContent.includes('Waiting')) {
                 panelContentArea.innerHTML = `<p style="opacity: 0.7; text-align: center; margin-top: 20px;">${forceUpdate ? 'Refresh: No AI reply found' : 'Waiting for AI reply...'}</p>`;
                 log("Panel: No message node to update from.");
            }
            if (!isCollapsed) panelContentArea.classList.remove('ai-helper-content-updating');
            return;
        }

        // --- Content Extraction ---
        panelContentArea.innerHTML = ''; // Clear previous content
        let contentFoundInSections = false;
        let missingRequiredSections = false;

        PANEL_SECTIONS_TO_EXTRACT.forEach(sectionInfo => {
            const sectionElement = messageToUpdateFrom.querySelector(`details.${sectionInfo.class}`);
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = sectionInfo.title;
            const sectionContentDiv = document.createElement('div');

            if (sectionElement) {
                const sourceContentDiv = sectionElement.querySelector('div');
                if (sourceContentDiv) {
                    // Handle Clickable Options Area
                    if (sectionInfo.clickable && sectionInfo.class === 'optionsarea') {
                        let optionsFound = false;
                        const headingElement = sourceContentDiv.querySelector('h2');
                        if (headingElement) {
                            const title = document.createElement('h3');
                            title.textContent = headingElement.textContent;
                            title.classList.add('ai-helper-options-title');
                            sectionContentDiv.appendChild(title);
                        }

                        const olElement = sourceContentDiv.querySelector('ol');
                        if (olElement) {
                            const liElements = olElement.querySelectorAll('li');
                            if (liElements.length > 0) {
                                optionsFound = true;
                                liElements.forEach(li => {
                                    const rawLiText = li.textContent?.trim() || '';
                                    const match = rawLiText.match(PANEL_OPTION_BRACKET_PATTERN);
                                    if (match && match[1]) {
                                        const optionText = match[1].trim();
                                        const button = document.createElement('button');
                                        button.textContent = optionText;
                                        button.classList.add('ai-helper-option-button');
                                        button.dataset.optionText = optionText;
                                        button.addEventListener('click', (e) => {
                                            const textToInput = e.target.dataset.optionText;
                                            const inputElement = document.querySelector(CHAT_INPUT_SELECTOR);
                                            if (inputElement) { panel_setReactInputValue(inputElement, textToInput); }
                                            else { logError(`Panel: Chat input element ('${CHAT_INPUT_SELECTOR}') not found.`); alert('Error: Cannot find chat input box!'); }
                                        });
                                        sectionContentDiv.appendChild(button);
                                    } else { log('Panel: Skipping li, cannot extract option from:', rawLiText); }
                                });
                            }
                        }
                        if (!optionsFound) {
                             const fallbackText = document.createElement('p');
                             fallbackText.textContent = 'No clickable options found in list format.';
                             fallbackText.style.opacity = '0.7'; sectionContentDiv.appendChild(fallbackText);
                             log('Panel: Could not find ol > li structure in optionsarea.');
                        }
                    } else {
                        // Clone content for other sections
                        Array.from(sourceContentDiv.childNodes).forEach(node => { sectionContentDiv.appendChild(node.cloneNode(true)); });
                        if (!sectionContentDiv.hasChildNodes()) {
                            const pre = document.createElement('pre');
                            pre.textContent = sourceContentDiv.textContent?.trim() || '(Empty)';
                            sectionContentDiv.appendChild(pre);
                        }
                    }
                    contentFoundInSections = true;
                    if (sectionInfo.class === 'optionsarea' || sectionInfo.class === 'memoryarea') { details.open = true; }
                } else {
                    sectionContentDiv.innerHTML = '<p style="opacity: 0.7;">Content area div not found inside details.</p>';
                    if (sectionInfo.required) missingRequiredSections = true;
                }
            } else {
                sectionContentDiv.innerHTML = '<p style="opacity: 0.7;">Section not found in this message.</p>';
                details.style.opacity = '0.6';
                if (sectionInfo.required) missingRequiredSections = true;
            }
            details.appendChild(summary);
            details.appendChild(sectionContentDiv);
            panelContentArea.appendChild(details);
        });

        // Handle cases where no relevant content was found
        if (!contentFoundInSections || missingRequiredSections) {
             const simplifiedMark = messageToUpdateFrom.querySelector(`.${SIMPLIFIED_MARK_CLASS}`);
             if (simplifiedMark) { panelContentArea.innerHTML = '<p style="opacity: 0.7; text-align: center; margin-top: 20px;">Latest AI reply has been simplified, required sections (Memory/Options) may be removed.</p>'; }
             else if (missingRequiredSections) { panelContentArea.innerHTML = '<p style="opacity: 0.7; text-align: center; margin-top: 20px;">Required sections (Memory/Options) not found in the latest AI reply.</p>'; }
             else if (!contentFoundInSections) { panelContentArea.innerHTML = '<p style="opacity: 0.7; text-align: center; margin-top: 20px;">Could not extract any content from the expected sections.</p>'; }
             log("Panel: Content update finished, but required sections missing or no content found.");
        } else { log("Panel: Content update finished successfully."); }

        if (!isCollapsed) { setTimeout(() => panelContentArea.classList.remove('ai-helper-content-updating'), 50); }
    }
    function panel_disconnectContentObserver() { /* ... (same as v1.0 merged) ... */
        if (panelContentObserver) {
            log("Panel: Disconnecting previous content observer for node:", panelWatchingAiNode?.id);
            panelContentObserver.disconnect();
            panelContentObserver = null;
        }
    }
    const panel_contentObserverCallback = function(mutationsList, observer) { /* ... (same as v1.0 merged) ... */
        if (!panelWatchingAiNode) return;
        if (PANEL_INTEGRAL_TEXT_PATTERN.test(panelWatchingAiNode.textContent)) {
             log(`Panel: Integral text found in ${panelWatchingAiNode.id}. Finalizing update.`);
             panelLatestFullyLoadedAiNode = panelWatchingAiNode;
             panel_disconnectContentObserver();
             if (!panel.classList.contains('collapsed')) { panel_updateContent(true); }
             else { log("Panel: Collapsed, content ready but visual update skipped. Node recorded."); }
        }
     };
    function panel_setupObservers() { /* ... (same as v1.0 merged) ... */
        const targetNode = document.querySelector(PANEL_CHAT_CONTAINER_SELECTOR);

        if (targetNode) {
            log(`Panel: Starting Main MutationObserver. Watching children of ${PANEL_CHAT_CONTAINER_SELECTOR}.`);
            const config = { childList: true, subtree: false };

            const mainObserverCallback = function(mutationsList, observer) {
                let newAiMessageNode = null;
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.matches(AI_MESSAGE_SELECTOR)) {
                                newAiMessageNode = node; log("Panel: Detected new AI message node added:", newAiMessageNode.id || 'No ID'); return;
                            }
                        });
                    }
                    if (newAiMessageNode) break;
                }

                if (newAiMessageNode) {
                    panel_disconnectContentObserver();
                    panelWatchingAiNode = newAiMessageNode;
                    panelContentObserver = new MutationObserver(panel_contentObserverCallback);
                    panelContentObserver.observe(panelWatchingAiNode, { childList: true, subtree: true, characterData: true });
                    log(`Panel: Content observer is now watching node ${panelWatchingAiNode.id || 'No ID'} for integral text.`);
                }
            };

            if (panelMainObserver) { panelMainObserver.disconnect(); }
            panelMainObserver = new MutationObserver(mainObserverCallback);
            panelMainObserver.observe(targetNode, config);
            panelObserverRetryCount = 0;
            logInfo('Panel: Main MutationObserver started.');

            log('Panel: Performing initial panel update check.');
            const initialAiMessages = targetNode.querySelectorAll(AI_MESSAGE_SELECTOR);
            if (initialAiMessages.length > 0) {
                const lastMessage = initialAiMessages[initialAiMessages.length - 1];
                 if (PANEL_INTEGRAL_TEXT_PATTERN.test(lastMessage.textContent)) {
                      panelLatestFullyLoadedAiNode = lastMessage;
                      log("Panel: Found existing last AI message potentially loaded:", panelLatestFullyLoadedAiNode?.id);
                 } else {
                      panelWatchingAiNode = lastMessage;
                      panel_disconnectContentObserver();
                      panelContentObserver = new MutationObserver(panel_contentObserverCallback);
                      panelContentObserver.observe(panelWatchingAiNode, { childList: true, subtree: true, characterData: true });
                      log(`Panel: Initial last AI message found, watching node ${panelWatchingAiNode.id || 'No ID'} for integral text.`);
                 }
            }
            if (!panel.classList.contains('collapsed')) { panel_updateContent(true); }
             else { log("Panel: Initially collapsed, update deferred."); }

        } else {
            panelObserverRetryCount++;
            logError(`Panel: Chat container ('${PANEL_CHAT_CONTAINER_SELECTOR}') not found. Retry ${panelObserverRetryCount}/${PANEL_MAX_OBSERVER_RETRIES}...`);
            if (panelObserverRetryCount < PANEL_MAX_OBSERVER_RETRIES) { setTimeout(panel_setupObservers, 2000 * panelObserverRetryCount); }
             else { logError(`Panel: Failed to find chat container after ${PANEL_MAX_OBSERVER_RETRIES} retries. Panel observer not started.`); if(panelContentArea) panelContentArea.innerHTML = '<p style="opacity: 0.7; color: #f56565;">Error: Could not start page listener.</p>'; }
        }
     }

    // **MODIFIED**: Creates panel and conditionally adds Simplify button to header.
    function panel_createPanel() {
        if (document.getElementById(PANEL_ID)) { log('Panel: Panel already exists.'); return; }

        panel = document.createElement('div');
        panel.id = PANEL_ID;
        Object.assign(panel.style, { /* ... same base styles ... */
            position: 'fixed', top: panelPos.top, right: panelPos.right, left: panelPos.left, bottom: panelPos.bottom,
            width: panelSize.width, height: panelSize.height,
            minWidth: `${PANEL_MIN_WIDTH}px`, minHeight: `${PANEL_MIN_HEIGHT}px`,
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            zIndex: '10000', borderRadius: '12px', backgroundColor: 'rgba(45, 55, 72, 0.95)',
            backdropFilter: 'blur(5px)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.1)',
            color: '#e2e8f0', border: '1px solid rgba(74, 85, 104, 0.6)', overflow: 'hidden',
            fontSize: '14px', boxSizing: 'border-box'
        });

        // --- Header ---
        panelHeader = document.createElement('div');
        panelHeader.id = `${PANEL_ID}-header`;
        Object.assign(panelHeader.style, { /* ... same base styles ... */
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px',
            backgroundColor: 'rgba(26, 32, 44, 0.8)', borderBottom: '1px solid rgba(74, 85, 104, 0.4)',
            cursor: 'move', userSelect: 'none', flexShrink: '0'
        });
        panelHeaderTitle = document.createElement('span'); panelHeaderTitle.textContent = 'AI Assistant'; panelHeaderTitle.style.fontWeight = '600'; panelHeader.appendChild(panelHeaderTitle);

        const headerButtonsContainer = document.createElement('div');
        headerButtonsContainer.style.display = 'flex'; headerButtonsContainer.style.alignItems = 'center'; // Align items vertically
        headerButtonsContainer.style.gap = '8px';

        // --- Create & Add Buttons ---
        // 1. Simplify Button (Conditional)
        if (window.location.pathname.includes('/explore/installed/')) {
            simplifyButtonElement = simplify_getButtonElement(); // Create the button element
            headerButtonsContainer.appendChild(simplifyButtonElement); // Add to container
            logInfo("Panel: Simplify button added to header.");
        } else {
            logInfo("Panel: Simplify button not added (not on installed app page).");
            simplifyButtonElement = null; // Ensure reference is null
        }

        // 2. Refresh Button
        panelRefreshButton = document.createElement('button');
        panelRefreshButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>`;
        panelRefreshButton.title = '手动刷新信息';
        panelRefreshButton.classList.add('ai-helper-button');
        headerButtonsContainer.appendChild(panelRefreshButton);

        // 3. Toggle Collapse Button
        panelToggleCollapseButton = document.createElement('button');
        panelToggleCollapseButton.classList.add('ai-helper-button');
        // Icon/Title set by applyCollapsedState
        headerButtonsContainer.appendChild(panelToggleCollapseButton);

        panelHeader.appendChild(headerButtonsContainer); // Add button group to header
        panel.appendChild(panelHeader); // Add header to panel

        // --- Content Area ---
        panelContentArea = document.createElement('div');
        panelContentArea.id = `${PANEL_ID}-content-area`;
        Object.assign(panelContentArea.style, { /* ... same styles ... */
            padding: '15px', overflowY: 'auto', flexGrow: '1', opacity: '1',
            scrollbarWidth: 'thin', scrollbarColor: '#718096 #2d3748',
        });
        panelContentArea.innerHTML = '<p style="opacity: 0.7; text-align: center; margin-top: 20px;">Initializing...</p>';
        panel.appendChild(panelContentArea);

        // --- Resize Handle ---
        panelResizeHandle = document.createElement('div');
        panelResizeHandle.id = `${PANEL_ID}-resize-handle`;
        Object.assign(panelResizeHandle.style, { /* ... same styles ... */
            position: 'absolute', bottom: '0px', right: '0px',
            width: '14px', height: '14px', cursor: 'nwse-resize',
            borderRight: '2px solid rgba(160, 174, 192, 0.5)', borderBottom: '2px solid rgba(160, 174, 192, 0.5)',
            zIndex: '10001', boxSizing: 'border-box'
        });
        panel.appendChild(panelResizeHandle);

        // --- Add to Page ---
        document.body.appendChild(panel);
        logInfo("Panel: UI Panel added to page.");

        // --- Apply Initial State ---
        panel_applyCollapsedState(panelCollapsed, true);

        // --- Add Event Listeners ---
        addPanelEventListeners(); // Keep this function separate for clarity
    }

    // (addPanelEventListeners, handlePanelMouseMove, handlePanelMouseMoveResize, handlePanelMouseUp, handlePanelMouseUpResize remain IDENTICAL to v1.0 merged)
    function addPanelEventListeners() { /* ... (same as v1.0 merged - ENSURE refreshButton/toggleCollapseButton listeners are correctly attached) ... */
        if (!panelHeader || !panelResizeHandle || !panelRefreshButton || !panelToggleCollapseButton || !panel) {
             logError("Panel: Cannot add event listeners, UI elements not ready.");
             return;
        }
        // Dragging
        panelHeader.addEventListener('mousedown', (e) => {
            // Also check if the target is the simplify button
            if (panel.classList.contains('collapsed') || e.target.closest('button') || e.target === panelResizeHandle || e.button !== 0 || panelIsResizing) {
                return;
            }
            panelIsDragging = true;
            const rect = panel.getBoundingClientRect();
            panelOffsetX = e.clientX - rect.left;
            panelOffsetY = e.clientY - rect.top;
            panelHeader.style.cursor = 'grabbing';
            panel.style.transition = 'none';
            document.body.style.userSelect = 'none';
            log("Panel: Drag Start");
        });

        // Resizing
        panelResizeHandle.addEventListener('mousedown', (e) => { /* ... same ... */
            if (e.button !== 0 || panelIsDragging) return;
            e.preventDefault(); e.stopPropagation();
            panelIsResizing = true;
            panelStartResizeX = e.clientX; panelStartResizeY = e.clientY;
            panelInitialWidth = panel.offsetWidth; panelInitialHeight = panel.offsetHeight;
            panel.style.transition = 'none';
            document.body.style.userSelect = 'none';
            log("Panel: Resize Start", { panelInitialWidth, panelInitialHeight });
            document.addEventListener('mousemove', handlePanelMouseMoveResize);
            document.addEventListener('mouseup', handlePanelMouseUpResize, { once: true });
        });

        // Global mouse move (for dragging)
        document.addEventListener('mousemove', handlePanelMouseMove);
        // Global mouse up (for dragging end)
        document.addEventListener('mouseup', handlePanelMouseUp);

        // Button Clicks
        panelRefreshButton.addEventListener('click', (e) => { /* ... same ... */
            e.stopPropagation(); log("Panel: Manual Refresh Button Clicked");
            panel_disconnectContentObserver(); panel_updateContent(true);
        });
        panelToggleCollapseButton.addEventListener('click', (e) => { /* ... same ... */
            e.stopPropagation(); panelCollapsed = !panelCollapsed;
            panel_applyCollapsedState(panelCollapsed); GM_setValue(PANEL_GM_COLLAPSED_KEY, panelCollapsed);
            if (!panelCollapsed) { log("Panel: Expanded. Triggering update."); panel_updateContent(true); }
            else { log("Panel: Collapsed."); }
        });

        // Click collapsed panel to expand
        panel.addEventListener('click', (e) => { /* ... same ... */
            if (panel.classList.contains('collapsed') && !e.target.closest('button') && e.target !== panelResizeHandle) {
                 panelToggleCollapseButton.click();
            }
         });
        log("Panel: Event listeners added.");
    }
    function handlePanelMouseMove(e) { /* ... (same as v1.0 merged) ... */
        if (panelIsDragging) {
            let newLeft = e.clientX - panelOffsetX; let newTop = e.clientY - panelOffsetY;
            const Vw = document.documentElement.clientWidth; const Vh = document.documentElement.clientHeight;
            const panelWidth = panel.offsetWidth; const panelHeight = panel.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, Vw - panelWidth)); newTop = Math.max(0, Math.min(newTop, Vh - panelHeight));
            panel.style.left = `${newLeft}px`; panel.style.top = `${newTop}px`;
            panel.style.right = 'auto'; panel.style.bottom = 'auto';
        }
     }
    function handlePanelMouseMoveResize(e) { /* ... (same as v1.0 merged) ... */
         if (!panelIsResizing) return;
         const deltaX = e.clientX - panelStartResizeX; const deltaY = e.clientY - panelStartResizeY;
         let newWidth = panelInitialWidth + deltaX; let newHeight = panelInitialHeight + deltaY;
         newWidth = Math.max(PANEL_MIN_WIDTH, newWidth); newHeight = Math.max(PANEL_MIN_HEIGHT, newHeight);
         panel.style.width = `${newWidth}px`; panel.style.height = `${newHeight}px`;
     }
    function handlePanelMouseUp(e) { /* ... (same as v1.0 merged) ... */
        if (panelIsDragging) {
            panelIsDragging = false; panelHeader.style.cursor = 'move'; document.body.style.userSelect = '';
            panel_applyCollapsedState(panel.classList.contains('collapsed'), true); // Restore transitions
            if (!panel.classList.contains('collapsed')) {
                panelPos = { top: panel.style.top, left: panel.style.left, right: 'auto', bottom: 'auto' };
                GM_setValue(PANEL_GM_POS_KEY, panelPos); log("Panel: Drag End. Saved position:", panelPos);
            } else { log("Panel: Drag End (Panel was collapsed)."); }
        }
    }
    function handlePanelMouseUpResize(e) { /* ... (same as v1.0 merged) ... */
         if (panelIsResizing) {
             panelIsResizing = false; document.body.style.userSelect = '';
             document.removeEventListener('mousemove', handlePanelMouseMoveResize);
             panel_applyCollapsedState(panel.classList.contains('collapsed'), true); // Restore transitions
             if (!panel.classList.contains('collapsed')) {
                 panelSize = { width: panel.style.width, height: panel.style.height };
                 GM_setValue(PANEL_GM_SIZE_KEY, panelSize); log("Panel: Resize End. Saved size:", panelSize);
             } else { log("Panel: Resize End (Panel was collapsed)."); }
         }
     }

    // ==--- Global Initialization & Styles ---==

    // **MODIFIED**: Removed standalone simplify button styles. Added subtle hover for icon buttons.
    function addGlobalStyles() {
        GM_addStyle(`
            /* --- REMOVED Standalone Simplify Button Styles --- */

            /* Style for the visual mark after simplification */
            .${SIMPLIFIED_MARK_CLASS} {
                font-size: 10px; color: grey; margin-top: 5px; font-style: italic;
            }

            /* --- Floating Panel Styles --- */
            #${PANEL_ID} { /* Base styles set in JS */ }

            #${PANEL_ID} .ai-helper-button { /* Applied to Refresh, Simplify (if present), Collapse */
                background-color: rgba(74, 85, 104, 0.6); color: #e2e8f0; border: none;
                border-radius: 6px; padding: 5px; cursor: pointer; display: flex;
                align-items: center; justify-content: center; transition: background-color 0.2s ease, transform 0.1s ease;
                line-height: 0; /* Important for icon buttons */
            }
            #${PANEL_ID} .ai-helper-button:hover {
                 background-color: rgba(113, 128, 150, 0.7);
                 /* Optional: Slightly lighten icon color on hover */
                 /* filter: brightness(1.2); */
            }
            #${PANEL_ID} .ai-helper-button:active { transform: scale(0.95); }
            #${PANEL_ID} .ai-helper-button:disabled {
                background-color: rgba(74, 85, 104, 0.3); /* Dimmed background */
                color: rgba(226, 232, 240, 0.5); /* Dimmed icon/text */
                cursor: not-allowed;
                transform: none;
            }
            #${PANEL_ID} .ai-helper-button:disabled svg {
                 opacity: 0.5; /* Further dim SVG icon when disabled */
            }


            /* Styles for content inside the panel (only when not collapsed) */
            #${PANEL_ID}:not(.collapsed) details { /* ... same ... */ margin-bottom: 12px; background-color: rgba(26, 32, 44, 0.7); border: 1px solid rgba(74, 85, 104, 0.5); border-radius: 8px; overflow: hidden; }
            #${PANEL_ID}:not(.collapsed) details:last-child { margin-bottom: 0; }
            #${PANEL_ID}:not(.collapsed) summary { /* ... same ... */ padding: 10px 12px; background-color: rgba(45, 55, 72, 0.6); cursor: pointer; outline: none; font-weight: 600; transition: background-color 0.2s ease; list-style: none; display: flex; align-items: center; }
            #${PANEL_ID}:not(.collapsed) summary::-webkit-details-marker { display: none; }
            #${PANEL_ID}:not(.collapsed) summary::before { /* ... same ... */ content: '▶'; margin-right: 8px; font-size: 0.8em; display: inline-block; transition: transform 0.2s ease-in-out; }
            #${PANEL_ID}:not(.collapsed) details[open] > summary::before { transform: rotate(90deg); }
            #${PANEL_ID}:not(.collapsed) summary:hover { background-color: rgba(74, 85, 104, 0.7); }
            #${PANEL_ID}:not(.collapsed) details > div { /* ... same ... */ padding: 12px 15px; background-color: transparent; word-wrap: break-word; max-height: 250px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #718096 #2d3748; font-size: 0.95em; line-height: 1.5; }
            #${PANEL_ID}:not(.collapsed) details > div h1, #${PANEL_ID}:not(.collapsed) details > div h2, #${PANEL_ID}:not(.collapsed) details > div h3, #${PANEL_ID}:not(.collapsed) details > div h4 { /* ... same ... */ margin-top: 0.5em; margin-bottom: 0.5em; font-weight: 600; color: #a0aec0; font-size: 1.1em; }
            #${PANEL_ID}:not(.collapsed) details > div p { /* ... same ... */ margin-bottom: 0.5em; }
            #${PANEL_ID}:not(.collapsed) details > div ol, #${PANEL_ID}:not(.collapsed) details > div ul { /* ... same ... */ padding-left: 20px; margin-bottom: 0.5em; }
            #${PANEL_ID}:not(.collapsed) details > div li { /* ... same ... */ margin-bottom: 0.3em; }
            #${PANEL_ID}:not(.collapsed) details > div strong { /* ... same ... */ font-weight: 600; color: #cbd5e0; }
            #${PANEL_ID}:not(.collapsed) details > div pre { /* ... same ... */ margin: 0; font-family: monospace; font-size: 0.9em; white-space: pre-wrap; word-wrap: break-word; color: #cbd5e0; background-color: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px; }

            /* Options Area Specific Styles */
            #${PANEL_ID}:not(.collapsed) .ai-helper-options-title { /* ... same ... */ margin: 0 0 10px 0; font-size: 1.05em; font-weight: bold; color: #a0aec0; }
            #${PANEL_ID}:not(.collapsed) .ai-helper-option-button { /* ... same ... */ display: block; width: 100%; padding: 7px 10px; margin-bottom: 6px; background-color: rgba(74, 85, 104, 0.5); border: 1px solid rgba(113, 128, 150, 0.4); border-radius: 6px; color: #e2e8f0; cursor: pointer; text-align: left; font-size: 0.95em; transition: background-color 0.2s ease, border-color 0.2s ease; white-space: normal; word-wrap: break-word; line-height: 1.4; }
            #${PANEL_ID}:not(.collapsed) .ai-helper-option-button:hover { /* ... same ... */ background-color: rgba(113, 128, 150, 0.6); border-color: rgba(160, 174, 192, 0.5); }
            #${PANEL_ID}:not(.collapsed) .ai-helper-option-button:last-child { margin-bottom: 0; }

            /* Loading state for panel content */
            #${PANEL_ID}-content-area.ai-helper-content-updating { /* ... same ... */ opacity: 0.6 !important; pointer-events: none; transition: opacity 0.1s ease !important; }

            /* Scrollbar Styles within Panel */
            #${PANEL_ID} ::-webkit-scrollbar { /* ... same ... */ width: 8px; height: 8px; }
            #${PANEL_ID} ::-webkit-scrollbar-track { /* ... same ... */ background: rgba(45, 55, 72, 0.3); border-radius: 4px; }
            #${PANEL_ID} ::-webkit-scrollbar-thumb { /* ... same ... */ background: rgba(113, 128, 150, 0.6); border-radius: 4px; border: 2px solid transparent; background-clip: content-box; }
            #${PANEL_ID} ::-webkit-scrollbar-thumb:hover { /* ... same ... */ background: rgba(160, 174, 192, 0.7); }

            /* Hide resize handle when collapsed */
            #${PANEL_ID}.collapsed #${PANEL_ID}-resize-handle { display: none; }
            /* Prevent text selection globally during drag/resize */
            body.ai-helper-dragging, body.ai-helper-resizing { user-select: none; -webkit-user-select: none; }
        `);
        logInfo("Global styles added.");
    }

    // **MODIFIED**: No longer calls simplify_createButton directly.
    function initializeScript() {
        logInfo(`Initializing ${SCRIPT_NAME}...`);
        addGlobalStyles();
        // simplify_createButton(); // REMOVED - Panel creation now handles this conditionally
        panel_createPanel(); // Create the panel UI (which now includes adding the simplify button if applicable)
        panel_setupObservers(); // Start the observers for the panel
        logInfo("Initialization complete.");
    }

    // --- Cleanup ---
    // (Cleanup logic remains IDENTICAL to v1.0 merged)
    window.addEventListener('beforeunload', () => { /* ... same cleanup ... */
        log("Running cleanup before page unload...");
        document.removeEventListener('mousemove', handlePanelMouseMove); document.removeEventListener('mouseup', handlePanelMouseUp);
        document.removeEventListener('mousemove', handlePanelMouseMoveResize); document.removeEventListener('mouseup', handlePanelMouseUpResize);
        panel_disconnectContentObserver();
        if (panelMainObserver) { panelMainObserver.disconnect(); log('Panel: Main MutationObserver disconnected.'); panelMainObserver = null; }
        log("Cleanup finished.");
    });

    // --- Start Script ---
    // (Start logic remains IDENTICAL to v1.0 merged)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeScript();
    } else {
        window.addEventListener('load', initializeScript);
    }

})(); // End of IIFE