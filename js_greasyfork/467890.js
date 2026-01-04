// ==UserScript==
// @name           Block Google Analytics
// @namespace      Google Analytics
// @version        1.0.1
// @description       Block Google Analytics on all web sites.
// @description:ru    Блокирует Google Analytics на всех веб-страницах.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.google.com
// @author       Wizzergod
// @license MIT
// @match          *://*/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/467890/Block%20Google%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/467890/Block%20Google%20Analytics.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // Функция для замены оригинального метода отправки данных в Google Analytics
  function blockAnalytics() {
    if (typeof window.ga === 'function') {
      window.ga = function() {
        // Ничего не делать
      };
    }

    if (typeof window.gtag === 'function') {
      window.gtag = function() {
        // Ничего не делать
      };
    }

    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer = [];
    }
  }

  blockAnalytics();

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        blockAnalytics();
      }
    });
  });

  observer.observe(document, { childList: true, subtree: true });
})();
