// ==UserScript==
// @name         Crédit Mutuel - PEG
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  afficher le montant de l'épargne salariale sur la page d'accueil
// @author       Flamby67
// @match        https://www.creditmutuel.fr/fr/banque/pageaccueil.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32504/Cr%C3%A9dit%20Mutuel%20-%20PEG.user.js
// @updateURL https://update.greasyfork.org/scripts/32504/Cr%C3%A9dit%20Mutuel%20-%20PEG.meta.js
// ==/UserScript==

(function() {
    var nb_accounts = 2;
    var devise = "EUR";

    $(document).ready(function() {
        var target_url = "/fr/banque/epargne_salariale/devbavoirs.aspx?mode=net&menu=cpte&_pid=SituationGlobale";

        var tile = $('<li><a href="' + target_url + '"><span><strong>Epargne salariale</strong> <strong></strong><span><span class="_c1 doux _c1"></span><span class="d ei_sdsf_montant _c1 pos _c1">...</span></span></span></a></li>');
        tile.css('display', 'none');

        $(".ei_compte").first().append(tile);

        var i = 0;
        var total_amount = 0;
        function call_epargne_salariale()
        {
            $.ajax({
                type: "POST",
                url: target_url,
                data: {
                    "data_selCpteCmFb": i,
                    "_FID_SwapIdentCmFb": 1,
                },
                success: function(response) {
                    var rx = /<td class="tot _c1 d _c1">(.*)<\/td>/g;
                    var arr = rx.exec(response);

                    if (arr != null) {
                        var amount = parseFloat(arr[1].replace('&nbsp;', '').replace(',', '.'));
                        total_amount += amount;

                        tile.find('.ei_sdsf_montant').html("+" + total_amount.toLocaleString(undefined, {minimumFractionDigits: 2}) + String.fromCharCode(160) + devise);
                        tile.css('display', 'block');

                        $(".ei_compte").trigger("account_added");

                        i++;
                        if (i < nb_accounts) call_epargne_salariale();
                    }
                },
                error: function(err) {
                    //alert("Script error", err);
                }
            });
        }
        call_epargne_salariale();
    });
})();