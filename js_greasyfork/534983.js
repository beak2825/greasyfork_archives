// ==UserScript==
// @name         ChatGPT Remove In-Text Citations
// @namespace    https://chatgpt.com/
// @version      1.0
// @description  Hide and remove In-Text Citations from all ChatGPT responses.
// @author       groundcat
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534983/ChatGPT%20Remove%20In-Text%20Citations.user.js
// @updateURL https://update.greasyfork.org/scripts/534983/ChatGPT%20Remove%20In-Text%20Citations.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* Quick removal via CSS — avoids layout flashes */
  const style = document.createElement('style');
  style.textContent = `
    /* Hide any element that contains BOTH classes */
    .text-token-text-secondary.inline-flex {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  /* Defensive clean‑up — catches elements injected after page load */
  function scrub(root = document) {
    root.querySelectorAll('.text-token-text-secondary.inline-flex').forEach((node) => node.remove());
  }

  // Initial pass for anything already on screen
  scrub();

  // Observe DOM mutations so we stay ahead of streaming messages or edits
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (n.nodeType === 1) {
          // Only process element nodes
          scrub(n);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
