// ==UserScript==
// @name         Asana: days to the due date
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  You have x days before the due date
// @author       Tosho Hirasawa
// @match        https://app.asana.com/0/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408578/Asana%3A%20days%20to%20the%20due%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/408578/Asana%3A%20days%20to%20the%20due%20date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var str2date = (s) => {
        var days = ['Monday', 'Tuesday', 'Wednesday', 'Thurseday', 'Friday', 'Saturday', 'Sunday'];
        if (s == 'Today') { return new Date(); }
        if (s == 'Tomorrow') { return new Date((new Date()).getTime() + 24*60*60*1000); }
        if (days.indexOf(s) > -1) {
            var date = new Date();
            for (var i = 1; i < 7; i++) {
                date = new Date((new Date()).getTime() + i*24*60*60*1000);
                if (date.getDayName() == s) {
                    return date;
                }
            }
        }
        return new Date(s.contains(',') ? s : s + ',' + (new Date()).getFullYear());
    };

    // Your code here...
    const mobs = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            var duedate = m.target.querySelector('div.DueDate');
            if (duedate && !duedate.innerText.contains('(')) {
                var date_today = new Date();
                var date_due = str2date(duedate.innerText);
                var days_left = (date_due - date_today) / (1000 * 60 * 60 * 24);
                if (days_left > 0) {
                    duedate.innerText = duedate.innerText + ' (' + Math.ceil(days_left) + ' days)';
                }
            }
        });
    });

    mobs.observe(document.body, {
        subtree: true,
        childList: true,
    });
})();