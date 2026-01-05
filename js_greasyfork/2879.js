// ==UserScript==
// @name        Mturk Logout Time
// @version     0.1
// @author      Cristo
// @description This will show your estimated auto logout time and display a warning when the time drops below 30 minutes.
// @description Click on the "HITs available now" area on the top to show time remaining until logout.  Format is in a "hours:minutes" countdown.
// @description The top border changes green when time is below 30 minutes, yellow for 15 minutes and red for 5 minutes.
// @description Timing is based off Amazon's word that logouts are every 12 hours. Results may vary.
// @include     https://www.mturk.com/mturk*
// @include     https://www.amazon.com/ap/signin?o*
// @copyright   2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/2879/Mturk%20Logout%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/2879/Mturk%20Logout%20Time.meta.js
// ==/UserScript==

if (document.getElementById("subtabs_and_searchbar")) {
var number = timeMachine().replace(":","");
var topBar = document.getElementById("subtabs_and_searchbar");
if (number <= 5){
	topBar.style.cssText = "border-top:#F03C0F 10px solid";
} else if (number <= 15) {
	topBar.style.cssText = "border-top:#D8F029 10px solid";
} else if (number <= 30) {
	topBar.style.cssText = "border-top:#1BDA13 10px solid";
}}
if (document.getElementById("ap_header")) {
    var but = document.getElementById("signInSubmit-input");
    but.addEventListener( "click", function () {
    GM_setValue("timeoflog", new Date().getTime());
    } , false );}
function timeMachine() {
var now = new Date().getTime();
var then = GM_getValue("timeoflog");
var since = now - then;
var timeRem = 4.32e+7 - since;
var rawMins = Math.ceil(timeRem/60000);
var hours = Math.floor(rawMins/60);
var baseMins = rawMins%60;
var redunMins = baseMins.toString();
var mins;
if (redunMins.length < 2){
    mins = "0" + redunMins;
} else {
	mins = redunMins;
}    
var results = hours + ":" + mins;
return results;
}
if (document.getElementsByTagName("td")[7]) {
var handle = document.getElementsByTagName("td")[7];
handle.addEventListener( "click", function () {
var time = timeMachine();
var spany = handle.getElementsByTagName("span")[0];
var bany = handle.getElementsByTagName("b")[0];
var parts = spany.innerHTML.substring(75,88);
bany.innerHTML = time;
bany.style.textAlign = "center";
if (spany.innerHTML.indexOf("Until") == -1){
	spany.innerHTML = spany.innerHTML.replace(parts, "Until Logout");    
}
spany.style.textAlign = "center";
} , false );}
