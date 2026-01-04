// ==UserScript==
// @name         YM Real Price
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YM Real Price: An unofficial script for market.yandex.ru that displays each item’s original price directly on the list page. This script is not affiliated with or endorsed by Yandex. It runs entirely on the client side—parsing only publicly available DOM data—without using any private APIs or collecting/transmitting your personal information. Use at your own risk: changes to Yandex.Market’s page structure may break functionality, and the author accepts no liability for any resulting damages.
// @match        https://market.yandex.ru/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @license      https://opensource.org/licenses/MIT
// @connect      market.yandex.ru
// @downloadURL https://update.greasyfork.org/scripts/541230/YM%20Real%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/541230/YM%20Real%20Price.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(async function() {
  'use strict';

  // —————— .ym-old-price ——————
  const style = document.createElement('style');
  style.textContent = `
    .ym-old-price .ds-text {
      color: black !important;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
  // ————————————————


  const SELECTOR_LINK = '[data-auto="snippet-link"]';
  const SELECTOR_LINK_OLD = '[data-auto="snippet-price-old"]';
 const SELECTOR_CONTAINERS = [
    '[data-zone-name="ScrollBox"]',
    '[data-zone-name="searchPage"]',
    '[data-zone-name="RecommendationRoll"]',
    '[data-zone-name="carouselWithLogo"]'
  ].join(',');
  const ZONE_PRICE = 'price';
  const SELECTOR_PRICE_LINE = '.ds-valueLine';

  const inUse = new Set();
  const initialized = new WeakSet();

  function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
  function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
    // wrapper for GM_xmlhttpRequest → Promise of response object
  function gmFetch(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method:       'GET',
        url,
        responseType: 'text',
        onload:       res => resolve(res),
        onerror:      err => reject(err)
      });
    });
  }

    // retry once after 3–4s if status 429
  async function gmFetchWithRetry(url) {
    let res = await gmFetch(url);
    if (res.status === 429) {
      const delay = rnd(5000, 10000);
      console.warn(`YM Real Price: 429 for ${url}, retrying after ${delay}ms`);
      await wait(delay);
      res = await gmFetch(url);
      if (res.status === 429) {
        console.error(`YM Real Price: 429 again for ${url}, giving up`);
        throw new Error('429 Too Many Requests');
      }
    }
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.responseText;
  }

  async function processAllCards(container) {
    const cards = Array.from(
      container.querySelectorAll(SELECTOR_LINK)
    ).filter(c=>
      c.parentNode.parentNode.dataset.zoneName===ZONE_PRICE
    );

    for(const card of cards){
      const link = card.href;
      if(!link|| inUse.has(link)) continue;

      inUse.add(link);
      await wait(rnd(500,2000));

      let html;
      try {
        html = await gmFetchWithRetry(link);
      } catch (e) {
        console.error(`YM Real Price: failed to fetch ${link}:`, e);
        continue;
      }

      try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const oldWrap = doc.querySelector(SELECTOR_LINK_OLD);
        if (!oldWrap) continue;

        const price = oldWrap.querySelector(SELECTOR_PRICE_LINE);

        price.className = 'ym-old-price';

        card.appendChild(price);
      } catch (e) {
        console.warn(`YM Real Price: parsing/inject error for ${link}:`, e);
      }
    }
  }


function initContainer(container) {
    if (initialized.has(container)) return;
    initialized.add(container);

    processAllCards(container);

    const mo = new MutationObserver(() => processAllCards(container));
    mo.observe(container, { childList: true, subtree: true });
  }

  function scanForContainers() {
    document
      .querySelectorAll(SELECTOR_CONTAINERS)
      .forEach(initContainer);
  }


  scanForContainers();

  const bodyObserver = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.matches(SELECTOR_CONTAINERS)) {
          initContainer(node);
        }

        node
          .querySelectorAll(SELECTOR_CONTAINERS)
          .forEach(initContainer);
      }
    }
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
})();