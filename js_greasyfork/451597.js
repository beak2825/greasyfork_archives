// ==UserScript==
// @name        HN for vampires
// @description feeling bloodthirsty?
// @author      libele
// @icon        https://news.ycombinator.com/favicon.ico
// @namespace   https://greasyfork.org/en/scripts/451597-hn-for-vampires
// @include     https://news.ycombinator.com/*
// @version     0.1
// @license     UNLICENSE
// @grant       none
// @compatible  firefox
// @downloadURL https://update.greasyfork.org/scripts/451597/HN%20for%20vampires.user.js
// @updateURL https://update.greasyfork.org/scripts/451597/HN%20for%20vampires.meta.js
// ==/UserScript==

var arrows = document.getElementsByClassName('votearrow');
var i = arrows.length;
while (i--) {
  var arrow = arrows[i];
  arrow.innerHTML = '🩸';
  arrow.className = 'title';
  arrow.setAttribute('title', 'suck');
}