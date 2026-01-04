// ==UserScript==
// @name        Salesforce Refresh Cases List
// @namespace   TheDeadGuy - https://github.com/TheDeadGuy
// @description Automatically refreshes case list for Salesforce Cases every 30 seconds.
// @include     https://*.lightning.force.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1.1
// @grant       none
// @run-at  document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440818/Salesforce%20Refresh%20Cases%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/440818/Salesforce%20Refresh%20Cases%20List.meta.js
// ==/UserScript==


//Sets interval and runs script at that interval
setInterval(function(){
autorefresh()
}, 30000); //Refresh interval

function autorefresh() {
    var urlvar=window.location.href //check which URL we're on as this changes without the whole page loading so extension can't check properly against URL
    var urltest=/(https:\/\/<INSERT COMPANY NAME HERE>.lightning.force.com\/lightning\/o\/Case\/list[-a-zA-Z0-9@:%_\+.~#?&//=]{1,35})/.test(urlvar) //URL regex check. Replace "<INSERT COMPANY NAME HERE>" with company name
//    window.console.log("Refreshing " + urlvar + " " + urltest); //Put variables into console.log
    if (urltest==true) {
    $A.get('e.force:refreshView').fire()} //Refresh page via salesforce refresh process.
    window.console.log("Refresh Complete");} //Log that script has finished
