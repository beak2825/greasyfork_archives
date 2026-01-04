// ==UserScript==
// @name        Auto-refresh Youtube Pop-up
// @namespace   Violentmonkey Scripts
// @match       *://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 10/18/2023, 7:07:33 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481831/Auto-refresh%20Youtube%20Pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/481831/Auto-refresh%20Youtube%20Pop-up.meta.js
// ==/UserScript==

(function() {
  function main() {
    const start_time = Date.now();
    const interval = setInterval(function() {
      const enforcements = document.getElementsByClassName("ytd-enforcement-message-view-model");
      const has_enforcements = enforcements.length > 0;
      if (has_enforcements) {
        window.location.reload();
      }
      // const current_time = Date.now();
      // if (current_time - start_time > 10000) {
      //   clearInterval(interval);
      // }
    }, 1000);
  }
  main();
})();