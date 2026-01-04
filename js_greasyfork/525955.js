// ==UserScript==
// @name         Filtrar Vagas - Espro
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Oculta vagas que não estão no seu perfil (com círculo vermelho) e remove vagas de São Paulo (SP) ou Lauro de Freitas (BA).
// @home         https://github.com/luascfl/filtrar-vagas-espro
// @supportURL   https://github.com/luascfl/filtrar-vagas-espro/issues
// @author       luascfl
// @license      MIT License
// @icon         https://raw.githubusercontent.com/luascfl/filtrar-vagas-espro/main/logo.png
// @author       luascfl
// @match        https://espro-app.taqe.com.br/#!/taqe/tabs/vacancies
// @match        https://app.taqe.com.br/#!/taqe/tabs/vacancies
// @match        https://ciee-app.taqe.com.br/#!/taqe/tabs/vacancies
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525955/Filtrar%20Vagas%20-%20Espro.user.js
// @updateURL https://update.greasyfork.org/scripts/525955/Filtrar%20Vagas%20-%20Espro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Função para verificar se a vaga é de São Paulo (SP) ou Lauro de Freitas (BA)
    function isVagaIndesejada(textoVaga) {
        const termosIndesejados = ["SAO PAULO", "OSASCO", "COTIA", "LAURO DE FREITAS", "SIMOES FILHO", "CLOSER", "CONSULTORA", "TRAINEE", "JUNIOR", "TESTE", "GERENTE", "ANALISTA"];
        return termosIndesejados.some(filtro => textoVaga.toUpperCase().includes(filtro));
    }

    // Função para ocultar vagas com círculo vermelho e remover vagas indesejadas
    function filtrarVagas() {
        // Seleciona todos os elementos 'ion-item' que representam as vagas
        const vagas = document.querySelectorAll('ion-item.vacancy-card');

        // Percorre cada vaga
        vagas.forEach(vaga => {
            // Verifica se a vaga tem um círculo vermelho
            const circuloVermelho = vaga.querySelector('path[style*="stroke: rgb(255, 0, 74)"]');
            if (circuloVermelho) {
                vaga.style.display = 'none'; // Oculta a vaga
                return; // Passa para a próxima vaga
            }

            // Verifica o texto da vaga para identificar São Paulo (SP) ou Lauro de Freitas (BA)
            const textoVaga = vaga.querySelector('p.text-green-light')?.textContent || '';
            if (isVagaIndesejada(textoVaga)) {
                vaga.remove(); // Remove a vaga do DOM
            }
        });
    }

    // Executa a função imediatamente após o carregamento da página
    filtrarVagas();

    // Observa mudanças no DOM para garantir que as vagas sejam filtradas mesmo que carreguem dinamicamente
    const observer = new MutationObserver(filtrarVagas);
    observer.observe(document.body, { childList: true, subtree: true });
})();
