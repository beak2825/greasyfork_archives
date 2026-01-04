// ==UserScript==
// @name           Vanis.io autorespawn extension
// @namespace      DISCORD:regae#4059
// @version        0.6.0
// @description    Vanis.io autorespawn
// @author         eager
// @compatible     chrome
// @compatible     opera
// @match        https://vanis.io/*
// @include        about:blank
// @run-at         document-start
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419566/Vanisio%20autorespawn%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/419566/Vanisio%20autorespawn%20extension.meta.js
// ==/UserScript==

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