// ==UserScript==
// @name         Drawaria Android Phone Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Un teléfono celular Android interactivo, animado y detallado dentro de Drawaria.online.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540167/Drawaria%20Android%20Phone%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/540167/Drawaria%20Android%20Phone%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Contexto de Audio para generar sonidos ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Función para reproducir un tono simple
    function playTone(frequency, duration, type = 'sine', volume = 0.1) {
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }

    // --- Custom Sound Melody ---
    function playMelody() {
        if (!audioContext) return;
        const melodyNotes = [
            { freq: 523.25, duration: 0.15, type: 'sine' }, // C5
            { freq: 587.33, duration: 0.15, type: 'sine' }, // D5
            { freq: 659.25, duration: 0.15, type: 'sine' }, // E5
            { freq: 587.33, duration: 0.15, type: 'sine' }, // D5
            { freq: 523.25, duration: 0.2, type: 'sine' },  // C5
            { freq: null, duration: 0.1, type: 'sine' },    // Pause
            { freq: 493.88, duration: 0.15, type: 'sine' }, // B4
            { freq: 587.33, duration: 0.15, type: 'sine' }, // D5
            { freq: 659.25, duration: 0.2, type: 'sine' }  // E5
        ];
        const baseVolume = volumeControl.value * 0.3; // Adjust base volume for melody

        melodyNotes.forEach((note, index) => {
            if (note.freq !== null) {
                setTimeout(() => {
                    playTone(note.freq, note.duration, note.type, baseVolume);
                }, index * 150); // Stagger the notes
            }
        });
    }


    // --- Inyectar Estilos CSS ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Animaciones */
        @keyframes glowing {
            0% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.7), 0 0 10px rgba(0, 255, 255, 0.5); }
            50% { box-shadow: 0 0 15px rgba(0, 255, 255, 1), 0 0 25px rgba(0, 255, 255, 0.8); }
            100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.7), 0 0 10px rgba(0, 255, 255, 0.5); }
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }

        @keyframes incomingCallAnimation {
            0% { transform: scale(1); opacity: 1; }
            25% { transform: scale(1.02); opacity: 0.95; }
            50% { transform: scale(1); opacity: 1; }
            75% { transform: scale(1.02); opacity: 0.95; }
            100% { transform: scale(1); opacity: 1; }
        }

        @keyframes particleFlow {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
        }

        @keyframes slideIn {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Contenedor principal del teléfono */
        #omni-phone-container {
            position: fixed;
            top: 20px; /* Initial position */
            left: calc(100% - 320px); /* Initial position, adjust as needed */
            width: 300px;
            height: 600px;
            background: linear-gradient(to bottom right, #2c2c2c, #1a1a1a);
            border-radius: 40px;
            box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 0 15px rgba(255,255,255,0.1);
            border: 8px solid #000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 10000; /* High z-index to stay on top */
            transform-origin: bottom right;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            transform: rotateY(0deg) rotateX(0deg) scale(1);
            perspective: 1000px;
            cursor: grab; /* Indicate that it's draggable */
        }

        #omni-phone-container.dragging,
        #omni-phone-container.dragging * {
             cursor: grabbing !important; /* Change cursor while dragging */
             user-select: none; /* Prevent text selection during drag */
             -webkit-user-select: none;
             -moz-user-select: none;
             -ms-user-select: none;
        }

        /* Estado minimizado del teléfono */
        #omni-phone-container.minimized {
            transform: scale(0.1) translate(1300%, 1300%);
            opacity: 0;
            pointer-events: none;
        }

        /* Encabezado del teléfono (área de la muesca) */
        #omni-phone-header {
            height: 30px;
            background: #000;
            border-top-left-radius: 32px;
            border-top-right-radius: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 2;
        }

        #omni-phone-notch {
            width: 100px;
            height: 25px;
            background: #0d0d0d;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-top: 5px;
        }

        #omni-phone-camera {
            width: 8px;
            height: 8px;
            background-color: #333;
            border-radius: 50%;
            border: 1px solid #444;
            box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
        }

        #omni-phone-speaker {
            width: 30px;
            height: 3px;
            background-color: #333;
            border-radius: 2px;
        }

        /* Pantalla del teléfono */
        #omni-phone-screen {
            flex-grow: 1;
            background: linear-gradient(to top, #1a1a1a, #0a0a0a);
            color: #eee;
            font-family: 'Roboto', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px;
            position: relative;
            overflow: hidden;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
        }

        .screen-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            animation: slideIn 0.5s ease-out;
            position: absolute;
            top: 0;
            left: 0;
            padding: 10px;
            box-sizing: border-box;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none; /* Initially not interactive */
            z-index: 1; /* Lower z-index than active */
        }

        .screen-content.active {
            opacity: 1;
            position: relative;
            pointer-events: auto; /* Make active screen interactive */
            z-index: 5; /* Higher z-index for active screen */
        }

        /* Pantalla de Inicio (Home Screen) */
        #omni-phone-home-screen {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%231a1a1a"/><circle cx="20" cy="20" r="4" fill="%23333"/><circle cx="50" cy="50" r="5" fill="%23555"/><circle cx="80" cy="80" r="6" fill="%23777"/></svg>') repeat;
            background-size: 15px 15px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            padding: 20px;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }

        .omni-app-icon {
            width: 60px;
            height: 60px;
            background-color: #333;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #fff;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            position: relative;
            z-index: 10; /* Ensure icons are clickable */
        }

        .omni-app-icon:hover {
            transform: scale(1.05);
            background-color: #444;
        }

        .omni-app-icon span {
            font-size: 12px;
            margin-top: 5px;
        }

        /* Formas de los iconos de aplicaciones usando CSS puro */
        .omni-app-icon.phone::before { content: ''; width: 25px; height: 25px; border: 2px solid #fff; border-radius: 3px; transform: rotate(-45deg); box-sizing: border-box; border-top-color: transparent; border-left-color: transparent; position: absolute; top: 15px; left: 17px; }
        .omni-app-icon.phone::after { content: ''; width: 3px; height: 10px; background-color: #fff; position: absolute; top: 25px; left: 28px; transform: rotate(-45deg); }
        .omni-app-icon.messages::before { content: ''; width: 30px; height: 20px; border: 2px solid #fff; border-radius: 5px; position: absolute; top: 15px; left: 15px; }
        .omni-app-icon.messages::after { content: ''; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #fff; position: absolute; top: 35px; left: 22px; }
        .omni-app-icon.settings::before { content: ''; width: 25px; height: 25px; border: 2px solid #fff; border-radius: 50%; position: absolute; top: 15px; left: 17px; animation: rotate 5s linear infinite; }
        .omni-app-icon.settings::after { content: ''; width: 4px; height: 12px; background-color: #fff; position: absolute; top: 19px; left: 27px; transform-origin: bottom; transform: rotate(45deg); }

        /* Pantalla de llamada */
        #omni-phone-call-screen, #omni-phone-message-screen {
            background-color: rgba(0,0,0,0.7);
            color: #eee;
            padding: 20px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 90%;
            max-height: 90%;
            box-sizing: border-box;
        }

        #call-status {
            font-size: 24px;
            margin-bottom: 20px;
            animation: incomingCallAnimation 1s infinite alternate;
        }

        #call-controls button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            margin: 0 10px;
            font-size: 30px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 10; /* Ensure buttons are clickable */
        }

        #call-controls button.answer { background-color: #4CAF50; }
        #call-controls button.answer:hover { background-color: #45a049; transform: scale(1.1); }
        #call-controls button.decline { background-color: #F44336; }
        #call-controls button.decline:hover { background-color: #d32f2f; transform: scale(1.1); }

        /* Pantalla de mensajes */
        #messages-list {
            width: 100%;
            height: 200px; /* Fixed height for the message list */
            background-color: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 10px;
            overflow-y: auto; /* Add scroll for messages */
            margin-bottom: 10px;
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 5px;
            box-sizing: border-box; /* Include padding in height calculation */
        }

        .message-bubble {
            background-color: #007bff;
            color: white;
            padding: 8px 12px;
            border-radius: 15px;
            max-width: 80%;
            word-wrap: break-word;
            align-self: flex-start;
        }

        .message-bubble.sent {
            align-self: flex-end;
            background-color: #28a745;
        }

        #message-input-container {
            display: flex;
            width: 100%;
            margin-top: 10px; /* Add some space above the input */
        }

        #message-input {
            flex-grow: 1;
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #555;
            background-color: #333;
            color: #eee;
            margin-right: 5px;
        }

        /* Replaced the send button with a sound button */
        #omni-message-sound-btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10; /* Ensure button is clickable */
            font-size: 20px; /* Adjust font size for icon */
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px; /* Fixed width for consistency */
        }
        #omni-message-sound-btn:hover { background-color: #0056b3; }

        /* Pie de página (botones de navegación) */
        #omni-phone-footer {
            height: 50px;
            background: linear-gradient(to top, #0d0d0d, #1a1a1a);
            border-bottom-left-radius: 32px;
            border-bottom-right-radius: 32px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 10px;
            z-index: 2;
        }

        .omni-nav-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #aaa;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
            position: relative;
            z-index: 10; /* Ensure buttons are clickable */
        }
        .omni-nav-button:hover {
            background-color: #555;
            transform: scale(1.1);
        }

        /* Iconos de botones de navegación (creados con CSS) */
        .omni-nav-button.home-btn::before { content: ''; width: 25px; height: 25px; border: 2px solid #aaa; border-radius: 50%; }
        .omni-nav-button.back-btn::before { content: ''; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-right: 10px solid #aaa; transform: translateX(-2px); }
        .omni-nav-button.recent-btn::before { content: ''; width: 18px; height: 18px; border: 2px solid #aaa; border-radius: 3px; }

        /* Botón para alternar visibilidad del teléfono */
        .omni-toggle-button {
            position: fixed;
            bottom: 20px;
            right: 330px;
            width: 50px;
            height: 50px;
            background-color: #4CAF50;
            color: white;
            border-radius: 50%;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 10001; /* Even higher z-index */
            box-shadow: 0 0 15px rgba(76, 175, 80, 0.7);
            animation: glowing 1.5s infinite alternate;
        }

        /* Partículas en pantalla */
        .omni-particle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            animation: particleFlow 2s forwards ease-out;
            pointer-events: none;
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    // --- Estructura HTML para el Teléfono ---
    const phoneContainer = document.createElement('div');
    phoneContainer.id = 'omni-phone-container';
    phoneContainer.innerHTML = `
        <div id="omni-phone-header">
            <div id="omni-phone-notch">
                <div id="omni-phone-camera"></div>
                <div id="omni-phone-speaker"></div>
                <div id="omni-phone-camera"></div>
            </div>
        </div>
        <div id="omni-phone-screen">
            <div id="omni-phone-home-screen" class="screen-content active">
                <div class="omni-app-icon phone" data-app="call"><span>Llamar</span></div>
                <div class="omni-app-icon messages" data-app="messages"><span>Mensajes</span></div>
                <div class="omni-app-icon settings" data-app="settings"><span>Ajustes</span></div>
            </div>
            <div id="omni-phone-call-screen" class="screen-content">
                <p id="call-status">Llamada entrante de:</p>
                <h2 id="caller-name">Número Desconocido</h2>
                <div id="call-controls">
                    <button class="answer" data-action="answer">📞</button>
                    <button class="decline" data-action="decline">❌</button>
                </div>
            </div>
            <div id="omni-phone-message-screen" class="screen-content">
                <h3>Mensajes</h3>
                <div id="messages-list">
                    <!-- Messages will be loaded here -->
                </div>
                <div id="message-input-container">
                    <input type="text" id="message-input" placeholder="Escribe un mensaje...">
                    <!-- Replaced send button with sound button -->
                    <button id="omni-message-sound-btn" data-action="playMelody">🎵</button>
                </div>
            </div>
            <div id="omni-phone-settings-screen" class="screen-content">
                <h3>Ajustes</h3>
                <p>Volumen: <input type="range" id="volume-control" min="0" max="1" step="0.1" value="0.1"></p>
                <p>Brillo: <input type="range" id="brightness-control" min="0" max="1" step="0.05" value="1"></p>
                <button id="easter-egg-btn" style="background-color: #673AB7; color: white; padding: 10px; border: none; border-radius: 5px; margin-top: 20px; cursor: pointer;">Activar Sorpresa 🎉</button>
            </div>
        </div>
        <div id="omni-phone-footer">
            <div class="omni-nav-button back-btn" data-nav="back"></div>
            <div class="omni-nav-button home-btn" data-nav="home"></div>
            <div class="omni-nav-button recent-btn" data-nav="recent"></div>
        </div>
    `;
    document.body.appendChild(phoneContainer);

    // Botón para mostrar/ocultar el teléfono
    const toggleButton = document.createElement('button');
    toggleButton.id = 'omni-toggle-button';
    toggleButton.innerHTML = '📱';
    document.body.appendChild(toggleButton);

    // --- Lógica JavaScript ---
    let currentScreen = 'home';
    const screenContents = document.querySelectorAll('.screen-content');
    const screenElement = document.getElementById('omni-phone-screen');
    const messagesList = document.getElementById('messages-list');
    const messageInput = document.getElementById('message-input');
    const soundBtn = document.getElementById('omni-message-sound-btn'); // Get the new sound button
    const volumeControl = document.getElementById('volume-control');
    const brightnessControl = document.getElementById('brightness-control');
    const easterEggBtn = document.getElementById('easter-egg-btn');

    // --- Draggable Functionality ---
    let isDragging = false;
    let offsetX, offsetY;

    phoneContainer.addEventListener('mousedown', (e) => {
        if (e.target === phoneContainer || e.target.closest('#omni-phone-header')) {
            isDragging = true;
            phoneContainer.classList.add('dragging');

            offsetX = e.clientX - phoneContainer.getBoundingClientRect().left;
            offsetY = e.clientY - phoneContainer.getBoundingClientRect().top;

            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        phoneContainer.style.left = `${e.clientX - offsetX}px`;
        phoneContainer.style.top = `${e.clientY - offsetY}px`;
        phoneContainer.style.transition = 'none';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            phoneContainer.classList.remove('dragging');
            phoneContainer.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        }
    });

    phoneContainer.ondragstart = function() { return false; };

    // Muestra la pantalla especificada
    function showScreen(screenId) {
        screenContents.forEach(screen => {
            screen.classList.remove('active');
        });
        const nextScreen = document.getElementById(`omni-phone-${screenId}-screen`);
        if(nextScreen) {
            nextScreen.classList.add('active');
            currentScreen = screenId;
        } else {
            console.error(`Screen with ID: omni-phone-${screenId}-screen not found.`);
            showScreen('home');
        }
        playTone(660, 0.08, 'sine', 0.05);
    }

    // Ensure the home screen is active on load
    showScreen('home');

    // Handle clicks on app icons
    document.querySelectorAll('.omni-app-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const app = this.dataset.app;
            if (app === 'call') {
                triggerIncomingCall();
            } else if (app === 'messages') {
                showScreen('messages');
                if (messagesList.children.length === 0) {
                    addMessage("¡Bienvenido a tus mensajes!", "received");
                }
            }
             else {
                showScreen(app);
            }
        });
    });

    // Handle clicks on navigation buttons
    document.querySelectorAll('.omni-nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const nav = this.dataset.nav;
            if (nav === 'home') {
                showScreen('home');
            } else if (nav === 'back') {
                if (currentScreen !== 'home') {
                    showScreen('home');
                }
            } else if (nav === 'recent') {
                showScreen('home');
            }
        });
    });

    // Toggle phone visibility
    toggleButton.addEventListener('click', () => {
        phoneContainer.classList.toggle('minimized');
        toggleButton.textContent = phoneContainer.classList.contains('minimized') ? '▶' : '📱';
        playTone(700, 0.1, 'square', 0.08);
    });

    // --- Simulated Call Logic ---
    let callTimeout;
    let ringtoneOscillator;

    function triggerIncomingCall() {
        showScreen('call');
        const callerName = "Número Desconocido";
        document.getElementById('caller-name').textContent = callerName;
        document.getElementById('call-status').textContent = "Llamada entrante de:";
        playRingtone();

        callTimeout = setTimeout(() => {
            document.getElementById('call-status').textContent = "Llamada perdida.";
            stopRingtone();
            setTimeout(() => showScreen('home'), 2000);
        }, 15000);
    }

    function playRingtone() {
        if (ringtoneOscillator) stopRingtone();

        ringtoneOscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        ringtoneOscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        ringtoneOscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(volumeControl.value * 0.5, audioContext.currentTime);

        let time = audioContext.currentTime;
        ringtoneOscillator.frequency.setValueAtTime(800, time);
        gainNode.gain.linearRampToValueAtTime(0.01, time + 0.5);
        time += 0.5;
        ringtoneOscillator.frequency.setValueAtTime(600, time);
        gainNode.gain.linearRampToValueAtTime(volumeControl.value * 0.5, time + 0.5);
        time += 0.5;

        setInterval(() => {
            let loopTime = audioContext.currentTime;
            ringtoneOscillator.frequency.setValueAtTime(800, loopTime);
            gainNode.gain.setValueAtTime(volumeControl.value * 0.5, loopTime);
            gainNode.gain.linearRampToValueAtTime(0.01, loopTime + 0.5);
            loopTime += 0.5;
            ringtoneOscillator.frequency.setValueAtTime(600, loopTime);
            gainNode.gain.linearRampToValueAtTime(volumeControl.value * 0.5, loopTime + 0.5);
        }, 1000);

        ringtoneOscillator.start();
    }

    function stopRingtone() {
        if (ringtoneOscillator) {
            ringtoneOscillator.stop();
            ringtoneOscillator.disconnect();
            ringtoneOscillator = null;
        }
        if (callTimeout) {
            clearTimeout(callTimeout);
            callTimeout = null;
        }
    }

    document.querySelector('#call-controls .answer').addEventListener('click', () => {
        stopRingtone();
        document.getElementById('call-status').textContent = "Llamada en curso...";
        playTone(1000, 0.2, 'sine', 0.1);
        setTimeout(() => showScreen('home'), 3000);
    });

    document.querySelector('#call-controls .decline').addEventListener('click', () => {
        stopRingtone();
        document.getElementById('call-status').textContent = "Llamada finalizada.";
        playTone(200, 0.3, 'sawtooth', 0.1);
        setTimeout(() => showScreen('home'), 1000);
    });

    // --- Message Logic ---
    function addMessage(text, type = 'received') {
        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble', type);
        bubble.textContent = text;
        messagesList.appendChild(bubble);
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    // This function will now trigger the melody instead of sending a message
    function handleSoundButton() {
        playMelody();
    }

    // Event listener for the new sound button
    soundBtn.addEventListener('click', handleSoundButton);

    // --- Settings Logic ---
    volumeControl.addEventListener('input', (e) => {
        playTone(500, 0.1, 'sine', e.target.value * 0.8);
    });

    brightnessControl.addEventListener('input', (e) => {
        screenElement.style.filter = `brightness(${e.target.value})`;
    });

    // --- Particle Effects ---
    function createParticle(event) {
        const particle = document.createElement('div');
        particle.classList.add('omni-particle');
        screenElement.appendChild(particle);

        const rect = screenElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${Math.random() * 5 + 3}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.5;

        const targetX = (Math.random() - 0.5) * 100 + x;
        const targetY = (Math.random() - 0.5) * 100 + y;

        particle.style.setProperty('--x', `${targetX - x}px`);
        particle.style.setProperty('--y', `${targetY - y}px`);

        setTimeout(() => {
            particle.remove();
        }, 2000);
    }

    screenElement.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) {
            createParticle(e);
        }
    });

    // --- Easter Egg ---
    let surpriseActive = false;
    let surpriseInterval;

    easterEggBtn.addEventListener('click', () => {
        surpriseActive = !surpriseActive;
        if (surpriseActive) {
            easterEggBtn.textContent = 'Desactivar Sorpresa 😔';
            startSurpriseEffect();
            playTone(1500, 0.5, 'sawtooth', 0.2);
        } else {
            easterEggBtn.textContent = 'Activar Sorpresa 🎉';
            stopSurpriseEffect();
            playTone(300, 0.5, 'square', 0.2);
        }
    });

    function startSurpriseEffect() {
        surpriseInterval = setInterval(() => {
            const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff8800', '#8800ff'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            phoneContainer.style.boxShadow = `0 0 30px ${randomColor}, inset 0 0 15px rgba(255,255,255,0.1)`;
            phoneContainer.style.background = `linear-gradient(to bottom right, ${randomColor}cc, ${randomColor}88)`;

            const appIcons = document.querySelectorAll('.omni-app-icon');
            if (appIcons.length > 0) {
                const randomIcon = appIcons[Math.floor(Math.random() * appIcons.length)];
                randomIcon.style.animation = 'glowing 1s infinite alternate';
                setTimeout(() => {
                    randomIcon.style.animation = 'none';
                }, 800);
            }
        }, 500);
    }

    function stopSurpriseEffect() {
        clearInterval(surpriseInterval);
        phoneContainer.style.boxShadow = '0 0 30px rgba(0,0,0,0.8), inset 0 0 15px rgba(255,255,255,0.1)';
        phoneContainer.style.background = 'linear-gradient(to bottom right, #2c2c2c, #1a1a1a)';
        document.querySelectorAll('.omni-app-icon').forEach(icon => {
            icon.style.animation = 'none';
        });
    }

    // --- Pseudo-3D Effect (Tilt with mouse) ---
    phoneContainer.addEventListener('mousemove', (e) => {
        const rect = phoneContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = (e.clientY - centerY) / rect.height * -10;
        const rotateY = (e.clientX - centerX) / rect.width * 10;

        phoneContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
    });

    phoneContainer.addEventListener('mouseleave', () => {
        phoneContainer.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });

    // Initial brightness setting
    screenElement.style.filter = `brightness(${brightnessControl.value})`;

    console.log("Drawaria OmniPhone script loaded successfully!");
})();