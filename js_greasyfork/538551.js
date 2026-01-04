// ==UserScript==
// @name         Mini Word Flipper
// @namespace    http://mirrorverse.wtf/
// @version      1.1
// @description  Flips random words horizontally or vertically
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538551/Mini%20Word%20Flipper.user.js
// @updateURL https://update.greasyfork.org/scripts/538551/Mini%20Word%20Flipper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const chance = 0.15; // 15% of words

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];

  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim() && node.parentNode) nodes.push(node);
  }

  for (const textNode of nodes) {
    const parent = textNode.parentNode;
    const parts = textNode.nodeValue.split(/(\s+)/);
    const frag = document.createDocumentFragment();

    for (const part of parts) {
      if (/\S/.test(part) && Math.random() < chance) {
        const span = document.createElement('span');
        span.textContent = part;
        span.style.display = 'inline-block';
        span.style.transform = Math.random() < 0.5 ? 'scaleX(-1)' : 'scaleY(-1)';
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    }

    parent.replaceChild(frag, textNode);
  }
})();
