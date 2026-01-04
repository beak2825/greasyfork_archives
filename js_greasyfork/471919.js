// ==UserScript==
// @name         Mediathek Videos
// @namespace    Video
// @version      0.2
// @license      MIT
// @description  Overwrites CSS variable of .ardplayer element that creates dark controls.
// @match        https://www.ardmediathek.de/*
// @match        https://www.rbb-online.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471919/Mediathek%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/471919/Mediathek%20Videos.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function overrideCSSVariable() {
    const ardPlayer = document.querySelector('.ardplayer');
    if (ardPlayer) {
      // set to transparent
      ardPlayer.style.setProperty('--ardplayer-color-ui-background-shim', 'rgba(0, 0, 0, 0)');
      observer.disconnect();
    }
  }

  const observer = new MutationObserver(overrideCSSVariable);

  // start observer for document changes
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
