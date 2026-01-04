// ==UserScript==
// @name         Desbloquear Valor USDT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Desbloqueia o valor USDT na página específica.
// @author       Você
// @match       https://bc.game/pt/wallet/withdraw/chain
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476529/Desbloquear%20Valor%20USDT.user.js
// @updateURL https://update.greasyfork.org/scripts/476529/Desbloquear%20Valor%20USDT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtém todos os elementos DIV com o conteúdo "USDT Saldo 3.19550558"
    var divElements = document.querySelectorAll('div:contains("USDT Saldo 3.19550558")');

    // Verifica se há elementos encontrados
    if (divElements.length > 0) {
        // Itera sobre os elementos e desbloqueia o valor
        divElements.forEach(function(divElement) {
            // Modifica o conteúdo para o valor desejado
            divElement.textContent = 'USDT Saldo Desbloqueado: 999.99999999';
        });
    }
})();
