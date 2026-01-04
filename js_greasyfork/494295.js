// ==UserScript==
// @name         Añadir IDs a TR y TD de una tabla
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Añade IDs a los TR y TD de una tabla HTML de forma dinámica
// @author       Tu Nombre
// @match        https://www.oregoncomercial.es/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494295/A%C3%B1adir%20IDs%20a%20TR%20y%20TD%20de%20una%20tabla.user.js
// @updateURL https://update.greasyfork.org/scripts/494295/A%C3%B1adir%20IDs%20a%20TR%20y%20TD%20de%20una%20tabla.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        var tabla = document.querySelector('#contenido table');
        var filas = tabla.querySelectorAll('tr');
        var estadosUnicos = [];
        var contadorEstados = {};

        // Iterar sobre las filas para obtener los estados únicos y contar su frecuencia
        filas.forEach(function(fila, indiceFila) {
            var celdaObjetivo = fila.querySelector('td:nth-child(9)'); // Obtener la novena celda de cada fila

            if (celdaObjetivo) {
                var estado = celdaObjetivo.textContent.trim();
                // Agregar estado a la lista de estados únicos y actualizar su contador
                if (!estadosUnicos.includes(estado)) {
                    estadosUnicos.push(estado);
                    contadorEstados[estado] = 1;
                } else {
                    contadorEstados[estado]++;
                }

                // Cambiar el color de fondo de la fila basado en el contenido de la celda objetivo
                if (indiceFila !== 0) { // Evitar cambiar el encabezado de la tabla
                    if (estado === 'Firmado') {
                        fila.style.backgroundColor = 'green';
                    } else if (estado === 'Rechazado') {
                        fila.style.backgroundColor = 'red';
                    } else if (estado === 'Pdte. Firma') {
                        fila.style.backgroundColor = 'yellow';
                    }
                }
            }
        });

        // Crear un elemento para mostrar el contador de estados
        var contadorElemento = document.createElement('div');
        contadorElemento.style.position = 'fixed'; // Hacer que el contador flote a la derecha
        contadorElemento.style.left = '60%'; // Hacer que el contador flote a la derecha
        contadorElemento.style.top = '0'; // Hacer que el contador flote a la derecha
        contadorElemento.innerHTML = '<h2>Ventas</h2>';

        // Crear lista de estados y su recuento
        var listaEstados = document.createElement('ul');
        estadosUnicos.forEach(function(estado) {
            var itemEstado = document.createElement('li');
            itemEstado.textContent = estado + ': ' + contadorEstados[estado];
            listaEstados.appendChild(itemEstado);
        });

        // Agregar la lista al elemento contador
        contadorElemento.appendChild(listaEstados);

        // Agregar el elemento al DOM
        document.body.appendChild(contadorElemento);
    };
})();