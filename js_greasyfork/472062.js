// ==UserScript==
// @name         Hide Mastodon posts that have a content warning
// @namespace    Mastodon
// @version      0.1
// @description  Versteckt Artikel-Tags mit einem Button mit der Klasse "spoiler-button__overlay"
// @license      MIT
// @match        https://norden.social/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472062/Hide%20Mastodon%20posts%20that%20have%20a%20content%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/472062/Hide%20Mastodon%20posts%20that%20have%20a%20content%20warning.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function hideSpoilers() {
    const articles = document.querySelectorAll('article'); // Alle <article>-Tags abrufen
    articles.forEach(article => {
      // check spoiler images
      const spoilerButtonImages = article.querySelector('button.spoiler-button__overlay');
      if (spoilerButtonImages) {
        // hide article
        article.style.display = 'none';
      } else {
        // check spoiler content
        const spoilerDiv = article.querySelector('div.status__content--with-spoiler');
        if (spoilerDiv) {
          // hide article
          article.style.display = 'none';
        }
      }
    });
  }

  // on page load
  hideSpoilers();

  // for dynamic changes
  const observer = new MutationObserver(hideSpoilers);
  observer.observe(document.body, { childList: true, subtree: true });
})();
