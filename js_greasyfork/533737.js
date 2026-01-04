// ==UserScript==
// @name         GOG.com - Promo Filter
// @namespace    GOG.com - Promo Filter
// @version      2.4
// @description  Hide/remove games matching your keywords on GOG.com and collapse the grid slots they occupied
// @author       masterofobzene
// @homepage     https://github.com/masterofobzene/UserScriptRepo
// @icon         https://www.gog.com/favicon.ico
// @match        https://www.gog.com/*/games*
// @grant        none
// @run-at       document-end
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/533737/GOGcom%20-%20Promo%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/533737/GOGcom%20-%20Promo%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // — your forbidden words (case‐insensitive) —
  const filterWords   = ['bundle', 'edition', 'supporter', 'halloween', 'christmas', 'soundtrack'];
  const hideMethod    = 'remove';  // 'remove' or 'hide'
  const checkInterval = 1000;       // ms

  // core filter routine
  function filterGames() {
    document
      .querySelectorAll('.product-tile:not([data-filtered])')
      .forEach(tile => {
        const titleEl = tile.querySelector('.product-tile__title, .product-tile__info__name');
        if (!titleEl) return;
        const title = titleEl.textContent.trim().toLowerCase();
        if (filterWords.some(w => title.includes(w))) {
          tile.setAttribute('data-filtered', 'true');

          // climb up until our parent is the real grid/flex container
          let wrapper = tile;
          while (
            wrapper.parentElement &&
            !['grid', 'flex'].includes(
              window.getComputedStyle(wrapper.parentElement).display
            )
          ) {
            wrapper = wrapper.parentElement;
          }

          // if we found that container, remove/hide the grid‐item itself
          if (
            wrapper.parentElement &&
            ['grid', 'flex'].includes(
              window.getComputedStyle(wrapper.parentElement).display
            )
          ) {
            if (hideMethod === 'remove') {
              wrapper.remove();
            } else {
              wrapper.style.display = 'none';
            }
          } else {
            // fallback: hide the tile itself
            tile.style.display = 'none';
          }
        }
      });
  }

  // set up observers & intervals
  function init() {
    filterGames();

    // watch for new tiles (infinite scroll, dynamic re-render)
    const obs = new MutationObserver(muts => {
      if (muts.some(m => m.addedNodes.length > 0)) {
        filterGames();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    // belt‐and‐suspenders: interval re-check
    setInterval(filterGames, checkInterval);

    // clean up on page unload
    window.addEventListener('beforeunload', () => obs.disconnect());
  }

  // **bootstrapping**: wait until at least one .product-tile exists
  const bootstrap = setInterval(() => {
    if (document.querySelector('.product-tile')) {
      clearInterval(bootstrap);
      init();
    }
  }, 500);

})();
