// ==UserScript==
// @name         MissAV.com Stop pause video_
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  Removed the function to force video to pause when moving focus
// @author       MC Moo Hyun
// @include      *://missav.*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504790/MissAVcom%20Stop%20pause%20video_.user.js
// @updateURL https://update.greasyfork.org/scripts/504790/MissAVcom%20Stop%20pause%20video_.meta.js
// ==/UserScript==

/*
(function() {
    'use strict';

    document.addEventListener('visibilitychange', (event) => {
        event.stopImmediatePropagation();
    }, true);

    document.addEventListener('blur', (event) => {
        event.stopImmediatePropagation();
    }, true);

    window.addEventListener('blur', (event) => {
        event.stopImmediatePropagation();
    }, true);
})();
*/
/*
(function() {
    'use strict';

    // Store the original addEventListener function.
    // We modify EventTarget.prototype because it's the base for window, document, and all elements.
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    // Redefine the addEventListener function.
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // Check if the event type is one we want to block.
        if (type === 'blur' || type === 'visibilitychange') {
            // Log a message to the console for debugging, so you know the script is working.
            console.log(`Tampermonkey: Blocked an event listener for "${type}".`);
            // By returning here, we prevent the original function from being called,
            // effectively blocking the website from adding its auto-pause listener.
            return;
        }

        // For all other event types, call the original addEventListener function.
        // This ensures the rest of the website functions normally.
        // We use .call(this, ...) to maintain the correct context.
        originalAddEventListener.call(this, type, listener, options);
    };

    console.log('Tampermonkey: Anti-pause script is active.');
})();

*/
// (Method 2: Override Player Action)
(function() {
    'use strict';

    // We need to wait for the page's scripts to create the 'window.player' object.
    // This interval will check for it periodically.
    const playerCheckInterval = setInterval(() => {
        // Check if the player object and its pause function exist yet.
        if (window.player && typeof window.player.pause === 'function') {
            // Once the player is found, stop the interval check.
            clearInterval(playerCheckInterval);

            console.log('Tampermonkey: Player object found. Overriding pause function.');

            // Store the original pause function in a variable.
            const originalPause = window.player.pause;

            // Redefine the player's pause function with our own logic.
            window.player.pause = function() {
                // This is the core logic:
                // If the document is hidden OR if the window does not have focus,
                // it means the pause was triggered automatically by the browser tab change.
                if (document.hidden || !document.hasFocus()) {
                    // Log that we blocked the pause and do nothing.
                    console.log('Tampermonkey: Automatic pause blocked because tab is not active.');
                    return; // By returning here, we prevent the original pause from happening.
                }

                // If the page is visible and has focus, it means the user likely
                // clicked the pause button manually.
                console.log('Tampermonkey: Manual pause allowed.');
                // Call the original pause function to actually pause the video.
                // We use .call(window.player) to ensure 'this' is set correctly.
                originalPause.call(window.player);
            };
        }
    }, 500); // Check every 500 milliseconds.
})();