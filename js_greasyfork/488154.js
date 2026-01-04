// ==UserScript==
// @name         Facebook Enlarger Feed
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Enlarger Feed and Group Feed on Facebook
// @author       UpsideXD
// @license      GPL-3.0
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @match        https://*.facebook.com/groups/feed/*
// @match        https://*.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488154/Facebook%20Enlarger%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/488154/Facebook%20Enlarger%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function adicionarEstiloPorClasse(classe, estilo) {
        const elementos = document.getElementsByClassName(classe);
        for (const elemento of elementos) {
            elemento.setAttribute('style', estilo);
        }
    }
    function verificarLarguraAplicada(classe, largura) {
        const elementos = document.getElementsByClassName(classe);
        return Array.from(elementos).some(elemento => elemento.style.width === largura);
    }
    function ajustarLarguras() {
        const largurasEClasses = [
            { classe: 'x9f619 x1n2onr6 x1ja2u2z x2lah0s x1qjc9v5 x78zum5 x1q0g3np x1a02dak xl56j7k x9otpla x1n0m28w x1wsgfga xp7jhwk', largura: '700px' },
            { classe: 'x1qjc9v5 x78zum5 xdt5ytf xh8yej3', largura: '1500px' },
            { classe: 'x193iq5w xvue9z xq1tmr x1ceravr', largura: '1000px' },
            { classe: 'x193iq5w xgmub6v x1ceravr', largura: '1000px' }
        ];
        largurasEClasses.forEach(({ classe, largura }) => {
            if (!verificarLarguraAplicada(classe, largura)) {
                adicionarEstiloPorClasse(classe, `width: ${largura};`);
            }
        });
    }
    const observer = new MutationObserver(ajustarLarguras);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', ajustarLarguras);
})();