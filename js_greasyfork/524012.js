// ==UserScript==
// @name         Torn Transform Text to Numeric Input
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Transforms various text inputs to number inputs (Only useful on mobile)
// @author       TheProgrammer
// @match        https://www.torn.com/page.php?sid=stocks*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524012/Torn%20Transform%20Text%20to%20Numeric%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/524012/Torn%20Transform%20Text%20to%20Numeric%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function transformToNumericInput(element) {
        element.type = 'number';
        // Optional: Set additional attributes if needed
        // element.pattern = '[0-9]*';
        // element.step = '0.01';
    }

    function processNewInputs(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('input.input-money:not([type="hidden"])')) {
                            transformToNumericInput(node);
                        } else if (node.hasChildNodes()) {
                            node.querySelectorAll('input.input-money:not([type="hidden"])').forEach(transformToNumericInput);
                        }
                    }
                });
            }
        }
    }

    function observeMutations() {
        const observer = new MutationObserver(processNewInputs);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run the script on page load and observe for mutations
    observeMutations();

})();
