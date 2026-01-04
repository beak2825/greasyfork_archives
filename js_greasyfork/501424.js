// ==UserScript==
// @name         AutoFill Microsoft Teams Quiz
// @namespace    https://tu-namespace-ejemplo.com
// @version      1.0
// @description  Autocompleta ciertos campos en los parciales de Microsoft Teams
// @author       Tu nombre o alias
// @match        https://teams.microsoft.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501424/AutoFill%20Microsoft%20Teams%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/501424/AutoFill%20Microsoft%20Teams%20Quiz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Espera a que el contenido de la página se cargue completamente
    window.addEventListener('load', function() {
        // Encuentra todos los campos de entrada en la página del parcial
        const inputs = document.querySelectorAll('input[type="text"], input[type="radio"], input[type="checkbox"]');

        // Rellena automáticamente las respuestas correctas
        inputs.forEach((input) => {
            if (input.type === 'text') {
                input.value = 'Respuesta correcta';
            } else if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = true;
            }
        });
    });
})();
