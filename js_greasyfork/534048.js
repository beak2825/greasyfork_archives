// ==UserScript==
// @name         Cool Jazz Font
// @namespace    http://tampermonkey.net/ (or your personal URL)
// @version      1.1
// @description  Applies Cool Jazz font to web pages
// @author       You (or your name/handle)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534048/Cool%20Jazz%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/534048/Cool%20Jazz%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a style element
    const style = document.createElement('style');

    // Define the CSS rules
    // Note: @match *://*/* applies this font globally, which might not always be desired.
    // Consider restricting @match or adding @exclude rules if needed.
    style.textContent = `
        /* Import the Cool Jazz font */
        @import url('https://fonts.cdnfonts.com/css/cool-jazz-2');

        /* Apply the font to the entire page body */
        body {
            /* Use Cool Jazz, falling back to Arial, then generic sans-serif */
            font-family: 'Cool Jazz', Arial, sans-serif !important;
        }
    `;

    // Append the style element to the document's head
    document.head.appendChild(style);

})();
