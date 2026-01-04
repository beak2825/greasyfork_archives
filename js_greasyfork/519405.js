// ==UserScript==
// @name         Modificar Clase en MundoGO
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cambia la clase de un div específico en MundoGO
// @author       Krou705
// @match        https://www.mundogo.cl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519405/Modificar%20Clase%20en%20MundoGO.user.js
// @updateURL https://update.greasyfork.org/scripts/519405/Modificar%20Clase%20en%20MundoGO.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        const div = document.querySelector('div.height-100.blur');
        if (div) {
            div.setAttribute('class', '0');
            console.log("La clase del div ha sido modificada a '0'.");
        } else {
            console.log("No se encontró ningún div con la clase 'height-100 blur'.");
        }
    });
})();
