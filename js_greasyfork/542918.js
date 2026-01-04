// ==UserScript==
// @name         DeepSeek red chat message
// @match        https://chat.deepseek.com/*
// @description Highlights specific siblings of SVG paths on chat.deepseek.com
// @version 0.0.1.20250805124347
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/542918/DeepSeek%20red%20chat%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/542918/DeepSeek%20red%20chat%20message.meta.js
// ==/UserScript==

(function () {
  // Run once for already-rendered icons
  highlightExisting();

  // Observe new DOM additions
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          highlightIn(node);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Highlight matching <path> elements already on the page
  function highlightExisting() {
    const paths = document.querySelectorAll('path[d^="M11.712 2.79a1.854 1.854"]');
    for (const path of paths) {
      applyHighlight(path);
    }
  }

  // Highlight matching <path> elements in a newly added subtree
  function highlightIn(root) {
    const paths = root.querySelectorAll('path[d^="M11.712 2.79a1.854 1.854"]');
    for (const path of paths) {
      applyHighlight(path);
    }
  }

  // Traverse to 5th <div> ancestor, get its *previous sibling*, and style it
  function applyHighlight(pathEl) {
    let current = pathEl;

    // Go up through parentElements until we find 5 <div>s
    let divCount = 0;
    while (current && divCount < 5) {
      current = current.parentElement;
      if (!current) return;
      if (current.tagName === "DIV") {
        divCount++;
      }
    }

    if (!current) return;

    const previousSibling = current.previousElementSibling;
    if (previousSibling && previousSibling instanceof HTMLElement) {
      previousSibling.style.setProperty('background-color', 'red', 'important');
      previousSibling.style.setProperty('color', 'black', 'important');
    }
  }
})();
