// ==UserScript==
// @name         Limpieza Avanzada de URLs de Google
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Limpia los parámetros innecesarios de las URLs de Google y maneja búsquedas dinámicas de forma eficiente.
// @author       Francisco
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524503/Limpieza%20Avanzada%20de%20URLs%20de%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/524503/Limpieza%20Avanzada%20de%20URLs%20de%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista blanca configurable de parámetros que deben permanecer
    const parametrosPermitidos = ['q', 'tbm', 'ei']; // Puedes agregar más parámetros aquí si los necesitas

    // Limpiar la URL eliminando parámetros no deseados
    function limpiarURL(url) {
        let urlObj = new URL(url);
        let params = urlObj.searchParams;

        // Elimina parámetros no permitidos
        params.forEach((value, key) => {
            if (!parametrosPermitidos.includes(key)) {
                params.delete(key);
            }
        });

        return urlObj.origin + urlObj.pathname + '?' + params.toString();
    }

    // Actualizar la URL si es necesario
    function actualizarSiEsNecesario() {
        let urlActual = location.href;
        let urlLimpia = limpiarURL(urlActual);

        // Solo actualiza si la URL ha cambiado
        if (urlActual !== urlLimpia) {
            window.history.replaceState(null, '', urlLimpia);
        }
    }

    // Limpieza inicial
    actualizarSiEsNecesario();

    // Detectar cambios dinámicos en la página
    const observador = new MutationObserver(() => {
        actualizarSiEsNecesario();
    });

    observador.observe(document.body, { childList: true, subtree: true });
})();


