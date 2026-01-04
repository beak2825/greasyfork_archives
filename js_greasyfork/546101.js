// ==UserScript==
// @name         Multi-Platform AI Prompt Manager
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Save, manage and insert prompts across multiple AI chatbot platforms with improved input detection, fixed visibility, dark mode support, better insertion, and enhanced UX
// @author       skyline/imwaitingnow
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://x.com/i/grok*
// @match        https://twitter.com/i/grok*
// @match        https://chat.deepseek.com/*
// @match        https://chat.qwen.ai/*
// @match        https://qwen.alibaba.com/*
// @match        https://tongyi.aliyun.com/*
// @match        https://grok.com/*
// @match        https://gemini.google.com/*
// @match        https://chat.z.ai/*
// @match        https://www.kimi.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/546101/Multi-Platform%20AI%20Prompt%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/546101/Multi-Platform%20AI%20Prompt%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let PLATFORM_CONFIG = {
        chatgpt: {
            name: 'ChatGPT',
            domains: ['chatgpt.com', 'chat.openai.com'],
            storageKey: 'chatgpt_saved_prompts',
            theme: {
                primary: '#10a37f',
                primaryDark: '#0e8c6a',
                secondary: '#f7f7f8',
                surface: '#ffffff',
                surfaceSecondary: '#f7f7f8',
                text: '#353740',
                textSecondary: '#8e8ea0',
                border: '#e5e5e5',
                borderMedium: '#d1d5db',
                shadow: 'rgba(0,0,0,0.1)'
            },
            darkTheme: {
                primary: '#10a37f',
                primaryDark: '#0e8c6a',
                secondary: '#202123',
                surface: '#343541',
                surfaceSecondary: '#40414f',
                text: '#ececf1',
                textSecondary: '#a3a3a3',
                border: '#4d4d4f',
                borderMedium: '#5e5e60',
                shadow: 'rgba(0,0,0,0.1)'
            },
            icon: '🤖'
        },
        claude: {
            name: 'Claude',
            domains: ['claude.ai'],
            storageKey: 'claude_saved_prompts',
            theme: {
                primary: '#CC785C',
                primaryDark: '#b8654a',
                secondary: '#f5f5f5',
                surface: '#ffffff',
                surfaceSecondary: '#f8f8f8',
                text: '#1f2937',
                textSecondary: '#6b7280',
                border: '#e5e7eb',
                borderMedium: '#d1d5db',
                shadow: 'rgba(204, 120, 92, 0.15)'
            },
            icon: '🔶'
        },
        grok: {
            name: 'Grok',
            domains: ['x.com', 'twitter.com', 'grok.com'],
            storageKey: 'grok_saved_prompts',
            theme: {
                primary: '#1d9bf0',
                primaryDark: '#1a8cd8',
                secondary: '#16181c',
                surface: '#000000',
                surfaceSecondary: '#16181c',
                text: '#e7e9ea',
                textSecondary: '#71767b',
                border: '#2f3336',
                borderMedium: '#3e4348',
                shadow: 'rgba(29, 155, 240, 0.15)'
            },
            icon: '🚀'
        },
        deepseek: {
            name: 'DeepSeek',
            domains: ['chat.deepseek.com'],
            storageKey: 'deepseek_saved_prompts',
            theme: {
                primary: '#2563eb',
                primaryDark: '#1d4ed8',
                secondary: '#f8fafc',
                surface: '#ffffff',
                surfaceSecondary: '#f1f5f9',
                text: '#0f172a',
                textSecondary: '#64748b',
                border: '#e2e8f0',
                borderMedium: '#cbd5e1',
                shadow: 'rgba(37, 99, 235, 0.15)'
            },
            icon: '🌊'
        },
        qwen: {
            name: 'Qwen',
            domains: ['chat.qwen.ai', 'qwen.alibaba.com', 'tongyi.aliyun.com'],
            storageKey: 'qwen_saved_prompts',
            theme: {
                primary: '#ff6a00',
                primaryDark: '#e55a00',
                secondary: '#fef7ed',
                surface: '#ffffff',
                surfaceSecondary: '#fef2e2',
                text: '#1c1c1c',
                textSecondary: '#666666',
                border: '#fed7aa',
                borderMedium: '#fdba74',
                shadow: 'rgba(255, 106, 0, 0.15)'
            },
            icon: '🔥'
        },
        gemini: {
            name: 'Gemini',
            domains: ['gemini.google.com'],
            storageKey: 'gemini_saved_prompts',
            theme: {
                primary: '#4285f4',
                primaryDark: '#3367d6',
                secondary: '#f8f9fa',
                surface: '#ffffff',
                surfaceSecondary: '#f1f3f4',
                text: '#202124',
                textSecondary: '#5f6368',
                border: '#dadce0',
                borderMedium: '#bdc1c6',
                shadow: 'rgba(66, 133, 244, 0.15)'
            },
            icon: '✨'
        },
        zai: {
            name: 'Z.AI',
            domains: ['chat.z.ai'],
            storageKey: 'zai_saved_prompts',
            theme: {
                primary: '#10a37f',
                primaryDark: '#0e8c6a',
                secondary: '#f7f7f8',
                surface: '#ffffff',
                surfaceSecondary: '#f7f7f8',
                text: '#353740',
                textSecondary: '#8e8ea0',
                border: '#e5e5e5',
                borderMedium: '#d1d5db',
                shadow: 'rgba(0,0,0,0.1)'
            },
            darkTheme: {
                primary: '#10a37f',
                primaryDark: '#0e8c6a',
                secondary: '#202123',
                surface: '#343541',
                surfaceSecondary: '#40414f',
                text: '#ececf1',
                textSecondary: '#a3a3a3',
                border: '#4d4d4f',
                borderMedium: '#5e5e60',
                shadow: 'rgba(0,0,0,0.1)'
            },
            icon: '🤖'
        }
    };

    // Dynamically add platforms for any @match patterns not covered by known configurations
    const GMInfo = GM_info || GM.info;
    if (GMInfo) {
        const matches = GMInfo.script.matches || [];
        const knownDomains = new Set(Object.values(PLATFORM_CONFIG).flatMap(c => c.domains));
        const newDomains = new Set(matches.map(match => {
            let domain = match.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
            return domain;
        }).filter(domain => domain && !knownDomains.has(domain)));

        newDomains.forEach(domain => {
            const cleanDomain = domain.replace(/^www\./, '');
            const key = domain.replace(/\./g, '_');
            PLATFORM_CONFIG[key] = {
                name: cleanDomain.split('.')[0].charAt(0).toUpperCase() + cleanDomain.split('.')[0].slice(1),
                domains: [domain],
                storageKey: `${key}_saved_prompts`,
                theme: { ...PLATFORM_CONFIG.chatgpt.theme },
                darkTheme: { ...PLATFORM_CONFIG.chatgpt.darkTheme },
                icon: '🤖'
            };
        });
    }

    let currentPlatform = null;
    let activePlatformTab = null;
    let allPlatformPrompts = {};
    let isToolbarVisible = false;
    let isToolbarMinimized = false;
    let lastInsertedPrompt = '';
    let undoTimeout = null;
    let inputDetectionCache = null;
    let inputDetectionObserver = null;
    let visibilityCheckInterval = null;
    let uiChangeObserver = null;
    let isDarkMode = false;

    function detectPlatform() {
        const hostname = window.location.hostname;
        for (const [key, config] of Object.entries(PLATFORM_CONFIG)) {
            if (config.domains.some(domain => hostname.includes(domain))) {
                return key;
            }
        }
        let cleanHostname = hostname.replace(/^www\./, '');
        const fallbackKey = hostname.replace(/\./g, '_');
        if (!PLATFORM_CONFIG[fallbackKey]) {
            PLATFORM_CONFIG[fallbackKey] = {
                name: cleanHostname.split('.')[0].charAt(0).toUpperCase() + cleanHostname.split('.')[0].slice(1),
                domains: [hostname],
                storageKey: `${fallbackKey}_saved_prompts`,
                theme: { ...PLATFORM_CONFIG.chatgpt.theme },
                darkTheme: { ...PLATFORM_CONFIG.chatgpt.darkTheme },
                icon: '🤖'
            };
        }
        return fallbackKey;
    }

    function findChatGPTInput() {
        const selectors = [
            '[data-testid="composer-text-input"]',
            'textarea[placeholder*="Message"]',
            'textarea[placeholder*="Send a message"]',
            'div[contenteditable="true"][data-testid*="composer"]',
            'form textarea',
            '#prompt-textarea'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return element;
            }
        }

        const textareas = document.querySelectorAll('textarea');
        for (const textarea of textareas) {
            if (isElementVisible(textarea) && textarea.offsetHeight > 30) {
                return textarea;
            }
        }

        return null;
    }

    function findClaudeInput() {
        const selectors = [
            '[data-testid="chat-input"]',
            'div[contenteditable="true"][data-testid*="chat"]',
            '.ProseMirror[contenteditable="true"]',
            'div[role="textbox"]',
            'div[contenteditable="true"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return element;
            }
        }

        const editables = document.querySelectorAll('[contenteditable="true"]');
        for (const editable of editables) {
            if (isElementVisible(editable) && editable.offsetHeight > 30) {
                return editable;
            }
        }

        return null;
    }

    function findGrokInput() {
        const selectors = [
            'textarea[placeholder*="Ask Grok"]',
            'textarea[placeholder*="Message Grok"]',
            'div[contenteditable="true"][data-testid*="grok"]',
            'textarea[data-testid*="text-input"]',
            '.composer textarea',
            'div[role="textbox"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return element;
            }
        }

        const textareas = document.querySelectorAll('textarea');
        for (const textarea of textareas) {
            const placeholder = textarea.placeholder?.toLowerCase() || '';
            if (isElementVisible(textarea) && (
                placeholder.includes('ask') ||
                placeholder.includes('message') ||
                placeholder.includes('chat') ||
                textarea.offsetHeight > 40
            )) {
                return textarea;
            }
        }

        return null;
    }

    function findDeepSeekInput() {
        const selectors = [
            'textarea[placeholder*="Send a message"]',
            'div[contenteditable="true"]',
            '.chat-input textarea',
            'textarea.form-control',
            '[data-testid="chat-input"]',
            '.input-area textarea',
            '.message-input textarea'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return element;
            }
        }

        const textareas = document.querySelectorAll('textarea');
        for (const textarea of textareas) {
            if (isElementVisible(textarea) && textarea.offsetHeight > 30) {
                return textarea;
            }
        }

        const editables = document.querySelectorAll('[contenteditable="true"]');
        for (const editable of editables) {
            if (isElementVisible(editable) && editable.offsetHeight > 30) {
                return editable;
            }
        }

        return null;
    }

    function findQwenInput() {
        const selectors = [
            'textarea[placeholder*="请输入"]',
            'textarea[placeholder*="输入消息"]',
            'textarea[placeholder*="Send a message"]',
            'div[contenteditable="true"]',
            '.chat-input textarea',
            '[data-testid="input"]',
            '.input-wrapper textarea',
            '.message-input textarea'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return element;
            }
        }

        const textareas = document.querySelectorAll('textarea');
        for (const textarea of textareas) {
            if (isElementVisible(textarea) && textarea.offsetHeight > 30) {
                return textarea;
            }
        }

        const editables = document.querySelectorAll('[contenteditable="true"]');
        for (const editable of editables) {
            if (isElementVisible(editable) && editable.offsetHeight > 30) {
                return editable;
            }
        }

        return null;
    }

    function findGeminiInput() {
        const selectors = [
            'div[contenteditable="true"][data-testid*="input"]',
            'div[contenteditable="true"][role="textbox"]',
            'textarea[placeholder*="Enter a prompt"]',
            'textarea[placeholder*="Message Gemini"]',
            '.input-area div[contenteditable="true"]',
            'div[contenteditable="true"]',
            '.message-input-container textarea'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return element;
            }
        }

        const editables = document.querySelectorAll('[contenteditable="true"]');
        for (const editable of editables) {
            if (isElementVisible(editable) && editable.offsetHeight > 30) {
                const parent = editable.closest('[data-testid], .input, .message, .chat');
                if (parent || editable.offsetHeight > 50) {
                    return editable;
                }
            }
        }

        const textareas = document.querySelectorAll('textarea');
        for (const textarea of textareas) {
            if (isElementVisible(textarea) && textarea.offsetHeight > 30) {
                return textarea;
            }
        }

        return null;
    }

    function findZAIInput() {
        const selectors = [
            'textarea[placeholder*="Message"]',
            'div[contenteditable="true"]',
            '.chat-input textarea',
            '[role="textbox"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return element;
            }
        }

        const textareas = document.querySelectorAll('textarea');
        for (const textarea of textareas) {
            if (isElementVisible(textarea) && textarea.offsetHeight > 30) {
                return textarea;
            }
        }

        const editables = document.querySelectorAll('[contenteditable="true"]');
        for (const editable of editables) {
            if (isElementVisible(editable) && editable.offsetHeight > 30) {
                return editable;
            }
        }

        return null;
    }

    function isElementVisible(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0 &&
               rect.height > 0 &&
               style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0';
    }

    function findInputForCurrentPlatform() {
        if (inputDetectionCache && isElementVisible(inputDetectionCache)) {
            return inputDetectionCache;
        }

        let input = null;

        switch (currentPlatform) {
            case 'chatgpt':
                input = findChatGPTInput();
                break;
            case 'claude':
                input = findClaudeInput();
                break;
            case 'grok':
                input = findGrokInput();
                break;
            case 'deepseek':
                input = findDeepSeekInput();
                break;
            case 'qwen':
                input = findQwenInput();
                break;
            case 'gemini':
                input = findGeminiInput();
                break;
            case 'zai':
                input = findZAIInput();
                break;
            default:
                input = findChatGPTInput();
        }

        if (input) {
            inputDetectionCache = input;
        }

        return input;
    }

    function setupInputDetectionObserver() {
        if (inputDetectionObserver) {
            inputDetectionObserver.disconnect();
        }

        inputDetectionObserver = new MutationObserver(() => {
            inputDetectionCache = null;
        });

        inputDetectionObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    function setupUIChangeObserver() {
        if (uiChangeObserver) {
            uiChangeObserver.disconnect();
        }

        uiChangeObserver = new MutationObserver((mutations) => {
            let shouldCheckVisibility = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const computedStyle = window.getComputedStyle(node);
                            const zIndex = parseInt(computedStyle.zIndex) || 0;

                            if (zIndex > 5000 || node.classList.contains('modal') ||
                                node.classList.contains('overlay') || node.classList.contains('popup')) {
                                shouldCheckVisibility = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheckVisibility) {
                setTimeout(ensureToggleButtonVisibility, 100);
            }
        });

        uiChangeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'z-index']
        });
    }

    function ensureToggleButtonVisibility() {
        const toggleButton = document.getElementById('prompt-manager-toggle');
        if (!toggleButton) {
            createToggleButton();
            return;
        }

        const rect = toggleButton.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const computedStyle = window.getComputedStyle(toggleButton);

        if (!isVisible || computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
            toggleButton.remove();
            createToggleButton();
        } else {
            toggleButton.style.setProperty('z-index', '2147483647', 'important');
            toggleButton.style.setProperty('position', 'fixed', 'important');
            toggleButton.style.setProperty('display', 'flex', 'important');
            toggleButton.style.setProperty('visibility', 'visible', 'important');
            toggleButton.style.setProperty('opacity', '1', 'important');
        }
    }

    function startVisibilityCheck() {
        if (visibilityCheckInterval) {
            clearInterval(visibilityCheckInterval);
        }

        visibilityCheckInterval = setInterval(ensureToggleButtonVisibility, 3000);
    }

    function stopVisibilityCheck() {
        if (visibilityCheckInterval) {
            clearInterval(visibilityCheckInterval);
            visibilityCheckInterval = null;
        }
    }

    function insertPromptIntoInput(prompt, textInput) {
        lastInsertedPrompt = textInput.tagName === 'TEXTAREA' ? textInput.value : textInput.textContent;

        if (textInput.tagName === 'TEXTAREA') {
            const setValue = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
            setValue.call(textInput, prompt.content);
            const inputEvent = new Event('input', { bubbles: true });
            textInput.dispatchEvent(inputEvent);
            textInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (textInput.contentEditable === 'true') {
            textInput.textContent = prompt.content;
            const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: prompt.content });
            textInput.dispatchEvent(inputEvent);
            textInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        textInput.focus();
        setTimeout(() => textInput.focus(), 100);
    }

    function undoLastInsertion() {
        const textInput = findInputForCurrentPlatform();
        const undoBtn = document.getElementById('prompt-undo-btn');

        if (textInput && lastInsertedPrompt !== '') {
            if (textInput.tagName === 'TEXTAREA') {
                const setValue = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                setValue.call(textInput, lastInsertedPrompt);
                const inputEvent = new Event('input', { bubbles: true });
            textInput.dispatchEvent(inputEvent);
            textInput.dispatchEvent(new Event('change', { bubbles: true }));
            } else if (textInput.contentEditable === 'true') {
                textInput.textContent = lastInsertedPrompt;
                const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: lastInsertedPrompt });
                textInput.dispatchEvent(inputEvent);
                textInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            textInput.focus();
            if (undoBtn) undoBtn.classList.remove('visible');
            lastInsertedPrompt = '';
            showNotification('Insertion undone!');
        }
    }

    function loadAllPrompts() {
        allPlatformPrompts = {};
        Object.entries(PLATFORM_CONFIG).forEach(([platform, config]) => {
            const storageKey = config.storageKey;
            let storedData = GM_getValue(storageKey, null);

            if (storedData === null) {
                const localStorageData = localStorage.getItem(storageKey);
                if (localStorageData) {
                    storedData = localStorageData;
                    GM_setValue(storageKey, storedData);
                } else {
                    storedData = '[]';
                }
            }

            allPlatformPrompts[platform] = JSON.parse(storedData);
        });
    }

    function savePromptsForPlatform(platform, prompts) {
        const config = PLATFORM_CONFIG[platform];
        if (config) {
            GM_setValue(config.storageKey, JSON.stringify(prompts));
            allPlatformPrompts[platform] = prompts;
        }
    }

    function getCurrentPrompts() {
        const targetPlatform = activePlatformTab || currentPlatform;
        return allPlatformPrompts[targetPlatform] || [];
    }

    function setCurrentPrompts(prompts) {
        const targetPlatform = activePlatformTab || currentPlatform;
        savePromptsForPlatform(targetPlatform, prompts);
    }

    function generateStyles(platform) {
        const theme = isDarkMode && PLATFORM_CONFIG[platform].darkTheme ? PLATFORM_CONFIG[platform].darkTheme : PLATFORM_CONFIG[platform].theme;
        return `
            :root {
                --primary: ${theme.primary};
                --primary-dark: ${theme.primaryDark};
                --secondary: ${theme.secondary};
                --surface: ${theme.surface};
                --surfaceSecondary: ${theme.surfaceSecondary};
                --text: ${theme.text};
                --textSecondary: ${theme.textSecondary};
                --border: ${theme.border};
                --borderMedium: ${theme.borderMedium};
                --shadow: ${theme.shadow};
            }

            #prompt-manager-toggle {
                position: fixed !important;
                top: 50% !important;
                right: 10px !important;
                transform: translateY(-50%) !important;
                z-index: 2147483647 !important;
                background: var(--surface) !important;
                border: 1px solid var(--border) !important;
                border-radius: 8px !important;
                width: 40px !important;
                height: 40px !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 2px 8px var(--shadow) !important;
                transition: all 0.2s ease !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
            }

            #prompt-manager-toggle:hover {
                background: var(--surfaceSecondary) !important;
                box-shadow: 0 4px 12px var(--shadow) !important;
            }

            .hamburger {
                width: 18px !important;
                height: 12px !important;
                position: relative !important;
            }

            .hamburger span {
                display: block !important;
                position: absolute !important;
                height: 2px !important;
                width: 100% !important;
                background: var(--text) !important;
                border-radius: 1px !important;
                opacity: 1 !important;
                left: 0 !important;
                transform: rotate(0deg) !important;
                transition: 0.25s ease-in-out !important;
            }

            .hamburger span:nth-child(1) { top: 0px !important; }
            .hamburger span:nth-child(2) { top: 5px !important; }
            .hamburger span:nth-child(3) { top: 10px !important; }

            #prompt-manager-toolbar {
                position: fixed !important;
                top: 0 !important;
                right: -380px !important;
                width: 380px !important;
                height: 100vh !important;
                background: var(--surface) !important;
                border-left: 1px solid var(--border) !important;
                box-shadow: -2px 0 15px var(--shadow) !important;
                z-index: 2147483646 !important;
                transition: right 0.3s ease !important;
                display: flex !important;
                flex-direction: column !important;
            }

            #prompt-manager-toolbar.visible {
                right: 0 !important;
            }

            #prompt-manager-toolbar.minimized {
                width: 60px !important;
            }

            .toolbar-header {
                padding: 16px;
                border-bottom: 1px solid var(--border);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--surfaceSecondary);
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .toolbar-title {
                font-weight: 600;
                color: var(--text);
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .platform-indicator {
                font-size: 16px;
            }

            .toolbar-controls {
                display: flex;
                gap: 8px;
            }

            .toolbar-btn {
                background: transparent;
                border: 1px solid var(--border);
                border-radius: 6px;
                padding: 6px 8px;
                cursor: pointer;
                color: var(--text);
                font-size: 12px;
                transition: all 0.2s ease, transform 0.1s ease;
            }

            .toolbar-btn:hover {
                background: var(--surfaceSecondary);
                transform: scale(1.05);
            }

            .platform-tabs {
                display: flex;
                background: var(--surfaceSecondary);
                border-bottom: 1px solid var(--border);
                overflow-x: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--borderMedium) var(--surfaceSecondary);
                padding: 4px 0;
            }

            .platform-tabs::-webkit-scrollbar {
                height: 6px;
            }

            .platform-tabs::-webkit-scrollbar-track {
                background: var(--surfaceSecondary);
            }

            .platform-tabs::-webkit-scrollbar-thumb {
                background: var(--borderMedium);
                border-radius: 3px;
            }

            .platform-tabs::-webkit-scrollbar-thumb:hover {
                background: var(--textSecondary);
            }

            .platform-tab {
                flex: 0 0 auto;
                min-width: 50px;
                padding: 10px 6px;
                text-align: center;
                cursor: pointer;
                border: none;
                background: transparent;
                color: var(--textSecondary);
                font-size: 11px;
                transition: all 0.2s ease;
                white-space: nowrap;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                margin: 0 2px;
            }

            .platform-tab:hover {
                background: var(--surface);
                color: var(--text);
                box-shadow: 0 2px 4px var(--shadow);
            }

            .platform-tab.active {
                background: var(--primary);
                color: white;
            }

            .platform-tab:focus {
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }

            .platform-tab-icon {
                font-size: 14px;
            }

            .platform-tab-name {
                font-size: 9px;
                font-weight: 500;
            }

            .prompt-list {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                scroll-behavior: smooth;
            }

            .prompt-item {
                margin-bottom: 12px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--surface);
                transition: all 0.2s ease;
            }

            .prompt-item:hover {
                border-color: var(--borderMedium);
                box-shadow: 0 2px 4px var(--shadow);
            }

            .prompt-header {
                padding: 12px;
                border-bottom: 1px solid var(--border);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .prompt-name {
                font-weight: 500;
                color: var(--text);
                font-size: 13px;
                max-width: 180px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                position: relative;
            }

            .prompt-name:hover::after {
                content: attr(title);
                position: absolute;
                background: var(--surfaceSecondary);
                color: var(--text);
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid var(--border);
                z-index: 100;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                white-space: normal;
                max-width: 300px;
                font-size: 12px;
            }

            .prompt-actions {
                display: flex;
                gap: 4px;
            }

            .action-btn {
                background: transparent;
                border: none;
                padding: 4px 6px;
                border-radius: 4px;
                cursor: pointer;
                color: var(--textSecondary);
                font-size: 11px;
                transition: all 0.2s ease, transform 0.1s ease;
            }

            .action-btn:hover {
                background: var(--surfaceSecondary);
                color: var(--text);
                transform: scale(1.05);
            }

            .action-btn.danger:hover {
                background: #fee;
                color: #d32f2f;
            }

            .action-btn.clone:hover {
                background: var(--primary);
                color: white;
            }

            .prompt-preview {
                padding: 12px;
                color: var(--textSecondary);
                font-size: 12px;
                line-height: 1.4;
                max-height: 60px;
                overflow: hidden;
                cursor: pointer;
            }

            .prompt-preview:hover {
                color: var(--text);
            }

            .add-prompt-form {
                padding: 16px;
                border-top: 1px solid var(--border);
                background: var(--surfaceSecondary);
            }

            .form-group {
                margin-bottom: 12px;
            }

            .form-label {
                display: block;
                margin-bottom: 4px;
                color: var(--text);
                font-size: 12px;
                font-weight: 500;
            }

            .form-input, .form-textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border);
                border-radius: 6px;
                background: var(--surface);
                color: var(--text);
                font-size: 13px;
                resize: vertical;
                box-sizing: border-box;
            }

            .form-textarea {
                min-height: 80px;
                font-family: inherit;
            }

            .form-input:focus, .form-textarea:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 2px rgba(var(--primary), 0.2);
            }

            .form-actions {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
            }

            .btn-primary {
                background: var(--primary);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 500;
                transition: all 0.2s ease, transform 0.1s ease;
            }

            .btn-primary:hover {
                background: var(--primary-dark);
                transform: scale(1.05);
            }

            .btn-secondary {
                background: transparent;
                color: var(--text);
                border: 1px solid var(--border);
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s ease, transform 0.1s ease;
            }

            .btn-secondary:hover {
                background: var(--surface);
                transform: scale(1.05);
            }

            .clone-modal {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0,0,0,0.5) !important;
                z-index: 2147483647 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .clone-modal-content {
                background: var(--surface);
                border-radius: 8px;
                padding: 20px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }

            .clone-modal h3 {
                margin: 0 0 16px 0;
                color: var(--text);
                font-size: 16px;
            }

            .platform-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 16px;
            }

            .platform-option {
                padding: 12px;
                border: 1px solid var(--border);
                border-radius: 6px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s ease, transform 0.1s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }

            .platform-option:hover {
                border-color: var(--primary);
                background: var(--surfaceSecondary);
                transform: scale(1.05);
            }

            .platform-option.selected {
                border-color: var(--primary);
                background: var(--primary);
                color: white;
            }

            .clone-actions {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }

            #prompt-undo-btn {
                position: fixed !important;
                right: 20px !important;
                bottom: 20px !important;
                background: #f59e0b !important;
                color: white !important;
                border: none !important;
                border-radius: 20px !important;
                padding: 8px 16px !important;
                cursor: pointer !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3) !important;
                opacity: 0 !important;
                transform: translateY(20px) !important;
                transition: all 0.3s ease, transform 0.1s ease !important;
                z-index: 2147483645 !important;
            }

            #prompt-undo-btn.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }

            #prompt-undo-btn:hover {
                background: #d97706 !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4) !important;
            }

            .minimized .toolbar-header,
            .minimized .platform-tabs,
            .minimized .prompt-list,
            .minimized .add-prompt-form {
                display: none;
            }

            .minimized-controls {
                display: none;
                padding: 16px 8px;
                flex-direction: column;
                gap: 8px;
                align-items: center;
            }

            .minimized .minimized-controls {
                display: flex;
            }

            .minimized-btn {
                width: 40px;
                height: 40px;
                border: 1px solid var(--border);
                border-radius: 6px;
                background: var(--surface);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease, transform 0.1s ease;
            }

            .minimized-btn:hover {
                background: var(--surfaceSecondary);
                transform: scale(1.05);
            }

            .prompt-list::-webkit-scrollbar {
                width: 6px;
            }

            .prompt-list::-webkit-scrollbar-track {
                background: var(--surfaceSecondary);
            }

            .prompt-list::-webkit-scrollbar-thumb {
                background: var(--borderMedium);
                border-radius: 3px;
            }

            .prompt-list::-webkit-scrollbar-thumb:hover {
                background: var(--textSecondary);
            }

            .sync-status {
                position: absolute;
                top: 4px;
                right: 4px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #10b981;
            }

            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 32px 12px 16px;
                border-radius: 6px;
                font-size: 13px;
                z-index: 2147483647;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .notification.error {
                background: #ef4444;
            }

            .notification.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 12px;
                cursor: pointer;
                padding: 4px;
                line-height: 1;
                transition: all 0.2s ease;
            }

            .notification-close:hover {
                transform: scale(1.1);
            }

            .empty-state-btn {
                margin-top: 12px;
                background: var(--primary);
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s ease, transform 0.1s ease;
            }

            .empty-state-btn:hover {
                background: var(--primary-dark);
                transform: scale(1.05);
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .fade-in-up {
                animation: fadeInUp 0.3s ease;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .syncing {
                animation: pulse 1s infinite;
            }
        `;
    }

    function injectStyles() {
        const existingStyle = document.getElementById('prompt-manager-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        const styleSheet = document.createElement('style');
        styleSheet.id = 'prompt-manager-styles';
        styleSheet.textContent = generateStyles(currentPlatform);
        document.head.appendChild(styleSheet);
    }

    function createToggleButton() {
        const existingButton = document.getElementById('prompt-manager-toggle');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('div');
        button.id = 'prompt-manager-toggle';
        button.innerHTML = `
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        button.addEventListener('click', toggleToolbar);

        button.style.setProperty('z-index', '2147483647', 'important');
        button.style.setProperty('position', 'fixed', 'important');
        button.style.setProperty('display', 'flex', 'important');
        button.style.setProperty('visibility', 'visible', 'important');
        button.style.setProperty('opacity', '1', 'important');
        button.style.setProperty('pointer-events', 'auto', 'important');

        document.body.appendChild(button);
        return button;
    }

    function createPlatformTabs() {
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'platform-tabs';

        let entries = Object.entries(PLATFORM_CONFIG);
        const currentKey = currentPlatform;
        const currentEntry = entries.find(([k]) => k === currentKey);
        const otherEntries = entries.filter(([k]) => k !== currentKey);
        const sortedEntries = currentEntry ? [currentEntry, ...otherEntries] : entries;

        sortedEntries.forEach(([key, config]) => {
            const tab = document.createElement('button');
            tab.className = 'platform-tab';
            tab.dataset.platform = key;
            tab.tabIndex = 0;

            if (key === (activePlatformTab || currentPlatform)) {
                tab.classList.add('active');
            }

            tab.innerHTML = `
                <div class="platform-tab-icon">${config.icon}</div>
                <div class="platform-tab-name">${config.name}</div>
            `;

            tab.addEventListener('click', () => switchPlatformTab(key));
            tab.addEventListener('keydown', (e) => handleTabKeyNavigation(e, key));

            tabsContainer.appendChild(tab);
        });

        return tabsContainer;
    }

    function handleTabKeyNavigation(event, platformKey) {
        const tabs = Array.from(document.querySelectorAll('.platform-tab'));
        const currentIndex = tabs.findIndex(tab => tab.dataset.platform === platformKey);

        if (event.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % tabs.length;
            tabs[nextIndex].focus();
            switchPlatformTab(tabs[nextIndex].dataset.platform);
        } else if (event.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            tabs[prevIndex].focus();
            switchPlatformTab(tabs[prevIndex].dataset.platform);
        } else if (event.key === 'Enter') {
            switchPlatformTab(platformKey);
        }
    }

    function switchPlatformTab(platform) {
        activePlatformTab = platform;

        document.querySelectorAll('.platform-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.platform === platform) {
                tab.classList.add('active');
            }
        });

        clearForm();
        renderPromptList();
    }

    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'prompt-manager-toolbar';

        const currentConfig = PLATFORM_CONFIG[currentPlatform];

        toolbar.innerHTML = `
            <div class="toolbar-header">
                <div class="toolbar-title">
                    <span class="platform-indicator">${currentConfig.icon}</span>
                    Multi-Platform Prompt Manager
                    <div class="sync-status" title="Synced"></div>
                </div>
                <div class="toolbar-controls">
                    <button class="toolbar-btn" id="minimize-btn">−</button>
                    <button class="toolbar-btn" id="close-btn">×</button>
                </div>
            </div>
            <div class="platform-tabs-container"></div>
            <div class="prompt-list" id="prompt-list"></div>
            <div class="add-prompt-form">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-input" id="prompt-name-input" placeholder="Enter prompt name...">
                </div>
                <div class="form-group">
                    <label class="form-label">Content</label>
                    <textarea class="form-textarea" id="prompt-content-input" placeholder="Enter your prompt..."></textarea>
                </div>
                <div class="form-actions">
                    <button class="btn-primary" id="save-btn">Save</button>
                    <button class="btn-secondary" id="clear-btn">Clear</button>
                    <button class="btn-secondary" id="sync-btn">Sync All</button>
                    <button class="btn-secondary" id="import-btn">Import</button>
                    <button class="btn-secondary" id="export-btn">Export</button>
                </div>
            </div>
            <div class="minimized-controls">
                <div class="minimized-btn" id="expand-btn" title="Expand">${currentConfig.icon}</div>
                <div class="minimized-btn" id="add-btn" title="Add Prompt">+</div>
            </div>
        `;

        document.body.appendChild(toolbar);

        const tabsContainer = toolbar.querySelector('.platform-tabs-container');
        tabsContainer.appendChild(createPlatformTabs());

        document.getElementById('minimize-btn').addEventListener('click', minimizeToolbar);
        document.getElementById('close-btn').addEventListener('click', toggleToolbar);
        document.getElementById('save-btn').addEventListener('click', savePrompt);
        document.getElementById('clear-btn').addEventListener('click', clearForm);
        document.getElementById('sync-btn').addEventListener('click', syncAllPlatforms);
        document.getElementById('import-btn').addEventListener('click', importPrompts);
        document.getElementById('export-btn').addEventListener('click', exportPrompts);
        document.getElementById('expand-btn').addEventListener('click', toggleToolbar);
        document.getElementById('add-btn').addEventListener('click', showAddForm);

        return toolbar;
    }

    function createUndoButton() {
        const existingBtn = document.getElementById('prompt-undo-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const button = document.createElement('button');
        button.id = 'prompt-undo-btn';
        button.textContent = '↶ Undo';
        button.addEventListener('click', undoLastInsertion);

        document.body.appendChild(button);
        return button;
    }

    function createCloneModal(promptIndex) {
        const prompt = getCurrentPrompts()[promptIndex];
        const modal = document.createElement('div');
        modal.className = 'clone-modal';

        const platformOptions = Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
            const currentPlatformKey = activePlatformTab || currentPlatform;
            const isDisabled = key === currentPlatformKey;

            return `
                <div class="platform-option ${isDisabled ? 'disabled' : ''}"
                     data-platform="${key}"
                     ${isDisabled ? 'style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <div style="font-size: 20px;">${config.icon}</div>
                    <div style="font-size: 12px;">${config.name}</div>
                    ${isDisabled ? '<div style="font-size: 10px; color: var(--text-secondary);">(Current)</div>' : ''}
                </div>
            `;
        }).join('');

        modal.innerHTML = `
            <div class="clone-modal-content">
                <h3>Clone "${prompt.name}" to:</h3>
                <div class="platform-grid">
                    ${platformOptions}
                </div>
                <div class="clone-actions">
                    <button class="btn-secondary" id="clone-cancel">Cancel</button>
                    <button class="btn-primary" id="clone-confirm" disabled>Clone</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        let selectedPlatforms = [];

        modal.querySelectorAll('.platform-option:not(.disabled)').forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.dataset.platform;

                if (selectedPlatforms.includes(platform)) {
                    selectedPlatforms = selectedPlatforms.filter(p => p !== platform);
                    option.classList.remove('selected');
                } else {
                    selectedPlatforms.push(platform);
                    option.classList.add('selected');
                }

                document.getElementById('clone-confirm').disabled = selectedPlatforms.length === 0;
            });
        });

        document.getElementById('clone-confirm').addEventListener('click', () => {
            selectedPlatforms.forEach(platform => {
                const targetPrompts = allPlatformPrompts[platform] || [];
                const clonedPrompt = {
                    ...prompt,
                    name: `${prompt.name} (from ${PLATFORM_CONFIG[activePlatformTab || currentPlatform].name})`
                };

                const existingIndex = targetPrompts.findIndex(p => p.name === clonedPrompt.name);
                if (existingIndex >= 0) {
                    if (confirm(`A prompt named "${clonedPrompt.name}" already exists in ${PLATFORM_CONFIG[platform].name}. Replace it?`)) {
                        targetPrompts[existingIndex] = clonedPrompt;
                    }
                } else {
                    targetPrompts.push(clonedPrompt);
                }

                savePromptsForPlatform(platform, targetPrompts);
            });

            document.body.removeChild(modal);
            showNotification(`Prompt cloned to ${selectedPlatforms.length} platform(s)!`);
        });

        document.getElementById('clone-cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">×</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('visible');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });

        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    function toggleToolbar() {
        const toolbar = document.getElementById('prompt-manager-toolbar');
        isToolbarVisible = !isToolbarVisible;

        if (isToolbarVisible) {
            toolbar.classList.add('visible');
            toolbar.classList.remove('minimized');
            isToolbarMinimized = false;
            renderPromptList();
        } else {
            toolbar.classList.remove('visible');
        }
    }

    function minimizeToolbar() {
        const toolbar = document.getElementById('prompt-manager-toolbar');
        isToolbarMinimized = !isToolbarMinimized;

        if (isToolbarMinimized) {
            toolbar.classList.add('minimized');
        } else {
            toolbar.classList.remove('minimized');
        }
    }

    function renderPromptList() {
        const list = document.getElementById('prompt-list');
        if (!list) return;

        const prompts = getCurrentPrompts();
        list.innerHTML = '';

        if (prompts.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.style.cssText = `
                text-align: center;
                padding: 40px 20px;
                color: var(--textSecondary);
                font-size: 13px;
            `;

            const activePlatformName = PLATFORM_CONFIG[activePlatformTab || currentPlatform].name;
            const isCurrentPlatform = (activePlatformTab || currentPlatform) === currentPlatform;

            emptyState.innerHTML = `
                <div style="font-size: 32px; margin-bottom: 12px;">${PLATFORM_CONFIG[activePlatformTab || currentPlatform].icon}</div>
                <div>No prompts saved for ${activePlatformName}</div>
                <div style="margin-top: 8px; font-size: 11px;">
                    ${isCurrentPlatform ?
                        'Create your first prompt below!' :
                        `Switch to other platform tabs to view their prompts!<br/>You can use prompts from any platform on ${PLATFORM_CONFIG[currentPlatform].name}.`
                    }
                </div>
                ${isCurrentPlatform ? '<button class="empty-state-btn" id="empty-state-add">Add Prompt</button>' : ''}
            `;
            list.appendChild(emptyState);

            const addBtn = emptyState.querySelector('#empty-state-add');
            if (addBtn) {
                addBtn.addEventListener('click', showAddForm);
            }
            return;
        }

        prompts.forEach((prompt, index) => {
            const item = document.createElement('div');
            item.className = 'prompt-item fade-in-up';

            const itemHeader = document.createElement('div');
            itemHeader.className = 'prompt-header';

            const promptName = document.createElement('div');
            promptName.className = 'prompt-name';
            promptName.textContent = prompt.name;
            promptName.title = prompt.name;

            const promptActions = document.createElement('div');
            promptActions.className = 'prompt-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editPrompt(index));

            const cloneBtn = document.createElement('button');
            cloneBtn.className = 'action-btn clone';
            cloneBtn.textContent = 'Clone';
            cloneBtn.addEventListener('click', () => createCloneModal(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deletePrompt(index));

            promptActions.appendChild(editBtn);
            promptActions.appendChild(cloneBtn);
            promptActions.appendChild(deleteBtn);

            itemHeader.appendChild(promptName);
            itemHeader.appendChild(promptActions);

            const promptPreview = document.createElement('div');
            promptPreview.className = 'prompt-preview';
            promptPreview.textContent = prompt.content.substring(0, 120) + (prompt.content.length > 120 ? '...' : '');
            promptPreview.addEventListener('click', () => insertPrompt(index));

            item.appendChild(itemHeader);
            item.appendChild(promptPreview);
            list.appendChild(item);
        });
    }

    function savePrompt() {
        const nameInput = document.getElementById('prompt-name-input');
        const contentInput = document.getElementById('prompt-content-input');

        const name = nameInput.value.trim();
        const content = contentInput.value.trim();

        if (!name || !content) {
            showNotification('Please enter both name and content for the prompt.', 'error');
            return;
        }

        const prompts = getCurrentPrompts();
        const editIndex = nameInput.dataset.editIndex;

        if (editIndex !== undefined) {
            prompts[parseInt(editIndex)] = { name, content };
            delete nameInput.dataset.editIndex;
            showNotification('Prompt updated successfully!');
        } else {
            if (prompts.some(p => p.name === name)) {
                if (!confirm(`A prompt named "${name}" already exists. Replace it?`)) {
                    return;
                }
                const existingIndex = prompts.findIndex(p => p.name === name);
                prompts[existingIndex] = { name, content };
            } else {
                prompts.push({ name, content });
            }
            showNotification('Prompt saved successfully!');
        }

        setCurrentPrompts(prompts);
        clearForm();
        renderPromptList();
    }

    function editPrompt(index) {
        const prompts = getCurrentPrompts();
        const prompt = prompts[index];
        const nameInput = document.getElementById('prompt-name-input');
        const contentInput = document.getElementById('prompt-content-input');

        nameInput.value = prompt.name;
        contentInput.value = prompt.content;
        nameInput.dataset.editIndex = index;

        nameInput.focus();
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function deletePrompt(index) {
        const prompts = getCurrentPrompts();
        const prompt = prompts[index];

        if (confirm(`Are you sure you want to delete the prompt "${prompt.name}"?`)) {
            prompts.splice(index, 1);
            setCurrentPrompts(prompts);
            renderPromptList();
            showNotification('Prompt deleted successfully!');
        }
    }

    function insertPrompt(index) {
        const prompts = getCurrentPrompts();
        const prompt = prompts[index];
        const textInput = findInputForCurrentPlatform();

        if (textInput) {
            insertPromptIntoInput(prompt, textInput);
            showUndoButton();

            const sourcePlatform = activePlatformTab || currentPlatform;
            const sourceConfig = PLATFORM_CONFIG[sourcePlatform];
            const currentConfig = PLATFORM_CONFIG[currentPlatform];

            if (sourcePlatform !== currentPlatform) {
                showNotification(`Prompt "${prompt.name}" from ${sourceConfig.name} inserted into ${currentConfig.name}!`);
            } else {
                showNotification(`Prompt "${prompt.name}" inserted!`);
            }
        } else {
            showNotification(`Could not find input field. Please try refreshing the page.`, 'error');
        }
    }

    function showUndoButton() {
        const undoBtn = document.getElementById('prompt-undo-btn');
        if (undoBtn) {
            undoBtn.classList.add('visible');

            if (undoTimeout) {
                clearTimeout(undoTimeout);
            }

            undoTimeout = setTimeout(() => {
                undoBtn.classList.remove('visible');
            }, 8000);
        }
    }

    function clearForm() {
        const nameInput = document.getElementById('prompt-name-input');
        const contentInput = document.getElementById('prompt-content-input');

        nameInput.value = '';
        contentInput.value = '';
        delete nameInput.dataset.editIndex;
    }

    function syncAllPlatforms() {
        const syncBtn = document.getElementById('sync-btn');
        const originalText = syncBtn.textContent;

        syncBtn.textContent = 'Syncing...';
        syncBtn.disabled = true;
        syncBtn.classList.add('syncing');

        setTimeout(() => {
            const syncData = {
                version: '2.5',
                timestamp: new Date().toISOString(),
                platforms: allPlatformPrompts,
                metadata: {
                    totalPrompts: Object.values(allPlatformPrompts).reduce((sum, prompts) => sum + prompts.length, 0),
                    platformsWithData: Object.entries(allPlatformPrompts).filter(([_, prompts]) => prompts.length > 0).map(([platform, _]) => platform)
                }
            };

            GM_setValue('prompt_manager_sync_backup', JSON.stringify(syncData));

            Object.entries(allPlatformPrompts).forEach(([platform, prompts]) => {
                savePromptsForPlatform(platform, prompts);
            });

            syncBtn.textContent = originalText;
            syncBtn.disabled = false;
            syncBtn.classList.remove('syncing');

            showNotification('All platforms synced successfully!');
        }, 1500);
    }

    function importPrompts() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedData = JSON.parse(e.target.result);

                        if (Array.isArray(importedData)) {
                            const currentPrompts = getCurrentPrompts();
                            const mergedPrompts = [...currentPrompts, ...importedData];
                            setCurrentPrompts(mergedPrompts);
                            showNotification(`Successfully imported ${importedData.length} prompts!`);
                        } else if (importedData.platforms) {
                            let totalImported = 0;
                            Object.entries(importedData.platforms).forEach(([platform, prompts]) => {
                                if (PLATFORM_CONFIG[platform] && Array.isArray(prompts)) {
                                    const existingPrompts = allPlatformPrompts[platform] || [];
                                    const mergedPrompts = [...existingPrompts, ...prompts];
                                    savePromptsForPlatform(platform, mergedPrompts);
                                    totalImported += prompts.length;
                                }
                            });
                            showNotification(`Successfully imported ${totalImported} prompts across platforms!`);
                        } else {
                            showNotification('Invalid file format. Please select a valid JSON file.', 'error');
                        }

                        renderPromptList();
                    } catch (error) {
                        showNotification('Error reading file. Please make sure it\'s a valid JSON file.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    function exportPrompts() {
        if (Object.values(allPlatformPrompts).every(prompts => prompts.length === 0)) {
            showNotification('No prompts to export!', 'error');
            return;
        }

        const exportData = {
            version: '2.5',
            timestamp: new Date().toISOString(),
            currentPlatform: currentPlatform,
            activePlatformTab: activePlatformTab,
            platforms: allPlatformPrompts,
            metadata: {
                totalPrompts: Object.values(allPlatformPrompts).reduce((sum, prompts) => sum + prompts.length, 0),
                platformsWithData: Object.entries(allPlatformPrompts).filter(([_, prompts]) => prompts.length > 0).map(([platform, _]) => platform),
                exportedFrom: 'GM_Storage'
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `multi-platform-prompts-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
        showNotification('Prompts exported successfully!');
    }

    function showAddForm() {
        if (isToolbarMinimized) {
            minimizeToolbar();
        }
        const nameInput = document.getElementById('prompt-name-input');
        if (nameInput) {
            nameInput.focus();
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function handlePageChange() {
        inputDetectionCache = null;
        setTimeout(() => {
            ensureToggleButtonVisibility();
            if (!document.getElementById('prompt-undo-btn')) {
                createUndoButton();
            }
        }, 2000);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        currentPlatform = detectPlatform();
        activePlatformTab = currentPlatform;

        isDarkMode = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');

        loadAllPrompts();
        injectStyles();
        createToggleButton();
        createToolbar();
        setupInputDetectionObserver();
        setupUIChangeObserver();
        startVisibilityCheck();

        setTimeout(() => {
            createUndoButton();
            renderPromptList();
            ensureToggleButtonVisibility();
        }, 2000);

        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                handlePageChange();
            }
        }).observe(document, { subtree: true, childList: true });

        if (currentPlatform === 'chatgpt') {
            setTimeout(() => {
                ensureToggleButtonVisibility();
                if (!document.getElementById('prompt-undo-btn')) {
                    createUndoButton();
                }
            }, 5000);

            setTimeout(() => {
                ensureToggleButtonVisibility();
            }, 10000);
        }

        window.addEventListener('beforeunload', () => {
            stopVisibilityCheck();
            if (inputDetectionObserver) {
                inputDetectionObserver.disconnect();
            }
            if (uiChangeObserver) {
                uiChangeObserver.disconnect();
            }
        });
    }

    init();
})();