// ==UserScript==
// @name         TFL Delay Checker
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Check each journey in TFL Journey Planner to look for delays of 15 minutes or over.
// @author       You
// @match        https://contactless.tfl.gov.uk/NewStatements*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/17000/TFL%20Delay%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/17000/TFL%20Delay%20Checker.meta.js
// ==/UserScript==
'use strict';

// version 0.8 - Removed modal alert if expected refunds requested, now highlights rows red and changed the statement header message.
// version 0.7 - Stations and expected times are now queried on first run and stored in local settings.
// version 0.6 - Journey times and delay lengths are now displayed on web page.
// version 0.5 - Updated default times for new journey, added filter for specified journey stations.
// version 0.4 - Nested evaluate recode to correct get date from parent node.
// version 0.3 - Recode for TFL redesign
// version 0.2 - Fix for time occuring across midnight
// version 0.1 - initial release


//Todo:  expand all table rows by default
//Todo:  change colour of a delayed row header from blue to green
var expectedJourneyTime = 0;
var maxDelayTime = 15;
var journeyStation1 = "";
var journeyStation2 = "";

expectedJourneyTime = GM_getValue("expectedJourneyTime");
if (expectedJourneyTime === undefined) {
    var input = prompt("What is the expected journey time of your commute (minutes)?", 20);
    if (input === null) {
        alert("Input must be valid");
        return;
    }
    else {
        expectedJourneyTime = input;
        GM_setValue("expectedJourneyTime",expectedJourneyTime);
    }
}

journeyStation1 = GM_getValue("tflStation1");
if (journeyStation1 === undefined) {
    input = prompt("What is station 1 of your commute?", "Oxford Circus");
    if (input === null) {
        alert("Input must be valid");
        return;
    }
    else {
        journeyStation1 = input;
        GM_setValue("tflStation1",journeyStation1);
    }
}
journeyStation2 = GM_getValue("tflStation2");
if (journeyStation2 === undefined) {
    input = prompt("What is station 2 of your commute?", "Mansion House");
    if (input === null) {
        alert("Input must be valid");
        return;
    }
    else {
        journeyStation2 = input;
        GM_setValue("tflStation2",journeyStation2);
    }
}
//"//div[@class='col-xs-9']",

