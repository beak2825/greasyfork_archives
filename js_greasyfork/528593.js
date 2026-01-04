// ==UserScript==
// @name        ComicK - Enlarge Manga Covers
// @namespace   https://github.com/BreezeSpark
// @match       https://comick.io/*
// @icon        https://comick.io/favicon.ico
// @version     3.4.2025.2
// @description Enlarges manga cover on ComicK where needed.
// @author      BreezeSpark
// @run-at      document-idle
// @grant       GM_addStyle
// @supportURL  https://github.com/BreezeSpark/Userscripts/issues
// @homepageURL https://github.com/BreezeSpark/Userscripts
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/528593/ComicK%20-%20Enlarge%20Manga%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/528593/ComicK%20-%20Enlarge%20Manga%20Covers.meta.js
// ==/UserScript==

GM_addStyle(`
  .w-16, .lg\\:w-20, .md\\:w-24 { width: 10rem !important; }
  .h-16, .lg\\:h-20, .md\\:h-32 { height: 15rem !important; }

  .truncate {
    display: -webkit-box !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 4 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: normal !important;
  }

  .flex.overflow-x-scroll.hide-scroll-bar .truncate {
    display: block !important;
    white-space: nowrap !important;
    -webkit-line-clamp: unset !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }

  div[style*="flex: 0 0 auto"][style*="position: relative"] .line-clamp-1 {
    display: -webkit-box !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 4 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: normal !important;
  }

  .btn.btn-primary.truncate {
    display: flex !important;
  }
`);

const observer = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    for (const node of addedNodes) {
      if (node.nodeType === 1) {
        const covers = node.querySelectorAll(
          '.my-1.md\\:my-2.customclass1, .relative.w-16.h-16.lg\\:w-20.lg\\:h-20, .relative.w-16.h-28.md\\:w-24.md\\:h-32, a.h-16.w-16.flex-shrink-0.cursor-pointer'
        );
        covers.forEach(cover => cover.classList.add('enlarged-cover'));
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('unload', () => {
  observer.disconnect();
});
