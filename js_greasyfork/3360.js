// ==UserScript==
// @name       Google calendar refresh
// @namespace  http://ostermiller.org/
// @version    1.2
// @description  Refresh Google calendar when you click on it after it has been open since yesterday
// @match      *://calendar.google.com/calendar/render*
// @copyright  2014-2017, Stephen Ostermiller
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/3360/Google%20calendar%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/3360/Google%20calendar%20refresh.meta.js
// ==/UserScript==
var loaddate = new Date().toISOString().replace(/T.*/,"");
//console.log("Loaded: " + loaddate);
window.addEventListener("focus", function(event) {
    var nowdate = new Date().toISOString().replace(/T.*/,"");
    //console.log("Google calendar has focus -- Loaded: " + loaddate + " Now: " + nowdate);
    if (loaddate != nowdate) {
        //console.log("Refreshing Google calendar");
        location.reload();
    }
}, false);