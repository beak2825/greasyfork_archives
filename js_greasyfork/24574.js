// ==UserScript==
// @name         Hide Kinja Deals
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *.lifehacker.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/24574/Hide%20Kinja%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/24574/Hide%20Kinja%20Deals.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // hide from main page
    $("article:contains('Shared from Deals')").css("display", "none");
    // hide related from article page
    $("div.related-module--commerce:contains('Gear from Kinja Deals')").css("display", "none");
})();