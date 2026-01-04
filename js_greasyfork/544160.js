// ==UserScript==
// @name         Amazon Search++ (Full Tooltips & Logic)
// @namespace    http://www.amazon.com
// @version      2.4
// @description  Amazon filter/sort tools and clean URL copier with smart tooltips
// @author       Mikhail Aukslang
// @match        *://www.amazon.*/s*
// @match        https://*.amazon.ca/*
// @grant        GM_setClipboard
// @license      CC BY-NC-SA 4.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544160/Amazon%20Search%2B%2B%20%28Full%20Tooltips%20%20Logic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544160/Amazon%20Search%2B%2B%20%28Full%20Tooltips%20%20Logic%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let mustContainWords = [];
  let excludeWords = [];

  const isSearchPage = /\/s(\?|$)/i.test(location.pathname + location.search);
  const isProductPage = /\/dp\/[A-Z0-9]{10}/.test(location.pathname);

  const container = document.createElement('div');
  container.style = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: white;
    border: 2px solid #555;
    border-radius: 8px;
    padding: 10px;
    font-size: 13px;
    font-family: sans-serif;
    z-index: 99999;
    max-width: 280px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    opacity: 0.95;
  `;
  container.innerHTML = `
    <strong>🛠️ Amazon Filter</strong><br>
    <input type="text" id="mustInput" placeholder="✅ Must contain (Enter)" style="width:100%;margin-top:5px;" title="Type in a word that the results MUST contain then press [Enter]">
    <div id="mustList" style="margin-bottom:6px;"></div>
    <input type="text" id="notInput" placeholder="🚫 Must NOT contain (Enter)" style="width:100%;" title="Type in a word that the results MUST NOT contain then press [Enter]">
    <div id="notList" style="margin-bottom:6px;"></div>
    <label title="Hide listings that are out of stock.">
      <input type="checkbox" id="hideOOS"> 📦 Hide Out-of-Stock
    </label><br>
    <label title="I noticed Amazon nerfs the search results when you sort by price, this option bypasses that giving you much better results">
      <input type="checkbox" id="sortByPrice"> 💰 Sort by Price
    </label><br>
    <button id="applyBtn" style="margin-top:6px;width:100%;" title="Apply all filters now">🎯 Apply Filters</button>
    <button id="copyBtn" style="margin-top:5px;width:100%;" title="Sharing Amazon listings by default includes a bunch of tracking crap, this button copies to your clipboard just the bare minimum of the URL necessary for sharing purposes">🔗 Copy Clean URL</button>
  `;
  document.body.appendChild(container);

  const mustInput = document.getElementById('mustInput');
  const notInput = document.getElementById('notInput');
  const mustListDiv = document.getElementById('mustList');
  const notListDiv = document.getElementById('notList');
  const hideOOS = document.getElementById('hideOOS');
  const sortByPrice = document.getElementById('sortByPrice');
  const applyBtn = document.getElementById('applyBtn');
  const copyBtn = document.getElementById('copyBtn');

  function applyTooltip(el, message) {
    el.title = message;
  }

  function toggleUI(enableFilters, enableCopy) {
    const disable = (el, msg) => {
      el.disabled = true;
      el.style.opacity = '0.3';
      el.style.pointerEvents = 'none';
      if (msg) applyTooltip(el, msg);
    };
    const enable = el => {
      el.disabled = false;
      el.style.opacity = '1.0';
      el.style.pointerEvents = 'auto';
      el.removeAttribute('title');
    };

    const filterControls = [
      { el: mustInput, msg: 'Only available on search result pages.' },
      { el: notInput, msg: 'Only available on search result pages.' },
      { el: hideOOS, msg: 'Only available on search result pages.' },
      { el: sortByPrice, msg: 'Only available on search result pages.' },
      { el: applyBtn, msg: 'Only available on search result pages.' },
      { el: mustListDiv, msg: '' },
      { el: notListDiv, msg: '' }
    ];

    const copyControl = { el: copyBtn, msg: 'Only available on product pages (e.g., /dp/ASIN)' };

    filterControls.forEach(({ el, msg }) => enableFilters ? enable(el) : disable(el, msg));
    enableCopy ? enable(copyControl.el) : disable(copyControl.el, copyControl.msg);
  }

  if (isProductPage) {
    toggleUI(false, true);
  } else if (isSearchPage) {
    toggleUI(true, false);
  }

  function updateWordListDisplay() {
    mustListDiv.innerHTML = '';
    notListDiv.innerHTML = '';

    mustContainWords.forEach(word => {
      const div = document.createElement('div');
      div.innerHTML = `✅ ${word} <span style="color:red;cursor:pointer;">❌</span>`;
      div.querySelector('span').addEventListener('click', () => {
        mustContainWords = mustContainWords.filter(w => w !== word);
        updateWordListDisplay();
        filterProducts();
      });
      mustListDiv.appendChild(div);
    });

    excludeWords.forEach(word => {
      const div = document.createElement('div');
      div.innerHTML = `🚫 ${word} <span style="color:red;cursor:pointer;">❌</span>`;
      div.querySelector('span').addEventListener('click', () => {
        excludeWords = excludeWords.filter(w => w !== word);
        updateWordListDisplay();
        filterProducts();
      });
      notListDiv.appendChild(div);
    });
  }

  function extractPrice(product) {
    const priceEl = product.querySelector('.a-price .a-offscreen');
    return priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) || Infinity : Infinity;
  }

  function filterProducts() {
    const items = document.querySelectorAll('[data-component-type="s-search-result"]');

    items.forEach(item => {
      const text = item.innerText.toLowerCase();
      const title = item.querySelector('h2')?.innerText.toLowerCase() || '';
      const outOfStock = /currently unavailable|out of stock|no featured offers/i.test(text);

      const matchMust = mustContainWords.length === 0 || mustContainWords.some(w => title.includes(w));
      const matchNot = excludeWords.length === 0 || excludeWords.every(w => !title.includes(w));

      if (matchMust && matchNot && (!hideOOS.checked || !outOfStock)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    if (sortByPrice.checked) {
      const slot = document.querySelector('.s-main-slot');
      if (!slot) return;
      const visible = Array.from(slot.children).filter(x => x.style.display !== 'none');
      visible.sort((a, b) => extractPrice(a) - extractPrice(b));
      visible.forEach(el => slot.appendChild(el));
    }
  }

  mustInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && mustInput.value.trim()) {
      mustContainWords.push(mustInput.value.trim().toLowerCase());
      mustInput.value = '';
      updateWordListDisplay();
      filterProducts();
    }
  });

  notInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && notInput.value.trim()) {
      excludeWords.push(notInput.value.trim().toLowerCase());
      notInput.value = '';
      updateWordListDisplay();
      filterProducts();
    }
  });

  applyBtn.addEventListener('click', filterProducts);

  copyBtn.addEventListener('click', () => {
    const match = location.href.match(/https:\/\/www\.amazon\.[^\/]+\/[^\/]+\/dp\/[A-Z0-9]{10}/);
    if (match) {
      GM_setClipboard(match[0]);
      alert('🔗 Clean URL copied:\n' + match[0]);
    } else {
      alert('❌ Not a valid product URL.');
    }
  });

})();
