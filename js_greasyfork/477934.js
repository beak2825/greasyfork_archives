// ==UserScript==
// @name         Coinkeeper Currency Fix
// @version      0.1.0
// @description  Replaces unhandled curency symbols
// @license      MIT
// @author       VChet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinkeeper.me
// @namespace    Coinkeeper-Currency-Fix
// @match        https://coinkeeper.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477934/Coinkeeper%20Currency%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/477934/Coinkeeper%20Currency%20Fix.meta.js
// ==/UserScript==

(() => {
  const observer = new MutationObserver(mutationHandler);
  observer.observe(document, { childList: true, subtree: true });

  function mutationHandler(mutationRecords) {
    mutationRecords.forEach((mutation) => {
      if (mutation.type === "childList" && typeof mutation.addedNodes === "object" && mutation.addedNodes.length) {
        for (const node of mutation.addedNodes) { walk(node); }
      }
    });
  }

  function walk(node) {
    if (!node.nodeType) { return; }
    let child = null;
    let next = null;
    switch (node.nodeType) {
      case 1: // Element
      case 9: // Document
      case 11: // Document fragment
        child = node.firstChild;
        while (child) {
          next = child.nextSibling;
          walk(child);
          child = next;
        }
        break;
      case 3: // Text node
        replaceText(node);
        break;
    }
  }

  function replaceText(node) {
    const text = node.nodeValue;
    const replacedText = text.replace("Lari", "₾");
    node.nodeValue = replacedText;
  }
})();
