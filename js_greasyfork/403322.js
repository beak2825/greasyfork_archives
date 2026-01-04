// ==UserScript==
// @name         Conference messager
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sends an alert when a conference starts.
// @author       Matthias
// @match        https://canvas.utwente.nl/courses/*/conferences
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/403322/Conference%20messager.user.js
// @updateURL https://update.greasyfork.org/scripts/403322/Conference%20messager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        if (document.getElementsByClassName("join-button").length > 0) {
            GM_notification({
                text : "A conference is currently open.",
                title : "Conference Checker",
                timeout: 15000, // 15 seconds alive,
                highlight: true,
            })

        } else {
            location.reload();
        }
    }, 60000); // 30 seconds to load.

})();