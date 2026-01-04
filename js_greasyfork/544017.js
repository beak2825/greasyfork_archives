// ==UserScript==
// @name         Add anchor links to headings
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Make every title a clickable anchor.
// @author       Beerbeisser
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544017/Add%20anchor%20links%20to%20headings.user.js
// @updateURL https://update.greasyfork.org/scripts/544017/Add%20anchor%20links%20to%20headings.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    if (!heading.querySelector('a[href]') && !heading.closest('a[href]')) {
      const title = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      const anchor = document.createElement('a');
      anchor.href = `#${title}`;
      anchor.id = title;
      anchor.style.color = 'inherit'; // inherit the color of the parent element
      anchor.style.textDecoration = 'none'; // prevent underline
      anchor.textContent = heading.textContent;
      heading.innerHTML = '';
      heading.appendChild(anchor);
    }
  });
})();