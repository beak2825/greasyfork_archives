// ==UserScript==
// @name         Steam Community Accepting + Listing
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        http://steamcommunity.com/id/MenghFacepalms/tradeoffers/
// @match        https://steamcommunity.com/id/MenghFacepalms/tradeoffers/
// @match        http://nulledgebased.com/opb
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26067/Steam%20Community%20Accepting%20%2B%20Listing.user.js
// @updateURL https://update.greasyfork.org/scripts/26067/Steam%20Community%20Accepting%20%2B%20Listing.meta.js
// ==/UserScript==

if (window.location.href == "https://steamcommunity.com/id/MenghFacepalms/tradeoffers/" || window.location.href == "http://steamcommunity.com/id/MenghFacepalms/tradeoffers/") {
    var selector = document.querySelectorAll('.tradeoffer .active .link_overlay');
    var offers = selector.length;

    for (i = 0; i < offers; i++) {
        selector[i].click();
    }

    setTimeout( function() {
        location.reload();
    }, 120000);
} else if (window.location.href == "http://nulledgebased.com/opb") {
    setTimeout( function() {
        window.location.href = "https://steamcommunity.com/id/MenghFacepalms/tradeoffers/";
    }, 30000);
}