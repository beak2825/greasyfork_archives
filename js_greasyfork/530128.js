// ==UserScript==
// @name         Persona Impersonator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Impersonation. (RYW-Style)
// @author       Grok 3 (xAI)
// @match        https://character.ai/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @setting      openrouter_key    {type: 'text', default: '', description: 'Your OpenRouter API Key'}
// @setting      openrouter_model  {type: 'text', default: 'openai/gpt-3.5-turbo', description: 'OpenRouter Model (e.g., openai/gpt-3.5-turbo)'}
// @downloadURL https://update.greasyfork.org/scripts/530128/Persona%20Impersonator.user.js
// @updateURL https://update.greasyfork.org/scripts/530128/Persona%20Impersonator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ### Helper Functions for Fetching Conversation History

    /** Wraps GM_xmlhttpRequest in a Promise for easier async handling */
    function GM_xmlhttpRequestPromise(details) {
        return new Promise((resolve, reject) => {
            details.onload = function(response) {
                resolve(response);
            };
            details.onerror = function() {
                reject(new Error('GM_xmlhttpRequest failed'));
            };
            GM_xmlhttpRequest(details);
        });
    }

    /** Retrieves the access token from a meta tag */
    function getAccessToken() {
        const meta = document.querySelector('meta[cai_token]');
        return meta ? meta.getAttribute('cai_token') : null;
    }

    /** Extracts the character ID from the URL */
    function getCharId() {
        const path = window.location.pathname.split('/');
        if (path[1] === 'chat' && path[2]) {
            return path[2];
        }
        return null;
    }

    /** Fetches the current conversation ID for the character */
    async function getCurrentConverId() {
        const AccessToken = getAccessToken();
        const charId = getCharId();
        if (!AccessToken || !charId) return null;

        try {
            const res = await GM_xmlhttpRequestPromise({
                method: "GET",
                url: `https://neo.character.ai/chats/recent/${charId}`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "authorization": AccessToken
                }
            });

            if (res.status === 200) {
                const data = JSON.parse(res.responseText);
                if (data.chats && data.chats.length > 0) {
                    return data.chats[0].chat_id;
                }
            }
            return null;
        } catch (error) {
            console.error('Error fetching conversation ID:', error);
            return null;
        }
    }

    /** Fetches all messages in the conversation, handling pagination with custom tagging */
    async function fetchMessagesChat2({ AccessToken, converExtId, nextToken = null, turns = [] }) {
        let url = `https://neo.character.ai/turns/${converExtId}/`;
        if (nextToken) url += `?next_token=${nextToken}`;

        try {
            const res = await GM_xmlhttpRequestPromise({
                method: "GET",
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "authorization": AccessToken
                }
            });

            if (res.status === 200) {
                const data = JSON.parse(res.responseText);
                turns = [...turns, ...data.turns];
                if (data.meta.next_token == null) {
                    const simplifiedChat = turns.map(msg => {
                        const primary = msg.candidates.find(c => c.candidate_id === msg.primary_candidate_id);
                        const [alternative] = msg.candidates.slice(-1);
                        const chosen = primary ?? alternative;
                        const senderName = msg.author.name || (msg.author.is_human ? 'Human' : 'Axel');
                        const tag = msg.author.is_human ? `user:${senderName}` : 'assistant';
                        return {
                            tag: tag,
                            message: chosen?.raw_content || "[Message broken]"
                        };
                    });
                    simplifiedChat.reverse(); // Oldest first
                    return simplifiedChat;
                } else {
                    return fetchMessagesChat2({ AccessToken, converExtId, nextToken: data.meta.next_token, turns });
                }
            } else {
                throw new Error(`Fetch failed: ${res.status}`);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    // ### Core Functions

    /** Waits for DOM to be ready */
    function waitForDOM(callback) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
            const observer = new MutationObserver(() => {
                if (document.getElementId('__next')) {
                    observer.disconnect();
                    callback();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    /** Fetches OpenRouter models and pricing */
    function fetchOpenRouterModels(apiKey, callback) {
        if (!apiKey) {
            callback(null, 'Please enter your OpenRouter API key to fetch models.');
            return;
        }

        console.log('Fetching OpenRouter models...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://openrouter.ai/api/v1/models',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    callback(data.data, null);
                } else {
                    callback(null, `Error: ${response.status} - ${response.responseText}`);
                }
            },
            onerror: function() {
                callback(null, 'Failed to connect to OpenRouter API.');
            }
        });
    }

    /** Fetches Google Gemini models using the Generative Language API */
    function fetchGeminiModels(apiKey, callback) {
        if (!apiKey) {
            callback(null, 'Please enter your Google Gemini API key to fetch models.');
            return;
        }

        console.log('Fetching Google Gemini models...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const models = data.models.filter(model =>
                        model.name.startsWith('models/gemini-1.5-') ||
                        model.name.startsWith('models/gemini-2.0-') ||
                        model.name.startsWith('models/aqa') ||
                        model.name.startsWith('models/gemini-2.5-') ||
                        model.name.startsWith('models/gemini-embedding-') ||
                        model.name.startsWith('models/gemini-exp-') ||
                        model.name.startsWith('models/gemini-ultra') ||
                        model.name.startsWith('models/gemma-')
                    ).map(model => ({
                        id: model.name.split('/').pop(),
                        name: model.displayName || model.name.split('/').pop(),
                        pricing: { prompt: 'N/A', completion: 'N/A' }
                    }));
                    callback(models, null);
                } else {
                    console.error('Failed to fetch Gemini models:', response.status, response.responseText);
                    // Fallback to hardcoded list if API call fails
                    const fallbackModels = [
                        { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-1.0-pro-001', name: 'Gemini 1.0 Pro 001', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro 002', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-1.5-pro-001', name: 'Gemini 1.5 Pro 001', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash 002', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-1.5-flash-001', name: 'Gemini 1.5 Flash 001', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-2.0-pro-vision', name: 'Gemini 2.0 Pro Vision', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-2.0-nano', name: 'Gemini 2.0 Nano', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-exp-0827', name: 'Gemini Exp 0827', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemini-exp-0924', name: 'Gemini Exp 0924', pricing: { prompt: 'N/A', completion: 'N/A' } },
                        { id: 'gemma-3-27b-it', name: 'Gemma 3 27B IT', pricing: { prompt: 'N/A', completion: 'N/A' } }
                    ];
                    callback(fallbackModels, `Error: ${response.status} - ${response.responseText}`);
                }
            },
            onerror: function() {
                console.error('Network error fetching Gemini models');
                const fallbackModels = [
                    { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-1.0-pro-001', name: 'Gemini 1.0 Pro 001', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro 002', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-1.5-pro-001', name: 'Gemini 1.5 Pro 001', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash 002', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-1.5-flash-001', name: 'Gemini 1.5 Flash 001', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-2.0-pro-vision', name: 'Gemini 2.0 Pro Vision', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-2.0-nano', name: 'Gemini 2.0 Nano', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-exp-0827', name: 'Gemini Exp 0827', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemini-exp-0924', name: 'Gemini Exp 0924', pricing: { prompt: 'N/A', completion: 'N/A' } },
                    { id: 'gemma-3-27b-it', name: 'Gemma 3 27B IT', pricing: { prompt: 'N/A', completion: 'N/A' } }
                ];
                callback(fallbackModels, 'Failed to connect to Google Gemini API.');
            }
        });
    }

    /** Generates text using OpenRouter API */
    function generateOpenRouterText(apiKey, model, messages, output, copyBtn) {
        const payload = {
            model: model,
            messages: messages.map(msg => ({
                role: msg.tag.startsWith('user:') ? 'user' : msg.tag,
                content: msg.message
            }))
        };

        console.log('Sending request to OpenRouter:', payload);
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://openrouter.ai/api/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const generatedText = data.choices[0].message.content.trim();
                    output.value = generatedText;
                    copyBtn.style.display = 'block';
                    console.log('Generated:', generatedText);
                } else {
                    output.value = `Error: ${response.status} - ${response.responseText}`;
                    copyBtn.style.display = 'none';
                }
            },
            onerror: function() {
                output.value = 'Failed to connect to OpenRouter API.';
                copyBtn.style.display = 'none';
            }
        });
    }

    /** Generates text using Google Gemini API with temperature */
    function generateGeminiText(apiKey, model, messages, temperature, output, copyBtn) {
        const payload = {
            contents: [{
                parts: messages.map(msg => ({
                    text: `${msg.tag}: ${msg.message}`
                }))
            }],
            generationConfig: {
                temperature: parseFloat(temperature) || 1.0,
                maxOutputTokens: 2048
            }
        };

        console.log('Sending request to Google Gemini:', payload);
        console.log(model, payload);
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const generatedText = data.candidates[0].content.parts[0].text.trim();
                    output.value = generatedText;
                    copyBtn.style.display = 'block';
                    console.log('Generated:', generatedText);
                } else {
                    output.value = `Error: ${response.status} - ${response.responseText}`;
                    copyBtn.style.display = 'none';
                }
            },
            onerror: function() {
                output.value = 'Failed to connect to Google Gemini API.';
                copyBtn.style.display = 'none';
            }
        });
    }

    // ### UI Creation

    function createUI() {
        const storedPersona = localStorage.getItem('cai_persona') || '';
        const storedApiSelection = localStorage.getItem('cai_api_selection') || 'openrouter';
        const storedOpenRouterKey = GM_getValue('openrouter_key', '');
        const storedGeminiKey = localStorage.getItem('cai_gemini_key') || '';
        const storedModel = GM_getValue('openrouter_model', 'openai/gpt-3.5-turbo');
        const storedInput = localStorage.getItem('cai_input') || '';
        const storedTemperature = localStorage.getItem('cai_gemini_temperature') || '1.0';

        // Inject CSS
        const style = document.createElement('style');
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
            .ptrk_main {
                position: fixed !important;
                display: flex;
                flex-direction: column;
                margin: 0;
                z-index: 10000 !important;
                min-width: 300px;
                background-color: rgba(33, 37, 41, 0.95);
                right: 0;
                top: 0;
                height: 100vh;
                padding: 18px;
                color: white;
                font-family: "Noto Sans", sans-serif;
                font-size: 13px;
                transition: transform 0.3s ease;
                width: 470px;
                box-sizing: border-box;
                box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
                overflow-y: auto;
            }
            .ptrk_main.ptrk_hidden {
                transform: translateX(100%);
            }
            .ptrk_toggle_btn {
                position: fixed !important;
                top: 105px;
                right: 10px;
                z-index: 10001;
                background-color: rgba(33, 37, 41, 0.95);
                color: white;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-family: "Noto Sans", sans-serif;
                font-size: 14px;
                transition: background-color 0.3s;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
            }
            .ptrk_toggle_btn:hover {
                background-color: rgba(50, 55, 60, 0.95);
            }
            .ptrk_main fieldset {
                border: 1px solid rgb(59, 59, 63);
                border-radius: 3px;
                padding: 10px;
                margin-bottom: 10px;
            }
            .ptrk_main legend {
                font-size: 12px;
                padding: 0 5px;
            }
            .ptrk_main input, .ptrk_main textarea, .ptrk_main select {
                width: 100%;
                color: #d1d5db;
                padding: 10px;
                margin: 5px 0;
                box-sizing: border-box;
                font-size: 12px;
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid #8e8e8e;
                border-radius: 3px;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            }
            .ptrk_main select {
                cursor: pointer;
                background: rgba(0, 0, 0, 0.2) url('data:image/svg+xml;utf8,<svg fill="%23d1d5db" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
            }
            .ptrk_main select::-ms-expand {
                display: none;
            }
            .ptrk_main select option {
                color: #d1d5db;
                background: rgba(33, 37, 41, 0.95);
            }
            .ptrk_main textarea {
                resize: vertical;
            }
            .ptrk_main textarea[readonly] {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.1);
            }
            .ptrk_main .abtn {
                cursor: pointer;
                padding: 6px 12px;
                border-radius: 3px;
                font-weight: bold;
                margin: 2px;
                background: rgb(95, 99, 101);
                text-align: center;
                transition: background 0.2s;
            }
            .ptrk_main .abtn:hover {
                background: rgb(118, 123, 125);
            }
            .ptrk_main .midbtns {
                display: flex;
                justify-content: center;
                margin-top: 5px;
            }
            .ptrk_models_table {
                max-height: 200px;
                overflow-y: auto;
                margin-top: 5px;
            }
            .ptrk_models_table table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                color: #d1d5db;
                background: rgba(0, 0, 0, 0.5);
            }
            .ptrk_models_table th, .ptrk_models_table td {
                border: 1px solid rgb(45, 45, 48);
                padding: 5px;
                text-align: left;
            }
            .ptrk_models_table th {
                background: rgba(0, 0, 0, 0.6);
            }
        `;
        document.head.appendChild(style);

        // Toggle button
        const toggleBtn = document.createElement('div');
        toggleBtn.classList.add('ptrk_toggle_btn');
        toggleBtn.textContent = 'Hide UI';
        document.body.appendChild(toggleBtn);

        // Main UI container
        const mainDom = document.createElement('div');
        mainDom.classList.add('ptrk_main');
        mainDom.innerHTML = `
            <fieldset>
                <legend>API Selection</legend>
                <select id="api-selection">
                    <option value="openrouter" ${storedApiSelection === 'openrouter' ? 'selected' : ''}>OpenRouter</option>
                    <option value="gemini" ${storedApiSelection === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                </select>
            </fieldset>
            <fieldset id="openrouter-key-field" style="${storedApiSelection === 'openrouter' ? '' : 'display: none;'}">
                <legend>OpenRouter API Key</legend>
                <input id="api-key" type="text" placeholder="Enter your OpenRouter API key..." value="${storedOpenRouterKey}">
            </fieldset>
            <fieldset id="gemini-key-field" style="${storedApiSelection === 'gemini' ? '' : 'display: none;'}">
                <legend>Google Gemini API Key</legend>
                <input id="gemini-key" type="text" placeholder="Enter your Gemini API key..." value="${storedGeminiKey}">
            </fieldset>
            <fieldset id="gemini-temp-field" style="${storedApiSelection === 'gemini' ? '' : 'display: none;'}">
                <legend>Temperature (0.0 - 2.0)</legend>
                <input id="gemini-temperature" type="number" step="0.1" min="0" max="2" placeholder="Enter temperature (default 1.0)" value="${storedTemperature}">
            </fieldset>
            <fieldset>
                <legend>Model</legend>
                <select id="model-select">
                    <option value="${storedModel}">${storedModel} (default)</option>
                </select>
            </fieldset>
            <fieldset>
                <legend>Available Models</legend>
                <div class="ptrk_models_table">
                    <table>
                        <thead>
                            <tr>
                                <th>Model Name</th>
                                <th>Input ($/1k)</th>
                                <th>Output ($/1k)</th>
                            </tr>
                        </thead>
                        <tbody id="models-table-body">
                            <tr><td colspan="3">Loading models...</td></tr>
                        </tbody>
                    </table>
                </div>
            </fieldset>
            <fieldset>
                <legend>Persona</legend>
                <textarea id="persona-input" placeholder="Enter your persona here...">${storedPersona}</textarea>
            </fieldset>
            <fieldset>
                <legend>Input</legend>
                <textarea id="user-input" placeholder="Enter message to impersonate...">${storedInput}</textarea>
                <div class="midbtns">
                    <div class="abtn" data-tag="generate">Generate Text</div>
                    <div class="abtn" data-tag="generate-next">Generate Next Response</div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Output</legend>
                <textarea id="output-text" readonly></textarea>
                <div class="midbtns">
                    <div class="abtn" data-tag="copy" style="display: none;">Copy to Clipboard</div>
                </div>
            </fieldset>
        `;
        document.body.appendChild(mainDom);

        // UI elements
        const apiSelection = mainDom.querySelector('#api-selection');
        const openRouterKeyField = mainDom.querySelector('#openrouter-key-field');
        const geminiKeyField = mainDom.querySelector('#gemini-key-field');
        const geminiTempField = mainDom.querySelector('#gemini-temp-field');
        const apiKeyInput = mainDom.querySelector('#api-key');
        const geminiKeyInput = mainDom.querySelector('#gemini-key');
        const geminiTempInput = mainDom.querySelector('#gemini-temperature');
        const modelSelect = mainDom.querySelector('#model-select');
        const modelsTableBody = mainDom.querySelector('#models-table-body');
        const personaInput = mainDom.querySelector('#persona-input');
        const input = mainDom.querySelector('#user-input');
        const generateBtn = mainDom.querySelector('[data-tag="generate"]');
        const generateNextBtn = mainDom.querySelector('[data-tag="generate-next"]');
        const output = mainDom.querySelector('#output-text');
        const copyBtn = mainDom.querySelector('[data-tag="copy"]');

        // Toggle UI visibility
        let isHidden = false;
        toggleBtn.addEventListener('click', () => {
            isHidden = !isHidden;
            mainDom.classList.toggle('ptrk_hidden', isHidden);
            toggleBtn.textContent = isHidden ? 'Show UI' : 'Hide UI';
        });

        // API selection change
        apiSelection.addEventListener('change', () => {
            const selection = apiSelection.value;
            localStorage.setItem('cai_api_selection', selection);
            if (selection === 'openrouter') {
                openRouterKeyField.style.display = '';
                geminiKeyField.style.display = 'none';
                geminiTempField.style.display = 'none';
                updateModels('openrouter');
            } else if (selection === 'gemini') {
                openRouterKeyField.style.display = 'none';
                geminiKeyField.style.display = '';
                geminiTempField.style.display = '';
                updateModels('gemini');
            }
        });

        // Save OpenRouter API key
        apiKeyInput.addEventListener('change', () => {
            const apiKey = apiKeyInput.value.trim();
            GM_setValue('openrouter_key', apiKey);
            if (apiSelection.value === 'openrouter') {
                updateModels('openrouter');
            }
        });

        // Save Gemini API key
        geminiKeyInput.addEventListener('change', () => {
            const apiKey = geminiKeyInput.value.trim();
            localStorage.setItem('cai_gemini_key', apiKey);
            if (apiSelection.value === 'gemini') {
                updateModels('gemini');
            }
        });

        // Save Gemini temperature
        geminiTempInput.addEventListener('change', () => {
            const temperature = geminiTempInput.value.trim();
            localStorage.setItem('cai_gemini_temperature', temperature);
        });

        // Save selected model
        modelSelect.addEventListener('change', () => {
            const model = modelSelect.value;
            GM_setValue('openrouter_model', model);
        });

        // Save persona
        personaInput.addEventListener('change', () => {
            const persona = personaInput.value.trim();
            localStorage.setItem('cai_persona', persona);
        });

        // Save input
        input.addEventListener('change', () => {
            const userInput = input.value.trim();
            localStorage.setItem('cai_input', userInput);
        });

        // Generate text from manual input
        generateBtn.addEventListener('click', () => {
            const selection = apiSelection.value;
            const openRouterKey = apiKeyInput.value.trim();
            const geminiKey = geminiKeyInput.value.trim();
            const model = modelSelect.value;
            const persona = personaInput.value.trim();
            const userInput = input.value.trim();
            const temperature = geminiTempInput.value.trim();

            if (selection === 'openrouter' && !openRouterKey) {
                output.value = 'Please enter your OpenRouter API key.';
                copyBtn.style.display = 'none';
                return;
            } else if (selection === 'gemini' && !geminiKey) {
                output.value = 'Please enter your Google Gemini API key.';
                copyBtn.style.display = 'none';
                return;
            }
            if (!persona) {
                output.value = 'Please enter a persona.';
                copyBtn.style.display = 'none';
                return;
            }
            if (!userInput) {
                output.value = 'Please enter a message.';
                copyBtn.style.display = 'none';
                return;
            }

            const messages = [
                { tag: 'system', message: persona },
                { tag: 'user', message: userInput }
            ];

            if (selection === 'openrouter') {
                generateOpenRouterText(openRouterKey, model, messages, output, copyBtn);
            } else if (selection === 'gemini') {
                generateGeminiText(geminiKey, model, messages, temperature, output, copyBtn);
            }
        });

        // Generate next response from conversation history with new input
        generateNextBtn.addEventListener('click', async () => {
            const selection = apiSelection.value;
            const openRouterKey = apiKeyInput.value.trim();
            const geminiKey = geminiKeyInput.value.trim();
            const model = modelSelect.value;
            const persona = personaInput.value.trim();
            const userInput = input.value.trim();
            const temperature = geminiTempInput.value.trim();

            if (selection === 'openrouter' && !openRouterKey) {
                output.value = 'Please enter your OpenRouter API key.';
                copyBtn.style.display = 'none';
                return;
            } else if (selection === 'gemini' && !geminiKey) {
                output.value = 'Please enter your Google Gemini API key.';
                copyBtn.style.display = 'none';
                return;
            }
            if (!persona) {
                output.value = 'Please enter a persona.';
                copyBtn.style.display = 'none';
                return;
            }
            if (!userInput) {
                output.value = 'Please enter a message.';
                copyBtn.style.display = 'none';
                return;
            }

            const AccessToken = getAccessToken();
            if (!AccessToken) {
                output.value = 'Could not retrieve access token. Are you logged in?';
                copyBtn.style.display = 'none';
                return;
            }

            const charId = getCharId();
            if (!charId) {
                output.value = 'Could not find character ID. Are you on a chat page?';
                copyBtn.style.display = 'none';
                return;
            }

            const converId = await getCurrentConverId();
            if (!converId) {
                output.value = 'Could not find current conversation ID.';
                copyBtn.style.display = 'none';
                return;
            }

            output.value = 'Fetching conversation history...';
            try {
                const chatData = await fetchMessagesChat2({ AccessToken, converExtId: converId });
                const messages = [
                    { tag: 'system', message: persona },
                    ...(chatData || []).map(msg => ({
                        tag: msg.tag,
                        message: msg.message
                    })),
                    { tag: 'user', message: userInput }
                ];

                if (selection === 'openrouter') {
                    generateOpenRouterText(openRouterKey, model, messages, output, copyBtn);
                } else if (selection === 'gemini') {
                    generateGeminiText(geminiKey, model, messages, temperature, output, copyBtn);
                }
            } catch (error) {
                output.value = `Error: ${error.message}`;
                copyBtn.style.display = 'none';
            }
        });

        // Copy output to clipboard
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(output.value).then(() => {
                alert('Text copied to clipboard!');
            });
        });

        // Update models list and dropdown based on API selection
        function updateModels(api) {
            if (api === 'openrouter') {
                const apiKey = apiKeyInput.value.trim();
                fetchOpenRouterModels(apiKey, (models, error) => {
                    if (error) {
                        modelsTableBody.innerHTML = `<tr><td colspan="3">${error}</td></tr>`;
                        modelSelect.innerHTML = `<option value="${storedModel}">${storedModel} (default)</option>`;
                        return;
                    }

                    modelSelect.innerHTML = models.map(model => {
                        const selected = model.id === storedModel ? 'selected' : '';
                        return `<option value="${model.id}" ${selected}>${model.name}</option>`;
                    }).join('');

                    modelsTableBody.innerHTML = models.map(model => {
                        const inputCost = model.pricing?.prompt ? (parseFloat(model.pricing.prompt) * 1000).toFixed(4) : 'N/A';
                        const outputCost = model.pricing?.completion ? (parseFloat(model.pricing.completion) * 1000).toFixed(4) : 'N/A';
                        return `
                            <tr>
                                <td>${model.name}</td>
                                <td>${inputCost}</td>
                                <td>${outputCost}</td>
                            </tr>
                        `;
                    }).join('');
                });
            } else if (api === 'gemini') {
                const apiKey = geminiKeyInput.value.trim();
                fetchGeminiModels(apiKey, (models, error) => {
                    if (error) {
                        modelsTableBody.innerHTML = `<tr><td colspan="3">${error}</td></tr>`;
                        modelSelect.innerHTML = models.map(model => {
                            const selected = model.id === storedModel ? 'selected' : '';
                            return `<option value="${model.id}" ${selected}>${model.name}</option>`;
                        }).join('');
                    } else {
                        modelSelect.innerHTML = models.map(model => {
                            const selected = model.id === storedModel ? 'selected' : '';
                            return `<option value="${model.id}" ${selected}>${model.name}</option>`;
                        }).join('');

                        modelsTableBody.innerHTML = models.map(model => {
                            return `
                                <tr>
                                    <td>${model.name}</td>
                                    <td>${model.pricing.prompt}</td>
                                    <td>${model.pricing.completion}</td>
                                </tr>
                            `;
                        }).join('');
                    }
                });
            }
        }

        // Initial models fetch based on stored selection
        updateModels(storedApiSelection);
    }

    // ### Run Script
    waitForDOM(() => {
        console.log('DOM ready, initializing UI');
        createUI();
    });
})();