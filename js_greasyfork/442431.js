// ==UserScript==
// @name         youtube speed+
// @namespace    https://github.com/rafalou38
// @version      1.0.1
// @description  Better speed controls for youtube, use `o` to slow down, `p` to speed up. Time is displayed according to the speed of the video.
// @author       RafaelMC
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442431/youtube%20speed%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/442431/youtube%20speed%2B.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("YOUTUBE SPEED SWITCH INJECTED");
  const video = document.querySelector(".html5-main-video");
  const wrapper = document.querySelector(".ytp-time-display");
  const speedView = document.createElement("span");

  speedView.classList.add("ytp-time-current");
  speedView.style.marginLeft = "2ch";
  if (video.playbackRate !== 1) speedView.innerText = video.playbackRate + "x";
  wrapper.appendChild(speedView);

  let lastTimeout = null;
  document.onkeydown = (e) => {
    const bezel = document.querySelector(".ytp-bezel-text");

    if (e.key == "p") {
      video.playbackRate += 0.25;
      console.log("YOUTUBE SPEED +");
    } else if (e.key == "o") {
      video.playbackRate -= 0.25;
      console.log("YOUTUBE SPEED -");
    } else return;

    bezel.parentNode.parentNode.style.display = "";
    bezel.innerText = video.playbackRate + "x";

    if (lastTimeout) clearTimeout(lastTimeout);

    lastTimeout = setTimeout(() => {
      bezel.parentNode.parentNode.style.display = "none";
    }, 1000);

    speedView.innerText =
      video.playbackRate === 1 ? "" : video.playbackRate + "x";
  };

  // override the youtube's default speed function
  const old_speed_fn = _yt_player.hJ;
  _yt_player.hJ = (a, b) => {
    if (!b) a /= video.playbackRate;
    return old_speed_fn(a, b);
  };
})();
