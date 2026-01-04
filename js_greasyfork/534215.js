// ==UserScript==
// @name         Google Tasks - Botão Remover Todas
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Adiciona botão para remover tarefas. Aumenta delay do menu 'Excluir' para mais confiabilidade.
// @author       luascfl
// @match        https://tasks.google.com/u/*/lists/*
// @match        https://tasks.google.com/embed/list/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Google_Tasks_2021.svg/2159px-Google_Tasks_2021.svg.png
// @home            https://github.com/luascfl/empty-google-tasks
// @supportURL      https://github.com/luascfl/empty-google-tasks/issues
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534215/Google%20Tasks%20-%20Bot%C3%A3o%20Remover%20Todas.user.js
// @updateURL https://update.greasyfork.org/scripts/534215/Google%20Tasks%20-%20Bot%C3%A3o%20Remover%20Todas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuração ---
    const BUTTON_ID = 'deleteAllTasksButton';
    const BUTTON_TEXT = "Remover Todas as Tarefas";
    const CONFIRM_MESSAGE = "Tem certeza que deseja remover TODAS as tarefas desta lista? Esta ação não pode ser desfeita.";
    const CHECK_INTERVAL_MS = 1000;

    // --- Delays Ajustados (v2.2) ---
    // Aumentado ACTION_DELAY_MS para dar mais tempo para o menu 'Excluir' aparecer
    const REVEAL_DELAY_MS = 350;  // Delay APÓS clicar no título (Mantido de v2.1)
    const ACTION_DELAY_MS = 450;  // (Era 250 em v2.1, 500 em v2.0) Delay base APÓS clicar em '...'
    const DELETE_MENU_APPEAR_DELAY_MS = ACTION_DELAY_MS + 50; // (Agora 500ms) Delay ANTES de procurar 'Excluir'
    const EVENT_SIMULATION_DELAY_MS = 30; // (Mantido de v2.1) Delay entre eventos simulados
    const POST_DELETE_DELAY_MS = ACTION_DELAY_MS + 150; // (Agora 600ms) Delay APÓS excluir para UI estabilizar

    const MAX_CONSECUTIVE_ERRORS = 5;

    // --- Funções Auxiliares ---
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Itera sobre as tarefas visíveis, clica no título, clica em '...',
     * e simula os eventos de clique em 'Excluir' (com delays ajustados).
     * @returns {Promise<void>}
     */
    async function deleteAllTasks() {
        console.log(`[${BUTTON_ID}] Iniciando exclusão (v2.2 - Tuned Delay)...`);
        let tasksDeletedCount = 0;
        let consecutiveErrors = 0;

        const deleteAllButton = document.getElementById(BUTTON_ID);
        if (deleteAllButton) {
            deleteAllButton.disabled = true;
            deleteAllButton.textContent = "Removendo...";
        }

        try {
            while (true) {
                if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                    throw new Error(`Muitos erros consecutivos (${consecutiveErrors}) ao processar tarefas. Abortando.`);
                }

                // 1. Encontra a primeira tarefa
                let taskElement = document.querySelector('div[role="listitem"].MnEwWd') ||
                                  document.querySelector('div[role="listitem"]') ||
                                  document.querySelector('div.MnEwWd');

                if (!taskElement) {
                    console.log(`[${BUTTON_ID}] Nenhuma tarefa restante encontrada.`);
                    break;
                }

                // 2. Encontra título clicável
                let titleContainer = taskElement.querySelector('div[jsname="GYcwYe"]');
                if (!titleContainer) {
                    const titleTextDiv = taskElement.querySelector('.JnIHn');
                    if (titleTextDiv) {
                         titleContainer = titleTextDiv.closest('.lCEjKc');
                    }
                }
                if (!titleContainer) {
                    titleContainer = taskElement;
                 }

                if (!titleContainer) {
                    console.error(`[${BUTTON_ID}] Erro CRÍTICO: Não encontrou elemento clicável para a tarefa. Pulando.`);
                    consecutiveErrors++;
                    await delay(ACTION_DELAY_MS);
                    continue;
                }

                // 3. Clica no Título
                titleContainer.click();
                await delay(REVEAL_DELAY_MS); // Espera painel/botão '...'

                // 4. Encontra "..."
                let moreOptionsButton = document.querySelector('button[aria-label="Opções do app Tarefas"]') ||
                                        document.querySelector('button[jsname="pzCKEc"]') ||
                                        document.querySelector('button[aria-label*="Opç"], button[aria-label*="Aç"], button[aria-label*="Mais"]');

                if (!moreOptionsButton) {
                    console.error(`[${BUTTON_ID}] Erro: Não encontrou '...' após ${REVEAL_DELAY_MS}ms. Aumente REVEAL_DELAY_MS? Pulando.`);
                    consecutiveErrors++;
                    document.body.click();
                    await delay(ACTION_DELAY_MS);
                    continue;
                }

                // 5. Clica em "..."
                moreOptionsButton.click();
                await delay(DELETE_MENU_APPEAR_DELAY_MS); // <<< DELAY AJUSTADO AQUI (500ms)

                // 6. Encontra e simula clique em "Excluir"
                const deleteButtonSelector = 'span[role="menuitem"][aria-label="Excluir"][jsname="j7LFlb"]';
                const deleteButton = document.querySelector(deleteButtonSelector);

                if (deleteButton) {
                    try {
                        // Simula eventos de mouse
                        deleteButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                        await delay(EVENT_SIMULATION_DELAY_MS);
                        deleteButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                        await delay(EVENT_SIMULATION_DELAY_MS);
                        deleteButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

                        tasksDeletedCount++;
                        consecutiveErrors = 0;
                        if (tasksDeletedCount % 10 === 0 || tasksDeletedCount === 1) { // Log first and every 10th
                             console.log(`[${BUTTON_ID}] Tarefa ${tasksDeletedCount} removida.`);
                        }
                        await delay(POST_DELETE_DELAY_MS); // <<< DELAY AJUSTADO AQUI (600ms)

                    } catch (e) {
                        console.error(`[${BUTTON_ID}] Erro ao simular clique em 'Excluir':`, e);
                        consecutiveErrors++;
                        document.body.click();
                        await delay(ACTION_DELAY_MS);
                         if (consecutiveErrors >= 2) {
                             throw new Error("Falha crítica consecutiva ao simular clique em 'Excluir'.");
                         }
                        continue;
                    }
                } else {
                    // Este é o erro que ocorreu na v2.1
                    console.error(`[${BUTTON_ID}] Erro: Não encontrou 'Excluir' (${deleteButtonSelector}) após ${DELETE_MENU_APPEAR_DELAY_MS}ms. Aumente DELETE_MENU_APPEAR_DELAY_MS? Pulando.`);
                    consecutiveErrors++;
                    document.body.click();
                    await delay(ACTION_DELAY_MS);
                     if (consecutiveErrors >= 2) {
                         throw new Error("Falha crítica consecutiva ao encontrar 'Excluir'.");
                     }
                    continue;
                }
            } // Fim do while

            // Mensagem final
             alert(`Processo concluído!\n${tasksDeletedCount} tarefas foram removidas.`);
             console.log(`[${BUTTON_ID}] Processo concluído! ${tasksDeletedCount} tarefas removidas.`);

        } catch (error) {
            console.error(`[${BUTTON_ID}] Ocorreu um erro durante a exclusão:`, error);
            alert(`Ocorreu um erro durante a exclusão:\n${error.message}\nVerifique o console (F12) para mais detalhes.`);
        } finally {
            // Reabilitar botão
            if (deleteAllButton) {
                deleteAllButton.disabled = false;
                deleteAllButton.textContent = BUTTON_TEXT;
                deleteAllButton.style.opacity = '1';
                deleteAllButton.style.cursor = 'pointer';
            }
            console.log(`[${BUTTON_ID}] Processo de exclusão finalizado.`);
        }
    }


   /**
     * Cria e adiciona o botão "Remover Todas" à interface.
     * (Função mantida da v2.0 - sem alterações)
     * @returns {boolean} Verdadeiro se o botão foi adicionado, falso caso contrário.
     */
    function addButton() {
        const addTaskButton = document.querySelector('button[jsname="MhySTb"]');

        if (addTaskButton && !document.getElementById(BUTTON_ID)) {
            const container = addTaskButton.closest('div.bzRmOI');
            const parent = container || addTaskButton.parentNode;

            if (!parent) {
                return false;
            }

            const button = document.createElement('button');
            button.id = BUTTON_ID;
            button.textContent = BUTTON_TEXT;
            button.type = 'button';

            // Estilos
            button.style.display = 'block'; button.style.width = 'calc(100% - 16px)'; button.style.boxSizing = 'border-box';
            button.style.marginTop = '10px'; button.style.marginBottom = '10px'; button.style.marginLeft = '8px'; button.style.marginRight = '8px';
            button.style.padding = '8px 16px'; button.style.cursor = 'pointer'; button.style.border = '1px solid #d93025';
            button.style.borderRadius = '4px'; button.style.backgroundColor = '#fce8e6'; button.style.color = '#d93025';
            button.style.fontWeight = '500'; button.style.fontSize = '14px'; button.style.textAlign = 'center'; button.style.lineHeight = 'normal';

            // Efeitos Hover/Disabled
            button.onmouseover = () => { if (!button.disabled) { button.style.backgroundColor = '#fbd7d4'; button.style.borderColor = '#c5221f'; } };
            button.onmouseout = () => { if (!button.disabled) { button.style.backgroundColor = '#fce8e6'; button.style.borderColor = '#d93025'; } };
             const observer = new MutationObserver(mutations => { mutations.forEach(mutation => { if (mutation.attributeName === 'disabled') { if (button.disabled) { button.style.opacity = '0.6'; button.style.cursor = 'not-allowed'; button.style.backgroundColor = '#fce8e6'; button.style.borderColor = '#d93025'; } else { button.style.opacity = '1'; button.style.cursor = 'pointer'; } } }); });
             observer.observe(button, { attributes: true });


            button.addEventListener('click', (event) => {
                event.stopPropagation();
                if (confirm(CONFIRM_MESSAGE)) {
                    deleteAllTasks();
                } else {
                    console.log(`[${BUTTON_ID}] Exclusão cancelada pelo usuário.`);
                }
            });

            parent.insertBefore(button, addTaskButton);
            return true;
        }
        return false;
    }

    // --- Inicialização ---
    console.log(`[${BUTTON_ID}] Userscript '${GM_info.script.name}' v${GM_info.script.version} iniciado. Aguardando UI...`);
    const checkInterval = setInterval(() => {
        try {
             if (addButton()) {
                 clearInterval(checkInterval);
             }
         } catch (error) {
             console.error(`[${BUTTON_ID}] Erro durante a tentativa de adicionar o botão:`, error);
         }
    }, CHECK_INTERVAL_MS);

})(); // Fim do IIFE
