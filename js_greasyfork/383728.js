// ==UserScript==
// @name         UNC2 Reminders
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sends Chime Reminders
// @author       cpatters
// @match        https://aftlite-na.amazon.com/outbound_dashboard*
// @match        https://aftlite-portal.amazon.com/ojs/OrchaJSFaaSTCoreProcess/OutboundDashboard*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      hooks.chime.aws
// @connect      amazon.com
// @connect      amazonaws.com
// @downloadURL https://update.greasyfork.org/scripts/383728/UNC2%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/383728/UNC2%20Reminders.meta.js
// ==/UserScript==


var d= new Date();
var h= d.getHours();
var m= d.getMinutes();
var title= document.title;
var t= "UNC2";

var mino= (m == 0 || m == 15);
var mine= (m == 15 || m == 30 || m == 45);
var even= (h == 2 || h == 4 || h == 6 || h == 8 || h == 10 || h == 12 || h == 14 || h == 16 || h == 18 || h == 20 || h == 22);
var odd= (h == 1 || h == 3 || h == 5 || h ==7 || h == 9 || h == 11 || h == 13 || h == 15 || h == 17 || h == 19 || h == 21);

var phrase;
if(even && mine){
    phrase= "Check Bigs and use sorter to assign bigs";
}else if(odd && mino){
    phrase= "Check bigs and assign associates";
}else(phrase = "testing")

var siteList = {
// test room for testing webhook
    UNC2: "https://hooks.chime.aws/incomingwebhooks/b831aed6-e22b-44c9-937f-8778c3954b84?token=NkFCTWg0NE18MXxCLVpaWmlvTE5zOFl4NEF4Y19NUXJlQ2w0ZzY5Nm1Ta0RhZUtRRXVyc2tZ",

};
            var site = t
            var conData = {
                Content: "@Present  " + phrase
            };

if( (even && mine) || (odd && mino)){

// CHIME to Site Channel
            GM_xmlhttpRequest({
                method: "POST",
                url: siteList[site],
                data: JSON.stringify(conData),
                dataType: "json"
            });
        }
