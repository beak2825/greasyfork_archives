// ==UserScript==
// @name         Esperando Review en Formato Nuevo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Esperando llamadas en categorias
// @author       Lexander Ortega
// @icon         https://static-asset-delivery.hasbroapps.com/a9e79c9b34ea183cad07eb995c5f51818b6c9447/dcac37e2160ecd6a9906bae45149eabe.png
// @match        https://www.humanatic.com/pages/humfun/nocalls.cfm*
// @downloadURL https://update.greasyfork.org/scripts/426640/Esperando%20Review%20en%20Formato%20Nuevo.user.js
// @updateURL https://update.greasyfork.org/scripts/426640/Esperando%20Review%20en%20Formato%20Nuevo.meta.js
// ==/UserScript==

if(location.href ==='https://www.humanatic.com/pages/humfun/break_room.cfm'){

}

var url = window.location.href;
var masse_fichier = document.getElementsByClassName("content-text")[0];
console.log(masse_fichier);
if(url)
{
    var arrayOfStrings = url.split("/");
    if(arrayOfStrings[4])
    {
        var dossier = arrayOfStrings[4];
        if(arrayOfStrings[5])
        {
            var video = arrayOfStrings[5];
            top.location.href="https://www.humanatic.com/x19/review_reload.cfm?" + dossier + "/" + video;
}
        else
        {
           top.location.href="https://www.humanatic.com/x19/review_reload.cfm?" + dossier;
        }
    }
    else
    {
        alert("error2");
    }
}
else
{
    alert("error1");
}
