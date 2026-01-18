// ==UserScript==
// @name Amazon - Goodreads metadata
// @namespace https://github.com/bricemciver/GreasemonekeyScripts
// @description Shows the ratings from Goodreads on Amazon book pages
// @license MIT
// @version 0.0.2
// @match https://amazon.com/*
// @match https://*.amazon.com/*
// @match https://amazon.co.uk/*
// @match https://*.amazon.co.uk/*
// @match https://amazon.ca/*
// @match https://*.amazon.ca/*
// @match https://amazon.de/*
// @match https://*.amazon.de/*
// @match https://amazon.fr/*
// @match https://*.amazon.fr/*
// @match https://amazon.es/*
// @match https://*.amazon.es/*
// @match https://amazon.it/*
// @match https://*.amazon.it/*
// @match https://amazon.co.jp/*
// @match https://*.amazon.co.jp/*
// @match https://amazon.cn/*
// @match https://*.amazon.cn/*
// @match https://amazon.com.br/*
// @match https://*.amazon.com.br/*
// @match https://amazon.in/*
// @match https://*.amazon.in/*
// @match https://amazon.com.mx/*
// @match https://*.amazon.com.mx/*
// @match https://amazon.com.au/*
// @match https://*.amazon.com.au/*
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @icon https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @downloadURL https://update.greasyfork.org/scripts/468322/Amazon%20-%20Goodreads%20metadata.user.js
// @updateURL https://update.greasyfork.org/scripts/468322/Amazon%20-%20Goodreads%20metadata.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/main/amazon-goodreads-meta/amazon-goodreads-meta.user.ts
  var AmazonGoodreadsMeta;
  ((AmazonGoodreadsMeta2) => {
    const asinRegex = /^[A-Z0-9]{10}$/;
    const goodreadsRegex = /"aggregateRating":({"@type":"AggregateRating","ratingValue":.*?,"ratingCount":.*?,"reviewCount":.*?})/;
    const extractASINs = () => {
      const asins = [];
      const books = document.querySelectorAll("bds-unified-book-faceout");
      for (const item of Array.from(books)) {
        const asin = item.dataset.csaCItemId;
        if (asin && asinRegex.test(asin)) {
          asins.push(asin);
        }
      }
      const asinMeta = document.querySelector("div[data-asin]");
      if (asinMeta) {
        const asin = asinMeta.dataset.asin;
        if (asin && asinRegex.test(asin)) {
          asins.push(asin);
        }
      }
      return asins;
    };
    const fetchGoodreadsDataForASIN = (asin) => {
      return GM.xmlHttpRequest({
        method: "GET",
        url: `https://www.goodreads.com/book/isbn/${asin}`
      });
    };
    const insertGoodreadsData = (asin, goodreadsData) => {
      var _a, _b, _c, _d;
      const container = document.createElement("div");
      container.style.padding = "6px";
      container.style.margin = "5px 0";
      container.style.backgroundColor = "#f8f8f8";
      container.style.border = "1px solid #ddd";
      container.style.borderRadius = "3px";
      let content = `<div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 2px;">
          <span><img src="https://www.goodreads.com/favicon.ico" style="width: 16px; height: 16px; margin-right: 3px;" alt="Goodreads" />
          <a href="${goodreadsData.bookUrl}" target="_blank" style="font-weight: bold;">Goodreads</a></span>`;
      if (goodreadsData.rating) {
        content += `<span style="color: #000">${goodreadsData.rating} stars</span>`;
      }
      if (goodreadsData.ratingCount) {
        content += `<span style="white-space: nowrap;">${goodreadsData.ratingCount} ratings</span>`;
      }
      if (goodreadsData.reviewCount) {
        content += `<span style="white-space: nowrap;">${goodreadsData.reviewCount} reviews</span>`;
      }
      content += "</div>";
      container.innerHTML = content;
      const currentBooks = document.querySelectorAll("bds-unified-book-faceout");
      for (const book of Array.from(currentBooks)) {
        const bookInfoDiv = (_a = book.shadowRoot) == null ? void 0 : _a.querySelector("div[data-csa-c-item-id]");
        if (bookInfoDiv) {
          const bookAsin = bookInfoDiv.dataset.csaCItemId;
          if (bookAsin && bookAsin === asin) {
            const ratings = (_b = book.shadowRoot) == null ? void 0 : _b.querySelector("div.star-rating");
            if (ratings) {
              (_c = ratings.parentNode) == null ? void 0 : _c.insertBefore(container, ratings.nextSibling);
              break;
            }
          }
        }
      }
      const reviewElement = document.getElementById("reviewFeatureGroup");
      if (reviewElement) {
        (_d = reviewElement.parentNode) == null ? void 0 : _d.insertBefore(container, reviewElement.nextSibling);
      }
    };
    const processAsins = (asins) => __async(null, null, function* () {
      for (const asin of asins) {
        try {
          const goodreadsData = yield fetchGoodreadsDataForASIN(asin);
          const url = goodreadsData.finalUrl;
          const aggregateMatch = goodreadsRegex.exec(goodreadsData.responseText);
          if (aggregateMatch && aggregateMatch.length > 1) {
            const aggregateData = JSON.parse(aggregateMatch[1]);
            const aggregateGoodreadsData = {
              rating: aggregateData.ratingValue,
              ratingCount: aggregateData.ratingCount,
              reviewCount: aggregateData.reviewCount,
              bookUrl: url
            };
            insertGoodreadsData(asin, aggregateGoodreadsData);
          }
        } catch (error) {
          console.error("Error fetching Goodreads data:", error);
        }
      }
    });
    AmazonGoodreadsMeta2.init = () => __async(null, null, function* () {
      const asins = extractASINs();
      if (!asins || asins.length === 0) {
        return;
      }
      try {
        yield processAsins(asins);
      } catch (error) {
        console.error("Error in Goodreads script:", error);
      }
    });
  })(AmazonGoodreadsMeta || (AmazonGoodreadsMeta = {}));
  AmazonGoodreadsMeta.init();
})();
//# sourceMappingURL=amazon-goodreads-meta.user.js.map
