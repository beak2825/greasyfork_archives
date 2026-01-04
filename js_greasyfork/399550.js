// ==UserScript==
// @name        Old Reddit - Limit Subreddit Search
// @description Automatically checks the "Limit my search to..." checkbox when searching.
// @namespace   r-a-y/reddit/subredditsearch
// @match       https://old.reddit.com/r/*
// @author      r-a-y
// @version     1.0
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/399550/Old%20Reddit%20-%20Limit%20Subreddit%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/399550/Old%20Reddit%20-%20Limit%20Subreddit%20Search.meta.js
// ==/UserScript==

document.querySelector( 'input[name="restrict_sr"]' ).checked = true;
