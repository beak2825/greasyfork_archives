
// ==UserScript==
// @name         pixelplanet.fun picture overlay
// @namespace    https://github.com/Woyken/pixelplanet.fun-OverlayPicture
// @version      1.1.0
// @description  Add your picture as overlay to pixelplanet.fun
// @author       Woyken
// @include      https://pixelplanet.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443029/pixelplanetfun%20picture%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/443029/pixelplanetfun%20picture%20overlay.meta.js
// ==/UserScript==
/**/


    (function iife() {
      if (this !== window) {
        window.eval(`(${iife.toString()})();`);
        return;
      }
    
(function() {
  "use strict";
  {
    const e = document.createElement("script");
    e.src = "https://woyken.github.io/pixelplanet.fun-OverlayPicture/pixelPlanetOverlay.user.js";
    document.body.appendChild(e);
  }
})();


})();