// ==UserScript==
// @name         Nicholas
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Ugh
// @author       pyro, polly, dire
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381985/Nicholas.user.js
// @updateURL https://update.greasyfork.org/scripts/381985/Nicholas.meta.js
// ==/UserScript==

(function() {
    'use strict';
if ($(".panel-heading:contains('Data Collection Instructions')").length) {
    console.log("Nicholas");
        var company = $("td:contains('Company:')").next().html();
        var address = $("td:contains('State:')").next().html();
        var str = "&amp;";
        var str2 = company.split(str).join('and');
        var str3 = "'";
        var str4 = str2.split(str3).join('');
        console.log(company);
        $("td:contains('Company:')").next().html("<a href='https://www.google.com/search?q=" + str4 + ' ' + address + "' target='_blank'>" + company + ' ' + address + "</a>");
    }
})();