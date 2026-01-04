// ==UserScript==
// @name         UTX7 Idle Picklists
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       abigaia
// @match        https://prime-now-ops.corp.amazon.com/sql_viewer/picklistdetails?utf8=%E2%9C%93&fc=UTX7&timezone=America%2FChicago&slamtime=90&commit=Continue*
// @connect      hooks.chime.aws
// @connect      amazon.com
// @connect      amazonaws.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/412502/UTX7%20Idle%20Picklists.user.js
// @updateURL https://update.greasyfork.org/scripts/412502/UTX7%20Idle%20Picklists.meta.js
// ==/UserScript==

window.setTimeout(main, 2000);
setInterval(function(){ location.reload(); }, 300000);
function main() {
var z= document.createElement("button");
var body= document.getElementsByTagName("body")[0];
body.appendChild(z);
z.innerHTML= "Send Chime";

    for (var i=21; i<373; i+=11){
            var msp1= document.getElementsByTagName('td')[i].innerText;
            var user= document.getElementsByTagName('td')[i-7].innerText;
            var progress= document.getElementsByTagName('td')[i-2].innerText;
            var location= document.getElementsByTagName('td')[i-1].innerText
            var zone= document.getElementsByTagName('td')[i-8].innerText
            var ID= document.getElementsByTagName('td')[i-6].innerText
         var conData = {
                  Content: " :rotating_light: " + user + " is idle in a " + zone + " picklist for" + msp1 + " minutes with " + progress + " complete; the AAs last location was " + location + " please find and engage ASAP! To reassign this list please click here https://aftlite-na.amazon.com/picklist_group/display_picklist_group?picklist_group_id=" + ID + " :rotating_light: "
            };
           if (msp1 < -20){
           GM_xmlhttpRequest({
                method: "POST",
                url: "https://hooks.chime.aws/incomingwebhooks/d6b8cc7d-5990-4e8a-b4dd-2b5e98cc21e1?token=MVlWVEQ5dUh8MXxhcW4xSHFCR3dyRjVyQjJtS3RUSFd1T3lRZXR5enJ1cXRBWHpRbXFIQUxr",
                data: JSON.stringify(conData),
                dataType: "json"
            });
           }
    }

}