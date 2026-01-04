// ==UserScript==
// @name        BC: Title Case tracks
// @namespace   userscript1
// @match       https://*.bandcamp.com/*
// @match       https://*.bandcamp.com/
// @grant       none
// @version     0.1.3
// @description change ALL CAPS TRACKS to Title Case
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456276/BC%3A%20Title%20Case%20tracks.user.js
// @updateURL https://update.greasyfork.org/scripts/456276/BC%3A%20Title%20Case%20tracks.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.querySelectorAll('span.track-title').forEach((t) => {
    if (t.textContent == t.textContent.toUpperCase() ) {
      t.textContent = t.textContent.toLowerCase();
      t.style.textTransform = 'capitalize';
    }
  });

})();