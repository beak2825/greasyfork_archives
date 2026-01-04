// ==UserScript==
// @name        YouTube Channels 'Latest' instead of 'For You'
// @description Script makes default channels video sorting to 'Latest' instead of 'For You'.
// @namespace   Tampermonkey Scripts
// @match       https://www.youtube.com/@*/videos
// @match       https://www.youtube.com/user/*/videos
// @match       https://www.youtube.com/channel/*/videos
// @grant       none
// @version     0.0.4
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/466721/YouTube%20Channels%20%27Latest%27%20instead%20of%20%27For%20You%27.user.js
// @updateURL https://update.greasyfork.org/scripts/466721/YouTube%20Channels%20%27Latest%27%20instead%20of%20%27For%20You%27.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const targetElementSelector = 'yt-formatted-string[title="Latest"]';

  function clickLatestWhenItAppears() {
    const targetElement = document.querySelector(targetElementSelector);
    if (targetElement) {
      targetElement.click();
      observer.disconnect();
    }
  }

  const observer = new MutationObserver(clickLatestWhenItAppears);
  const observerConfig = { childList: true, subtree: true };

  function setupObserver() {
    observer.observe(document.body, observerConfig);
  }

  function checkUrlChange() {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      setupObserver();
    }
  }

  let lastUrl = window.location.href;
  setupObserver();

  const urlChangeObserver = new MutationObserver(checkUrlChange);
  urlChangeObserver.observe(document.body, observerConfig);
})();