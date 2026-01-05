// ==UserScript==
// @name        UVic Timetable Format Fixer
// @namespace   https://greasyfork.org/users/2232-tayler-m
// @description Fixes Issues with the UVic Timetable Builder
// @include     https://www.uvic.ca/BAN2P/bwysched.p_course_search
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1721/UVic%20Timetable%20Format%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/1721/UVic%20Timetable%20Format%20Fixer.meta.js
// ==/UserScript==
$(function(){
    $('table.dataentrytable tbody p.rightaligntext, table.dataentrytable tbody p.centeraligntext').contents().unwrap();
          
    // moves the "Linked" indicator to the correct spot
    var linkedArray = $("table.dataentrytable tbody tr:contains('Linked')");
    linkedArray.splice(0, 1);
    linkedArray.each(function (index) {
        if ($(this).children().length < 2) {
            console.log($(this).children())
           $(this).contents().appendTo(this.previousElementSibling.previousElementSibling);
        }
    });
});