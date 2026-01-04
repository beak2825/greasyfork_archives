// ==UserScript==
// @name        Ruffle Flash Player
// @namespace   i2p.schimon.ruffle
// @description Play flash (.swf) files
// @homepageURL https://schapps.woodpeckersnest.eu/
// @supportURL  https://greasyfork.org/scripts/490282-flash-player-ruffle/feedback

// @copyright   2024, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @match       file:///*
// @match       *://*/*
// @version     25.12
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7imqE8L3RleHQ+PC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/490282/Ruffle%20Flash%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/490282/Ruffle%20Flash%20Player.meta.js
// ==/UserScript==

// Please help  https://openuserjs.org/garage/Help_making_ruffle_to_work
// @require     https://unpkg.com/@ruffle-rs/ruffle/ruffle.js

function activateRuffle() {

  // The @require directive will automatically load Ruffle, so no further action is needed.
  'use strict';

  // The following code is used as a backup system.
  let ruffleScript = document.createElement('script');

  // Use the CDN version of Ruffle
  ruffleScript.src = 'https://unpkg.com/@ruffle-rs/ruffle';

  document.head.appendChild(ruffleScript);

};

(function() {

  if (location.href.endsWith('.swf')) {
    activateRuffle();
  }
  else
  if (document.querySelector('embed[src$=".swf"]')) {
    if (confirm("This focument appears to have SWF (i.e. Flash) elements.\nDo you want to activate ⚡ Ruffle Flash Player?")) {
      activateRuffle();
    }
  }

})();
