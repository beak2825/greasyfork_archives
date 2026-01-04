// ==UserScript==
// @name        YouTube: Fix Auto Quality Issue
// @namespace   UserScript
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.0
// @license MIT
// @author      CY Fung
// @description To fix auto quality issue on YouTube
// @require     https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @downloadURL https://update.greasyfork.org/scripts/469953/YouTube%3A%20Fix%20Auto%20Quality%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/469953/YouTube%3A%20Fix%20Auto%20Quality%20Issue.meta.js
// ==/UserScript==

(() => {

  function main() {
    const arr = [
      'yt-player-bandwidth',
      'yt-player-headers-readable',
      'yt-player-performance-cap',
      'yt-player-quality',
      'yt-player-sticky-caption'
    ]

    for (const s of arr) {

      localStorage.removeItem(s)
    }
  }

  document.addEventListener('yt-navigate-start', main, false);
  main();

})();
