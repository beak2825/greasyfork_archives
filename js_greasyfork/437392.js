// ==UserScript==
// @name        Reddit - cleaner look
// @description Removes unnecessary embellishments: avatars, awards, achievements, up/down-vote arrows, online count. Hides navigation bar after scrolling. Leaving overall a much cleaner look.
// @version     0.8
// @namespace   oltodosel
// @license     MIT
// @include     https://*.reddit.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/437392/Reddit%20-%20cleaner%20look.user.js
// @updateURL https://update.greasyfork.org/scripts/437392/Reddit%20-%20cleaner%20look.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    document.head.insertAdjacentHTML('beforeend', '<style>' + css + '</style>');
}

function cleaning() {

    //GM_addStyle("#nr-ext-frame { transform: scale(0.5);}");

    // Downvotes/Upvotes arrows
    GM_addStyle("button[aria-label='upvote'] { display: none;}");
    GM_addStyle("button[aria-label='downvote'] { display: none;}");

    // nav-bar's:
        // logo
        GM_addStyle("a[aria-label='Home'] { visibility: hidden;}");
        // avatar
        GM_addStyle("span._3KfbpxpA8Esu_3UHTmIvfw._2OFo5eaD2V6ZcJsYBuYned { display: none; }");
        // coins
        GM_addStyle("._1t5i5bNwZeJ7FuUXZ9rM-p._1dJtiWITrnvIbQdXgYgdym { display: none; }");
        GM_addStyle("#COIN_PURCHASE_DROPDOWN_ID { display: none; }");
        // ads
        GM_addStyle("._2zZ-KGHbWWqrwGlHWXR90y._2I12Htze2UzJmmfnrgYJOn { display: none; }");
        GM_addStyle("button._3hna43Sh0DTnoV7v2NNc2r { display: none; }");


    // join button
    GM_addStyle("._2iuoyPiKHN3kfOoeIQalDT._10BQ7pjWbeYP63SAPNS8Ts.UEPNkU0rd1-nvbkOcBatc { display: none; }");

    // FOLLOW bar
    GM_addStyle("._10IcBRrmressbhblq2bqiU { display: none; }");

    // annoying "New Posts" blue bubble-popup on subreddits
    GM_addStyle("._369llFshxbL10dgfLlIApJ { display: none !important;}");
    // $("div[class^='_369llFshxbL10dgfLlIApJ']").hide();

    // annoying "N new comments" bubble-popup
    GM_addStyle("._3LO_LEpMLN8-uaedpg6nl4._3JKnqeBKw2wp7eHzFXNXSe { display: none !important;}");

    // Awards for Posts and Comments
    GM_addStyle("._3XoW0oYd5806XiOr24gGdb { display: none !important;}");

    // giving Awards
    GM_addStyle("button.YszYBnnIoNY8pZ6UwCivd._3yh2bniLq7bYr4BaiXowdO { display: none;}");
    // Share
    GM_addStyle("button.kU8ebCMnbXfjCWfqn0WPb { display: none;}");
    // ...
    GM_addStyle("button._2pFdCpgBihIaYh9DSMWBIu._1EbinKu2t3KjaT2gR156Qp.uMPgOFYlCc5uvpa2Lbteu { display: none;}");

    // online count (N people here)
    GM_addStyle("._1uHz4YY7qiPGVa7nGIRrUX._nvbopN4sT4l-fhb9ev1 { display: none;}");
    GM_addStyle("._3wvjcIArtO7kKPJabZfZ9S._1c98ixuh4QUWO9ERiFID3p { display: none;}");

    // buttons: share, report, save, etc; leaving only Reply
    GM_addStyle("._2hr3tRWszeMRQ0u_Whs7t8 { display: none !important;}");
    GM_addStyle("div[id$='comment-share-menu'] { display: none !important;}");
    // leaving only icon for Reply
    GM_addStyle("button._374Hkkigy4E4srsI2WktEd { font-size: 0;}");
    // ...
    GM_addStyle("i.icon-overflow_horizontal { display: none;}");

    // achievements
    GM_addStyle("div._15G4fCS1bzGgGK9kBOtN2t._28x1bnTjOY6zWZfooCxkKQ { display: none;}");
    GM_addStyle("span._3NdKulBcLHFmpKDAy9Barm._2a_XgY10KOzM0PRvywwDuY { display: none;}");

    // cakeday
    GM_addStyle("img[data-testid='cakeday-icon'] { display: none;}");

    // avatars
    GM_addStyle("div._2mHuuvyV9doV3zwbZPtIPG.ZvAy-PJfJmB8pzQxpz1sS { visibility: hidden;}");
    // // avatars for removed users
    GM_addStyle("div[to='/user/[deleted]/'] { visibility: hidden;}");

    // scaling back < > at posts with multiple images
    GM_addStyle("a._1fSFPkxZ9pToLETLQT2dmc { zoom: 50%;}");


    // reducing superfluous padding in posts
    // only in individual posts
    if (window.location.href.indexOf("/comments/") != -1) {
        GM_addStyle('[data-testid="post-container"] { padding: 0px !important; margin-left: 6px !important;}');
    }
    GM_addStyle('div._3xX726aBn29LDbsDtzr_6E { padding-right: 4px !important;}');

    // reducing superfluous padding in comments of posts
    GM_addStyle('div._1YCqQVO-9r-Up6QPB9H6_4 { padding: 0px !important;}');
    GM_addStyle('div._2M2wOqmeoPVvcSsJ6Po9-V { padding-right: 6px !important; margin: 0px !important;}');
}

var wait_for_head = setInterval(function () {
    if (document.head) {
        cleaning();

        clearInterval(wait_for_head);
    }
}, 1);


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


// hiding navigation bar after scrolling
var nav_bar_hide_scroll_px = 10;
var nav_bar_hidden = false;

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.slim.min.js';
script.type = 'text/javascript';

var wait_for_head2 = setInterval(function () {
    if (document.head) {
        document.head.appendChild(script);

        script.onload = function(){
            start();
        };

        clearInterval(wait_for_head2);
    }
}, 50);

function start() {
    $(window).on('scroll', function() {
        var y_scroll_pos = window.pageYOffset;

        if(nav_bar_hidden === false && y_scroll_pos > nav_bar_hide_scroll_px) {
            nav_bar_hidden = true;

            $("div[class^='SubredditVars']:lt(1)").hide();
            $('div[id="SHORTCUT_FOCUSABLE_DIV"] > div').first().hide();
            $("div[class^='_1mIZHouXowafuH_S8YMnxT']").hide();
            $("div[class^='MSTY2ZpsdupobywLEfx9u']").hide();

        } else if (nav_bar_hidden === true && y_scroll_pos < nav_bar_hide_scroll_px) {
            nav_bar_hidden = false;

            $("div[class^='SubredditVars']:lt(1)").show();
            $('div[id="SHORTCUT_FOCUSABLE_DIV"] > div').first().show();
            $("div[class^='_1mIZHouXowafuH_S8YMnxT']").show();
            $("div[class^='MSTY2ZpsdupobywLEfx9u']").show();
        }
    });
}