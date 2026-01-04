// ==UserScript==
// @name         Reemplazar Cámara con Galería
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cambia el campo de cámara para permitir subir archivos desde la galería.
// @author       TuNombre
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520396/Reemplazar%20C%C3%A1mara%20con%20Galer%C3%ADa.user.js
// @updateURL https://update.greasyfork.org/scripts/520396/Reemplazar%20C%C3%A1mara%20con%20Galer%C3%ADa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Busca todos los inputs de tipo archivo
    const inputs = document.querySelectorAll('input[type="file"]');
    inputs.forEach(input => {
        if (input.hasAttribute('capture')) {
            // Elimina el atributo "capture" para desactivar la cámara
            input.removeAttribute('capture');
        }
        // Opcional: agrega soporte para múltiples archivos (si aplica)
        input.setAttribute('multiple', 'false');
    });

    console.log('Se ha modificado el comportamiento del input de cámara.');
})();