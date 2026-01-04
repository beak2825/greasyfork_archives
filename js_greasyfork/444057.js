// ==UserScript==
// @name         Coda.io - Scroll Current Page Into View
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make it possible to quickly find the current document in the tree view on Coda.io
// @author       Paul Wheeler
// @license      CC0
// @match        https://coda.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coda.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444057/Codaio%20-%20Scroll%20Current%20Page%20Into%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/444057/Codaio%20-%20Scroll%20Current%20Page%20Into%20View.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function scrollCurrentPageIntoView() {
    let pageListDiv = [...document.getElementsByTagName('div')].filter(d => d.getAttribute('data-coda-ui-id') === 'page-list')[0];
    let slug = window.location.href.split('/').slice(-1)[0].replace(/#.*$/, '')
    let pageLink = [...pageListDiv.getElementsByTagName('a')].filter(a => a.href.split('/').slice(-1)[0] === slug)[0];
    pageLink.scrollIntoView();
  }

  function maybeInjectScrollIntoViewButton(mutationsList, observer) {
    // Inject the scroll into view button if it doesn't exist yet
    if (!document.getElementById('scrollCurrentIntoViewBtn')) {
      // Check if the page header is loaded
      let addCoverBtn = [...document.getElementsByTagName('span')].filter(d => d.getAttribute('data-coda-ui-id') === 'page-header-add-cover')[0];
      if (addCoverBtn) {
        let headerButtonContainer = addCoverBtn.parentElement;
        let btn = document.createElement('span');
        btn.id = 'scrollCurrentIntoViewBtn';
        btn.className = addCoverBtn.className;
        btn.innerText = '↕️ Scroll Into View';
        btn.addEventListener('click', scrollCurrentPageIntoView);
        headerButtonContainer.appendChild(btn);
      }
    }
  };

  const observer = new MutationObserver(maybeInjectScrollIntoViewButton);
  observer.observe(document.body, { attributes: false, childList: true, subtree: true });
})();