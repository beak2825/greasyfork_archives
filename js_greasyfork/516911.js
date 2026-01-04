// ==UserScript==
// @name        YouTube Live show timer
// @namespace   Violentmonkey Scripts
//
// Just match all of them, should be fine, applies on any site :)
// @match       https://www.youtube.com/live/*
// @match       https://www.youtube.com/watch?v=*
// @match       https://www.youtube.com/embed/*
//
// @grant       none
// @version     1.0.4
// @author      mif
// @license     MIT
// @description 11/11/2024, 9:55:55 PM
// @downloadURL https://update.greasyfork.org/scripts/516911/YouTube%20Live%20show%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/516911/YouTube%20Live%20show%20timer.meta.js
// ==/UserScript==

function GM_addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}


// original line
GM_addStyle('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > span.ytp-time-wrapper > span.ytp-time-current { display: contents!important; }');

// As of 2025-05-09
GM_addStyle('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > span.ytp-time-wrapper > div > span.ytp-time-current { display: contents!important; }');

// As of 2025-11-24 - why is there an additional div now? idk
GM_addStyle('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > div > div { display: contents!important; }');
GM_addStyle('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > div > div > span.ytp-time-current { display: contents!important; }');
// GM_addStyle('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > div > div > span.ytp-time-separator { display: none; }');
GM_addStyle('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > div > div > span.ytp-time-duration { display: none; }');

// --- Fix for missing "Skip ahead to live broadcast."
GM_addStyle('.ytp-time-display { display: contents; line-height: unset; }');
// As of 2025-09-17 - Restore Next video button (I LOVE A/B TESTS)
GM_addStyle('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button.ytp-playlist-ui { display: unset!important;}');
