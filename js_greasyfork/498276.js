// ==UserScript==
// @name            Clean CNN
// @description     Minimizes distractions in favor of trending top news only.
// @version         0.7
// @namespace       https://github.com/sm18lr88
// @match           *://www.cnn.com/*
// @run-at          document-start
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/498276/Clean%20CNN.user.js
// @updateURL https://update.greasyfork.org/scripts/498276/Clean%20CNN.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const zoneSelectors = Array.from({ length: 20 }, (_, i) => [
    `.zone-${i + 3}-observer.zone--t-light.zone`,
    `.zone-${i + 3}-observer.zone--t-dark.zone`,
    `.product-zone-${i + 3}-observer.product-zone--t-light.product-zone`,
    `.product-zone-${i + 3}-observer.product-zone--t-dark.product-zone`
  ]).flat();

  const additionalSelectors = [
    '.header__wrapper-outer',
    '.layout-homepage__bottom.layout__bottom',
    '.social-share',
    '.container_list-headlines-with-images.container',
    '.video-resource > .ad-feedback-link-container',
    '.layout-with-rail__rail.layout__rail',
    '.layout-with-rail__bottom.layout__bottom',
    '.layout-no-rail__bottom.layout__bottom',
    '.product-zone--t-light.product-zone',
    ...Array.from({ length: 10 }, (_, i) => `div.related-content--article.related-content:nth-of-type(${i + 1})`),
  ];

  const allSelectors = [
    ...zoneSelectors,
    ...additionalSelectors,
  ];

  function removeElements() {
    allSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.remove());
    });
  }

  // Observe changes in the document body
  const observer = new MutationObserver(removeElements);
  window.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
    removeElements();
  });
})();
