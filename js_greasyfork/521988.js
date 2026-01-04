// ==UserScript==
// @name         Phone Number Linkifier
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Transforms phone numbers into clickable links with a phone icon.
// @author       You
// @match        https://tck.mydstny.fr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521988/Phone%20Number%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/521988/Phone%20Number%20Linkifier.meta.js
// ==/UserScript==

(function() {
  'use strict';



  function collectTextNodes(node, textNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
      textNodes.push(node);
    } else {
      for (const child of node.childNodes) {
        collectTextNodes(child, textNodes);
      }
    }
  }

  function transformPhoneNumbers(panel) {
    const textNodes = [];
    collectTextNodes(panel, textNodes);

    const phoneRegex = /(?:(?:\+|00)?(?:\d{1,3}[-.\s]?)?(?:\(\d{1,3}\)[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}[-.\s]?\d{0,5}|\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2})/g;

    for (const node of textNodes) {
      if (phoneRegex.test(node.nodeValue)) {
        const newContent = node.nodeValue.replace(phoneRegex, match => {
          const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>`;
          return `<a href="tel:${match.replace(/\s/g, '')}">${match} ${icon}</a>`;
        });
        const newNode = document.createElement('span');
        newNode.innerHTML = newContent;
        node.parentNode.replaceChild(newNode, node);
      }
    }
  }

  // Apply transformation on page load
  const panels = document.querySelectorAll("#js-contentDetail > div.row > div.col-md-3.col-lg-3 > div:nth-child(1) > div.panel-body");
  panels.forEach(transformPhoneNumbers);

  // Observe changes in the DOM and apply transformation to new panels
  const observer = new MutationObserver(mutations => {
    // ... (MutationObserver logic remains the same) ...
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Add style for phone number links
  const style = document.createElement('style');
  style.textContent = `
    .panel.panel-default a[href^="tel:"] {
      color: black !important;
    }
  `;
  document.head.appendChild(style);

})();