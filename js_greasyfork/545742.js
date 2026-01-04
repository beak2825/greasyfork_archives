// ==UserScript==
// @name         Zed.city — Multiply All Numbers by 1000
// @namespace    zed.city.tools
// @version      1.0
// @description  Multiplies every visible number on zed.city and its subdomains by 1000
// @match        http*://zed.city/*
// @match        http*://*.zed.city/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545742/Zedcity%20%E2%80%94%20Multiply%20All%20Numbers%20by%201000.user.js
// @updateURL https://update.greasyfork.org/scripts/545742/Zedcity%20%E2%80%94%20Multiply%20All%20Numbers%20by%201000.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Tags we never touch
  const SKIP_TAGS = new Set([
    'SCRIPT','STYLE','NOSCRIPT','IFRAME','OBJECT',
    'TEXTAREA','INPUT','SELECT','BUTTON','SVG','CANVAS','CODE','PRE'
  ]);

  // Mark text nodes we've processed so we don't multiply again
  const DONE = Symbol('zed-multiplied');
  const processed = new WeakSet();

  // Basic helpers
  function isEditable(node) {
    if (!node) return false;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
    if (!(node instanceof Element)) return false;
    if (node.closest('[contenteditable=""], [contenteditable="true"]')) return true;
    if (node.closest('input, textarea')) return true;
    return false;
  }

  function shouldSkipNode(node) {
    if (node.nodeType !== Node.TEXT_NODE) return true;
    const p = node.parentNode;
    if (!(p instanceof Element)) return true;
    if (SKIP_TAGS.has(p.tagName)) return true;
    if (isEditable(p)) return true;
    // allow opt-out via attribute on any ancestor: data-no-thousand
    if (p.closest('[data-no-thousand]')) return true;
    return false;
  }

  // Detect simple number forms and preserve formatting
  // Handles:
  //  - 123
  //  - 1,234  or 1,234.56
  //  - 123.45
  //  - 1 234 (thin space / space grouped) — we normalize/keep spaces
  // EU-style (1.234,56) is handled best-effort.
  const numberPattern = /(?<![\w.-])(?:\d{1,3}(?:[,\u00A0\u202F ]\d{3})+|\d+)(?:[.,]\d+)?(?![\w.-])/g;

  // Insert thousands separators with given group char (comma by default)
  function formatThousands(xStr, groupChar) {
    const parts = xStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, groupChar);
    return parts.join('.');
  }

  // Best-effort formatter preserving original separators/decimals
  function formatLike(original, value) {
    // Normalize: work with absolute string & sign separately
    const isNeg = value < 0;
    let abs = Math.abs(value);

    // Decide decimal separator in original
    // If original contains both '.' and ',', assume the rightmost is decimal
    const lastDot = original.lastIndexOf('.');
    const lastComma = original.lastIndexOf(',');
    let decSep = null;
    if (lastDot === -1 && lastComma === -1) {
      decSep = null;
    } else if (lastDot > lastComma) {
      decSep = '.';
    } else {
      decSep = ',';
    }

    // Count decimal digits in original (if any)
    let origDecimals = 0;
    if (decSep) {
      const idx = original.lastIndexOf(decSep);
      if (idx !== -1) {
        origDecimals = original.length - idx - 1;
      }
    }

    // Grouping character from original (prefer comma or narrow space if seen)
    let groupChar = ',';
    const hasSpGroup = /(?:\d[\u00A0\u202F ]\d{3})/.test(original);
    if (hasSpGroup) groupChar = original.match(/[\u00A0\u202F ]/)?.[0] || ' ';
    else if (/,/.test(original) && decSep !== ',') groupChar = ',';
    else if (/\./.test(original) && decSep !== '.') groupChar = '.';

    // Build numeric with desired decimals
    let numStr = abs.toFixed(origDecimals);

    // If EU-style decimal (comma), convert '.' decimal to ','
    if (decSep === ',') {
      numStr = numStr.replace('.', ',');
      // For grouping, temporarily swap to '.' to insert separators easily
      const tmp = numStr.replace(',', '.');
      numStr = formatThousands(tmp, '.').replace('.', ',');
      // Reinsert grouping (.) already applied
      return (isNeg ? '-' : '') + numStr;
    }

    // Default: '.' decimal, group with groupChar
    numStr = formatThousands(numStr, groupChar);
    return (isNeg ? '-' : '') + numStr;
  }

  function multiplyInText(text) {
    return text.replace(numberPattern, (match) => {
      // Normalize the matched number to parse
      let normalized = match.replace(/\u00A0|\u202F| /g, '');
      // If it's EU-style like 1.234,56 => replace thousands '.' then decimal ',' to '.'
      if (/[.,]/.test(normalized)) {
        const lastDot = normalized.lastIndexOf('.');
        const lastComma = normalized.lastIndexOf(',');
        if (lastComma > lastDot) {
          // Assume comma is decimal
          normalized = normalized.replace(/\./g, '').replace(',', '.');
        } else {
          // Assume dot is decimal; strip commas as group
          normalized = normalized.replace(/,/g, '');
        }
      } else {
        // No decimal separators, just strip spaces/nbspaces
        normalized = normalized.replace(/,/g, '');
      }

      let n = Number(normalized);
      if (!isFinite(n)) return match;
      n = n * 1000;

      return formatLike(match, n);
    });
  }

  function processTextNode(node) {
    if (processed.has(node)) return;
    if (shouldSkipNode(node)) return;

    const before = node.nodeValue;
    if (!before || !/\d/.test(before)) return;

    const after = multiplyInText(before);
    if (after !== before) {
      node.nodeValue = after;
      processed.add(node);
    }
  }

  function walk(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(n) {
          // Fast path: skip empty or digitless nodes
          return (n.nodeValue && /\d/.test(n.nodeValue)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );
    let node;
    while ((node = walker.nextNode())) {
      processTextNode(node);
    }
  }

  // Initial pass
  walk(document.body);

  // Observe changes for dynamically loaded content
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'characterData') {
        processTextNode(m.target);
      } else {
        for (const added of m.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) {
            processTextNode(added);
          } else if (added.nodeType === Node.ELEMENT_NODE) {
            if (!SKIP_TAGS.has(added.tagName)) walk(added);
          }
        }
      }
    }
  });

  mo.observe(document.documentElement || document.body, {
    childList: true,
    characterData: true,
    subtree: true
  });

  // Optional: expose a small toggle and a per-element opt-out attribute.
  // To prevent conversion in a specific region, add: data-no-thousand to that element.
})();
