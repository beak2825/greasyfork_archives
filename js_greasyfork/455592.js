// ==UserScript==
// @name         Epita NeoGeoLoc Injector
// @namespace    http://epita.neogeoloc.com
// @version      0.1
// @description  Injects the Kremlin Bicetre automatically when going to the Epita NeoGeoLoc page, to make the geolocalisation work everytime.
// @author       LelouBil
// @match        https://epita.neogeoloc.com/*
// @icon         https://epita.neogeoloc.com/favicon/favicon-16x16.png
// @grant        none
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/455592/Epita%20NeoGeoLoc%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/455592/Epita%20NeoGeoLoc%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    navigator.geolocation.getCurrentPosition = (s, e) => {
  s({
    coords: {
      latitude: 48.815037,
      longitude: 2.362935
    }
  });
};
})();