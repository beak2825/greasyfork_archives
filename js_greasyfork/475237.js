// ==UserScript==
// @name        TheLounge Anti-Spam Filter
// @namespace   Violentmonkey Scripts
// @match       *://localhost:9000/*
// @match       *://127.0.0.1:9000/*
// @grant       none
// @version     1.3
// @author      Wizzard
// @description Hides announces from private trackers' irc
//
// @downloadURL https://update.greasyfork.org/scripts/475237/TheLounge%20Anti-Spam%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/475237/TheLounge%20Anti-Spam%20Filter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // hides Vertigo "spam messages" for gazellegames irc
    function hideVertigoMessages() {
        const messages = document.querySelectorAll('.msg[data-from="Vertigo"]');
        messages.forEach(message => {
            const messageText = message.textContent;
            // check for specific patterns to hide
            const shouldHide =
                messageText.includes(':-:') ||
                messageText.includes('A freeleech pot') ||
                messageText.includes('New thread') ||
                messageText.includes('New Blog Post');

            if (shouldHide) {
                message.style.display = 'none';
            }
        });
    }
    // hides midgards's "spam messages" for hdbits irc
    function hideMidgardsMessages() {
        const messages = document.querySelectorAll('.msg[data-from="midgards"]');
        messages.forEach(message => {
            const messageText = message.textContent;
            // check for specific patterns to hide
            const shouldHide =
                messageText.includes('New Torrent') ||
                messageText.includes('New Offer') ||
                messageText.includes('New Request');

            if (shouldHide) {
                message.style.display = 'none';
            }
        });
    }

    // initial call to hide messages
    hideVertigoMessages();
    hideMidgardsMessages();

    const vertigoObserver = new MutationObserver(hideVertigoMessages);
    const midgardsObserver = new MutationObserver(hideMidgardsMessages);

    // configure observers to watch for changes in the entire document
    vertigoObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    midgardsObserver.observe(document.body, {
          childList: true,
          subtree: true
    });
})();