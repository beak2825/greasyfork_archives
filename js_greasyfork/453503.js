// ==UserScript==
// @name         twitter-promotion-remover
// @namespace    twitter-promotion-remover
// @version      0.1.1
// @description  Twitterのタイムラインからプロモーションを消します。
// @author       meguru
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453503/twitter-promotion-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/453503/twitter-promotion-remover.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (function () {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };
    const promotionIcon =
      'M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z';
    const observer = new MutationObserver(function () {
      const articles = document.querySelectorAll('article[tabindex="0"]');
      for (let i = 0; i < articles.length; i++) {
        const icons = articles[i].getElementsByTagName('path');
        for (let j = 0; j < icons.length; j++) {
          if (icons[j].getAttribute('d') === promotionIcon) {
            articles[i].style.display = 'none';
            // articles[i].style.backgroundColor = 'red';
          }
        }
      }
    });
    observer.observe(document.body, config);
  })();
})();
