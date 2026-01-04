// ==UserScript==
// @name         VNDB Torrent Searcher (Dinofied)
// @namespace    https://greasyfork.org/en/users/29386-dinosw
// @version      2.0
// @description  Add torrent search links to VNDB alt titles
// @match        https://vndb.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535827/VNDB%20Torrent%20Searcher%20%28Dinofied%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535827/VNDB%20Torrent%20Searcher%20%28Dinofied%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addLinks() {
    document.querySelectorAll('.alttitle').forEach(el => {
      // avoid adding duplicates
      if (el.dataset.hasTorrentLink) return;

      const text = el.textContent.trim();
      if (!text) return;

      const link = document.createElement('a');
      link.href = 'https://sukebei.nyaa.si/?f=0&c=1_3&q=' + encodeURIComponent(text);
      link.target = '_blank';
      link.textContent = ' [torrent]';
      link.style.marginLeft = '6px';
      link.style.fontSize = '90%';

      el.after(link);
      el.dataset.hasTorrentLink = 'true';
    });
  }

  // Run once when DOM is ready
  if (document.readyState !== 'loading') {
    addLinks();
  } else {
    document.addEventListener('DOMContentLoaded', addLinks);
  }

  // Also run again if VNDB dynamically injects content
  const observer = new MutationObserver(addLinks);
  observer.observe(document.body, { childList: true, subtree: true });
})();