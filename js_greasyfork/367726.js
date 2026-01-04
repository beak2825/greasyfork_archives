// ==UserScript==
// @name         Matthew Mesher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Matthew Meshers
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367726/Matthew%20Mesher.user.js
// @updateURL https://update.greasyfork.org/scripts/367726/Matthew%20Mesher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".panel-body:contains('Find the company home page for this.')").length) {
        console.log("Matthew Mesher");
        var company = $("td:contains('Business name:')").next().html();
        console.log(company);
        $("td:contains('Business name:')").next().html("<a href='https://www.google.com/search?q=" + company + "' target='_blank'>" + company + "</a>");
    }
})();