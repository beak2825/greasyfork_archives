// ==UserScript==
// @name         Unlock Apollo Engine
// @version      0.2
// @description Unlock "Client awareness" and "Performance metrics" features of https://engine.apollographql.com/
// @match        https://*.apollographql.com/*
// @grant        none
// @namespace https://greasyfork.org/users/340285
// @downloadURL https://update.greasyfork.org/scripts/389416/Unlock%20Apollo%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/389416/Unlock%20Apollo%20Engine.meta.js
// ==/UserScript==

(function() {
  var observer = new MutationObserver(init);
  observer.observe(document.body, {
    'childList': true,
    'subtree': true
  });

  function init() {
    const $blocker = document.querySelector('.tw-blocker');

    if ($blocker) {
      $blocker.remove()
    }
  }
})();