// ==UserScript==
// @name         twitter-unrelated-remover
// @namespace    twitter-unrelated-remover
// @version      0.3
// @description  TampermonkeyでTwitterのタイムラインから「...がフォローしています」を消します。
// @author       meguru
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434321/twitter-unrelated-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/434321/twitter-unrelated-remover.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (function () {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };
    const unrelatedManIcon =
      'M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z';
    const observer = new MutationObserver(function () {
      const articles = document.querySelectorAll('article[tabindex="0"]');
      for (let i = 0; i < articles.length; i++) {
        const icons = articles[i].getElementsByTagName('path');
        for (let j = 0; j < icons.length; j++) {
          if (icons[j].getAttribute('d') === unrelatedManIcon) {
            articles[i].style.display = 'none';
            // articles[i].style.backgroundColor = 'red';
          }
        }
      }
    });
    observer.observe(document.body, config);
  })();
})();
