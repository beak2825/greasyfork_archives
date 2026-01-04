// ==UserScript==
// @name         NoMoreVicodinScam
// @namespace    LordBusiness.NMVS
// @version      2.8
// @description  Hides Vicodin priced over $50k so that you don't get scammed of your cash!
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/bazaar.php*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370336/NoMoreVicodinScam.user.js
// @updateURL https://update.greasyfork.org/scripts/370336/NoMoreVicodinScam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bazaarWrap = document.getElementById('bazaar-page-wrap'),
          bazaarObserver = new MutationObserver(mutationList => {
              const bazaarItems = bazaarWrap.querySelector('.items-list');
              if(bazaarItems) {
                  bazaarObserver.disconnect();
                  const VicodinSpan = bazaarItems.querySelector(':scope > li [itemid="205"]')
                  if(VicodinSpan) {
                      const price = parseInt((VicodinSpan.nextElementSibling.querySelector('.wrap > .price').innerText).replace( /[^0-9]/g, ''));
                      if(price > 50000) VicodinSpan.parentNode.parentNode.style.display = 'none';
                  }
                  return;
              }
          });
    bazaarObserver.observe(bazaarWrap, { childList: true, subtree: true });
})();
