// ==UserScript==
// @name          Ubiquiti Store: Show Quantity In Stock
// @version       0.1.2
// @icon          https://prd-www-cdn.ubnt.com/static/favicon-152.png
// @namespace     http://github.com/rogwilco
// @license       MIT
// @author        Nick Williams <git@nickawilliams.com>
// @description   Adds the quantity available to the In-Stock badge when viewing
//                a product.
//
// @include       https://store.ui.com/*
// @include       https://*.store.ui.com/*
//
// @require       http://code.jquery.com/jquery-1.8.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/439431/Ubiquiti%20Store%3A%20Show%20Quantity%20In%20Stock.user.js
// @updateURL https://update.greasyfork.org/scripts/439431/Ubiquiti%20Store%3A%20Show%20Quantity%20In%20Stock.meta.js
// ==/UserScript==

(function() {
  'use strict'

  $(document).ready(() => {
      let theWindow
      
      try {
          theWindow = unsafeWindow
      } catch (e) {
          theWindow = window
      }
      
      
      
      const quantity = theWindow.APP_DATA.product.variants
          ?.reduce((total, v) => total += v.inventory_quantity, 0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    $('#titleInStockBadge').html(`${quantity} In Stock`)
  })
})();
