// ==UserScript==
// @name        Dunkle Karte
// @namespace   leeSalami.lss
// @version     1.0
// @license     MIT
// @author      leeSalami
// @description Night mode für die Karte. Macht die Karte dunkel, sobald der Dunkelmodus im Spiel aktiv ist.
// @match       https://*.leitstellenspiel.de
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/516431/Dunkle%20Karte.user.js
// @updateURL https://update.greasyfork.org/scripts/516431/Dunkle%20Karte.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const style = document.createElement('style');
  style.innerHTML = `
    body.dark .leaflet-layer,
    body.dark .leaflet-control-layers,
    body.dark .leaflet-control-custom,
    body.dark .leaflet-control-zoom-in,
    body.dark .leaflet-control-zoom-out,
    body.dark .leaflet-control-attribution {
      filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
    }

    body.dark .leaflet-control-layers,
    body.dark .leaflet-control-custom {
      border: 2px solid rgba(255,255,255,0.2) !important;
    }
    
    body.dark .leaflet-tooltip {
      background-color: #0d0d0d;
      color: #ddd !important;
      border: #0d0d0d !important;
    }

    body.dark .leaflet-tooltip.leaflet-tooltip-left::before {
      border-left-color: #0d0d0d;
    }
    
    body.dark .leaflet-tooltip.leaflet-tooltip-right::before {
      border-right-color: #0d0d0d;
    }
    
    body.dark .leaflet-container {
      background-color: #0d0d0d !important;
    }
    
    body.dark .leaflet-container a {
      color: #464646;
    }
  `;

  document.head.appendChild(style);
})();
