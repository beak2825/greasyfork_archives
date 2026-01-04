// ==UserScript==
// @name         Biologiepagina Turn Off AdBlocker Bypass
// @name:nl         Geen last meer van antiadblocker op biologiepagina.nl
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Deletes the ad blocker dialog on biologiepagina.nl
// @description:nl Verwijder adblocker pop up op biologiepagina.nl
// @author       KABAMJ0
// @license MIT
// @match        https://biologiepagina.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523538/Biologiepagina%20Turn%20Off%20AdBlocker%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/523538/Biologiepagina%20Turn%20Off%20AdBlocker%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the dialog
    function removeAdBlockDialog() {
        const dialog = document.querySelector('.fc-dialog-container');
        if (dialog) {
            dialog.remove();
            console.log('Ad blocker dialog removed.');
        }
    }

    // Run the function on page load
    document.addEventListener('DOMContentLoaded', removeAdBlockDialog);

    // MutationObserver to handle dynamically injected dialogs
    const observer = new MutationObserver(removeAdBlockDialog);
    observer.observe(document.body, { childList: true, subtree: true });
})();
