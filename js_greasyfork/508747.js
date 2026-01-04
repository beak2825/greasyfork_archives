// ==UserScript==
// @name         Click on "Tema scuro: attivato"figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      0.1
// @description  Clicca automaticamente su "Tema scuro: disattivato"
// @author       figuccio
// @match        https://*.google.it/*
// @icon         https://www.google.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508747/Click%20on%20%22Tema%20scuro%3A%20attivato%22figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/508747/Click%20on%20%22Tema%20scuro%3A%20attivato%22figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Funzione per cercare e cliccare sull'elemento
    function clickOnDarkTheme() {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            if (element.textContent.includes('Tema scuro: disattivato')) {
                element.click();
            }
        });
    }

    // Esegui la funzione al caricamento della pagina
    window.addEventListener('load', clickOnDarkTheme);
})();
