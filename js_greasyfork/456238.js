// ==UserScript==
// @name        BC: force default stylesheet
// @namespace   userscript1
// @match       https://*.bandcamp.com/*
// @grant       none
// @run-at      document-start
// @version     0.1.2
// @description -
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456238/BC%3A%20force%20default%20stylesheet.user.js
// @updateURL https://update.greasyfork.org/scripts/456238/BC%3A%20force%20default%20stylesheet.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const observer = new MutationObserver(() => {
    var css = document.querySelector('#custom-design-rules-style');
    if (css) {
      observer.disconnect();
      css.innerHTML = '';
      document.body.classList.remove('invertIconography');
    }
  });
  observer.observe(document, { childList: true, subtree: true });

})();