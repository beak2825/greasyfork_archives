// ==UserScript==
// @name         Obtener llave y Contar Clases M
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Obtener llave mediante las mayúsculas y contar clases M
// @author       Sebastián González
// @match        https://cripto.tiiny.site/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479505/Obtener%20llave%20y%20Contar%20Clases%20M.user.js
// @updateURL https://update.greasyfork.org/scripts/479505/Obtener%20llave%20y%20Contar%20Clases%20M.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para obtener llave
    function obtenerLlave() {
        const contenido = document.body.innerText;
        const regex = /(?:^|[.!?]\s)([A-ZÁÉÍÓÚÑ])/g;
        let matches;
        const mayusculasEncontradas = [];

        while ((matches = regex.exec(contenido)) !== null) {
            mayusculasEncontradas.push(matches[1]);
        }

        if (mayusculasEncontradas.length > 0) {
            const mayusculasUnicas = mayusculasEncontradas.join('');

            console.log('La llave es:', mayusculasUnicas);
        } else {
            console.log('No se encontró la llave.');
        }
    }

    // Función para contar mensajes cifrados
    function contarMcifrados() {
        const divsConClasesM = document.querySelectorAll('div[class^="M"]');
        const cantidadDivs = divsConClasesM.length;

        console.log(`Los mensajes cifrados son: ${cantidadDivs}`);
    }

    // Llamar a ambas funciones al cargar la página
    window.addEventListener('load', () => {
        obtenerLlave();
        contarMcifrados();
    });
})();