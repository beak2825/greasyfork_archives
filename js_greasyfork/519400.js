// ==UserScript==
// @name         Menéame - Abrir y mantener abierto el desplegable de "Ordenar Comentarios"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Abre y mantiene abierto el desplegable de "Ordenar Comentarios" en Menéame.
// @author       Tu nombre
// @match        https://www.meneame.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519400/Men%C3%A9ame%20-%20Abrir%20y%20mantener%20abierto%20el%20desplegable%20de%20%22Ordenar%20Comentarios%22.user.js
// @updateURL https://update.greasyfork.org/scripts/519400/Men%C3%A9ame%20-%20Abrir%20y%20mantener%20abierto%20el%20desplegable%20de%20%22Ordenar%20Comentarios%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para abrir y mantener abierto el desplegable de "Ordenar Comentarios"
    function openAndKeepSortCommentsMenu() {
        // Encontramos el contenedor del desplegable de orden de comentarios
        const sortDropdownButton = document.querySelector('.comments-sort button.dropdown-toggle');

        // Si encontramos el botón del desplegable
        if (sortDropdownButton) {
            // Simulamos un clic en el botón para abrir el menú
            sortDropdownButton.click();

            // Buscamos el contenedor del menú desplegable
            const dropdownMenu = document.querySelector('.comments-sort .dropdown-menu');

            // Si encontramos el menú desplegable, lo mantenemos abierto
            if (dropdownMenu) {
                dropdownMenu.style.display = 'block'; // Aseguramos que el menú se mantenga visible
                dropdownMenu.classList.add('show');   // Aseguramos que la clase 'show' esté presente
            }
        } else {
            console.log('No se encontró el desplegable de "Ordenar Comentarios"');
        }
    }

    // Esperamos un segundo para asegurarnos de que la página cargue antes de intentar abrir el desplegable
    window.addEventListener('load', function() {
        setTimeout(openAndKeepSortCommentsMenu, 1000); // Esperar 1 segundo antes de intentar abrir el menú
    });
})();