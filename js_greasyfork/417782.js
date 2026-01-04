/*  vk_Zodiac - user script used to add zodiac sign and age into vk's profile page.
    
    Created: 07.02.2011 
    Last Changed: 04.12.2020

    This script is rebuilding of a 'IMDBAge v2.5' by Thomas Stewart.
*/

// ==UserScript==
// @name            vk_Zodiac
// @namespace       https://vk.com/drumtheatre
// @description	    Показывает знак зодиака и возраст в профайле на vk.com
// @author          DRUMtheatre
// @version         0.6.4
// @include         http://vk.com/*
// @include         https://vk.com/*
// @license         CC BY-NC-SA 4.0 International. https://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/417782/vk_Zodiac.user.js
// @updateURL https://update.greasyfork.org/scripts/417782/vk_Zodiac.meta.js
// ==/UserScript==

var born = new Date();

/*
calculates tropical zodiac sign
input:  month and day
output: tropical zodiac sign with label as string
*/
function zodiac(day, month) {
        var sign;
        
        // link the month and day to the sign
        if      (day >= 21 && month ==  3 || day <= 19 && month ==  4) sign = "Овен ♈";
        else if (day >= 20 && month ==  4 || day <= 20 && month ==  5) sign = "Телец ♉";
        else if (day >= 21 && month ==  5 || day <= 20 && month ==  6) sign = "Близнецы ♊";
        else if (day >= 21 && month ==  6 || day <= 22 && month ==  7) sign = "Рак ♋";
        else if (day >= 23 && month ==  7 || day <= 22 && month ==  8) sign = "Лев ♌";
        else if (day >= 23 && month ==  8 || day <= 22 && month ==  9) sign = "Дева ♍";
        else if (day >= 23 && month ==  9 || day <= 22 && month == 10) sign = "Весы ♎";
        else if (day >= 23 && month == 10 || day <= 21 && month == 11) sign = "Скорпион ♏";
        else if (day >= 22 && month == 11 || day <= 21 && month == 12) sign = "Стрелец ♐";
        else if (day >= 22 && month == 12 || day <= 19 && month ==  1) sign = "Козерог ♑";
        else if (day >= 20 && month ==  1 || day <= 18 && month ==  2) sign = "Водолей ♒";
        else if (day >= 19 && month ==  2 || day <= 20 && month ==  3) sign = "Рыбы ♓";

        // return text with label
        return sign;
}

/*
add sign to page
input: date person is born
*/
function addSign() {

	      // find place to stick the info
        var links = document.evaluate("//a[contains(@href,'[bday]')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // loop over all dates
        var link = links.snapshotItem(0);

        // create a containers
        var addon1 = document.createElement("span");
        addon1.style.color = "#808080";
        addon1.setAttribute("id", "zodiac");
 
        var addon2 = document.createElement("span");
        addon2.setAttribute("id", "zodiac");
        
        // determination colors of signs
        var $ = zodiac(born.getDate(), born.getMonth() + 1);
        if ($ == "Овен ♈" || $ == "Лев ♌" || $ == "Стрелец ♐") 
        addon2.style.color = "#FF6347";
        else if ($ == "Телец ♉" || $ == "Дева ♍" || $ == "Козерог ♑")
        addon2.style.color = "#1D1D1D";
        else if ($ == "Близнецы ♊" || $ == "Весы ♎" || $ == "Водолей ♒")
        addon2.style.color = "#9D9396";
        else addon2.style.color = "#6495ED";

        // fill a containers
        addon1.innerHTML = "&nbsp;&nbsp;|&nbsp;&nbsp;";
        addon2.innerHTML = $;

        // attach them
        link.parentNode.insertBefore(addon1, link.previousSibling);
        link.parentNode.insertBefore(addon2, link.previousSibling);
}

/*
add age of person to page
input: date person is born
*/
function addAge() {

	      // find the difference between two times
        var age = new Date() - born.getTime();
          
        // convert difference into years
        age = age / (1000 * 60 * 60 * 24 * 365.242199);
        
        // get nice values
        var years =  Math.floor(age);
        var months = Math.floor((age - years) * 10);
                  
        // try to determine 'word'
        var word;
        var dozens = Math.floor(years / 10);
        var delta = years - 10 * dozens;
        if ((years < 1) || ((years > 1) && (years < 5))) word = " года";
        else if (((years > 21) && ((delta > 1) && (delta < 5))) || ((delta == 1) && (months != 0))) word = " года";
        else if (((delta == 1) && (months == 0)) && ((years != 11) && (years != 111))) word = " год";
        else word = " лет";
       
        // don't show 0 month
        if (months > 0) months = "," + months;
        else months = "";
                       
        // loop over the tag involving dates
        var links = document.evaluate("//a[contains(@href,'[bday]')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            
        // loop over all dates
        var link = links.snapshotItem(0);

        // create a container
        var addon3 = document.createElement("span");
        addon3.setAttribute("style", "margin-left: 4px;");
        addon3.setAttribute("id", "zodiac");

        // fill a container
        addon3.innerHTML = " " + years + months + word;
            
        // attach it
        link.parentNode.insertBefore(addon3, link.previousSibling);
}

// get year from profile page
function getYear() {

	      // loop over the tag involving dates
        var y_links = document.evaluate("//a[contains(@href,'[byear]')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // loop over all dates
        for (var i = 0; i < y_links.snapshotLength; i++) {
             var y_link = y_links.snapshotItem(i);
             var y_href = y_link.getAttribute("href");

             // extract a year
             if (y_href.indexOf('[byear]') != -1) {

                // extract actual data
                born.setFullYear(y_href.match(/\d{1,4}/g));
                addAge();
             }
        }
}

// get dates from profile page
function getDates() {

	      // loop over the tag involving dates
        var d_links = document.evaluate("//a[contains(@href,'[bday]')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // loop over all dates
        for (var i = 0; i < d_links.snapshotLength; i++) {
             var d_link = d_links.snapshotItem(i);
             var d_href = d_link.getAttribute("href");

             // extract date and month
             if (d_href.indexOf('[bday]') != -1) {

                // extract actual data
                born.setMonth(parseFloat((d_href.match(/\d{1,2}/g)[1]) - 1));
                born.setDate(d_href.match(/\d{1,2}/g)[0]);
                addSign();
             }
        }
        getYear();
}

getDates();

// checking for the existence
function checkExist() {
	    var z = document.getElementById("zodiac");
	    if (!z) getDates();
}

// AJAX rebuilding function
function rebuild() {
	    var watch = document.getElementById("page_layout");
	    if (watch !== null) {
	        watch.addEventListener("DOMNodeInserted", function(e) {
	              if (e.target.className == "profile_info" || e.target.id == "wrap2") checkExist();}, false);
	    }
}

rebuild();