var allDivs, thisDiv;
allDivs = document.evaluate(
    "//div[@class='statements-list clearfix']",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

var delay = 0;
//alert(thisHeading);
//alert(thisDiv);
//alert("here1");

//alert("here2");

//Want to expand all collapsed rows by default
//var allButtons = document.getElementsByClassName("list-group-item journey-date-heading");
//allButtons[0].innerHTML = "Hello World!";
//alert(allButtons.length);
/*var thisButton = allButtons[1];
if (thisButton) {
    //thisButton.attr('aria-expanded', 'true');
    thisButton.setAttribute("aria-expanded", 'true');
    document.getElementById("journey-14506").innerHTML = "aria-expanded =" + 'true';
}*/

        //var x =

//        alert(document.getElementById("journey-date-heading-14508").getAttribute("aria-expanded"));
        //thisDiv.attr('aria-expanded', 'true');

var anyRefundsNeeded = false;

if (allDivs) {
    console.debug("Total Divs: " +allDivs.snapshotLength);
    //alert("Total Divs: " +allDivs.snapshotLength);
    for (var i = 0; i < allDivs.snapshotLength; i++) {
        //alert(allDivs.snapshotItem(i).innerHTML);
        thisDiv = allDivs.snapshotItem(i).innerHTML;
        //alert("thisDiv: " + thisDiv);
        //window.prompt(i + ", thisDiv", thisDiv);

        var divArray = thisDiv.match(/class="date-link">(.+?)</); //Journey Divs

        //    "div[@class='col-xs-9']",

        //var resultDiv = document.getElementById("col-xs-9");
        //alert(resultDiv.innerHTML);
        var allRows, thisRow;
        allRows = document.evaluate(
            ".//div[@class='col-xs-9']",
            allDivs.snapshotItem(i),
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);

        if (allRows) {
            //alert("allRows length: " + allRows.snapshotLength);
            for (var j = 0; j < allRows.snapshotLength; j++) {
                thisRow = allRows.snapshotItem(j).innerHTML;
                //alert("thisRow: " + thisRow);
                //window.prompt(j + ", thisRow", thisRow);

                var rowArray = thisRow.match(/journey-from">(.+?)<[\s\S]+?journey-to">(.+?)<[\s\S]+?journey-time">(.+?)</); //Journey Divs
                if (rowArray) {
                    //thisRow.attr('aria-expanded', 'true')}

                    /*function toggle() {
                    var target = document.getElementById("history");
                    if(target.style.display == 'block'){
                        target.style.display = 'none';
                    }
                    else {
                        target.style.display = 'block';
                    }*/
                    //alert(thisRow);
                    //alert("rowArray.length " + rowArray.length);
                    //alert("Date: " + divArray[1] + "\n" + rowArray[1] + "\n" + rowArray[2] + "\n" + rowArray[3]);
                    var res = rowArray[3].split(" - ");
                    //thisRow = thisRow.getStringValue();
                    //alert("difference " + res[0] + " " + res[1] + ": ");

                   var journeyTime;
                   journeyTime = CompareTimes(res[0], res[1]); // / 1000 / 60
                   allRows.snapshotItem(j).innerHTML += "<p style='color:black;font-size:10px'>Journey Length: " + journeyTime + "mins</p>";

                    //Is the journey between desired 2 stations
                    if ((journeyStation1 == rowArray[1] && journeyStation2 == rowArray[2]) || (journeyStation1 == rowArray[2] && journeyStation2 == rowArray[1])) {
                        allRows.snapshotItem(j).innerHTML += "<p style='color:black;font-size:10px'>Expected Time: " + expectedJourneyTime + "mins</p>";
                        delay = journeyTime - expectedJourneyTime;
                        if (delay > 0) {
                            allRows.snapshotItem(j).innerHTML += "<p style='color:black;font-size:10px'>Delay: " + delay + "mins</p>";
                        }
                        else {
                            allRows.snapshotItem(j).innerHTML += "<p style='color:black;font-size:10px'>No delay!</p>";
                        }
                          //alert(rowArray[1] + " " + rowArray[2] + " journeyTime: " + journeyTime);
                        //alert(rowArray[1]);
                        //rowArray.innerHTML += " " + journeyTime;
//                        allRows.snapshotItem(j).innerHTML += "<p>" + journeyTime + "</p>";
                        if (delay > maxDelayTime) { //Delay more than journeyTime (" + expectedJourneyTime + ") + " + maxDelayTime + " minutes delayTime
                            allRows.snapshotItem(j).innerHTML += "<p style='font-size:11px'><t style='background-color:red;;color:white;'>Refund needed!</t></p>";
                            //alert(delay + " minute delay (more than "+maxDelayTime+" minutes): \n[" + rowArray[3] + "] " + journeyTime +  " minutes journey time, should take " + expectedJourneyTime + ".\n" + rowArray[1] + " to " + rowArray[2] + " on " + divArray[1]);
                            //alert(delay + " [" + allRows.snapshotItem(j).parentNode.parentNode.parentNode.parentNode.innerHTML + "] ");
                            var rootDiv = allRows.snapshotItem(j).parentNode.parentNode.parentNode.parentNode;
                            rootDiv.childNodes[1].setAttribute("style", "color: red !important");
                            rootDiv.childNodes[1].setAttribute("style", "background-color:red !important");
                            anyRefundsNeeded = true;
                        }
                        else {
                            allRows.snapshotItem(j).innerHTML += "<p style='color:black;font-size:11px'>No refund expected. "+journeyTime+"-"+expectedJourneyTime+"</p>";
                        }
                        //alert("Delay more than 15 minutes: " + journeyTime +  " minutes journey time.");
                    }

                }
                else
                {
                    console.error("TFL Delay Checker: No rows found " + divArray.length + "\n " + thisRow);

                }
            }
        }
        else {
            console.error("Unable to evaluate rows");
        }
    }
    if (anyRefundsNeeded == true) {
        //alert("Some journeys require a refund");
        var headerNodes = document.getElementsByTagName("h2");
        for (var h = 0; h < headerNodes.length; h++) {
            if (headerNodes[h].innerText == "Statement"){
                headerNodes[h].innerText = "Some journeys require a refund";
                headerNodes[h].setAttribute("style", "color: red !important");
            }
        }
    }
}
else {
    console.error("Unable to evaluate divs");
}

function CompareTimes(startTime, endTime) { //07:56 - 08:39
    var startDate = new Date("January 1, 1970 " + startTime +":00");
    var endDate = new Date("January 1, 1970 " + endTime +":00");
    if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }
    var timeDiff = Math.abs(startDate - endDate);

    var hh = Math.floor(timeDiff / 1000 / 60 / 60);
    if(hh < 10) {
        hh = '0' + hh;
    }
    timeDiff -= hh * 1000 * 60 * 60;
    var mm = Math.floor(timeDiff / 1000 / 60);
    if(mm < 10) {
        mm = '0' + mm;
    }
    timeDiff -= mm * 1000 * 60;
    var ss = Math.floor(timeDiff / 1000);
    if(ss < 10) {
        ss = '0' + ss;
    }

    //alert("Time Diff- " + hh + ":" + mm + ":" + ss);
    return Math.floor(Math.abs(startDate - endDate) / 1000 / 60);
}

function parseTime(s) {
    var part = s.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
    var hh = parseInt(part[1], 10);
    var mm = parseInt(part[2], 10);
    var ap = part[3] ? part[3].toUpperCase() : null;

    if (ap === "AM") {
        if (hh == 12) {
            hh = 0;
        }
    }
    if (ap === "PM") {
        if (hh != 12) {
            hh += 12;
        }
    }

    //alert(hh + " " + mm);
    return { hh: hh, mm: mm };
}
//parseTime("12:00 AM"); // {hh:  0, mm: 0}
//parseTime("12:00 PM"); // {hh: 12, mm: 0}
//parseTime("01:00 PM"); // {hh: 13, mm: 0}
//parseTime("23:00");    // {hh: 23, mm: 0}