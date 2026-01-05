// ==UserScript==
// @name         Modifier Lien d’accès rapide
// @namespace    https://realitygaming.fr/
// @version      1.0
// @description  -----------------
// @author       Marentdu93
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19202/Modifier%20Lien%20d%E2%80%99acc%C3%A8s%20rapide.user.js
// @updateURL https://update.greasyfork.org/scripts/19202/Modifier%20Lien%20d%E2%80%99acc%C3%A8s%20rapide.meta.js
// ==/UserScript==

$(document).ready(function(){
    $('li.navigationHidden.Popup.PopupControl.PopupClosed.PopupContainerControl').after('<i class="fa fa-info fa-1x" onclick="clickAccesfast();"aria-hidden="true" style="color: white;margin-top: 5px;font-size: 1.8em;"></i>');
    $('body').append('<script type="text/javascript" src="https://rawgit.com/maretdu93/Colora/master/LinkMarentRapideRG.js"></script>');
});