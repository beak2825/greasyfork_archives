// ==UserScript==
// @name         Barre d'outils RealityGaming
// @namespace    https://realitygaming.fr/*
// @version      2.0
// @description  Ce script ajoute une barre d'outils sur le nouveau menu de RealityGaming
// @author       Paul GTP
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23487/Barre%20d%27outils%20RealityGaming.user.js
// @updateURL https://update.greasyfork.org/scripts/23487/Barre%20d%27outils%20RealityGaming.meta.js
// ==/UserScript==

$(document).ready(function(){
$(".aideTab").after('<div class="Menu JsOnly tabMenu premiumTabLinks" id="XenForoUniq800" style="display: none; visibility: visible; position: fixed; right: 15px; top: 90px;"><div class="primaryContent menuHeader"><h3>Abonnement Payant</h3><div class="muted">Liens rapides</div></div><ul class="secondaryContent blockLinksList"><li><a href="https://ihax.fr/premium/">Achat du VIP/Premium</a></li><li><a href="https://ihax.fr/forums/lobby-gratuit.5/">Lobby Gratuit</a></li></ul></div>');
$(".publicTabs").append('<li class="navTab members Popup PopupControl PopupContainerControl" id="premiumNavTab" style="float: right; margin-right: 15px;"><a class="navLink" nopopupgadget="" rel="Menu">xenForo<span class="arrowWidget"></span></a><a href="https://ihax.fr/forums/questions-aides-et-recherches.29/" class="SplitCtrl" rel="Menu"></a></li> <li class="navTab forums Popup PopupControl PopupClosed PopupContainerControl" style="float: right;"><a href="https://ihax.fr/forums/netflix-spotify-hulu-etc.20/" class="navLink" nopopupgadget="" rel="Menu">Compte Partage</a></li> <li class="navTab rg-teams Popup PopupControl PopupClosed PopupContainerControl" style="float: right;"><a href="" class="navLink" nopopupgadget="https://ihax.fr/account/change-username" rel="Menu">Changement de Pseudo</a></li>');

$("#membreNavTab").hover(
function() {
$(".tabMenu").css('display','none');
$("#XenForoUniq800").css('display','block');
});

$("body").click(
function() {
$("#XenForoUniq800").css('display','none');
});
});