// ==UserScript==
// @name         FarmRPG Chat Emojis
// @namespace    farmrpg.com
// @version      0.2
// @description  FRPG Custom emojis with picker
// @author       Odung
// @match        https://farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529438/FarmRPG%20Chat%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/529438/FarmRPG%20Chat%20Emojis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const emojiMap = {
        "😡": "https://i.imgur.com/Qy8z0Xs.gif",
        "🫵🐧": "https://i.imgur.com/eWsJdxt.gif",
        "🦆💨": "https://i.imgur.com/BEVpKAF.gif",
        "🍇🧃😰": "https://i.imgur.com/amoibH4.gif",
        "🥺👉👈": "https://i.imgur.com/JOnCeHD.png",
        "🦆📦": "https://i.imgur.com/h7ZR3o9.gif",
        "D:": "https://i.imgur.com/QA9Njdw.png",
        "🦆🫣": "https://i.imgur.com/JmKzfEr.png",
        "🦆🤔": "https://i.imgur.com/pZSt8bX.png",
        "🐧🥱": "https://i.imgur.com/TRsQm04.gif",
        "🐻😮": "https://i.imgur.com/Lc5Q8SF.png",
        "🐻📱": "https://i.imgur.com/PnCCZo7.png",
        "🦆✨": "https://i.imgur.com/0amkhMg.png",
        "🦆💩": "https://i.imgur.com/UZSXPBM.gif",
        "sadge": "https://i.imgur.com/1KRtDxa.png",
        "🦆shy": "https://i.imgur.com/U4YtmZE.png",
        "🦆jason": "https://i.imgur.com/pS85t3r.png"
    };

    function replaceWordsInMessage(messageElement) {
        if (messageElement.dataset.processed) return;

        messageElement.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                let original = node.nodeValue;
                let text = original.replace(/\s+/g, '');

                Object.keys(emojiMap).forEach(word => {
                    if (text === word) {
                        const img = document.createElement('img');
                        img.src = emojiMap[word];
                        img.alt = word;
                        img.style.width = '30px';
                        img.style.height = 'auto';
                        node.replaceWith(img);
                        return;
                    }
                    
                    let startIndex = 0;
                    let matchIndex;

                    while ((matchIndex = text.indexOf(word, startIndex)) !== -1) {
                        let realStart = findRealIndex(original, text, matchIndex);
                        let realEnd = findRealIndex(original, text, matchIndex + word.length);

                        const img = document.createElement('img');
                        img.src = emojiMap[word];
                        img.alt = word;
                        img.style.width = '30px';
                        img.style.height = 'auto';

                        const fragment = document.createDocumentFragment();
                        fragment.appendChild(document.createTextNode(original.substring(0, realStart)));
                        fragment.appendChild(img);
                        fragment.appendChild(document.createTextNode(original.substring(realEnd)));

                        node.replaceWith(fragment);
                        return;
                    }
                });
            }
        });

        messageElement.dataset.processed = true;
    }

    function findRealIndex(original, text, index) {
        let count = 0;
        for (let i = 0; i < original.length; i++) {
            if (original[i] !== ' ') count++;
            if (count === index) return i + 1;
        }
        return original.length;
    }


    function scanAllMessages() {
        const messages = document.querySelectorAll('.chat-txt');
        messages.forEach(message => {
            const messageContent = message.querySelector('span:nth-of-type(2)');
            if (messageContent) replaceWordsInMessage(messageContent);
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
                        if (messageContent) replaceWordsInMessage(messageContent);
                    }
                });
            });
        });
        observer.observe(chatZone, { childList: true, subtree: true });
    }

    const addEmojiButton = () => {
        const cclinkElements = document.querySelectorAll('.cclink');
        if (cclinkElements.length > 0) {
            const buttonContainer = cclinkElements[11].parentElement;
            const emojiButton = document.createElement('button');
            emojiButton.innerText = 'Emoji';
            emojiButton.classList.add('cclink');
            emojiButton.addEventListener('click', () => {
                const picker = document.getElementById('emojiPicker');
                picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
            });
            buttonContainer.appendChild(emojiButton);
        } else console.warn('No .cclink element found.');
    };

    const createEmojiPicker = () => {
        const picker = document.createElement('div');
        picker.id = 'emojiPicker';
        picker.style.display = 'none';
        picker.style.position = 'absolute';
        picker.style.zIndex = '1000';
        picker.style.border = '1px solid #444';
        picker.style.backgroundColor = '#232323';
        picker.style.padding = '10px';
        picker.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
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
        picker.appendChild(closeButton);
        const emojiList = Object.keys(emojiMap);
        emojiList.forEach(emoji => {
            const emojiButton = document.createElement('button');
            emojiButton.innerText = emoji;
            emojiButton.style.margin = '5px';
            emojiButton.style.backgroundColor = '#ccc';
            emojiButton.addEventListener('click', () => {
                const chatInput = document.getElementById('chat_txt_desktop');
                if (chatInput) {
                    chatInput.value += emoji;
                    chatInput.focus();
                    picker.style.display = 'none';
                }
            });
            picker.appendChild(emojiButton);
        });
        const chatPanel = document.getElementById('desktopchatpanel');
        if (chatPanel) chatPanel.insertBefore(picker, chatPanel.firstChild);
    };

    const init = () => {
        createEmojiPicker();
        addEmojiButton();
    };
    init();
})();
