// ==UserScript==
// @name        Text Replacer Troll
// @namespace   ReplaceTextInElements
// @version     1.1
// @description Replaces all text on a webpage with the letter A
// @author      ArpaRec
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/497683/Text%20Replacer%20Troll.user.js
// @updateURL https://update.greasyfork.org/scripts/497683/Text%20Replacer%20Troll.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Change this to the HTML code of the element you want to replace with
  const replaceHTML = '<img src="https://upload.wikimedia.org/wikipedia/uk/thumb/7/78/Trollface.svg/1200px-Trollface.svg.png" width=50px>';

  function replaceElements() {
    const elementsToReplace = document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, li, a"); // Select all elements

    for (const element of elementsToReplace) {
      const replacement = document.createElement("div"); // Temporary container
      replacement.innerHTML = replaceHTML; // Set replacement HTML content

      // Extract the actual replacement element from the temporary container
      const actualReplacement = replacement.firstChild;

      element.parentNode.replaceChild(actualReplacement, element);
    }
  }

  replaceElements();
})();

