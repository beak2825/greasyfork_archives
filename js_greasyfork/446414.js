// ==UserScript==
// @name        SensCritique : Matching Popcorns
// @namespace   sc-valid-popcorns
// @version     0.3.1
// @description Valide rapidement tous les conflits Popcorns.
// @author      Emilien
// @match       https://www.senscritique.com/admin/popcorns*
// @grant       none
// @icon        https://www.senscritique.com/app-icons/android-chrome-192x192.png
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446414/SensCritique%20%3A%20Matching%20Popcorns.user.js
// @updateURL https://update.greasyfork.org/scripts/446414/SensCritique%20%3A%20Matching%20Popcorns.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    $( document ).dblclick(function() {

        $("button span:contains('Désactiver le produit'), button span:contains('Activer le produit')").each(function() {
            $(this).click();
        });

    });


    // Bouton de recherche SC rapide

    var timer = setInterval(addSearchButton, 1000);

    function addSearchButton() {

        if ($(".bIFohk").length) {

            $(".bIFohk").each(function() {
                var title = $(this).find("div").eq(6).html();

                $(this).find(".cARlhU").css("grid-template-columns", "140px 16px min-content");
                $(this).find(".cARlhU").append('<a href="https://old.senscritique.com/recherche?query='+title+'" target="_blank" class="csXgrb MatchingItem__Lens-stvf67-2 FFoqt" name="lens"></div>');
            });

            clearInterval(timer);
            console.log("Added custom Userscript");
        }

    }


})();