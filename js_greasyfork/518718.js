// ==UserScript==
// @name         Cursos UDV - Arreglar Notificaciones
// @description  Este script me sirve para arreglar las notificaciones que no aparecen los iconos
// @version      2.0.0

// @author       Fernando Barrios (https://github.com/jfernandogt)
// @match        https://www.cursos.udv.edu.gt/*
// @match        https://cursos.udv.edu.gt/*
// @run-at       document-start
// @license      MIT; https://opensource.org/licenses/MIT

// @namespace    https://udv.edu.gt
// @icon         https://cursos.udv.edu.gt/pluginfile.php/1/theme_snap/favicon/1731474836/favicon%2520%25288%2529.ico

// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518718/Cursos%20UDV%20-%20Arreglar%20Notificaciones.user.js
// @updateURL https://update.greasyfork.org/scripts/518718/Cursos%20UDV%20-%20Arreglar%20Notificaciones.meta.js
// ==/UserScript==

/*
    Author: Put your name here.
    Github: Put your GitHub repository URL or GitHub user page here.
    Discord: Put your discord server support URL or your discord username here. 
    Greasyfork: Put your Greasyfork profile page URL here.
    Ko-fi: Put your ko-fi donation URL here.
    Website: Put your website URL here. (One you own or made.)
*/

(function() {
    'use strict';

    GM_addStyle(".description img {display: none !important;}");

    GM_addStyle("iframe {display: none !important;}");
  
    const iframes = document.querySelectorAll('iframe');

    window.addEventListener('load', function() {
        // Seleccionar todos los elementos iframe
        const iframes = document.querySelectorAll('iframe');

        // Iterar sobre cada iframe
        iframes.forEach(iframe => {
            // Obtener el elemento padre del iframe
            const parent = iframe.parentNode;

            // Eliminar el elemento padre del DOM
            if (parent) {
                parent.remove();
            }
        });
    });


})();