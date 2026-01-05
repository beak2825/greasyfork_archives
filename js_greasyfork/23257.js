// ==UserScript==
// @name        Hacker News Better Ghosted Comments
// @namespace   http://github.com/shmup
// @description Makes ghosted comments easier to read, but still obviously ghosted/different.
// @include     https://news.ycombinator.com/item?id=*
// @include     http://news.ycombinator.com/item?id=*
// @include     https://news.ycombinator.com/threads?id=*
// @include     http://news.ycombinator.com/threads?id=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/23257/Hacker%20News%20Better%20Ghosted%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/23257/Hacker%20News%20Better%20Ghosted%20Comments.meta.js
// ==/UserScript==

var foregroundColor = '#9016c9';
var ghostedComments = $('.cdd, .cdd a');

ghostedComments.css({
    'color': foregroundColor,
});