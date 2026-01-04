// ==UserScript==
// @name         Drawaria Advanced Control Panel - Multi-Panel
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Panel de control avanzado con auto-kick, auto-prohibit, spam tools y un panel de actividad separado para Drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/546453/Drawaria%20Advanced%20Control%20Panel%20-%20Multi-Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/546453/Drawaria%20Advanced%20Control%20Panel%20-%20Multi-Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global definitions
    const GLITCH_TEXT_STRINGS = {
        "welcome_glitch": "꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅",
        "chaos_text": "ॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐॐ",
        "symbols": "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓"
    };

    class DrawariaAdvancedPanel {
        constructor() {
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            this.createStyles();
            this.initializeVariables(); // Initialize variables before creating panels
            this.createMainPanel();
            this.createActivityPanel();
            this.createBroadcastPanel(); // New: Create Broadcast Panel
            this.setupEventListeners();
            this.initializeBotConnection();
            console.log('🎯 Drawaria Advanced Control Panel loaded!');
        }

        createStyles() {
            const styles = `
                /* Base Panel Styles (shared) */
                .drawaria-panel {
                    position: fixed;
                    width: 350px;
                    min-height: 50px;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
                    z-index: 999999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: white;
                    user-select: none;
                    cursor: grab; /* Changed to grab for clarity */
                    transition: all 0.3s ease;
                    border: 2px solid rgba(255,255,255,0.2);
                    box-sizing: border-box; /* Include padding/border in element's total width/height */
                }

                .drawaria-panel:hover {
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    transform: translateY(-2px);
                }

                .drawaria-panel.minimized {
                    height: 50px;
                    overflow: hidden;
                    min-height: auto; /* Allow minimization to override min-height */
                }

                .panel-header {
                    background: rgba(0,0,0,0.3);
                    padding: 15px;
                    border-radius: 13px 13px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: bold;
                    font-size: 16px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                    backdrop-filter: blur(10px);
                    cursor: grab;
                }
                 .panel-header:active {
                    cursor: grabbing;
                }

                .panel-content {
                    padding: 20px;
                    max-height: 600px;
                    overflow-y: auto;
                }

                .panel-content::-webkit-scrollbar {
                    width: 8px;
                }

                .panel-content::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }

                .panel-content::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.3);
                    border-radius: 4px;
                }

                .panel-content::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.5);
                }

                .control-section {
                    margin-bottom: 20px;
                    padding: 15px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 10px;
                    border-left: 4px solid #fff;
                    backdrop-filter: blur(5px);
                }

                .control-section h3 {
                    margin: 0 0 15px 0;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .control-btn {
                    width: 100%;
                    padding: 12px 15px;
                    margin: 8px 0;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .control-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .control-btn.active {
                    background: linear-gradient(45deg, #4CAF50, #45a049);
                    box-shadow: 0 4px 15px rgba(76,175,80,0.4);
                    animation: pulse 2s infinite;
                }

                .control-btn.danger.active {
                    background: linear-gradient(45deg, #f44336, #d32f2f);
                    box-shadow: 0 4px 15px rgba(244,67,54,0.4);
                }

                .control-btn.warning.active {
                    background: linear-gradient(45deg, #FF9800, #f57c00);
                    box-shadow: 0 4px 15px rgba(255,152,0,0.4);
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                .status-display {
                    background: rgba(0,0,0,0.4);
                    border-radius: 8px;
                    padding: 12px;
                    margin-top: 15px;
                    font-size: 11px;
                    max-height: 120px;
                    overflow-y: auto;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .status-line {
                    margin: 3px 0;
                    opacity: 0.9;
                    padding: 2px 0;
                }

                .status-success { color: #4CAF50; }
                .status-warning { color: #FF9800; }
                .status-error { color: #f44336; }
                .status-info { color: #2196F3; }

                .minimize-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }

                .minimize-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: rotate(180deg);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-top: 10px;
                }

                .stat-box {
                    background: rgba(0,0,0,0.3);
                    padding: 8px;
                    border-radius: 6px;
                    text-align: center;
                    font-size: 11px;
                }

                .stat-number {
                    font-size: 18px;
                    font-weight: bold;
                    display: block;
                    margin-bottom: 2px;
                }

                .emergency-stop {
                    background: linear-gradient(45deg, #ff1744, #d50000) !important;
                    animation: blink 1s infinite;
                }

                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.7; }
                }

                /* Activity Panel Specific Styles */
                #drawaria-activity-panel {
                    top: 20px;
                    right: 400px; /* Position next to main panel */
                    background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%); /* Deep Blue to Red */
                    min-height: 250px; /* Adjust as needed for content */
                }

                #drawaria-broadcast-panel {
                    top: 300px; /* Position below activity panel */
                    right: 400px; /* Align with activity panel */
                    background: linear-gradient(135deg, #fc00ff 0%, #00dbde 100%); /* Pink to Cyan */
                    min-height: 180px; /* Adjust as needed */
                }

                .activity-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                #activity-input {
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    font-size: 13px;
                    outline: none;
                }

                #activity-input::placeholder {
                    color: rgba(255,255,255,0.6);
                }

                #activity-input:focus {
                    background: rgba(255,255,255,0.3);
                    box-shadow: 0 0 10px rgba(255,255,255,0.2);
                }

                .activity-display {
                    background: rgba(0,0,0,0.4);
                    border-radius: 8px;
                    padding: 12px;
                    margin-top: 10px;
                    border-left: 4px solid #4CAF50;
                }

                .activity-status {
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #4CAF50;
                }

                .activity-duration {
                    font-size: 11px;
                    opacity: 0.8;
                }

                .broadcast-settings {
                    margin-top: 10px;
                    font-size: 11px;
                }

                .broadcast-settings label {
                    display: block; /* Ensures label takes full width */
                    margin-top: 5px; /* Spacing for the select */
                }

                .broadcast-settings select {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px;
                    margin-left: 5px; /* Adjust spacing as needed */
                    width: calc(100% - 70px); /* Adjust width to fit */
                }
                 .broadcast-settings select option {
                    background-color: #333; /* Darker background for options */
                    color: white;
                }

                .activity-display.active {
                    border-left-color: #2196F3;
                    animation: pulse-activity 3s infinite;
                }

                @keyframes pulse-activity {
                    0%, 100% { border-left-color: #2196F3; }
                    50% { border-left-color: #4CAF50; }
                }
            `;

            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        initializeVariables() {
            this.isMainMinimized = false;
            this.isActivityMinimized = false;
            this.isBroadcastMinimized = false;
            this.activeBotInstance = null;
            this.intervals = {};

            // Statistics
            this.stats = {
                playersProcessed: 0,
                commandsSent: 0,
                roomsVisited: 0,
                startTime: Date.now()
            };

            // Activity Status
            this.activityStatus = {
                current: '',
                startTime: null,
                isActive: false,
                broadcastIntervalId: null, // Renamed to avoid conflict with `intervals` object keys
                autoBroadcast: false
            };

            // Automation states
            this.automation = {
                autoRoomSwitch: false,
                autoKick: false,
                autoProhibit: false,
                spamTodo: false,
                spamGlitch: false
            };

            this.currentRoom = null;
            this.lastRoomChange = 0;
        }

        // Generic Drag Functionality
        setupPanelDrag(panelElement, headerElement, minimizeButtonId) {
            let isDragging = false;
            let currentX, currentY, initialX, initialY;
            let xOffset = 0, yOffset = 0;

            const updatePosition = (x, y) => {
                panelElement.style.transform = `translate(${x}px, ${y}px)`;
                panelElement.setAttribute('data-x', x);
                panelElement.setAttribute('data-y', y);
            };

            // Read initial position from data attributes if available (from previous drag)
            const storedX = parseFloat(panelElement.getAttribute('data-x') || 0);
            const storedY = parseFloat(panelElement.getAttribute('data-y') || 0);
            updatePosition(storedX, storedY); // Apply initial or stored position

            headerElement.addEventListener('mousedown', (e) => {
                // Prevent drag if clicking on minimize button
                if (minimizeButtonId && e.target.id === minimizeButtonId) {
                    return;
                }

                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                panelElement.style.cursor = 'grabbing';
                headerElement.style.cursor = 'grabbing'; // Also update header cursor

                // Get current transform values if panel has been dragged before
                const transform = window.getComputedStyle(panelElement).transform;
                if (transform && transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    xOffset = matrix.m41;
                    yOffset = matrix.m42;
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    // Keep within viewport (simplified)
                    const rect = panelElement.getBoundingClientRect();
                    currentX = Math.max(-rect.left, Math.min(window.innerWidth - rect.right, currentX));
                    currentY = Math.max(-rect.top, Math.min(window.innerHeight - rect.bottom, currentY));


                    xOffset = currentX;
                    yOffset = currentY;

                    updatePosition(xOffset, yOffset);
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                panelElement.style.cursor = 'grab';
                headerElement.style.cursor = 'grab'; // Reset header cursor
            });
        }


        createMainPanel() {
            this.mainPanel = document.createElement('div');
            this.mainPanel.id = 'drawaria-advanced-panel';
            this.mainPanel.classList.add('drawaria-panel'); // Add common panel class
            this.mainPanel.style.top = '20px';
            this.mainPanel.style.right = '20px';
            this.mainPanel.innerHTML = `
                <div class="panel-header" id="main-panel-header">
                    <span>🎯 Drawaria Advanced Panel</span>
                    <button class="minimize-btn" id="minimize-main-btn">−</button>
                </div>
                <div class="panel-content">
                    <!-- Bot Automation Section -->
                    <div class="control-section">
                        <h3>🤖 Automatización de Bot</h3>
                        <button class="control-btn" id="auto-room-switch">
                            🔄 Auto Cambiar Sala
                        </button>
                        <button class="control-btn danger" id="auto-kick">
                            ⚡ Auto Kick Jugadores
                        </button>
                        <button class="control-btn danger" id="auto-prohibit">
                            🚫 Auto Prohibir Dibujo
                        </button>
                    </div>

                    <!-- Spam Tools Section -->
                    <div class="control-section">
                        <h3>📢 Herramientas de Spam</h3>
                        <button class="control-btn warning" id="spam-todo">
                            📋 Spam TODO (Reportes/Reglas/AFK)
                        </button>
                        <button class="control-btn warning" id="spam-glitch">
                            ✨ Spam Texto Glitch
                        </button>
                    </div>

                    <!-- Statistics Section -->
                    <div class="control-section">
                        <h3>📊 Estadísticas</h3>
                        <div class="stats-grid">
                            <div class="stat-box">
                                <span class="stat-number" id="players-processed">0</span>
                                <span>Jugadores</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-number" id="commands-sent">0</span>
                                <span>Comandos</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-number" id="rooms-visited">0</span>
                                <span>Salas</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-number" id="uptime">0s</span>
                                <span>Uptime</span>
                            </div>
                        </div>
                    </div>

                    <!-- Status Section -->
                    <div class="control-section">
                        <h3>📡 Estado del Sistema</h3>
                        <div class="status-display" id="status-display">
                            <div class="status-line status-info">Sistema iniciado correctamente</div>
                        </div>
                    </div>

                    <!-- Emergency Section -->
                    <div class="control-section">
                        <h3>🆘 Emergencia</h3>
                        <button class="control-btn emergency-stop" id="emergency-stop">
                            🛑 PARAR TODO
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(this.mainPanel);
            this.setupPanelDrag(this.mainPanel, this.mainPanel.querySelector('.panel-header'), 'minimize-main-btn');
        }

        createActivityPanel() {
            this.activityPanel = document.createElement('div');
            this.activityPanel.id = 'drawaria-activity-panel';
            this.activityPanel.classList.add('drawaria-panel'); // Add common panel class
            // Position handled by CSS for initial load, but can be set here too
            this.activityPanel.innerHTML = `
                <div class="panel-header" id="activity-panel-header">
                    <span>📺 Estado de Actividad</span>
                    <button class="minimize-btn" id="minimize-activity-btn">−</button>
                </div>
                <div class="panel-content">
                    <div class="activity-controls">
                        <input type="text" id="activity-input" placeholder="¿Qué estás haciendo? (ej: Jugando Drawaria)" maxlength="100">
                        <button class="control-btn" id="set-activity">
                            📢 Establecer Estado
                        </button>
                        <button class="control-btn" id="clear-activity">
                            🚫 Limpiar Estado
                        </button>
                    </div>
                    <div class="activity-display" id="activity-display">
                        <div class="activity-status" id="activity-status">
                            Estado: Inactivo
                        </div>
                        <div class="activity-duration" id="activity-duration">
                            Duración: 0m 0s
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(this.activityPanel);
            this.setupPanelDrag(this.activityPanel, this.activityPanel.querySelector('.panel-header'), 'minimize-activity-btn');
        }

        createBroadcastPanel() {
            this.broadcastPanel = document.createElement('div');
            this.broadcastPanel.id = 'drawaria-broadcast-panel';
            this.broadcastPanel.classList.add('drawaria-panel'); // Add common panel class
            this.broadcastPanel.innerHTML = `
                <div class="panel-header" id="broadcast-panel-header">
                    <span>🌐 Transmisión de Estado</span>
                    <button class="minimize-btn" id="minimize-broadcast-btn">−</button>
                </div>
                <div class="panel-content">
                    <button class="control-btn" id="broadcast-activity">
                        📡 Mostrar en Chat
                    </button>
                    <button class="control-btn" id="auto-broadcast">
                        🔄 Auto-Transmitir
                    </button>
                    <div class="broadcast-settings">
                        <label>Intervalo:
                            <select id="broadcast-interval">
                                <option value="30000">30 segundos</option>
                                <option value="60000" selected>1 minuto</option>
                                <option value="300000">5 minutos</option>
                            </select>
                        </label>
                    </div>
                </div>
            `;
            document.body.appendChild(this.broadcastPanel);
            this.setupPanelDrag(this.broadcastPanel, this.broadcastPanel.querySelector('.panel-header'), 'minimize-broadcast-btn');
        }


        setupEventListeners() {
            // Main Panel Minimize button
            document.getElementById('minimize-main-btn').addEventListener('click', () => {
                this.toggleMinimize(this.mainPanel, 'isMainMinimized');
            });

            // Activity Panel Minimize button
            document.getElementById('minimize-activity-btn').addEventListener('click', () => {
                this.toggleMinimize(this.activityPanel, 'isActivityMinimized');
            });

            // Broadcast Panel Minimize button
            document.getElementById('minimize-broadcast-btn').addEventListener('click', () => {
                this.toggleMinimize(this.broadcastPanel, 'isBroadcastMinimized');
            });


            // Main Control buttons
            document.getElementById('auto-room-switch').addEventListener('click', () => {
                this.toggleAutomation('autoRoomSwitch', 'Auto Cambiar Sala');
            });

            document.getElementById('auto-kick').addEventListener('click', () => {
                this.toggleAutomation('autoKick', 'Auto Kick');
            });

            document.getElementById('auto-prohibit').addEventListener('click', () => {
                this.toggleAutomation('autoProhibit', 'Auto Prohibir');
            });

            document.getElementById('spam-todo').addEventListener('click', () => {
                this.toggleAutomation('spamTodo', 'Spam TODO');
            });

            document.getElementById('spam-glitch').addEventListener('click', () => {
                this.toggleAutomation('spamGlitch', 'Spam Glitch');
            });

            document.getElementById('emergency-stop').addEventListener('click', () => {
                this.emergencyStop();
            });

            // Activity Status Buttons (now on the new activity panel)
            document.getElementById('set-activity').addEventListener('click', () => {
                this.setActivityStatus();
            });

            document.getElementById('clear-activity').addEventListener('click', () => {
                this.clearActivityStatus();
            });

            // Broadcast Activity Buttons (now on the new broadcast panel)
            document.getElementById('broadcast-activity').addEventListener('click', () => {
                this.broadcastActivity();
            });

            document.getElementById('auto-broadcast').addEventListener('click', () => {
                this.toggleAutoBroadcast();
            });

            // Enter key on activity input
            document.getElementById('activity-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.setActivityStatus();
                }
            });

            // Update uptime every second
            setInterval(() => {
                this.updateUptime();
            }, 1000);

            // Update activity duration every second
            setInterval(() => {
                this.updateActivityDuration();
            }, 1000);
        }


        initializeBotConnection() {
            setTimeout(() => {
                this.findAndConnectBot();
            }, 2000);
        }

        findAndConnectBot() {
            if (window.sockets && window.sockets.length > 0) {
                this.activeBotInstance = window.sockets;
                this.addStatus('Conectado a socket existente', 'success');
                return;
            }

            if (window._io) {
                this.addStatus('Sistema de IO detectado', 'success');
                return;
            }

            this.addStatus('Esperando conexión de bot...', 'warning');

            setTimeout(() => {
                this.findAndConnectBot();
            }, 5000);
        }

        // Generic Toggle Minimize function
        toggleMinimize(panelElement, stateProperty) {
            this[stateProperty] = !this[stateProperty];
            panelElement.classList.toggle('minimized', this[stateProperty]);
            const btn = panelElement.querySelector('.minimize-btn');
            btn.textContent = this[stateProperty] ? '+' : '−';
        }

        toggleAutomation(type, name) {
            this.automation[type] = !this.automation[type];
            const btn = document.getElementById(type.replace(/([A-Z])/g, '-$1').toLowerCase());

            if (this.automation[type]) {
                btn.classList.add('active');
                this.startAutomation(type);
                this.addStatus(`✅ ${name} activado`, 'success');
            } else {
                btn.classList.remove('active');
                this.stopAutomation(type);
                this.addStatus(`⏹️ ${name} desactivado`, 'warning');
            }
        }

        startAutomation(type) {
            switch (type) {
                case 'autoRoomSwitch':
                    this.intervals.roomSwitch = setInterval(() => {
                        this.changeRoom();
                    }, this.getRandomInterval(3000, 5000));
                    break;

                case 'autoKick':
                case 'autoProhibit':
                    if (this.automation.autoRoomSwitch) {
                        this.startPlayerActions();
                    } else {
                        this.addStatus('❌ Activar Auto Cambiar Sala primero', 'error');
                        this.automation[type] = false;
                        const btn = document.getElementById(type.replace(/([A-Z])/g, '-$1').toLowerCase());
                        btn.classList.remove('active');
                    }
                    break;

                case 'spamTodo':
                    this.intervals.spamTodo = setInterval(() => {
                        this.sendTodoSpam();
                    }, this.getRandomInterval(700, 1200));
                    break;

                case 'spamGlitch':
                    this.intervals.spamGlitch = setInterval(() => {
                        this.sendGlitchText();
                    }, this.getRandomInterval(800, 1500));
                    break;
            }
        }

        stopAutomation(type) {
            if (this.intervals[type]) {
                clearInterval(this.intervals[type]);
                delete this.intervals[type];
            }

            if (type === 'autoRoomSwitch') {
                this.stopPlayerActions();
            }
        }

        startPlayerActions() {
            if (this.intervals.playerActions) return;

            this.intervals.playerActions = setInterval(() => {
                this.performPlayerActions();
            }, this.getRandomInterval(1000, 2000));
        }

        stopPlayerActions() {
            if (this.intervals.playerActions) {
                clearInterval(this.intervals.playerActions);
                delete this.intervals.playerActions;
            }
        }

        changeRoom() {
            try {
                if (window._io && window._io.emits && window._io.emits.pgswtichroom) {
                    const data = window._io.emits.pgswtichroom();
                    if (this.activeBotInstance && this.activeBotInstance.send) {
                        this.activeBotInstance.send(data);
                    }
                } else {
                    this.simulateRoomChange();
                }

                this.stats.roomsVisited++;
                this.updateStats();
                this.addStatus(`🔄 Cambiando sala (${this.stats.roomsVisited})`, 'info');

            } catch (error) {
                this.addStatus(`❌ Error cambiando sala: ${error.message}`, 'error');
            }
        }

        performPlayerActions() {
            try {
                const players = this.getCurrentPlayers();

                players.forEach(player => {
                    if (this.automation.autoKick) {
                        this.kickPlayer(player);
                    }

                    if (this.automation.autoProhibit) {
                        this.prohibitPlayer(player);
                    }

                    this.stats.playersProcessed++;
                });

                if (players.length > 0) {
                    this.updateStats();
                    this.addStatus(`⚡ Procesados ${players.length} jugadores`, 'success');
                }

            } catch (error) {
                this.addStatus(`❌ Error en acciones: ${error.message}`, 'error');
            }
        }

        getCurrentPlayers() {
            const players = [];

            if (this.activeBotInstance && this.activeBotInstance.room && this.activeBotInstance.room.players) {
                return this.activeBotInstance.room.players.filter(p => p.id !== this.activeBotInstance.id);
            }

            const playerElements = document.querySelectorAll('#playerlist .playerlist-row');
            playerElements.forEach((element, index) => {
                if (index > 0) {
                    players.push({
                        id: Math.random() * 1000,
                        name: `Player${index}`,
                        element: element
                    });
                }
            });

            return players.slice(0, 3);
        }

        kickPlayer(player) {
            try {
                if (window._io && window._io.emits && window._io.emits.sendvotekick) {
                    const data = window._io.emits.sendvotekick(player.id);
                    if (this.activeBotInstance && this.activeBotInstance.send) {
                        this.activeBotInstance.send(data);
                        this.stats.commandsSent++;
                    }
                } else {
                    console.log('Kick simulation:', player.name);
                    this.stats.commandsSent++;
                }
            } catch (error) {
                this.addStatus(`❌ Error kickeando ${player.name}: ${error.message}`, 'error');
            }
        }

        prohibitPlayer(player) {
            try {
                if (window._io && window._io.emits && window._io.emits.pgdrawvote) {
                    const data = window._io.emits.pgdrawvote(player.id, 0);
                    if (this.activeBotInstance && this.activeBotInstance.send) {
                        this.activeBotInstance.send(data);
                        this.stats.commandsSent++;
                    }
                } else {
                    console.log('Prohibit simulation:', player.name);
                    this.stats.commandsSent++;
                }
            } catch (error) {
                this.addStatus(`❌ Error prohibiendo ${player.name}: ${error.message}`, 'error');
            }
        }

        sendTodoSpam() {
            const commands = ['report', 'rules', 'afk'];
            commands.forEach(cmd => {
                try {
                    let data;
                    switch (cmd) {
                        case 'report':
                            data = `42["clientnotify",-1,2,["", "Generic Report"]]`;
                            break;
                        case 'rules':
                            data = `42["clientnotify",-1,100,[2]]`;
                            break;
                        case 'afk':
                            data = `42["playerafk"]`;
                            break;
                        default:
                            return;
                    }

                    if (this.activeBotInstance && this.activeBotInstance.send) {
                        this.activeBotInstance.send(data);
                    } else {
                        console.log(`Simulating TODO command: ${cmd}`);
                    }
                    this.stats.commandsSent++;
                } catch (error) {
                    this.addStatus(`❌ Error enviando TODO ${cmd}: ${error.message}`, 'error');
                }
            });

            this.updateStats();
            this.addStatus('📋 Spam TODO enviado', 'info');
        }

        sendGlitchText() {
            try {
                const glitchTexts = Object.values(GLITCH_TEXT_STRINGS);
                const randomText = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];

                if (this.activeBotInstance && this.activeBotInstance.emit) {
                    this.activeBotInstance.emit("chatmsg", randomText);
                } else {
                    this.injectChatMessage(randomText);
                }

                this.stats.commandsSent++;
                this.updateStats();
                this.addStatus('✨ Texto Glitch enviado', 'info');

            } catch (error) {
                this.addStatus(`❌ Error enviando glitch: ${error.message}`, 'error');
            }
        }

        injectChatMessage(message) {
            const chatInput = document.querySelector('input[placeholder*="chat"], input[placeholder*="Chat"], #chatinput, .chat-input');
            if (chatInput) {
                chatInput.value = message;
                chatInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
            }
        }

        simulateRoomChange() {
            this.addStatus('🔄 Simulando cambio de sala...', 'warning');
        }

        getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        setActivityStatus() {
            const input = document.getElementById('activity-input');
            const activity = input.value.trim();

            if (!activity) {
                this.addStatus('❌ Escribe una actividad primero', 'error');
                return;
            }

            this.activityStatus.current = activity;
            this.activityStatus.startTime = Date.now();
            this.activityStatus.isActive = true;

            this.updateActivityDisplay();
            this.addStatus(`📺 Estado establecido: ${activity}`, 'success');

            input.value = '';

            if (this.activityStatus.autoBroadcast) {
                this.broadcastActivity();
            }
        }

        clearActivityStatus() {
            this.activityStatus.current = '';
            this.activityStatus.startTime = null;
            this.activityStatus.isActive = false;

            this.updateActivityDisplay();
            this.addStatus('🚫 Estado de actividad limpiado', 'warning');
        }

        updateActivityDisplay() {
            const statusElement = document.getElementById('activity-status');
            const displayElement = document.getElementById('activity-display');

            if (this.activityStatus.isActive) {
                statusElement.textContent = `Estado: ${this.activityStatus.current}`;
                displayElement.classList.add('active');
            } else {
                statusElement.textContent = 'Estado: Inactivo';
                displayElement.classList.remove('active');
                document.getElementById('activity-duration').textContent = 'Duración: 0m 0s';
            }
        }

        updateActivityDuration() {
            if (!this.activityStatus.isActive || !this.activityStatus.startTime) return;

            const duration = Math.floor((Date.now() - this.activityStatus.startTime) / 1000);
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = duration % 60;

            let durationText = '';
            if (hours > 0) durationText += `${hours}h `;
            if (minutes > 0 || hours > 0) durationText += `${minutes}m `;
            durationText += `${seconds}s`;

            document.getElementById('activity-duration').textContent = `Duración: ${durationText}`;
        }

        broadcastActivity() {
            if (!this.activityStatus.isActive) {
                this.addStatus('❌ No hay estado activo para transmitir', 'error');
                return;
            }

            const duration = this.activityStatus.startTime ?
                Math.floor((Date.now() - this.activityStatus.startTime) / 60000) : 0;

            const message = `🎮 ${this.activityStatus.current} ${duration > 0 ? `(${duration}min)` : ''}`;

            try {
                this.sendChatMessage(message);
                this.addStatus('📡 Estado transmitido al chat', 'success');
                this.updateProfile(this.activityStatus.current);
            } catch (error) {
                this.addStatus(`❌ Error transmitiendo: ${error.message}`, 'error');
            }
        }

        toggleAutoBroadcast() {
            this.activityStatus.autoBroadcast = !this.activityStatus.autoBroadcast;
            const btn = document.getElementById('auto-broadcast');

            if (this.activityStatus.autoBroadcast) {
                btn.classList.add('active');
                const interval = document.getElementById('broadcast-interval').value;

                this.activityStatus.broadcastIntervalId = setInterval(() => { // Using broadcastIntervalId
                    if (this.activityStatus.isActive) {
                        this.broadcastActivity();
                    }
                }, parseInt(interval));

                this.addStatus('🔄 Auto-transmisión activada', 'success');
            } else {
                btn.classList.remove('active');

                if (this.activityStatus.broadcastIntervalId) { // Using broadcastIntervalId
                    clearInterval(this.activityStatus.broadcastIntervalId);
                    this.activityStatus.broadcastIntervalId = null;
                }

                this.addStatus('⏹️ Auto-transmisión desactivada', 'warning');
            }
        }

        sendChatMessage(message) {
            if (this.activeBotInstance && this.activeBotInstance.emit) {
                this.activeBotInstance.emit("chatmsg", message);
                return;
            }

            const chatInput = document.querySelector('#chatinput, input[placeholder*="chat"], .chat-input');
            if (chatInput) {
                const originalValue = chatInput.value;
                chatInput.value = message;
                chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                chatInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));

                setTimeout(() => {
                    chatInput.value = originalValue;
                }, 100);
                return;
            }

            const sendBtn = document.querySelector('[onclick*="chat"], .send-btn, button[title*="Send"]');
            if (sendBtn) {
                console.log('Sending activity status (simulated):', message);
            }

            throw new Error('No se pudo acceder al chat para enviar el mensaje.');
        }

        updateProfile(activity) {
            try {
                const profileElements = document.querySelectorAll('.profile-status, .user-status, [data-status]');
                profileElements.forEach(element => {
                    if (element.textContent.length < 50) {
                        element.textContent = activity.substring(0, 30);
                    }
                });
            } catch (error) {
                console.warn('No se pudo actualizar el estado del perfil:', error);
            }
        }

        emergencyStop() {
            Object.keys(this.intervals).forEach(key => {
                clearInterval(this.intervals[key]);
                delete this.intervals[key];
            });

            Object.keys(this.automation).forEach(key => {
                this.automation[key] = false;
            });

            document.querySelectorAll('.control-btn.active').forEach(btn => {
                btn.classList.remove('active');
            });

            // Stop and clear activity status and auto-broadcast
            this.clearActivityStatus();
            if (this.activityStatus.broadcastIntervalId) {
                clearInterval(this.activityStatus.broadcastIntervalId);
                this.activityStatus.broadcastIntervalId = null;
            }
            this.activityStatus.autoBroadcast = false;
            const autoBroadcastBtn = document.getElementById('auto-broadcast');
            if (autoBroadcastBtn) autoBroadcastBtn.classList.remove('active');

            this.addStatus('🛑 PARADA DE EMERGENCIA ACTIVADA', 'error');
            this.addStatus('🔴 Todas las automatizaciones detenidas', 'error');
        }

        addStatus(message, type = 'info') {
            const statusDisplay = document.getElementById('status-display');
            if (!statusDisplay) return; // Ensure element exists before trying to add status

            const timestamp = new Date().toLocaleTimeString();
            const statusLine = document.createElement('div');
            statusLine.className = `status-line status-${type}`;
            statusLine.textContent = `${timestamp} - ${message}`;

            statusDisplay.insertBefore(statusLine, statusDisplay.firstChild);

            while (statusDisplay.children.length > 15) {
                statusDisplay.removeChild(statusDisplay.lastChild);
            }

            statusDisplay.scrollTop = 0;
        }

        updateStats() {
            document.getElementById('players-processed').textContent = this.stats.playersProcessed;
            document.getElementById('commands-sent').textContent = this.stats.commandsSent;
            document.getElementById('rooms-visited').textContent = this.stats.roomsVisited;
        }

        updateUptime() {
            const uptime = Math.floor((Date.now() - this.stats.startTime) / 1000);
            const minutes = Math.floor(uptime / 60);
            const seconds = uptime % 60;
            document.getElementById('uptime').textContent = `${minutes}m ${seconds}s`;
        }
    }

    new DrawariaAdvancedPanel();

})();