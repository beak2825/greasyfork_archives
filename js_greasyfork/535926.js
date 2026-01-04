// ==UserScript==
// @name         Canvas ChatGPT BETTER (OpenRouter)
// @namespace    http://tampermonkey.net/
// @version      1.8.1_OpenRouter_ModUI
// @description  Adds an AI assistant sidepanel using OpenRouter to Instructure Canvas pages.
// @author       Original by Riley Campbell, AI modifications, OpenRouter mod, UI Mod by patmarvs
// @match        *.instructure.com/*
// @license      https://opensource.org/license/bsd-3-clause/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535926/Canvas%20ChatGPT%20BETTER%20%28OpenRouter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535926/Canvas%20ChatGPT%20BETTER%20%28OpenRouter%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function scriptLog(message) {
        console.log(`[Canvas AI Sidepanel] ${message}`);
    }

    scriptLog('Script starting... (OCR.space Edition, ModUI v1.9.1)');

    if (window.location.href.includes("conversations")) {
        scriptLog('On a "conversations" page, exiting script.');
        return;
    }

    const getStoredValue = async (key, defaultValue) => {
        let value = await GM_getValue(key, defaultValue);
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value === undefined ? defaultValue : value;
    };

    const setStoredValue = async (key, value) => {
        await GM_setValue(key, value.toString());
    };

    let currentAIprompt = await getStoredValue('AIprompt', '');
    if (currentAIprompt === null || currentAIprompt === undefined || typeof currentAIprompt !== 'string') {
        currentAIprompt = '';
    }

    window.defaultMessage = { "role": "system", "content": currentAIprompt };
    window.AImessages = (currentAIprompt && currentAIprompt.trim() !== "") ? [JSON.parse(JSON.stringify(window.defaultMessage))] : [];
    let chatVisible = await getStoredValue('chatVisible', false);
    if (typeof chatVisible !== 'boolean') { chatVisible = (chatVisible === 'false'); }
    window.hotkeySetting = await getStoredValue('chatToggleHotkey', 'Control+Shift+X');

    window.renderMessages = function() {
        scriptLog('Rendering messages...');
        let container = document.getElementById('ai-assistant-container');
        if (!container) {
            scriptLog('Error: ai-assistant-container not found for rendering messages.');
            return;
        }
        container.innerHTML = '';

        const messagesToRender = window.AImessages.filter(message => {
            return !(message.role === "system" && (!message.content || message.content.trim() === ""));
        });

        for (let i = 0; i < messagesToRender.length; i++) {
            let message = messagesToRender[i];
            let originalIndex = window.AImessages.findIndex(m => m === message); // Still needed for data-message-id if any other feature uses it

            const messageRow = document.createElement('table');
            messageRow.style.width = '100%';
            const roleText = message.role.charAt(0).toUpperCase() + message.role.slice(1);
            const escapedContent = message.content ? message.content.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";

            // MODIFIED: Removed Edit button generation
            let headerHTML = `<p class="ai-assistant-role">${roleText}: </p>`;

            messageRow.innerHTML = `
                <tr>
                    <th style="text-align: left; vertical-align: top; width: auto;">${headerHTML}</th>
                    <td data-message-id="${originalIndex}" style="white-space: pre-wrap; word-break: break-word;">${escapedContent.replace(/\n/g, '<br>')}</td>
                </tr>
            `;
            container.appendChild(messageRow);

            if (i < messagesToRender.length - 1) {
                 container.appendChild(document.createElement('hr'));
            }
        }
        // MODIFIED: Removed event listener setup for edit buttons
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
     };

    window.sendMessage = async function() { /* ... (unchanged: OpenRouter chat logic) ... */
        scriptLog('Attempting to send message to OpenRouter...');
        const chatContainer = document.getElementById('ai-assistant-container'); // Keep for error display
        const myTextArea = document.getElementById('ai-assistant-myTextArea');
        const apiKey = await getStoredValue('openaiAPIKey', '');
        const aiModel = await getStoredValue('AImodel', 'openai/gpt-3.5-turbo');

        if (!apiKey) {
            alert('OpenRouter API Key is not set. Please set it in the Settings panel (field is labeled OpenAI API Key).');
            scriptLog('API Key missing.');
            return;
        }

        if (!myTextArea || !myTextArea.value.trim()) {
            scriptLog('Message input is empty.');
            return;
        }

        const loadingGifId = 'ai-assistant-loading-gif';
        const existingLoadingGif = document.getElementById(loadingGifId);
        if (chatContainer && !existingLoadingGif) { // chatContainer might be null if UI not fully ready
            chatContainer.insertAdjacentHTML('beforeend', `<div id="${loadingGifId}" style="text-align:center;"><img style="display: inline-block; width: 25px; margin: 8px auto;" src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="Loading..."></div>`);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }


        let userMessage = { "role": "user", "content": myTextArea.value };
        window.AImessages.push(userMessage);
        const userMessageContentForRestore = myTextArea.value; // Save for potential retry
        myTextArea.value = '';
        window.renderMessages();

        let messagesForAPI = [];
        const memoryEnabled = await getStoredValue('AImemory', false);
        window.defaultMessage.content = document.getElementById('ai-assistant-systemPrompt').value;

        if (memoryEnabled) {
            messagesForAPI = JSON.parse(JSON.stringify(window.AImessages));
            if (window.defaultMessage.content && window.defaultMessage.content.trim() !== "") {
                const systemMsgIndex = messagesForAPI.findIndex(m => m.role === 'system');
                if (systemMsgIndex > -1) {
                    messagesForAPI[systemMsgIndex].content = window.defaultMessage.content;
                } else {
                    messagesForAPI.unshift(JSON.parse(JSON.stringify(window.defaultMessage)));
                }
            } else {
                 messagesForAPI = messagesForAPI.filter(m => m.role !== 'system');
            }
        } else {
            if (window.defaultMessage.content && window.defaultMessage.content.trim() !== "") {
                messagesForAPI.push(JSON.parse(JSON.stringify(window.defaultMessage)));
            }
            messagesForAPI.push(userMessage);
        }

        messagesForAPI = messagesForAPI.filter(m => m.content && m.content.trim() !== "");

        if (messagesForAPI.length === 0) {
            scriptLog('No messages to send to API after filtering.');
            document.getElementById(loadingGifId)?.remove();
            window.AImessages.push({role: "assistant", content: "Internal error: No content to send."});
            window.renderMessages();
            return;
        }

        scriptLog(`Sending to OpenRouter API with model ${aiModel}. Memory: ${memoryEnabled}. Messages count: ${messagesForAPI.length}.`);

        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://openrouter.ai/api/v1/chat/completions',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            data: JSON.stringify({ "model": aiModel, "messages": messagesForAPI, "temperature": 1.0 }),
            onload: function(response) {
                document.getElementById(loadingGifId)?.remove();
                try {
                    if (response.status >= 200 && response.status < 300) {
                        let result = JSON.parse(response.responseText);
                        if (result.choices && result.choices.length > 0 && result.choices[0].message) {
                            window.AImessages.push(result.choices[0].message);
                        } else {
                            if (result.error && result.error.message) {
                                throw new Error(`API Error: ${result.error.message} (Type: ${result.error.type}, Code: ${result.error.code || 'N/A'})`);
                            }
                            throw new Error("Invalid response structure from API.");
                        }
                    } else {
                        let errorInfo = `API Error ${response.status}: ${response.statusText}`;
                        try {
                            const errData = JSON.parse(response.responseText);
                            if (errData.error && errData.error.message) {
                                errorInfo += ` - ${errData.error.message}`;
                                if(errData.error.type) errorInfo += ` (Type: ${errData.error.type})`;
                                if(errData.error.code) errorInfo += ` (Code: ${errData.error.code})`;
                            }
                        } catch (e) { /* Stick with statusText */ }
                        throw new Error(errorInfo);
                    }
                } catch (e) {
                    scriptLog(`Error processing response: ${e.message}`);
                    const errorP = document.createElement('p');
                    errorP.style.color = 'red';
                    errorP.style.padding = '5px';
                    errorP.innerHTML = `<strong>Error:</strong> ${e.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")} <button class="ai-assistant-retry-button">Retry</button>`;
                    const currentChatContainer = document.getElementById('ai-assistant-container');
                    if(currentChatContainer) {
                        currentChatContainer.appendChild(errorP);
                        currentChatContainer.scrollTop = currentChatContainer.scrollHeight;
                    }
                    errorP.querySelector('.ai-assistant-retry-button')?.addEventListener('click', () => {
                        const currentMyTextArea = document.getElementById('ai-assistant-myTextArea');
                        currentMyTextArea.value = userMessageContentForRestore;
                        errorP.remove();
                        scriptLog("Retry button clicked.");
                        currentMyTextArea.focus();
                    });
                } finally {
                    if (! (document.querySelector('#ai-assistant-container p[style*="color: red;"]')) ) {
                        window.renderMessages();
                    }
                     const currentChatContainer = document.getElementById('ai-assistant-container');
                     if (currentChatContainer) currentChatContainer.scrollTop = currentChatContainer.scrollHeight;
                }
            },
            onerror: function(response) {
                document.getElementById(loadingGifId)?.remove();
                const errorText = `Network Error: ${response.statusText || 'Could not connect'}.`;
                scriptLog(`Request Error: ${errorText}`);
                const errorP = document.createElement('p');
                errorP.style.color = 'red';
                errorP.style.padding = '5px';
                errorP.innerHTML = `<strong>${errorText}</strong>`;
                const currentChatContainer = document.getElementById('ai-assistant-container');
                if(currentChatContainer) {
                     currentChatContainer.appendChild(errorP);
                     currentChatContainer.scrollTop = currentChatContainer.scrollHeight;
                }
            }
        });
    };
    window.populateModels = async function() { /* ... (unchanged: OpenRouter model population) ... */
        scriptLog('Populating models from OpenRouter...');
        const modelsSelect = document.getElementById('ai-assistant-models');
        const apiKey = await getStoredValue('openaiAPIKey', '');

        if (!apiKey) {
            scriptLog('API Key missing for populating models.');
            if (modelsSelect) modelsSelect.innerHTML = '<option value="">Set API Key (labeled OpenAI API Key) to load models</option>';
            return;
        }
        if (!modelsSelect) { scriptLog('Models select element not found.'); return; }

        modelsSelect.innerHTML = '<option value="">Loading models from OpenRouter...</option>';
        const commonModels = [
            'openai/gpt-4o', 'openai/gpt-4-turbo', 'anthropic/claude-3-opus', 'anthropic/claude-3-sonnet',
            'anthropic/claude-3-haiku', 'google/gemini-pro-1.5', 'google/gemini-flash-1.5', 'mistralai/mistral-large',
        ];

        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://openrouter.ai/api/v1/models',
            headers: { "Authorization": `Bearer ${apiKey}` },
            onload: async function(response) {
                try {
                    modelsSelect.innerHTML = '';
                    if (response.status >= 200 && response.status < 300) {
                        const options = JSON.parse(response.responseText);
                        let availableModels = [];
                        if (options.data) {
                            options.data.forEach(item => { availableModels.push(item.id); });
                        }
                        availableModels.sort((a, b) => a.localeCompare(b));
                        let effectiveCommonModels = commonModels.filter(m => availableModels.includes(m));
                        let finalModelList = [...new Set([...effectiveCommonModels, ...availableModels])];

                        if (finalModelList.length === 0) {
                            modelsSelect.innerHTML = '<option value="">No models found on OpenRouter.</option>';
                        } else {
                            finalModelList.forEach(modelId => {
                                let element = document.createElement("option");
                                element.value = modelId;
                                element.innerHTML = modelId;
                                modelsSelect.appendChild(element);
                            });
                            const storedModel = await getStoredValue('AImodel', 'openai/gpt-3.5-turbo');
                            if (finalModelList.includes(storedModel)) {
                                modelsSelect.value = storedModel;
                            } else if (finalModelList.length > 0) {
                                modelsSelect.value = finalModelList[0];
                                await setStoredValue('AImodel', finalModelList[0]);
                            }
                        }
                    } else {
                        let errorDetail = `Failed: ${response.status} ${response.statusText}`;
                        try {
                            const errData = JSON.parse(response.responseText);
                            if (errData.error && errData.error.message) {
                                errorDetail = `API Error: ${errData.error.message.substring(0,50)}...`;
                            }
                        } catch (e) { /* ignore */ }
                        modelsSelect.innerHTML = `<option value="">${errorDetail}</option>`;
                        scriptLog(`Failed to fetch models: ${response.status} ${response.responseText}`);
                    }
                } catch (e) {
                    scriptLog(`Error parsing models response: ${e.message}`);
                    modelsSelect.innerHTML = '<option value="">Error parsing models data</option>';
                }
            },
            onerror: function() {
                scriptLog('Network error fetching models.');
                if (modelsSelect) modelsSelect.innerHTML = '<option value="">Network error</option>';
            }
        });
    };

    async function handleOCRSnip() { /* ... (unchanged: OCR.space logic) ... */
        scriptLog("OCR Snip initiated (OCR.space).");
        const myTextArea = document.getElementById('ai-assistant-myTextArea');
        if (!myTextArea) return;

        const ocrApiKey = await getStoredValue('ocrSpaceApiKey', '');
        if (!ocrApiKey) {
            showTemporaryNotification("OCR.space API Key not set in Settings.", "error", 5000);
            alert("Please set your OCR.space API Key in the AI Sidepanel settings to use the OCR feature. A free key 'helloworld' can be used for limited testing.");
            return;
        }

        let originalText = myTextArea.value;
        myTextArea.value = "Preparing OCR... Select screen area to capture...";
        myTextArea.disabled = true;
        showTemporaryNotification("Select screen area for OCR...", "info", 5000);

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen", cursor: "always" }, audio: false });

            const videoEl = document.createElement('video');
            videoEl.style.display = 'none';
            document.body.appendChild(videoEl);

            await new Promise((resolvePlay, rejectPlay) => {
                videoEl.onloadedmetadata = () => {
                    videoEl.play().then(resolvePlay).catch(err => {
                        scriptLog("Video play error: " + err);
                        rejectPlay(new Error("Could not play screen capture stream."));
                    });
                };
                videoEl.srcObject = stream;
            });

            if (!videoEl.videoWidth || !videoEl.videoHeight) {
                await new Promise(r => setTimeout(r, 200));
                 if (!videoEl.videoWidth || !videoEl.videoHeight) {
                    stream.getTracks().forEach(track => track.stop());
                    videoEl.remove();
                    throw new Error("Could not get screen capture dimensions after delay.");
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = videoEl.videoWidth;
            canvas.height = videoEl.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

            stream.getTracks().forEach(track => track.stop());
            videoEl.remove();

            const base64Image = canvas.toDataURL('image/png');
            myTextArea.value = "Processing OCR with OCR.space...";
            showTemporaryNotification("Sending image to OCR.space...", "info", 10000);


            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.ocr.space/parse/image",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: `apikey=${encodeURIComponent(ocrApiKey)}&base64Image=${encodeURIComponent(base64Image)}&language=eng&isOverlayRequired=false&detectOrientation=true`,
                onload: function(response) {
                    myTextArea.disabled = false;
                    myTextArea.focus();
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.IsErroredOnProcessing) {
                            scriptLog(`OCR.space Error: ${result.ErrorMessage.join(", ")}`);
                            showTemporaryNotification(`OCR.space Error: ${result.ErrorMessage[0]}`, "error", 7000);
                            myTextArea.value = originalText;
                        } else if (result.ParsedResults && result.ParsedResults.length > 0) {
                            const parsedText = result.ParsedResults[0].ParsedText.trim();
                            if (parsedText) {
                                myTextArea.value = originalText + (originalText && parsedText ? "\n" : "") + parsedText;
                                showTemporaryNotification("OCR complete! Text added.", "success");
                            } else {
                                showTemporaryNotification("OCR complete, but no text found.", "info");
                                myTextArea.value = originalText;
                            }
                        } else {
                            showTemporaryNotification("OCR completed, but no results returned.", "info");
                            myTextArea.value = originalText;
                        }
                    } catch (e) {
                        scriptLog("Error parsing OCR.space response: " + e);
                        showTemporaryNotification("Failed to parse OCR response.", "error");
                        myTextArea.value = originalText;
                    }
                },
                onerror: function(responseDetails) {
                    scriptLog("OCR.space request failed: " + responseDetails.statusText);
                    myTextArea.disabled = false;
                    myTextArea.focus();
                    myTextArea.value = originalText;
                    showTemporaryNotification("OCR request failed. Check network/console.", "error");
                }
            });

        } catch (err) {
            scriptLog(`OCR Snip Error: ${err.message || err}`);
            myTextArea.disabled = false;
            myTextArea.focus();
            myTextArea.value = originalText;
            if (err.name === "NotAllowedError" || (err.message && err.message.toLowerCase().includes("permission denied"))) {
                showTemporaryNotification("Screen capture permission denied.", "error");
            } else {
                showTemporaryNotification(`OCR setup failed: ${err.message.substring(0, 50)}...`, "error", 5000);
            }
        }
    }
    function showTemporaryNotification(message, type = "info", duration = 3000) { /* ... (unchanged) ... */
        const notificationArea = document.getElementById('ai-assistant-notification-area');
        if (!notificationArea) {
            scriptLog("Notification area not found, logging: " + message);
            return;
        }
        const existingSameType = notificationArea.querySelector(`.ai-assistant-notification.${type}`);
        if(existingSameType && existingSameType.textContent.startsWith(message.substring(0,10))) {
            existingSameType.remove();
        }

        const notification = document.createElement('div');
        notification.className = `ai-assistant-notification ${type}`;
        notification.textContent = message;
        notificationArea.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    function setupUI() {
        scriptLog('Setting up UI...');

        const accentGrey = '#6A737C';
        const accentGreyHover = '#525960';
        const lightGreyBg = '#f0f0f0';
        const lighterGreyBg = '#f8f9fa';
        const focusRingColor = 'rgba(106, 115, 124, .5)';

        const css = `
            #ai-assistant-box { position: fixed; bottom: 15px; right: 15px; width: 450px; height: 30vh; background-color: #fff; box-shadow: 0 5px 20px rgba(0,0,0,0.25); border-radius: 16px; display: flex; flex-direction: column; z-index: 10001; border: 1px solid #ccc; font-family: Arial, sans-serif; font-size: 14px; transform: translateY(0); opacity: 1; transition: transform 0.3s ease-out, opacity 0.3s ease-out; overflow: hidden; }
            #ai-assistant-box.hidden { transform: translateY(calc(100% + 30px)); opacity: 0; pointer-events: none; }
            #ai-assistant-notification-area { position: absolute; top: 0; left: 0; right: 0; z-index: 10002; padding-top: 10px; pointer-events: none; }
            .ai-assistant-notification { padding: 8px 15px; margin: 0 15px 5px 15px; border-radius: 4px; color: white; text-align: center; font-size: 0.9em; box-shadow: 0 2px 4px rgba(0,0,0,0.1); opacity: 0.95; pointer-events: auto; }
            .ai-assistant-notification.success { background-color: #28a745; }
            .ai-assistant-notification.error { background-color: #dc3545; }
            .ai-assistant-notification.info { background-color: ${accentGrey}; }
            #ai-assistant-box .ai-assistant-main-content { padding: 10px 15px 15px 15px; display: flex; flex-direction: column; flex-grow:1; overflow:hidden; background: #fdfdfd; position:relative; }
            #ai-assistant-container { flex-grow: 1; overflow-y: auto; padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px; min-height: 50px; background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; scroll-behavior: smooth;}
            #ai-assistant-container table { width: 100%; margin-bottom: 8px; border-collapse: collapse; }
            #ai-assistant-container th { font-weight: bold; text-align: left; vertical-align:top; padding: 4px 8px 4px 2px; color: #333; }
            #ai-assistant-container td { padding: 4px 2px 4px 8px; color: #555; }
            #ai-assistant-container hr { border: 0; border-top: 1px solid #f0f0f0; margin: 8px 0; }
            #ai-assistant-myTextArea { display: block; width: calc(100% - 22px); min-height:40px; max-height: 100px; resize: vertical; margin: 0 auto 10px auto; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size:1em; }
            #ai-assistant-myTextArea:focus { border-color: ${accentGrey}; box-shadow: 0 0 0 0.2rem ${focusRingColor}; }
            #ai-assistant-box .ai-assistant-button { background-color: ${accentGrey}; color: white; border: none; padding: 8px 10px; margin-bottom: 8px; /* Added margin for buttons in settings */ border-radius: 5px; cursor: pointer; text-align: center; font-size:0.9em; /* Restored font size */ transition: background-color 0.2s ease; display: block; width: 100%; box-sizing: border-box; }
            #ai-assistant-box .ai-assistant-button:hover { background-color: ${accentGreyHover}; }
            /* #ai-assistant-button-bar REMOVED */
            .ai-assistant-settings-toggle { display: block; font-weight: bold; font-size: 1em; text-align: center; padding: 10px; color: ${accentGreyHover}; background: ${lightGreyBg}; cursor: pointer; border-top: 1px solid #ddd; transition: background-color 0.2s ease-out; margin:0; border-radius: 0 0 15px 15px; }
            .ai-assistant-settings-toggle:hover { background-color: #e2e6ea; }
            .ai-assistant-collapsible-content { max-height: 0px; overflow-y: auto; transition: max-height .35s ease-in-out; background: ${lighterGreyBg}; border-top:1px solid #ddd;}
            .ai-assistant-collapsible-content .content-inner { padding: 15px; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; }
            #ai-assistant-settings-checkbox:checked ~ .ai-assistant-collapsible-content { max-height: 500px; /* Increased max-height for settings */ }
            #ai-assistant-settings-checkbox { display: none; }
            .ai-assistant-switch-container { display: flex; align-items: center; margin-bottom:12px; }
            .ai-assistant-switch { position: relative; display: inline-block; width: 44px; height: 24px; margin-right: 10px; }
            .ai-assistant-switch input { opacity: 0; width: 0; height: 0; }
            .ai-assistant-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
            .ai-assistant-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .ai-assistant-slider { background-color: ${accentGrey}; }
            input:checked + .ai-assistant-slider:before { transform: translateX(20px); }
            #ai-assistant-systemPrompt { display: block; width: calc(100% - 22px); min-height: 50px; max-height: 100px; resize: vertical; margin: 5px auto 10px auto; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size:0.9em; }
            #ai-assistant-apiKey, #ai-assistant-ocrApiKey { display: inline-block; width: calc(60% - 10px); margin-right:5px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size:0.9em; box-sizing: border-box; }
            #ai-assistant-setAPIKeyButton, #ai-assistant-setOcrApiKeyButton { display: inline-block; width: calc(40% - 10px); padding: 8px 0px; box-sizing: border-box;}
            /* Removed Edit Button CSS */
            .ai-assistant-role { display: inline; margin-right: 5px; font-weight:bold;}
            #ai-assistant-models { margin-bottom:10px; display:block; width:100%; padding:8px; border-radius:4px; border:1px solid #ccc; font-size:0.9em; box-sizing: border-box;}
            .ai-assistant-label { display: block; margin-bottom: 5px; font-weight: bold; font-size:0.9em; }
            .ai-assistant-retry-button { background-color: ${accentGrey}; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.9em; margin-left: 10px;}
            .ai-assistant-retry-button:hover { background-color: ${accentGreyHover};}
            #ai-assistant-hotkey-input-container { margin-top: 10px; margin-bottom: 5px; }
            #ai-assistant-hotkey-input { width: calc(60% - 10px); margin-right:5px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size:0.9em; box-sizing: border-box;}
            #ai-assistant-setHotkeyButton {display: inline-block; width: calc(40% - 10px); padding: 8px 0px; box-sizing: border-box;}
            #ai-assistant-toggle-button { position: fixed; bottom: 20px; right: 20px; z-index: 10000; background-color: ${accentGrey}; color: white; border:none; border-radius: 50%; width: 50px; height: 50px; font-size: 24px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease, transform 0.2s ease; }
            #ai-assistant-toggle-button:hover { background-color: ${accentGreyHover}; transform: scale(1.1); }
            #ai-assistant-toggle-button.hidden { display: none !important; }
            .api-key-group { margin-bottom: 10px; }
            .settings-action-buttons-group { margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px; } /* Group for action buttons in settings */
        `;
        GM_addStyle(css);

        const chatToggleBtn = document.createElement('button');
        chatToggleBtn.id = 'ai-assistant-toggle-button';
        chatToggleBtn.innerHTML = '&#128172;';
        chatToggleBtn.title = `Toggle AI Assistant (Hotkey: ${window.hotkeySetting})`;
        if (!chatVisible) {
            chatToggleBtn.classList.add('hidden');
        }
        document.body.appendChild(chatToggleBtn);

        const elem = document.createElement('div');
        elem.id = 'ai-assistant-box';
        if (!chatVisible) {
            elem.classList.add('hidden');
        } else {
            elem.classList.remove('hidden');
            chatToggleBtn.innerHTML = '&#10005;';
        }

        // MODIFIED: HTML structure for main content and settings
        elem.innerHTML = `
            <div class="ai-assistant-main-content">
                <div id="ai-assistant-notification-area"></div>
                <div id="ai-assistant-container"></div>
                <textarea id="ai-assistant-myTextArea" placeholder="Ask AI Assistant..."></textarea>
                </div>
            <input id="ai-assistant-settings-checkbox" type="checkbox">
            <label for="ai-assistant-settings-checkbox" class="ai-assistant-settings-toggle">Settings <span class="settings-arrow">&#9660;</span></label>
            <div class="ai-assistant-collapsible-content">
                <div class="content-inner">
                    <div class="ai-assistant-switch-container">
                        <label class="ai-assistant-switch">
                            <input id="ai-assistant-memory" type="checkbox">
                            <span class="ai-assistant-slider"></span>
                        </label>
                        <label for="ai-assistant-memory" style="font-size:0.9em;">Enable chat memory</label>
                    </div>
                    <label for="ai-assistant-models" class="ai-assistant-label">Chat Model (OpenRouter):</label>
                    <select name="models" id="ai-assistant-models"></select>
                    <div class="api-key-group">
                        <label for="ai-assistant-apiKey" class="ai-assistant-label">OpenRouter API Key:</label>
                        <div>
                            <input id="ai-assistant-apiKey" placeholder="OpenRouter Key (sk-or-...)" type="password">
                            <button class="ai-assistant-button" id="ai-assistant-setAPIKeyButton">Set Chat Key</button>
                        </div>
                    </div>
                    <div class="api-key-group">
                        <label for="ai-assistant-ocrApiKey" class="ai-assistant-label">OCR.space API Key:</label>
                        <div>
                            <input id="ai-assistant-ocrApiKey" placeholder="OCR.space Key" type="password">
                            <button class="ai-assistant-button" id="ai-assistant-setOcrApiKeyButton">Set OCR Key</button>
                        </div>
                    </div>
                    <label for="ai-assistant-systemPrompt" class="ai-assistant-label">System Prompt (Instructions for AI):</label>
                    <textarea id="ai-assistant-systemPrompt" placeholder="e.g., Act as a helpful teaching assistant."></textarea>
                    <div id="ai-assistant-hotkey-input-container">
                         <label for="ai-assistant-hotkey-input" class="ai-assistant-label">Toggle Hotkey (e.g. Control+Shift+X):</label>
                         <div>
                             <input id="ai-assistant-hotkey-input" type="text" placeholder="Example: Control+Shift+M">
                             <button class="ai-assistant-button" id="ai-assistant-setHotkeyButton">Set Hotkey</button>
                         </div>
                    </div>
                    <div class="settings-action-buttons-group"> <button class="ai-assistant-button" id="ai-assistant-ocrButton" title="Capture screen area for OCR">OCR Screen</button>
                        <button class="ai-assistant-button" id="ai-assistant-clearHistoryButton">Clear Chat & Apply Prompt</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(elem);
        scriptLog('UI elements injected.');

        const settingsCheckbox = document.getElementById('ai-assistant-settings-checkbox');
        const settingsArrow = elem.querySelector('.settings-arrow');
        settingsCheckbox.addEventListener('change', () => {
            if (settingsArrow) settingsArrow.innerHTML = settingsCheckbox.checked ? '&#9650;' : '&#9660;';
        });

        function toggleChatVisibility(show) { /* ... (unchanged) ... */
            const chatBox = document.getElementById('ai-assistant-box');
            const floatingToggleButton = document.getElementById('ai-assistant-toggle-button');

            if (typeof show === 'boolean') {
                chatVisible = show;
            } else {
                chatVisible = !chatVisible;
            }
            setStoredValue('chatVisible', chatVisible);

            if (chatVisible) {
                chatBox.classList.remove('hidden');
                if (floatingToggleButton) floatingToggleButton.classList.remove('hidden');
                if (floatingToggleButton) floatingToggleButton.innerHTML = '&#10005;';
                document.getElementById('ai-assistant-myTextArea')?.focus();
            } else {
                chatBox.classList.add('hidden');
                if (floatingToggleButton ) {
                     floatingToggleButton.innerHTML = '&#128172;';
                }
            }
        }
        window.toggleChatVisibility = toggleChatVisibility;

        chatToggleBtn.addEventListener('click', () => toggleChatVisibility());
        // Removed listener for header 'X' button as header is gone

        (async () => { /* ... (Event listeners setup, send button listener removed) ... */
            document.getElementById('ai-assistant-systemPrompt').value = await getStoredValue('AIprompt', '');
            document.getElementById('ai-assistant-memory').checked = await getStoredValue('AImemory', false);
            const currentHotkeyDisplay = await getStoredValue('chatToggleHotkey', 'Control+Shift+X');
            document.getElementById('ai-assistant-hotkey-input').value = currentHotkeyDisplay;

            const updateButtonTitles = (hotkey) => {
                const ftb = document.getElementById('ai-assistant-toggle-button');
                if (ftb) { ftb.title = `Toggle AI Assistant (Hotkey: ${hotkey})`;}
            };
            updateButtonTitles(currentHotkeyDisplay);

            await window.populateModels();
            const storedModel = await getStoredValue('AImodel', 'openai/gpt-3.5-turbo');
            const modelSelect = document.getElementById('ai-assistant-models');
            if (modelSelect && modelSelect.options.length > 0) {
                if (Array.from(modelSelect.options).some(opt => opt.value === storedModel)) {
                    modelSelect.value = storedModel;
                } else if (modelSelect.options[0] && modelSelect.options[0].value) {
                    modelSelect.value = modelSelect.options[0].value;
                    await setStoredValue('AImodel', modelSelect.options[0].value);
                }
            }

            document.getElementById('ai-assistant-myTextArea').addEventListener("keydown", async function(event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    await window.sendMessage();
                }
            });
            // MODIFIED: Send button listener removed
            document.getElementById('ai-assistant-ocrButton').addEventListener('click', handleOCRSnip);
            document.getElementById('ai-assistant-clearHistoryButton').addEventListener('click', async () => {
                scriptLog('Clear history clicked.');
                const newSystemPromptText = document.getElementById('ai-assistant-systemPrompt').value;
                window.defaultMessage.content = newSystemPromptText;
                await setStoredValue('AIprompt', newSystemPromptText);
                if (newSystemPromptText && newSystemPromptText.trim() !== "") {
                    window.AImessages = [JSON.parse(JSON.stringify(window.defaultMessage))];
                } else {
                    window.AImessages = [];
                }
                window.renderMessages();
                scriptLog('History cleared.');
            });


            document.getElementById('ai-assistant-setAPIKeyButton').onclick = async () => {
                const apiKeyInput = document.getElementById('ai-assistant-apiKey');
                if (apiKeyInput && apiKeyInput.value.trim()) {
                    await setStoredValue('openaiAPIKey', apiKeyInput.value.trim());
                    apiKeyInput.value = '';
                    scriptLog('OpenRouter API Key set.');
                    alert('OpenRouter API Key saved! Model list will refresh.');
                    await window.populateModels();
                } else {
                    alert('Please enter a valid OpenRouter API key.');
                }
            };
            document.getElementById('ai-assistant-setOcrApiKeyButton').onclick = async () => {
                const ocrApiKeyInput = document.getElementById('ai-assistant-ocrApiKey');
                if (ocrApiKeyInput && ocrApiKeyInput.value.trim()) {
                    await setStoredValue('ocrSpaceApiKey', ocrApiKeyInput.value.trim());
                    ocrApiKeyInput.value = '';
                    scriptLog('OCR.space API Key set.');
                    alert('OCR.space API Key saved!');
                } else {
                    alert('Please enter a valid OCR.space API key.');
                }
            };


            document.getElementById('ai-assistant-setHotkeyButton').onclick = async () => {
                const hotkeyInput = document.getElementById('ai-assistant-hotkey-input');
                const newHotkey = hotkeyInput.value.trim();
                if (newHotkey) {
                    if (newHotkey.split('+').length > 0) {
                        await setStoredValue('chatToggleHotkey', newHotkey);
                        window.hotkeySetting = newHotkey;
                        updateButtonTitles(newHotkey);
                        alert(`Hotkey set to: ${newHotkey}.`);
                        scriptLog(`Hotkey updated: ${newHotkey}`);
                    } else {
                        alert('Invalid hotkey format.');
                    }
                } else {
                    alert('Please enter a hotkey.');
                }
            };

            let settingsSaveTimeout;
            const scheduleSaveSettings = async (eventSourceId = null) => {
                clearTimeout(settingsSaveTimeout);
                settingsSaveTimeout = setTimeout(async () => {
                    await setStoredValue('AImemory', document.getElementById('ai-assistant-memory').checked);
                    const modelSel = document.getElementById('ai-assistant-models');
                    if (modelSel && modelSel.value) await setStoredValue('AImodel', modelSel.value);

                    const systemPromptText = document.getElementById('ai-assistant-systemPrompt').value;
                    if (eventSourceId === 'ai-assistant-systemPrompt' || eventSourceId === null) {
                        await setStoredValue('AIprompt', systemPromptText);
                        window.defaultMessage.content = systemPromptText;
                        const systemMsgIndex = window.AImessages.findIndex(m => m.role === 'system');
                        if (systemPromptText && systemPromptText.trim() !== "") {
                            if (systemMsgIndex > -1) window.AImessages[systemMsgIndex].content = systemPromptText;
                            else window.AImessages.unshift(JSON.parse(JSON.stringify(window.defaultMessage)));
                        } else {
                            if (systemMsgIndex > -1) window.AImessages.splice(systemMsgIndex, 1);
                        }
                        if (eventSourceId === 'ai-assistant-systemPrompt') window.renderMessages();
                    }
                    scriptLog('Settings auto-saved (excluding API keys set by button).');
                }, 1000);
            };

            document.getElementById('ai-assistant-memory').addEventListener('change', () => scheduleSaveSettings('ai-assistant-memory'));
            document.getElementById('ai-assistant-models').addEventListener('change', () => scheduleSaveSettings('ai-assistant-models'));
            document.getElementById('ai-assistant-systemPrompt').addEventListener('input', () => scheduleSaveSettings('ai-assistant-systemPrompt'));

            document.addEventListener('keydown', (e) => { /* ... (unchanged) ... */
                if (!window.hotkeySetting || typeof window.hotkeySetting !== 'string') return;
                const keys = window.hotkeySetting.toUpperCase().split('+');
                const mainKey = keys.pop();
                let ctrl = keys.includes('CONTROL') || keys.includes('CTRL');
                let shift = keys.includes('SHIFT');
                let alt = keys.includes('ALT');
                let meta = keys.includes('META') || keys.includes('COMMAND');

                if ((ctrl === e.ctrlKey) && (shift === e.shiftKey) && (alt === e.altKey) && (meta === e.metaKey) && (e.key.toUpperCase() === mainKey)) {
                    const activeEl = document.activeElement;
                    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable) && activeEl.id !== 'ai-assistant-myTextArea') {
                        if (['ai-assistant-systemPrompt', 'ai-assistant-apiKey', 'ai-assistant-ocrApiKey', 'ai-assistant-hotkey-input'].includes(activeEl.id)) return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    toggleChatVisibility();
                    scriptLog(`Hotkey "${window.hotkeySetting}" pressed.`);
                }
            });

            if (chatVisible) {
                 window.renderMessages();
            }
            scriptLog('Initial render logic applied. Event listeners attached.');
        })();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupUI);
    } else {
        setupUI();
    }

    scriptLog('Script initialization phase complete.');

})();