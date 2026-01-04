// ==UserScript==
// @name           Block/Hide Words
// @namespace      https://github.com/AbdurazaaqMohammed
// @version        1.0
// @author         Abdurazaaq Mohammed
// @description    Block/hide specified words from appearing on webpages
// @match          https://*.*/*
// @match          http://*.*/*
// @homepage       https://github.com/AbdurazaaqMohammed/userscripts
// @license        The Unlicense
// @supportURL     https://github.com/AbdurazaaqMohammed/userscripts/issues
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/500148/BlockHide%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/500148/BlockHide%20Words.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // List of words to be blocked
  const blockedWords = ["word1", "word2", "word3"]; // You can add as many words as you want. Just ensure they are inside quotes ("") and separateed by commas (,).

  function replaceBlockedWords(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.nodeValue;
      blockedWords.forEach(word => { text = text.replaceAll(word, ''); });
       // You can type anything you want the words to be replaced with inside the quote.
       // If you want to replace different sets of words with different words just create another list (copy and paste the const blockedWords line) and copy and paste the blockedWords.forEach line below the existing one in this function replacing both blockedWords with whatever name you want.
      node.nodeValue = text;
    } else {
      node.childNodes.forEach(replaceBlockedWords);
    }
  }


  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => replaceBlockedWords(node));
    });
  });

  const intervalId = setInterval(function() { // make sure it loads, when you do document-start sometimes it doesn't load
    if(document.body.childNodes) {
      document.body.childNodes.forEach(replaceBlockedWords);
      observer.observe(document.body, { childList: true, subtree: true });
      clearInterval(intervalId);
    }
  }, 100);
})();