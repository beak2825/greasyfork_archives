// ==UserScript==
// @name     Mejor Horario UIB digital
// @description  Muestra el nombre de las asignaturas en el horario
// @version  1.1
// @grant    none
// @match    https://uibdigital.uib.es/uibdigital/estudis/horaris/cronograma/setmana/*
// @namespace https://greasyfork.org/users/382541
// @downloadURL https://update.greasyfork.org/scripts/390746/Mejor%20Horario%20UIB%20digital.user.js
// @updateURL https://update.greasyfork.org/scripts/390746/Mejor%20Horario%20UIB%20digital.meta.js
// ==/UserScript==

function mejoradorUIBDigital() {
    var x = document.getElementsByClassName("day");
    for (var i = 5; i < x.length; i++) {
        var title = x[i].title;
        console.log(title);
        var y = x[i].getElementsByClassName("data");
        y[0].innerHTML = title;
    }
}

mejoradorUIBDigital();