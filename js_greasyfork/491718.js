// ==UserScript==
// @name         Reddit Search Image Tab Enhancer: Unblur and Remove Scrim
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Unblur and remove background scrim on new elements, including those in shadow DOMs, on Reddit search results
// @author       Devon Lark
// @match        https://www.reddit.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491718/Reddit%20Search%20Image%20Tab%20Enhancer%3A%20Unblur%20and%20Remove%20Scrim.user.js
// @updateURL https://update.greasyfork.org/scripts/491718/Reddit%20Search%20Image%20Tab%20Enhancer%3A%20Unblur%20and%20Remove%20Scrim.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function processElement(element) {
      if (element.tagName === 'SPAN' && element.getAttribute('style') === "filter:blur(40px);" && !element.dataset.processed) {
          element.style.filter = '';
          element.dataset.processed = 'true';
      }
      if (element.tagName === 'DIV' && element.getAttribute('class') === "absolute top-0 left-0 w-full h-full bg-scrim" && !element.dataset.processed) {
          element.remove();
          element.dataset.processed = 'true';
      }

      if (element.shadowRoot) {
          Array.from(element.shadowRoot.querySelectorAll('span:not([data-processed]), div:not([data-processed])'))
              .forEach(processElement);
      }
  }

  function processNewElements() {
      const elements = document.querySelectorAll('body *');
      elements.forEach(element => {
          processElement(element);
          if (element.shadowRoot) {
              Array.from(element.shadowRoot.querySelectorAll('span:not([data-processed]), div:not([data-processed])'))
                  .forEach(processElement);
          }
      });
  }

  const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
              processNewElements();
          }
      });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
