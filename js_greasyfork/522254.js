// ==UserScript==
// @name         Lag Screen Drawaria.online
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Destroy Drawaria.online Using this script! :D
// @author       YouTube
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522254/Lag%20Screen%20Drawariaonline.user.js
// @updateURL https://update.greasyfork.org/scripts/522254/Lag%20Screen%20Drawariaonline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para forzar la visibilidad y habilitación de todos los elementos
    function forceAllElements() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            // Forzar display: block
            if (element.style.display === 'none' || element.style.display === '') {
                element.style.display = 'block';
            }
            // Forzar visibilidad
            if (element.style.visibility === 'hidden' || element.style.visibility === '') {
                element.style.visibility = 'visible';
            }
            // Eliminar el atributo disabled
            if (element.hasAttribute('disabled')) {
                element.removeAttribute('disabled');
            }
            // Forzar pointer-events: auto
            if (element.style.pointerEvents === 'none') {
                element.style.pointerEvents = 'auto';
            }
        });
    }

    // Observar cambios en el DOM para mantener los elementos visibles y funcionales
    const observer = new MutationObserver(forceAllElements);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // También puedes agregar un intervalo para asegurarte de que los elementos se mantengan visibles/funcionales
    setInterval(forceAllElements, 2000);
})();