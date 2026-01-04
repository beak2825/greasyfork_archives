// ==UserScript==
// @name         nHentai Spam Cleaner
// @namespace    http://silentspud.com/
// @version      1.1
// @description  Removes non standard characters from nHentai comments
// @author       Silent UwU
// @match        https://nhentai.net/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416644/nHentai%20Spam%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/416644/nHentai%20Spam%20Cleaner.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (!document.getElementById('comment-container')) return false;

  // Time in milliseconds between hitting the bottom of the page and murdering this script
  // If it takes more than a second to load the comments for you, increase this
  const killPause = 1000;

  const cleaner = new MutationObserver((mutationList, cleaner) => {
    for (const mutation of mutationList) {
      if (mutation.type == 'childList') {
        mutation.addedNodes.forEach(el => {
          if (typeof el == 'object' && el.innerHTML) {
            el.innerHTML = el.innerHTML.replace(/[\u0080-\uFFFF]/g, '');
            // Dirty fix for breaking nHentai's lazy loader
            if (el.querySelector('img[data-src]')) el.querySelector('img[data-src]').src = el.querySelector('img[data-src]').dataset.src;
          }
        });
      }
    }
  });
  cleaner.observe(document.getElementById('comment-container'), { childList: true, subtree: true });

  const killMe = () => {
    if (!(document.scrollingElement.scrollHeight - window.innerHeight - document.scrollingElement.scrollTop > 0.1 * window.innerHeight)) {
      window.setTimeout(() => cleaner.disconnect(), killPause);
      window.removeEventListener('scroll', killMe);
    }
  };
  window.addEventListener('scroll', killMe);
  killMe();
})();