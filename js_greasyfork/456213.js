// ==UserScript==
// @name         YouTube - Remove YouTube shorts from subscriptions
// @match        *://www.youtube.com/*
// @version      0.1
// @author       MaximeB
// @description  YouTube - Remove YouTube shorts from subscriptions list
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/994177
// @downloadURL https://update.greasyfork.org/scripts/456213/YouTube%20-%20Remove%20YouTube%20shorts%20from%20subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/456213/YouTube%20-%20Remove%20YouTube%20shorts%20from%20subscriptions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS
    var sheet = document.createElement('style');
    sheet.innerHTML = `
        ytd-browse ytd-grid-video-renderer:has(span.ytd-thumbnail-overlay-time-status-renderer[aria-label="Shorts"]) { display: none !important; }
    `;
    document.head.appendChild(sheet);
})();
