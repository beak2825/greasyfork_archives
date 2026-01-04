// ==UserScript==
// @name        Remove Twitch AutoPlay
// @namespace   https://github.com/Ryder7223
// @version     1.2
// @description Removes the annoying auto-playing stream that takes up half the screen in a category
// @author      Ryder7223
// @match       https://www.twitch.tv/directory/category/*
// @grant       none
// @license     CC BY-ND 4.0; You may use this script but not modify or distribute modified versions.
// @downloadURL https://update.greasyfork.org/scripts/531553/Remove%20Twitch%20AutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/531553/Remove%20Twitch%20AutoPlay.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeElements() {
    const els = document.querySelectorAll('div.Layout-sc-1xcs6mc-0.kyIYma');
    els.forEach(el => el.remove());
  }

  // Run once in case the element is already loaded
  removeElements();

  // Create a MutationObserver to watch for dynamically loaded elements
  const observer = new MutationObserver(() => removeElements());

  observer.observe(document.body, { childList: true, subtree: true });

  // Stop observing after a while (optional, to prevent infinite observation)
  setTimeout(() => observer.disconnect(), 30 * 1000); // Stops after 30 seconds
})()