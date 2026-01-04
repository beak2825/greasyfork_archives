// ==UserScript==
// @name         NYT Best Sellers Plus: Search MAM Buttons
// @namespace    https://greasyfork.org/en/users/1457912
// @version      0.5.4
// @description  Add "Search MAM" buttons to NYT Best Sellers (Title/Series and Title/Series + Author)
// @author       WilliestWonka
// @match        https://www.nytimes.com/books/best-sellers/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533467/NYT%20Best%20Sellers%20Plus%3A%20Search%20MAM%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/533467/NYT%20Best%20Sellers%20Plus%3A%20Search%20MAM%20Buttons.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let mainPageProcessed = false;
  let subcategoryPageProcessed = false;

  const toSmartTitleCase = (str) => {
    const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet']);
    const words = str.toLowerCase().split(/\s+/);
    return words.map((word, i) => {
      if (i === 0 || i === words.length - 1 || !smallWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    }).join(' ');
  };

  function cleanTitle(rawTitle) {
    return rawTitle
      .replace(/[?!.,;:–—-]+$/g, '')     // remove trailing punctuation
      .replace(/[^a-zA-Z0-9\s&-:']/g, '') // allow letters, digits, spaces, &, and apostrophe
      .replace(/\s+/g, ' ')              // normalize whitespace
      .trim();
  }

  function cleanAuthor(rawAuthor) {
    // Extract text after first "by", "written by", etc.
    const byMatch = rawAuthor.match(/\b(written\s+and\s+illustrated\s+by|written\s+by|illustrated\s+by|edited\s+by|edited|by)\b/i);
    let afterBy = byMatch ? rawAuthor.slice(byMatch.index + byMatch[0].length) : rawAuthor;

    // Remove anything after 'with', 'and', or 'illustrated by'
    afterBy = afterBy.replace(/\b(with|and|illustrated\s+by)\b.*$/i, '');

    // Extract author name (letters, apostrophes, periods, spaces)
    const firstAuthorMatch = afterBy.match(/^\s*([a-zA-Z.'\-\s]+)/);
    let firstAuthor = firstAuthorMatch ? firstAuthorMatch[1] : afterBy;

    // Replace periods with spaces and normalize whitespace
    firstAuthor = firstAuthor.replace(/\./g, ' ').replace(/\s+/g, ' ').trim();

    return firstAuthor;
  }

  function createButton(label, query) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'mam-styled-button';
    btn.style.backgroundColor = '#567b95';
    btn.style.border = '1px solid #326891';
    btn.style.color = '#fff';
    btn.style.fontSize = '11px';
    btn.style.lineHeight = '11px';
    btn.style.fontWeight = '700';
    btn.style.letterSpacing = '.05em';
    btn.style.padding = '11px 12px 8px';
    btn.style.textTransform = 'uppercase';
    btn.style.borderRadius = '3px';
    btn.style.cursor = 'pointer';
    btn.style.fontFamily = 'nyt-franklin, helvetica, arial, sans-serif';
    btn.style.transition = 'ease .6s';
    btn.style.whiteSpace = 'nowrap';
    btn.style.verticalAlign = 'middle';
    btn.style.marginRight = '6px';

    btn.addEventListener('click', () => {
      const url = `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
    });

    return btn;
  }

  function runOnMainPage() {
    const bookNodes = Array.from(document.querySelectorAll('li[itemprop="itemListElement"]'));
    if (!bookNodes.length) return false;

    if (!mainPageProcessed) {
      console.log(`[NYT+] Main list page detected.`);
      console.log(`[NYT+] Found ${bookNodes.length} books on main page.`);
      mainPageProcessed = true;
    }

    bookNodes.forEach((node, index) => {
      const titleEl = node.querySelector('[itemprop="name"]');
      const authorEl = node.querySelector('[itemprop="author"]');
      const insertBeforeEl = node.querySelector('button[aria-haspopup="true"]')?.closest('div');

      if (!titleEl || !authorEl || !insertBeforeEl) {
        console.warn(`[NYT+] [WARN] Skipping book ${index + 1}: missing elements.`);
        return;
      }

      if (node.querySelector('.mam-btn-container')) return;

      const rawTitle = titleEl.textContent.trim();
      const rawAuthor = authorEl.textContent.trim();

      const title = toSmartTitleCase(cleanTitle(rawTitle));
      const author = cleanAuthor(rawAuthor);

      const container = document.createElement('div');
      container.className = 'mam-btn-container';
      container.style.margin = '8px 0 8px';
      container.style.display = 'flex';
      container.style.flexWrap = 'wrap';
      container.style.gap = '6px';

      container.appendChild(createButton("Search MAM Title", `${title}`));
      container.appendChild(createButton("Search MAM Title + Author", `${title} ${author}`));

      insertBeforeEl.parentElement.insertBefore(container, insertBeforeEl);
    });

    return true;
  }

  function runOnSubcategoryPage() {
    const list = document.querySelector('ol[data-testid="topic-list"]');
    if (!list) return false;

    const bookNodes = Array.from(list.querySelectorAll('li')).filter(li =>
      li.querySelector('h3[itemprop="name"]') && li.querySelector('p[itemprop="author"]') && li.querySelector('a')
    );

    if (!bookNodes.length) return false;

    if (!subcategoryPageProcessed) {
      console.log(`[NYT+] Subcategory page detected.`);
      console.log(`[NYT+] Found ${bookNodes.length} books on subcategory page.`);
      subcategoryPageProcessed = true;
    }

    bookNodes.forEach((item, index) => {
      const titleEl = item.querySelector('h3[itemprop="name"]');
      const authorEl = item.querySelector('p[itemprop="author"]');
      const anchor = item.querySelector('a');

      if (!titleEl || !authorEl || !anchor) {
        console.warn(`[NYT+] [WARN] Skipping book ${index + 1}: missing elements.`);
        return;
      }

      if (item.querySelector('.mam-search-button')) return;

      const rawTitle = titleEl.textContent.trim();
      const rawAuthor = authorEl.textContent.trim();

      const title = toSmartTitleCase(cleanTitle(rawTitle));
      const author = cleanAuthor(rawAuthor);

      const container = document.createElement('div');
      container.style.margin = '8px 0 8px';
      container.className = 'mam-search-button';

      container.appendChild(createButton("Search MAM Title", `${title}`));
      container.appendChild(createButton("Search MAM Title + Author", `${title} ${author}`));

      anchor.appendChild(container);
    });

    return true;
  }

  function detectAndRun() {
    const handled = runOnMainPage() || runOnSubcategoryPage();
    if (!handled) {
      console.log(`[NYT+] [WARN] Required elements not found. Retrying...`);
    }
  }

  const observer = new MutationObserver(() => detectAndRun());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', detectAndRun);
})();
