// ==UserScript==
// @name         US Open - tlačítko
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Přidává tlačítko pro proklik na live URL pro každý div s data-match na stránce US Open schedule
// @author       Lukáš Malec
// @match        https://www.usopen.org/en_US/scores/schedule/index.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504359/US%20Open%20-%20tla%C4%8D%C3%ADtko.user.js
// @updateURL https://update.greasyfork.org/scripts/504359/US%20Open%20-%20tla%C4%8D%C3%ADtko.meta.js
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

                button.addEventListener('click', function() {
                    let url = `https://www.usopen.org/en_US/scores/stats/${matchNumber}.html`;
                    window.open(url, '_blank');
                });

                div.appendChild(button);

                div.classList.add('button-added');
            }
        });
    }

    function observeDOMChanges() {
        const targetNode = document.body;

        const config = {
            childList: true,
            subtree: true
        };

        const callback = function(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addButtons();
                }
            }
        };

        const observer = new MutationObserver(callback);

        observer.observe(targetNode, config);

        addButtons();
    }

    function init() {
        window.addEventListener('load', function() {
            observeDOMChanges();
        });
    }

    init();
})();
