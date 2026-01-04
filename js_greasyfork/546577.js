// ==UserScript==
// @name         Contador de Edições - Mapear GEO
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Exibe um contador de edições salvas (apenas com status 'Atualizado') no topo da página.
// @author       Seu Nome
// @match        http://mapear.esteio.com.br/fortal-v2/paginas/index.php?pagina=edificacao
// @match        http://10.72.200.50/sede/paginas/index.php?pagina=edificacao
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546577/Contador%20de%20Edi%C3%A7%C3%B5es%20-%20Mapear%20GEO.user.js
// @updateURL https://update.greasyfork.org/scripts/546577/Contador%20de%20Edi%C3%A7%C3%B5es%20-%20Mapear%20GEO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- VARIÁVEIS GLOBAIS ---
    let sessionEditCount = 0;
    let saveActionInitiated = false;

    // =================================================================================
    // 1. CRIAÇÃO DO VISOR DO CONTADOR
    // =================================================================================
    function createCounterDisplay() {
        // Adiciona os estilos do visor na página
        const style = document.createElement('style');
        style.innerHTML = `
            #standalone-counter-display {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-family: Arial, sans-serif;
                font-size: 16px;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                pointer-events: none; /* Para não atrapalhar cliques no mapa */
            }
            #edit-count-span {
                color: #58cffa;
                margin-left: 6px;
            }
        `;
        document.head.appendChild(style);

        // Cria a estrutura HTML do visor
        const display = document.createElement('div');
        display.id = 'standalone-counter-display';
        display.innerHTML = `Edições Salvas: <span id="edit-count-span">0</span>`;
        document.body.appendChild(display);
    }

    // Função para atualizar o número no visor
    function updateCounterDisplay() {
        const counterElement = document.getElementById('edit-count-span');
        if (counterElement) {
            counterElement.textContent = sessionEditCount;
        }
    }

    // =================================================================================
    // 2. LÓGICA DE OBSERVAÇÃO E CONTAGEM
    // =================================================================================
    function setupSaveObserver() {
        const observer = new MutationObserver(() => {
            const formPanel = document.getElementById('painelEdificacao');

            // PARTE 1: Detecta se o painel de edição foi FECHADO
            const formIsClosed = !formPanel || formPanel.innerHTML.trim() === "";
            if (formIsClosed) {
                // Se ele foi fechado APÓS um clique em "Salvar" VÁLIDO, incrementa o contador
                if (saveActionInitiated) {
                    sessionEditCount++;
                    updateCounterDisplay();
                    saveActionInitiated = false; // Reseta a flag
                }
                return; // Painel está fechado, não há mais o que fazer.
            }

            // PARTE 2: Detecta se o painel está ABERTO para poder "ouvir" o botão Salvar
            const saveButton = formPanel.querySelector('.btn-salvar[onclick="salvarEdificacao()"]');

            // Adiciona o "ouvinte" de clique apenas uma vez
            if (saveButton && !saveButton.hasAttribute('data-counter-listener')) {
                saveButton.addEventListener('click', () => {
                    // VERIFICA O STATUS ANTES DE ATIVAR A FLAG
                    const currentFormPanel = document.getElementById('painelEdificacao');
                    if (currentFormPanel) {
                        const selectedStatusRadio = currentFormPanel.querySelector('input[name="status"]:checked');

                        // A flag só será ativada se o status for "ATUALIZADO"
                        if (selectedStatusRadio && selectedStatusRadio.value === 'ATUALIZADO') {
                            saveActionInitiated = true;
                        } else {
                            saveActionInitiated = false; // Garante que a flag esteja desligada para outros status
                        }
                    }
                });
                saveButton.setAttribute('data-counter-listener', 'true'); // Marca o botão para não adicionar o ouvinte de novo
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Inicia o script ---
    createCounterDisplay();
    setupSaveObserver();

})();