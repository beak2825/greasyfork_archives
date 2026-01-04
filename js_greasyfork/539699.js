// ==UserScript==
// @name         Chat Privado Grupal Drawaria.online
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Interfaz gráfica completa, draggable y funcional para crear y usar grupos de chat privados en Drawaria.
// @author       YouTubeDrawaria & videogamebmo
// @match        https://drawaria.online/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/539699/Chat%20Privado%20Grupal%20Drawariaonline.user.js
// @updateURL https://update.greasyfork.org/scripts/539699/Chat%20Privado%20Grupal%20Drawariaonline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ESTADO GLOBAL Y CONFIGURACIÓN ---
    let grupos = {};
    let chatHistory = {};
    let currentUser = { id: null, name: null };
    let activeChatGroup = null;
    let botMessageTimer = null; // Para el temporizador de mensajes del bot
    let typingIndicatorTimer = null; // Para el temporizador del indicador de "escribiendo"
    let loadingTimer = null; // Nuevo temporizador para la simulación de la pantalla de carga

    // --- CONFIGURACIÓN DEL BOT DE DEMOSTRACIÓN ---
    const BOT_MESSAGE_DELAY_MIN = 3000; // Mínimo 3 segundos antes de que el bot piense en responder (respuesta no inmediata)
    const BOT_MESSAGE_DELAY_MAX = 8000; // Máximo 8 segundos
    const TYPING_DURATION_MIN = 1200; // Mínimo 1.2 segundos que el bot "escribe"
    const TYPING_DURATION_MAX = 3500; // Máximo 3.5 segundos
    const BOT_MESSAGES = [
        "Hola!",
        "Qué tal?",
        "Ok",
        "Entendido.",
        "Estoy aquí!",
        "Jeje",
        "Sí",
        "No",
        "Gracias",
        "De nada",
        "Qué dibujas?",
        "Buena idea!",
        "Me gusta el chat!",
        "Genial!",
        ":)",
        "xD",
        "Interesante...",
        "Cuéntame más.",
        "De acuerdo.",
        "Perfecto.",
        "Cómo va todo?",
        "Claro!",
        "Increíble!",
        "Qué divertido es esto!"
    ];

    // --- INICIALIZACIÓN DEL LOCALSTORAGE ---
    try {
        grupos = JSON.parse(localStorage.getItem("grupos_v3") || "{}");
        chatHistory = JSON.parse(localStorage.getItem("chatHistory_v3") || "{}");
    } catch (e) {
        console.error("Error al analizar localStorage, limpiando datos corruptos:", e);
        localStorage.removeItem("grupos_v3");
        localStorage.removeItem("chatHistory_v3");
        grupos = {};
        chatHistory = {};
    }

    // --- LÓGICA DE INICIALIZACIÓN ---
    const maxAttempts = 20; // Intentar durante 10 segundos
    let attemptCount = 0;
    const waitForGameAPI = setInterval(() => {
        attemptCount++;
        const playernameInput = document.getElementById('playername');
        const currentPlayerName = playernameInput ? playernameInput.value.trim() : null;

        console.log(`Intento ${attemptCount}: Verificando window.playerid, nombre de usuario y elementos de la lista de amigos...`);
        if (window.playerid && currentPlayerName && document.querySelector("#friends-tabfriendlist")) {
            clearInterval(waitForGameAPI);
            initialize();
        } else if (attemptCount >= maxAttempts) {
            clearInterval(waitForGameAPI);
            initializeFallback();
        }
    }, 500);

    function initialize() {
        try {
            console.log("Iniciando Super Chat de Grupos...");
            currentUser.id = window.playerid;
            const playernameInput = document.getElementById('playername');
            currentUser.name = playernameInput ? playernameInput.value.trim() : "Tú";
            console.log(`Usuario actual: ${currentUser.name} (ID: ${currentUser.id})`);

            injectStyles();
            injectGUI();
            showLoadingScreen();
            simulateLoading();

        } catch (e) {
            console.error("Error durante la inicialización:", e);
        }
    }

    function initializeFallback() {
        try {
            console.log("Bienvenido al chat privado de Drawaria.online");
            currentUser.id = "fallback-user-" + Math.random().toString(36).slice(2);
            currentUser.name = "Amigo";
            console.log(`Usuario actual (fallback): ${currentUser.name} (ID: ${currentUser.id})`);

            injectStyles();
            injectGUI();
            showLoadingScreen();
            simulateLoading();

        } catch (e) {
            console.error("Error en inicialización parcial:", e);
        }
    }

    // --- LÓGICA DE LA PANTALLA DE CARGA ---
    const loadingMessages = [
        "Iniciando módulos de chat...",
        "Verificando la integridad de los datos locales...",
        "Cargando historial de grupos y mensajes...",
        "Estableciendo conexión simulada con el servidor...", // Mensaje más 'pro'
        "Actualizando lista de amigos de Drawaria...",
        "Optimizando recursos gráficos y de rendimiento...",
        "Sincronizando estado de la aplicación...",
        "Preparando la interfaz de usuario...",
        "Casi listo para chatear..."
    ];
    let loadingProgress = 0;

    function showLoadingScreen() {
        const loadingScreen = document.getElementById('chat-loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingProgress = 0;
            updateLoadingProgress(0, loadingMessages[0]);
        }
    }

    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('chat-loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0'; // Fundido
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                loadingScreen.style.opacity = '1'; // Reset para la próxima vez
            }, 500); // Duración del fundido
        }
    }

    function updateLoadingProgress(progress, message, currentStep, totalSteps) {
        const progressBar = document.getElementById('loading-progress-bar');
        const progressText = document.getElementById('loading-text');
        const progressStepCount = document.getElementById('loading-step-count');
        if (progressBar && progressText && progressStepCount) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = message;
            progressStepCount.textContent = `Paso ${currentStep + 1} de ${totalSteps}`; // Muestra el paso actual
        }
    }

    function simulateLoading() {
        if (loadingTimer) clearTimeout(loadingTimer);

        let step = 0;
        const totalSteps = loadingMessages.length;
        const intervalTime = 600; // Tiempo por mensaje de carga

        const loadStep = () => {
            if (step < totalSteps) {
                loadingProgress = Math.floor((step / (totalSteps - 1)) * 100); // Distribución más uniforme
                if (step === totalSteps - 1) loadingProgress = 100; // Asegurar 100% en el último paso

                updateLoadingProgress(loadingProgress, loadingMessages[step], step, totalSteps);
                step++;
                loadingTimer = setTimeout(loadStep, intervalTime);
            } else {
                updateLoadingProgress(100, "Carga completa.", totalSteps, totalSteps); // Mensaje final
                loadingTimer = setTimeout(() => {
                    hideLoadingScreen();
                    finalizeInitialization();
                }, 700); // Pequeño retraso después del 100% y antes de ocultar
            }
        };
        loadStep();
    }

    function finalizeInitialization() {
        setupEventListeners();
        ensureVisibility();
        loadFriendsList();
        renderGroupList();
        console.log("Chat Privado Grupal Drawaria.online, Disfrute la experiencia.");
    }

    function ensureVisibility() {
        const chatWindow = document.getElementById('group-chat-window');
        if (chatWindow) {
            chatWindow.style.display = 'flex';
            chatWindow.style.zIndex = '10000';
            chatWindow.style.position = 'fixed';
            console.log("Para usar el chat tienes un boton para mostrarlo visible y ocultarlo");
        } else {
            console.error("No se encontró '#group-chat-window', intentando reinyección...");
            return;
        }
    }

    // --- INYECCIÓN DE UI Y ESTILOS ---
    function injectStyles() {
        const styles = `
            #group-chat-window {
                position: fixed !important;
                top: 50px !important;
                right: 20px !important;
                width: 600px !important;
                max-width: 90vw !important;
                height: 600px !important;
                max-height: 80vh !important;
                background: #fff !important;
                border-radius: 8px !important;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3) !important;
                display: none; /* Oculto por defecto, se muestra después de la carga */
                flex-direction: column !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            }
            #chat-loading-screen {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(255,255,255,0.95) !important; /* Más claro */
                z-index: 10001 !important;
                display: none;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                color: #333 !important; /* Texto oscuro para fondo claro */
                font-size: 1.2em !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                transition: opacity 0.5s ease-out !important; /* Transición para fundido */
            }
            #loading-box {
                background: #ffffff !important; /* Color blanco */
                padding: 40px !important;
                border-radius: 12px !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important; /* Sombra más suave */
                text-align: center !important;
                min-width: 380px !important; /* Ancho mínimo ligeramente mayor */
                max-width: 90% !important;
                border: 1px solid #e0e0e0 !important; /* Borde sutil */
                display: flex; /* Para flexbox */
                flex-direction: column; /* Apila elementos verticalmente */
                align-items: center; /* Centra horizontalmente */
                gap: 15px; /* Espacio entre elementos */
            }
            #loading-box h2 {
                margin: 0 !important; /* Reset margin for gap */
                color: #4a90e2 !important; /* Color del título */
                font-size: 1.8em !important;
            }
            #loading-text {
                margin: 0 !important; /* Reset margin for gap */
                font-size: 1.1em !important;
                color: #333 !important; /* Texto oscuro */
            }
            #loading-step-count {
                font-size: 0.9em !important;
                color: #666 !important; /* Texto ligeramente más claro */
                margin: 0 !important; /* Reset margin for gap */
            }
            #loading-progress-bar-container {
                width: 100% !important;
                background-color: #e9ecef !important; /* Fondo de barra claro */
                border-radius: 5px !important;
                overflow: hidden !important;
                height: 12px !important; /* Barra un poco más alta */
            }
            #loading-progress-bar {
                height: 100% !important;
                width: 0% !important;
                background-color: #4a90e2 !important;
                border-radius: 5px !important;
                transition: width 0.4s ease-in-out !important;
            }
            .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1) !important; /* Más sutil para fondo claro */
                border-top: 4px solid #4a90e2 !important;
                border-radius: 50% !important;
                width: 40px !important;
                height: 40px !important;
                animation: spin 1s linear infinite !important;
                margin: 0 !important; /* Reset margin for gap */
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            /* Resto de estilos del chat, sin cambios */
            #group-chat-header {
                background: #4a90e2 !important;
                color: white !important;
                padding: 10px 15px !important;
                border-radius: 8px 8px 0 0 !important;
                cursor: move !important;
                user-select: none !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }
            #group-chat-header h5 {
                margin: 0 !important;
                font-size: 16px !important;
            }
            #group-chat-close-btn {
                background: none !important;
                border: none !important;
                color: white !important;
                font-size: 24px !important;
                cursor: pointer !important;
                line-height: 1 !important;
            }
            #group-chat-body {
                display: flex !important;
                flex-grow: 1 !important;
                overflow: hidden !important;
            }
            #group-chat-sidebar {
                width: 180px !important;
                background: #f5f5f5 !important;
                border-right: 1px solid #ddd !important;
                display: flex !important;
                flex-direction: column !important;
            }
            #group-chat-main {
                flex-grow: 1 !important;
                display: flex !important;
                flex-direction: column !important;
            }
            .sidebar-section {
                padding: 10px !important;
                border-bottom: 1px solid #ddd !important;
            }
            .sidebar-section h6 {
                margin-top: 0 !important;
                margin-bottom: 10px !important;
                color: #333 !important;
                font-size: 14px !important;
            }
            .item-list {
                list-style: none !important;
                padding: 0 !important;
                margin: 0 !important;
                max-height: 160px !important;
                overflow-y: auto !important;
            }
            .item-list li {
                padding: 8px 10px !important;
                cursor: pointer !important;
                border-bottom: 1px solid #eee !important;
                font-size: 14px !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }
            .item-list li:hover {
                background: #e9e9e9 !important;
            }
            .item-list li.active {
                background: #d1e7fd !important;
                font-weight: bold !important;
            }
            #chat-view {
                flex-grow: 1 !important;
                padding: 10px !important;
                overflow-y: auto !important;
                background: #e5ddd5 !important;
                display: flex !important;
                flex-direction: column !important;
            }
            #typing-indicator {
                display: none; /* Oculto por defecto */
                padding: 5px 10px 0 10px !important;
                font-style: italic !important;
                color: #888 !important;
                font-size: 13px !important;
            }
            #chat-input-area {
                padding: 10px !important;
                border-top: 1px solid #ccc !important;
                display: flex !important;
            }
            #chat-input {
                flex-grow: 1 !important;
                border: 1px solid #ccc !important;
                border-radius: 15px !important;
                padding: 8px 12px !important;
            }
            #chat-send-btn {
                margin-left: 10px !important;
                border: none !important;
                background: #4a90e2 !important;
                color: white !important;
                padding: 8px 15px !important;
                border-radius: 15px !important;
                cursor: pointer !important;
            }
            .chat-message {
                display: table !important;
                margin-bottom: 10px !important;
                padding: 8px 12px !important;
                border-radius: 12px !important;
                max-width: 80% !important;
                word-wrap: break-word !important;
            }
            .chat-message.self {
                background: #dcf8c6 !important;
                margin-left: auto !important;
            }
            .chat-message.other {
                background: #fff !important;
                margin-right: auto !important;
            }
            .chat-message .sender {
                font-weight: bold !important;
                color: #075e54 !important;
                font-size: 13px !important;
            }
            .chat-message .text {
                font-size: 14px !important;
                margin-top: 4px !important;
            }
            .chat-message.system {
                background: #f0f0f0 !important;
                text-align: center !important;
                margin-left: auto !important;
                margin-right: auto !important;
                width: fit-content !important;
                color: #666 !important;
                font-style: italic !important;
                font-size: 12px !important;
                padding: 5px 10px !important;
                border-radius: 8px !important;
            }
            #group-chat-trigger {
                position: fixed !important;
                top: 50% !important;
                right: 10px !important;
                transform: translateY(-50%) !important;
                background: #4a90e2 !important;
                color: white !important;
                padding: 12px !important;
                border-radius: 8px 0 0 8px !important;
                cursor: pointer !important;
                z-index: 9999 !important;
                box-shadow: -2px 2px 8px rgba(0,0,0,0.2) !important;
            }
            .invite-btn {
                font-size: 12px !important;
                color: #4a90e2 !important;
                opacity: 0.5 !important;
            }
            .invite-btn:hover {
                opacity: 1 !important;
            }
            .input-group {
                display: flex !important;
            }
            .form-control {
                flex-grow: 1 !important;
                padding: 5px !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
            }
            .btn {
                padding: 5px 10px !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
            }
            .btn-outline-secondary {
                background: transparent !important;
                border: 1px solid #6c757d !important;
                color: #6c757d !important;
            }
            .btn-warning {
                background: #ffc107 !important;
                color: #212529 !important;
            }
            .fas {
                font-family: "Font Awesome 5 Free" !important;
            }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    function injectGUI() {
        let container = document.body;
        if (!container) {
            console.warn("document.body no disponible, intentando document.documentElement...");
            container = document.documentElement;
        }

        // HTML para la pantalla de carga (mejorada)
        const loadingScreenHTML = `
            <div id="chat-loading-screen">
                <div id="loading-box">
                    <h2>Iniciando Chat de Grupos</h2>
                    <div class="spinner"></div>
                    <div id="loading-text">Cargando...</div>
                    <div id="loading-step-count"></div>
                    <div id="loading-progress-bar-container">
                        <div id="loading-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;

        // HTML para la GUI principal del chat (sin cambios en estructura)
        const guiHTML = `
            <div id="group-chat-window">
                <div id="group-chat-header">
                    <h5 id="chat-window-title">Chat de Drawaria.online</h5>
                    <button id="group-chat-close-btn" title="Cerrar">×</button>
                </div>
                <div id="group-chat-body">
                    <div id="group-chat-sidebar">
                        <div class="sidebar-section">
                            <h6>Grupos</h6>
                            <ul id="group-list" class="item-list"></ul>
                            <div class="input-group input-group-sm mt-2">
                                <input type="text" id="new-group-name" class="form-control" placeholder="Nuevo grupo...">
                                <button id="create-group-btn" class="btn btn-sm btn-outline-secondary" title="Crear"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="sidebar-section">
                            <h6>Amigos</h6>
                            <ul id="friend-list" class="item-list"></ul>
                        </div>
                    </div>
                    <div id="group-chat-main">
                        <div id="chat-view">
                            <p style="text-align:center; color:#888; margin-top: 20px;">Selecciona un grupo para chatear.</p>
                        </div>
                        <div id="typing-indicator">
                            <span id="typing-username"></span> está escribiendo...
                        </div>
                        <div id="chat-input-area" style="display:none;">
                            <input type="text" id="chat-input" placeholder="Escribe un mensaje...">
                            <button id="chat-send-btn"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="group-chat-trigger" title="Abrir/Cerrar Chat de Grupos"><i class="fas fa-users"></i></div>
        `;
        // Inyectar ambos elementos
        container.insertAdjacentHTML('beforeend', loadingScreenHTML + guiHTML);

        // Inyectar FontAwesome (asegurarse de que solo se cargue una vez)
        if (!document.querySelector('link[href*="fontawesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
            faLink.onerror = () => console.error("Error al cargar FontAwesome");
            faLink.onload = () => console.log("FontAwesome cargado correctamente");
            document.head.appendChild(faLink);
        }
    }

    // --- MANEJADORES DE EVENTOS ---
    function setupEventListeners() {
        const gui = document.getElementById('group-chat-window');
        const trigger = document.getElementById('group-chat-trigger');

        if (!gui || !trigger) {
            console.error("No se encontraron elementos GUI, no se pueden configurar los eventos.");
            return;
        }

        trigger.addEventListener('click', () => {
            const isVisible = gui.style.display === 'flex';
            gui.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                loadFriendsList();
                renderGroupList();
                if (activeChatGroup) {
                    startBotSimulation();
                }
            } else {
                stopBotSimulation();
                hideTypingIndicator();
            }
        });

        document.getElementById('group-chat-close-btn')?.addEventListener('click', () => {
            gui.style.display = 'none';
            stopBotSimulation();
            hideTypingIndicator();
        });

        if (document.getElementById('group-chat-header')) {
            makeDraggable(gui, document.getElementById('group-chat-header'));
        }

        document.getElementById('create-group-btn')?.addEventListener('click', crearGrupo);
        document.getElementById('chat-send-btn')?.addEventListener('click', enviarMensajeActual);
        document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                enviarMensajeActual();
                e.preventDefault();
            }
        });
    }

    // --- FUNCIONES AUXILIARES ---
    function makeDraggable(el, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (ev) => {
                ev.preventDefault();
                pos1 = pos3 - ev.clientX;
                pos2 = pos4 - ev.clientY;
                pos3 = ev.clientX;
                pos4 = ev.clientY;
                el.style.top = Math.max(0, el.offsetTop - pos2) + "px";
                el.style.left = Math.max(0, el.offsetLeft - pos1) + "px";
            };
        };
    }

    // --- LÓGICA DE GRUPOS Y CHAT ---
    function loadFriendsList() {
        const list = document.getElementById('friend-list');
        if (!list) return;

        list.innerHTML = '';
        const friends = document.querySelectorAll("#friends-tabfriendlist .tabrow") || [];
        friends.forEach(row => {
            const friendId = row.dataset.playeruid;
            const friendName = row.querySelector(".playername")?.innerText || "Desconocido";
            if (friendId === currentUser.id) return;
            const li = document.createElement('li');
            li.innerHTML = `<span>${friendName}</span><button class="btn btn-sm invite-btn"><i class="fas fa-plus"></i></button>`;
            li.title = `Invitar a ${friendName} a un grupo`;
            li.onclick = () => invitarAmigo(friendId, friendName);
            list.appendChild(li);
        });
    }

    function renderGroupList() {
        const list = document.getElementById('group-list');
        if (!list) return;
        list.innerHTML = '';
        for (const nombreGrupo in grupos) {
            const li = document.createElement('li');
            li.dataset.grupo = nombreGrupo;
            if (nombreGrupo === activeChatGroup) li.classList.add('active');

            const groupNameSpan = document.createElement('span');
            groupNameSpan.textContent = nombreGrupo;
            groupNameSpan.onclick = () => selectGroupChat(nombreGrupo);

            li.appendChild(groupNameSpan);

            const leaveBtn = document.createElement('button');
            leaveBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            leaveBtn.className = "btn btn-sm btn-warning";
            leaveBtn.title = grupos[nombreGrupo].owner === currentUser.id ? "Eliminar Grupo" : "Abandonar Grupo";
            leaveBtn.onclick = (e) => {
                e.stopPropagation();
                if (grupos[nombreGrupo].owner === currentUser.id) {
                    if (confirm(`¿Estás seguro de que quieres ELIMINAR el grupo "${nombreGrupo}"? Esta acción no se puede deshacer.`)) {
                        eliminarGrupo(nombreGrupo);
                    }
                } else {
                    if (confirm(`¿Estás seguro de que quieres ABANDONAR el grupo "${nombreGrupo}"?`)) {
                        dejarGrupo(nombreGrupo);
                    }
                }
            };
            li.appendChild(leaveBtn);

            list.appendChild(li);
        }
    }

    function selectGroupChat(nombreGrupo) {
        stopBotSimulation();
        hideTypingIndicator();

        activeChatGroup = nombreGrupo;
        document.getElementById('chat-window-title').textContent = `Chat: ${nombreGrupo}`;
        renderGroupList();
        renderChatView();
        document.getElementById('chat-input-area').style.display = 'flex';

        startBotSimulation();
    }

    function renderChatView() {
        const chatView = document.getElementById('chat-view');
        if (!chatView) return;
        chatView.innerHTML = '';
        const history = chatHistory[activeChatGroup] || [];
        history.forEach(msg => {
            const sender = grupos[activeChatGroup]?.members.find(m => m.id === msg.senderId);
            const senderName = msg.senderId === currentUser.id ? 'Tú' : (sender?.name || 'Ex-miembro');

            const msgDiv = document.createElement('div');
            if (msg.senderId === 'system') {
                msgDiv.className = `chat-message system`;
                msgDiv.innerHTML = `<div class="text">${escapeHTML(msg.text)}</div>`;
            } else {
                msgDiv.className = `chat-message ${msg.senderId === currentUser.id ? 'self' : 'other'}`;
                msgDiv.innerHTML = `<div class="sender">${senderName}</div><div class="text">${escapeHTML(msg.text)}</div>`;
            }
            chatView.appendChild(msgDiv);
        });
        chatView.scrollTop = chatView.scrollHeight;
    }

    function escapeHTML(str) {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }

    function crearGrupo() {
        const nombre = document.getElementById('new-group-name')?.value.trim();
        if (nombre && !grupos[nombre]) {
            grupos[nombre] = { owner: currentUser.id, members: [{ id: currentUser.id, name: currentUser.name }] };
            localStorage.setItem("grupos_v3", JSON.stringify(grupos));
            document.getElementById('new-group-name').value = '';
            renderGroupList();
            selectGroupChat(nombre);

            addSystemMessage(nombre, `"${nombre}" fue creado por ${currentUser.name}.`);
        } else if (nombre && grupos[nombre]) {
            alert(`El grupo "${nombre}" ya existe.`);
        }
    }

    function eliminarGrupo(nombreGrupo) {
        addSystemMessage(nombreGrupo, `${currentUser.name} eliminó el grupo "${nombreGrupo}".`);
        setTimeout(() => {
            delete grupos[nombreGrupo];
            delete chatHistory[nombreGrupo];
            localStorage.setItem("grupos_v3", JSON.stringify(grupos));
            localStorage.setItem("chatHistory_v3", JSON.stringify(chatHistory));

            if (activeChatGroup === nombreGrupo) {
                activeChatGroup = null;
                stopBotSimulation();
                hideTypingIndicator();
            }
            renderGroupList();
            renderChatView();
            document.getElementById('chat-input-area').style.display = 'none';
            document.getElementById('chat-window-title').textContent = 'Chat de Drawaria.online';
        }, 100);
    }

    function dejarGrupo(nombreGrupo) {
        addSystemMessage(nombreGrupo, `${currentUser.name} ha abandonado el grupo "${nombreGrupo}".`);
        setTimeout(() => {
            grupos[nombreGrupo].members = grupos[nombreGrupo].members.filter(m => m.id !== currentUser.id);
            if (!grupos[nombreGrupo].members.length) {
                delete grupos[nombreGrupo];
                delete chatHistory[nombreGrupo];
            }
            localStorage.setItem("grupos_v3", JSON.stringify(grupos));
            localStorage.setItem("chatHistory_v3", JSON.stringify(chatHistory));

            if (activeChatGroup === nombreGrupo) {
                activeChatGroup = null;
                stopBotSimulation();
                hideTypingIndicator();
            }
            renderGroupList();
            renderChatView();
            document.getElementById('chat-input-area').style.display = 'none';
            document.getElementById('chat-window-title').textContent = 'Chat de Drawaria.online';
        }, 100);
    }

    function invitarAmigo(friendId, friendName) {
        if (!activeChatGroup) {
            alert("Selecciona un grupo primero para invitar amigos.");
            return;
        }
        const grupo = grupos[activeChatGroup];
        if (!grupo) {
            alert("El grupo seleccionado no existe.");
            return;
        }
        if (!grupo.members.some(m => m.id === friendId)) {
            grupo.members.push({ id: friendId, name: friendName });
            localStorage.setItem("grupos_v3", JSON.stringify(grupos));
            renderGroupList();

            addSystemMessage(activeChatGroup, `${currentUser.name} invitó a ${friendName} al grupo.`);
            renderChatView();
            startBotSimulation();
        } else {
            alert(`${friendName} ya es miembro de este grupo.`);
        }
    }

    function enviarMensajeActual() {
        const input = document.getElementById('chat-input');
        const text = input?.value.trim();
        if (text && activeChatGroup) {
            const msg = { senderId: currentUser.id, text, timestamp: Date.now() };
            chatHistory[activeChatGroup] = chatHistory[activeChatGroup] || [];
            chatHistory[activeChatGroup].push(msg);
            localStorage.setItem("chatHistory_v3", JSON.stringify(chatHistory));
            input.value = '';
            renderChatView();

            startBotSimulation(true); // Pasa 'true' para indicar una respuesta inmediata
        }
    }

    function addSystemMessage(groupName, messageText) {
        if (!chatHistory[groupName]) chatHistory[groupName] = [];
        chatHistory[groupName].push({ senderId: "system", text: messageText, timestamp: Date.now() });
        localStorage.setItem("chatHistory_v3", JSON.stringify(chatHistory));
    }

    // --- FUNCIONALIDAD DEL BOT DE DEMOSTRACIÓN (CON TYPING INDICATOR) ---

    function displayTypingIndicator(username) {
        const indicator = document.getElementById('typing-indicator');
        const typingUsername = document.getElementById('typing-username');
        if (indicator && typingUsername && activeChatGroup) {
            typingUsername.textContent = username;
            indicator.style.display = 'block';
            const chatView = document.getElementById('chat-view');
            chatView.scrollTop = chatView.scrollHeight;
        }
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    function stopBotSimulation() {
        if (botMessageTimer) {
            clearTimeout(botMessageTimer);
            botMessageTimer = null;
        }
        if (typingIndicatorTimer) {
            clearTimeout(typingIndicatorTimer);
            typingIndicatorTimer = null;
        }
        hideTypingIndicator();
    }

    function startBotSimulation(immediateResponse = false) {
        stopBotSimulation();

        if (!activeChatGroup || !grupos[activeChatGroup]) return;

        const currentGroup = grupos[activeChatGroup];
        const otherMembers = currentGroup.members.filter(m => m.id !== currentUser.id);

        if (otherMembers.length === 0) {
            return;
        }

        const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];

        const delayBeforeTyping = immediateResponse ?
                                  Math.random() * 800 + 300 : // 0.3 a 1.1 segundos si es una respuesta inmediata
                                  Math.random() * (BOT_MESSAGE_DELAY_MAX - BOT_MESSAGE_DELAY_MIN) + BOT_MESSAGE_DELAY_MIN;

        const typingDuration = Math.random() * (TYPING_DURATION_MAX - TYPING_DURATION_MIN) + TYPING_DURATION_MIN;

        botMessageTimer = setTimeout(() => {
            if (activeChatGroup === currentGroup.name) {
                displayTypingIndicator(randomMember.name);

                typingIndicatorTimer = setTimeout(() => {
                    hideTypingIndicator();
                    if (activeChatGroup === currentGroup.name) {
                        const randomMessage = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
                        const msg = { senderId: randomMember.id, text: randomMessage, timestamp: Date.now() };
                        chatHistory[activeChatGroup].push(msg);
                        localStorage.setItem("chatHistory_v3", JSON.stringify(chatHistory));
                        renderChatView();
                    }
                    startBotSimulation();
                }, typingDuration);
            }
        }, delayBeforeTyping);
    }

})();