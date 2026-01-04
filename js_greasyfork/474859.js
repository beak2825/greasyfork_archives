// ==UserScript==
// @name         reload-gemvision-prod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reload the gemvision prod dashboard periodically
// @license      MIT
// @author       kz
// @match        https://dashboard.gemvision.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemvision.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474859/reload-gemvision-prod.user.js
// @updateURL https://update.greasyfork.org/scripts/474859/reload-gemvision-prod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Functie om de pagina te herladen
    function herlaadPagina() {
        location.reload();
    }

    // Interval instellen (bijvoorbeeld elke 5000 milliseconden, oftewel elke 5 seconden)
    setInterval(herlaadPagina, 10000);
})();