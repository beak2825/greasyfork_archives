// ==UserScript==
// @name         Raiffeisenbank CZ - Credit card spent
// @namespace    https://github.com/jonathas/userscripts
// @version      0.1
// @description  Shows spent balance instead of available balance on the credit card widget
// @author       Jon Ribeiro <contact@jonathas.com>
// @match        https://online.rb.cz/web/
// @match        https://online.rb.cz/web/*
// @match        https://online.rb.cz/web/#/home
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=online.rb.cz
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/458653/Raiffeisenbank%20CZ%20-%20Credit%20card%20spent.user.js
// @updateURL https://update.greasyfork.org/scripts/458653/Raiffeisenbank%20CZ%20-%20Credit%20card%20spent.meta.js
// ==/UserScript==

// Change this value to your credit card limit!
const myLimit = 100;

const update = () => {
  const availableBalance = Number(
    document
      .querySelector('.card-balances rb-account-balance')
      .textContent.replace('CZK', '')
      .replace(/\s/g, '')
      .replace('.', '')
      .replace(',', '.')
      .trim()
  );

  const spent = myLimit - availableBalance;

  const moneySpent = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'CZK'
  }).format(spent);

  document.querySelector('.card-balances .balance-label').style.display = 'none';
  document.querySelector('.card-balances rb-account-balance .actual-balance').textContent =
    moneySpent;
};

const check = (changes, observer) => {
  // When the div is ready and with content
  if (document.querySelector('.card-balances rb-account-balance .actual-balance')) {
    observer.disconnect();
    update();
  }
};

new MutationObserver(check).observe(document, { childList: true, subtree: true });
