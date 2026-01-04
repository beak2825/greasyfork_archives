// ==UserScript==
// @author Arnold François Lecherche
// @description Get the M3U8 URL for a LiveMe replay
// @name LiveMe Replay M3U8 URL
// @namespace greasyfork.org
// @version 1.0.0
// @icon https://www.liveme.com/favicon.ico
// @include http://liveme.com/live.html?*
// @include http://*.liveme.com/live.html?*
// @include https://liveme.com/live.html?*
// @include https://*.liveme.com/live.html?*
// @license MIT
// @grant none
// @run-at document-end
// @copyright 2018 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/368584/LiveMe%20Replay%20M3U8%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/368584/LiveMe%20Replay%20M3U8%20URL.meta.js
// ==/UserScript==

(function (d, s){
  'use strict';
  var replay = d.querySelector('a.replay'), title = replay && d.querySelector('h1.crumb'), regexp = /https?:\/\/[^:]+?\.m3u8/;
  function findURL() {
    var matches = regexp.exec(d.documentElement.innerHTML);
    replay.removeEventListener('click', findURL, true);
    if (matches) title.innerHTML += ' | <a href="' + matches[0] + '" style="color: blue;">M3U8 Link</a>';
    else s(findURL, 50);
  }
  if (title) replay.addEventListener('click', findURL, true);
})(document, setTimeout);