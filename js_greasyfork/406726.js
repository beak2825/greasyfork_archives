// ==UserScript==
// @name         ElComercio-SuscriptorDigital
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Script para ver información de Suscriptor Digital en El Comercio (Peru) y Gestion (Peru)
// @author       a_david
// @match        https://elcomercio.pe/*
// @match        https://gestion.pe/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406726/ElComercio-SuscriptorDigital.user.js
// @updateURL https://update.greasyfork.org/scripts/406726/ElComercio-SuscriptorDigital.meta.js
// ==/UserScript==

GM_registerMenuCommand("Desbloquear artículo", function() {
action()
});

//Espera 3 segundos para empezar a "corregir" la página
var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 3000, observer); // wait for the page to stay still for 3 seconds
observer.observe(document, {childList: true, subtree: true});

function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 3000, observer);
}

function action(o) {
    o.disconnect();

    //Elimina el fondo de bloqueo
    //try{
    var divs = document.getElementsByTagName("div");
    for (var i in divs){
        if (divs[i].className == "tp-modal" || divs[i].className == "tp-backdrop tp-active"){
            divs[i].style.visibility = 'hidden';
        }
    }

    //Activa barra de desplazamiento
    var htmlDoc = document.getElementsByTagName("html")[0];
    htmlDoc.classList.remove("overflow-hidden");

    var bodyDoc = document.getElementsByTagName("body")[0];
    bodyDoc.classList.remove("overflow-hidden");
    bodyDoc.classList.remove("frozen-mobile-body");
    bodyDoc.classList.remove("tp-modal-open");
    //bodyDoc.removeAttribute("style");

    //Muestra texto
    var textoReportaje = document.getElementById("contenedor");
    //textoReportaje.classList.remove("story-content__nota-premium");
    textoReportaje.removeAttribute("style");
}