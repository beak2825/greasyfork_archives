// ==UserScript==
// @name            feed facebook grandi
// @namespace       https://greasyfork.org/users/237458
// @version         0.7
// @description     feed large
// @author          figuccio
// @match           https://*.facebook.com/*
// @grant           GM_addStyle
// @run-at          document-start
// @icon            https://facebook.com/favicon.ico
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @noframes
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/453370/feed%20facebook%20grandi.user.js
// @updateURL https://update.greasyfork.org/scripts/453370/feed%20facebook%20grandi.meta.js
// ==/UserScript==
(function() {
    'use strict';
GM_addStyle(`
 /* Stile  per gli elementi con bordo rosso ha cosa stai pensando bordo*/
  .xz9dl7a.xf7dkkf.xv54qhq.x1a8lsjc.x1a02dak.x78zum5.x6s0dn4{
   border-radius:14px;
   border:2px solid red!important;
  }

  /* Stile specifico per il bordo verde sui feed */
  .x6o7n8i.x1unhpq9.x1hc1fzr > div {
   border-radius:14px;
   border:2px solid lime!important;
  }

`);
var $ = window.jQuery;//$ evita triangolo giallo
$(document).ready(function() {
    // Aumenta la larghezza di alcuni elementi del feed per renderli più grandi
    function adjustWidths() {
        const feedElements = document.querySelectorAll('.x193iq5w.xvue9z.xq1tmr.x1ceravr');
        feedElements.forEach(element => {
            if (element.style.width !== '1000px') {
                element.style.width = '1000px';
            }
        });
    }

    // Osserva le modifiche nel documento e aggiusta le larghezze dei feed
    const observer = new MutationObserver(adjustWidths);
    observer.observe(document.body, { childList: true, subtree: true });

    // Aggiusta le larghezze quando la pagina è completamente caricata
    window.addEventListener('load', adjustWidths);
 });
})();

