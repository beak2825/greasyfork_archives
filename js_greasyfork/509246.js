// @license MIT
// ==UserScript==
// @name         Azure DevOps Backlog Colorizer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Cambia el color de las filas en el backlog de Azure DevOps según el estado del trabajo
// @author       Tu nombre
// @match        https://dev.azure.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509246/Azure%20DevOps%20Backlog%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/509246/Azure%20DevOps%20Backlog%20Colorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función que revisa el estado y aplica el color correspondiente a toda la fila
    function applyCustomColors() {
        // Seleccionar las filas en el backlog
        const backlogItems = document.querySelectorAll('.wit-tr'); // Selección de las filas de trabajo

        backlogItems.forEach(item => {
            // Busca la columna o el elemento que contiene el estado de la tarea
            const stateElement = item.querySelector('.work-item-state-cell');

            if (stateElement) {
                const state = stateElement.textContent.trim().toLowerCase(); // Obtener el estado y normalizar

                // Aplica el color a toda la fila según el estado
                if (state === 'new') {
                    item.style.backgroundColor = 'yellow'; // Estado "Nuevo" -> Amarillo
                } else if (state === 'active') {
                    item.style.backgroundColor = 'blue'; // Estado "Activo" -> Azul
                } else if (state === 'resolved') {
                    item.style.backgroundColor = 'green'; // Estado "Resuelto" -> Verde
                } else if (state === 'closed') {
                    item.style.backgroundColor = 'green'; // Estado "Cerrado" -> Verde
                }
            }
        });
    }

    // Espera que el contenido cargue completamente
    setTimeout(applyCustomColors, 2000); // Espera 2 segundos para asegurarse que todo esté cargado

    // Observador para aplicar colores cuando haya cambios en la página (scroll, cambios de página, etc.)
    const observer = new MutationObserver(() => {
        applyCustomColors();
    });

    // Observar el backlog para detectar cambios
    const backlogContainer = document.querySelector('.backlog-container');
    if (backlogContainer) {
        observer.observe(backlogContainer, { childList: true, subtree: true });
    }
})();