// ==UserScript==
// @name FollowAll (Reload110)
// @namespace https://greasyfork.org/en/users/243179-kchamat
// @version 0.11
// @description Seguir a usuarios recomendados por el MI de Reload110 hardworld.xyz 
// @author Autofollow by @kchamat based on @Cazador4ever CazaTools
// @match http*://hardworld.xyz/mi/*
// @include http*://hardworld.xyz/mi/
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/383419/FollowAll%20%28Reload110%29.user.js
// @updateURL https://update.greasyfork.org/scripts/383419/FollowAll%20%28Reload110%29.meta.js
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
$(".boto.gris").click();
}
var ichi;
    ichi=0;
for (ichi = 0; ichi < 15 ; ichi++) {
setTimeout(function() {
seguir();
}, ichi*7000);
}
setTimeout(function() {
location.reload();
}, 65000);
ocultar("div#mydialog");
ocultar("div#mask");
})(jQuery);