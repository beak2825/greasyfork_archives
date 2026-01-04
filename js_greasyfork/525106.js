// ==UserScript==
// @name         Florr.io Anti-Daño Mejorado
// @namespace    http://tu-nombre-o-url-unica.com/
// @version      1.1
// @description  Esquiva entidades dañinas automáticamente en Florr.io con mejor lógica y depuración.
// @author       Tu Nombre
// @license      MIT
// @match        https://florr.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525106/Florrio%20Anti-Da%C3%B1o%20Mejorado.user.js
// @updateURL https://update.greasyfork.org/scripts/525106/Florrio%20Anti-Da%C3%B1o%20Mejorado.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const distanciaDeEsquiva = 150; // Ajusta según necesidad.

    function evitarDano() {
        const jugador = obtenerJugador();
        const entidades = obtenerEntidades();

        if (!jugador) {
            console.error('No se detectó al jugador.');
            return;
        }

        if (entidades.length === 0) {
            console.log('No hay entidades cercanas.');
            return;
        }

        entidades.forEach(entidad => {
            if (esPeligrosa(entidad) && distancia(jugador, entidad) < distanciaDeEsquiva) {
                console.log('Entidad peligrosa detectada. Esquivando...');
                esquivar(entidad);
            }
        });
    }

    function obtenerJugador() {
        return window.gameState?.player || null;
    }

    function obtenerEntidades() {
        return window.gameState?.entities || [];
    }

    function esPeligrosa(entidad) {
        return entidad.type === 'enemy'; // Ajusta según los tipos de entidades.
    }

    function distancia(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    function esquivar(entidad) {
        const jugador = obtenerJugador();
        if (!jugador) return;

        const dx = jugador.x - entidad.x;
        const dy = jugador.y - entidad.y;

        const angulo = Math.atan2(dy, dx);
        const nuevoX = jugador.x + Math.cos(angulo) * distanciaDeEsquiva;
        const nuevoY = jugador.y + Math.sin(angulo) * distanciaDeEsquiva;

        console.log(`Esquivando hacia: (${nuevoX}, ${nuevoY})`);
        moverJugador(nuevoX, nuevoY);
    }

    function moverJugador(x, y) {
        // Asegúrate de que esta función sea compatible con el juego.
        if (window.sendInput) {
            window.sendInput('move', { x, y });
        } else {
            console.error('Función de movimiento no disponible.');
        }
    }

    setInterval(evitarDano, 50); // Llamar a evitarDano cada 50ms.
})();
