// ==UserScript==
// @name         Rotar pantalla en pantalla completa
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Rota la pantalla a orientación horizontal cuando se reproduce un video en pantalla completa
// @author       Shakazzz
// @license      CC BY
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491489/Rotar%20pantalla%20en%20pantalla%20completa.user.js
// @updateURL https://update.greasyfork.org/scripts/491489/Rotar%20pantalla%20en%20pantalla%20completa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previousOrientation = null;

    // Función para rotar la pantalla a orientación horizontal
    function rotateToHorizontal() {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").then(() => {
                console.log("Pantalla rotada a horizontal");
            }).catch((error) => {
                console.error("Error al rotar la pantalla:", error);
            });
        } else {
            console.warn("El navegador no soporta el bloqueo de orientación");
        }
    }

    // Comprobar si el video está en pantalla completa y en orientación horizontal
    function checkFullScreen() {
        let isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

        if (isFullScreen) {
            let currentOrientation = screen.orientation ? screen.orientation.type : (screen.mozOrientation || screen.msOrientation || screen.orientation);
            
            if (currentOrientation !== "landscape-primary" && currentOrientation !== "landscape-secondary") {
                rotateToHorizontal();
            }
        } else {
            // Restaurar la orientación anterior cuando se salga de pantalla completa
            if (previousOrientation) {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock(previousOrientation).then(() => {
                        console.log("Restaurada la orientación anterior");
                    }).catch((error) => {
                        console.error("Error al restaurar la orientación:", error);
                    });
                }
            }
        }
    }

    // Escuchar eventos de cambio de pantalla completa
    document.addEventListener('fullscreenchange', checkFullScreen);
    document.addEventListener('webkitfullscreenchange', checkFullScreen);
    document.addEventListener('mozfullscreenchange', checkFullScreen);
    document.addEventListener('MSFullscreenChange', checkFullScreen);

    // Guardar la orientación anterior al cargar la página
    window.onload = function() {
        previousOrientation = screen.orientation ? screen.orientation.type : (screen.mozOrientation || screen.msOrientation || screen.orientation);
    };
})();