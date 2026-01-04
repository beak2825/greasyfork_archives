// ==UserScript==
// @name         Hide youtube shorts & upcoming
// @namespace    https://gist.github.com/mawburn/b0ad0202ad4917b8f57b3a68fe51fb3e
// @version      1.6
// @description  Remove youtube shorts & upcoming from subscriptions (Only in grid view)
// @author       mawburn, danieloliveira117
// @match        https://*.youtube.com/feed/subscriptions
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468142/Hide%20youtube%20shorts%20%20upcoming.user.js
// @updateURL https://update.greasyfork.org/scripts/468142/Hide%20youtube%20shorts%20%20upcoming.meta.js
// ==/UserScript==

;(function () {
  'use strict';

  const selectors = ['SHORTS', 'UPCOMING']
    .map(o => `ytd-thumbnail-overlay-time-status-renderer[overlay-style="${o}"]`)
    .join(',');

  function removeShorts() {
    document.querySelectorAll(selectors).forEach(t => {
      if (t) {
        const elem = t.closest('ytd-rich-item-renderer');


        if (elem) {
          elem.remove();
        }
      }
    });
  }

  const observer = new MutationObserver(removeShorts);
  observer.observe(document.querySelector('#page-manager'), { childList: true, subtree: true });
})();