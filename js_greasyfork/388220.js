// ==UserScript==
// @name         User counter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Counts users in CrowdSource
// @author       TB
// @match        https://crowdsource.google.com/cc/manager*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388220/User%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/388220/User%20counter.meta.js
// ==/UserScript==


function calculate() {
    var totalcheckboxes = 0;
    var selectedcheckboxes = 0;
    var searchbar = document.querySelector("input[role='combobox']");
    var searchquery = searchbar.value;
    var searchedtotal = (document.querySelector("input[role='combobox']").value.match(/@/g)||[]).length;

 var allcheckboxes = document.querySelectorAll("[id^='checkbox-worker_pools']");
 for (var i=0; i<allcheckboxes.length; i++) {
     var check = allcheckboxes[i];
     if(check.offsetParent != null) totalcheckboxes++;
     if(check.getAttribute("aria-checked") == "true" &&check.offsetParent != null) selectedcheckboxes++;
 }

document.querySelector("#counter").innerHTML = "Displayed: " + totalcheckboxes +"  Selected: " + selectedcheckboxes + "  Searched: " + searchedtotal ;
}

var navbar = document.querySelector("header");
var html = '<div class=" YSAwr" style="display: inline-block;">User counter</div>';
html += '<div class=" YSAwr vKV39e" id="counter" style="display: inline-block;"></div>';
html += '<button class="" id="refreshCounter" style="display: inline-block;">Refresh</button>';

navbar.insertAdjacentHTML("beforeend",html);
document.getElementById("refreshCounter").addEventListener("click", calculate);

