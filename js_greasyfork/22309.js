// ==UserScript==
// @name         iDriveSafely Fool The Timer.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fool the timer
// @author       TheNextBillGates
// @include        http://www.idrivesafely.com/course/outputContentHtml.pl*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22309/iDriveSafely%20Fool%20The%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/22309/iDriveSafely%20Fool%20The%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready( function(){
        $("input[name='TIMESTAMP']").val($("input[name='TIMESTAMP']").val() - 120);//change timestamp in form to 120 seconds before page was actually loaded
        $("input[name='timerVal']").val('0:00');//not required but sets the time remaining display to 0:00
        vTimeReq = 0; //set javascript timer to 0
        vTotalTime = 120; //sets time on page to 120 seconds
        formSubmit();// skips the page
    });
})();