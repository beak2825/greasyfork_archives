// ==UserScript==
// @name         Show Full Description
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Añade un botón para mostrar completamente el texto truncado en descripciones de perfil.
// @author       Tú
// @match        https://www.xvideos.com/profiles/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516449/Show%20Full%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/516449/Show%20Full%20Description.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Encuentra todos los elementos que contienen las descripciones truncadas
    const descriptions = document.querySelectorAll('.p-postcomment.overflowing');

    descriptions.forEach((description) => {
        // Crea el botón para expandir el texto
        const button = document.createElement('button');
        button.innerText = 'Mostrar más';
        button.style.margin = '5px';
        button.style.cursor = 'pointer';

        // Añade el botón antes del texto truncado
        description.parentNode.insertBefore(button, description);

        // Evento de clic para mostrar el texto completo
        button.addEventListener('click', () => {
            description.style.webkitLineClamp = 'unset'; // Remueve el límite de líneas
            description.style.overflow = 'visible';      // Hace visible el contenido completo
            button.style.display = 'none';               // Oculta el botón después de expandir
        });
    });
})();
