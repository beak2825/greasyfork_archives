// ==UserScript==
// @name         IE News Infinite Scroll
// @description  Infinite scroll for Interesting Engineering News
// @match        https://interestingengineering.com/news*
// @match        https://www.interestingengineering.com/news*
// @version 0.0.1.20250512180447
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/531155/IE%20News%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/531155/IE%20News%20Infinite%20Scroll.meta.js
// ==/UserScript==

(() => {
  let currentPage = 1;
  let isLoading = false;

  // 1. select the real container of article cards
  const listContainer = document.querySelector('div.md\\:t-px-\\[102px\\] > div.t-flex-col');
  if (!listContainer) return;

  // remove the existing pagination nav once and for all
  document.querySelector('nav[role="navigation"]')?.remove();

  async function loadNextPage() {
    if (isLoading) return;
    isLoading = true;
    currentPage++;

    try {
      // 2. include trailing slash
      const url = `/news/page/${currentPage}/`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      // 3. select only the article cards you want
      const cards = Array.from(doc.querySelectorAll(
        'div.md\\:t-px-\\[102px\\] > div.t-flex-col > div'
      ));

      if (cards.length === 0) {
        // no more pages
        window.removeEventListener('scroll', onScroll);
        return;
      }

      // 4. append them in one pass
      cards.forEach(card => {
        listContainer.appendChild(document.importNode(card, true));
      });

    } catch (err) {
      console.error('Infinite Scroll error:', err);
      currentPage--;
    } finally {
      isLoading = false;
    }
  }

  function onScroll() {
    const threshold = document.documentElement.scrollHeight - window.innerHeight - 200;
    if (window.scrollY >= threshold) {
      loadNextPage();
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
