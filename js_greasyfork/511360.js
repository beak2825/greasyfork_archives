// ==UserScript==
// @name        Misskey Cat Paradise
// @namespace   https://fuwa.dev/
// @version     0.1
// @description Nyaaaaaaa
// @author      @fuwa2003@misskey.io
// @match       https://misskey.io/*
// @downloadURL https://update.greasyfork.org/scripts/511360/Misskey%20Cat%20Paradise.user.js
// @updateURL https://update.greasyfork.org/scripts/511360/Misskey%20Cat%20Paradise.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const observerConfig = {
    childList: true,
    subtree: true
  };

  function observerCallback(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const el = document.querySelectorAll('.x6tH3'); // Avatar
        el.forEach(e => {
          if (e.classList.contains('xyRmg')) return;
          e.classList.add('xyRmg');
          const ears = document.createElement('div');
          ears.classList.add('xbyxl');
          ears.innerHTML = '<div class="xhUxx"></div><div class="xudJZ"></div>';
          e.appendChild(ears);
        });
      }
    }
  }

  const observer = new MutationObserver(observerCallback);
  observer.observe(document.body, observerConfig);
})();
