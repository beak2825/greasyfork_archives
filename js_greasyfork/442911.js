// ==UserScript==
// @name         Make Ukelele tabs visible on ukulele-tabs.com
// @namespace    joey.parrish
// @version      1.0.4
// @description  Remove extraneous elements to make ukelele tabs visible
// @author       Joey Parrish
// @match        *://www.ukulele-tabs.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442911/Make%20Ukelele%20tabs%20visible%20on%20ukulele-tabscom.user.js
// @updateURL https://update.greasyfork.org/scripts/442911/Make%20Ukelele%20tabs%20visible%20on%20ukulele-tabscom.meta.js
// ==/UserScript==

(() => {
  // Hide the left-hand side-bar
  sidebar.style.display = 'none';

  // Let the main tab area take up the whole width.
  main.style.width = 'auto';

  // Drop the obnoxious video ad, which may not be loaded yet.
  const adIntervalId = setInterval(() => {
    if (window.primisPlayerContainerDiv) {
      primisPlayerContainerDiv.remove();
      clearInterval(adIntervalId);
    }
  }, 1000);
})();

// Now you can read the whole tab.
