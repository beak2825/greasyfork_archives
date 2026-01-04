// ==UserScript==
// @name         Shrink long quotes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.kaldata.com/forums/topic/*
// @grant        none
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @downloadURL https://update.greasyfork.org/scripts/407266/Shrink%20long%20quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/407266/Shrink%20long%20quotes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var quoteLength = 500;

    function shrink(quote) {
        if (quote.find('div.ipsQuote_contents p').text().length > quoteLength) {
            quote.find('div.ipsQuote_open').addClass('ipsQuote_closed').removeClass('ipsQuote_open');
            quote.find('div.ipsQuote_contents').css('display', 'none');
        }
    }

    waitForKeyElements("div[data-role='commentContent'] blockquote", shrink)
})();