// ==UserScript==
// @name        Amazon URL Cleaner
// @description Show the shortest possible URL for Amazon items.
// @namespace   https://arantius.com/misc/greasemonkey/
// @match       https://www.amazon.com/dp/*
// @match       https://www.amazon.com/*/dp/*
// @match       https://www.amazon.com/gp/product/*
// @match       https://www.amazon.com/*/ASIN/*
// @run-at      document-start
// @version     9
// @grant       none
// @icon        https://www.amazon.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/27460/Amazon%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/27460/Amazon%20URL%20Cleaner.meta.js
// ==/UserScript==

function getProductId() {
  var m;
  m = document.location.href.match(/(?:.+\/)?dp\/([^/?]+)/);
  if (m) return m[1];
  m = document.location.href.match(/gp\/product\/([^/?]+)/);
  if (m) return m[1];
  m = document.location.href.match(/ASIN\/([^/?]+)/);
  if (m) return m[1];
}

var productId = getProductId();
if (productId) {
  history.replaceState(
      {}, document.title, 'https://www.amazon.com/dp/' + productId);
}