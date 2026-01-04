// ==UserScript==
// @name        F95 Auto Open Filter Drawer
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.3.4
// @author      Edexal
// @description Automatically open the filter drawer when visiting the Latest Update page.
// @homepageURL https://sleazyfork.org/en/scripts/541896-f95-auto-open-filter-drawer
// @supportURL  https://github.com/Edexaal/scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/541896/F95%20Auto%20Open%20Filter%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/541896/F95%20Auto%20Open%20Filter%20Drawer.meta.js
// ==/UserScript==
(() => {
  function openDrawer() {
    const observer = new MutationObserver(() => {
      const drawerButton = document.querySelector('#controls_filter-toggle');
      if (drawerButton) {
        drawerButton.click();
        observer.disconnect();
      }
    });
    observer.observe(document.querySelector('#latest-page_sub-nav'), {
      subtree: true,
      childList: true
    });
  }

  openDrawer();
})();
