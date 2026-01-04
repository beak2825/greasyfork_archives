// ==UserScript==
// @name            Start YouTube Autoplay Off figuccio
// @namespace       https://greasyfork.org/users/237458
// @description     Turn off YouTube Autoplay
// @author          figuccio
// @version         0.1
// @match           https://*.youtube.com/*
// @run-at          document-start
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @icon            https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/460244/Start%20YouTube%20Autoplay%20Off%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/460244/Start%20YouTube%20Autoplay%20Off%20figuccio.meta.js
// ==/UserScript==
var $z = jQuery.noConflict();
$z(document).ready(function() {
    'use strict';
        function turnAutoplayOff() {
            let autoplayToggle = document.getElementsByClassName('ytp-autonav-toggle-button')[0];
            if (autoplayToggle.getAttribute('aria-checked') === "true") {
                autoplayToggle.click();
            }

        }
setInterval(turnAutoplayOff,5000);
GM_registerMenuCommand("stop riproduzione",turnAutoplayOff);
})();
