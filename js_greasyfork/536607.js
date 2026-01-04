// ==UserScript==
// @name         Drawaria More Color Palettes!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds 6 extra color buttons to Drawaria.online.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536607/Drawaria%20More%20Color%20Palettes%21.user.js
// @updateURL https://update.greasyfork.org/scripts/536607/Drawaria%20More%20Color%20Palettes%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NEW_COLORS = [
        { name: "Teal", hex: "#008080" },
        { name: "Lime", hex: "#AAFF00" },
        { name: "Cyan", hex: "#00FFFF" },
        { name: "Magenta", hex: "#FF00FF" },
        { name: "Olive", hex: "#808000" },
        { name: "Maroon", hex: "#800000" }
    ];

    const style = document.createElement('style');
    style.textContent = `
        #drawcontrols {
            flex-wrap: wrap; /* Permite que los botones se envuelvan si son demasiados */
            /* position: relative; /* Puede ser necesario si el triángulo es nuevo y absoluto */
        }
        .drawcontrols-button.custom-color-button {
            box-shadow: 0 0 2px rgba(0,0,0,0.3);
        }
        .drawcontrols-button.custom-color-button.custom-active-color {
            box-shadow: 0 0 5px 2px #007bff; /* Resaltado para color personalizado activo */
            border: 1px solid #007bff;
        }
        #colorpicker-cursor { /* Selector para el triángulo del juego */
            transition: left 0.1s ease-out; /* Transición suave para el movimiento del triángulo */
        }
    `;
    document.head.appendChild(style);

    let gameTriangleElement = null;

    function findGameTriangle() {
        if (gameTriangleElement && document.body.contains(gameTriangleElement)) {
            return gameTriangleElement;
        }
        // El ID del triángulo en Drawaria parece ser 'colorpicker-cursor'
        // y es hijo de '#drawcontrols-colors'
        gameTriangleElement = document.getElementById('colorpicker-cursor');
        if (gameTriangleElement) {
            // Asegurar que el juego ya lo posiciona absolutamente o relativamente de forma adecuada
            // gameTriangleElement.style.position = 'absolute'; // El juego ya debería hacer esto
            // gameTriangleElement.style.top = '-8px'; // Ajustar si es necesario, el juego ya debería tener un 'top'
        }
        return gameTriangleElement;
    }

    function updateTrianglePosition(targetButton) {
        const triangle = findGameTriangle();
        if (!triangle || !targetButton) {
            // console.log("Triángulo o botón objetivo no encontrado para actualizar posición.");
            return;
        }

        // El contenedor de referencia para 'left' del triángulo es '#drawcontrols-colors'
        const buttonContainer = document.getElementById('drawcontrols-colors') || document.getElementById('drawcontrols');
        if (!buttonContainer) {
            // console.log("Contenedor de botones no encontrado.");
            return;
        }

        const buttonRect = targetButton.getBoundingClientRect();
        const containerRect = buttonContainer.getBoundingClientRect();

        // Calcular el centro del botón relativo al contenedor de botones
        const buttonCenterRelativeToContainer = (buttonRect.left - containerRect.left) + (buttonRect.width / 2);

        // Calcular la nueva posición 'left' del triángulo para centrarlo
        const triangleWidth = triangle.offsetWidth || 8; // El triángulo del juego es pequeño, aprox. 8-10px
        const newLeft = buttonCenterRelativeToContainer - (triangleWidth / 2);

        triangle.style.left = `${newLeft}px`;
        // console.log(`Triángulo movido a: ${newLeft}px para el botón ID: ${targetButton.id}`);
    }

    function addCustomColors() {
        const drawControlsContainer = document.getElementById('drawcontrols');
        if (!drawControlsContainer) return false;

        const actualButtonContainer = document.getElementById('drawcontrols-colors') || drawControlsContainer;

        if (document.getElementById('custom-color-teal')) return true; // Ya inicializado

        // El botón del selector de color original, para insertar antes de él
        const colorPickerButtonOriginal = actualButtonContainer.querySelector('.drawcontrols-colorpicker');
        const proxyGameButton = actualButtonContainer.querySelector('.drawcontrols-button.drawcontrols-color:not(.drawcontrols-colorpicker)');

        if (!proxyGameButton) {
            console.error("Drawaria Extra Colors: Botón proxy del juego no encontrado.");
            return false;
        }

        findGameTriangle(); // Intentar encontrar el triángulo del juego pronto

        NEW_COLORS.forEach(colorInfo => {
            const newButton = document.createElement('div');
            newButton.className = 'drawcontrols-button drawcontrols-color custom-color-button';
            newButton.style.backgroundColor = colorInfo.hex;
            newButton.dataset.ctrlgroup = 'color'; // Para que el juego lo reconozca como un control de color
            newButton.title = colorInfo.name;
            newButton.id = `custom-color-${colorInfo.name.toLowerCase()}`;

            newButton.addEventListener('click', function(event) {
                const originalProxyColor = proxyGameButton.style.backgroundColor;
                proxyGameButton.style.backgroundColor = this.style.backgroundColor;

                // Simular clic en el botón proxy
                proxyGameButton.click();

                // Después de que el juego mueva el triángulo (al botón proxy),
                // nosotros lo movemos a nuestro botón personalizado.
                requestAnimationFrame(() => {
                    proxyGameButton.style.backgroundColor = originalProxyColor; // Restaurar color visual del proxy
                    updateTrianglePosition(this); // Mover el triángulo a NUESTRO botón
                });

                // Gestionar el estado activo visual de nuestros botones personalizados
                document.querySelectorAll('.custom-color-button.custom-active-color').forEach(btn => {
                    btn.classList.remove('custom-active-color');
                });
                this.classList.add('custom-active-color');

                // El juego debería quitar el resaltado de sus propios botones (excepto el proxy momentáneamente)
                // cuando el color cambia a través del proxy.
            });

            if (colorPickerButtonOriginal) {
                actualButtonContainer.insertBefore(newButton, colorPickerButtonOriginal);
            } else {
                actualButtonContainer.appendChild(newButton);
            }
        });

        // Añadir listeners a los botones de color originales del juego
        actualButtonContainer.querySelectorAll('.drawcontrols-button.drawcontrols-color:not(.custom-color-button):not(.drawcontrols-colorpicker)').forEach(gameBtn => {
            gameBtn.addEventListener('click', function() {
                // Cuando se hace clic en un botón original, quitar el estado activo de nuestros botones personalizados
                document.querySelectorAll('.custom-color-button.custom-active-color').forEach(customBtn => {
                    customBtn.classList.remove('custom-active-color');
                });
                // El juego se encargará de mover su triángulo.
                // Podríamos forzar una actualización si fuera necesario, pero es mejor dejar que el juego lo maneje.
                // requestAnimationFrame(() => {
                //     updateTrianglePosition(this); // O mejor, dejar que el juego lo haga.
                // });
            });
        });

        // Si se usa el color picker del juego, también limpiar nuestros botones activos
        if (colorPickerButtonOriginal) {
            // Necesitaríamos observar cambios en el color picker o cuando se selecciona un color de él.
            // Esto es más complejo. Una solución simple es que cuando se selecciona un color del picker,
            // el triángulo se moverá allí, y nuestros botones personalizados perderán su "custom-active-color"
            // si el proxy no fue el último clickeado. Por ahora, el click en un botón original lo maneja.
        }


        console.log("Drawaria Extra Colors: Botones personalizados añadidos con lógica de triángulo.");
        return true;
    }

    const observer = new MutationObserver((mutationsList, observerInstance) => {
        const targetContainer = document.getElementById('drawcontrols-colors') || document.getElementById('drawcontrols');
        if (targetContainer && targetContainer.querySelector('.drawcontrols-button.drawcontrols-color')) {
            if (addCustomColors()) {
                observerInstance.disconnect();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    let attempts = 0;
    const intervalID = setInterval(() => {
        attempts++;
        if (addCustomColors() || attempts > 60) { // Intentar durante ~6 segundos
            clearInterval(intervalID);
        }
    }, 100);

})();