// ==UserScript==
// @name         Změna href pro SynotTip odkazy
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Mění odkazy na stránce na nový formát
// @author       Lukáš Malec
// @match        https://dc.livesport.eu/kvido/parser/multi-admin
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498447/Zm%C4%9Bna%20href%20pro%20SynotTip%20odkazy.user.js
// @updateURL https://update.greasyfork.org/scripts/498447/Zm%C4%9Bna%20href%20pro%20SynotTip%20odkazy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro změnu href a textového obsahu odkazů
    function zmenHref(odkaz) {
        var puvodniHref = odkaz.href;

        if (puvodniHref.startsWith('https://m.synottip.cz/live-zapas/')) {
            var castZaLomitkem = puvodniHref.split('/').pop();
            var novyHref = 'https://sport.synottip.cz/live/live-zapas/' + castZaLomitkem;

            odkaz.href = novyHref;
            odkaz.textContent = novyHref;

            console.log(`Změněn href z ${puvodniHref} na ${novyHref}`);
        } else {
            console.log(`Odkaz neodpovídá vzoru: ${puvodniHref}`);
        }
    }

    // Funkce pro zpracování všech odkazů na stránce
    function zpracujOdkazy() {
        console.log('Začínáme zpracovávat odkazy...');
        var odkazy = document.querySelectorAll('a');
        if (odkazy.length === 0) {
            console.log('Žádné odkazy nebyly nalezeny.');
        }
        odkazy.forEach(zmenHref);
    }

    // Čekání na plné načtení stránky a jistota, že jsou odkazy načtené
    window.addEventListener('load', () => {
        console.log('Stránka plně načtena.');
        // Použití setTimeout pro čekání na dynamické načítání
        setTimeout(() => {
            console.log('Spouštíme zpracování odkazů po krátkém čekání.');
            zpracujOdkazy();

            // Nastavení MutationObserver pro sledování změn v DOM
            var observer = new MutationObserver((mutations) => {
                console.log('Detekovány změny v DOM.');
                zpracujOdkazy();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }, 2000); // Čekání 2 sekundy pro jistotu, že se načtou všechny dynamické prvky
    });

})();