// ==UserScript==
// @name         Amazon - Call Out Sponsored Contents
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  I'm cheap and don't like ads affecting my purchase decisions!
// @author       You
// @license      MIT
// @match        https://*.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/453810/Amazon%20-%20Call%20Out%20Sponsored%20Contents.user.js
// @updateURL https://update.greasyfork.org/scripts/453810/Amazon%20-%20Call%20Out%20Sponsored%20Contents.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


(function () {
  'use strict';
  function changeOpacity(object) {
    if (object.text.length > 0 && object.text.indexOf('Sponsored') > -1) {
      const containerId = object.container.attr('id');
      var events = $._data(document.getElementById(containerId), 'events');
      if (!events) {
        // this is the first time we checked on this page and have not attached any hover handlers yet
        // just set opacity for now
        // all following checks will follow the hover handlers
        object.container.css({ 'opacity': object.opacity });
      }

      object.container.hover(
        function () { // hover in
          object.container.css({ 'opacity': 1 });
        },
        function () { // hover out
          object.container.css({ 'opacity': object.opacity });
        }
      );
    }
  }

  function processSearchResult() {
    const sponsoredContents = $('div.AdHolder.s-result-item.s-asin'); // in search result
    if (sponsoredContents.length > 0) {
      $.each(sponsoredContents, function () {
        if ($(this).text().indexOf('Sponsored') > -1) {
          const color = $(this).css('background-color');
          const s = $(this).find('span.a-color-secondary');
          const sHover = $(this).find('span.s-label-popover-hover');
          if (s && color !== 'rgb(128, 128, 128)') {
            s.removeClass('a-color-secondary');
            s.css({ 'color': 'red', 'font-size': '200%' });
          }
          if (sHover && color !== 'rgb(128, 128, 128)') {
            sHover.removeClass('a-color-base');
            sHover.css({ 'color': 'red', 'font-size': '120%' });
          }

          if (s || sHover) {
            $(this).css({ 'background-color': 'grey' });
          }

        }
      });
    }

    const topAdListSpan = $('span#ad-feedback-text-auto-sparkle-hsa-tetris'); // at the top of the page, before all search results
    if (topAdListSpan.length > 0) {
      topAdListSpan.parent().parent().parent().parent().parent().parent().css({ 'background-color': 'grey' }); // the list container
      topAdListSpan.css({ 'color': 'red', 'font-size': '120%' });
    }

    const mainAdList = $('span#ad-feedback-text-main');
    if (mainAdList.length > 0) { // there should be 2 of these... with the same ids...
      $.each(mainAdList, function () {
        if ($(this).text().indexOf('Sponsored') > -1) {
          $(this).parent().parent().parent().css({ 'background-color': 'grey' });
          $(this).css({ 'color': 'red', 'font-size': '120%' })
        }
      });
    }

    const highlyRatedSpan = $('span.a-size-base.a-color-secondary:contains("Sponsored | Based on star rating and number of customer ratings")');
    if (highlyRatedSpan.length > 0) {
      highlyRatedSpan.parent().parent().parent().parent().parent().parent().parent().css({ 'background-color': 'lightgrey' }); // the list itself - light grey since it might not be sponsored
      highlyRatedSpan.css({ 'background-color': 'red' })
    }

    const sponsoredBrandListSpan = $('span#ad-feedback-text-desktop-hsa-3psl'); // "brands related to your search" list - at the bottom after the search result
    if (sponsoredBrandListSpan.length > 0) {
      sponsoredBrandListSpan.parent().parent().parent().parent().parent().parent().css({ 'background-color': 'grey', 'color': 'red' });
    }

    const needHelpSponsored = $('#ad-feedback-text-auto-bottom-advertising-0'); // the sponsored ad under "need help" at the bottom
    if (needHelpSponsored.length > 0) {
      needHelpSponsored.parent().parent().parent().css({ 'opacity': 0.2 });
      needHelpSponsored.css({ 'color': 'red', 'font-size': '120%' })
    }

    const sideSponsoredATags = $('a.s-ad-feedback-link'); // ads on the left hand side under the filters - might be more than 1
    if (sideSponsoredATags.length > 0) {
      $.each(sideSponsoredATags, function () {
        if ($(this).text().indexOf('Sponsored') > -1) {
          $(this).parent().parent().parent().css({ 'opacity': 0.1 });
        }
      });
    }
  }

  function processProductDetail() {
    // the sponsored ad under "Customer ratings by feature"
    // above the "frequently bought together" list
    const ad1 = $("div#hero-quick-promo-grid_feature_div");
    const sponsoredAdSpan1 = $('div#hero-quick-promo-grid_feature_div span#ad-feedback-text-hero-quick-promo');
    const adObj1 = {
      container: ad1,
      text: sponsoredAdSpan1.text(),
      opacity: 0.1
    };
    // same location as above, just a different ad
    const ad1_1 = $('#ape_Detail_hero-quick-promo_Desktop_placement');
    const sponsoredAdSpan1_1 = $('#ape_Detail_hero-quick-promo_Desktop_placement span#ad-feedback-text-hero-quick-promo');
    const adObj1_1 = {
      container: ad1_1,
      text: sponsoredAdSpan1_1.text(),
      opacity: 0.1
    };


    // the sponsored ad under "add to cart"
    // to the right of the ad1 above
    const ad2 = $("div#amsDetailRight_feature_div");
    const sponsoredAdSpan2 = $('div#amsDetailRight_feature_div span#ad-feedback-text-ams-detail-right-v2');
    const adObj2 = {
      container: ad2,
      text: sponsoredAdSpan2.text(),
      opacity: 0.1
    };

    // the sponsored ad to the left of the customer reviews
    const ad3 = $("div#cr-ADPlaceholder");
    const sponsoredAdSpan3 = $('div#cr-ADPlaceholder span#ad-feedback-text-customer-reviews-top');
    const adObj3 = {
      container: ad3,
      text: sponsoredAdSpan3.text(),
      opacity: 0.1
    };

    // the right below the "Products related to this item" list
    // but above the "Customer questions & answers" list
    const ad4 = $("div#dp-ads-center-promo_feature_div");
    const sponsoredAdSpan4 = $('div#dp-ads-center-promo_feature_div span#ad-feedback-text-dp-ads-center-promo');
    const adObj4 = {
      container: ad4,
      text: sponsoredAdSpan4.text(),
      opacity: 0.1
    };

    // the sponsored ad below the customer reviews, the "Based on your recent views" list
    // but above "Recommended based on your shopping trends" list
    const ad5 = $("div#ad-endcap-1_feature_div");
    const sponsoredAdSpan5 = $('div#ad-endcap-1_feature_div span#ad-feedback-text-ad-endcap-1');
    const adObj5 = {
      container: ad5,
      text: sponsoredAdSpan5.text(),
      opacity: 0.1
    };

    // the "products related to this item" list - below "frequently bought together"
    // but above "more to shop from [blah]"
    const adList1 = $('div#sp_detail');
    const sponsoredListSpan1 = $('div#sp_detail #sp_detail_feedbackMessage > span.sp_detail_sponsored_label');
    const listObj1 = {
      container: adList1,
      text: sponsoredListSpan1.text(),
      opacity: 0.1
    };
    // the "more to shop from [blah]" list
    const adList2 = $('div#sp_detail_thematic-brand');
    const sponsoredListSpan2 = $('div#sp_detail_thematic-brand #sp_detail_thematic-brand_feedbackMessage > span.sp_detail_thematic-brand_sponsored_label');
    const listObj2 = {
      container: adList2,
      text: sponsoredListSpan2.text(),
      opacity: 0.1
    };

    // "Brands in this category on amazon" list
    const adList3 = $('div#similarities_feature_div');
    const sponsoredListSpan3 = $('div#similarities_feature_div div.a-section.a-spacing-small span'); // not using the span id because it might be desktop specific
    const listObj3 = {
      container: adList3,
      text: sponsoredListSpan3.text(),
      opacity: 0.1
    };


    // the "Products related to this item" list after the product scription and before "customer questions & answers"
    const adList4 = $('div#sp_detail2');
    const sponsoredListSpan4 = $('div#sp_detail2 #sp_detail2_feedbackMessage > span.sp_detail2_sponsored_label');
    const listObj4 = {
      container: adList4,
      text: sponsoredListSpan4.text(),
      opacity: 0.1
    };

    // the "4 stars and above" list - after all the customer reviews
    // but before the "Customers who searched for "dog food" ultimately bought" list
    const adList5 = $('div#sp_detail_thematic-highly_rated');
    const sponsoredListSpan5 = $('div#sp_detail_thematic-highly_rated #sp_detail_thematic-highly_rated_feedbackMessage > span.sp_detail_thematic-highly_rated_sponsored_label');
    const listObj5 = {
      container: adList5,
      text: sponsoredListSpan5.text(),
      opacity: 0.1
    };

    const sponsoredContentList = [adObj1, adObj1_1, adObj2, adObj3, adObj4, adObj5, listObj1, listObj2, listObj3, listObj4, listObj5];
    sponsoredContentList.forEach(obj => changeOpacity(obj));
  }


  function processSponsoredContents() {
    processSearchResult();
    processProductDetail();
  }

  // check every 2 seconds
  setInterval(processSponsoredContents, 2000);
})();