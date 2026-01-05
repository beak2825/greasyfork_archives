// ==UserScript==
// @name        displayNbrObjetDansSac
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @version     1.01
// @description Affiche sur le sac le nombre d'objets qui y est. Se rafraichit toutes les 3 secondes.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3513/displayNbrObjetDansSac.user.js
// @updateURL https://update.greasyfork.org/scripts/3513/displayNbrObjetDansSac.meta.js
// ==/UserScript==

setInterval(function(){
    for(var i = 7; i <= 9 ; i++)
    {
        var idOjb = $(".zone_case"+i+" .case_objet_type_Conteneur").attr('id');
        var quantite = $("#"+idOjb+" .durabiliteinfo span").text();
        var noeud = $("#"+idOjb+" .quantite");
        $("#"+idOjb+" .quantite").text("x"+quantite).removeClass("hidden");
    }
},3000);


