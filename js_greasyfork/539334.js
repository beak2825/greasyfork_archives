// ==UserScript==
// @name         Drawaria Switch 2 Frame Games
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Adds the Switch 2 frame and precisely hides the featured projects and footer on TurboWarp.
// @author       YouTubeDrawaria
// @match        https://scratch.mit.edu/*
// @match        https://turbowarp.org/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539334/Drawaria%20Switch%202%20Frame%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/539334/Drawaria%20Switch%202%20Frame%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // El enlace directo a la imagen que proporcionaste.
    const userLogoUrl = 'https://i.ibb.co/Mk7fTr0r/official-nintendo-switch-2-logo-with-and-without-background-v0-8tr456obbfde1.webp';

    GM_addStyle(`
        /* --- ESTILOS DEL MARCO Y LOGO (Sin cambios) --- */
        .switch-frame-bar {
            position: fixed;
            background-color: #E60012;
            z-index: 99998;
            pointer-events: none;
        }
        #switch-frame-top { top: 0; left: 0; width: 100%; height: 15px; }
        #switch-frame-bottom { bottom: 0; left: 0; width: 100%; height: 15px; }
        #switch-frame-left { top: 0; left: 0; width: 15px; height: 100%; }
        #switch-frame-right { top: 0; right: 0; width: 15px; height: 100%; }

        #switch-logo-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 110px;
            background-color: #E60012;
            z-index: 99999;
            border-bottom-right-radius: 40px;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #switch-logo-image {
            width: 100%;
            height: 100%;
            background-image: url('${userLogoUrl}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        /* --- REGLAS PRECISAS PARA OCULTAR ELEMENTOS DE TURBOWARP --- */

        /* Oculta los contenedores de "proyectos destacados", texto y otros elementos.
           Usa [class^="..."] para que funcione aunque los códigos de las clases cambien. */
        div[class^="interface_section"] {
            display: none !important;
        }

div[class^="menu-bar_main-menu_3wjWH"] {
            display: none !important;
        }

        /* Oculta el pie de página (footer) completo. */
        footer[class^="interface_footer"] {
            display: none !important;
        }
    `);

    // La lógica para crear el marco no necesita cambios.
    document.addEventListener('DOMContentLoaded', () => {
        const frameContainer = document.createElement('div');
        frameContainer.id = 'switch-frame-root';

        frameContainer.innerHTML = `
            <div id="switch-frame-top" class="switch-frame-bar"></div>
            <div id="switch-frame-bottom" class="switch-frame-bar"></div>
            <div id="switch-frame-left" class="switch-frame-bar"></div>
            <div id="switch-frame-right" class="switch-frame-bar"></div>

            <div id="switch-logo-wrapper">
                <div id="switch-logo-image"></div>
            </div>
        `;
        document.body.appendChild(frameContainer);
    });

})();