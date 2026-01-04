// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-02-14
// @description  A script to use with the TamperMonkey browser extension to force all pages in Microsoft Loop to be 100% max width.
// @author       You
// @match        https://loop.cloud.microsoft/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526843/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/526843/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

function replacePixelsWithPercentage() {
  const searchRegex = /1024px/g;
  const replacementString = "100%";

  // Function to recursively process text nodes
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Replace in text nodes
      node.nodeValue = node.nodeValue.replace(searchRegex, replacementString);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Don't process script or style tags
      if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        // Recursively process child nodes
        for (let i = 0; i < node.childNodes.length; i++) {
          processNode(node.childNodes[i]);
        }
      }

      // Check inline styles
      if (node.hasAttribute('style')) {
        let style = node.getAttribute('style');
        let newStyle = style.replace(searchRegex, replacementString);
        if (newStyle !== style) {
          node.setAttribute('style', newStyle);
        }
      }
    }
  }

  // Find and Replace within <style> tags.
    const styleTags = document.querySelectorAll('style');
    styleTags.forEach(styleTag => {
        styleTag.textContent = styleTag.textContent.replace(searchRegex, replacementString)
    });


  // Start processing from the document body
  processNode(document.body);

  // --- MutationObserver (for dynamically loaded content) ---
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(addedNode => {
        processNode(addedNode);
      });
      //Handle style attribute changes
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        let style = mutation.target.getAttribute('style');
        let newStyle = style.replace(searchRegex, replacementString);
          if(newStyle !== style){
              mutation.target.setAttribute('style', newStyle);
          }
      }
    });
  });

  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true, // Observe direct children
    subtree: true,   // Observe all descendants
    attributes: true,
    attributeFilter: ['style']
  });
}

// Run the replacement
replacePixelsWithPercentage();
})();