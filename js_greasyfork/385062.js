// ==UserScript==
// @name FollowAll (La Polla)
// @namespace https://greasyfork.org/en/users/243179-kchamat
// @version 0.11
// @description A partir de un perfil de un usuario sigue a los seguidos y seguidores de este
// @author Autofollow by @kchamat based on @Cazador4ever CazaTools
// @match http://lapolladesertora.net/perfil/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/385062/FollowAll%20%28La%20Polla%29.user.js
// @updateURL https://update.greasyfork.org/scripts/385062/FollowAll%20%28La%20Polla%29.meta.js
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
    if ($(".btn_g.follow_user_post").length ) {
        $(".btn_g.follow_user_post").click();
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
 if ($(".list-element").length ) {
    var cuantos=$(".list-element").length
    var dado=Math.floor((Math.random() * cuantos) + 1);
    var ichus=0;
    for (ichus = 0; ichus < dado-1 ; ichus++) {
        $(".list-element:first").removeClass("list-element");
}
 $(".list-element:first").children().children(".listado-avatar").children("a").click();
$(".list-element:first").children().children(".listado-avatar").children("a").addClass("selected");
$(".selected").children().click();
        }
    else {window.history.go(-2)}
}
//--empieza
    seguir();
setTimeout(function() {
random();
seguir();

}, 5000);
//ocultar("div#mydialog");
//ocultar("div#mask");
})(jQuery);
