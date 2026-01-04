// ==UserScript==
// @name         Alterar Texto da Tabela
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Altera "Atendente" para "VC" e "Solicitante" para "VERIFICAR".
// @author       MaxwGPT
// @match        https://nebrasil.e-desk.com.br/Portal/ListaSolicitacao.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498869/Alterar%20Texto%20da%20Tabela.user.js
// @updateURL https://update.greasyfork.org/scripts/498869/Alterar%20Texto%20da%20Tabela.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilo para cor vermelha
    const redTextStyle = 'color: red;';


    // Função para alterar o texto da tabela
    function alterarTextoTabela() {
        // Seleciona todas as células da tabela
        let cells = document.querySelectorAll('td');

        // Percorre todas as células
        cells.forEach(function(cell) {
            // Altera "Atendente" para "VC"
            if (cell.textContent.trim() === 'Atendente') {
                cell.textContent = 'VC';
            }

            // Altera "Solicitante" para "Cliente"
            if (cell.textContent.trim() === 'Solicitante') {
                cell.textContent = 'VERIFICAR!';
                cell.style.cssText = redTextStyle;
            }
        });
    }

    // Aguarda o carregamento completo da página antes de executar a função
    window.addEventListener('load', alterarTextoTabela);

    // Observa mudanças na página (caso a tabela seja carregada dinamicamente)
    const observer = new MutationObserver(alterarTextoTabela);
    observer.observe(document.body, { childList: true, subtree: true });
})();
