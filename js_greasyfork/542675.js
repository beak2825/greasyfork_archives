// ==UserScript==
// @name         No More Search Links in Reddit Comments
// @namespace    https://greasyfork.org/en/users/971411-xcloudx01
// @version      1.1
// @description  Strips Reddit-injected comment search links and spyglass icons, but leaves user-added links untouched.
// @author       xcloudx01
// @match        https://www.reddit.com/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542675/No%20More%20Search%20Links%20in%20Reddit%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/542675/No%20More%20Search%20Links%20in%20Reddit%20Comments.meta.js
// ==/UserScript==

(() => {
  /**
   * Remove a Reddit-injected auto-search link, preserving text only.
   * @param {HTMLAnchorElement} node
   */
  function stripSearchInjection(node) {
    if (!node || node.tagName !== 'A') return;

    const textOnly = Array.from(node.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    node.replaceWith(document.createTextNode(textOnly));
    console.log('[NoMoreSearchLinks] Removed:', textOnly);
  }

  /**
   * Scan for Reddit auto-injected comment links marked by the spyglass icon.
   * @param {ParentNode} root
   */
  function cleanse(root) {
    const injectedSearchLinks = root.querySelectorAll(
      'a[href^="/search/"] svg[icon-name="search-outline"]'
    );

    injectedSearchLinks.forEach(svg => {
      const anchor = svg.closest('a[href^="/search/"]');
      if (anchor) stripSearchInjection(anchor);
    });
  }

  function init() {
    cleanse(document);

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            cleanse(node);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
