// ==UserScript==
// @name         Guardar tropas
// @namespace    Guardar tropas
// @version      1.1
// @description  Guarda las tropas enviadas y las vuelve a poner al enviar un ataque o refuerzo en Grepolis.
// @author       .
// @match        https://*.grepolis.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531169/Guardar%20tropas.user.js
// @updateURL https://update.greasyfork.org/scripts/531169/Guardar%20tropas.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;
    let lastSelectedUnits = {};

    function buscarBotones(reintentos = 50) {
        const reinforceButton = [...document.querySelectorAll('a.button')]
            .find(btn => btn.textContent.includes('Reforzar'));
        const attackButton = document.querySelector('#btn_attack_town');

        const buttonsToWatch = [reinforceButton, attackButton].filter(Boolean);

        if (buttonsToWatch.length === 0) {
            if (reintentos > 0) {
                setTimeout(() => buscarBotones(reintentos - 1), 100);
            } else {
                console.warn('⏳ [Script] No se encontraron los botones tras varios intentos.');
            }
            return;
        }

        buttonsToWatch.forEach(button => {
            if (!button.dataset.listenerAttached) {
                button.dataset.listenerAttached = "true";

                button.style.border = '2px solid #3c9';
                button.addEventListener('click', () => {
                    const unitInputs = document.querySelectorAll('input.unit_input');
                    lastSelectedUnits = {};

                    unitInputs.forEach(input => {
                        const value = parseInt(input.value, 10);
                        const unitType = input.name;

                        if (!isNaN(value) && value > 0) {
                            lastSelectedUnits[unitType] = value;
                        }
                    });

                    const interval = setInterval(() => {
                        let restored = false;

                        Object.entries(lastSelectedUnits).forEach(([unitType, savedValue]) => {
                            const input = document.querySelector(`input.unit_input[name="${unitType}"]`);
                            if (!input) return;

                            const currentValue = parseInt(input.value, 10);
                            if (!currentValue || currentValue === 0 || isNaN(currentValue)) {
                                input.value = savedValue;

                                const event = new Event('change', { bubbles: true });
                                input.dispatchEvent(event);
                                restored = true;
                            }
                        });

                        if (restored) {
                            clearInterval(interval);
                        }
                    }, 100);
                });
            }
        });
    }

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (url.includes('action=attack') || url.includes('action=support')) {
            setTimeout(() => buscarBotones(), 100); // primer intento tras carga
        }

        return originalOpen.call(this, method, url, ...args);
    };
})();