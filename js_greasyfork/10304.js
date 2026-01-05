// ==UserScript==
// @name        Hacker News Unicode upvotes
// @namespace   news.ycombinator.com
// @description Replace upvote arrows on Hacker News with Unicode characters
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @version     1
// @grant       none
// @license     UNLICENSE
// @downloadURL https://update.greasyfork.org/scripts/10304/Hacker%20News%20Unicode%20upvotes.user.js
// @updateURL https://update.greasyfork.org/scripts/10304/Hacker%20News%20Unicode%20upvotes.meta.js
// ==/UserScript==

var arrows = document.getElementsByClassName('votearrow');
var i = arrows.length;
while (i--) {
	var arrow = arrows[i];
	arrow.className = 'title';
	arrow.innerHTML = '▲';
}
