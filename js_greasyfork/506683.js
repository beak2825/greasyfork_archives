// ==UserScript==
// @name         Remove CNFans Modal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically removes the "keywords-modal" on cnfans.com pages
// @author       Your Name
// @match        *://*cnfans.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506683/Remove%20CNFans%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/506683/Remove%20CNFans%20Modal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the modal element
    function removeModal() {
        var modal = document.getElementById('keywords-modal');
        if (modal) {
            modal.remove();
            console.log('CNFans modal removed');
        }
    }

    // Run the function on page load
    window.addEventListener('load', removeModal);

    // Optional: If the modal is loaded dynamically, use MutationObserver to catch it
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                removeModal();
            }
        });
    });

    // Start observing the document for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
})();
