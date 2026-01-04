// ==UserScript==
// @name        ComicK - Hide Low Chapter Mangas
// @namespace   https://github.com/BreezeSpark
// @match       https://comick.io/*
// @icon        https://comick.io/favicon.ico
// @version     3.4.2025.2
// @description Removes manga entries with fewer chapters than the user-defined threshold.
// @author      BreezeSpark
// @run-at      document-idle
// @grant       none
// @supportURL  https://github.com/BreezeSpark/Userscripts/issues
// @homepageURL https://github.com/BreezeSpark/Userscripts
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/528594/ComicK%20-%20Hide%20Low%20Chapter%20Mangas.user.js
// @updateURL https://update.greasyfork.org/scripts/528594/ComicK%20-%20Hide%20Low%20Chapter%20Mangas.meta.js
// ==/UserScript==

(function() {
  //------------------------------- Settings -------------------------------\\
  const settings = {
    minChapterCount: 30 // Change this value to set the minimum chapter count.
  };
  //------------------------------------------------------------------------\\

  const observer = new MutationObserver(() => {
    document.querySelectorAll('div.flex-0').forEach((mangaDiv) => {
      const chapterLink = mangaDiv.querySelector('a[href*="-chapter-"]');
      if (chapterLink) {
        const href = chapterLink.getAttribute('href');
        const chapterMatch = href.match(/-chapter-([\d.]+)-/);
        if (chapterMatch && parseFloat(chapterMatch[1]) < settings.minChapterCount) {
          mangaDiv.remove();
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
  };
})();
