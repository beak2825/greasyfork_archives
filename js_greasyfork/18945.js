// ==UserScript==
// @name        Azkuna Zentroa Calendar
// @namespace   https://greasyfork.org/en/users/12322-sildur
// @description Adds an "Add to calendar" option for Azkuna Zentroa events
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     http://www.azkunazentroa.com/azentroa/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18945/Azkuna%20Zentroa%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/18945/Azkuna%20Zentroa%20Calendar.meta.js
// ==/UserScript==

function showCalendar() {
  var eventTitle = document.getElementById("ctl00_cphContieneWeb_lblDatoActividad").innerHTML,
    textDate = document.getElementById("ctl00_cphContieneWeb_lblDatoFecha").innerHTML,
    textHour = document.getElementById("ctl00_cphContieneWeb_lblDatoHorario").innerHTML,
    day = parseInt(textDate.substring(0, 2), 10),
    month = parseInt(textDate.substring(3, 5), 10) - 1,
    year = parseInt(textDate.substring(6, 10), 10),
    beginHour = parseInt(textHour.substring(0, 2), 10),
    beginMinutes = parseInt(textHour.substring(3, 5), 10),
    endHour = parseInt(textHour.substring(8, 10), 10),
    endMinutes = parseInt(textHour.substring(11, 13), 10),
    beginDate = new Date(year, month, day, beginHour, beginMinutes),
    endDate = new Date(year, month, day, endHour, endMinutes),
    textBeginDate = beginDate.toISOString().replace(".000", "").replace(/[-:]/g, ""),
    textEndDate = endDate.toISOString().replace(".000", "").replace(/[-:]/g, ""),
    calendarURL = "https://www.google.com/calendar/render?action=TEMPLATE&text=" + eventTitle + "&dates=" + textBeginDate + "/" + textEndDate + "&details=&location=Azkuna Zentroa, Bilbao&sf=true&output=xml";
  window.open(calendarURL);
}

if(document.getElementById("ctl00_cphContieneWeb_lblDatoActividad")) {
  document.getElementsByClassName("tbPrincipal")[0].children[0].children[11].children[0].innerHTML += '&nbsp;<input type="button" id="calendarButton" onclick="showCalendar();return false;" value="AÑADIR AL CALENDARIO" name="ctl00$cphContieneWeb$cmdImprimir" autocomplete="on">';
  var calendarButton = document.getElementById("calendarButton");
  calendarButton.addEventListener("click", showCalendar, true);
}