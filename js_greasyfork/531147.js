// ==UserScript==
// @name         Grok DeMod
// @license      GPL-3.0-or-later
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides moderation results in Grok conversations, auto-recovers blocked messages.
// @author       UniverseDev
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @match        https://grok.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/531147/Grok%20DeMod.user.js
// @updateURL https://update.greasyfork.org/scripts/531147/Grok%20DeMod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        defaultFlags: [
            'isFlagged', 'isBlocked', 'moderationApplied', 'restricted'
        ],
        messageKeys: ['message', 'content', 'text', 'error'],
        moderationMessagePatterns: [
            /this content has been moderated/i,
            /sorry, i cannot assist/i,
            /policy violation/i,
            /blocked/i,
            /moderated/i,
            /restricted/i,
            /content restricted/i,
            /unable to process/i,
            /cannot help/i,
            /(sorry|apologies).*?(cannot|unable|help|assist)/i,
        ],
        clearedMessageText: '[Content cleared by Grok DeMod]',
        recoveryTimeoutMs: 5000,
        lsKeys: {
            enabled: 'GrokDeModEnabled',
            debug: 'GrokDeModDebug',
            flags: 'GrokDeModFlags',

        },
        styles: {

            uiContainer: `
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 10000;
                background: #2d2d2d;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                gap: 8px;
                font-family: Arial, sans-serif;
                color: #e0e0e0;
                min-width: 170px;

            `,
            button: `
                padding: 6px 12px;
                border-radius: 5px;
                border: none;
                cursor: pointer;
                color: #fff;
                font-size: 13px;
                transition: background-color 0.2s ease;
            `,
            status: `
                padding: 5px;
                font-size: 12px;
                color: #a0a0a0;
                text-align: center;
                border-top: 1px solid #444;
                margin-top: 5px;
                min-height: 16px;
            `,
            logContainer: `
                max-height: 100px;
                overflow-y: auto;
                font-size: 11px;
                color: #c0c0c0;
                background-color: #333;
                padding: 5px;
                border-radius: 4px;
                line-height: 1.4;
                margin-top: 5px;
            `,
            logEntry: `
                padding-bottom: 3px;
                border-bottom: 1px dashed #555;
                margin-bottom: 3px;
                word-break: break-word;
            `,

            colors: {
                enabled: '#388E3C',
                disabled: '#D32F2F',
                debugEnabled: '#1976D2',
                debugDisabled: '#555555',
                safe: '#66ff66',
                flagged: '#ffa500',
                blocked: '#ff6666',
                recovering: '#ffcc00'
            }
        }
    };


    let demodEnabled = getState(CONFIG.lsKeys.enabled, true);
    let debug = getState(CONFIG.lsKeys.debug, false);
    let moderationFlags = getState(CONFIG.lsKeys.flags, CONFIG.defaultFlags);
    let initCache = null;
    let currentConversationId = null;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const uiLogBuffer = [];
    const MAX_LOG_ENTRIES = 50;


    const ModerationResult = Object.freeze({
        SAFE: 0,
        FLAGGED: 1,
        BLOCKED: 2,
    });



    function logDebug(...args) {
        if (debug) {
            console.log('[Grok DeMod]', ...args);
        }
    }

    function logError(...args) {
        console.error('[Grok DeMod]', ...args);
    }


    function getState(key, defaultValue) {
        try {
            const value = localStorage.getItem(key);
            if (value === null) return defaultValue;
            if (value === 'true') return true;
            if (value === 'false') return false;
            return JSON.parse(value);
        } catch (e) {
            logError(`Error reading ${key} from localStorage:`, e);
            return defaultValue;
        }
    }


    function setState(key, value) {
        try {
            const valueToStore = typeof value === 'boolean' ? value.toString() : JSON.stringify(value);
            localStorage.setItem(key, valueToStore);
        } catch (e) {
            logError(`Error writing ${key} to localStorage:`, e);
        }
    }


    function timeoutPromise(ms, promise, description = 'Promise') {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                logDebug(`${description} timed out after ${ms}ms`);
                reject(new Error(`Timeout (${description})`));
            }, ms);
            promise.then(
                (value) => { clearTimeout(timer); resolve(value); },
                (error) => { clearTimeout(timer); reject(error); }
            );
        });
    }


    function getModerationResult(obj, path = '') {
        if (typeof obj !== 'object' || obj === null) return ModerationResult.SAFE;

        let result = ModerationResult.SAFE;

        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;

            const currentPath = path ? `${path}.${key}` : key;
            const value = obj[key];


            if (key === 'isBlocked' && value === true) {
                logDebug(`Blocked detected via flag '${currentPath}'`);
                return ModerationResult.BLOCKED;
            }


            if (moderationFlags.includes(key) && value === true) {
                logDebug(`Flagged detected via flag '${currentPath}'`);
                result = Math.max(result, ModerationResult.FLAGGED);
            }


            if (CONFIG.messageKeys.includes(key) && typeof value === 'string') {
                const content = value.toLowerCase();
                for (const pattern of CONFIG.moderationMessagePatterns) {
                    if (pattern.test(content)) {
                        logDebug(`Moderation pattern matched in '${currentPath}': "${content.substring(0, 50)}..."`);

                        if (/blocked|moderated|restricted/i.test(pattern.source)) {
                             return ModerationResult.BLOCKED;
                        }
                        result = Math.max(result, ModerationResult.FLAGGED);
                        break;
                    }
                }

                if (result === ModerationResult.SAFE && content.length < 70 && /(sorry|apologies|unable|cannot)/i.test(content)) {
                     logDebug(`Heuristic moderation detected in '${currentPath}': "${content.substring(0, 50)}..."`);
                     result = Math.max(result, ModerationResult.FLAGGED);
                }
            }


            if (typeof value === 'object') {
                const childResult = getModerationResult(value, currentPath);
                if (childResult === ModerationResult.BLOCKED) {
                    return ModerationResult.BLOCKED;
                }
                result = Math.max(result, childResult);
            }
        }
        return result;
    }


    function clearFlagging(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => clearFlagging(item));
        }

        const newObj = {};
        for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;

            const value = obj[key];


            if (moderationFlags.includes(key) && value === true) {
                newObj[key] = false;
                logDebug(`Cleared flag '${key}'`);
            }

            else if (CONFIG.messageKeys.includes(key) && typeof value === 'string') {
                let replaced = false;
                for (const pattern of CONFIG.moderationMessagePatterns) {
                    if (pattern.test(value)) {
                        newObj[key] = CONFIG.clearedMessageText;
                        logDebug(`Replaced moderated message in '${key}' using pattern`);
                        replaced = true;
                        break;
                    }
                }

                 if (!replaced && value.length < 70 && /(sorry|apologies|unable|cannot)/i.test(value.toLowerCase())) {

                     if (getModerationResult({[key]: value}) === ModerationResult.FLAGGED) {
                        newObj[key] = CONFIG.clearedMessageText;
                        logDebug(`Replaced heuristic moderated message in '${key}'`);
                        replaced = true;
                     }
                 }

                if (!replaced) {
                    newObj[key] = value;
                }
            }

            else if (typeof value === 'object') {
                newObj[key] = clearFlagging(value);
            }

            else {
                newObj[key] = value;
            }
        }
        return newObj;
    }



    let uiContainer, toggleButton, debugButton, statusEl, logContainer;

    function addLog(message) {
        if (!logContainer) return;
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${timestamp}] ${message}`;
        logEntry.style.cssText = CONFIG.styles.logEntry;


        uiLogBuffer.push(logEntry);
        if (uiLogBuffer.length > MAX_LOG_ENTRIES) {
            const removed = uiLogBuffer.shift();

            if (removed && removed.parentNode === logContainer) {
                logContainer.removeChild(removed);
            }
        }

        logContainer.appendChild(logEntry);

        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function updateStatus(modResult, isRecovering = false) {
         if (!statusEl) return;
        let text = 'Status: ';
        let color = CONFIG.styles.colors.safe;

        if (isRecovering) {
            text += 'Recovering...';
            color = CONFIG.styles.colors.recovering;
        } else if (modResult === ModerationResult.BLOCKED) {
            text += 'Blocked (Recovered/Cleared)';
            color = CONFIG.styles.colors.blocked;
        } else if (modResult === ModerationResult.FLAGGED) {
            text += 'Flagged (Cleared)';
            color = CONFIG.styles.colors.flagged;
        } else {
            text += 'Safe';
            color = CONFIG.styles.colors.safe;
        }
        statusEl.textContent = text;
        statusEl.style.color = color;
    }


    function setupUI() {
        uiContainer = document.createElement('div');
        uiContainer.id = 'grok-demod-ui';
        uiContainer.style.cssText = CONFIG.styles.uiContainer;



        toggleButton = document.createElement('button');
        debugButton = document.createElement('button');
        statusEl = document.createElement('div');
        logContainer = document.createElement('div');


        toggleButton.textContent = demodEnabled ? 'DeMod: ON' : 'DeMod: OFF';
        toggleButton.title = 'Toggle DeMod functionality (ON = intercepting)';
        toggleButton.style.cssText = CONFIG.styles.button;
        toggleButton.style.backgroundColor = demodEnabled ? CONFIG.styles.colors.enabled : CONFIG.styles.colors.disabled;
        toggleButton.onclick = (e) => {

            demodEnabled = !demodEnabled;
            setState(CONFIG.lsKeys.enabled, demodEnabled);
            toggleButton.textContent = demodEnabled ? 'DeMod: ON' : 'DeMod: OFF';
            toggleButton.style.backgroundColor = demodEnabled ? CONFIG.styles.colors.enabled : CONFIG.styles.colors.disabled;
            addLog(`DeMod ${demodEnabled ? 'Enabled' : 'Disabled'}.`);
            console.log('[Grok DeMod] Interception is now', demodEnabled ? 'ACTIVE' : 'INACTIVE');
        };


        debugButton.textContent = debug ? 'Debug: ON' : 'Debug: OFF';
        debugButton.title = 'Toggle debug mode (logs verbose details to console)';
        debugButton.style.cssText = CONFIG.styles.button;
        debugButton.style.backgroundColor = debug ? CONFIG.styles.colors.debugEnabled : CONFIG.styles.colors.debugDisabled;
        debugButton.onclick = (e) => {

            debug = !debug;
            setState(CONFIG.lsKeys.debug, debug);
            debugButton.textContent = debug ? 'Debug: ON' : 'Debug: OFF';
            debugButton.style.backgroundColor = debug ? CONFIG.styles.colors.debugEnabled : CONFIG.styles.colors.debugDisabled;
            addLog(`Debug Mode ${debug ? 'Enabled' : 'Disabled'}.`);
            logDebug(`Debug mode ${debug ? 'enabled' : 'disabled'}.`);
        };


        statusEl.id = 'grok-demod-status';
        statusEl.style.cssText = CONFIG.styles.status;
        updateStatus(ModerationResult.SAFE);


        logContainer.id = 'grok-demod-log';
        logContainer.style.cssText = CONFIG.styles.logContainer;

        uiLogBuffer.forEach(entry => logContainer.appendChild(entry));
        logContainer.scrollTop = logContainer.scrollHeight;


        uiContainer.appendChild(toggleButton);
        uiContainer.appendChild(debugButton);
        uiContainer.appendChild(statusEl);
        uiContainer.appendChild(logContainer);
        document.body.appendChild(uiContainer);

        addLog("Grok DeMod Initialized.");
        if (debug) addLog("Debug mode is ON.");


    }



    async function redownloadLatestMessage() {
        if (!currentConversationId) {
            logDebug('Recovery skipped: Missing conversationId');
            addLog('Recovery failed: No conversation ID.');
            return null;
        }
         if (!initCache || !initCache.headers) {

            logDebug('Recovery cache missing, attempting fresh fetch for headers...');
            try {
                const currentConvUrl = `/rest/app-chat/conversation/${currentConversationId}`;
                const tempResp = await originalFetch(currentConvUrl, { method: 'GET', headers: {'Accept': 'application/json'} });
                if (tempResp.ok) {

                    logDebug('Fresh header fetch successful (status OK).');

                    initCache = { headers: new Headers({'Accept': 'application/json'}), credentials: 'include' };
                } else {
                     logDebug(`Fresh header fetch failed with status ${tempResp.status}. Recovery may fail.`);
                     addLog('Recovery failed: Cannot get request data.');
                     return null;
                }
            } catch (e) {
                 logError('Error during fresh header fetch:', e);
                 addLog('Recovery failed: Error getting request data.');
                 return null;
            }

        }

        const url = `/rest/app-chat/conversation/${currentConversationId}`;
        logDebug(`Attempting recovery fetch for conversation: ${currentConversationId}`);
        addLog('Attempting content recovery...');


        const headers = new Headers(initCache.headers);

        if (!headers.has('Accept')) headers.set('Accept', 'application/json, text/plain, */*');



        const requestOptions = {
            method: 'GET',
            headers: headers,
            credentials: initCache.credentials || 'include',
        };

        try {
            const response = await timeoutPromise(
                CONFIG.recoveryTimeoutMs,
                fetch(url, requestOptions),
                'Recovery Fetch'
            );

            if (!response.ok) {
                logError(`Recovery fetch failed with status ${response.status}: ${response.statusText}`);
                addLog(`Recovery failed: HTTP ${response.status}`);

                try {
                    const errorBody = await response.text();
                    logDebug('Recovery error body:', errorBody.substring(0, 500));
                } catch (e) { }
                return null;
            }

            const data = await response.json();
            const messages = data?.messages;

            if (!Array.isArray(messages) || messages.length === 0) {
                logDebug('Recovery failed: No messages found in conversation data', data);
                addLog('Recovery failed: No messages found.');
                return null;
            }


             messages.sort((a, b) => {
                const tsA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                const tsB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return tsB - tsA;
             });

            const latestMessage = messages[0];


            if (!latestMessage || typeof latestMessage.content !== 'string' || latestMessage.content.trim() === '') {
                 logDebug('Recovery failed: Latest message or its content is invalid/empty', latestMessage);
                 addLog('Recovery failed: Invalid latest message.');
                 return null;
            }

            logDebug('Recovery successful, latest content:', latestMessage.content.substring(0, 100) + '...');
            addLog('Recovery seems successful.');
            return { content: latestMessage.content };

        } catch (e) {
            logError('Recovery fetch/parse error:', e);
            addLog(`Recovery error: ${e.message}`);
            return null;
        }
    }


    function extractConversationIdFromUrl(url) {

        const match = url.match(/\/conversation\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
        return match ? match[1] : null;
    }


    async function processPotentialModeration(json, source) {
        const modResult = getModerationResult(json);
        let finalJson = json;

        if (modResult !== ModerationResult.SAFE) {
            if (modResult === ModerationResult.BLOCKED) {
                logDebug(`Blocked content detected from ${source}:`, JSON.stringify(json).substring(0, 200) + '...');
                addLog(`Blocked content from ${source}.`);
                updateStatus(modResult, true);

                const recoveredData = await redownloadLatestMessage();

                if (recoveredData && recoveredData.content) {
                    addLog(`Recovery successful (${source}).`);
                    logDebug(`Recovered content applied (${source})`);


                    let replaced = false;
                    const keysToTry = [...CONFIG.messageKeys, 'text', 'message'];
                    for (const key of keysToTry) {
                         if (typeof finalJson[key] === 'string') {
                            finalJson[key] = recoveredData.content;
                            logDebug(`Injected recovered content into key '${key}'`);
                            replaced = true;
                            break;
                         }
                    }

                    if (!replaced) {
                        logDebug("Could not find standard key to inject recovered content, adding as 'recovered_content'");
                         finalJson.recovered_content = recoveredData.content;
                    }


                    finalJson = clearFlagging(finalJson);
                    updateStatus(modResult, false);

                } else {

                    addLog(`Recovery failed (${source}). Content may be lost.`);
                    logDebug(`Recovery failed (${source}), applying standard clearing.`);
                    finalJson = clearFlagging(json);
                    updateStatus(modResult, false);
                }
            } else {
                logDebug(`Flagged content detected and cleared from ${source}.`);
                addLog(`Flagged content cleared (${source}).`);
                finalJson = clearFlagging(json);
                updateStatus(modResult);
            }
        } else {


            if (statusEl && !statusEl.textContent.includes('Blocked') && !statusEl.textContent.includes('Flagged') && !statusEl.textContent.includes('Recovering')) {
                 updateStatus(modResult);
            } else if (statusEl && statusEl.textContent.includes('Recovering')) {

                logDebug("Recovery attempt finished (next message safe). Resetting status.");
                updateStatus(ModerationResult.SAFE);
            }
        }
        return finalJson;
    }


    async function handleFetchResponse(original_response, url, requestArgs) {

        const response = original_response.clone();


        if (!response.ok) {
            logDebug(`Fetch response not OK (${response.status}) for ${url}, skipping processing.`);
            return original_response;
        }

        const contentType = response.headers.get('Content-Type')?.toLowerCase() || '';
        logDebug(`Intercepted fetch response for ${url}, Content-Type: ${contentType}`);



        const conversationGetMatch = url.match(/\/rest\/app-chat\/conversation\/([a-f0-9-]+)$/i);
        if (conversationGetMatch && requestArgs?.method === 'GET') {
            logDebug(`Caching GET request options for conversation ${conversationGetMatch[1]}`);

            initCache = {
                headers: new Headers(requestArgs.headers),
                credentials: requestArgs.credentials || 'include'
            };

             if (!currentConversationId) {
                 currentConversationId = conversationGetMatch[1];
                 logDebug(`Conversation ID set from GET URL: ${currentConversationId}`);
             }
        }

         if (!currentConversationId) {
             const idFromUrl = extractConversationIdFromUrl(url);
             if (idFromUrl) {
                 currentConversationId = idFromUrl;
                 logDebug(`Conversation ID set from other URL: ${currentConversationId}`);
             }
         }




        if (contentType.includes('text/event-stream')) {
            logDebug(`Processing SSE stream for ${url}`);
            const reader = response.body.getReader();
            const stream = new ReadableStream({
                async start(controller) {
                    let buffer = '';
                    let currentEvent = { data: '', type: 'message', id: null };

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) {

                                if (buffer.trim()) {
                                     logDebug("SSE stream ended, processing final buffer:", buffer);

                                     if (buffer.startsWith('{') || buffer.startsWith('[')) {
                                          try {
                                             let json = JSON.parse(buffer);
                                             json = await processPotentialModeration(json, 'SSE-Final');
                                             controller.enqueue(encoder.encode(`data: ${JSON.stringify(json)}\n\n`));
                                          } catch(e) {
                                             logDebug("Error parsing final SSE buffer, sending as is:", e);
                                             controller.enqueue(encoder.encode(`data: ${buffer}\n\n`));
                                          }
                                      } else {
                                          controller.enqueue(encoder.encode(`data: ${buffer}\n\n`));
                                      }
                                } else if (currentEvent.data) {

                                    logDebug("SSE stream ended after data field, processing event:", currentEvent.data.substring(0,100)+"...");
                                    try {
                                        let json = JSON.parse(currentEvent.data);
                                        json = await processPotentialModeration(json, 'SSE-Event');
                                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(json)}\n\n`));
                                    } catch (e) {
                                        logDebug("Error parsing trailing SSE data, sending as is:", e);
                                        controller.enqueue(encoder.encode(`data: ${currentEvent.data}\n\n`));
                                    }
                                }
                                controller.close();
                                break;
                            }


                            buffer += decoder.decode(value, { stream: true });
                            let lines = buffer.split('\n');

                            buffer = lines.pop() || '';


                            for (const line of lines) {
                                if (line.trim() === '') {
                                    if (currentEvent.data) {
                                        logDebug("Processing SSE event data:", currentEvent.data.substring(0, 100) + '...');
                                        if (currentEvent.data.startsWith('{') || currentEvent.data.startsWith('[')) {
                                             try {
                                                let json = JSON.parse(currentEvent.data);

                                                if (json.conversation_id && !currentConversationId) {
                                                    currentConversationId = json.conversation_id;
                                                    logDebug(`Conversation ID updated from SSE data: ${currentConversationId}`);
                                                }

                                                json = await processPotentialModeration(json, 'SSE');

                                                controller.enqueue(encoder.encode(`data: ${JSON.stringify(json)}\n\n`));
                                             } catch(e) {
                                                logError("SSE JSON parse error:", e, "Data:", currentEvent.data.substring(0,200)+"...");

                                                controller.enqueue(encoder.encode(`data: ${currentEvent.data}\n\n`));
                                             }
                                        } else {
                                             logDebug("SSE data is not JSON, forwarding as is.");
                                             controller.enqueue(encoder.encode(`data: ${currentEvent.data}\n\n`));
                                        }
                                    }

                                    currentEvent = { data: '', type: 'message', id: null };
                                } else if (line.startsWith('data:')) {

                                    currentEvent.data += (currentEvent.data ? '\n' : '') + line.substring(5).trim();
                                } else if (line.startsWith('event:')) {
                                    currentEvent.type = line.substring(6).trim();
                                } else if (line.startsWith('id:')) {
                                    currentEvent.id = line.substring(3).trim();
                                } else if (line.startsWith(':')) {

                                } else {
                                    logDebug("Unknown SSE line:", line);

                                }
                            }
                        }
                    } catch (e) {
                        logError('Error reading/processing SSE stream:', e);
                        controller.error(e);
                    } finally {
                        reader.releaseLock();
                    }
                }
            });

            const newHeaders = new Headers(response.headers);
            return new Response(stream, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders
            });
        }


        if (contentType.includes('application/json')) {
             logDebug(`Processing JSON response for ${url}`);
            try {
                const text = await response.text();
                let json = JSON.parse(text);


                 if (json.conversation_id && !currentConversationId) {
                     currentConversationId = json.conversation_id;
                     logDebug(`Conversation ID updated from JSON response: ${currentConversationId}`);
                 }


                json = await processPotentialModeration(json, 'Fetch');


                const newBody = JSON.stringify(json);
                const newHeaders = new Headers(response.headers);

                if (newHeaders.has('content-length')) {
                    newHeaders.set('content-length', encoder.encode(newBody).byteLength.toString());
                }


                return new Response(newBody, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            } catch (e) {
                logError('Fetch JSON processing error:', e, 'URL:', url);

                return original_response;
            }
        }


        logDebug(`Non-SSE/JSON response for ${url}, skipping processing.`);
        return original_response;
    }



    const originalFetch = unsafeWindow.fetch;


    unsafeWindow.fetch = async function(input, init) {

        if (!demodEnabled) {
            return originalFetch.apply(this, arguments);
        }

        let url;
        let requestArgs = init || {};

        try {
            url = (input instanceof Request) ? input.url : String(input);
        } catch (e) {

            logDebug('Invalid fetch input, passing through:', input, e);
            return originalFetch.apply(this, arguments);
        }


        if (!url.includes('/rest/app-chat/')) {
            return originalFetch.apply(this, arguments);
        }


         if (requestArgs.method === 'POST') {
             logDebug(`Observing POST request: ${url}`);
             const idFromUrl = extractConversationIdFromUrl(url);
             if (idFromUrl) {
                 if (!currentConversationId) {
                     currentConversationId = idFromUrl;
                     logDebug(`Conversation ID set from POST URL: ${currentConversationId}`);
                 }

                 if (!initCache && requestArgs.headers) {
                      logDebug(`Caching headers from POST request to ${idFromUrl}`);
                      initCache = {
                          headers: new Headers(requestArgs.headers),
                          credentials: requestArgs.credentials || 'include'
                      };
                 }
             }

             return originalFetch.apply(this, arguments);
         }


        logDebug(`Intercepting fetch request: ${requestArgs.method || 'GET'} ${url}`);

        try {

            const original_response = await originalFetch.apply(this, arguments);

            return await handleFetchResponse(original_response, url, requestArgs);
        } catch (error) {

            logError(`Fetch interception failed for ${url}:`, error);

            throw error;
        }
    };


    const OriginalWebSocket = unsafeWindow.WebSocket;


    unsafeWindow.WebSocket = new Proxy(OriginalWebSocket, {
        construct(target, args) {
            const url = args[0];
            logDebug('WebSocket connection attempt:', url);


            const ws = new target(...args);



            let originalOnMessageHandler = null;


             Object.defineProperty(ws, 'onmessage', {
                configurable: true,
                enumerable: true,
                get() {
                    return originalOnMessageHandler;
                },
                async set(handler) {
                    logDebug('WebSocket onmessage handler assigned');
                    originalOnMessageHandler = handler;


                    ws.onmessageinternal = async function(event) {

                        if (!demodEnabled || typeof event.data !== 'string' || !event.data.startsWith('{')) {
                            if (originalOnMessageHandler) {
                                 try {
                                     originalOnMessageHandler.call(ws, event);
                                 } catch (e) {
                                     logError("Error in original WebSocket onmessage handler:", e);
                                 }
                            }
                            return;
                        }

                        logDebug('Intercepting WebSocket message:', event.data.substring(0, 200) + '...');
                        try {
                            let json = JSON.parse(event.data);


                            if (json.conversation_id && json.conversation_id !== currentConversationId) {
                                currentConversationId = json.conversation_id;
                                logDebug(`Conversation ID updated from WebSocket: ${currentConversationId}`);
                            }


                            const processedJson = await processPotentialModeration(json, 'WebSocket');


                             const newEvent = new MessageEvent('message', {
                                 data: JSON.stringify(processedJson),
                                 origin: event.origin,
                                 lastEventId: event.lastEventId,
                                 source: event.source,
                                 ports: event.ports,
                             });


                            if (originalOnMessageHandler) {
                                 try {
                                    originalOnMessageHandler.call(ws, newEvent);
                                 } catch (e) {
                                     logError("Error calling original WebSocket onmessage handler after modification:", e);

                                 }
                            } else {
                                logDebug("Original WebSocket onmessage handler not found when message received.");
                            }

                        } catch (e) {
                            logError('WebSocket processing error:', e, 'Data:', event.data.substring(0, 200) + '...');

                            if (originalOnMessageHandler) {
                                 try {
                                    originalOnMessageHandler.call(ws, event);
                                 } catch (eInner) {
                                     logError("Error in original WebSocket onmessage handler (fallback path):", eInner);
                                 }
                            }
                        }
                    };


                    ws.addEventListener('message', ws.onmessageinternal);
                }
             });



             const wrapHandler = (eventName) => {
                let originalHandler = null;
                Object.defineProperty(ws, `on${eventName}`, {
                    configurable: true,
                    enumerable: true,
                    get() { return originalHandler; },
                    set(handler) {
                        logDebug(`WebSocket on${eventName} handler assigned`);
                        originalHandler = handler;
                        ws.addEventListener(eventName, (event) => {
                             if (eventName === 'message') return;
                             logDebug(`WebSocket event: ${eventName}`, event);
                             if (originalHandler) {
                                 try {
                                     originalHandler.call(ws, event);
                                 } catch (e) {
                                     logError(`Error in original WebSocket on${eventName} handler:`, e);
                                 }
                             }
                        });
                    }
                });
             };

             wrapHandler('close');
             wrapHandler('error');


             ws.addEventListener('open', () => logDebug('WebSocket opened:', url));

            return ws;
        }
    });




    if (window.location.hostname !== 'grok.com') {
        console.log('[Grok DeMod] Script inactive: Intended for grok.com only. Current host:', window.location.hostname);
        return;
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupUI);
    } else {

        setupUI();
    }

    console.log('[Grok DeMod] Enhanced Script loaded. Interception is', demodEnabled ? 'ACTIVE' : 'INACTIVE', '. Debug is', debug ? 'ON' : 'OFF');

})();