// ==UserScript==
// @name         Florr.io Auto-Evade Script
// @namespace    http://florr.io/dev-tools/
// @version      1.0
// @description  Script para esquivar automáticamente entidades dañinas en Florr.io con fines de desarrollo y pruebas internas.
// @author       Desarrollador del Juego
// @match        https://florr.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525107/Florrio%20Auto-Evade%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/525107/Florrio%20Auto-Evade%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EVASION_DISTANCE = 150; // Distancia mínima para esquivar entidades peligrosas.
    const CHECK_INTERVAL = 50; // Tiempo en ms entre cada chequeo de entidades.

    /**
     * Función principal para detectar y esquivar entidades dañinas.
     */
    function autoEvade() {
        const player = getPlayer();
        const entities = getEntities();

        if (!player) {
            console.warn('No se detectó al jugador.');
            return;
        }

        if (entities.length === 0) {
            console.log('No hay entidades cercanas.');
            return;
        }

        entities.forEach(entity => {
            if (isDangerous(entity) && getDistance(player, entity) < EVASION_DISTANCE) {
                console.log(`Esquivando entidad peligrosa en (${entity.x}, ${entity.y})`);
                evadeEntity(player, entity);
            }
        });
    }

    /**
     * Obtiene la posición del jugador.
     */
    function getPlayer() {
        return window.gameState?.player || null; // Ajustar según la estructura real del juego.
    }

    /**
     * Obtiene todas las entidades presentes en el mapa.
     */
    function getEntities() {
        return window.gameState?.entities || []; // Ajustar según la estructura real del juego.
    }

    /**
     * Determina si una entidad es peligrosa.
     */
    function isDangerous(entity) {
        return entity.type === 'enemy'; // Ajustar según los tipos reales de entidades.
    }

    /**
     * Calcula la distancia entre el jugador y una entidad.
     */
    function getDistance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    /**
     * Lógica para esquivar una entidad peligrosa.
     */
    function evadeEntity(player, entity) {
        const dx = player.x - entity.x;
        const dy = player.y - entity.y;

        const angle = Math.atan2(dy, dx);
        const newX = player.x + Math.cos(angle) * EVASION_DISTANCE;
        const newY = player.y + Math.sin(angle) * EVASION_DISTANCE;

        movePlayer(newX, newY);
    }

    /**
     * Mueve al jugador a una nueva posición.
     */
    function movePlayer(x, y) {
        if (window.sendInput) {
            window.sendInput('move', { x, y });
        } else {
            console.error('La función de movimiento no está disponible.');
        }
    }

    // Ejecuta la función autoEvade en intervalos definidos.
    setInterval(autoEvade, CHECK_INTERVAL);
})();
