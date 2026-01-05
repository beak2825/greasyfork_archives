// ==UserScript==
// @name       jawz Hybrid - Dashes4Wigz
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/15511/jawz%20Hybrid%20-%20Dashes4Wigz.user.js
// @updateURL https://update.greasyfork.org/scripts/15511/jawz%20Hybrid%20-%20Dashes4Wigz.meta.js
// ==/UserScript==

if ($('h1:contains(Phone Call)').length) {
    var number = $('p:contains("Phone Number")')
    var number2 = number.text().split("Phone Number: ")[1].split('Address:')[0];
    number2 = number2.substr(0, 3) + '-' + number2.substr(3)
    number2 = number2.substr(0, 7) + '-' + number2.substr(7)
    
    number.html('<b>Phone Number: </b>' + number2);
}