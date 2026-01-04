// ==UserScript==
// @name         Gulf of America -> Gulf of Mexico correction
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace any instance of Gulf of America with Gulf of Mexico
// @author       Luke Warren
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526604/Gulf%20of%20America%20-%3E%20Gulf%20of%20Mexico%20correction.user.js
// @updateURL https://update.greasyfork.org/scripts/526604/Gulf%20of%20America%20-%3E%20Gulf%20of%20Mexico%20correction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace these variables with your desired phrase and replacement
    const targetPhrase = 'Gulf of America';
    const replacementText = 'Gulf of Mexico';

    // Function to replace text in a node
    function replaceText(node) {
        if (node.nodeType === 3) { // Text node
            const regex = new RegExp(targetPhrase, 'gi');
            node.nodeValue = node.nodeValue.replace(regex, replacementText);
        } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            for (let i = 0; i < node.childNodes.length; i++) {
                replaceText(node.childNodes[i]);
            }
        }
    }

    // Replace text on the page
    replaceText(document.body);

    // Observe changes and replace text dynamically
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                replaceText(mutation.addedNodes[i]);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Additional way to ensure that the text is replaced, even if the document is still loading
    document.addEventListener('DOMContentLoaded', () => {
        replaceText(document.body);
    });
})();
