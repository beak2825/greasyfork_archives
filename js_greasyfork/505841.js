// ==UserScript==
// @name         Tenipo Match Detail Button - Optimized
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Přidání tlačítek "DETAIL ZÁPASU" jen pro zápasy viditelné na obrazovce na stránce Tenipo.
// @author       Lukáš Malec
// @match        https://tenipo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505841/Tenipo%20Match%20Detail%20Button%20-%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/505841/Tenipo%20Match%20Detail%20Button%20-%20Optimized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro vložení tlačítek
    function addButtonToMatch(match) {
        let onclickAttr = match.getAttribute('onclick');

        // Vyhledáme URL pomocí regulárního výrazu
        let matchUrl = onclickAttr.match(/\/match\/[a-zA-Z0-9-]+\/\d+/);

        if (matchUrl) {
            let fullUrl = 'https://tenipo.com' + matchUrl[0];

            // Pokud už tlačítko neexistuje, vytvoříme ho
            if (!match.querySelector('a.detail-button')) {
                let button = document.createElement('a');
                button.href = fullUrl;
                button.textContent = 'DETAIL ZÁPASU';
                button.className = 'detail-button';
                button.style.display = 'inline-block';
                button.style.padding = '5px 40px';
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                button.style.textDecoration = 'none';
                button.style.marginTop = '10px';
                button.style.borderRadius = '5px';

                match.appendChild(button);
                console.log('Tlačítko přidáno pro zápas:', fullUrl);
            }
        }
    }

    // IntersectionObserver callback - přidává tlačítka jen pro viditelné zápasy
    const observerCallback = function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                addButtonToMatch(entry.target); // Přidáme tlačítko jen pokud je zápas viditelný
                observer.unobserve(entry.target); // Zastavíme sledování tohoto zápasu po přidání tlačítka
            }
        });
    };

    // Nastavení IntersectionObserver
    const observerOptions = {
        root: null, // Sledujeme viditelnost v rámci celého okna
        rootMargin: '0px',
        threshold: 0.1 // Spustí se, pokud je alespoň 10% prvku viditelné
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Sledujeme všechny zápasy na stránce
    function observeMatches() {
        let matches = document.querySelectorAll('table[onclick]');
        console.log('Počet nalezených zápasů k pozorování:', matches.length);

        matches.forEach(function(match) {
            observer.observe(match); // Začneme sledovat každý zápas
        });
    }

    // Vytvoříme MutationObserver pro sledování dynamických změn na stránce
    const mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                observeMatches(); // Začneme sledovat nové zápasy
            }
        });
    });

    // Sledujeme změny v DOM (pro dynamicky načítané zápasy)
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Spustíme sledování zápasů při načtení stránky
    window.addEventListener('load', function() {
        console.log('Stránka načtena.');
        observeMatches(); // Spustíme sledování hned po načtení stránky
    });

})();