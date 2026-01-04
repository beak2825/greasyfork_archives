// ==UserScript==
// @name         SteinChatBubbles
// @namespace    http://tampermonkey.net/
// @version      2025-06-13
// @description  Create chat bubbles for Stein World.
// @author       guydude
// @match        https://*.stein.world/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stein.world
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539450/SteinChatBubbles.user.js
// @updateURL https://update.greasyfork.org/scripts/539450/SteinChatBubbles.meta.js
// ==/UserScript==

(function() {
    'use strict';
// ==UserScript==
// @name         SteinChatBubbles
// @namespace    http://tampermonkey.net/
// @version      2025-06-13
// @description  Create chat bubbles for Stein World.
// @author       guydude
// @match        https://*.stein.world/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stein.world
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539439/SteinChatBubbles.user.js
// @updateURL https://update.greasyfork.org/scripts/539439/SteinChatBubbles.meta.js
// ==/UserScript==

(function() {
    'use strict';
let chatHistory = JSON.parse(localStorage.getItem('reload-chat-history')) || [];

chatHistory.forEach((message) => {
    const temp = document.createElement('div');
    temp.innerHTML = message;
    const messageHTML = temp.firstChild;
    messageHTML.classList.add('old-chat-message');
    const interval = setInterval(() => {
        const element = document.getElementById('stein-chat-content-container').querySelector('.stein-chat-content');
        if (element) {
            clearInterval(interval);
            element.appendChild(messageHTML);
        }
    }, 100);
});

window.addEventListener('beforeunload', () => {
    chatHistory = Array.from(document.getElementById('stein-chat-content-container').querySelectorAll(
        '.stein-chat-message-zone, .stein-chat-message-party, .stein-chat-message-guild, .stein-chat-message-whisper-to, .stein-chat-message-whisper-from'
        )).map(el => el.outerHTML);
    if (reload) {
        localStorage.setItem('reload-chat-history', JSON.stringify(chatHistory));
    } else {
        localStorage.setItem('reload-chat-history', JSON.stringify([]));
    }
});

let reload = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'F5') {
        event.preventDefault();
        reload = true;
        window.location.reload();
    }
});

function getText() {
    const originalFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, ...rest) {
        if (text && text.length > 0) {
            findChatter(text, x, y);
        }
        return originalFillText.call(this, text, x, y, ...rest);
    };
}

function findChatter(text, x, y) {
    let nameText = text;
    if (nameText.includes("'")) {
        nameText = nameText.split("'")[1];
    }
    for (let bubble of bubbleContainer.children) {
        if (bubble.classList[0] === nameText) {
            updateBubble(bubble, x, y);
        }
    }
}

function updateBubble(bubble, x, y) {
    const canvas = document.getElementById('stein-ui-canvas');
    const rect = canvas.getBoundingClientRect();

    const offsetX = parseInt(bubble.style.width)/2;
    let offsetY = parseInt(bubble.offsetHeight);
    const prevMessages = document.getElementById('chat-bubbles-container').querySelectorAll(`.${bubble.classList[0]}.chat-bubble`);
    for (const message of prevMessages) {
        const originalY = parseInt(message.style.top);
        message.style.top = `${originalY - offsetY}px`;
    }

    const screenX = rect.left + x - offsetX - 10;
    const screenY = rect.top + y - offsetY - 20;

    bubble.style.left = `${screenX}px`;
    bubble.style.top = `${screenY}px`;
}

function waitForElement(selector) {
    return new Promise((resolve) => {
        const checkExist = setInterval(() => {
            const targetNode = document.querySelector(selector);
            if (targetNode) {
                clearInterval(checkExist);
                resolve(targetNode);
            }
        }, 100);
    });
}

const messageClasses = ['stein-chat-message-zone', 'stein-chat-message-party', 'stein-chat-message-guild', 'stein-chat-message-whisper-from', 'stein-chat-message-whisper-to'];

const chatObserver = new MutationObserver((mutationList, observer) => {
    for (let mutation of mutationList) {
        if (mutation.type === 'childList') {
            for (let message of mutation.addedNodes) {
                if (message.nodeType === Node.ELEMENT_NODE) {
                    if (messageClasses.includes(message.classList[0]) && !message.classList.contains('old-chat-message')) {
                        let className = message.classList[0];
                        let playerName;
                        if (className.includes('-from')) {
                            className = className.slice(0, -5);
                            playerName = message.querySelector(`.${className}-name`).textContent;
                        } else if (className.includes('-to')) {
                            className = className.slice(0, -3);
                            playerName = document.getElementById('stein-player-name-panel').textContent;
                        } else {
                            playerName = message.querySelector(`.${className}-name`).textContent;
                        }
                        const messageText = message.querySelector(`.${className}-text`).textContent;
                        const bubble = createChatBubble(playerName, messageText);

                        if (className === 'stein-chat-message-party') {
                            bubble.style.color = '#b6dc87';
                        } else if (className === 'stein-chat-message-guild') {
                            bubble.style.color = '#afd4f5';
                        } else if (className === 'stein-chat-message-whisper') {
                            bubble.style.color = '#f7a0f3';
                        }

                        const playerMessages = document.getElementById('chat-bubbles-container').querySelectorAll(`.${bubble.classList[0]}.chat-bubble`);

                        const now = Date.now();
                        let lifetime = bubble.textContent.length * 100;
                        if (playerMessages.length === 1) {
                            lifetime += 4000;
                        } else {
                            lifetime += parseInt(playerMessages[playerMessages.length - 2].dataset.expireAt) - now;
                        }
                        const expireAt = now + lifetime;
                        console.log(bubble.textContent);
                        console.log(lifetime);
                        bubble.dataset.expireAt = expireAt;
                    }
                }
            }
        }
    }
});

setInterval(() => {
    document.querySelectorAll('.chat-bubble').forEach(el => {
        if (Date.now() >= parseInt(el.dataset.expireAt)) {
            el.remove();
        }
    });
}, 150);

const config = { childList: true, subtree: false };

(async () => {
    const targetNode = await waitForElement('#stein-chat-content-container .stein-chat-content');
    chatObserver.observe(targetNode, config);
    getText();
})();

const bubbleContainer = document.createElement('div');
bubbleContainer.id = 'chat-bubbles-container';
bubbleContainer.setAttribute('style', "position: absolute; top: 0; left: 0; pointer-events: none; z-index: 10;");
document.body.appendChild(bubbleContainer);

function createChatBubble(playerName, messageText) {
    const bubble = document.createElement('div');
    bubble.className = `${playerName} chat-bubble`;
    bubble.innerText = messageText;
    bubble.setAttribute('style',
    `position: absolute;
    background: rgba(0,0,0,0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
    display: inline-block;
    overflow-wrap: break-word;
    white-space: nowrap;`);

    const canvas = document.getElementById('stein-ui-canvas');
    const ctx = canvas.getContext("2d");

    ctx.font = "14px 'Fira Sans Condensed'";

    const width = ctx.measureText(messageText).width;
    if (width > 200) {
        bubble.style.width = '200px';
        bubble.style.whiteSpace = 'normal';
    } else {
        bubble.style.width = `${width}px`;
    }

    document.getElementById('chat-bubbles-container').appendChild(bubble);
    return bubble;
}
})();
})();