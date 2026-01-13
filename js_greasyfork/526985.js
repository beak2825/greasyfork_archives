// ==UserScript==
// @name         Github recommendation blocker
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Remove github's recommendation/trending cards in the dashboard thread. It's triggered by HTML change, usually takes 5ms in PC Chrome browser.
// @author       dont-be-evil
// @match        https://github.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/526985/Github%20recommendation%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/526985/Github%20recommendation%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('h2').forEach(h2 => {
        if (h2.textContent.trim() === "Explore repositories") {
            h2.parentElement.remove();
        }
    });

    const keywords = ["Recommended for you", "Based on", "Popular among", "Popular projects among", "Trending repositories"];

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Ensure it's an element
                    node.querySelectorAll('article').forEach(card => {
                        let card_title = card.querySelector('h3');
                        if (keywords.some(keyword => card_title.textContent.includes(keyword))) {
                            console.log(card_title.textContent)
                            card.remove();
                        }
                    });
                }
            });
        });
    });

    // Observe the whole document, including subtree modifications
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // Function to observe shadow DOM elements
    function observeShadowRoots(node) {
        if (node.shadowRoot) {
            observer.observe(node.shadowRoot, { childList: true, subtree: true });
        }
    }

    // Observe shadow DOM elements dynamically added
    const shadowObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Ensure it's an element
                    observeShadowRoots(node);
                }
            });
        });
    });

    // Start observing for new shadow DOM elements
    shadowObserver.observe(document, {
        childList: true,
        subtree: true
    });


})();