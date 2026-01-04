// ==UserScript==
// @name         YouTube No Scroll Down clicking blank space (Chapter Text Clickable Only)
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Disable clicks on the ytp-chapter-container but keep text clickable, restore to original design and make clicking the player bar does nothing instead of scrolling down annoyingly
// @author       Ed
// @license      BSD-3-Clause
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519102/YouTube%20No%20Scroll%20Down%20clicking%20blank%20space%20%28Chapter%20Text%20Clickable%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519102/YouTube%20No%20Scroll%20Down%20clicking%20blank%20space%20%28Chapter%20Text%20Clickable%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom CSS
    GM_addStyle(`
        :not(.ytp-exp-bottom-control-flexbox) .ytp-chapter-container {
            pointer-events: none !important; /* Disable clicks on the container */
        }
        :not(.ytp-exp-bottom-control-flexbox) .ytp-chapter-container .ytp-button,
        :not(.ytp-exp-bottom-control-flexbox) .ytp-chapter-container .ytp-chapter-title-content {
            pointer-events: auto !important; /* Enable clicks on buttons and text content */
        }
    `);
})();