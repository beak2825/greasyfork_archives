// ==UserScript==
// @name         Modificación de Teclas en Daypo
// @namespace    http://tampermonkey.net/
// @version      0.1.41
// @description  Manejo de teclas personalizado para Daypo
// @author       Raddiactive
// @match        https://www.daypo.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/485661/Modificaci%C3%B3n%20de%20Teclas%20en%20Daypo.user.js
// @updateURL https://update.greasyfork.org/scripts/485661/Modificaci%C3%B3n%20de%20Teclas%20en%20Daypo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let temporizadorInterval;
    let segundosRestantesIniciales = 60; // Duración inicial del temporizador en segundos
    let segundosRestantes = segundosRestantesIniciales
    let reinicioContador = 0;
    document.addEventListener('keydown', function(event) {
        var tecla = event.key;
        if (/^[1-9]$/.test(tecla)) {
            var opcion = parseInt(tecla) - 1;
            try {
                opc(opcion, 1);
                chc(opcion);
            } catch (error) {
            }
        }
        if (event.ctrlKey && event.altKey && tecla === 'r') {
        const temporizadorElemento2 = obtenerTemporizadorElemento();

            if (!temporizadorElemento2) {
                // Si no se puede obtener el elemento, intenta agregar el temporizador nuevamente
                agregarTemporizador();
                reiniciarTemporizador();
                return;
            }
            else{
                // Verifica si el contenedor existe
                const celdaTemporizador = temporizadorElemento2.parentElement.parentElement.parentElement.parentElement;
                const tablaContenedor = document.getElementById('datos');


                // Verifica si la celdaTemporizador existe
                if (celdaTemporizador) {
                    // Elimina la celda que contiene el temporizador
                    celdaTemporizador.remove();
                    // Get a reference to the table
                    const table = document.getElementById("datos").querySelector("table");
                    const elementoAMover = tablaContenedor.querySelector('.w1.pr1');
                    if (!elementoAMover) {
                        const lastRow = table.rows[table.rows.length - 1];
                        const lastCell = lastRow.cells[lastRow.cells.length - 1];
                        lastRow.removeChild(lastCell);}
                     else{
                    // Mueve el elemento al final de la tabla
                    tablaContenedor.querySelector('tbody').querySelector('tr').appendChild(elementoAMover);
                }

                }

                agregarTemporizador();
                reiniciarTemporizador();
                return;
            }
        }
        if (tecla === "Enter") {
            reinicioContador++;
            if(reinicioContador % 2 === 1) {
                clearInterval(temporizadorInterval);
            }
            if (reinicioContador % 2 === 0) {
                reiniciarTemporizador();
            return;
        }

    }});
    function obtenerTemporizadorElemento() {
        return document.getElementById('timerText');
    }

    function agregarTemporizador() {
        const datosElemento = document.getElementById('datos');

        const codigoHTML = `
        <td class="w1">
            <table class="ma">
                <tbody>
                    <tr>
                        <td id="d5" class="cb">Timer:</td>
                        <td id="timerText">01:00</td>
                    </tr>
                </tbody>
            </table>
        </td>
    `;
        // Agrega la fila después de la última fila existente
        try{datosElemento.querySelector('tbody').querySelector('tr').insertAdjacentHTML('beforeend', codigoHTML);}
        catch{return;}
        if (datosElemento) {
            // Obtén el elemento con la clase "w1 pr1"
            const elementoAMover = datosElemento.querySelector('.w1.pr1');
             if (elementoAMover) {
                 // Mueve el elemento al final de la tabla
                 datosElemento.querySelector('tbody').querySelector('tr').appendChild(elementoAMover);
             }
            else{
                datosElemento.querySelector('tbody').querySelector('tr').insertAdjacentHTML('beforeend',`<td></td>`);
            }
        }
        var boton = document.getElementById('boton');

        // Agregar un event listener al botón
        try{boton.addEventListener('click', function() {
            // Tu código a ejecutar cuando se haga clic en el botón
            reinicioContador++;
            if(reinicioContador % 2 === 1) {
                clearInterval(temporizadorInterval);
            }
            if (reinicioContador % 2 === 0) {
                reiniciarTemporizador();
            }
            return;
        });}
        catch{}
    }

    agregarTemporizador();
    const temporizadorElemento2 = document.getElementById('timerText');
    function actualizarTemporizador() {
        const temporizadorElemento2 = obtenerTemporizadorElemento();

        if (!temporizadorElemento2) {
            // Si no se puede obtener el elemento, intenta agregar el temporizador nuevamente
            agregarTemporizador();
            reiniciarTemporizador();
            return;
        }
        const minutos = Math.floor(segundosRestantes / 60);
        const segundos = segundosRestantes % 60;

        // Formatea los minutos y segundos como texto
        const minutosTexto = minutos < 10 ? '0' + minutos : minutos;
        const segundosTexto = segundos < 10 ? '0' + segundos : segundos;

        // Actualiza el contenido del elemento HTML
        temporizadorElemento2.textContent = minutosTexto + ':' + segundosTexto;

        if (segundosRestantes === 0) {
            clearInterval(temporizadorInterval);
            temporizadorElemento2.style.color = 'red';
        }

        // Decrementa los segundos restantes
        segundosRestantes--;

        // Verifica si el temporizador llegó a 0
        if (segundosRestantes < 0) {
            clearInterval(temporizadorInterval);
            temporizadorElemento2.style.color = 'red';
            contestar(0);
            reinicioContador++;
        }
    }

    function reiniciarTemporizador() {

        const temporizadorElemento2 = obtenerTemporizadorElemento();

        if (!temporizadorElemento2) {
            // Si no se puede obtener el elemento, intenta agregar el temporizador nuevamente
            agregarTemporizador();
            return;
        }
        clearInterval(temporizadorInterval);
        temporizadorElemento2.style.color = ''; // Restaura el color del texto
        segundosRestantes = segundosRestantesIniciales; // Establece la duración inicial del temporizador en segundos
        reinicioContador = 0;
        temporizadorInterval = setInterval(actualizarTemporizador, 1000);
    }



    temporizadorInterval = setInterval(actualizarTemporizador, 1000);
})();
