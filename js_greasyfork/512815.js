// ==UserScript==
// @name         Simple ChatGPT Text Exporter
// @namespace    https://github.com/samomar/Simple-ChatGPT-Text-Exporter
// @version      4.4
// @description  Logs ChatGPT messages with labels, dynamically updates, and includes a copy button. UI can be positioned at the top center or above the input box.
// @match        https://chatgpt.com/*
// @grant        none
// @homepage     https://github.com/samomar/Simple-ChatGPT-Text-Exporter
// @supportURL   https://github.com/samomar/Simple-ChatGPT-Text-Exporter/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512815/Simple%20ChatGPT%20Text%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/512815/Simple%20ChatGPT%20Text%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        enableLogging: false,
        chatContainerSelector: localStorage.getItem('chatContainerSelector') || '',
        position: localStorage.getItem('chatLoggerPosition') || 'bottom'
    };

    let chatMessages = [];
    let observer = null;
    let lastUrl = location.href;
    let chatData = null;

    // Modify the original fetch interception to include streaming and outgoing requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [resource, config] = args;
        const method = (config && config.method) || 'GET';
        
        // Check if the request is a POST to the conversation endpoint
        if (method.toUpperCase() === 'POST' && resource.includes('/conversation')) {
            // Clone the request to read its body
            const clonedRequest = config.body ? new Request(resource, config) : null;

            if (clonedRequest) {
                clonedRequest.clone().json().then(parsedBody => {
                    if (parsedBody && parsedBody.messages && Array.isArray(parsedBody.messages)) {
                        const userMessageParts = parsedBody.messages[0]?.content?.parts;
                        if (userMessageParts && Array.isArray(userMessageParts)) {
                            const userMessage = userMessageParts.join('\n');
                            if (userMessage.trim()) {
                                chatMessages.push(`You said:\n${userMessage}`);
                                if (CONFIG.enableLogging) {
                                    console.log(`Captured User Message: ${userMessage}`);
                                }
                            }
                        }
                    }
                }).catch(error => {
                    if (CONFIG.enableLogging) {
                        console.error('Error parsing outgoing request body:', error);
                    }
                });
            }
        }

        return originalFetch.apply(this, args).then(async (response) => {
            const url = response.url;
            if (url.includes('conversation')) {
                const clonedResponse = response.clone();

                // Handle both streaming and non-streaming responses
                if (response.headers.get('content-type').includes('text/event-stream')) {
                    processStreamingResponse(clonedResponse);
                } else {
                    const jsonData = await clonedResponse.json();
                    if (jsonData.mapping) {
                        chatData = jsonData;
                        updateChatMessages();
                    }
                }
            }
            return response;
        });
    };

    // Add this new function for streaming updates
    async function processStreamingResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonData = JSON.parse(line.slice(6));
                        if (jsonData.message) {
                            // Update chatData with the new message
                            if (!chatData) chatData = { mapping: {} };
                            chatData.mapping[jsonData.message.id] = { message: jsonData.message };
                            updateChatMessages();
                        }
                    } catch (error) {
                        // Error parsing JSON
                    }
                }
            }
        }
    }

    function init() {
        resetChatData();
        createControls();
        if (CONFIG.chatContainerSelector) {
            observeChatContainer(CONFIG.chatContainerSelector);
        } else {
            const containers = findPossibleChatContainers();
            if (containers.length > 0) {
                CONFIG.chatContainerSelector = containers[0].selector;
                localStorage.setItem('chatContainerSelector', CONFIG.chatContainerSelector);
                observeChatContainer(CONFIG.chatContainerSelector);
            }
        }

        // Add listener for outgoing messages if not already added
        if (!window.outgoingMessageListenerAdded) {
            window.outgoingMessageListenerAdded = true;
            // This ensures that the fetch override is already in place
            // and user messages are captured
        }
    }

    function resetChatData() {
        chatMessages = [];
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    function createControls() {
        const existingControls = document.getElementById('chat-logger-controls');
        if (existingControls) existingControls.remove();

        const container = document.createElement('div');
        container.id = 'chat-logger-controls';

        updateControlsStyle(container);

        container.innerHTML = `
            <button id="toggle-selector-button" class="chat-logger-btn">⚙️</button>
            <div class="dropdown">
                <button id="download-chat-button" class="chat-logger-btn">⬇️</button>
                <div class="dropdown-content">
                    <a href="#" id="download-txt">Download TXT</a>
                    <a href="#" id="download-json">Download JSON</a>
                </div>
            </div>
            <button id="copy-chat-button" class="chat-logger-btn">Copy Chat</button>
            <div id="chat-selector-container" style="display:none;">
                <select id="chat-container-dropdown" class="chat-logger-select"></select>
                <button id="copy-selector-button" class="chat-logger-btn">📋</button>
                <button id="toggle-position-button" class="chat-logger-btn">↕️</button>
            </div>
        `;

        if (!document.getElementById('chat-logger-style')) {
            const style = document.createElement('style');
            style.id = 'chat-logger-style';
            style.textContent = `
                #chat-logger-controls {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px;
                    background-color: #202123;
                    border-radius: 5px;
                }
                .chat-logger-btn {
                    padding: 5px 10px;
                    font-size: 12px;
                    background-color: #343541;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .chat-logger-btn:hover {
                    background-color: #40414f;
                }
                .chat-logger-select {
                    background-color: #343541;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    padding: 5px;
                    font-size: 12px;
                }
                .dropdown {
                    position: relative;
                    display: inline-block;
                }
                .dropdown-content {
                    display: none;
                    position: absolute;
                    background-color: #202123;
                    min-width: 160px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    z-index: 1;
                    border-radius: 4px;
                    top: 100%;
                    left: 0;
                }
                .dropdown-content a {
                    color: #fff;
                    padding: 12px 16px;
                    text-decoration: none;
                    display: block;
                    font-size: 12px;
                }
                .dropdown-content a:hover {
                    background-color: #343541;
                }
                .dropdown:hover .dropdown-content {
                    display: block;
                }
            `;
            document.head.appendChild(style);
        }

        if (CONFIG.position === 'top') {
            document.body.insertBefore(container, document.body.firstChild);
        } else {
            const targetElement = document.querySelector('.flex.w-full.flex-col.gap-1\\.5.rounded-\\[26px\\].p-1\\.5.transition-colors.contain-inline-size.bg-\\[\\#f4f4f4\\].dark\\:bg-token-main-surface-secondary');
            if (targetElement && targetElement.parentElement) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'display:flex;flex-direction:column;width:100%;';
                targetElement.parentElement.insertBefore(wrapper, targetElement);
                wrapper.appendChild(container);
                wrapper.appendChild(targetElement);
            } else {
                document.body.appendChild(container);
            }
        }

        populateDropdown();
        addEventListeners();
    }

    function updateControlsStyle(container) {
        const commonStyles = `
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-family: Arial, sans-serif;
            color: #fff;
            border-radius: 4px;
            display: flex;
            align-items: center;
            padding: 3px 6px;
            font-size: 12px;
            gap: 4px;
            margin-bottom: 10px;
            width: fit-content;
        `;

        if (CONFIG.position === 'top') {
            container.style.cssText = `
                ${commonStyles}
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
            `;
        } else {
            container.style.cssText = commonStyles;
        }
    }

    function addEventListeners() {
        const controls = document.getElementById('chat-logger-controls');
        controls.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        document.getElementById('toggle-selector-button').addEventListener('click', toggleSelectorVisibility);
        document.getElementById('download-chat-button').addEventListener('click', toggleDownloadOptions);
        document.getElementById('download-txt').addEventListener('click', (e) => downloadChat(e, 'txt'));
        document.getElementById('download-json').addEventListener('click', (e) => downloadChat(e, 'json'));
        document.getElementById('copy-chat-button').addEventListener('click', copyChat);
        document.getElementById('toggle-position-button').addEventListener('click', togglePosition);
        document.getElementById('copy-selector-button').addEventListener('click', copySelectorToClipboard);
        document.getElementById('chat-container-dropdown').addEventListener('change', onSelectChange);

        document.addEventListener('click', closeDropdowns);
    }

    function toggleSelectorVisibility(e) {
        e.preventDefault();
        const selectorContainer = document.getElementById('chat-selector-container');
        selectorContainer.style.display = selectorContainer.style.display === 'none' ? 'block' : 'none';
    }

    function toggleDownloadOptions(e) {
        e.preventDefault();
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
    }

    function copyChat(e) {
        e.preventDefault();
        const button = e.target;
        const originalText = button.innerText;

        // If the button is already in an active state, do nothing
        if (button.dataset.active === 'true') {
            return;
        }

        const chatContent = chatMessages.join('\n\n');
        button.dataset.active = 'true';

        if (chatContent.trim()) {
            navigator.clipboard.writeText(chatContent).then(() => {
                showTemporaryStatus(button, 'Copied!', '#4CAF50');
            }).catch(() => {
                showTemporaryStatus(button, 'Failed to Copy', '#f44336');
            }).finally(() => {
                // Ensure the button always reverts to its original state
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.backgroundColor = '';
                    button.dataset.active = 'false';
                }, 2000);
            });
        } else {
            showTemporaryStatus(button, 'Please wait for chat to load', '#FFA500');
            // Revert to original state after the temporary message
            setTimeout(() => {
                button.innerText = originalText;
                button.style.backgroundColor = '';
                button.dataset.active = 'false';
            }, 2000);
        }
    }

    function downloadChat(e, format) {
        e.preventDefault();
        const content = format === 'json' ? JSON.stringify(chatMessages, null, 2) : chatMessages.join('\n\n');
        const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const fileName = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'chat_export';
        a.download = `${fileName}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    function togglePosition(e) {
        e.preventDefault();
        CONFIG.position = CONFIG.position === 'top' ? 'bottom' : 'top';
        localStorage.setItem('chatLoggerPosition', CONFIG.position);
        createControls();
    }

    function copySelectorToClipboard(e) {
        e.preventDefault();
        const select = document.getElementById('chat-container-dropdown');
        navigator.clipboard.writeText(select.value).then(() => {
            alert('Selector copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy selector');
        });
    }

    function onSelectChange(e) {
        e.preventDefault();
        CONFIG.chatContainerSelector = e.target.value;
        localStorage.setItem('chatContainerSelector', CONFIG.chatContainerSelector);
        resetChatData();
        if (CONFIG.chatContainerSelector) {
            observeChatContainer();
        }
    }

    function showTemporaryStatus(button, message, bgColor) {
        button.innerText = message;
        button.style.backgroundColor = bgColor;
    }

    function closeDropdowns() {
        document.querySelectorAll('.dropdown-content, #chat-selector-container').forEach(el => {
            el.style.display = 'none';
        });
    }

    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            resetCopyButton();
            init(); // Fully reinitialize on URL change
        }
    }

    function resetCopyButton() {
        const copyButton = document.getElementById('copy-chat-button');
        if (copyButton) {
            copyButton.innerText = 'Copy Chat';
            copyButton.style.backgroundColor = '';
            copyButton.dataset.active = 'false';
        }
    }

    function handlePageChanges() {
        const controlPanel = document.getElementById('chat-logger-controls');
        if (!controlPanel) {
            init();
        } else {
            // Ensure chat container is still being observed
            if (CONFIG.chatContainerSelector) {
                observeChatContainer(CONFIG.chatContainerSelector);
            }
        }
    }

    function observeChatContainer(selector) {
        if (observer) observer.disconnect();
        const container = document.querySelector(selector);
        if (container) {
            scanChatContent(container);
            observer = new MutationObserver(() => scanChatContent(container));
            observer.observe(container, { childList: true, subtree: true });
        }
    }

    function scanChatContent() {
        updateChatMessages();
    }

    function updateChatMessages() {
        if (!chatData || !chatData.mapping) return;

        const messages = [];
        const sortedNodes = Object.values(chatData.mapping).sort((a, b) => {
            return (a.message?.create_time || 0) - (b.message?.create_time || 0);
        });

        for (const node of sortedNodes) {
            if (node.message && node.message.content && node.message.content.parts) {
                const role = node.message.author.role;
                const content = node.message.content.parts.join('\n');
                if (content.trim()) {
                    if (role === 'user') {
                        messages.push(`You said:\n${content}`);
                    } else if (role === 'assistant') {
                        messages.push(`Assistant said:\n${content}`);
                    }
                    // Handle attachments if enabled
                    if (CONFIG.includeAttachments && node.message.attachments && node.message.attachments.length > 0) {
                        node.message.attachments.forEach(attachment => {
                            messages.push(`Attachment: ${attachment.url}`);
                        });
                    }
                    // Ignore system messages or other roles
                }
            }
        }

        chatMessages = messages;
        if (CONFIG.enableLogging) {
            console.log(chatMessages);
        }
    }

    function populateDropdown() {
        const select = document.getElementById('chat-container-dropdown');
        const options = findPossibleChatContainers();
        let optionsHTML = '<option value="">-- Select --</option>';
        options.forEach(opt => {
            optionsHTML += `<option value="${opt.selector}">${opt.description}</option>`;
        });
        select.innerHTML = optionsHTML;
        if (CONFIG.chatContainerSelector) select.value = CONFIG.chatContainerSelector;
    }

    function findPossibleChatContainers() {
        const selectors = [
            '[data-testid^="conversation-turn-"]',
            '[role*="log"]',
            '[role*="feed"]',
            '[role*="list"]',
            '[aria-live="polite"]',
            '[aria-relevant="additions"]',
            '[class*="chat"]',
            '[class*="message"]',
            'main',
            'section',
            'div[class*="conversation"]',
            'div[class*="thread"]',
            'div[class*="dialog"]'
        ];

        const seenSelectors = new Set();
        const result = [];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const uniqueSelector = getUniqueSelector(el);
                if (!seenSelectors.has(uniqueSelector)) {
                    seenSelectors.add(uniqueSelector);
                    result.push({
                        selector: uniqueSelector,
                        description: buildElementDescription(el)
                    });
                }
            });
        });

        return result;
    }

    function getUniqueSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.classList && el.classList.length > 0) {
            const className = '.' + Array.from(el.classList).join('.');
            return `${el.tagName.toLowerCase()}${className}`;
        }
        return el.tagName.toLowerCase();
    }

    function buildElementDescription(el) {
        const description = [];
        if (el.id) {
            description.push(`#${el.id}`);
        }
        if (el.classList && el.classList.length > 0) {
            description.push(`.${Array.from(el.classList).join('.')}`);
        }
        description.push(el.tagName.toLowerCase());
        return description.join(' ');
    }

    // Set up observers for page changes
    const bodyObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                handlePageChanges();
                break;
            }
        }
    });

    // Wait for the page to be fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAfterLoad);
    } else {
        initAfterLoad();
    }

    function initAfterLoad() {
        // Wait a short time after load to ensure all dynamic content is rendered
        setTimeout(() => {
            init();
            bodyObserver.observe(document.body, { childList: true, subtree: true });
            setInterval(checkUrlChange, 1000);
        }, 1000);
    }
})();
