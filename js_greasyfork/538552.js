// ==UserScript==
// @name         Zalgo Word Corruptor
// @namespace    http://scream.from/the.void
// @version      1.0
// @description  Replaces random words on a webpage with deranged Zalgo text
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538552/Zalgo%20Word%20Corruptor.user.js
// @updateURL https://update.greasyfork.org/scripts/538552/Zalgo%20Word%20Corruptor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Number of words to corrupt per page load (or set to a percentage)
  const NUM_WORDS_TO_ZALGO = 30;

  // Generate Zalgo text
  function zalgo(text) {
    const zalgo_up = [
      '\u030d', '\u030e', '\u0304', '\u0305',
      '\u033f', '\u0311', '\u0306', '\u0310',
      '\u0352', '\u0357', '\u0351', '\u0307',
      '\u0308', '\u030a', '\u0342', '\u0343',
      '\u0344', '\u034a', '\u034b', '\u034c',
      '\u0303', '\u0302', '\u030c', '\u0350',
      '\u0300', '\u0301', '\u030b', '\u030f',
      '\u0312', '\u0313', '\u0314', '\u033d',
      '\u0309', '\u0363', '\u0364', '\u0365',
      '\u0366', '\u0367', '\u0368', '\u0369',
      '\u036a', '\u036b', '\u036c', '\u036d',
      '\u036e', '\u036f', '\u033e', '\u035b',
      '\u0346', '\u031a'
    ];

    return text.split('').map(char => {
      let result = char;
      const count = Math.floor(Math.random() * 6) + 1;
      for (let i = 0; i < count; i++) {
        result += zalgo_up[Math.floor(Math.random() * zalgo_up.length)];
      }
      return result;
    }).join('');
  }

  // Text walker
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim().length > 0) {
      textNodes.push(node);
    }
  }

  // Shuffle utility
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffle(textNodes);

  let replaced = 0;
  for (const textNode of textNodes) {
    const words = textNode.nodeValue.split(/\b/);
    let changed = false;
    for (let i = 0; i < words.length; i++) {
      if (/^\w+$/.test(words[i]) && Math.random() < 0.2) { // ~20% chance per word
        words[i] = zalgo(words[i]);
        replaced++;
        changed = true;
        if (replaced >= NUM_WORDS_TO_ZALGO) break;
      }
    }
    if (changed) {
      const newNode = document.createTextNode(words.join(''));
      textNode.parentNode.replaceChild(newNode, textNode);
    }
    if (replaced >= NUM_WORDS_TO_ZALGO) break;
  }
})();
