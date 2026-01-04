// ==UserScript==
// @name Блокировщик рекламы на Dzen
// @namespace http://tampermonkey.net/
// @version 0.1
// @description ru: Блокирует рекламу на сайте Dzen
// @author Your Name
// @match https://dzen.ru/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=dzen.ru
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474028/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%BD%D0%B0%20Dzen.user.js
// @updateURL https://update.greasyfork.org/scripts/474028/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%BD%D0%B0%20Dzen.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function hideNonAdArticles() {
    const articles = document.querySelectorAll('.card-wrapper');

    articles.forEach(article => {
      if (!article.querySelector('.card-top-ad-info__ad') // проверка на наличие метки "Реклама"
        && !article.querySelector('.card-rtb-label-view')) { // проверка на наличие метки "Реклама"
        article.style.display = 'none';
      }
    });
  }

  hideNonAdArticles();

  new MutationObserver(hideNonAdArticles)
    .observe(document.body, {
      childList: true,
      subtree: true
    });
})();