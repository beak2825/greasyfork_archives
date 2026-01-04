// ==UserScript==
// @name Auto:Follow-Unfollow V6
// @version 0.9
// @description Follow a los que siguen y Unfollow a quienes no
// @author by @kchamat based on @Cazador4ever CazaTools
// @match https://classic.taringa.net/*/siguiendo/*
// @include https://classic.taringa.net/*/siguiendo
// @grant none
// @namespace https://greasyfork.org/users/243179
// @downloadURL https://update.greasyfork.org/scripts/382376/Auto%3AFollow-Unfollow%20V6.user.js
// @updateURL https://update.greasyfork.org/scripts/382376/Auto%3AFollow-Unfollow%20V6.meta.js
// ==/UserScript==

(function($) {
'use strict';
// ---- Para utilizarlo con otra cuenta debe cambiar a continuación su Nick de Usuario y el numero de user_id por el id de su cuenta
 var user_nick="Kchamat";
// ---- si desconoce el id de su cuenta ingrese en https://api.taringa.net/user/nick/view/SU_PROPIO_NICK
 var user_id="78902"
 
var nedge=Math.floor((Math.random() * 50 + 2));
 setTimeout(function() {
 var nro_page =Math.floor((Math.random() * 5));
 devuelve_follow(nro_page);
        }, 500);
$('head').append('<meta http-equiv="refresh" content="30,https://classic.taringa.net/Kchamat/siguiendo/'+nedge+'">' );
    //funcion seguir
    function devuelve_follow(nro_page) {
$.getJSON("https://api.taringa.net/user/followers/view/"+user_id+"?trim_user=true&count=5&page="+nro_page, function(data) {
        $.each(data, function(nro_item2,user2) {
        var id = user2;
                        notifica.ajax(Array("action=follow","type=user","obj=" + id),null,null,true,false);
                });
    });
  	}
     //funcion Quitar los que me siguen
    function quitar(){
$(".mesigue").each(function(){
    $(this).next().children().removeClass('following');
    $(this).next().children().removeClass('unfollowing');
});
}
quitar();
    $(".following:first").each(function(){
    $(this).mouseover();
});
    setTimeout(function() {
$(".btn.r.unfollowing").click();
}, 1000);
})(jQuery);