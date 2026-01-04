// ==UserScript==
// @name         gary phipps
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  phipps
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387005/gary%20phipps.user.js
// @updateURL https://update.greasyfork.org/scripts/387005/gary%20phipps.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($("p:contains('Find the official website for:')").length) {
        console.log("Gary Phipps");
        let url = $("strong").text().trim();
        $("strong").replaceWith("<strong><a href='https://www.google.com/search?q=" + encodeURIComponent(url) + "' target='blank'>" + url + "</a></strong>");
    }
})();