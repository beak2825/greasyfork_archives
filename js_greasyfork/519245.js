// ==UserScript==
// @name         FarmRPG Chat Emojis with Picker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  FRPG Custom emojis with picker
// @author       ChatGPT duckwowow
// @match        https://farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519245/FarmRPG%20Chat%20Emojis%20with%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/519245/FarmRPG%20Chat%20Emojis%20with%20Picker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const emojiMap = {
        "😡": "https://i.imgur.com/Qy8z0Xs.gif",
        "🫵🐧": "https://i.imgur.com/eWsJdxt.gif",
        "🫵 🐧": "https://i.imgur.com/eWsJdxt.gif",
        "🦆💨": "https://i.imgur.com/BEVpKAF.gif",
        "🦆 💨": "https://i.imgur.com/BEVpKAF.gif",
        "🍇🧃😰": "https://i.imgur.com/amoibH4.gif",
        "🍇 🧃 😰": "https://i.imgur.com/amoibH4.gif",
        "🥺👉👈": "https://i.imgur.com/JOnCeHD.png",
        "🥺 👉 👈": "https://i.imgur.com/JOnCeHD.png",
        "🦆📦": "https://i.imgur.com/h7ZR3o9.gif",
        "🦆 📦": "https://i.imgur.com/h7ZR3o9.gif",
        "D:": "https://i.imgur.com/QA9Njdw.png",
        "🦆🫣": "https://i.imgur.com/JmKzfEr.png",
        "🦆 🫣": "https://i.imgur.com/JmKzfEr.png",
        "🦆🤔": "https://i.imgur.com/pZSt8bX.png",
        "🦆 🤔": "https://i.imgur.com/pZSt8bX.png",
        "🐧 🥱": "https://i.imgur.com/TRsQm04.gif",
        "🐧🥱": "https://i.imgur.com/TRsQm04.gif",
        "🐻😮": "https://i.imgur.com/Lc5Q8SF.png",
        "🐻 😮": "https://i.imgur.com/Lc5Q8SF.png",
        "🐻📱": "https://i.imgur.com/PnCCZo7.png",
        "🐻 📱": "https://i.imgur.com/PnCCZo7.png",
        "🦆 ✨": "https://i.imgur.com/0amkhMg.png",
        "🦆✨": "https://i.imgur.com/0amkhMg.png",
        "🦆💩": "https://i.imgur.com/UZSXPBM.gif",
        "🦆 💩": "https://i.imgur.com/UZSXPBM.gif",
        "sadge": "https://i.imgur.com/1KRtDxa.png",
        "🦆shy": "https://i.imgur.com/U4YtmZE.png",
        "🦆 shy": "https://i.imgur.com/U4YtmZE.png",
        "🦆jason": "https://i.imgur.com/pS85t3r.png",
        "🦆 jason": "https://i.imgur.com/pS85t3r.png"
    };

    const pickerList = {
        "😡": "",
        "🫵🐧": "",
        "🦆💨": "",
        "🍇🧃😰": "",
        "🥺👉👈": "",
        "🦆📦": "",
        "D:": "",
        "🦆🫣": "",
        "🦆🤔": "",
        "🐧🥱": "",
        "🐻😮": "",
        "🐻📱": "",
        "🦆✨": "",
        "🦆💩": "",
        "sadge": "",
        "🦆shy": "",
        "🦆jason": ""
    }
    
    function replaceWordsInMessage(messageElement) {
        if (messageElement.dataset.processed) return;

        // Replace only the text nodes within the element
        messageElement.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue;
                Object.keys(emojiMap).forEach(word => {
                    if (text.includes(word)) {
                        const img = document.createElement('img');
                        img.src = emojiMap[word];
                        img.alt = word;
                        img.style.width = '30px';
                        img.style.height = 'auto';

                        const parts = text.split(word);
                        const fragment = document.createDocumentFragment();
                        parts.forEach((part, i) => {
                            fragment.appendChild(document.createTextNode(part));
                            if (i < parts.length - 1) fragment.appendChild(img.cloneNode());
                        });

                        node.replaceWith(fragment);
                    }
                });
            }
        });

        messageElement.dataset.processed = true;
    }

    function scanAllMessages() {
        const messages = document.querySelectorAll('.chat-txt');
        messages.forEach(message => {
            const messageContent = message.querySelector('span:nth-of-type(2)');
            if (messageContent) {
                replaceWordsInMessage(messageContent);
            }
        });
    }

    const chatZone = document.getElementById('chatzoneDesktop');
    if (chatZone) {
        scanAllMessages();

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('chat-txt')) {
                        const messageContent = node.querySelector('span:nth-of-type(2)');
                        if (messageContent) {
                            replaceWordsInMessage(messageContent);
                        }
                    }
                });
            });
        });

        observer.observe(chatZone, { childList: true, subtree: true });

    } else {
        console.warn('Chat zone not found! The script will not work without a valid chat zone.');
    }

    // Add Emoji button
    const addEmojiButton = () => {
        const cclinkElements = document.querySelectorAll('.cclink');
        if (cclinkElements.length > 0) {
            const buttonContainer = cclinkElements[11].parentElement;

            const emojiButton = document.createElement('button');
            emojiButton.innerText = 'Emoji';
            emojiButton.classList.add('cclink'); // Add the 'cclink' class for styling

            emojiButton.addEventListener('click', () => {
                const picker = document.getElementById('emojiPicker');
                picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
            });

            buttonContainer.appendChild(emojiButton);
        } else {
            console.warn('No .cclink element found.');
        }
    };

    // Create the Emoji Picker
    const createEmojiPicker = () => {
        const picker = document.createElement('div');
        picker.id = 'emojiPicker';
        picker.style.display = 'none'; // Hidden by default
        picker.style.position = 'absolute';
        picker.style.zIndex = '1000';
        picker.style.border = '1px solid #444';
        picker.style.backgroundColor = '#232323';
        picker.style.padding = '10px';
        picker.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';

        // Create a close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.style.color = 'white';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            picker.style.display = 'none';
        });

        picker.appendChild(closeButton); // Add the close button to the picker

        const emojiList = Object.keys(pickerList);
        emojiList.forEach(emoji => {
            const emojiButton = document.createElement('button');
            emojiButton.innerText = emoji;
            emojiButton.style.margin = '5px';
            emojiButton.style.backgroundColor = '#ccc';
            emojiButton.addEventListener('click', () => {
                // Insert the emoji into the chat input
                const chatInput = document.getElementById('chat_txt_desktop');
                if (chatInput) {
                    chatInput.value += emoji;
                    chatInput.focus();
                    // Close the emoji picker
                    picker.style.display = 'none';
                }
            });
            picker.appendChild(emojiButton);
        });

        const chatPanel = document.getElementById('desktopchatpanel');
        if (chatPanel) {
            chatPanel.insertBefore(picker, chatPanel.firstChild); // Add the picker as the first child
        } else {
            console.warn('desktopchatpanel not found!');
        }
    };

    // Initialize the script
    const init = () => {
        createEmojiPicker(); // Create the emoji picker
        addEmojiButton(); // Add the emoji button
    };

    // Run the init function
    init();
})();
