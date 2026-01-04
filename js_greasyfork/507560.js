// ==UserScript==
// @name         Panzoid Clipmaker Gen3 Layout Modifier
// @namespace    https://panzoid.com/
// @version      0.1
// @description  Move logo to left, buttons to right, and remove Try Gen4 button on Panzoid Clipmaker Gen3 tool.
// @author       YourName
// @match        https://panzoid.com/tools/gen3/clipmaker
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/507560/Panzoid%20Clipmaker%20Gen3%20Layout%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/507560/Panzoid%20Clipmaker%20Gen3%20Layout%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Move logo to the left
    GM_addStyle(`
        .header .logo {
            float: left !important;
        }
    `);

    // Move buttons to the right
    GM_addStyle(`
        .header .actions {
            float: right !important;
        }
    `);

    // Remove "Try Gen4" button
    GM_addStyle(`
        .header .actions a[href*="gen4"] {
            display: none !important;
        }
    `);

})();
