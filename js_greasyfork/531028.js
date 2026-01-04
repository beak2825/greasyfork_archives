// ==UserScript==
// @name         StopGame Copy Protection Remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Снимает защиту от копирования (выделение текста, щелчок правой кнопкой мыши) с StopGame.ru
// @author       YourName
// @match        *://stopgame.ru/*
// @license MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531028/StopGame%20Copy%20Protection%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/531028/StopGame%20Copy%20Protection%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('StopGame Copy Protection Remover: Initializing...');

    // --- CSS Override for Text Selection ---
    // Force enable text selection globally on the page using !important
    try {
        const style = document.createElement('style');
        style.textContent = `
            * {
                user-select: auto !important;
                -webkit-user-select: auto !important; /* Older WebKit */
                -moz-user-select: auto !important;    /* Firefox */
                -ms-user-select: auto !important;     /* IE/Edge */
            }
            body {
                 user-select: auto !important;
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
            }
        `;
        (document.head || document.body || document.documentElement).appendChild(style);
        console.log('StopGame Copy Protection Remover: CSS rules applied.');
    } catch (e) {
        console.error('StopGame Copy Protection Remover: Failed to apply CSS rules.', e);
    }

    // --- JavaScript Event Override ---
    // Intercept common events used for copy/selection/context menu protection
    // By using the capturing phase (true), we try to stop the event before
    // the site's own scripts can block it in the bubbling phase.
    const eventsToAllow = [
        'selectstart', // Fired when user starts selecting text
        'copy',        // Fired on Ctrl+C or context menu copy
        'contextmenu', // Fired on right-click
        'dragstart'    // Sometimes used to prevent selecting/dragging text/images
        // 'mousedown' // Can sometimes be involved, but might break other things
    ];

    eventsToAllow.forEach(eventName => {
        const interceptHandler = function(e) {
            // Stop the event from propagating further (to site's listeners)
            e.stopPropagation();
            // It's crucial *not* to call e.preventDefault() here,
            // as we *want* the default browser action (selecting, copying, menu) to occur.
            // Returning true might help in some older event models.
            return true;
        };

        // Add listener in the capturing phase
        document.addEventListener(eventName, interceptHandler, true);

        // As a fallback, try removing potential handlers directly on body/document
        // (less reliable as handlers might be attached elsewhere or dynamically)
        try {
            if (document.body) {
                 document.body[`on${eventName}`] = null;
            }
            document[`on${eventName}`] = null;
        } catch(e) {
            // Ignore errors here, might be security restrictions
        }
    });

    console.log(`StopGame Copy Protection Remover: Event listeners (${eventsToAllow.join(', ')}) intercepted.`);

    // Final message
    console.log('StopGame Copy Protection Remover: Script finished execution.');

})();