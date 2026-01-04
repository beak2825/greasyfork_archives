// ==UserScript==
// @name         DoorDash Store Info address Appender
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Appends store address info to the DoorDash store pages
// @author       Your Name
// @match        https://www.doordash.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/502218/DoorDash%20Store%20Info%20address%20Appender.user.js
// @updateURL https://update.greasyfork.org/scripts/502218/DoorDash%20Store%20Info%20address%20Appender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract store address from the page HTML
    function extractStoreAddress() {
        const html = document.documentElement.innerHTML;
        const addressRegex = /"displayAddress":"([^"]+)"/;
        const match = html.match(addressRegex);
        return match && match.length > 1 ? match[1] : null;
    }

    // Function to modify the h1 element content
    function modifyH1Content(address) {
        const h1Element = document.querySelector('h1');
        if (h1Element && address) {
            h1Element.innerText += ' (' + address + ')';
        }
    }

    // Observer callback to handle DOM changes
    function handleMutations(mutations, observer) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                const address = extractStoreAddress();
                if (address) {
                    modifyH1Content(address);
                    observer.disconnect(); // Stop observing after successful modification
                    break;
                }
            }
        }
    }

    // Main function to run the script
    function main() {
        const observer = new MutationObserver(handleMutations);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run the main function when the DOM is ready
    main();
})();
