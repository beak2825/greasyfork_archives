// ==UserScript==
// @name         DateInputHelper - Jono Edition
// @namespace    https://greasyfork.org/en/scripts/411884-dateinputhelper
// @version      1.2
// @description  Assist in selecting dates for less clicking!
// @author       grajef@
// @match        https://aftlite-na.amazon.com/labor_tracking/labor_summary*
// @match        https://aftlite-na.amazon.com/labor_tracking/view_daily_detail*
// @match        https://aftlite-na.amazon.com/labor_tracking/uph_drilldown*
// @match        https://aftlite-na.amazon.com/labor_tracking/generate_daily_detail_report*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412700/DateInputHelper%20-%20Jono%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/412700/DateInputHelper%20-%20Jono%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var buttons = document.getElementsByTagName("h2")[0]; // first title on page. use this to append buttons
    var button_currentHour = createButton("Current Hour");
    button_currentHour.onclick = function () {
        var d = new Date();
        setDate(d, d);
    };

    var button_6AMto6PM = createButton("6AM-6PM");
    button_6AMto6PM.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000);
        var endDate = new Date(d);
        d.setHours(6);
        endDate.setHours(17);
        setDate(d, endDate);
    }
    var button_6PMto6AM = createButton("6PM-6AM");
    button_6PMto6AM.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000);
        var endDate = new Date(d);
        d.setHours(18);
        endDate.setHours(5);
        setDate(d, endDate);
    }
       var button_9PMto3AM = createButton("9PM-4AM");
    button_9PMto3AM.onclick = function() {
        var d = new Date();
        d = new Date(d.getTime() - 3600000);
        var endDate = new Date(d);
        d.setHours(21);
        endDate.setHours(3);
        setDate(d, endDate);
    }

    buttons.innerHTML += "<br>";
    buttons.appendChild(button_6AMto6PM);
    buttons.appendChild(button_6PMto6AM);
    buttons.appendChild(button_9PMto3AM);


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