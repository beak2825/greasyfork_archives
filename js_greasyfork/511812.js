// ==UserScript==
// @name         Replace Train with Exercise
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace "train" with "exercise" on Torn Gym page, to help people suffering with Siderodromophobia
// @author       hexxeh[2428617]
// @license MIT
// @match        https://www.torn.com/gym.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511812/Replace%20Train%20with%20Exercise.user.js
// @updateURL https://update.greasyfork.org/scripts/511812/Replace%20Train%20with%20Exercise.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(/\btrain\b/gi, 'exercise');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Replace text in input fields and buttons
            if (node.tagName === 'BUTTON' || node.tagName === 'INPUT') {
                node.value = node.value.replace(/\btrain\b/gi, 'exercise');
            }
            // Check for child nodes
            node.childNodes.forEach(replaceText);
        }
    }

    // Run replacement after the page fully loads
    window.addEventListener('load', () => {
        replaceText(document.body);
    });

    // Observe changes to the body for dynamic content
    const observer = new MutationObserver(() => {
        replaceText(document.body);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();