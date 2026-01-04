// ==UserScript==
// @name         Zed.City Canadian Translation Mod
// @namespace    zed.city.canuckifier
// @version      1.1
// @description  Adds “eh” to dialog and replaces Zed City logos with a maple leaf 🍁
// @match        *://zed.city/*
// @match        *://*.zed.city/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545777/ZedCity%20Canadian%20Translation%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/545777/ZedCity%20Canadian%20Translation%20Mod.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const LEAF_CHAR = "🍁";
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "CANVAS", "SVG", "MATH"]);
  const processed = new WeakSet();

  function ehifyText(text) {
    if (!text || !text.trim()) return text;
    // add " eh" after terminal punctuation
    let out = text.replace(/([.!?])(\s|$)/g, `$1 eh$2`);
    // add at end if no punctuation and not already ending with "eh"
    if (!/\beh\s*$/.test(out) && !/[.!?]\s*$/.test(out)) {
      out += " eh";
    }
    return out;
  }

  function walkAndEhify(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (processed.has(node)) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p || SKIP_TAGS.has(p.tagName) || p.isContentEditable) return NodeFilter.FILTER_REJECT;
        if (["INPUT", "TEXTAREA", "BUTTON", "SELECT", "OPTION"].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        const t = node.nodeValue;
        if (!t || !t.trim()) return NodeFilter.FILTER_REJECT;
        if (t.length > 3000) return NodeFilter.FILTER_REJECT; // avoid huge chunks
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      n.nodeValue = ehifyText(n.nodeValue);
      processed.add(n);
    }
  }

  function mapleifyLogos(root = document) {
    const logoish = root.querySelectorAll([
      '[id*="logo" i]',
      '[class*="logo" i]',
      '[aria-label*="logo" i]',
      '[title*="logo" i]',
      'img[src*="logo" i]',
      'img[alt*="logo" i]',
    ].join(","));

    logoish.forEach((el) => {
      if (el.dataset.mapleified === "1") return;
      if (el.tagName === "IMG") {
        el.alt = "Maple Leaf Logo";
        el.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><text x="0" y="35" font-size="35">🍁</text></svg>`);
      } else {
        el.textContent = LEAF_CHAR;
      }
      el.dataset.mapleified = "1";
    });
  }

  function run(root = document) {
    walkAndEhify(root);
    mapleifyLogos(root);
  }

  // Initial run
  run();

  // Light mutation observer (throttled)
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        run();
        scheduled = false;
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
