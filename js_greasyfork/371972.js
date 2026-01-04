// ==UserScript==
// @name         WaniKani Exact Review Time (24-h)
// @namespace    exapaw
// @author       exapaw
// @version      0.2
// @description  Replaces vague time to next review with exact time in 24-h format
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/
// @copyright    exapaw
// @license      MIT; http://opensource.org/licenses/MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371972/WaniKani%20Exact%20Review%20Time%20%2824-h%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371972/WaniKani%20Exact%20Review%20Time%20%2824-h%29.meta.js
// ==/UserScript==

(function() {
    var elReviewStatus = document.getElementsByClassName("review-status");
    var elNext = elReviewStatus[0].getElementsByClassName("next")[0];
    var elTime = elNext.getElementsByTagName("time")[0];

    // Date expects ms, while unix time is s
    var unixTimeAdjusted = parseInt(elTime.getAttribute("datetime")) * 1000;

    // Convert UTC to local time
    var exactLocalTime = new Date(unixTimeAdjusted);

    // Leave 'Available Now' as is
    if (exactLocalTime > Date.now())
    {
        // use toLocaleString() to pad integers
        var timeString = exactLocalTime.getHours().toLocaleString("en-US", { minimumIntegerDigits : 2 } ) + ":" + exactLocalTime.getMinutes().toLocaleString("en-US", { minimumIntegerDigits : 2 } );

        // Hide original time element, just in case something else depends on it
        elTime.style.display = "none";

        elNext.insertAdjacentHTML("afterbegin", '<span>'+ timeString + '</span>');
    }
})();