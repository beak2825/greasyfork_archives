// ==UserScript==
// @name         Barre d'outils RealityGaming
// @namespace    https://realitygaming.fr/*
// @version      2.0
// @description  Ce script ajoute une barre d'outils sur le nouveau menu de RealityGaming
// @author       Paul GTP
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22976/Barre%20d%27outils%20RealityGaming.user.js
// @updateURL https://update.greasyfork.org/scripts/22976/Barre%20d%27outils%20RealityGaming.meta.js
// ==/UserScript==

$(document).ready(function(){
$(".aideTabLinks").after('<div class="Menu JsOnly tabMenu premiumTabLinks" id="XenForoUniq800" style="display: none; visibility: visible; position: fixed; right: 15px; top: 90px;"><div class="primaryContent menuHeader"><h3>Premium</h3><div class="muted">Liens rapides</div></div><ul class="secondaryContent blockLinksList"><li><a href="https://realitygaming.fr/actualites/">Actualitéé*</a></li><li><a href="https://realitygaming.fr/glitchshacksfr/">Envoie une vidéo</a></li></ul></div>');
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