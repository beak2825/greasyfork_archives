// ==UserScript==
// @name         Oxford Booking
// @namespace    ox.ac.uk
// @version      0.3
// @description  Oxford Booking Extending
// @author       Yui
// @match        https://library-calendars.ox.ac.uk/r/new/availability*
// @icon         https://www.google.com/s2/favicons?domain=ox.ac.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439387/Oxford%20Booking.user.js
// @updateURL https://update.greasyfork.org/scripts/439387/Oxford%20Booking.meta.js
// ==/UserScript==

(function() {
    'use strict';
for(let i=0;i<150;i++){setTimeout(function(){$('#s-lc-session-warning-continue')[0].click();console.log(i);console.log(Date());$('.label.label-eq-avail')[0].innerHTML=i},255000*i)}
})();