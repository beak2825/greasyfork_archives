// ==UserScript==
// @name         Neopets: Magma Pool Checker
// @version      0.1
// @namespace    http://clraik.com/forum/showthread.php?61676-Neopets-Magma-Pool-Checker
// @description  Refreshes every 5 - 10 minutes at the Magma Pool. When the guard falls asleep, there will be a pop-up window with your Magma Pool time. Stops refreshing after 100 refreshes.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/magma/pool.phtml
// @grant        none
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/32585/Neopets%3A%20Magma%20Pool%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/32585/Neopets%3A%20Magma%20Pool%20Checker.meta.js
// ==/UserScript==

var maxReloads = "100"; // max number of reloads until the script stops

var state = history.state || {};
var reloadCount = state.reloadCount || 0;
if (performance.navigation.type === 1) {
    state.reloadCount = ++reloadCount;
    history.replaceState(state, null, document.URL);
} else if (reloadCount) {
    reloadCount = 0;
    delete state.reloadCount;
    history.replaceState(state, null, document.URL);
}
var MagmaInfo = document.getElementsByClassName("content")[0].getElementsByTagName("b")[0];
MagmaInfo.innerHTML = "Magma Pool<br><br><font color='red'>The script for the Magma Pool checker is currently running.<br><br>This page has been reloaded " + reloadCount + " times.</font>";
if (reloadCount > maxReloads){
    window.alert("You have reloaded the page at least " + maxReloads + " times. This script has been paused for your safety. To restart the counter, close this tab and then reopen it.");
}
if (document.body.innerHTML.indexOf('guard is sleeping') != -1){
    var MagmaTime = document.getElementById("nst").innerHTML;
    window.alert("Your Magma Pool time is " + MagmaTime);
}
if (document.body.innerHTML.indexOf('only those well-versed in the ways of Moltara are permitted to enter the Pool') != -1){
    var wait=Math.floor(Math.random() * 300001) + 300000;

    setTimeout(function(){
        location.reload();
    }, wait);
}