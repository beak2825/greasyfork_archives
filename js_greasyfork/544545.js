// ==UserScript==
// @name         Otimizador de Edificação (Painel Flutuante)
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  Painel flutuante com contador, ações rápidas, feedback visual e 4 opções de salvamento.
// @author       Seu Nome
// @match        http://mapear.esteio.com.br/fortal-v2/paginas/index.php?pagina=edificacao
// @match        http://10.72.200.50/sede/paginas/index.php?pagina=edificacao
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544545/Otimizador%20de%20Edifica%C3%A7%C3%A3o%20%28Painel%20Flutuante%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544545/Otimizador%20de%20Edifica%C3%A7%C3%A3o%20%28Painel%20Flutuante%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURAÇÕES E VARIÁVEIS GLOBAIS ---
    const MAX_PAVIMENTOS = 10;
    let sessionEditCount = 0;
    let saveActionInitiated = null; // agora guarda o tipo: "normal", "duvida", "nsel"

    // =================================================================================
    // 1. CRIAÇÃO DO PAINEL E ESTILOS
    // =================================================================================
    function createFloatingPanel() {
        const style = document.createElement('style');
        style.innerHTML = `
            #quick-actions-panel {
                position: fixed; top: 150px; right: 20px; width: 250px;
                background-color: #ffffff; border: 1px solid #b0b0b0; border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 9999; display: none;
                font-family: Arial, sans-serif;
            }
            #quick-actions-header {
                padding: 8px; cursor: move; background-color: #f1f1f1; border-bottom: 1px solid #ddd;
                text-align: center; font-weight: bold; color: #333;
                border-top-left-radius: 8px; border-top-right-radius: 8px;
                font-size: 14px;
            }
            #edit-counter { font-weight: bold; color: #007bff; }
            #quick-actions-content { padding: 10px; }
            .custom-controls-group { margin-bottom: 10px; }
            .custom-controls-group h3 {
                margin: 0 0 8px 0; font-size: 13px; text-align: center;
                font-weight: bold; color: #555;
            }
            .pavement-buttons-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 5px;
            }
            .action-buttons-grid {
                display: grid; grid-template-columns: 1fr; gap: 6px;
            }
            .custom-button {
                padding: 8px 5px; font-size: 14px; font-weight: bold; cursor: pointer;
                border: 1px solid #999; border-radius: 4px; background-color: #f0f0f0;
                transition: background-color 0.2s, border-color 0.2s, color 0.2s;
            }
            .custom-button:hover { background-color: #e0e0e0; }
            .custom-button.pav-button.active {
                background-color: #007bff; color: white; border-color: #0056b3;
            }
            .save-button { color: white; }
            .save-button.mmt-default { background-color: #007bff; border-color: #0056b3; }
            .save-button.mmt-default:hover { background-color: #0069d9; }
            .save-button.obq-alt { background-color: #5a6268; border-color: #343a40; }
            .save-button.obq-alt:hover { background-color: #474d52; }
            .save-button.doubt-action { background-color: #ffc107; border-color: #d39e00; color: #212529;}
            .save-button.doubt-action:hover { background-color: #e0a800; }
            .save-button.not-selected-action { background-color: #fd7e14; border-color: #d3690d; }
            .save-button.not-selected-action:hover { background-color: #e67312; }
        `;
        document.head.appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'quick-actions-panel';
        panel.innerHTML = `
            <div id="quick-actions-header">Painel Rápido | Feitas: <span id="edit-counter">0</span></div>
            <div id="quick-actions-content">
                <div class="custom-controls-group">
                    <h3>Clique 1: Pavimento</h3>
                    <div class="pavement-buttons-grid"></div>
                </div>
                <div class="custom-controls-group">
                    <h3>Clique 2: Salvar</h3>
                    <div class="action-buttons-grid"></div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Preenche os botões de pavimento
        const pavGrid = panel.querySelector('.pavement-buttons-grid');
        for (let i = 1; i <= MAX_PAVIMENTOS; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'custom-button pav-button';
            btn.textContent = i;
            btn.onclick = () => setPavimento(i, btn);
            pavGrid.appendChild(btn);
        }

        // Preenche os botões de ação
        const actionGrid = panel.querySelector('.action-buttons-grid');

        const saveMmtBtn = document.createElement('button');
        saveMmtBtn.type = 'button';
        saveMmtBtn.className = 'custom-button save-button mmt-default';
        saveMmtBtn.textContent = 'Salvar (MMT)';
        saveMmtBtn.onclick = () => performSaveAction('MMT');
        actionGrid.appendChild(saveMmtBtn);

        const saveObqBtn = document.createElement('button');
        saveObqBtn.type = 'button';
        saveObqBtn.className = 'custom-button save-button obq-alt';
        saveObqBtn.textContent = 'Salvar (OBQ)';
        saveObqBtn.onclick = () => performSaveAction('OBQ');
        actionGrid.appendChild(saveObqBtn);

        const saveDoubtBtn = document.createElement('button');
        saveDoubtBtn.type = 'button';
        saveDoubtBtn.className = 'custom-button save-button doubt-action';
        saveDoubtBtn.textContent = 'Salvar (DÚVIDA)';
        saveDoubtBtn.onclick = () => performDoubtSaveAction();
        actionGrid.appendChild(saveDoubtBtn);

        const saveNotSelectedBtn = document.createElement('button');
        saveNotSelectedBtn.type = 'button';
        saveNotSelectedBtn.className = 'custom-button save-button not-selected-action';
        saveNotSelectedBtn.textContent = 'Salvar (Não Selec.)';
        saveNotSelectedBtn.onclick = () => performNotSelectedSaveAction();
        actionGrid.appendChild(saveNotSelectedBtn);

        makeDraggable(panel);
    }

    // =================================================================================
    // 2. FUNÇÕES DE AÇÃO
    // =================================================================================
    function setPavimento(numPavimentos, clickedButton) {
        const allPavButtons = document.querySelectorAll('.pav-button');
        allPavButtons.forEach(button => button.classList.remove('active'));
        clickedButton.classList.add('active');
        const pavInput = document.getElementById('pav_cor_se');
        if (pavInput) pavInput.value = numPavimentos.toString().padStart(2, '0');
    }

    function performSaveAction(fonte) {
        const fonteRadios = document.querySelectorAll('input[name="fonte_consulta"]');
        const saveButton = document.querySelector('.btn-salvar[onclick="salvarEdificacao()"]');
        if (!fonteRadios.length || !saveButton) return;
        fonteRadios.forEach(radio => { if (radio.value === fonte) radio.checked = true; });
        const statusAtualizadoRadio = document.querySelector('input[name="status"][value="ATUALIZADO"]');
        if (statusAtualizadoRadio) statusAtualizadoRadio.checked = true;
        saveActionInitiated = "normal";
        saveButton.click();
    }

    function performDoubtSaveAction() {
        const statusDuvidaRadio = document.querySelector('input[name="status"][value="DUVIDA"]');
        const saveButton = document.querySelector('.btn-salvar[onclick="salvarEdificacao()"]');
        if (!statusDuvidaRadio || !saveButton) return;
        statusDuvidaRadio.checked = true;
        saveActionInitiated = "duvida";
        saveButton.click();
    }

    function performNotSelectedSaveAction() {
        const statusNotSelectedRadio = document.querySelector('input[name="status"][value="EDIF_N_SEL"]');
        const saveButton = document.querySelector('.btn-salvar[onclick="salvarEdificacao()"]');
        if (!statusNotSelectedRadio || !saveButton) return;
        statusNotSelectedRadio.checked = true;
        saveActionInitiated = "nsel";
        saveButton.click();
    }

    // =================================================================================
    // 3. DRAGGABLE
    // =================================================================================
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById(element.id + "-header") || element;
        header.onmousedown = dragMouseDown;
        function dragMouseDown(e) { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }
        function elementDrag(e) { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px"; }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
    }

    // =================================================================================
    // 4. VISIBILIDADE E CONTADOR
    // =================================================================================
    function setupVisibilityObserver() {
        const floatingPanel = document.getElementById('quick-actions-panel');
        const counterElement = document.getElementById('edit-counter');
        const observer = new MutationObserver(() => {
            const formPanel = document.getElementById('painelEdificacao');
            const formIsOpen = formPanel && formPanel.innerHTML.trim() !== "";
            if (formIsOpen) {
                floatingPanel.style.display = 'block';
            } else {
                if (saveActionInitiated === "normal") {
                    sessionEditCount++;
                    counterElement.textContent = sessionEditCount;
                }
                saveActionInitiated = null;
                floatingPanel.style.display = 'none';
                const allPavButtons = document.querySelectorAll('.pav-button');
                allPavButtons.forEach(button => button.classList.remove('active'));
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Inicia o script ---
    createFloatingPanel();
    setupVisibilityObserver();

})();
