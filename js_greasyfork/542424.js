// ==UserScript==
// @name         DeepSeek System Prompt Injector
// @name:zh-CN   深度搜索系统提示词
// @namespace    https://github.com/NoahTheGinger/
// @version      2.0.1
// @description  Robust system prompt injection for DeepSeek AI chat ("chat.deepseek.com")
// @description:zh-CN 为DeepSeek AI设置自定义系统提示词（增强版）
// @author       NoahTheGinger
// @match        https://chat.deepseek.com
// @match        https://chat.deepseek.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542424/DeepSeek%20System%20Prompt%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/542424/DeepSeek%20System%20Prompt%20Injector.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Configuration
    const DEBUG = true; // Set to true to enable console logging
    const STORAGE_KEY = "deepseek_system_prompt";
    const ENABLED_KEY = "deepseek_system_prompt_enabled";
    const API_PATTERNS = [
        '/api/v0/chat/completion',
        '/chat/completions',
        '/v1/chat/completions'
    ];

    // Localization
    const locale = {
        en: {
            set: "⚙️ Set System Prompt",
            clear: "🗑️ Clear System Prompt",
            toggle: "🔄 Toggle System Prompt",
            view: "👁️ View Current System Prompt",
            prompt: "Enter system prompt for DeepSeek:\n\nThis will be sent as a system-level instruction before every message.",
            updated: "✅ System Prompt Updated!",
            confirm: "Are you sure you want to clear the system prompt?",
            cleared: "System prompt cleared!",
            enabled: "✅ System Prompt Enabled",
            disabled: "❌ System Prompt Disabled",
            current: "Current System Prompt:",
            none: "No system prompt set.",
            systemPrefix: "SYSTEM INSTRUCTION",
            separator: "─".repeat(50)
        },
        zh: {
            set: "⚙️ 设置系统提示词",
            clear: "🗑️ 清除系统提示词",
            toggle: "🔄 切换系统提示词",
            view: "👁️ 查看当前系统提示词",
            prompt: "输入DeepSeek的系统提示词：\n\n这将作为系统级指令在每条消息前发送。",
            updated: "✅ 系统提示词已更新！",
            confirm: "确定要清除系统提示词吗？",
            cleared: "系统提示词已清除！",
            enabled: "✅ 系统提示词已启用",
            disabled: "❌ 系统提示词已禁用",
            current: "当前系统提示词：",
            none: "未设置系统提示词。",
            systemPrefix: "系统指令",
            separator: "─".repeat(50)
        }
    };

    const t = locale[navigator.language.startsWith('zh') ? 'zh' : 'en'];

    // Load saved values
    let systemPrompt = GM_getValue(STORAGE_KEY, "");
    let isEnabled = GM_getValue(ENABLED_KEY, true);

    // Track intercepted instances to avoid duplicate interception
    const interceptedInstances = new WeakSet();

    // Log function
    function log(...args) {
        if (DEBUG) console.log("[DeepSeek System Prompt v2]", ...args);
    }

    // Add visual indicator style
    GM_addStyle(`
        .deepseek-system-prompt-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${isEnabled && systemPrompt ? '#4CAF50' : '#9E9E9E'};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 10000;
            opacity: 0.8;
            transition: all 0.3s;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .deepseek-system-prompt-indicator:hover {
            opacity: 1;
        }
        .deepseek-system-prompt-indicator.active {
            background: #4CAF50;
        }
        .deepseek-system-prompt-indicator.inactive {
            background: #FF9800;
        }
        .deepseek-system-prompt-indicator.none {
            background: #9E9E9E;
        }
        .deepseek-system-prompt-indicator .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: currentColor;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `);

    // Create and update indicator
    function updateIndicator() {
        let indicator = document.querySelector('.deepseek-system-prompt-indicator');
        if (!indicator && document.body) {
            indicator = document.createElement('div');
            indicator.className = 'deepseek-system-prompt-indicator';
            indicator.innerHTML = '<span class="status-dot"></span><span class="status-text"></span>';
            document.body.appendChild(indicator);
        }

        if (indicator) {
            const statusText = indicator.querySelector('.status-text');

            if (isEnabled && systemPrompt) {
                statusText.textContent = '🤖 System Prompt Active';
                indicator.className = 'deepseek-system-prompt-indicator active';
            } else if (systemPrompt) {
                statusText.textContent = '🤖 System Prompt Disabled';
                indicator.className = 'deepseek-system-prompt-indicator inactive';
            } else {
                statusText.textContent = '🤖 No System Prompt';
                indicator.className = 'deepseek-system-prompt-indicator none';
            }
        }
    }

    // Menu Commands
    GM_registerMenuCommand(t.set, function () {
        const currentPrompt = GM_getValue(STORAGE_KEY, "");
        const newPrompt = prompt(t.prompt, currentPrompt);

        if (newPrompt !== null && newPrompt.trim().length > 0) {
            GM_setValue(STORAGE_KEY, newPrompt.trim());
            systemPrompt = newPrompt.trim();
            alert(t.updated);
            updateIndicator();
            log("Updated system prompt:", systemPrompt);
        }
    });

    GM_registerMenuCommand(t.clear, function () {
        if (confirm(t.confirm)) {
            GM_setValue(STORAGE_KEY, "");
            systemPrompt = "";
            alert(t.cleared);
            updateIndicator();
            log("Cleared system prompt");
        }
    });

    GM_registerMenuCommand(t.toggle, function () {
        isEnabled = !isEnabled;
        GM_setValue(ENABLED_KEY, isEnabled);
        alert(isEnabled ? t.enabled : t.disabled);
        updateIndicator();
        log("Toggled:", isEnabled);
    });

    GM_registerMenuCommand(t.view, function () {
        if (systemPrompt) {
            alert(`${t.current}\n\n${systemPrompt}\n\n${isEnabled ? t.enabled : t.disabled}`);
        } else {
            alert(t.none);
        }
    });

    // Format system prompt with clear separation
    function formatSystemPrompt(userMessage) {
        if (!systemPrompt || !isEnabled) return userMessage;

        return `[${t.systemPrefix}]
${t.separator}
${systemPrompt}
${t.separator}

[USER MESSAGE]
${userMessage}`;
    }

    // Enhanced request modification function
    function modifyRequestBody(body, url = '') {
        if (!body || !systemPrompt || !isEnabled) return body;

        try {
            let data;

            // Handle different body types
            if (typeof body === 'string') {
                data = JSON.parse(body);
            } else if (body instanceof Blob) {
                // Handle Blob (async operation needed)
                return new Blob([body], { type: body.type });
            } else if (body instanceof FormData) {
                // FormData might contain JSON in a field
                return body;
            } else {
                data = body;
            }

            // Check for prompt field
            if (data && data.hasOwnProperty("prompt") && typeof data.prompt === 'string') {
                const originalPrompt = data.prompt;
                data.prompt = formatSystemPrompt(data.prompt);

                log("Modified request for:", url);
                log("Original:", originalPrompt);
                log("Modified:", data.prompt);

                return typeof body === 'string' ? JSON.stringify(data) : data;
            }

            // Check for messages array (OpenAI format)
            if (data && Array.isArray(data.messages)) {
                // Check if system message already exists
                const hasSystemMessage = data.messages.some(msg => msg.role === 'system');

                if (!hasSystemMessage && systemPrompt) {
                    // Add system message at the beginning
                    data.messages.unshift({
                        role: 'system',
                        content: systemPrompt
                    });

                    log("Added system message to messages array");
                    return typeof body === 'string' ? JSON.stringify(data) : data;
                }
            }
        } catch (e) {
            log("Error modifying request:", e);
        }

        return body;
    }

    // Intercept XMLHttpRequest with enhanced protection
    function interceptXHR() {
        const OriginalXHR = unsafeWindow.XMLHttpRequest;

        // Check if already intercepted
        if (interceptedInstances.has(OriginalXHR.prototype)) {
            return;
        }

        const originalOpen = OriginalXHR.prototype.open;
        const originalSend = OriginalXHR.prototype.send;

        OriginalXHR.prototype.open = function(method, url, ...args) {
            this._url = url;
            this._method = method;
            return originalOpen.call(this, method, url, ...args);
        };

        OriginalXHR.prototype.send = function(body) {
            if (this._url && API_PATTERNS.some(pattern => this._url.includes(pattern))) {
                log("Intercepting XMLHttpRequest to:", this._url);
                arguments[0] = modifyRequestBody(body, this._url);
            }
            return originalSend.apply(this, arguments);
        };

        interceptedInstances.add(OriginalXHR.prototype);
        log("XMLHttpRequest intercepted");
    }

    // Intercept Fetch API with enhanced protection
    function interceptFetch() {
        const targetWindow = unsafeWindow;
        const originalFetch = targetWindow.fetch;

        // Check if already intercepted
        if (interceptedInstances.has(originalFetch)) {
            return;
        }

        targetWindow.fetch = async function(url, options = {}) {
            const urlString = url.toString();

            if (API_PATTERNS.some(pattern => urlString.includes(pattern))) {
                log("Intercepting fetch to:", urlString);

                // Clone options to avoid modifying the original
                const modifiedOptions = { ...options };

                if (modifiedOptions.body) {
                    // Handle async body modification for Blob
                    if (modifiedOptions.body instanceof Blob) {
                        try {
                            const text = await modifiedOptions.body.text();
                            const modifiedText = modifyRequestBody(text, urlString);
                            if (modifiedText !== text) {
                                modifiedOptions.body = new Blob([modifiedText], {
                                    type: modifiedOptions.body.type
                                });
                            }
                        } catch (e) {
                            log("Error handling Blob body:", e);
                        }
                    } else {
                        modifiedOptions.body = modifyRequestBody(modifiedOptions.body, urlString);
                    }
                }

                return originalFetch.call(this, url, modifiedOptions);
            }

            return originalFetch.call(this, url, options);
        };

        // Copy properties from original fetch
        for (const prop in originalFetch) {
            if (originalFetch.hasOwnProperty(prop)) {
                targetWindow.fetch[prop] = originalFetch[prop];
            }
        }

        interceptedInstances.add(originalFetch);
        log("Fetch API intercepted");
    }

    // WebSocket interception for real-time communication
    function interceptWebSocket() {
        const OriginalWebSocket = unsafeWindow.WebSocket;

        if (interceptedInstances.has(OriginalWebSocket)) {
            return;
        }

        unsafeWindow.WebSocket = function(url, protocols) {
            log("WebSocket connection to:", url);

            const ws = new OriginalWebSocket(url, protocols);
            const originalSend = ws.send;

            ws.send = function(data) {
                if (systemPrompt && isEnabled) {
                    try {
                        let parsedData = typeof data === 'string' ? JSON.parse(data) : data;

                        if (parsedData && parsedData.hasOwnProperty("prompt")) {
                            parsedData.prompt = formatSystemPrompt(parsedData.prompt);
                            data = JSON.stringify(parsedData);
                            log("Modified WebSocket message");
                        }
                    } catch (e) {
                        // Not JSON or no prompt field
                    }
                }

                return originalSend.call(this, data);
            };

            return ws;
        };

        // Copy static properties
        for (const prop in OriginalWebSocket) {
            if (OriginalWebSocket.hasOwnProperty(prop)) {
                unsafeWindow.WebSocket[prop] = OriginalWebSocket[prop];
            }
        }

        interceptedInstances.add(OriginalWebSocket);
        log("WebSocket intercepted");
    }

    // Service Worker bypass attempt
    function handleServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                if (registrations.length > 0) {
                    log("Service Workers detected:", registrations.length);
                    // Note: We can't actually bypass service workers from userscripts,
                    // but we can log their presence for debugging
                }
            });
        }
    }

    // Apply all interceptions
    function applyInterceptions() {
        interceptXHR();
        interceptFetch();
        interceptWebSocket();
        handleServiceWorker();
    }

    // Initial application
    applyInterceptions();

    // Re-apply interceptions periodically to catch late-loaded code
    let reapplyCount = 0;
    const reapplyInterval = setInterval(() => {
        applyInterceptions();
        reapplyCount++;

        // Stop after 10 seconds
        if (reapplyCount > 20) {
            clearInterval(reapplyInterval);
            log("Stopped re-applying interceptions");
        }
    }, 500);

    // Monitor for dynamic iframe creation
    const iframeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'IFRAME' && node.contentWindow) {
                    try {
                        // Apply interceptions to iframe context
                        const iframeWindow = node.contentWindow;
                        if (iframeWindow.fetch && !interceptedInstances.has(iframeWindow.fetch)) {
                            log("Applying interceptions to iframe");
                            // Note: This might not work due to same-origin policy
                        }
                    } catch (e) {
                        // Iframe is cross-origin
                    }
                }
            });
        });
    });

    // Start observing when document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateIndicator();
            iframeObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else {
        setTimeout(() => {
            updateIndicator();
            if (document.body) {
                iframeObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 100);
    }

    // Additional monitoring for SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            log("URL changed, re-applying interceptions");
            applyInterceptions();
        }
    }).observe(document, { subtree: true, childList: true });

    // Log initialization
    log("Initialized v2");
    log("Current prompt:", systemPrompt);
    log("Enabled:", isEnabled);

    // Expose for debugging
    unsafeWindow.__deepseekSystemPrompt = {
        version: "2.0",
        isEnabled: () => isEnabled,
        getPrompt: () => systemPrompt,
        reapply: applyInterceptions
    };
})();
