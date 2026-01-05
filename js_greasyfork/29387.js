// ==UserScript==

// @name         Modératorbar
// @namespace    https://ihax.fr/
// @version      1.0
// @description  -----------------
// @author       Weyzen
// @match        https://ihax.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29387/Mod%C3%A9ratorbar.user.js
// @updateURL https://update.greasyfork.org/scripts/29387/Mod%C3%A9ratorbar.meta.js
// ==/UserScript==

$(document).ready(function(){

var css = ".barre{width:99%;border:2px solid #2F78A0;text-align:center;padding-top:20px;padding-bottom:20px;margin-left:1%;margin-right:20%;background-color:#2F78A0}.lien{width:18%;display:inline-block}.barre a{text-decoration:none;color:#fff;padding-bottom:20px;padding-top:44px}"

$("head").append("<style>" + css + "</style>"); 

var barre = "<br /><div class='barre'><a href='https://ihax.fr/forums/questions-aides-et-recherches.29/'><b><div class='lien'>Question Aide & Recherche</div></b></a><a href='https://ihax.fr/forums/lobby-gratuit.5/'><b><div class='lien'>Lobby Gratuit</div></b></a><a href='https://ihax.fr/premium/'><b><div class='lien'>Abonnement</div></b></a><a href='https://ihax.fr/taigachat-terms/'><b><div class='lien'>Règlement Shoutbox</div></b></a><a href='https://ihax.fr/forums/netflix-spotify-etc.20/'><b><div class='lien'>Compte Leak  </div></b></a></div><br />" 


$(".titleBar").append(barre);

});