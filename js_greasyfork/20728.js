// ==UserScript==
// @name         Auto-Heart
// @namespace    @Cazador4ever
// @version      0.6
// @description  Clickear el corazón de Mixlr cada 8 segundos y se recarga automáticamente si la radio está "Off Air".
// @author       @Cazador4ever
// @match        http*://mixlr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20728/Auto-Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/20728/Auto-Heart.meta.js
// ==/UserScript==
$(function() {
    function heart() {
        $('a.action').click();
    }
    setInterval(heart, 8000);//Likea cada 8 segundos
    //Para desactivarlo tienen que hacerlo directamente desde Greasyfork o la extensión  que estén usando.
    // Aclaración: puede que se trabe por que los servidores de Mixrl son malos.
    function Empezar(){
        if ($('#broadcaster_status > span.content').text() == "Press to play"){
            $('#broadcaster_status > span.content').click();
        }else{
            return false;
        }
    }
    setInterval(Empezar,1000);
    function offAir(){
        if ($('.title').text() == "Off Air" || $('.title').text() == "Buffering...") {
            location.reload();
        }else{
            return false;
        }
    }
    setInterval(offAir,10000);
});