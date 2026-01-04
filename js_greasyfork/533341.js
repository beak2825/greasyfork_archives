// ==UserScript==
// @name         Remove & Redirect YouTube Shorts
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Removes YouTube Shorts buttons and redirects Shorts URLs to homepage. Handles both sidebar and app drawer versions and kills Shorts tiles across YouTube.
// @author       adrianooandrade
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533341/Remove%20%20Redirect%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/533341/Remove%20%20Redirect%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SHORTS_URL_REGEX = /\/shorts\/[\w-]+/;
  const SHORTS_ICON_PATH =
    "m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z";

  function redirectIfShorts() {
    if (SHORTS_URL_REGEX.test(location.pathname)) {
      console.log("[TM] Redirecting Shorts to home");
      location.replace("https://www.youtube.com/");
    }
  }

  function removeShortsButtonsEverywhere() {
    // Expanded drawer
    document.querySelectorAll('tp-yt-app-drawer #guide-renderer').forEach(drawer => {
      drawer.querySelectorAll('ytd-guide-entry-renderer').forEach(entry => {
        const path = entry.querySelector('path[fill-rule="evenodd"]');
        if (path?.getAttribute('d') === SHORTS_ICON_PATH) {
          console.log('[TM] Removed Shorts button from app drawer');
          entry.remove();
        }
      });
    });

    // Collapsed sidebar
    document.querySelectorAll('ytd-mini-guide-renderer #items ytd-mini-guide-entry-renderer').forEach(entry => {
      const path = entry.querySelector('path[fill-rule="evenodd"]');
      if (path?.getAttribute('d') === SHORTS_ICON_PATH) {
        console.log('[TM] Removed Shorts button from mini guide');
        entry.remove();
      }
    });
  }

  function nukeShortsContent() {
    // Shorts shelves
    document.querySelectorAll('ytd-rich-shelf-renderer, ytd-reel-shelf-renderer, ytd-reel-item-renderer').forEach(el => {
      const title = el.querySelector('#title');
      const hasShortsLink = el.querySelector('a[href^="/shorts"]');
      if ((title && title.textContent.toLowerCase().includes("shorts")) || hasShortsLink) {
        el.remove();
      }
    });

    // Shorts video tiles
    document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer').forEach(el => {
      const link = el.querySelector('a#thumbnail');
      if (link && SHORTS_URL_REGEX.test(link.href)) {
        el.remove();
      }
    });
  }

  function monitorURLChange(callback) {
    let lastURL = location.href;
    new MutationObserver(() => {
      if (location.href !== lastURL) {
        lastURL = location.href;
        callback();
      }
    }).observe(document, { subtree: true, childList: true });
  }

  function setupPersistentDOMObserver() {
    const observer = new MutationObserver(() => {
      console.log("[TM] DOM changed, performing cleanup...");
      removeShortsButtonsEverywhere();
      nukeShortsContent();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener('load', () => {
    redirectIfShorts();
    removeShortsButtonsEverywhere();
    nukeShortsContent();
    setupPersistentDOMObserver();
  });

  monitorURLChange(() => {
    redirectIfShorts();
    removeShortsButtonsEverywhere();
    nukeShortsContent();
  });
})();
