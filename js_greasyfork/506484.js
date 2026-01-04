// ==UserScript==
// @name         Universal Draggable Live Chat Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a draggable overlay for live chat from any URL
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/506484/Universal%20Draggable%20Live%20Chat%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/506484/Universal%20Draggable%20Live%20Chat%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS for the draggable chat
    GM_addStyle(`
        #draggable-chat {
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 300px;
            height: 400px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            border-radius: 8px;
            overflow: auto;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        #draggable-chat-header {
            background: #333;
            padding: 5px;
            cursor: move;
            text-align: center;
            color: #fff;
            font-weight: bold;
        }
        #draggable-chat-content {
            padding: 10px;
            height: calc(100% - 40px);
            overflow: auto;
        }
        #draggable-chat iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        #draggable-chat input {
            width: calc(100% - 22px);
            padding: 5px;
            margin: 5px;
            border: none;
            border-radius: 5px;
        }
        #draggable-chat button {
            padding: 5px;
            border: none;
            border-radius: 5px;
            background: #007bff;
            color: #fff;
            cursor: pointer;
        }
        #draggable-chat button:hover {
            background: #0056b3;
        }
    `);

    // Create the draggable chat container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'draggable-chat';
    chatContainer.innerHTML = `
        <div id="draggable-chat-header">Live Chat
            <button id="chat-submit">Submit</button>
            <input type="text" id="chat-url" placeholder="Enter chat URL" />
        </div>
        <div id="draggable-chat-content">
            <iframe id="chat-iframe" src="" frameborder="0"></iframe>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // Make the chat container draggable
    const header = document.getElementById('draggable-chat-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - chatContainer.getBoundingClientRect().left;
        offsetY = e.clientY - chatContainer.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            chatContainer.style.left = (e.clientX - offsetX) + 'px';
            chatContainer.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Handle chat URL submission
    const submitButton = document.getElementById('chat-submit');
    const chatUrlInput = document.getElementById('chat-url');
    const chatIframe = document.getElementById('chat-iframe');

    submitButton.addEventListener('click', () => {
        const url = chatUrlInput.value;
        if (url) {
            chatIframe.src = url;
        }
    });
})();
