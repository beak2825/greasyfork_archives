// ==UserScript==
// @name         CBR - Definir Categorias Padrão
// @namespace    CBRSDC
// @version      1.2
// @license      MIT
// @description  Definir e gerenciar opções padrão de Busca Avançada
// @author       jkillas
// @match        https://capybarabr.com/torrents*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=capybarabr.com
// @downloadURL https://update.greasyfork.org/scripts/522348/CBR%20-%20Definir%20Categorias%20Padr%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/522348/CBR%20-%20Definir%20Categorias%20Padr%C3%A3o.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to be fully loaded and ready
    function waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // Predefined categories
    const PRESET_CATEGORIES = [
        { value: 1, name: 'Filmes' },
        { value: 2, name: 'Series' },
        { value: 4, name: 'Animes' },
        { value: 8, name: 'Esportes' },
        { value: 5, name: 'Jogos' },
        { value: 9, name: 'Programas' },
        { value: 10, name: 'HQs' },
        { value: 11, name: 'Livros' },
        { value: 12, name: 'Cursos' },
        { value: 13, name: 'Revistas' }
    ];

    // Button position options
    const BUTTON_POSITIONS = {
        'bottom-left': { bottom: '20px', left: '-165px', right: 'auto', top: 'auto' },
        'bottom-right': { bottom: '20px', right: '-165px', left: 'auto', top: 'auto' },
        'top-left': { top: '20px', left: '-165px', right: 'auto', bottom: 'auto' },
        'top-right': { top: '20px', right: '-165px', left: 'auto', bottom: 'auto' }
    };

    // Default theme colors
    const DEFAULT_COLORS = {
        primary: '#feb100',
        primaryDark: '#cb8f00',
        primaryLight: '#ffc333',
        primaryLighter: '#ffd666'
    };

    // Safe storage operations
    function safeGetValue(key, defaultValue) {
        try {
            return GM_getValue(key, defaultValue);
        } catch (e) {
            console.error('Falha ao obter valor:', e);
            return defaultValue;
        }
    }

    function safeSetValue(key, value) {
        try {
            GM_setValue(key, value);
            return true;
        } catch (e) {
            console.error('Falha ao definir valor:', e);
            return false;
        }
    }

    // Load UI settings
    function loadUISettings() {
        return {
            buttonPosition: safeGetValue('buttonPosition', 'bottom-left'),
            primaryColor: safeGetValue('primaryColor', DEFAULT_COLORS.primary)
        };
    }

    // Generate dynamic styles based on settings
    function generateStyles(settings) {
        const position = BUTTON_POSITIONS[settings.buttonPosition];
        const hoverPosition = settings.buttonPosition.includes('left') ?
              { left: '0' } : { right: '0' };

        return `
        :root {
            --primary: ${settings.primaryColor};
            --primary-dark: ${adjustColor(settings.primaryColor, -20)};
            --primary-light: ${adjustColor(settings.primaryColor, 20)};
            --primary-lighter: ${adjustColor(settings.primaryColor, 40)};
            --secondary: #F3F4F6;
            --danger: #EF4444;
            --danger-dark: #DC2626;
            --text-dark: #1F2937;
            --text-light: #F9FAFB;
            --background: #FFFFFF;
            --border: #E5E7EB;
        }

        .cbr-settings-btn {
            position: fixed;
            ${Object.entries(position).map(([key, value]) => `${key}: ${value};`).join('\n')}
            background: var(--primary);
            color: var(--text-light);
            border: none;
            padding: 10px 20px;
            border-radius: ${settings.buttonPosition.includes('left') ? '0 5px 5px 0' : '5px 0 0 5px'};
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease-in-out;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            min-width: 200px;
            font-weight: 500;
        }

        .cbr-settings-btn:hover {
            ${Object.entries(hoverPosition).map(([key, value]) => `${key}: ${value};`).join('\n')}
            background: var(--primary-dark);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .cbr-settings-btn .icon {
            font-size: 20px;
            margin-right: 5px;
        }

        .cbr-settings-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--background);
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        }

        .cbr-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 9997;
            backdrop-filter: blur(2px);
        }

        .cbr-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 10px;
        }

        .cbr-tab {
            background: none;
            border: none;
            padding: 8px 16px;
            cursor: pointer;
            color: var(--text-dark);
            font-weight: 500;
            opacity: 0.7;
            transition: all 0.2s;
        }

        .cbr-tab.active {
            opacity: 1;
            color: var(--primary);
            border-bottom: 2px solid var(--primary);
        }

        .cbr-tab-content {
            display: none;
        }

        .cbr-tab-content.active {
            display: block;
        }

        .cbr-category-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
            margin: 20px 0;
        }

        .cbr-category-item {
            display: flex;
            align-items: center;
            padding: 12px;
            background: var(--secondary);
            border-radius: 8px;
            transition: all 0.2s;
            border: 1px solid var(--border);
        }

        .cbr-category-item:hover {
            background: #E9EAF0;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .cbr-category-item label {
            margin-left: 8px;
            flex-grow: 1;
            cursor: pointer;
            color: var(--text-dark);
            font-weight: 500;
        }

        .cbr-category-item input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--primary);
        }

        .cbr-appearance-settings {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin: 20px 0;
        }

        .cbr-setting-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .cbr-setting-group label {
            font-weight: 500;
            color: var(--text-dark);
        }

        .cbr-setting-group select,
        .cbr-setting-group input[type="color"] {
            padding: 8px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: var(--background);
        }

        .cbr-setting-group input[type="color"] {
            width: 100%;
            height: 40px;
        }

        .cbr-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }

        .cbr-btn {
            background: var(--primary);
            color: var(--text-light);
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 500;
        }

        .cbr-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .cbr-btn-danger {
            background: var(--danger);
        }

        .cbr-btn-danger:hover {
            background: var(--danger-dark);
        }

        h2 {
            color: var(--primary);
            margin: 0 0 16px 0;
            font-size: 1.8rem;
        }
    `;
    }

    // Helper function with more robust URL checking
    function isTorrentsPage() {
        try {
            const url = new URL(window.location.href);
            return url.pathname === '/torrents' ||
                url.pathname === '/torrents/' ||
                (url.pathname === '/torrents' && url.search.length > 0);
        } catch (e) {
            console.error('Erro ao analisar URL:', e);
            return false;
        }
    }

    // Load saved categories
    function loadSavedCategories() {
        return safeGetValue('selectedCategories', [1, 2, 6]);
    }

    // Save categories
    function saveCategories(categories) {
        if (safeSetValue('selectedCategories', categories)) {
            safeSetValue('pendingValidation', true);
            safeSetValue('lastSavedCategories', categories);
        }
    }

    // Validate categories
    function validateCategories() {
        if (!isTorrentsPage()) return;

        try {
            const pendingValidation = safeGetValue('pendingValidation', false);
            if (!pendingValidation) return;

            const lastSavedCategories = safeGetValue('lastSavedCategories', []);
            const urlParams = new URLSearchParams(window.location.search);
            const urlCategories = [];

            for (const [key, value] of urlParams.entries()) {
                if (key.startsWith('categoryIds[')) {
                    urlCategories.push(parseInt(value));
                }
            }

            if (urlCategories.length === 0 && window.location.pathname === '/torrents') {
                console.log('Nenhuma categoria encontrada, aplicando padrões...');
                applyCategories();
                return;
            }

            const categoriesMatch = lastSavedCategories.length === urlCategories.length &&
                  lastSavedCategories.every(cat => urlCategories.includes(cat));

            if (!categoriesMatch) {
                console.log('Diferença nas categorias, reaplicando...');
                applyCategories();
            } else {
                safeSetValue('pendingValidation', false);
                safeSetValue('lastSavedCategories', []);
            }
        } catch (e) {
            console.error('Erro de validação:', e);
        }
    }

    // Apply categories
    function applyCategories() {
        if (!isTorrentsPage()) return;

        try {
            const selectedCategories = loadSavedCategories();
            const currentUrl = new URL(window.location.href);
            const views = ['card', 'list', 'group', 'poster'];

            const categoryParams = selectedCategories
            .map((id, index) => `categoryIds[${index}]=${id}`)
            .join('&');

            let newUrl;
            if (currentUrl.search === '') {
                newUrl = `${currentUrl.origin}${currentUrl.pathname}?${categoryParams}`;
            } else {
                const params = new URLSearchParams(currentUrl.search);
                const view = params.get('view') || views.find(v => params.has(`view=${v}`));

                const cleanParams = Array.from(params.entries())
                .filter(([key]) => !key.startsWith('categoryIds['))
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

                newUrl = `${currentUrl.origin}${currentUrl.pathname}?${cleanParams}${cleanParams ? '&' : ''}${categoryParams}`;
            }

            if (newUrl && newUrl !== window.location.href) {
                window.location.href = newUrl;
            }
        } catch (e) {
            console.error('Erro ao aplicar categorias:', e);
        }
    }

    // Helper function to adjust color brightness
    function adjustColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 +
                      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                      (B < 255 ? (B < 1 ? 0 : B) : 255)
                     ).toString(16).slice(1);
    }

    // Create settings button
    function createSettingsButton() {
        try {
            const existingButton = document.querySelector('.cbr-settings-btn');
            if (existingButton) {
                existingButton.remove();
            }
            const button = document.createElement('button');
            button.className = 'cbr-settings-btn'; // Fixed duplicate line
            button.innerHTML = `
            <span class="icon">⚙️</span>
            <span>Selecionar Categorias</span>
        `;
            button.onclick = showSettingsModal;
            document.body.appendChild(button);
        } catch (e) {
            console.error('Erro ao criar botão de configurações:', e);
        }
    }

    // Enhanced settings modal with UI customization
    function showSettingsModal() {
        try {
            const existingModal = document.querySelector('.cbr-settings-overlay');
            if (existingModal) {
                existingModal.remove();
            }

            const settings = loadUISettings();
            const selectedCategories = loadSavedCategories();

            const overlay = document.createElement('div');
            overlay.className = 'cbr-settings-overlay';

            const modal = document.createElement('div');
            modal.className = 'cbr-settings-modal';

            // Create tabs for different settings
            const tabs = `
                <div class="cbr-tabs">
                    <button class="cbr-tab active" data-tab="categories">Categorias</button>
                    <button class="cbr-tab" data-tab="appearance">Aparência</button>
                </div>
            `;

            // Categories content
            const categoriesContent = `
                <div class="cbr-tab-content active" id="categories-content">
                    <h2>Categorias</h2>
                    <div class="cbr-category-list">
                        ${PRESET_CATEGORIES.map(category => `
                            <div class="cbr-category-item">
                                <input type="checkbox" id="category-${category.value}"
                                    ${selectedCategories.includes(category.value) ? 'checked' : ''}>
                                <label for="category-${category.value}">${category.name}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Appearance content
            const appearanceContent = `
                <div class="cbr-tab-content" id="appearance-content">
                    <h2>Posição e Cor Principal</h2>
                    <div class="cbr-appearance-settings">
                        <div class="cbr-setting-group">
                            <label>Posição do Botão:</label>
                            <select id="button-position">
                                <option value="bottom-left" ${settings.buttonPosition === 'bottom-left' ? 'selected' : ''}>
                                    Inferior Esquerdo
                                </option>
                                <option value="bottom-right" ${settings.buttonPosition === 'bottom-right' ? 'selected' : ''}>
                                    Inferior Direito
                                </option>
                                <option value="top-left" ${settings.buttonPosition === 'top-left' ? 'selected' : ''}>
                                    Superior Esquerdo
                                </option>
                                <option value="top-right" ${settings.buttonPosition === 'top-right' ? 'selected' : ''}>
                                    Superior Direito
                                </option>
                            </select>
                        </div>
                        <div class="cbr-setting-group">
                            <label>Cor Preferida:</label>
                            <input type="color" id="primary-color" value="${settings.primaryColor}">
                        </div>
                    </div>
                </div>
            `;

            modal.innerHTML = `
                ${tabs}
                ${categoriesContent}
                ${appearanceContent}
                <div class="cbr-modal-footer">
                    <button class="cbr-btn">Salvar Alterações</button>
                    <button class="cbr-btn cbr-btn-danger">Cancelar</button>
                </div>
            `;

            // Add event listeners
            modal.querySelector('.cbr-btn').onclick = () => saveSettings(modal);
            modal.querySelector('.cbr-btn-danger').onclick = () => document.body.removeChild(overlay);

            // Tab functionality
            modal.querySelectorAll('.cbr-tab').forEach(tab => {
                tab.onclick = () => {
                    modal.querySelectorAll('.cbr-tab').forEach(t => t.classList.remove('active'));
                    modal.querySelectorAll('.cbr-tab-content').forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    modal.querySelector(`#${tab.dataset.tab}-content`).classList.add('active');
                };
            });

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        } catch (e) {
            console.error('Erro ao mostrar modal de configurações:', e);
        }
    }

    // Save settings
    function saveSettings(modal) {
        try {
            const selectedCategories = Array.from(modal.querySelectorAll('.cbr-category-item input:checked'))
            .map(checkbox => parseInt(checkbox.id.replace('category-', '')));

            if (selectedCategories.length === 0) {
                alert('Por favor, selecione pelo menos uma categoria');
                return;
            }

            const buttonPosition = modal.querySelector('#button-position').value;
            const primaryColor = modal.querySelector('#primary-color').value;

            safeSetValue('buttonPosition', buttonPosition);
            safeSetValue('primaryColor', primaryColor);
            saveCategories(selectedCategories);

            updateStyles();
            document.body.removeChild(modal.parentElement);
            setTimeout(() => window.location.reload(), 500);
        } catch (e) {
            console.error('Erro ao salvar configurações:', e);
        }
    }

    // Update styles based on current settings
    function updateStyles() {
        const settings = loadUISettings();
        const styleSheet = document.createElement('style');
        styleSheet.textContent = generateStyles(settings);
        document.head.appendChild(styleSheet);
    }

    // Modified initialization
    async function init() {
        try {
            await waitForPageLoad();
            await new Promise(resolve => setTimeout(resolve, 500));

            updateStyles();
            createSettingsButton();

            if (!isTorrentsPage()) return;

            if (safeGetValue('pendingValidation', false)) {
                validateCategories();
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const views = ['card', 'list', 'group', 'poster'];
                const hasCategories = views.some(view =>
                                                 urlParams.has(`view=${view}`) && Array.from(urlParams.keys()).some(k => k.startsWith('categoryIds[')));

                if (!hasCategories) {
                    applyCategories();
                }
            }
        } catch (e) {
            console.error('Erro de inicialização:', e);
        }
    }

    // Start initialization
    init();
})();