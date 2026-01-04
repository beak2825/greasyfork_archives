// ==UserScript==
// @name         Salvar 'Não Selecionado' Automaticamente
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ao clicar na opção 'Não Selecionado' em qualquer formulário, clica automaticamente no botão Salvar.
// @author       Pejota e IA Gemini
// @match        http://10.72.200.50/sede/paginas/index.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546694/Salvar%20%27N%C3%A3o%20Selecionado%27%20Automaticamente.user.js
// @updateURL https://update.greasyfork.org/scripts/546694/Salvar%20%27N%C3%A3o%20Selecionado%27%20Automaticamente.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script 'Salvar Automático' v1.1 (com delegação) iniciado.");

    // --- Seletores dos nossos alvos ---
    const radioNaoSelecionadoSelector = 'input[name="status"][value="EDIF_N_SEL"]';
    const botaoSalvarSelector = 'button.btn-salvar[onclick="salvarEdificacao()"]';

    // --- Função para encontrar o botão Salvar (incluindo iframes) ---
    // Esta função é necessária porque o botão pode estar em um escopo diferente.
    function findElementInFrames(selector) {
        let element = document.querySelector(selector);
        if (element) return element;
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                element = iframeDoc.querySelector(selector);
                if (element) return element;
            } catch (e) { /* Ignora */ }
        }
        return null;
    }

    // --- Lógica Principal com Delegação de Eventos ---

    // 1. Adiciona um "espião" de cliques no documento inteiro.
    // Ele vai pegar cliques que acontecem na página principal E também dentro de iframes.
    document.addEventListener('click', (event) => {

        // 2. A cada clique, verifica se o alvo corresponde ao nosso botão de rádio.
        // O `event.target` é exatamente o elemento que foi clicado.
        if (event.target.matches(radioNaoSelecionadoSelector)) {

            console.log("'Não Selecionado' foi clicado. Iniciando auto-salvar...");

            // Pequeno delay para garantir que a página processe o clique no rádio
            setTimeout(() => {
                const botaoSalvar = findElementInFrames(botaoSalvarSelector);

                if (botaoSalvar) {
                    console.log("Botão Salvar encontrado! Clicando...");
                    botaoSalvar.click();
                } else {
                    console.error("ERRO: Botão Salvar não foi encontrado após o clique.");
                    alert("Automação Falhou: Não foi possível encontrar o botão 'Salvar'.");
                }
            }, 300); // Um delay um pouco maior para segurança
        }
    });

    // Adiciona o mesmo espião para todos os iframes que já existem na página.
    // Isso garante que funcione mesmo que o formulário esteja dentro de um iframe.
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            (iframe.contentDocument || iframe.contentWindow.document).addEventListener('click', (event) => {
                if (event.target.matches(radioNaoSelecionadoSelector)) {
                    console.log("'Não Selecionado' (dentro de um iframe) foi clicado. Iniciando auto-salvar...");
                    setTimeout(() => {
                        const botaoSalvar = findElementInFrames(botaoSalvarSelector);
                        if (botaoSalvar) {
                            console.log("Botão Salvar encontrado! Clicando...");
                            botaoSalvar.click();
                        } else {
                            console.error("ERRO: Botão Salvar não foi encontrado após o clique.");
                        }
                    }, 300);
                }
            });
        } catch(e) { /* Ignora iframes inacessíveis */ }
    });


})();