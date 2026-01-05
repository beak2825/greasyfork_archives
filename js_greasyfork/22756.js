// ==UserScript==

// @name         Modératorbar
// @namespace    https://realitygaming.fr/
// @version      1.0
// @description  -----------------
// @author       Weyzen
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22756/Mod%C3%A9ratorbar.user.js
// @updateURL https://update.greasyfork.org/scripts/22756/Mod%C3%A9ratorbar.meta.js
// ==/UserScript==

$(document).ready(function(){

var css = ".barre{width:99%;border:2px solid #2F78A0;text-align:center;padding-top:20px;padding-bottom:20px;margin-left:1%;margin-right:20%;background-color:#2F78A0}.lien{width:18%;display:inline-block}.barre a{text-decoration:none;color:#fff;padding-bottom:20px;padding-top:44px}"

$("head").append("<style>" + css + "</style>"); 

var barre = "<br /><div class='barre'><a href='https://realitygaming.fr/teams/sharing-exclusive-contents.1736/'><b><div class='lien'>Sharing Exclusive Content</div></b></a><a href='https://realitygaming.fr/teams/playstation.1723/'><b><div class='lien'>Playstation Community</div></b></a><a href='https://realitygaming.fr/premium'><b><div class='lien'>Grade Premium</div></b></a><a href='https://realitygaming.fr/conversations/add?to=WZN+GHT'><b><div class='lien'>Besoin d'aide ? </div></b></a><a href='https://realitygaming.fr/actualites/'><b><div class='lien'>Dernier Actualité </div></b></a></div><br />" 


$(".titleBar").append(barre);

});