// ==UserScript==
// @name         Mots flêchés 20minutes - afficher force
// @description  Afficher la force d'une grille de mots flêchés 20 minutes
// @namespace    http://taoufix.com/20min-motsfleches-afficher-force
// @version      1.0.4
// @author       taoufix
// @match        http*://rcijeux.fr/game/20minutes/mfleches?id=*
// @match        http*://www.rcijeux.fr/game/20minutes/mfleches?id=*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368869/Mots%20fl%C3%AAch%C3%A9s%2020minutes%20-%20afficher%20force.user.js
// @updateURL https://update.greasyfork.org/scripts/368869/Mots%20fl%C3%AAch%C3%A9s%2020minutes%20-%20afficher%20force.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("---- User script [20min mfleches] ----");

    var DEBUG = false;
    function getDate() {
        return window.location.href.split('=')[1];
    }

    function forceStars(force) {
        var stars = "";
        for (var i=0; i<force; i++) {
            stars += "★";
        }
        for (var j=force; j<4; j++) {
            stars += "☆";
        }
        return stars;
    }

    $.get(window.location.origin+"/drupal_game/20minutes/grids/"+getDate()+".mfj")
     .done(function( data ) {
        var force = data.split("\n")[3].split('"')[1];
        if (DEBUG) {
            console.log("force", force);
        }
        $( "#game-name" ).html("Force : " + forceStars(force));
     })
     .fail(function(err) {
        console.log("---- ERROR ----");
        console.log(err);
     });

})();
