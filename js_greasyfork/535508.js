// ==UserScript==
// @name         Gemini-Better-UI
// @name:zh-TW   Gemini 介面優化
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/Jonathan881005/Gemini-Better-UI
// @version      1.0.6
// @description  Dynamic title, adjustable chat width, delete confirmation, and canvas layout toggle.
// @description:zh-TW 動態標題、可調對話寬度、刪除確認視窗、以及Canvas佈局切換。
// @author       JonathanLU
// @match        *://gemini.google.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/1/1d/Google_Gemini_icon_2025.svg
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535508/Gemini-Better-UI.user.js
// @updateURL https://update.greasyfork.org/scripts/535508/Gemini-Better-UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Script Information ---
    const SCRIPT_NAME = 'Gemini Better UI';
    const SCRIPT_VERSION = 'v1.0.6';
    const logPrefix = `[${SCRIPT_NAME}]`;
    // console.log(`${logPrefix} ${SCRIPT_VERSION}: Script started.`);

    // --- Constants ---
    const STORAGE_KEY_CONV_WIDTH = 'geminiConversationContainerWidth';
    const CSS_VAR_CONV_WIDTH = '--conversation-container-dynamic-width';
    const DEFAULT_CONV_WIDTH_PERCENTAGE = 90;
    const MIN_CONV_WIDTH_PERCENTAGE = 50;
    const MAX_CONV_WIDTH_PERCENTAGE = 100;
    const STEP_CONV_WIDTH_PERCENTAGE = 10;
    const BUTTON_INCREASE_ID = 'gm-conv-width-increase';
    const BUTTON_DECREASE_ID = 'gm-conv-width-decrease';
    const BUTTON_UI_CONTAINER_ID = 'gm-conv-width-ui-container';
    const BUTTON_ROW_CLASS = 'gm-conv-width-button-row';
    const GRID_LAYOUT_PREV_ID = 'gm-grid-layout-prev';
    const GRID_LAYOUT_NEXT_ID = 'gm-grid-layout-next';
    const STABLE_CHAT_ROOT_SELECTOR = 'chat-window-content > div.chat-history-scroll-container';
    const UNSTABLE_ID_CHAT_ROOT_SELECTOR = 'div#chat-history';
    const USER_QUERY_OUTER_SELECTOR = `user-query`;
    const USER_QUERY_BUBBLE_SPAN_SELECTOR = `span.user-query-bubble-with-background`;
    const MODEL_RESPONSE_MAIN_PANEL_SELECTOR = `.markdown.markdown-main-panel`;
    const USER_QUERY_TEXT_DIV_SELECTOR = `div.query-text`;
    const MODEL_RESPONSE_OUTER_SELECTOR = `model-response`;
    const CHAT_WINDOW_GRID_TARGET_SELECTOR = '#app-root > main > side-navigation-v2 > bard-sidenav-container > bard-sidenav-content > div.content-wrapper > div > div.content-container > chat-window';
    const IMMERSIVE_PANEL_SELECTOR = CHAT_WINDOW_GRID_TARGET_SELECTOR + ' > immersive-panel';

    // --- Title Management Constants ---
    const SELECTED_CHAT_ITEM_SELECTOR = 'div[data-test-id="conversation"].selected .conversation-title';
    const CHAT_PAGE_REGEX = /^\/app\/[a-zA-Z0-9]+$/;
    const TITLE_POLL_MAX_ATTEMPTS = 50; // Poll for 10 seconds
    const TITLE_POLL_INTERVAL_MS = 200;

    // --- Globals ---
    const GRID_LAYOUT_STATES = ["minmax(360px, 1fr) minmax(0px, 2fr)", "minmax(360px, 2fr) minmax(0px, 3fr)", "1fr 1fr", "minmax(0px, 3fr) minmax(360px, 2fr)", "minmax(0px, 2fr) minmax(360px, 1fr)"];
    let currentGridLayoutIndex = 0, prevLayoutButtonElement = null, nextLayoutButtonElement = null, decreaseConvWidthButtonElement = null, increaseConvWidthButtonElement = null, canvasObserver = null, currentConvWidthPercentage = DEFAULT_CONV_WIDTH_PERCENTAGE;
    let originalDocTitle = 'Gemini', activeTitlePollInterval = null, chatTitleToDelete = null;
    const buttonWidth = 28, buttonMargin = 4;
    const LAYOUT_ALERT_HORIZONTAL_SHIFT = -buttonWidth - buttonMargin;
    const WIDTH_ALERT_HORIZONTAL_SHIFT = buttonWidth + buttonMargin;

    // --- Title Management Logic ---
    function isChatPage() { return CHAT_PAGE_REGEX.test(location.pathname); }
    function stopActiveTitlePoll() { if (activeTitlePollInterval) { clearInterval(activeTitlePollInterval); activeTitlePollInterval = null; } }
    function startNavigationPoll() {
        stopActiveTitlePoll();
        // console.log(`${logPrefix} [Title] Navigation/Fetch mode activated. Starting persistent poll...`);
        let pollAttempts = 0;
        let lastKnownTitle = ''; // **CORE FIX v1.0.6**: Track the last known title.

        activeTitlePollInterval = setInterval(() => {
            pollAttempts++;
            const selectedTitleElement = document.querySelector(SELECTED_CHAT_ITEM_SELECTOR);

            if (isChatPage() && selectedTitleElement) {
                const currentTitleText = selectedTitleElement.textContent.trim();
                // **CORE FIX v1.0.6**: Only update if title is new and different from the last known one.
                if (currentTitleText && currentTitleText !== lastKnownTitle) {
                    lastKnownTitle = currentTitleText;
                    const newTitle = `${lastKnownTitle} - ${originalDocTitle}`;
                    if (document.title !== newTitle) {
                        document.title = newTitle;
                        // console.log(`${logPrefix} [Title] Found new/updated title: "${lastKnownTitle}".`);
                    }
                }
            }

            // **CORE FIX v1.0.6**: Polling now only stops on timeout or leaving the chat page.
            if (pollAttempts >= TITLE_POLL_MAX_ATTEMPTS || !isChatPage()) {
                if (!isChatPage() && document.title !== originalDocTitle) {
                    document.title = originalDocTitle;
                    // console.log(`${logPrefix} [Title] Left chat page. Title reset.`);
                }
                // console.log(`${logPrefix} [Title] Poll finished.`);
                stopActiveTitlePoll();
            }
        }, TITLE_POLL_INTERVAL_MS);
    }
    function startInitialLoadWatcher() {
        stopActiveTitlePoll();
        // console.log(`${logPrefix} [Title] Initial watch mode activated. Waiting for a chat page...`);
        activeTitlePollInterval = setInterval(() => {
            if (isChatPage()) {
                // console.log(`${logPrefix} [Title] Chat page detected! Switching to fetch mode.`);
                startNavigationPoll();
            }
        }, 500);
    }
    function setupHistoryHookForTitle() {
        // console.log(`${logPrefix} [Title] Setting up history hooks.`);
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        const navigationEventHandler = (origin) => {
            // console.log(`${logPrefix} [Title] Navigation event detected from: ${origin}.`);
            startNavigationPoll();
        };
        history.pushState = function(...args) {
            const result = originalPushState.apply(this, args);
            navigationEventHandler('pushState');
            return result;
        };
        history.replaceState = function(...args) {
            const result = originalReplaceState.apply(this, args);
            navigationEventHandler('replaceState');
            return result;
        };
        window.addEventListener('popstate', () => navigationEventHandler('popstate'));
    }

    // --- Delete Confirmation Logic (Computed Style Restoration Method) ---
    function setupDeleteConfirmationListener() {
        document.body.addEventListener('mousedown', (event) => {
            const optionsButton = event.target.closest('button[data-test-id="actions-menu-button"]');
            if (optionsButton) {
                const actionsContainer = optionsButton.parentElement;
                if (actionsContainer && actionsContainer.previousElementSibling) {
                    const chatItemContainer = actionsContainer.previousElementSibling;
                    const titleElement = chatItemContainer.querySelector('.conversation-title');
                    if (titleElement && titleElement.firstChild) {
                        chatTitleToDelete = titleElement.firstChild.textContent.trim();
                        // console.log(`${logPrefix} [Delete] Captured title to delete: "${chatTitleToDelete}"`);
                    }
                }
            }
        }, true);
        // console.log(`${logPrefix} [Delete] Confirmation capture listener attached.`);
    }
    function setupDeleteDialogObserver() {
        const observer = new MutationObserver(() => {
            if (!chatTitleToDelete) return;
            const dialogTitleElement = document.querySelector('h1[data-test-id="message-dialog-title"]');
            if (dialogTitleElement && dialogTitleElement.textContent.includes('要刪除對話記錄嗎？') && !dialogTitleElement.dataset.modified) {
                const originalColor = window.getComputedStyle(dialogTitleElement).color;
                const newTitle = `要刪除 "${chatTitleToDelete}" 這個對話記錄嗎?`;
                dialogTitleElement.textContent = newTitle;
                dialogTitleElement.style.color = originalColor;
                dialogTitleElement.dataset.modified = 'true';
                // console.log(`${logPrefix} [Delete] Dialog title modified and color restored.`);
                chatTitleToDelete = null;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // console.log(`${logPrefix} [Delete] Dialog observer attached.`);
    }

    // --- UI Control Functions ---
    function getCssRules(initialConvWidthPercentage) {
        const buttonRowHeight = 28; // px
        const promptGap = -8; // px

        let css = `
            :root { ${CSS_VAR_CONV_WIDTH}: ${initialConvWidthPercentage}%; }
            #${BUTTON_UI_CONTAINER_ID} {
                position: fixed !important; right: 15px !important; bottom: 15px !important;
                z-index: 200001 !important; display: flex !important; flex-direction: column-reverse !important;
                align-items: center !important;
            }
            .gm-temp-alert {
                padding: 3px 7px !important;
                font-size: 11px !important; font-weight: 500; border-radius: 3px !important;
                width: fit-content !important;
                text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.25);
                display: block; opacity: 0;
                transition: opacity 0.15s ease-out, transform 0.15s cubic-bezier(0.25, 0.85, 0.45, 1.45);
                position: absolute;
                bottom: ${buttonRowHeight + promptGap}px;
                left: 50%; /* 相對於父容器中心 */
                z-index: 200002 !important;
                white-space: nowrap;
            }
            .gm-alert-display {
                background-color: #303134 !important; color: #cacecf !important;
            }
            .gm-alert-nope, .gm-alert-limit {
                background-color: #e53935 !important; color: white !important;
                font-size: 10px !important; font-weight: bold;
                padding: 3px 6px !important; border-radius: 4px !important;
            }
            .${BUTTON_ROW_CLASS} {
                display: flex !important; justify-content: center !important; align-items: center !important;
            }
            .gm-conv-width-control-button {
                width: ${buttonWidth}px !important; height: ${buttonWidth}px !important; padding: 0 !important;
                background-color: #3c4043 !important; color: #e8eaed !important;
                border: 1px solid #5f6368 !important; border-radius: 6px !important;
                cursor: pointer !important; font-size: 16px !important; font-weight: bold;
                line-height: ${buttonWidth - 2}px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                opacity: 0.80 !important; transition: opacity 0.2s ease-in-out, background-color 0.2s ease-in-out;
            }
            .gm-conv-width-control-button:hover:not([disabled]) {
                background-color: #4a4e51 !important; opacity: 1 !important;
            }
            .gm-conv-width-control-button[disabled] {
                opacity: 0.4 !important; cursor: not-allowed !important; background-color: #3c4043 !important;
            }
            #${GRID_LAYOUT_PREV_ID} { margin-left: 0px !important; font-size: 12px !important;}
            #${GRID_LAYOUT_NEXT_ID} { margin-left: ${buttonMargin}px !important; font-size: 12px !important; }
            #${BUTTON_DECREASE_ID} { margin-left: ${buttonMargin}px !important; }
            #${BUTTON_INCREASE_ID} { margin-left: ${buttonMargin}px !important; }

            ${STABLE_CHAT_ROOT_SELECTOR}, ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} {
                width: 90% !important; max-width: 1700px !important; margin: auto !important;
                padding-top: 0px !important; padding-bottom: 20px !important;
                box-sizing: border-box !important; position: relative !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container,
            ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} .conversation-container {
                width: var(${CSS_VAR_CONV_WIDTH}) !important; max-width: 100% !important;
                margin: 10px auto !important; padding: 0 15px !important;
                box-sizing: border-box !important; overflow: hidden !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR},
            ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} {
                width: 100% !important; max-width: none !important; display: flex !important;
                justify-content: flex-end !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${MODEL_RESPONSE_OUTER_SELECTOR},
            ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} .conversation-container ${MODEL_RESPONSE_OUTER_SELECTOR} {
                width: 100% !important; max-width: none !important; display: flex !important;
                justify-content: flex-start !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} > span.user-query-container.right-align-content,
            ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} > span.user-query-container.right-align-content,
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${MODEL_RESPONSE_OUTER_SELECTOR} > div:first-child {
                max-width: 90% !important;
                margin: 0 !important;
                box-sizing: border-box !important;
                display: flex !important;
                justify-content: flex-end !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} ${USER_QUERY_TEXT_DIV_SELECTOR},
            ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} ${USER_QUERY_TEXT_DIV_SELECTOR} {
                text-align: left !important; width: 100% !important; white-space: normal !important;
                overflow-wrap: break-word !important; word-wrap: break-word !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} ${USER_QUERY_TEXT_DIV_SELECTOR} p.query-text-line,
            ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} ${USER_QUERY_TEXT_DIV_SELECTOR} p.query-text-line {
                white-space: normal !important; margin: 0 !important; padding: 0 !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} ${USER_QUERY_BUBBLE_SPAN_SELECTOR},
            ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} ${USER_QUERY_BUBBLE_SPAN_SELECTOR},
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${MODEL_RESPONSE_OUTER_SELECTOR} ${MODEL_RESPONSE_MAIN_PANEL_SELECTOR},
            ${UNSTABLE_ID_CHAT_ROOT_SELECTOR} .conversation-container ${MODEL_RESPONSE_OUTER_SELECTOR} ${MODEL_RESPONSE_MAIN_PANEL_SELECTOR} {
                padding: 8px 12px !important;
                min-height: 1.5em !important;
                box-sizing: border-box !important;
                word-break: break-word !important;
                max-width: calc(1024px - var(--gem-sys-spacing--m)*2) !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} user-query-content,
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR} user-query-content > div.user-query-bubble-container {
                width: 100% !important;
                box-sizing: border-box !important;
                margin: 0 !important;
            }
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${MODEL_RESPONSE_OUTER_SELECTOR} > div:first-child response-container,
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${MODEL_RESPONSE_OUTER_SELECTOR} > div:first-child .presented-response-container,
            ${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${MODEL_RESPONSE_OUTER_SELECTOR} > div:first-child .response-container-content {
                width: 100% !important; box-sizing: border-box !important; margin: 0 !important; padding: 0 !important;
            }
        `;

        const uqOuter = `${STABLE_CHAT_ROOT_SELECTOR} .conversation-container ${USER_QUERY_OUTER_SELECTOR}`;
        const actualBubbleDivEditMode = `> span.user-query-container.right-align-content > user-query-content.user-query-container.edit-mode > div.user-query-container.user-query-bubble-container.edit-mode`;
        const queryContentWrapperInBubbleEditMode = `${actualBubbleDivEditMode} > div.query-content.edit-mode`;
        const matFormFieldInEditMode = `${queryContentWrapperInBubbleEditMode} > div.edit-container > mat-form-field.edit-form`;
        const textareaElementInEditMode = `${matFormFieldInEditMode} textarea.mat-mdc-input-element.cdk-textarea-autosize`;

        css += `
            ${uqOuter} ${actualBubbleDivEditMode} {
                max-width: calc(1024px - var(--gem-sys-spacing--m)*2) !important;
                width: 100% !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
                display: flex !important;
                flex-direction: column !important;
            }
            ${uqOuter} ${queryContentWrapperInBubbleEditMode} {
                width: 90% !important;
                margin-left: auto !important;
                margin-right: 0 !important;
                box-sizing: border-box !important;
            }
            ${uqOuter} ${matFormFieldInEditMode} {
                width: 100% !important;
                box-sizing: border-box !important;
                display: flex !important;
                flex-direction: column !important;
            }
            ${uqOuter} ${matFormFieldInEditMode} .mat-mdc-text-field-wrapper,
            ${uqOuter} ${matFormFieldInEditMode} .mat-mdc-form-field-flex,
            ${uqOuter} ${matFormFieldInEditMode} .mat-mdc-form-field-infix {
                width: 100% !important;
                max-height: 540px;
                box-sizing: border-box !important;
                flex-grow: 1 !important;
            }
            ${uqOuter} ${textareaElementInEditMode} {
            }
        `;
        return css;
    }
    function updateButtonTitles() { if (prevLayoutButtonElement) prevLayoutButtonElement.title = `Prev Canvas Layout / 上個 Canvas 佈局 (${currentGridLayoutIndex + 1}/${GRID_LAYOUT_STATES.length})`; if (nextLayoutButtonElement) nextLayoutButtonElement.title = `Next Layout / 下個 Canvas 佈局 (${currentGridLayoutIndex + 1}/${GRID_LAYOUT_STATES.length})`; if (decreaseConvWidthButtonElement) decreaseConvWidthButtonElement.title = `Width - / 寬度 - (${currentConvWidthPercentage}%)`; if (increaseConvWidthButtonElement) increaseConvWidthButtonElement.title = `Width + / 寬度 + (${currentConvWidthPercentage}%)`; }
    function showDynamicTemporaryAlert(text, alertTypeClass, horizontalShift) { const uiContainer = document.getElementById(BUTTON_UI_CONTAINER_ID); if (!uiContainer) return; const alertElement = document.createElement('div'); alertElement.classList.add('gm-temp-alert', alertTypeClass); alertElement.textContent = text; alertElement.style.transform = `translateX(calc(-50% + ${horizontalShift}px)) translateY(5px)`; uiContainer.appendChild(alertElement); requestAnimationFrame(() => { alertElement.style.opacity = (alertTypeClass === 'gm-alert-nope' || alertTypeClass === 'gm-alert-limit') ? '0.7' : '0.8'; alertElement.style.transform = `translateX(calc(-50% + ${horizontalShift}px)) translateY(-10px)`; }); const visibleDuration = (alertTypeClass === 'gm-alert-display') ? 350 : 250; setTimeout(() => { alertElement.style.opacity = '0'; alertElement.style.transform = `translateX(calc(-50% + ${horizontalShift}px)) translateY(-25px)`; setTimeout(() => { if (alertElement.parentNode) alertElement.parentNode.removeChild(alertElement); }, 150); }, visibleDuration); }
    function updateLayoutButtonStates() { const immersivePanel = document.querySelector(IMMERSIVE_PANEL_SELECTOR); const canvasIsVisible = immersivePanel && window.getComputedStyle(immersivePanel).display !== 'none'; if (prevLayoutButtonElement) prevLayoutButtonElement.disabled = !canvasIsVisible || (currentGridLayoutIndex === 0); if (nextLayoutButtonElement) nextLayoutButtonElement.disabled = !canvasIsVisible || (currentGridLayoutIndex === GRID_LAYOUT_STATES.length - 1); updateButtonTitles(); }
    function applyGridLayout(newIndex) { currentGridLayoutIndex = newIndex; const chatWindow = document.querySelector(CHAT_WINDOW_GRID_TARGET_SELECTOR); if (chatWindow) { chatWindow.style.setProperty('grid-template-columns', GRID_LAYOUT_STATES[currentGridLayoutIndex], 'important'); const immersivePanelElement = document.querySelector(IMMERSIVE_PANEL_SELECTOR); if (immersivePanelElement && window.getComputedStyle(immersivePanelElement).display === 'none' && currentGridLayoutIndex !== 0) { immersivePanelElement.style.setProperty('display', 'block', 'important'); } } updateLayoutButtonStates(); showDynamicTemporaryAlert(`(${currentGridLayoutIndex + 1}/${GRID_LAYOUT_STATES.length})`, 'gm-alert-display', LAYOUT_ALERT_HORIZONTAL_SHIFT); }
    function updateConversationContainerWidth(newPercentage, fromButton = true) { const oldPercentage = currentConvWidthPercentage; const clampedPercentage = Math.max(MIN_CONV_WIDTH_PERCENTAGE, Math.min(MAX_CONV_WIDTH_PERCENTAGE, newPercentage)); if (fromButton) { if (newPercentage < MIN_CONV_WIDTH_PERCENTAGE && oldPercentage === MIN_CONV_WIDTH_PERCENTAGE) { showDynamicTemporaryAlert("Min!", 'gm-alert-limit', WIDTH_ALERT_HORIZONTAL_SHIFT); return; } if (newPercentage > MAX_CONV_WIDTH_PERCENTAGE && oldPercentage === MAX_CONV_WIDTH_PERCENTAGE) { showDynamicTemporaryAlert("Max!", 'gm-alert-limit', WIDTH_ALERT_HORIZONTAL_SHIFT); return; } } currentConvWidthPercentage = clampedPercentage; document.documentElement.style.setProperty(CSS_VAR_CONV_WIDTH, currentConvWidthPercentage + '%'); localStorage.setItem(STORAGE_KEY_CONV_WIDTH, currentConvWidthPercentage); if (fromButton) showDynamicTemporaryAlert(`${currentConvWidthPercentage}%`, 'gm-alert-display', WIDTH_ALERT_HORIZONTAL_SHIFT); updateButtonTitles(); }
    function createControlButtons() { if (document.getElementById(BUTTON_UI_CONTAINER_ID)) return; const uiContainer = document.createElement('div'); uiContainer.id = BUTTON_UI_CONTAINER_ID; const buttonRow = document.createElement('div'); buttonRow.classList.add(BUTTON_ROW_CLASS); prevLayoutButtonElement = document.createElement('button'); prevLayoutButtonElement.id = GRID_LAYOUT_PREV_ID; prevLayoutButtonElement.textContent = '|<'; prevLayoutButtonElement.classList.add('gm-conv-width-control-button'); prevLayoutButtonElement.addEventListener('click', () => { const immersivePanel = document.querySelector(IMMERSIVE_PANEL_SELECTOR); if (!immersivePanel || window.getComputedStyle(immersivePanel).display === 'none') { showDynamicTemporaryAlert("Nope!", 'gm-alert-nope', LAYOUT_ALERT_HORIZONTAL_SHIFT); return; } if (currentGridLayoutIndex > 0) applyGridLayout(currentGridLayoutIndex - 1); else updateLayoutButtonStates(); }); nextLayoutButtonElement = document.createElement('button'); nextLayoutButtonElement.id = GRID_LAYOUT_NEXT_ID; nextLayoutButtonElement.textContent = '>|'; nextLayoutButtonElement.classList.add('gm-conv-width-control-button'); nextLayoutButtonElement.addEventListener('click', () => { const immersivePanel = document.querySelector(IMMERSIVE_PANEL_SELECTOR); if (!immersivePanel || window.getComputedStyle(immersivePanel).display === 'none') { showDynamicTemporaryAlert("Nope!", 'gm-alert-nope', LAYOUT_ALERT_HORIZONTAL_SHIFT); return; } if (currentGridLayoutIndex < GRID_LAYOUT_STATES.length - 1) applyGridLayout(currentGridLayoutIndex + 1); else updateLayoutButtonStates(); }); decreaseConvWidthButtonElement = document.createElement('button'); decreaseConvWidthButtonElement.id = BUTTON_DECREASE_ID; decreaseConvWidthButtonElement.textContent = '-'; decreaseConvWidthButtonElement.classList.add('gm-conv-width-control-button'); decreaseConvWidthButtonElement.addEventListener('click', () => updateConversationContainerWidth(currentConvWidthPercentage - STEP_CONV_WIDTH_PERCENTAGE, true)); increaseConvWidthButtonElement = document.createElement('button'); increaseConvWidthButtonElement.id = BUTTON_INCREASE_ID; increaseConvWidthButtonElement.textContent = '+'; increaseConvWidthButtonElement.classList.add('gm-conv-width-control-button'); increaseConvWidthButtonElement.addEventListener('click', () => updateConversationContainerWidth(currentConvWidthPercentage + STEP_CONV_WIDTH_PERCENTAGE, true)); buttonRow.appendChild(prevLayoutButtonElement); buttonRow.appendChild(nextLayoutButtonElement); buttonRow.appendChild(decreaseConvWidthButtonElement); buttonRow.appendChild(increaseConvWidthButtonElement); uiContainer.appendChild(buttonRow); document.body.appendChild(uiContainer); }
    function setupCanvasObserver(chatWindowElement) { if (canvasObserver) canvasObserver.disconnect(); canvasObserver = new MutationObserver(updateLayoutButtonStates); canvasObserver.observe(chatWindowElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] }); updateLayoutButtonStates(); }
    function waitForElement(selector, callback, timeout = 20000) {
        const pollInterval = 200; let elapsedTime = 0;
        const intervalId = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) { clearInterval(intervalId); callback(element); }
            else {
                elapsedTime += pollInterval;
                if (elapsedTime >= timeout) { clearInterval(intervalId); console.warn(`${logPrefix} Timed out waiting for element: "${selector}"`); }
            }
        }, pollInterval);
    }

    // --- Initialization ---
    function initialize() {
        originalDocTitle = document.title || 'Gemini';
        currentConvWidthPercentage = parseInt(localStorage.getItem(STORAGE_KEY_CONV_WIDTH), 10) || DEFAULT_CONV_WIDTH_PERCENTAGE;
        document.documentElement.style.setProperty(CSS_VAR_CONV_WIDTH, currentConvWidthPercentage + '%');
        const style = document.createElement('style');
        style.textContent = getCssRules(currentConvWidthPercentage);
        document.head.appendChild(style);

        // Setup UI Controls
        createControlButtons();
        updateButtonTitles();
        waitForElement(CHAT_WINDOW_GRID_TARGET_SELECTOR, (chatWindow) => {
            try {
                const currentLayout = window.getComputedStyle(chatWindow).gridTemplateColumns;
                const normalized = currentLayout.replace(/\s+/g, ' ').trim();
                const idx = GRID_LAYOUT_STATES.findIndex(s => s.replace(/\s+/g, ' ').trim() === normalized);
                currentGridLayoutIndex = (idx !== -1) ? idx : 0;
            } catch(e) { currentGridLayoutIndex = 0; }
            setupCanvasObserver(chatWindow);
        });

        // Setup Title Logic
        setupHistoryHookForTitle();
        if (isChatPage()) {
            startNavigationPoll();
        } else {
            startInitialLoadWatcher();
        }

        // Setup Delete Confirmation Feature
        setupDeleteConfirmationListener();
        setupDeleteDialogObserver();
    }

    initialize();
})();