// ==UserScript==
// @name         Matthew Mesher Separate Address and Company Name Searches  
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Matthew Mesher
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367754/Matthew%20Mesher%20Separate%20Address%20and%20Company%20Name%20Searches.user.js
// @updateURL https://update.greasyfork.org/scripts/367754/Matthew%20Mesher%20Separate%20Address%20and%20Company%20Name%20Searches.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".panel-body:contains('Find the company home page for this.')").length) {
        console.log("Matthew Mesher");
        var company = $("td:contains('Business name:')").next().html();
        var address = $("td:contains('Address:')").next().html();
        var str = "&amp;";
        var str2 = company.split(str).join('and');
        var str3 = "'";
        var str4 = str2.split(str3).join('');
        console.log(company);
        $("td:contains('Business name:')").next().html("<a href='https://www.google.com/search?q=" + str4 + "' target='_blank'>" + company + "</a>");
    $("td:contains('Address:')").next().html("<a href='https://www.google.com/search?q=" + str4 + ' ' + address + "' target='_blank'>" + company + ' ' + address + "</a>");
    }
})();