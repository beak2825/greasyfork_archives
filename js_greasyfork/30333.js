// ==UserScript==
// @name         salam air jump
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://salamair.booksecure.net/avail.aspx?lang=en-US&BookingID=*
// @match        https://salamair.booksecure.net/Main.aspx?BookingID=*
// @match        https://salamair.booksecure.net/Login.aspx
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30333/salam%20air%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/30333/salam%20air%20jump.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes("https://salamair.booksecure.net/avail.aspx?lang=en-US&BookingID=via") === true){ 
        if (!$('#Form1 > table > tbody > tr:nth-child(1) > td > table.tblTANavigationMenu > tbody > tr:nth-child(2) > td:nth-child(1) > span:nth-child(1)').length) {
            localStorage.script = "on";

            localStorage.url = window.location.href;
            window.open('https://salamair.booksecure.net/Login.aspx','_self');   
        }
    }
    if (localStorage.script === "on"){
        if (window.location.href.includes("https://salamair.booksecure.net/Main.aspx?BookingID=") === true){
            window.open(localStorage.url,'_self');
            localStorage.script = "off";
        }
    }
    if (window.location.href.includes("https://salamair.booksecure.net/Login.aspx") === true){ 

        $("#ctlLogin_txtTravelAgentNumber").val("N1069");

    }
    // Your code here...
})();