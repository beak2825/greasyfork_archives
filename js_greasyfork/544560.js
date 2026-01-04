// ==UserScript==
// @name         Drawaria Auto Token Giver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Envía automáticamente el token a todos los jugadores en Drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544560/Drawaria%20Auto%20Token%20Giver.user.js
// @updateURL https://update.greasyfork.org/scripts/544560/Drawaria%20Auto%20Token%20Giver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // FontAwesome CSS fallback (necesario para los iconos si no está ya cargado)
    if (!document.querySelector('link[href*="fontawesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
    }

/*
TOKENS DISPONIBLES CAMBIAR MANUALMENTE
 // 👍 Pulgar Arriba
  'fa-thumbs-up',
  // ❤️ Corazón
  'fa-heart',
  // 🖌️ Pincel
  'fa-paint-brush',
  // 🍸 Cóctel
  'fa-cocktail',
  // ✌️ Paz
  'fa-hand-peace',
  // 🪶 Pluma
  'fa-feather-alt',
  // 🏆 Trofeo
  'fa-trophy',
  // ☕ Taza
  'fa-mug-hot',
  // 🎁 Regalo
  'fa-gift'
*/
    // Identificador del token Cambiarlo manualemente
    const PAINT_BRUSH_TOKEN_CLASS = 'fa-cocktail';

    function givePaintBrushTokenToAllPlayers() {
        // No hacer nada si el juego está en fase de adivinanza
        if (document.querySelector('#infotext') && document.querySelector('#infotext').children[0] &&
            document.querySelector('#infotext').children[0].textContent.includes("Word guessing")) {
            // console.log('Modo de adivinanza activo, saltando el envío de tokens.');
            return;
        }

        const loggedInPlayers = document.querySelectorAll('.playerlist-name-loggedin');
        if (loggedInPlayers.length === 0) {
            // console.log('No hay jugadores logueados para dar tokens.');
            return;
        }

        loggedInPlayers.forEach((playerElement, i) => {
            // Simula un clic en el jugador para abrir su menú
            playerElement.click();

            // Espera un breve momento para que el menú del jugador se renderice
            // Esto es crucial para que los elementos .playerlist-tokens estén disponibles
            setTimeout(() => {
                const paintBrushTokenElement = document.querySelectorAll(`.playerlist-tokens > .${PAINT_BRUSH_TOKEN_CLASS}`)[i];

                if (paintBrushTokenElement) {
                    // console.log(`Intentando dar 'Paint Brush' a jugador ${i}`);
                    paintBrushTokenElement.click(); // Clic en el token "Paint Brush"
                }
            }, 50); // Pequeño retraso para la apertura del menú
        });

        // Simula un clic en el botón de cerrar el menú del jugador (después de un tiempo para que se procesen los clics de tokens)
        setTimeout(() => {
            const hideButton = document.querySelector('.playerlist-menu-hidebutton');
            if (hideButton) {
                hideButton.click();
            }
        }, loggedInPlayers.length * 100 + 200); // Ajusta el retraso basado en el número de jugadores
    }

    // Ejecuta la función automáticamente cada X segundos
    // Puedes ajustar el intervalo según lo desees (ej: 5000ms = 5 segundos)
    const AUTO_GIVE_INTERVAL_MS = 1000; // Cada 1 segundos
    setInterval(givePaintBrushTokenToAllPlayers, AUTO_GIVE_INTERVAL_MS);

})();