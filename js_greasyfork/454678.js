// @ts-check
// ==UserScript==
// @name         Sort Vercel Domains
// @version      0.5
// @description  Sort the search results from Vercel Domains (vercel.com/domains)
// @match        https://vercel.com/*
// @grant        none
// @license      MIT
// @namespace    MEMIJE.IO
// @author       MEMIJE.IO
// @downloadURL https://update.greasyfork.org/scripts/454678/Sort%20Vercel%20Domains.user.js
// @updateURL https://update.greasyfork.org/scripts/454678/Sort%20Vercel%20Domains.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // @ts-check
  {
    const observer = new MutationObserver((mutations, observer) => {
      const allDomainElems = document.querySelectorAll(
        '[data-testid="domains/search-item"] .INTERNAL_AVAILABLE',
      );

      const domains = Array.from(allDomainElems).map((elem) => {
        const nameEl = elem.querySelector('.query-part');
        const endingEl = elem.querySelector('.tld-part');
        const name = nameEl ? nameEl.textContent : '';
        const ending = endingEl ? endingEl.textContent : '';

        return `${name}${ending}`;
      });
      const sorted = [...domains]
        .sort((a, b) => a.localeCompare(b))
        .sort((a, b) => (a || '').length - (b || '').length);
      if (sorted.length > 0) {
        console.clear();
        console.log(JSON.stringify(sorted));
      }
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
      subtree: true,
      attributes: true,
      //...
    });
  }
})();
