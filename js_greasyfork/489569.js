// ==UserScript==
// @name         Qiita timeline auto more
// @namespace    https://htsign.hateblo.jp
// @version      0.3.5
// @description  auto fetch more entries
// @author       htsign
// @match        https://qiita.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489569/Qiita%20timeline%20auto%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/489569/Qiita%20timeline%20auto%20more.meta.js
// ==/UserScript==

/**
 * @param {string}
 * @param {Node} [root=document]
 * @returns {Generator<HTMLElement>}
 */
const queryNodes = function* (path, root = document) {
  const result = document.evaluate(path, root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
  let node;
  while ((node = result.iterateNext()) != null) {
    yield node;
  }
};

/**
 * @param {HTMLElement} element
 * @param {(el: HTMLElement, observer: IntersectionObserver) => void} handler
 * @param {IntersectionObserverInit} [options={ rootMargin: '100%' }]
 */
const attachIntersectionHandler = (element, handler, options = { rootMargin: '100%' }) => {
  const READMORE_XPATH = 'descendant-or-self::button[text()="もっと読む" or text()="もっと見る"]';

  const io = new IntersectionObserver((entries, observer) => {
    entries
      .values()
      .filter(entry => entry.isIntersecting)
      .flatMap(function* ({ target }) { if (target instanceof HTMLElement) yield target; })
      .forEach(el => handler(el, observer));
  }, options);

  const mo = new MutationObserver(records => {
    const buttons = records
      .values()
      .flatMap(r => r.addedNodes)
      .flatMap(node => queryNodes(READMORE_XPATH, node));

    buttons.forEach(io.observe.bind(io));
  });
  mo.observe(element, { childList: true, subtree: true });

  const button = document.evaluate(READMORE_XPATH, listElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE)?.singleNodeValue;
  if (button instanceof HTMLElement) {
    io.observe(button);
  }
};

const listElement = document.querySelector('main');
if (listElement != null) {
  attachIntersectionHandler(listElement, (el, observer) => {
    el.click();

    const f = () => {
      if (document.contains(el)) {
        el.click();
        requestIdleCallback(f);
      }
    };
    requestIdleCallback(f);

    observer.unobserve(el);
  });
}

const mainWrapper = document.querySelector('.mainWrapper [id^="StockItemsPage"]');
if (mainWrapper != null) {
  const mo = new MutationObserver(records => {
    const elements = records
      .values()
      .flatMap(r => r.addedNodes)
      .filter(node => node instanceof HTMLElement);

    for (const el of elements) {
      const stockList = el.querySelector('[aria-label="ストックリスト"]');
      if (stockList != null) {
        attachIntersectionHandler(stockList, (el, observer) => {
          el.click();

          // re-attach
          observer.unobserve(el);
          observer.observe(el);
        });
      }
    }
  });
  mo.observe(mainWrapper, { childList: true });
}
