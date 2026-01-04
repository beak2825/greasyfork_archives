// ==UserScript==
// @name         easier respawn for vanis.io
// @namespace    easier respawn for vanis.io
// @version      1.1
// @description  FUCK YOU
// @author       Shimm#5212
// @match        https://vanis.io/*
// @match        https://dev.vanis.io/*
// @run-at       document-start
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      http://code.jquery.com/ui/1.9.2/jquery-ui.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408470/easier%20respawn%20for%20vanisio.user.js
// @updateURL https://update.greasyfork.org/scripts/408470/easier%20respawn%20for%20vanisio.meta.js
// ==/UserScript==



// wadddup bois its me Shimm...now gimme your food.


///start
var tempo;
var cont = document.getElementsByClassName("container")
function verificar(){

    if(cont[2].style.display== ""){

        document.querySelector("[data-v-b0b10308]").click();
}}
function iniciar(){

    tempo = setInterval(verificar, 500)
}
iniciar()
////end