// ==UserScript==
// @name         Highlight Today in TimeTracking in Kimble grid view
// @namespace    http://canto.com/
// @version      0.4
// @description  Ever wanted to highlight the current day in the grid view of Kimble TimeTracking? This will do it!
// @author       Carsten Hoffmann
// @match        https://kimbleone.eu0.visual.force.com/apex/timesheetgrid*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10342/Highlight%20Today%20in%20TimeTracking%20in%20Kimble%20grid%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/10342/Highlight%20Today%20in%20TimeTracking%20in%20Kimble%20grid%20view.meta.js
// ==/UserScript==

var currentDate = new Date()
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
if (day < 10) day = "0" + day;
if (month < 10) month = "0" + month;
var stringDate = year + "-" + month + "-" + day;
$(".BusDay.TimePeriods[date='"+stringDate+"']").css("background-color", "lightcoral");

function highlightTodayCells() {
    var id = $(".BusDay.TimePeriods[date='"+stringDate+"']").attr("id");
    var cells = $("span[id*='"+id+"']")
    if (cells.size() > 0) {
        cells.parent().css("background", "coral");
    } else {
        setTimeout(highlightTodayCells, 2000);
    }
}

setTimeout(highlightTodayCells, 2000);