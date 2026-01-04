// ==UserScript==
// @name         SISCAD - ADICIONAR DADOS SIGFI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatiza a inserção de dados no sistema SiscAD
// @author       Adriel Alves
// @match        http://201.182.66.178:2210/plpt_cemar/*
// @license MIT 
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527242/SISCAD%20-%20ADICIONAR%20DADOS%20SIGFI.user.js
// @updateURL https://update.greasyfork.org/scripts/527242/SISCAD%20-%20ADICIONAR%20DADOS%20SIGFI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #dataInserterMenu {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 999999999999999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            min-width: 200px;
        }
        #dataInserterMenu.collapsed {
            min-width: auto;
            width: 40px;
            height: 40px;
            overflow: hidden;
        }
        .menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
            background: #f5f5f5;
            padding: 5px;
            border-radius: 3px;
        }
        .collapse-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
        }
        .file-list {
            max-height: 200px;
            overflow-y: auto;
            margin: 10px 0;
        }
        .file-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .controls {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        }
        .button:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }
        #debugInfo {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            max-width: 400px;
            max-height: 200px;
            overflow: auto;
            z-index: 999999999999;
        }
    `);

    let filesData = [];
    let currentFileIndex = -1;
    let debugInfo;

    function createDebugInfo() {
        debugInfo = document.createElement('div');
        debugInfo.id = 'debugInfo';
        document.body.appendChild(debugInfo);
    }

    function log(message, type = 'info') {
        const time = new Date().toLocaleTimeString();
        const colors = {
            info: '#4CAF50',
            warn: '#FFA500',
            error: '#FF0000'
        };

        console.log(`[${time}] ${message}`);

        if (debugInfo) {
            const line = document.createElement('div');
            line.style.color = colors[type] || colors.info;
            line.textContent = `[${time}] ${message}`;
            debugInfo.appendChild(line);
            debugInfo.scrollTop = debugInfo.scrollHeight;
        }
    }

    // Função principal para preencher campos do formulário
    function fillFormField(id, value) {
        try {
            // Tratamento especial para checkbox e radio
            if (id === 'O671_id-displayEl') {
                const checkboxId = 'O671_id';
                const checkbox = Ext.getCmp(checkboxId);
                if (checkbox) {
                    checkbox.setValue(true);
                    // Forçar atualização visual do checkbox
                    const inputEl = document.getElementById('O671_id-inputEl');
                    if (inputEl) {
                        inputEl.checked = true;
                        const event = new Event('change', { bubbles: true });
                        inputEl.dispatchEvent(event);
                    }
                    log(`Checkbox ${checkboxId} marcado`);
                    return;
                } else {
                    log(`Checkbox ${checkboxId} não encontrado`, 'error');
                }
            }

            if (id === 'radio-1074-displayEl') {
                const radioId = 'radio-1074';
                const radio = Ext.getCmp(radioId);
                if (radio) {
                    radio.setValue(true);
                    log(`Radio ${radioId} marcado`);
                    return;
                }
            }

            // Processamento normal para outros campos
            const extId = id.replace('-inputEl', '');
            const field = Ext.getCmp(extId);

            if (!field) {
                log(`Campo ExtJS não encontrado: ${extId}`, 'warn');
                return;
            }

            log(`Tentando preencher ${id} com valor: ${value}`);

            // Verificar o tipo do campo
            const fieldType = field.getXType();
            log(`Tipo do campo ${id}: ${fieldType}`);

            // Definir o valor usando a API do ExtJS
            field.setValue(value);

            // Disparar eventos do ExtJS
            field.fireEvent('change', field, value, field.previousValue);
            field.fireEvent('blur');

            // Verificar se o valor foi definido corretamente
            const newValue = field.getValue();
            if (newValue === value) {
                log(`Campo ${id} preenchido com sucesso`);
            } else {
                log(`Valor definido (${newValue}) diferente do esperado (${value}) para ${id}`, 'warn');
            }

        } catch (error) {
            log(`Erro ao preencher campo ${id}: ${error.message}`, 'error');
            console.error(error);
        }
    }

    function fillSection(sectionData) {
        Object.entries(sectionData).forEach(([key, field]) => {
            if (field.id && field.value !== undefined) {
                fillFormField(field.id, field.value);
            }
        });
    }

    // Criar menu flutuante
    const menu = document.createElement('div');
    menu.id = 'dataInserterMenu';
    menu.innerHTML = `
        <div class="menu-header">
            <span>Inserção de Dados</span>
            <button class="collapse-btn">▼</button>
        </div>
        <div class="menu-content">
            <input type="file" multiple accept=".json" id="fileInput" style="display: none;">
            <button class="button" id="selectFiles">Selecionar Arquivos</button>
            <div class="file-list"></div>
            <div class="controls">
                <button class="button" id="insertData" disabled>Inserir Dados</button>
                <button class="button" id="nextFile" disabled>Próximo Arquivo</button>
                <button class="button" id="toggleDebug">Toggle Debug</button>
            </div>
        </div>
    `;

    function initializeMenu() {
        // Tornar o menu arrastável
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        menu.querySelector('.menu-header').addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === menu.querySelector('.menu-header')) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, menu);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function limparImagens(){
            const imgPreview = "http://201.182.66.178:2210/plpt_cemar/jtdr_plpt.dll/ext-7.5.1/build/classic/theme-classic/resources/images/tree/s.gif";

            document.querySelector("#O3D0_id-innerCt").querySelector("img").src=imgPreview;
            document.querySelector("#O410_id-innerCt").querySelector("img").src=imgPreview;
            document.querySelector("#O4CC_id-innerCt").querySelector("img").src=imgPreview;
            document.querySelector("#O490_id-innerCt").querySelector("img").src=imgPreview;

            document.querySelector("#O699_id-innerCt").querySelector("img").src=imgPreview;
            document.querySelector("#O6D9_id-innerCt").querySelector("img").src=imgPreview;
            document.querySelector("#O6F9_id-innerCt").querySelector("img").src=imgPreview;
            document.querySelector("#O6B9_id-innerCt").querySelector("img").src=imgPreview;
        }

        // Funcionalidade de colapsar/expandir
        const collapseBtn = menu.querySelector('.collapse-btn');
        collapseBtn.addEventListener('click', () => {
            menu.classList.toggle('collapsed');
            collapseBtn.textContent = menu.classList.contains('collapsed') ? '▲' : '▼';
        });

        // Toggle Debug Info
        const toggleDebugBtn = document.getElementById('toggleDebug');
        toggleDebugBtn.addEventListener('click', () => {
            debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
        });

        // Manipulação de arquivos
        const fileInput = document.getElementById('fileInput');
        const selectFilesBtn = document.getElementById('selectFiles');
        const insertDataBtn = document.getElementById('insertData');
        const nextFileBtn = document.getElementById('nextFile');
        const fileList = menu.querySelector('.file-list');

        selectFilesBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            filesData = [];
            fileList.innerHTML = '';
            log('Iniciando processamento dos arquivos');

            for (const file of files) {
                try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    filesData.push({ name: file.name, data });
                    log(`Arquivo ${file.name} carregado com sucesso`);

                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `
                        <span>${file.name}</span>
                        <span class="status">Pendente</span>
                    `;
                    fileList.appendChild(fileItem);
                } catch (error) {
                    log(`Erro ao processar arquivo ${file.name}: ${error.message}`, 'error');
                }
            }

            if (filesData.length > 0) {
                insertDataBtn.disabled = false;
                currentFileIndex = 0;
                updateFileListStatus();
                log('Arquivos carregados e prontos para processamento');
            }
        });

        insertDataBtn.addEventListener('click', () => {
            if (currentFileIndex >= 0 && currentFileIndex < filesData.length) {
                log(`Iniciando inserção de dados do arquivo ${filesData[currentFileIndex].name}`);
                insertCurrentFileData();
                limparImagens();
            }
        });

        nextFileBtn.addEventListener('click', () => {
            currentFileIndex++;
            if (currentFileIndex < filesData.length) {
                insertDataBtn.disabled = false;
                nextFileBtn.disabled = true;
                updateFileListStatus();
                log('Pronto para processar próximo arquivo');
            } else {
                insertDataBtn.disabled = true;
                nextFileBtn.disabled = true;
                log('Todos os arquivos foram processados');
            }
        });

        function updateFileListStatus() {
            const fileItems = fileList.querySelectorAll('.file-item');
            fileItems.forEach((item, index) => {
                const status = item.querySelector('.status');
                if (index < currentFileIndex) {
                    status.textContent = 'Concluído';
                    status.style.color = 'green';
                } else if (index === currentFileIndex) {
                    status.textContent = 'Atual';
                    status.style.color = 'blue';
                } else {
                    status.textContent = 'Pendente';
                    status.style.color = 'black';
                }
            });
        }

        function insertCurrentFileData() {
            const currentFile = filesData[currentFileIndex];
            try {
                log(`Processando arquivo: ${currentFile.name}`);
                Object.entries(currentFile.data).forEach(([section, data]) => {
                    log(`Preenchendo seção: ${section}`);
                    fillSection(data);
                });

                insertDataBtn.disabled = true;
                nextFileBtn.disabled = false;
                updateFileListStatus();
                log('Dados inseridos com sucesso');
            } catch (error) {
                log(`Erro ao inserir dados: ${error.message}`, 'error');
            }
        }
    }

    // Inicializar quando ExtJS estiver pronto
    function waitForExtJS() {
        if (typeof Ext !== 'undefined') {
            log('ExtJS detectado, inicializando...');
            document.body.appendChild(menu);
            createDebugInfo();
            initializeMenu();
        } else {
            log('Aguardando ExtJS...', 'warn');
            setTimeout(waitForExtJS, 1000);
        }
    }

    window.addEventListener('load', waitForExtJS);
})();