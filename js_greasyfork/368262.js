// ==UserScript==
// @name         Ryan R. Rosario
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       pryo
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368262/Ryan%20R%20Rosario.user.js
// @updateURL https://update.greasyfork.org/scripts/368262/Ryan%20R%20Rosario.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($("p:contains('You will be presented with a comment from Reddit')")) {
        $("#workContent").prepend("<p><h4>" + $("p:contains('To receive payment, there must be a response to ALL questions.')").next().next().text() + "</h4></p>");
    }
})();