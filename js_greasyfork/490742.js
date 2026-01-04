// ==UserScript==
// @name         El Salto Limpio
// @author       Héctor Álvarez
// @namespace    https://github.com/Hectoralvf
// @description  Elimina múltiples elementos en elsaltodiario.com para facilitar la lectura y añade una estimación de tiempo de lectura
//
// @version      1.0
// @license MIT
//
// @icon         https://www.elsaltodiario.com/uploads/avatars/h50/AVATAR_TRANSPARENTE.png
// @match        https://www.elsaltodiario.com/*
// @match        https://osalto.gal/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490742/El%20Salto%20Limpio.user.js
// @updateURL https://update.greasyfork.org/scripts/490742/El%20Salto%20Limpio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var palabrasPorMinuto = 170; // Velocidad de lectura estimada en palabras por minuto

    var elementosEliminar = [];
    var elementosContenidoEliminar = [];

    // Obtener los elementos con el ID "anuncio-cabecera"
    var anuncioCabeceraElements = document.querySelectorAll("#anuncio-cabecera");
    for (var i = 0; i < anuncioCabeceraElements.length; i++) {
        var padreElement = anuncioCabeceraElements[i].parentNode;
        if (padreElement) {
            elementosEliminar.push(padreElement);
        }
    }

    // Obtener los elementos con la clase "lecturas"
    var lecturasElements = document.querySelectorAll(".lecturas");
    if (lecturasElements.length > 0) {
        elementosEliminar.push(...lecturasElements);
    }

    // Obtener los elementos con la clase "compartir"
    var compartirElements = document.querySelectorAll(".compartir");
    if (compartirElements.length > 0) {
        elementosEliminar.push(...compartirElements);
    }

    // Eliminar los elementos encontrados
    for (var j = 0; j < elementosEliminar.length; j++) {
        elementosEliminar[j].remove();
    }

    // Obtener el elemento <main> con el ID "contenido-principal"
    var contenidoPrincipalElement = document.querySelector("main#contenido-principal");
    if (contenidoPrincipalElement) {
        // Obtener todos los elementos <blockquote> dentro del elemento <main id="contenido-principal">
        var blockquoteElements = contenidoPrincipalElement.querySelectorAll("blockquote");
        if (blockquoteElements.length > 0) {
            elementosContenidoEliminar.push(...blockquoteElements);
        }

        // Obtener los elementos <div> dentro de <main id="contenido-principal"> con la clase "anuncio anuncio-activo"
        var anuncioActivoElements = contenidoPrincipalElement.querySelectorAll("div.anuncio");
        if (anuncioActivoElements.length > 0) {
            elementosContenidoEliminar.push(...anuncioActivoElements);
        }

        // Eliminar los elementos encontrados
        for (var k = 0; k < elementosContenidoEliminar.length; k++) {
            elementosContenidoEliminar[k].remove();
        }

        // Contar el número de palabras en el contenido principal
        var parrafos = contenidoPrincipalElement.querySelectorAll("p");
        var totalPalabras = 0;
        for (var l = 0; l < parrafos.length; l++) {
            var palabras = parrafos[l].textContent.trim().split(/\s+/);
            totalPalabras += palabras.length;
        }

        var tiempoLecturaEstimado = Math.ceil(totalPalabras / 170); // Suponiendo una velocidad de lectura de 190 palabras por minuto

        // Crear el div del tiempo de lectura estimado
        var tiempoLecturaDiv = document.createElement("div");
        tiempoLecturaDiv.innerHTML = "&#x231B; " + tiempoLecturaEstimado + " minutos";

        // Insertar el div debajo del div con la clase "fecha"
        var fechaElement = contenidoPrincipalElement.querySelector("div.fecha");
        if (fechaElement) {
            fechaElement.parentNode.insertBefore(tiempoLecturaDiv, fechaElement.nextSibling);
        }
    }
})();