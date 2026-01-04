// ==UserScript==
// @name         Auto 4K Resolution
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to set resolution to 4K on supported devices
// @author       Tae Parlay
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498084/Auto%204K%20Resolution.user.js
// @updateURL https://update.greasyfork.org/scripts/498084/Auto%204K%20Resolution.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set resolution using CSS
    function setResolution() {
        var style = document.createElement('style');
        document.head.appendChild(style);
        // This will apply the scaling to 4K resolution screens
        style.sheet.insertRule('@media (min-width: 3840px) { body { transform: scale(1); } }');
    }

    // Run the script after DOM is fully parsed
    document.addEventListener('DOMContentLoaded', setResolution, false);
})();
