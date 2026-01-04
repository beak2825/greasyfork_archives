// ==UserScript==
// @name         Cambiar un color específico en Menéame
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cambia el color naranja (#ff6600) de Menéame a verde (#32cd32) y muestra un banner indicándolo.
// @author       Tu Nombre
// @match        https://www.meneame.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518990/Cambiar%20un%20color%20espec%C3%ADfico%20en%20Men%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/518990/Cambiar%20un%20color%20espec%C3%ADfico%20en%20Men%C3%A9ame.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Función para reemplazar colores específicos
    function reemplazarColor(colorOriginal, colorNuevo) {
        const elementos = document.querySelectorAll('*');

        elementos.forEach(el => {
            const estilo = window.getComputedStyle(el);

            // Cambiar color de fondo
            if (estilo.backgroundColor === colorOriginal) {
                el.style.backgroundColor = colorNuevo;
            }

            // Cambiar color de texto
            if (estilo.color === colorOriginal) {
                el.style.color = colorNuevo;
            }

            // Cambiar color de bordes
            if (estilo.borderColor === colorOriginal) {
                el.style.borderColor = colorNuevo;
            }
        });
    }

    // Mostrar un banner con el mensaje del cambio de color
    function mostrarBanner() {
        const banner = document.createElement('div');
        banner.textContent = 'El color naranja (#ff6600) se ha cambiado a verde (#32cd32).';
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = '#ff0000'; // Rojo para el banner
        banner.style.color = '#ffffff'; // Texto blanco
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.fontSize = '16px';
        banner.style.zIndex = '10000';
        banner.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';

        document.body.appendChild(banner);
    }

    // Ejecutar las funciones
    const colorOriginal = 'rgb(255, 102, 0)'; // Color naranja en formato RGB
    const colorNuevo = 'rgb(50, 205, 50)'; // Color verde en formato RGB

    reemplazarColor(colorOriginal, colorNuevo);
    mostrarBanner();
})();