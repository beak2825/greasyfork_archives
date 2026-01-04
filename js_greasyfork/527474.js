// ==UserScript==
// @name         Snapchat Group Chat Protection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevent removal from Snapchat group chats
// @author       Your Name
// @match        *://*.snapchat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527474/Snapchat%20Group%20Chat%20Protection.user.js
// @updateURL https://update.greasyfork.org/scripts/527474/Snapchat%20Group%20Chat%20Protection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const username = 'doodoobrowncut'; // Replace with your Snapchat username

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const removedNodes = Array.from(mutation.removedNodes);
                removedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const userRemoved = node.querySelector('.user-name'); // Adjust selector as needed
                        if (userRemoved && userRemoved.textContent.includes(username)) {
                            // Logic to prevent removal
                            console.log(`${username} was removed from the group chat, but we won't let that happen!`);
                            // Add your logic here to prevent removal
                        }
                    }
                });
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
