// ==UserScript==
// @name         Platzi - Guardar subtitulos! (SRT o Texto)
// @namespace    http://tampermonkey.net/
// @version      2024-03-07
// @license      MIT
// @description  Genera un archivo SRT con información de temporizador y texto extraído, y permite guardar solo el texto en formato de texto plano
// @author       💕 Facu y ChatGPT 💕
// @match        https://platzi.com/new-home/clases/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=platzi.com
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/489258/Platzi%20-%20Guardar%20subtitulos%21%20%28SRT%20o%20Texto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489258/Platzi%20-%20Guardar%20subtitulos%21%20%28SRT%20o%20Texto%29.meta.js
// ==/UserScript==

// Variables para almacenar el valor anterior de aria-valuetext, el texto anterior y el índice
var valorAnterior = "";
var textoAnterior = "";
var indice = 1;

// Variable para almacenar el contenido SRT
var contenidoSRT = "";

// Variable para almacenar solo el texto
var soloTexto = "";

// Función para mostrar el texto del elemento y el valor del atributo "aria-valuetext"
function generarArchivoSRT(jNode) {
    var nuevoValor = document.querySelector("div.vjs-progress-control.vjs-control > div").getAttribute("aria-valuetext");
    var nuevoTexto = jNode.textContent.trim();

    if (textoAnterior !== nuevoTexto) {
        var tiempoAnterior = convertirAFormatoSRT(valorAnterior.split(" ")[0]);
        var tiempoActual = convertirAFormatoSRT(nuevoValor.split(" ")[0]);

        contenidoSRT += `${indice}\n${tiempoAnterior} --> ${tiempoActual}\n${nuevoTexto}\n\n`;

        soloTexto += `${nuevoTexto.replace(/\n/g, ' ')} `;

        valorAnterior = nuevoValor;
        textoAnterior = nuevoTexto;
        indice++;
    }

    return true; // Permitir repeticiones para este nodo.
}

// Función para convertir el formato del tiempo a SRT
function convertirAFormatoSRT(tiempo) {
    var partesTiempo = tiempo.split(":");
    var minutos = parseInt(partesTiempo[0], 10);
    var segundos = parseInt(partesTiempo[1], 10);
    var milisegundos = 0; // asumimos 0 milisegundos

    return `${minutos}:${segundos},${milisegundos}`;
}

// Función para agregar el textarea y los botones al cuerpo del documento
function agregarElementosUI() {
    // Esperar a que el elemento padre esté disponible
    waitForKeyElements(".styles-module_UserMenu__EQiME.styles-module_Header__UserMenu__A5BUy", function (elementoPadre) {
        var contenedorBotones = elementoPadre;

        if (contenedorBotones) {
            var botonGuardarSRT = crearBoton("Guardar SRT", "Toggles_Toggles__Item__trrbN", guardarSRT);
            contenedorBotones.appendChild(botonGuardarSRT);

            var botonGuardarTexto = crearBoton("Guardar Texto", "Toggles_Toggles__Item__trrbN", guardarTexto);
            contenedorBotones.appendChild(botonGuardarTexto);
        }
    });

    var textareaSRT = document.createElement("textarea");
    textareaSRT.id = "srtTextarea";
    textareaSRT.style.display = "none";
    document.body.appendChild(textareaSRT);
}

// Función para crear un botón
function crearBoton(texto, clase, eventoClick) {
    var boton = document.createElement("button");
    boton.textContent = texto;
    boton.className = clase;
    boton.addEventListener("click", eventoClick);
    return boton;
}

// Función para guardar el contenido SRT en un archivo con el texto del elemento "class_title"
function guardarSRT() {
    var textareaSRT = document.getElementById("srtTextarea");
    var tituloClase = obtenerTextoElemento("[class='MaterialHeading_MaterialHeading-title__RZY2U']");

    if (textareaSRT && tituloClase) {
        textareaSRT.value = contenidoSRT;

        // Crear un enlace y hacer clic en él para descargar el archivo
        var enlaceDescarga = document.createElement("a");
        enlaceDescarga.href = "data:text/plain;charset=utf-8," + encodeURIComponent(textareaSRT.value);
        enlaceDescarga.download = `${tituloClase}_subtitulos.srt`;
        enlaceDescarga.style.display = "none";
        document.body.appendChild(enlaceDescarga);

        enlaceDescarga.click();

        document.body.removeChild(enlaceDescarga);
    }
}

// Función para guardar solo el texto en un archivo con el texto del elemento "class_title"
function guardarTexto() {
    var textareaTexto = document.createElement("textarea");
    var tituloClase = obtenerTextoElemento("[class='MaterialHeading_MaterialHeading-title__RZY2U']");

    if (tituloClase) {
        textareaTexto.value = soloTexto;

        // Crear un enlace y hacer clic en él para descargar el archivo
        var enlaceDescargaTexto = document.createElement("a");
        enlaceDescargaTexto.href = "data:text/plain;charset=utf-8," + encodeURIComponent(textareaTexto.value);
        enlaceDescargaTexto.download = `${tituloClase}_texto.txt`;
        enlaceDescargaTexto.style.display = "none";
        document.body.appendChild(enlaceDescargaTexto);

        enlaceDescargaTexto.click();

        document.body.removeChild(enlaceDescargaTexto);
    }
}

// Función para obtener el texto de un elemento por el atributo "data-qa"
function obtenerTextoElemento(selector) {
    var elemento = document.querySelector(selector);
    return elemento ? elemento.textContent.trim() : null;
}


// Agregar elementos UI al cargar la página
agregarElementosUI();

// Esperar a que cargue la página y seguir esperando indefinidamente
waitForKeyElements("div.vjs-text-track-display > div > div > div", generarArchivoSRT);
