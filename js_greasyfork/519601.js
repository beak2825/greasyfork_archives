// ==UserScript==
// @name         Modo Juntada de Alvará - PROJUDI TJBA v3.1
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Redireciona, mostra advogados, copia o número do processo, o exibe na guia e preenche o código da movimentação (Projudi TJBA).
// @author       Levi
// @match        https://projudi.tjba.jus.br/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519601/Modo%20Juntada%20de%20Alvar%C3%A1%20-%20PROJUDI%20TJBA%20v31.user.js
// @updateURL https://update.greasyfork.org/scripts/519601/Modo%20Juntada%20de%20Alvar%C3%A1%20-%20PROJUDI%20TJBA%20v31.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    /**
     * Módulo 1: Redireciona da página de dados do processo para a de movimentação.
     */
    function initRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const numeroProcesso = urlParams.get('numeroProcesso');
        if (numeroProcesso) {
            const novaURL = `https://projudi.tjba.jus.br/projudi/movimentacao/MovimentarProcesso?numeroProcesso=${numeroProcesso}`;
            window.location.replace(novaURL);
        }
    }

    /**
     * Módulo 2: Clica automaticamente em "Mostrar/Ocultar" para ver os advogados.
     */
    function initShowLawyers() {
        const clickedButtons = new Set();

        function clickLinks() {
            const links = document.querySelectorAll('a[href*="mostraOculta"][href*="\'Adv\'"]');
            links.forEach(link => {
                if (!clickedButtons.has(link.href)) {
                    link.click();
                    clickedButtons.add(link.href);
                }
            });
        }

        clickLinks();

        const targetNode = document.querySelector('table.tabelaLista');
        if (targetNode) {
            const observer = new MutationObserver(clickLinks);
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    }

    /**
     * Módulo 3: Exibe o número do processo na guia e o copia AUTOMATICAMENTE para a área de transferência.
     */
    function initTabTitleAndAutoClipboard() {
        const processNumberPattern = /\b\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}\b/;
        let actionsDone = false;

        function performActions() {
            if (actionsDone) return;

            const processElement = document.querySelector('#Partes b');

            if (processElement && processNumberPattern.test(processElement.innerText)) {
                const processNumberFormatted = processElement.innerText.trim();
                const processNumberOnlyDigits = processNumberFormatted.replace(/\D/g, '');

                document.title = processNumberFormatted;
                GM_setClipboard(processNumberOnlyDigits);
                console.log(`Número ${processNumberOnlyDigits} copiado AUTOMATICAMENTE para a área de transferência.`);

                actionsDone = true;
                observer.disconnect();
            }
        }

        const observer = new MutationObserver(performActions);
        observer.observe(document.body, { childList: true, subtree: true });

        if (document.readyState === 'complete') {
            performActions();
        } else {
            window.addEventListener('load', performActions);
        }
    }

    /**
     * Módulo 4: Preenche automaticamente o código da movimentação.
     */
    function initFillMovementCode() {
        const movementInput = document.getElementById('seqCategoriaMovimentacao');
        if (movementInput) {
            movementInput.value = '11383';
            console.log('Código de movimentação 11383 preenchido automaticamente.');
        }
    }


    // --- LÓGICA DE EXECUÇÃO ---
    initShowLawyers();

    if (currentUrl.includes('projudi/listagens/DadosProcesso')) {
        initRedirect();
    }

    if (currentUrl.includes('projudi/movimentacao/MovimentarProcesso')) {
        initTabTitleAndAutoClipboard();
        initFillMovementCode(); // Executa o preenchimento na página de movimentação
    }

})();