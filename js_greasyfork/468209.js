// ==UserScript==
// @name         Limpiar enlaces de Aliexpress
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Limpiador ali
// @author       xxdamage
// @match        https://es.aliexpress.com/item/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468209/Limpiar%20enlaces%20de%20Aliexpress.user.js
// @updateURL https://update.greasyfork.org/scripts/468209/Limpiar%20enlaces%20de%20Aliexpress.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentURL = window.location.href;
    var cleanURL = currentURL.match(/(.+\.html)/)[0];
    if (!currentURL.includes('sourceType=') && cleanURL !== currentURL) {
        window.location.replace(cleanURL);
    }
})();
