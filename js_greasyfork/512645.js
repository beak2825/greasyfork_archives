// ==UserScript==
// @name         google_search_results_categorize
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  highlight Sponsored content from google search results in light red
// @author       Manyu Lakhotia
// @match        https://www.google.com/search?*
// @icon         s
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512645/google_search_results_categorize.user.js
// @updateURL https://update.greasyfork.org/scripts/512645/google_search_results_categorize.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function main() {
    const domEles = Array.from(document.querySelectorAll('div')).filter(div => {
      const containsSponsoredSpan = (element, depth = 0) => {
        if (depth > 3) return false;
        if (element.tagName === 'SPAN' && element.textContent?.trim() === 'Sponsored') {
          return true;
        }
        for (const child of element.children) {
          if (containsSponsoredSpan(child, depth + 1)) {
            return true;
          }
        }
        return false;
      };
      return containsSponsoredSpan(div);
    });

    domEles.forEach(domEle => {
      domEle.style.backgroundColor = 'rgba(255, 170, 170, 0.1)';
    });
  }

  const targetNode = document.getElementsByTagName('html')[0];
  if (targetNode) {
    const observerConfig = {attributes: true, childList: true};
    const observer = new MutationObserver(main);
    observer.observe(targetNode, observerConfig);
  }
})();
