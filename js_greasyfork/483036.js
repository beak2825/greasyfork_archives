// ==UserScript==
// @name        RED: UPC link atisket
// @namespace   userscript1
// @match       https://redacted.sh/torrents.php*
// @match       https://redacted.sh/artist.php*
// @match       https://redacted.sh/collages.php*
// @grant       none
// @version     0.1.3
// @author      -
// @description -
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/483036/RED%3A%20UPC%20link%20atisket.user.js
// @updateURL https://update.greasyfork.org/scripts/483036/RED%3A%20UPC%20link%20atisket.meta.js
// ==/UserScript==

(function() {
  'use strict';


  document.querySelectorAll('.edition_info').forEach(e => {
    e.innerHTML = e.innerHTML.replace(/(\d{12,13})/,
          `<a href="https://atisket.pulsewidth.org.uk/?upc=$1" target="_blank" rel="noreferrer">$1</a>`);

    //if (UPC) {
    //  e.insertAdjacentHTML('beforeEnd', `<a href='#'>UPC</a>`);
    //}

  });


})();