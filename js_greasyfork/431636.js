// ==UserScript==
// @name         HBOGO but smooth
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes HBO lag on old PC-s by disabling styles while video is playing.
// @author       Chris
// @match        https://hbogo.hr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431636/HBOGO%20but%20smooth.user.js
// @updateURL https://update.greasyfork.org/scripts/431636/HBOGO%20but%20smooth.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setInterval(() => {
    const video = document.querySelector("video");
    const isVideoPlaying = video && !video.paused;
    const injectedStyle = document.querySelector("#hbo-smooth");
    if (isVideoPlaying) {
      if (injectedStyle) return;
      const fullscreenEl = document.querySelector("#hbo-sdk--player-fullscreen");
      fullscreenEl && fullscreenEl.click();
      const style = document.createElement("style");
      style.textContent = /* css */
        `
      *:not(.video-js) {
        all: unset;
        transition: none !important;
      }
      head, style, script {
        display: none !important;
      }
      `;
      style.id = "hbo-smooth";
      document.head.append(style);
    } else if (injectedStyle) {
      injectedStyle.remove();
    }
  }, 1000);
})();


