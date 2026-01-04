// ==UserScript==
// @name        YouTube chapter auto open
// @description Automatically opens the YouTube chapter selection.
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @match       https://m.youtube.com/*
// @grant       none
// @version     2.0.1
// @author      AstragoDE (https://github.com/AstragoDE)
// @run-at      document-end
// @homepageURL https://github.com/AstragoTech/youtube_chapter_auto_open
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @compatible  chrome Chrome + Tampermonkey or Violentmonkey
// @compatible  firefox Firefox + Greasemonkey or Tampermonkey or Violentmonkey
// @compatible  opera Opera + Tampermonkey or Violentmonkey
// @compatible  edge Edge + Tampermonkey or Violentmonkey
// @compatible  safari Safari + Tampermonkey or Violentmonkey
// @license     This work © 2022 by AstragoDE is licensed under CC BY-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/455940/YouTube%20chapter%20auto%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/455940/YouTube%20chapter%20auto%20open.meta.js
// ==/UserScript==

var currentLoc = window.location.href;
var lastLoc = "";

var mainInterval = setInterval(function (timer) {
  currentLoc = window.location.href;

  // /// Print currentt location
  // window.console.log(currentLoc);

  /// Only run on change of Window Location
  if (currentLoc != lastLoc) {
    /// Only run on video link
    if (RegExp("^https://(w{3}|m).youtube.com/watch").test(currentLoc)) {
      /// Try to click the open chapter Button for 3.0 seconds
      var run = 0;
      var secondaryInterval = setInterval(function (timer) {
        run++;
        if (run <= 16) {
          document.querySelector(".ytp-chapter-title-content")?.click();
        } else {
          // timer.cancel();
          clearInterval(secondaryInterval);
        }
      }, 250);
    }
  }

  lastLoc = currentLoc;
}, 250);
