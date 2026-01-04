// ==UserScript==
// @name         Force Text Copying Enhanced
// @namespace    https://viayoo.com/
// @version      0.2
// @description  Force-enable text copying across more browsers
// @author       You
// @run-at       document-end
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534330/Force%20Text%20Copying%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/534330/Force%20Text%20Copying%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply user-select: text to all elements with different prefixes and standard property
    document.querySelectorAll("*").forEach(function(el) {
        el.style.webkitUserSelect = 'text'; // For WebKit browsers (Chrome, Safari) [cite: 2]
        el.style.mozUserSelect = 'text';    // For Firefox
        el.style.msUserSelect = 'text';     // For Internet Explorer/Edge (older versions)
        el.style.userSelect = 'text';       // Standard property
    });

    // --- Optional: Attempt to re-enable copy/cut events ---
    // This part is more complex and might not work on all sites or could cause unintended side effects.
    // Use with caution and test thoroughly.

    /*
    document.addEventListener('copy', enableCopy);
    document.addEventListener('cut', enableCopy);
    document.addEventListener('selectstart', enableCopy);

    function enableCopy(e) {
        e.stopPropagation(); // Stop the event from propagating up the DOM tree
        // In some cases, you might need to explicitly set the clipboard data,
        // but stopping propagation is often enough to prevent sites from blocking the default action.
    }
    */

})();