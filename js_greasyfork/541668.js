// ==UserScript==
// @name         FMInside Attribute Fixer (with 99 → 20)
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.7
// @description  Converts FMInside 1–100 attributes to 1–20 scale. 99 treated as 99 → 20. Prevent double conversion.
// @match        https://fminside.net/players/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541668/FMInside%20Attribute%20Fixer%20%28with%2099%20%E2%86%92%2020%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541668/FMInside%20Attribute%20Fixer%20%28with%2099%20%E2%86%92%2020%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function convertToFMScale(value) {
    // Treat 99 as 100
    if (value === 99) {
      value = 100;
    }
    return Math.round(value / 5);
  }

  function convertAttributes() {
    const elements = document.querySelectorAll('*');

    elements.forEach(el => {
      if (
        el.children.length === 0 &&
        el.textContent.trim().match(/^\d{1,3}$/) &&
        !el.hasAttribute('data-fmconverted')
      ) {
        let val = parseInt(el.textContent.trim(), 10);

        // Only convert if divisible by 5 between 5 and 100, OR if val is 99 (special case)
        if ((val >= 5 && val <= 100 && val % 5 === 0) || val === 99) {
          const converted = convertToFMScale(val);
          if (converted >= 1 && converted <= 20) {
            el.textContent = converted.toString();
            el.setAttribute('data-fmconverted', 'true');
          }
        }
      }
    });
  }

  convertAttributes();

  const observer = new MutationObserver(convertAttributes);
  observer.observe(document.body, { childList: true, subtree: true });
})();
