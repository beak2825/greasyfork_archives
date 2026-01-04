// ==UserScript==
// @name         Exibir Número do Processo do SEI na árvore
// @namespace    numeroseiflutuantenaarvore
// @version      1.0
// @description  Exibe o número do processo SEI em uma janela flutuante no canto inferior direito da árvore e copia ao clicar. Ajuda usuários que não conseguem visualizar o número em razão da extensão do Trello que exibe os cartões em versões do SEI acima da 4.0.
// @author       Jairo
// @match        *://*/sei/controlador.php?acao=procedimento_visualizar&acao_origem=arvore_visualizar*
// @match        *://*/sei/controlador.php?acao=procedimento_visualizar&acao_origem=procedimento_trabalhar*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481307/Exibir%20N%C3%BAmero%20do%20Processo%20do%20SEI%20na%20%C3%A1rvore.user.js
// @updateURL https://update.greasyfork.org/scripts/481307/Exibir%20N%C3%BAmero%20do%20Processo%20do%20SEI%20na%20%C3%A1rvore.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extrairNumeroProcesso() {
        var codigoFonte = document.documentElement.innerHTML;
        var padrao = /\d{5}\.\d{6}\/\d{4}-\d{2}/;
        var resultado = padrao.exec(codigoFonte);
        return resultado ? resultado[0] : null;
    }

    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.bottom = '40px';
    div.style.right = '8px';
    div.style.padding = '2px 4px';
    div.style.backgroundColor = '#fff';
    div.style.color = '#000';
    div.style.fontSize = '9px';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '2px';
    div.style.zIndex = '9999';
    div.style.cursor = 'pointer';

    document.body.appendChild(div);

    div.addEventListener('click', function() {
        var numeroProcesso = extrairNumeroProcesso();
        if (numeroProcesso) {
            var tempInput = document.createElement('textarea');
            document.body.appendChild(tempInput);
            tempInput.value = numeroProcesso;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            div.style.backgroundColor = '#015ED9';
            div.style.color = '#fff';

            setTimeout(function() {
                div.style.backgroundColor = '#fff';
                div.style.color = '#000';
            }, 1000);
        }
    });

    setInterval(function() {
        var numeroProcesso = extrairNumeroProcesso();
        div.innerHTML = (numeroProcesso ? numeroProcesso : 'Não encontrado');
    }, 1000);
})();