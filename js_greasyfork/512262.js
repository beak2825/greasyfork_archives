// ==UserScript==
// @name         Rainbow Drawaria Colors
// @namespace    http://tampermonkey.net/
// @version      2024-10-11
// @description  The best rainbow mode for drawaria !
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512262/Rainbow%20Drawaria%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/512262/Rainbow%20Drawaria%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para generar un color aleatorio en formato RGB
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Función para cambiar los colores de la página
    function changeColors() {
        // Seleccionar todos los elementos de la página
        const elements = document.querySelectorAll('*');

        // Cambiar el color de fondo y texto de cada elemento
        elements.forEach(element => {
            element.style.backgroundColor = getRandomColor();
            element.style.color = getRandomColor();
        });
    }

    // Cambiar los colores cada segundo
    setInterval(changeColors, 3000);
})();