// ==UserScript==
// @name         YouTube Cleaner: Remove Playables & Shorts (Home + Search + Watch)
// @namespace    https://www.youtube.com
// @version      1.4.1
// @description  Removes "YouTube Playables" and Shorts sections from the YouTube homepage, search results, and watch pages.
// @license      Custom: Free for personal use, commercial use prohibited.
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/results?search_query=*
// @match        https://www.youtube.com/watch*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @homepageURL  https://greasyfork.org/en/scripts/541869-youtube-cleaner-remove-playables-shorts-home-search-watch
// @supportURL   https://greasyfork.org/en/scripts/541869-youtube-cleaner-remove-playables-shorts-home-search-watch/feedback
// @downloadURL https://update.greasyfork.org/scripts/541869/YouTube%20Cleaner%3A%20Remove%20Playables%20%20Shorts%20%28Home%20%2B%20Search%20%2B%20Watch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541869/YouTube%20Cleaner%3A%20Remove%20Playables%20%20Shorts%20%28Home%20%2B%20Search%20%2B%20Watch%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = false;

  const homepageBlockedTitles = [
    'YouTube Playables',
    'Shorts'
  ];

  function removeHomepageSections() {
    const allTitles = document.querySelectorAll('span#title');
    allTitles.forEach(span => {
      const titleText = span.textContent.trim();
      if (homepageBlockedTitles.includes(titleText)) {
        const section = span.closest('ytd-rich-section-renderer');
        if (section) {
          section.remove();
          if (DEBUG) console.log(`[YT Cleaner] Removed homepage section: "${titleText}"`);
        }
      }
    });
  }

  function removeSearchAndWatchShorts() {
    // Remove entire Shorts shelf sections
    const allTitles = document.querySelectorAll('span#title');
    allTitles.forEach(span => {
      const titleText = span.textContent.trim();
      if (/shorts/i.test(titleText)) {
        const reel = span.closest('ytd-reel-shelf-renderer');
        if (reel) {
          reel.remove();
          if (DEBUG) console.log(`[YT Cleaner] Removed Shorts shelf: "${titleText}"`);
        }
      }
    });

    // Remove individual Shorts disguised as regular results
    const shortLinks = document.querySelectorAll('a#video-title[href^="/shorts/"]');
    shortLinks.forEach(link => {
      const videoCard = link.closest('ytd-video-renderer');
      if (videoCard) {
        videoCard.remove();
        if (DEBUG) console.log(`[YT Cleaner] Removed Shorts video card with href: "${link.href}"`);
      }
    });
  }

  function init() {
    const url = location.href;

    if (url === 'https://www.youtube.com/') {
      removeHomepageSections();
    }

    if (
      url.startsWith('https://www.youtube.com/results?search_query=') ||
      url.startsWith('https://www.youtube.com/watch')
    ) {
      removeSearchAndWatchShorts();
    }
  }

  init();

  const observer = new MutationObserver(init);
  observer.observe(document.body, { childList: true, subtree: true });
})();