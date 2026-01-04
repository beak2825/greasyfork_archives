// ==UserScript==
// @name         Claude Stream Monitor
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Monitor Claude.ai streaming responses and copy to clipboard on stop sequence
// @author       You
// @match        https://claude.ai/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        unsafeWindow
// @run-at       document-start
// @sandbox      raw
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537362/Claude%20Stream%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/537362/Claude%20Stream%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 Claude Stream Monitor: Initializing at document-start');

    const STOP_SEQUENCE = '</stop_sequence_incoming>';
    let isMonitoring = false;
    let sseBuffer = '';
    let textContent = '';

    // Critical: Use unsafeWindow to ensure we're in the page context
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // Store original fetch immediately
    const originalFetch = targetWindow.fetch;

    if (!originalFetch) {
        console.error('❌ Claude Stream Monitor: fetch not found - script loaded too late?');
        return;
    }

    // Intercept fetch in the page context
    targetWindow.fetch = new Proxy(originalFetch, {
        apply: function(target, thisArg, args) {
            const [resource, config] = args;
            const url = typeof resource === 'string' ? resource : resource.url;

            // Only intercept completion endpoints
            if (url && url.includes('/completion')) {
                console.log('🎯 Claude Stream Monitor: Intercepted completion request');

                return target.apply(thisArg, args).then(response => {
                    // Check if it's a streaming response
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('text/event-stream')) {
                        console.log('📡 Claude Stream Monitor: Intercepting SSE stream');
                        return interceptStream(response);
                    }
                    return response;
                });
            }

            return target.apply(thisArg, args);
        }
    });

    function interceptStream(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Create a new readable stream
        const stream = new ReadableStream({
            async start(controller) {
                while (true) {
                    try {
                        const { done, value } = await reader.read();

                        if (done) {
                            controller.close();
                            break;
                        }

                        // Decode chunk
                        const chunk = decoder.decode(value, { stream: true });
                        if (isMonitoring) {
                            processSSEChunk(chunk);
                        }

                        // Pass through original data
                        controller.enqueue(value);
                    } catch (error) {
                        console.error('Stream error:', error);
                        controller.error(error);
                        break;
                    }
                }
            }
        });

        // Return new response with intercepted stream
        return new Response(stream, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText
        });
    }

    function processSSEChunk(chunk) {
        sseBuffer += chunk;

        // Parse complete SSE events
        const events = parseSSE(sseBuffer);

        for (const event of events.complete) {
            if (event.event === 'content_block_delta' && event.data) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.delta?.type === 'text_delta' && data.delta.text) {
                        textContent += data.delta.text;
                        // console.log('📝 Text chunk:', data.delta.text);

                        // Check for stop sequence
                        if (textContent.includes(STOP_SEQUENCE)) {
                            handleStopSequence();
                        }
                    }
                } catch (e) {
                    console.error('Parse error:', e);
                }
            }
        }

        sseBuffer = events.incomplete;
    }

    function parseSSE(buffer) {
        const lines = buffer.split('\n');
        const complete = [];
        let current = {};
        let i = 0;

        while (i < lines.length - 1) { // -1 to handle incomplete last line
            const line = lines[i];

            if (line === '') {
                if (current.data) {
                    complete.push(current);
                }
                current = {};
            } else if (line.startsWith('event: ')) {
                current.event = line.slice(7);
            } else if (line.startsWith('data: ')) {
                current.data = line.slice(6);
            }
            i++;
        }

        // Return remaining lines as incomplete
        return {
            complete,
            incomplete: lines.slice(i).join('\n')
        };
    }

    function handleStopSequence() {
        const endIndex = textContent.indexOf(STOP_SEQUENCE);
        const contentToCopy = textContent.substring(0, endIndex).trim();

        console.log('✅ Stop sequence detected! Copying text...');

        // Copy to clipboard
        GM_setClipboard(contentToCopy);

        // Notify user
        GM_notification({
            text: `Captured ${contentToCopy.length} characters!`,
            title: 'Claude Stream Monitor',
            timeout: 3000
        });

        // Reset state
        resetMonitoring();
    }

    function resetMonitoring() {
        textContent = '';
        sseBuffer = '';
        isMonitoring = false;
        updateButtonState();
    }

    function updateButtonState() {
        const btn = document.querySelector('#claude-monitor-btn');
        if (btn) {
            btn.textContent = isMonitoring ? 'Stop Monitoring' : 'Start Monitoring';
            btn.style.background = isMonitoring ? '#f44336' : '#4CAF50';
        }
    }

    // Add UI controls when DOM is ready
    function addControls() {
        // Check if controls already exist
        if (document.querySelector('#claude-monitor-controls')) return;

        const controlDiv = document.createElement('div');
        controlDiv.id = 'claude-monitor-controls';
        controlDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: #1a1a1a;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: monospace;
        `;

        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            color: #888;
            font-size: 12px;
            margin-bottom: 8px;
        `;
        statusDiv.textContent = 'Claude Stream Monitor v2.0';

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'claude-monitor-btn';
        toggleBtn.textContent = 'Start Monitoring';
        toggleBtn.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-family: inherit;
            transition: background 0.2s;
        `;

        toggleBtn.onclick = () => {
            isMonitoring = !isMonitoring;
            if (isMonitoring) {
                textContent = '';
                sseBuffer = '';
                console.log('🔍 Claude Stream Monitor: Started monitoring');
            } else {
                console.log('🛑 Claude Stream Monitor: Stopped monitoring');
            }
            updateButtonState();
        };

        controlDiv.appendChild(statusDiv);
        controlDiv.appendChild(toggleBtn);
        document.body.appendChild(controlDiv);
    }

    // Wait for DOM with mutation observer (more reliable than DOMContentLoaded)
    const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
            addControls();
            obs.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    console.log('✅ Claude Stream Monitor: Fetch interceptor installed');
})();