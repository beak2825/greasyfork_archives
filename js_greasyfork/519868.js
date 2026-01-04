// ==UserScript==
// @name         ChatGPT Login/Sign Up Popup Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks on the "Stay logged out" link on the popup as soon as it appears and hides other elements.
// @match        https://chatgpt.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519868/ChatGPT%20LoginSign%20Up%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/519868/ChatGPT%20LoginSign%20Up%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to hide ".z-50" and "form .z-20" elements
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .z-50,
        form .z-20 {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // Function to handle clicking on ".z-50 a" elements
    const clickZ50Links = (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        // Click the node if it matches ".z-50 a"
        if (node.matches('.z-50 a')) {
            node.click();
        }

        // Click any descendants that match ".z-50 a"
        const links = node.querySelectorAll('.z-50 a');
        links.forEach((link) => {
            link.click();
        });
    };

    // Create a MutationObserver to monitor the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Handle added nodes
            mutation.addedNodes.forEach((node) => {
                clickZ50Links(node);
            });
        });
    });

    // Start observing the document body
    observer.observe(document.body, { childList: true, subtree: true });
})();
