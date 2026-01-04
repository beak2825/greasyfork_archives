// ==UserScript==
// @name         Auto-sub to subreddit if NSFW
// @namespace    https://www.tblop.com
// @version      1.0.3
// @description  When on a nsfw 18+ subreddit, auto clicks subscribe button if not subscribed, and adds a handy TBLOP link above subreddit title
// @author       Greg from TBLOP.com
// @match        https://www.reddit.com/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36259/Auto-sub%20to%20subreddit%20if%20NSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/36259/Auto-sub%20to%20subreddit%20if%20NSFW.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".nsfw-stamp").length > 10) {
        if ($('.subscribe-button .option.add.active')) {
            $('.subscribe-button').find('.option.add').click();
        }
    	$(".titlebox").prepend('<a href="https://www.tblop.com" style="font-size:15px;text-align:right;letter-spacing:1px;margin-bottom:4px;">[ Load TBLOP ]</a>');
    }
})();