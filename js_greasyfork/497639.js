// ==UserScript==
// @name         Auto 2K Resolution
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to set resolution to 2K on supported devices
// @author       Tae Parlay
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497639/Auto%202K%20Resolution.user.js
// @updateURL https://update.greasyfork.org/scripts/497639/Auto%202K%20Resolution.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set resolution using CSS
    function setResolution() {
        var style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule('@media (min-width: 2560px) { body { transform: scale(1); } }');
    }

    // Run the script after DOM is fully parsed
    document.addEventListener('DOMContentLoaded', setResolution, false);
})();
