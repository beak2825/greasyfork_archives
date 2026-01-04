// ==UserScript==
// @name         DateInputHelper
// @namespace    https://greasyfork.org/en/scripts/411884-dateinputhelper
// @version      1.2
// @description  Assist in selecting dates for less clicking!
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/labor_summary*
// @match        https://aftlite-na.amazon.com/labor_tracking/view_daily_detail*
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown*
// @match        https://aftlite-na.amazon.com/labor_tracking/generate_daily_detail_report*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411884/DateInputHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/411884/DateInputHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var buttons = document.getElementsByTagName("h2")[0]; // first title on page. use this to append buttons
    var button_currentHour = createButton("Current Hour");
    button_currentHour.onclick = function () {
        var d = new Date();
        setDate(d, d);
    };

    var button_lastHour = createButton("Last Hour");
    button_lastHour.onclick = function () {
        var d = new Date();
        var date = new Date(d.getTime() - 3600000) // subtract one hour
        setDate(date, date);
    };

    var button_today = createButton("Today");
    button_today.onclick = function() {
        var d = new Date();
        var endDate = new Date(d.getTime() - 3600000)
        d.setHours(0);
        setDate(d, endDate);
    }

    var button_yesterday = createButton("Yesterday");
    button_yesterday.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000 * 24); // subtract one day
        var endDate = new Date(d);
        d.setHours(0);
        endDate.setHours(23);
        setDate(d, endDate);
    }

    var button_thisWeek = createButton("This Week");
    button_thisWeek.onclick = function() {
        var d = new Date();
        var startDate = new Date(d.getTime() - (3600000 * 24 * d.getDay())); // subtract days until we get to sunday, then set hour to 0 to get beginning of week
        startDate.setHours(0);
        setDate(startDate, d);
    }

    var button_lastWeek = createButton("Last Week");
    button_lastWeek.onclick = function() {
        var endDate = new Date();
        var startDate = new Date(endDate.getTime() - (3600000 * 24 * (endDate.getDay() + 7))); // subtract days until we get to sunday, then subtract 7 more to get last week
        startDate.setHours(0);
        endDate = new Date(startDate.getTime() + (3600000 * 24 * 6)); //add 7 days to get end of week
        endDate.setHours(23);
        setDate(startDate, endDate);
    }

    var button_yesterdayQ1 = createButton("Yesterday Q1");
    button_yesterdayQ1.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000 * 24); // subtract one day
        var endDate = new Date(d);
        d.setHours(0);
        endDate.setHours(5);
        setDate(d, endDate);
    }

    var button_yesterdayQ2 = createButton("Yesterday Q2");
    button_yesterdayQ2.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000 * 24); // subtract one day
        var endDate = new Date(d);
        d.setHours(6);
        endDate.setHours(11);
        setDate(d, endDate);
    }

        var button_yesterdayQ3 = createButton("Yesterday Q3");
    button_yesterdayQ3.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000 * 24); // subtract one day
        var endDate = new Date(d);
        d.setHours(12);
        endDate.setHours(17);
        setDate(d, endDate);
    }

        var button_yesterdayQ4 = createButton("Yesterday Q4");
    button_yesterdayQ4.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000 * 24); // subtract one day
        var endDate = new Date(d);
        d.setHours(18);
        endDate.setHours(23);
        setDate(d, endDate);
    }
        var button_TodayQ1 = createButton("Today Q1");
    button_TodayQ1.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000); // subtract one day
        var endDate = new Date(d);
        d.setHours(0);
        endDate.setHours(5);
        setDate(d, endDate);
    }
        var button_TodayQ2 = createButton("Today Q2");
    button_TodayQ2.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000); // subtract one day
        var endDate = new Date(d);
        d.setHours(6);
        endDate.setHours(11);
        setDate(d, endDate);
    }
        var button_TodayQ3 = createButton("Today Q3");
    button_TodayQ3.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000); // subtract one day
        var endDate = new Date(d);
        d.setHours(12);
        endDate.setHours(17);
        setDate(d, endDate);
    }
        var button_TodayQ4 = createButton("Today Q4");
    button_TodayQ4.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000); // subtract one day
        var endDate = new Date(d);
        d.setHours(18);
        endDate.setHours(23);
        setDate(d, endDate);
    }
    buttons.innerHTML += "<br>";
    buttons.appendChild(button_currentHour);
    buttons.appendChild(button_lastHour);
    buttons.appendChild(button_today);
    buttons.appendChild(button_yesterday);
    buttons.appendChild(button_thisWeek);
    buttons.appendChild(button_lastWeek);
    buttons.appendChild(button_yesterdayQ1);
    buttons.appendChild(button_yesterdayQ2);
    buttons.appendChild(button_yesterdayQ3);
    buttons.appendChild(button_yesterdayQ4);
    buttons.appendChild(button_TodayQ1);
    buttons.appendChild(button_TodayQ2);
    buttons.appendChild(button_TodayQ3);
    buttons.appendChild(button_TodayQ4);

    function createButton(name) {
        var button = document.createElement('button');
        button.innerHTML = name;
        return button;
    }

    function setDate(start, end) {
        document.getElementById("date_start_hour").selectedIndex = start.getHours();
        document.getElementById("date_start_day").value = start.getDate();
        document.getElementById("date_start_month").selectedIndex = start.getMonth();
        document.getElementById("date_start_year").value = start.getFullYear();
        document.getElementById("date_end_hour").selectedIndex = end.getHours();
        document.getElementById("date_end_day").value = end.getDate();
        document.getElementById("date_end_month").selectedIndex = end.getMonth();
        document.getElementById("date_end_year").value = end.getFullYear();
    }
})();