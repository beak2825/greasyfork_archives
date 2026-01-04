// ==UserScript==
// @name         PERPLEXITY-FULL-SCREEN
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  通过 MutationObserver 自动删除 Perplexity.ai 页面中动态加载的image所在的元素，扩大chat所在的元素
// @author       liuweiqing
// @match        https://www.perplexity.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516259/PERPLEXITY-FULL-SCREEN.user.js
// @updateURL https://update.greasyfork.org/scripts/516259/PERPLEXITY-FULL-SCREEN.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const imageColumn =
            node.querySelector(".col-span-4") ||
            (node.classList && node.classList.contains("col-span-4")
              ? node
              : null);
          const chatElement = document.querySelector(".col-span-8");
          if (imageColumn) {
            imageColumn.remove();
          }
          if (chatElement) {
            chatElement.classList.remove("col-span-8");
            chatElement.classList.add("col-span-12");
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
