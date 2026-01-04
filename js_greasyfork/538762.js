// ==UserScript==
// @name         Exoticaz Search Button Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Add search buttons to Exoticaz torrent list and detail pages
// @match        https://exoticaz.to/torrents*
// @match        https://exoticaz.to/torrent/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538762/Exoticaz%20Search%20Button%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538762/Exoticaz%20Search%20Button%20Enhancer.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // Configuration: Add or modify search providers here
  const SEARCH_PROVIDERS = [
    {
      name: 'NetFlav',
      icon: '',
      url: 'https://netflav.com/search?type=title&keyword=',
      className: 'btn-warning'
    },
    {
      name: 'JavMost',
      icon: '',
      url: 'https://www5.javmost.com/search/',
      className: 'btn-warning'
    },
    // Add more providers here:
    // {
    //   name: 'Google',
    //   icon: '🌐',
    //   url: 'https://www.google.com/search?q=',
    //   className: 'btn-info'
    // }
  ];

  function createSearchButton(code, provider, isListPage = false) {
    const btn = document.createElement(isListPage ? 'button' : 'a');
    btn.textContent = `${provider.icon} ${provider.name}`;
    btn.className = `btn btn-xs ${provider.className} search-btn`;
    btn.style.marginLeft = '6px';
    btn.style.marginTop = isListPage ? '4px' : '0';

    if (isListPage) {
      // For list page buttons
      btn.style.padding = '2px 6px';
      btn.style.fontSize = '12px';
      btn.style.border = '1px solid #ccc';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';
      btn.onclick = (e) => {
        e.stopPropagation();
        window.open(`${provider.url}${encodeURIComponent(code)}`, '_blank');
      };
    } else {
      // For detail page buttons (links)
      btn.href = `${provider.url}${encodeURIComponent(code)}`;
      btn.target = '_blank';
    }

    return btn;
  }

  function addSearchButtons(container, code, isListPage = false) {
    // Remove existing search buttons to avoid duplicates
    container.querySelectorAll('.search-btn').forEach(btn => btn.remove());

    // Add all configured search buttons
    SEARCH_PROVIDERS.forEach(provider => {
      const searchBtn = createSearchButton(code, provider, isListPage);
      container.appendChild(searchBtn);
    });
  }

  function handleDetailPage() {
    const titleEl = document.querySelector('h1.h4');
    if (!titleEl) return;

    const match = titleEl.textContent.match(/\[([^\]]+)\]/);
    if (!match) return;

    const code = match[1];

    // Look for the "Download as Text File" button
    const txtBtn = Array.from(document.querySelectorAll('a.btn'))
      .find(el => el.textContent.includes('Download as Text'));

    if (!txtBtn) return;

    const container = txtBtn.parentElement;
    if (!container) return;

    // Create a wrapper for search buttons if it doesn't exist
    let searchWrapper = container.querySelector('.search-wrapper');
    if (!searchWrapper) {
      searchWrapper = document.createElement('span');
      searchWrapper.className = 'search-wrapper';
      container.insertBefore(searchWrapper, txtBtn.nextSibling);
    }

    addSearchButtons(searchWrapper, code, false);
  }

  function handleListPage() {
    // Use requestAnimationFrame to avoid blocking the main thread
    const processInBatches = () => {
      const torrentLinks = document.querySelectorAll('a.torrent-link:not([data-search-processed])');
      const batchSize = 10; // Process 10 items at a time

      for (let i = 0; i < Math.min(batchSize, torrentLinks.length); i++) {
        const link = torrentLinks[i];
        link.setAttribute('data-search-processed', 'true');

        const title = link.getAttribute('title') || link.textContent;
        const match = title.match(/\[([^\]]+)\]/);
        if (!match) continue;

        const code = match[1];
        const row = link.closest('tr');
        if (!row) continue;

        const actionTd = row.querySelector('td > .align-top')?.parentElement;
        const alignBottom = actionTd?.querySelector('.align-bottom');
        if (!alignBottom) continue;

        // Create a wrapper for search buttons if it doesn't exist
        let searchWrapper = alignBottom.querySelector('.search-wrapper');
        if (!searchWrapper) {
          searchWrapper = document.createElement('div');
          searchWrapper.className = 'search-wrapper';
          searchWrapper.style.marginTop = '4px';
          alignBottom.appendChild(searchWrapper);
        }

        addSearchButtons(searchWrapper, code, true);
      }

      // If there are more items to process, schedule the next batch
      if (torrentLinks.length > batchSize) {
        requestAnimationFrame(processInBatches);
      }
    };

    requestAnimationFrame(processInBatches);
  }

  function init() {
    const isDetailPage = /https:\/\/exoticaz\.to\/torrent\/\d+/.test(location.href);
    if (isDetailPage) {
      handleDetailPage();
    } else {
      handleListPage();

      // Throttled observer to prevent excessive function calls
      let observerTimeout;
      const throttledHandleListPage = () => {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(handleListPage, 250); // Wait 250ms before processing
      };

      const observer = new MutationObserver(throttledHandleListPage);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        // Only observe specific changes to reduce overhead
        attributeFilter: ['class', 'data-search-processed']
      });
    }
  }

  // Use both DOMContentLoaded and load events for better reliability
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to ensure page is fully rendered
      setTimeout(init, 100);
    });
  } else {
    setTimeout(init, 100);
  }

  // Backup initialization on window load
  window.addEventListener('load', () => {
    setTimeout(init, 200);
  });
})();