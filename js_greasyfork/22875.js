// ==UserScript==
// @name        AMCGAming 13333
// @description By Maxence Edite WZN
// @include     https://www.amcgaming.net/*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/47201
// @downloadURL https://update.greasyfork.org/scripts/22875/AMCGAming%2013333.user.js
// @updateURL https://update.greasyfork.org/scripts/22875/AMCGAming%2013333.meta.js
// ==/UserScript==

       $(document).ready(function(){

var css = ".barre{width:99%;border:2px solid #2F78A0;text-align:center;padding-top:20px;padding-bottom:20px;margin-left:1%;margin-right:20%;background-color:#F40101}.lien{width:18%;display:inline-block}.barre a{text-decoration:none;color:#fff;padding-bottom:20px;padding-top:44px}"

$("head").append("<style>" + css + "</style>"); 

var barre = "<br /><div class='barre'><a href='https://www.amcgaming.net/members/wells-design.3580/'><b><div class='lien'>Mon Profil </div></b></a><a href='https://www.amcgaming.net/threads/vente-de-console-id-100-unique.62/'><b><div class='lien'>Console ID AMC</div></b></a><a href='https://www.amcgaming.net/threads/ps3-lobby-all-cod-gta-v-carte-psn-%E2%9E%9C-1-starpass.143/'><b><div class='lien'>Shop MOD</div></b></a><a href='https://www.amcgaming.net/threads/lobby-gta5-call-of-duty.2274/'><b><div class='lien'>Shop Clk Modz</div></b></a><a href='https://www.amcgaming.net/threads/sp%C3%A9cial-vente-ps3-fat-3-55-jailbreak-250-giga.1176/'><b><div class='lien'>Shop COSMO PS3</div></b></a></div><br />" 


$(".titleBar").append(barre);

});