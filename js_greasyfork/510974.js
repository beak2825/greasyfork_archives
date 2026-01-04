// ==UserScript==
// @name         Google Infinite
// @namespace    https://seu-nome-de-usuario.greasyfork.org/
// @version      1.0
// @description  Ativa a rolagem infinita nos resultados de pesquisa do Google
// @author       Seu nome
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510974/Google%20Infinite.user.js
// @updateURL https://update.greasyfork.org/scripts/510974/Google%20Infinite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Definindo o tempo de intervalo entre carregamentos (em milissegundos)
    let scrollWaitTime = 2000;

    // Função para rolar e carregar mais resultados
    function loadMoreResults() {
        // Encontra o botão "Próxima" na página de resultados
        let nextButton = document.querySelector("#pnnext");

        // Se o botão existir, clique nele
        if (nextButton) {
            nextButton.click();
        } else {
            console.log("Fim dos resultados ou não há botão 'Próxima'.");
        }
    }

    // Função para monitorar a rolagem da página
    function handleScroll() {
        // Verifica se o usuário chegou ao final da página
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setTimeout(loadMoreResults, scrollWaitTime); // Espera um pouco antes de carregar mais
        }
    }

    // Adiciona o listener para monitorar o scroll do usuário
    window.addEventListener("scroll", handleScroll);
})();
