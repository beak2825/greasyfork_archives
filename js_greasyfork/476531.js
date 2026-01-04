// ==UserScript==
// @name         Retirada Sem Bloqueio
// @namespace    http://sua-namespace-aqui.com
// @version      1.0
// @description  Realiza uma retirada sem bloqueio no site XYZ
// @author       Seu Nome
// @match        https://bc.game/pt/wallet/withdraw/chain
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476531/Retirada%20Sem%20Bloqueio.user.js
// @updateURL https://update.greasyfork.org/scripts/476531/Retirada%20Sem%20Bloqueio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para realizar a retirada sem bloqueio
    function realizarRetirada() {
        // Clique no botão de retirada
        document.getElementById('retirada-button').click();

        // Preencha o valor da retirada
        document.getElementById('valor-retirada').value = '3';

        // Confirme a retirada
        document.getElementById('confirmar-retirada').click();
    }

    // Chama a função de retirada ao carregar a página
    window.addEventListener('load', realizarRetirada);

})();
