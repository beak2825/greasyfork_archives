// ==UserScript==
// @name         javascript executor
// @namespace     javascript executor
// @description   executes javascript
// @version      1.1
// @match         http://*/*
// @grant        none
// @license MIT
// @creator https://www.youtube.com/joshclark756
// @downloadURL https://update.greasyfork.org/scripts/489124/javascript%20executor.user.js
// @updateURL https://update.greasyfork.org/scripts/489124/javascript%20executor.meta.js
// ==/UserScript==
// Function to be called when the hotkey (\) is pressed
function handleHotkeyPress(event) {
    // Check if the backslash key is pressed
    if (event.key === '\\') {
        // Use a prompt to get user input
        let code = prompt("Enter your JavaScript code:");
        try {
            eval(code);
        } catch (error) {
            console.error("An error occurred while executing the code:", error);
        }
    }
}

// Add an event listener to the document for keydown events
document.addEventListener('keydown', handleHotkeyPress);