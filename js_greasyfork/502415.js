// ==UserScript==
// @name        Asistente - Foro De Paz
// @namespace   Violentmonkey Scripts
// @match        *://studio.soulmachines.cloud/*
// @grant       none
// @version     2.0
// @license     MIT
// @author      Yisus Salas
// @icon        https://i.ibb.co/NycW2nv/pngwing-com.png
// @description 1/8/2024, 22:41:44
// @downloadURL https://update.greasyfork.org/scripts/502415/Asistente%20-%20Foro%20De%20Paz.user.js
// @updateURL https://update.greasyfork.org/scripts/502415/Asistente%20-%20Foro%20De%20Paz.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function modificarYBorrarElementos() {
        // Selectores que el script tiene que borrar :D
        const selectoresABorrar = [
            "body > app-root > div > app-project-edit > studio-sidebar-content-layout > aside > app-project-edit-sidebar > studio-sidebar",
            "body > app-root > div > app-project-edit > studio-sidebar-content-layout > main > div > app-project-edit-form > form > div",
            "body > app-root > div > app-project-edit > studio-sidebar-content-layout > main > div > app-project-edit-form",
            "body > app-root > div > app-project-edit > studio-sidebar-content-layout > aside",
            "body > app-root > header > app-navbar",
        ];
        selectoresABorrar.forEach(selector => {
            const elemento = document.querySelector(selector);
            if (elemento) {
                elemento.remove();
            }
        });
        // Selectores que el script tiene que modificar :D
        const selectorAModificar = "body > app-root > div > app-project-edit > studio-sidebar-content-layout > main > div";
        const elementoAModificar = document.querySelector(selectorAModificar);
        if (elementoAModificar) {
            elementoAModificar.style.width = "100%";
            elementoAModificar.style.height = "100vh";
            elementoAModificar.style.minWidth = "1920px";
            elementoAModificar.style.minHeight = "1080px";
            elementoAModificar.style.margin = "auto";
            elementoAModificar.style.overflow = "auto";
        }
        // Modificación Del CSS
        const projectEditContent = document.querySelector('.project-edit-content');
        if (projectEditContent) {
            projectEditContent.style.removeProperty('display');
        }
        const style = document.createElement('style');
        style.textContent = `
            .project-video-container {
                position: sticky;
                top: 5.875rem;
                width: 100%;
                height: 100%;
            }
        `;
        document.head.appendChild(style);

        // Cambiar el texto del botón de "Update preview" a "Actualizar"
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim() === 'Update preview') {
                button.textContent = 'Actualizar';
            }
        });
    }
    // Extra para cargar todo cuando la pagina cargue bien
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", modificarYBorrarElementos);
    } else {
        modificarYBorrarElementos();
    }
    // Ejecutar la función cada segundo por si los elementos se cargan dinámicamente
    setInterval(modificarYBorrarElementos, 1000);
})();