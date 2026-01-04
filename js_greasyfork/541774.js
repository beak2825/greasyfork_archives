// ==UserScript==
// @name         Grok SVG Width Fix (Dynamic)
// @description  Set width: 100% on parent SVG of specific path on dynamic updates
// @match        *://*.grok.com/*
// @version 0.0.1.20250706021735
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/541774/Grok%20SVG%20Width%20Fix%20%28Dynamic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541774/Grok%20SVG%20Width%20Fix%20%28Dynamic%29.meta.js
// ==/UserScript==

(function() {
  const applyFix = () => {
    const path = document.querySelector('path[d^="M76.4462"]');
    if (!path) return;
    const svg = path.closest('svg');
    if (svg) {
      svg.style.setProperty('width', '100%', 'important');
    }
  };

  const observer = new MutationObserver(() => applyFix());

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // In case it's already present at initial load
  applyFix();
})();
