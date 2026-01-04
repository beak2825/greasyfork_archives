// ==UserScript==
// @name         Drawaria Ultimate Chaos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces all text and form values with random bad words on Drawaria
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529247/Drawaria%20Ultimate%20Chaos.user.js
// @updateURL https://update.greasyfork.org/scripts/529247/Drawaria%20Ultimate%20Chaos.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // List of bad words
  const badWords = [
    'fuck', 'shit', 'ass', 'dick', 'cunt', 'pussy', 'bitch', 'hell', 'damn', 'bastard',
    'cock', 'twat', 'stupid', 'spic', 'chink', 'retard', 'cuntface', 'fucktard',
    // Keep adding more offensive words, you disgusting human
  ];

  // Get a random bad word
  function getRandomBadWord() {
    return badWords[Math.floor(Math.random() * badWords.length)];
  }

  // Function to replace text and form values with bad words
  function replaceTextAndFormValues(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = getRandomBadWord();
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName.toLowerCase() === 'input' && node.getAttribute('type') !== 'submit') {
        node.setAttribute('value', getRandomBadWord());
        node.setAttribute('placeholder', getRandomBadWord());
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        replaceTextAndFormValues(node.childNodes[i]);
      }
    }
  }

  // MutationObserver to watch for dynamic content
  const observer = new MutationObserver(() => {
    replaceTextAndFormValues(document.body);
  });

  // Initial replacement
  replaceTextAndFormValues(document.body);

  // Start observing changes
  observer.observe(document.body, { childList: true, subtree: true });
})();