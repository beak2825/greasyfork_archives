// ==UserScript==
// @name         Chivatear
// @namespace    Chivatear
// @version      0.0.1
// @description  Crea un botón en la ventana de info de isla para chivatear todas las ciudades de la isla automáticamente
// @author       You
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488466/Chivatear.user.js
// @updateURL https://update.greasyfork.org/scripts/488466/Chivatear.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ventanaFound
    buscarVentana();

    function buscarVentana(){
        // Busca todos los elementos con el ID "ui-id-4" y la clase "ui-dialog-title"
        var elementos = document.querySelectorAll(".js-window-main-container");
        // Itera sobre los elementos encontrados para encontrar el que contenga el texto "Información isla"
        for (var i = 0; i < elementos.length; i++) {
            if (elementos[i].textContent.includes("Información isla")) {
                ventanaFound = true;

                var botonCerrar = elementos[i].children[0].children[1];
                botonCerrar.addEventListener('click', function() {
                    ventanaFound = false;
                    buscarVentana(); // Vuelve a verificar si las pestañas están activas después de un segundo
                });

                var botonChivatear = crearBoton(elementos[i].children[1].children[4].children[0].children[0]);
                botonChivatear.addEventListener('click', function(){
                    var lista = document.querySelector("#island_info_towns_left_sorted_by_name");
                    var ciudades = lista.querySelectorAll(".gp_town_link");

                    for(var i = 0; i < ciudades.length; i++){
                        (function(i) { // Utiliza una función de cierre para capturar el valor actual de 'i'
                            setTimeout(function() {
                                ciudades[i].click();
                                var reforzar = document.querySelector("#support");
                                if (reforzar){
                                    setTimeout(function(){
                                        reforzar.click();

                                        setTimeout(function(){

                                            var campoInfante = document.querySelector(".unit_type_sword");
                                            campoInfante.value = "1";
                                            var botonesReforzar = document.querySelectorAll('a.button span.middle');

                                            // Iterar sobre los elementos encontrados
                                            botonesReforzar.forEach(function(boton) {
                                                // Verificar si el texto del botón coincide exactamente con "Reforzar"
                                                if (boton.textContent.trim() === 'Reforzar') {
                                                    // Aquí puedes realizar las acciones que desees con el botón encontrado
                                                    setTimeout(function(){
                                                        boton.click();
                                                        setTimeout(function(){boton.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[1].click();
                                                                             }, 600)
                                                    }, 100);
                                                }
                                            });},100);
                                    }, 100)
                                }
                            }, 1000 * i); // Multiplica el intervalo por el índice para aumentar el retraso en cada iteración
                        })(i);
                    }
                });
            }
        }
        if (ventanaFound){
        }else{
            setTimeout(function(){
                buscarVentana()}, 1000);}
    }


    function crearBoton(contenedor) {
        // Obtén una referencia al último hijo del contenedor (el último div hijo)
        var ultimoHijo = contenedor.lastElementChild;

        // Obtén una referencia al penúltimo hijo del contenedor
        var penultimoHijo = ultimoHijo.previousElementSibling;

        // Crea el nuevo botón
        var nuevoBoton = document.createElement('div');
        nuevoBoton.classList.add('button_new');
        nuevoBoton.id = 'chivatear';
        nuevoBoton.setAttribute('name', 'Chivatear');
        nuevoBoton.style.float = 'right';
        nuevoBoton.style.margin = '0px';
        nuevoBoton.setAttribute('rel', '#gpwnd_1002');

        var leftDiv = document.createElement('div');
        leftDiv.classList.add('left');

        var rightDiv = document.createElement('div');
        rightDiv.classList.add('right');

        var captionDiv = document.createElement('div');
        captionDiv.classList.add('caption', 'js-caption');
        captionDiv.textContent = 'Chivatear';

        nuevoBoton.appendChild(leftDiv);
        nuevoBoton.appendChild(rightDiv);
        nuevoBoton.appendChild(captionDiv);

        // Inserta el nuevo botón antes del último hijo del contenedor
        contenedor.insertBefore(nuevoBoton, ultimoHijo);

        return nuevoBoton
    }



})();