// ==UserScript==
// @name         Monke
// @namespace    https://greasyfork.org/users/1145671-hipercubo
// @version      0.2.1
// @description  Monke see monke drive.
// @author       hipercubo
// @match        *://*.youtube.com/*
// @icon         https://i.imgur.com/HxXGDjn.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527731/Monke.user.js
// @updateURL https://update.greasyfork.org/scripts/527731/Monke.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Evita que el script se ejecute en iframes (solo en la ventana principal)
    if (window.top !== window.self) return;

    // Variables para el botón y los estilos
    let buttonDiv = null;
    let styleElement = null;
    let lastPath = null;

    // Precarga la imagen GIF para asegurar que esté disponible
    const preloadImage = new Image();
    preloadImage.src = 'https://i.imgur.com/ueO5MVZ.gif';

    // Función para crear o actualizar el botón
    function createButton() {
        const currentPath = window.location.pathname;
        console.log("Ruta actual:", currentPath);  // Mensaje de depuración

        // Si la ruta no ha cambiado, no hacemos nada
        if (currentPath === lastPath) return;
        lastPath = currentPath;

        // Elimina el botón y los estilos si ya existen
        if (buttonDiv) {
            buttonDiv.remove();
            buttonDiv = null;
        }
        if (styleElement) {
            styleElement.remove();
            styleElement = null;
        }

        // Verifica si estamos en la página de inicio o suscripciones
        if (!(currentPath === '/' || currentPath.startsWith('/feed/subscriptions'))) {
            console.log("No se cumple la condición para mostrar el botón.");
            return;
        }

        console.log("Creando el botón...");  // Mensaje de depuración

        // Crea el contenedor principal como un <a>
        buttonDiv = document.createElement('a');
        buttonDiv.className = 'monke';
        buttonDiv.href = 'https://www.youtube.com/watch?v=RZ_0ImDYrPY'; // URL del enlace

        // Crea el div para la imagen estática (PNG)
        const staticImage = document.createElement('div');
        staticImage.classList.add('static-image');
        buttonDiv.appendChild(staticImage);

        // Crea el div para el GIF animado
        const gifImage = document.createElement('div');
        gifImage.classList.add('gif-image');
        buttonDiv.appendChild(gifImage);

        // Crea y aplica los estilos del botón
        styleElement = document.createElement('style');
        styleElement.textContent = `
            .monke {
                display: block; /* Asegura que el <a> se comporte como un bloque */
                width: 100px;
                height: 100px;
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9999;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.8);
                opacity: 0.50;
                filter: grayscale(1);
                transition: opacity 0.2s ease, filter 0.2s ease, transform 0.2s ease;
            }

            .static-image, .gif-image {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 0;
                background-size: contain;
                background-repeat: no-repeat;
                filter: drop-shadow(0px 5px 10px #000000);
            }

            .static-image {
                background-image: url('https://i.imgur.com/xrW5aQU.png');
                opacity: 1;
                transition: opacity 0.2s ease;
            }

            .gif-image {
                background-image: url('https://i.imgur.com/ueO5MVZ.gif');
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .monke:hover .static-image {
                opacity: 0;
            }

            .monke:hover .gif-image {
                opacity: 1;
            }

            .monke:hover {
                opacity: 1;
                filter: grayscale(0);
                transform: scale(1.25);
                cursor: url(https://cdn.custom-cursor.com/db/pointer/32/Le_Monke_Meme_Pointer.png) , pointer !important;
            }
        `;

        // Agrega los estilos al head y el botón al body
        document.head.appendChild(styleElement);
        document.body.appendChild(buttonDiv);
        console.log("Botón creado y añadido al DOM."); // Confirmación
    }

    // Ejecuta la función al cargar el script
    createButton();

    // Verifica la URL cada 500 ms para detectar cambios más rápido
    setInterval(createButton, 500);
})();