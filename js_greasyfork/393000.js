// ==UserScript==
// @name         wish.com leave only Limited Quantity Deals
// @namespace    KarlBaumann
// @version      1.1
// @description  Removes all non-Limited-Quantity-Deal listings from wish.com
// @author       Karlis Baumanis
// @match        https://www.wish.com/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393000/wishcom%20leave%20only%20Limited%20Quantity%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/393000/wishcom%20leave%20only%20Limited%20Quantity%20Deals.meta.js
// ==/UserScript==

$(window).on('scroll', function() {
    //$('a[class^="FeedTile__Wrapper"]')
        $("div[class^=ProductGrid__FeedTileWidthWrapper]").find('div:not(:contains("Limited Quantity Deal"))').css("opacity","0.1");
});
