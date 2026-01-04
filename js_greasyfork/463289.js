// ==UserScript==
// @name         Remove video feed on Discord (Fork)
// @namespace    Remove video feed on Discord (Fork) Remove forced video feed from other users.
// @version      1
// @description  Remove forced video feed from other users.
// @license      Apache-2.0
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant        none
// @author       https://greasyfork.org/en/users/2205-ryzhehvost (original) https://greasyfork.org/en/users/895144-ed-frees (fork)
// @downloadURL https://update.greasyfork.org/scripts/463289/Remove%20video%20feed%20on%20Discord%20%28Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463289/Remove%20video%20feed%20on%20Discord%20%28Fork%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockedlist = document.querySelectorAll("div[class^='pictureInPicture']");
    blockedlist.forEach(elem=>(elem.remove()));

    let mutationObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach( function(currentValue, currentIndex, listObj) {
              if (currentValue.nodeType == Node.ELEMENT_NODE) {
                  let blockedlist = currentValue.querySelectorAll("div[class^='pictureInPicture']");
                  blockedlist.forEach(elem=>(elem.remove()));
              }
          });
      });
  });
  mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
  });
})();