// ==UserScript==
// @name        Pardus WH Info
// @namespace   fear.math@gmail.com
// @description Displays the sector of the currently closed Pardus WH in the message frame.
// @include     http*://*.pardus.at/msgframe.php*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14484/Pardus%20WH%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/14484/Pardus%20WH%20Info.meta.js
// ==/UserScript==

var START_TIME = 1449120361000; //December 3, 2015 05:26:01 GMT

//determine closed WH
var deltaT = Date.now()-START_TIME;
var days = deltaT/1000/60/60/24; //milliseconds to days
if (window.location.href.indexOf("pegasus") > -1) {days = days + 3;} //Pegasus is 3 days out of sync with Orion/Artemis
var shift = Math.floor(days/2) % 4; //closed WH switches every two days, new cycle every four WHs
var nextDay = 2 - Math.floor(days) % 2; //days until closed WH changes
var WHs = ["Procyon","Nhandu","Enif","Quaack"];
var closedWH = WHs[shift];
var nextWH = WHs[(shift+1) % 4];


//grab cell to insert text into
var cell;
var links = document.getElementsByTagName("a");
for (var i=0; i<links.length; i++) {
    if (links[i].href.indexOf("statistics.php?display=onlinelist") > -1) {
        cell = links[i].parentNode;
    }
}

//insert message into cell
var str = cell.innerHTML;
var breakpoint = str.indexOf("<br>");
if (nextDay === 1) {
    str = str.substr(0, breakpoint) + "<span title='" + nextWH + " will be closed in 1 day.'> | " + closedWH + "'s closed</span>" + str.substr(breakpoint);
} else {
    str = str.substr(0, breakpoint) + "<span title='" + nextWH + " will be closed in 2 days.'> | " + closedWH + "'s closed</span>" + str.substr(breakpoint);
}
cell.innerHTML = str;
