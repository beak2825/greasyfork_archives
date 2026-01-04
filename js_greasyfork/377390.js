// ==UserScript==
// @name Nucleo Robot TprenD
// @namespace TprenD - Robot programado para amar sin condiciones
// @version 1.2
// @description TprenD likea todos los shouts del canal Global (v6)
// @author by @kchamat 
// @match   https://classic.taringa.net/TprendMod*
// @exclude https://classic.taringa.net/*/siguiendo/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377390/Nucleo%20Robot%20TprenD.user.js
// @updateURL https://update.greasyfork.org/scripts/377390/Nucleo%20Robot%20TprenD.meta.js
// ==/UserScript==

// ---- Para utilizarlo con otra cuenta debe cambiar la palabra TPRENDMOD por su Nick de Usuario y el numero de user_id por el id de su cuenta
// ---- si desconoce el id de su cuenta ingrese en https://api.taringa.net/user/nick/view/SU_PROPIO_NICK

(function() {
    'use strict';
    var user_nick="TprendMod";
    var user_id="29024560";
    var segundos=150;
    window.stop();
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var nro_page = parseInt(getParameterByName('pagina'))+1;
if (isNaN(nro_page)){
    nro_page=0;
    }
if (nro_page>80){
    nro_page=0;
    }

    // funcion redirigir a tal url en 10 segundos
    function redirigir_a_en(url,seg) {
		var a = document.createElement("a");
		a.href = url;
        setTimeout(function() {
            a.click();
        }, seg*1000);

	}
var url='https://classic.taringa.net/'+user_nick+'?pagina='+nro_page;
redirigir_a_en(url,segundos);

    $.getJSON("https://api.taringa.net/shout/public/view", function(data) {
    $.each(data, function(i, item) {
        var id = item.id;
        var owner = item.owner.id;
        $.ajax({
            url: '/ajax/shout/vote',
            type: 'post',
            dataType: 'json',
            data: {
                owner: owner,
                uuid: id,
                score: 1
            },
        });
    });
});
    //Seguir usuarios desde nro_page
var urlapi="https://api.taringa.net/user/followers/view/"+user_id+"?trim_user=true&count=30&page="+nro_page;
//alert(urlapi);
    $.getJSON("https://api.taringa.net/user/followers/view/"+user_id+"?trim_user=true&count=30&page="+nro_page, function(data) {
        $.each(data, function(nro_item2,user2) {
        var id =  user2;
                        notifica.ajax(Array("action=follow","type=user","obj=" + id),null,null,true,false);
                });
    });
new Audio('https://www.soundjay.com/button/sounds/button-44.mp3').play();
function abrirEnPestana(url) {
		var a = document.createElement("a");
		a.target = "_al_lado";
		a.href = url;
		a.click();
	}
var nedge='https://classic.taringa.net/'+user_nick+'/siguiendo/'+(nro_page-1);
abrirEnPestana(nedge);
})();