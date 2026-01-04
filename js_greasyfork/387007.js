// ==UserScript==
// @name FollowAll (Killeringa)
// @namespace https://greasyfork.org/en/users/243179-kchamat
// @version 0.11
// @description A partir de un perfil de un usuario sigue a los seguidos y seguidores de este
// @author Autofollow by @kchamat based on @Cazador4ever CazaTools
// @match https://killeringa.org/perfil/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/387007/FollowAll%20%28Killeringa%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387007/FollowAll%20%28Killeringa%29.meta.js
// ==/UserScript==

(function($) {
'use strict';
    //--ocultar un objeto
function ocultar(objeto){
var styles = objeto+'{display:none; margin-top:5000px; }';
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet)
}
//--seguir
function seguir(){
    if ($(".follow_user_post").length ) {
        $(".follow_user_post").click();

        }
    else {window.history.go(-2)}
}
    setTimeout(function() {
    var direccion=Math.floor(Math.random() *2);
    if (direccion=0){$("#seguidores").click();}
    else {$("#siguiendo").click();}
}, 1000);
    //--random
function random(){
 if ($(".zebrados").length ) {
    var cuantos=$(".zebrados").length
    var dado=Math.floor((Math.random() * cuantos) + 1);
    var ichus=0;
    for (ichus = 0; ichus < dado-1 ; ichus++) {
        $(".zebrados:first").removeClass("zebrados");
}
// $(".zebrados:first").children(".avt").click();
 $(".zebrados:first").children(".avt").addClass("selected");
$(".selected").children().click();
        }
    else {window.history.go(-2)}
}
//--empieza
    seguir();
setTimeout(function() {
random();
//seguir();

}, 20000);
//ocultar("div#mydialog");
//ocultar("div#mask");
})(jQuery);
