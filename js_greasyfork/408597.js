// ==UserScript==
// @name         XuetangX Keyboard Shortcut
// @namespace    https://raineggplant.com/
// @version      0.0.2
// @description  增加学堂在线视频对快捷键的支持。
// @author       RainEggplant
// @match        *://next.xuetangx.com/*
// @homepageURL  https://github.com/RainEggplant/xuetangx-keyboard-shortcut
// @downloadURL https://update.greasyfork.org/scripts/408597/XuetangX%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/408597/XuetangX%20Keyboard%20Shortcut.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const DEBUG = false;

  const videoSelector = "video";
  const wrapperSelector = "#qa-video-wrap";
  const timeStep = 10;

  const observer = new MutationObserver((mutation) => {
    const wrapper = document.querySelector(wrapperSelector);
    if (wrapper) {
      observer.disconnect();
      wrapper.setAttribute("tabindex", "-1");
      wrapper.addEventListener("keydown", keyboard_shortcut);
    }
  });

  // Start waiting for wrapper element
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  function keyboard_shortcut(e) {
    if (DEBUG) console.log(e.keyCode);
    const video = document.querySelector(videoSelector);
    let time;
    let volume;
    switch (e.keyCode) {
      case 32: // Space
        e.preventDefault();
        if (video.paused) video.play();
        else video.pause();
        break;
      case 37: // Arrow Left
        e.preventDefault();
        time = video.currentTime - timeStep;
        video.currentTime = time > 0 ? time : 0;
        break;
      case 39: // Arrow Right
        e.preventDefault();
        time = video.currentTime + timeStep;
        video.currentTime = time < video.duration ? time : video.duration;
        break;
    }
  }
})();
