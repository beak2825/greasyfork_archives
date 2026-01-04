// ==UserScript==
// @name         Jira External Links Target _blank
// @namespace    http://free-side.net/tampermonkey
// @version      0.1
// @description  Makes all external links in Jira issues have target="_blank" so that they open in a new tab/window
// @author       Paul Wheeler
// @license      CC0
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444058/Jira%20External%20Links%20Target%20_blank.user.js
// @updateURL https://update.greasyfork.org/scripts/444058/Jira%20External%20Links%20Target%20_blank.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let mutationCount = 0;
  const checkForLinks = function(mutationsList, observer) {
    mutationCount++;

    // We could check the mutation list to see if it's relelvant, but... lazy
    const descriptionLinks = [...document.getElementsByClassName('ak-renderer-document')].flatMap(e => [...e.getElementsByTagName('a')]);
    for (const link of descriptionLinks) {
      if (link.target !== '_blank') {
        console.log(`[${mutationCount}] Updating target for link ${link.href}`);
        link.target = '_blank';
        link.addEventListener('click', e => {
          // prevent JavaScript event handlers from mucking things up
          e.stopPropagation();
          return false;
        });
      }
    }
  };

  const observer = new MutationObserver(checkForLinks);
  observer.observe(document.body, { attributes: false, childList: true, subtree: true });
})();