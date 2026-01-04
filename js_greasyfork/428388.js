// ==UserScript==
// @name           Retour à lavydavant DELUXE - Blabla au top
// @version        1.0
// @description    Va avec l'user style https://userstyles.world/style/208/jeuxvideo-com-ancien-theme.
// @include        http://www.jeuxvideo.com/forums.htm
// @include        https://www.jeuxvideo.com/forums.htm
// @namespace https://greasyfork.org/users/786584
// @downloadURL https://update.greasyfork.org/scripts/428388/Retour%20%C3%A0%20lavydavant%20DELUXE%20-%20Blabla%20au%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/428388/Retour%20%C3%A0%20lavydavant%20DELUXE%20-%20Blabla%20au%20top.meta.js
// ==/UserScript==

//Retablire le Forum en haut de page
function MoveBlabla()
{
    //récup la zone des forums
    var liste = document.getElementById("forum-main-col");
    var divs = liste.getElementsByTagName("div");
    //récupération de la une
    var divlaune = divs[4]
    //récup le blabla
    var blabladiv = divs[112];
  
    //cration de la zone originale 
    var zonerow = "<div class='row' id='retroforum'><div class='col-lg-6' id='laune'><div class='titre-head-bloc'><h2 class='titre-bloc'><b style='color:#000;background:#ffff66'>Forum</b> à la une</h2></div></div><div id='blabla'></div></div>"
    
    //ajout de la zone
    divs[0].outerHTML += zonerow
    //liste.innerHTML += zonerow;
    
    //mise en place des zone pour js
    var zoneretro = document.getElementById("retroforum");
    var zoneune = document.getElementById("laune");
    var zoneblabla = document.getElementById("blabla");
    //on met dans la zone crée
    zoneune.appendChild(divlaune);
    zoneblabla.appendChild(blabladiv);
}

//load les function
window.addEventListener('load', function() {
    MoveBlabla();
}, false);