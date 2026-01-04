// ==UserScript==
// @name         Youtube Disable Paid Promotion Button
// @namespace    http://tampermonkey.net/
// @version      2025-01-28
// @description  Prevents the user from accidentally clicking on the "Includes Paid Promotion" button that appears when hovering over a thumbnail. Simply makes that button clickthrough via CSS.
// @author       iwersi
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526249/Youtube%20Disable%20Paid%20Promotion%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526249/Youtube%20Disable%20Paid%20Promotion%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    /* "Includes Paid Promotion" button  */
    .ytmPaidContentOverlayHost {
        pointer-events: none;
    }
    /* Div that contains the button */
    .ytInlinePlayerControlsTopLeftControls {
        pointer-events: none;
    }
    `);
})();