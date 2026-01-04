// ==UserScript==
// @name         Auto Disable YouTube AutoPlay
// @namespace    https://idunwannagotoschool.com
// @version      2.2
// @license      GNU AGPLv3
// @author       John Kai
// @description  Auto disable YouTube's AutoPlay
// @match        https://*.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/480276/Auto%20Disable%20YouTube%20AutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/480276/Auto%20Disable%20YouTube%20AutoPlay.meta.js
// ==/UserScript==

var disable = setInterval(function(check) {
    if (
      ((check = document.querySelector("#autoplay-checkbox,#improved-toggle.ytd-compact-autoplay-renderer,#toggle.ytd-compact-autoplay-renderer")) &&
        check.attributes["checked"]) ||
      (check= document.querySelector('ytd-watch-flexy:not([hidden]) .ytp-autonav-toggle-button[aria-checked="true"]'))
    ) {
      check.click(console.log("desktop: autoplay disabled"));
    } else if (
      ((check = document.querySelector("button.ytm-autonav-toggle-button-container")) &&
        check.attributes["true"]) ||
      (check = document.querySelector('button.ytm-autonav-toggle-button-container[aria-pressed="true"]'))
    ) {
      check.click(console.log("mobile: autoplay disabled"));
    }
  }, 500);

setTimeout(() => {
  clearInterval(disable);
}, 6666);