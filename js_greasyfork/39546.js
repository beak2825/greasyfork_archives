// ==UserScript==
// @name         Seth Nagle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  walmart upc hits
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39546/Seth%20Nagle.user.js
// @updateURL https://update.greasyfork.org/scripts/39546/Seth%20Nagle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".panel-body:contains('Click the item and copy the items description in the box below')").length) {
        console.log("Seth Nagle");
        var upc = $("td:contains('UPC')").next().text();
        console.log(upc);
        $("td:contains('UPC')").next().html("<a href='https://www.walmart.com/search/?query=" + upc + "&cat_id=0' target='_blank'>" + upc + "</a>");
    }
})();