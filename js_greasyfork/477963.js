// ==UserScript==
// @name         Disable Ctrl+C Override
// @version      1.0
// @description  Prevents websites from overriding the default Ctrl+C copy functionality.
// @grant        none
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477963/Disable%20Ctrl%2BC%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/477963/Disable%20Ctrl%2BC%20Override.meta.js
// ==/UserScript==

(function() {
    function preventCopyOverride(e) {
        if (e.ctrlKey && e.keyCode === 67) { // Check for Ctrl+C
            e.preventDefault();
            e.stopImmediatePropagation();

            // Manually copy selected text to clipboard if there's a selection
            const selection = window.getSelection().toString();
            if (selection) {
                navigator.clipboard.writeText(selection);
            }
        }
    }

    document.addEventListener('keydown', preventCopyOverride, true);
})();
