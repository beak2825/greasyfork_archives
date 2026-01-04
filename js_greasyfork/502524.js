// ==UserScript==
// @name         PO18 Filter
// @description  Hide books in index search results based on specified keywords, authors, and tags.
// @version      1.0
// @author       null
// @match        https://www.po18.tw/findbooks/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1272411
// @downloadURL https://update.greasyfork.org/scripts/502524/PO18%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/502524/PO18%20Filter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const KEYWORDS = [
    /标题关键词1/i,
    /标题关键词2/i,
    /标题关键词3/i,
  ];
  const AUTHORS = [
    /作者关键词1/i,
    /作者关键词2/i,
    /作者关键词3/i,
  ];
  const TAGS = [
    /标签关键词1/i,
    /标签关键词2/i,
    /标签关键词3/i,
  ];

  function hideRowsByCriteria() {
    const rows = document.querySelectorAll(".row");
    rows.forEach((row) => {
      const textContent = row.textContent || row.innerText;
      const shouldHide =
        KEYWORDS.some((keyword) => keyword.test(textContent)) ||
        AUTHORS.some((author) => author.test(textContent)) ||
        TAGS.some((tag) => tag.test(textContent));

      if (shouldHide) {
        row.style.display = "none";
      }
    });
  }

  function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
          hideRowsByCriteria();
        }
      });
    });

    const config = { childList: true, subtree: true };
    const targetNode = document.querySelector("body");
    if (targetNode) {
      observer.observe(targetNode, config);
    } else {
      console.error("Failed to find the target node.");
    }
  }

  window.addEventListener("load", () => {
    hideRowsByCriteria();
    observeDOMChanges();
  });
})();
