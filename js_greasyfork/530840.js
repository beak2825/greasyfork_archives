// ==UserScript==
// @name         Bloqueador de Anuncios
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bloquea anuncios comunes en sitios web
// @author       rodriri
// @match        *://*/*
// @grant        none
// @license      Chuyin
// @downloadURL https://update.greasyfork.org/scripts/530840/Bloqueador%20de%20Anuncios.user.js
// @updateURL https://update.greasyfork.org/scripts/530840/Bloqueador%20de%20Anuncios.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adSelectors = [
        'iframe[src*="ads"]',
        '[id*="ad"], [class*="ad"]',
        '[id*="banner"], [class*="banner"]',
        '[id*="sponsored"], [class*="sponsored"]',
        '[id*="popup"], [class*="popup"]',
        'div[style*="z-index: 9999"]'
    ];

    function removeAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => ad.remove());
        });
    }

    // Eliminar anuncios al cargar la página
    removeAds();

    // Observar cambios en la página (para contenido dinámico)
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();