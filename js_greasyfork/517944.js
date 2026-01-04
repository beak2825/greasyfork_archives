// ==UserScript==
// @name         Ninja.io FOV Adjuster
// @namespace    https://yourcustomnamespace
// @version      1.1
// @description  Adjust Field of View (FOV) in Ninja.io using keyboard or mouse wheel
// @author       YourName
// @match        https://ninja.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517944/Ninjaio%20FOV%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/517944/Ninjaio%20FOV%20Adjuster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Domyślne wartości
    let scaleTarget = 1.0; // Początkowe skalowanie FOV
    const minScale = 0.5;  // Minimalna wartość
    const maxScale = 2.0;  // Maksymalna wartość
    const step = 0.1;      // Krok zmiany

    // Funkcja do aktualizacji FOV
    function updateFOV(newScale) {
        // Ograniczamy zakres skali
        scaleTarget = Math.max(minScale, Math.min(maxScale, newScale));

        // Aktualizacja właściwości w grze
        if (window.app && window.app.game && window.app.game.canvas) {
            window.app.game.canvas.scaleTarget = scaleTarget;
            console.log(`FOV ustawiony na: ${scaleTarget.toFixed(2)}`);
        } else {
            console.warn("Nie znaleziono obiektu 'app.game.canvas'. Upewnij się, że gra jest załadowana.");
        }
    }

    // Obsługa klawiatury
    window.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowUp') {
            updateFOV(scaleTarget + step); // Zwiększenie FOV
        } else if (e.code === 'ArrowDown') {
            updateFOV(scaleTarget - step); // Zmniejszenie FOV
        }
    });

    // Obsługa rolki myszy
    window.addEventListener('wheel', (e) => {
        if (e.deltaY < 0) {
            updateFOV(scaleTarget + step); // Zwiększenie FOV
        } else if (e.deltaY > 0) {
            updateFOV(scaleTarget - step); // Zmniejszenie FOV
        }
    });

    // Początkowa konfiguracja
    console.log('Skrypt Ninja.io FOV Adjuster został załadowany!');
})();
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-11-18
// @description  try to take over the world!
// @author       You
// @match        https://cg.ninja.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ninja.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();