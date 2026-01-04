// ==UserScript==
// @name         Contador de CPS en Sploop.io
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Muestra el número de clics por segundo (CPS) en Sploop.io
// @author       Tú
// @license MIT
// @match        *://sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523959/Contador%20de%20CPS%20en%20Sploopio.user.js
// @updateURL https://update.greasyfork.org/scripts/523959/Contador%20de%20CPS%20en%20Sploopio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Cps = {
        count: 0,
        element: null,

        // Disminuye el contador
        reduce: function() {
            this.count -= 1;
            this.updateText();
        },

        // Aumenta el contador
        increase: function() {
            this.count += 1;
            this.updateText();
        },

        // Actualiza el texto del contador
        updateText: function() {
            this.element.textContent = `Cps: ${this.count < 0 ? 0 : this.count}`;
        },

        // Crea el elemento para mostrar el CPS
        createElement: function() {
            this.element = document.createElement('div');
            this.element.style.position = 'fixed';
            this.element.style.top = '299px';
            this.element.style.left = '5px'; // Cambiado a la izquierda
            this.element.style.color = 'white';
            this.element.style.fontSize = '30px';
            this.element.style.textAlign = 'left'; // Alineación a la izquierda
            this.element.style.pointerEvents = 'none';
            document.body.appendChild(this.element);
            this.updateText();
        },

        // Función para retrasar la ejecución
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // Función principal para actualizar el CPS
        update: async function() {
            this.increase();
            await this.sleep(1000);
            this.reduce();
        }
    };

    // Crea el elemento CPS
    Cps.createElement();

    // Escucha los clics del ratón
    document.addEventListener('mousedown', () => {
        Cps.update();
    });

    // Controla la barra espaciadora
    let spaceActive = false;
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !spaceActive) {
            Cps.update();
            spaceActive = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            spaceActive = false;
        }
    });
})();
