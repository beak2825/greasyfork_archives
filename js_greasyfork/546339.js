// ==UserScript==
// @name         The Solar Smash Mod
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Unleash unique Solar Smash weapons and effects - each weapon has its own distinct behavior!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/546339/The%20Solar%20Smash%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/546339/The%20Solar%20Smash%20Mod.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------  ARMAS ÚNICAS DE SOLAR SMASH  ---------- */

    const SOLAR_WEAPONS = {
        'Ninguno': '',
        '⚡ Rayo Láser': 'weapon:laser_beam', // 1.1 (reordenado)
        '🔮 Rayo de Plasma': 'weapon:plasma_beam', // 1.1 (reordenado)
        '🌠 Lluvia de Meteoritos': 'weapon:meteor_rain', // 1.1
        '☄️ Asteroide Gigante': 'weapon:giant_asteroid', // 1.1
        '🔥 Dragón Espacial': 'weapon:space_dragon', // 1.1
        '🛸 Invasión OVNI': 'weapon:ufo_invasion', // 1.1 (queda como arma, solo batches y 1 ovni)
        '🗡️ Sable Láser Galáctico': 'weapon:galactic_lightsaber', // 1.1
        '🚀 Misil de Antimateria': 'weapon:antimatter_missile', // 1.1
        '🌪️ Vórtice Gravitacional': 'weapon:gravity_vortex', // 1.1 (queda como arma, delays y batches)
        '🌑 Agujero Negro': 'weapon:black_hole' // 1.1 (queda como arma, solo batches)
    };

    const SOLAR_EFFECTS = {
        'Ninguno': '',
        '⚡ Rayo Láser (v1.0)': 'effect:laser_beam_v1_0', // 1.0 (reordenado)
        '🛡️ Escudo Planetario': 'effect:planetary_shield', // 1.1 (delays y batches)
        '🎆 Fuegos Artificiales Solares': 'effect:solar_fireworks', // 1.1
        '❄️ Era de Hielo Instantánea': 'effect:instant_ice_age', // 1.1 (delays y batches)
        '🌋 Erupción Volcánica': 'effect:volcanic_eruption', // 1.1
        '🌀 Anomalía Espacial': 'effect:space_anomaly', // 1.1 (delays y batches)
        '🛸 Invasión OVNI (v1.0)': 'effect:ufo_invasion_v1_0', // 1.0
        '🌪️ Vórtice Gravitacional (v1.0)': 'effect:gravity_vortex_v1_0', // 1.0 (delays y batches)
        '🌑 Agujero Negro (v1.0)': 'effect:black_hole_v1_0' // 1.0 (solo batches)
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
        background:linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
        color:#fff; padding:15px 20px; border-radius:15px;
        font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif; font-size:13px;
        display:flex; flex-direction:column; gap:12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
        border: 2px solid #00ffff;
        min-width: 320px;
        backdrop-filter: blur(10px);
        cursor: default;
    `;

    const titleBar = document.createElement('div');
    titleBar.innerHTML = '🌌 THE SOLAR SMASH MOD 🌌';
    titleBar.style.cssText = `
        font-weight: bold; font-size: 16px; text-align: center; cursor: grab;
        background: linear-gradient(45deg, #ff6b35, #f7931e, #ffcc02);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
        margin: -15px -20px 10px -20px; padding: 15px 20px;
        border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        border-radius: 15px 15px 0 0;
    `;
    container.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `display:flex; flex-direction:column; gap:12px;`;
    container.appendChild(contentDiv);

    const solarInputStyle = `
        flex-grow: 1; padding: 8px 12px; border-radius: 8px;
        border: 2px solid #00ffff; background: rgba(0, 20, 40, 0.8);
        color: #00ffff; font-size: 13px; font-family: 'Orbitron', monospace;
        transition: all 0.3s ease;
        appearance: none;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300ffff%22%20d%3D%22M287%2C197.3L159.2%2C69.5c-3.6-3.6-8.2-5.4-12.8-5.4s-9.2%2C1.8-12.8%2C5.4L5.4%2C197.3c-7.2%2C7.2-7.2%2C18.8%2C0%2C26c3.6%2C3.6%2C8.2%2C5.4%2C12.8%2C5.4s9.2%2C1.8%2C12.8%2C5.4l117%2C117c3.6%2C3.6%2C8.2%2C5.4%2C12.8%2C5.4s9.2%2C1.8%2C12.8%2C5.4l117-117c7.2-7.2%2C7.2-18.8%2C0-26C294.2%2C204.5%2C294.2%2C200.9%2C287%2C197.3z%22%2F%3E%3C%2Fsvg%3E');
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 12px;
        cursor: pointer;
    `;

    function createSolarRow(parent, labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex; align-items:center; gap:12px;`;
        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.cssText = `color: #00ffff; font-weight: bold; min-width: 90px;`;
        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
        parent.appendChild(wrapper);
        return { wrapper, label, inputElement };
    }

    // Selector de jugadores
    const playerSelect = document.createElement('select');
    playerSelect.style.cssText = solarInputStyle;
    createSolarRow(contentDiv, '🎯 Target:', playerSelect);

    // Selector de armas
    const weaponSelect = document.createElement('select');
    weaponSelect.style.cssText = solarInputStyle;
    for (const name in SOLAR_WEAPONS) {
        const opt = document.createElement('option');
        opt.value = SOLAR_WEAPONS[name];
        opt.textContent = name;
        weaponSelect.appendChild(opt);
    }
    weaponSelect.value = SOLAR_WEAPONS['Ninguno'];
    createSolarRow(contentDiv, '⚔️ Weapon:', weaponSelect);

    // Selector de efectos
    const effectSelect = document.createElement('select');
    effectSelect.style.cssText = solarInputStyle;
    for (const name in SOLAR_EFFECTS) {
        const opt = document.createElement('option');
        opt.value = SOLAR_EFFECTS[name];
        opt.textContent = name;
        effectSelect.appendChild(opt);
    }
    effectSelect.value = SOLAR_EFFECTS['Ninguno'];
    createSolarRow(contentDiv, '✨ Effect:', effectSelect);

    // Auto-reset de selectores
    weaponSelect.addEventListener('change', () => {
        if (weaponSelect.value !== '') {
            effectSelect.value = SOLAR_EFFECTS['Ninguno'];
        }
    });

    effectSelect.addEventListener('change', () => {
        if (effectSelect.value !== '') {
            weaponSelect.value = SOLAR_WEAPONS['Ninguno'];
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
        background: linear-gradient(to right, #00ffff 0%, #ff6b35 100%);
        outline: none;
    `;
    createSolarRow(contentDiv, '⚡ Power:', intensitySlider);

    // Repeat toggle
    const repeatToggle = document.createElement('input');
    repeatToggle.type = 'checkbox';
    repeatToggle.id = 'solarRepeatToggle';
    repeatToggle.style.cssText = `margin-right: 8px; cursor: pointer; transform: scale(1.3);`;
    const repeatLabel = document.createElement('label');
    repeatLabel.htmlFor = 'solarRepeatToggle';
    repeatLabel.textContent = ' 🔄 Repeat Action';
    repeatLabel.style.cssText = `display: flex; align-items: center; cursor: pointer; color: #00ffff;`;
    const repeatWrapper = document.createElement('div');
    repeatWrapper.style.cssText = `display:flex; align-items:center; gap:0;`;
    repeatWrapper.appendChild(repeatToggle);
    repeatWrapper.appendChild(repeatLabel);
    contentDiv.appendChild(repeatWrapper);

    // Botones
    const executeBtn = document.createElement('button');
    executeBtn.textContent = '🚀 EXECUTE SOLAR WEAPON';
    executeBtn.disabled = true;
    executeBtn.style.cssText = `
        padding: 12px 20px; border-radius: 10px; border: none;
        background: linear-gradient(145deg, #ff6b35, #f7931e);
        color: white; font-weight: bold; font-size: 15px;
        cursor: pointer; transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
        text-transform: uppercase; letter-spacing: 1px;
    `;

    stopBtn = document.createElement('button');
    stopBtn.textContent = '🛑 STOP DESTRUCTION';
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
    function drawSolarCommand(x1, y1, x2, y2, color, thickness) {
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

    /* ----------  ARMAS ÚNICAS (VERSION 1.1) ---------- */

 // 🌠 Lluvia de Meteoritos
async function meteorRain(playerId, intensity = 3) {
    if (stopSignal) return;
    console.log(`🌠 Lluvia de meteoritos iniciada`);

    const target = getPlayerCoords(playerId);
    if (!target) return;

    const meteorCount = 20 + (intensity * 8); // Ahora es número de flores
    const colors = ['#ff4500', '#ff6347', '#ffa500']; // Ahora colores de pétalos

    for (let i = 0; i < meteorCount; i++) {
        if (stopSignal) break;

        // NUEVO: En lugar de meteoros cayendo, flores creciendo desde el centro
        const startX = target.x; // Todas las "flores" nacen del centro
        const startY = target.y;

        // Posición final: patrón radial en lugar de caída
        const flowerAngle = (i / meteorCount) * Math.PI * 2; // Distribución circular
        const flowerDistance = 50 + (i % 4) * 25; // Capas de flores
        const endX = target.x + flowerDistance * Math.cos(flowerAngle);
        const endY = target.y + flowerDistance * Math.sin(flowerAngle) * 0.7; // Aplanado

        const color = colors[Math.floor(Math.random() * colors.length)];

        // NUEVO: Tallo de la flor en lugar de meteorito
        drawSolarCommand(startX, startY, endX, endY, '#ffe99c', 2 + Math.random() * 3);

        // Mini explosión al impactar
        // NUEVO: Pétalos de flor en lugar de chispas de explosión
        for (let spark = 0; spark < 3; spark++) {
            const sparkAngle = (spark / 3) * Math.PI * 2; // Pétalos ordenados
            const sparkDist = 8 + Math.random() * 12; // Tamaño del pétalo
            const sparkX = endX + sparkDist * Math.cos(sparkAngle + flowerAngle);
            const sparkY = endY + sparkDist * Math.sin(sparkAngle + flowerAngle);

            // Dibujar pétalo como línea curvada
            drawSolarCommand(endX, endY, sparkX, sparkY, color, 1);

            // NUEVO: Centro de la flor
            const centerX = endX + 3 * Math.cos(sparkAngle + Math.PI);
            const centerY = endY + 3 * Math.sin(sparkAngle + Math.PI);
            drawSolarCommand(endX, endY, centerX, centerY, '#FFD700', 2);
        }

        // NUEVO: Hojas adicionales para hacer más realista
        if (i % 2 === 0) {
            const leafAngle1 = flowerAngle + Math.PI * 0.3;
            const leafAngle2 = flowerAngle - Math.PI * 0.3;
            const leafDist = flowerDistance * 0.6;

            const leaf1X = target.x + leafDist * Math.cos(leafAngle1);
            const leaf1Y = target.y + leafDist * Math.sin(leafAngle1) * 0.7;
            const leaf2X = target.x + leafDist * Math.cos(leafAngle2);
            const leaf2Y = target.y + leafDist * Math.sin(leafAngle2) * 0.7;

            drawSolarCommand(startX, startY, leaf1X, leaf1Y, '#ffa159', 1);
            drawSolarCommand(startX, startY, leaf2X, leaf2Y, '#ffcd59', 1);
        }

        await new Promise(r => setTimeout(r, 80 + Math.random() * 60));
    }
}


    // ☄️ Asteroide Gigante
    async function giantAsteroid(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`☄️ Asteroide gigante aproximándose`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const size = 30 + intensity * 10;
        const startX = -100;
        const startY = -100;
        const endX = target.x;
        const endY = target.y;

        // Animación de aproximación
        const steps = 25;
        for (let step = 0; step < steps; step++) {
            if (stopSignal) break;

            const progress = step / steps;
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            const currentSize = size * (0.2 + progress * 0.8);

            // Núcleo del asteroide
            drawSolarCommand(currentX - currentSize/2, currentY - currentSize/2,
                           currentX + currentSize/2, currentY + currentSize/2, '#8B4513', currentSize/3);

            // Cola ardiente
            for (let trail = 0; trail < 8; trail++) {
                const trailX = currentX - (progress * 50) - trail * 15;
                const trailY = currentY - (progress * 50) - trail * 15;
                drawSolarCommand(currentX, currentY, trailX, trailY, '#ff4500', 8 - trail);
            }

            await new Promise(r => setTimeout(r, 120));
        }

        // Impacto devastador
        for (let explosion = 0; explosion < 30; explosion++) {
            if (stopSignal) break;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (80 + intensity * 20);
            const impactX = endX + distance * Math.cos(angle);
            const impactY = endY + distance * Math.sin(angle);
            const color = ['#ff0000', '#ff4500', '#ffa500'][Math.floor(Math.random() * 3)];
            drawSolarCommand(endX, endY, impactX, impactY, color, 8 + Math.random() * 6);
        }
    }


    // ⚡ Rayo Láser (Version 1.1 - Weapon)
    async function laserBeam(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`⚡ Disparando rayo láser`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = Math.random() * canvas.width;
        const startY = 0;
        const endX = target.x;
        const endY = target.y;

        // Carga láser
        for (let charge = 0; charge < 10; charge++) {
            if (stopSignal) break;
            const chargeIntensity = charge * 3;
            drawSolarCommand(startX - chargeIntensity, startY, startX + chargeIntensity, startY, '#ff0000', chargeIntensity);
            await new Promise(r => setTimeout(r, 100));
        }

        // Disparo continuo
        const beamDuration = 2000 + intensity * 500;
        const beamStart = Date.now();

        while (Date.now() - beamStart < beamDuration) {
            if (stopSignal) break;

            // Rayo principal
            drawSolarCommand(startX, startY, endX, endY, '#ff0000', 15);
            drawSolarCommand(startX, startY, endX, endY, '#ffffff', 8);

            // Efectos de dispersión
            for (let scatter = 0; scatter < 3; scatter++) {
                const scatterX = endX + (Math.random() - 0.5) * 30;
                const scatterY = endY + (Math.random() - 0.5) * 30;
                drawSolarCommand(endX, endY, scatterX, scatterY, '#ff6600', 4);
            }

            await new Promise(r => setTimeout(r, 50));
        }
    }

    // ⚡ Rayo Láser (Version 1.0 - Effect)
    async function laserBeam_v1_0(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`⚡ Disparando rayo láser a jugador ${playerId} (v1.0)`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = Math.random() * canvas.width;
        const startY = 0;
        const endX = target.x;
        const endY = target.y;

        const duration = 1000 + intensity * 500;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            // Núcleo del láser
            drawSolarCommand(startX, startY, endX, endY, '#00ffff', 6 + intensity);
            drawSolarCommand(startX, startY, endX, endY, '#ffffff', 3 + intensity);

            // Efectos de energía
            for (let i = 0; i < 5; i++) {
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 10;
                drawSolarCommand(
                    startX + offsetX, startY + offsetY,
                    endX + offsetX, endY + offsetY,
                    '#87ceeb', 1 + Math.random() * 2
                );
            }

            await new Promise(r => setTimeout(r, 50));
        }

        // Impacto final
        await createEnergyImpact(endX, endY, intensity);
    }

    // 🔮 Rayo de Plasma
    async function plasmaBeam(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🔮 Disparando rayo de plasma`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const startX = Math.random() * canvas.width;
        const startY = 0;
        const endX = target.x;
        const endY = target.y;

        // Carga de plasma
        for (let charge = 0; charge < 8; charge++) {
            if (stopSignal) break;
            const chargeRadius = charge * 5;
            for (let spark = 0; spark < 12; spark++) {
                const angle = (spark / 12) * Math.PI * 2 + charge * 0.5;
                const sparkX = startX + chargeRadius * Math.cos(angle);
                const sparkY = startY + chargeRadius * Math.sin(angle);
                drawSolarCommand(startX, startY, sparkX, sparkY, '#ff00ff', 4 - charge * 0.3);
            }
            await new Promise(r => setTimeout(r, 150));
        }

        // Disparo del plasma
        const beamDuration = 2000;
        const beamStartTime = Date.now();

        while (Date.now() - beamStartTime < beamDuration) {
            if (stopSignal) break;

            // Rayo principal ondulante
            const waveOffset = Math.sin((Date.now() - beamStartTime) * 0.01) * 15;

            // Núcleo del plasma
            drawSolarCommand(startX, startY, endX + waveOffset, endY, '#ff00ff', 12);
            drawSolarCommand(startX, startY, endX + waveOffset, endY, '#ffffff', 6);

            // Descargas laterales
            for (let discharge = 0; discharge < 5; discharge++) {
                const progress = discharge / 5;
                const dischargeX = startX + (endX - startX) * progress + waveOffset * progress;
                const dischargeY = startY + (endY - startY) * progress;
                const sideX = dischargeX + (Math.random() - 0.5) * 40;
                const sideY = dischargeY + (Math.random() - 0.5) * 40;

                drawSolarCommand(dischargeX, dischargeY, sideX, sideY, '#ff00ff', 3);
            }

            await new Promise(r => setTimeout(r, 80));
        }

        // Impacto de plasma
        for (let impact = 0; impact < 15; impact++) {
            if (stopSignal) break;
            const burstAngle = Math.random() * Math.PI * 2;
            const burstDist = Math.random() * 60;
            const burstX = endX + burstDist * Math.cos(burstAngle);
            const burstY = endY + burstDist * Math.sin(burstAngle);
            drawSolarCommand(endX, endY, burstX, burstY, '#ff00ff', 6 - impact * 0.3);
        }
    }

    // 🔥 Dragón Espacial
    async function spaceDragon(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🔥 Invocando dragón espacial`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        let dragonX = -100;
        let dragonY = target.y - 50;
        const dragonSize = 20 + intensity * 8;

        // Vuelo del dragón
        const flightSteps = 60;
        for (let step = 0; step < flightSteps; step++) {
            if (stopSignal) break;

            const nextX = dragonX + (canvas.width + 200) / flightSteps;
            const nextY = dragonY + Math.sin(step * 0.2) * 20;

            // Cuerpo del dragón
            drawSolarCommand(dragonX, dragonY, nextX, nextY, '#8B0000', dragonSize);

            // Alas
            const wingSpan = dragonSize * 1.5;
            const wingAngle = Math.sin(step * 0.5) * 0.5;
            const wingY1 = nextY - wingSpan * Math.cos(wingAngle);
            const wingY2 = nextY + wingSpan * Math.cos(wingAngle);
            drawSolarCommand(nextX, nextY, nextX - wingSpan, wingY1, '#4B0000', dragonSize * 0.3);
            drawSolarCommand(nextX, nextY, nextX - wingSpan, wingY2, '#4B0000', dragonSize * 0.3);

            // Llamas del dragón hacia el objetivo
            if (step > 20 && Math.abs(nextX - target.x) < 100) {
                for (let flame = 0; flame < 8; flame++) {
                    const flameAngle = Math.atan2(target.y - nextY, target.x - nextX) + (Math.random() - 0.5) * 0.5;
                    const flameDist = 30 + Math.random() * 50;
                    const flameX = nextX + flameDist * Math.cos(flameAngle);
                    const flameY = nextY + flameDist * Math.sin(flameAngle);
                    const flameColors = ['#ff4500', '#ff6600', '#ffa500'];
                    drawSolarCommand(nextX, nextY, flameX, flameY, flameColors[flame % 3], 6);
                }
            }

            dragonX = nextX;
            dragonY = nextY;
            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 🌑 Agujero Negro (Version 1.1 - Weapon) - Solo Batches
    async function blackHole(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌑 Creando agujero negro`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const duration = 50 + intensity * 50;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            const elapsed = Date.now() - startTime;

            // Horizonte de eventos (negro)
            const eventHorizon = 20 + intensity * 5;
            for (let horizon = 0; horizon < 16; horizon++) {
                const hAngle = (horizon / 16) * Math.PI * 2;
                const hX = centerX + eventHorizon * Math.cos(hAngle);
                const hY = centerY + eventHorizon * Math.sin(hAngle);
                drawSolarCommand(centerX, centerY, hX, hY, '#000000', 8);
            }

            // Disco de acreción
            const accretionLayers = 5;
            for (let layer = 0; layer < accretionLayers; layer++) {
                const layerRadius = eventHorizon + (layer + 1) * (15 + intensity * 3);
                const layerSpeed = elapsed * (0.0001 + layer * 0.00005);
                const layerSegments = 20;

                for (let seg = 0; seg < layerSegments; seg++) {
                    const segAngle = (seg / layerSegments) * Math.PI * 2 + layerSpeed;
                    const nextAngle = ((seg + 1) / layerSegments) * Math.PI * 2 + layerSpeed;

                    const x1 = centerX + layerRadius * Math.cos(segAngle);
                    const y1 = centerY + layerRadius * Math.sin(segAngle) * 0.3;
                    const x2 = centerX + layerRadius * Math.cos(nextAngle);
                    const y2 = centerY + layerRadius * Math.sin(nextAngle) * 0.3;

                    const layerColors = ['#ff6600', '#ff4500', '#ff0000', '#8B0000', '#4B0000'];
                    drawSolarCommand(x1, y1, x2, y2, layerColors[layer], 6 - layer);
                }
            }

// Círculo de materia orbital
const orbitalRadius = 80 + intensity * 20;
const particleCount = 12 + intensity * 4;
for (let particle = 0; particle < particleCount; particle++) {
    const particleAngle = (particle / particleCount) * Math.PI * 2 + elapsed * 0.002;
    const particleX = centerX + orbitalRadius * Math.cos(particleAngle);
    const particleY = centerY + orbitalRadius * Math.sin(particleAngle) * 0.6; // Aplanado para efecto de disco

    // Dibujar partícula como pequeño círculo
    const nextAngle = particleAngle + 0.1;
    const nextX = centerX + orbitalRadius * Math.cos(nextAngle);
    const nextY = centerY + orbitalRadius * Math.sin(nextAngle) * 0.6;

    drawSolarCommand(particleX, particleY, nextX, nextY, '#ffff00', 4);

    // Partículas más pequeñas para mayor densidad
    if (particle % 2 === 0) {
        const smallAngle = particleAngle + Math.PI;
        const smallX = centerX + (orbitalRadius * 0.8) * Math.cos(smallAngle);
        const smallY = centerY + (orbitalRadius * 0.8) * Math.sin(smallAngle) * 0.6;
        const smallNextX = centerX + (orbitalRadius * 0.8) * Math.cos(smallAngle + 0.1);
        const smallNextY = centerY + (orbitalRadius * 0.8) * Math.sin(smallAngle + 0.1) * 0.6;

        drawSolarCommand(smallX, smallY, smallNextX, smallNextY, '#ffa500', 2);
    }
}


            await new Promise(r => setTimeout(r, 100));
        }
    }

    // 🛸 Invasión OVNI (Version 1.1 - Weapon) - Solo Batches y solo 1 OVNI
    async function ufoInvasion(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🛸 Iniciando invasión OVNI`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const ufos = [];

        // Crear UNA formación de OVNI
        ufos.push({
            x: target.x, // Centered
            y: target.y - 100, // Above target
            angle: 0,
            size: 15 + intensity * 3
        });

        const invasionDuration = 1000;
        const startTime = Date.now();

        while (Date.now() - startTime < invasionDuration) {
            if (stopSignal) break;

            const elapsed = Date.now() - startTime;

            for (let i = 0; i < ufos.length; i++) { // Este bucle ahora solo se ejecutará una vez para el OVNI único
                const ufo = ufos[i];

                // Movimiento ondulante
                ufo.x += Math.sin(elapsed * 0.003 + i) * 2;
                ufo.y += Math.cos(elapsed * 0.002 + i) * 1;
                ufo.angle += 0.1;

                // Cuerpo del OVNI
                const ufoPoints = 12;
                for (let p = 0; p < ufoPoints; p++) {
                    const pAngle = (p / ufoPoints) * Math.PI * 2 + ufo.angle;
                    const nextAngle = ((p + 1) / ufoPoints) * Math.PI * 2 + ufo.angle;

                    const x1 = ufo.x + ufo.size * Math.cos(pAngle);
                    const y1 = ufo.y + ufo.size * Math.sin(pAngle) * 0.3;
                    const x2 = ufo.x + ufo.size * Math.cos(nextAngle);
                    const y2 = ufo.y + ufo.size * Math.sin(nextAngle) * 0.3;

                    drawSolarCommand(x1, y1, x2, y2, '#c0c0c0', 4);
                }

                // Cúpula
                const domeSize = ufo.size * 0.6;
                for (let d = 0; d < 8; d++) {
                    const dAngle = (d / 8) * Math.PI * 2;
                    const dX = ufo.x + domeSize * Math.cos(dAngle);
                    const dY = ufo.y - 10 + domeSize * Math.sin(dAngle) * 0.5;
                    drawSolarCommand(ufo.x, ufo.y - 10, dX, dY, '#87ceeb', 3);
                }

                // Rayo tractor
                if (Math.random() < 0.3) {
                    const beamWidth = ufo.size * 0.8;
                    for (let beam = 0; beam < 6; beam++) {
                        const beamX = ufo.x + (beam - 3) * (beamWidth / 6);
                        const beamY = target.y + Math.random() * 30;
                        drawSolarCommand(ufo.x, ufo.y + ufo.size * 0.3, beamX, beamY, '#00ff00', 2);
                    }
                }
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 🗡️ Sable Láser Galáctico
    async function galacticLightsaber(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🗡️ Activando sable láser galáctico`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const bladeLength = 60 + intensity * 15;
        const rotations = 3;

        // Activación del sable
        for (let charge = 0; charge < 10; charge++) {
            if (stopSignal) break;
            const currentLength = (bladeLength * charge) / 10;
            drawSolarCommand(centerX, centerY - currentLength, centerX, centerY + currentLength, '#00ff00', 8);
            drawSolarCommand(centerX, centerY - currentLength, centerX, centerY + currentLength, '#ffffff', 4);
            await new Promise(r => setTimeout(r, 100));
        }

        // Corte giratorio
        const totalSteps = rotations * 24;
        for (let step = 0; step < totalSteps; step++) {
            if (stopSignal) break;

            const angle = (step / 24) * Math.PI * 2;
            const blade1X = centerX + bladeLength * Math.cos(angle);
            const blade1Y = centerY + bladeLength * Math.sin(angle);
            const blade2X = centerX - bladeLength * Math.cos(angle);
            const blade2Y = centerY - bladeLength * Math.sin(angle);

            // Hoja del sable
            drawSolarCommand(centerX, centerY, blade1X, blade1Y, '#00ff00', 8);
            drawSolarCommand(centerX, centerY, blade2X, blade2Y, '#00ff00', 8);
            drawSolarCommand(centerX, centerY, blade1X, blade1Y, '#ffffff', 4);
            drawSolarCommand(centerX, centerY, blade2X, blade2Y, '#ffffff', 4);

            // Efectos de corte
            if (step % 4 === 0) {
                for (let spark = 0; spark < 5; spark++) {
                    const sparkAngle = angle + (Math.random() - 0.5) * 0.5;
                    const sparkDist = bladeLength * 0.8 + Math.random() * 20;
                    const sparkX = centerX + sparkDist * Math.cos(sparkAngle);
                    const sparkY = centerY + sparkDist * Math.sin(sparkAngle);
                    drawSolarCommand(blade1X, blade1Y, sparkX, sparkY, '#00ffff', 2);
                }
            }

            await new Promise(r => setTimeout(r, 80));
        }
    }

    // 🚀 Misil de Antimateria
    async function antimatterMissile(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🚀 Lanzando misil de antimateria`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        let missileX = 50;
        let missileY = canvas.height - 100;
        const targetX = target.x;
        const targetY = target.y;

        // Vuelo del misil
        const flightSteps = 40;
        for (let step = 0; step < flightSteps; step++) {
            if (stopSignal) break;

            const progress = step / flightSteps;
            const nextX = 50 + (targetX - 50) * progress;
            const nextY = (canvas.height - 100) + (targetY - (canvas.height - 100)) * progress;

            // Cuerpo del misil
            drawSolarCommand(missileX, missileY, nextX, nextY, '#c0c0c0', 6);

            // Propulsión
            const thrustX = missileX - (nextX - missileX) * 2;
            const thrustY = missileY - (nextY - missileY) * 2;
            drawSolarCommand(missileX, missileY, thrustX, thrustY, '#00ffff', 4);
            drawSolarCommand(missileX, missileY, thrustX, thrustY, '#ffffff', 2);

            // Estela
            drawSolarCommand(missileX, missileY, nextX, nextY, '#87ceeb', 2);

            missileX = nextX;
            missileY = nextY;

            await new Promise(r => setTimeout(r, 100));
        }

        // Explosión de antimateria (aniquilación)
        const annihilationSteps = 20;
        for (let step = 0; step < annihilationSteps; step++) {
            if (stopSignal) break;

            const currentRadius = step * (15 + intensity * 5);

            // Ondas de aniquilación
            for (let wave = 0; wave < 3; wave++) {
                const waveRadius = currentRadius + wave * 20;
                const segments = 16;

                for (let seg = 0; seg < segments; seg++) {
                    const angle1 = (seg / segments) * Math.PI * 2;
                    const angle2 = ((seg + 1) / segments) * Math.PI * 2;
                    const x1 = targetX + waveRadius * Math.cos(angle1);
                    const y1 = targetY + waveRadius * Math.sin(angle1);
                    const x2 = targetX + waveRadius * Math.cos(angle2);
                    const y2 = targetY + waveRadius * Math.sin(angle2);

                    const colors = ['#ffffff', '#00ffff', '#ff00ff'];
                    drawSolarCommand(x1, y1, x2, y2, colors[wave], 8 - wave * 2);
                }
            }

            await new Promise(r => setTimeout(r, 150));
        }
    }

    // 🌪️ Vórtice Gravitacional (Version 1.1 - Weapon) - Delays y Batches
    async function gravityVortex(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌪️ Generando vórtice gravitacional`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const duration = 400 + intensity * 100;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            const elapsed = Date.now() - startTime;
            const rotationSpeed = elapsed * 0.008;

            // Espiral gravitacional
            const spiralArms = 4;
            for (let arm = 0; arm < spiralArms; arm++) {
                const armOffset = (arm / spiralArms) * Math.PI * 2;

                // Cada brazo espiral
                for (let segment = 0; segment < 20; segment++) {
                    const segmentProgress = segment / 20;
                    const radius = segmentProgress * (80 + intensity * 20);
                    const angle = armOffset + rotationSpeed + segmentProgress * Math.PI * 6;

                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);

                    // Conectar al centro (BATCH)
                    const colors = ['#9400d3', '#4b0082', '#8a2be2'];
                    drawSolarCommand(centerX, centerY, x, y, colors[arm % colors.length], 8 - segmentProgress * 6);

                    // Efectos de distorsión (BATCH)
                    if (Math.random() < 0.3) {
                        const distortX = x + (Math.random() - 0.5) * 20;
                        const distortY = y + (Math.random() - 0.5) * 20;
                        drawSolarCommand(x, y, distortX, distortY, '#ffffff', 2);
                    }
                }
            }

            // Centro del vórtice (BATCH)
            const coreSize = 10 + Math.sin(elapsed * 0.01) * 5;
            for (let core = 0; core < 8; core++) {
                const coreAngle = (core / 8) * Math.PI * 2;
                const coreX = centerX + coreSize * Math.cos(coreAngle);
                const coreY = centerY + coreSize * Math.sin(coreAngle);
                drawSolarCommand(centerX, centerY, coreX, coreY, '#000000', 6);
            }

            await new Promise(r => setTimeout(r, 100)); // DELAY entre frames
        }
    }


    /* ----------  EFECTOS ÚNICOS (VERSION 1.1) ---------- */

    // 🛡️ Escudo Planetario (Version 1.1 - Effect) - Delays y Batches
    async function planetaryShield(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🛡️ Activando escudo planetario`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const shieldRadius = 60 + intensity * 20;
        const duration = 100 + intensity * 100;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            const elapsed = Date.now() - startTime;

            // Capas del escudo (BATCH)
            const shieldLayers = 4;
            for (let layer = 0; layer < shieldLayers; layer++) {
                const layerRadius = shieldRadius - layer * 10;
                const layerAlpha = 1 - (layer * 0.2);
                const layerSpeed = elapsed * (0.002 + layer * 0.001);

                const segments = 20;
                for (let seg = 0; seg < segments; seg++) {
                    const angle1 = (seg / segments) * Math.PI * 2 + layerSpeed;
                    const angle2 = ((seg + 1) / segments) * Math.PI * 2 + layerSpeed;

                    const x1 = centerX + layerRadius * Math.cos(angle1);
                    const y1 = centerY + layerRadius * Math.sin(angle1);
                    const x2 = centerX + layerRadius * Math.cos(angle2);
                    const y2 = centerY + layerRadius * Math.sin(angle2);

                    const shieldColors = ['#00ffff', '#0080ff', '#0040ff', '#0020ff'];
                    drawSolarCommand(x1, y1, x2, y2, shieldColors[layer], 6 - layer);
                }
            }

            // Nodos energéticos (BATCH)
            const nodes = 8;
            for (let node = 0; node < nodes; node++) {
                const nodeAngle = (node / nodes) * Math.PI * 2 + elapsed * 0.005;
                const nodeX = centerX + shieldRadius * Math.cos(nodeAngle);
                const nodeY = centerY + shieldRadius * Math.sin(nodeAngle);

                // Pulso del nodo (BATCH)
                const pulseSize = 8 + Math.sin(elapsed * 0.01 + node) * 4;
                for (let pulse = 0; pulse < 6; pulse++) {
                    const pulseAngle = (pulse / 6) * Math.PI * 2;
                    const pulseX = nodeX + pulseSize * Math.cos(pulseAngle);
                    const pulseY = nodeY + pulseSize * Math.sin(pulseAngle);
                    drawSolarCommand(nodeX, nodeY, pulseX, pulseY, '#ffffff', 4);
                }
            }

            await new Promise(r => setTimeout(r, 100)); // DELAY entre frames
        }
    }

    // 🎆 Fuegos Artificiales Solares
    async function solarFireworks(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🎆 Lanzando fuegos artificiales solares`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const fireworkCount = 8 + intensity * 3;

        for (let fw = 0; fw < fireworkCount; fw++) {
            if (stopSignal) break;

            const launchX = target.x + (Math.random() - 0.5) * 200;
            const launchY = canvas.height - 50;
            const explodeX = target.x + (Math.random() - 0.5) * 150;
            const explodeY = target.y + (Math.random() - 0.5) * 100;

            // Proyectil subiendo
            drawSolarCommand(launchX, launchY, explodeX, explodeY, '#ffff00', 4);

            await new Promise(r => setTimeout(r, 400));

            // Explosión de fuegos artificiales
            const colors = ['#ff0000', '#ff4500', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
            const sparkCount = 20 + intensity * 5;

            for (let spark = 0; spark < sparkCount; spark++) {
                const sparkAngle = (spark / sparkCount) * Math.PI * 2;
                const sparkDist = 30 + Math.random() * 40;
                const sparkX = explodeX + sparkDist * Math.cos(sparkAngle);
                const sparkY = explodeY + sparkDist * Math.sin(sparkAngle);
                const color = colors[Math.floor(Math.random() * colors.length)];

                drawSolarCommand(explodeX, explodeY, sparkX, sparkY, color, 3);

                // Chispas secundarias
                if (Math.random() < 0.4) {
                    const subSparkX = sparkX + (Math.random() - 0.5) * 20;
                    const subSparkY = sparkY + (Math.random() - 0.5) * 20;
                    drawSolarCommand(sparkX, sparkY, subSparkX, subSparkY, color, 1);
                }
            }

            await new Promise(r => setTimeout(r, 200));
        }
    }

    // ❄️ Era de Hielo Instantánea (Version 1.1 - Effect) - Delays y Batches
    async function instantIceAge(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`❄️ Iniciando era de hielo instantánea`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const freezeRadius = 20 + intensity * 10;
        const centerX = target.x;
        const centerY = target.y;

        // Expansión del hielo
        const iceSteps = 10;
        for (let step = 0; step < iceSteps; step++) { // Cada paso es un 'batch' de dibujo
            if (stopSignal) break;

            const currentRadius = (freezeRadius * step) / iceSteps;
            const iceColors = ['#e0ffff', '#b0e0e6', '#87ceeb', '#add8e6'];

            // Cristales de hielo (BATCH)
            const crystalCount = 16;
            for (let crystal = 0; crystal < crystalCount; crystal++) {
                const angle = (crystal / crystalCount) * Math.PI * 2;
                const crystalX = centerX + currentRadius * Math.cos(angle);
                const crystalY = centerY + currentRadius * Math.sin(angle);

                // Cristal hexagonal (BATCH)
                for (let side = 0; side < 6; side++) {
                    const sideAngle = angle + (side / 6) * Math.PI * 2;
                    const sideLength = 8 + step;
                    const sideEndX = crystalX + sideLength * Math.cos(sideAngle);
                    const sideEndY = crystalY + sideLength * Math.sin(sideAngle);

                    const color = iceColors[step % iceColors.length];
                    drawSolarCommand(crystalX, crystalY, sideEndX, sideEndY, color, 4);
                }

                // Conectar al centro (BATCH)
                drawSolarCommand(centerX, centerY, crystalX, crystalY, '#ffffff', 2);
            }

            // Copos de nieve cayendo (BATCH)
            for (let flake = 0; flake < 15; flake++) {
                const flakeX = centerX + (Math.random() - 0.5) * currentRadius * 2;
                const flakeY = centerY - currentRadius + Math.random() * currentRadius * 2;
                const flakeEndX = flakeX + (Math.random() - 0.5) * 10;
                const flakeEndY = flakeY + Math.random() * 20;

                drawSolarCommand(flakeX, flakeY, flakeEndX, flakeEndY, '#ffffff', 1);
            }

            await new Promise(r => setTimeout(r, 150)); // DELAY entre batches
        }
    }

    // 🌋 Erupción Volcánica
    async function volcanicEruption(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌋 Provocando erupción volcánica`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const volcanoX = target.x;
        const volcanoY = target.y + 50;

        // Formar el volcán
        const volcanoHeight = 60 + intensity * 15;
        for (let layer = 0; layer < 10; layer++) {
            if (stopSignal) break;

            const layerY = volcanoY - layer * (volcanoHeight / 10);
            const layerWidth = (40 - layer * 3) + intensity * 5;

            drawSolarCommand(volcanoX - layerWidth, layerY, volcanoX + layerWidth, layerY, '#8b4513', 13);
        }

        await new Promise(r => setTimeout(r, 500));

        // Erupción
        const eruptionSteps = 25;
        for (let step = 0; step < eruptionSteps; step++) {
            if (stopSignal) break;

            // Lava principal
            const lavaCount = 8 + intensity * 3;
            for (let lava = 0; lava < lavaCount; lava++) {
                const angle = (Math.random() - 0.5) * Math.PI;
                const velocity = 20 + Math.random() * (40 + intensity * 20);
                const lavaX = volcanoX + velocity * Math.cos(angle);
                const lavaY = volcanoY - volcanoHeight - velocity * Math.abs(Math.sin(angle));

                const lavaColors = ['#ff4500', '#ff6347', '#ffa500', '#ff0000'];
                const color = lavaColors[Math.floor(Math.random() * lavaColors.length)];

                drawSolarCommand(volcanoX, volcanoY - volcanoHeight, lavaX, lavaY, color, 6);

                // Partículas de lava
                if (Math.random() < 0.6) {
                    const particleX = lavaX + (Math.random() - 0.5) * 20;
                    const particleY = lavaY + Math.random() * 30;
                    drawSolarCommand(lavaX, lavaY, particleX, particleY, color, 2);
                }
            }

            // Humo y ceniza
            for (let smoke = 0; smoke < 5; smoke++) {
                const smokeX = volcanoX + (Math.random() - 0.5) * 30;
                const smokeY = volcanoY - volcanoHeight - step * 15;
                const smokeDrift = smokeX + (Math.random() - 0.5) * 50;

                drawSolarCommand(smokeX, volcanoY - volcanoHeight, smokeDrift, smokeY, '#696969', 4);
            }

            await new Promise(r => setTimeout(r, 200));
        }
    }

    // 🌀 Anomalía Espacial (Version 1.1 - Effect) - Delays y Batches
    async function spaceAnomaly(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌀 Manifestando anomalía espacial`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const anomalyX = target.x;
        const anomalyY = target.y;
        const duration = 500 + intensity * 100;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) { // Cada iteración es un 'batch' de dibujo
            if (stopSignal) break;

            const elapsed = Date.now() - startTime;

            // Distorsión del espacio-tiempo (BATCH)
            const distortionCount = 12;
            for (let distort = 0; distort < distortionCount; distort++) {
                const distortAngle = (distort / distortionCount) * Math.PI * 2 + elapsed * 0.005;
                const baseRadius = 60 + intensity * 15;
                const waveRadius = baseRadius + Math.sin(elapsed * 0.01 + distort) * 20;

                const normalX = anomalyX + waveRadius * Math.cos(distortAngle);
                const normalY = anomalyY + waveRadius * Math.sin(distortAngle);

                // Líneas de distorsión (BATCH)
                drawSolarCommand(anomalyX, anomalyY, normalX, normalY, '#9400d3', 3);

                // Efectos secundarios aleatorios (BATCH)
                if (Math.random() < 0.3) {
                    const randomX = normalX + (Math.random() - 0.5) * 40;
                    const randomY = normalY + (Math.random() - 0.5) * 40;
                    drawSolarCommand(normalX, normalY, randomX, randomY, '#ff00ff', 1);
                }
            }

            // Partículas cuánticas (BATCH)
            for (let quantum = 0; quantum < 8; quantum++) {
                const quantumAngle = Math.random() * Math.PI * 2;
                const quantumDist = Math.random() * 80;
                const quantumX = anomalyX + quantumDist * Math.cos(quantumAngle);
                const quantumY = anomalyY + quantumDist * Math.sin(quantumAngle);

                // Teletransporte cuántico (BATCH)
                const newQuantumX = quantumX + (Math.random() - 0.5) * 100;
                const newQuantumY = quantumY + (Math.random() - 0.5) * 100;

                drawSolarCommand(quantumX, quantumY, newQuantumX, newQuantumY, '#00ffff', 2);
            }

            // Núcleo de la anomalía (BATCH)
            const coreIntensity = Math.sin(elapsed * 0.02) * 10 + 15;
            for (let core = 0; core < 6; core++) {
                const coreAngle = (core / 6) * Math.PI * 2;
                const coreX = anomalyX + coreIntensity * Math.cos(coreAngle);
                const coreY = anomalyY + coreIntensity * Math.sin(coreAngle);
                drawSolarCommand(anomalyX, anomalyY, coreX, coreY, '#ffffff', 6);
            }

            await new Promise(r => setTimeout(r, 120)); // DELAY entre frames
        }
    }


    /* ----------  EFECTOS MOVIDOS DE ARMAS (VERSION 1.0) ---------- */

    // 🌑 Agujero Negro (Version 1.0 - Effect) - Solo Batches
    async function blackHole_v1_0(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌑 Creando agujero negro en jugador ${playerId} (v1.0)`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const duration = 50 + intensity * 50;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) {
            if (stopSignal) break;

            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            // Núcleo negro
            const coreRadius = 15 + intensity * 3;
            for (let angle = 0; angle < 16; angle++) {
                const radians = (angle / 16) * 2 * Math.PI;
                const x = centerX + coreRadius * Math.cos(radians);
                const y = centerY + coreRadius * Math.sin(radians);
                drawSolarCommand(centerX, centerY, x, y, '#000000', 6);
            }

            // Anillo de acreción
            const rings = 3;
            for (let ring = 0; ring < rings; ring++) {
                const ringRadius = (30 + ring * 20) * (1 + progress * 0.5);
                const ringSegments = 24;

                for (let seg = 0; seg < ringSegments; seg++) {
                    const angle1 = (seg / ringSegments) * 2 * Math.PI + elapsed * 0.005 * (ring + 1);
                    const angle2 = ((seg + 1) / ringSegments) * 2 * Math.PI + elapsed * 0.005 * (ring + 1);

                    const x1 = centerX + ringRadius * Math.cos(angle1);
                    const y1 = centerY + ringRadius * Math.sin(angle1) * 0.3;
                    const x2 = centerX + ringRadius * Math.cos(angle2);
                    const y2 = centerY + ringRadius * Math.sin(angle2) * 0.3;

                    const colors = ['#ff6600', '#ff9900', '#ffcc00'];
                    const color = colors[ring % colors.length];
                    drawSolarCommand(x1, y1, x2, y2, color, 3 - ring);
                }
            }

            // Partículas siendo absorbidas
            for (let p = 0; p < 5; p++) {
                const distance = 100 + Math.random() * 100;
                const angle = Math.random() * Math.PI * 2;
                const startX = centerX + distance * Math.cos(angle);
                const startY = centerY + distance * Math.sin(angle);

                drawSolarCommand(startX, startY, centerX, centerY, '#ffffff', 1);
            }

            await new Promise(r => setTimeout(r, 100)); // DELAY entre frames
        }
    }

    // 🛸 Invasión OVNI (Version 1.0 - Effect)
    async function ufoInvasion_v1_0(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🛸 Iniciando invasión OVNI contra jugador ${playerId} (v1.0)`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const ufoCount = 3 + intensity;
        const ufos = [];

        // Crear OVNIs
        for (let i = 0; i < ufoCount; i++) {
            ufos.push({
                x: Math.random() * canvas.width,
                y: 50 + i * 30,
                angle: 0,
                targetX: target.x + (Math.random() - 0.5) * 100,
                targetY: target.y + (Math.random() - 0.5) * 50
            });
        }

        const attackDuration = 4000;
        const startTime = Date.now();

        while (Date.now() - startTime < attackDuration) {
            if (stopSignal) break;

            for (let i = 0; i < ufos.length; i++) {
                const ufo = ufos[i];

                // Mover OVNI hacia objetivo
                const dx = ufo.targetX - ufo.x;
                const dy = ufo.targetY - ufo.y;
                ufo.x += dx * 0.02;
                ufo.y += dy * 0.02;
                ufo.angle += 0.1;

                // Dibujar OVNI
                await drawUFO(ufo.x, ufo.y, ufo.angle, intensity);

                // Disparar ocasionalmente
                if (Math.random() < 0.3) {
                    await ufoLaserShot(ufo.x, ufo.y, target.x, target.y);
                }
            }

            await new Promise(r => setTimeout(r, 200));
        }
    }

    // 🌪️ Vórtice Gravitacional (Version 1.0 - Effect) - Delays y Batches
    async function gravityVortex_v1_0(playerId, intensity = 3) {
        if (stopSignal) return;
        console.log(`🌪️ Vórtice Gravitacional activado en jugador ${playerId}`);

        const target = getPlayerCoords(playerId);
        if (!target) return;

        const centerX = target.x;
        const centerY = target.y;
        const duration = 50 + intensity * 50;
        const startTime = Date.now();

        while (Date.now() - startTime < duration) { // Cada iteración es un 'batch' de dibujo
            if (stopSignal) break;

            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            // Centro del vórtice (BATCH)
            const coreRadius = 10 + intensity * 2;
            for (let angle = 0; angle < 16; angle++) {
                const radians = (angle / 16) * 2 * Math.PI;
                const x = centerX + coreRadius * Math.cos(radians);
                const y = centerY + coreRadius * Math.sin(radians);
                drawSolarCommand(centerX, centerY, x, y, '#000000', 6);
            }

            // Espirales de atracción (BATCH)
            const spirals = 4;
            for (let spiral = 0; spiral < spirals; spiral++) {
                const spiralRadius = (30 + spiral * 20) * (1 + progress * 0.5);
                const spiralSegments = 24;

                for (let seg = 0; seg < spiralSegments; seg++) {
                    const angle1 = (seg / spiralSegments) * 2 * Math.PI + elapsed * 0.008 * (spiral + 1);
                    const angle2 = ((seg + 1) / spiralSegments) * 2 * Math.PI + elapsed * 0.008 * (spiral + 1);

                    const x1 = centerX + spiralRadius * Math.cos(angle1);
                    const y1 = centerY + spiralRadius * Math.sin(angle1) * 0.8;
                    const x2 = centerX + spiralRadius * Math.cos(angle2);
                    const y2 = centerY + spiralRadius * Math.sin(angle2) * 0.8;

                    const colors = ['#9400d3', '#4b0082', '#8a2be2'];
                    const color = colors[spiral % colors.length];
                    drawSolarCommand(x1, y1, x2, y2, color, 4 - spiral);
                }
            }

// Galaxia minimalista (BATCH) - Solo elementos esenciales
// Sol central
for (let ray = 0; ray < 4; ray++) {
    const rayAngle = (ray / 4) * 2 * Math.PI;
    const rayX = centerX + 20 * Math.cos(rayAngle);
    const rayY = centerY + 20 * Math.sin(rayAngle);
    drawSolarCommand(centerX, centerY, rayX, rayY, '#ffff00', 6);
}

// 3 planetas principales
const planets = [
    { radius: 40, color: '#4285f4' },  // Tierra
    { radius: 70, color: '#ff4444' },  // Marte
    { radius: 100, color: '#d2691e' }  // Júpiter
];

planets.forEach((planet, index) => {
    const planetAngle = elapsed * 0.005 + (index * 2);
    const planetX = centerX + planet.radius * Math.cos(planetAngle);
    const planetY = centerY + planet.radius * Math.sin(planetAngle) * 0.7;

    drawSolarCommand(planetX, planetY, planetX + 3, planetY + 3, planet.color, 4);
});

// 6 estrellas de fondo
for (let star = 0; star < 6; star++) {
    const starAngle = (star / 6) * 2 * Math.PI;
    const starX = centerX + 120 * Math.cos(starAngle);
    const starY = centerY + 120 * Math.sin(starAngle);
    drawSolarCommand(starX, starY, starX + 1, starY + 1, '#ffffff', 2);
}


            await new Promise(r => setTimeout(r, 100)); // DELAY entre frames
        }
    }


    /* ----------  FUNCIONES AUXILIARES (DE V1.0) ---------- */
    // Nota: Estas funciones auxiliares no se modifican ya que su comportamiento
    // es general y no afecta los requisitos específicos de delays/batches para los efectos mayores.
    async function createImpactExplosion(x, y, intensity) {
        if (stopSignal) return;
        const particles = 8 + intensity * 2;
        const colors = ['#ff4500', '#ffa500', '#ffff00'];

        for (let p = 0; p < particles; p++) {
            const angle = (p / particles) * 2 * Math.PI;
            const distance = 15 + Math.random() * 20;
            const endX = x + distance * Math.cos(angle);
            const endY = y + distance * Math.sin(angle);
            const color = colors[Math.floor(Math.random() * colors.length)];
            drawSolarCommand(x, y, endX, endY, color, 2 + intensity);
        }
        await new Promise(r => setTimeout(r, 50));
    }

    async function createEnergyImpact(x, y, intensity) {
        if (stopSignal) return;
        const steps = 10;
        for (let step = 0; step < steps; step++) {
            const radius = step * 5;
            const sparkCount = 8;
            for (let spark = 0; spark < sparkCount; spark++) {
                const angle = (spark / sparkCount) * 2 * Math.PI;
                const endX = x + radius * Math.cos(angle);
                const endY = y + radius * Math.sin(angle);
                drawSolarCommand(x, y, endX, endY, '#00ffff', 4 - step * 0.3);
            }
            await new Promise(r => setTimeout(r, 50));
        }
    }

    async function drawMushroomCloud(x, y, intensity) {
        if (stopSignal) return;
        const cloudSteps = 15;
        const colors = ['#8b4513', '#a0522d', '#cd853f'];

        for (let step = 0; step < cloudSteps; step++) {
            const stemHeight = step * 10;
            const capRadius = 20 + step * 3;

            // Stem
            drawSolarCommand(x, y, x, y - stemHeight, colors, 8 + intensity);

            // Cap
            const segments = 16;
            for (let seg = 0; seg < segments; seg++) {
                const angle1 = (seg / segments) * Math.PI;
                const angle2 = ((seg + 1) / segments) * Math.PI;
                const x1 = x + capRadius * Math.cos(angle1);
                const y1 = y - stemHeight + capRadius * Math.sin(angle1) * 0.5;
                const x2 = x + capRadius * Math.cos(angle2);
                const y2 = y - stemHeight + capRadius * Math.sin(angle2) * 0.5;
                drawSolarCommand(x1, y1, x2, y2, colors[step % colors.length], 4);
            }
            await new Promise(r => setTimeout(r, 200));
        }
    }

    async function breatheFire(startX, startY, targetX, targetY, intensity) {
        if (stopSignal) return;
        const flames = 5 + intensity;
        const colors = ['#ff0000', '#ff4500', '#ffa500', '#ffff00'];

        for (let f = 0; f < flames; f++) {
            const progress = f / flames;
            const x = startX + (targetX - startX) * progress;
            const y = startY + (targetY - startY) * progress;
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            const color = colors[Math.floor(Math.random() * colors.length)];
            drawSolarCommand(startX, startY, x + offsetX, y + offsetY, color, 3 + intensity);
        }
    }

    async function drawUFO(x, y, angle, intensity) {
        if (stopSignal) return;
        const size = 20 + intensity * 3;

        // Cuerpo principal
        drawSolarCommand(x - size, y, x + size, y, '#c0c0c0', 6);
        drawSolarCommand(x - size * 0.7, y - size * 0.3, x + size * 0.7, y - size * 0.3, '#c0c0c0', 4);

        // Luces
        const lights = 6;
        for (let light = 0; light < lights; light++) {
            const lightAngle = (light / lights) * 2 * Math.PI + angle;
            const lightX = x + size * 0.8 * Math.cos(lightAngle);
            const lightY = y + size * 0.8 * Math.sin(lightAngle) * 0.3;
            drawSolarCommand(lightX - 2, lightY - 2, lightX + 2, lightY + 2, '#00ff00', 3);
        }

        // Rayo tractor
        if (Math.random() < 0.5) {
            drawSolarCommand(x, y + size * 0.5, x, y + size * 2, '#00ffff', 8);
        }
    }

    async function ufoLaserShot(startX, startY, targetX, targetY) {
        if (stopSignal) return;
        drawSolarCommand(startX, startY, targetX, targetY, '#ff0000', 3);
        await new Promise(r => setTimeout(r, 100));
    }


    /* ----------  FUNCIONES PRINCIPALES  ---------- */

function updatePlayerOptions() {
    // Guardar la selección actual antes de limpiar
    const currentSelection = playerSelect.value;

    // Clear existing options
    playerSelect.innerHTML = '';

    // Try multiple selectors for better compatibility
    const playerElements = document.querySelectorAll('.spawnedavatar[data-playerid], .playerlist-row[data-playerid]');
    const validPlayers = [];

    playerElements.forEach(el => {
        const playerId = el.dataset.playerid;

        // Skip if no player ID or if it's the current player
        if (!playerId || playerId === '0' || el.dataset.self === 'true') {
            return;
        }

        // Try different ways to get player name
        let playerName = '';

        // Method 1: Check for nickname in avatar
        const nicknameEl = el.querySelector('.nickname, .playerlist-name a, .player-name');
        if (nicknameEl) {
            playerName = nicknameEl.textContent.trim();
        }

        // Method 2: Check parent elements
        if (!playerName) {
            const parentRow = el.closest('.playerlist-row');
            if (parentRow) {
                const nameEl = parentRow.querySelector('.playerlist-name a, .player-name');
                if (nameEl) {
                    playerName = nameEl.textContent.trim();
                }
            }
        }

        // Method 3: Use player ID as fallback
        if (!playerName) {
            playerName = `Player ${playerId}`;
        }

        // Avoid duplicates
        if (!validPlayers.some(p => p.id === playerId)) {
            validPlayers.push({
                id: playerId,
                name: playerName
            });
        }
    });

    console.log('🎯 Players found:', validPlayers); // Debug log

    if (validPlayers.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '❌ No players available';
        playerSelect.appendChild(opt);
        executeBtn.disabled = true;
    } else {
        // Poblar la lista con los jugadores válidos
        validPlayers.forEach(player => {
            const opt = document.createElement('option');
            opt.value = player.id;
            opt.textContent = `🎯 ${player.name}`;
            playerSelect.appendChild(opt);
        });

        // Intentar mantener la selección anterior
        const stillExists = validPlayers.some(p => p.id === currentSelection);

        if (currentSelection && stillExists) {
            // El jugador previamente seleccionado todavía existe, mantener selección
            playerSelect.value = currentSelection;
            console.log('🎯 Manteniendo selección:', currentSelection);
        } else if (currentSelection && !stillExists) {
            // El jugador previamente seleccionado ya no existe
            console.log('⚠️ El jugador seleccionado salió de la sala');
            // Mantener el primer jugador como selección por defecto
            playerSelect.selectedIndex = 0;
        }

        executeBtn.disabled = false;
    }
}


    async function executeSolarAction() {
        if (isExecuting) return;

        const playerId = playerSelect.value;
        const weaponType = weaponSelect.value;
        const effectType = effectSelect.value;
        const intensity = parseInt(intensitySlider.value);
        const shouldRepeat = repeatToggle.checked;

        if (!playerId) {
            alert('🚫 Por favor selecciona un objetivo válido');
            return;
        }

        if (!weaponType && !effectType) {
            alert('🚫 Por favor selecciona un arma o efecto');
            return;
        }

        isExecuting = true;
        stopSignal = false;
        executeBtn.disabled = true;
        stopBtn.disabled = false;

        do {
            try {
                if (weaponType) {
                    switch (weaponType) {
                        case 'weapon:meteor_rain':
                            await meteorRain(playerId, intensity);
                            break;
                        case 'weapon:giant_asteroid':
                            await giantAsteroid(playerId, intensity);
                            break;
                        case 'weapon:laser_beam':
                            await laserBeam(playerId, intensity);
                            break;
                        case 'weapon:plasma_beam': // Rayo Plasma (reordenado)
                            await plasmaBeam(playerId, intensity);
                            break;
                        case 'weapon:space_dragon':
                            await spaceDragon(playerId, intensity);
                            break;
                        case 'weapon:black_hole':
                            await blackHole(playerId, intensity);
                            break;
                        case 'weapon:ufo_invasion':
                            await ufoInvasion(playerId, intensity);
                            break;
                        // case 'weapon:supernova': // Eliminado
                        //     await supernova(playerId, intensity);
                        //     break;
                        case 'weapon:galactic_lightsaber':
                            await galacticLightsaber(playerId, intensity);
                            break;
                        case 'weapon:antimatter_missile':
                            await antimatterMissile(playerId, intensity);
                            break;
                        // case 'weapon:stellar_explosion': // Eliminado
                        //     await stellarExplosion(playerId, intensity);
                        //     break;
                        case 'weapon:gravity_vortex':
                            await gravityVortex(playerId, intensity);
                            break;
                    }
                }

                if (effectType) {
                    switch (effectType) {
                        case 'effect:planetary_shield':
                            await planetaryShield(playerId, intensity);
                            break;
                        case 'effect:solar_fireworks':
                            await solarFireworks(playerId, intensity);
                            break;
                        // case 'effect:solar_storm': // Eliminado
                        //     await solarStorm(playerId, intensity);
                        //     break;
                        case 'effect:instant_ice_age':
                            await instantIceAge(playerId, intensity);
                            break;
                        case 'effect:volcanic_eruption':
                            await volcanicEruption(playerId, intensity);
                            break;
                        // case 'effect:asteroid_field': // Eliminado
                        //     await asteroidField(playerId, intensity);
                        //     break;
                        case 'effect:space_anomaly':
                            await spaceAnomaly(playerId, intensity);
                            break;
                        case 'effect:laser_beam_v1_0': // Rayo Láser (v1.0) (reordenado)
                            await laserBeam_v1_0(playerId, intensity);
                            break;
                        case 'effect:black_hole_v1_0':
                            await blackHole_v1_0(playerId, intensity);
                            break;
                        case 'effect:ufo_invasion_v1_0':
                            await ufoInvasion_v1_0(playerId, intensity);
                            break;
                        case 'effect:gravity_vortex_v1_0':
                            await gravityVortex_v1_0(playerId, intensity);
                            break;
                    }
                }

                if (shouldRepeat && !stopSignal) {
                    await new Promise(r => setTimeout(r, 1000));
                }

            } catch (error) {
                console.error('🔥 Error ejecutando Solar Smash:', error);
                break;
            }
        } while (shouldRepeat && !stopSignal);

        isExecuting = false;
        executeBtn.disabled = false;
        stopBtn.disabled = true;
        console.log('🌌 Secuencia Solar Smash completada');
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
        console.log('🛑 Destrucción detenida por el usuario');
    }

    /* ----------  EVENT LISTENERS  ---------- */

    executeBtn.addEventListener('click', executeSolarAction);
    stopBtn.addEventListener('click', stopExecution);

    // Actualizar jugadores cada 2 segundos
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

    // Efectos hover para los controles
    [executeBtn, stopBtn, playerSelect, weaponSelect, effectSelect].forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
            element.style.boxShadow = element.style.boxShadow.replace(/rgba$$[^)]+$$/, 'rgba(0, 255, 255, 0.6)');
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
            element.style.boxShadow = element.style.boxShadow.replace(/rgba$$[^)]+$$/, element === executeBtn ? 'rgba(255, 107, 53, 0.4)' : 'rgba(255, 23, 68, 0.4)');
        });
    });

    console.log('🌌 THE SOLAR SMASH MOD cargado exitosamente! 🌌');
    console.log('🚀 Versión 1.3 - Actualizaciones de armas y efectos completadas');
    console.log('⚡ Cada arma ahora tiene su propio comportamiento distintivo');

})();