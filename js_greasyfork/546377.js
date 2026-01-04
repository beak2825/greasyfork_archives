// ==UserScript==
// @name         Catbox/Litterbox: Hide Cute Image + Auto Dark
// @namespace    https://example.user
// @version      1.0
// @license MIT
// @description  Hide the rotating "cute grill" image across Catbox/Litterbox; auto-toggle dark on main page if needed.
// @match        https://catbox.moe/*
// @match        https://litterbox.catbox.moe/*
// @run-at       document-start
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546377/CatboxLitterbox%3A%20Hide%20Cute%20Image%20%2B%20Auto%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/546377/CatboxLitterbox%3A%20Hide%20Cute%20Image%20%2B%20Auto%20Dark.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1) Nuke the image quickly with CSS (applies even before JS loads)
  const CSS = `
    /* Hide the rotating image container and any qts images */
    .image { display: none !important; visibility: hidden !important; }
    .image img { display: none !important; visibility: hidden !important; }
    img[src*="/pictures/qts/"] { display: none !important; visibility: hidden !important; }
  `;
  if (typeof GM_addStyle === 'function') {
    GM_addStyle(CSS);
  } else {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.documentElement.appendChild(style);
  }

  // 2) Defensive removal in case site JS injects/replaces elements
  function removeQtsBlocks(root = document) {
    root.querySelectorAll('img[src*="/pictures/qts/"]').forEach(el => el.remove());
    root.querySelectorAll('.image').forEach(el => el.remove());
  }

  // 3) Observe DOM for dynamically injected elements (e.g., from pic.js)
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (
          node.matches?.('img[src*="/pictures/qts/"], .image') ||
          node.querySelector?.('img[src*="/pictures/qts/"], .image')
        ) {
          removeQtsBlocks(document);
        }
      }
    }
  });

  // 4) Run when ready & start observing
  const onReady = fn => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    removeQtsBlocks();
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });

    // 5) Auto-click "Go Dark?" ONLY on the main page
    const isMain =
      location.pathname === '/' ||
      location.pathname === '/index.php';

    if (isMain) {
      const clickDarkIfNeeded = () => {
        const toggle = document.getElementById('changeTheme');
        if (toggle && /go\s*dark\?/i.test((toggle.textContent || '').trim())) {
          toggle.click();
        }
      };

      // Try immediately and after site scripts settle
      clickDarkIfNeeded();
      setTimeout(clickDarkIfNeeded, 500);
      setTimeout(clickDarkIfNeeded, 1500);

      // Also react if the toggle is injected/changed later
      new MutationObserver(() => clickDarkIfNeeded())
        .observe(document.body, { childList: true, subtree: true });
    }
  });
})();
