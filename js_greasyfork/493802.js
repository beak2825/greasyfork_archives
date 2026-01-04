// ==UserScript==
// @name         Amazon Enhancements: Ratings Display and Filtering
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  Display rating scores, add filtering options, and hide sponsored items on Amazon pages with pagination, accessibility, and duplicate handling fixes.
// @author       Dave
// @match        https://*.amazon.com/*
// @exclude      https://*.amazon.com/gp/cart/*
// @exclude      https://*.amazon.com/gp/help/*
// @exclude      https://*.amazon.com/ap/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493802/Amazon%20Enhancements%3A%20Ratings%20Display%20and%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/493802/Amazon%20Enhancements%3A%20Ratings%20Display%20and%20Filtering.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // ----------------- State -----------------
  const state = {
    currentFilter: parseFloat(localStorage.getItem('amazon-rating-filter')) || 0,
    minReviewCount: parseInt(localStorage.getItem('amazon-min-review-count')) || 0,
    hideSponsored: localStorage.getItem('amazon-hide-sponsored') === 'true',
    processedAsins: new Set(),
    hiddenResults: new Set()
  };

  // ----------------- Selectors -----------------
  const RATING_SELECTORS = [
    'span.a-size-small.a-color-base:not([aria-hidden])',
    'span[aria-hidden="true"].a-size-small.a-color-base',
    'span[aria-label*="out of 5 stars"]',
    'i[aria-label*="out of 5 stars"]',
    'a[aria-label*="out of 5 stars"]',
    'span.a-icon-alt',
    'i.a-icon-star-mini[aria-hidden="true"]'
  ];

  const REVIEW_COUNT_SELECTORS = [
    'span.a-size-mini.puis-normal-weight-text.s-underline-text',
    'a[aria-label*="ratings"] span.a-size-mini',
    'span[aria-label$=" ratings"]',
    'span[aria-label$=" rating"]',
    'span.a-size-base.s-underline-text'
  ];

  const SPONSORED_SELECTORS = [
    '[aria-label="Sponsored"]',
    '.s-label-popover-default',
    '.puis-sponsored-label-text',
    'span.s-label-popover-hover',
    '[data-component-type="sp-sponsored-result"]'
  ];

  // ----------------- Helpers -----------------
  const qFirst = (root, list) => {
    for (const sel of list) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  };

  // Extract numeric rating, e.g. "4.7 out of 5 stars" or "4.7"
  const extractRating = (el) => {
    if (!el) return 0;
    const text = (el.getAttribute('aria-label') || el.parentElement?.getAttribute('aria-label') || el.textContent || '').trim();
    const direct = text.match(/^(\d+(?:\.\d+)?)(?:\s|$)/);
    if (direct) return parseFloat(direct[1]);
    const outOf = text.match(/(\d+(?:\.\d+)?)\s*out of/i);
    return outOf ? parseFloat(outOf[1]) : 0;
  };

  // Extract review count, handling plain numbers, (1,234), (43.9K), (1.2M)
  const extractReviewCount = (el) => {
    if (!el) return 0;
    const aria = el.getAttribute('aria-label') || '';
    const txt = el.textContent || '';

    const ariaMatch = aria.match(/(\d+(?:,\d+)*)\s*ratings?/i);
    if (ariaMatch) return parseInt(ariaMatch[1].replace(/,/g, ''), 10);

    const abbr = txt.match(/\((\d+(?:\.\d+)?)(K|M)\)/i);
    if (abbr) {
      const num = parseFloat(abbr[1]);
      const mul = abbr[2].toUpperCase() === 'K' ? 1e3 : 1e6;
      return Math.round(num * mul);
    }

    const paren = txt.match(/\((\d+(?:,\d+)*)\)/);
    if (paren) return parseInt(paren[1].replace(/,/g, ''), 10);

    const anyNum = txt.match(/(\d+(?:,\d+)*)/);
    return anyNum ? parseInt(anyNum[1].replace(/,/g, ''), 10) : 0;
  };

  // Cache sponsored status in dataset to avoid repeated DOM scans
  const isSponsored = (result) => {
    if (result.dataset.sponsored) return result.dataset.sponsored === '1';

    let sponsored = SPONSORED_SELECTORS.some(sel => result.querySelector(sel));
    if (!sponsored) {
      // Single textContent scan instead of scanning all spans/divs
      sponsored = /(^|\s)Sponsored(\s|$)/i.test(result.textContent);
    }
    result.dataset.sponsored = sponsored ? '1' : '0';
    return sponsored;
  };

  const getAsin = (result) => {
    if (result.dataset.asin) return result.dataset.asin;
    const link = result.querySelector('a[href*="/dp/"], a[href*="/gp/product/"]');
    const m = link && link.href.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
    return m ? m[1] : '';
  };

  // Enhance rating display + attach rating/review counts to dataset
  const enhanceRatingDisplay = (result) => {
    const asin = getAsin(result);
    if (!asin || state.processedAsins.has(asin)) return;

    let ratingEl = null;
    let rating = 0;

    // Try new format: rating in small row as plain number
    const ratingRow = result.querySelector('.a-row.a-size-small');
    if (ratingRow) {
      const direct = ratingRow.querySelector('span.a-size-small.a-color-base');
      const txt = direct && direct.textContent.trim();
      if (txt && /^\d+(\.\d+)?$/.test(txt)) {
        ratingEl = direct;
        rating = parseFloat(txt);
      }
    }

    // Fallback to legacy selectors
    if (!ratingEl || !rating) {
      ratingEl = qFirst(result, RATING_SELECTORS);
      rating = extractRating(ratingEl);
    }

    if (!ratingEl || !rating) return;

    // Find review count element
    let countEl = qFirst(result, REVIEW_COUNT_SELECTORS);
    if (!countEl && ratingEl.tagName === 'A') {
      const inner = ratingEl.querySelector('span.a-size-small');
      if (inner) countEl = inner;
    }
    const reviewCount = extractReviewCount(countEl);

    result.dataset.asin = asin;
    result.dataset.ratingValue = rating;
    result.dataset.reviewCount = reviewCount;

    // If new layout already shows rating plainly, or parent already has rating text, skip extra span
    const parentText = ratingEl.parentElement?.textContent || '';
    if ((ratingRow && ratingEl.parentElement === ratingRow) || parentText.includes(rating.toFixed(1))) {
      state.processedAsins.add(asin);
      result.classList.add('enhanced-rating');
      return;
    }

    // Inject a bold rating span before existing rating element
    if (!result.querySelector('.enhanced-rating-display')) {
      const span = document.createElement('span');
      span.className = 'enhanced-rating-display';
      span.textContent = rating.toFixed(1) + ' ';
      span.style.cssText = 'font-weight:bold;color:#007600;margin-right:5px;font-size:14px;';
      const target = ratingEl.parentElement || ratingEl;
      target.insertBefore(span, ratingEl);
    }

    state.processedAsins.add(asin);
    result.classList.add('enhanced-rating');
  };

  // ----------------- Filter Bar UI -----------------
  const createFilterBar = () => {
    const bar = document.createElement('div');
    bar.id = 'rating-filter-bar';
    bar.style.cssText = 'padding:6px 12px;margin:8px auto;max-width:900px;font-size:13px;background:#f3f3f3;border:1px solid #ddd;border-radius:6px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px;box-shadow:0 1px 3px rgba(0,0,0,.1);position:sticky;top:0;z-index:100;';

    const mkGroup = () => {
      const g = document.createElement('div');
      g.style.cssText = 'display:flex;align-items:center;gap:5px;';
      return g;
    };

    // Rating dropdown
    const ratingGroup = mkGroup();
    const ratingLabel = document.createElement('label');
    ratingLabel.textContent = 'Rating:';
    ratingLabel.style.cssText = 'font-weight:500;font-size:13px;';
    const ratingSelect = document.createElement('select');
    ratingSelect.setAttribute('aria-label', 'Filter by minimum star rating');
    ratingSelect.style.cssText = 'padding:3px 6px;border-radius:4px;border:1px solid #ccc;font-size:13px;';
    [0, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.5, 3.0].forEach(v => {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = v === 0 ? 'All Ratings' : `${v}+ stars`;
      ratingSelect.appendChild(o);
    });
    ratingSelect.value = state.currentFilter || 0;
    ratingSelect.addEventListener('change', e => {
      state.currentFilter = parseFloat(e.target.value) || 0;
      localStorage.setItem('amazon-rating-filter', state.currentFilter);
      applyFilters();
    });
    ratingGroup.append(ratingLabel, ratingSelect);
    bar.appendChild(ratingGroup);

    // Review count input
    const reviewGroup = mkGroup();
    const reviewLabel = document.createElement('label');
    reviewLabel.textContent = 'Reviews:';
    reviewLabel.style.cssText = 'font-weight:500;font-size:13px;';
    const reviewInput = document.createElement('input');
    reviewInput.type = 'number';
    reviewInput.min = 0;
    reviewInput.value = state.minReviewCount || 0;
    reviewInput.placeholder = '0';
    reviewInput.setAttribute('aria-label', 'Filter by minimum number of reviews');
    reviewInput.style.cssText = 'width:60px;padding:3px 6px;border-radius:4px;border:1px solid #ccc;font-size:13px;';
    reviewInput.addEventListener('input', e => {
      state.minReviewCount = parseInt(e.target.value, 10) || 0;
      localStorage.setItem('amazon-min-review-count', state.minReviewCount);
      applyFilters();
    });
    reviewGroup.append(reviewLabel, reviewInput);
    bar.appendChild(reviewGroup);

    // Sponsored toggle
    const sponsoredLabel = document.createElement('label');
    sponsoredLabel.style.cssText = 'display:flex;align-items:center;gap:4px;cursor:pointer;font-weight:500;font-size:13px;';
    const sponsoredCheckbox = document.createElement('input');
    sponsoredCheckbox.type = 'checkbox';
    sponsoredCheckbox.checked = state.hideSponsored;
    sponsoredCheckbox.setAttribute('aria-label', 'Hide sponsored items');
    sponsoredCheckbox.addEventListener('change', () => {
      state.hideSponsored = sponsoredCheckbox.checked;
      localStorage.setItem('amazon-hide-sponsored', state.hideSponsored);
      applyFilters();
    });
    sponsoredLabel.append(sponsoredCheckbox, document.createTextNode('Hide Sponsored'));
    bar.appendChild(sponsoredLabel);

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.setAttribute('aria-label', 'Reset all filters');
    resetBtn.style.cssText = 'padding:4px 10px;background:#fff;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-weight:500;font-size:13px;';
    resetBtn.addEventListener('mouseover', () => resetBtn.style.background = '#f0f0f0');
    resetBtn.addEventListener('mouseout', () => resetBtn.style.background = '#fff');
    resetBtn.addEventListener('click', () => {
      state.currentFilter = 0;
      state.minReviewCount = 0;
      state.hideSponsored = false;
      ratingSelect.value = 0;
      reviewInput.value = 0;
      sponsoredCheckbox.checked = false;
      localStorage.removeItem('amazon-rating-filter');
      localStorage.removeItem('amazon-min-review-count');
      localStorage.removeItem('amazon-hide-sponsored');
      state.processedAsins.clear();
      processAllResults();
    });
    bar.appendChild(resetBtn);

    // Refresh button (force re-scan)
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄';
    refreshBtn.setAttribute('aria-label', 'Refresh filters');
    refreshBtn.title = 'Force refresh filters';
    refreshBtn.style.cssText = 'padding:4px 8px;background:#fff;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:13px;';
    refreshBtn.addEventListener('mouseover', () => refreshBtn.style.background = '#f0f0f0');
    refreshBtn.addEventListener('mouseout', () => refreshBtn.style.background = '#fff');
    refreshBtn.addEventListener('click', () => {
      state.processedAsins.clear();
      processAllResults();
    });
    bar.appendChild(refreshBtn);

    // Status
    const statusDiv = document.createElement('div');
    statusDiv.id = 'filter-status';
    statusDiv.style.cssText = 'font-size:11px;color:#666;font-style:italic;';
    bar.appendChild(statusDiv);

    return bar;
  };

  const updateFilterStatus = () => {
    const active = state.currentFilter > 0 || state.minReviewCount > 0 || state.hideSponsored;
    const bar = document.getElementById('rating-filter-bar');
    const status = document.getElementById('filter-status');
    if (!bar || !status) return;

    bar.style.background = active ? '#e8f5e9' : '#f3f3f3';
    bar.style.borderColor = active ? '#4caf50' : '#ddd';

    const hiddenCount = state.hiddenResults.size;
    if (active) {
      status.textContent = `Filters active (${hiddenCount} items hidden)`;
      status.style.color = '#2e7d32';
    } else {
      status.textContent = 'No filters applied';
      status.style.color = '#666';
    }
  };

  // ----------------- Filtering Logic -----------------
  const applyFilters = () => {
    state.hiddenResults.clear();
    const items = document.querySelectorAll('[data-asin]:not([data-asin=""])');
    items.forEach(result => {
      const rating = parseFloat(result.dataset.ratingValue) || 0;
      const count = parseInt(result.dataset.reviewCount, 10) || 0;
      const sponsored = isSponsored(result);

      const show =
        (state.currentFilter === 0 || rating >= state.currentFilter) &&
        (state.minReviewCount === 0 || count >= state.minReviewCount) &&
        (!state.hideSponsored || !sponsored);

      if (show) {
        result.style.display = '';
        result.classList.remove('hidden-by-filter');
      } else {
        result.style.display = 'none';
        result.classList.add('hidden-by-filter');
        if (result.dataset.asin) state.hiddenResults.add(result.dataset.asin);
      }
    });
    updateFilterStatus();
  };

  const processAllResults = () => {
    const items = document.querySelectorAll('[data-asin]:not([data-asin=""])');
    items.forEach(enhanceRatingDisplay);
    applyFilters();
  };

  // ----------------- Observers -----------------
  const observeResults = () => {
    const container = document.querySelector('.s-main-slot, .s-result-list, #search') || document.body;
    let pending = null;

    const scheduleProcess = () => {
      if (pending) return;
      pending = setTimeout(() => {
        pending = null;
        processAllResults();
      }, 150);
    };

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length) {
          for (const n of m.addedNodes) {
            if (n.nodeType === 1 && (n.dataset?.asin || n.querySelector?.('[data-asin]'))) {
              scheduleProcess();
              return;
            }
          }
        }
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    // Observe title changes for SPA navigation
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const urlObserver = new MutationObserver(() => {
        if (location.href.includes('/s?') || location.href.includes('/s/')) {
          setTimeout(() => {
            if (!document.getElementById('rating-filter-bar')) insertFilterBar();
            processAllResults();
          }, 400);
        }
      });
      urlObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
  };

  const insertFilterBar = () => {
    if (document.getElementById('rating-filter-bar')) return;
    const bar = createFilterBar();
    const targets = [
      '#search',
      '.s-desktop-toolbar',
      '.s-result-list-parent-container',
      'div[data-component-type="s-search-results"]'
    ];
    for (const sel of targets) {
      const container = document.querySelector(sel);
      if (container) {
        container.insertBefore(bar, container.firstChild);
        updateFilterStatus();
        return;
      }
    }
    const main = document.querySelector('[role="main"]') || document.body;
    main.insertBefore(bar, main.firstChild);
    updateFilterStatus();
  };

  // ----------------- Debug (kept small) -----------------
  window.debugAmazonFilter = () => {
    const items = document.querySelectorAll('[data-asin]:not([data-asin=""])');
    console.log('Filter state:', {
      rating: state.currentFilter,
      minReviews: state.minReviewCount,
      hideSponsored: state.hideSponsored
    });
    console.log(`Items: ${items.length}`);
    items.forEach((el, i) => {
      const asin = el.dataset.asin;
      const r = parseFloat(el.dataset.ratingValue) || 0;
      const c = parseInt(el.dataset.reviewCount, 10) || 0;
      const sponsored = isSponsored(el);
      console.log(i + 1, { asin, rating: r, reviews: c, sponsored, display: getComputedStyle(el).display });
    });
  };

  // ----------------- Init -----------------
  const init = () => {
    insertFilterBar();
    processAllResults();
    observeResults();

    // Handle back/forward nav
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        insertFilterBar();
        processAllResults();
      }, 100);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
