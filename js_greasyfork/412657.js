// ==UserScript==
// @name     Listia Points to Dollars 684909
// @namespace   technote.fyi
// @description Add a dollar value next to the PTS value, in the gallery view.
// @include     https://www.listia.com/*
// @version     1
// @grant       none	
// @require https://code.jquery.com/jquery-3.5.1.slim.min.js 
// @downloadURL https://update.greasyfork.org/scripts/412657/Listia%20Points%20to%20Dollars%20684909.user.js
// @updateURL https://update.greasyfork.org/scripts/412657/Listia%20Points%20to%20Dollars%20684909.meta.js
// ==/UserScript==

/* <span class="price"><div class="ink-wrapper" title="">19,999.99 <span class="ink-unit">PTS</span></div></span> */

jQuery('.price').each(function( index, elem) {
	var pts = jQuery(this).children('.ink-wrapper');
  var ptsval = parseFloat( pts.text().replace(/,/, '').replace(/PTS/, '') );
  var dollarfmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(ptsval / 500);
  pts.append(' <span>' + dollarfmt + '</span>');
});