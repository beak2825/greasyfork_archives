// ==UserScript==
// @name         TW Cunhar Moeda
// @description  ...
// @author       Near
// @include      https://*screen=snob*
// @version 1.0.0
// @namespace https://greasyfork.org/users/471382
// @downloadURL https://update.greasyfork.org/scripts/400272/TW%20Cunhar%20Moeda.user.js
// @updateURL https://update.greasyfork.org/scripts/400272/TW%20Cunhar%20Moeda.meta.js
// ==/UserScript==


setTimeout(function () { location.reload(1); }, 300000);
{
    setTimeout(function(){

        //obter moedas disp
        var qtd_moedas_get = document.getElementById("coin_mint_fill_max");
        var qtd_moedas_str = qtd_moedas_get.textContent; // "(5)"
        var qtd_moedas_sliced = qtd_moedas_str.slice(1,2); // 5

        //mudar valor
        var intr_moeda = document.getElementById("coin_mint_count");
        intr_moeda.value = qtd_moedas_sliced;

        //clicar "Cunhar"
        var cunhar = document.getElementsByClassName("btn btn-default");
        cunhar[0].click();
    }, 5000);
}