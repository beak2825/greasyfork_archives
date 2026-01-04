// ==UserScript==
// @name         Ethereum Price Checker
// @match        https://www.coingecko.com/*
// @description  A script to check the price of Ethereum on Coingecko
// @license      MIT
// @version 0.0.1.20240426154018
// @namespace https://greasyfork.org/users/1293491
// @downloadURL https://update.greasyfork.org/scripts/493557/Ethereum%20Price%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/493557/Ethereum%20Price%20Checker.meta.js
// ==/UserScript==

const ethereumUrl = 'https://www.coingecko.com/en/coins/ethereum';
fetch(ethereumUrl)
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const ethPriceElement = doc.querySelector('.no-wrap .coin-price');
    if (ethPriceElement) {
      const ethPrice = ethPriceElement.textContent.trim();
      console.log(`Ethereum (ETH) price: ${ethPrice}`);
    } else {
      console.log('Failed to get Ethereum price.');
    }
  })
  .catch(error => {
    console.error('An error occurred while fetching data:', error);
  });
