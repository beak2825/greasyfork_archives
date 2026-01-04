// ==UserScript==
// @run-at document-start
// @name        eBay Auto Sort by Lowest Price
// @namespace   EBY
// @description Auto set sort by price on eBay.ie
// @version     1.01
// @copyright   2020 Chopper
// @include     https://www.ebay.ie/sch/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/411689/eBay%20Auto%20Sort%20by%20Lowest%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/411689/eBay%20Auto%20Sort%20by%20Lowest%20Price.meta.js
// ==/UserScript==

// Get current URL
var url = window.location.href;

// If URL contains already contains a sorting method, don't change it.
if (url.indexOf('_sop=1' || '_sop=2' || '_sop=3' || '_sop=7' || '_sop=10'|| '_sop=12' || '_sop=15' || '_sop=16'  || '_sop=18' || '_sop=19' ) > -1){
   url += ''
}

// If there is no sorting method, sort by lowest price
else{
   url += '&_sop=15'
  // Load new URL
window.location.href = url;
}