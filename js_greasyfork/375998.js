// ==UserScript==
// @name         Geohive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use right arrow to move to next image
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *s3.amazonaws.com/mturk_bulk*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375998/Geohive.user.js
// @updateURL https://update.greasyfork.org/scripts/375998/Geohive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ($("h3:contains('Drop Markers on the Image for all Occurrences of the Objects Listed on the Left.')").length) {
        console.log("Geohive");
        document.onkeydown = function (k) {
           if (k.keyCode === 39)
               $("#nextButton").click();
        }
    }
})();