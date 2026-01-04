// ==UserScript==
// @name         Reload on YouTube Error
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Reload the page if a YouTube adblock error occurs
// @author       TallTacoTristan
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504716/Reload%20on%20YouTube%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/504716/Reload%20on%20YouTube%20Error.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const observer = new MutationObserver(() => {
    const errorElement = document.querySelector('.ytp-error');
    if (errorElement && errorElement.style.display!== 'none') {
      window.location.reload();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();