// ==UserScript==
// @name         Freelancer Auto Reloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically reload Freelancer dashboard at random intervals for staying online.
// @author       joybarmon329620
// @match        https://www.freelancer.com/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494238/Freelancer%20Auto%20Reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/494238/Freelancer%20Auto%20Reloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to reload the Freelancer dashboard
    function reloadDashboard() {
        location.reload();
    }

    // Generate a random interval between 30 to 180 seconds
    var interval = Math.floor(Math.random() * (180000 - 30000 + 1)) + 30000;

    // Reload the dashboard after the random interval
    setInterval(reloadDashboard, interval);
})();
