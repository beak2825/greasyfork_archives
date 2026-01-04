// ==UserScript==
// @name         Force Enable Text Copying
// @version      0.2
// @description  Force-enables text copying, even on sites that disable it.
// @author       You (or your name/handle)
// @namespace    https://viayoo.com/ (or your personal URL)
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @icon         https://hermit.chimbori.com/config/userscripts/content-copy.svg
// @downloadURL https://update.greasyfork.org/scripts/534045/Force%20Enable%20Text%20Copying.user.js
// @updateURL https://update.greasyfork.org/scripts/534045/Force%20Enable%20Text%20Copying.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all elements on the page
    const allElements = document.querySelectorAll('*');

    // Loop through each element
    allElements.forEach(el => {
        // Force enable text selection using CSS user-select properties
        // Apply multiple versions for cross-browser compatibility
        try {
            el.style.webkitUserSelect = 'text'; /* Chrome, Safari, Opera */
            el.style.mozUserSelect = 'text';    /* Firefox */
            el.style.msUserSelect = 'text';     /* Internet Explorer/Edge (older) */
            el.style.userSelect = 'text';       /* Standard */
        } catch (e) {
            // Ignore errors (e.g., trying to style elements that don't support it)
            // console.error('Could not apply user-select:', el, e); // Uncomment for debugging
        }
    });

})();
