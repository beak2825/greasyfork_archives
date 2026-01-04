// ==UserScript==
// @name         Uber Eats ad blocker
// @namespace    http://tampermonkey.net/
// @author       yotann
// @version      0.3
// @license      CC-PDDC
// @description  Removes ads and annoyances on the Uber Eats website.
// @match        https://www.ubereats.com/*
// @run-at       document-start
// @inject-into  page
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532783/Uber%20Eats%20ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/532783/Uber%20Eats%20ad%20blocker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function hookPrototype(prototype, overrides) {
    // Set the prototype of the overrides, so `super` refers to an unmodified copy of the original prototype.
    Object.setPrototypeOf(overrides, Object.create(Object.getPrototypeOf(prototype), Object.getOwnPropertyDescriptors(prototype)));
    Object.defineProperties(prototype, Object.getOwnPropertyDescriptors(overrides));
  }

  hookPrototype(Response.prototype, {
    async json() {
      return JSON.parse(await this.text());
    },
    async text() {
      return rewriteResponseText(this.status, this.url, await (super.text()));
    },
  });

  hookPrototype(XMLHttpRequest.prototype, {
    get response() {
      switch (this.responseType) {
      case '':
      case 'text':
        return this.responseText;
      case 'json':
        return JSON.parse(rewriteResponseText(this.status, this.responseURL, JSON.stringify(super.response)));
      default: // Not hooked
        return super.response;
      }
    },
    get responseText() {
      // It would make more sense to use the request URL instead of responseURL, but we can't access it here.
      return rewriteResponseText(this.status, this.responseURL, super.responseText);
    },
  });

  function childPromise(parent, getChild) {
    return new Promise(resolve => {
      const attempt = getChild();
      if (attempt) {
        return resolve(attempt);
      }
      new MutationObserver((mutationList, observer) => {
        const attempt = getChild();
        if (attempt) {
          observer.disconnect();
          resolve(attempt);
        }
      }).observe(parent, { childList: true });
    });
  }

  (async () => {
    const body = await childPromise(document, () => document.body);
    // __FILE_UPLOAD__ is the next element after __REACT_QUERY_STATE__,
    // so once it exists __REACT_QUERY_STATE__ should be fully loaded.
    await childPromise(body, () => document.getElementById('__FILE_UPLOAD__'));
    const queryStateElement = await childPromise(body, () => document.getElementById('__REACT_QUERY_STATE__'));
    console.log('Rewriting __REACT_QUERY_STATE__');
    const queryState = JSON.parse(decodeURIComponent(
      queryStateElement.textContent.replace(/\\u[0-9a-f]{4}/gi, (x => JSON.parse(`"${x}"`)))));
    queryState.queries.forEach(query => { query.state = rewriteQueryState(query.queryKey[0], query.state); });
    queryStateElement.textContent = JSON.stringify(queryState).replace(/[%\\]/g, encodeURIComponent)
      .replace(/["&/<>\u2028\u2029]/g, (x => '\\u' + x.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')));
  })();

  function rewriteResponseText(status, url, responseText) {
    if (!url || url == '') {
      // Seems to be necessary to stop /ramendca responses from getting through.
      return "";
    }
    url = new URL(url);
    // Pop-up ads on /feed (these are EventStreams being read incrementally).
    if (/^\/ramen\w*\/events\/recv$/.test(url.pathname)) {
      console.log("Blocking EventStream: " + url.pathname);
      return "";
    }
    const apiPrefix = "/_p/api/";
    if (status != 200 || !url.pathname.startsWith(apiPrefix)) {
      return responseText;
    }
    return JSON.stringify(rewriteQueryState(url.pathname.substr(apiPrefix.length), JSON.parse(responseText)));
  }

  function rewriteQueryState(endpoint, query) {
    if (query.status != 'success') {
      return query;
    }
    console.log('Rewriting query state: ' + endpoint);
    switch (endpoint) {
      case 'checkoutOrdersByDraftOrdersV1':
      case 'getActiveOrdersV1':
        // Ads on order tracking page
        query.data.orders.forEach(order => {
          order.feedCards = order.feedCards.filter(feedCard => feedCard.type != "eaterMessagePayload");
        });
        break;
      case 'getCheckoutPresentationV1':
        if (query.data.checkoutPayloads) {
          // Uber One ad on /checkout, above "Place Order" button
          if (query.data.checkoutPayloads.passBanner) {
            query.data.checkoutPayloads.passBanner.banners = [];
          }
          // "Complete your order" popup
          query.data.checkoutPayloads.upsellFeed = null;
        }
        break;
      case 'getFeedV1':
        // Ad carousel on /feed
        query.data.feedAffixes = [];
        break;
      case 'getLatestPendingRatingV1':
        // "How was your order" popup
        query.data = null;
        break;
      case 'getSearchFeedV1':
        // Sponsored results
        query.data.feedItems = query.data.feedItems.filter(feedItem => !feedItem?.store?.storeAd);
        break;
      case 'getSearchSuggestionsV1':
        // Sponsored results
        query.data = query.data.filter(suggestion => !suggestion?.store?.storeAd);
        break;
      case 'getStoreV1':
        // Uber One promo at top of store page
        Object.entries(query.data.catalogSectionsMap)
          .forEach(([key, entries]) => {
            if (entries.length > 0 && entries[0].type == "EATER_MESSAGE" && entries[0].catalogSectionUUID == "4df1ee8b-46bb-493e-a432-0a97192ccb52") {
              entries.shift();
            }
          });
        query.data.pinnedInfo = null;
        break;
      case 'getUserV1':
        // Uber One message in sidebar
        if (query.data.subscriptionMeta) {
          query.data.subscriptionMeta.subtitle = "";
        }
        break;
      case 'getUserPromoDetailsV1':
        // Referral promo in sidebar
        query.data.giveGetDetails = null;
        query.data.giveGetDetailsV2 = null;
        query.data.giveGetLandingPages = {};
        query.data.groceryGiveGetDetails = null;
        break;
    }
    return query;
  }
})();