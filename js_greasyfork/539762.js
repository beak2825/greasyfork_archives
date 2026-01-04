// ==UserScript==
// @name         Discord: Force Single‑Color Usernames (Disable gradient role colors)
// @namespace    https://greasyfork.org/en/scripts/539762-discord-force-single-color-usernames
// @version      1.0
// @description  Override gradient usernames so color‑2 always equals color‑1 on Discord Web. Hopefully obfuscation resistant.
// @author       Cragsand
// @match        https://*.discord.com/*
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/539762/Discord%3A%20Force%20Single%E2%80%91Color%20Usernames%20%28Disable%20gradient%20role%20colors%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539762/Discord%3A%20Force%20Single%E2%80%91Color%20Usernames%20%28Disable%20gradient%20role%20colors%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Given a <span style="--custom-gradient-color-1:…; --custom-gradient-color-2:…">,
  // force color‑2 to equal color‑1.
  function normalizeGradient(el) {
    // read color‑1
    const c1 = el.style.getPropertyValue('--custom-gradient-color-1');
    if (c1) {
      // overwrite color‑2
      el.style.setProperty('--custom-gradient-color-2', c1, 'important');
      // optionally also force color‑3 and glow to stay consistent:
      el.style.setProperty('--custom-gradient-color-3', c1, 'important');
    }
  }

  // Scan all existing elements once
  function scanAll() {
    document
      .querySelectorAll('[style*="--custom-gradient-color-2"]')
      .forEach(normalizeGradient);
  }

  // Watch for any new elements being added anywhere in the DOM:
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        // only elements
        if (!(node instanceof Element)) continue;
        // if it itself has the style, fix it
        if (node.hasAttribute('style') && node.getAttribute('style').includes('--custom-gradient-color-2')) {
          normalizeGradient(node);
        }
        // also scan its descendants
        node.querySelectorAll?.('[style*="--custom-gradient-color-2"]').forEach(normalizeGradient);
      }
    }
  });

  // start observing the document body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // initial pass
  scanAll();
})();
