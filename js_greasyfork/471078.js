// ==UserScript==
// @name         Change Color on Vanced YouTube apt 3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes color on Vanced YouTube website.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471078/Change%20Color%20on%20Vanced%20YouTube%20apt%203.user.js
// @updateURL https://update.greasyfork.org/scripts/471078/Change%20Color%20on%20Vanced%20YouTube%20apt%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a custom style to replace the color
    var customStyle = `
        .ftl, #footer a {
            color: #666 !important;
        }
    `;

    // Add the custom style to the document
    GM_addStyle(customStyle);
})();
