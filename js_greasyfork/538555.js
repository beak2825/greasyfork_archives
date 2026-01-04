// ==UserScript==
// @name         Comic Curseifier
// @namespace    http://kapow.bam/
// @version      1.0
// @description  Replaces random words on webpages with comic-style curses like @#$%!&*
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/538555/Comic%20Curseifier.user.js
// @updateURL https://update.greasyfork.org/scripts/538555/Comic%20Curseifier.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CHANCE = 0.03; // 8% of words replaced
  const SYMBOLS = ['@', '#', '$', '%', '&', '*', '!', '?'];

  function generateComicCensor(length = 4) {
    let out = '';
    for (let i = 0; i < length; i++) {
      out += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }
    return out;
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const tag = node.parentNode?.tagName;
      return node.nodeValue.trim() &&
        tag &&
        !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(tag.toUpperCase())
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });

  let node;
  while ((node = walker.nextNode())) {
    const original = node.nodeValue;
    const words = original.split(/(\s+)/); // preserve spaces
    let changed = false;

    for (let i = 0; i < words.length; i++) {
      if (/\w{3,}/.test(words[i]) && Math.random() < CHANCE) {
        words[i] = generateComicCensor(Math.min(words[i].length, 6));
        changed = true;
      }
    }

    if (changed) {
      node.nodeValue = words.join('');
    }
  }

  console.log('🤬 Comic Curseifier activated.');
})();
