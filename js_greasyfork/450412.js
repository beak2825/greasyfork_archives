// ==UserScript==
// @name         Quitar login modal de ABC color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Quitar el odioso modal de ABC color
// @author       Eduardo Morales @moralotto
// @match        https://www.abc.com.py/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/450412/Quitar%20login%20modal%20de%20ABC%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/450412/Quitar%20login%20modal%20de%20ABC%20color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para eliminar los elementos y la clase después de que la página se haya cargado completamente
    function removeElementsAndClass() {
        // Eliminar elementos con la clase .tp-backdrop
        var backdrops = document.querySelectorAll('.tp-backdrop');
        backdrops.forEach(function(backdrop) {
            backdrop.remove();
        });

        // Eliminar elementos con la clase .tp-modal
        var modals = document.querySelectorAll('.tp-modal');
        modals.forEach(function(modal) {
            modal.remove();
        });

        // Eliminar la clase .tp-modal-open de los elementos que la contengan
        var modalOpenElements = document.querySelectorAll('.tp-modal-open');
        modalOpenElements.forEach(function(element) {
            element.classList.remove('tp-modal-open');
        });
    }

    // Ejecutar la función después de que la página se haya cargado completamente
    //window.addEventListener('load', removeElementsAndClass);
    // Ejecutar la función cada segundo
    setInterval(removeElementsAndClass, 1000);
})();
