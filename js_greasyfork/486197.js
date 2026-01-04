// ==UserScript==
// @name         Automatizador de Sumarização
// @namespace    tampermonkey.org
// @version      0.1
// @description  Automatiza seleções após carregar um documento e clicar em "Summarize"
// @author       Seu Nome
// @match        https://www.ailyze.com/ailyze/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486197/Automatizador%20de%20Sumariza%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/486197/Automatizador%20de%20Sumariza%C3%A7%C3%A3o.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para esperar até que os elementos estejam disponíveis
    function waitForElements() {
        const summarizeButton = document.querySelector('button[value="Summarize"]');
        const summaryField = document.querySelector('#id_summary');

        if (summarizeButton && summaryField) {
            summarizeButton.click();

            // Esperar um segundo para que as opções de resumo estejam disponíveis
            setTimeout(() => {
                // Selecionar Bullet points como tipo de resumo
                summaryField.value = 'Bullet points';

                // Mostrar instruções opcionais
                const instructionLabel = document.querySelector('.sumary-instruction label');
                if (instructionLabel) {
                    instructionLabel.click();
                }

                // Selecionar idioma de resposta como português
                document.querySelector('#id_language_options').value = 'Portuguese';

                // Selecionar tamanho da resposta como longa
                document.querySelector('#id_response_size').value = 'Long';
            }, 1000);
        } else {
            // Tentar novamente após um curto período se os elementos não estiverem disponíveis
            setTimeout(waitForElements, 500);
        }
    }

    // Verificar se a página é a correta antes de executar o script
    if (window.location.href.startsWith('https://url-do-site.com/')) {
        // Aguardar o carregamento completo da página antes de iniciar o script
        window.addEventListener('load', waitForElements);
    }
})();
