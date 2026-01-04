// ==UserScript==
// @name         Pomofocus 12-hour format
// @namespace    http://danwoj.com/
// @version      1.0
// @description  Updates the Finish at time every 5 seconds to use a 12 hour format
// @author       Dan Wojtowicz
// @match        https://pomofocus.io/app
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444478/Pomofocus%2012-hour%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/444478/Pomofocus%2012-hour%20format.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function () {
        let span = document.getElementsByClassName('sc-GMQeP kHCNYo')[2];
        let militaryTime = span.innerText;
        let hoursMinutes = militaryTime.split(':');
        let hours = hoursMinutes[0];
        let minutes = hoursMinutes[1]
        let newHours = hours > 12 ? hours - 12 : (hours == 0 ? 12 : hours);
        span.innerText = newHours + ":" + minutes;
    }, 5000);
})();