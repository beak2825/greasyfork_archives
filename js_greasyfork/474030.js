// ==UserScript==
// @name Показывать только рекламу на Дзен
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Скрывает все нерекламные статьи на dzen.ru.
// @author Your Name
// @match https://dzen.ru/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=dzen.ru
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474030/%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D1%8B%D0%B2%D0%B0%D1%82%D1%8C%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%83%20%D0%BD%D0%B0%20%D0%94%D0%B7%D0%B5%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/474030/%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D1%8B%D0%B2%D0%B0%D1%82%D1%8C%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%83%20%D0%BD%D0%B0%20%D0%94%D0%B7%D0%B5%D0%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function hideAdArticles() {
    const articles = document.querySelectorAll('.card-wrapper');

    articles.forEach(article => {
      if (article.querySelector('.card-top-ad-info__ad') // проверка на наличие метки "Реклама"
        || article.querySelector('.card-rtb-label-view')) { // проверка на наличие метки "Реклама"
        article.style.display = 'none';
      }
    });
  }

  hideAdArticles();

  new MutationObserver(hideAdArticles)
    .observe(document.body, {
      childList: true,
      subtree: true
    });
})();