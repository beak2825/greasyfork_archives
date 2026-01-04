// ==UserScript==
// @name         Magic Mushroom Map Season Pass Bypass
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  Enable features disabled by the season pass on the site magicmushroommap.com.
// @match        https://www.magicmushroommap.com/map
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      The Unlicense
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/510025/Magic%20Mushroom%20Map%20Season%20Pass%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/510025/Magic%20Mushroom%20Map%20Season%20Pass%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check each inline script within the loaded html file.
    document.querySelectorAll("script").forEach(script => {

        // A certain script initializes the active pass as null, that's our script.
        if (script.textContent.includes("activePass:null")) {

            // Initialize the active pass as an empty object. The site merely checks if the pass is null, not whether it is actually valid.
            script.textContent = script.textContent.replace("activePass:null", "activePass:{}");
        }
    });
})();