// ==UserScript==
// @name         Always Latest Tweets for Twitter
// @namespace    https://github.com/gslin/always-latest-tweets-for-twitter
// @version      0.20251222.0
// @description  Auto-switch to latest tweets for Twitter
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://x.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/395725/Always%20Latest%20Tweets%20for%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/395725/Always%20Latest%20Tweets%20for%20Twitter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let ob = new window.MutationObserver(ml => {
    // Only /home is processed.
    if (!document.location.pathname.match(/^\/home/)) {
      return;
    }

    // If it's already in "Following" timeline, uninstall the observer.
    if (document.querySelector('nav[role="navigation"] div[role="presentation"]:nth-child(2) div[role="tab"][aria-selected="true"]')) {
      console.debug('Already on following timeline.');
      ob.disconnect();
    }

    ml.forEach(el => {
      const tab = document.querySelector('nav[role="navigation"] div[role="presentation"]:nth-child(2) div[role="tab"][aria-selected="false"]');
      if (tab) {
        tab.click();
      }
    });
  });

  ob.observe(document, {
    childList: true,
    subtree: true,
  });
})();
