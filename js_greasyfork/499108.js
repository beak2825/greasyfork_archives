// ==UserScript==
// @license Public
// @name         Toggle WhatsApp Sidebar Width
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Changes Whatsapp Web, contact size so it can be toggled on or off.
// @author       Atos
// @match        *://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499108/Toggle%20WhatsApp%20Sidebar%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/499108/Toggle%20WhatsApp%20Sidebar%20Width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para añadir el botón de toggle
    function addToggleButton() {
        // Crear el botón
        var toggleButton = document.createElement('button');
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.left = '10px';
        toggleButton.style.zIndex = '9999';
        toggleButton.style.width = '40px';
        toggleButton.style.height = '40px';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.backgroundColor = '#25D366'; // Color de WhatsApp
        toggleButton.style.border = 'none';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.justifyContent = 'center';

        // Crear el contenedor de las líneas
        var lineContainer = document.createElement('div');
        lineContainer.style.width = '20px';
        lineContainer.style.height = '20px';
        lineContainer.style.display = 'flex';
        lineContainer.style.flexDirection = 'column';
        lineContainer.style.justifyContent = 'space-around';

        // Crear las líneas
        for (var i = 0; i < 3; i++) {
            var line = document.createElement('div');
            line.style.width = '100%';
            line.style.height = '2px';
            line.style.backgroundColor = 'white';
            lineContainer.appendChild(line);
        }

        // Añadir el contenedor de líneas al botón
        toggleButton.appendChild(lineContainer);

        // Añadir el botón al body
        document.body.appendChild(toggleButton);

        // Establecer el estado inicial del botón
        toggleButton.setAttribute('data-state', 'open');

        // Añadir evento de click para cambiar el CSS
        toggleButton.addEventListener('click', function() {
            var style = document.createElement('style');
            style.type = 'text/css';

            if (toggleButton.getAttribute('data-state') === 'open') {
                style.innerHTML = `
                    @media screen {
                        .two ._aigw {
                            flex: 0 0 10% !important;
                            max-width: 10% !important;
                        }
                    }
                `;
                toggleButton.setAttribute('data-state', 'closed');
            } else {
                style.innerHTML = `
                    @media screen {
                        .two ._aigw {
                            flex: 0 0 40% !important;
                            max-width: 40% !important;
                        }
                    }
                `;
                toggleButton.setAttribute('data-state', 'open');
            }

            // Añadir el estilo al head del documento
            document.head.appendChild(style);
        });
    }

    // Esperar a que la página se cargue completamente
    window.addEventListener('load', function() {
        // Intenta añadir el botón cada segundo hasta que se encuentre el elemento
        var interval = setInterval(function() {
            addToggleButton();
            clearInterval(interval);
        }, 1000);

        // Detiene el intervalo después de 10 segundos
        setTimeout(function() {
            clearInterval(interval);
        }, 10000);
    });
})();
