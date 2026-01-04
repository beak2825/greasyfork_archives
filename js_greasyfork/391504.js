// ==UserScript==
// @name         YouTube "Video paused. Continue watching?" Nuker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autoclick the pesky "Video paused. Continue watching?" message that pops up when YouTube plays a while without any user interation.
// @author       You
// @match        https://youtube.com/watch*
// @match        https://www.youtube.com/watch*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391504/YouTube%20%22Video%20paused%20Continue%20watching%22%20Nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/391504/YouTube%20%22Video%20paused%20Continue%20watching%22%20Nuker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setInterval(function(){
        $("#confirm-button").click();
    }, 5000);
})();