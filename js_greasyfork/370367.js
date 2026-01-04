// ==UserScript==
// @name    Hide Timers
// @namespace http://tampermonkey.net/
// @version 0.1
// @description     Remove timers and review/lesson numbers on the Dashboard
// @author RysingDragon
// @match https://www.wanikani.com/dashboard
// @grant none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/370367/Hide%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/370367/Hide%20Timers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var element = document.getElementsByClassName("review-status")[0];
    element.parentNode.removeChild(element);

    var lessons = document.getElementsByClassName("lessons wanikani-tour-1 wanikani-tour-2")[0].firstElementChild.firstElementChild;
    var reviews = document.getElementsByClassName("reviews wanikani-tour-3")[0].firstElementChild.firstElementChild;
    lessons.textContent = "*";
    reviews.textContent = "*";
})();