// ==UserScript==
// @name         Amazon Video ASIN Display
// @namespace    nyuszika7h@gmail.com
// @version      0.2.4
// @description  Show ASINs for episodes and movies/seasons on Amazon Prime Video
// @author       nyuszika7h
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.primevideo.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410206/Amazon%20Video%20ASIN%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/410206/Amazon%20Video%20ASIN%20Display.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let style = document.createElement('style');
  let styleText = document.createTextNode(`
.x-episode-asin {
  margin: 0.5em 0;
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
      let asin = document.querySelector('body').innerHTML.match(/pageTypeId: "([^"]+)"/)[1];

      let asinEl = document.createElement('div');
      let text = document.createTextNode(asin);
      asinEl.className = 'x-page-asin';
      asinEl.appendChild(text);

      let after = document.querySelector('.dv-dp-node-synopsis, .av-synopsis');
      after.parentNode.insertBefore(asinEl, after.nextSibling);
  }

  function addEpisodeAsins() {
    // Episode ASINs
    document.querySelectorAll('.js-node-episode-container > input, .avu-context-card > input').forEach(el => {
      const parent = el.parentNode;

      if (parent.querySelector('.x-episode-asin')) {
        // Already added ASIN
        return;
      }

        debugger;

      let id = el.id.replace(/^(?:selector|av-episode-expand-toggle)-/, '');
      var re = new RegExp(id + '"[^ <>]*"catalogId":"([^"]+)"');
      let asin = document.querySelector('body').innerHTML.match(re)[1];

      let asinEl = document.createElement('div');
      let text = document.createTextNode(id + " " + asin);
      asinEl.className = 'x-episode-asin';
      asinEl.appendChild(text);

      parent.querySelector('.js-eplist-episode, .av-episode-playback, .js-ep-playback-wrapper').appendChild(asinEl);
    });
  }

  addTitleAsin();
  addEpisodeAsins();

  /*const epExpander = document.querySelector('[data-automation-id="ep-expander"]');
  if (epExpander) {
    epExpander.addEventListener('click', function () {
      setTimeout(addEpisodeAsins, 1000);
    });
  }*/

  new MutationObserver(function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      addEpisodeAsins();
    }
  }).observe(document.querySelector('.DVWebNode-detail-btf-wrapper'), { childList: true, subtree: true });
}());