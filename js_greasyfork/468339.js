// ==UserScript==
// @name        GitHub Delete Repo Bypass
// @description A script that elegantly bypasses the verification code menu, useful for if you're mass-deleting repos.
// @version     0.2.3
// @author      QuarTheDev
// @match       *://*.github.com/*/settings
// @icon        https://github.githubassets.com/favicons/favicon-dark.png
// @license     GPL-3.0
// @namespace   https://quar.pages.dev/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/468339/GitHub%20Delete%20Repo%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/468339/GitHub%20Delete%20Repo%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bypass() {
        var deleteButton = document.querySelector('button[id="repo-delete-proceed-button"]');
        var primerTextField = document.querySelector('primer-text-field');

        // Enable button
        if (deleteButton) {
            deleteButton.removeAttribute('disabled');
        }

        // Remove unneccesary form
        if (primerTextField) {
            primerTextField.remove();
        }
    }

    // execute every 50ms
    setInterval(bypass, 50);
})();