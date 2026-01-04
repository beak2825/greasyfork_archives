// ==UserScript==
// @name         WhatsApp Deleted Messages Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alert when a message is deleted in WhatsApp Web.
// @author       Yusuf Sameh
// @match        https://web.whatsapp.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491432/WhatsApp%20Deleted%20Messages%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/491432/WhatsApp%20Deleted%20Messages%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle incoming messages
    function handleNewMessages(mutationsList) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('message-in')) {
                        const message = node.querySelector('.message-in .selectable-text');
                        if (message && message.textContent === 'This message was deleted') {
                            alert('A message was deleted.');
                        }
                    }
                });
            }
        });
    }

    // Select the target node
    const targetNode = document.querySelector('#pane-side');

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Check if targetNode exists before observing mutations
    if (targetNode) {
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(handleNewMessages);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    } else {
        console.error('Target node not found.');
    }
})();
