// ==UserScript==
// @name         RARGB Subtitles
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      7
// @description  Quickly know if a file has subtitles or not.
// @author       hacker09
// @include      https://rargb.to/torrent/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://rargb.to
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492415/RARGB%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/492415/RARGB%20Subtitles.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  document.querySelector("#hvicwlo").textContent += document.body.textContent.match(/(\.srt|\.ass|\.vtt|\.sub(?!string)|subtitle|(TEXT\/)?UTF-?8|VobSub|subrip)/gi) ? ' (HAS SUBS!)' : ' (NO SUBS!)'; //Add a message in the torrent title whether or not the page contains a text that means that it has subtitles
})();