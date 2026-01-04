// ==UserScript==
// @name         Donkey Kong Bananza for Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A highly ambitious, procedural Tampermonkey script for Drawaria.online, injecting Donkey Kong Bananza elements: complex UI, character animations, advanced particles, generative music, and more, all without external assets. Corrected audio errors.
// @author       AI (Ambitious Intelligence)
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/543068/Donkey%20Kong%20Bananza%20for%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/543068/Donkey%20Kong%20Bananza%20for%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuración Global ---
    const config = {
        maxBgElements: 30, // Más elementos de fondo
        maxParticles: 100, // Más partículas para efectos
        bananaPerLevel: 25, // Plátanos necesarios para subir de nivel
        characterSpawnInterval: 15000, // Intervalo para que aparezcan los personajes (ms)
        characterMoveSpeed: 1, // Velocidad de movimiento de los personajes (px/frame)
        musicVolume: 0.3, // Volumen inicial de la música (0.0 a 1.0)
    };

    // --- Colores y Estilos DK ---
    const DK_COLORS = {
        brownDark: '#4A2B18',
        brownMedium: '#5C3A21',
        brownLight: '#7B5F45',
        yellowBanana: '#FFD700',
        yellowGold: '#FFAC33',
        greenJungle: '#228B22',
        redStrong: '#B22222',
        blueSky: '#4682B4',
        darkGrey: '#222',
        lightGrey: '#AAA',
        white: '#FFF',
        black: '#000',
        goldShine: '#FFFACD',
        paulineRed: '#DC143C',
        paulineHair: '#3A1E00',
        paulineSkin: '#F5DEB3',
    };

    // --- 1. Inyección de CSS (Global y Elementos Específicos) ---
    function injectGlobalCSS() {
        const style = document.createElement('style');
        style.id = 'dk-bananza-ultimate-style';
        style.innerHTML = `
            :root {
                --dk-brown-dark: ${DK_COLORS.brownDark};
                --dk-brown-medium: ${DK_COLORS.brownMedium};
                --dk-brown-light: ${DK_COLORS.brownLight};
                --dk-yellow-banana: ${DK_COLORS.yellowBanana};
                --dk-yellow-gold: ${DK_COLORS.yellowGold};
                --dk-green-jungle: ${DK_COLORS.greenJungle};
                --dk-red-strong: ${DK_COLORS.redStrong};
                --dk-blue-sky: ${DK_COLORS.blueSky};
                --dk-dark-grey: ${DK_COLORS.darkGrey};
                --dk-light-grey: ${DK_COLORS.lightGrey};
                --dk-white: ${DK_COLORS.white};
                --dk-black: ${DK_COLORS.black};
                --dk-gold-shine: ${DK_COLORS.goldShine};
                --dk-pauline-red: ${DK_COLORS.paulineRed};
                --dk-pauline-hair: ${DK_COLORS.paulineHair};
                --dk-pauline-skin: ${DK_COLORS.paulineSkin};
            }

            /* Custom Cursor */
            body {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 100 100"><g><circle cx="50" cy="50" r="45" fill="${DK_COLORS.brownDark}"/><rect x="30" y="20" width="40" height="60" rx="10" ry="10" fill="${DK_COLORS.brownMedium}"/><path d="M50 10 L65 30 L35 30 Z" fill="${DK_COLORS.brownLight}"/><rect x="45" y="40" width="10" height="30" rx="3" ry="3" fill="${DK_COLORS.black}" opacity="0.2"/><text x="50" y="65" font-family="monospace" font-size="30" fill="${DK_COLORS.yellowBanana}" text-anchor="middle" font-weight="bold">B</text></g></svg>') 15 15, auto !important;
            }
            button, a, input[type="text"] {
                cursor: pointer !important; /* Mantener cursor de puntero para interacción */
            }

            /* Contenedor principal para la interfaz de usuario de Bananza */
            #dk-bananza-hud {
                position: fixed;
                top: 20px;
                right: 20px; /* Cambiado a la derecha para no chocar con elementos preexistentes */
                background: linear-gradient(160deg, var(--dk-brown-dark) 0%, var(--dk-brown-medium) 50%, var(--dk-brown-light) 100%);
                border: 4px solid var(--dk-dark-grey);
                border-radius: 25px;
                padding: 25px 30px;
                font-family: 'Press Start 2P', cursive; /* Fuente retro si está disponible, o fallback */
                color: var(--dk-yellow-gold);
                z-index: 10000;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255, 255, 255, 0.4);
                transition: transform 0.3s ease-in-out, box-shadow 0.2s ease-in-out;
                cursor: grab;
                background-size: 200% 200%;
                animation: backgroundPan 15s infinite alternate ease-in-out;
                width: 280px; /* Ancho fijo para consistencia */
                text-align: center;
                overflow: hidden; /* Para contener los elementos internos */
            }

            #dk-bananza-hud::before { /* Borde interno brillante */
                content: '';
                position: absolute;
                top: 5px;
                left: 5px;
                right: 5px;
                bottom: 5px;
                border: 2px dashed rgba(255, 255, 255, 0.3);
                border-radius: 20px;
                pointer-events: none;
            }


            #dk-bananza-hud:hover {
                box-shadow: 0 12px 30px rgba(0, 0, 0, 1), inset 0 0 25px rgba(255, 255, 255, 0.5);
            }

            #dk-bananza-hud:active {
                cursor: grabbing;
                transform: scale(0.99);
            }

            #dk-bananza-hud h2 {
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 26px;
                text-align: center;
                text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9), 0 0 18px var(--dk-gold-shine);
                animation: pulse 2s infinite alternate ease-in-out, neonGlow 2.5s infinite alternate;
                letter-spacing: 2px;
                line-height: 1.2;
                position: relative;
            }

            #dk-bananza-hud h2::after {
                content: '¡EXPLOSIÓN DE SABOR!';
                display: block;
                font-size: 14px;
                color: var(--dk-white);
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                margin-top: 5px;
            }


            .dk-section {
                background-color: rgba(0, 0, 0, 0.4);
                border: 2px solid var(--dk-dark-grey);
                border-radius: 15px;
                padding: 15px;
                margin-bottom: 20px;
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 0 5px 15px rgba(0, 0, 0, 0.7);
            }

            #banana-stats {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            #banana-counter-display {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                font-weight: bold;
                text-shadow: 5px 5px 10px rgba(0, 0, 0, 0.9), 0 0 12px var(--dk-yellow-banana);
                margin-bottom: 10px;
            }

            .banana-icon-lg {
                width: 50px;
                height: 50px;
                margin-right: 15px;
                background-color: var(--dk-yellow-banana);
                border-radius: 0 70% 70% 0 / 0 45% 45% 0;
                position: relative;
                transform: rotate(-25deg);
                box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.7), inset 0 0 10px rgba(255, 255, 255, 0.6);
                animation: bobbing 1.8s infinite ease-in-out, colorShift 5s infinite alternate;
            }

            .banana-icon-lg::before {
                content: '';
                position: absolute;
                top: -10px;
                left: -4px;
                width: 12px;
                height: 12px;
                background-color: var(--dk-brown-dark);
                border-radius: 50%;
                transform: rotate(45deg);
                box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
            }

            #banana-level-progress {
                width: 90%;
                height: 25px;
                background-color: var(--dk-dark-grey);
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid var(--dk-black);
                box-shadow: inset 0 0 8px rgba(0,0,0,0.8);
                margin-top: 10px;
            }

            #banana-progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, var(--dk-green-jungle), var(--dk-yellow-banana), var(--dk-green-jungle));
                background-size: 200% 100%;
                border-radius: 12px;
                transition: width 0.5s ease-out, background-position 0.5s ease-out;
                position: relative;
                animation: progressBarShine 2s infinite linear;
            }

            #banana-progress-bar::after {
                content: attr(data-label);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: var(--dk-black);
                font-size: 14px;
                font-weight: bold;
                text-shadow: 1px 1px 2px var(--dk-white);
            }

            .dk-button {
                background: linear-gradient(180deg, var(--dk-green-jungle) 0%, #3CB371 100%);
                color: white;
                border: 3px solid var(--dk-dark-grey);
                padding: 12px 25px;
                border-radius: 15px;
                cursor: pointer;
                font-weight: bold;
                font-size: 18px;
                text-transform: uppercase;
                box-shadow: 4px 4px 10px rgba(0,0,0,0.7), inset 0 0 12px rgba(255,255,255,0.5);
                transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
                display: block;
                width: calc(100% - 6px);
                text-align: center;
                margin-top: 15px;
                letter-spacing: 1px;
            }

            .dk-button:hover {
                background: linear-gradient(180deg, #3CB371 0%, var(--dk-green-jungle) 100%);
                transform: translateY(-3px);
                box-shadow: 6px 6px 15px rgba(0,0,0,0.9), inset 0 0 18px rgba(255,255,255,0.7);
            }

            .dk-button:active {
                background: var(--dk-brown-dark);
                transform: translateY(0);
                box-shadow: 2px 2px 5px rgba(0,0,0,0.6);
            }

            /* Sección de Audio */
            #audio-controls {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            #music-toggle-btn {
                background: linear-gradient(180deg, var(--dk-blue-sky) 0%, #6A5ACD 100%);
                border: 3px solid var(--dk-dark-grey);
                color: white;
                padding: 10px 20px;
                border-radius: 15px;
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 10px;
                box-shadow: 3px 3px 8px rgba(0,0,0,0.6);
                transition: background 0.2s;
            }
            #music-toggle-btn.active {
                background: linear-gradient(180deg, #6A5ACD 0%, var(--dk-blue-sky) 100%);
            }
            #music-toggle-btn:hover {
                transform: translateY(-2px);
            }

            #music-volume-slider {
                width: 90%;
                -webkit-appearance: none;
                height: 10px;
                background: var(--dk-dark-grey);
                outline: none;
                border-radius: 5px;
                box-shadow: inset 0 0 5px rgba(0,0,0,0.8);
            }

            #music-volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--dk-yellow-gold);
                cursor: pointer;
                border: 3px solid var(--dk-dark-grey);
                box-shadow: 1px 1px 5px rgba(0,0,0,0.6);
            }

            /* Elementos de fondo animados (ej. plátanos cayendo) */
            .dk-bg-element {
                position: fixed;
                background-color: var(--dk-yellow-banana);
                border-radius: 0 55% 55% 0 / 0 35% 35% 0;
                animation: fallRotate linear infinite;
                opacity: 0.8;
                z-index: -1;
                pointer-events: none;
                box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
            }

            /* Lienzos para partículas y efectos */
            #dk-particle-canvas, #dk-barrel-canvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9999;
            }
            #dk-barrel-canvas {
                z-index: 9998; /* Un poco por debajo de las partículas normales */
            }

            /* === Character Styles (Procedural CSS) === */
            .dk-character {
                position: fixed;
                z-index: 1000;
                transform-style: preserve-3d;
                transition: transform 0.1s linear; /* Para el movimiento horizontal suave */
                cursor: pointer;
                /*outline: 1px solid red; /* Debug */
            }

            /* Donkey Kong */
            .dk-character.donkey-kong {
                width: 100px;
                height: 100px;
                bottom: -100px; /* Empieza fuera de pantalla */
            }

            .dk-character.donkey-kong .body {
                width: 80px; height: 80px; background-color: var(--dk-brown-dark); border-radius: 50%;
                position: absolute; top: 20px; left: 10px;
                box-shadow: 0 5px 10px rgba(0,0,0,0.5);
            }
            .dk-character.donkey-kong .head {
                width: 60px; height: 60px; background-color: var(--dk-brown-dark); border-radius: 50%;
                position: absolute; top: 0; left: 20px;
                box-shadow: 0 3px 8px rgba(0,0,0,0.5);
            }
            .dk-character.donkey-kong .snout {
                width: 30px; height: 20px; background-color: var(--dk-brown-light); border-radius: 50%;
                position: absolute; top: 30px; left: 35px;
                border: 2px solid var(--dk-brown-dark);
            }
            .dk-character.donkey-kong .eye {
                width: 8px; height: 8px; background-color: var(--dk-white); border-radius: 50%;
                position: absolute; top: 25px;
                border: 1px solid var(--dk-black);
            }
            .dk-character.donkey-kong .eye.left { left: 40px; }
            .dk-character.donkey-kong .eye.right { left: 55px; }
            .dk-character.donkey-kong .pupil {
                width: 4px; height: 4px; background-color: var(--dk-black); border-radius: 50%;
                position: absolute; top: 27px;
            }
            .dk-character.donkey-kong .pupil.left { left: 42px; }
            .dk-character.donkey-kong .pupil.right { left: 57px; }

            /* Pauline */
            .dk-character.pauline {
                width: 60px;
                height: 120px;
                bottom: -120px; /* Empieza fuera de pantalla */
            }
            .dk-character.pauline .head {
                width: 40px; height: 40px; background-color: var(--dk-pauline-skin); border-radius: 50%;
                position: absolute; top: 0; left: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }
            .dk-character.pauline .hair {
                width: 50px; height: 30px; background-color: var(--dk-pauline-hair); border-radius: 50% / 100% 100% 0 0;
                position: absolute; top: 0; left: 5px;
                transform: rotate(-10deg);
                box-shadow: inset 0 3px 5px rgba(0,0,0,0.3);
            }
            .dk-character.pauline .dress {
                width: 55px; height: 70px; background-color: var(--dk-pauline-red); border-radius: 0 0 20px 20px;
                position: absolute; top: 40px; left: 2.5px;
                box-shadow: 0 5px 10px rgba(0,0,0,0.5);
                clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%); /* Forma de vestido */
            }
            .dk-character.pauline .belt {
                width: 45px; height: 8px; background-color: var(--dk-black);
                position: absolute; top: 45px; left: 7.5px;
            }
            .dk-character.pauline .eye {
                width: 5px; height: 5px; background-color: var(--dk-black); border-radius: 50%;
                position: absolute; top: 15px;
            }
            .dk-character.pauline .eye.left { left: 20px; }
            .dk-character.pauline .eye.right { left: 35px; }

            /* Keyframe Animations */
            @keyframes pulse {
                0% { transform: scale(1); text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9), 0 0 18px var(--dk-gold-shine); }
                50% { transform: scale(1.02); text-shadow: 5px 5px 10px rgba(0, 0, 0, 1), 0 0 22px var(--dk-gold-shine); }
                100% { transform: scale(1); text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.9), 0 0 18px var(--dk-gold-shine); }
            }

            @keyframes neonGlow {
                0%, 100% { filter: brightness(1) drop-shadow(0 0 8px var(--dk-yellow-gold)); }
                50% { filter: brightness(1.3) drop-shadow(0 0 20px var(--dk-gold-shine)); }
            }

            @keyframes bobbing {
                0%, 100% { transform: translateY(0) rotate(-25deg); }
                50% { transform: translateY(-7px) rotate(-28deg); }
            }

            @keyframes colorShift {
                0%, 100% { background-color: var(--dk-yellow-banana); }
                50% { background-color: var(--dk-yellow-gold); }
            }

            @keyframes fallRotate {
                0% { transform: translateY(-150px) rotate(0deg) scale(0.7); opacity: 0; }
                10% { opacity: 0.8; }
                100% { transform: translateY(calc(100vh + 150px)) rotate(1440deg) scale(1.5); opacity: 0; }
            }

            @keyframes backgroundPan {
                0% { background-position: 0% 50%; }
                100% { background-position: 100% 50%; }
            }

            @keyframes progressBarShine {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            @keyframes characterWalk {
                0% { transform: translateY(0); }
                25% { transform: translateY(-5px); }
                50% { transform: translateY(0); }
                75% { transform: translateY(5px); }
                100% { transform: translateY(0); }
            }

            @keyframes characterPop {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.3); opacity: 0.7; }
                100% { transform: scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Intentar cargar la fuente "Press Start 2P" desde Google Fonts para mejor estética
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    }

    // --- 2. Creación del HUD de Bananza (Ampliación) ---
    let bananaCount = 0;
    let bananaLevel = 1;

    function createHUD() {
        const hud = document.createElement('div');
        hud.id = 'dk-bananza-hud';
        hud.innerHTML = `
            <h2>Donkey Kong Bananza!</h2>

            <div class="dk-section" id="banana-stats">
                <h3>Recuento de Plátanos</h3>
                <div id="banana-counter-display">
                    <span class="banana-icon-lg"></span>
                    <span id="banana-count-value">0</span>
                </div>
                <div id="banana-level-progress">
                    <div id="banana-progress-bar" data-label="Nivel 1 (0/${config.bananaPerLevel})"></div>
                </div>
            </div>

            <div class="dk-section" id="actions-section">
                <button id="collect-banana-btn" class="dk-button">
                    ¡Recoge Plátano!
                </button>
                <button id="trigger-barrel-blast-btn" class="dk-button" style="display:none;">
                    ¡Barrel Blast!
                </button>
            </div>

            <div class="dk-section" id="audio-controls">
                <h3>Música Selvática</h3>
                <button id="music-toggle-btn" class="dk-button active">
                    <span class="music-icon">🎵</span> Música ON
                </button>
                <input type="range" id="music-volume-slider" min="0" max="1" step="0.01" value="${config.musicVolume}">
            </div>
        `;
        document.body.appendChild(hud);

        const bananaCountValue = document.getElementById('banana-count-value');
        const bananaProgressBar = document.getElementById('banana-progress-bar');
        const collectButton = document.getElementById('collect-banana-btn');
        const triggerBlastButton = document.getElementById('trigger-barrel-blast-btn');
        const musicToggleButton = document.getElementById('music-toggle-btn');
        const musicVolumeSlider = document.getElementById('music-volume-slider');

        // Inicializar la barra de progreso
        updateBananaProgress();

        collectButton.addEventListener('click', () => {
            bananaCount++;
            bananaCountValue.textContent = bananaCount;
            triggerCoinSound();
            triggerBananaParticles();
            updateBananaProgress();
            // Pequeño efecto visual al contador
            bananaCountValue.style.transform = 'scale(1.2)';
            bananaCountValue.style.transition = 'transform 0.1s ease-out';
            setTimeout(() => {
                bananaCountValue.style.transform = 'scale(1)';
            }, 100);
        });

        triggerBlastButton.addEventListener('click', () => {
            triggerBarrelBlast();
            triggerBlastButton.style.display = 'none'; // Ocultar después de usar
            triggerBlastButton.style.animation = ''; // Limpiar animación
        });

        // Música
        musicToggleButton.addEventListener('click', () => {
            if (backgroundMusic.isStarted) {
                backgroundMusic.stop();
                musicToggleButton.classList.remove('active');
                musicToggleButton.innerHTML = '<span class="music-icon">🔇</span> Música OFF';
            } else {
                backgroundMusic.play(); // CORRECCIÓN: Llamar a .play()
                musicToggleButton.classList.add('active');
                musicToggleButton.innerHTML = '<span class="music-icon">🎵</span> Música ON';
            }
        });

        musicVolumeSlider.addEventListener('input', (e) => {
            config.musicVolume = parseFloat(e.target.value);
            if (backgroundMusic.gainNode) {
                backgroundMusic.gainNode.gain.setValueAtTime(config.musicVolume, audioContext.currentTime);
            }
        });


        // Hacer el HUD arrastrable
        let isDragging = false;
        let offsetX, offsetY;

        hud.addEventListener('mousedown', (e) => {
            isDragging = true;
            hud.style.cursor = 'grabbing';
            offsetX = e.clientX - hud.getBoundingClientRect().left;
            offsetY = e.clientY - hud.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            hud.style.left = `${e.clientX - offsetX}px`;
            hud.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            hud.style.cursor = 'grab';
        });

        function updateBananaProgress() {
            const progress = bananaCount % config.bananaPerLevel;
            const percentage = (progress / config.bananaPerLevel) * 100;
            bananaProgressBar.style.width = `${percentage}%`;
            bananaProgressBar.setAttribute('data-label', `Nivel ${bananaLevel} (${progress}/${config.bananaPerLevel})`);

            // Check if a new level is reached and it's not the initial 0 bananas
            if (bananaCount > 0 && progress === 0 && bananaCount / config.bananaPerLevel === bananaLevel) {
                levelUp();
            }
        }

        function levelUp() {
            bananaLevel++;
            console.log(`¡Nivel ${bananaLevel} alcanzado!`);
            // Efecto visual de nivel
            bananaCountValue.style.animation = 'pulse 0.5s 3 alternate';
            bananaCountValue.style.color = DK_COLORS.yellowGold;
            setTimeout(() => {
                bananaCountValue.style.animation = '';
                bananaCountValue.style.color = '';
            }, 1500);

            // Sonido de nivel
            triggerLevelUpSound();

            // Activar Barrel Blast
            triggerBlastButton.style.display = 'block';
            triggerBlastButton.style.animation = 'pulse 1s infinite alternate';
        }
    }

    // --- 3. Web Audio API para sonidos simples y música (sin .mp3) ---
    let audioContext;
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function triggerCoinSound() {
        initAudioContext();
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'triangle';
        const now = audioContext.currentTime;
        oscillator.frequency.setValueAtTime(880, now);
        gainNode.gain.setValueAtTime(0.7, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        oscillator.start(now); // CORRECCIÓN: Asegurar que start() se llama antes y con tiempo explícito
        oscillator.stop(now + 0.2);
    }

    function triggerLevelUpSound() {
        initAudioContext();
        if (!audioContext) return;

        const now = audioContext.currentTime;
        const o1 = audioContext.createOscillator();
        const g1 = audioContext.createGain();
        o1.connect(g1);
        g1.connect(audioContext.destination);
        o1.type = 'sine';

        o1.frequency.setValueAtTime(500, now);
        g1.gain.setValueAtTime(0.5, now);
        o1.frequency.linearRampToValueAtTime(1000, now + 0.2);
        g1.gain.linearRampToValueAtTime(0, now + 0.5);
        o1.start(now);
        o1.stop(now + 0.5);

        const o2 = audioContext.createOscillator();
        const g2 = audioContext.createGain();
        o2.connect(g2);
        g2.connect(audioContext.destination);
        o2.type = 'triangle';
        o2.frequency.setValueAtTime(800, now + 0.1);
        g2.gain.setValueAtTime(0.4, now + 0.1);
        o2.frequency.linearRampToValueAtTime(1500, now + 0.3);
        g2.gain.linearRampToValueAtTime(0, now + 0.6);
        o2.start(now + 0.1);
        o2.stop(now + 0.6);
    }

    // Música de fondo generativa (melodía simple)
    const backgroundMusic = {
        isStarted: false,
        oscillatorNodes: [],
        gainNode: null,
        loopTimeout: null, // Para manejar el timeout del loop

        play: function() { // CORRECCIÓN: La función se llama 'play'
            initAudioContext();
            if (this.isStarted || !audioContext) return;
            this.isStarted = true;

            this.gainNode = audioContext.createGain();
            this.gainNode.gain.setValueAtTime(config.musicVolume, audioContext.currentTime);
            this.gainNode.connect(audioContext.destination);

            const tempo = 120; // BPM
            const beat = 60 / tempo; // Duración de un cuarto de nota en segundos

            const melody = [
                // Simulación de una melodía simple tipo DK
                { note: 392, duration: 0.5 }, { note: 440, duration: 0.5 }, { note: 392, duration: 0.5 }, { note: 349, duration: 0.5 }, // G4, A4, G4, F4
                { note: 523, duration: 0.5 }, { note: 440, duration: 0.5 }, { note: 392, duration: 1 }, // C5, A4, G4
                { note: 392, duration: 0.5 }, { note: 440, duration: 0.5 }, { note: 392, duration: 0.5 }, { note: 349, duration: 0.5 },
                { note: 494, duration: 0.5 }, { note: 392, duration: 0.5 }, { note: 330, duration: 1 }, // B4, G4, E4
            ];

            let currentTime = audioContext.currentTime;
            let totalMelodyDuration = 0; // Calcular la duración total de la melodía

            const playNote = (frequency, duration) => {
                const osc = audioContext.createOscillator();
                osc.type = 'square'; // Un sonido más 'pixelado'
                osc.frequency.setValueAtTime(frequency, currentTime);

                const noteGain = audioContext.createGain();
                noteGain.gain.setValueAtTime(1, currentTime);
                noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration * 0.9); // Decay

                osc.connect(noteGain);
                noteGain.connect(this.gainNode);

                osc.start(currentTime);
                osc.stop(currentTime + duration);
                this.oscillatorNodes.push(osc); // Mantener referencia para detener
            };

            melody.forEach(phrase => {
                const noteDuration = phrase.duration * beat;
                playNote(phrase.note, noteDuration);
                currentTime += noteDuration;
                totalMelodyDuration += noteDuration;
            });

            // Loop la melodía
            this.loopTimeout = setTimeout(() => {
                if (this.isStarted) {
                    this.play(); // Reiniciar la reproducción
                }
            }, totalMelodyDuration * 1000); // Duración total en ms
        },
        stop: function() {
            this.isStarted = false;
            clearTimeout(this.loopTimeout);
            this.oscillatorNodes.forEach(osc => {
                try {
                    // Solo detener si el oscilador está en un estado válido (PENDING o PLAYING)
                    if (osc.playbackState === AudioBufferSourceNode.PLAYING || osc.playbackState === AudioBufferSourceNode.SCHEDULED) {
                        osc.stop();
                    }
                } catch (e) {
                    //console.warn("Error stopping oscillator:", e); // Para depuración, si ocurre alguna excepción
                }
            });
            this.oscillatorNodes = [];
            if (this.gainNode) {
                this.gainNode.disconnect();
                this.gainNode = null;
            }
        }
    };


    // --- 4. Canvas para efectos de partículas (mejorado) ---
    let particleCanvas, particleCtx;
    const particles = [];

    function initParticleCanvas() {
        particleCanvas = document.createElement('canvas');
        particleCanvas.id = 'dk-particle-canvas';
        document.body.appendChild(particleCanvas);
        particleCtx = particleCanvas.getContext('2d');
        resizeCanvas(particleCanvas);
        window.addEventListener('resize', () => resizeCanvas(particleCanvas));
        requestAnimationFrame(animateParticles);
    }

    function resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor(x, y, type = 'banana') {
            this.x = x;
            this.y = y;
            this.type = type;
            this.size = Math.random() * 8 + 3;
            this.speedX = (Math.random() - 0.5) * 8;
            this.speedY = Math.random() * -10 - 2;
            this.gravity = 0.3;
            this.alpha = 1;
            this.decay = Math.random() * 0.04 + 0.01;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.3;

            if (type === 'banana') {
                this.color = DK_COLORS.yellowBanana;
            } else if (type === 'star') {
                this.color = DK_COLORS.goldShine;
            } else if (type === 'sparkle') {
                this.color = `rgba(255, 255, 255, ${this.alpha})`;
                this.size = Math.random() * 3 + 1;
                this.speedX *= 0.5;
                this.speedY *= 0.5;
                this.gravity = 0.1;
                this.decay = Math.random() * 0.08 + 0.02;
            }
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= this.decay;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            particleCtx.save();
            particleCtx.globalAlpha = this.alpha;
            particleCtx.fillStyle = this.color;
            particleCtx.translate(this.x, this.y);
            particleCtx.rotate(this.rotation);

            if (this.type === 'banana') {
                particleCtx.beginPath();
                particleCtx.moveTo(0, -this.size * 0.7);
                particleCtx.bezierCurveTo(this.size * 0.8, -this.size * 0.7, this.size * 0.8, this.size * 0.7, 0, this.size * 0.7);
                particleCtx.bezierCurveTo(-this.size * 0.4, this.size * 0.4, -this.size * 0.4, -this.size * 0.4, 0, -this.size * 0.7);
                particleCtx.fill();
            } else if (this.type === 'star') {
                // Dibujar una estrella de 5 puntas
                const outerRadius = this.size;
                const innerRadius = this.size / 2;
                particleCtx.beginPath();
                for (let i = 0; i < 5; i++) {
                    let angle = Math.PI / 2 + (i * 2 * Math.PI / 5);
                    particleCtx.lineTo(outerRadius * Math.cos(angle), outerRadius * Math.sin(angle));
                    angle += Math.PI / 5;
                    particleCtx.lineTo(innerRadius * Math.cos(angle), innerRadius * Math.sin(angle));
                }
                particleCtx.closePath();
                particleCtx.fill();
            } else if (this.type === 'sparkle') {
                // Pequeño círculo brillante
                particleCtx.beginPath();
                particleCtx.arc(0, 0, this.size, 0, Math.PI * 2);
                particleCtx.fill();
            }
            particleCtx.restore();
        }
    }

    function triggerBananaParticles() {
        const hudRect = document.getElementById('dk-bananza-hud').getBoundingClientRect();
        const startX = hudRect.left + hudRect.width / 2;
        const startY = hudRect.top + hudRect.height / 2;

        for (let i = 0; i < 20; i++) {
            if (particles.length < config.maxParticles) {
                particles.push(new Particle(startX, startY, 'banana'));
            }
        }
    }

    function animateParticles() {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.alpha <= 0.02 || p.y > particleCanvas.height + p.size) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animateParticles);
    }

    // --- 5. Barrel Blast Canvas y Efecto ---
    let barrelCanvas, barrelCtx;
    const barrels = [];

    function initBarrelCanvas() {
        barrelCanvas = document.createElement('canvas');
        barrelCanvas.id = 'dk-barrel-canvas';
        document.body.appendChild(barrelCanvas);
        barrelCtx = barrelCanvas.getContext('2d');
        resizeCanvas(barrelCanvas);
        window.addEventListener('resize', () => resizeCanvas(barrelCanvas));
        requestAnimationFrame(animateBarrels);
    }

    class Barrel {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.speedX = (Math.random() - 0.5) * 15;
            this.speedY = Math.random() * -20 - 5;
            this.gravity = 0.8;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.5;
            this.alpha = 1;
            this.decay = 0.02;
            this.color1 = DK_COLORS.brownMedium;
            this.color2 = DK_COLORS.brownDark;
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= this.decay;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            barrelCtx.save();
            barrelCtx.globalAlpha = this.alpha;
            barrelCtx.translate(this.x, this.y);
            barrelCtx.rotate(this.rotation);

            // Cuerpo del barril
            barrelCtx.fillStyle = this.color1;
            barrelCtx.beginPath();
            barrelCtx.ellipse(0, 0, this.radius, this.radius * 0.7, 0, 0, Math.PI * 2);
            barrelCtx.fill();

            // Bordes del barril
            barrelCtx.strokeStyle = this.color2;
            barrelCtx.lineWidth = 3;
            barrelCtx.beginPath();
            barrelCtx.ellipse(0, -this.radius * 0.6, this.radius, this.radius * 0.2, 0, 0, Math.PI * 2);
            barrelCtx.stroke();
            barrelCtx.beginPath();
            barrelCtx.ellipse(0, this.radius * 0.6, this.radius, this.radius * 0.2, 0, 0, Math.PI * 2);
            barrelCtx.stroke();

            // Letra DK
            barrelCtx.font = `${this.radius * 0.8}px 'Press Start 2P'`;
            barrelCtx.fillStyle = DK_COLORS.yellowBanana;
            barrelCtx.textAlign = 'center';
            barrelCtx.textBaseline = 'middle';
            barrelCtx.fillText('DK', 0, 0);

            barrelCtx.restore();
        }
    }

    function triggerBarrelBlast() {
        const hudRect = document.getElementById('dk-bananza-hud').getBoundingClientRect();
        const startX = hudRect.left + hudRect.width / 2;
        const startY = hudRect.top + hudRect.height / 2;

        for (let i = 0; i < 15; i++) { // 15 barriles
            barrels.push(new Barrel(startX, startY, Math.random() * 15 + 15)); // Radio entre 15 y 30
        }
        for (let i = 0; i < 50; i++) { // Muchas chispas/estrellas
            particles.push(new Particle(startX, startY, Math.random() < 0.5 ? 'star' : 'sparkle'));
        }

        // Sonido de explosión
        initAudioContext();
        if (!audioContext) return;
        const now = audioContext.currentTime;
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        o.connect(g);
        g.connect(audioContext.destination);
        o.type = 'square';
        o.frequency.setValueAtTime(100, now);
        g.gain.setValueAtTime(0.7, now);
        o.frequency.exponentialRampToValueAtTime(50, now + 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        o.start(now);
        o.stop(now + 0.8);
    }

    function animateBarrels() {
        barrelCtx.clearRect(0, 0, barrelCanvas.width, barrelCanvas.height);
        for (let i = barrels.length - 1; i >= 0; i--) {
            const b = barrels[i];
            b.update();
            b.draw();
            if (b.alpha <= 0.01 || b.y > barrelCanvas.height + b.radius) {
                barrels.splice(i, 1);
            }
        }
        requestAnimationFrame(animateBarrels);
    }

    // --- 6. Elementos de fondo animados (plátanos cayendo) ---
    const backgroundElements = [];
    function createBgElement() {
        const element = document.createElement('div');
        element.classList.add('dk-bg-element');
        element.style.width = `${Math.random() * 30 + 20}px`;
        element.style.height = `${Math.random() * 40 + 30}px`;
        element.style.left = `${Math.random() * 100}vw`;
        element.style.animationDuration = `${Math.random() * 15 + 8}s`;
        element.style.animationDelay = `${Math.random() * 8}s`;
        document.body.appendChild(element);
        backgroundElements.push(element);

        element.addEventListener('animationend', () => {
            element.remove();
            backgroundElements.splice(backgroundElements.indexOf(element), 1);
            if (backgroundElements.length < config.maxBgElements) {
                createBgElement();
            }
        });
    }

    function initBackgroundElements() {
        for (let i = 0; i < config.maxBgElements; i++) {
            createBgElement();
        }
    }

    // --- 7. Personajes Animados (Donkey Kong y Pauline) ---
    const charactersOnScreen = [];
    let characterSpawnTimer;

    class Character {
        constructor(type) {
            this.type = type;
            this.element = document.createElement('div');
            this.element.classList.add('dk-character', type);
            this.element.innerHTML = this.getHTML();
            document.body.appendChild(this.element);

            this.width = type === 'donkey-kong' ? 100 : 60;
            this.height = type === 'donkey-kong' ? 100 : 120;
            this.speed = config.characterMoveSpeed * (Math.random() > 0.5 ? 1 : -1); // Dirección aleatoria
            this.element.style.bottom = `-5px`; // Siempre en la parte inferior de la pantalla

            if (this.speed < 0) { // Si va a la izquierda, flip horizontalmente
                this.element.style.transform = 'scaleX(-1)';
                this.x = window.innerWidth; // Empieza a la derecha
            } else {
                this.x = -this.width; // Empieza a la izquierda
            }

            this.element.style.left = `${this.x}px`;
            this.element.style.animation = `characterWalk 0.8s infinite steps(4)`; // Animación de caminar

            this.element.addEventListener('click', () => this.react());

            this.animationFrame = null;
            this.startMoving();
        }

        getHTML() {
            if (this.type === 'donkey-kong') {
                return `
                    <div class="body"></div>
                    <div class="head"></div>
                    <div class="snout"></div>
                    <div class="eye left"></div>
                    <div class="eye right"></div>
                    <div class="pupil left"></div>
                    <div class="pupil right"></div>
                `;
            } else if (this.type === 'pauline') {
                return `
                    <div class="head"></div>
                    <div class="hair"></div>
                    <div class="dress"></div>
                    <div class="belt"></div>
                    <div class="eye left"></div>
                    <div class="eye right"></div>
                `;
            }
            return '';
        }

        startMoving() {
            const move = () => {
                this.x += this.speed;
                this.element.style.left = `${this.x}px`;

                const reachedEnd = (this.speed > 0 && this.x > window.innerWidth) ||
                                   (this.speed < 0 && this.x < -this.width);

                if (reachedEnd) {
                    this.destroy();
                } else {
                    this.animationFrame = requestAnimationFrame(move);
                }
            };
            this.animationFrame = requestAnimationFrame(move);
        }

        react() {
            console.log(`¡${this.type === 'donkey-kong' ? 'Donkey Kong' : 'Pauline'} reaccionó!`);
            bananaCount += 5; // Más plátanos por interactuar con personajes
            document.getElementById('banana-count-value').textContent = bananaCount;
            updateBananaProgress(); // Actualizar barra de progreso
            triggerCoinSound(); // Sonido al "recolectar"

            // Efecto visual de "desaparición"
            this.element.style.animation = 'characterPop 0.5s forwards';
            const charX = this.element.getBoundingClientRect().left + this.width / 2;
            const charY = this.element.getBoundingClientRect().top + this.height / 2;
            for (let i = 0; i < 15; i++) { // Partículas al desaparecer
                particles.push(new Particle(charX, charY, Math.random() < 0.7 ? 'banana' : 'star'));
            }

            setTimeout(() => {
                this.destroy();
            }, 500);
        }

        destroy() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            const index = charactersOnScreen.indexOf(this);
            if (index > -1) {
                charactersOnScreen.splice(index, 1);
            }
        }
    }

    function spawnCharacter() {
        if (charactersOnScreen.length < 3) { // Limitar el número de personajes en pantalla
            const type = Math.random() < 0.5 ? 'donkey-kong' : 'pauline';
            charactersOnScreen.push(new Character(type));
        }
    }

    function initCharacterSpawning() {
        spawnCharacter(); // Spawn inicial
        characterSpawnTimer = setInterval(spawnCharacter, config.characterSpawnInterval);
    }

    function updateBananaProgress() {
        const bananaCountValue = document.getElementById('banana-count-value');
        const bananaProgressBar = document.getElementById('banana-progress-bar');
        const triggerBlastButton = document.getElementById('trigger-barrel-blast-btn');

        const progress = bananaCount % config.bananaPerLevel;
        const percentage = (progress / config.bananaPerLevel) * 100;
        bananaProgressBar.style.width = `${percentage}%`;
        bananaProgressBar.setAttribute('data-label', `Nivel ${bananaLevel} (${progress}/${config.bananaPerLevel})`);

        if (bananaCount > 0 && progress === 0 && bananaCount / config.bananaPerLevel === bananaLevel) {
            levelUp();
        }
    }

    // --- Ejecutar todo ---
    function initializeBananzaUltimateScript() {
        console.log('Donkey Kong Bananza! Ultimate Enhancement for Drawaria Loaded...');

        injectGlobalCSS();
        createHUD();
        initParticleCanvas();
        initBarrelCanvas();
        initBackgroundElements();
        initCharacterSpawning();

        // Iniciar la música de fondo
        backgroundMusic.play();

        console.warn('Nota de Renderizado: Los personajes y elementos gráficos son generados PROCEDURALMENTE con CSS y Canvas. Su "realismo" es una representación estilizada y abstracta, no fotorrealista, debido a las restricciones de no usar imágenes preexistentes o archivos de audio. Los personajes NO son "jugables" en el sentido de controlar su movimiento dentro del juego, sino elementos animados que cruzan la pantalla.');
        console.log('¡Donkey Kong Bananza! Ultimate Enhancement for Drawaria Cargado Exitosamente. ¡A dibujar!');
    }

    // Asegurarse de que el DOM esté completamente cargado antes de ejecutar el script
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeBananzaUltimateScript();
    } else {
        document.addEventListener('DOMContentLoaded', initializeBananzaUltimateScript);
    }

})();