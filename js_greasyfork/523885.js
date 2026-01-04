// ==UserScript==
// @name         ScreenKing Unlock
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Unlock the ScreenKing app to display the "Video Sniffing" feature download button
// @author       ScreenKing Unlock
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523885/ScreenKing%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/523885/ScreenKing%20Unlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new style element
    const style = document.createElement('style');
    style.textContent = `
        .ybd_video_slide_d_ownItem_btn {
            display: inline !important;
        }
    `;

    // Add the style element to the head of the page
    document.head.appendChild(style);

    // Ensure the target elements are immediately visible
    document.querySelectorAll('.ybd_video_slide_d_ownItem_btn').forEach(el => {
        el.style.display = 'inline';
    });
})();