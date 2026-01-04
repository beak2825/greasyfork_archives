// ==UserScript==
// @name         MilkyWayIdle Edge Canary Scaler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scale down Milky Way Idle to be properly fit in Edge Canary when installed as a PWA
// @author       You
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529651/MilkyWayIdle%20Edge%20Canary%20Scaler.user.js
// @updateURL https://update.greasyfork.org/scripts/529651/MilkyWayIdle%20Edge%20Canary%20Scaler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const topSpacing = 12; // Change this value to adjust the spacing

    // Create and inject CSS to adjust height properly
    let style = document.createElement('style');
    style.innerHTML = `
        html, body {
            height: calc(100vh - ${topSpacing}px) !important; /* Make the site think the screen is smaller */
            overflow: hidden;
            margin: 0;
            padding-top: ${topSpacing}px; /* Add space at the top */
            box-sizing: border-box;
        }
    `;
    document.head.appendChild(style);
})();
