// ==UserScript==
// @name         Conversor BTC para BRL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converte saldo de BTC em Reais em tempo real
// @author       Seu Nome
// @match        https://freebitco.in/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515410/Conversor%20BTC%20para%20BRL.user.js
// @updateURL https://update.greasyfork.org/scripts/515410/Conversor%20BTC%20para%20BRL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para converter BTC para BRL
    async function fetchBtcToBrl() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
            const data = await response.json();
            return data.bitcoin.brl;
        } catch (error) {
            console.error('Erro ao buscar o valor do BTC:', error);
            return null;
        }
    }

    // Função para atualizar o saldo em Reais
    async function updateBalanceInBrl() {
        const balanceElement = document.getElementById('balance');
        if (!balanceElement) return;

        const btcBalance = parseFloat(balanceElement.innerText);
        const btcToBrl = await fetchBtcToBrl();

        if (btcToBrl !== null) {
            const brlBalance = (btcBalance * btcToBrl).toFixed(2);
            let brlDisplay = document.getElementById('brlBalance');

            // Criar o elemento para exibir o saldo em BRL, se não existir
            if (!brlDisplay) {
                brlDisplay = document.createElement('span');
                brlDisplay.id = 'brlBalance';
                brlDisplay.style.marginLeft = '10px';
                balanceElement.parentNode.insertBefore(brlDisplay, balanceElement.nextSibling);
            }

            brlDisplay.innerText = ` (R$ ${brlBalance})`;
        }
    }

    // Atualizar o saldo a cada 30 segundos
    setInterval(updateBalanceInBrl, 30000);

    // Chamar a função imediatamente ao carregar a página
    updateBalanceInBrl();
})();
