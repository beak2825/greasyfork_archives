
// ==UserScript==
// @name        RealityGamingBar 13211
// @description By Maxence
// @include     https://realitygaming.fr/*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/47201
// @downloadURL https://update.greasyfork.org/scripts/22862/RealityGamingBar%2013211.user.js
// @updateURL https://update.greasyfork.org/scripts/22862/RealityGamingBar%2013211.meta.js
// ==/UserScript==

       $(document).ready(function(){

var css = ".barre{width:99%;border:2px solid #BFCBCA;text-align:center;padding-top:20px;padding-bottom:20px;margin-left:1%;margin-right:20%;background-color:#710000}.lien{width:18%;display:inline-block}.barre a{text-decoration:none;color:#fff;padding-bottom:20px;padding-top:44px}"

$("head").append("<style>" + css + "</style>"); 

var barre = "<br /><div class='barre'><a href='https://realitygaming.fr/members/wzn-ght.535977/'><b><div class='lien'>Mon Profil</div></b></a><a href='https://realitygaming.fr/conversations/add?to=WZN+GHT'><b><div class='lien'>Me Contact</div></b></a><a href='https://realitygaming.fr/premium'><b><div class='lien'>Abonnement Payant</div></b></a><a href='https://realitygaming.fr/forums/suggestions.143/'><b><div class='lien'>Suggestion </div></b></a><a href='https://realitygaming.fr/actualites/'><b><div class='lien'>Actualité </div></b></a></div><br />" 


$(".titleBar").append(barre);

});