// ==UserScript==
// @name         CourseraUXEnhancer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make Coursera better! Enlarge reading material font size; enforce Space key & ArrowLeft key & ArrowRight key work properly when playing video.
// @author       Winston Shu
// @match        *://*.coursera.org/learn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454300/CourseraUXEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/454300/CourseraUXEnhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const observer = new MutationObserver(() => {
    let previousUrl = "";
    let root = document.querySelector("html");

    if (location.href !== previousUrl) {
      previousUrl = location.href;

      if (
        location.href.includes("/supplement/") ||
        location.href.includes("/gradedLti") ||
        location.href.includes("/ungradedLti") ||
        location.href.includes("/discussionPrompt")
      ) {
        root.style.fontSize = "23px";
      } else {
        injectSpaceKey();
        root.style.fontSize = "16px";
      }
    }
  });
  const config = { subtree: true, childList: true };
  observer.observe(document, config);

  function injectSpaceKey() {
    window.onload = () => {
      window.addEventListener("keydown", (key) => {
        let media = document.querySelector("video");

        if (key.code == "Space") {
          media.paused || media.currentTime == 0 ? media.play() : media.pause();
        } else if (key.code == "ArrowLeft") {
          media.currentTime >= 5
            ? (media.currentTime -= 5)
            : (media.currentTime = 0);
        } else if (key.code == "ArrowRight") {
          media.currentTime <= media.duration - 5
            ? (media.currentTime += 5)
            : (media.currentTime = media.currentTime);
        }
      });
    };
  }
})();
