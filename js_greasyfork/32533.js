// ==UserScript==
// @name         Crédit Mutuel - Prêt immo
// @namespace    http://tampermonkey.net/
// @version      0.63
// @description  Valeur du prêt immo = valeur estimée du bien - restant à rembourser
// @author       Flamby67
// @match        https://www.creditmutuel.fr/fr/banque/pageaccueil.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32533/Cr%C3%A9dit%20Mutuel%20-%20Pr%C3%AAt%20immo.user.js
// @updateURL https://update.greasyfork.org/scripts/32533/Cr%C3%A9dit%20Mutuel%20-%20Pr%C3%AAt%20immo.meta.js
// ==/UserScript==

(function() {
    var elements = [
        {
            compte: "00190 000204606 02",
            valeur: 170000
        }
    ];
    var devise = "EUR";

    $(document).ready(function() {
        // Aggrandissement des widget
        $('.ei_tile_expanded').each(function(i,e) {
            $(e).css("cssText", "height: 480px !important;");
        });

        // Pour chaque prêt, affichage de la valeur après vente
        for (var i in elements)
        {
            var compte = elements[i].compte;
            var valeur = elements[i].valeur;

            var span_montant = $(".doux:contains(" + compte + ")").parent().children('.ei_sdsf_montant');
            var a_rembourser = parseFloat(span_montant.text().replace(String.fromCharCode(160), '').replace(',', '.'));
            var plus_value = valeur + a_rembourser;

            var signe = plus_value >= 0 ? "+" : "";
            var color = plus_value >= 0 ? "pos" : "neg";
            span_montant.parent().parent().after($('<span class="fl_capital_amount ' + color + '" style="clear:right; float:right; text-align:right;">' + signe + plus_value.toLocaleString(undefined, {minimumFractionDigits: 2}) + ' ' + devise + '</span>'));

            var tile = span_montant.closest('li');
            tile.height(tile.height()+15);
        }
    });
})();