// ==UserScript==
// @name            YouTube Fullscreen Enhancer
// @description     This script enhances the user experience when pausing a YouTube video in full-screen mode by hiding certain elements and adding a play icon.
// @author          Wanten
// @copyright       2024 Wanten
// @license         MIT
// @supportURL      https://github.com/WantenMN/youtube-fullscreen-enhancer/issues
// @icon            https://youtube.com/favicon.ico
// @homepageURL     https://github.com/WantenMN/youtube-fullscreen-enhancer
// @namespace       https://greasyfork.org/en/scripts/460569
// @version         0.2.4
// @match           http*://*.youtube.com/*
// @match           http*://youtube.com/*
// @match           http*://*.youtu.be/*
// @match           http*://youtu.be/*
// @run-at          document-end
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460569/YouTube%20Fullscreen%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/460569/YouTube%20Fullscreen%20Enhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy("default", {
      createHTML: (string) => string,

      createScriptURL: (string) => string,

      createScript: (string) => string,
    });
  }

  const playIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"><path fill="#e01b24" d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765c1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831M9.996 15.005l.005-6l5.207 3.005z"/></svg>`;

  const defaultStyle = `.ytp-bezel { display: none !important; }`;

  const toggleStyle = `
    .ytp-chrome-top, .ytp-gradient-top,
    .ytp-gradient-bottom, .ytp-chrome-bottom,
    .ytp-overlays-container, .ytp-fullscreen-grid {
      display: none !important;
    }
    .caption-window, .caption-window.ytp-caption-window-bottom,
    .caption-window ytp-caption-window-top {
      margin-bottom: 0 !important;
      margin-top: 0 !important;
    }
  `;

  const playIconContainerEleStyle = {
    position: "absolute",
    zIndex: 69,
    width: "100%",
    height: "0",
    bottom: "0",
    background: "red",
  };

  const playIconEleStyle = {
    position: "absolute",
    right: "30px",
    bottom: "60px",
  };

  let html5VideoPlayerEle = null;
  let html5MainVideoEle = null;
  let toggleStyleEle = null;
  let mouseMoveTimeoutId = null;
  const classNamesToCheckForHover = ["ytp-chrome-top", "ytp-chrome-bottom"];
  const playIconContainerEle = document.createElement("div");
  playIconContainerEle.innerHTML = playIconSVG;
  const playIconEle = playIconContainerEle.querySelector("svg");

  Object.assign(playIconContainerEle.style, playIconContainerEleStyle);
  Object.assign(playIconEle.style, playIconEleStyle);

  const addToggleStyleEle = () => {
    const isHover = isAnyElementHovered(classNamesToCheckForHover);
    if (isHover) return;

    toggleStyleEle = GM_addStyle(toggleStyle);
  };

  const addDefaultStyleEle = () => GM_addStyle(defaultStyle);

  const removeToggleStyleEle = () => {
    toggleStyleEle?.parentNode?.removeChild(toggleStyleEle);
    toggleStyleEle = null;
  };

  const isAnyElementHovered = (classNames) => {
    for (let className of classNames) {
      let elements = document.getElementsByClassName(className);
      for (let element of elements) {
        if (element.matches(":hover")) {
          return true;
        }
      }
    }
    return false;
  };

  const handleMouseMoveEvent = () => {
    clearTimeout(mouseMoveTimeoutId);
    if (toggleStyleEle) removeToggleStyleEle();
    mouseMoveTimeoutId = setTimeout(addToggleStyleEle, 1000);
  };

  const appendPlayIconContainerEle = () =>
    html5VideoPlayerEle.appendChild(playIconContainerEle);

  const removePlayIconContainerEle = () =>
    html5VideoPlayerEle.removeChild(playIconContainerEle);

  const initialHtml5MainVideoEleEvent = () => {
    html5MainVideoEle.addEventListener("play", () =>
      removePlayIconContainerEle(),
    );
    html5MainVideoEle.addEventListener("pause", () =>
      appendPlayIconContainerEle(),
    );
  };

  const initializeElements = () => {
    html5VideoPlayerEle = document.querySelector(".html5-video-player");
    html5MainVideoEle = document.querySelector(".html5-main-video");

    if (!html5VideoPlayerEle || !html5MainVideoEle) return;
    initialHtml5MainVideoEleEvent();
    clearInterval(initializeElementsIntervalId);
  };

  let initializeElementsIntervalId = setInterval(initializeElements, 300);

  window.addEventListener("load", () => {
    addDefaultStyleEle();
  });

  window.addEventListener("mousemove", handleMouseMoveEvent);
})();
