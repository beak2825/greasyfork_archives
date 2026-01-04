// ==UserScript==
// @name         Avaliador Portal UM
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Avaliador do Portal da Um
// @author       Di Nevermore
// @match        https://alunos.uminho.pt/pt/private/qualidadenoensino/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/37308/Avaliador%20Portal%20UM.user.js
// @updateURL https://update.greasyfork.org/scripts/37308/Avaliador%20Portal%20UM.meta.js
// ==/UserScript==
//
//nota /Paginas/InqueritosUCForm.aspx
$(document).ready(function() {
    $('body').prepend(' <input type="number" id="notaadar" min="0" class="merdasbonitas" max="6">');
    $('body').prepend('<input type="button" class="merdasbonitas" value="Nota a Atribuir" id="CL">');
    $('body').prepend('<p class="merdasbonitas"> 0 - Sem opiniao / 1->6 - 1->6 </p>');
    $('body').prepend('<p class="merdasbonitas2">Disclaimer : Tem de se carregar em seguinte manualmente porque esta merda é retardada.</p>');
    $(".merdasbonitas").css("width", "20%").css("margin-left", "40%");
    $(".merdasbonitas2").css("width", "40%").css("margin-left", "35%");

    function getUrlParam(name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return (results && results[1]) || undefined;
    }

    var url = getUrlParam("id");
    if(url !== undefined){
        var nota = url;
        if ( $(".cssPassoActivo").html() !== "6"){
            $("input[value="+nota+"]").each(function(){
                console.log(nota);
                $(this).prop("checked", true);
            });
        }
    }
    $('#CL').click(function(){
        var valor = $("#notaadar").val();
        var url = window.location.href;
        window.location.href = url + "&id=" + valor;
    });
});