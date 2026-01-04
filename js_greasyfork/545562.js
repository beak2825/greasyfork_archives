// ==UserScript==
// @name         leetcode-cage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes editorial, solutions, discussion, topics, hints section on leetCode problem pages
// @author       Lovelin Dhoni J B
// @match        https://leetcode.com/problems/*
// @match        https://cn.leetcode.com/problems/*
// @match        https://leetcode.cn/problems/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545562/leetcode-cage.user.js
// @updateURL https://update.greasyfork.org/scripts/545562/leetcode-cage.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function containsTextRecursively(element, texts) {
    if (!element) return false;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
    );
    while (walker.nextNode()) {
      const nodeText = walker.currentNode.nodeValue.trim();
      if (texts.some((text) => nodeText.includes(text))) {
        return true;
      }
    }
    return false;
  }

  function cleanPage() {
    document
      .querySelectorAll(
        "div.flexlayout__tab_button.flexlayout__tab_button_top.flexlayout__tab_button--unselected",
        "div.flexlayout__tab_button.flexlayout__tab_button_top.flexlayout__tab_button--selected"
      )
      .forEach((div) => {
        const text = div.textContent.trim();
        if (text.includes("Solutions") || text.includes("Editorial")) {
          div.remove();
        }
      });

    const statsDivs = document.querySelectorAll("div.mt-6.flex.flex-col.gap-3");
    statsDivs.forEach((div) => {
      const keywords = [
        "Accepted",
        "Acceptance Rate",
        "Topics",
        "Companies",
        "Discussion",
      ];
      if (containsTextRecursively(div, keywords)) {
        div.remove();
      }
    });

    const tagDivs = document.querySelectorAll("div.flex.gap-1");
    tagDivs.forEach((div) => {
      const keywords = ["Topics", "Companies"];
      if (containsTextRecursively(div, keywords)) {
        div.remove();
      }
    });

    const problemListDivs = document.querySelectorAll(
      ".lc-md\\:flex.group.flex.max-w-\\[300px\\].items-center.overflow-hidden.rounded.hover\\:bg-fill-tertiary.dark\\:hover\\:bg-fill-tertiary"
    );
    problemListDivs.forEach((div) => {
      if (containsTextRecursively(div, ["Problem List"])) {
        div.remove();
      }
    });
  }

  cleanPage();

  const observer = new MutationObserver(cleanPage);
  observer.observe(document.body, { childList: true, subtree: true });
})();