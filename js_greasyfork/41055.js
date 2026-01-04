// ==UserScript==
// @name         John Johnson
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  John Johnson urls
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41055/John%20Johnson.user.js
// @updateURL https://update.greasyfork.org/scripts/41055/John%20Johnson.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".panel-body:contains('Find the website address for this company. If you')").length) {
        console.log("John Johnson");
        var company = $("td:contains('Company name:')").next().html();
        console.log(company);
        $("td:contains('Company name:')").next().html("<a href='https://www.google.com/search?q=" + company + "' target='_blank'>" + company + "</a>");
    }
})();