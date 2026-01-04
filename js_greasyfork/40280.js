// ==UserScript==
// @name        Add CDC (ComfortDelgro Driving Centre) class bookings to google calendar 
// @namespace   ktaragorn
// @description Adds a link to export the class booking to google calendar so that you dont make mistakes in manual entry of date/time and miss the class
// @include     https://www.cdc.com.sg/NewPortal/Booking/ReportPrView.aspx?ReceiptNo=*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40280/Add%20CDC%20%28ComfortDelgro%20Driving%20Centre%29%20class%20bookings%20to%20google%20calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/40280/Add%20CDC%20%28ComfortDelgro%20Driving%20Centre%29%20class%20bookings%20to%20google%20calendar.meta.js
// ==/UserScript==

function make_date(time_array){
  var dateStr = document.querySelector("#ctl00_ContentPlaceHolder1_panDetails tbody tr:nth-child(2) td").innerText
  var dateTimeArr = dateStr.split("/").reverse().concat(time_array)
  dateTimeArr[1] = dateTimeArr[1] - 1 // date constructor for month is 0 based ffs
 	return new Date(...dateTimeArr); 
}
                                  
function time_array(time_str){
    var pm = time_str.endsWith("PM")
    time_str = time_str.replace(" PM", "").replace(" AM","")
    time_arr = time_str.split(":")
    if(pm){
      time_arr[0] = String(parseInt(time_arr[0]) + 12)
    }
    return time_arr;
}

function dateTime(time_str){
  return make_date(time_array(time_str));
}
function title(){
 	return document.querySelector("#ctl00_ContentPlaceHolder1_panDetails tbody tr td").innerText;
}

//function description(){
 	//return ""; 
//}

// "borrowed" from https://greasyfork.org/en/scripts/1913-trademe-google-reminder/code , thank you
/*
 *  Return a date string as yyyymmddThhmmssZ in UTC.
 *  based on http://stackoverflow.com/questions/5661487/converting-date-time-to-rfc3339-format-using-either-jquery-or-java-script
 */
// Add leading zero to single digit numbers
function addZ(n) {
    return (n<10) ? '0'+n : ''+n;
}
function dateToUTCString(d) {

    return d.getUTCFullYear() + 
           addZ(d.getUTCMonth() + 1) + 
           addZ(d.getUTCDate()) +
           'T' + 
           addZ(d.getUTCHours()) + 
           addZ(d.getUTCMinutes()) + 
           addZ(d.getUTCSeconds()) +
           'Z';
}

function reminder_url(){
  var timesArr = document.querySelector("#ctl00_ContentPlaceHolder1_panDetails tbody tr:nth-child(3) td:nth-child(2)").innerText.split(" - ")
  var fromDate = dateToUTCString(dateTime(timesArr[0]));  
  var toDate = dateToUTCString(dateTime(timesArr[1]));
  return "https://www.google.com/calendar/event?action=TEMPLATE" + 
        "&text=" + escape("CDC Lesson: " +title()) +  
        "&dates=" + fromDate + "/" + toDate 
    //       "&details=" + escape(description()); 
}
//finished borrowing

function add_to_calenadar_link(){
 	return "<a href=" +  reminder_url()+" target='_blank' onclick='return confirm(\'Are you sure?\')'><img src=\"https://www.google.com/calendar/images/ext/gc_button2.gif\"></a>"
}

document.querySelector("td span#ctl00_ContentPlaceHolder1_lblWelcome").insertAdjacentHTML("afterend", add_to_calenadar_link())