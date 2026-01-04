// ==UserScript==
// @name         Highlights Active ChatGPT Conversation Title
// @namespace    violentmonkey.github.io
// @version      1.1
// @description  Underlines the currently active conversation title and scrolls it into view
// @author       Bui Quoc Dung
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541877/Highlights%20Active%20ChatGPT%20Conversation%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/541877/Highlights%20Active%20ChatGPT%20Conversation%20Title.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let hasScrolledToActive = false;  

  function updateUnderline() {
    const currentPath = location.pathname;
    const links = document.querySelectorAll('a.group.__menu-item');

    links.forEach(link => {
      const href = link.getAttribute('href');
      const span = link.querySelector('span');

      if (span) {
        if (href === currentPath) {
          span.style.textDecoration = 'underline';
          span.style.fontWeight = 'bold';


          if (!hasScrolledToActive) {
            hasScrolledToActive = true;
            setTimeout(() => {
              link.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }
        } else {
          span.style.textDecoration = '';
          span.style.fontWeight = '';
        }
      }
    });
  }

  window.addEventListener('popstate', () => {
    hasScrolledToActive = false;
    updateUnderline();
  });

  window.addEventListener('pushState', () => {
    hasScrolledToActive = false;
    updateUnderline();
  });

  window.addEventListener('replaceState', () => {
    hasScrolledToActive = false;
    updateUnderline();
  });

  updateUnderline();

  const observer = new MutationObserver(updateUnderline);
  observer.observe(document.body, { childList: true, subtree: true });

  const origPushState = history.pushState;
  history.pushState = function () {
    origPushState.apply(this, arguments);
    hasScrolledToActive = false;
    updateUnderline();
  };

  const origReplaceState = history.replaceState;
  history.replaceState = function () {
    origReplaceState.apply(this, arguments);
    hasScrolledToActive = false;
    updateUnderline();
  };
})();

