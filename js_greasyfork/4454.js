// ==UserScript==
// @name       Icebucket Filter for Facebook
// @namespace  http://www.mystler.eu/
// @version    0.1
// @description  Removes posts including IceBucketChallenge hashtags
// @match      https://www.facebook.com/*
// @copyright  2014, Florian Meißner
// @require http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/4454/Icebucket%20Filter%20for%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/4454/Icebucket%20Filter%20for%20Facebook.meta.js
// ==/UserScript==

var filter = ["ALSIceBucketChallenge", "IceBucketChallenge", "StrikeOutALS"];

// Make jQuery :contains case insensitive
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

$(document).ready(function() {
    setInterval(function() {
        // Find filter words and remove FB post completely
        var i;
        for	(i = 0; i < filter.length; i++) {
            $("span:contains('"+filter[i]+"')").parents("div[data-ft*='fbfeed_location']").remove();
        }
    }, 500);
});
