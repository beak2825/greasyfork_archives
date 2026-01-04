// ==UserScript==
// @name             eBay™ Popularity Sort
// @version          1.0.6
// @description      Sorts eBay™ search results by popularity (number of times sold)
// @author           jomifepe
// @license          Apache-2.0
// @icon             https://www.ebay.com/favicon.ico
// @require          http://code.jquery.com/jquery-latest.min.js
// @include          https://www.ebay.com/sch/*
// @namespace        https://jomifepe.github.io/
// @supportURL       https://github.com/jomifepe/userscripts/issues
// @homepage         https://github.com/jomifepe/userscripts/tree/main/ebay-popularity-sort
// @contributionURL  https://www.paypal.com/donate?hosted_button_id=JT2G5E5SM9C88
// @downloadURL https://update.greasyfork.org/scripts/369797/eBay%E2%84%A2%20Popularity%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/369797/eBay%E2%84%A2%20Popularity%20Sort.meta.js
// ==/UserScript==

// This is a port from the eBay™ Popularity Sort chrome extension.
// Thanks to Elad Nava: https://github.com/eladnava/ebay-popularity-sort */

(function () {
  'use strict';

  // Wait for document to load
  $(document).ready(function () {
    // Array of search results
    var results = [];

    // Traverse search results
    $('ul.srp-results li.s-item, ul#ListViewInner li[listingid]').each(function () {
      // Convert to jQuery object
      var listing = $(this);

      // Default listing sold count to 0
      var soldCount = 0;

      // Extract hotness text
      var hotnessText = listing
        .find('.s-item__itemHotness, .hotness-signal, .s-item__authorized-seller')
        .text()
        .replace(/,/g, '');

      // Get sold count as integer
      soldCount = parseInt(hotnessText) || 0;

      // Count indicates number of users watching this item and not number of times sold?
      if (hotnessText.includes('watching')) {
        soldCount = 0;
      }

      // Count indicates a percentage discount and not number of times sold?
      if (hotnessText.includes('%')) {
        soldCount = 0;
      }

      // Add item sold count and listing itself
      results.push({ sold: soldCount, listing: listing });

      // Delete element temporarily
      listing.remove();
    });

    // Sort all listings by sold count DESC
    results.sort(function (a, b) {
      return b.sold - a.sold;
    });

    // Get search results parent list
    var ul = $('.srp-river-answer, #ListViewInner').first();

    // Warn the user about the modified result order
    ul.append('<p>These search results have been modified by <b>eBay™ Popularity Sort</b>.</p>');

    // Re-add the sorted results
    results.forEach(function (item) {
      ul.append(item.listing);
    });
  });
})();
