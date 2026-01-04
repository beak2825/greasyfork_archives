// ==UserScript==
// @name         150 statt 15 Suchergebnisse
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Patch itemsPerPage in index.js - 150 statt 15 Suchergebnisse - itemsPerPage geänderrt
// @namespace    http://tampermonkey.net/
// @author       Christian Frischholz - https://github.com/Frischifrisch - https://github.com/Frischifrisch/itemsPerPage
// @match        https://mediathekviewweb.de/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484241/150%20statt%2015%20Suchergebnisse.user.js
// @updateURL https://update.greasyfork.org/scripts/484241/150%20statt%2015%20Suchergebnisse.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Warten Sie, bis die Seite geladen ist, bevor Sie versuchen, die Variable zu ändern
  window.addEventListener('load', function () {
    // Überprüfen Sie, ob die Variable existiert, bevor Sie versuchen, sie zu ändern
    if (window.itemsPerPage !== undefined) {
      window.itemsPerPage = 150;
    }
  });
})();
