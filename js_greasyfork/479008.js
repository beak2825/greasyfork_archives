// ==UserScript==
// @name        YouTube Ad Blocker Bypass
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.01
// @author      Björn
// @description 4.11.2023, 11:12:13
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479008/YouTube%20Ad%20Blocker%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/479008/YouTube%20Ad%20Blocker%20Bypass.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function closeAdBlockerNotAllowedWindow() {
        // Versuche, den Button anhand des <button>-Tags und des aria-label-Attributs "Schließen" zu finden
        var buttons = document.querySelectorAll('button[aria-label="Schließen"]');
        
        if (buttons.length > 0) {
            // Klicke auf das erste gefundene <button>-Element
            buttons[0].click();
        }
    }

    function handleMutation(mutationsList, observer) {
        closeAdBlockerNotAllowedWindow();
    }

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });

    // Beginne mit der Beobachtung, sobald die Seite geladen ist
    window.addEventListener('load', () => {
        closeAdBlockerNotAllowedWindow();
    });
})();
