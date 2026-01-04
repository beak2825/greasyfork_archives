// ==UserScript==
// @name        SensCritique : Matching CNC
// @namespace   sc-cnc-matching
// @version     0.1
// @description Ajoute un bouton pour ignorer les produits inconnus.
// @author      Emilien
// @match       https://admin.senscritique.com/matcher/cnc*
// @grant       none
// @icon        https://www.senscritique.com/favicon-32x32.png
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434591/SensCritique%20%3A%20Matching%20CNC.user.js
// @updateURL https://update.greasyfork.org/scripts/434591/SensCritique%20%3A%20Matching%20CNC.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    $("table a").attr('target','_blank');

    $(".btn-success").after(`<input class="btn btn-small twipsy btn-danger" data-original-title="Ignorer" type="button" value="Ignorer" id="ignore-cnc-product" style="float:right;">`);
    $(".btn-danger").click(function() {
        $(this).parent().find("fieldset #productId").attr("value", "0");
        $(this).parent().submit();
    });
})();