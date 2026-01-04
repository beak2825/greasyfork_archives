// ==UserScript==
// @name         Increment Input on Ctrl+Shift+Enter
// @namespace    https://huggingface.co/
// @version      1.0.6
// @description  Increment input value and trigger event on Hugging Face Spaces page with Ctrl+Shift+Enter
// @author       YourName
// @match        https://huggingface.co/spaces/diffusers/unofficial-SDXL-Turbo-i2i-t2i
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509279/Increment%20Input%20on%20Ctrl%2BShift%2BEnter.user.js
// @updateURL https://update.greasyfork.org/scripts/509279/Increment%20Input%20on%20Ctrl%2BShift%2BEnter.meta.js
// ==/UserScript==

function incrementInputValue(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'Enter') {
        console.log('Ctrl+Shift+Enter pressed');
        const inputElement = document.querySelector('input[data-testid="incrementable-input"]');
        if (inputElement) {
            const currentValue = parseInt(inputElement.value, 10);
            if (!isNaN(currentValue)) {
                inputElement.value = currentValue + 1;
                const inputEvent = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(inputEvent);
                console.log('Value incremented and input event dispatched.');
            } else {
                console.warn('Current value is not a valid number. Increment not performed.');
            }
        } else {
            console.warn('No input element found with data-testid="incrementable-input".');
        }
    }
}

function attachKeydownListener() {
    const textarea = document.querySelector('textarea[data-testid="textbox"]');
    if (textarea && !textarea.listenerAttached) {
        textarea.addEventListener('keydown', incrementInputValue);
        textarea.listenerAttached = true;
        console.log('Keydown listener attached to the textarea.');
    }
}

function checkForElements() {
    attachKeydownListener();
}

// Start checking for elements immediately after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check every 1000ms (1 second) for the existence of the textarea and attach the listener if missing
    var checkForTextarea = setInterval(checkForElements, 1000);
    checkForElements(); // Immediate check
});