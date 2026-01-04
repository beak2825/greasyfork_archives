// ==UserScript==
// @name         Amazon Video ASIN Display
// @namespace    nyuszika7h@gmail.com
// @version      0.3.3
// @description  Show ASINs for episodes and movies/seasons on Amazon Prime Video
// @author       nyuszika7h
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.primevideo.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497242/Amazon%20Video%20ASIN%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/497242/Amazon%20Video%20ASIN%20Display.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let style = document.createElement('style');
  let styleText = document.createTextNode(`
.x-episode-asin {
  margin: 0.5em 0;
  color: #ff0000;
}

.x-episode-asin2 {
  margin: 1.5em 0;
  grid-row-start: 2;
  grid-column-start: 2;
  color: #ff0000;
}

.x-page-asin {
  margin: 0.5em 0 1em 0;
  color: #ff0000;
}`);
  style.appendChild(styleText);
  document.head.appendChild(style);

  function addTitleAsin() {
    // Movie/series ASIN
    let asin = document.body.innerHTML.match(/"pageTitleId":"([^"]+)"/)[1];

    let asinEl = document.createElement('div');
    let text = document.createTextNode(asin);
    asinEl.className = 'x-page-asin';
    asinEl.appendChild(text);

    let after = document.querySelector('.dv-dp-node-synopsis, .av-synopsis');
    after.parentNode.insertBefore(asinEl, after.nextSibling);
  }


 function addEpisodeAsins() {
     // handles the new layout, only tested on amazon.com
     let inputs = document.querySelectorAll('#tab-content-episodes > div > ol > li > div > input')
     inputs.forEach(input => {
         let asin = input.id.replace(/^selector-/, '');

         let asinEle = document.createElement('div');
         asinEle.className = 'x-episode-asin2';
         asinEle.appendChild(document.createTextNode(asin));

         let epTitle = input.nextSibling;
         epTitle.parentNode.insertBefore(asinEle, epTitle.nextSibling);
     })
 }

  function addEpisodeAsinsLegacy() {
    // Episode ASINs
    let legacyContainer = '.js-node-episode-container > input, .avu-context-card > input';
    let newContainer = '#tab-content-episodes > div > ol > li > div > input';
    document.querySelectorAll(`${legacyContainer}, ${newContainer}`).forEach(el => {
      if (el.parentNode.querySelector('.x-episode-asin')) {
        // Already added ASIN
        return;
      }

      let asin = el.id.replace(/^(?:selector|av-episode-expand-toggle)-/, '');

      let asinEl = document.createElement('div');
      let text = document.createTextNode(asin);
      asinEl.className = 'x-episode-asin';
      asinEl.appendChild(text);

      let epTitle = el.parentNode.querySelector('[data-automation-id^="ep-title"]');

      epTitle.parentNode.insertBefore(asinEl, epTitle.nextSibling);
    });
  }

  setTimeout(addTitleAsin, 1000);
  setTimeout(addEpisodeAsins, 1000);

  new MutationObserver(function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      addEpisodeAsinsLegacy();
    }
  }).observe(document.querySelector('.DVWebNode-detail-btf-default-wrapper'), { childList: true, subtree: true });
}());