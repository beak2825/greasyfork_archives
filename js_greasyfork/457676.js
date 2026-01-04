// ==UserScript==
// @name        YouTube Disable Ambient Mode
// @namespace   natehak.com
// @match       *://*.youtube.com/*
// @exclude     *://*.youtube.com/embed/*
// @grant       none
// @version     1.0.1
// @license     GPLv3
// @author      @natehak
// @description Disables YouTube ambient mode if its turned on.
// @downloadURL https://update.greasyfork.org/scripts/457676/YouTube%20Disable%20Ambient%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/457676/YouTube%20Disable%20Ambient%20Mode.meta.js
// ==/UserScript==

let id = setInterval(() => {
  document.querySelector('.ytp-settings-button').click();
  let ambientModeItem = document.querySelector('#ytp-id-18 .ytp-menuitem[tabindex="0"]');
  let itemIsAmbientMode = ambientModeItem !== null
    ? ambientModeItem.querySelector('.ytp-menuitem-label').innerText === 'Ambient mode'
    : false;
  let ambientModeEnabled = ambientModeItem !== null
    ? ambientModeItem.getAttribute('aria-checked') === 'true'
    : false;

  if (itemIsAmbientMode) {
    clearInterval(id);
    if (ambientModeEnabled) {
      ambientModeItem.click();
      console.info('YouTube Ambient Mode: Disabled');
    }
  }
  document.querySelector('.ytp-settings-button').click();
}, 2500);