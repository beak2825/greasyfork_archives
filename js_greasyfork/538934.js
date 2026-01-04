// ==UserScript==
// @name         paste
// @namespace    http://tampermonkey.net/
// @version      2024-08-02
// @description  paste!
// @author       You
// @match        https://*.jklm.fun/games/bombparty/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jklm.fun
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/538934/paste.user.js
// @updateURL https://update.greasyfork.org/scripts/538934/paste.meta.js
// ==/UserScript==

(function() {
    console.log("SUCCESS: PASTE ENABLED!")
    'use strict';

    // Your code here...


    // Select the input element inside .selfTurn
    const inputElement = document.querySelector('.selfTurn input');

    if (inputElement) {
        // Add a new paste event listener
        inputElement.addEventListener('paste', function(event) {
            // Stop the event from propagating to other listeners
            event.stopImmediatePropagation();

            // Allow the paste action
            setTimeout(() => {
                // Optionally handle the pasted content
                const pastedText = event.clipboardData.getData('text');
                inputElement.value += pastedText;
            }, 0);
        }, true);
    }
else{
console.log("Err!")
}

})();
