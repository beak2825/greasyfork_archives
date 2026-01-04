// ==UserScript==
// @name         P&W Obl Team Automation
// @version      1.0
// @namespace    https://example.com/
// @description  Automate the process of hosting a home game for a P&W Obl Team
// @match        https://politicsandwar.com/obl/team/id=95894
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/460240/PW%20Obl%20Team%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/460240/PW%20Obl%20Team%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hostHomeGame() {
        // Find and click the Host Home Game button
        var hostBtn = $("a:contains('Host Home Game')");
        if (hostBtn.length) {
            hostBtn.click();
        }

        // Wait for the page to load and find the Host Home Game button again
        setTimeout(function() {
            var hostBtn2 = $("a:contains('Host Home Game')");
            if (hostBtn2.length) {
                hostBtn2.click();
            }

            // Wait for the page to load and click the Back to Team button
            setTimeout(function() {
                var backBtn = $("a:contains('Back to Team')");
                if (backBtn.length) {
                    backBtn.click();
                }

                // Wait for 10 seconds and repeat the process
                setTimeout(hostHomeGame, 10000);
            }, 1000);
        }, 1000);
    }

    // Start the process
    hostHomeGame();
})();
