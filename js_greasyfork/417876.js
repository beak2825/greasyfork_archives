// ==UserScript==
// @name Webtoon Next/Prev
// @author Ew0345
// @namespace ew0345
// @description Allows usage of Left & Right Arrows key for chapter navigation on WebToon
// @version 1.1
// @homepage https://www.youtube.com/user/ew0345
// @include *://www.webtoons.com/*/*/*/*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/417876/Webtoon%20NextPrev.user.js
// @updateURL https://update.greasyfork.org/scripts/417876/Webtoon%20NextPrev.meta.js
// ==/UserScript==

var names = ["._prevEpisode", "._nextEpisode"];

window.onkeydown = function (e) {
  switch (e.keyCode) {
	case 37: document.querySelector(names[0]) != null ? document.location = document.querySelector(names[0]).href : console.log('Already on first chapter');
      break;
	case 39: document.querySelector(names[1]) != null ? document.location = document.querySelector(names[1]).href : console.log('Aready on most recent chapter');
      break;
    default: break;
  }
};