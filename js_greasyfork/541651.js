// ==UserScript==
// @name         Drawaria Translator Menu to Russian
// @version      1.7
// @description  (I PRIVATED THIS SCRIPT REQUESTED BY PANTHER) Translate messages to Russian for Drawaria.online and send directly to chat, with a toggleable menu.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/1088100
// @downloadURL https://update.greasyfork.org/scripts/541651/Drawaria%20Translator%20Menu%20to%20Russian.user.js
// @updateURL https://update.greasyfork.org/scripts/541651/Drawaria%20Translator%20Menu%20to%20Russian.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Drawaria Translator script starting...");

    // Function to create elements in a standard way
    function createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        return element;
    }

    // Function to make an element draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.header');
        if (!header) {
            console.warn("Drawaria Translator: Draggable element has no .header to attach drag events.");
            return;
        }
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Function to translate text using Google Translate API
    function translateText(textToTranslate, toLang, callback) {
        const url =
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
            toLang +
            "&dt=t&q=" +
            encodeURI(textToTranslate);
        const req = new XMLHttpRequest();
        req.onload = () => {
            try {
                const data = JSON.parse(req.response);
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    callback(data[0][0][0]);
                } else {
                    console.warn("Drawaria Translator: Translation failed or returned unexpected data:", data);
                    callback("Translation failed. Check console for details.");
                }
            } catch (error) {
                console.error("Drawaria Translator: Error parsing JSON response for translation:", error);
                callback("Error during translation. Check console for details.");
            }
        };
        req.onerror = (e) => {
            console.error("Drawaria Translator: Network error during translation request:", e);
            callback("Network error during translation. Check console for details.");
        };
        req.open("GET", url);
        req.send();
    }

    // Function to initialize the translator
    function initTranslator() {
        // Create the translator container
        const translatorContainer = createElement('div', {
            id: 'drawariaCustomTranslator',
            style: `
                position: fixed !important;
                top: 100px !important;
                left: 100px !important;
                background-color: #f8f9fa;
                border: 1px solid #343a40;
                border-radius: .5rem;
                padding: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 99999 !important;
                font-family: 'Open Sans', sans-serif;
                color: #343a40;
                display: none; /* Starts hidden */
                flex-direction: column;
                gap: 10px;
                width: 320px;
                max-width: 90vw;
                resize: both;
                overflow: auto;
            `
        });

        // Create the header
        const header = createElement('div', {
            class: 'header',
            style: `
                font-weight: bold;
                text-align: center;
                padding-bottom: 8px;
                margin-bottom: 5px;
                border-bottom: 1px solid #ced4da;
                cursor: grab;
                font-size: 1.1em;
                color: #343a40;
            `
        }, ["Drawaria Translator 🇷🇺"]);

        // Create the input text area for the text to translate
        const inputText = createElement('textarea', {
            placeholder: "Enter text...",
            rows: 3,
            id: "inputText",
            style: `
                width: calc(100% - 16px);
                padding: 8px;
                border: 1px solid #dee2e6;
                border-radius: .25rem;
                resize: vertical;
                min-height: 60px;
                background-color: #fff;
                color: #343a40;
                font-size: 0.95em;
                line-height: 1.4;
            `
        });

        // Prevent default behavior on input to allow text entry
        inputText.addEventListener('keydown', function(e) {
            e.stopPropagation();
        });

        inputText.addEventListener('focus', function(e) {
            this.style.outline = '2px solid blue';
        });

        inputText.addEventListener('blur', function(e) {
            this.style.outline = 'none';
        });

        // Create the translate button
        const translateButton = createElement('button', {
            id: "translateBtn",
            style: `
                padding: 10px 15px;
                border: none;
                border-radius: .25rem;
                color: white;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 1em;
                font-weight: 600;
                background-color: #17a2b8;
            `
        }, ["Translate to Russian"]);

        // Create the output text area for Russian translation
        const russianOutput = createElement('textarea', {
            placeholder: "Russian translation will appear here...",
            rows: 3,
            readonly: true,
            id: "russianOutput",
            style: `
                width: calc(100% - 16px);
                padding: 8px;
                border: 1px solid #dee2e6;
                border-radius: .25rem;
                resize: vertical;
                min-height: 60px;
                background-color: #fff;
                color: #343a40;
                font-size: 0.95em;
                line-height: 1.4;
            `
        });

        // Create the send translation button
        const sendButton = createElement('button', {
            id: "sendTranslation",
            style: `
                padding: 10px 15px;
                border: none;
                border-radius: .25rem;
                color: white;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 1em;
                font-weight: 600;
                background-color: #007bff;
            `
        }, ["Send Translation"]);

        // Add elements to the container
        translatorContainer.appendChild(header);
        translatorContainer.appendChild(inputText);
        translatorContainer.appendChild(translateButton);
        translatorContainer.appendChild(russianOutput);
        translatorContainer.appendChild(sendButton);

        // Add the container to the document body
        document.body.appendChild(translatorContainer);
        console.log("Drawaria Translator: UI container appended to body.");

        // Make the translator UI draggable
        makeDraggable(translatorContainer);
        console.log("Drawaria Translator: UI made draggable.");

        // Add event listeners for the buttons
        translateButton.addEventListener("click", () => {
            const textToTranslate = inputText.value.trim();
            if (textToTranslate) {
                console.log("Drawaria Translator: Translating text:", textToTranslate);
                translateText(textToTranslate, "ru", (translatedText) => {
                    russianOutput.value = translatedText;
                    console.log("Drawaria Translator: Translation complete:", translatedText);
                });
            } else {
                russianOutput.value = "Please enter text to translate.";
                console.log("Drawaria Translator: No text to translate.");
            }
        });

        // Event listener for the "Send Translation" button
        sendButton.addEventListener("click", () => {
            const translatedText = russianOutput.value;
            if (translatedText) {
                const chatInput = document.getElementById('chatbox_textinput');

                if (chatInput) {
                    chatInput.value = translatedText;
                    console.log("Drawaria Translator: Text placed in chat input:", translatedText);

                    const event = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    });
                    chatInput.dispatchEvent(event);
                    console.log("Drawaria Translator: 'Enter' keydown event dispatched.");

                    const originalText = sendButton.textContent;
                    sendButton.textContent = "Sent!";
                    setTimeout(() => {
                        sendButton.textContent = originalText;
                        inputText.value = "";
                        russianOutput.value = "";
                    }, 1500);

                } else {
                    console.warn("Drawaria Translator: Could not find chat input element (#chatbox_textinput).");
                    const originalText = sendButton.textContent;
                    sendButton.textContent = "Chat not found!";
                    setTimeout(() => {
                        sendButton.textContent = originalText;
                    }, 1500);
                }
            } else {
                console.log("Drawaria Translator: Nothing to send.");
            }
        });

        // --- New Toggle Button Functionality ---
        const roomcontrols = document.getElementById('roomcontrols');
        if (roomcontrols) {
            const toggleButton = createElement('button', {
                class: 'btn btn-outline-secondary btn-sm',
                style: 'padding: 1px 5px;',
                title: 'Toggle Translator Menu'
            }, ['T']);

            // Insert the new button next to the existing menu button in roomcontrols
            // Find the roomcontrols-menu button to insert next to it
            const menuButton = document.getElementById('roomcontrols-menu');
            if (menuButton) {
                menuButton.parentNode.insertBefore(toggleButton, menuButton.nextSibling);
            } else {
                // Fallback if menuButton is not found
                roomcontrols.appendChild(toggleButton);
            }

            toggleButton.addEventListener('click', () => {
                if (translatorContainer.style.display === 'none') {
                    translatorContainer.style.display = 'flex'; // Use 'flex' as it's a flex container
                } else {
                    translatorContainer.style.display = 'none';
                }
            });
            console.log("Drawaria Translator: Toggle button added to roomcontrols.");
        } else {
            console.warn("Drawaria Translator: Could not find #roomcontrols element to add toggle button.");
        }
    }

    // Wait for the DOM to be fully loaded before initializing the translator
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTranslator);
    } else {
        initTranslator();
    }
})();