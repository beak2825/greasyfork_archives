// ==UserScript==
// @name         Claude Stream Monitor
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Monitor Claude.ai streaming responses with persistent state, user configuration, and enhanced performance
// @author       You
// @match        https://claude.ai/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @sandbox      raw
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537404/Claude%20Stream%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/537404/Claude%20Stream%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 Claude Stream Monitor: Initializing (Persistent & Configurable - Fixed) at document-start');

    // Default configuration
    const DEFAULT_CONFIG = {
        stopSequence: '</bullet_points_start>',
        streamTimeout: 5 * 60 * 1000, // 5 minutes
        batchWindow: 50, // 50ms batching window
        maxContentSize: 10 * 1024 * 1024, // 10MB
        autoRefresh: true,
        showNotifications: true,
        startWithMonitoring: false // Default monitoring state on page load
    };

    let config = { ...DEFAULT_CONFIG };
    let isMonitoring = false;
    let sseBuffer = '';
    let textContent = '';
    let streamTimeout = null;
    let batchTimer = null;
    let chunkBuffer = [];
    let instanceId = Date.now(); // Unique instance ID to handle multiple tabs
    let storageInitialized = false;

    // Critical: Use unsafeWindow to ensure we're in the page context
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // Safe storage operations with error handling
    function safeGetValue(key, defaultValue) {
        try {
            const value = GM_getValue(key, defaultValue);
            return value;
        } catch (error) {
            console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Error reading ${key}:`, error);
            return defaultValue;
        }
    }

    function safeSetValue(key, value) {
        try {
            GM_setValue(key, value);
            return true;
        } catch (error) {
            console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Error writing ${key}:`, error);
            return false;
        }
    }

    // Initialize storage with delay to ensure GM functions are ready
    function initializeStorage() {
        return new Promise((resolve) => {
            const attemptInit = () => {
                try {
                    // Test if GM functions are available and working
                    const testValue = safeGetValue('_test_storage_' + instanceId, 'test');
                    safeSetValue('_test_storage_' + instanceId, 'working');

                    if (safeGetValue('_test_storage_' + instanceId, 'fail') === 'working') {
                        storageInitialized = true;
                        console.log(`✅ Claude Stream Monitor [${instanceId}]: Storage initialized successfully`);
                        resolve(true);
                    } else {
                        throw new Error('Storage test failed');
                    }
                } catch (error) {
                    console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Storage not ready, retrying...`, error);
                    setTimeout(attemptInit, 100); // Retry in 100ms
                }
            };

            // Start immediately, but with timeout fallback
            attemptInit();

            // Fallback timeout - continue without storage if it takes too long
            setTimeout(() => {
                if (!storageInitialized) {
                    console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Storage initialization timeout, continuing without persistence`);
                    resolve(false);
                }
            }, 2000); // 2 second timeout
        });
    }

    // Load configuration with error handling
    function loadConfig() {
        if (!storageInitialized) return;

        try {
            Object.keys(DEFAULT_CONFIG).forEach(key => {
                const stored = safeGetValue(`config_${key}`, DEFAULT_CONFIG[key]);
                if (stored !== undefined) {
                    config[key] = stored;
                }
            });
            console.log(`⚙️ Claude Stream Monitor [${instanceId}]: Configuration loaded`);
        } catch (error) {
            console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Error loading config, using defaults:`, error);
            config = { ...DEFAULT_CONFIG };
        }
    }

    // Persistent storage functions with improved error handling
    function saveState() {
        if (!storageInitialized) {
            console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Cannot save state - storage not initialized`);
            return;
        }

        // Update config with current state
        config.isMonitoring = isMonitoring;
        config.lastUpdate = Date.now();
        config.lastInstanceId = instanceId;

        // Save using the same mechanism as other config
        try {
            safeSetValue('config_isMonitoring', config.isMonitoring);
            safeSetValue('config_lastUpdate', config.lastUpdate);
            safeSetValue('config_lastInstanceId', config.lastInstanceId);
            console.log(`💾 Claude Stream Monitor [${instanceId}]: State saved - isMonitoring: ${config.isMonitoring}, timestamp: ${new Date().toLocaleTimeString()}`);
        } catch (error) {
            console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Error saving state:`, error);
        }
    }

    function loadState() {
        if (!storageInitialized) {
            console.log(`📝 Claude Stream Monitor [${instanceId}]: Storage not initialized - using default monitoring state`);
            isMonitoring = DEFAULT_CONFIG.startWithMonitoring;
            return;
        }

        // Simply use the config setting for default state
        isMonitoring = config.startWithMonitoring;
        console.log(`🔍 Claude Stream Monitor [${instanceId}]: Set monitoring state from config: ${isMonitoring}`);
    }

    function saveConfig() {
        if (!storageInitialized) return;

        try {
            // Update state values in config before saving
            config.isMonitoring = isMonitoring;
            config.lastUpdate = Date.now();
            config.lastInstanceId = instanceId;

            // Save all config values (including state)
            Object.keys(config).forEach(key => {
                safeSetValue(`config_${key}`, config[key]);
            });
            console.log(`⚙️ Claude Stream Monitor [${instanceId}]: Configuration and state saved`);
        } catch (error) {
            console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Error saving config:`, error);
        }
    }

    function resetConfig() {
        config = { ...DEFAULT_CONFIG };
        isMonitoring = config.startWithMonitoring; // Use the config default

        if (storageInitialized) {
            Object.keys(DEFAULT_CONFIG).forEach(key => {
                safeSetValue(`config_${key}`, DEFAULT_CONFIG[key]);
            });
        }
        console.log(`🔄 Claude Stream Monitor [${instanceId}]: Configuration reset to defaults`);
    }

    // Store original fetch immediately
    const originalFetch = targetWindow.fetch;

    if (!originalFetch) {
        console.error('❌ Claude Stream Monitor: fetch not found - script loaded too late?');
        return;
    }

    // Initialize everything after a brief delay to ensure GM functions are ready
    async function initialize() {
        console.log(`🔧 Claude Stream Monitor [${instanceId}]: Initializing storage...`);

        const storageReady = await initializeStorage();

        if (storageReady) {
            loadConfig();
            loadState();
        } else {
            config = { ...DEFAULT_CONFIG };
            console.log(`📝 Claude Stream Monitor [${instanceId}]: Running without persistent storage`);
        }

        // Update UI after state is loaded
        updateButtonState();
        console.log(`✅ Claude Stream Monitor [${instanceId}]: Initialization complete - monitoring state: ${isMonitoring}`);
    }

    // Start initialization
    initialize();

    // Intercept fetch in the page context
    targetWindow.fetch = new Proxy(originalFetch, {
        apply: function(target, thisArg, args) {
            const [resource, config] = args;
            const url = typeof resource === 'string' ? resource : resource.url;

            // Only intercept completion endpoints
            if (url && url.includes('/completion')) {
                console.log(`🎯 Claude Stream Monitor [${instanceId}]: Intercepted completion request`);

                return target.apply(thisArg, args).then(response => {
                    // Check if it's a streaming response
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('text/event-stream')) {
                        console.log(`📡 Claude Stream Monitor [${instanceId}]: Intercepting SSE stream`);
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
                if (isMonitoring) {
                    startStreamTimeout();
                }

                while (true) {
                    try {
                        const { done, value } = await reader.read();

                        if (done) {
                            controller.close();
                            if (isMonitoring) {
                                processPendingBatch(); // Process any remaining chunks
                                clearTimeout(streamTimeout);
                            }
                            break;
                        }

                        // Decode chunk
                        const chunk = decoder.decode(value, { stream: true });
                        if (isMonitoring) {
                            scheduleProcessing(chunk);
                        }

                        // Pass through original data
                        controller.enqueue(value);
                    } catch (error) {
                        console.error('Stream error:', error);
                        if (isMonitoring) {
                            clearTimeout(streamTimeout);
                            clearTimeout(batchTimer);
                        }
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

    // Batch processing to reduce overhead
    function scheduleProcessing(chunk) {
        chunkBuffer.push(chunk);

        if (!batchTimer) {
            batchTimer = setTimeout(() => {
                processBatchedChunks();
                batchTimer = null;
            }, config.batchWindow);
        }
    }

    function processBatchedChunks() {
        if (chunkBuffer.length === 0) return;

        // Process all buffered chunks
        const combinedChunk = chunkBuffer.join('');
        chunkBuffer = [];

        processSSEChunk(combinedChunk);
    }

    function processPendingBatch() {
        if (batchTimer) {
            clearTimeout(batchTimer);
            batchTimer = null;
            processBatchedChunks();
        }
    }

    function processSSEChunk(chunk) {
        sseBuffer += chunk;

        // Memory protection
        if (textContent.length > config.maxContentSize) {
            console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Content size exceeded limit, stopping monitoring`);
            resetMonitoring();
            return;
        }

        // Parse complete SSE events
        const events = parseSSE(sseBuffer);

        for (const event of events.complete) {
            if (event.event === 'content_block_delta' && event.data) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.delta?.type === 'text_delta' && data.delta.text) {
                        textContent += data.delta.text;

                        // Check for stop sequence
                        if (textContent.includes(config.stopSequence)) {
                            handleStopSequence();
                            return; // Exit early to prevent further processing
                        }
                    }
                } catch (e) {
                    console.error(`Parse error [${instanceId}]:`, e);
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

    function startStreamTimeout() {
        clearTimeout(streamTimeout); // Clear any existing timeout
        streamTimeout = setTimeout(() => {
            console.warn(`⚠️ Claude Stream Monitor [${instanceId}]: Stream timeout - resetting monitor`);
            resetMonitoring();
        }, config.streamTimeout);
    }

    function handleStopSequence() {
        const endIndex = textContent.indexOf(config.stopSequence);
        const contentToCopy = textContent.substring(0, endIndex).trim();

        console.log(`✅ Stop sequence detected [${instanceId}]! Copying text...`);

        // Clear all timers
        clearTimeout(streamTimeout);
        clearTimeout(batchTimer);

        // Copy to clipboard
        GM_setClipboard(contentToCopy);

        // Notify user (if enabled)
        if (config.showNotifications) {
            GM_notification({
                text: `Captured ${contentToCopy.length} characters!`,
                title: 'Claude Stream Monitor',
                timeout: 3000
            });
        }

        // Reset state
        resetMonitoring();

        // Auto-refresh (if enabled)
        if (config.autoRefresh) {
            console.log(`🔄 Claude Stream Monitor [${instanceId}]: Attempting forceful hard refresh...`);
            try {
                // Attempt to stop any ongoing processes
                targetWindow.stop();
            } catch (e) {
                console.warn(`Claude Stream Monitor [${instanceId}]: Error calling window.stop():`, e);
            }

            // Perform a hard refresh (bypassing cache)
            targetWindow.location.reload(true);
        }
    }

    function resetMonitoring() {
        textContent = '';
        sseBuffer = '';
        chunkBuffer = [];
        isMonitoring = false;

        // Clear all timers
        clearTimeout(streamTimeout);
        clearTimeout(batchTimer);
        streamTimeout = null;
        batchTimer = null;

        updateButtonState();
        console.log(`🔄 Claude Stream Monitor [${instanceId}]: State reset`);
    }

    function updateButtonState() {
        const btn = document.querySelector('#claude-monitor-btn');
        if (btn) {
            if (isMonitoring) {
                btn.style.background = '#4CAF50'; // Green when monitoring
                btn.style.boxShadow = '0 0 8px #4CAF50'; // Add a glow
                btn.title = `Monitoring Active [${instanceId}] - Click to Stop`;
            } else {
                btn.style.background = '#888'; // Gray when idle
                btn.style.boxShadow = 'none'; // Remove glow
                btn.title = `Monitoring Idle [${instanceId}] - Click to Start`;
            }
        }
    }

    function createConfigPanel() {
        const panel = document.createElement('div');
        panel.id = 'claude-monitor-config';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2a2a2a;
            border: 2px solid #555;
            border-radius: 8px;
            padding: 20px;
            z-index: 10001;
            color: #fff;
            font-family: monospace;
            font-size: 12px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            display: none;
        `;

        panel.innerHTML = `
            <h3 style="margin-top: 0; color: #4CAF50;">Claude Monitor Configuration</h3>
            <div style="margin-bottom: 10px; font-size: 11px; color: #aaa;">
                Storage: ${storageInitialized ? '✅ Active' : '❌ Disabled'} | Instance: ${instanceId}
            </div>
            <div style="margin-bottom: 15px;">
                <label>Stop Sequence:</label><br>
                <input type="text" id="config-stop-sequence" value="${config.stopSequence}" style="width: 100%; padding: 5px; margin-top: 5px; background: #444; color: #fff; border: 1px solid #666;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Stream Timeout (ms):</label><br>
                <input type="number" id="config-stream-timeout" value="${config.streamTimeout}" style="width: 100%; padding: 5px; margin-top: 5px; background: #444; color: #fff; border: 1px solid #666;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Batch Window (ms):</label><br>
                <input type="number" id="config-batch-window" value="${config.batchWindow}" style="width: 100%; padding: 5px; margin-top: 5px; background: #444; color: #fff; border: 1px solid #666;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Max Content Size (bytes):</label><br>
                <input type="number" id="config-max-content-size" value="${config.maxContentSize}" style="width: 100%; padding: 5px; margin-top: 5px; background: #444; color: #fff; border: 1px solid #666;">
            </div>
            <div style="margin-bottom: 15px;">
                <label><input type="checkbox" id="config-auto-refresh" ${config.autoRefresh ? 'checked' : ''}> Auto Refresh After Capture</label>
            </div>
            <div style="margin-bottom: 15px;">
                <label><input type="checkbox" id="config-show-notifications" ${config.showNotifications ? 'checked' : ''}> Show Notifications</label>
            </div>
            <div style="margin-bottom: 15px;">
                <label><input type="checkbox" id="config-start-with-monitoring" ${config.startWithMonitoring ? 'checked' : ''}> Start With Monitoring Enabled</label>
            </div>
            <div style="text-align: center;">
                <button id="config-save" style="padding: 8px 15px; margin-right: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                <button id="config-reset" style="padding: 8px 15px; margin-right: 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Reset</button>
                <button id="config-cancel" style="padding: 8px 15px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('config-save').onclick = () => {
            config.stopSequence = document.getElementById('config-stop-sequence').value;
            config.streamTimeout = parseInt(document.getElementById('config-stream-timeout').value);
            config.batchWindow = parseInt(document.getElementById('config-batch-window').value);
            config.maxContentSize = parseInt(document.getElementById('config-max-content-size').value);
            config.autoRefresh = document.getElementById('config-auto-refresh').checked;
            config.showNotifications = document.getElementById('config-show-notifications').checked;
            config.startWithMonitoring = document.getElementById('config-start-with-monitoring').checked;

            saveConfig();
            panel.style.display = 'none';
        };

        document.getElementById('config-reset').onclick = () => {
            resetConfig();
            panel.remove();
            createConfigPanel(); // Recreate with default values
        };

        document.getElementById('config-cancel').onclick = () => {
            panel.style.display = 'none';
        };

        return panel;
    }

    // Add UI controls when DOM is ready
    async function addControls() {
        // Check if controls already exist
        if (document.querySelector('#claude-monitor-btn')) return;

        // Wait a bit for initialization to complete if it hasn't already
        let retries = 0;
        while (!storageInitialized && retries < 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'claude-monitor-btn';
        toggleBtn.textContent = '';
        toggleBtn.title = `Monitoring ${isMonitoring ? 'Active' : 'Idle'} [${instanceId}] - Click to ${isMonitoring ? 'Stop' : 'Start'}`;

        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 2px solid #fff;
            padding: 0;
            background: ${isMonitoring ? '#4CAF50' : '#888'};
            color: transparent;
            cursor: pointer;
            font-size: 0;
            transition: background 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            ${isMonitoring ? 'box-shadow: 0 0 8px #4CAF50;' : ''}
        `;

        toggleBtn.onclick = () => {
            isMonitoring = !isMonitoring;
            if (isMonitoring) {
                textContent = '';
                sseBuffer = '';
                chunkBuffer = [];
                console.log(`🔍 Claude Stream Monitor [${instanceId}]: Started monitoring`);
            } else {
                console.log(`🛑 Claude Stream Monitor [${instanceId}]: Stopped monitoring manually`);
                // Clear timers when stopped manually
                clearTimeout(streamTimeout);
                clearTimeout(batchTimer);
            }

            updateButtonState();
        };

        // Right-click to open config
        toggleBtn.oncontextmenu = (e) => {
            e.preventDefault();
            const configPanel = document.querySelector('#claude-monitor-config') || createConfigPanel();
            configPanel.style.display = configPanel.style.display === 'block' ? 'none' : 'block';
        };

        document.body.appendChild(toggleBtn);

        // Ensure button state is correct from the start
        updateButtonState();
        console.log(`🎨 Claude Stream Monitor [${instanceId}]: UI controls added with monitoring state: ${isMonitoring}`);
    }

    // Handle page visibility changes (just for logging - doesn't affect monitoring state)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isMonitoring) {
            console.log(`👁️ Claude Stream Monitor [${instanceId}]: Page hidden (monitoring continues in background)`);
        } else if (!document.hidden && isMonitoring) {
            console.log(`👁️ Claude Stream Monitor [${instanceId}]: Page visible (monitoring active)`);
        }
    });

    // Wait for DOM with mutation observer
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

    console.log(`✅ Claude Stream Monitor [${instanceId}]: Fetch interceptor installed with simple config-based startup`);
})();