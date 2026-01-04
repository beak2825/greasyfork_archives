// ==UserScript==
// @name         Unblur Slack Messages (+ remove upgrade banners)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unblurs messages older than 90 days and removes the premium ads
// @author       Devappl
// @match        https://*.slack.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487181/Unblur%20Slack%20Messages%20%28%2B%20remove%20upgrade%20banners%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487181/Unblur%20Slack%20Messages%20%28%2B%20remove%20upgrade%20banners%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified classes from elements
    function removeClasses() {
        // Remove "c-message_kit__hidden_message_blur" class
        document.querySelectorAll('.c-message_kit__hidden_message_blur').forEach(function(element) {
            element.classList.remove('c-message_kit__hidden_message_blur');
        });

        // Fully remove elements with the "p-upgrades_alert_banner_v2" class
        document.querySelectorAll('.p-upgrades_alert_banner_v2').forEach(function(element) {
            element.remove();
        });
    }

    // Run the function at intervals of 100 Miliseconds
    setInterval(removeClasses, 100);
})();
