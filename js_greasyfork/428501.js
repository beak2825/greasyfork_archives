// ==UserScript==
// @name         Market
// @namespace    http://tampermonkey.net/
// @version      7.3
// @description  xxx
// @author       You
// @match        https://market.yandex.ru/product--besprovodnye-naushniki-apple-airpods-2-s-zariadnym-futliarom-mv7n2/417038108/offers?glfilter=23476910%3A26684950_101507855747&cpa=1&how=aprice&grhow=supplier&sku=101507855747&local-offers-first=0
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428501/Market.user.js
// @updateURL https://update.greasyfork.org/scripts/428501/Market.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, g_sessionID */

// Getting a list of tabs of the current window.
chrome.windows.getLastFocused(
 // Without this, window.tabs is not populated.
 {populate: true},
 function (window)
 {
  var foundSelected = false;
  for (var i = 0; i < window.tabs.length; i++)
  {
   // Finding the selected tab.
   if (window.tabs[i].active)
   {
    foundSelected = true;
   }
   // Finding the next tab.
   else if (foundSelected)
   {
    // Selecting the next tab.
    chrome.tabs.update(window.tabs[i].id, {active: true});
    return;
   }
  }
 });