// ==UserScript==
// @name Sum
// @namespace Violentmonkey Scripts
// @match http://192.168.23.1:90/FTZX.html
// @grant none
// @locale de
// @description adds ul and dl
// @version 004
// @downloadURL https://update.greasyfork.org/scripts/379874/Sum.user.js
// @updateURL https://update.greasyfork.org/scripts/379874/Sum.meta.js
// ==/UserScript==

var dl = document.getElementsByClassName("sp3")[0].innerHTML;
var ul = document.getElementsByClassName("sp3")[1].innerHTML;
var dlval = dl.split(" ");
var ulval = ul.split(" ");
var gesammt = parseFloat(dlval[2]) + parseFloat(ulval[2]);
document.getElementsByClassName("sp1")[0].innerHTML = gesammt.toFixed(1) + "<br><span style=\"color:red; font-size:small;\">" + (9000 - gesammt).toFixed(1) + "</span>";
var dieTRs = document.getElementsByTagName("tr");
for (var y in dieTRs) {
    var dieTDs = dieTRs[y].getElementsByTagName("td");
    for (var z in dieTDs) {
        if (z == 0) {
            if (dieTDs[z].innerHTML.toString().match('104|15[012345]')) {
                dieTRs[y].style.background = "#faf";
            }
        }
    }
}