// ==UserScript==
// @name         OC Re-Order
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Re-Order OC's 2.0
// @author       Apollyon [445323]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523384/OC%20Re-Order.user.js
// @updateURL https://update.greasyfork.org/scripts/523384/OC%20Re-Order.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function isCrimesTab() {
    return location.href.indexOf("tab=crimes") !== -1;
  }

  function reorderOCs() {
    const spans = document.querySelectorAll('span[class^="levelValue_"]');

    function getNthParent(element, n) {
      let current = element;
      for (let i = 0; i < n; i++) {
        if (current.parentElement) {
          current = current.parentElement;
        } else {
          return null;
        }
      }
      return current;
    }

    const parents = Array.from(spans).map(span => getNthParent(span, 7)).filter(Boolean);
    const uniqueParents = [...new Set(parents)];

    uniqueParents.sort((a, b) => {
      const valueA = a.querySelector('span[class^="levelValue_"]').textContent;
      const valueB = b.querySelector('span[class^="levelValue_"]').textContent;
      return valueB.localeCompare(valueA);
    });

    if (uniqueParents.length > 0) {
      const parentContainer = uniqueParents[0].parentElement;
      uniqueParents.forEach(parent => {
        parentContainer.appendChild(parent);
      });
    }
  }

  function startPeriodicCheck() {
    setInterval(() => {
      if (isCrimesTab()) {
        reorderOCs();
      }
    }, 100); // Check every 5 seconds
  }

  function init() {
    if (isCrimesTab()) {
      setTimeout(() => {
        reorderOCs(); // Initial reorder
      }, 2000);
      startPeriodicCheck(); // Start the periodic check
    }
  }

  init();

  window.addEventListener('hashchange', () => {
    init();
  });

})();
