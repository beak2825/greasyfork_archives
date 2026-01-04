// ==UserScript==
// @name         Player controls for DataCamp
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Adds player controls
// @author       Avi (https://avi12.com)
// @copyright    2025 Avi (https://avi12.com)
// @license      MIT
// @match        https://projector.datacamp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=datacamp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532360/Player%20controls%20for%20DataCamp.user.js
// @updateURL https://update.greasyfork.org/scripts/532360/Player%20controls%20for%20DataCamp.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener("keydown", e => {
    const elPlaybackRateCurrent = document.querySelector(".vjs-menu-item[aria-checked=true]");
    const elVideo = document.querySelector("video");

    switch (e.code) {
      case "Home":
        elVideo.currentTime = 0;
        break;

      case "End":
        elVideo.currentTime = elVideo.duration;
        break;

      case "Comma":
        if (!e.shiftKey) {
          return;
        }
        elPlaybackRateCurrent.nextElementSibling?.click();
        elVideo.focus();
        break;

      case "Period":
        if (!e.shiftKey) {
          return;
        }
        elPlaybackRateCurrent.previousElementSibling?.click();
        elVideo.focus();
        break;
    }
  });
})();
