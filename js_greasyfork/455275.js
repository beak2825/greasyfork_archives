// ==UserScript==
// @name         Disboard Bumpa
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      0.2
// @description  Bumps server on disboard
// @author       Bunta
// @match        https://disboard.org/dashboard/servers
// @icon         https://disboard.org/favicon.ico
// @license      http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455275/Disboard%20Bumpa.user.js
// @updateURL https://update.greasyfork.org/scripts/455275/Disboard%20Bumpa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    // The delay to wait before the first check on page load (in seconds)
    const INITIAL_TIMEOUT = 10;
    // The time window to check for bumping after a successful bump (in minutes)
    const BUMP_SUCCESS_TIMEOUT = 120;
    // The time window to check for bumping after a failed bump (in minutes)
    const BUMP_FAILURE_TIMEOUT = 5;

    /*
     * Look for an active Bump button and click it if it exist
     */
    function checkBump() {
        // Get the BUMP button
        var bumpButton = $('a span:contains("Bump")');

        var d = new Date();
        // Found an active reward button
        if (bumpButton && bumpButton.length > 1) {
            for(let button in bumpButton) {
                // Click button(s)
                button.click();
            }
            console.log(d.toLocaleString()+" DISBOARDBUMPA: Servers Bumped!");
            setTimeout(checkBump, BUMP_SUCCESS_TIMEOUT*60*1000);
            return;
        } else if (bumpButton && bumpButton.length == 1) {
            bumpButton.click();
            console.log(d.toLocaleString()+" DISBOARDBUMPA: Server Bumped!");
            setTimeout(checkBump, BUMP_SUCCESS_TIMEOUT*60*1000);
            return;
        }

        console.log(d.toLocaleString()+" DISBOARDBUMPA: Bump not active");
        setTimeout(checkBump, BUMP_FAILURE_TIMEOUT*60*1000);
    }

    setTimeout(checkBump, INITIAL_TIMEOUT*1000);
})();