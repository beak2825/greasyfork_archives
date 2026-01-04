// ==UserScript==
// @name         Youtube Music (YTM) Keyboard controls
// @namespace    http://tampermonkey.net/
// @version      2025-07-01
// @description  Seek and control volume using keyboard arrows in YouTube Music.
// @author       You
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541366/Youtube%20Music%20%28YTM%29%20Keyboard%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/541366/Youtube%20Music%20%28YTM%29%20Keyboard%20controls.meta.js
// ==/UserScript==

const keyEventRight = new KeyboardEvent("keydown", { key: "ArrowRight" });
const keyEventLeft = new KeyboardEvent("keydown", { key: "ArrowLeft" });

(function () {
  "use strict";
  window.addEventListener("keydown", e => {
    const progressBar = document.querySelector("#progress-bar");
    const volumeSlider = document.querySelector("#volume-slider");

    if (document.activeElement === progressBar || document.activeElement === volumeSlider) {
      return; // Ignore key events if the progress bar or volume slider is focused
    }

    switch (e.key) {
      case "ArrowRight":
        progressBar
          .dispatchEvent(keyEventRight);
        break;
      case "ArrowLeft":
        progressBar
          .dispatchEvent(keyEventLeft);
        break;
      case "ArrowUp":
        volumeSlider
          .dispatchEvent(keyEventRight);
        break;
      case "ArrowDown":
        volumeSlider
          .dispatchEvent(keyEventLeft);
        break;
    }
  });
})();
