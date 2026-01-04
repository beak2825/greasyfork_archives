// ==UserScript==
// @name         Hide ZDNet autoplay video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  That blasted thing keeps auto-playing and it's never of any interest whatsoever and usually unrelated to the article
// @author       Richard Blundell
// @match        http*://www.zdnet.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373846/Hide%20ZDNet%20autoplay%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/373846/Hide%20ZDNet%20autoplay%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hide that blasted ZDnet auto-play video!
    $(".videoPlayer").hide();
    $(".videoContainer").hide();
    $(".zdnetVideoPlayer").hide();
})();