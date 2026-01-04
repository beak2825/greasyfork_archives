// ==UserScript==
// @name         RecoveryButton
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Recupera el boton!
// @author       SStvAA
// @license      MIT
// @match        https://render.figure-eight.io/
// @match        https://tasks.figure-eight.work/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392025/RecoveryButton.user.js
// @updateURL https://update.greasyfork.org/scripts/392025/RecoveryButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elemento = document.getElementsByClassName("form-actions");
    if(elemento.length > 1){
        alert("ERROR: Numero de clases excedido.");
    }
    else if(elemento.length == 0){
        alert("ERROR: Pagina desconocida.");
    }
    else{
        for(var i = 0; i < elemento.length; i++){
            elemento[i].id= "tst1";}
        document.getElementById('tst1').innerHTML='<input type="submit" class="submit btn btn-cf-blue" value="Enviar y Continuar">';
        document.getElementById('tst1').removeAttribute("id");
        console.log("listo");
    }
})();