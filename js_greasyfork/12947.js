// ==UserScript==
// @name        MOH_timeconversion
// @autor       Alcor
// @include     http://www.marchofhistory.com/EcranPrincipal.php*
// @version     1.4
// @grant       none
// @description Ajoute des infobulles pour convertir le temps IRL<->IG
// @namespace https://greasyfork.org/users/15102
// @downloadURL https://update.greasyfork.org/scripts/12947/MOH_timeconversion.user.js
// @updateURL https://update.greasyfork.org/scripts/12947/MOH_timeconversion.meta.js
// ==/UserScript==

$(document).on("mouseover mousemove", "#texteZoneDate", function(){
    $(this).attr("title", '05h20 Printemps - 11h20 Ete - 17h20 Automne - 23h20 hiver');
});

$(document).on("mouseover mousemove", "[data-temps]", function(){
    var listeMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "aôut", "septembre", "octobre", "novembre", "décembre"];
    var timeSec = parseInt($(this).attr('data-temps'));
    var timeDay = Math.round(timeSec/237);
    var jour = parseInt($('#HeaderDateJour').text());
    var mois = $('#HeaderDateMois').text();
    var annee = parseInt($('#HeaderDateAnnee').text());
    for (i = 0; i<12; i++){
      if(mois==listeMois[i]){
            mois=i;
            break;
        }
    }
    var jourFin = jour+timeDay;
    var moisFin = mois;
    var anneeFin = annee;
    while (jourFin>30){
        jourFin = jourFin - 30;
        moisFin = moisFin + 1;
        
    }
    while (moisFin>11){
        moisFin = moisFin - 12;
        anneeFin = anneeFin + 1;
    }
    
    $(this).attr('title', jourFin + " " + listeMois[moisFin] + " " + anneeFin);
});