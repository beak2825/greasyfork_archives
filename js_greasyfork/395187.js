// ==UserScript==
// @name         Remove COPPA / Live Studio
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clears old live dasboard to usable standarts.
// @author       roridev
// @match        https://www.youtube.com/live_dashboard?nv=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395187/Remove%20COPPA%20%20Live%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/395187/Remove%20COPPA%20%20Live%20Studio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Removes Live Studio
    document.getElementsByClassName("navless-header-info-message")[0].remove();
    document.getElementsByClassName("live-lcr-promo-text")[0].remove();
    document.getElementsByClassName("back-to-studio-button")[0].remove();
    var argv = document.getElementsByClassName("yt-alert-actionable");
    var argc = argv.length;
    for(var i = 0; i <= argc; i++)
    {
        argv[0].remove();
    }
})();