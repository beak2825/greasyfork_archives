// ==UserScript==
// @name         Gemini AI Assistant
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Integrate Gemini AI into any webpage
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535821/Gemini%20AI%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/535821/Gemini%20AI%20Assistant.meta.js
// ==/UserScript==

/* MIT License
Copyright (c) 2024 Your Name
[Full MIT License text here] */

(function() {
    'use strict';

    // 🔥 REPLACE WITH YOUR API KEY (Exposed here for testing ONLY - revoke later!)
    const API_KEY = 'AIzaSyCITHMzAPG5WE9WogHmYQXVTKrHrqexe2c';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    // Force UI styling
    GM_addStyle(`
        #gemini-ui {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 300px !important;
            background: white !important;
            border: 1px solid #ddd !important;
            padding: 10px !important;
            z-index: 2147483647 !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.2) !important;
            font-family: Arial, sans-serif !important;
        }
        #gemini-response {
            height: 200px !important;
            overflow-y: auto !important;
            margin: 10px 0 !important;
            border: 1px solid #eee !important;
            padding: 8px !important;
        }
        #gemini-input {
            width: 100% !important;
            margin-bottom: 8px !important;
            padding: 6px !important;
            resize: vertical !important;
        }
        #gemini-submit {
            width: 100% !important;
            padding: 8px !important;
            background: #4285f4 !important;
            color: white !important;
            border: none !important;
            cursor: pointer !important;
        }
    `);

    // Inject UI after page loads
    window.addEventListener('DOMContentLoaded', () => {
        const ui = `
            <div id="gemini-ui">
                <h3 style="margin:0 0 10px 0; font-size:16px">Gemini Assistant</h3>
                <div id="gemini-response"></div>
                <textarea id="gemini-input" rows="3" placeholder="Ask Gemini..."></textarea>
                <button id="gemini-submit">Send</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', ui);

        // Handle API requests
        document.getElementById('gemini-submit').addEventListener('click', function() {
            const prompt = document.getElementById('gemini-input').value.trim();
            if (!prompt) return;

            // Clear input
            document.getElementById('gemini-input').value = '';

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${API_URL}?key=${API_KEY}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const answer = data.candidates[0].content.parts[0].text;
                        const responseDiv = document.getElementById('gemini-response');
                        responseDiv.innerHTML += `
                            <div><strong>You:</strong> ${prompt}</div>
                            <div><strong>Gemini:</strong> ${answer}</div>
                            <hr>
                        `;
                        responseDiv.scrollTop = responseDiv.scrollHeight;
                    } catch (e) {
                        console.error('Failed to parse response:', e);
                    }
                },
                onerror: function(err) {
                    console.error('API Error:', err);
                }
            });
        });
    });
})();