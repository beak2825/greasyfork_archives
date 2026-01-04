// ==UserScript==
// @name         BlackMagick
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automaticky zaškrtne správné odpovědi na stránce testy.ssams.cz
// @author       Váš jméno
// @match        https://testy.ssams.cz/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529436/BlackMagick.user.js
// @updateURL https://update.greasyfork.org/scripts/529436/BlackMagick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro získání dat z Local Storage
    function getDataFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                return JSON.parse(data); // Parsování dat z JSON
            } catch (error) {
                console.error('Chyba při parsování dat:', error);
                return null;
            }
        } else {
            console.error('Data nebyla nalezena v Local Storage.');
            return null;
        }
    }

    // Funkce pro zaškrtnutí správných odpovědí a volání saveAnswer
    function checkCorrectAnswers(data) {
        if (data && Array.isArray(data)) {
            data.forEach((item, index) => {
                const questionText = item.otazka; // Text otázky
                const correctAnswers = item.odpovedi; // Pole správných odpovědí

                if (!correctAnswers || !Array.isArray(correctAnswers)) {
                    console.error(`Neplatné odpovědi pro otázku: ${questionText}`);
                    return;
                }

                // Najdeme všechny checkboxy pro danou otázku
                const checkboxes = document.querySelectorAll(`input[name^="x${index}x"]`);

                checkboxes.forEach(checkbox => {
                    // Pokud je hodnota checkboxu v poli správných odpovědí, zaškrtneme ho
                    if (correctAnswers.includes(checkbox.value)) {
                        checkbox.checked = true; // Zaškrtnutí správné odpovědi
                        console.log(`Zaškrtnuto: ${questionText} -> ${checkbox.value}`);

                        // Volání funkce saveAnswer pro zaznamenání odpovědi
                        if (typeof saveAnswer === 'function') {
                            saveAnswer(index, checkbox.value);
                        }
                    } else {
                        checkbox.checked = false; // Odškrtnutí nesprávné odpovědi
                    }
                });
            });
        } else {
            console.error('Neplatný formát dat: Očekáváno pole objektů.');
        }
    }

    // Hlavní funkce
    function main() {
        const key = 'data'; // Klíč pro Local Storage
        const data = getDataFromLocalStorage(key);

        if (data) {
            checkCorrectAnswers(data);
        }
    }

    // Funkce pro sledování změn na stránce
    function observePageChanges() {
        const targetNode = document.body; // Sledujeme změny v celém těle stránky
        const config = { childList: true, subtree: true }; // Konfigurace pro MutationObserver

        // Callback funkce, která se spustí při detekci změn
        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Pokud jsou detekovány změny, spustíme hlavní funkci
                    main();
                }
            }
        };

        // Vytvoření a spuštění MutationObserver
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // Spuštění hlavní funkce a sledování změn
    main(); // Spustíme skript při prvním načtení
    observePageChanges(); // Sledujeme změny na stránce
})();