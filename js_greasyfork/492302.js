// ==UserScript==
// @name         Menéame 100% ancho - versión 2024
// @namespace    http://meneame.net/
// @version      0.4
// @description  Modifica *.meneame.net de forma que el contenido aprovecha toda la pantalla y elmina algunas distracciones
// @author       Sergio A.
// @match        *://*.meneame.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492302/Men%C3%A9ame%20100%25%20ancho%20-%20versi%C3%B3n%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/492302/Men%C3%A9ame%20100%25%20ancho%20-%20versi%C3%B3n%202024.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Función para insertar estilos que anulan los elementos no deseados
    function insertOverrideStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #wrap {
                max-width: none !important;
            }
            .mnm-center-in-wrap {
                width: auto !important;
                margin: 0 !important;
            }

            #newsletter {
                display: none !important;
            }

            #incontent_1 {
                display: none !important;
            }

            #widget-popular {
                display: none !important;
            }

            .ads-interlinks {
                display: none !important;
            }

            #live-window {
                display: none !important;
            }

            #sidebar {
                display: none !important;
            }

            #newswrap {
                margin: 0 !important;
            }

            ul#userinfo {
               position: absolute !important;
               right: 0 !important;
            }

        `;
        document.head.appendChild(style);
    }

    // Observa cambios en el DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (!mutation.addedNodes) return;

            // Verifica si el estilo ya fue añadido, para no duplicarlo
            if (!document.querySelector('style#customOverrideStyles')) {
                insertOverrideStyles();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Insertamos los estilos inmediatamente en caso de que los nodos relevantes ya estén en el DOM
    insertOverrideStyles();
})();