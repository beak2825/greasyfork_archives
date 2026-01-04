// ==UserScript==
// @name         YouTube Playback Speed Buttons
// @description  Adds playback speed buttons to youtube player control bar.
// @version      1.0.3
// @license      MIT
// @author       bowencool
// @match        https://www.youtube.com/*
// @namespace    https://www.youtube.com/
// @author       bowencool
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/475864
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/waitForElementToExist.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475864/YouTube%20Playback%20Speed%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/475864/YouTube%20Playback%20Speed%20Buttons.meta.js
// ==/UserScript==
"use strict";

async function main() {
  const menuR = await waitForElementToExist(".ytp-right-controls-left");
  const video = await waitForElementToExist(".html5-main-video");
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy("default", {
      createHTML: (string, sink) => string,
    });
  }
  GM_addStyle(`.speed-button svg {
    padding: 0!important;
  }`);
  const storedPlaybackRate = parseFloat(
    sessionStorage.getItem("playback-rate"),
    10
  );

  if (storedPlaybackRate > 0) {
    video.playbackRate = storedPlaybackRate;
  }

  const fasterButton = document.createElement("button");
  fasterButton.setAttribute("aria-label", "10% faster");
  fasterButton.title = "10% faster";
  fasterButton.innerHTML = window.trustedTypes.defaultPolicy
    .createHTML`<svg version="1.1" viewBox="0 0 36 36" height="100%" width="100%"><path fill="white" d="m 11.494141,8 c -2.6853634,0 -4.8652346,2.17987 -4.8652348,4.865234 0,2.685363 2.1798714,4.865235 4.8652348,4.865235 2.685364,0 4.865234,-2.179872 4.865234,-4.865235 C 16.359375,10.17987 14.179505,8 11.494141,8 Z m -0.679688,1.4609375 h 1.359375 v 2.7246095 h 2.722656 v 1.359375 h -2.722656 v 2.722656 H 10.814453 V 13.544922 H 8.0917969 v -1.359375 h 2.7226561 z m 6.865235,-1.4550784 a 11.389523,11.389523 0 0 0 -1.66211,0.185547 c 0.60671,0.587327 1.100701,1.289573 1.44336,2.0742189 a 9.1116182,9.1116182 0 0 1 4.597656,0.9375 l 2.107422,-1.4003909 a 11.389523,11.389523 0 0 0 -6.486328,-1.796875 z m 8.365234,3.2773439 -9.667969,6.445313 a 2.2779046,2.2779046 0 0 0 0,3.224609 2.2779046,2.2779046 0 0 0 3.222656,0 z m 1.492187,1.867188 -0.0098,0.01172 -1.402344,2.107422 a 9.1116182,9.1116182 0 0 1 -0.25,8.632813 H 10.089844 A 9.1116182,9.1116182 0 0 1 8.8925783,18.830078 C 8.1084503,18.487267 7.4072416,17.993284 6.8203125,17.386719 a 11.389523,11.389523 0 0 0 1.3105468,7.654297 2.2779046,2.2779046 0 0 0 1.9589847,1.138672 h 15.773437 a 2.2779046,2.2779046 0 0 0 1.982422,-1.138672 11.389523,11.389523 0 0 0 -0.308594,-11.890625 z"></path></svg>`;
  fasterButton.classList.add("ytp-button", "speed-button");
  fasterButton.onclick = () => {
    const speed = Math.ceil(video.playbackRate * 11) / 10;
    console.log(speed);
    video.playbackRate = speed;
    sessionStorage.setItem("playback-rate", speed);
  };
  menuR.prepend(fasterButton);

  const resetButton = document.createElement("button");
  resetButton.setAttribute("aria-label", "Reset to 1x");
  resetButton.title = "Reset to 1x";
  resetButton.innerHTML = window.trustedTypes.defaultPolicy
    .createHTML`<svg version="1.1" viewBox="0 0 36 36" height="100%" width="100%"><path fill="white" d="m 27.526463,13.161756 -1.400912,2.107062 a 9.1116182,9.1116182 0 0 1 -0.250569,8.633258 H 10.089103 A 9.1116182,9.1116182 0 0 1 22.059491,11.202758 L 24.166553,9.8018471 A 11.389523,11.389523 0 0 0 8.1301049,25.041029 2.2779046,2.2779046 0 0 0 10.089103,26.179981 H 25.863592 A 2.2779046,2.2779046 0 0 0 27.845369,25.041029 11.389523,11.389523 0 0 0 27.537852,13.150367 Z M 16.376119,20.95219 a 2.2779046,2.2779046 0 0 0 3.223235,0 l 6.446471,-9.669705 -9.669706,6.44647 a 2.2779046,2.2779046 0 0 0 0,3.223235 z"></path></svg>`;
  resetButton.classList.add("ytp-button", "speed-button");
  resetButton.onclick = () => {
    video.playbackRate = 1;
    sessionStorage.removeItem("playback-rate");
  };
  menuR.prepend(resetButton);

  const slowerButton = document.createElement("button");
  slowerButton.setAttribute("aria-label", "10% slower");
  slowerButton.title = "10% slower";
  slowerButton.innerHTML = window.trustedTypes.defaultPolicy
    .createHTML`<svg version="1.1" viewBox="0 0 36 36" height="100%" width="100%"><path fill="white" d="M 24.505859 8 C 21.820495 8 19.640625 10.17987 19.640625 12.865234 C 19.640625 15.550597 21.820495 17.730469 24.505859 17.730469 C 27.191222 17.730469 29.371094 15.550597 29.371094 12.865234 C 29.371094 10.17987 27.191222 8 24.505859 8 z M 18.320312 8.0058594 A 11.389523 11.389523 0 0 0 11.833984 9.8027344 L 13.941406 11.203125 A 9.1116182 9.1116182 0 0 1 18.539062 10.265625 C 18.881721 9.48098 19.375712 8.7787333 19.982422 8.1914062 A 11.389523 11.389523 0 0 0 18.320312 8.0058594 z M 9.9550781 11.283203 L 16.400391 20.953125 A 2.2779046 2.2779046 0 0 0 19.623047 20.953125 A 2.2779046 2.2779046 0 0 0 19.623047 17.728516 L 9.9550781 11.283203 z M 21.103516 12.185547 L 23.826172 12.185547 L 25.185547 12.185547 L 26.738281 12.185547 L 27.908203 12.185547 L 27.908203 13.544922 L 25.455078 13.544922 L 25.185547 13.544922 L 23.826172 13.544922 L 23.367188 13.544922 L 21.103516 13.544922 L 21.103516 12.185547 z M 8.4628906 13.150391 A 11.389523 11.389523 0 0 0 8.1542969 25.041016 A 2.2779046 2.2779046 0 0 0 10.136719 26.179688 L 25.910156 26.179688 A 2.2779046 2.2779046 0 0 0 27.869141 25.041016 A 11.389523 11.389523 0 0 0 29.179688 17.386719 C 28.592758 17.993284 27.89155 18.487267 27.107422 18.830078 A 9.1116182 9.1116182 0 0 1 25.910156 23.902344 L 10.125 23.902344 A 9.1116182 9.1116182 0 0 1 9.875 15.269531 L 8.4726562 13.162109 L 8.4628906 13.150391 z "></path></svg>`;
  slowerButton.classList.add("ytp-button", "speed-button");
  slowerButton.onclick = () => {
    const speed = Math.floor(video.playbackRate * 9) / 10;
    console.log(speed);
    if (speed === 0) return;
    video.playbackRate = speed;
    sessionStorage.setItem("playback-rate", speed);
  };
  menuR.prepend(slowerButton);
}
main();
