// ==UserScript==
// @name        USD to INR script
// @namespace   Sam-2503
// @match       https://greasyfork.org/en/script_versions/new*
// @grant       none
// @version     1.0
// @author      Sam-2503
// @description 6/20/2025, 11:46:35 PM
// @downloadURL https://update.greasyfork.org/scripts/540219/USD%20to%20INR%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/540219/USD%20to%20INR%20script.meta.js
// ==/UserScript==

// this script will convert USD prices to INR prices

(function () {
  "use strict";
  let exchangeRate = null;

  async function fetchExchangeRate() {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const data = await response.json();
      exchangeRate = data.rates.INR;

      console.log("Exchange rate fetched: 1 USD =", exchangeRate, "INR");
      convertPrices();
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  }

  function convertPrices() {
    if (!exchangeRate) {
      return;
    }

    const regex = /\$([\d,]+(?:\.\d{1,2})?)/g;

    function convert(match, p1) {
      const usd = parseFloat(p1.replace(/, /g, ""));
      const inr = Math.round(usd * exchangeRate);
      return `${match} (₹${inr.toLocaleString("en-IN")})`;
    }

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue.match(regex)) {
        continue;
      }

      node.nodeValue = node.nodeValue.replace(regex, (match, p1) => {
        const usd = parseFloat(p1.replace(/,/g, ""));
        const inr = Math.round(usd * exchangeRate);
        return `${match} (₹${inr.toLocaleString("en-IN")})`;
      });
    }
  }

  const observer = new MutationObserver(() => convertPrices());
  observer.observe(document.body, { childList: true, subtree: true });

  fetchExchangeRate();
})();
