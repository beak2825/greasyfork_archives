// ==UserScript==
// @name         Portál stavebníka - QoL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přemapování klávesy "/" na Tab, úprava modal tlačítek a simulace kliknutí na tlačítko "Přidat další" při stisku Enter v textovém poli s třídou "id-input2". Po přidání nového bloku se automaticky klikne první z textboxů.
// @author       Teodor Tomáš
// @match        https://portal.stavebnisprava.gov.cz/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/545807/Port%C3%A1l%20stavebn%C3%ADka%20-%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/545807/Port%C3%A1l%20stavebn%C3%ADka%20-%20QoL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remapování klávesy "/" na Tab
    document.addEventListener('keydown', function(event) {
        if (event.key === '/') {
            event.preventDefault();
            const focusableElements = document.querySelectorAll('input, select, textarea, button, a[href]');
            const index = Array.prototype.indexOf.call(focusableElements, document.activeElement);
            if (index !== -1) {
                const nextElement = focusableElements[index + 1] || focusableElements[0];
                nextElement.focus();
            }
        }
    });

    // Úprava modal tlačítek:
    // - V levém bloku zůstane tlačítko "Přidat další".
    // - Tlačítko "Přidat" (uložení) se odstraní z levého bloku, vloží do pravého a přejmenuje se na "Uložit a zavřít".
    function modifyModalFooters() {
        const modalFooters = document.querySelectorAll('.modal-footer--radius.modal-background.d-flex.px-sm-5.modal-footer-custom');
        modalFooters.forEach(function(footer) {
            if (footer.dataset.modified) return; // již zpracováno

            const leftContainer = footer.querySelector('.button-wrapper--inner');
            const rightContainer = footer.querySelector('.d-flex.justify-content-end.col');

            if (leftContainer && rightContainer) {
                // Vyhledáme tlačítko "Přidat" v levém bloku
                const buttonsLeft = leftContainer.querySelectorAll('button');
                const saveButton = Array.from(buttonsLeft).find(btn => btn.textContent.trim() === 'Přidat');
                if (saveButton) {
                    // Odebereme tlačítko "Přidat" z levého bloku
                    leftContainer.removeChild(saveButton);

                    // Změníme text na "Uložit a zavřít"
                    saveButton.textContent = 'Uložit a zavřít';

                    // Odstraníme původní tlačítko v pravém bloku (např. "Zrušit")
                    const cancelButton = rightContainer.querySelector('button');
                    if (cancelButton) {
                        rightContainer.removeChild(cancelButton);
                    }

                    // Vložíme uložit tlačítko do pravého bloku
                    rightContainer.appendChild(saveButton);
                }
            }
            footer.dataset.modified = "true";
        });
    }

    // Okamžité spuštění úprav, pokud jsou modální okna již v DOM
    modifyModalFooters();

    // Sledujeme změny v DOM pro případ dynamického načítání modálních oken
    const observer = new MutationObserver(() => {
        modifyModalFooters();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Pokud je kurzor v textovém poli s třídou "id-input2" a stiskneš Enter,
    // vyhledá se tlačítko "Přidat další", simuluje se jeho kliknutí a poté klikne první textbox nově přidaného bloku.
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.target.matches('input.id-input2')) {
            event.preventDefault();
            // Hledáme tlačítko "Přidat další" v levém bloku modálního okna
            const addMoreButton = Array.from(document.querySelectorAll('.button-wrapper--inner button'))
                .find(button => button.textContent.trim() === 'Přidat další');
            if (addMoreButton) {
                addMoreButton.click();

                // Po malém zpoždění počkáme, než se nová sada textboxů vykreslí,
                // a poté klikneme na první textbox v posledním přidaném bloku.
                setTimeout(function(){
                    // Vybereme všechny bloky, kde se nachází dvojice textboxů.
                    const groups = document.querySelectorAll('div.d-lg-flex.col-lg-6.col-12');
                    if (groups.length > 0) {
                        // Poslední skupina by měla být ta nově přidaná.
                        const lastGroup = groups[groups.length - 1];
                        // První textbox (levý) nalezneme v prvním divu s třídou "col-lg-5".
                        const firstTextbox = lastGroup.querySelector('div.d-lg-flex.col-lg-5.col-12 input.id-input2');
                        if(firstTextbox) {
                            firstTextbox.click();
                            firstTextbox.focus();
                        }
                    }
                }, 300); // zpoždění 300 ms (lze upravit dle potřeby)
            }
        }
    });
})();
