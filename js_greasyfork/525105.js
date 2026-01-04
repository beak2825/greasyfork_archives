// ==UserScript==
// @name         Florr.io Anti-Daño
// @namespace    http://tu-nombre-o-url-unica.com/
// @version      1.0
// @description  Esquiva automáticamente entidades dañinas en Florr.io para minimizar el daño recibido.
// @author       Tu Nombre
// @license      MIT
// @match        https://florr.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525105/Florrio%20Anti-Da%C3%B1o.user.js
// @updateURL https://update.greasyfork.org/scripts/525105/Florrio%20Anti-Da%C3%B1o.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuración básica
    const distanciaDeEsquiva = 100; // Distancia mínima para esquivar entidades dañinas.

    // Función principal que se ejecuta en bucle
    function evitarDano() {
        const jugador = obtenerJugador();
        const entidades = obtenerEntidades();

        if (!jugador || entidades.length === 0) return;

        entidades.forEach(entidad => {
            if (esPeligrosa(entidad) && distancia(jugador, entidad) < distanciaDeEsquiva) {
                esquivar(entidad);
            }
        });
    }

    // Obtiene la posición del jugador (Ejemplo: ajustar según la estructura del juego)
    function obtenerJugador() {
        return window.gameState?.player || null;
    }

    // Obtiene todas las entidades cercanas
    function obtenerEntidades() {
        return window.gameState?.entities || [];
    }

    // Verifica si una entidad es peligrosa
    function esPeligrosa(entidad) {
        return entidad.type === 'enemy'; // Ajustar según los tipos reales de entidades.
    }

    // Calcula la distancia entre el jugador y una entidad
    function distancia(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    // Lógica para esquivar
    function esquivar(entidad) {
        const jugador = obtenerJugador();
        if (!jugador) return;

        const dx = jugador.x - entidad.x;
        const dy = jugador.y - entidad.y;

        const angulo = Math.atan2(dy, dx);
        const nuevoX = jugador.x + Math.cos(angulo) * distanciaDeEsquiva;
        const nuevoY = jugador.y + Math.sin(angulo) * distanciaDeEsquiva;

        moverJugador(nuevoX, nuevoY);
    }

    // Mueve al jugador a una nueva posición
    function moverJugador(x, y) {
        window.sendInput?.('move', { x, y });
    }

    // Ejecuta la función en intervalos
    setInterval(evitarDano, 50);
})();
