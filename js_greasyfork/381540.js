// ==UserScript==
// @name         Kiriti Manne
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Collect Website URL for Company
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381540/Kiriti%20Manne.user.js
// @updateURL https://update.greasyfork.org/scripts/381540/Kiriti%20Manne.meta.js
// ==/UserScript==

(function() {
    'use strict';
if ($(".panel-heading:contains('Website URL Collection Instructions')").length) {
    console.log("Chris");
        var company = $("td:contains('Company name:')").next().html();
        console.log(company);
        $("td:contains('Company name:')").next().html("<a href='https://www.google.com/search?q=" + company + "' target='_blank'>" + company + "</a>");
    }
})();