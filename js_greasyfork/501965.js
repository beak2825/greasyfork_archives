// ==UserScript==
// @name         Haxball sem ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove os anúncios do haxball depois da pagina carregar completamente
// @author       Lunatico
// @match        https://www.haxball.com/play
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501965/Haxball%20sem%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/501965/Haxball%20sem%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removerAnuncios() {
        const anuncios = document.querySelectorAll('.ad, .ads, .advertisement, .ad-container');
        anuncios.forEach(anuncio => anuncio.style.display = 'none')

        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (iframe.src.includes('ads') || iframe.src.includes('ad')) {
                iframe.style.display = 'none';
            }
        });
    }

    removerAnuncios();

    const observer = new MutationObserver(removerAnuncios);
    observer.observe(document.body, { childList: true, subtree: true });
})();
