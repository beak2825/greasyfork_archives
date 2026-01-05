// ==UserScript==
// @name         Barre d'outils iHax
// @namespace    https://ihax.fr/*
// @version      2.0
// @description  Ce script ajoute une barre d'outils sur le nouveau menu de iHax
// @author       Paul GTP Edite par WZN
// @match        https://ihax.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23476/Barre%20d%27outils%20iHax.user.js
// @updateURL https://update.greasyfork.org/scripts/23476/Barre%20d%27outils%20iHax.meta.js
// ==/UserScript==

$(document).ready(function(){
$(".aideTabLinks").after('<div class="Menu JsOnly tabMenu premiumTabLinks" id="XenForoUniq800" style="display: none; visibility: visible; position: fixed; right: 15px; top: 90px;"><div class="primaryContent menuHeader"><h3>Premium</h3><div class="muted">Liens rapides</div></div><ul class="secondaryContent blockLinksList"><li><a href="https://ihax.fr/premium/">Achat du Premium</a></li><li><a href="https://ihax.fr/forums/questions-aides-et-recherches.29/">Question Aide et recherche</a></li></ul></div>');
$(".publicTabs").append('<li class="navTab members Popup PopupControl PopupContainerControl" id="premiumNavTab" style="float: right; margin-right: 15px;"><a class="navLink" nopopupgadget="" rel="Menu">Lobby Gratuit<span class="arrowWidget"></span></a><a href="https://ihax.fr/forums/lobby-gratuit.5/" class="SplitCtrl" rel="Menu"></a></li> <li class="navTab members Popup PopupControl PopupClosed PopupContainerControl" style="float: right;"><a href="https://ihax.fr/account/change-username" class="navLink" nopopupgadget="" rel="Menu">Changement de pseudo</a></li> <li class="navTab forums Popup PopupControl PopupClosed PopupContainerControl" style="float: right;"><a href="https://ihax.fr/forums/netflix-spotify-hulu-etc.20/" class="navLink" nopopupgadget="" rel="Menu">Compte Partage</a></li>');

$("#premiumNavTab").hover(
function() {
$(".tabMenu").css('display','none');
$("#XenForoUniq800").css('display','block');
});

$("body").click(
function() {
$("#XenForoUniq800").css('display','none');
});
});