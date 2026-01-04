// ==UserScript==
// @name         Bypass Login Overlay Band
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove a sobreposição de login no site da Band.
// @author       Andrino Cauduro - https://github.com/AndrinoC
// @match        *://*.band.com.br/*
// @icon         https://pubimg.band.com.br/Files/LogoBand.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541733/Bypass%20Login%20Overlay%20Band.user.js
// @updateURL https://update.greasyfork.org/scripts/541733/Bypass%20Login%20Overlay%20Band.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(function () {
    var loginOverlay = document.querySelector(".authorization-login");
    if (loginOverlay) {
      loginOverlay.remove();
      console.log("Sobreposição de login removida.");
    }
  }, 2000);
})();
