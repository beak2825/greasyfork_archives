// ==UserScript==
// @name         Vyneer.me VODs Chat Emote Replacer (RainbowPls + pokiKick + melW + nathanW)
// @namespace    FishVernanda
// @version      2025-07-08
// @description  Replace text emotes with styled emote divs on vyneer.me vod chat (existing and new messages)
// @author       FishVernanda
// @match        https://vyneer.me/vods*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542059/Vyneerme%20VODs%20Chat%20Emote%20Replacer%20%28RainbowPls%20%2B%20pokiKick%20%2B%20melW%20%2B%20nathanW%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542059/Vyneerme%20VODs%20Chat%20Emote%20Replacer%20%28RainbowPls%20%2B%20pokiKick%20%2B%20melW%20%2B%20nathanW%29.meta.js
// ==/UserScript==
// With thanks to yuniDev and intercropse shamefully lifted and edited PEPE
(function() {
    'use strict';

    // Add emote styles
    GM_addStyle(`
      .emote.RainbowPls {
        width: 32px;
        height: 32px;
        background-image: url('https://wikicdn.destiny.gg/f/f4/GRainbowPls.png');
      }
      .msg-chat .emote.RainbowPls {
        margin-top: -30px;
        top: 7.5px;
      }

      .emote.pokiKick {
        width: 61px;
        height: 32px;
        background-image: url('https://wikicdn.destiny.gg/b/b1/Pokikick.gif');
      }
      .msg-chat .emote.pokiKick {
        margin-top: -32px;
        top: 8px;
      }

      .emote.nathanW {
        width: 28px;
        height: 28px;
        background-image: url('https://wikicdn.destiny.gg/e/ef/NathanW.png');
      }
      .msg-chat .emote.nathanW {
        margin-top: -28px;
        top: 7px;
      }

      .emote.melW {
        width: 28px;
        height: 28px;
        background-image: url('https://wikicdn.destiny.gg/2/2e/MelWemote.png');
      }
      .msg-chat .emote.melW {
        margin-top: -28px;
        top: 7px;
      }
    `);

    // Emote text to class map
    const emoteMap = {
        'rainbowpls': 'RainbowPls',
        'pokikick': 'pokiKick',
        'nathanw': 'nathanW',
        'melw': 'melW',
    };

    function replaceTextWithEmotesInNode(textNode) {
        const parent = textNode.parentNode;
        const text = textNode.nodeValue;
        const pattern = new RegExp(`\\b(${Object.keys(emoteMap).join('|')})\\b`, 'gi');
        if (!pattern.test(text)) return;

        const parts = text.split(pattern);
        parent.removeChild(textNode);

        for (const part of parts) {
            if (!part) continue;
            const key = part.toLowerCase();
            if (emoteMap[key]) {
                const emoteDiv = document.createElement('div');
                emoteDiv.className = 'emote ' + emoteMap[key];
                emoteDiv.title = emoteMap[key];
                parent.appendChild(emoteDiv);
            } else {
                parent.appendChild(document.createTextNode(part));
            }
        }
    }

    function processMessageSpan(span) {
        const childNodes = Array.from(span.childNodes);
        for (const node of childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                replaceTextWithEmotesInNode(node);
            }
        }
    }

    function processExistingMessages() {
        const chatMessages = document.querySelectorAll('#chat-stream .msg-chat .message');
        chatMessages.forEach(processMessageSpan);
    }

    function setupObserver() {
        const chatContainer = document.querySelector('#chat-stream');
        if (!chatContainer) {
            console.warn('Vyneer.me chat container (#chat-stream) not found');
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.classList?.contains('msg-chat')) {
                            const messageSpan = addedNode.querySelector('.message');
                            if (messageSpan) processMessageSpan(messageSpan);
                        }
                    }
                }
            }
        });

        observer.observe(chatContainer, { childList: true });
    }

    processExistingMessages();
    setupObserver();

})();
