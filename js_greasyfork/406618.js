// ==UserScript==
// @name         Set Timesheet to Previous Week
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Checks the selected date for the week, and if it's later than today, select the previous option, unless already past Wednesday
// @author       You
// @match        https://timesheets.dialoggroup.biz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406618/Set%20Timesheet%20to%20Previous%20Week.user.js
// @updateURL https://update.greasyfork.org/scripts/406618/Set%20Timesheet%20to%20Previous%20Week.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // If the correct page is selected
    if(document.querySelectorAll('i')[1].textContent.includes("Week Ending Date"))
    {
        // Grab the select statement
        var select = document.querySelector('select');
        // Grab the currently selected date, and split it into day, month, and year
        var dateparts = select[select.selectedIndex].value.split('/');
        // Create a date object based on properly formatting the date derived from the dropdown
        var seldate = new Date(dateparts[2]+'-'+dateparts[1]+'-'+dateparts[0]);
        // If the Ending Date is after today, it's selected this week, so we change it to the previous value unless we're already past wednesday
        var curr = new Date(Date.now());
        if(seldate > Date.now() && curr.getDay() <= 3) {
            select.selectedIndex = select.selectedIndex-1;
        }
    }
})();