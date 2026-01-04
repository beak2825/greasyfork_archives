// ==UserScript==
// @name         Crédit Mutuel - Total tous comptes
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  afficher le total de tous les comptes sur la page d'accueil
// @author       Flamby67
// @match        https://www.creditmutuel.fr/fr/banque/pageaccueil.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40962/Cr%C3%A9dit%20Mutuel%20-%20Total%20tous%20comptes.user.js
// @updateURL https://update.greasyfork.org/scripts/40962/Cr%C3%A9dit%20Mutuel%20-%20Total%20tous%20comptes.meta.js
// ==/UserScript==

var devise = "EUR";

function fl_update_total() {
    var total = 0;
    $(".ei_compte .ei_sdsf_montant.pos, .ei_compte .fl_capital_amount.pos").each(function () {
        var amount = parseFloat(this.innerText.replace(' ', '').replace(String.fromCharCode(160), '').replace(',', '.'));
        if (!isNaN(amount)) {
            total += amount;
        }
    });

    var signe = total >= 0 ? "+" : "";
    var color = total >= 0 ? "pos" : "neg";
    $(".fl_total").remove();
    $(".ei_tile_situation .ei_tile_header").append($("<span class='fl_total " + color + "' style='font-weight:bold; margin-top:12px; margin-right:15px; clear:right; float:right; text-align:right;'>" + signe + total.toLocaleString(undefined, {minimumFractionDigits: 2}) + String.fromCharCode(160) + devise + "</span>"));
}

(function () {
    $(document).ready(function () {
        fl_update_total();

        $(".ei_compte").on("account_added", fl_update_total);
    });
})();