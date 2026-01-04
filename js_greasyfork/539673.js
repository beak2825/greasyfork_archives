// ==UserScript==
// @name         Rangos por Sala en Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Asigna rangos a jugadores solo dentro de la sala actual.
// @author       TuNombre
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539673/Rangos%20por%20Sala%20en%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/539673/Rangos%20por%20Sala%20en%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let rangosSala = {};

    function obtenerRango(nombre) {
        if (!rangosSala[nombre]) {
            let opciones = ["🔥 Maestro", "⭐ Experto", "🎭 Intermedio", "👤 Novato"];
            rangosSala[nombre] = opciones[Math.floor(Math.random() * opciones.length)];
        }
        return rangosSala[nombre];
    }

    function actualizarRangos() {
        document.querySelectorAll(".message-username").forEach(user => {
            let nombre = user.innerText;
            let rango = obtenerRango(nombre);
            user.innerText = `${rango} | ${nombre}`;
        });
    }

    setInterval(() => {
        actualizarRangos();
    }, 3000);

})();
