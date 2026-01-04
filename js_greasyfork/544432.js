// ==UserScript==
// @name         Bookfusion: Collapsible All Books section
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make 'all books' hide-able, hide it and expand others  
// @match        https://www.bookfusion.com/bookshelf*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544432/Bookfusion%3A%20Collapsible%20All%20Books%20section.user.js
// @updateURL https://update.greasyfork.org/scripts/544432/Bookfusion%3A%20Collapsible%20All%20Books%20section.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function updateHeaderDiv() {
    const headerDiv = document.querySelector('div.bookshelf-expandable-header-details.is-disabled');
    if (headerDiv) {
      headerDiv.classList.remove('is-disabled');
      headerDiv.setAttribute('data-action', 'click->horizontal-book-list#toggleAction');
      console.log('✅ Header div updated');
    } else {
      console.log('⚠️ No disabled header div found');
    }
  }

  function updateExpandableDivs() {
    const divs = document.querySelectorAll('div.bookshelf-expandable');
    if (divs.length === 0) {
      console.log('⚠️ No bookshelf-expandable divs found');
      return;
    }

    divs.forEach((div, index) => {
      if (index === 0) {
        div.classList.remove('is-expanded');
      } else {
        div.classList.add('is-expanded');
        //div.classList.remove('is-expanded');
      }
    });
    console.log(`✅ Updated ${divs.length} expandable div(s)`);
  }

  // Run once on full page load (in case of slow content)
  window.addEventListener('load', () => {
    updateHeaderDiv();
    // comment out next line if you don't want all books shrunk and all others expanded.
    updateExpandableDivs();
  });

})();