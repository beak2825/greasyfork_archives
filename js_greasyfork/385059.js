// ==UserScript==
// @name FollowAll (LincesX)
// @namespace https://greasyfork.org/en/users/243179-kchamat
// @version 0.11
// @description Seguir a usuarios recomendados por el MI de LincesX
// @author Autofollow by @kchamat based on @Cazador4ever CazaTools
// @match http*://lincesx.ga/mi/*
// @include http*://lincesx.ga/mi/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/385059/FollowAll%20%28LincesX%29.user.js
// @updateURL https://update.greasyfork.org/scripts/385059/FollowAll%20%28LincesX%29.meta.js
// ==/UserScript==

(function($) {
'use strict';
function ocultar(objeto){
var styles = objeto+'{display:none; margin-top:5000px; }';
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet)
}
function seguir(){
$(".zebrea").children(".floatR").children(".boto.gris").click();
}
seguir();

setTimeout(function() {
location.reload();
}, 1000);
//ocultar("div#mydialog");
ocultar("div#mask");
})(jQuery);