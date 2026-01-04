// ==UserScript==
// @name         Indeed Infinite Scroll
// @namespace    https://greasyfork.org/en/users/50935-neonhd
// @author       Prismaris
// @version      1.0
// @description  Auto-load next page when scrolled to the bottom for job listings
// @match        *://*.indeed.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538275/Indeed%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/538275/Indeed%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function () {
  let isLoading = false;

  const loadNextPage = () => {
    if (isLoading) return;

    const nextBtn = document.querySelector('a[data-testid="pagination-page-next"]');
    if (!nextBtn) return;

    isLoading = true;
    nextBtn.click();

    const observer = new MutationObserver((mutations, obs) => {
      const newCards = document.querySelectorAll('.jobsearch-LeftPane .tapItem');
      if (newCards.length > 0) {
        isLoading = false;
        obs.disconnect();
      }
    });

    const container = document.querySelector('#mosaic-provider-jobcards ul');
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    } else {
      isLoading = false;
    }
  };

  const onScroll = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    const atBottom = scrollY + viewportHeight >= fullHeight - 2;

    if (atBottom) {
      loadNextPage();
    }
  };

  window.addEventListener('scroll', onScroll);
})();
