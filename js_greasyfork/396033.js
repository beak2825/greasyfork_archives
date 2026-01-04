// ==UserScript==
// @name         Wish.com leave only Just pay shipping!
// @namespace    Luxotek
// @version      1.0
// @description  Removes all non-free non-Just pay shipping! from wish.com
// @author       Luxotek
// @match        https://www.wish.com/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/396033/Wishcom%20leave%20only%20Just%20pay%20shipping%21.user.js
// @updateURL https://update.greasyfork.org/scripts/396033/Wishcom%20leave%20only%20Just%20pay%20shipping%21.meta.js
// ==/UserScript==

$(window).on('scroll', function() {
    //$('a[class^="FeedTile__Wrapper"]')
        $("div[class^=ProductGrid__FeedTileWidthWrapper]").find('div:not(:contains("Just pay shipping!"))').css("opacity","0.1");
});
