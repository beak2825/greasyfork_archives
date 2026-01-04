// ==UserScript==
// @name        Ebay URL Cleaner/ shorter 
// @description Show the shortest possible URL for Ebay items.
// @namespace   https://arantius.com/misc/greasemonkey/
// @match       https://www.ebay.com/itm/*
// @run-at      document-start
// @version     1
// @grant       none
// @icon        https://pages.ebay.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/429532/Ebay%20URL%20Cleaner%20shorter.user.js
// @updateURL https://update.greasyfork.org/scripts/429532/Ebay%20URL%20Cleaner%20shorter.meta.js
// ==/UserScript==

function getProductId() {
  var m;
  m = document.location.href.match(/(?:.+\/)?itm\/([^/?]+)/);
  if (m) return m[1];
}

var productId = getProductId();
if (productId) {
  history.replaceState(
      {}, document.title, 'https://www.ebay.com/itm/' + productId);
}