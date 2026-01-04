// ==UserScript==
// @name        Spreeder Remap Left-Right to PgDown-PgUp (presenter usage)
// @namespace   Violentmonkey Scripts
// @match       https://www.spreeder.com/app.php*
// @grant       none
// @license    MIT
// @version     1.0
// @author      chatGPT 4.0 Turbo
// @description 13/02/2024, 14:07:09
// @downloadURL https://update.greasyfork.org/scripts/487236/Spreeder%20Remap%20Left-Right%20to%20PgDown-PgUp%20%28presenter%20usage%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487236/Spreeder%20Remap%20Left-Right%20to%20PgDown-PgUp%20%28presenter%20usage%29.meta.js
// ==/UserScript==


document.addEventListener('keydown', function(e) {
    let simulatedEvent;

    // Check if the pressed key is 'Page Down'
    if (e.code === 'PageDown') {
        e.preventDefault(); // Prevent the default Page Down action

        // Create a new event that simulates the pressing of the Right Arrow key
        simulatedEvent = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39, // keyCode for Right Arrow
            which: 39, // Deprecated, but included for compatibility
            bubbles: true, // Event should bubble up through the DOM
            cancelable: true // Event can be canceled
        });
    }
    // Check if the pressed key is 'Page Up'
    else if (e.code === 'PageUp') {
        e.preventDefault(); // Prevent the default Page Up action

        // Create a new event that simulates the pressing of the Left Arrow key
        simulatedEvent = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            code: 'ArrowLeft',
            keyCode: 37, // keyCode for Left Arrow
            which: 37, // Deprecated, but included for compatibility
            bubbles: true, // Event should bubble up through the DOM
            cancelable: true // Event can be canceled
        });
    }

    // If a simulated event was created, dispatch it
    if (simulatedEvent) {
        document.dispatchEvent(simulatedEvent);
    }
});
