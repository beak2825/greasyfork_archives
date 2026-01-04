// ==UserScript==
// @name         Filtro de Contenido Reddit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Oculta elementos en Reddit que contengan palabras clave o enlaces específicos.
// @author       dani7115
// @match        https://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526193/Filtro%20de%20Contenido%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/526193/Filtro%20de%20Contenido%20Reddit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Lista de palabras clave o enlaces que deseas ocultar
    const palabrasClave = ['spoiler', 'palabra2', 'palabra3'];
    const enlacesProhibidos = ['http://ejemplo.com', 'https://otroenlace.com'];

    // Función para ocultar elementos basados en su contenido
    function ocultarElementos() {
        // Seleccionar todos los elementos de texto relevantes (títulos, comentarios, etc.)
        document.querySelectorAll('.Post, .Comment').forEach(elemento => {
            const texto = elemento.innerText.toLowerCase();

            // Verificar si el texto contiene alguna palabra clave
            if (palabrasClave.some(palabra => texto.includes(palabra))) {
                elemento.style.display = 'none'; // Ocultar el elemento
            }

            // Verificar si el texto contiene algún enlace prohibido
            if (enlacesProhibidos.some(enlace => texto.includes(enlace))) {
                elemento.style.display = 'none'; // Ocultar el elemento
            }
        });
    }

    // Observador de mutaciones para detectar cambios en el DOM
    const observer = new MutationObserver(() => {
        ocultarElementos();
    });

    // Configuración del observador
    const config = { childList: true, subtree: true };

    // Iniciar el observador en el cuerpo del documento
    observer.observe(document.body, config);

    // Ejecutar la función inicialmente para procesar el contenido ya cargado
    ocultarElementos();
})();