// ==UserScript==
// @name         Ziroom Release Checker
// @namespace    http://msftbot.com/
// @version      0.1
// @description  Ziroom Release Checker, notify you when it's released.
// @author       You
// @match        https://*.ziroom.com/x/*.html
// @icon         https://www.google.com/s2/favicons?domain=ziroom.com
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/428395/Ziroom%20Release%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/428395/Ziroom%20Release%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkForUpdate() {
        var clsElements = document.querySelectorAll(".iconicon_release");
        var max = clsElements.length;

        if (max == 0) {
            GM_notification("Released!", "Take Action", null, 1000);
        }
        else{
            //GM_notification("Locked", "Monitoring", null, 1000);
            location.reload();
        }
    }

    setInterval(checkForUpdate, 5000);
})();