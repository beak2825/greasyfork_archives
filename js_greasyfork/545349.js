// ==UserScript==
// @name         Torn Item Market: Net After Fee
// @version      1.5
// @description  Show price after 5% market fee on a new line
// @author       yoyo
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @namespace https://greasyfork.org/users/1132032
// @downloadURL https://update.greasyfork.org/scripts/545349/Torn%20Item%20Market%3A%20Net%20After%20Fee.user.js
// @updateURL https://update.greasyfork.org/scripts/545349/Torn%20Item%20Market%3A%20Net%20After%20Fee.meta.js
// ==/UserScript==

(() => {
  const FEE_PERCENT = 5;
  const fmt = new Intl.NumberFormat('en-US');
  const parseMoney = s => {
    const m = String(s).replace(/[^0-9]/g, '');
    return m ? parseInt(m, 10) : NaN;
  };

  function annotatePrice(el) {
    if (!el || el.dataset.netAdded === '1') return;

    // Make the price cell stack vertically so two lines fit
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.alignItems = 'flex-start';

    // Bump the whole row to auto height (Torn sets 34px inline)
    const row = el.closest('li[class^="rowWrapper___"]');
    if (row) row.style.setProperty('height', 'auto', 'important');

    const price = parseMoney(el.textContent);
    if (isNaN(price)) return;

    const net = Math.round(price * (1 - FEE_PERCENT / 100));

    const tag = document.createElement('div');
    tag.textContent = `(${fmt.format(net)})`;
    tag.style.fontSize = '11px';
    tag.style.color = 'red';
    tag.style.opacity = '0.9';
    tag.style.marginTop = '2px';
    tag.style.lineHeight = '1.1';

    el.appendChild(tag);
    el.dataset.netAdded = '1';
  }

  function scan(root = document) {
    root.querySelectorAll('[class^="price___"]').forEach(annotatePrice);
  }

  scan();
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes && m.addedNodes.forEach(n => n.nodeType === 1 && scan(n));
    }
  });
  mo.observe(document.body, { subtree: true, childList: true });
})();
