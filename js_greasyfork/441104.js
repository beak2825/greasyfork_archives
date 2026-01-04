// ==UserScript==
// @name         Play Store Scrape
// @namespace    http://stab.ai/
// @license      MIT
// @version      0.2.6
// @description  Scrape a Play Store app page for reviews
// @author       Shawn Tabai
// @match        https://play.google.com/store/apps/details?*showAllReviews=true
// @icon         https://www.gstatic.com/android/market_images/web/favicon_v2.ico
// @run-at       context-menu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441104/Play%20Store%20Scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/441104/Play%20Store%20Scrape.meta.js
// ==/UserScript==

/* jshint esversion:8 */
 
(function() {
  'use strict';

  class PlayStoreReviewScraper {
      constructor(reviewListDom, maxReviews) {
          this.reviewListDom = reviewListDom;
          this.maxReviews = maxReviews;
          this.reviewCount = 0;
          this.lastReviewCount = 0;
          this.failures = 0;
          this.scraping = false;
          this.headersWritten = false;
      }
      async start() {
          if (this.scraping) {
              return 'aborted';
          }
          this.scraping = true;
          let writer;
          try {
              const newFile = await window.showSaveFilePicker({
                  types: [{
                      description: 'Comma-separated values file',
                      accept: { 'text/csv': ['.csv'] },
                  }],
              });
              const writable = await newFile.createWritable();
              writer = writable.getWriter();
              return await new Promise((resolve, reject) => {
                  this.scrapeReviews(writer, resolve, reject);
              });
          }
          finally {
              if (writer != null) {
                  await writer.close();
              }
          }
      }
      stop() {
          this.scraping = false;
      }
      async scrapeReviews(writer, resolve, reject) {
          var _a, _b, _c, _d, _e;
          const newReviewCount = this.reviewCount;
          if (newReviewCount >= this.lastReviewCount + 20) {
              this.lastReviewCount = newReviewCount;
              console.log(newReviewCount);
          }
          if (this.reviewCount >= this.maxReviews) {
              console.log('Yay! I reached my goal!');
              this.scraping = false;
              resolve('max_success');
              return;
          }
          else if (!this.scraping) {
              console.log('Scraping canceled!');
              resolve('canceled');
              return;
          }
          if (this.reviewListDom.firstElementChild != null && this.reviewListDom.firstElementChild.getAttribute('jsmodel') === 'y8Aajc') {
              const reviewDom = this.reviewListDom.firstElementChild;
              const reviewText = reviewDom.querySelector('[jsname=fbQN7e]').textContent || reviewDom.querySelector('[jsname=bN97Pc]').textContent || '';
              const review = {
                  id: (_e = reviewDom.getAttribute('jsdata')) !== null && _e !== void 0 ? _e : '',
                  author: (_a = reviewDom.querySelector('.X43Kjb').textContent) !== null && _a !== void 0 ? _a : '',
                  stars: Number(((_b = reviewDom.querySelector('.pf5lIe [role=img]').ariaLabel) !== null && _b !== void 0 ? _b : '').substring(6, 7)),
                  date: (_c = reviewDom.querySelector('.p2TkOb').textContent) !== null && _c !== void 0 ? _c : '',
                  upvotes: Number(reviewDom.querySelector('.jUL89d.y92BAb').textContent),
                  fullReview: reviewText.trim().replace(/\s+/g, ' '),
              };
              reviewDom.remove();
              if (!this.headersWritten) {
                  this.headersWritten = true;
                  await writer.write(csvHeader(review));
              }
              await writer.write(csvRecord(review));
              this.failures = 0;
              this.reviewCount++;
          }
          else if (++this.failures > 1000) {
              console.log('Seems done. I give up!');
              resolve('success');
              return;
          } else if (this.failures > 0 && this.failures % 100 === 0) {
              const num = Math.floor(this.failures / 100);
              console.log(`Pausing to wait for more (${num}/10)...`);
          }
          if (this.failures <= 100) { 
            window.scrollTo(0, document.body.scrollHeight);
          }
          const button = document.querySelector('.CwaK9 .RveJvd.snByac');
          if (button != null) {
              button.click();
          }
          setTimeout(() => this.scrapeReviews(writer, resolve, reject), 10);
      }
  }
  async function scrapePlayStore(doc) {
      const reviewListDom = doc.querySelector('[jsname=fk8dgd]');
      if (reviewListDom == null) {
          alert('I can\'t find the review list!');
      }
      const maxReviews = Number(prompt('How many reviews should I scrape?'));
      const scraper = new PlayStoreReviewScraper(reviewListDom, maxReviews);
      const result = await scraper.start();
      alert(`Scrape complete with result of ${result}`);
  }
  function csvHeader(obj) {
      const values = [];
      for (const propName of Object.getOwnPropertyNames(obj)) {
          values.push(csvValue(propName));
      }
      return values.join(',') + '\n';
  }
  function csvRecord(obj) {
      const values = [];
      for (const propName of Object.getOwnPropertyNames(obj)) {
          const value = obj[propName];
          values.push(csvValue(value));
      }
      return values.join(',') + '\n';
  }
  function csvValue(value) {
      if (typeof value === 'number') {
          return String(value);
      }
      const str = String(value).replace(/\"/g, '""');
      return '"' + str + '"';
  }
  scrapePlayStore(document);
})();