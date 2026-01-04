// ==UserScript==
// @namespace   confused
// @name        Subreddit style remover
// @version     1
// @description Enforces consistent, generic style across all subreddits in the old reddit UI.
// @include     *.reddit.com/*
// @grant       none
// @license     MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/477625/Subreddit%20style%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/477625/Subreddit%20style%20remover.meta.js
// ==/UserScript==

var style = document.querySelectorAll('[ref="applied_subreddit_stylesheet"]');
if (style) {
  style[0].remove()
}