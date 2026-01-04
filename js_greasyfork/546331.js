// ==UserScript==
// @name         Bandwidth Unit Converter (bits → bytes)
// @namespace    spotlightforbugs.scripts.bandwidth
// @version      1.4
// @description  Converts Mbps, Gbps, Kbps into MB/s, GB/s, KB/s on webpages (optimized for speedtest.net, fast.com, ISP offers, etc.)
// @author       SpotlightForBugs
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546331/Bandwidth%20Unit%20Converter%20%28bits%20%E2%86%92%20bytes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546331/Bandwidth%20Unit%20Converter%20%28bits%20%E2%86%92%20bytes%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const conversions = {
    Kbps: { factor: 1 / 8, unit: "KB/s" },
    Mbps: { factor: 1 / 8, unit: "MB/s" },
    Gbps: { factor: 1 / 8, unit: "GB/s" },
    Tbps: { factor: 1 / 8, unit: "TB/s" },
    "kbit/s": { factor: 1 / 8, unit: "KB/s" },
    "Mbit/s": { factor: 1 / 8, unit: "MB/s" },
    "Gbit/s": { factor: 1 / 8, unit: "GB/s" },
  };

  const unitKeys = Object.keys(conversions);
  const regex = new RegExp(
    "(\\d+(?:\\.\\d+)?)\\s*(" + unitKeys.join("|") + ")",
    "gi"
  );

  function convertText(text) {
    return text.replace(regex, (match, value, unit) => {
      if (match.includes("(")) return match; // already converted
      const num = parseFloat(value);
      const { factor, unit: newUnit } = conversions[unit];
      const converted = (num * factor).toFixed(2);
      return `${match} (${converted} ${newUnit})`;
    });
  }

  function processNode(node) {
    if (!node) return;

    // Text node
    if (node.nodeType === 3 && !node.parentNode?.dataset.converted) {
      const newText = convertText(node.nodeValue);
      if (newText !== node.nodeValue) {
        node.nodeValue = newText;
        node.parentNode.dataset.converted = "true";
      }
    }

    // Element node with number + unit split
    if (node.nodeType === 1 && !node.dataset.converted) {
      const next = node.nextSibling;
      if (next && next.nodeType === 1) {
        const num = parseFloat(node.textContent.trim());
        const unitText = next.textContent.trim();
        if (!isNaN(num) && conversions[unitText]) {
          const { factor, unit } = conversions[unitText];
          const converted = (num * factor).toFixed(2);
          next.textContent = unitText + ` (${converted} ${unit})`;
          next.dataset.converted = "true";
        }
      }
    }
  }

  // Initial scan (only visible text nodes)
  function initialScan() {
    document.querySelectorAll("body *:not([data-converted])").forEach((el) => {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        processNode(el.childNodes[0]);
      }
    });
  }

  initialScan();

  // Mutation observer (optimized)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        processNode(mutation.target);
      } else if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          processNode(node);
          if (node.querySelectorAll) {
            node.querySelectorAll("*").forEach(processNode);
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();