// ==UserScript==
// @name         Drawaria.online Overlay Helper
// @namespace    https://drawaria.online/
// @version      1.0
// @description  Overlay Perplexity de ayuda en tiempo real para drawaria.online con cronómetro, herramientas de dibujo y notas
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543121/Drawariaonline%20Overlay%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/543121/Drawariaonline%20Overlay%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuración del overlay
    const CONFIG = {
        colors: {
            // Colores estándar
            standard: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'],
            // Colores neón
            neon: ['#39ff14', '#fcee09', '#ff073a', '#08f7fe', '#a020f0', '#ff5df6'],
            // Colores pastel
            pastel: ['#ffd6e0', '#bae1ff', '#e0ffed', '#fff5ba']
        },
        defaultPosition: { x: window.innerWidth - 320, y: 50 },
        defaultOpacity: 0.9,
        accentColor: '#39ff14'
    };

    // Variables globales
    let overlay = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let gameTimer = null;
    let brushHistory = [];
    let currentBrush = { color: '#000000', size: 5 };

    // Funciones de almacenamiento
    const Storage = {
        get: (key, defaultValue = null) => {
            try {
                const value = localStorage.getItem(`drawaria_overlay_${key}`);
                return value ? JSON.parse(value) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(`drawaria_overlay_${key}`, JSON.stringify(value));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
        }
    };

    // Funciones de utilidad
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Crear estilos CSS
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos del overlay */
            .drawaria-overlay {
                position: fixed;
                top: 50px;
                right: 20px;
                width: 300px;
                background: rgba(20, 20, 30, 0.95);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: white;
                user-select: none;
                transition: opacity 0.3s ease;
            }

            .drawaria-overlay.hidden {
                display: none;
            }

            .drawaria-overlay-header {
                padding: 12px 16px;
                background: rgba(57, 255, 20, 0.1);
                border-radius: 12px 12px 0 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .drawaria-overlay-title {
                font-size: 14px;
                font-weight: 600;
                margin: 0;
            }

            .drawaria-close-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            }

            .drawaria-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .drawaria-overlay-content {
                padding: 16px;
                max-height: 600px;
                overflow-y: auto;
            }

            .drawaria-section {
                margin-bottom: 20px;
            }

            .drawaria-section-title {
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #39ff14;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Timer */
            .drawaria-timer {
                background: linear-gradient(45deg, #39ff14, #08f7fe);
                color: black;
                padding: 12px;
                border-radius: 8px;
                text-align: center;
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 20px;
                box-shadow: 0 4px 16px rgba(57, 255, 20, 0.3);
            }

            .drawaria-timer.warning {
                background: linear-gradient(45deg, #ff073a, #fcee09);
                animation: pulse 1s infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            /* Color palette */
            .drawaria-color-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 6px;
                margin-bottom: 12px;
            }

            .drawaria-color-btn {
                width: 32px;
                height: 32px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            }

            .drawaria-color-btn:hover {
                transform: scale(1.1);
                border-color: #39ff14;
            }

            .drawaria-color-btn.active {
                border-color: #39ff14;
                box-shadow: 0 0 12px rgba(57, 255, 20, 0.5);
            }

            .drawaria-color-btn.active::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 12px;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }

            /* Brush tools */
            .drawaria-brush-tools {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }

            .drawaria-tool-btn {
                flex: 1;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }

            .drawaria-tool-btn:hover {
                background: rgba(57, 255, 20, 0.2);
                border-color: #39ff14;
            }

            .drawaria-tool-btn.active {
                background: rgba(57, 255, 20, 0.3);
                border-color: #39ff14;
            }

            /* Brush size slider */
            .drawaria-slider-container {
                margin-bottom: 12px;
            }

            .drawaria-slider {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                outline: none;
                -webkit-appearance: none;
            }

            .drawaria-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background: #39ff14;
                border-radius: 50%;
                cursor: pointer;
            }

            .drawaria-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: #39ff14;
                border-radius: 50%;
                cursor: pointer;
                border: none;
            }

            /* Brush history */
            .drawaria-brush-history {
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
            }

            .drawaria-history-item {
                width: 24px;
                height: 24px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            }

            .drawaria-history-item:hover {
                transform: scale(1.1);
                border-color: #39ff14;
            }

            /* Notes */
            .drawaria-notes {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 12px;
            }

            .drawaria-note-input {
                width: 100%;
                background: transparent;
                border: none;
                color: white;
                font-size: 12px;
                resize: vertical;
                min-height: 60px;
                outline: none;
                font-family: inherit;
            }

            .drawaria-note-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .drawaria-notes-list {
                max-height: 120px;
                overflow-y: auto;
            }

            .drawaria-note-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                padding: 8px;
                margin-bottom: 6px;
                font-size: 11px;
                position: relative;
            }

            .drawaria-note-delete {
                position: absolute;
                top: 4px;
                right: 6px;
                background: none;
                border: none;
                color: #ff073a;
                cursor: pointer;
                font-size: 12px;
                opacity: 0.7;
            }

            .drawaria-note-delete:hover {
                opacity: 1;
            }

            /* Toggle button */
            .drawaria-toggle-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(45deg, #39ff14, #08f7fe);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                z-index: 10001;
                box-shadow: 0 4px 16px rgba(57, 255, 20, 0.3);
                transition: all 0.3s ease;
                font-size: 20px;
                color: black;
            }

            .drawaria-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(57, 255, 20, 0.5);
            }

            /* Opacity controls */
            .drawaria-opacity-controls {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }

            .drawaria-opacity-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                min-width: 60px;
            }

            /* Scrollbar styling */
            .drawaria-overlay-content::-webkit-scrollbar,
            .drawaria-notes-list::-webkit-scrollbar {
                width: 6px;
            }

            .drawaria-overlay-content::-webkit-scrollbar-track,
            .drawaria-notes-list::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
            }

            .drawaria-overlay-content::-webkit-scrollbar-thumb,
            .drawaria-notes-list::-webkit-scrollbar-thumb {
                background: rgba(57, 255, 20, 0.5);
                border-radius: 3px;
            }

            .drawaria-overlay-content::-webkit-scrollbar-thumb:hover,
            .drawaria-notes-list::-webkit-scrollbar-thumb:hover {
                background: rgba(57, 255, 20, 0.7);
            }
        `;
        document.head.appendChild(style);
    }

    // Detectar el cronómetro del juego
    function detectGameTimer() {
        // Selectores comunes para cronómetros en drawaria.online
        const timerSelectors = [
            '.timer',
            '.time',
            '.countdown',
            '.game-timer',
            '[class*="timer"]',
            '[class*="time"]',
            '[id*="timer"]',
            '[id*="time"]'
        ];

        for (const selector of timerSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.match(/\d+:\d+|\d+/)) {
                return element;
            }
        }
        return null;
    }

    // Actualizar el cronómetro del overlay
    function updateTimer() {
        const timerElement = overlay.querySelector('.drawaria-timer');
        if (!timerElement) return;

        const gameTimerElement = detectGameTimer();
        if (gameTimerElement) {
            const timeText = gameTimerElement.textContent.trim();
            const timeMatch = timeText.match(/(\d+):(\d+)|(\d+)/);

            if (timeMatch) {
                let seconds = 0;
                if (timeMatch[1] && timeMatch[2]) {
                    // Formato MM:SS
                    seconds = parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
                } else if (timeMatch[3]) {
                    // Formato solo segundos
                    seconds = parseInt(timeMatch[3]);
                }

                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                const displayTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

                timerElement.textContent = displayTime;
                timerElement.className = `drawaria-timer ${seconds < 30 ? 'warning' : ''}`;
            }
        } else {
            timerElement.textContent = '00:00';
            timerElement.className = 'drawaria-timer';
        }
    }

    // Crear selector de colores
    function createColorPalette() {
        const allColors = [...CONFIG.colors.standard, ...CONFIG.colors.neon, ...CONFIG.colors.pastel];
        const colorGrids = [];

        // Crear grupos de colores
        const colorGroups = [
            { title: 'Estándar', colors: CONFIG.colors.standard },
            { title: 'Neón', colors: CONFIG.colors.neon },
            { title: 'Pastel', colors: CONFIG.colors.pastel }
        ];

        colorGroups.forEach(group => {
            const groupHtml = `
                <div class="drawaria-color-group">
                    <div class="drawaria-color-group-title">${group.title}</div>
                    <div class="drawaria-color-grid">
                        ${group.colors.map(color => `
                            <div class="drawaria-color-btn"
                                 style="background-color: ${color}"
                                 data-color="${color}"
                                 title="${color}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            colorGrids.push(groupHtml);
        });

        return colorGrids.join('');
    }

    // Crear historial de pinceles
    function createBrushHistory() {
        const history = brushHistory.slice(-10); // Últimos 10 pinceles
        return history.map(brush => `
            <div class="drawaria-history-item"
                 style="background-color: ${brush.color}; border-width: ${Math.max(1, brush.size / 2)}px"
                 data-color="${brush.color}"
                 data-size="${brush.size}"
                 title="Color: ${brush.color}, Tamaño: ${brush.size}">
            </div>
        `).join('');
    }

    // Crear lista de notas
    function createNotesList() {
        const notes = Storage.get('notes', []);
        return notes.map((note, index) => `
            <div class="drawaria-note-item">
                <button class="drawaria-note-delete" data-index="${index}">×</button>
                ${note.text}
                <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 4px;">
                    ${new Date(note.timestamp).toLocaleTimeString()}
                </div>
            </div>
        `).join('');
    }

    // Crear el overlay principal
    function createOverlay() {
        const position = Storage.get('position', CONFIG.defaultPosition);
        const opacity = Storage.get('opacity', CONFIG.defaultOpacity);

        const overlayHtml = `
            <div class="drawaria-overlay" style="left: ${position.x}px; top: ${position.y}px; opacity: ${opacity}">
                <div class="drawaria-overlay-header">
                    <h3 class="drawaria-overlay-title">🎨 Overlay Helper</h3>
                    <button class="drawaria-close-btn">×</button>
                </div>
                <div class="drawaria-overlay-content">
                    <!-- Timer -->
                    <div class="drawaria-section">
                        <div class="drawaria-section-title">⏰ Cronómetro</div>
                        <div class="drawaria-timer">00:00</div>
                    </div>

                    <!-- Opacity Control -->
                    <div class="drawaria-section">
                        <div class="drawaria-section-title">👁️ Transparencia</div>
                        <div class="drawaria-opacity-controls">
                            <span class="drawaria-opacity-label">Opacidad:</span>
                            <input type="range" class="drawaria-slider drawaria-opacity-slider"
                                   min="0.3" max="1" step="0.1" value="${opacity}">
                            <span class="drawaria-opacity-value">${Math.round(opacity * 100)}%</span>
                        </div>
                    </div>

                    <!-- Color Palette -->
                    <div class="drawaria-section">
                        <div class="drawaria-section-title">🎨 Paleta de Colores</div>
                        ${createColorPalette()}
                    </div>

                    <!-- Brush Tools -->
                    <div class="drawaria-section">
                        <div class="drawaria-section-title">🖌️ Herramientas</div>
                        <div class="drawaria-brush-tools">
                            <button class="drawaria-tool-btn" data-tool="normal">Normal</button>
                            <button class="drawaria-tool-btn" data-tool="symmetric">Simétrico</button>
                            <button class="drawaria-tool-btn" data-tool="eraser">Borrador</button>
                        </div>
                        <div class="drawaria-slider-container">
                            <label class="drawaria-opacity-label">Tamaño: <span id="brush-size-value">5</span>px</label>
                            <input type="range" class="drawaria-slider" id="brush-size-slider"
                                   min="1" max="50" value="5">
                        </div>
                    </div>

                    <!-- Brush History -->
                    <div class="drawaria-section">
                        <div class="drawaria-section-title">📝 Historial de Pinceles</div>
                        <div class="drawaria-brush-history">
                            ${createBrushHistory()}
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="drawaria-section">
                        <div class="drawaria-section-title">📋 Notas Rápidas</div>
                        <div class="drawaria-notes">
                            <textarea class="drawaria-note-input"
                                      placeholder="Escribe una nota rápida aquí..."></textarea>
                            <button class="drawaria-tool-btn" id="add-note-btn">Agregar Nota</button>
                        </div>
                        <div class="drawaria-notes-list">
                            ${createNotesList()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', overlayHtml);
        overlay = document.querySelector('.drawaria-overlay');

        // Configurar eventos
        setupOverlayEvents();

        // Iniciar cronómetro
        gameTimer = setInterval(updateTimer, 1000);
        updateTimer();
    }

    // Crear botón toggle
    function createToggleButton() {
        const isVisible = Storage.get('overlayVisible', true);
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'drawaria-toggle-btn';
        toggleBtn.innerHTML = isVisible ? '🎨' : '👁️';
        toggleBtn.title = isVisible ? 'Ocultar overlay' : 'Mostrar overlay';

        toggleBtn.addEventListener('click', () => {
            const overlay = document.querySelector('.drawaria-overlay');
            if (overlay) {
                const isCurrentlyVisible = !overlay.classList.contains('hidden');
                overlay.classList.toggle('hidden');
                toggleBtn.innerHTML = isCurrentlyVisible ? '👁️' : '🎨';
                toggleBtn.title = isCurrentlyVisible ? 'Mostrar overlay' : 'Ocultar overlay';
                Storage.set('overlayVisible', !isCurrentlyVisible);
            }
        });

        document.body.appendChild(toggleBtn);

        // Ocultar overlay si estaba oculto
        if (!isVisible && overlay) {
            overlay.classList.add('hidden');
        }
    }

    // Configurar eventos del overlay
    function setupOverlayEvents() {
        const header = overlay.querySelector('.drawaria-overlay-header');
        const closeBtn = overlay.querySelector('.drawaria-close-btn');
        const opacitySlider = overlay.querySelector('.drawaria-opacity-slider');
        const opacityValue = overlay.querySelector('.drawaria-opacity-value');
        const colorBtns = overlay.querySelectorAll('.drawaria-color-btn');
        const toolBtns = overlay.querySelectorAll('.drawaria-tool-btn');
        const brushSizeSlider = overlay.querySelector('#brush-size-slider');
        const brushSizeValue = overlay.querySelector('#brush-size-value');
        const historyItems = overlay.querySelectorAll('.drawaria-history-item');
        const noteInput = overlay.querySelector('.drawaria-note-input');
        const addNoteBtn = overlay.querySelector('#add-note-btn');
        const noteDeleteBtns = overlay.querySelectorAll('.drawaria-note-delete');

        // Drag functionality
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffset.x = e.clientX - overlay.offsetLeft;
            dragOffset.y = e.clientY - overlay.offsetTop;
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
        });

        function handleDrag(e) {
            if (!isDragging) return;
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            overlay.style.left = `${Math.max(0, Math.min(window.innerWidth - overlay.offsetWidth, x))}px`;
            overlay.style.top = `${Math.max(0, Math.min(window.innerHeight - overlay.offsetHeight, y))}px`;
        }

        function handleDragEnd() {
            if (isDragging) {
                isDragging = false;
                Storage.set('position', {
                    x: parseInt(overlay.style.left),
                    y: parseInt(overlay.style.top)
                });
                document.removeEventListener('mousemove', handleDrag);
                document.removeEventListener('mouseup', handleDragEnd);
            }
        }

        // Close button
        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            Storage.set('overlayVisible', false);
            const toggleBtn = document.querySelector('.drawaria-toggle-btn');
            if (toggleBtn) {
                toggleBtn.innerHTML = '👁️';
                toggleBtn.title = 'Mostrar overlay';
            }
        });

        // Opacity slider
        opacitySlider.addEventListener('input', (e) => {
            const opacity = parseFloat(e.target.value);
            overlay.style.opacity = opacity;
            opacityValue.textContent = `${Math.round(opacity * 100)}%`;
            Storage.set('opacity', opacity);
        });

        // Color selection
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentBrush.color = btn.dataset.color;
                addToBrushHistory(currentBrush);

                // Aplicar color al juego si es posible
                applyColorToGame(currentBrush.color);
            });
        });

        // Tool selection
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyToolToGame(btn.dataset.tool);
            });
        });

        // Brush size
        brushSizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            brushSizeValue.textContent = size;
            currentBrush.size = size;
            applyBrushSizeToGame(size);
        });

        // History items
        historyItems.forEach(item => {
            item.addEventListener('click', () => {
                const color = item.dataset.color;
                const size = parseInt(item.dataset.size);

                // Actualizar UI
                colorBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.color === color);
                });
                brushSizeSlider.value = size;
                brushSizeValue.textContent = size;

                // Aplicar al juego
                currentBrush = { color, size };
                applyColorToGame(color);
                applyBrushSizeToGame(size);
            });
        });

        // Notes functionality
        addNoteBtn.addEventListener('click', () => {
            const text = noteInput.value.trim();
            if (text) {
                addNote(text);
                noteInput.value = '';
            }
        });

        noteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                addNoteBtn.click();
            }
        });

        // Note deletion
        noteDeleteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                deleteNote(index);
            });
        });
    }

    // Funciones para interactuar con el juego
    function applyColorToGame(color) {
        // Buscar el selector de color en el juego
        const colorSelectors = [
            `[style*="background-color: ${color}"]`,
            `[data-color="${color}"]`,
            '.color-picker',
            '.color-selector'
        ];

        for (const selector of colorSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
                break;
            }
        }
    }

    function applyBrushSizeToGame(size) {
        // Buscar el control de tamaño de pincel
        const sizeSelectors = [
            'input[type="range"]',
            '.brush-size',
            '.size-slider'
        ];

        for (const selector of sizeSelectors) {
            const element = document.querySelector(selector);
            if (element && element.type === 'range') {
                element.value = size;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                break;
            }
        }
    }

    function applyToolToGame(tool) {
        // Lógica para aplicar herramientas específicas
        const toolSelectors = {
            normal: '.brush-tool, .pen-tool',
            symmetric: '.symmetry-tool',
            eraser: '.eraser-tool'
        };

        const selector = toolSelectors[tool];
        if (selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
            }
        }
    }

    // Gestión del historial de pinceles
    function addToBrushHistory(brush) {
        const existingIndex = brushHistory.findIndex(b => b.color === brush.color && b.size === brush.size);
        if (existingIndex >= 0) {
            brushHistory.splice(existingIndex, 1);
        }
        brushHistory.push({ ...brush, timestamp: Date.now() });

        // Mantener solo los últimos 20 pinceles
        if (brushHistory.length > 20) {
            brushHistory.shift();
        }

        Storage.set('brushHistory', brushHistory);
        updateBrushHistoryDisplay();
    }

    function updateBrushHistoryDisplay() {
        const historyContainer = overlay.querySelector('.drawaria-brush-history');
        if (historyContainer) {
            historyContainer.innerHTML = createBrushHistory();

            // Reconfigurar eventos para los nuevos elementos
            historyContainer.querySelectorAll('.drawaria-history-item').forEach(item => {
                item.addEventListener('click', () => {
                    const color = item.dataset.color;
                    const size = parseInt(item.dataset.size);

                    // Actualizar UI
                    const colorBtns = overlay.querySelectorAll('.drawaria-color-btn');
                    colorBtns.forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.color === color);
                    });

                    const brushSizeSlider = overlay.querySelector('#brush-size-slider');
                    const brushSizeValue = overlay.querySelector('#brush-size-value');
                    brushSizeSlider.value = size;
                    brushSizeValue.textContent = size;

                    // Aplicar al juego
                    currentBrush = { color, size };
                    applyColorToGame(color);
                    applyBrushSizeToGame(size);
                });
            });
        }
    }

    // Gestión de notas
    function addNote(text) {
        const notes = Storage.get('notes', []);
        notes.push({
            text: text,
            timestamp: Date.now()
        });
        Storage.set('notes', notes);
        updateNotesDisplay();
    }

    function deleteNote(index) {
        const notes = Storage.get('notes', []);
        notes.splice(index, 1);
        Storage.set('notes', notes);
        updateNotesDisplay();
    }

    function updateNotesDisplay() {
        const notesContainer = overlay.querySelector('.drawaria-notes-list');
        if (notesContainer) {
            notesContainer.innerHTML = createNotesList();

            // Reconfigurar eventos para los botones de eliminar
            notesContainer.querySelectorAll('.drawaria-note-delete').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    deleteNote(index);
                });
            });
        }
    }

    // Detección de juego activo
    function isGameActive() {
        // Buscar indicadores de que el juego está activo
        const gameIndicators = [
            '.game-active',
            '.drawing-canvas',
            '.canvas',
            'canvas'
        ];

        return gameIndicators.some(selector => document.querySelector(selector));
    }

    // Inicialización
    function init() {
        // Cargar datos guardados
        brushHistory = Storage.get('brushHistory', []);

        // Crear estilos
        createStyles();

        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initOverlay, 1000);
            });
        } else {
            setTimeout(initOverlay, 1000);
        }
    }

    function initOverlay() {
        // Crear overlay y botón toggle
        createOverlay();
        createToggleButton();

        // Configurar observador para cambios en el juego
        const observer = new MutationObserver(debounce(() => {
            if (isGameActive()) {
                updateTimer();
            }
        }, 500));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('🎨 Drawaria Overlay Helper cargado correctamente!');
    }

    // Limpieza al salir
    window.addEventListener('beforeunload', () => {
        if (gameTimer) {
            clearInterval(gameTimer);
        }
    });

    // Iniciar el script
    init();

})();

