// ==UserScript==
// @name         Peter Burke - Find high school website
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Creates link for school name
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *s3.amazonaws.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26406/Peter%20Burke%20-%20Find%20high%20school%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/26406/Peter%20Burke%20-%20Find%20high%20school%20website.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($("span:contains('Open a new browser window and perform a Google search for')").length) {
        let school = $("span:contains('Open a new browser window and perform a Google search for')").html().match(/<strong>(.+)<\/strong>/)[1];
        $('fieldset').append(`<a href="https://www.google.com/search?q=${school}" target="_blank">${school}</a>`);
    }
})();