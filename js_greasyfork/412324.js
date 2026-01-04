// ==UserScript==
// @name         alfatraining-remove_logout_penalty_timer
// @namespace    https://nepomuc.com/
// @version      0.3
// @description  Showing continue button immediately, ignoring the penalty timer after not using "Logout" in last session.
// @author       nepomuc.com
// @match        https://cloud.alfanetz.de/err?errnr=1001
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412324/alfatraining-remove_logout_penalty_timer.user.js
// @updateURL https://update.greasyfork.org/scripts/412324/alfatraining-remove_logout_penalty_timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        document.getElementById('gobutton').style.setProperty("display", "block", "important");
        document.getElementById('js-progressbar').style.setProperty("display", "none", "important");
    }, 500);
})();