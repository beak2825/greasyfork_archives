// ==UserScript==
// @name         Cunhar moedas na mesma aldeia
// @description  Cunha moedas somente na aldeia em que o script se encontrar aberto (recomendado para quem quiser duplicar bandeira de redução de custos de moeda e fazer pedido de recuros para maior eficiencia)
// @author       Near
// @include      https://*screen=snob*
// @version 1.0.0
// @namespace https://greasyfork.org/users/471382
// @downloadURL https://update.greasyfork.org/scripts/398971/Cunhar%20moedas%20na%20mesma%20aldeia.user.js
// @updateURL https://update.greasyfork.org/scripts/398971/Cunhar%20moedas%20na%20mesma%20aldeia.meta.js
// ==/UserScript==


setTimeout(function () { location.reload(1); }, 5000);
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