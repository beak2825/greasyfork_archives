// ==UserScript==
// @name         Google AI Studio - Ultimate Hebrew Alignment & Tools (v3.2)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Adds full Hebrew support to the AI Studio interface and a dynamic prompt menu. Fixes injection and prompt stacking bugs.
// @author       Gemini AI & Yuval
// @match        https://aistudio.google.com/*
// @connect      raw.githubusercontent.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542486/Google%20AI%20Studio%20-%20Ultimate%20Hebrew%20Alignment%20%20Tools%20%28v32%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542486/Google%20AI%20Studio%20-%20Ultimate%20Hebrew%20Alignment%20%20Tools%20%28v32%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const GITHUB_PROMPTS_URL = 'https://raw.githubusercontent.com/YuvalHir/AI-Studio-Prompts-and-Tools/main/prompts.json';
    const PROMPT_CACHE_KEY = 'fast_prompts_cache_v3.2';
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;

    const FALLBACK_PROMPTS = [
        { name: "⚠️ Could not load. Using fallback.", url: "" },
        { name: "🧑‍💻 Prompt Engineer", prompt: "Act as a prompt engineer..." },
        { name: "📱 WhatsApp Formatter", prompt: "Please reformat the previous response..." }
    ];

    // --- Selectors ---
    const SELECTORS = {
        header: 'ms-header-root .top-nav',
        chatContainer: '.chat-container',
        chatTurn: 'ms-chat-turn',
        modelContent: 'ms-cmark-node',
        systemInstructionsButton: 'button[data-test-si]',
        systemInstructionsTextarea: 'textarea[aria-label="System instructions"]',
        closeSystemInstructionsButton: 'button[aria-label="Close system instructions"]',
        systemInstructionsPanel: 'ms-system-instructions',
        modelSelectorContainer: '.settings-model-selector'
    };

    // --- Script State ---
    const state = {
        rtlEnabled: GM_getValue('rtl_enabled_v1.5', true),
        mathjaxInjectEnabled: GM_getValue('mathjax_inject_enabled_v2.8', true),
        fastPrompts: []
    };
    let chatObserver = null;
    let hasAutoInjectedMathJax = false;

    // --- Styles ---
    const getCss = () => `
        .rtl-script-enabled .chat-view-container, .rtl-script-enabled textarea { direction: rtl !important; }
        .rtl-script-enabled ${SELECTORS.modelContent} p, .rtl-script-enabled ${SELECTORS.modelContent} li { text-align: right !important; }
        .rtl-script-enabled ${SELECTORS.modelContent} ul, .rtl-script-enabled ${SELECTORS.modelContent} ol { padding-right: 24px !important; padding-left: 0 !important; }
        ms-katex, .katex, pre, code, .code-block, .ltr-text, .ltr-text * { direction: ltr !important; text-align: left !important; unicode-bidi: embed !important; }
        .ltr-text ul, .ltr-text ol { padding-left: 24px !important; padding-right: 0 !important; }
        .rtl-script-controls-container { display: flex; align-items: center; margin-left: 16px; gap: 16px; }
        .rtl-script-toggle-label { color: light-dark(#1a1c1e, #e2e2e5); font-family: 'Google Sans', 'Roboto', sans-serif; font-size: 14px; font-weight: 500; cursor: default; }
        .rtl-script-toggle-switch { position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0; }
        .rtl-script-toggle-switch input { opacity: 0; width: 0; height: 0; }
        .rtl-script-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #9E9E9E; transition: .3s; border-radius: 20px; }
        .rtl-script-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        .rtl-script-toggle-switch input:checked + .rtl-script-slider { background-color: #1a73e8; }
        .rtl-script-toggle-switch input:checked + .rtl-script-slider:before { transform: translateX(16px); }
        .script-options-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background-color: #1a73e8; color: white !important; border: none; font-family: 'Google Sans', sans-serif; font-size: 14px; font-weight: 500; height: 32px; padding: 0 16px; border-radius: 16px; cursor: pointer; transition: background-color .3s; text-decoration: none !important; }
        .script-options-button:hover { background-color: #287ae6; }
        .script-options-button .material-symbols-outlined { font-size: 20px; }
        #fast-prompts-container .item-input-form-field { position: relative; }
        #fast-prompts-select { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .script-toast-notification { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #323232; color: white; padding: 12px 24px; border-radius: 8px; z-index: 10000; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); opacity: 0; transition: opacity 0.5s ease-in-out; }
    `;

    // --- Helper Functions ---
    const createAndAppend = (parent, tag, options = {}) => {
        const element = document.createElement(tag);
        Object.entries(options).forEach(([key, value]) => {
            if (key === 'className') element.className = value;
            else if (key === 'textContent') element.textContent = value;
            else element.setAttribute(key, value);
        });
        parent.appendChild(element);
        return element;
    };

    const waitForElement = (selector, callback, timeout = 10000) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }
        const observer = new MutationObserver((mutations, me) => {
            const foundElement = document.querySelector(selector);
            if (foundElement) {
                me.disconnect();
                callback(foundElement);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        if (timeout) {
            setTimeout(() => observer.disconnect(), timeout);
        }
    };

    const showToastNotification = (message) => {
        const existingToast = document.querySelector('.script-toast-notification');
        if (existingToast) existingToast.remove();
        const toast = createAndAppend(document.body, 'div', { className: 'script-toast-notification', textContent: message });
        setTimeout(() => { toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    const request = (options) => {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({ ...options, onload: resolve, onerror: reject, ontimeout: reject });
        });
    };

    // --- Core Logic ---

    /**
     * **FIXED**
     * Updates the system instructions, correctly clearing the previous injection.
     * @param {string} newText - The new text to inject.
     * @param {string} sourceName - The name of the prompt/feature injecting the text.
     */
    const updateSystemInstructions = (newText, sourceName) => {
        waitForElement(SELECTORS.systemInstructionsButton, (button) => {
            const performInjection = () => {
                waitForElement(SELECTORS.systemInstructionsTextarea, (textarea) => {
                    const SCRIPT_MARKER_START = "\n\n// --- Injected by '";
                    const currentValue = textarea.value;
                    let baseText = currentValue.trim();

                    const markerIndex = currentValue.indexOf(SCRIPT_MARKER_START);

                    // If a marker from our script is found, only keep the text BEFORE it.
                    if (markerIndex !== -1) {
                        baseText = currentValue.substring(0, markerIndex).trim();
                    }

                    const newMarker = `${SCRIPT_MARKER_START}${sourceName}' from the script --- //\n`;
                    // Construct the new content: the clean base text + the new injected prompt.
                    const fullText = (baseText ? baseText + "\n" : "") + newMarker + newText;

                    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                    valueSetter.call(textarea, fullText);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));

                    showToastNotification(`'${sourceName}' prompt injected!`);
                });
            };

            const systemInstructionsPanel = document.querySelector(SELECTORS.systemInstructionsPanel);
            const isPanelVisible = systemInstructionsPanel && getComputedStyle(systemInstructionsPanel).display !== 'none';

            if (isPanelVisible) {
                performInjection();
            } else {
                button.click();
                setTimeout(performInjection, 150);
            }
        });
    };

    const isMostlyLtr = (text) => {
        if (!text || !text.trim()) return false;
        const hebrewChars = (text.match(/[\u0590-\u05FF]/g) || []).length;
        const latinChars = (text.match(/[a-zA-Z0-9]/g) || []).length;
        return hebrewChars === 0 && latinChars > 10;
    };

    const processTurnNode = (turnNode) => {
        if (!state.rtlEnabled) return;
        const modelContent = turnNode.querySelector(SELECTORS.modelContent);
        if (modelContent && isMostlyLtr(modelContent.textContent)) {
            modelContent.classList.add('ltr-text');
        }
    };

    const startChatObserver = () => {
        if (chatObserver || !state.rtlEnabled) return;
        waitForElement(SELECTORS.chatContainer, (chatContainer) => {
            chatObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === 1) {
                        if (addedNode.matches(SELECTORS.chatTurn)) processTurnNode(addedNode);
                        else addedNode.querySelectorAll(SELECTORS.chatTurn).forEach(processTurnNode);
                    }
                }));
            });
            chatObserver.observe(chatContainer, { childList: true, subtree: true });
            chatContainer.querySelectorAll(SELECTORS.chatTurn).forEach(processTurnNode);
        });
    };

    const stopChatObserver = () => {
        if (chatObserver) {
            chatObserver.disconnect();
            chatObserver = null;
        }
    };

    const toggleRtlFeature = (isEnabled) => {
        document.body.classList.toggle('rtl-script-enabled', isEnabled);
        isEnabled ? startChatObserver() : stopChatObserver();
    };

    /**
     * **FIXED**
     * Automatically opens the panel, injects the MathJax prompt, and closes it.
     */
    const initiateAutomaticMathJaxInjection = () => {
        if (!state.mathjaxInjectEnabled || hasAutoInjectedMathJax) return;

        console.log("RTL Script: Attempting automatic MathJax injection...");
        hasAutoInjectedMathJax = true; // Set true immediately to prevent re-runs

        waitForElement(SELECTORS.systemInstructionsButton, (openButton) => {
            // Check if the panel is already open
            const isPanelVisible = () => document.querySelector(SELECTORS.systemInstructionsPanel) && getComputedStyle(document.querySelector(SELECTORS.systemInstructionsPanel)).display !== 'none';

            const injectAndClose = () => {
                waitForElement(SELECTORS.systemInstructionsTextarea, (textarea) => {
                    if (!textarea.value.includes('Added by RTL Fix Script')) {
                        const promptText = `\n\n// Added by RTL Fix Script:\nFor any mathematical questions or content, please use MathJax3 syntax (e.g., $$...$$ for display mode and $...$ for inline formulas) to ensure that all equations are rendered clearly, legibly, and correctly.`;
                        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                        valueSetter.call(textarea, textarea.value + promptText);
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        console.log("RTL Script: Auto-injected MathJax prompt.");
                    }

                    // Now, find the close button and click it
                    const closeButton = document.querySelector(SELECTORS.closeSystemInstructionsButton);
                    if (closeButton) {
                        closeButton.click();
                        console.log("RTL Script: Closed system instructions panel.");
                    }
                });
            };

            if (isPanelVisible()) {
                injectAndClose();
            } else {
                openButton.click();
                // No timeout needed here because waitForElement will wait for the textarea
                injectAndClose();
            }
        });
    };


    const applyFastPrompt = (prompt) => {
        if (!prompt) return;
        if (prompt.prompt) {
            updateSystemInstructions(prompt.prompt, prompt.name);
        } else if (prompt.url) {
            showToastNotification(`Loading '${prompt.name}'...`);
            request({ method: "GET", url: prompt.url })
                .then(response => updateSystemInstructions(response.responseText, prompt.name))
                .catch(error => {
                    console.error("Failed to fetch prompt:", error);
                    showToastNotification(`Error loading '${prompt.name}'.`);
                });
        }
    };

    // --- UI Creation ---
    function createUiControls(header) {
        if (document.querySelector('.rtl-script-controls-container')) return;
        const container = createAndAppend(header, 'div', { className: 'rtl-script-controls-container' });
        createAndAppend(container, 'span', { className: 'rtl-script-toggle-label', textContent: 'Hebrew Mode' });
        const switchLabel = createAndAppend(container, 'label', { className: 'rtl-script-toggle-switch' });
        const checkbox = createAndAppend(switchLabel, 'input', { type: 'checkbox' });
        checkbox.checked = state.rtlEnabled;
        createAndAppend(switchLabel, 'span', { className: 'rtl-script-slider' });
        checkbox.addEventListener('change', () => {
            state.rtlEnabled = checkbox.checked;
            GM_setValue('rtl_enabled_v1.5', state.rtlEnabled);
            toggleRtlFeature(state.rtlEnabled);
        });
        const button = createAndAppend(container, 'button', { className: 'script-options-button' });
        createAndAppend(button, 'span', { className: 'material-symbols-outlined', textContent: 'tune' });
        createAndAppend(button, 'span', { textContent: 'Script Options' });
        button.addEventListener('click', () => {
            const panel = document.getElementById('rtl-script-options-panel');
            if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });
        header.prepend(container);
    }

    function createOptionsPanel() {
        if (document.getElementById('rtl-script-options-panel')) return;
        const panel = createAndAppend(document.body, 'div', { id: 'rtl-script-options-panel' });
        panel.style.cssText = `position: fixed; top: 60px; left: 50%; transform: translateX(-50%); background: white; color: black; border: 1px solid #ccc; border-radius: 8px; padding: 20px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: none; text-align: left; direction: ltr;`;
        createAndAppend(panel, 'h3', { textContent: 'Script Options', style: 'margin: 0 0 15px 0; font-weight: 500;' });
        const row = createAndAppend(panel, 'div', { style: 'display: flex; align-items: center; justify-content: space-between;' });
        createAndAppend(row, 'label', { textContent: 'Auto-inject MathJax prompt:', for: 'mathjax-toggle', style: 'margin-right: 15px;' });
        const toggle = createAndAppend(row, 'input', { type: 'checkbox', id: 'mathjax-toggle' });
        toggle.checked = state.mathjaxInjectEnabled;
        toggle.addEventListener('change', () => {
            state.mathjaxInjectEnabled = toggle.checked;
            GM_setValue('mathjax_inject_enabled_v2.8', state.mathjaxInjectEnabled);
        });
        const closeBtn = createAndAppend(panel, 'button', { textContent: 'Close', style: 'margin-top: 20px; float: right; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; cursor: pointer;' });
        closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });
    }

    function createFastPromptsUI(modelSelectorContainer) {
        if (document.getElementById('fast-prompts-container')) return;
        const container = document.createElement('div'); container.id = 'fast-prompts-container'; container.className = 'settings-item settings-item-column';
        const itemAbout = createAndAppend(container, 'div', { className: 'item-about' });
        const itemDescription = createAndAppend(itemAbout, 'div', { className: 'item-description' });
        createAndAppend(itemDescription, 'h3', { className: 'gmat-body-medium', textContent: 'Fast Prompts' });
        const inputWrapper = createAndAppend(container, 'div', { className: 'item-input-form-field form-field-density--4' });
        const fakeFormField = createAndAppend(inputWrapper, 'div', { className: 'mat-mdc-form-field mat-form-field-appearance-outline' });
        const textFieldWrapper = createAndAppend(fakeFormField, 'div', { className: 'mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label' });
        const formFieldFlex = createAndAppend(textFieldWrapper, 'div', { className: 'mat-mdc-form-field-flex' });
        const notchedOutline = createAndAppend(formFieldFlex, 'div', { className: 'mdc-notched-outline mdc-notched-outline--no-label' });
        createAndAppend(notchedOutline, 'div', { className: 'mat-mdc-notch-piece mdc-notched-outline__leading' });
        createAndAppend(notchedOutline, 'div', { className: 'mat-mdc-notch-piece mdc-notched-outline__notch' });
        createAndAppend(notchedOutline, 'div', { className: 'mat-mdc-notch-piece mdc-notched-outline__trailing' });
        const infix = createAndAppend(formFieldFlex, 'div', { className: 'mat-mdc-form-field-infix' });
        const selectTrigger = createAndAppend(infix, 'div', { className: 'mat-mdc-select-trigger' });
        const selectValue = createAndAppend(selectTrigger, 'div', { className: 'mat-mdc-select-value' });
        const valueTextSpan = createAndAppend(selectValue, 'span', { className: 'mat-mdc-select-min-line', id: 'fast-prompts-value-text', textContent: 'Loading Prompts...' });
        const arrowWrapper = createAndAppend(selectTrigger, 'div', { className: 'mat-mdc-select-arrow-wrapper' });
        const arrow = createAndAppend(arrowWrapper, 'div', { className: 'mat-mdc-select-arrow' });
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', '24px'); svg.setAttribute('height', '24px');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', 'M7 10l5 5 5-5z');
        svg.appendChild(path); arrow.appendChild(svg);
        const select = createAndAppend(inputWrapper, 'select', { id: 'fast-prompts-select' }); select.disabled = true;
        select.addEventListener('change', () => {
            if (select.value && select.value !== '--placeholder--') {
                const selectedPrompt = state.fastPrompts[parseInt(select.value)];
                valueTextSpan.textContent = selectedPrompt.name;
                applyFastPrompt(selectedPrompt);
                setTimeout(() => {
                    select.value = '--placeholder--';
                    valueTextSpan.textContent = 'No prompt active';
                }, 400);
            }
        });
        modelSelectorContainer.insertAdjacentElement('afterend', container);
    }

    function updateFastPromptsDropdown() {
        const select = document.getElementById('fast-prompts-select');
        const valueTextSpan = document.getElementById('fast-prompts-value-text');
        if (!select || !valueTextSpan) return;
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        createAndAppend(select, 'option', { value: '--placeholder--', textContent: 'No prompt active', disabled: 'disabled', selected: 'selected' });
        state.fastPrompts.forEach((prompt, index) => {
            createAndAppend(select, 'option', { value: index, textContent: prompt.name });
        });
        valueTextSpan.textContent = 'No prompt active';
        select.disabled = false;
    }

    async function initializePrompts() {
        const cache = GM_getValue(PROMPT_CACHE_KEY, { timestamp: 0, data: null });
        if (Date.now() - cache.timestamp < CACHE_EXPIRY_MS && cache.data) {
            state.fastPrompts = cache.data;
            updateFastPromptsDropdown();
            return;
        }
        try {
            const response = await request({ method: "GET", url: GITHUB_PROMPTS_URL });
            const data = JSON.parse(response.responseText);
            state.fastPrompts = data;
            GM_setValue(PROMPT_CACHE_KEY, { timestamp: Date.now(), data });
        } catch (error) {
            console.error("RTL Script: Failed to fetch prompts. Using fallback.", error);
            state.fastPrompts = FALLBACK_PROMPTS;
        } finally {
            updateFastPromptsDropdown();
        }
    }

    // --- Script Initialization ---
    function init() {
        console.log("RTL Script: Initializing v3.2...");
        GM_addStyle(getCss());

        waitForElement(SELECTORS.header, header => {
            createUiControls(header);
            createOptionsPanel();
        });

        initiateAutomaticMathJaxInjection();

        waitForElement(SELECTORS.modelSelectorContainer, container => {
            createFastPromptsUI(container);
            initializePrompts();
        });

        toggleRtlFeature(state.rtlEnabled);
        console.log(`RTL Script: Hebrew Mode is ${state.rtlEnabled ? 'ON' : 'OFF'}.`);
    }

    init();

})();
