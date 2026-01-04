// ==UserScript==
// @name         Seth Gottlieb
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  linkify company name
// @author       pryo
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368453/Seth%20Gottlieb.user.js
// @updateURL https://update.greasyfork.org/scripts/368453/Seth%20Gottlieb.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($("#instructionBody:contains('We are correcting website information in our database of companies')")) {
        console.log('Seth Gottlieb');
        let company = $("li:contains('Name:')").text().replace('Name: ','');
        console.log(company);
        $("li:contains('Name:')").html("Name: <a href='https://www.google.com/search?q=" + encodeURIComponent(company) + "' target='_blank'>" + company + "</a>");
    }
})();