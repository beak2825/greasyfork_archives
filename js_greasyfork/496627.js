// ==UserScript==
// @name        Remove Slack app banner
// @namespace   Violentmonkey Scripts
// @match       https://app.slack.com/client/*
// @grant       none
// @version     1.0
// @author      ramnes
// @license     WTFPL
// @description Remove the boring "Stop juggling tabs, download the Slack app" banner
// @downloadURL https://update.greasyfork.org/scripts/496627/Remove%20Slack%20app%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/496627/Remove%20Slack%20app%20banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeClasses() {
        // Remove the banner
        document.querySelectorAll('.p-workspace_banner__desktop-download-app').forEach(function(element) {
            element.remove();
        });
    }

    // Run the function every second
    setInterval(removeClasses, 1000);
})();
