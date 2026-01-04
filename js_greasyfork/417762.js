// ==UserScript==
// @name         osu Auto Play
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  will try to auto play the song of the current beatmap
// @author       Arjix
// @include        https://osu.ppy.sh/beatmapsets/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417762/osu%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/417762/osu%20Auto%20Play.meta.js
// ==/UserScript==

function fullUrlChangeDetect(callback) {
  let currentPage = '';
  const intervalId = setInterval(function() {
    if (currentPage !== window.location.href) {
      currentPage = window.location.href;
      callback();
    }
  }, 100);

  return Number(intervalId);
}

(function() {
    'use strict';
    window.addEventListener("load", function () {
        fullUrlChangeDetect(function() {
            document.querySelector("div.beatmapset-stats > button").click()
    })
}, false)
})();