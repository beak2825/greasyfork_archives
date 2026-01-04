// ==UserScript==
// @name         Automatizar Sumarização
// @namespace    http://example.com
// @version      0.1
// @description  Script para automatizar seleções após carregar um documento e clicar em "Summarize"
// @author       You
// @match        https://www.ailyze.com/ailyze/*  // Substitua com a URL da página onde deseja aplicar o script
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486179/Automatizar%20Sumariza%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/486179/Automatizar%20Sumariza%C3%A7%C3%A3o.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperar até que as opções de arquivo estejam disponíveis
    setTimeout(() => {
        // Selecionar Summarize
        document.querySelector('button[value="Summarize"]').click();
        
        // Esperar um segundo para que as opções de resumo estejam disponíveis
        setTimeout(() => {
            // Selecionar Bullet points como tipo de resumo
            document.querySelector('#id_summary').value = 'Bullet points';
            
            // Mostrar instruções opcionais
            document.querySelector('.sumary-instruction label').click();
            
            // Selecionar idioma de resposta como português
            document.querySelector('#id_language_options').value = 'Portuguese';
            
            // Selecionar tamanho da resposta como longa
            document.querySelector('#id_response_size').value = 'Long';
        }, 1000);
    }, 2000);
})();
