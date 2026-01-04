// ==UserScript==
// @name         Fix WhatsApp's Ctrl+Del hotkey
// @version      1.1
// @description  Disable WhatsApp's feature where Ctrl+Del deletes the current chat, instead of the default behavior of deleting the word after the cursor.
// @author       ajp_anton
// @license      MIT
// @match        https://web.whatsapp.com/
// @grant        none
// @namespace https://greasyfork.org/users/1454657
// @downloadURL https://update.greasyfork.org/scripts/532013/Fix%20WhatsApp%27s%20Ctrl%2BDel%20hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/532013/Fix%20WhatsApp%27s%20Ctrl%2BDel%20hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastInput = null;

    function attachListenerToInput(input) {
        if (!input || input._ctrlDelFixed) return;

        input.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Delete') {
                e.stopPropagation(); // Block chat deletion
            }
        }, true); // Use capture phase

        input._ctrlDelFixed = true; // Mark this input so we don’t attach again
        lastInput = input;
    }

    // Observe changes in the DOM
    const observer = new MutationObserver(() => {
        const input = document.querySelector('[contenteditable="true"][data-tab="10"]');
        if (input && input !== lastInput) {
            attachListenerToInput(input);
        }
    });

    // Start observing the whole document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
