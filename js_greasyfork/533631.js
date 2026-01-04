// ==UserScript==
// @name        Blocki
// @namespace    https://github.com/jOaawd/
// @version      1.0
// @description  Block Instagram from registering that you've viewed stories
// @author       https://github.com/jOaawd/
// @match        *://www.instagram.com/*
// @grant        none
// @license      CC BY-NC 4.0 https://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/533631/Blocki.user.js
// @updateURL https://update.greasyfork.org/scripts/533631/Blocki.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const blockPattern = /PolarisAPIReelSeenMutation|PolarisStoriesV3SeenMutation/i;

  // XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function (body) {
    if (typeof body === 'string' && blockPattern.test(body)) {
      console.log('[Blocki] Blocked XHR story seen mutation:', body);
      return; // Block the request
    }
    return originalXHRSend.apply(this, arguments);
  };

  // Fetch
  const originalFetch = window.fetch;
  window.fetch = function () {
    const args = arguments;
    let bodyToCheck = '';

    try {
      const request = args[0];
      const options = args[1] || {};
      bodyToCheck = options.body || '';

      if (typeof bodyToCheck === 'string' && blockPattern.test(bodyToCheck)) {
        console.log('[Blocki] Blocked fetch story seen mutation:', bodyToCheck);
        return new Promise(() => {}); // Return a never resolving Promise to silently cancel
      }
    } catch (err) {
      console.warn('[Blocki] Error checking fetch body', err);
    }

    return originalFetch.apply(this, args);
  };

})();
