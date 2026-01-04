// ==UserScript==
// @name        Refresh Timely
// @namespace   Refresh Timely
// @description Refresh Timely which doesn't currently
// @license     MIT
// @author      joeltron
// @version     0.06
// @grant       none
// gettimley
// @include     *://gettimely.*
// @match       *://app.gettimely.com/calendar*

// @downloadURL https://update.greasyfork.org/scripts/438720/Refresh%20Timely.user.js
// @updateURL https://update.greasyfork.org/scripts/438720/Refresh%20Timely.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        document.getElementsByClassName("refresh")[0].click();
    }, 60000);

    function refreshAt(hours, minutes, seconds) {
        var now = new Date();
        var then = new Date();

        if(now.getHours() > hours ||
            (now.getHours() == hours && now.getMinutes() > minutes) ||
            now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
            then.setDate(now.getDate() + 1);
        }
        then.setHours(hours);
        then.setMinutes(minutes);
        then.setSeconds(seconds);

        var timeout = (then.getTime() - now.getTime());
        setTimeout(function() { window.location.reload(true); }, timeout);
    }

    // refresh just past midnight
    refreshAt(0, 0, 5);
})();