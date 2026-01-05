// ==UserScript==
// @name         AnimeCalendar
// @namespace    http://animecalendar.net/
// @version      1.0
// @description  try to take over the world!
// @author       iMaarC
// @include      http://animecalendar.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18208/AnimeCalendar.user.js
// @updateURL https://update.greasyfork.org/scripts/18208/AnimeCalendar.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...


document.getElementsByClassName("day_now")[0].setAttribute("class","day");
var tablas = document.getElementsByClassName("day");


for(var i = 0; i < tablas.length; i++){

    if(tablas[i].getAttribute("class").indexOf("day") > -1){
        tablas[i].setAttribute("id",i + 1);
        var temporal = tablas[i].children[0].children[0].children[0].children[0].children[0];
        temporal.innerHTML += "<a href='#'> - Generar</a>";
        temporal.addEventListener("click",generar);
    }
}


    /* Output Diseño */

    var dark = document.createElement("div");
    dark.style.width = "500px";
    dark.style.heigth = "100%";
    dark.style.zIndex = "999";
    dark.style.top = "7px";
    dark.style.right = "7px";
    dark.style.backgroundColor = "white";
    dark.style.borderRadius = "2px";
    dark.style.padding = "10px";
    dark.style.position = "fixed";
    dark.setAttribute("id","outputGenerar");
    dark.addEventListener("wheel",ocultar);
    document.body.appendChild(dark);



function generar(){
    
    /* Obtener Informacion */
    
    var episodiosNombre = [];
    var numeroEpisodio = [];
    
    var seleccionado = this.parentNode.children[0].innerText; // Obtiene la string donde esta el numero.
    var numeroSeleccionado = seleccionado.substr(0,seleccionado.indexOf(' ')); // Obtiene solo el numero de la string.
    var tablaCorrecta = document.getElementById(numeroSeleccionado).children[0].children[1]; // Tbody con todos los tr.
    var tablaCorrectaTotal = document.getElementById(numeroSeleccionado).children[0].children[1].children.length; // Obtiene total episodios del dia seleccionado.
    
    var dark = document.getElementById("outputGenerar");
    
    var d = new Date();
    var month = [];
    month[0] = "Enero";
    month[1] = "Febrero";
    month[2] = "Marzo";
    month[3] = "Abril";
    month[4] = "Mayo";
    month[5] = "Junio";
    month[6] = "Julio";
    month[7] = "Agosto";
    month[8] = "Septiembre";
    month[9] = "Octubre";
    month[10] = "Noviembre";
    month[11] = "Diciembre";
    var n = month[d.getMonth()];
    
    for(var i = 0; i < tablaCorrectaTotal; i++){
        episodiosNombre[i] = tablaCorrecta.children[i].children[1].children[0].children[0].children[0].innerText; // Obtiene el texto del episodio.
        numeroEpisodio[i] = tablaCorrecta.children[i].children[1].children[0].children[1].innerText; // Obtiene el numero de episodio.
    }
    
    /* Imprimir por pantalla */
    
    dark.innerHTML = "____________________________";
    dark.innerHTML += "<br/>";
    dark.innerHTML += "<br/>";
    dark.innerHTML += "*" + numeroSeleccionado +" de " + n + "*";
    dark.innerHTML += "<br/>";
    dark.innerHTML += "<br/>";
    
    for(var j = 0; j < episodiosNombre.length; j++){
        dark.innerHTML += (episodiosNombre[j] + "<br/>" + numeroEpisodio[j]);
        dark.innerHTML += "<br/>";
        dark.innerHTML += "<br/>";
    }
    dark.innerHTML += "____________________________";
}

function ocultar(){
    
    var dark = document.getElementById("outputGenerar");
    dark.innerHTML = "";

}