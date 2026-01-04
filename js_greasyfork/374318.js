// ==UserScript==
// @name         Youtube Video Blocker
// @namespace    https://greasyfork.org/es/scripts/374318-youtube-video-blocker
// @version      0.2
// @description  Oculta videos ya visto
// @author       DanalaDanazo
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/374318/Youtube%20Video%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/374318/Youtube%20Video%20Blocker.meta.js
// ==/UserScript==

var fullelements;
var counter = 0;
var storage;
(function() {
    'use strict';
    storage = window.localStorage; /*local storage*/
    fullelements = document.getElementsByTagName("ytd-grid-video-renderer"); /*Lista en fullelements todos los videos y metadata disponibles (en vista) */
    createButtons(0, undefined); /*Funcion para crear los botones*/
})();
function eraseVideo(element) {
    //Back
    var title = element.children[0].children[1].children[0].children[0].textContent;
    var author = element.children[0].children[1].children[0].children[1].children[0].children[0].children[0].textContent;
    storage.setItem(title + ";" + author, title + ";" + author);
    console.log("Item set: " + title + ";" + author);
    //Front
    removeGUIVideo(element);
}
function createButtons(i) {
    var textins = fullelements[i]; //Sacamos el elemento HTML del i video
    if (!isListed(textins)) { //Comprobamos si esta listado
        var element = fullelements[i].children[0].children[1].children[0].children[1]; /*Lista en elements todo el metadata disponibles (en vista) */
        var node = document.createElement('a'); //Creamos un boton
        var textnode = document.createTextNode("Ocultar para siempre"); //Damos texto al boton
        node.style.color = "grey";
        node.style.fontSize = "1.3rem";
        node.style.textDecoration = "underline";
        node.addEventListener("click", function() { eraseVideo(textins)}); //Añadimos un listener que, tras hacer click, llama a eraseVideo con el elemento HTML del video
        node.appendChild(textnode); //Adjuntamos el texto al boton
        element.children[0].appendChild(node); //Adjuntamos al elemento del video el boton creado
        i++;
        if (i<fullelements.length) {
            createButtons(i);
        }
    } else {
        createButtons(i);
    }
}
/*Function para comprobar si el elemento enviado existe en el almacenamiento local*/
function isListed(element) {
    var listed = false;
    var title = element.children[0].children[1].children[0].children[0].textContent;
    var author = element.children[0].children[1].children[0].children[1].children[0].children[0].children[0].textContent;
    var exists = storage.getItem(title + ";" + author, title + ";" + author);
    if (exists != null) {
        removeGUIVideo(element);
        listed = true;
    }
    return listed;
}
/*Elimina el div del video*/
function removeGUIVideo(element) {
    var parent = element.parentElement; //Rcogemos el padre del elemento
    parent.removeChild(element); //Al padre le eliminamos el hijo (div miniatura + metadata)
}
