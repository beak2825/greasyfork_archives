// ==UserScript==
// @name       jawz Hybrid - Phone Call
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12823/jawz%20Hybrid%20-%20Phone%20Call.user.js
// @updateURL https://update.greasyfork.org/scripts/12823/jawz%20Hybrid%20-%20Phone%20Call.meta.js
// ==/UserScript==

if ($('h1:contains(Phone Call)').length) {
    var number = $('p:contains("Phone Number")')
    var number2 = number.text().split("Phone Number: ")[1].split('Address:')[0];

    number2 = '*67' + number2;
    
    number.html(number2);
}