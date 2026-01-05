// ==UserScript==
// @name         express id
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30250/express%20id.user.js
// @updateURL https://update.greasyfork.org/scripts/30250/express%20id.meta.js
// ==/UserScript==

(function() {
    'use strict';

  alert('h');  
var str = window.location.href.replace('http://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID=','');
var spl = str.split("&");  
if (spl[0]=='via'){
window.open("http://airindiaexpress.booksecure.net/avail.aspx?lang=en&BookingID="+localStorage.lastname+"&triptype=rOneWay&adults="+date[3]+"&children="+date[4]+"&infants="+date[5]+"&seniors=0&subwebfaretype=1&isavailforpackages=False&origin="+spl[0]+"&dest="+spl[1]+"&depday="+date[2]+"&depmon="+date[1]+"&depyear="+date[0]+"&internal=true",'self');
}

    // Your code here...
})();