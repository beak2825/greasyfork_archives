// ==UserScript==
// @name         Barre d'outils iHax
// @namespace    https://ihax.fr/*
// @version      2.0
// @description  iHax Barre T'outils !
// @author       Paul GTP Edit : Weyzen
// @match        https://ihax.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29740/Barre%20d%27outils%20iHax.user.js
// @updateURL https://update.greasyfork.org/scripts/29740/Barre%20d%27outils%20iHax.meta.js
// ==/UserScript==

$(document).ready(function(){
$(".aideTabLinks").after('<div class="Menu JsOnly tabMenu premiumTabLinks" id="XenForoUniq800" style="display: none; visibility: visible; position: fixed; right: 15px; top: 90px;"><div class="primaryContent menuHeader"><h3>Premium</h3><div class="muted">Liens rapides</div></div><ul class="secondaryContent blockLinksList"><li><a href="https://realitygaming.fr/premium">Achatium</a></li><li><a href="https://realitygaming.fr/categories/zone-premium.66/">Zone</a></li></ul></div>');
$(".publicTabs").append('<li class="navTab members Popup PopupControl PopupContainerControl" id="premiumNavTab" style="float: right; margin-right: 15px;"><a class="navLink" nopopupgadget="" rel="Menu">Premium<span class="arrowWidget"></span></a><a href="https://realitygaming.fr/premium" class="SplitCtrl" rel="Menu"></a></li> <li class="navTab forums Popup PopupControl PopupClosed PopupContainerControl" style="float: right;"><a href="https://realitygaming.fr/sans-reponses/threads/" class="navLink" nopopupgadget="" rel="Menu">Sans réponses</a></li>');

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