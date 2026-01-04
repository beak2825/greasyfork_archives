// ==UserScript==
// @name         Pathfinder's Golarion calendar formatting
// @namespace    lander_scripts
// @version      1.1
// @description  Formats the calendar to better resemble homebrew media.
// @match        https://dungeonetics.com/calendar/printable.html*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @grant        none
// @icon         https://img.icons8.com/dotty/2x/calendar-11.png
// @downloadURL https://update.greasyfork.org/scripts/383205/Pathfinder%27s%20Golarion%20calendar%20formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/383205/Pathfinder%27s%20Golarion%20calendar%20formatting.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){ //jquery rdy check


        $("#year_header") // Title
            .css("background-color", "transparent")
            .css("color", "#651e0e")
            .css("font-family", "AuldMagick")
            .css("font-size", "120px")
            .css("padding", "0")
            .css("border", "0")
            .css("font-weight", "normal")
        ;

        $(".large_calendar .ccal_month_header") //Big Calender Title
            .css("background-color", "transparent")
            .css("color", "#651e0e")
            .css("font-family", "AuldMagick")
            .css("font-size", "100px")
            .css("padding", "0")
            .css("border-top", "0")
            .css("border-left", "0")
            .css("border-right", "0")
            .css("height", "110px")
            .css("font-weight", "normal")
        ;
        $(".large_calendar .ccal_day_prev_month div, .large_calendar .ccal_day_next_month div").css("opacity", "0.4"); //Big Calender - faded days from other months

        $(".small_calendar .ccal_calendar") //small calendar
            .css("border", "1px solid black")
            .css("text-align", "center")
        ;
        $(".small_calendar .ccal_month_header") //small calendar header
            .css("border", "0")
            .css("border-bottom", "1px solid black")
            .css("color", "#651e0e")
            .css("font-family", "'Maiandra GD'")
        ;
        $(".small_calendar .ccal_day_row_start") //small calendar row_start
            .css("border-left", "0")
        ;
        $(".small_calendar .ccal_day_row_end") //small calendar row_end
            .css("border-right", "0")
        ;
        $(".small_calendar .ccal_day_last_row") //small calendar last_row
            .css("border-bottom", "0")
        ;
        $(".small_calendar div.ccal_day") //small calendar day
            .css("font-size", "11px")
            .css("font-family", "'Gill Sans MT'")
            .css("border-right", "0")
            .css("padding", "1px")
        ;
        $(".small_calendar div.ccal_day_name") //small calendar day of the week names
            .css("border-bottom", "1pt solid #bbb")
        ;
        $(".small_calendar .calendar_year") //small calendar month names
            .text("")
        ;

    });//closes jquery rdy check
})();

console.info('Calendar Formating Script Loaded');