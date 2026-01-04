// ==UserScript==
// @name         Days since Prequeladventure update
// @namespace    https://www.prequeladventure.com/fanartbooru/user/amkitsune
// @version      1.3
// @description  Displays how many days have passed since an update.
// @author       AMKitsune
// @include      https://www.prequeladventure.com/
// @include      /https:\/\/www\.prequeladventure\.com\/\d.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33866/Days%20since%20Prequeladventure%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/33866/Days%20since%20Prequeladventure%20update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var titleDiv = document.getElementsByClassName('title')[0];
    var rawDay = document.getElementsByClassName('date')[0].getElementsByClassName('day')[0];
    var rawMonth = document.getElementsByClassName('date')[0].getElementsByClassName('month')[0];
    var rawYear = document.getElementsByClassName('date')[0].getElementsByClassName('year')[0];
    var day = rawDay.textContent;
    var month = null;
    var year = rawYear.textContent;


    switch (rawMonth.textContent) {
        case "Jan":month = 0;break;
        case "Feb":month = 1;break;
        case "Mar":month = 2;break;
        case "Apr":month = 3;break;
        case "May":month = 4;break;
        case "Jun":month = 5;break;
        case "Jul":month = 6;break;
        case "Aug":month = 7;break;
        case "Sep":month = 8;break;
        case "Oct":month = 9;break;
        case "Nov":month = 10;break;
        case "Dec":month = 11;break;
    }

    var updateDate = new Date(year,month,day);
    var currentDate = new Date();
    var timeDifference = (currentDate.getTime() - updateDate.getTime());//milliseconds
    
    var textNode = document.createTextNode(msToText(timeDifference,3) + " since this update was released.");
    //alert(rawDay.textContent + ":" + rawMonth.textContent + ":" + rawYear.textContent);
    titleDiv.appendChild(textNode);

    function msToText(inputMS, levels) {
    var years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds;
	var array = [];
    var msRemaining = inputMS;
    if (msRemaining >= 31536000000) {
        years = Math.floor(msRemaining / 31536000000);
		array.push(years + (years==1?" year":" years"));
        msRemaining -= years * 31536000000;
    }

	if (msRemaining >= 31536000000/12) {
        months = Math.floor(msRemaining / (31536000000/12));
		array.push(months + (months==1?" month":" months"));
        msRemaining -= months * (31536000000/12);
    }

	if (msRemaining >= 604800000) {
        weeks = Math.floor(msRemaining / 604800000);
		array.push(weeks + (weeks==1?" week":" weeks"));
        msRemaining -= weeks * 604800000;
    }

	if (msRemaining >= 86400000) {
        days = Math.floor(msRemaining / 86400000);
		array.push(days + (days==1?" day":" days"));
        msRemaining -= days * 86400000;
    }

	if (msRemaining >= 3600000) {
        hours = Math.floor(msRemaining / 3600000);
		array.push(hours + (hours==1?" hour":" hours"));
        msRemaining -= hours * 3600000;
    }

	if (msRemaining >= 60000) {
        minutes = Math.floor(msRemaining / 60000);
		array.push(minutes + (minutes==1?" minute":" minutes"));
        msRemaining -= minutes * 60000;
    }

	if (msRemaining >= 1000) {
        seconds = Math.floor(msRemaining / 1000);
		array.push(seconds + (seconds==1?" second":" seconds"));
        msRemaining -= seconds * 1000;
    }

	if(array.length > levels){
		array.length = levels;
	}

    return array.join(", ");
}

})();