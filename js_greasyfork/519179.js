// ==UserScript==
// @name         Udemy Hide Video Playback Controls
// @namespace    https://github.com/RahulSabinkar
// @version      2024-11-28
// @description  Hide Playback Controls by pressing Alt + h, and unhide it by ALT + d
// @author       Rahul Sabinkar
// @match        https://www.udemy.com/course/*
// @icon         https://www.udemy.com/staticx/udemy/images/v7/apple-touch-icon.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519179/Udemy%20Hide%20Video%20Playback%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/519179/Udemy%20Hide%20Video%20Playback%20Controls.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("keydown", (event) => {
    const controls = document.querySelector(
      ".shaka-control-bar--control-bar-container--OfnMI"
    );
    const nextAndPrevious = document.querySelectorAll(
      ".next-and-previous--container--kZxyo"
    );
    const headerGradient = document.querySelector(
      ".video-viewer--header-gradient--x4Zw0"
    );
    const headerTitle = document.querySelector(
      ".video-viewer--title-overlay--YZQuH"
    );
    if (event.key === "h" && event.altKey) {
      controls.setAttribute("style", "opacity: 0 !important");
      nextAndPrevious.forEach((element) => {
        element.setAttribute("style", "opacity: 0 !important");
      });
      headerGradient.setAttribute("style", "display: none !important");
      headerTitle.setAttribute("style", "display: none !important");
    } else if (event.key === "d" && event.altKey) {
      controls.setAttribute("style", "opacity: 1 !important");
      nextAndPrevious.forEach((element) => {
        element.setAttribute("style", "opacity: 1 !important");
      });
      headerGradient.setAttribute("style", "display: block !important");
      headerTitle.setAttribute("style", "display: block !important");
    }
  });
})();
