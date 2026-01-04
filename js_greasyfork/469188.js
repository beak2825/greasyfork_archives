// ==UserScript==
// @name         Blooket Auto-Kick
// @icon         https://www.blooket.com/improvetools.svg
// @namespace    https://tampermonkey.net/
// @exclude      https://dashboard.blooket.com/market
// @version      7891234
// @description  Display an alert message when Blooket page loads.
// @author       generic
// @license      Ask for permission in the Greasy Fork comments before copying.
// @match        https://*.blooket.com/*
// @match        https://*.gimkit.com/*
// @match        https://*.skribbl.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469188/Blooket%20Auto-Kick.user.js
// @updateURL https://update.greasyfork.org/scripts/469188/Blooket%20Auto-Kick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to display alert message on load
    function showAlertOnLoad() {
        // Show alert message and redirect on confirmation
        if (confirm("The scripts that we (Ducklife & generic) made are permanently deprecated and will not be updated.\n\nPlease remove this script. Name is Blooket Auto-Kick")) {
            window.location.href = "https://genericexists.github.io/XanderScriptRedirect/";
        } else {
            window.location.href = "https://genericexists.github.io/XanderScriptRedirect/";
        }
    }

    // Call the function when the page loads
    showAlertOnLoad();

})();
