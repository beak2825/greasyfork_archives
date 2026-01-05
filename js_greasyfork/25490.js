// ==UserScript==
// @name        Compteur Sac
// @author      Anon, MockingJay
// @namespace   InGame
// @include     https://www.dreadcast.net/Main
// @version     1.1.1
// @description Affiche sur le sac le nombre d'objets qui y est. Se rafraichit toutes les 3 secondes.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25490/Compteur%20Sac.user.js
// @updateURL https://update.greasyfork.org/scripts/25490/Compteur%20Sac.meta.js
// ==/UserScript==

setInterval(function(){
    for(var i = 7; i <= 9 ; i++) //Pour les cases 7, 8, 9 correspondant aux sacs
    {
        var idOjb = $(".zone_case"+i+" .case_objet_type_Conteneur").attr('id');
        var quantite = $("#"+idOjb+" .durabiliteinfo span").text();
        var maxquantite = $("#"+idOjb+" .durabiliteinfo").text().split("\/");
        var noeud = $("#"+idOjb+" .quantite");
        if(quantite != maxquantite[1]) {
            $("#"+idOjb+" .quantite").text(quantite + "\/" + maxquantite[1]).css('color','white').removeClass("hidden");
        } else {
            $("#"+idOjb+" .quantite").text(quantite + "\/" + maxquantite[1]).css('color','black').removeClass("hidden");
        }
    }
},3000);


