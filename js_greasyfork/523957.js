// ==UserScript==
// @name         real time
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license MIT 
// @description  Muestra la hora en la esquina superior derecha y la fecha abajo en Sploop.io con sombra
// @author       Tú
// @match        *://sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523957/real%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/523957/real%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crea un elemento div para mostrar la hora
    var clockDiv = document.createElement('div');
    clockDiv.style.position = 'fixed';
    clockDiv.style.top = '249px'; // Ajusta la distancia desde arriba
    clockDiv.style.left = '5px'; // Ajusta la distancia desde la derecha
    clockDiv.style.color = 'white';
    clockDiv.style.fontSize = '31px'; // Tamaño grande de la fuente
    clockDiv.style.textShadow = '2px 2px 4px #000000'; // Añade sombra al texto
    clockDiv.style.zIndex = 1000;
    document.body.appendChild(clockDiv);

    // Crea un elemento div para mostrar la fecha
    var dateDiv = document.createElement('div');
    dateDiv.style.position = 'fixed';
    dateDiv.style.top = '699px'; // Ajusta la distancia desde arriba para el día
    dateDiv.style.left = '5px'; // Ajusta la distancia desde la derecha
    dateDiv.style.color = 'grey';
    dateDiv.style.fontSize = '24px'; // Tamaño de la fuente
    dateDiv.style.textShadow = '2px 2px 4px #000000'; // Añade sombra al texto
    dateDiv.style.zIndex = 1000;
    document.body.appendChild(dateDiv);

    // Función para actualizar la hora y la fecha
    function updateClock() {
        var now = new Date();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        var seconds = now.getSeconds().toString().padStart(2, '0');
        clockDiv.textContent = `${hours}:${minutes}:${seconds}`;

        var options = { month: 'long' };
        var monthString = now.toLocaleDateString('es-ES', options);
        var day = now.getDate().toString().padStart(2, '0');
        var year = now.getFullYear().toString();

        dateDiv.innerHTML = `${monthString}<br>${day}<br>${year}`;
    }

    // Actualiza la hora y la fecha cada segundo
    setInterval(updateClock, 1000);
    updateClock();
})();
