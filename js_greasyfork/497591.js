// ==UserScript==
// @name         Chatbot Integration
// @version      1.1.2
// @description  Inject a chatbot into any webpage
// @author       Vakarux
// @match        http://testing.etest.lt/index.php
// @match        https://klase.eduka.lt/student/lesson-material/show/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      profectus-bonus.eu
// @connect      api.openai.com
// @license      MIT
// @namespace https://greasyfork.org/users/1305819
// @downloadURL https://update.greasyfork.org/scripts/497591/Chatbot%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/497591/Chatbot%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for chatbot interface and making webpage copyable
    GM_addStyle(`
        * {
            user-select: text !important; /* Make all elements selectable */
        }
        #chatbox {
            width: 300px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9999;
            display: none; /* Initially hidden */
        }
        #message, #instructions {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: vertical; /* Allow vertical resizing */
            min-height: 100px; /* Set minimum height */
        }
        #pasteArea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 2px dashed #ccc;
            border-radius: 5px;
            text-align: center;
            color: #999;
        }
        #send, #saveInstructions {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #007BFF;
            color: white;
            cursor: pointer;
            margin-bottom: 10px;
        }
        #response {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
    `);

    // Create the chatbot UI
    const chatbox = document.createElement('div');
    chatbox.id = 'chatbox';
    chatbox.innerHTML = `
        <textarea id="instructions" placeholder="Type your instructions here..."></textarea>
        <button id="saveInstructions">Save Instructions</button>
        <textarea id="message" placeholder="Type your message here..." spellcheck="true"></textarea>
        <div id="pasteArea">Paste image here</div>
        <button id="send">Send</button>
        <div id="response"></div>
    `;
    document.body.appendChild(chatbox);

    let chatHistory = [];
    let clipboardImage = null;

    // Load saved instructions from GM storage
    const savedInstructions = GM_getValue('instructions', '');
    if (savedInstructions) {
        document.getElementById('instructions').value = savedInstructions;
    }

    // Save instructions to GM storage
    document.getElementById('saveInstructions').addEventListener('click', () => {
        const instructions = document.getElementById('instructions').value;
        GM_setValue('instructions', instructions);
        alert('Instructions saved.');
    });

    // Handle paste events
    document.getElementById('pasteArea').addEventListener('paste', (event) => {
        const items = event.clipboardData.items;
        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                clipboardImage = file;
                document.getElementById('pasteArea').textContent = 'Image ready to upload';
                break;
            }
        }
    });

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://profectus-bonus.eu/upload.php',
                data: formData,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.url);
                    } else {
                        reject(new Error('Image upload failed'));
                    }
                }
            });
        });
    }

    document.getElementById('send').addEventListener('click', async () => {
        const message = document.getElementById('message').value;
        const instructions = document.getElementById('instructions').value;
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = 'Loading...';

        let imageUrl = '';
        if (clipboardImage) {
            imageUrl = await uploadImage(clipboardImage);
            clipboardImage = null;
            document.getElementById('pasteArea').textContent = 'Paste image here';
        }

        let userMessage = message;
        if (imageUrl) {
            userMessage += `\n[Image uploaded here: ${imageUrl}]`;
        }
        chatHistory.push({ role: 'user', content: userMessage });

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            data: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: instructions },
                    ...chatHistory.slice(-5)
                ],
                max_tokens: 150
            }),
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.error) {
                    responseDiv.innerHTML = 'Error: ' + data.error.message;
                } else {
                    const botMessage = data.choices[0].message.content.trim();
                    responseDiv.innerHTML = 'Bot: ' + botMessage;
                    chatHistory.push({ role: 'assistant', content: botMessage });
                }
                document.getElementById('message').value = '';
            }
        });
    });

    // Toggle the chatbox when 'C' is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'c' || event.key === 'C') {
            chatbox.style.display = chatbox.style.display === 'none' ? 'block' : 'none';
        }
    });
})();
