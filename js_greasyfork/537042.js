// ==UserScript==
// @name         Quick Reader for Pokepara
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove <p>&nbsp;</p> from specific blog area on pokepara.jp
// @author       Suniki
// @match        https://www.pokepara.jp/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/537042/Quick%20Reader%20for%20Pokepara.user.js
// @updateURL https://update.greasyfork.org/scripts/537042/Quick%20Reader%20for%20Pokepara.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const targetSelector = "#galblog div.wrap div.blog";

  const applyShrinkStyle = (p) => {
    if (p.textContent.trim() === "") {
      p.style.lineHeight = "5%";
    }
  };

  const processParagraphs = (container) => {
    const paragraphs = container.querySelectorAll("p, div, span");
    paragraphs.forEach(applyShrinkStyle);
  };

  const initObserver = (targetNode) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches("p") || node.matches("div") || node.matches("span")) {
              applyShrinkStyle(node);
            } else if (node.querySelectorAll) {
              processParagraphs(node);
            }
          }
        });
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });

    // 初期状態でも一度処理
    processParagraphs(targetNode);
  };

  const waitForTarget = () => {
    const el = document.querySelector(targetSelector);
    if (el) {
      initObserver(el);
    } else {
      // DOM にまだない場合は再試行
      const interval = setInterval(() => {
        const el = document.querySelector(targetSelector);
        if (el) {
          clearInterval(interval);
          initObserver(el);
        }
      }, 500);
    }
  };

  waitForTarget();
})();
