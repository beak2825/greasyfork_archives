// ==UserScript==
// @name         V-supprimerRoutes
// @name:en      V-removeTradeRoutes
// @namespace    http://tampermonkey.net/
// @version      0.5
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       azro
// @include     *://*.travian.*/*
// @include     *://*.travian.*/*
// @include     *://*.travian.*.*/*
// @include     *://travian.*/index.php*
// @exclude     *://*.travian*.*/support.php*
// @exclude     *://help.travian*.*
// @grant  GM_addStyle
// @description supprimer toutes les routes d'un village en 2 clics
// @description:en remove all trade routes in 2 clics
// @downloadURL https://update.greasyfork.org/scripts/37443/V-supprimerRoutes.user.js
// @updateURL https://update.greasyfork.org/scripts/37443/V-supprimerRoutes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $$ = jQuery.noConflict();
    if ($$("#build").hasClass( "gid17" )) {
        boutonSupprimerRoutes();
    }
})();
//------------------------------------------------------------------------------
function boutonSupprimerRoutes(){
    let $$ = jQuery.noConflict();
    $$(".a.arrow").first().parent().css("width","50%");
    let element = '<div id="boutonSupprDiv"><button id="supprimerRoutes" class="green prepare"><div class="button-container addHoverClick"><div class="button-background"><div class="buttonStart">'+
        '<div class="buttonEnd"><div class="buttonMiddle"></div></div></div></div><div class="button-content">Supprimer TOUTES les routes</div></div></button></div>';
    $$(".a.arrow").first().parent().after(element);
    $$("#boutonSupprDiv").css("text-align","right");
    $$("#supprimerRoutes").css("margin-bottom","5px");
    $$("#supprimerRoutes").click(function(){
        supprimerRoutes();
    });
}

function supprimerRoutes() {
    let $$ = jQuery.noConflict();

    if(confirm("Êtes-vous sûr de vouloir supprimer TOUTES les routes de ce village ?\n'OK' pour continuer sinon 'Annuler'")==true){
        $$('.sel').each(function(){
            let lien = $$(this).find("a").attr("href");
            $$.get(lien);
        });
    }
}