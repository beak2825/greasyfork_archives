// ==UserScript==
// @name         Copiar nombre Smart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copiar nombre del Modem a un click!
// @author       Facu
// @match        https://cooperativacodec.smartolt.com/onu/view/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/420239/Copiar%20nombre%20Smart.user.js
// @updateURL https://update.greasyfork.org/scripts/420239/Copiar%20nombre%20Smart.meta.js
// ==/UserScript==

$(document).ready(function(){
    //
    // Selectores de texto
    //

    var texta = $("#content-wrapper > div.container > div.container-fluid.onu-wrapper > div:nth-child(3) > dl > dd:nth-child(10) > a").text();
    var textb = $("#content-wrapper > div.container > div.container-fluid.onu-wrapper > div:nth-child(3) > dl > dd:nth-child(20) > a").text();

    //
    // Convertir nombre a Askey o Mitra
    //

    if (texta.indexOf("ASKY") >= 0) {
        texta = "askey"
    } else if (texta.indexOf("MSTC") >= 0) {
        texta = "mitra"
    }

    //
    // Dejar solo numeros y letras como variable
    //

    textb = textb.replace(/[^a-zA-Z0-9 _]/g,'');

    //
    // Agregar botón e input
    //

    $("#content-wrapper > div.container > div.container-fluid.onu-wrapper > dl > dd:nth-child(2)").append("<div class='alert-warning boton-extra' style='width: 119px; padding: 10px; border-radius: 5px;'>Copiar nombre</div>")

    $("#signalLink").append("<input type='text' class='nombrefinal' style='opacity:0;'>")

    //
    // Agregar valor al input y copiar
    //

    $(".nombrefinal").val(texta+textb);

    $(".boton-extra").click(function(){
        $('.nombrefinal').select()
        document.execCommand("copy");
    });

    //
    // Efectos miscelaneos
    //

    $(".boton-extra").hover(function(){
        $(this).css("background-color", "#c87f0a");
    }, function(){
        $(this).css("background-color", "#f39c12");
    });

});