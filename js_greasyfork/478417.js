// ==UserScript==
// @name         Print Own Code on $
// @namespace    your-namespace
// @version      1.0
// @description  Print the code of this user script when you press the $ key
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478417/Print%20Own%20Code%20on%20%24.user.js
// @updateURL https://update.greasyfork.org/scripts/478417/Print%20Own%20Code%20on%20%24.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to print the script code
    function printScriptCode() {
        const scriptElements = document.querySelectorAll('script');
        for (const script of scriptElements) {
            if (script.src === '' && script.textContent.includes('// ==UserScript==')) {
                console.log(script.textContent);
            }
        }
    }

    // Function to handle the keyboard event
    function handleKeyPress(event) {
        if (event.key === '$') {
            printScriptCode();
        }
    }

    // Add a keyboard event listener
    document.addEventListener('keydown', handleKeyPress);
})();
