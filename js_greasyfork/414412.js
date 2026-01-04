// ==UserScript==
// @name         Vanis auto respawn
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vanis skip stats script
// @author       You
// @match        https://vanis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414412/Vanis%20auto%20respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/414412/Vanis%20auto%20respawn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ///start
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

})();