// ==UserScript==
// @name            Clean Breitbart
// @description     Cleans the UI, removes Disqus, and filters out sponsored articles.
// @version         0.6
// @namespace       https://github.com/sm18lr88
// @match           *://www.breitbart.com/*
// @run-at          document-start
// @grant           none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498272/Clean%20Breitbart.user.js
// @updateURL https://update.greasyfork.org/scripts/498272/Clean%20Breitbart.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const selectors = [
    '#menu-trending',
    '#HWI',
    '#SideW',
    '#menu-latest-news',
    '#FootW',
    'header > .bnn-social-share',
    '#rmoreabt',
    '#social-share-article-footer',
    '.category-politics.category-2024-election.has-post-thumbnail.type-post.post.post-27203413.the-article > footer',
    '#comments'
  ];

  const blockedScripts = [
    'https://connect.facebook.net/en_US/sdk.js',
    'https://www.instagram.com/accounts/',
    'https://breitbartproduction.disqus.com'
  ];

  function removeElements() {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.remove());
    });
  }

  function blockScripts() {
    const scriptObserver = new MutationObserver(() => {
      document.querySelectorAll('script').forEach(script => {
        if (blockedScripts.some(blocked => script.src.includes(blocked))) {
          script.remove();
        }
      });
    });

    scriptObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  function changeBackgroundColor() {
    const color = '#FFFFE0'; // Light soft yellow color
    document.body.style.backgroundColor = color;

    const elementsToColor = [
      'section#MainW',
      'div#ContainerW',
      'div.clear',
      '#app > div > div > div > article'
    ];

    elementsToColor.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.backgroundColor = color;
      }
    });
  }

  function removeSponsoredArticles() {
    const articleTitles = document.querySelectorAll('div.side-article-title');
    articleTitles.forEach(article => {
      const textContent = article.textContent.toLowerCase();
      if (textContent.includes('sponsored')) {
        article.parentElement.remove();
      }
    });
  }

  // Run script blocking as early as possible
  blockScripts();

  // Ensure the elements are removed and the background is changed after the DOM has fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
      removeElements();
      changeBackgroundColor();
      removeSponsoredArticles();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    removeElements();
    changeBackgroundColor();
    removeSponsoredArticles();
  });
})();
