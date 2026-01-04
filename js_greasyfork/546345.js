// ==UserScript==
// @name         Drawaria OVNI Simulator Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simulates the impossible maneuvers of UFOs: instantaneous acceleration from subsonic to supersonic speeds!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/546345/Drawaria%20OVNI%20Simulator%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/546345/Drawaria%20OVNI%20Simulator%20Mod.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------  MANIOBRAS OVNI DOCUMENTADAS  ---------- */

    const UFO_MANEUVERS = {
        'Ninguno': '',
        '🛸 Tic Tac - Movimiento Errático': 'maneuver:tic_tac_erratic', // Caso USS Nimitz
        '⚡ Aceleración Instantánea': 'maneuver:instant_acceleration', // Subsónica a supersónica
        '🌀 Vuelo Parado Absoluto': 'maneuver:absolute_hover', // Sin propulsión visible
        '↩️ Curvas Imposibles': 'maneuver:impossible_turns', // Radios constantes indefinidos
        '🎯 Evasión Inteligente': 'maneuver:intelligent_evasion', // Acompañar y mantener distancia
        '📡 Manifestación Multi-Sensor': 'maneuver:multi_sensor_detection', // Radar + visual simultáneo
        '🔄 Giro GIMBAL': 'maneuver:gimbal_rotation', // 90 grados sin perder altitud
        '💨 Desaparición Súbita': 'maneuver:sudden_disappearance', // Velocidades superiores a 620 nudos
        '🌊 Patrón de Vuelo Oceánico': 'maneuver:oceanic_pattern', // Atracción a masas de agua
        '☢️ Monitoreo Nuclear': 'maneuver:nuclear_monitoring' // Apariciones en instalaciones nucleares
    };

    const UFO_PHENOMENA = {
        'Ninguno': '',
        '🌟 Encuentro Cercano Tipo I': 'phenomenon:close_encounter_1', // Observación a menos de 150m
        '👽 Encuentro Cercano Tipo II': 'phenomenon:close_encounter_2', // Efectos físicos en el entorno
        '🛸 Encuentro Cercano Tipo III': 'phenomenon:close_encounter_3', // Avistamiento de ocupantes
        '⚫ Fenómeno de Absorción Lumínica': 'phenomenon:light_absorption', // Horizonte de eventos visual
        '🌌 Distorsión Espacial Localizada': 'phenomenon:spatial_distortion', // Efectos gravitacionales
        '📊 Anomalía Multi-Espectral': 'phenomenon:multispectral_anomaly', // Detección en múltiples sensores
        '🔮 Manifestación Plasmática': 'phenomenon:plasma_manifestation', // Efectos electromagnéticos
        '🌪️ Vórtice Atmosférico Controlado': 'phenomenon:controlled_vortex', // Manipulación atmosférica
        '⭐ Formación en Triángulo': 'phenomenon:triangular_formation' // Caso Phoenix Lights
    };

    /* ----------  SETUP BÁSICO  ---------- */
    let socket;
    const canvas = document.getElementById('canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let stopSignal = false;
    let stopBtn;
    let activeEffectInterval = null;
    let isExecuting = false;

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) socket = this;
        return originalSend.apply(this, args);
    };

    /* ----------  INTERFAZ DE USUARIO  ---------- */
    const container = document.createElement('div');
    container.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:linear-gradient(135deg, #0a0a0a, #1a1a2e, #2d1b69);
        color:#00ffff; padding:15px 20px; border-radius:15px;
        font-family: 'Courier New', 'Consolas', monospace; font-size:13px;
        display:flex; flex-direction:column; gap:12px;
        box-shadow: 0 8px 25px rgba(0,255,255,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
        border: 2px solid #00ffff;
        min-width: 340px;
        backdrop-filter: blur(10px);
        cursor: default;
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '🛸 SIMULADOR FENÓMENOS OVNI 🛸';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 16px; text-align: center; cursor: grab;
        background: linear-gradient(45deg, #00ffff, #00bfff, #87ceeb);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        margin: -15px -20px 10px -20px; padding: 15px 20px;
        border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        border-radius: 15px 15px 0 0;
    `;
    container.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:12px;`;
    container.appendChild(contentDiv);

    const ufoInputStyle = `
        flex-grow: 1; padding: 8px 12px; border-radius: 8px;
        border: 2px solid #00ffff; background: rgba(0, 0, 20, 0.9);
        color: #00ffff; font-size: 13px; font-family: 'Courier New', monospace;
        transition: all 0.3s ease;
        appearance: none;
        cursor: pointer;
    `;

    function createUFORow(parent, labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex; align-items:center; gap:12px;`;
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = `color: #00ffff; font-weight: bold; min-width: 100px;`;
        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
        parent.appendChild(wrapper);
        return { wrapper, label, inputElement };
    }

    // Selector de jugadores
    const playerSelect = document.createElement('select');
    playerSelect.style.cssText = ufoInputStyle;
    createUFORow(contentDiv, '🎯 Objetivo:', playerSelect);

    // Selector de maniobras
    const maneuverSelect = document.createElement('select');
    maneuverSelect.style.cssText = ufoInputStyle;
    for (const name in UFO_MANEUVERS) {
        const opt = document.createElement('option');
        opt.value = UFO_MANEUVERS[name];
        opt.textContent = name;
        maneuverSelect.appendChild(opt);
    }
    maneuverSelect.value = UFO_MANEUVERS['Ninguno'];
    createUFORow(contentDiv, '🛸 Maniobra:', maneuverSelect);

    // Selector de fenómenos
    const phenomenonSelect = document.createElement('select');
    phenomenonSelect.style.cssText = ufoInputStyle;
    for (const name in UFO_PHENOMENA) {
        const opt = document.createElement('option');
        opt.value = UFO_PHENOMENA[name];
        opt.textContent = name;
        phenomenonSelect.appendChild(opt);
    }
    phenomenonSelect.value = UFO_PHENOMENA['Ninguno'];
    createUFORow(contentDiv, '✨ Fenómeno:', phenomenonSelect);

    // Auto-reset de selectores
    maneuverSelect.addEventListener('change', () => {
        if (maneuverSelect.value !== '') {
            phenomenonSelect.value = UFO_PHENOMENA['Ninguno'];
        }
    });

    phenomenonSelect.addEventListener('change', () => {
        if (phenomenonSelect.value !== '') {
            maneuverSelect.value = UFO_MANEUVERS['Ninguno'];
        }
    });

    // Intensity slider
    const intensitySlider = document.createElement('input');
    intensitySlider.type = 'range';
    intensitySlider.min = '1';
    intensitySlider.max = '5';
    intensitySlider.value = '3';
    intensitySlider.style.cssText = `
        flex-grow: 1; -webkit-appearance: none; height: 6px; border-radius: 5px;
        background: linear-gradient(to right, #00ffff 0%, #0080ff 100%);
        outline: none;
    `;
    createUFORow(contentDiv, '⚡ Intensidad:', intensitySlider);

    // Repeat toggle
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.id = 'ufoRepeatToggle';
    repeatToggle.style.cssText = `margin-right: 8px; cursor: pointer; transform: scale(1.3);`;
    const repeatLabel = document.createElement('label');
    repeatLabel.htmlFor = 'ufoRepeatToggle';
    repeatLabel.textContent = ' 🔄 Repetir Fenómeno';
    repeatLabel.style.cssText = `display: flex; align-items: center; cursor: pointer; color: #00ffff;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:0;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botones
    const executeBtn = document.createElement('button');
    executeBtn.textContent = '🛸 INICIAR SIMULACIÓN OVNI';
    executeBtn.disabled = true;
    executeBtn.style.cssText = `
        padding: 12px 20px; border-radius: 10px; border: none;
        background: linear-gradient(145deg, #0080ff, #00bfff);
        color: white; font-weight: bold; font-size: 15px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 128, 255, 0.4);
        text-transform: uppercase; letter-spacing: 1px;
    `;

    stopBtn = document.createElement('button');
    stopBtn.textContent = '🛑 DETENER FENÓMENO';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 8px; padding: 10px 18px; border-radius: 8px; border: none;
        background: linear-gradient(145deg, #ff1744, #d50000);
        color: white; font-weight: bold; font-size: 14px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(255, 23, 68, 0.4);
        text-transform: uppercase;
    `;

    contentDiv.appendChild(executeBtn);
    contentDiv.appendChild(stopBtn);
    document.body.appendChild(container);

    /* ----------  FUNCIONES AUXILIARES  ---------- */
    function drawUFOCommand(x1, y1, x2, y2, color, thickness) {
        x1 = Math.round(x1); y1 = Math.round(y1);
        x2 = Math.round(x2); y2 = Math.round(y2);

        if (ctx && canvas) {
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        if (!socket) return;

        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(cmd);
    }

    function getPlayerCoords(playerId) {
        const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]`);
        if (!avatar) return null;

        const cRect = canvas.getBoundingClientRect();
        const aRect = avatar.getBoundingClientRect();

        return {
            x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
            y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
            width: aRect.width,
            height: aRect.height
        };
    }

    /* ----------  MANIOBRAS OVNI DOCUMENTADAS  ---------- */

    // 🛸 Tic Tac - Movimiento Errático (Caso USS Nimitz)
    async function ticTacErratic(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🛸 Simulando comportamiento Tic Tac`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        let currentX = target.x - 100;
        let currentY = target.y - 50;
        const movementSteps = 40 + intensity * 10;

        // Patrón errático: "izquierda, derecha, adelante, atrás, al azar"
        const directions = ['left', 'right', 'forward', 'backward', 'random'];

        for (let step = 0; step < movementSteps; step++) {
            if (stopSignal) break;

            // Seleccionar movimiento según patrón Tic Tac
            const direction = directions[step % directions.length];
            let nextX = currentX;
            let nextY = currentY;

            switch (direction) {
                case 'left':
                    nextX = currentX - (30 + Math.random() * 40);
                    break;
                case 'right':
                    nextX = currentX + (30 + Math.random() * 40);
                    break;
                case 'forward':
                    nextY = currentY - (20 + Math.random() * 30);
                    break;
                case 'backward':
                    nextY = currentY + (20 + Math.random() * 30);
                    break;
                case 'random':
                    nextX = currentX + (Math.random() - 0.5) * 80;
                    nextY = currentY + (Math.random() - 0.5) * 60;
                    break;
            }

            // Dibujar cuerpo del OVNI
            const ufoSize = 12 + intensity * 2;
            for (let segment = 0; segment < 8; segment++) {
                const angle = (segment / 8) * Math.PI * 2;
                const segmentX = nextX + ufoSize * Math.cos(angle);
                const segmentY = nextY + ufoSize * Math.sin(angle) * 0.3;
                drawUFOCommand(nextX, nextY, segmentX, segmentY, '#c0c0c0', 4);
            }

            // Cúpula
            for (let dome = 0; dome < 6; dome++) {
                const domeAngle = (dome / 6) * Math.PI * 2;
                const domeX = nextX + (ufoSize * 0.6) * Math.cos(domeAngle);
                const domeY = nextY - 8 + (ufoSize * 0.6) * Math.sin(domeAngle) * 0.4;
                drawUFOCommand(nextX, nextY - 8, domeX, domeY, '#87ceeb', 2);
            }

            // Estela de movimiento
            drawUFOCommand(currentX, currentY, nextX, nextY, '#00ffff', 2);

            // Luces parpadeantes
            if (Math.random() < 0.6) {
                const lightColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
                const lightColor = lightColors[Math.floor(Math.random() * lightColors.length)];
                drawUFOCommand(nextX - 5, nextY, nextX + 5, nextY, lightColor, 3);
            }

            currentX = nextX;
            currentY = nextY;

            await new Promise(r => setTimeout(r, 150 + Math.random() * 100));
        }
    }

    // ⚡ Aceleración Instantánea (Subsónica a Supersónica)
    async function instantAcceleration(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`⚡ Simulando aceleración instantánea`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = target.x - 200;
        const startY = target.y;
        const endX = target.x + 200;
        const endY = target.y;

        // Fase 1: Vuelo parado (subsónico)
        for (let hover = 0; hover < 8; hover++) {
            if (stopSignal) break;

            const ufoSize = 15 + intensity * 3;
            // OVNI estático
            for (let segment = 0; segment < 12; segment++) {
                const angle = (segment / 12) * Math.PI * 2;
                const segmentX = startX + ufoSize * Math.cos(angle);
                const segmentY = startY + ufoSize * Math.sin(angle) * 0.4;
                drawUFOCommand(startX, startY, segmentX, segmentY, '#c0c0c0', 5);
            }

            // Efecto de suspensión
            for (let field = 0; field < 4; field++) {
                const fieldAngle = (field / 4) * Math.PI * 2 + hover * 0.3;
                const fieldX = startX + (ufoSize + 10) * Math.cos(fieldAngle);
                const fieldY = startY + (ufoSize + 10) * Math.sin(fieldAngle) * 0.3;
                drawUFOCommand(startX, startY, fieldX, fieldY, '#00ffff', 1);
            }

            await new Promise(r => setTimeout(r, 200));
        }

        // Fase 2: Aceleración instantánea (supersónica)
        const accelerationSteps = 3; // Muy pocas fases para mostrar instantaneidad
        for (let step = 0; step < accelerationSteps; step++) {
            if (stopSignal) break;

            const progress = step / accelerationSteps;
            const currentX = startX + (endX - startX) * Math.pow(progress, 0.3); // Aceleración exponencial

            // Estela supersónica
            const trailLength = 80 + step * 40;
            for (let trail = 0; trail < 8; trail++) {
                const trailX = currentX - trailLength - trail * 15;
                drawUFOCommand(currentX, startY, trailX, startY, '#ff4500', 6 - trail);
            }

            // Onda de choque
            if (step > 0) {
                for (let shock = 0; shock < 6; shock++) {
                    const shockAngle = (shock / 6) * Math.PI * 2;
                    const shockRadius = 30 + step * 20;
                    const shockX = currentX + shockRadius * Math.cos(shockAngle);
                    const shockY = startY + shockRadius * Math.sin(shockAngle) * 0.6;
                    drawUFOCommand(currentX, startY, shockX, shockY, '#ffffff', 4);
                }
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 🌀 Vuelo Parado Absoluto
    async function absoluteHover(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌀 Simulando vuelo parado absoluto`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const hoverX = target.x;
        const hoverY = target.y - 60;
        const duration = 100 + intensity * 50;

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const ufoSize = 18 + intensity * 2;

            // Cuerpo del OVNI perfectamente estático
            for (let segment = 0; segment < 16; segment++) {
                const angle = (segment / 16) * Math.PI * 2;
                const segmentX = hoverX + ufoSize * Math.cos(angle);
                const segmentY = hoverY + ufoSize * Math.sin(angle) * 0.3;
                drawUFOCommand(hoverX, hoverY, segmentX, segmentY, '#c0c0c0', 6);
            }

            // Campo anti-gravitatorio
            const fieldIntensity = Math.sin(frame * 0.1) * 5 + 15;
            for (let field = 0; field < 8; field++) {
                const fieldAngle = (field / 8) * Math.PI * 2;
                const fieldX = hoverX + fieldIntensity * Math.cos(fieldAngle);
                const fieldY = hoverY + fieldIntensity * Math.sin(fieldAngle);
                drawUFOCommand(hoverX, hoverY, fieldX, fieldY, '#9400d3', 2);
            }

            // Partículas de suspensión
            if (frame % 5 === 0) {
                for (let particle = 0; particle < 4; particle++) {
                    const particleX = hoverX + (Math.random() - 0.5) * 40;
                    const particleY = hoverY + 20 + Math.random() * 20;
                    drawUFOCommand(hoverX, hoverY + ufoSize, particleX, particleY, '#00ffff', 1);
                }
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // ↩️ Curvas Imposibles
    async function impossibleTurns(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`↩️ Simulando curvas imposibles`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const radius = 60 + intensity * 15;

        // Realizar múltiples curvas con radios constantes pero imposibles
        const totalRotations = 2 + intensity;
        const stepsPerRotation = 24;

        for (let rotation = 0; rotation < totalRotations; rotation++) {
            for (let step = 0; step < stepsPerRotation; step++) {
                if (stopSignal) break;

                const angle = (step / stepsPerRotation) * Math.PI * 2;
                const currentX = centerX + radius * Math.cos(angle);
                const currentY = centerY + radius * Math.sin(angle);

                // OVNI en la curva
                const ufoSize = 14 + intensity * 2;
                for (let segment = 0; segment < 10; segment++) {
                    const segmentAngle = (segment / 10) * Math.PI * 2 + angle;
                    const segmentX = currentX + (ufoSize * 0.8) * Math.cos(segmentAngle);
                    const segmentY = currentY + (ufoSize * 0.8) * Math.sin(segmentAngle) * 0.4;
                    drawUFOCommand(currentX, currentY, segmentX, segmentY, '#c0c0c0', 4);
                }

                // Mostrar trayectoria circular perfecta
                const nextAngle = ((step + 1) / stepsPerRotation) * Math.PI * 2;
                const nextX = centerX + radius * Math.cos(nextAngle);
                const nextY = centerY + radius * Math.sin(nextAngle);
                drawUFOCommand(currentX, currentY, nextX, nextY, '#00ff00', 3);

                // Efectos de fuerza G imposible (debería ser letal para humanos)
                if (step % 4 === 0) {
                    for (let gforce = 0; gforce < 3; gforce++) {
                        const gAngle = angle + Math.PI / 2 + gforce * 0.5;
                        const gX = currentX + 25 * Math.cos(gAngle);
                        const gY = currentY + 25 * Math.sin(gAngle);
                        drawUFOCommand(currentX, currentY, gX, gY, '#ff0000', 2);
                    }
                }

                await new Promise(r => setTimeout(r, 120));
            }
        }
    }

    // 🎯 Evasión Inteligente
    async function intelligentEvasion(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🎯 Simulando evasión inteligente`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        let ufoX = target.x - 80;
        let ufoY = target.y - 60;
        const pursuitSteps = 30 + intensity * 10;

        // Simular persecución de interceptores
        for (let step = 0; step < pursuitSteps; step++) {
            if (stopSignal) break;

            // OVNI mantiene distancia exacta del "observador"
            const targetDistance = 100 + intensity * 20;
            const currentDistance = Math.sqrt(Math.pow(ufoX - target.x, 2) + Math.pow(ufoY - target.y, 2));

            if (currentDistance < targetDistance) {
                // Alejarse si está muy cerca
                const escapeAngle = Math.atan2(ufoY - target.y, ufoX - target.x);
                ufoX += 25 * Math.cos(escapeAngle);
                ufoY += 25 * Math.sin(escapeAngle);
            } else if (currentDistance > targetDistance + 50) {
                // Acercarse si está muy lejos
                const approachAngle = Math.atan2(target.y - ufoY, target.x - ufoX);
                ufoX += 15 * Math.cos(approachAngle);
                ufoY += 15 * Math.sin(approachAngle);
            } else {
                // Mantener distancia con movimiento lateral
                const tangentAngle = Math.atan2(target.y - ufoY, target.x - ufoX) + Math.PI / 2;
                ufoX += 20 * Math.cos(tangentAngle + step * 0.2);
                ufoY += 20 * Math.sin(tangentAngle + step * 0.2);
            }

            // Dibujar OVNI
            const ufoSize = 16 + intensity * 2;
            for (let segment = 0; segment < 12; segment++) {
                const angle = (segment / 12) * Math.PI * 2;
                const segmentX = ufoX + ufoSize * Math.cos(angle);
                const segmentY = ufoY + ufoSize * Math.sin(angle) * 0.35;
                drawUFOCommand(ufoX, ufoY, segmentX, segmentY, '#c0c0c0', 5);
            }

            // Línea de "observación" al objetivo
            drawUFOCommand(ufoX, ufoY, target.x, target.y, '#ff00ff', 1);

            // Simular interceptores persiguiendo
            if (step % 8 === 0) {
                const interceptorX = target.x + Math.random() * 100 - 50;
                const interceptorY = target.y + Math.random() * 100 - 50;

                // Interceptor "convencional"
                drawUFOCommand(interceptorX - 10, interceptorY, interceptorX + 10, interceptorY, '#ff0000', 3);
                drawUFOCommand(interceptorX, interceptorY - 5, interceptorX, interceptorY + 5, '#ff0000', 3);

                // Línea de persecución (siempre un paso atrás)
                drawUFOCommand(interceptorX, interceptorY, ufoX, ufoY, '#ff4444', 1);
            }

            await new Promise(r => setTimeout(r, 180));
        }
    }

    // 📡 Manifestación Multi-Sensor
    async function multiSensorDetection(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`📡 Simulando detección multi-sensor`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 80 + intensity * 30;

        // Simular diferentes "sensores" o rayos de detección
        const sensors = ['radar', 'infrared', 'visual'];

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            sensors.forEach((sensorType, index) => {
                const angle = (index / sensors.length) * Math.PI * 2 + frame * 0.1;
                const sensorX = target.x + (60 + intensity * 10) * Math.cos(angle);
                const sensorY = target.y + (60 + intensity * 10) * Math.sin(angle);

                let color;
                switch(sensorType) {
                    case 'radar': color = '#00ff00'; break; // Green for radar
                    case 'infrared': color = '#ff4500'; break; // Orange-red for IR
                    case 'visual': color = '#00ffff'; break; // Cyan for visual (lights)
                }

                // Línea de detección
                drawUFOCommand(target.x, target.y, sensorX, sensorY, color, 2);

                // Indicador de sensor (punto o pulso)
                for (let i = 0; i < 3; i++) {
                    const pulseRadius = 5 + Math.sin(frame * 0.2 + index * 0.5) * 3;
                    drawUFOCommand(sensorX - pulseRadius, sensorY, sensorX + pulseRadius, sensorY, color, 3);
                }
            });

            // OVNI central (observando)
            const ufoSize = 15 + intensity * 2;
            for (let segment = 0; segment < 8; segment++) {
                const angle = (segment / 8) * Math.PI * 2;
                const segmentX = target.x + ufoSize * Math.cos(angle);
                const segmentY = target.y + ufoSize * Math.sin(angle) * 0.3;
                drawUFOCommand(target.x, target.y, segmentX, segmentY, '#c0c0c0', 5);
            }

            await new Promise(r => setTimeout(r, 150));
        }
    }

    // 🔄 Giro GIMBAL
    async function gimbalRotation(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🔄 Simulando giro GIMBAL`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const rotations = 2 + intensity; // Number of 90-degree turns
        const stepsPerRotation = 36; // Smoothness of rotation

        let currentAngle = 0; // Initial "orientation"
        const ufoX = target.x - 50;
        const ufoY = target.y - 50;

        for (let rotation = 0; rotation < rotations; rotation++) {
            for (let step = 0; step < stepsPerRotation; step++) {
                if (stopSignal) break;

                // Calculate the target angle (e.g., a 90-degree turn)
                const targetAngle = (rotation + 1) * (Math.PI / 2); // 0.5PI, 1PI, 1.5PI, 2PI...
                // Interpolate angle for smooth rotation
                currentAngle = currentAngle + ((targetAngle - currentAngle) / (stepsPerRotation - step));

                // Draw the UFO as a "gimbal" object (e.g., a rectangle rotating)
                const ufoWidth = 30 + intensity * 5;
                const ufoHeight = 10 + intensity * 2;

                const cosA = Math.cos(currentAngle);
                const sinA = Math.sin(currentAngle);

                // Simulate "arms" or structure that remains level
                const armLength = 40;
                drawUFOCommand(ufoX, ufoY, ufoX + armLength * cosA, ufoY + armLength * sinA, '#d3d3d3', 4);
                drawUFOCommand(ufoX, ufoY, ufoX - armLength * cosA, ufoY - armLength * sinA, '#d3d3d3', 4);

                // Simulate the "body" that rotates independently (e.g., a square)
                const bodySize = 15 + intensity * 3;
                drawUFOCommand(ufoX - bodySize, ufoY - bodySize, ufoX + bodySize, ufoY - bodySize, '#ff00ff', 2);
                drawUFOCommand(ufoX + bodySize, ufoY - bodySize, ufoX + bodySize, ufoY + bodySize, '#ff00ff', 2);
                drawUFOCommand(ufoX + bodySize, ufoY + bodySize, ufoX - bodySize, ufoY + bodySize, '#ff00ff', 2);
                drawUFOCommand(ufoX - bodySize, ufoY + bodySize, ufoX - bodySize, ufoY - bodySize, '#ff00ff', 2);

                // Indicate the "level" axis (e.g., a horizontal line that stays horizontal)
                drawUFOCommand(ufoX - 20, ufoY, ufoX + 20, ufoY, '#00ffff', 2);

                await new Promise(r => setTimeout(r, 100));
            }
        }
    }

    // 💨 Desaparición Súbita
    async function suddenDisappearance(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`💨 Simulando desaparición súbita`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const ufoX = target.x + 80;
        const ufoY = target.y - 40;
        const durationVisible = 30; // Frames visible
        const durationFade = 10;    // Frames to disappear

        // Fase 1: OVNI visible
        for (let frame = 0; frame < durationVisible; frame++) {
            if (stopSignal) break;

            const ufoSize = 20 + intensity * 3;
            // Draw a solid UFO
            for (let segment = 0; segment < 12; segment++) {
                const angle = (segment / 12) * Math.PI * 2;
                const segmentX = ufoX + ufoSize * Math.cos(angle);
                const segmentY = ufoY + ufoSize * Math.sin(angle) * 0.4;
                drawUFOCommand(ufoX, ufoY, segmentX, segmentY, '#a9a9a9', 6);
            }
            // Add a light pulse
            drawUFOCommand(ufoX - 10, ufoY + 5, ufoX + 10, ufoY + 5, '#ffff00', 4);

            await new Promise(r => setTimeout(r, 150));
        }

        // Fase 2: Desaparición instantánea con efectos de rastro
        for (let fade = 0; fade < durationFade; fade++) {
            if (stopSignal) break;

            // Simulate rapidly dissipating energy/plasma
            const trailLength = (durationFade - fade) * (20 + intensity * 5);
            const trailAlpha = (durationFade - fade) / durationFade; // Fade out effect

            // Draw a streaking line that fades
            drawUFOCommand(ufoX, ufoY, ufoX + trailLength, ufoY - trailLength, `rgba(135,206,250,${trailAlpha})`, 5); // Light blue streaking
            drawUFOCommand(ufoX, ufoY, ufoX - trailLength, ufoY + trailLength, `rgba(255,165,0,${trailAlpha})`, 5); // Orange streaking

            // Small "burst" or "implosion" at origin point
            for (let i = 0; i < 5; i++) {
                const burstRadius = (fade * 5) + (Math.random() * 10);
                drawUFOCommand(ufoX, ufoY, ufoX + burstRadius * (Math.random() - 0.5), ufoY + burstRadius * (Math.random() - 0.5), `rgba(255,255,255,${1 - fade/durationFade})`, 2);
            }

            await new Promise(r => setTimeout(r, 80));
        }
        // Ensure it's completely gone after fading
        // No drawing command here means the canvas clears previous drawings implicitly
    }

    // 🌊 Patrón de Vuelo Oceánico
    async function oceanicPattern(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌊 Simulando patrón de vuelo oceánico`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 80 + intensity * 30;
        const amplitude = 40 + intensity * 10; // Vertical movement
        const wavelength = 0.1; // Horizontal speed

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const currentX = target.x + Math.sin(frame * wavelength) * amplitude * 0.5;
            const currentY = target.y + Math.cos(frame * wavelength) * amplitude; // Vertical oscillation

            const ufoSize = 15 + intensity * 2;
            // Basic UFO drawing
            for (let segment = 0; segment < 8; segment++) {
                const angle = (segment / 8) * Math.PI * 2;
                const segmentX = currentX + ufoSize * Math.cos(angle);
                const segmentY = currentY + ufoSize * Math.sin(angle) * 0.4;
                drawUFOCommand(currentX, currentY, segmentX, segmentY, '#add8e6', 5); // Light blue for oceanic theme
            }
            // Water ripples below
            for (let ripple = 0; ripple < 3; ripple++) {
                const rippleRadius = (frame % 20) + ripple * 10; // Expanding ripple
                const rippleAlpha = 1 - (rippleRadius / (20 + 2 * 10 + 20)); // Fade out
                drawUFOCommand(currentX - rippleRadius, currentY + ufoSize + 10, currentX + rippleRadius, currentY + ufoSize + 10, `rgba(0,191,255,${Math.max(0, rippleAlpha)})`, 2);
            }

            await new Promise(r => setTimeout(r, 120));
        }
    }

    // ☢️ Monitoreo Nuclear
    async function nuclearMonitoring(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`☢️ Simulando monitoreo nuclear`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 90 + intensity * 40;
        const scanRadius = 50 + intensity * 15;

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const ufoX = target.x + Math.sin(frame * 0.05) * 80;
            const ufoY = target.y - 70 + Math.cos(frame * 0.07) * 40;

            const ufoSize = 18 + intensity * 2;
            // UFO body
            for (let segment = 0; segment < 10; segment++) {
                const angle = (segment / 10) * Math.PI * 2;
                const segmentX = ufoX + ufoSize * Math.cos(angle);
                const segmentY = ufoY + ufoSize * Math.sin(angle) * 0.3;
                drawUFOCommand(ufoX, ufoY, segmentX, segmentY, '#c0c0c0', 6);
            }

            // Scanning beam
            const beamColor = `rgba(255,255,0,${0.5 + Math.sin(frame * 0.3) * 0.4})`;
            for (let beam = 0; beam < 5; beam++) {
                drawUFOCommand(ufoX, ufoY + ufoSize / 2, ufoX + (Math.random() - 0.5) * scanRadius * 2, target.y + target.height / 2 + Math.random() * scanRadius, beamColor, 1 + Math.random() * 2);
            }
            // Radiation symbols (simplified, flickering)
            if (frame % 15 === 0) {
                // Draw a stylized radiation symbol (3 arcs + central circle)
                const radSymbolSize = 15 + intensity * 2;
                const radColor = '#ff0000'; // Red for danger
                drawUFOCommand(target.x - radSymbolSize, target.y, target.x + radSymbolSize, target.y, radColor, 2);
                drawUFOCommand(target.x, target.y - radSymbolSize, target.x, target.y + radSymbolSize, radColor, 2);
                drawUFOCommand(target.x - radSymbolSize * 0.7, target.y - radSymbolSize * 0.7, target.x + radSymbolSize * 0.7, target.y + radSymbolSize * 0.7, radColor, 2);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }


    /* ----------  FENÓMENOS OVNI DOCUMENTADOS  ---------- */

    // 🌟 Encuentro Cercano Tipo I
    async function closeEncounter1(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌟 Simulando Encuentro Cercano Tipo I`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        // Observación a menos de 150m sin efectos físicos
        const observationDistance = 150 - intensity * 20;
        const duration = 60 + intensity * 30;

        const ufoX = target.x + (Math.random() - 0.5) * 100; // Slightly randomized start
        const ufoY = target.y - (100 + Math.random() * 50);

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const ufoSize = 18 + intensity * 2;
            // Simple disc-shaped UFO
            for (let segment = 0; segment < 12; segment++) {
                const angle = (segment / 12) * Math.PI * 2;
                const segmentX = ufoX + ufoSize * Math.cos(angle);
                const segmentY = ufoY + ufoSize * Math.sin(angle) * 0.3;
                drawUFOCommand(ufoX, ufoY, segmentX, segmentY, '#d3d3d3', 5);
            }
            // Add subtle lights
            if (frame % 10 < 5) { // Flickering effect
                drawUFOCommand(ufoX - 8, ufoY + 5, ufoX + 8, ufoY + 5, '#00ffff', 2);
            }

            await new Promise(r => setTimeout(r, 120));
        }
    }

    // 👽 Encuentro Cercano Tipo II
    async function closeEncounter2(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`👽 Simulando Encuentro Cercano Tipo II (Efectos físicos)`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const encounterX = target.x + 50;
        const encounterY = target.y - 100;
        const duration = 100 + intensity * 40;

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const ufoSize = 20 + intensity * 3;
            // Solid UFO body
            for (let segment = 0; segment < 16; segment++) {
                const angle = (segment / 16) * Math.PI * 2;
                const segmentX = encounterX + ufoSize * Math.cos(angle);
                const segmentY = encounterY + ufoSize * Math.sin(angle) * 0.4;
                drawUFOCommand(encounterX, encounterY, segmentX, segmentY, '#d3d3d3', 6);
            }

            // Physical effects (e.g., ground disturbance, electromagnetic interference)
            if (frame % 8 === 0) {
                // Ground disturbance
                for (let i = 0; i < 5; i++) {
                    const randOffset = (Math.random() - 0.5) * 50;
                    drawUFOCommand(target.x + randOffset, target.y + target.height / 2, target.x + randOffset + 10, target.y + target.height / 2 + 10, '#8b4513', 2); // Brown lines for disturbed ground
                }
                // Electromagnetic pulse (visualized as expanding rings)
                const empRadius = (frame % 30) * (2 + intensity * 0.5);
                const empAlpha = 1 - (empRadius / (30 * (2 + intensity * 0.5)));
                drawUFOCommand(target.x, target.y, target.x + empRadius, target.y + empRadius, `rgba(0,255,255,${empAlpha})`, 2); // Cyan rings
                drawUFOCommand(target.x, target.y, target.x - empRadius, target.y - empRadius, `rgba(0,255,255,${empAlpha})`, 2);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 🛸 Encuentro Cercano Tipo III
    async function closeEncounter3(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🛸 Simulando Encuentro Cercano Tipo III (Avistamiento de ocupantes)`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const ufoX = target.x - 100;
        const ufoY = target.y - 80;
        const duration = 80 + intensity * 30;

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const ufoSize = 25 + intensity * 4;
            // Large, prominent UFO
            for (let segment = 0; segment < 20; segment++) {
                const angle = (segment / 20) * Math.PI * 2;
                const segmentX = ufoX + ufoSize * Math.cos(angle);
                const segmentY = ufoY + ufoSize * Math.sin(angle) * 0.3;
                drawUFOCommand(ufoX, ufoY, segmentX, segmentY, '#808080', 7);
            }
            // Beam descending from UFO (for occupants)
            const beamHeight = 40 + Math.sin(frame * 0.1) * 10;
            const beamWidth = 10 + intensity * 2;
            drawUFOCommand(ufoX - beamWidth / 2, ufoY + ufoSize / 2, ufoX - beamWidth / 2, ufoY + ufoSize / 2 + beamHeight, '#ffffcc', 3);
            drawUFOCommand(ufoX + beamWidth / 2, ufoY + ufoSize / 2, ufoX + beamWidth / 2, ufoY + ufoSize / 2 + beamHeight, '#ffffcc', 3);
            drawUFOCommand(ufoX - beamWidth / 2, ufoY + ufoSize / 2 + beamHeight, ufoX + beamWidth / 2, ufoY + ufoSize / 2 + beamHeight, '#ffffcc', 3);

            // Occupant silhouette (very simplified)
            if (frame % 20 < 10) { // Flickering
                drawUFOCommand(ufoX, ufoY + ufoSize / 2 + beamHeight + 5, ufoX, ufoY + ufoSize / 2 + beamHeight + 25, '#000000', 5); // Body
                drawUFOCommand(ufoX, ufoY + ufoSize / 2 + beamHeight, ufoX, ufoY + ufoSize / 2 + beamHeight + 5, '#000000', 8); // Head
            }

            await new Promise(r => setTimeout(r, 150));
        }
    }


    // ⚫ Fenómeno de Absorción Lumínica
    async function lightAbsorption(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`⚫ Simulando absorción lumínica`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 100 + intensity * 40;
        const absorptionCenterX = target.x;
        const absorptionCenterY = target.y - 30;

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const maxAbsorbRadius = 60 + intensity * 20;
            const currentAbsorbRadius = (frame / duration) * maxAbsorbRadius;
            const alpha = 1 - (frame / duration); // Fades out as it "absorbs"

            // Darkening/absorbing core
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2 + frame * 0.1;
                const innerRadius = currentAbsorbRadius * 0.5;
                const outerRadius = currentAbsorbRadius;
                drawUFOCommand(
                    absorptionCenterX + innerRadius * Math.cos(angle),
                    absorptionCenterY + innerRadius * Math.sin(angle),
                    absorptionCenterX + outerRadius * Math.cos(angle + 0.5), // Offset for a swirl
                    absorptionCenterY + outerRadius * Math.sin(angle + 0.5),
                    `rgba(0,0,0,${alpha * 0.8})`, // Black, fading
                    5
                );
            }
            // "Light particles" being drawn in
            if (frame % 5 === 0) {
                for (let j = 0; j < 5; j++) {
                    const particleX = absorptionCenterX + (Math.random() - 0.5) * maxAbsorbRadius;
                    const particleY = absorptionCenterY + (Math.random() - 0.5) * maxAbsorbRadius;
                    drawUFOCommand(particleX, particleY, absorptionCenterX, absorptionCenterY, `rgba(255,255,255,${alpha})`, 1);
                }
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 🌌 Distorsión Espacial Localizada
    async function spatialDistortion(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌌 Simulando distorsión espacial localizada`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const duration = 90 + intensity * 40;
        const distortionRadius = 50 + intensity * 20;

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const centerX = target.x + (Math.sin(frame * 0.08) * 30);
            const centerY = target.y + (Math.cos(frame * 0.06) * 20);

            // Distorting lines
            for (let i = 0; i < 10; i++) {
                const startAngle = (i / 10) * Math.PI * 2;
                const endAngle = startAngle + Math.sin(frame * 0.1 + i) * 0.5; // Warping effect
                const startX = centerX + distortionRadius * Math.cos(startAngle);
                const startY = centerY + distortionRadius * Math.sin(startAngle);
                const endX = centerX + distortionRadius * 1.2 * Math.cos(endAngle);
                const endY = centerY + distortionRadius * 1.2 * Math.sin(endAngle);
                drawUFOCommand(startX, startY, endX, endY, '#8a2be2', 1); // Blue-violet for space distortion
            }
            // Central anomaly
            const anomalySize = 10 + Math.sin(frame * 0.2) * 5;
            for (let j = 0; j < 6; j++) {
                const angle = (j / 6) * Math.PI * 2;
                drawUFOCommand(centerX, centerY, centerX + anomalySize * Math.cos(angle), centerY + anomalySize * Math.sin(angle), '#ffffff', 3);
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 📊 Anomalía Multi-Espectral
    async function multispectralAnomaly(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`📊 Simulando anomalía multi-espectral`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const anomalyX = target.x + 30;
        const anomalyY = target.y - 50;
        const duration = 100 + intensity * 40;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']; // RGB, CMY

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const pulseSize = 20 + Math.sin(frame * 0.1) * 10;
            const pulseColor = colors[Math.floor((frame / 5) % colors.length)];

            // Central anomaly pulse
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const rayX = anomalyX + pulseSize * Math.cos(angle);
                const rayY = anomalyY + pulseSize * Math.sin(angle);
                drawUFOCommand(anomalyX, anomalyY, rayX, rayY, pulseColor, 4);
            }

            // Fading rings for different spectrums
            for (let layer = 0; layer < 3; layer++) {
                const ringRadius = (frame % 40) + layer * 15;
                const ringAlpha = 1 - (ringRadius / (40 + 2 * 15));
                const ringColor = colors[(layer + frame) % colors.length];
                // Draw a circle segment for simplicity
                for (let segment = 0; segment < 12; segment++) {
                    const startAngle = (segment / 12) * Math.PI * 2;
                    const endAngle = ((segment + 1) / 12) * Math.PI * 2;
                    drawUFOCommand(anomalyX + ringRadius * Math.cos(startAngle), anomalyY + ringRadius * Math.sin(startAngle),
                                   anomalyX + ringRadius * Math.cos(endAngle), anomalyY + ringRadius * Math.sin(endAngle),
                                   `rgba(${parseInt(ringColor.substring(1,3),16)},${parseInt(ringColor.substring(3,5),16)},${parseInt(ringColor.substring(5,7),16)},${Math.max(0, ringAlpha)})`, 2);
                }
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 🔮 Manifestación Plasmática
    async function plasmaManifestation(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🔮 Simulando manifestación plasmática`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y - 60;
        const duration = 100 + intensity * 40;

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            const plasmaRadius = 30 + Math.sin(frame * 0.1) * 15;
            const plasmaColor = `hsl(${frame * 5 % 360}, 100%, 50%)`; // Hue changes over time

            // Plasma core
            for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * Math.PI * 2 + Math.random() * 0.5;
                const dist = plasmaRadius * Math.random();
                drawUFOCommand(centerX, centerY, centerX + dist * Math.cos(angle), centerY + dist * Math.sin(angle), plasmaColor, 2);
            }
            // Flickering arcs
            if (frame % 5 === 0) {
                for (let j = 0; j < 5; j++) {
                    const arcAngle = (Math.random() * Math.PI * 2);
                    const arcX = centerX + (plasmaRadius + 10) * Math.cos(arcAngle);
                    const arcY = centerY + (plasmaRadius + 10) * Math.sin(arcAngle);
                    drawUFOCommand(centerX, centerY, arcX, arcY, '#ffd700', 1); // Gold sparks
                }
            }

            await new Promise(r => setTimeout(r, 70));
        }
    }

    // 🌪️ Vórtice Atmosférico Controlado
    async function controlledVortex(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌪️ Simulando vórtice atmosférico controlado`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const vortexX = target.x;
        const vortexY = target.y - 50;
        const duration = 120 + intensity * 50;
        const maxRadius = 80 + intensity * 20;

        for (let frame = 0; frame < duration; frame++) {
            if (stopSignal) break;

            // Spiral lines forming the vortex
            for (let i = 0; i < 10; i++) {
                const angleOffset = i * 0.5;
                const radiusGrowth = frame * 0.8;
                const currentAngle = (frame * 0.2) + angleOffset;
                const currentRadius = Math.min(radiusGrowth, maxRadius);

                const startX = vortexX + (currentRadius - 10) * Math.cos(currentAngle - 0.1);
                const startY = vortexY + (currentRadius - 10) * Math.sin(currentAngle - 0.1);
                const endX = vortexX + currentRadius * Math.cos(currentAngle);
                const endY = vortexY + currentRadius * Math.sin(currentAngle);

                drawUFOCommand(startX, startY, endX, endY, '#808080', 2); // Grey for cloud/vortex
            }
            // Central eye effect
            const eyeSize = 5 + Math.sin(frame * 0.1) * 3;
            for (let j = 0; j < 4; j++) {
                const angle = (j / 4) * Math.PI * 2;
                drawUFOCommand(vortexX, vortexY, vortexX + eyeSize * Math.cos(angle), vortexY + eyeSize * Math.sin(angle), '#ffffff', 3);
            }

            await new Promise(r => setTimeout(r, 90));
        }
    }


    /* ----------  FUNCIONES PRINCIPALES  ---------- */

    function updatePlayerOptions() {
        const currentSelection = playerSelect.value;
        playerSelect.innerHTML = '';

        const playerElements = document.querySelectorAll('.spawnedavatar[data-playerid], .playerlist-row[data-playerid]');
        const validPlayers = [];

        playerElements.forEach(el => {
            const playerId = el.dataset.playerid;
            if (!playerId || playerId === '0' || el.dataset.self === 'true') return;

            let playerName = '';
            const nicknameEl = el.querySelector('.nickname, .playerlist-name a, .player-name');
            if (nicknameEl) {
                playerName = nicknameEl.textContent.trim();
            }

            if (!playerName) {
                const parentRow = el.closest('.playerlist-row');
                if (parentRow) {
                    const nameEl = parentRow.querySelector('.playerlist-name a, .player-name');
                    if (nameEl) playerName = nameEl.textContent.trim();
                }
            }

            if (!playerName) playerName = `Sujeto ${playerId}`;

            if (!validPlayers.some(p => p.id === playerId)) {
                validPlayers.push({ id: playerId, name: playerName });
            }
        });

        if (validPlayers.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = '❌ No hay objetivos disponibles';
            playerSelect.appendChild(opt);
            executeBtn.disabled = true;
        } else {
            validPlayers.forEach(player => {
                const opt = document.createElement('option');
                opt.value = player.id;
                opt.textContent = `🎯 ${player.name}`;
                playerSelect.appendChild(opt);
            });

            const stillExists = validPlayers.some(p => p.id === currentSelection);
            if (currentSelection && stillExists) {
                playerSelect.value = currentSelection;
            } else {
                playerSelect.selectedIndex = 0;
            }

            executeBtn.disabled = false;
        }
    }

    async function executeUFOSimulation() {
        if (isExecuting) return;

        const playerId = playerSelect.value;
        const maneuverType = maneuverSelect.value;
        const phenomenonType = phenomenonSelect.value;
        const intensity = parseInt(intensitySlider.value);
        const shouldRepeat = repeatToggle.checked;

        if (!playerId) {
            alert('🚫 Por favor selecciona un objetivo válido');
            return;
        }

        if (!maneuverType && !phenomenonType) {
            alert('🚫 Por favor selecciona una maniobra o fenómeno');
            return;
        }

        isExecuting = true;
        stopSignal = false;
        executeBtn.disabled = true;
        stopBtn.disabled = false;

        do {
            try {
                if (maneuverType) {
                    switch (maneuverType) {
                        case 'maneuver:tic_tac_erratic':
                            await ticTacErratic(playerId, intensity);
                            break;
                        case 'maneuver:instant_acceleration':
                            await instantAcceleration(playerId, intensity);
                            break;
                        case 'maneuver:absolute_hover':
                            await absoluteHover(playerId, intensity);
                            break;
                        case 'maneuver:impossible_turns':
                            await impossibleTurns(playerId, intensity);
                            break;
                        case 'maneuver:intelligent_evasion':
                            await intelligentEvasion(playerId, intensity);
                            break;
                        case 'maneuver:multi_sensor_detection':
                            await multiSensorDetection(playerId, intensity);
                            break;
                        case 'maneuver:gimbal_rotation':
                            await gimbalRotation(playerId, intensity);
                            break;
                        case 'maneuver:sudden_disappearance':
                            await suddenDisappearance(playerId, intensity);
                            break;
                        case 'maneuver:oceanic_pattern':
                            await oceanicPattern(playerId, intensity);
                            break;
                        case 'maneuver:nuclear_monitoring':
                            await nuclearMonitoring(playerId, intensity);
                            break;
                    }
                }

                if (phenomenonType) {
                    switch (phenomenonType) {
                        case 'phenomenon:triangular_formation':
                            await triangularFormation(playerId, intensity);
                            break;
                        case 'phenomenon:close_encounter_1':
                            await closeEncounter1(playerId, intensity);
                            break;
                        case 'phenomenon:close_encounter_2':
                            await closeEncounter2(playerId, intensity);
                            break;
                        case 'phenomenon:close_encounter_3':
                            await closeEncounter3(playerId, intensity);
                            break;
                        case 'phenomenon:light_absorption':
                            await lightAbsorption(playerId, intensity);
                            break;
                        case 'phenomenon:spatial_distortion':
                            await spatialDistortion(playerId, intensity);
                            break;
                        case 'phenomenon:multispectral_anomaly':
                            await multispectralAnomaly(playerId, intensity);
                            break;
                        case 'phenomenon:plasma_manifestation':
                            await plasmaManifestation(playerId, intensity);
                            break;
                        case 'phenomenon:controlled_vortex':
                            await controlledVortex(playerId, intensity);
                            break;
                    }
                }

                if (shouldRepeat && !stopSignal) {
                    await new Promise(r => setTimeout(r, 1500));
                }

            } catch (error) {
                console.error('🛸 Error en simulación OVNI:', error);
                break;
            }
        } while (shouldRepeat && !stopSignal);

        isExecuting = false;
        executeBtn.disabled = false;
        stopBtn.disabled = true;
        console.log('🛸 Simulación de fenómenos OVNI completada');
    }

    function stopExecution() {
        stopSignal = true;
        isExecuting = false;
        if (activeEffectInterval) {
            clearInterval(activeEffectInterval);
            activeEffectInterval = null;
        }
        executeBtn.disabled = false;
        stopBtn.disabled = true;
        console.log('🛑 Simulación detenida por el operador');
    }

    /* ----------  EVENT LISTENERS  ---------- */

    executeBtn.addEventListener('click', executeUFOSimulation);
    stopBtn.addEventListener('click', stopExecution);

    setInterval(updatePlayerOptions, 2000);
    updatePlayerOptions();

    // Hacer el contenedor arrastrable
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - container.offsetLeft;
        dragOffsetY = e.clientY - container.offsetTop;
        titleBar.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = (e.clientX - dragOffsetX) + 'px';
            container.style.top = (e.clientY - dragOffsetY) + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'grab';
    });

    console.log('🛸 SIMULADOR DE FENÓMENOS OVNI cargado exitosamente! 🛸');
    console.log('📡 Basado en casos documentados del Pentágono - USS Nimitz, GIMBAL, FLIR1');
    console.log('⚡ Maniobras imposibles: Tic Tac, aceleración instantánea, curvas indefinidas');

})();