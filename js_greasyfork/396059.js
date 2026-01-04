// ==UserScript==
// @name         Hide block messages on discord
// @namespace    https://greasyfork.org/en/users/2205
// @version      0.3
// @description  Hide blocked messages completely
// @author       Ryzhehvost
// @license      Apache-2.0
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396059/Hide%20block%20messages%20on%20discord.user.js
// @updateURL https://update.greasyfork.org/scripts/396059/Hide%20block%20messages%20on%20discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockedlist = document.querySelectorAll("div[class*='blockedSystemMessage']");
    blockedlist.forEach(elem=>(elem.parentElement.parentElement.style.display="none"));

    let mutationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach( function(currentValue, currentIndex, listObj) {
              if (currentValue.nodeType == Node.ELEMENT_NODE) {
                  let blockedlist = currentValue.querySelectorAll("div[class*='blockedSystemMessage']");
                  blockedlist.forEach(elem=>(elem.parentElement.parentElement.style.display="none"));
              }
          });
      });
  });
  mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
  });
})();