// ==UserScript==
// @name         Live Stream Helper
// @namespace    impossible98/livestream-helper
// @version      0.0.2
// @author       impossible98
// @description  Live Stream Helper.
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @homepageURL  https://github.com/impossible98/livestream-helper-extension
// @match        https://live.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/501655/Live%20Stream%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/501655/Live%20Stream%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  setTimeout(function() {
    const mask = document.querySelector(
      "#web-player-module-area-mask-panel"
    );
    if (mask) {
      mask.style.display = "none";
    }
  }, 1e3);

})();