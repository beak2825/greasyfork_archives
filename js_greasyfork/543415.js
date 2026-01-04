// ==UserScript==
// @name         Podmiana nazw operatorów Butosklep
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Podmienia wybrane nazwiska na liście operatorów w panelu zwrotów Butosklep.
// @author       Gemini
// @match        https://butosklep.iai-shop.com/panel/returns.php*
// @match        https://butosklep.pl/panel/returns.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543415/Podmiana%20nazw%20operator%C3%B3w%20Butosklep.user.js
// @updateURL https://update.greasyfork.org/scripts/543415/Podmiana%20nazw%20operator%C3%B3w%20Butosklep.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Konfiguracja ---
    // W tym miejscu możesz zdefiniować, które nazwy i na co chcesz podmienić.
    // Po lewej stronie wpisz wartość "value" z kodu HTML, a po prawej nową nazwę.
    const nameMappings = {
        "BasiaM": "Mateusz Moś",
        "OliwiaZwroty": "Mateusz Panek",
        "Ewa2": "Aneta Moś"
    };
    // --------------------

    // Funkcja, która dokona podmiany
    function replaceNames() {
        let changesMade = false;
        for (const [value, newName] of Object.entries(nameMappings)) {
            // Szukamy elementu <option> po jego atrybucie "value"
            const optionElement = document.querySelector(`#fg_operator option[value="${value}"]`);
            if (optionElement && optionElement.textContent !== newName) {
                console.log(`Zmieniam "${optionElement.textContent}" na "${newName}"`);
                optionElement.textContent = newName;
                changesMade = true;
            }
        }
        return changesMade;
    }

    // Czekamy, aż strona się załaduje i próbujemy podmienić nazwy.
    // Używamy interwału, aby upewnić się, że skrypt zadziała, nawet jeśli lista ładuje się z opóźnieniem.
    const interval = setInterval(() => {
        if (replaceNames()) {
            // Jeśli dokonano zmiany, przestajemy sprawdzać, aby nie obciążać przeglądarki.
            clearInterval(interval);
        }
    }, 200); // Sprawdzaj co 200ms

    // Dodatkowo zatrzymujemy interwał po 10 sekundach, na wypadek gdyby elementu nie znaleziono
    setTimeout(() => {
        clearInterval(interval);
    }, 10000);

})();// ==UserScript==
// @name        New script iai-shop.com
// @namespace   Violentmonkey Scripts
// @match       https://butosklep.iai-shop.com/panel/returns.php*
// @grant       none
// @version     1.0
// @author      -
// @description 23.07.2025, 10:46:48
// ==/UserScript==
