// ==UserScript==
// @name         Torn Translator (Chat Fix)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds chat translation buttons 
// @author       JeffBezas
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @connect      translate.googleapis.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528017/Torn%20Translator%20%28Chat%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528017/Torn%20Translator%20%28Chat%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load saved position or set default
    let posX = GM_getValue("translatorPosX", 50);
    let posY = GM_getValue("translatorPosY", 50);

    // Add custom styles
    GM_addStyle(`
        #translator-container {
            position: fixed;
            left: ${posX}px;
            top: ${posY}px;
            width: 300px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            z-index: 9999;
            cursor: grab;
        }
        #translator-header {
            background: rgba(255, 255, 255, 0.2);
            padding: 5px;
            text-align: center;
            font-weight: bold;
            cursor: grab;
            user-select: none;
        }
        #translator-container select, #translator-container textarea, #translator-container button {
            width: 100%;
            margin-top: 5px;
        }
        #translator-container textarea {
            height: 50px;
        }
        #translated-text {
            margin-top: 10px;
            background: white;
            color: black;
            padding: 5px;
            border-radius: 3px;
        }
        .translate-btn {
            margin-left: 5px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 2px 5px;
            font-size: 12px;
            cursor: pointer;
            border-radius: 3px;
        }
        .translate-btn:hover {
            background: #45a049;
        }
    `);

    // Create the translation UI
    const translatorDiv = document.createElement('div');
    translatorDiv.id = 'translator-container';
    translatorDiv.innerHTML = `
        <div id="translator-header">Drag Me</div>
        <label>Translate from:</label>
        <select id="sourceLang">
            <option value="auto">Auto</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
        </select>
        <label>To:</label>
        <select id="targetLang">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
        </select>
        <textarea id="textToTranslate" placeholder="Enter text here..."></textarea>
        <div style="display: flex; justify-content: space-between;">
            <button id="copyText">📋 Copy</button>
            <button id="pasteText">📥 Paste</button>
        </div>
        <div id="translated-text">Translation will appear here...</div>
    `;
    document.body.appendChild(translatorDiv);

    // Enable dragging
    let isDragging = false, startX, startY;
    document.getElementById('translator-header').addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX - translatorDiv.offsetLeft;
        startY = e.clientY - translatorDiv.offsetTop;
        translatorDiv.style.cursor = "grabbing";
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let newX = e.clientX - startX;
            let newY = e.clientY - startY;
            translatorDiv.style.left = newX + "px";
            translatorDiv.style.top = newY + "px";
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            GM_setValue("translatorPosX", translatorDiv.offsetLeft);
            GM_setValue("translatorPosY", translatorDiv.offsetTop);
            isDragging = false;
            translatorDiv.style.cursor = "grab";
        }
    });

    // Copy to clipboard
    document.getElementById('copyText').addEventListener('click', function() {
        const translatedText = document.getElementById('translated-text').innerText;
        GM_setClipboard(translatedText);
    });

    // Paste from clipboard
    document.getElementById('pasteText').addEventListener('click', function() {
        navigator.clipboard.readText().then(text => {
            document.getElementById('textToTranslate').value = text;
            translateText(text);
        }).catch(err => {
            console.error("Failed to read clipboard: ", err);
        });
    });

    // Auto-translate on input
    let timeout;
    document.getElementById('textToTranslate').addEventListener('input', function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const text = document.getElementById('textToTranslate').value;
            translateText(text);
        }, 500);
    });

    // Function to fetch translation
    function translateText(text) {
        const sourceLang = document.getElementById('sourceLang').value;
        const targetLang = document.getElementById('targetLang').value;

        if (text.trim() === "") {
            document.getElementById('translated-text').innerText = "Translation will appear here...";
            return;
        }

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    const translatedText = result[0].map(item => item[0]).join("");
                    document.getElementById('translated-text').innerText = translatedText;
                } catch (e) {
                    document.getElementById('translated-text').innerText = "Translation error.";
                }
            }
        });
    }

    // Add translation buttons to chat messages
    function addTranslationButtons() {
        document.querySelectorAll('.chat-box-message__message___SldE8').forEach(message => {
            if (!message.querySelector('.translate-btn')) {
                const translateBtn = document.createElement('button');
                translateBtn.innerText = "Translate";
                translateBtn.classList.add('translate-btn');

                // Get clean message text (remove button and emoji)
                translateBtn.addEventListener('click', function() {
                    const text = message.querySelector('.text-message___gcG6e')?.innerText.trim() || ""; // Extract only message text
                    document.getElementById('textToTranslate').value = text;
                    translateText(text);
                });

                message.appendChild(translateBtn);
            }
        });
    }

    // Observe chat for new messages
    const chatObserver = new MutationObserver(addTranslationButtons);
    chatObserver.observe(document.body, { childList: true, subtree: true });

})();
