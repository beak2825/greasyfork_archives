// ==UserScript==
// @name       Thumbs Up!
// @namespace  com.hunterstyler
// @version    0.1
// @description  Pajerismos animados de ayer y hoy...
// @match      http://letterboxd.com/george_tromero/films/*
// @downloadURL https://update.greasyfork.org/scripts/5004/Thumbs%20Up%21.user.js
// @updateURL https://update.greasyfork.org/scripts/5004/Thumbs%20Up%21.meta.js
// ==/UserScript==

// Array global en el que guardo las pelis con THUMBS UP
var thumbsUp;

// Función auxiliar para poder determinar si la peli tiene THUMBS UP
function contains(arr, obj) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

// Función que modifica los bordes de los posters en función del resultado de contains()
function changeBorders() {
    var posters = document.getElementsByClassName("overlay");
    for (var i = 0; i < posters.length; i++) {
        var link = posters[i].parentNode.toString();
        var title = link.substring(27, link.length - 1);
        if (contains(thumbsUp, title)) {            
            posters[i].style.border = "solid 6px #00FF00";
        } else {
            posters[i].style.border = "solid 6px #FF0000";
        }
    }
}

// Función que accede al listado de http://letterboxd.com/george_tromero/list/thumbs-up
function getInformation(link, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}

// Llamada a getInformation() incluyendo una función callback muy LoKoPlAyErA
getInformation("http://letterboxd.com/george_tromero/list/thumbs-up", function(text) {
    var aux = document.createElement('div');
    aux.innerHTML = text;
    var html = aux.getElementsByClassName("text-large");
    var list = html[0].textContent;
    thumbsUp = list.split(",")
    changeBorders();
});