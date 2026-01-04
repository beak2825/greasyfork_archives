// ==UserScript==
// @name         Mobile Digicode Keyboard Fix
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Makes the digicode input field focusable and show keyboard on mobile.
// @author       Your Name
// @match        https://www.dreadcast.net/Main*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537957/Mobile%20Digicode%20Keyboard%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/537957/Mobile%20Digicode%20Keyboard%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const inputId = 'lb_textinput_digicode-meuble';
    let attempts = 0;
    const maxAttempts = 20; // Try for 10 seconds (20 * 500ms)

    function initializeFix() {
        const digicodeInput = document.getElementById(inputId);

        if (digicodeInput) {
            console.log('Tampermonkey: Found digicode input:', digicodeInput);

            // 1. Store original attributes if needed for restoration (though likely not for this fix)
            // const originalOnFocus = digicodeInput.getAttribute('onfocus');
            // const originalOnBlur = digicodeInput.getAttribute('onblur');

            // 2. Remove potentially problematic inline event handlers
            // These might be preventing default focus behavior or setting `khable` in a way that breaks mobile.
            digicodeInput.onfocus = null; // More direct than removeAttribute for inline events
            digicodeInput.onblur = null;
            // Or, if they are added via addEventListener by other scripts, this won't remove them.
            // But for inline attributes, this is fine.
            console.log('Tampermonkey: Cleared inline onfocus and onblur handlers.');

            // 3. Function to handle focus and styling
            function handleFocusAndStyle(event) {
                console.log(`Tampermonkey: Digicode input event: ${event.type}`);

                // Prevent any default action that might be causing issues, though usually not needed for focus.
                // event.preventDefault(); // Use with caution, might break other things

                // Ensure the input is not readonly or disabled
                if (this.readOnly) {
                    this.readOnly = false;
                    console.log('Tampermonkey: Input was readonly, changed to false.');
                }
                if (this.disabled) {
                    this.disabled = false;
                    console.log('Tampermonkey: Input was disabled, changed to false.');
                }

                this.focus(); // Crucial part: Programmatically focus the element
                this.style.color = 'black'; // Replicate original onfocus style

                // For password fields, explicitly setting selection can sometimes help trigger keyboard
                // This is usually not necessary if .focus() works.
                // if (this.setSelectionRange) {
                //   const len = this.value.length;
                //   this.setSelectionRange(len, len);
                // }

                console.log('Tampermonkey: Focused and styled digicode input.');
            }

            // 4. Add new event listeners to handle touch/click and ensure focus
            // 'click' often works for touch as well, but 'touchstart' can be more direct.
            // Using 'touchend' can sometimes be better to avoid focus on scroll.
            digicodeInput.addEventListener('click', handleFocusAndStyle);
            digicodeInput.addEventListener('touchstart', handleFocusAndStyle, { passive: true }); // {passive: true} if not calling preventDefault

            // 5. (Recommended for digicodes on mobile)
            // This helps bring up a numeric keypad.
            // If it's an alphanumeric code, remove or comment this out.
            // Check current type before changing, to be safe.
            if (digicodeInput.type === 'password' || digicodeInput.type === 'text') {
                 digicodeInput.inputMode = 'numeric'; // 'decimal' or 'tel' are other options for numeric input
                 console.log('Tampermonkey: Set inputMode to numeric.');
            }

            // Ensure it's not globally preventing keyboard via the `khable` variable, if possible.
            // This is speculative as we don't know how `khable` is used elsewhere.
            // If `khable = true` means "keyboard disabled by custom script", we'd want it false.
            // If `khable = false` means "custom script handles keyboard", this might conflict.
            // For now, we are bypassing its direct manipulation in onfocus/onblur.
            // window.khable = false; // Example: try setting it to what might enable native keyboard. Use with caution.


            console.log('Tampermonkey: Digicode fix applied. Try tapping the input.');

        } else {
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`Tampermonkey: Digicode input not found. Attempt ${attempts}/${maxAttempts}. Retrying in 500ms...`);
                setTimeout(initializeFix, 500);
            } else {
                console.error('Tampermonkey: Digicode input not found after multiple attempts. Script will not run. Check ID and @match URL.');
            }
        }
    }

    // Start the process
    // @run-at document-idle should mean the DOM is mostly ready.
    // But if the element is added even later by JS, the interval check helps.
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeFix();
    } else {
        document.addEventListener('DOMContentLoaded', initializeFix);
    }

})();