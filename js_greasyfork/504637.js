// ==UserScript==
// @name         WME JB Shortcut Enabler
// @description  Enables the "Add a new junction box" keyboard shortcut at L3
// @version      2024.08.22.04
// @author       Brandon28AU
// @license      MIT
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @grant        none
// @namespace https://greasyfork.org/users/1253347
// @downloadURL https://update.greasyfork.org/scripts/504637/WME%20JB%20Shortcut%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/504637/WME%20JB%20Shortcut%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let wmeJbShortcutEnablerAttempt = 0;

    (function waitForConfig() {
        const interval = setInterval(() => {
            wmeJbShortcutEnablerAttempt += 1;
            if (typeof W !== 'undefined' &&
                W.Config &&
                W.Config.big_junctions &&
                typeof W.Config.big_junctions.minRank !== 'undefined') {

                // Change the value to 2
                W.Config.big_junctions.minRank = 2;

                // Clear the interval
                clearInterval(interval);

                console.log("WME JB Shortcut Enabler: W.Config.big_junctions.minRank has been set to 2 (Level 3)");
            } else if (wmeJbShortcutEnablerAttempt >= 100) {
                // Clear the interval
                clearInterval(interval);

                console.error("WME JB Shortcut Enabler: Timed out - was unable to set W.Config.big_junctions.minRank within 10 seconds");
            }
        }, 100); // Check every 100ms
    })();

})();