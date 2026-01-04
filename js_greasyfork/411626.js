// ==UserScript==
// @run-at document-start
// @name        Adverts.ie Sort by Lowest Price
// @namespace   Advrts
// @description Auto set sort by price on Adverts.ie
// @version     1.01
// @copyright   2020 Chopper
// @include     https://www.adverts.ie/for-sale/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/411626/Advertsie%20Sort%20by%20Lowest%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/411626/Advertsie%20Sort%20by%20Lowest%20Price.meta.js
// ==/UserScript==

// Get current URL
var url = window.location.href;

// If URL contains already contains a sorting method, don't change it.
if (url.indexOf('/sortby_') > -1){
   url += ''
}

// If there is no sorting method, sort by lowest price
else{
   url += 'sortby_price-asc/'
  // Load new URL
window.location.href = url;
}