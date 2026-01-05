// ==UserScript==
// @name         Redmine Hide Tasks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide tasks without remaining hours
// @author       Shuunen
// @match        *://*/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28530/Redmine%20Hide%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/28530/Redmine%20Hide%20Tasks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var allRemainingHours = document.querySelectorAll('.remaining_hours');

    for (var i = 0; i < allRemainingHours.length ; i++) {
        var task = allRemainingHours[i].parentElement;
        var remainingHours = parseInt(allRemainingHours[i].innerText);
        if (remainingHours === 0) { task.style.display = 'none'; }
    }

})();