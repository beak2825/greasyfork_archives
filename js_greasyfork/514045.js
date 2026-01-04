// ==UserScript==
// @name               蝦皮搜尋過濾
// @name:en            Shopee Search Filter
// @name:zh-TW         蝦皮搜尋過濾
// @namespace          https://github.com/rod24574575
// @description        過濾蝦皮搜尋結果
// @description:en     Apply filters for Shopee search.
// @description:zh-TW  過濾蝦皮搜尋結果
// @version            1.0.2
// @license            MIT
// @author             rod24574575
// @homepage           https://github.com/rod24574575/monorepo
// @homepageURL        https://github.com/rod24574575/monorepo
// @supportURL         https://github.com/rod24574575/monorepo/issues
// @match              https://shopee.tw/*
// @match              https://shopee.vn/*
// @match              https://shopee.co.id/*
// @match              https://shopee.com.my/*
// @match              https://shopee.co.th/*
// @match              https://shopee.ph/*
// @match              https://shopee.sg/*
// @match              https://shopee.com.br/*
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/514045/Shopee%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/514045/Shopee%20Search%20Filter.meta.js
// ==/UserScript==

// @ts-check
'use strict';

(function() {
  /** @type {WeakSet<Element>} */
  const cacheSet = new WeakSet();

  /**
   * @param {Element} itemEl
   * @returns {boolean}
   */
  function isSearchItemUnmatched(itemEl) {
    try {
      const entry = Object.entries(itemEl).find(([key, value]) => {
        return (
          key.startsWith('__reactProps') &&
          value && typeof value === 'object' && 'children' in value && 'data-sqe' in value
        );
      });
      if (!entry) {
        console.warn('Failed to find `reactProps`', itemEl);
        return false;
      }

      const reactProps = entry[1];

      // Find the props that contains `item` property. Note that we only search
      // up to 10 levels to prevent infinite loop.
      let props = reactProps;
      for (let i = 0; i < 10; ++i) {
        props = props.children?.props;
        if (!props || 'item' in props) {
          break;
        }
      }
      if (!props) {
        console.warn('Failed to find `item`', itemEl);
        return false;
      }

      const searchItemTrackingStr = props.item?.search_item_tracking;
      if (typeof searchItemTrackingStr !== 'string') {
        console.warn('Failed to find `search_item_tracking`', itemEl);
        return false;
      }

      const { matched_keywords } = JSON.parse(searchItemTrackingStr);
      return !matched_keywords || !Array.isArray(matched_keywords) || matched_keywords.every((keyword) => !keyword);
    } catch (e) {
      console.warn('Failed to find `matched_keywords`', itemEl, e);
      return false;
    }
  }

  /**
   * @param {Element} itemEl
   * @returns {void}
   */
  function hideSearchItem(itemEl) {
    itemEl.style.display = 'none';
  }

  function run() {
    if (!location.pathname.startsWith('/search')) {
      return;
    }

    for (const itemEl of document.querySelectorAll('li.shopee-search-item-result__item')) {
      if (cacheSet.has(itemEl)) {
        continue;
      }
      cacheSet.add(itemEl);

      if (isSearchItemUnmatched(itemEl)) {
        hideSearchItem(itemEl);
      }
    }
  }

  function main() {
    const mutationObserver = new MutationObserver(run);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    run();
  }

  main();
})();
