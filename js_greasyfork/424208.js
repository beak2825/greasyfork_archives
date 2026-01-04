// ==UserScript==
// @name         foxAutoJustification
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  automatic justification field processor
// @author       Zoltan Gyorkei
// @match        https://foxautorent.wheelsys.io/ui/manage/master/rentalinvoice.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424208/foxAutoJustification.user.js
// @updateURL https://update.greasyfork.org/scripts/424208/foxAutoJustification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Get the current date
    var currentDate = new Date();
	//Get the current day of the month
    var currentDay = String(currentDate.getDate());
	//Add leading 0 if needed
    if (currentDay.length < 2) { currentDay = "0" + currentDay; }
	//Get current number month of the year - needs a +1 because return index starts from 0 not 1
    var currentMonth = String(currentDate.getMonth()+1);
	//Add leading 0 if needed
    if (currentMonth.length < 2) { currentMonth = "0" + currentMonth; }
	//Get current year
    var currentYear = currentDate.getFullYear();
	//Build the date for justification field
    var myDate = [currentYear, currentMonth, currentDay].join('-');
	//Debug
    //alert(myDate);
    //Fill the justification date automatically
    var justificationField = document.getElementById("rdJustification_text");
    if (justificationField) {
        justificationField.value=("Basic rental / Fulfillment date: " + myDate + " / Performance date: " + myDate);
    } else {
        alert("Justification field not present!");
    }
    //alert("Please check the dates in the justification field!");
})();