// ==UserScript==
// @name         Control Dado de Google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fuerza el dado de Google a mostrar un número específico
// @match        *://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516298/Control%20Dado%20de%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/516298/Control%20Dado%20de%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cambia el número aquí
    const numeroFijo = 6;

    // Busca el elemento del número del dado y lo cambia
    const observer = new MutationObserver(() => {
        const elementoNumero = document.querySelector('[role="result"]');
        if (elementoNumero && elementoNumero.textContent !== numeroFijo.toString()) {
            elementoNumero.textContent = numeroFijo;
        }
    });

    // Inicia el observador en el cuerpo del documento
    observer.observe(document.body, { childList: true, subtree: true });
})();
