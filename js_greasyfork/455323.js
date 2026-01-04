// ==UserScript==
// @name         Steam - Remove Broadcast at Top / Move Steam Deck Compatibility to top-ish
// @namespace    greasyfork.org/en/users/695986-threeskimo
// @version      0.1
// @description  Remove that annoying broadcast crap at the top of some Steam store pages. Also move the Deck compat info closer to the top to alleviate excessive scrolling.
// @author       Threeskimo
// @match        *://*.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455323/Steam%20-%20Remove%20Broadcast%20at%20Top%20%20Move%20Steam%20Deck%20Compatibility%20to%20top-ish.user.js
// @updateURL https://update.greasyfork.org/scripts/455323/Steam%20-%20Remove%20Broadcast%20at%20Top%20%20Move%20Steam%20Deck%20Compatibility%20to%20top-ish.meta.js
// ==/UserScript==

function doStuffs(){
    // Kill the broadcast div
    $('div.broadcast_embed_top_ctn_trgt').remove();

    setTimeout(doStuffs, 100);
}

doStuffs();

$(window).on("load", function() {
    //Move Search pagination to top of search
    $('[class^=deckverified_BannerContainer_]').appendTo('[class*=rightcol]:eq(0)');
    $('[class^=deckverified_BannerContainer_]:not(:last)').remove();
    $('[class^=deckverified_LearnMore_]').css('color','white');
});
