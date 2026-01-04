// ==UserScript==
// @name         Roblox Connections → Friends
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Globally replace "Connect", "Connection", and "Connections" with "Friends" on every Roblox page, including titles and dynamic content.
// @author       ANGRYC0NEMAN
// @match        https://www.roblox.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543675/Roblox%20Connections%20%E2%86%92%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/543675/Roblox%20Connections%20%E2%86%92%20Friends.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace text in text nodes recursively
    const replaceText = (node) => {
        if (node.nodeType === 3) { // TEXT_NODE
            node.textContent = node.textContent
                .replace(/\bConnections\b/g, 'Friends')
                .replace(/\bConnection\b/g, 'Friends')
                .replace(/\bConnect\b/g, 'Friends');
        } else if (node.nodeType === 1 && node.childNodes) { // ELEMENT_NODE
            node.childNodes.forEach(replaceText);
        }
    };

    // Replace the document title too
    const fixTitle = () => {
        if (document.title.match(/\bConnections\b|\bConnection\b|\bConnect\b/)) {
            document.title = document.title
                .replace(/\bConnections\b/g, 'Friends')
                .replace(/\bConnection\b/g, 'Friends')
                .replace(/\bConnect\b/g, 'Friends');
        }
    };

    // Initial run for existing DOM and title
    replaceText(document.body);
    fixTitle();

    // Observe page for dynamic content (SPA, AJAX, etc)
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(replaceText);
        }
        fixTitle();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
