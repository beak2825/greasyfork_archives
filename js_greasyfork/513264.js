// ==UserScript==
// @name         ArkhamDB Dark Mode Favicon
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Replaces the favicon with a white version for clients with dark mode
// @author       Chr1Z
// @match        https://*.arkhamdb.com/*
// @icon         https://i.imgur.com/T3vHgln.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513264/ArkhamDB%20Dark%20Mode%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/513264/ArkhamDB%20Dark%20Mode%20Favicon.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function setDarkModeFavicon() {
    // Detect if the user is in dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Remove existing favicons
      let favicons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
      favicons.forEach(favicon => favicon.remove());

      // Create and set new dark mode favicon
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.sizes = '192x192';
      favicon.href = 'https://i.imgur.com/T3vHgln.png';
      document.head.appendChild(favicon);

      // Add the apple-touch-icon as well
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.sizes = '120x120';
      appleTouchIcon.href = 'https://i.imgur.com/sL2VXk5.png';
      document.head.appendChild(appleTouchIcon);
    }
  }

  setDarkModeFavicon();

  // Listen for changes in color scheme
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setDarkModeFavicon);
})();