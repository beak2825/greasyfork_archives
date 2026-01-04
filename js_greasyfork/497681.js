// ==UserScript==
// @name        Text Replacer
// @namespace   ReplaceTextInElements
// @version     1.1
// @description Replaces all text on a webpage with the letter A
// @author      ArpaRec
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/497681/Text%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/497681/Text%20Replacer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function replaceChars() {
    const allElements = document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, li, a"); // Add more text elements as needed
    for (const element of allElements) {
      if (element.nodeType === Node.TEXT_NODE) continue; // Skip text nodes
      element.textContent = element.textContent.replace(/\S/g, "A");
    }
  }

  replaceChars();
})();
