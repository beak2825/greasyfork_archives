// ==UserScript==
// @name         Bodega Bot ChatGPT Addon
// @icon         https://media1.giphy.com/avatars/FeedMe1219/aBrdzB77IQ5c.gif
// @version      0.1
// @description  Addon for Bodega Bot to utilize ChatGPT API
// @author       Bort
// @run-at       document-start
// @match        https://tinychat.com/room/*
// @match        https://tinychat.com/*
// @exclude      https://tinychat.com/settings/*
// @exclude      https://tinychat.com/subscription/*
// @exclude      https://tinychat.com/promote/*
// @exclude      https://tinychat.com/coins/*
// @exclude      https://tinychat.com/gifts*
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/1024912
// @downloadURL https://update.greasyfork.org/scripts/502269/Bodega%20Bot%20ChatGPT%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/502269/Bodega%20Bot%20ChatGPT%20Addon.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const apiKey = 'sk-your-api-key-here'; // Replace this with your API key

    async function callChatGPT(messages, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    'model': 'gpt-4', // Use the appropriate model
                    'messages': messages,
                    ...options
                }),
                onload: (response) => {
                    const responseData = JSON.parse(response.responseText);
                    if (response.status === 200 && responseData.choices) {
                        resolve(responseData.choices[0].message.content);
                    } else {
                        reject(new Error('API Error: ' + response.statusText));
                    }
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }

    async function main() {
        try {
            const messages = [
                { 'role': 'user', 'content': 'Hello, ChatGPT!' }
            ];
            const options = {
                'temperature': 0.7,
                'max_tokens': 150
            };
            const responseText = await callChatGPT(messages, options);
            console.log(`ChatGPT response: ${responseText}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    main();
})();
