// ==UserScript==
// @name NEW
// @namespace http://tampermonkey.net/
// @version 13
// @description Select AI model, recalculates auth headers. UI enhancements + status indicator. Uses unsafeWindow.
// @author saros
// @match https://www.aiuncensored.info/*
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/536825/NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/536825/NEW.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[Model Selector] Script starting (v2.4 - Status Indicator)...');

    // --- Configuration ---
    const AVAILABLE_MODELS = [
        "hermes3-405b",
    ];
    const STORAGE_KEY = 'selectedChatModel_AIUncensored_v2';
    const API_ENDPOINT_PATH = '/api/chat';

    // --- Get the initially selected model (or default) ---
    let selectedModel = GM_getValue(STORAGE_KEY, AVAILABLE_MODELS[0]);

    // --- Status Indicator Variables ---
    let statusTextElement;
    let statusIconElement;
    let uiCreated = false;

    // --- Replicated Header Generation Function (based on site's tF) ---
    const generateAuthHeaders = async (requestBodyObject) => {
        const timestamp = Math.floor(Date.now() / 1e3).toString();
        const bodyString = JSON.stringify(requestBodyObject);
        const payload = `${timestamp}${bodyString}`;
        const encoder = new TextEncoder();
        
        // IMPORTANT: This key should be kept secret and ideally managed securely.
        // If the server rejects the request, this key has likely changed on the website.
        const secretKey = encoder.encode("your-super-secret-key-replace-in-production"); 
        
        const key = await crypto.subtle.importKey(
            "raw", 
            secretKey, 
            { name: "HMAC", hash: "SHA-256" }, 
            false, 
            ["sign"]
        );
        
        const data = encoder.encode(payload);
        const signatureBuffer = await crypto.subtle.sign(
            "HMAC", 
            key, 
            data
        );

        // Convert the signature buffer to a hex string for the header and for logging
        const signatureHex = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
        
        // ====================================================================
        // --- DEBUGGING OUTPUT ADDED HERE ---
        // These lines will show the raw data used to generate the signature 
        // and the resulting signature itself in the browser console (F12).
        // ====================================================================
        console.log(`[Model Selector DEBUG] Payload (Time+Body): ${payload}`);
        console.log(`[Model Selector DEBUG] Generated X-Signature: ${signatureHex}`);
        // ====================================================================

        return {
            "X-API-Key": "62852b00cb9e44bca86f0ec7e7455dc6",
            "X-Timestamp": timestamp,
            "X-Signature": signatureHex,
            "Content-Type": "application/json",
        };
    };

    // --- Fetch Interceptor ---
    unsafeWindow.fetch = new Proxy(unsafeWindow.fetch, {
        apply: async function(target, thisArg, args) {
            const url = args[0];
            const options = args[1];

            if (url.endsWith(API_ENDPOINT_PATH) && options && options.method === 'POST') {
                try {
                    const originalBody = options.body;
                    if (!originalBody) {
                        console.error('[Model Selector] POST request to /api/chat has no body.');
                        return Reflect.apply(target, thisArg, args);
                    }
                    
                    // The body is a ReadableStream or a string. We must consume it.
                    let bodyString;
                    if (typeof originalBody === 'string') {
                        bodyString = originalBody;
                    } else if (originalBody instanceof ReadableStream) {
                        bodyString = await new Response(originalBody).text();
                        // IMPORTANT: The stream is now consumed. We must re-create it later.
                    } else {
                        // Fallback for other object types, though chat requests are usually JSON strings
                        bodyString = JSON.stringify(originalBody);
                    }
                    
                    const bodyData = JSON.parse(bodyString);
                    
                    console.log(`[Model Selector] Intercepted request. Original model: ${bodyData.model}`);
                    
                    // 1. Model Override
                    const oldModel = bodyData.model;
                    if (bodyData.model !== selectedModel) {
                        bodyData.model = selectedModel;
                        updateStatusDisplay('modified', selectedModel, oldModel);
                        console.log(`[Model Selector] Model changed from ${oldModel} to ${selectedModel}.`);
                    } else {
                         updateStatusDisplay('selected', selectedModel);
                    }

                    // 2. Recalculate Headers
                    const newHeaders = await generateAuthHeaders(bodyData);
                    
                    // 3. Update Request Options
                    // Re-JSON.stringify the modified body and update options
                    const newBodyString = JSON.stringify(bodyData);
                    options.body = newBodyString;
                    options.headers = { ...options.headers, ...newHeaders };

                    // Set status to pending/working just before sending
                    updateStatusDisplay('working', selectedModel);

                } catch (error) {
                    console.error('[Model Selector] Error during request modification:', error);
                    updateStatusDisplay('error', selectedModel);
                    // Revert to original fetch behavior on error
                    return Reflect.apply(target, thisArg, args);
                }
            }
            
            // Allow the original request to proceed
            const responsePromise = Reflect.apply(target, thisArg, args);

            // Handle response to update status
            responsePromise.then(response => {
                // Only update status if the chat API was targeted
                if (response.url.endsWith(API_ENDPOINT_PATH) && response.ok) {
                    updateStatusDisplay('selected', selectedModel);
                } else if (response.url.endsWith(API_ENDPOINT_PATH) && !response.ok) {
                    // Check for specific rejection status (e.g., 401 Unauthorized)
                    updateStatusDisplay('fail', selectedModel, `(${response.status})`);
                }
            }).catch(error => {
                console.error('[Model Selector] Fetch Promise Error:', error);
                updateStatusDisplay('error', selectedModel);
            });


            return responsePromise;
        }
    });

    // --- UI/CSS Logic (Retained from original script) ---

    // Function to safely inject CSS
    const addCss = () => {
        GM_addStyle(`
            .model-selector-container {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .model-selector-dropdown {
                background-color: #2c2c2c;
                color: #e0e0e0;
                border: 1px solid #555;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 14px;
                cursor: pointer;
                outline: none;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
            }
            .model-selector-dropdown:hover {
                border-color: #888;
                background-color: #383838;
            }
            .model-selector-dropdown:focus {
                border-color: #c15a17;
                box-shadow: 0 0 5px rgba(193, 90, 23, 0.5);
            }
            .model-status-indicator {
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 14px;
                color: #e0e0e0;
                background-color: #444;
                transition: all 0.3s ease;
                border: 1px solid #555;
                min-width: 120px;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
            }
            .status-icon {
                font-size: 14px;
                line-height: 1;
            }
            /* Status Specific Colors */
            .status-selected { border-color: #4caf50; background-color: #3a4a3a; } /* Green: Active/Selected */
            .status-modified { border-color: #2196f3; background-color: #2a3d54; } /* Blue: Model changed in request */
            .status-working { border-color: #ff9800; background-color: #5b4815; } /* Orange: Request pending */
            .status-fail { border-color: #f44336; background-color: #553333; } /* Red: Request failed/rejected */
            .status-error { border-color: #f44336; background-color: #553333; } /* Red: Script error */
        `);
    };

    const updateStatusDisplay = (status, model, extra = '') => {
        if (!uiCreated) return;
        let icon = '✨';
        let text = `Model: ${model}`;
        let className = `status-${status}`;
        
        switch (status) {
            case 'selected': 
                icon = '✅'; 
                text = `Active: ${model}`; 
                break;
            case 'modified': 
                icon = '🔄'; 
                text = `MODIFIED: ${model}`; 
                break;
            case 'working': 
                icon = '...'; 
                text = `Sending: ${model}`; 
                break;
            case 'fail': 
                icon = '❌'; 
                text = `Failed ${extra}: ${model}`; 
                break;
            case 'error': 
                icon = '🛑'; 
                text = `Error! ${model}`; 
                break;
        }

        statusIconElement.textContent = icon;
        statusTextElement.textContent = text;
        const indicator = statusTextElement.closest('.model-status-indicator');
        indicator.className = `model-status-indicator ${className}`;
    };

    const createEnhancedUI = () => {
        if (uiCreated) return;
        uiCreated = true;
        addCss();

        const container = document.createElement('div');
        container.className = 'model-selector-container';

        // 1. Status Indicator
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'model-status-indicator status-selected';
        statusIconElement = document.createElement('span');
        statusIconElement.className = 'status-icon';
        statusTextElement = document.createElement('span');
        
        statusIndicator.appendChild(statusIconElement);
        statusIndicator.appendChild(statusTextElement);
        container.appendChild(statusIndicator);

        // 2. Dropdown Selector
        const select = document.createElement('select');
        select.className = 'model-selector-dropdown';

        AVAILABLE_MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            select.appendChild(option);
        });

        // Set initial selection
        select.value = selectedModel;
        updateStatusDisplay('selected', selectedModel); 
        container.appendChild(select);

        document.body.appendChild(container);

        // --- Event Listener ---
        select.addEventListener('change', () => {
            selectedModel = select.value;
            GM_setValue(STORAGE_KEY, selectedModel);
            console.log(`[Model Selector] Model selection changed to: ${selectedModel}`);

            updateStatusDisplay('selected', selectedModel); // Update status for selection

            // Visual feedback for selection change
            select.style.transition = 'none'; // Temporarily disable transition for immediate effect
            select.style.borderColor = '#4caf50';
            select.style.backgroundColor = '#3a4a3a'; // Slightly greenish background
            setTimeout(() => {
                // Restore transitions and original styles
                select.style.transition = 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease';
                select.style.borderColor = '#555'; // Or its original focused/unfocused color
                select.style.backgroundColor = '#2c2c2c';
            }, 500);
        });
    }

    // --- Initialize UI ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createEnhancedUI);
    } else {
        createEnhancedUI();
    }

})();