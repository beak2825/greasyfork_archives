// ==UserScript==
// @name         Drawaria Enhanced Ratedrawerbox
// @namespace    http://tampermonkey.net/
// @version      2024-12-28
// @description  Mantiene el elemento #ratedrawerbox siempre visible, activo y clickeable, incluso si estás prohibido de dibujar, y permite su reutilización
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522140/Drawaria%20Enhanced%20Ratedrawerbox.user.js
// @updateURL https://update.greasyfork.org/scripts/522140/Drawaria%20Enhanced%20Ratedrawerbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para asegurar que #ratedrawerbox esté siempre visible y activo
    function ensureRatedrawerboxVisibility() {
        const ratedrawerbox = document.getElementById('ratedrawerbox');
        if (ratedrawerbox) {
            ratedrawerbox.style.display = 'block';
            ratedrawerbox.style.visibility = 'visible';
            ratedrawerbox.style.pointerEvents = 'auto';
        }
    }

    // Función para interceptar y modificar el comportamiento del botón ratedrawerbox
    function interceptRatedrawerboxButton() {
        const ratedrawerboxButton = document.querySelector('.ratedrawerbox-button');
        if (ratedrawerboxButton) {
            ratedrawerboxButton.style.display = 'block';
            ratedrawerboxButton.style.visibility = 'visible';
            ratedrawerboxButton.style.pointerEvents = 'auto';

            ratedrawerboxButton.addEventListener('click', function() {
                // Forzar el uso del ratedrawerbox
                window.Hr("sendratedraw");
                window.Po(window.h, "ratedrawerbox", 60);

                // Restablecer el ratedrawerbox a su estado original después de un breve retraso
                setTimeout(function() {
                    const ratedrawerbox = document.getElementById('ratedrawerbox');
                    if (ratedrawerbox) {
                        ratedrawerbox.style.display = 'block';
                        ratedrawerbox.style.visibility = 'visible';
                        ratedrawerbox.style.pointerEvents = 'auto';
                    }
                }, 100); // Ajusta el retraso según sea necesario
            });

            // Asegurar que el evento de clic se detecte correctamente
            ratedrawerboxButton.click();
        }
    }

    // Función principal para ejecutar todas las funciones
    function enhanceRatedrawerbox() {
        ensureRatedrawerboxVisibility();
        interceptRatedrawerboxButton();
    }

    // Ejecutar la función principal inicialmente
    enhanceRatedrawerbox();

    // Observar cambios en el DOM para mantener el ratedrawerbox visible y activo
    const observer = new MutationObserver(enhanceRatedrawerbox);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // También puedes agregar un intervalo para asegurarte de que el ratedrawerbox se mantenga visible/activo
    setInterval(enhanceRatedrawerbox, 1000);
})();
