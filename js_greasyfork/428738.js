// ==UserScript==
// @name        Old Reddit Redirector
// @description	Redirects to old.reddit.com instead of neo reddit (C) TheNH813 2018. License WTFPLV2
// @version		1.0
// @match       *://*.reddit.com/*
// @run-at      document-start
// @grant       none
// Original script by /u/TheNH713 https://old.reddit.com/r/userscripts/comments/8v0amu/autoredirect_good_ol_reddit_oldredditcom/
// @namespace https://greasyfork.org/users/29660
// @downloadURL https://update.greasyfork.org/scripts/428738/Old%20Reddit%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/428738/Old%20Reddit%20Redirector.meta.js
// ==/UserScript==

if ( window.location.host != "old.reddit.com" ) {
    var oldReddit  = window.location.protocol + "//" + "old.reddit.com" + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace (oldReddit);
}