// ==UserScript==
// @name         Cambiar Maxlength
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cambia el atributo maxlength del elemento input
// @author       Juanan
// @license MIT
// @match        http://10.201.4.105:8098/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477094/Cambiar%20Maxlength.user.js
// @updateURL https://update.greasyfork.org/scripts/477094/Cambiar%20Maxlength.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkForChanges() {
        var inputElement = document.getElementById('bpedido');
        if (inputElement && inputElement.getAttribute('maxlength') !== '350') {
            inputElement.setAttribute('maxlength', '350');
        }
    }

    // Espera 5 segundos antes de comenzar el polling
    setTimeout(function() {
        setInterval(checkForChanges, 1000); // revisa cada segundo
    }, 5000);
})();