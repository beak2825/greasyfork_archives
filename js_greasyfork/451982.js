// ==UserScript==
// @name         SkipTime
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a shortcut (CTRL + Arrow Left / Right) with which you can skip time in a video by a custom amount.
// @author       idjawoo
// @match        *://*/*
// @icon         https://cdn.discordapp.com/attachments/816751871896453120/1023498342329757786/unknown.png
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451982/SkipTime.user.js
// @updateURL https://update.greasyfork.org/scripts/451982/SkipTime.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Amount of seconds to skip forward- adjust to your liking.
  const skipValue = 88;

  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  let video = undefined;
  waitForElm("video").then((elm) => {
    video = elm;
    document.onkeydown = function (e) {
      if (e.ctrlKey) {
        if (e.key == "ArrowRight")
          elm.currentTime = elm.currentTime + skipValue;
        if (e.key == "ArrowLeft") elm.currentTime = elm.currentTime - skipValue;
      }
    };
  });
})();
