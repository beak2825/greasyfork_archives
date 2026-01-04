// ==UserScript==
// @name         Teclado Virtual con CPS Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Teclado virtual con contador de clics por segundo (CPS) en Tempermonkey.
// @author       You
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495939/Teclado%20Virtual%20con%20CPS%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/495939/Teclado%20Virtual%20con%20CPS%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables globales
    let cpsCounter = 0;
    let lastKeyPressTime = 0;
    let cpsDisplayInterval;

    // Crea el teclado virtual
    function createKeyboard() {
        const keyboardDiv = document.createElement('div');
        keyboardDiv.className = 'keyboard';

        const row1 = createRow('Q', 'W', 'E');
        const row2 = createRow('A', 'S', 'D');
        const space = createSpace();
        const cpsCounterDisplay = createCounterDisplay();

        keyboardDiv.appendChild(row1);
        keyboardDiv.appendChild(row2);
        keyboardDiv.appendChild(space);
        keyboardDiv.appendChild(cpsCounterDisplay);

        document.body.appendChild(keyboardDiv);
    }

    // Crea una fila de teclas
    function createRow(...keys) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        keys.forEach(key => {
            const keyDiv = createKey(key);
            rowDiv.appendChild(keyDiv);
        });
        return rowDiv;
    }

    // Crea una tecla
    function createKey(key) {
        const keyDiv = document.createElement('div');
        keyDiv.className = 'key';
        keyDiv.textContent = key;
        keyDiv.dataset.key = key;
        keyDiv.addEventListener('click', handleKeyClick);
        return keyDiv;
    }

    // Maneja el clic en una tecla
    function handleKeyClick(event) {
        const key = event.target.dataset.key;
        if (key === ' ') {
            cpsCounter = 0; // Reinicia el contador de CPS cuando se presiona la tecla de espacio
        } else {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastKeyPressTime;
            if (timeDiff < 1000) {
                cpsCounter++;
            } else {
                cpsCounter = 1;
            }
            lastKeyPressTime = currentTime;
        }
        updateCounterDisplay();
    }

    // Crea un espacio largo
    function createSpace() {
        const spaceDiv = document.createElement('div');
        spaceDiv.className = 'key space';
        spaceDiv.textContent = ' ';
        spaceDiv.addEventListener('click', handleKeyClick);
        return spaceDiv;
    }

    // Crea el contador de CPS
    function createCounterDisplay() {
        const counterDiv = document.createElement('div');
        counterDiv.className = 'counter';
        counterDiv.textContent = 'CPS: 0';
        return counterDiv;
    }

    // Actualiza la visualización del contador de CPS
    function updateCounterDisplay() {
        const counterDisplay = document.querySelector('.counter');
        counterDisplay.textContent = `CPS: ${cpsCounter}`;
    }

    // Inicia el script
    createKeyboard();

})();
