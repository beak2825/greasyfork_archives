// ==UserScript==
// @name        remove savee.it premium nags
// @match       https://savee.it/*
// @grant       none
// @version     1.0
// @author      You
// @description 11/14/2024, 9:15:23 PM
// @namespace https://greasyfork.org/users/412954
// @downloadURL https://update.greasyfork.org/scripts/517427/remove%20saveeit%20premium%20nags.user.js
// @updateURL https://update.greasyfork.org/scripts/517427/remove%20saveeit%20premium%20nags.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let escapeTimeout;
    const processedDialogs = new Set();

    const textFilters = [
      'Savee is made 100% with curated inspiration',
      'You discovered a Premium only feature.'
    ];


    function containsFilteredText(element) {
        return textFilters.some((filter) => element.textContent.includes(filter));
    }

    function sendEscapeKey(dialog) {
        if (dialog && containsFilteredText(dialog) && !processedDialogs.has(dialog)) {
            console.log("Dialog found with target text in children, preparing to send Escape key.");

            processedDialogs.add(dialog);

            clearTimeout(escapeTimeout);

            escapeTimeout = setTimeout(() => {
                console.log("Sending Escape key to close the dialog.");
                dialog.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Escape',
                    bubbles: true,
                    cancelable: true
                }));
            }, 30); // Wait for 1 second
        }
    }

    const observer = new MutationObserver(() => {
        const dialogs = document.querySelectorAll('[data-headlessui-state]');

        dialogs.forEach((dialog) => {
            sendEscapeKey(dialog);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('[data-headlessui-state]').forEach((dialog) => {
        sendEscapeKey(dialog);
    });
})();