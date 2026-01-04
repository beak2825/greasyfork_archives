// ==UserScript==
// @name        VideoFullscreen
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0
// @author      Edgar Araújo
// @description Fullscreen video element on Shift+Enter
// @license     MIT
// @match       *://*/*
// @downloadURL https://update.greasyfork.org/scripts/441475/VideoFullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/441475/VideoFullscreen.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(e) {
  if (e.key === "F11" && e.shiftKey) {
    toggleFullScreen();
  }
}, false);

function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.getElementsByTagName("video")[0].requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}