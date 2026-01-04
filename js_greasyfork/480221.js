// ==UserScript==
// @name         Avaliar Arquitetura da Informação
// @namespace    http://greasyfork.org/scripts/12345
// @version      1.2
// @description  Avalia a arquitetura da informação de um site.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480221/Avaliar%20Arquitetura%20da%20Informa%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/480221/Avaliar%20Arquitetura%20da%20Informa%C3%A7%C3%A3o.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para avaliar a arquitetura da informação
    function avaliarArquiteturaInformacao() {
        // Selecione os elementos relevantes do site para análise

        // Exemplo: selecione todos os links na página
        const links = document.querySelectorAll('a');

        // Exemplo: selecione todos os cabeçalhos (h1, h2, h3, etc.)
        const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        // Exemplo: selecione o menu de navegação principal
        const menuPrincipal = document.querySelector('#menu-principal');

        // Exemplo: selecione o formulário de busca
        const formularioBusca = document.querySelector('#formulario-busca');

        // Exemplo: selecione outros elementos relevantes para a análise

        // Realize a análise da arquitetura da informação com base nos elementos selecionados

        // Exemplo: contar o número total de links na página
        const numeroLinks = links.length;
        console.log('Número de links na página:', numeroLinks);

        // Exemplo: verificar se há cabeçalhos ausentes ou mal estruturados
        headers.forEach(header => {
            const nivel = header.tagName;
            console.log(`Cabeçalho ${nivel}: ${header.textContent}`);
        });

        // Exemplo: verificar se o menu de navegação principal está visível na página
        if (menuPrincipal) {
            console.log('Menu de navegação principal encontrado.');
        } else {
            console.log('Menu de navegação principal não encontrado.');
        }

        // Exemplo: verificar se o formulário de busca está presente
        if (formularioBusca) {
            console.log('Formulário de busca encontrado.');
        } else {
            console.log('Formulário de busca não encontrado.');
        }

        // Exemplo: realizar outras análises com base nos elementos selecionados

        // ...
    }

    // Chamada da função para avaliar arquitetura de informação quando a página estiver completamente carregada
    window.addEventListener('load', avaliarArquiteturaInformacao);
})();