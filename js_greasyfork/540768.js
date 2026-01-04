// ==UserScript==
// @name         MZ - Cambiar Fuente y Fondos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cambia la fuente, elimina imágenes de fondo y ajusta estilos en ManagerZone
// @license      oz
// @match        https://www.managerzone.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540768/MZ%20-%20Cambiar%20Fuente%20y%20Fondos.user.js
// @updateURL https://update.greasyfork.org/scripts/540768/MZ%20-%20Cambiar%20Fuente%20y%20Fondos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aplicar los estilos con GM_addStyle
    GM_addStyle(`
        /* Cambiar la fuente en toda la web */
        body, table, div, span, p, h1, h2, h3, h4, h5, h6, a, td, th, input, button {
            font-family: 'Arial', sans-serif !important;
        }

        /* Ajustar el tamaño de la fuente */
        body {
            font-size: 12px !important;
        }

        /* Eliminar las imágenes de fondo y aplicar color sólido */
        body {
            background-image: none !important;
            background-color: #000000 !important;
        }

        /* Si las imágenes de fondo se aplican a otras áreas */
        #page-wrapper, .content-wrapper, .main-container {
            background-color: #000000 !important;
        }

        /* Modificar el top-wrapper */
        #top-wrapper {
            background-image: none !important;
            background-color: #333 !important;
            background-position: center bottom;
            background-size: cover;
            border-bottom: 4px solid rgba(0, 0, 0, 0.5);
            margin: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
        }

        /* Modificar la apariencia del footer */
        #footer-placeholder {
            background-image: none !important;
            background-color: #333 !important;
            border-top: 4px solid rgba(0, 0, 0, 0.5) !important;
            padding: 0 !important;
            height: 50px !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
            position: relative !important;
        }

        /* Eliminar el contenido original del footer */
        #footer-placeholder * {
            display: none !important;
        }

        /* Añadir la Sport Line en la parte superior */
        #top-wrapper-sport-line {
            width: 100% !important;
            height: 4px !important;
            background-color: #8cbc25 !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
        }
    `);
})();
