// ==UserScript==
// @name         Změna href pro football.com
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Mění odkazy na stránce na nový formát pro football.com
// @author       Lukáš Malec
// @match        https://dc.livesport.eu/kvido/parser/multi-admin
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508862/Zm%C4%9Bna%20href%20pro%20footballcom.user.js
// @updateURL https://update.greasyfork.org/scripts/508862/Zm%C4%9Bna%20href%20pro%20footballcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Skript se spustil správně.');

    // Funkce pro změnu href a textového obsahu odkazů
    function zmenHref(odkaz) {
        var puvodniHref = odkaz.href;

        // Regulární výraz pro kontrolu vzoru "https://www.football.com/ng/m/sport/{něco}/live/"
        var regex = /^https:\/\/www\.football\.com\/ng\/m\/sport\/[^\/]+\/live\/.*$/;

        // Kontrola, zda odkaz odpovídá vzoru
        if (regex.test(puvodniHref)) {
            console.log(`Původní href nalezen: ${puvodniHref}`);

            // Odebrání '/live' a přidání '/' na konec
            var novyHref = puvodniHref.replace('/live', '') + '/';

            // Aktualizace href a textového obsahu odkazu
            odkaz.href = novyHref;
            odkaz.textContent = novyHref;

            console.log(`Href změněn na: ${novyHref}`);
        } else {
            console.log(`Odkaz neodpovídá požadovanému vzoru: ${puvodniHref}`);
        }
    }

    // Funkce pro zpracování všech odkazů na stránce
    function zpracujOdkazy() {
        console.log('Začínáme zpracovávat odkazy...');
        var odkazy = document.querySelectorAll('a');  // Vybere všechny <a> odkazy na stránce

        if (odkazy.length === 0) {
            console.log('Žádné odkazy nebyly nalezeny.');
        } else {
            console.log(`${odkazy.length} odkazů nalezeno.`);
        }

        odkazy.forEach(zmenHref);  // Zpracuje každý odkaz pomocí funkce zmenHref
    }

    // Čekání na plné načtení stránky a jistota, že jsou odkazy načtené
    window.addEventListener('load', () => {
        console.log('Stránka plně načtena.');

        // Použití setTimeout pro čekání na dynamické načítání
        setTimeout(() => {
            console.log('Spouštíme zpracování odkazů po krátkém čekání.');
            zpracujOdkazy();

            // Nastavení MutationObserver pro sledování změn v DOM
            var observer = new MutationObserver(() => {
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