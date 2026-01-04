// ==UserScript==
// @name Nucleo Robot TprenD 2
// @namespace   https://greasyfork.org/es/scripts/377368-nucleo-robot-tprend-2
// @version 2.5
// @description TprenD likea todo canal Global - Autofollow y crapero también (v6)
// @author by @kchamat
// @match   https://classic.taringa.net/TprendMod*
// @include https://classic.taringa.net/*
// @exclude https://classic.taringa.net/*/siguiendo/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377368/Nucleo%20Robot%20TprenD%202.user.js
// @updateURL https://update.greasyfork.org/scripts/377368/Nucleo%20Robot%20TprenD%202.meta.js
// ==/UserScript==

// ---- Para utilizarlo con otra cuenta debe cambiar la palabra TPRENDMOD por su Nick de Usuario y el numero de user_id por el id de su cuenta
// ---- si desconoce el id de su cuenta ingrese en https://api.taringa.net/user/nick/view/SU_PROPIO_NICK

(function() {
    'use strict';
	window.stop();
    var user_nick="TprendMod";
    var user_id="29024560";
    var segundos=300;
    var seg_espera_entre=60;
    $('head').append('<meta http-equiv="refresh" content="'+segundos+'">' );
// funcion redirigir a tal url en 10 segundos
    function redirigir_a_en(url,seg) {
		var a = document.createElement("a");
		a.href = url;
        setTimeout(function() {
            a.click();
        }, seg*1000);
	}
// funcion reshoutero
    function reshoutero(id_shout,owner_id) {
	      $.ajax({
        url: '/ajax/shout/add',
        type: 'post',
        dataType: 'json',
        data: {
            key: global_data.user_key,
            parent_id: id_shout,
                        parent_owner: owner_id
        },
        success: function(res) {
            callback(res);
        },
        error: function(xhr, status, error){
            callback(xhr);
        }
    });
	}
// funcion crapero
    function crapero(owner_nick,contenido,image_url) {
    contenido=texto+"\n <════Se lo re crapié a @"+owner_nick+"════>";
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
	}
// funcion seguir
    function devuelve_follow(nro_page) {

$.getJSON("https://api.taringa.net/user/followers/view/"+user_id+"?trim_user=true&count=25&page="+nro_page, function(data) {
        $.each(data, function(nro_item2,user2) {
        var id = user2;
                        notifica.ajax(Array("action=follow","type=user","obj=" + id),null,null,true,false);
                });
    });
  	}
// Like a todo
    function likeatodo() {
       $.getJSON("https://api.taringa.net/shout/public/view", function(data) {
 setTimeout(function() { }, 500);
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
	}
///función para abrir en una 2da pestaña e ir dando unfollow
function abrirEnPestana(url) {
		var a = document.createElement("a");
		a.target = "_al_lado";
		a.href = url;
		a.click();
	}
// funcion casino
    function casino_shout() {
	//Juega a los dados, si sale 1 crapea un shout si sale 2 lo reshoutea
$.getJSON( "https://api.taringa.net/shout/random/view", function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
items.push( key + ":" + val + "<br>" );
 });
    var chance=Math.floor((Math.random() * 45) + 1);
    var tipo_shout=data.attachment.type;
    var owner_nick=data.owner.nick;
    var owner_id=data.owner.id;
    var id_shout=data.id;
    var texto=data.body;
    var seleccionador=chance+tipo_shout;
    var image_url=data.attachment.url;
    var contenido=" ";
//Crapeo al azar
    if (seleccionador=='1image'){
//crapero(owner_nick,contenido,image_url);
 }
//Reshout al azar
if (seleccionador=='2image'){reshoutero(id_shout,owner_id);      }
if (seleccionador=='3image'){reshoutero(id_shout,owner_id);      }
});
	}
//Likeando todo todo todo cada 1 minuto
    var icha;
    likeatodo();
for (icha = 1; icha < 6 ; icha++) {
     setTimeout(function() {
    var nro_page =Math.floor((Math.random() * 19));
    devuelve_follow(nro_page);
        }, seg_espera_entre*1000);
    setTimeout(function() {
    likeatodo();
    }, seg_espera_entre*1000);
    setTimeout(function() {
    casino_shout();
     }, seg_espera_entre*1000);
}
// métodos de comportamiento cíclico
//$('head').append('<meta http-equiv="refresh" content="'+segundos+'">' );
//var url='https://classic.taringa.net/'+user_nick;
//redirigir_a_en(url,segundos);
//var nedge='https://classic.taringa.net/'+user_nick+'/siguiendo/'+(nro_page);
//abrirEnPestana(nedge);
})();