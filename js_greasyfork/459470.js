// ==UserScript==
// @name         Remove YouTube Shorts from sidebar
// @namespace    https://greasyfork.org/en/users/1019658-aayush-dutt
// @version      1.1
// @description  A user script to enchance Hacker News page styles
// @author       aayushdutt
// @match        https://*.youtube.com/*
// @grant        none
// @link         https://greasyfork.org/en/scripts/459470-remove-youtube-shorts-from-sidebar/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459470/Remove%20YouTube%20Shorts%20from%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/459470/Remove%20YouTube%20Shorts%20from%20sidebar.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const styles = `<style>
    /* Sidebar expanded */
    #items > ytd-mini-guide-entry-renderer:nth-child(2) {
      display: none;
    }

    /* Sidebar collapsed */
    #items > ytd-guide-entry-renderer:nth-child(2) {
      display: none;
    }

    /* Mobile pivot bar */
    #app > ytm-pivot-bar-renderer > ytm-pivot-bar-item-renderer:nth-child(2) {
      display: none;
    }

    #contents > ytd-reel-shelf-renderer {
      display: none;
    }
  </style>`

  document.head.insertAdjacentHTML("beforeend", styles)

})();
