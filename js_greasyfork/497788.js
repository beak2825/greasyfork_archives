// ==UserScript==
// @name         Torn supply box open - remove animation and delay
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  Script to remove annoying animation and skip delay when opening multiple supply boxes on torn.com
// @author       bbeebs
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497788/Torn%20supply%20box%20open%20-%20remove%20animation%20and%20delay.user.js
// @updateURL https://update.greasyfork.org/scripts/497788/Torn%20supply%20box%20open%20-%20remove%20animation%20and%20delay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
    .pack-open-content, .pack-open-content * {
        transition: none !important;
        animation-duration: 0s !important;
        animation-fill-mode: forwards !important;
        animation-delay: 0s !important;
    }
    .disabled-link .open-another-cache {
        pointer-events: all !important;
        color: var(--default-blue-color) !important;
        cursor: pointer !important;
    }
` );

})();