// ==UserScript==
// @name         Eproc TJSC - Melhorias e Funcionalidades
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adiciona um menu de configurações e funcionalidades ao eproc do TJSC, incluindo personalização de cor.
// @author       Wellyton Nandi
// @match        https://eproc1g.tjsc.jus.br/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542032/Eproc%20TJSC%20-%20Melhorias%20e%20Funcionalidades.user.js
// @updateURL https://update.greasyfork.org/scripts/542032/Eproc%20TJSC%20-%20Melhorias%20e%20Funcionalidades.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Objeto para armazenar as configurações padrão.
    const defaultConfig = {
        'highlightPositiveCounts': true,
        'addCopyNameButton': true,
        'enableCustomNavbarColor': false, // 3ª funcionalidade, desativada por padrão
        'navbarColor': '#006599'          // Cor padrão para a barra de navegação
    };

    // Carrega as configurações salvas ou usa o padrão.
    let userConfig = JSON.parse(GM_getValue('eprocConfig', JSON.stringify(defaultConfig)));

    function saveConfig(config) {
        GM_setValue('eprocConfig', JSON.stringify(config));
        userConfig = config;
        location.reload(); // Recarrega para aplicar as alterações
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #btnConfigEproc {
                font-size: 22px;
                margin-right: 8px;
                cursor: pointer;
                display: inline-block;
                vertical-align: middle;
            }
            #btnConfigEproc:hover { opacity: 0.8; }

            /* Estilo para o botão de copiar nome */
            .copy-name-btn {
                cursor: pointer;
                margin-right: 5px;
                font-size: 1.1em;
                display: inline-block;
            }
            .copy-name-btn:hover {
                transform: scale(1.2);
            }

            /* --- Estilos do Modal --- */
            #configModalEproc {
                display: none; position: fixed; z-index: 9999;
                left: 0; top: 0; width: 100%; height: 100%;
                overflow: auto; background-color: rgba(0,0,0,0.5);
            }
            .modal-content-eproc {
                background-color: #fefefe; margin: 15% auto; padding: 20px;
                border: 1px solid #888; width: 80%; max-width: 500px;
                border-radius: 8px; font-family: Arial, sans-serif;
            }
            .modal-content-eproc h2 { margin-top: 0; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .modal-content-eproc .option { margin-bottom: 15px; }
            .modal-content-eproc label { display: flex; align-items: center; cursor: pointer; }
            .modal-content-eproc input[type="checkbox"] { margin-right: 10px; transform: scale(1.2); }
            .modal-content-eproc input[type="color"] { margin-left: 15px; } /* Estilo para o seletor de cor */
            .modal-footer-eproc { text-align: right; margin-top: 20px; }
            .modal-footer-eproc button {
                padding: 10px 15px; border: none; border-radius: 5px;
                cursor: pointer; margin-left: 10px;
            }
            #btnSaveConfigEproc { background-color: #4CAF50; color: white; }
            #btnCancelConfigEproc { background-color: #f44336; color: white; }
        `;
        document.head.appendChild(style);
    }

    function createConfigModal() {
        const modalHTML = `
            <div id="configModalEproc">
                <div class="modal-content-eproc">
                    <h2>⚙️ Configurações do Script</h2>

                    <div class="option">
                        <label>
                            <input type="checkbox" id="highlightPositiveCounts">
                            Destacar em verde localizadores com processos (> 0)
                        </label>
                    </div>

                    <div class="option">
                        <label>
                            <input type="checkbox" id="addCopyNameButton">
                            Adicionar botão para copiar nome das partes
                        </label>
                    </div>

                    <div class="option">
                        <label>
                            <input type="checkbox" id="enableCustomNavbarColor">
                            Habilitar cor customizada na barra superior
                            <input type="color" id="navbarColor">
                        </label>
                    </div>

                    <div class="modal-footer-eproc">
                        <button id="btnSaveConfigEproc">Salvar</button>
                        <button id="btnCancelConfigEproc">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('configModalEproc');
        const btnSave = document.getElementById('btnSaveConfigEproc');
        const btnCancel = document.getElementById('btnCancelConfigEproc');

        const closeModal = () => modal.style.display = 'none';
        btnCancel.onclick = closeModal;

        btnSave.onclick = () => {
            const newConfig = {};
            // Pega o valor dos checkboxes
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => { newConfig[cb.id] = cb.checked; });

            // Pega o valor do seletor de cor especificamente
            newConfig.navbarColor = document.getElementById('navbarColor').value;

            saveConfig(newConfig);
            closeModal();
            alert('Configurações salvas! A página será recarregada para aplicar as alterações.');
        };

        window.onclick = (event) => {
            if (event.target == modal) closeModal();
        };
    }

    function populateModal() {
        // Popula os checkboxes
        for (const key in userConfig) {
            const checkbox = document.getElementById(key);
            if (checkbox && checkbox.type === 'checkbox') {
                checkbox.checked = userConfig[key];
            }
        }
        // Popula o seletor de cor
        const colorInput = document.getElementById('navbarColor');
        if (colorInput) {
            colorInput.value = userConfig.navbarColor;
        }

        // Adiciona lógica para habilitar/desabilitar o seletor de cor
        const enableColorCheckbox = document.getElementById('enableCustomNavbarColor');
        const handleColorInputState = () => {
             colorInput.disabled = !enableColorCheckbox.checked;
        };
        enableColorCheckbox.addEventListener('change', handleColorInputState);
        handleColorInputState(); // Define o estado inicial
    }

    function highlightProcessCounts() {
    const cells = document.querySelectorAll('td.qtdeListaDeProcessosPorLocalizador');
    cells.forEach(cell => {
        const link = cell.querySelector('a');
        // Sempre limpa os estilos antes de aplicar novos
        cell.style.backgroundColor = '';
        cell.style.color = '';
        if (link) {
            link.style.fontWeight = '';
            link.style.color = '';
            const count = parseInt(link.textContent.trim(), 10);
            if (!isNaN(count) && count > 0) {
                cell.style.backgroundColor = '#d4edda';
                cell.style.color = '#155724';
                link.style.fontWeight = 'bold';
                link.style.color = 'inherit';
            }
        }
    });
}

    function addCopyToNameButtons() {
        const nameLinks = document.querySelectorAll('a.infraNomeParte');
        nameLinks.forEach(link => {
            if (link.previousElementSibling && link.previousElementSibling.classList.contains('copy-name-btn')) {
                return;
            }
            const nameToCopy = link.textContent.trim();
            if (!nameToCopy) return;
            const copyBtn = document.createElement('span');
            copyBtn.className = 'copy-name-btn';
            copyBtn.innerHTML = '📑';
            copyBtn.title = 'Copiar nome';
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(nameToCopy).then(() => {
                    const originalIcon = copyBtn.innerHTML;
                    copyBtn.innerHTML = '✅';
                    setTimeout(() => { copyBtn.innerHTML = originalIcon; }, 1500);
                }).catch(err => {
                    console.error('Falha ao copiar:', err);
                    alert('Não foi possível copiar o nome.');
                });
            });
            link.parentNode.insertBefore(copyBtn, link);
        });
    }

    /**
     * NOVA FUNÇÃO
     * Altera a cor da barra de navegação superior (#navbar) se a opção estiver habilitada.
     */
    function changeNavbarColor() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return; // Se a navbar não for encontrada, não faz nada

        if (userConfig.enableCustomNavbarColor && userConfig.navbarColor) {
            // Aplica a cor customizada
            navbar.style.backgroundImage = 'none'; // Remove o gradiente para a cor sólida funcionar
            navbar.style.backgroundColor = userConfig.navbarColor;
        } else {
            // Restaura o padrão original (removendo os estilos inline)
            navbar.style.backgroundImage = '';
            navbar.style.backgroundColor = '';
        }
    }


    function main() {
        const btnProfile = document.getElementById('btnProfile');
        if (!btnProfile) {
            setTimeout(main, 1000);
            return;
        }

        addStyles();
        createConfigModal();

        const configIcon = document.createElement('a');
        configIcon.id = 'btnConfigEproc';
        configIcon.title = 'Configurações do Script';
        configIcon.innerHTML = '⚙️';
        configIcon.addEventListener('click', () => {
            populateModal();
            document.getElementById('configModalEproc').style.display = 'block';
        });

        if (!document.getElementById('btnConfigEproc')) {
             btnProfile.parentNode.insertBefore(configIcon, btnProfile);
        }

        // --- Funções que precisam ser executadas sempre que o conteúdo da página mudar ---
        const runFeatures = () => {
            if (userConfig.highlightPositiveCounts) {
                highlightProcessCounts();
            }
            if (userConfig.addCopyNameButton) {
                addCopyToNameButtons();
            }
            // Executa a nova função de mudança de cor
            changeNavbarColor();
        };

        // Executa as funções uma vez no carregamento inicial
        runFeatures();

        // Cria um MutationObserver para observar mudanças no DOM
        const observer = new MutationObserver(runFeatures);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    main();

})();