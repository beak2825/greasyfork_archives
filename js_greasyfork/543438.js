// ==UserScript==
// @name         Keep YT Sidebar Open
// @namespace    https://www.youtube.com/
// @version      2025-07-23
// @description  Fuck youtube & keep the sidebar open goddamnit
// @author       trevor229
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543438/Keep%20YT%20Sidebar%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/543438/Keep%20YT%20Sidebar%20Open.meta.js
// ==/UserScript==

(function () {
  function waitForSidebarIcon(callback) {
    const selector = 'ytd-mini-guide-renderer ytd-mini-guide-entry-renderer a#endpoint';

    const el = document.querySelector(selector);
    if (el) return callback();

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  waitForSidebarIcon(() => {
    const masthead = document.querySelector('ytd-masthead');
    if (masthead) {
      masthead.removeAttribute('visible');
      masthead.setAttribute('persistent-and-visible', '');
    }

    const appDrawer = document.querySelector('tp-yt-app-drawer');
    if (appDrawer) {
      appDrawer.setAttribute('opened', '');
    }

    const app = document.querySelector('ytd-app');
    if (app) {
      app.removeAttribute('mini-guide-visible');
      app.setAttribute('guide-persistent-and-visible', '');
    }

    const miniGuide = document.querySelector('ytd-mini-guide-renderer');
    if (miniGuide) {
      miniGuide.setAttribute('hidden', '');
    }

    console.log('Sidebar fully opened!');
  });
})();