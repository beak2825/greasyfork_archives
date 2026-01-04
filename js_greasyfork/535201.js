// ==UserScript==
// @name         Local Geekmarket
// @namespace    net.cheyne
// @version      1.02
// @description  Browse BoardGameGeek market pages in your local currency
// @author       Iain Cheyne
// @match        https://boardgamegeek.com/market*
// @exclude      https://boardgamegeek.com/market/account*
// @exclude      https://boardgamegeek.com/market/product*
// @exclude      https://boardgamegeek.com/market/user*
// @exclude      https://boardgamegeek.com/market/dashboard*
// @exclude      https://boardgamegeek.com/market/sell*
// @grant        none
// @license      CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/535201/Local%20Geekmarket.user.js
// @updateURL https://update.greasyfork.org/scripts/535201/Local%20Geekmarket.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const currentUrl = new URL(window.location.href);
  const currencyParam = 'currency';
  const desiredCurrency = 'GBP';

  // Check if the currency parameter is already set to the desired currency
  if (currentUrl.searchParams.get(currencyParam) !== desiredCurrency) {
    // Set or update the currency parameter to the desired currency
    currentUrl.searchParams.set(currencyParam, desiredCurrency);

    // Replace the current URL with the modified one
    window.location.replace(currentUrl.href);
  }
})();