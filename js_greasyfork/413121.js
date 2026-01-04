// ==UserScript==
// @name         YouTube Ad Mutor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mute YouTube ads
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/413121/YouTube%20Ad%20Mutor.user.js
// @updateURL https://update.greasyfork.org/scripts/413121/YouTube%20Ad%20Mutor.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var inAd = false;
  
  function clickMute() {
    document.getElementsByClassName(
      "ytp-mute-button"
    )[0].click();
  }
  function chkAd() {
    return document.getElementsByClassName(
      "ytp-ad-player-overlay-skip-or-preview"
    ).length > 0;
  }
  function chkMute() {
    return document.getElementsByClassName(
      "ytp-volume-slider-handle"
    ).length > 0;
  }
  function mutor() {

    if (chkAd && !inAd && !chkMute) {
      clickMute();
      inAd = true;
    } else if (!chkAd && inAd && chkMute) {
      clickMute();
      inAd = false;
    }
  }

  setInterval(mutor, 10);
}());