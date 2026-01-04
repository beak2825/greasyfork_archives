// ==UserScript==
// @name         taylor l grisham
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Find the Website Address for Businesses
// @author       dire for pyro polio
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369507/taylor%20l%20grisham.user.js
// @updateURL https://update.greasyfork.org/scripts/369507/taylor%20l%20grisham.meta.js
// ==/UserScript==

(function() {
    'use strict';
if ($(".panel-heading:contains('Data Collection Instructions')").length) {
    console.log("Chris");
        var company = $("td:contains('Business name:')").next().html();
        console.log(company);
        $("td:contains('Business name:')").next().html("<a href='https://www.google.com/search?q=" + company + "' target='_blank'>" + company + "</a>");
    }
})();