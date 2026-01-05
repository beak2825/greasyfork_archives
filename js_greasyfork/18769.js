// ==UserScript==
// @name         Customers LMS Link
// @namespace    PXgamer
// @version      0.2
// @description  try to take over the world!
// @author       PXgamer
// @match        *caramel/orderitems/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18769/Customers%20LMS%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/18769/Customers%20LMS%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a = $('#summaryPanel > ul > li:nth-child(6) > span');
    var b = $('#summaryPanel > ul > li:nth-child(7) > span');
    var c = "";
    if (a.html().match(/Customer's [a-zA-Z]+/)) {
       c = a.html();
       a.html("<a href='http://customerzoneadmin.cylix.co.uk:8080'>"+c+"</a>");
    }
    if (b.html().match(/Customer's [a-zA-Z]+/)) {
       c = b.html();
       b.html("<a href='http://customerzoneadmin.cylix.co.uk:8080'>"+c+"</a>");
    }
})();