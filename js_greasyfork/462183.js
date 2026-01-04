// ==UserScript==
// @name         TCGPlayer Cart/History to CSV in Console
// @namespace    http://tampermonkey.net/
// @version      10-01-2025
// @description  Takes a TCGPlayer Cart/History and spits out a CSV
// @author       multimeric, ganondorc, micool777
// @match        https://cart.tcgplayer.com/*
// @match        https://store.tcgplayer.com/myaccount/orderhistory
// @match        https://store.tcgplayer.com/shoppingcart/review
// @match        https://www.tcgplayer.com/checkout
// @match        https://www.tcgplayer.com/cart
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tcgplayer.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462183/TCGPlayer%20CartHistory%20to%20CSV%20in%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/462183/TCGPlayer%20CartHistory%20to%20CSV%20in%20Console.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* -------------------- helpers -------------------- */
  function createButtonRow(buttonText, onClickHandler, testid) {
    const row = document.createElement('div');
    row.className = 'button-row';
    row.style.paddingBottom = '5px';
    row.style.paddingTop = '5px';

    const button = document.createElement('button');
    button.className = 'tcg-button tcg-button--md tcg-standard-button tcg-standard-button--priority is-full-width checkout-btn';
    button.type = 'button';
    button.dataset.testid = testid;

    const buttonContent = document.createElement('span');
    buttonContent.className = 'tcg-standard-button__content';
    const spanText = document.createElement('span');
    spanText.textContent = buttonText;
    buttonContent.appendChild(spanText);
    button.appendChild(buttonContent);

    button.addEventListener('click', onClickHandler);
    row.appendChild(button);
    return row;
  }

  const $$ = (root, sel) => Array.from(root.querySelectorAll(sel));

  /* -------------------- CSV: order history (unchanged) -------------------- */
  function generateOrderHistoryCSV() {
    let csv = 'Name,Rarity,Condition,Individual Price,Quantity\n';
    for (let order of $$(document, '.orderWrap')) {
      for (let tr of $$(order, '.orderTable tr')) {
        try {
          const name = '"' + $$(tr, '.nocontext')[0].innerText.trim() + '"';
          const details = $$(tr, '.orderHistoryDetail')[0];
          const rarity = details.childNodes[0].textContent.split(':')[1];
          const condition = details.childNodes[2].textContent.split(':')[1];
          const price = $$(tr, '.orderHistoryPrice')[0].innerText;
          const qty = $$(tr, '.orderHistoryQuantity')[0].innerText;
          csv += [name, rarity, condition, price, qty].map(s => (s || '').trim()).join(',') + '\n';
        } catch { /* skip non-item rows */ }
      }
    }
    return csv;
  }

  /* -------------------- CSV: cart/checkout (NEW DOM first, fallback to old) -------------------- */
  function generateCartCSV_NewCheckout() {
    // Target the structure in your snippet: ul.item-list > li.list-item > section.package-item ...
    const items = $$(document, 'ul.item-list li.list-item section.package-item section.content .description');
    if (!items.length) return null;

    let csv = 'Name,Set,Rarity,Condition,Individual Price,Quantity\n';

    for (const desc of items) {
      try {
        const nameEl = desc.querySelector('p.name[data-testid="productName"]');
        const name = nameEl ? `"${nameEl.textContent.trim()}"` : '""';

        const metaRoot = desc.querySelector('[data-testid="areaMetadataDropdown"]');
        const setName = metaRoot?.querySelector('.display-text span')?.textContent?.trim() || '';
        const rarity = (metaRoot?.querySelector('.expand-items li:nth-child(2)')?.textContent || '').trim();

        const condition = desc.querySelector('p.condition[data-testid="txtItemCondition"]')?.textContent?.trim() || '';
        const price = desc.querySelector('p.price span.checkout-price')?.textContent?.trim()?.replace(/\$/g, '') || '';

        // Quantity isn't exposed in your snippet at checkout; default to 1.
        const qty = '1';

        csv += [name, setName, rarity, condition, price, qty].join(',') + '\n';
      } catch (e) {
        // continue on any odd row
      }
    }

    return csv;
  }

  function generateCartCSV_OldCart() {
    // Legacy cart (sellerWrapMarket) fallback
    let tables = Array.from($('.sellerWrapMarket'));
    if (!tables.length) return null;

    let csv = 'Name,Set,Rarity,Condition,Individual Price,Quantity\n';
    for (let table of tables) {
      let $table = $(table);
      let rows = Array.from($table.find('table.sellerTable'));
      for (let row of rows) {
        let $row = $(row);
        const name = $row.find('.itemsContents h3').text().replace(/ *\([^)]*\) */g, '').trim();
        const price = $row.find('.priceBox').text().trim().replace(/\$/g, '');
        if (name) {
          // These legacy rows didn't surface set/rarity/condition consistently; fill what we have.
          csv += [`"${name}"`, '', '', '', price, '1'].join(',') + '\n';
        }
      }
    }
    return csv;
  }

  function generateCartCSV() {
    // Try the new checkout DOM first; if not found, fall back to old cart DOM.
    return generateCartCSV_NewCheckout() || generateCartCSV_OldCart() || '';
  }

  /* -------------------- export + clipboard -------------------- */
  async function exportCsvToConsoleAndClipboard() {
    const onHistory = location.href.includes('/myaccount/orderhistory');
    const onCartLike =
      location.href.includes('/cart') ||
      location.href.includes('/checkout') ||
      location.href.includes('/shoppingcart/review') ||
      location.href.includes('cart.tcgplayer.com');

    let parts = [];

    if (onHistory) {
      const historyCsv = generateOrderHistoryCSV();
      if (historyCsv && historyCsv.split('\n').length > 1) {
        console.log('[TCG CSV] Order History CSV:\n', historyCsv);
        parts.push(historyCsv);
      }
    }

    if (onCartLike) {
      const cartCsv = generateCartCSV();
      if (cartCsv && cartCsv.split('\n').length > 1) {
        console.log('[TCG CSV] Cart/Checkout CSV:\n', cartCsv);
        parts.push(cartCsv);
      }
    }

    if (!parts.length) {
      console.warn('[TCG CSV] No CSV data found for this page.');
      window.alert('No CSV data found on this page.');
      return;
    }

    const combined = parts.join('\n');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(combined);
        window.alert('CSV generated, logged to console, and copied to clipboard.');
      } else {
        window.alert('CSV generated and logged to console.\n(Clipboard unavailable in this context.)');
      }
    } catch (e) {
      console.warn('Clipboard write failed:', e);
      window.alert('CSV generated and logged to console.\n(Clipboard copy failed.)');
    }
  }

  /* -------------------- button injection under “Place Order” -------------------- */
  function findCheckoutButton() {
    // Typical class
    let btn = document.querySelector('section.cart-summary .checkout-btn') ||
              document.querySelector('.checkout-btn');

    // Fallback: match visible text "Place Order"
    if (!btn) {
      const spans = $$(document, '.tcg-standard-button__content span');
      const match = spans.find(s => s.textContent.trim().toLowerCase() === 'place order');
      if (match) btn = match.closest('button');
    }

    // Extra fallback: sometimes testid is present
    if (!btn) {
      btn = document.querySelector('button[data-testid="btnPlaceOrder"]');
    }

    return btn;
  }

  function injectExportButton() {
    const checkoutBtn = findCheckoutButton();
    if (!checkoutBtn) return;

    if (document.querySelector('button[data-testid="btnExportCartHistoryCsv"]')) return;

    const exportRow = createButtonRow(
      'Export Cart/History CSV',
      exportCsvToConsoleAndClipboard,
      'btnExportCartHistoryCsv'
    );

    // Insert directly UNDER the Place Order button
    checkoutBtn.insertAdjacentElement('afterend', exportRow);
  }

  function setupObserver() {
    const observer = new MutationObserver(injectExportButton);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* -------------------- init -------------------- */
  window.addEventListener('load', () => {
    setupObserver();
    injectExportButton();
  });
})();
