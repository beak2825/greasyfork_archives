// ==UserScript==
// @name Nucleo Robot TprenD 1.5
// @namespace   https://greasyfork.org/es/scripts?set=334066
// @version 1.5
// @description TprenD likea todo canal Global - Autofollow y crapero también (v6)
// @author by @kchamat 
// @match   https://classic.taringa.net/TprendMod*
// @include https://classic.taringa.net/*
// @exclude https://classic.taringa.net/*/siguiendo/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377500/Nucleo%20Robot%20TprenD%2015.user.js
// @updateURL https://update.greasyfork.org/scripts/377500/Nucleo%20Robot%20TprenD%2015.meta.js
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
        // funcion redirigir a tal url en 10 segundos
    function redirigir_a_en(url,seg) {
		var a = document.createElement("a");
		a.href = url;
        setTimeout(function() {
            a.click();
        }, seg*1000);
	}
// funcion para cambiar la url, por la siguiente,
    function change_my_url(sig_url){
    var stateObj = { foo: "bar" };
    history.pushState(stateObj, "page 2", sig_url);
}
var nro_page = parseInt(getParameterByName('pagina'))+1;
if (isNaN(nro_page)){
    nro_page=0;
    }
if (nro_page>80){
    nro_page=0;
    }


var url='https://classic.taringa.net/'+user_nick+'?pagina='+nro_page;
var siguiente_url='/'+user_nick+'?pagina='+nro_page;
redirigir_a_en(url,segundos);
change_my_url(siguiente_url);
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


    //Juega a los dados, si sale 1 re crapea un shout siempre que sea imagen
$.getJSON( "https://api.taringa.net/shout/random/view", function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
items.push( key  + ":" + val + "<br>" );
 });
    var chance=Math.floor((Math.random() * 3) + 1);
    var tipo_shout=data.attachment.type
    var owner_nick=data.owner.nick
    var id_shout=data.id;
    var texto=data.body;
    console.log(chance);
    console.log(tipo_shout);
    var seleccionador=chance+tipo_shout;
    if (seleccionador=='1image'){
    var image_url=data.attachment.url
    var contenido=texto+"\n ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ ¨ Se lo re crapíe a @"+owner_nick;
       $.ajax({
                type    : 'POST',
                dataType: 'json',
                url      : '/ajax/shout/add',
                        data     : {
                            key             : global_data.user_key,
                            body            : contenido,
                            privacy         : 0,
                            attachment_type : 1,
                            attachment      : image_url
                        }
                });
new Audio('https://www.soundjay.com/button/sounds/button-44.mp3').play();
        }
});
///función para abrir en una 2da pestaña e ir dando unfollow
function abrirEnPestana(url) {
		var a = document.createElement("a");
		a.target = "_al_lado";
		a.href = url;
		a.click();
	}
var nedge='https://classic.taringa.net/'+user_nick+'/siguiendo/'+(nro_page-1);
abrirEnPestana(nedge);
})();