// ==UserScript==
// @name        deepseek style
// @description a
// @match       https://chat.deepseek.com/*
// @version 0.0.1.20250619205442
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/540053/deepseek%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/540053/deepseek%20style.meta.js
// ==/UserScript==

(function() {
  const targetDStart = "M27.501 8.46875C27.249";

  function modifyAncestorDivs() {
    const paths = document.querySelectorAll(`path[d^="${targetDStart}"]`);
    paths.forEach(path => {
      const svg = path.closest('svg');
      if (!svg) return;

      const innerDiv = svg.parentElement;
      if (!innerDiv) return;

      const outerDiv = innerDiv.parentElement;
      if (!outerDiv || outerDiv.__modified) return;

      // remove the inner <div> that contains the SVG
      innerDiv.remove();

      // unset padding-left on the outer <div>
      outerDiv.style.setProperty('padding-left', 'unset', 'important');
      outerDiv.__modified = true;
    });

    // apply padding: unset !important to all elements with class "scrollable"
    const scrollables = document.querySelectorAll('.scrollable');
    scrollables.forEach(el => {
      el.style.setProperty('padding', 'unset', 'important');
    });
  }

  document.addEventListener('DOMContentLoaded', modifyAncestorDivs);

  const observer = new MutationObserver(modifyAncestorDivs);
  observer.observe(document.body, { childList: true, subtree: true });
})();
