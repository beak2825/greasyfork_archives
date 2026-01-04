// ==UserScript==
// @name         Default fonts
// @version      1.1
// @description  Replace web fonts with browser's default fonts
// @author       KenHV
// @namespace    https://kenhv.com
// @supportURL   https://kenhv.com
// @homepageURL  https://kenhv.com
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/496839/Default%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/496839/Default%20fonts.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Cache to keep track of processed rules and stylesheets
  const processedRules = new WeakSet();
  const processedStyleSheets = new WeakSet();

  function fontReplace() {
    Array.from(document.styleSheets).forEach((styleSheet) => {
      if (processedStyleSheets.has(styleSheet)) {
        return;
      }

      let rules;
      try {
        rules = Array.from(styleSheet.cssRules);
      } catch (err) {
        return;
      }

      rules.forEach((rule) => {
        if (rule instanceof CSSStyleRule && !processedRules.has(rule)) {
          if (rule.style.fontFamily.includes("sans")) {
            rule.style.fontFamily = "sans-serif";
            processedRules.add(rule);
            return;
          }
          if (rule.style.fontFamily.includes("serif")) {
            rule.style.fontFamily = "serif";
            processedRules.add(rule);
            return;
          }
          if (rule.style.fontFamily.includes("mono")) {
            rule.style.fontFamily = "monospace";
            processedRules.add(rule);
            return;
          }
          processedRules.add(rule);
        }
      });

      processedStyleSheets.add(styleSheet);
    });
  }

  fontReplace();

  // Use MutationObserver to react to changes in the DOM
  const observer = new MutationObserver(() => {
    fontReplace();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
