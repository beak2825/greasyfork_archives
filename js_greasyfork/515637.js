// ==UserScript==
// @name         Educake ChatGPT Auto-Integration
// @version      2.1
// @description  Automatically sends Educake questions to ChatGPT API and displays responses inline (make sure to add in apikey)
// @author       frozled @ guns.lol/frozled
// @match        *://*.educake.co.uk/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.openai.com
// @license      MIT
// @namespace https://greasyfork.org/users/1390797
// @downloadURL https://update.greasyfork.org/scripts/515637/Educake%20ChatGPT%20Auto-Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/515637/Educake%20ChatGPT%20Auto-Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration object
    const config = {
        apiKey: '', // Store your API key here or use GM_getValue to get it from storage
        model: 'gpt-3.5-turbo',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions'
    };

    // Styles for the UI elements
    const styles = `
        .gpt-response {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            background-color: #f8f9fa;
        }
        .gpt-loading {
            color: #666;
            font-style: italic;
        }
        .api-key-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            width: 400px;
        }
        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        }
        .error-message {
            color: #dc3545;
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #dc3545;
            border-radius: 4px;
            background-color: #fff;
        }
        .debug-info {
            margin-top: 5px;
            font-size: 12px;
            color: #666;
            font-family: monospace;
            white-space: pre-wrap;
        }
    `;

    // Add styles to document
    function addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Create and show API key modal
    function showApiKeyModal() {
        const modalHtml = `
            <div class="modal-backdrop">
                <div class="api-key-modal">
                    <h3>Enter your OpenAI API Key</h3>
                    <p>You need to enter your OpenAI API key to use this feature. You can get one from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI's website</a>.</p>
                    <input type="password" id="api-key-input" placeholder="sk-..." style="width: 100%; margin: 10px 0; padding: 5px;">
                    <button id="save-api-key" style="padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Key</button>
                    <div id="api-key-error" style="color: red; margin-top: 10px;"></div>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);

        document.getElementById('save-api-key').addEventListener('click', () => {
            const apiKey = document.getElementById('api-key-input').value.trim();
            if (apiKey.startsWith('sk-') && apiKey.length > 20) {
                GM_setValue('openai_api_key', apiKey);
                config.apiKey = apiKey;
                modalContainer.remove();
            } else {
                document.getElementById('api-key-error').textContent = 'Please enter a valid OpenAI API key (should start with sk-)';
            }
        });
    }

    // Function to get response from ChatGPT
    async function getGPTResponse(question) {
        if (!config.apiKey) {
            config.apiKey = GM_getValue('openai_api_key', '');
            if (!config.apiKey) {
                showApiKeyModal();
                return null;
            }
        }

        return new Promise((resolve, reject) => {
            const requestData = {
                model: config.model,
                messages: [{
                    role: 'user',
                    content: question
                }],
                temperature: 0.7
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: config.apiEndpoint,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    try {
                        const responseData = JSON.parse(response.responseText);
                        console.log('API Response:', responseData); // Debug log

                        if (response.status === 200 && responseData.choices && responseData.choices[0]) {
                            resolve(responseData.choices[0].message.content);
                        } else {
                            const errorMessage = responseData.error ? responseData.error.message : 'Unknown error';
                            reject(new Error(`API Error (${response.status}): ${errorMessage}`));
                        }
                    } catch (error) {
                        console.error('Response parsing error:', error);
                        reject(new Error(`Failed to parse API response: ${error.message}`));
                    }
                },
                onerror: function(error) {
                    console.error('Request error:', error);
                    reject(new Error(`Network error: ${error.statusText || 'Failed to connect to API'}`));
                }
            });
        });
    }

    // Function to create and inject the GPT button
    function injectGPTButton() {
        if (!document.getElementById('gpt-button')) {
            const button = document.createElement('div');
            button.id = 'gpt-button';
            button.className = 'btn bg-green-80 bg-green-hover r-bg-light r-bg-light-hover r-text-dark ml-2 lh-close mb-2 mb-sm-0 align-self-start';
            button.textContent = 'Ask ChatGPT';

            button.addEventListener('click', async function() {
                const questionElements = document.querySelectorAll('.question-text');
                const question = Array.from(questionElements).map(el => el.textContent).join('\n');

                // Create response container
                let responseContainer = document.querySelector('.gpt-response');
                if (!responseContainer) {
                    responseContainer = document.createElement('div');
                    responseContainer.className = 'gpt-response';
                    button.parentElement.appendChild(responseContainer);
                }

                responseContainer.innerHTML = '<div class="gpt-loading">Getting response from ChatGPT...</div>';

                try {
                    const response = await getGPTResponse(question);
                    if (response) {
                        responseContainer.innerHTML = `
                            <strong>ChatGPT Response:</strong>
                            <div style="margin-top: 8px;">${response.replace(/\n/g, '<br>')}</div>
                        `;
                    }
                } catch (error) {
                    responseContainer.innerHTML = `
                        <div class="error-message">
                            Error: ${error.message}
                            <div class="debug-info">
                                Status: ${error.status || 'N/A'}
                                Time: ${new Date().toISOString()}
                            </div>
                        </div>
                    `;

                    // If the error is related to authentication, show the API key modal
                    if (error.message.includes('401') || error.message.includes('authentication')) {
                        config.apiKey = ''; // Clear the invalid API key
                        GM_setValue('openai_api_key', ''); // Clear stored key
                        showApiKeyModal();
                    }
                }
            });

            const existingDiv = document.querySelector('.column');
            existingDiv.insertBefore(button, existingDiv.lastElementChild);
        }
    }

    // Remove paste restrictions
    function removePasteRestrictions() {
        const elements = document.querySelectorAll('.answer-text');
        elements.forEach(element => {
            element.removeAttribute('onpaste');
        });
    }

    // Initialize
    function init() {
        addStyles();
        setInterval(injectGPTButton, 500);
        setInterval(removePasteRestrictions, 500);
    }

    // Start the script
    init();
})();