// ==UserScript==
// @name         Nomicon After Dark
// @namespace    http://tampermonkey.net/
// @version      2025-02-20
// @description  Dark mode for Nomicon
// @author       Bl00dBought
// @match        https://nomicon.illuminatedcorp.com/*
// @icon         https://nomicon.illuminatedcorp.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527585/Nomicon%20After%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/527585/Nomicon%20After%20Dark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create dark mode CSS
    let darkModeCSS = `
        html, body, * {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
            border-color: #333 !important;
        }
        img, video {
            filter: brightness(80%) contrast(90%) !important;
        }
        a {
            color: #00bcd4 !important;
        }
    `;

    // Create a <style> element and append it to the document head
    let styleElement = document.createElement("style");
    styleElement.innerHTML = darkModeCSS;
    document.head.appendChild(styleElement);
})();