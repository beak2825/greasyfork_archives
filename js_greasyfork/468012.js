// ==UserScript==
// @name         Heise Apple / Mac / IPhone News Remover
// @namespace    heise
// @version      0.3
// @description  Remove all Mac&I news from the heise.de frontpage and newsticker
// @author       synogen
// @match        https://www.heise.de/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468012/Heise%20Apple%20%20Mac%20%20IPhone%20News%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/468012/Heise%20Apple%20%20Mac%20%20IPhone%20News%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchSelector = 'span.theme-mac-and-i,div[title="Ein Beitrag von: Mac & i"]'; // script searches for this all instances of this and then searches through its parent elements
    let titleSelector = 'span[data-component="TeaserHeadline"],span[class="a-article-teaser__title-text"]'; // selector to find article headline among the parents
    let selectorToRemove = 'article'; // the first parent that matches this CSS selector gets hidden

    document.querySelectorAll(searchSelector).forEach(a => {
      let parent = a.parentElement;
      while (parent) {
          let title = '';
          if (!title) {
              let headline = parent.querySelector(titleSelector);
              if (headline) title = headline.innerHTML.trim();
          }
          if (parent.matches(selectorToRemove)) {
              parent.style.display = 'none';
              console.log('Removed article "' + title + '"');
              parent = null;
          } else {
              parent = parent.parentElement;
          }
      }
    });
})();