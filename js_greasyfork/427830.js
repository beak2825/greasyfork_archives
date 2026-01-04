// ==UserScript==
// @name         twitter-topic-remover
// @namespace    twitter-topic-remover
// @version      0.3
// @description  TampermonkeyでTwitterのタイムラインからトピックを消します。
// @author       meguru
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427830/twitter-topic-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/427830/twitter-topic-remover.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (function () {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };
    const topicIcon =
      'M12 1.75c-5.11 0-9.25 4.14-9.25 9.25 0 4.77 3.61 8.7 8.25 9.2v2.96l1.15-.17c1.88-.29 4.11-1.56 5.87-3.5 1.79-1.96 3.17-4.69 3.23-7.97.09-5.54-4.14-9.77-9.25-9.77zM13 14H9v-2h4v2zm2-4H9V8h6v2z';
    const closeIcon =
      'M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z';
    const observer = new MutationObserver(function () {
      const articles = document.querySelectorAll('article[tabindex="0"]');
      for (let i = 0; i < articles.length; i++) {
        let flagTopicIcon = false;
        let flagCloseIcon = false;
        const icons = articles[i].getElementsByTagName('path');
        for (let j = 0; j < icons.length; j++) {
          if (icons[j].getAttribute('d') === topicIcon) {
            flagTopicIcon = true;
          }
          if (icons[j].getAttribute('d') === closeIcon) {
            flagCloseIcon = true;
          }
        }
        if (flagTopicIcon && flagTopicIcon) {
          articles[i].style.display = 'none';
          // articles[i].style.backgroundColor = 'red';
        }
      }
    });
    observer.observe(document.body, config);
  })();
})();
