// ==UserScript==
// @name         Remove Recommendation on dtf, vc, tjournal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove recommendation block after user comments on dtf, vc, tjournal
// @author       Alexwebman
// @license      MIT
// @match        https://dtf.ru/*
// @match        https://vc.ru/*
// @match        https://tjournal.ru/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.slim.js
// @downloadURL https://update.greasyfork.org/scripts/440141/Remove%20Recommendation%20on%20dtf%2C%20vc%2C%20tjournal.user.js
// @updateURL https://update.greasyfork.org/scripts/440141/Remove%20Recommendation%20on%20dtf%2C%20vc%2C%20tjournal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body *:first").before(
        "<style>"+
        ".recommendation-feed[data-analytics^=\"Recommendations\"] { display: none !important; }"+
        "</style>"
        )



})();