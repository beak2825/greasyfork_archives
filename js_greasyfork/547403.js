// ==UserScript==
// @name         Dealernet Move Aguarde Relatório
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Move a div com a mensagem "Aguarde - Relatório sendo gerado e será exibido em breve.." para a direita, e permite fecha-la clicando nela
// @author       Igor Lima
// @license      MIT
// @match        http*://*.dealernetworkflow.com.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547403/Dealernet%20Move%20Aguarde%20Relat%C3%B3rio.user.js
// @updateURL https://update.greasyfork.org/scripts/547403/Dealernet%20Move%20Aguarde%20Relat%C3%B3rio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modificarMsgDiv() {
        const msgDiv = document.getElementById('msg-div');

        if (msgDiv) {
            const esquerdaAtual = parseInt(msgDiv.style.left) || 0;
            //Quantidade de pixels a mover a div, 140 por padrão.
            msgDiv.style.left = (esquerdaAtual + 140) + 'px';

            msgDiv.style.cursor = 'pointer';
            msgDiv.title = 'Clique para fechar';

            // Adiciona evento de clique para fechar a div
            msgDiv.addEventListener('click', function() {
                msgDiv.style.display = 'none';
            });
        }
    }

    // Caso a div já estiver presente...
    modificarMsgDiv();

    // Caso ela aparecer depois...
    const observador = new MutationObserver(function(mutacoes) {
        mutacoes.forEach(function(mutacao) {
            if (mutacao.type === 'childList') {
                mutacao.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id === 'msg-div' || node.querySelector('#msg-div')) {
                            modificarMsgDiv();
                        }
                    }
                });
            }
        });
    });

    observador.observe(document.body, {
        childList: true,
        subtree: true
    });
})();