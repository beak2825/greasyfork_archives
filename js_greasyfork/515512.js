// ==UserScript==
// @name         YouTube Black Icons
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes all YouTube icons black on all pages
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515512/YouTube%20Black%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/515512/YouTube%20Black%20Icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        /* Target all SVG icons on YouTube */
        ytd-icon,
        yt-icon,
        #icon,
        tp-yt-paper-icon-button {
            fill: black !important; /* Makes icons filled black */
            color: black !important; /* Sets text color for icons in buttons */
        }
        /* Additional styling for other YouTube SVGs */
        svg path,
        svg rect,
        svg circle {
            fill: black !important;
            color: black !important;
        }
    `;
    document.head.appendChild(style);
})();
