// ==UserScript==
// @name         US Open - tlačítko
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Přidává tlačítko pro proklik na live URL pro každý div s data-match na stránce US Open schedule
// @author       Lukáš Malec
// @match        https://www.usopen.org/en_US/scores/schedule/index.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504285/US%20Open%20-%20tla%C4%8D%C3%ADtko.user.js
// @updateURL https://update.greasyfork.org/scripts/504285/US%20Open%20-%20tla%C4%8D%C3%ADtko.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro přidání tlačítek
    function addButtons() {
        // Najde všechny div elementy obsahující atribut data-match
        let divs = document.querySelectorAll('div[data-match]:not(.button-added)');

        // Pro každý div
        divs.forEach(function(div) {
            // Získá hodnotu atributu data-match
            let matchNumber = div.getAttribute('data-match');

            // Ověří, že hodnota je skutečně číslo
            if (matchNumber && !isNaN(matchNumber)) {
                // Vytvoří nové tlačítko
                let button = document.createElement('button');
                button.innerText = 'Live Stats';

                // Stylizace tlačítka
                button.style.backgroundColor = 'yellow'; // Žlutá výplň
                button.style.color = 'black'; // Černý text
                button.style.fontWeight = 'bold'; // Tučné písmo
                button.style.border = '2px solid black'; // Černý tučný rámeček
                button.style.borderRadius = '8px'; // Zakulacené rohy
                button.style.padding = '5px 10px'; // Vnitřní odsazení

                // Nastaví odkaz, který se otevře po kliknutí na tlačítko
                button.addEventListener('click', function() {
                    let url = `https://www.usopen.org/en_US/scores/stats/${matchNumber}.html`;
                    window.open(url, '_blank');
                });

                // Přidá tlačítko do stejného divu
                div.appendChild(button);

                // Označí div, aby se tlačítko nepřidávalo znovu
                div.classList.add('button-added');
            }
        });
    }

    // Funkce pro scrollování na konec stránky a načítání obsahu
    async function scrollToBottomAndLoad() {
        return new Promise((resolve) => {
            let lastScrollHeight = document.body.scrollHeight;
            let scrollInterval = setInterval(() => {
                // Scrolluje na konec stránky
                window.scrollBy(0, 1000);

                // Zjistí aktuální výšku stránky po scrollování
                let newScrollHeight = document.body.scrollHeight;

                // Pokud již nedochází k načítání nového obsahu (stránka se nepřidává)
                if (newScrollHeight === lastScrollHeight) {
                    clearInterval(scrollInterval);
                    resolve(true); // Signalizuje, že jsme dosáhli konce stránky
                } else {
                    lastScrollHeight = newScrollHeight;
                }
            }, 1000); // Zvýšený interval pro jistotu načtení obsahu
        });
    }

    // Hlavní funkce
    async function init() {
        // Čeká na načtení stránky
        window.addEventListener('load', async function() {
            let reachedEnd = false;
            while (!reachedEnd) {
                // Provede scrollování na konec stránky a čeká, až se načte nový obsah
                reachedEnd = await scrollToBottomAndLoad();
                // Přidá tlačítka po načtení obsahu
                addButtons();
            }
        });
    }

    // Spuštění skriptu
    init();
})();