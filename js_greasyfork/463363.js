// ==UserScript==
// @name         TimeCarder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button that loops through Kantime schedule pages and opens all past eCharts that are "pending"
// @author       NateD
// @match        https://www.tampermonkey.net/index.php?version=4.18.1&ext=dhdg&updated=true
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463363/TimeCarder.user.js
// @updateURL https://update.greasyfork.org/scripts/463363/TimeCarder.meta.js
// ==/UserScript==

//INJECT BUTTON
var btn = document.createElement( 'input' );
btn.setAttribute( 'value', 'Run TimeCarder' );
btn.setAttribute( 'type', 'button' );
btn.setAttribute('class','NormalButton');
btn.addEventListener("click", funcTimeCarder);

// append at end
document.getElementById("Div_btn").appendChild(btn);

function click(elm) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 1, 1, 1, 1, false, false, false, false, 0, null);
    elm.dispatchEvent(evt);
}

function funcTimeCarder(){

    //DEFINE COLUMN INDEXES
    var table = document.getElementById("tblData");
    var ths = table.getElementsByTagName('th'); //HEADER

    for (var i=0; i<ths.length; i++) {
        if (ths[i].innerHTML.indexOf('eChart') !== -1) {
            var colLink = i + 3;
        }
        if (ths[i].innerHTML.indexOf("Visit") !== -1){
            var colDate = i;
        }
        if (ths[i].innerText.indexOf('Planned\xA0Time') !== -1){
            var colTime = i;
        }
        if (ths[i].innerHTML.indexOf('Status') !== -1){
            var colStatus = i + 3;
        }
    }

    //CURRENT DATETIME
    const currentTime = new Date();

    //LOOP THROUGH ROWS IN SCHEDULE AND CLICK LINKS
    for (var r=0; r<table.tBodies[0].rows.length; r++) {
        var rawTime = table.tBodies[0].rows[r].cells[colTime].innerText.split(" ")[3] ;
        var rawHours = rawTime.split(":")[0];
        if (table.tBodies[0].rows[r].cells[colTime].innerText.split(" ")[4] == "PM" && rawHours != 12){
            rawHours = Number(rawHours) + 12;
        }
        var rawMins = rawTime.split(":")[1];
        const [month, day, year] = table.tBodies[0].rows[r].cells[colDate].innerText.split('/');
        const plannedEndTime = new Date(year + "-" + month + "-" + day + "T" + rawHours + ":" + rawMins + ":00");
        if (plannedEndTime <= currentTime){
            if (table.tBodies[0].rows[r].cells[colStatus].innerText == "Planned"){
                click(table.tBodies[0].rows[r].cells[colLink].getElementsByTagName("a")[0]);
            }
        }
    }
}