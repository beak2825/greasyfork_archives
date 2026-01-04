// ==UserScript==
// @name         ERISTA Redump+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filtrar, organizar y gestionar juegos Redump con herramientas esenciales
// @author       Shu2Ouma
// @icon         https://myrient.erista.me/favicon.ico
// @match        https://myrient.erista.me/files/Redump/*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/507243/ERISTA%20Redump%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/507243/ERISTA%20Redump%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURACIÓN Y CONSTANTES ====================
    const CONFIG = {
        STORAGE_KEY: 'erista-redump-plus',
        ITEMS_PER_PAGE: 50,
        REGIONS: {
            ASIA: ['(Japan)', '(Korea)', '(Asia)', '(Japan, Korea)', '(Japan, Asia)', '(ja, zh)', '(Taiwan)', '(China)'],
            EUROPE: ['(Europe)', '(Germany)', '(France)', '(Italy)', '(Spain)', '(UK)', '(PAL)', '(Scandinavia)'],
            AMERICA: ['(USA)', '(Canada)', '(Brazil)', '(Mexico)', '(USA, Europe)', '(USA, Canada)']
        },
        ANIMATION_DURATION: 200
    };

    // ==================== ESTADO GLOBAL ====================
    const state = {
        filters: {
            letter: 'Filtrar por letra',
            searchTerm: '',
            region: 'all'
        },
        selections: new Map(),
        currentPage: 1,
        totalVisible: 0,
        totalPages: 1,
        paginationEnabled: false
    };

    // ==================== STORAGE ====================
    const storage = {
        save: function(key, data) {
            const allData = GM_getValue(CONFIG.STORAGE_KEY, {});
            allData[key] = data;
            GM_setValue(CONFIG.STORAGE_KEY, allData);
        },

        load: function(key) {
            const allData = GM_getValue(CONFIG.STORAGE_KEY, {});
            return allData[key] || null;
        },

        saveSelections: function() {
            const selections = {};
            state.selections.forEach((checked, url) => {
                selections[url] = checked;
            });
            this.save(window.location.href + '-selections', selections);
        },

        loadSelections: function() {
            const saved = this.load(window.location.href + '-selections');
            if (saved) {
                Object.entries(saved).forEach(([url, checked]) => {
                    state.selections.set(url, checked);
                });
            }
        },

        saveFilters: function() {
            this.save(window.location.href + '-filters', state.filters);
        },

        loadFilters: function() {
            const saved = this.load(window.location.href + '-filters');
            if (saved) {
                state.filters = { ...state.filters, ...saved };
            }
        },

        savePaginationState: function() {
            this.save(window.location.href + '-pagination', state.paginationEnabled);
        },

        loadPaginationState: function() {
            const saved = this.load(window.location.href + '-pagination');
            if (saved !== null) {
                state.paginationEnabled = saved;
            }
        }
    };

    // ==================== UTILIDADES ====================
    const utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        createElement: function(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            Object.assign(element, attributes);
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child) {
                    element.appendChild(child);
                }
            });
            return element;
        },

        showNotification: function(message, type = 'success', duration = 2000) {
            document.querySelectorAll('.redump-notification').forEach(n => n.remove());

            const notification = this.createElement('div', {
                className: `redump-notification ${type}`,
                innerHTML: message,
                style: `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 10px 15px;
                    border-radius: 5px;
                    z-index: 10000;
                    color: white;
                    background-color: ${type === 'error' ? '#d32f2f' :
                                     type === 'warning' ? '#f57c00' : '#388e3c'};
                    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                    animation: slideIn 0.3s ease-out;
                    font-size: 14px;
                    max-width: 300px;
                    border: 1px solid rgba(255,255,255,0.1);
                `
            });

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => notification.remove(), 500);
            }, duration);
        },

        copyToClipboard: async function(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            }
        },

        // Nueva función para verificar si un enlace es un directorio
        isDirectoryLink: function(linkElement) {
            const linkText = linkElement.textContent.trim();
            // Verifica si termina en '/' y no es "Parent directory"
            return linkText.endsWith('/') && !linkText.includes('Parent directory');
        }
    };

    // ==================== ESTILOS GLOBALES - TEMA OSCURO ====================
    GM_addStyle(`
        /* Animaciones */
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        /* Barra sticky */
        #redump-sticky-bar.hidden {
            transform: translateY(-100%);
        }

        /* Checkboxes */
        input[type="checkbox"] {
            width: 15px;
            height: 15px;
            margin: 0;
            vertical-align: middle;
            margin-right: 10px;
        }

        .game-checkbox:checked {
            accent-color: #4CAF50;
        }

        /* Filas */
        td.link {
            display: flex;
            align-items: center;
        }

        td.link a {
            color: #4CAF50;
            text-decoration: none;
        }

        td.link a:hover {
            text-decoration: underline;
        }

        tr:hover {
            background-color: rgba(76, 175, 80, 0.1) !important;
        }

        /* BARRA DE HERRAMIENTAS - TEMA OSCURO MEJORADO */
        #redump-sticky-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            z-index: 9999;
            padding: 10px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            border-bottom: 1px solid #30363d;
            transition: transform 0.3s ease;
        }

        .control-group {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: rgba(22, 27, 34, 0.9);
            border-radius: 6px;
            border: 1px solid #30363d;
        }

        /* Paginación dentro de la barra */
        #pagination-controls {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-left: 5px;
        }

        .pagination-btn {
            min-width: 28px;
            height: 28px;
            padding: 0;
            border: 1px solid #30363d;
            border-radius: 4px;
            background: #21262d;
            color: #c9d1d9;
            cursor: pointer;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
            background: #30363d;
            border-color: #8b949e;
        }

        .pagination-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .pagination-info {
            color: #8b949e;
            font-size: 11px;
            margin: 0 5px;
            min-width: 75px;
            text-align: center;
            font-weight: 500;
        }

        /* Botones - Estilo oscuro mejorado */
        .redump-btn {
            padding: 6px 12px;
            border: 1px solid #30363d;
            border-radius: 6px;
            color: #c9d1d9;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 13px;
            white-space: nowrap;
            background: linear-gradient(180deg, #21262d 0%, #161b22 100%);
        }

        .redump-btn.primary {
            background: linear-gradient(180deg, #238636 0%, #196c2e 100%);
            border-color: #2ea043;
            color: #ffffff;
        }

        .redump-btn.secondary {
            background: linear-gradient(180deg, #30363d 0%, #21262d 100%);
            border-color: #3d444d;
        }

        .redump-btn.danger {
            background: linear-gradient(180deg, #da3633 0%, #b62324 100%);
            border-color: #f85149;
            color: #ffffff;
        }

        .redump-btn.warning {
            background: linear-gradient(180deg, #9e6a03 0%, #845306 100%);
            border-color: #d29922;
            color: #ffffff;
        }

        .redump-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .redump-btn:active:not(:disabled) {
            transform: translateY(0);
        }

        .redump-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Inputs y selects - Estilo oscuro mejorado */
        .filter-select, .search-input {
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid #30363d;
            background: #0d1117;
            color: #c9d1d9;
            font-size: 13px;
            transition: all 0.2s ease;
        }

        .filter-select {
            min-width: 140px;
            background: linear-gradient(180deg, #0d1117 0%, #161b22 100%);
            cursor: pointer;
        }

        .search-input {
            min-width: 180px;
            background: linear-gradient(180deg, #0d1117 0%, #161b22 100%);
        }

        .filter-select:hover, .search-input:hover {
            border-color: #8b949e;
        }

        .filter-select:focus, .search-input:focus {
            outline: none;
            border-color: #58a6ff;
            box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
        }

        /* CORRECCIÓN CRÍTICA: Estilos para options del select */
        .filter-select option {
            background: #0d1117;
            color: #c9d1d9;
            padding: 8px 12px;
            font-size: 13px;
        }

        /* Corrección del hover en options - IMPORTANTE */
        .filter-select option:hover,
        .filter-select option:focus,
        .filter-select option:active,
        .filter-select option:checked {
            background: #1f6feb !important;
            color: #ffffff !important;
        }

        /* Para navegadores basados en WebKit (Chrome, Safari, Edge) */
        .filter-select option:checked {
            background: linear-gradient(180deg, #1f6feb 0%, #0d419d 100%) !important;
            color: #ffffff !important;
        }

        /* Estadísticas */
        #redump-stats {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #8b949e;
            padding: 6px 10px;
            background: rgba(22, 27, 34, 0.9);
            border-radius: 6px;
            border: 1px solid #30363d;
        }

        /* Botón toggle */
        #toggle-bar-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            padding: 4px 8px;
            background: linear-gradient(180deg, #21262d 0%, #161b22 100%);
            color: #c9d1d9;
            border: 1px solid #30363d;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
        }

        #toggle-bar-btn:hover {
            background: #30363d;
            border-color: #8b949e;
        }

        /* Botón de paginación con estado activo/inactivo */
        .pagination-toggle-btn {
            background: linear-gradient(180deg, #21262d 0%, #161b22 100%);
            border-color: #30363d;
        }

        .pagination-toggle-btn.active {
            background: linear-gradient(180deg, #1f6feb 0%, #0d419d 100%);
            border-color: #58a6ff;
            color: #ffffff;
        }

        /* Scrollbar personalizado para selects (opcional) */
        .filter-select::-webkit-scrollbar {
            width: 10px;
        }

        .filter-select::-webkit-scrollbar-track {
            background: #0d1117;
            border-radius: 4px;
        }

        .filter-select::-webkit-scrollbar-thumb {
            background: #30363d;
            border-radius: 4px;
        }

        .filter-select::-webkit-scrollbar-thumb:hover {
            background: #484f58;
        }

        /* Estilo para filas de directorios (sin checkbox) */
        .directory-row td.link {
            padding-left: 10px; /* Compensa la falta de checkbox */
        }
    `);

    // ==================== GESTIÓN DE DATOS ====================
    const dataManager = {
        rows: [],
        cache: new Map(),

        init: function() {
            this.rows = Array.from(document.querySelectorAll('tr')).filter(row => {
                const link = row.querySelector('td.link a');
                return link && !link.textContent.includes('Parent directory');
            });

            storage.loadSelections();
            storage.loadFilters();
            storage.loadPaginationState();

            this.rows.forEach((row, index) => {
                const link = row.querySelector('td.link a');
                const title = link.textContent.trim();
                const url = link.href;

                // Verificar si es un directorio
                const isDirectory = utils.isDirectoryLink(link);

                let region = 'unknown';
                if (!isDirectory) {
                    if (CONFIG.REGIONS.ASIA.some(r => title.includes(r))) region = 'asia';
                    else if (CONFIG.REGIONS.EUROPE.some(r => title.includes(r))) region = 'europe';
                    else if (CONFIG.REGIONS.AMERICA.some(r => title.includes(r))) region = 'america';
                }

                this.cache.set(index, {
                    title,
                    url,
                    region,
                    firstChar: title.charAt(0).toUpperCase(),
                    element: row,
                    isDirectory: isDirectory
                });
            });
        },

        getRowData: function(index) {
            return this.cache.get(index);
        },

        getTotalCount: function() {
            return this.rows.length;
        },

        getVisibleRows: function() {
            return this.rows.filter((row, index) => {
                const data = this.cache.get(index);
                if (!data) return false;

                // Si es directorio, siempre mostrarlo (excepto en búsqueda)
                if (data.isDirectory) {
                    // Si hay término de búsqueda, aplicar filtro a directorios también
                    if (state.filters.searchTerm) {
                        return data.title.toLowerCase().includes(state.filters.searchTerm.toLowerCase());
                    }
                    return true;
                }

                // Para archivos (no directorios), aplicar todos los filtros
                if (state.filters.searchTerm &&
                    !data.title.toLowerCase().includes(state.filters.searchTerm.toLowerCase())) {
                    return false;
                }

                if (state.filters.region !== 'all' && data.region !== state.filters.region) {
                    return false;
                }

                if (state.filters.letter !== 'Filtrar por letra') {
                    if (state.filters.letter === '0-9') {
                        if (isNaN(data.firstChar)) return false;
                    } else if (data.firstChar !== state.filters.letter) {
                        return false;
                    }
                }

                return true;
            });
        }
    };

    // ==================== CORRECCIÓN DE TÍTULOS ====================
    const titleCorrector = {
        correct: function() {
            dataManager.rows.forEach((row, index) => {
                const link = row.querySelector('td.link a');
                if (!link) return;

                // No corregir títulos de directorios
                if (utils.isDirectoryLink(link)) return;

                let title = link.textContent.trim();
                const original = title;

                // Corregir "The" al inicio
                if (title.includes(', The')) {
                    title = 'The ' + title.replace(', The', '');
                }

                // Corregir "A" al inicio
                if (title.includes(', A')) {
                    title = 'A ' + title.replace(', A', '');
                }

                // Corregir "An" al inicio
                if (title.includes(', An')) {
                    title = 'An ' + title.replace(', An', '');
                }

                // Limpiar información técnica
                title = title.replace(/\[.*?\]/g, '')
                             .replace(/\(Disc\s+\d+\)/gi, '')
                             .replace(/\(Disc\s+[A-Z]\)/gi, '')
                             .replace(/\(Rev\s+\d+\)/gi, '')
                             .replace(/\s+/g, ' ')
                             .trim();

                if (title !== original) {
                    link.textContent = title;
                    const data = dataManager.getRowData(index);
                    if (data) {
                        data.title = title;
                        data.firstChar = title.charAt(0).toUpperCase();
                    }
                }
            });
        }
    };

    // ==================== INTERFAZ DE USUARIO ====================
    const UI = {
        createStickyBar: function() {
            const stickyBar = utils.createElement('div', {
                id: 'redump-sticky-bar'
            });

            document.body.style.paddingTop = '60px';
            document.body.appendChild(stickyBar);

            return stickyBar;
        },

        createControlGroup: function() {
            return utils.createElement('div', {
                className: 'control-group'
            });
        },

        createButton: function(text, onClick, variant = 'primary', title = '') {
            const button = utils.createElement('button', {
                className: `redump-btn ${variant}`,
                textContent: text,
                type: 'button',
                title: title
            });

            button.addEventListener('click', (e) => {
                e.preventDefault();
                onClick(e);
            });

            return button;
        },

        createSelect: function(options, onChange, value = '', id = '') {
            const select = utils.createElement('select', {
                className: 'filter-select',
                id: id
            });

            // Añadir un evento para forzar el rediseño en algunos navegadores
            select.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#161b22';
            });

            select.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });

            options.forEach(opt => {
                const option = utils.createElement('option', {
                    value: opt.value,
                    textContent: opt.label
                });
                if (opt.value === value) option.selected = true;
                select.appendChild(option);
            });

            select.addEventListener('change', (e) => {
                onChange(e.target.value);
                storage.saveFilters();
            });

            return select;
        },

        createSearchInput: function() {
            const input = utils.createElement('input', {
                type: 'text',
                className: 'search-input',
                placeholder: 'Buscar juegos...',
                id: 'search-input'
            });

            input.addEventListener('input', utils.debounce((e) => {
                state.filters.searchTerm = e.target.value;
                filterManager.applyFilters();
                storage.saveFilters();
            }, 300));

            return input;
        },

        createStatsDisplay: function() {
            const stats = utils.createElement('div', {
                id: 'redump-stats'
            });

            return stats;
        },

        updateStats: function() {
            const stats = document.getElementById('redump-stats');
            if (!stats) return;

            const visible = dataManager.getVisibleRows().length;
            const total = dataManager.getTotalCount();
            const selected = Array.from(state.selections.values()).filter(Boolean).length;

            stats.textContent = `🎮:${total} 👁️:${visible} ✅:${selected}`;
        },

        createToggleButton: function() {
            return utils.createElement('button', {
                id: 'toggle-bar-btn',
                textContent: '▲',
                title: 'Ocultar/mostrar barra de herramientas'
            });
        }
    };

    // ==================== GESTIÓN DE FILTROS ====================
    const filterManager = {
        applyFilters: function() {
            const visibleRows = dataManager.getVisibleRows();
            state.totalVisible = visibleRows.length;
            state.currentPage = 1;
            state.totalPages = Math.ceil(visibleRows.length / CONFIG.ITEMS_PER_PAGE) || 1;

            dataManager.rows.forEach(row => {
                row.style.display = 'none';
            });

            if (state.paginationEnabled) {
                pagination.showCurrentPage();
                pagination.updateControls();
            } else {
                visibleRows.forEach(row => {
                    row.style.display = '';
                });
            }

            UI.updateStats();
        },

        resetFilters: function() {
            state.filters = {
                letter: 'Filtrar por letra',
                searchTerm: '',
                region: 'all'
            };

            document.getElementById('letter-filter').value = state.filters.letter;
            document.getElementById('region-filter').value = state.filters.region;
            document.getElementById('search-input').value = '';

            storage.saveFilters();
            this.applyFilters();
        }
    };

    // ==================== PAGINACIÓN EN BARRA STICKY ====================
    const pagination = {
        container: null,
        infoDisplay: null,
        prevButton: null,
        nextButton: null,
        firstButton: null,
        lastButton: null,
        paginationButton: null,

        init: function(stickyBar) {
            // Crear contenedor para controles de paginación dentro de la barra
            this.container = utils.createElement('div', {
                id: 'pagination-controls',
                style: 'display: none;'
            });

            // Crear botones
            this.firstButton = this.createButton('«', () => this.goToPage(1));
            this.prevButton = this.createButton('‹', () => this.goToPage(state.currentPage - 1));

            this.infoDisplay = utils.createElement('div', {
                className: 'pagination-info',
                textContent: 'Página 1 de 1'
            });

            this.nextButton = this.createButton('›', () => this.goToPage(state.currentPage + 1));
            this.lastButton = this.createButton('»', () => this.goToPage(state.totalPages));

            // Añadir elementos al contenedor
            this.container.appendChild(this.firstButton);
            this.container.appendChild(this.prevButton);
            this.container.appendChild(this.infoDisplay);
            this.container.appendChild(this.nextButton);
            this.container.appendChild(this.lastButton);

            // Añadir contenedor a la barra sticky
            stickyBar.appendChild(this.container);

            // Inicializar controles
            this.updateControls();
        },

        createButton: function(symbol, onClick) {
            const button = utils.createElement('button', {
                className: 'pagination-btn',
                textContent: symbol,
                type: 'button',
                title: 'Navegar entre páginas'
            });

            button.addEventListener('click', (e) => {
                e.preventDefault();
                onClick();
            });

            return button;
        },

        updateControls: function() {
            if (!state.paginationEnabled || !this.container) {
                if (this.container) {
                    this.container.style.display = 'none';
                }
                return;
            }

            const visibleRows = dataManager.getVisibleRows();
            state.totalPages = Math.ceil(visibleRows.length / CONFIG.ITEMS_PER_PAGE) || 1;

            if (state.currentPage > state.totalPages) {
                state.currentPage = state.totalPages || 1;
            }

            // Actualizar información
            this.infoDisplay.textContent = `Página ${state.currentPage} de ${state.totalPages}`;

            // Actualizar estado de botones
            this.firstButton.disabled = state.currentPage === 1;
            this.prevButton.disabled = state.currentPage === 1;
            this.nextButton.disabled = state.currentPage === state.totalPages || state.totalPages === 0;
            this.lastButton.disabled = state.currentPage === state.totalPages || state.totalPages === 0;

            // Mostrar/ocultar contenedor
            if (state.totalPages <= 1) {
                this.container.style.display = 'none';
            } else {
                this.container.style.display = 'flex';
            }
        },

        goToPage: function(page) {
            if (!state.paginationEnabled) return;

            state.currentPage = Math.max(1, Math.min(page, state.totalPages));
            this.showCurrentPage();
            this.updateControls();
        },

        showCurrentPage: function() {
            if (!state.paginationEnabled) return;

            const visibleRows = dataManager.getVisibleRows();
            const start = (state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
            const end = start + CONFIG.ITEMS_PER_PAGE;

            // Ocultar todas las filas visibles
            visibleRows.forEach(row => {
                row.style.display = 'none';
            });

            // Mostrar solo las de la página actual
            visibleRows.slice(start, end).forEach(row => {
                row.style.display = '';
            });
        },

        togglePagination: function() {
            state.paginationEnabled = !state.paginationEnabled;
            storage.savePaginationState();

            // Actualizar botón
            if (this.paginationButton) {
                if (state.paginationEnabled) {
                    this.paginationButton.textContent = '📄 Paginado';
                    this.paginationButton.className = 'redump-btn warning active';
                } else {
                    this.paginationButton.textContent = '📄 Paginar';
                    this.paginationButton.className = 'redump-btn secondary';
                }
            }

            // Aplicar cambios
            if (state.paginationEnabled) {
                this.updateControls();
                this.showCurrentPage();
            } else {
                this.container.style.display = 'none';
                // Mostrar todas las filas visibles
                dataManager.getVisibleRows().forEach(row => {
                    row.style.display = '';
                });
            }

            filterManager.applyFilters();
        }
    };

    // ==================== GESTIÓN DE SELECCIÓN ====================
    const selectionManager = {
        initCheckboxes: function() {
            dataManager.rows.forEach((row, index) => {
                const link = row.querySelector('td.link a');
                if (!link) return;

                const cell = row.querySelector('td.link');
                if (!cell || cell.querySelector('.game-checkbox')) return;

                const data = dataManager.getRowData(index);

                // EXCLUIR DIRECTORIOS: No añadir checkbox a directorios
                if (data.isDirectory) {
                    // Añadir clase especial para identificar filas de directorio
                    row.classList.add('directory-row');
                    return;
                }

                const checked = state.selections.get(data.url) || false;

                const checkbox = utils.createElement('input', {
                    type: 'checkbox',
                    className: 'game-checkbox',
                    checked: checked
                });

                checkbox.addEventListener('change', (e) => {
                    state.selections.set(data.url, e.target.checked);
                    storage.saveSelections();
                    UI.updateStats();
                });

                cell.insertBefore(checkbox, cell.firstChild);
            });
        },

        selectAllVisible: function() {
            const start = state.paginationEnabled ? (state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE : 0;
            const end = state.paginationEnabled ? start + CONFIG.ITEMS_PER_PAGE : undefined;

            dataManager.getVisibleRows().slice(start, end).forEach(row => {
                const checkbox = row.querySelector('.game-checkbox');
                if (checkbox) {
                    checkbox.checked = true;
                    const index = dataManager.rows.indexOf(row);
                    const data = dataManager.getRowData(index);
                    if (data) {
                        state.selections.set(data.url, true);
                    }
                }
            });

            storage.saveSelections();
            UI.updateStats();
            utils.showNotification('Todos los juegos visibles seleccionados');
        },

        unselectAll: function() {
            state.selections.clear();
            document.querySelectorAll('.game-checkbox').forEach(cb => {
                cb.checked = false;
            });

            storage.saveSelections();
            UI.updateStats();
            utils.showNotification('Selecciones limpiadas');
        },

        copySelectedURLs: async function() {
            const selected = [];

            dataManager.rows.forEach((row, index) => {
                const data = dataManager.getRowData(index);
                // Solo incluir si no es directorio y está seleccionado
                if (data && !data.isDirectory && state.selections.get(data.url)) {
                    selected.push(data.url);
                }
            });

            if (selected.length === 0) {
                utils.showNotification('No hay juegos seleccionados', 'warning');
                return;
            }

            const text = selected.join('\n');
            if (await utils.copyToClipboard(text)) {
                utils.showNotification(`${selected.length} URLs copiadas al portapapeles`);
            }
        }
    };

    // ==================== INICIALIZACIÓN PRINCIPAL ====================
    function init() {
        if (!document.querySelector('form')) {
            return;
        }

        dataManager.init();
        titleCorrector.correct();

        const stickyBar = UI.createStickyBar();

        // Grupo 1: Filtros principales
        const filterGroup = UI.createControlGroup();

        const letterOptions = [
            { value: 'Filtrar por letra', label: '🔤 Todas las letras' },
            { value: '0-9', label: '# Números' },
            ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({
                value: letter,
                label: `📁 ${letter}`
            }))
        ];

        const letterSelect = UI.createSelect(
            letterOptions,
            (value) => {
                state.filters.letter = value;
                filterManager.applyFilters();
            },
            state.filters.letter,
            'letter-filter'
        );

        const regionOptions = [
            { value: 'all', label: '🌍 Todas las regiones' },
            { value: 'asia', label: '🎌 Asia' },
            { value: 'europe', label: '🇪🇺 Europa' },
            { value: 'america', label: '🇺🇸 América' }
        ];

        const regionSelect = UI.createSelect(
            regionOptions,
            (value) => {
                state.filters.region = value;
                filterManager.applyFilters();
            },
            state.filters.region,
            'region-filter'
        );

        const searchInput = UI.createSearchInput();

        filterGroup.appendChild(letterSelect);
        filterGroup.appendChild(regionSelect);
        filterGroup.appendChild(searchInput);

        // Grupo 2: Selección
        const selectionGroup = UI.createControlGroup();

        const selectAllBtn = UI.createButton(
            '✅ Marcar Todo',
            () => selectionManager.selectAllVisible(),
            'primary',
            'Seleccionar todos los juegos visibles (Ctrl+A)'
        );

        const unselectBtn = UI.createButton(
            '❌ Desmarcar Todo',
            () => selectionManager.unselectAll(),
            'danger',
            'Deseleccionar todos los juegos'
        );

        const copyBtn = UI.createButton(
            '📋 Copiar URLs',
            () => selectionManager.copySelectedURLs(),
            'primary',
            'Copiar URLs de juegos seleccionados al portapapeles'
        );

        selectionGroup.appendChild(selectAllBtn);
        selectionGroup.appendChild(unselectBtn);
        selectionGroup.appendChild(copyBtn);

        // Grupo 3: Utilidades
        const utilGroup = UI.createControlGroup();

        const resetBtn = UI.createButton(
            '🔄 Reiniciar filtros',
            () => filterManager.resetFilters(),
            'secondary',
            'Restablecer todos los filtros a sus valores por defecto'
        );

        // BOTÓN DE PAGINACIÓN (reemplaza al checkbox)
        const paginationBtn = UI.createButton(
            state.paginationEnabled ? '📄 Paginado' : '📄 Paginar',
            () => pagination.togglePagination(),
            state.paginationEnabled ? 'warning active' : 'secondary',
            'Activar/desactivar paginación de resultados'
        );
        pagination.paginationButton = paginationBtn;

        utilGroup.appendChild(resetBtn);
        utilGroup.appendChild(paginationBtn);

        // Estadísticas
        const stats = UI.createStatsDisplay();

        // Ensamblar barra sticky
        stickyBar.appendChild(filterGroup);
        stickyBar.appendChild(selectionGroup);
        stickyBar.appendChild(utilGroup);
        stickyBar.appendChild(stats);

        // Inicializar paginación dentro de la barra sticky
        pagination.init(stickyBar);

        // Inicializar checkboxes (excluyendo directorios)
        selectionManager.initCheckboxes();
        filterManager.applyFilters();

        // Botón para mostrar/ocultar barra
        const toggleBarBtn = UI.createToggleButton();

        toggleBarBtn.addEventListener('click', () => {
            stickyBar.classList.toggle('hidden');
            toggleBarBtn.textContent = stickyBar.classList.contains('hidden') ? '▼' : '▲';
        });

        document.body.appendChild(toggleBarBtn);

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                selectionManager.selectAllVisible();
            }

            // Ctrl/Cmd + P para alternar paginación
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                pagination.togglePagination();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();