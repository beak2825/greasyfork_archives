// ==UserScript==
// @name         Ethereum ETH Price Rate Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts Ethereum ETH price rate and displays it in the console
// @match        https://www.coingecko.com/en/coins/ethereum
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493561/Ethereum%20ETH%20Price%20Rate%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/493561/Ethereum%20ETH%20Price%20Rate%20Extractor.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Wait for the page to load
  const ethereumUrl = 'https://www.coingecko.com/en/coins/ethereum';
fetch(ethereumUrl)
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const ethPriceElement = doc.querySelector('.no-wrap .coin-price');
    if (ethPriceElement) {
      const ethPrice = ethPriceElement.textContent.trim();
      console.log(`Курс Ethereum (ETH): ${ethPrice}`);
    } else {
      console.log('Не удалось получить курс Ethereum.');
    }
  })
  .catch(error => {
    console.error('Произошла ошибка при получении данных:', error);
  });
})();