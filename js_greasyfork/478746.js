// ==UserScript==
// @name        SC: highlight hypeddits
// @namespace   Violentmonkey Scripts
// @match       https://soundcloud.com/*
// @grant       none
// @version     0.1.3
// @author      -
// @description highlight tracks with hypeddit or otherwise download/buy link
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478746/SC%3A%20highlight%20hypeddits.user.js
// @updateURL https://update.greasyfork.org/scripts/478746/SC%3A%20highlight%20hypeddits.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function process(track) {
    const link = track.querySelector('a.soundActions__purchaseLink');
    if (!link) { return; }
    if (link.href.includes('hypeddit.com/')) {
      track.querySelector('a.sc-link-primary').style.background = '#f5d5eb';
    } else {
      track.querySelector('a.sc-link-primary').style.background = '#d5ebf5';
    }
  }

  const observer = new MutationObserver(() => {
      document.querySelectorAll('div.sound__content').forEach(elm => process(elm) );
    });
  observer.observe(document.querySelector('#app'), { childList: true, subtree: true });


})();