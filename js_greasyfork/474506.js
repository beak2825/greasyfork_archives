// ==UserScript==
// @name         reload-gemvision-dev
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Reload the gemvision dev dashboard periodically
// @license      MIT
// @author       kz
// @match        https://devdashboard.gemvision.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemvision.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474506/reload-gemvision-dev.user.js
// @updateURL https://update.greasyfork.org/scripts/474506/reload-gemvision-dev.meta.js
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