// ==UserScript==
// @name         Sumarizar Documento Automático
// @namespace    http://your.namespace/
// @version      0.1
// @description  Automatiza o processo de sumarização de documentos
// @author       You
// @match        https://www.ailyze.com/ailyze/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486192/Sumarizar%20Documento%20Autom%C3%A1tico.user.js
// @updateURL https://update.greasyfork.org/scripts/486192/Sumarizar%20Documento%20Autom%C3%A1tico.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aguardar o loader
    function waitForLoader() {
        // Substitua "seu_seletor_loader" pelo seletor real do loader na sua página
        var loader = document.querySelector('loader');
        
        if (loader) {
            // Aguardar até que o loader não seja mais visível
            var observer = new MutationObserver(function(mutations) {
                if (!loader.offsetParent) {
                    observer.disconnect();
                    // Executar o próximo passo após o loader desaparecer
                    realizarSumarizacao();
                }
            });

            // Configurar o observador para monitorar alterações no DOM
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Realizar a sumarização
    function realizarSumarizacao() {
        // Passos para a sumarização conforme descrito no fluxograma
        // Clicar no botão de sumarização
        var botaoSumarizar = document.querySelector('id("choices")/form[3]/button[3]');
        if (botaoSumarizar) {
            botaoSumarizar.click();
            
            // Aguardar um pequeno intervalo de tempo para garantir que a próxima etapa seja executada após o clique
            setTimeout(selecionarTipoSumario, 1000);
        }
    }
    
    // Selecionar o tipo de sumário
    function selecionarTipoSumario() {
        // Selecionar a opção "Bullet points"
        var opcaoBulletPoints = document.querySelector('div.demo_form_with_file > select#id_summary > option[value="Bullet points"]');
        if (opcaoBulletPoints) {
            opcaoBulletPoints.selected = true;
            
            // Aguardar um pequeno intervalo de tempo para garantir que a próxima etapa seja executada após a seleção
            setTimeout(selecionarOpcoesInstrucoes, 500);
        }
    }
    
    // Selecionar as opções de instruções, idioma e comprimento da resposta
    function selecionarOpcoesInstrucoes() {
        // Exemplo de seleção de idioma (Português)
        var opcaoPortugues = document.querySelector('#collapsesummary > div.card.card-body > div > div select#id_language_options > option[value="Portuguese"]');
        if (opcaoPortugues) {
            opcaoPortugues.selected = true;
        }
        
        // Exemplo de seleção de comprimento da resposta (Long)
        var opcaoLong = document.querySelector('#id_response_size > option[value="Long"]');
        if (opcaoLong) {
            opcaoLong.selected = true;
        }
    }

    // Iniciar o processo após o carregamento da página
    window.addEventListener('load', function() {
        // Aguardar o loader e iniciar o processo
        waitForLoader();
    });

})();
