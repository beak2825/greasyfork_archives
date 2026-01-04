// ==UserScript==
// @name         One-Click Quickstock/Quickdeposit
// @description  Add action buttons to Neopets Quick Stock page
// @version      2025.06.25
// @license      GNU GPLv3
// @match        https://www.neopets.com/quickstock.phtml*
// @author       Posterboy + credit Max van Doorn for CSS styles
// @namespace    https://youtube.com/@Neo_Posterboy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @downloadURL https://update.greasyfork.org/scripts/509909/One-Click%20QuickstockQuickdeposit.user.js
// @updateURL https://update.greasyfork.org/scripts/509909/One-Click%20QuickstockQuickdeposit.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Load external CSS
  document.head.appendChild(Object.assign(document.createElement('link'), {
    rel: 'stylesheet',
    href: 'https://greasyfork.org/scripts/540710-neopets-2020/code/neopets_2020.user.css'
  }));

  const applyButtonStyles = (btn, extraStyles = {}) => {
    btn.style.fontSize = 'x-large';
    btn.style.paddingLeft = '20px';
    btn.style.paddingRight = '20px';
    Object.entries(extraStyles).forEach(([k, v]) => btn.style[k] = v);
  };

  window.addEventListener('load', () => setTimeout(createToolbar, 2000));

  function selectAction(action) {
    document.querySelectorAll(`input[type="radio"][value="${action}"]`).forEach(r => r.checked = true);
    const form = document.querySelector('form[name="quickstock"]');
    if (form) form.submit();
  }

  function createToolbar() {
    if (document.querySelector('#custom-toolbar')) return;

    const form = document.querySelector('form[name="quickstock"]');
    if (!form) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'custom-toolbar';
    toolbar.style.paddingBottom = '10px';
    toolbar.style.textAlign = 'center';

    const stockAllBtn = document.createElement('button');
    stockAllBtn.textContent = 'Stock All';
    stockAllBtn.type = 'button';
    stockAllBtn.classList.add('button-green__2020');
    applyButtonStyles(stockAllBtn, { marginRight: '10px' });
    stockAllBtn.onclick = () => selectAction('stock');

    const depositAllBtn = document.createElement('button');
    depositAllBtn.textContent = 'Deposit All';
    depositAllBtn.type = 'button';
    depositAllBtn.classList.add('button-blue__2020');
    applyButtonStyles(depositAllBtn);
    depositAllBtn.onclick = () => selectAction('deposit');

    toolbar.append(stockAllBtn, depositAllBtn);

    const table = form.querySelector('table');
    if (table) {
      table.parentNode.insertBefore(toolbar, table);
    } else {
      form.insertBefore(toolbar, form.firstChild);
    }
  }
})();
