// ==UserScript==
// @name         SUPER RANK ON BLOXD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get super rank on bloxd
// @author       Donezz BRASILLLL
// @match        *://bloxd.io/*
// @match        *://staging.bloxd.io/*
// @match        *://bloxdhop.io/*
// @match        *://bloxdk12.com/*
// @match        *://doodlecub.io/*
// @match        *://eviltower.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528721/SUPER%20RANK%20ON%20BLOXD.user.js
// @updateURL https://update.greasyfork.org/scripts/528721/SUPER%20RANK%20ON%20BLOXD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function mudarClasse() {
        const elementos1 = document.querySelectorAll('.CharCustomPartWrapper.DisabledCharCustomPartWrapper');
        const elementos2 = document.querySelectorAll('.fa-solid.fa-x.SmallTextBold');

        elementos1.forEach((el) => {
            el.classList.remove('DisabledCharCustomPartWrapper');
            el.classList.add('EnabledCharCustomPartWrapper');
        });

        elementos2.forEach((el) => {
            el.classList.remove('fa-x');
            el.classList.add('fa-check');
        });
    }

    function mudarTexto() {
        const elementos = document.querySelectorAll('*');

        elementos.forEach((el) => {
            if (el.children.length === 0 && el.textContent) {
                if (el.textContent.includes("Get Super Rank")) {
                    el.textContent = el.textContent.replace(/Get Super Rank/g, "Super Rank");
                }
                if (el.textContent.includes("Get it Now")) {
                    el.textContent = el.textContent.replace(/Get it Now/g, "Do Login");
                }
            }
        });
    }

    function ocultarAnuncios() {
        const anuncios = [
            '.ad-banner',
            '.advertisement',
            '.ad-container',
            '.popup-ad',
            '.adsbygoogle',
            'iframe[src*="ads"]'
        ];

        anuncios.forEach(selector => {
            const elementos = document.querySelectorAll(selector);
            elementos.forEach((el) => {
                el.style.visibility = 'hidden';
                el.style.position = 'absolute';
                el.style.width = '0';
                el.style.height = '0';
            });
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        mudarClasse();
        mudarTexto();
        ocultarAnuncios();
    });

    const observer = new MutationObserver(() => {
        mudarClasse();
        mudarTexto();
        ocultarAnuncios();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();