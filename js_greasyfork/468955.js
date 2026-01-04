// ==UserScript==
// @name         Wishlist Steal Deal Checker
// @namespace    https://greasyfork.org/en/users/1019658-aayush-dutt
// @version      1.1.3
// @description  Streamline savings on your Amazon wishlist—highlight historic lows, compare current vs. best price with a smart button, and hide unwanted entries via persistent toggles. Stores every price update in your wishlist comments so your deal log follows you everywhere. Lightweight, multi-region support, no extra permissions.
// @author       aayushdutt
// @match        https://www.amazon.com/hz/wishlist*
// @match        https://www.amazon.in/hz/wishlist*
// @match        https://www.amazon.de/hz/wishlist/ls*
// @match        https://www.amazon.fr/hz/wishlist/ls*
// @match        https://www.amazon.it/hz/wishlist/ls*
// @match        https://www.amazon.es/hz/wishlist/ls*
// @match        https://www.amazon.nl/hz/wishlist/ls*
// @match        https://www.amazon.se/hz/wishlist/ls*
// @match        https://www.amazon.co.jp/hz/wishlist/ls*
// @match        https://www.amazon.co.uk/hz/wishlist/ls*
// @match        https://www.amazon.com.mx/hz/wishlist/ls*
// @match        https://www.amazon.com.au/hz/wishlist/ls*
// @match        https://www.amazon.com.be/hz/wishlist/ls*
// @grant        none
// @link         https://greasyfork.org/en/scripts/468955-wishlist-steal-deal-checker
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468955/Wishlist%20Steal%20Deal%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/468955/Wishlist%20Steal%20Deal%20Checker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- STORAGE HELPERS ----
  const STORAGE_KEYS = {
    hideWorse:      'wsdc-hide-worse',
    hideUnpriced:   'wsdc-hide-unpriced',
    reloadOnFirst:  'wsdc-reload-on-first'
  };
  const storage = {
    get(key, def) {
      const v = localStorage.getItem(key);
      return v === null ? def : v === 'true';
    },
    set(key, bool) {
      localStorage.setItem(key, bool ? 'true' : 'false');
    }
  };

  // ---- STATE ----
  let hideWorse      = storage.get(STORAGE_KEYS.hideWorse,    true);
  let hideUnpriced   = storage.get(STORAGE_KEYS.hideUnpriced, true);
  let reloadOnFirst  = storage.get(STORAGE_KEYS.reloadOnFirst, true);

  // ---- INJECT CSS ----
  const style = document.createElement('style');
  style.textContent = `
    .wsdc-best-equal   { background: #f1fffe !important; }
    .wsdc-best-better  { background: #d0fbe4 !important; }
    .add-current-price {
      margin-top: 4px;
      padding: 2px 6px !important;
      width: auto !important;
      max-width: 300px !important;
    }
    .add-current-price .wsdc-pct {
      font-size: 90%;
      margin-left: 4px;
    }
    .wsdc-pct-positive { color: #080; }
    .wsdc-pct-negative { color: #c00; }
    #wsdc-toggle-container { margin: 8px 0; font-size: 14px; }
    #wsdc-toggle-container label { margin-right: 16px; }
    #wsdc-toggle-container input { margin-right: 4px; }
  `;
  document.head.appendChild(style);

  // ---- PARSERS & HELPERS ----
  const getAllItems = () =>
    Array.from(document.querySelectorAll('ul#g-items > li[data-id]'));

  const parsePrice = item => {
    const n = parseFloat(item.dataset.price);
    return Number.isFinite(n) ? n : null;
  };

  const findCommentEl = item =>
    item.querySelector(
      'div.awl-ul-keyword-item-subtitle span.a-color-secondary'
    );

  const parseCommentPrices = commentEl => {
    if (!commentEl) return [];
    return Array.from(commentEl.textContent.matchAll(/[\d,.]+/g))
      .map(m => parseFloat(m[0].replace(/,/g, '')))
      .filter(n => Number.isFinite(n));
  };

  // returns 1=better,0=equal,-1=worse,null=no data
  const comparePrice = (price, comments) => {
    if (price === null || comments.length === 0) return null;
    const minC = Math.min(...comments);
    if (price < minC) return 1;
    if (price === minC) return 0;
    return -1;
  };

  const getCsrf = () =>
    document.querySelector('input[name="anti-csrftoken-a2z"]')?.value || '';
  const CSRF = getCsrf();

  const updateComment = async (item, text) => {
    const params = JSON.parse(
      item.getAttribute('data-reposition-action-params') || '{}'
    );
    const payload = {
      comment: text,
      desiredQuantity: 1,
      isJson: true,
      listType: 'wishlist',
      priority: 0,
      hasQuantity: 0,
      viewType: 'list',
      itemID: params.itemExternalId,
      listID: item.dataset.id,
      sid: params.sid
    };
    const resp = await fetch('/hz/wishlist/updatecqp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anti-csrftoken-a2z': CSRF
      },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error(`Status ${resp.status}`);
  };

  // ---- ATTACH BUTTON WITH OPTIONAL % ----
  const attachButton = (item, price, comments) => {
    if (price === null || comments.includes(price)) return;
    const container = item.querySelector(
      'div.awl-ul-keyword-item-subtitle'
    );
    if (!container || container.querySelector('.add-current-price'))
      return;

    const btn = document.createElement('button');
    btn.className =
      'a-button a-button-base a-button-small add-current-price';

    let inner = 'Add Current Price';
    if (comments.length > 0) {
      const minC = Math.min(...comments);
      const pct  = Math.round(((price - minC) / minC) * 100);
      const sign = pct > 0 ? '+' : '';
      const cls  = pct < 0 ? 'wsdc-pct-positive' : 'wsdc-pct-negative';
      inner += ` <span class="wsdc-pct ${cls}">(${sign}${pct}%)</span>`;
    }
    btn.innerHTML = inner;

    btn.onclick = async () => {
      const initial = comments.length === 0;
      const all     = [...comments, price].sort((a, b) => b - a);
      const text    = all.join(', ');
      try {
        await updateComment(item, text);
        if (initial && reloadOnFirst) {
          location.reload();
        } else {
          findCommentEl(item).textContent = text;
        }
      } catch (e) {
        console.error('Update failed', e);
        alert(`Failed to update comment: ${e.message}`);
      }
    };
    container.appendChild(btn);
  };

  // ---- MAIN PROCESS ----
  const processWishlist = () => {
    getAllItems().forEach(item => {
      if (item.dataset.wsdcDone) return;
      const price    = parsePrice(item);
      const comments = parseCommentPrices(findCommentEl(item));
      const cmp      = comparePrice(price, comments);

      item.dataset.wsdcComparison = cmp === null ? 'null' : String(cmp);
      item.dataset.wsdcPriced     = price === null ? 'false' : 'true';

      attachButton(item, price, comments);
      if (cmp === 0) item.classList.add('wsdc-best-equal');
      if (cmp === 1) item.classList.add('wsdc-best-better');

      item.dataset.wsdcDone = '1';
    });
    updateVisibility();
  };

  // ---- VISIBILITY ----
  const updateVisibility = () => {
    getAllItems().forEach(item => {
      const cmp    = item.dataset.wsdcComparison;
      const priced = item.dataset.wsdcPriced === 'true';
      if (hideUnpriced && !priced)        item.style.display = 'none';
      else if (hideWorse && cmp === '-1') item.style.display = 'none';
      else                                 item.style.display = '';
    });
  };

  // ---- TOGGLE PANEL ----
  const insertTogglePanel = () => {
    const wrapper = document.querySelector('#g-items')?.parentElement;
    if (!wrapper) return;
    const panel = document.createElement('div');
    panel.id = 'wsdc-toggle-container';
    panel.innerHTML = `
      <label><input type="checkbox" id="wsdc-hide-worse">
        Hide overpriced
      </label>
      <label><input type="checkbox" id="wsdc-hide-unpriced">
        Hide out-of-stock
      </label>
      <label><input type="checkbox" id="wsdc-reload-first">
        Reload on first comment add
      </label>
    `;
    wrapper.insertBefore(panel, wrapper.firstChild);

    const cbWorse   = panel.querySelector('#wsdc-hide-worse');
    const cbUnpriced= panel.querySelector('#wsdc-hide-unpriced');
    const cbReload  = panel.querySelector('#wsdc-reload-first');

    cbWorse.checked    = hideWorse;
    cbUnpriced.checked = hideUnpriced;
    cbReload.checked   = reloadOnFirst;

    cbWorse.addEventListener('change', e => {
      hideWorse = e.target.checked;
      storage.set(STORAGE_KEYS.hideWorse, hideWorse);
      updateVisibility();
    });
    cbUnpriced.addEventListener('change', e => {
      hideUnpriced = e.target.checked;
      storage.set(STORAGE_KEYS.hideUnpriced, hideUnpriced);
      updateVisibility();
    });
    cbReload.addEventListener('change', e => {
      reloadOnFirst = e.target.checked;
      storage.set(STORAGE_KEYS.reloadOnFirst, reloadOnFirst);
    });
  };

  // ---- BOOT ----
  insertTogglePanel();
  processWishlist();
  const container = document.getElementById('g-items');
  if (container) {
    new MutationObserver(processWishlist).observe(container, {
      childList: true,
      subtree: true
    });
  }
})();