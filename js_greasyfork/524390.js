// ==UserScript==
// @name         SillyTavern helper
// @namespace    http://tampermonkey.net/
// @version      2025-09-18
// @description  Make sillytavern more usable
// @author       You
// @match        http://192.168.0.70:18000/
// @match        http://127.0.0.1:18000/
// @match        https://tavern.ytm.nl/
// @icon         https://icons.duckduckgo.com/ip2/0.70.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524390/SillyTavern%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/524390/SillyTavern%20helper.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log("Userscript initialized.");

    let ignoreNextRightArrow = false;

    // Function to simulate keypress
    function simulateKeyPress(element, keyCode) {
        console.log(`Simulating key press for keyCode: ${keyCode}`);

        // Create and dispatch keydown event
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: keyCode === 27 ? 'Escape' : 'ArrowRight',
            code: keyCode === 27 ? 'Escape' : 'ArrowRight',
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(keyDownEvent);

        // Create and dispatch keyup event
        const keyUpEvent = new KeyboardEvent('keyup', {
            key: keyCode === 27 ? 'Escape' : 'ArrowRight',
            code: keyCode === 27 ? 'Escape' : 'ArrowRight',
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(keyUpEvent);
    }

    const send_button = document.getElementById('send_but');

    // Listen for keydown events on the entire document
    document.addEventListener('keydown', function(event) {
        // We only need to intervene if we're currently generating a message
        if(getComputedStyle(send_button).display !== 'none'){
			console.warn('Not generating message, skipping');
			return;
		}

        // Ignore the keypress if there are any modifier buttons
        if(event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)return;

        console.warn(`Received keydown event: ${event.key}`, event);

        if (event.key === 'ArrowRight') {
            if (ignoreNextRightArrow) {
                console.warn("Ignoring simulated Right Arrow key press.");
                ignoreNextRightArrow = false;
                //return;
            }

            // Check if the focused element is an input or textarea
            const activeElement = document.activeElement;
            const isInputOrTextarea = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
            console.warn('active element', activeElement);

            if (!isInputOrTextarea || activeElement.id === 'send_textarea') {
                if(activeElement.tagName == 'TEXTAREA' && !!activeElement.value.trim())return;

                // Set flag to ignore the next simulated Right Arrow
                ignoreNextRightArrow = true;

                console.log("Right Arrow key detected. Simulating Esc and Right Arrow key presses.");

                // Prevent the default action of the right arrow
                event.preventDefault();

                // Simulate pressing Esc
                simulateKeyPress(document.body, 27); // 27 is the keycode for Esc

                // Simulate pressing Right Arrow
                window.setTimeout(() => simulateKeyPress(document.body, 39), 300); // 39 is the keycode for Right Arrow
            }
        }
    });
})();