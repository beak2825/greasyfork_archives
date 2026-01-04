// ==UserScript==
// @name         Youtube Quick Copy Subtitles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shortcut for quickly copying out the shown youtube subtitles
// @author       Gorbit99
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468604/Youtube%20Quick%20Copy%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/468604/Youtube%20Quick%20Copy%20Subtitles.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const doFlash = true;

  document.addEventListener("keydown", (event) => {
    if (event.key !== "q") {
      return;
    }

    const subtitles = [...document.querySelectorAll(".ytp-caption-segment")]

    if (subtitles.length === 0) {
      return;
    }

    const subtitle = subtitles.map((s) => s.textContent).join(" ");

    navigator.clipboard.writeText(subtitle);

    if (!doFlash) {
      return;
    }

    subtitles.forEach((s) => {s.style.background = "rgb(40, 40, 40, 0.75)"});
    setTimeout(() => {
      subtitles.forEach((s) => {s.style.background = "rgba(8, 8, 8, 0.75)"});
    }, 100);
  });
})();