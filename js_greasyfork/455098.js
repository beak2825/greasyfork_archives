// ==UserScript==
// @name         Links for Game Editions in PlayStation Store
// @namespace    https://github.com/rod24574575
// @description  Add hyperlink to the other editions in playstation store
// @version      1.1.0
// @license      MIT
// @author       rod24574575
// @homepage     https://github.com/rod24574575/PsStoreEditionLink
// @homepageURL  https://github.com/rod24574575/PsStoreEditionLink
// @supportURL   https://github.com/rod24574575/PsStoreEditionLink/issues
// @match        *://store.playstation.com/*/product/*
// @match        *://store.playstation.com/*/concept/*
// @match        *://www.playstation.com/*/games/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/455098/Links%20for%20Game%20Editions%20in%20PlayStation%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/455098/Links%20for%20Game%20Editions%20in%20PlayStation%20Store.meta.js
// ==/UserScript==

// @ts-check
'use strict';

(function() {
  function run() {
    /**
     * @param {string} trackString
     * @returns {string | null}
     */
    function findSkuId(trackString) {
      /** @type {string} */
      let rawSku;
      try {
        const track = JSON.parse(trackString);
        if (!track || typeof track !== 'object') {
          return null;
        }

        const sku = track?.attributes?.sku;
        if (typeof sku !== 'string') {
          return null;
        }

        rawSku = sku;
      } catch {
        return null;
      }

      const lastDashIndex = rawSku.lastIndexOf('-');
      if (lastDashIndex < 0) {
        return null;
      }

      return rawSku.slice(0, lastDashIndex);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    function createProductUrl(id) {
      const match = location.href.match(/\.playstation\.com\/([^/]+)\//i);
      if (!match) {
        return '';
      }
      const locale = match[1];
      return `${location.protocol}//store.playstation.com/${locale}/product/${id}`;
    }

    for (const productEditionEl of document.querySelectorAll('article[data-qa^="mfeUpsell#productEdition"]')) {
      const editorTitleEl = productEditionEl.querySelector('[data-qa*="editionName"]')?.parentElement;
      if (!editorTitleEl) {
        continue;
      }

      const parent = editorTitleEl.parentElement;
      if (!parent) {
        continue;
      }

      const addCartEl = productEditionEl.querySelector('button[data-track]');
      if (!addCartEl) {
        continue;
      }

      const skuId = findSkuId(addCartEl.getAttribute('data-track') ?? '');
      if (!skuId) {
        continue;
      }

      const anchor = document.createElement('a');
      anchor.href = createProductUrl(skuId);
      Object.assign(anchor.style, {
        display: 'block',
      });

      parent.insertBefore(anchor, editorTitleEl);
      anchor.appendChild(editorTitleEl);
    }
  }

  /** @type {number | undefined} */
  let timer = window.setInterval(() => {
    if (!document.querySelector('[data-qa="mfeUpsell"]:not([data-reactroot])')) {
      return;
    }

    run();
    window.clearInterval(timer);
    timer = undefined;
  }, 100);
})();
