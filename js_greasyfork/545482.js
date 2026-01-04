// ==UserScript==
// @name         Drawaria The Animator Mod
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Choose an object and draw it on the selected player’s avatar, with special effects. Includes a Stop button.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @icon         https://drawaria.online/avatar/cache/0d886640-6bde-11f0-8d47-cbcdc07da1cc.1754411246971.jpg
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545482/Drawaria%20The%20Animator%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/545482/Drawaria%20The%20Animator%20Mod.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------  CONFIGURACIÓN  ---------- */
    // JSONs de Dibujos Normales (sin efectos especiales acoplados)
    const JSON_SOURCES = {
        'Ninguno': '', // Opción para no dibujar un JSON
        'Ataque': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/ataque.json',
        'Pistola': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/pistola.json',
        'Espada': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/espada.json',
        'Escudo': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/escudo.json',
        'Defensa': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/defensa.json',
        'Cohete': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/cohete.json',
        'Laser': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/laser.json',
        'Explosion': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/explosion.json',
        'Rayo': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/rayo.json',
        'Gorra': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/gorra.json',
        'Fuego': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/fire.json',
        'Fuego blue': 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/bluefire.json',
    };
    const DEFAULT_JSON_NAME = 'Ninguno';

    // Efectos Procedurales o JSONs que actúan como "efectos" (sin rotación ni posición configurable por el usuario)
    const JSON_EFFECTS = {
        'Ninguno': '',
        'Arco y Flecha': 'effect:arrow_chaser',
        'Aura de Fuego': 'effect:fire_aura_circular',
        'Bomba': 'effect:bomb',
        'Búmeran (Guiado)': 'effect:boomerang_guided',
        'Cohete Espacial': 'effect:space_rocket',
        'Disparo Pistola': 'effect:pistol_shoot',
        'Dron Seguidor': 'effect:drone_follower_ray',
        'Escopeta (Spread)': 'effect:shotgun_blast',
        'Espadazo': 'effect:sword_slash_arc',
        'Flashlight Supernova': 'effect:flashlight_star',
        'Granada Pegajosa': 'effect:sticky_grenade_proj',
        'Lanzagranadas (Arc)': 'effect:grenade_launcher',
        'Látigo Eléctrico': 'effect:electric_whip_snap',
        'Martillazo Sísmico': 'effect:seismic_smash_wave',
        'Mina de Defensa': 'effect:proximity_mine_trap',
        'Muro de Tierra': 'effect:earth_wall_shield',
        'Rifle Láser': 'effect:laser_rifle_beam',
        'Rayo Zigzag': 'effect:lightning_zigzag',
        'Tormenta de Hielo': 'effect:ice_storm_area',
        'Tornado de Viento': 'effect:wind_tornado_spin',
    };
    const DEFAULT_EFFECT_NAME = 'Ninguno';

    // URLs específicas para JSONs usados por efectos procedurales
    const BOMBA_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/bomba.json';
    const PISTOLA_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/pistola.json';
    const ARCO_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/arco.json';
    const LANZAGRANADAS_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/lanzagranadas.json';
    const RIFLE_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/rifle.json';
    const BOOMERANG_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/boomerang.json';
    const ESPADA_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/espada.json';
    const MARTILLO_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/martillo.json';
    const LATIGO_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/latigo.json';
    const GRANADA_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/granada.json';
    const MINA_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/mina.json';
    const ESCOPETA_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/escopeta.json';
    const DRON_JSON_URL = 'https://raw.githubusercontent.com/DrawariaDeveloper/Json-to-Drawaria/main/dron.json';

    const DRAW_PADDING = 10;
    const DRAW_PADDING_HAND = 3;
    const HAND_GRIP_OFFSET_Y = 2;
    const REPEAT_ACTION_DELAY = 15; // Retardo en ms entre cada segmento de una misma acción (para que el dibujo aparezca fluido)
    const WAIT_ACTION_DELAY = 500; // Retardo en ms entre cada repetición completa del dibujo/efecto (0.5 segundos)

    /* ------------------------------------ */

    let socket;
    const canvas = document.getElementById('canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let stopSignal = false; // <-- NUEVO: Señal para detener animaciones
    let stopBtn; // <-- NUEVO: Referencia al botón de detener

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) socket = this;
        return originalSend.apply(this, args);
    };

    /* ----------  INTERFAZ DE USUARIO (UI)  ---------- */
    const container = document.createElement('div');
    container.style.cssText = `
        position:fixed; bottom:10px; right:10px; z-index:9999;
        background:rgba(17,17,17,0.9);
        color:#fff; padding:12px 18px; border-radius:10px;
        font-family: 'Segoe UI', Arial, sans-serif; font-size:13px;
        display:flex; flex-direction:column; gap:12px;
        box-shadow: 0 6px 15px rgba(0,0,0,0.6);
        cursor: default;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(60,60,60,0.5);
    `;

    const titleBar = document.createElement('div');
    titleBar.textContent = 'The Animator Mod';
    titleBar.style.cssText = `
        font-weight: bold;
        font-size: 15px;
        text-align: center;
        cursor: grab;
        background: linear-gradient(180deg, rgba(40,40,40,0.95), rgba(25,25,25,0.95));
        border-radius: 8px 8px 0 0;
        margin: -12px -18px 12px -18px;
        padding: 10px 18px;
        border-bottom: 1px solid #555;
        color: #ADD8E6;
    `;
    container.appendChild(titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
        display:flex; flex-direction:column; gap:10px;
    `;
    container.appendChild(contentDiv);

    const baseInputStyle = `
        flex-grow: 1;
        padding: 7px 10px; border-radius: 5px; border: 1px solid #555;
        background: #333; color: #fff;
        font-size: 13px;
    `;
    const selectBaseStyle = baseInputStyle + `
        appearance: none;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2C197.3L159.2%2C69.5c-3.6-3.6-8.2-5.4-12.8-5.4s-9.2%2C1.8-12.8%2C5.4L5.4%2C197.3c-7.2%2C7.2-7.2%2C18.8%2C0%2C26c3.6%2C3.6%2C8.2%2C5.4%2C12.8%2C5.4s9.2%2C1.8%2C12.8%2C5.4l117%2C117c3.6%2C3.6%2C8.2%2C5.4%2C12.8%2C5.4s9.2%2C1.8%2C12.8%2C5.4l117-117c7.2-7.2%2C7.2-18.8%2C0-26C294.2%2C204.5%2C294.2%2C200.9%2C287%2C197.3z%22%2F%3E%3C%2Fsvg%3E');
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 10px;
        cursor: pointer;
    `;

    function createLabeledRow(parent, labelText, inputElement) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display:flex; align-items:center; gap:10px;`;
        const label = document.createElement('span');
        label.textContent = labelText;
        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
        parent.appendChild(wrapper);
        return { wrapper, label, inputElement };
    }

    const playerSelect = document.createElement('select');
    playerSelect.style.cssText = selectBaseStyle;
    createLabeledRow(contentDiv, 'Jugador:', playerSelect);

    const jsonUrlSelect = document.createElement('select');
    jsonUrlSelect.style.cssText = selectBaseStyle;
    for (const name in JSON_SOURCES) {
        const opt = document.createElement('option');
        opt.value = JSON_SOURCES[name];
        opt.textContent = name;
        jsonUrlSelect.appendChild(opt);
    }
    jsonUrlSelect.value = JSON_SOURCES[DEFAULT_JSON_NAME];
    createLabeledRow(contentDiv, 'Dibujo:', jsonUrlSelect);

    const effectSelect = document.createElement('select');
    effectSelect.style.cssText = selectBaseStyle;
    for (const name in JSON_EFFECTS) {
        const opt = document.createElement('option');
        opt.value = JSON_EFFECTS[name];
        opt.textContent = name;
        effectSelect.appendChild(opt);
    }
    effectSelect.value = JSON_EFFECTS[DEFAULT_EFFECT_NAME];
    createLabeledRow(contentDiv, 'Efectos:', effectSelect);

    jsonUrlSelect.addEventListener('change', () => {
        if (jsonUrlSelect.value !== '') {
            effectSelect.value = JSON_EFFECTS['Ninguno'];
        }
    });

    effectSelect.addEventListener('change', () => {
        if (effectSelect.value !== '') {
            jsonUrlSelect.value = JSON_SOURCES['Ninguno'];

            // Auto-configurar posición para "Disparo Pistola"
            if (effectSelect.value === 'effect:pistol_shoot') {
                positionSelect.value = 'grip_right'; // Cambiado a grip_right, ya que el JSON de pistola en general se dibuja a la derecha.
                console.log('Auto-configurado: Posición cambiada a "Agarre Derecha" para Disparo Pistola');
            }
        }
    });

    const positionSelect = document.createElement('select');
    positionSelect.style.cssText = selectBaseStyle;
    const positions = {
        'Cabeza': 'head',
        'Agarre Derecha': 'grip_right',
        'Agarre Izquierda': 'grip_left',
        'Derecha': 'right',
        'Izquierda': 'left',
        'Arriba': 'top',
        'Abajo': 'bottom',
        'Centrado': 'centered'
    };
    for (const name in positions) {
        const opt = document.createElement('option');
        opt.value = positions[name];
        opt.textContent = name;
        positionSelect.appendChild(opt);
    }
    positionSelect.value = 'head';
    createLabeledRow(contentDiv, 'Posición:', positionSelect);

    const orientationSelect = document.createElement('select');
    orientationSelect.style.cssText = selectBaseStyle;
    const orientations = {
        'Actual': 'none',
        'Derecha (90°)': 'right',
        'Izquierda (-90°)': 'left',
        'Abajo (180°)': 'down',
        'Arriba (0°)' : 'up'
    };
    for (const name in orientations) {
        const opt = document.createElement('option');
        opt.value = orientations[name];
        opt.textContent = name;
        orientationSelect.appendChild(opt);
    }
    orientationSelect.value = 'none';
    createLabeledRow(contentDiv, 'Orientación:', orientationSelect);

    const sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.min = '0.1';
    sizeInput.max = '2.0';
    sizeInput.step = '0.1';
    sizeInput.value = '1.0';
    sizeInput.style.cssText = baseInputStyle + `width: 60px; text-align: center;`;
    createLabeledRow(contentDiv, 'Tamaño (Escala):', sizeInput);

    const repeatActionToggle = document.createElement('input');
    repeatActionToggle.type = 'checkbox';
    repeatActionToggle.id = 'repeatActionToggle';
    repeatActionToggle.style.cssText = `margin-right: 5px; cursor: pointer; transform: scale(1.2);`;
    const repeatActionLabel = document.createElement('label');
    repeatActionLabel.htmlFor = 'repeatActionToggle';
    repeatActionLabel.textContent = ` Repetir Acción (cada ${WAIT_ACTION_DELAY / 1000}s)`;
    repeatActionLabel.style.cssText = `display: flex; align-items: center; cursor: pointer;`;
    const repeatActionWrapper = document.createElement('div');
    repeatActionWrapper.style.cssText = `display:flex; align-items:center; gap:0;`;
    repeatActionWrapper.appendChild(repeatActionToggle);
    repeatActionWrapper.appendChild(repeatActionLabel);
    contentDiv.appendChild(repeatActionWrapper);


    const drawBtn = document.createElement('button');
    drawBtn.textContent = 'Dibujar en avatar';
    drawBtn.disabled = true;
    drawBtn.style.cssText = `
        padding: 10px 18px; border-radius: 8px; border: none;
        background: linear-gradient(145deg, #4CAF50, #45a049);
        color: white; font-weight: bold; font-size: 15px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);

        &:hover {
            background: linear-gradient(145deg, #45a049, #3d8c41);
            box-shadow: 0 5px 12px rgba(0,0,0,0.5);
            transform: translateY(-2px);
        }
        &:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        &:disabled {
            background: #666; cursor: not-allowed;
            box-shadow: none;
            opacity: 0.7;
        }
    `;
    contentDiv.appendChild(drawBtn);

    // NUEVO: Botón para detener la animación actual
    stopBtn = document.createElement('button');
    stopBtn.textContent = 'Detener Animación';
    stopBtn.disabled = true;
    stopBtn.style.cssText = `
        margin-top: 5px; /* Espacio entre botones */
        padding: 8px 16px; border-radius: 8px; border: none;
        background: linear-gradient(145deg, #f44336, #d32f2f); /* Rojo */
        color: white; font-weight: bold; font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);

        &:hover {
            background: linear-gradient(145deg, #d32f2f, #b71c1c);
            box-shadow: 0 5px 12px rgba(0,0,0,0.5);
            transform: translateY(-2px);
        }
        &:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        &:disabled {
            background: #666; cursor: not-allowed;
            box-shadow: none;
            opacity: 0.7;
        }
    `;
    contentDiv.appendChild(stopBtn);

    document.body.appendChild(container);

    /* ----------  FUNCIONALIDAD DE ARRASTRE (DRAGGABLE)  ---------- */
    let isDragging = false;
    let offsetX, offsetY;

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'grabbing';
        container.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));

        container.style.left = newX + 'px';
        container.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'default';
        container.style.transition = '';
    });

    /* ----------  LISTA DE JUGADORES (VERSIÓN MEJORADA)  ---------- */
    let lastPlayerList = new Set();
    let isUpdatingList = false;

    function refreshPlayerList() {
        if (isUpdatingList) return;

        const currentPlayers = new Set();
        const playerRows = document.querySelectorAll('.playerlist-row[data-playerid]');

        playerRows.forEach(row => {
            if (row.dataset.self !== 'true' && row.dataset.playerid !== '0') {
                const name = row.querySelector('.playerlist-name a')?.textContent || `Jugador ${row.dataset.playerid}`;
                currentPlayers.add(`${row.dataset.playerid}:${name}`);
            }
        });

        const playersChanged = currentPlayers.size !== lastPlayerList.size ||
              ![...currentPlayers].every(player => lastPlayerList.has(player));

        if (!playersChanged) return;

        isUpdatingList = true;

        const previousSelection = playerSelect.value;
        const previousSelectedText = playerSelect.selectedOptions?.[0]?.textContent || '';

        playerSelect.innerHTML = '';

        playerRows.forEach(row => {
            if (row.dataset.self === 'true') return;
            if (row.dataset.playerid === '0') return;
            const name = row.querySelector('.playerlist-name a')?.textContent || `Jugador ${row.dataset.playerid}`;
            const opt = document.createElement('option');
            opt.value = row.dataset.playerid;
            opt.textContent = name;
            playerSelect.appendChild(opt);
        });

        if (previousSelection) {
            let restored = false;
            for (let option of playerSelect.options) {
                if (option.value === previousSelection) {
                    playerSelect.value = previousSelection;
                    restored = true;
                    break;
                }
            }

            if (!restored && previousSelectedText) {
                for (let option of playerSelect.options) {
                    if (option.textContent === previousSelectedText) {
                        playerSelect.value = option.value;
                        restored = true;
                        break;
                    }
                }
            }
        }

        lastPlayerList = new Set(currentPlayers);

        drawBtn.disabled = playerSelect.children.length === 0;
        isUpdatingList = false;
    }

    let refreshTimeout;
    function debouncedRefresh() {
        clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(refreshPlayerList, 100);
    }


    /* ----------  ANÁLISIS DE JSON DE DIBUJO  ---------- */
    function analyzeJsonBounds(jsonCommands) {
        let min_nx = Infinity, max_nx = -Infinity;
        let min_ny = Infinity, max_ny = -Infinity;

        if (!Array.isArray(jsonCommands) || jsonCommands.length === 0) {
            return { min_nx: 0, max_nx: 0, min_ny: 0, max_ny: 0 };
        }

        for (const cmdArr of jsonCommands) {
            if (cmdArr.length > 2 && Array.isArray(cmdArr[2]) && cmdArr[2].length >= 4) {
                const [nx1, ny1, nx2, ny2] = cmdArr[2];
                min_nx = Math.min(min_nx, nx1, nx2);
                max_nx = Math.max(max_nx, nx1, nx2);
                min_ny = Math.min(min_ny, ny1, ny2);
                max_ny = Math.max(max_ny, ny1, ny2);
            }
        }
        if (min_nx === Infinity || max_nx === -Infinity || min_ny === Infinity || max_ny === -Infinity) {
            return { min_nx: 0, max_nx: 0, min_ny: 0, max_ny: 0 };
        }
        return { min_nx, max_nx, min_ny, max_ny };
    }


    /* ----------  LÓGICA DE DIBUJO PRINCIPAL (para JSONs) ---------- */
    let repeatIntervalId = null;
    let isDrawing = false; // Bandera para evitar múltiples ejecuciones de drawJsonCommands/efectos

    /**
     * Dibuja un JSON en el avatar del jugador, aplicando posición, orientación y escala.
     * Esta función es la que interpreta los comandos de dibujo de un JSON.
     * @param {string} targetPlayerId El ID del jugador objetivo para colocar el JSON.
     * @param {string|null} jsonUrlOverride Si se proporciona, usa esta URL de JSON en lugar de la seleccionada en la UI.
     * @param {string|null} positionOverride Si se proporciona, usa esta posición en lugar de la seleccionada en la UI.
     * @param {string|null} orientationOverride Si se proporciona, usa esta orientación en lugar de la seleccionada en la UI.
     * @param {number|null} sizeFactorOverride Si se proporciona, usa este factor de escala en lugar del de la UI.
     */
    async function drawJsonCommands(targetPlayerId, jsonUrlOverride = null, positionOverride = null, orientationOverride = null, sizeFactorOverride = null) {
        if (stopSignal) { console.log('drawJsonCommands detenido por señal.'); return; }
        if (!socket) {
            console.warn('drawJsonCommands: Socket no está listo. No se puede dibujar en el servidor.');
        }
        const avatar = document.querySelector(`.spawnedavatar[data-playerid="${targetPlayerId}"]`);
        if (!avatar) {
            console.warn('drawJsonCommands: Avatar no encontrado para el ID:', targetPlayerId, 'No se puede dibujar.');
            return;
        }

        const cRect = canvas.getBoundingClientRect();
        const aRect = avatar.getBoundingClientRect();

        const avatarX = aRect.left - cRect.left;
        const avatarY = aRect.top - cRect.top;
        const avatarWidth = aRect.width;
        const avatarHeight = aRect.height;
        const avatarCenterX = avatarX + avatarWidth / 2;
        const avatarCenterY = avatarY + avatarHeight / 2;

        // USA LOS OVERRIDES SI ESTÁN PRESENTES, SINO USA LOS VALORES DE LA UI
        const url = jsonUrlOverride || jsonUrlSelect.value;
        const currentPosition = positionOverride || positionSelect.value;
        const orientation = orientationOverride || orientationSelect.value;
        const sizeFactor = sizeFactorOverride !== null ? sizeFactorOverride : parseFloat(sizeInput.value) || 1.0;

        if (!url || url === '' || url.startsWith('effect:')) {
            console.log('drawJsonCommands: No se proporcionó una URL de JSON válida o es un efecto procedural.');
            return;
        }

        const json = await fetchJson(url);
        if (stopSignal) return;
        if (!json || !Array.isArray(json.commands)) {
            console.error('drawJsonCommands: JSON inválido o no se pudo cargar el dibujo de la URL:', url);
            alert('JSON inválido o no se pudo cargar el dibujo. Asegúrate de que el formato sea correcto y la URL accesible.');
            return;
        }

        const { min_nx, max_nx, min_ny, max_ny } = analyzeJsonBounds(json.commands);

        // Bounding box del dibujo *escalado* (antes de posicionar/rotar)
        const scaledDrawWidth = (max_nx - min_nx) * canvas.width * sizeFactor;
        const scaledDrawHeight = (max_ny - min_ny) * canvas.height * sizeFactor;

        // Origen del dibujo si estuviera posicionado en (0,0) del canvas y escalado
        const scaledOriginalOriginX = min_nx * canvas.width * sizeFactor;
        const scaledOriginalOriginY = min_ny * canvas.height * sizeFactor;

        // Calcular el centro del bounding box escalado (usado como pivote de rotación)
        const pivotX = scaledOriginalOriginX + scaledDrawWidth / 2;
        const pivotY = scaledOriginalOriginY + scaledDrawHeight / 2;

        let drawingOriginX; // Posición final del punto (0,0) del dibujo en el canvas
        let drawingOriginY;

        // Calcular drawingOriginX/Y basado en la posición deseada (usando currentPosition)
        switch (currentPosition) {
            case 'centered':
                drawingOriginX = avatarCenterX - pivotX;
                drawingOriginY = avatarCenterY - pivotY;
                break;
            case 'top':
                drawingOriginX = avatarCenterX - pivotX;
                drawingOriginY = (avatarY - DRAW_PADDING) - scaledDrawHeight - scaledOriginalOriginY; // Ajuste para que la base del dibujo quede arriba
                break;
            case 'bottom':
                drawingOriginX = avatarCenterX - pivotX;
                drawingOriginY = (avatarY + avatarHeight + DRAW_PADDING) - scaledOriginalOriginY; // Ajuste para que la parte superior quede abajo
                break;
            case 'left':
                drawingOriginY = avatarCenterY - pivotY;
                drawingOriginX = (avatarX - DRAW_PADDING) - scaledDrawWidth - scaledOriginalOriginX; // Ajuste para que el lado derecho quede a la izquierda
                break;
            case 'right':
                drawingOriginY = avatarCenterY - pivotY;
                drawingOriginX = (avatarX + avatarWidth + DRAW_PADDING) - scaledOriginalOriginX; // Ajuste para que el lado izquierdo quede a la derecha
                break;
            case 'head':
                drawingOriginX = avatarCenterX - pivotX;
                drawingOriginY = avatarY - scaledDrawHeight - scaledOriginalOriginY + (avatarHeight * 0.1);
                break;
            case 'grip_right':
                drawingOriginX = (avatarX + avatarWidth + DRAW_PADDING_HAND) - scaledOriginalOriginX;
                drawingOriginY = avatarCenterY - pivotY + HAND_GRIP_OFFSET_Y;
                break;
            case 'grip_left':
                drawingOriginX = (avatarX - DRAW_PADDING_HAND) - scaledDrawWidth - scaledOriginalOriginX;
                drawingOriginY = avatarCenterY - pivotY + HAND_GRIP_OFFSET_Y;
                break;
            default:
                drawingOriginX = avatarCenterX - pivotX;
                drawingOriginY = avatarCenterY - pivotY;
                break;
        }

        // Determinar ángulo de rotación (usando 'orientation')
        let rotationAngleRad = 0;
        switch (orientation) {
            case 'right': rotationAngleRad = Math.PI / 2; break;
            case 'left': rotationAngleRad = -Math.PI / 2; break;
            case 'down': rotationAngleRad = Math.PI; break;
            case 'up':
            case 'none':
            default: rotationAngleRad = 0; break;
        }

        // NOTE: The original script explicitly stated to ignore 'orientation' and force facing right.
        // If actual rotation based on 'orientation' is desired, the following commented out rotation logic would be needed.
        // For now, it behaves as the original script's comment suggested, making JSONs appear right-facing relative to the avatar.

        for (const cmdArr of json.commands) {
            if (stopSignal) { console.log('drawJsonCommands detenido por señal.'); return; }
            if (repeatIntervalId && !repeatActionToggle.checked) {
                console.log('drawJsonCommands: Interrupción por toggle inactivo.');
                return;
            }

            const [, , [nx1, ny1, nx2, ny2, , thickNeg, color]] = cmdArr;

            // Coordenadas base escaladas
            let currentX1 = (nx1 * canvas.width * sizeFactor) - scaledOriginalOriginX;
            let currentY1 = (ny1 * canvas.height * sizeFactor) - scaledOriginalOriginY;
            let currentX2 = (nx2 * canvas.width * sizeFactor) - scaledOriginalOriginX;
            let currentY2 = (ny2 * canvas.height * sizeFactor) - scaledOriginalOriginY;

            // FORZAR QUE TODOS MIREN HACIA LA DERECHA SIEMPRE
            // Ignorar completamente la variable 'orientation'
            // If actual rotation based on `orientation` is desired, uncomment the rotation logic below and remove these direct assignments.
            const finalX1 = currentX1 + drawingOriginX;
            const finalY1 = currentY1 + drawingOriginY;
            const finalX2 = currentX2 + drawingOriginX;
            const finalY2 = currentY2 + drawingOriginY;

            sendDrawCommand(finalX1, finalY1, finalX2, finalY2, color, -thickNeg);
            await new Promise(r => setTimeout(r, REPEAT_ACTION_DELAY));
        }
    }

    // Envía el comando de dibujo al socket de Drawaria Y DIBUJA LOCALMENTE EN EL CANVAS
    function sendDrawCommand(x1, y1, x2, y2, color, thickness) {
        // Asegurarse de que las coordenadas sean números enteros para un mejor rendimiento y visualización
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

    /* ----------  AYUDAS (HELPERS)  ---------- */
    function fetchJson(url) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: r => {
                    try { resolve(JSON.parse(r.responseText)); }
                    catch {
                        console.error('Error al analizar JSON de la URL:', url, r.responseText);
                        resolve(null);
                    }
                },
                onerror: (error) => {
                    console.error('Error al obtener JSON de la URL:', url, error);
                    resolve(null);
                }
            });
        });
    }

    /**
     * Obtiene las coordenadas del centro del objetivo o un punto de agarre.
     * @param {string} playerId El ID del jugador objetivo.
     * @param {string} attachmentPointName Nombre del punto de acoplamiento (e.g., 'grip_right', 'head', 'centered').
     * @returns {object|null} - {x, y} de las coordenadas del punto de acoplamiento o null si no se encuentra.
     */
    function _getAttachmentPoint(playerId, attachmentPointName = 'centered') {
        const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]`);
        if (!avatar) {
            console.warn(`_getAttachmentPoint: Avatar no encontrado para el jugador ${playerId}.`);
            return null;
        }

        const cRect = canvas.getBoundingClientRect();
        const aRect = avatar.getBoundingClientRect();

        const avatarX = aRect.left - cRect.left;
        const avatarY = aRect.top - cRect.top;
        const avatarWidth = aRect.width;
        const avatarHeight = aRect.height;
        const avatarCenterX = avatarX + avatarWidth / 2;
        const avatarCenterY = avatarY + avatarHeight / 2;

        let attachX, attachY;

        switch (attachmentPointName) {
            case 'grip_right':
                attachX = avatarX + avatarWidth + DRAW_PADDING_HAND;
                attachY = avatarCenterY + HAND_GRIP_OFFSET_Y;
                break;
            case 'grip_left':
                attachX = avatarX - DRAW_PADDING_HAND;
                attachY = avatarCenterY + HAND_GRIP_OFFSET_Y;
                break;
            case 'head':
                attachX = avatarCenterX;
                attachY = avatarY + (avatarHeight * 0.1); // Parte superior de la cabeza
                break;
            case 'bottom':
                attachX = avatarCenterX;
                attachY = avatarY + avatarHeight + DRAW_PADDING; // Parte inferior del avatar
                break;
            case 'centered':
            default:
                attachX = avatarCenterX;
                attachY = avatarCenterY;
                break;
        }
        return { x: attachX, y: attachY };
    }

    // Función auxiliar para obtener coordenadas del centro del objetivo
    function getTargetCoords(targetPlayerId) {
        return _getAttachmentPoint(targetPlayerId, 'centered');
    }

    // Función auxiliar para calcular distancia entre dos puntos
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    /* ----------  FUNCIONES DE EFECTOS PROCEDURALES  ---------- */

    // Función de ráfaga de explosión (usada por el efecto Bomba)
    async function explosionBlast(centerX, centerY, size = 1.0) {
        if (stopSignal) { console.log('explosionBlast detenida.'); return; }
        const steps = 80;
        const maxRadius = 100 * size;

        const explosionColors = [
            'hsl(0, 100%, 60%)', 'hsl(15, 100%, 65%)', 'hsl(30, 100%, 60%)',
            'hsl(45, 100%, 65%)', 'hsl(60, 100%, 70%)', 'hsl(25, 100%, 55%)', 'hsl(10, 100%, 50%)',
        ];

        for (let i = 0; i < steps; i++) {
            if (stopSignal) { console.log('explosionBlast detenida en bucle.'); return; }
            if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
                console.log('explosionBlast: Detenido por interrupción o socket no disponible.');
                break;
            }

            const progress = i / steps;
            const particlesThisStep = 2 + Math.floor(progress * 5);

            for (let p = 0; p < particlesThisStep; p++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = progress * maxRadius * (0.8 + Math.random() * 0.4);

                const endX = centerX + distance * Math.cos(angle);
                const endY = centerY + distance * Math.sin(angle);

                const colorIndex = Math.floor(Math.random() * explosionColors.length);
                const color = explosionColors[colorIndex];
                const thickness = Math.max(1, 8 - progress * 7 + Math.random() * 2);

                sendDrawCommand(centerX, centerY, endX, endY, color, thickness);
            }
            await new Promise(resolve => setTimeout(resolve, 25 + progress * 15));
        }
    }

    // Efecto: Dibuja la Bomba (JSON) y luego hace la Explosión (procedural)
    async function drawBombWithExplosion(playerId) {
        if (stopSignal) { console.log('drawBombWithExplosion detenida.'); return; }
        console.log(`drawBombWithExplosion: Iniciando efecto en ${playerId}...`);

        // Bomb will appear on the *selected target player's* avatar
        const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]`);
        if (!avatar) {
            console.warn('drawBombWithExplosion: Avatar no encontrado.');
            return;
        }

        // Antes de dibujar la bomba, guardar las coordenadas donde debería estar el centro de la explosión
        const bombPlacement = _getAttachmentPoint(playerId, 'bottom'); // La bomba en el suelo
        if (!bombPlacement) { console.warn('drawBombWithExplosion: No se pudo determinar el punto de colocación de la bomba.'); return; }

        const explosionPointX = bombPlacement.x;
        const explosionPointY = bombPlacement.y;

        console.log(`drawBombWithExplosion: Dibujando bomba JSON...`);
        // Dibuja el JSON de la bomba, centrado en la parte inferior del avatar
        await drawJsonCommands(playerId, BOMBA_JSON_URL, 'bottom', 'none', 1.0);
        if (stopSignal) return;

        if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
            console.log('drawBombWithExplosion: Interrumpido antes de la explosión.');
            return;
        }

        console.log('drawBombWithExplosion: Bomba dibujada. Esperando 2 segundos para la explosión...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (stopSignal) return;

        console.log('drawBombWithExplosion: Iniciando explosión procedural...');
        await explosionBlast(explosionPointX, explosionPointY, 1.2); // Explosión en el punto guardado
        console.log('drawBombWithExplosion: Explosión completada.');
    }

// Efecto Rayo Zigzag Perseguidor (OPTIMIZADO Y MÁS FLUIDO)
async function lightningZigzagChaser(targetPlayerId) {
    if (stopSignal) { console.log('lightningZigzagChaser detenida.'); return; }
    console.log(`lightningZigzagChaser: Iniciando efecto optimizado en ${targetPlayerId}...`);
    if (!socket) {
        console.warn('lightningZigzagChaser: Socket no disponible.');
        return;
    }

    const cRect = canvas.getBoundingClientRect();

    const getTargetCoordsDynamic = () => {
        const currentAvatar = document.querySelector(`.spawnedavatar[data-playerid="${targetPlayerId}"]`);
        if (!currentAvatar) return null;
        const currentARect = currentAvatar.getBoundingClientRect();
        return {
            x: Math.round((currentARect.left - cRect.left) + (currentARect.width / 2)),
            y: Math.round((currentARect.top - cRect.top) + (currentARect.height / 2))
        };
    };

    // Esquinas optimizadas con coordenadas enteras[5]
    const corners = [
        { x: 20, y: 20 },
        { x: Math.round(canvas.width - 20), y: 20 },
        { x: 20, y: Math.round(canvas.height - 20) },
        { x: Math.round(canvas.width - 20), y: Math.round(canvas.height - 20) }
    ];
    const startCorner = corners[Math.floor(Math.random() * corners.length)];

    let currentX = startCorner.x;
    let currentY = startCorner.y;

    const totalSegments = 25;
    const zigzagIntensity = 28;
    const lightningColors = ['#FFFFFF', '#E0E6FF', '#6495ED', '#4169E1'];

    // Variables para suavizado del movimiento
    let previousAngle = 0;
    const smoothingFactor = 0.3;

    for (let segment = 0; segment < totalSegments; segment++) {
        if (stopSignal) { console.log('lightningZigzagChaser detenida en bucle.'); return; }
        if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
            console.log('lightningZigzagChaser: Detenido por interrupción.');
            break;
        }

        const progress = segment / totalSegments;
        const targetCoords = getTargetCoordsDynamic();

        if (!targetCoords) {
            console.log('lightningZigzagChaser: Objetivo desaparecido.');
            break;
        }

        const targetX = targetCoords.x;
        const targetY = targetCoords.y;

        // Movimiento más suave hacia el objetivo[1]
        const stepSize = 0.13 + (progress * 0.05); // Acelera ligeramente hacia el final
        const directX = Math.round(currentX + (targetX - currentX) * stepSize);
        const directY = Math.round(currentY + (targetY - currentY) * stepSize);

        const directionX = targetX - currentX;
        const directionY = targetY - currentY;
        const distance = Math.sqrt(directionX * directionX + directionY * directionY);

        if (distance > 8) {
            const perpX = -directionY / distance;
            const perpY = directionX / distance;

            // Zigzag más suave y natural[1][2]
            const baseZigzag = Math.sin(segment * 0.8) * zigzagIntensity * (1 - progress * 0.6);
            const noiseZigzag = (Math.random() - 0.5) * 15 * (1 - progress * 0.3); // Ruido adicional
            const smoothedZigzag = baseZigzag + noiseZigzag;

            // Suavizado del ángulo para transiciones más fluidas
            const currentAngle = Math.atan2(directionY, directionX);
            const angleDiff = currentAngle - previousAngle;
            const smoothedAngle = previousAngle + angleDiff * smoothingFactor;
            previousAngle = smoothedAngle;

            const finalZigzag = smoothedZigzag * Math.sin(progress * Math.PI); // Curva de intensidad

            const nextX = Math.round(directX + perpX * finalZigzag);
            const nextY = Math.round(directY + perpY * finalZigzag);

            // BATCH RENDERING: Agrupar todas las capas del segmento[3][5]
            const segmentLayers = [];

            // Preparar todas las capas antes de dibujar
            for (let layer = 0; layer < 3; layer++) {
                const colorIndex = (segment + layer) % lightningColors.length; // Variación más consistente
                const color = lightningColors[colorIndex];
                const thickness = Math.max(1, 7 - layer * 2);

                // Offset más sutil para capas[2]
                const offsetX = Math.round((Math.random() - 0.5) * (4 - layer));
                const offsetY = Math.round((Math.random() - 0.5) * (4 - layer));

                segmentLayers.push({
                    startX: currentX + offsetX,
                    startY: currentY + offsetY,
                    endX: nextX + offsetX,
                    endY: nextY + offsetY,
                    color: color,
                    thickness: thickness
                });
            }

            // BATCH: Dibujar todas las capas seguidas[5]
            segmentLayers.forEach(layer => {
                sendDrawCommand(
                    layer.startX,
                    layer.startY,
                    layer.endX,
                    layer.endY,
                    layer.color,
                    layer.thickness
                );
            });

            // Mini-delay después del batch para fluidez
            await new Promise(resolve => setTimeout(resolve, 12));
            if (stopSignal) return;

            // Efectos adicionales cada pocos segmentos para más belleza
            if (segment % 4 === 0 && progress < 0.8) {
                // Chispas laterales ocasionales[1]
                const sparkAngle = currentAngle + (Math.random() - 0.5) * Math.PI * 0.5;
                const sparkDistance = 15 + Math.random() * 10;
                const sparkX = Math.round(nextX + Math.cos(sparkAngle) * sparkDistance);
                const sparkY = Math.round(nextY + Math.sin(sparkAngle) * sparkDistance);

                sendDrawCommand(nextX, nextY, sparkX, sparkY, '#E0E6FF', 1);

                // Mini-delay para chispas
                await new Promise(resolve => setTimeout(resolve, 8));
                if (stopSignal) return;
            }

            currentX = directX;
            currentY = directY;
        } else {
            // Cerca del objetivo - movimiento más directo y suave
            const finalStepX = Math.round(currentX + (targetX - currentX) * 0.3);
            const finalStepY = Math.round(currentY + (targetY - currentY) * 0.3);

            // Rayo final más grueso y brillante
            sendDrawCommand(currentX, currentY, finalStepX, finalStepY, '#FFFFFF', 5);
            await new Promise(resolve => setTimeout(resolve, 8));
            if (stopSignal) return;
            sendDrawCommand(currentX, currentY, finalStepX, finalStepY, '#E0E6FF', 3);

            currentX = targetX;
            currentY = targetY;
            break; // Llegamos al objetivo
        }

        // Delay principal ajustado para fluidez[4]
        await new Promise(resolve => setTimeout(resolve, 85)); // Era 100ms, ahora 85ms
    }

    // Conexión final brillante al objetivo
    if (socket && !stopSignal && !(repeatIntervalId && !repeatActionToggle.checked)) {
        const targetCoords = getTargetCoordsDynamic();
        if (targetCoords) {
            // Rayo final intenso
            for (let finalLayer = 0; finalLayer < 4; finalLayer++) {
                if (stopSignal) return;
                const finalColor = lightningColors[finalLayer % lightningColors.length];
                const finalThickness = Math.max(2, 8 - finalLayer * 2);

                sendDrawCommand(currentX, currentY, targetCoords.x, targetCoords.y, finalColor, finalThickness);
                await new Promise(resolve => setTimeout(resolve, 15)); // Delay entre capas finales
            }
            if (stopSignal) return;
            await lightningImpact(targetCoords.x, targetCoords.y);
        } else {
            console.warn('lightningZigzagChaser: Objetivo no encontrado para el impacto final.');
        }
    }
    console.log('lightningZigzagChaser: Efecto optimizado completado.');
}

// Impacto mantiene el código original
async function lightningImpact(centerX, centerY) {
    if (stopSignal) { console.log('lightningImpact detenida.'); return; }
    const impactSteps = 15;
    const maxRadius = 50;

    console.log(`lightningImpact: Impacto en (${centerX}, ${centerY})`);

    for (let step = 0; step < impactSteps; step++) {
        if (stopSignal) { console.log('lightningImpact detenida en bucle.'); return; }
        if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
            console.log('lightningImpact: Detenido por interrupción.');
            break;
        }

        const progress = step / impactSteps;
        const currentRadius = Math.round(maxRadius * progress);
        const raysThisStep = 8;

        for (let ray = 0; ray < raysThisStep; ray++) {
            const angle = (ray / raysThisStep) * 2 * Math.PI + Math.random() * 0.3;
            const rayLength = Math.round(currentRadius + Math.random() * 18);

            const endX = centerX + rayLength * Math.cos(angle);
            const endY = centerY + rayLength * Math.sin(angle);

            const midDistance = Math.round(rayLength * 0.6);
            const midAngle = angle + (Math.random() - 0.5) * 0.3;
            const midX = centerX + midDistance * Math.cos(midAngle);
            const midY = centerY + midDistance * Math.sin(midAngle);

            const colors = ['#FFFFFF', '#E0E6FF', '#6495ED'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const thickness = Math.max(1, 6 - progress * 4);

            sendDrawCommand(centerX, centerY, midX, midY, color, thickness);
            sendDrawCommand(midX, midY, endX, endY, color, thickness * 0.7);
        }
        await new Promise(resolve => setTimeout(resolve, 85));
    }
    console.log('lightningImpact: Impacto completado.');
}

// Función auxiliar para ajustar intensidad del color (usado en aura de fuego)
function adjustColorIntensity(hexColor, intensity) {
    if (!hexColor.startsWith('#') || hexColor.length !== 7) {
        return hexColor;
    }
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    const newR = Math.floor(r * intensity);
    const newG = Math.floor(g * intensity);
    const newB = Math.floor(b * intensity);

    return `rgb(${newR}, ${newG}, ${newB})`;
}

// Efecto: Aura de Fuego Circular (ULTRA OPTIMIZADO para servidor)
async function circularFireAura(targetPlayerId, duration = 500) {
    if (stopSignal) { console.log('circularFireAura detenida.'); return; }
    if (!socket) {
        console.warn('circularFireAura: Socket no disponible.');
        return;
    }

    const cRect = canvas.getBoundingClientRect();

    const getCenterCoords = () => {
        const currentAvatar = document.querySelector(`.spawnedavatar[data-playerid="${targetPlayerId}"]`);
        if (!currentAvatar) return null;
        const currentARect = currentAvatar.getBoundingClientRect();
        return {
            // Coordenadas enteras para optimización[4]
            x: Math.floor((currentARect.left - cRect.left) + (currentARect.width / 2)),
            y: Math.floor((currentARect.top - cRect.top) + (currentARect.height / 2))
        };
    };

    const minRadius = 30;
    const maxRadius = 90;
    const ringCount = 5;
    const flamesPerRing = 20;

    const fireGradient = [
        '#FFFF99', '#FFCC00', '#FF9900', '#FF6600', '#FF3300', '#CC0000'
    ];

    const startTime = Date.now();
    let frame = 0;

    console.log(`circularFireAura: Creando aura de fuego ultra optimizada para jugador ${targetPlayerId}... (duración: ${duration}ms)`);

    while (Date.now() - startTime < duration) {
        if (stopSignal) { console.log('circularFireAura detenida en bucle.'); return; }
        if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
            console.log('circularFireAura: Detenida por interrupción o socket no disponible.');
            break;
        }

        frame++;

        const currentCenter = getCenterCoords();
        if (!currentCenter) {
            console.log('circularFireAura: Objetivo desaparecido, deteniendo aura de fuego.');
            return;
        }
        const centerX = currentCenter.x;
        const centerY = currentCenter.y;

        // BATCH ULTRA PEQUEÑO: Un anillo por vez[1][3]
        for (let ring = 0; ring < ringCount; ring++) {
            if (stopSignal) return;
            const ringProgress = ring / ringCount;
            const ringRadius = minRadius + (maxRadius - minRadius) * ringProgress;

            const colorIndex = Math.min(ring, fireGradient.length - 1);
            const ringColor = fireGradient[colorIndex];

            // BATCH MICROSCÓPICO: Procesar llamas en grupos de 4[1]
            for (let flameBatch = 0; flameBatch < flamesPerRing; flameBatch += 4) {
                if (stopSignal) return;
                for (let flame = flameBatch; flame < Math.min(flameBatch + 4, flamesPerRing); flame++) {
                    if (stopSignal) return;
                    const baseAngle = (flame / flamesPerRing) * 2 * Math.PI;

                    const timeOffset = frame * 0.08 + ring * 0.4;
                    const flameVariation =
                        Math.sin(baseAngle * 4 + timeOffset) * 8 +
                        Math.sin(baseAngle * 7 + timeOffset * 1.3) * 5 +
                        Math.cos(baseAngle * 3 + timeOffset * 0.7) * 6;

                    const actualRadius = ringRadius + flameVariation;

                    // Coordenadas enteras[4]
                    const flameX = Math.floor(centerX + actualRadius * Math.cos(baseAngle));
                    const flameY = Math.floor(centerY + actualRadius * Math.sin(baseAngle));

                    const innerRadius = ringRadius * 0.65;
                    const innerX = Math.floor(centerX + innerRadius * Math.cos(baseAngle));
                    const innerY = Math.floor(centerY + innerRadius * Math.sin(baseAngle));

                    const flickerIntensity = 0.6 + 0.4 * Math.sin(frame * 0.12 + flame * 0.6);

                    if (flickerIntensity > 0.7) {
                        const thickness = Math.max(1, 5 - ringProgress * 3 + Math.random() * 2);

                        sendDrawCommand(innerX, innerY, flameX, flameY, ringColor, thickness);

                        // Micro-delay después de cada llama
                        await new Promise(resolve => setTimeout(resolve, 8)); // 8ms por llama
                        if (stopSignal) return;

                        if (ring === ringCount - 1 && Math.random() < 0.15) {
                            const sparkDistance = actualRadius + Math.random() * 15;
                            const sparkX = Math.floor(centerX + sparkDistance * Math.cos(baseAngle));
                            const sparkY = Math.floor(centerY + sparkDistance * Math.sin(baseAngle));

                            sendDrawCommand(flameX, flameY, sparkX, sparkY, '#FFCC00', 1);

                            // Delay adicional para chispas
                            await new Promise(resolve => setTimeout(resolve, 12)); // 12ms por chispa
                            if (stopSignal) return;
                        }
                    }
                }

                // Delay entre batches de llamas[3]
                await new Promise(resolve => setTimeout(resolve, 25)); // 25ms entre grupos de 4 llamas
                if (stopSignal) return;
            }

            // Conexiones con batches ultra pequeños
            if (frame % 3 === 0) {
                const connectionBatches = Math.ceil((flamesPerRing / 2) / 2); // Grupos de 2 conexiones

                for (let connBatch = 0; connBatch < connectionBatches; connBatch++) {
                    if (stopSignal) return;
                    const startConn = connBatch * 2;
                    const endConn = Math.min(startConn + 2, flamesPerRing / 2);

                    for (let connection = startConn; connection < endConn; connection++) {
                        if (stopSignal) return;
                        const angle1 = (connection * 2 / flamesPerRing) * 2 * Math.PI;
                        const angle2 = ((connection * 2 + 1) / flamesPerRing) * 2 * Math.PI;

                        const x1 = Math.floor(centerX + ringRadius * Math.cos(angle1));
                        const y1 = Math.floor(centerY + ringRadius * Math.sin(angle1));
                        const x2 = Math.floor(centerX + ringRadius * Math.cos(angle2));
                        const y2 = Math.floor(centerY + ringRadius * Math.sin(angle2));

                        sendDrawCommand(x1, y1, x2, y2, ringColor, Math.max(1, 4 - ringProgress * 2));

                        // Micro-delay entre conexiones
                        await new Promise(resolve => setTimeout(resolve, 15)); // 15ms por conexión
                        if (stopSignal) return;
                    }

                    // Delay entre batches de conexiones
                    if (connBatch < connectionBatches - 1) {
                        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms entre grupos de conexiones
                        if (stopSignal) return;
                    }
                }
            }

            // Delay LARGO entre anillos[1]
            await new Promise(resolve => setTimeout(resolve, 80)); // 80ms entre anillos
            if (stopSignal) return;
        }

        // Delay principal ULTRA aumentado[5]
        await new Promise(resolve => setTimeout(resolve, 150)); // Era 60ms, ahora 150ms
    }

    // Desvanecer el aura si no fue interrumpida
    if (socket && !stopSignal && !(repeatIntervalId && !repeatActionToggle.checked)) {
        const currentCenter = getCenterCoords();
        if(currentCenter) {
            await fireAuraFadeOutUltraOptimized(currentCenter.x, currentCenter.y, maxRadius);
        } else {
            console.warn('circularFireAura: Objetivo no encontrado para el desvanecimiento final.');
        }
    }
    console.log('circularFireAura: Aura de fuego ultra optimizada finalizada.');
}

// Desvanecimiento ultra optimizado
async function fireAuraFadeOutUltraOptimized(centerX, centerY, radius) {
    if (stopSignal) { console.log('fireAuraFadeOut detenida.'); return; }
    const fadeSteps = 15;

    // Coordenadas enteras[4]
    centerX = Math.floor(centerX);
    centerY = Math.floor(centerY);

    console.log('fireAuraFadeOut: Desvaneciendo aura de fuego ultra optimizada...');

    for (let step = fadeSteps; step > 0; step--) {
        if (stopSignal) { console.log('fireAuraFadeOut detenida en bucle.'); return; }
        if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
            console.log('fireAuraFadeOut: Detenido por interrupción o socket no disponible.');
            break;
        }

        const fadeIntensity = step / fadeSteps;
        const currentRadius = radius * fadeIntensity;
        const rings = Math.max(1, Math.floor(4 * fadeIntensity));

        // BATCH MICROSCÓPICO: Un anillo por vez[1]
        for (let ring = 0; ring < rings; ring++) {
            if (stopSignal) return;
            const ringRadius = currentRadius * (0.4 + ring * 0.2);
            const segments = Math.max(8, Math.floor(16 * fadeIntensity));

            // Procesar segmentos en grupos de 3[3]
            for (let segBatch = 0; segBatch < segments; segBatch += 3) {
                if (stopSignal) return;
                for (let segment = segBatch; segment < Math.min(segBatch + 3, segments); segment++) {
                    const angle1 = (segment / segments) * 2 * Math.PI;
                    const angle2 = ((segment + 1) / segments) * 2 * Math.PI;

                    const x1 = Math.floor(centerX + ringRadius * Math.cos(angle1));
                    const y1 = Math.floor(centerY + ringRadius * Math.sin(angle1));
                    const x2 = Math.floor(centerX + ringRadius * Math.cos(angle2));
                    const y2 = Math.floor(centerY + ringRadius * Math.sin(angle2));

                    const color = ring < 2 ? '#FF6600' : '#CC0000';
                    const thickness = Math.max(1, fadeIntensity * 4);

                    const r = parseInt(color.substr(1, 2), 16);
                    const g = parseInt(color.substr(3, 2), 16);
                    const b = parseInt(color.substr(5, 2), 16);
                    const fadedColor = `rgba(${r}, ${g}, ${b}, ${fadeIntensity})`;

                    sendDrawCommand(x1, y1, x2, y2, fadedColor, thickness);

                    // Micro-delay entre segmentos
                    await new Promise(resolve => setTimeout(resolve, 20)); // 20ms por segmento
                    if (stopSignal) return;
                }

                // Delay entre batches de segmentos[5]
                await new Promise(resolve => setTimeout(resolve, 35)); // 35ms entre grupos de 3 segmentos
                if (stopSignal) return;
            }

            // Delay entre anillos de fade
            await new Promise(resolve => setTimeout(resolve, 50)); // 50ms entre anillos
            if (stopSignal) return;
        }

        await new Promise(resolve => setTimeout(resolve, 120)); // Era 70ms, ahora 120ms
    }
    console.log('fireAuraFadeOut: Desvanecimiento ultra optimizado completado.');
}

    // Efecto: Disparo de Pistola (pistola en jugador propio, disparo al objetivo)
    async function pistolShootEffect(targetPlayerId) {
        if (stopSignal) { console.log('pistolShootEffect detenida.'); return; }
        console.log(`pistolShootEffect: Iniciando efecto - pistola en jugador propio, disparando a ${targetPlayerId}...`);

        const ownPlayerId = getOwnPlayerId(); // Obtener el ID del jugador propio
        if (!ownPlayerId) {
            console.warn('pistolShootEffect: No se pudo encontrar tu jugador propio.');
            return;
        }

        const ownAvatar = document.querySelector(`.spawnedavatar[data-playerid="${ownPlayerId}"]`);
        if (!ownAvatar) {
            console.warn('pistolShootEffect: Tu avatar no está visible en el canvas.');
            return;
        }

        const targetAvatar = document.querySelector(`.spawnedavatar[data-playerid="${targetPlayerId}"]`);
        if (!targetAvatar) {
            console.warn('pistolShootEffect: Avatar objetivo no encontrado.');
            return;
        }

        // Calcula el punto de "agarre derecho" para la pistola en el jugador propio
        const pistolAttachPoint = _getAttachmentPoint(ownPlayerId, 'grip_right');
        if (!pistolAttachPoint) { console.warn('pistolShootEffect: No se pudo determinar el punto de agarre de la pistola.'); return; }

        // Offset para la boca del cañón de la pistola, asumiendo orientación "derecha"
        const muzzleOffsetX = 47; // Desplazamiento horizontal desde el punto de agarre
        const muzzleOffsetY = -18; // Desplazamiento vertical para que quede por encima de la mano

        const muzzleX = pistolAttachPoint.x + muzzleOffsetX;
        const muzzleY = pistolAttachPoint.y + muzzleOffsetY;

        console.log('pistolShootEffect: Dibujando pistola en tu jugador...');
        // Dibuja la pistola en tu jugador, forzando la posición y orientación para el JSON
        await drawJsonCommands(ownPlayerId, PISTOLA_JSON_URL, 'grip_right', 'right', 1.0);
        if (stopSignal) return;

        if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
            console.log('pistolShootEffect: Interrumpido antes del disparo.');
            return;
        }

        console.log('pistolShootEffect: Pistola dibujada. Esperando 0.8s para disparar...');
        await new Promise(r => setTimeout(r, 800));
        if (stopSignal) return;

        // Obtener coordenadas del OBJETIVO (no de tu jugador)
        const targetCoords = getTargetCoords(targetPlayerId);
        if (!targetCoords) {
            console.warn('pistolShootEffect: Objetivo desaparecido, no se puede disparar.');
            return;
        }

        console.log(`pistolShootEffect: Disparando desde tu jugador (${muzzleX}, ${muzzleY}) hacia objetivo (${targetCoords.x}, ${targetCoords.y})`);
        await fireBullet(muzzleX, muzzleY, targetCoords.x, targetCoords.y);
        console.log('pistolShootEffect: Disparo completado.');
    }


    // Función para animar la bala desde la pistola hasta el objetivo
    async function fireBullet(startX, startY, targetX, targetY) {
        if (stopSignal) { console.log('fireBullet detenida.'); return; }
        console.log(`fireBullet: Iniciando bala de (${startX}, ${startY}) a (${targetX}, ${targetY})...`);

        const bulletSteps = 25;
        const bulletSpeed = 1 / bulletSteps;

        const bulletColor = '#FFD700';  // Dorado para la bala
        const trailColor = '#FFA500';   // Naranja para la estela

        for (let step = 0; step <= bulletSteps; step++) {
            if (stopSignal) { console.log('fireBullet detenida en bucle.'); return; }
            if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
                console.log('fireBullet: Disparo de bala interrumpido.');
                break;
            }

            const progress = step * bulletSpeed;

            const bulletX = startX + (targetX - startX) * progress;
            const bulletY = startY + (targetY - startY) * progress;

            const bulletSize = 3;
            sendDrawCommand(
                bulletX - bulletSize, bulletY - bulletSize,
                bulletX + bulletSize, bulletY + bulletSize,
                bulletColor, 4
            );

            if (step > 0) {
                const prevProgress = (step - 1) * bulletSpeed;
                const prevBulletX = startX + (targetX - startX) * prevProgress;
                const prevBulletY = startY + (targetY - startY) * prevProgress;

                sendDrawCommand(prevBulletX, prevBulletY, bulletX, bulletY, trailColor, 2);
            }

            await new Promise(resolve => setTimeout(resolve, 30));
        }

        if (socket && !stopSignal && !(repeatIntervalId && !repeatActionToggle.checked)) {
            await bulletImpact(targetX, targetY);
        }
        console.log('fireBullet: Bala finalizada.');
    }

    async function muzzleFlash(x, y) {
        if (stopSignal) { console.log('muzzleFlash detenida.'); return; }
        const flashSteps = 8;
        const flashRadius = 20;

        const flashColors = ['#FFFF00', '#FFA500', '#FF4500', '#FF6347'];

        console.log(`muzzleFlash: Creando fogonazo en (${x}, ${y})`);

        for (let step = 0; step < flashSteps; step++) {
            if (stopSignal) { console.log('muzzleFlash detenida en bucle.'); return; }
            if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) break;

            const progress = step / flashSteps;
            const currentRadius = flashRadius * (1 - progress * 0.7);
            const flashIntensity = 1 - progress;

            const rayCount = 6;
            for (let ray = 0; ray < rayCount; ray++) {
                const angle = (ray / rayCount) * 2 * Math.PI + Math.random() * 0.5;
                const rayLength = currentRadius + Math.random() * 10;

                const endX = x + rayLength * Math.cos(angle);
                const endY = y + rayLength * Math.sin(angle);

                const colorIndex = Math.floor(Math.random() * flashColors.length);
                const color = flashColors[colorIndex];
                const thickness = Math.max(1, flashIntensity * 5);

                sendDrawCommand(x, y, endX, endY, color, thickness);
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        console.log('muzzleFlash: Fogonazo completado.');
    }

    async function bulletImpact(x, y) {
        if (stopSignal) { console.log('bulletImpact detenida.'); return; }
        const impactSteps = 15;
        const impactRadius = 25;
        const impactColors = ['#FF4500', '#FFD700', '#FF6347', '#FFA500'];

        console.log(`bulletImpact: Impacto de bala en (${x}, ${y})`);

        for (let step = 0; step < impactSteps; step++) {
            if (stopSignal) { console.log('bulletImpact detenida en bucle.'); return; }
            if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) break;

            const progress = step / impactSteps;
            const currentRadius = impactRadius * progress;
            const sparkCount = 8;

            for (let spark = 0; spark < sparkCount; spark++) {
                const angle = (spark / sparkCount) * 2 * Math.PI + Math.random() * 0.3;
                const sparkDistance = currentRadius + Math.random() * 15;

                const endX = x + sparkDistance * Math.cos(angle);
                const endY = y + sparkDistance * Math.sin(angle);

                const colorIndex = Math.floor(Math.random() * impactColors.length);
                const color = impactColors[colorIndex];
                const thickness = Math.max(1, 4 - progress * 3);

                sendDrawCommand(x, y, endX, endY, color, thickness);
            }
            await new Promise(resolve => setTimeout(resolve, 60));
        }
        console.log('bulletImpact: Impacto completado.');
    }


    // Efecto: Cohete Espacial Perseguidor
    async function spaceRocketChaser(targetPlayerId) {
        if (stopSignal) { console.log('spaceRocketChaser detenida.'); return; }
        console.log(`spaceRocketChaser: Iniciando efecto en ${targetPlayerId}...`);
        if (!socket) {
            console.warn('spaceRocketChaser: Socket no disponible.');
            return;
        }

        const cRect = canvas.getBoundingClientRect();

        const getTargetCoordsDynamic = () => { // Usar la versión dinámica para seguir al jugador
            const currentAvatar = document.querySelector(`.spawnedavatar[data-playerid="${targetPlayerId}"]`);
            if (!currentAvatar) return null;
            const currentARect = currentAvatar.getBoundingClientRect();
            return {
                x: Math.round((currentARect.left - cRect.left) + (currentARect.width / 2)),
                y: Math.round((currentARect.top - cRect.top) + (currentARect.height / 2))
            };
        };

        const spawnSides = [
            { x: 20, y: Math.round(Math.random() * canvas.height) },
            { x: Math.round(canvas.width - 20), y: Math.round(Math.random() * canvas.height) },
            { x: Math.round(Math.random() * canvas.width), y: 20 },
            { x: Math.round(Math.random() * canvas.width), y: Math.round(canvas.height - 20) }
        ];
        const spawnPoint = spawnSides[Math.floor(Math.random() * spawnSides.length)];

        let rocketX = spawnPoint.x;
        let rocketY = spawnPoint.y;

        const totalSteps = 80;
        const rocketSpeed = 0.08;

        for (let step = 0; step < totalSteps; step++) {
            if (stopSignal) { console.log('spaceRocketChaser detenida en bucle.'); return; }
            if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
                console.log('spaceRocketChaser: Detenido por interrupción.');
                break;
            }

            const targetCoords = getTargetCoordsDynamic(); // Usar la versión dinámica
            if (!targetCoords) {
                console.log('spaceRocketChaser: Objetivo desaparecido.');
                break;
            }

            const targetX = targetCoords.x;
            const targetY = targetCoords.y;

            const directionX = targetX - rocketX;
            const directionY = targetY - rocketY;
            const distance = Math.sqrt(directionX * directionX + directionY * directionY);

            if (distance < 15) {
                console.log('spaceRocketChaser: ¡Colisión detectada!');
                await rocketExplosion(rocketX, rocketY);
                return;
            }

            const normalizedX = directionX / distance;
            const normalizedY = directionY / distance;

            const nextX = rocketX + normalizedX * distance * rocketSpeed;
            const nextY = rocketY + normalizedY * distance * rocketSpeed;

            const angle = Math.atan2(directionY, directionX);

            await drawSpaceRocket(rocketX, rocketY, nextX, nextY, angle, step);
            if (stopSignal) return;

            rocketX = nextX;
            rocketY = nextY;

            const baseDelay = 45;
            const progress = step / totalSteps;
            const speedFactor = 1 + progress;
            await new Promise(resolve => setTimeout(resolve, baseDelay / speedFactor));
        }

        // Si no colisionó, explotar en la última posición conocida del objetivo
        if (socket && !stopSignal && !(repeatIntervalId && !repeatActionToggle.checked)) {
            const finalTarget = getTargetCoordsDynamic(); // Usar la versión dinámica
            if (finalTarget) {
                console.log('spaceRocketChaser: Camino completo. Iniciando explosión final...');
                await rocketExplosion(finalTarget.x, finalTarget.y);
            } else {
                console.warn('spaceRocketChaser: Objetivo no encontrado para la explosión final.');
            }
        }
        console.log('spaceRocketChaser: Efecto completado.');
    }

    async function drawSpaceRocket(currentX, currentY, nextX, nextY, angle, step) {
        if (stopSignal) return;
        const rocketSize = 12;
        const thrusterLength = 15;

        const rocketColors = {
            body: '#C0C0C0',
            nose: '#FF6B6B',
            thruster: '#FF4500',
            flame: '#FFD700'
        };

        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const noseX = nextX + cosA * rocketSize;
        const noseY = nextY + sinA * rocketSize;

        const bodyStartX = nextX - cosA * (rocketSize * 0.3);
        const bodyStartY = nextY - sinA * (rocketSize * 0.3);

        const perpX = -sinA * (rocketSize * 0.4);
        const perpY = cosA * (rocketSize * 0.4);

        const finLeft1X = bodyStartX + perpX;
        const finLeft1Y = bodyStartY + perpY;
        const finRight1X = bodyStartX - perpX;
        const finRight1Y = bodyStartY - perpY;

        const tailX = nextX - cosA * rocketSize;
        const tailY = nextY - sinA * rocketSize;

        sendDrawCommand(bodyStartX, bodyStartY, noseX, noseY, rocketColors.body, 4);
        sendDrawCommand(bodyStartX, bodyStartY, noseX, noseY, rocketColors.nose, 2);

        sendDrawCommand(bodyStartX, bodyStartY, finLeft1X, finLeft1Y, rocketColors.body, 2);
        sendDrawCommand(bodyStartX, bodyStartY, finRight1X, finRight1Y, rocketColors.body, 2);

        const flameIntensity = 0.7 + 0.3 * Math.sin(step * 0.3);
        if (flameIntensity > 0.8) {
            const flameLength = thrusterLength * flameIntensity;
            const flameEndX = tailX - cosA * flameLength;
            const flameEndY = tailY - sinA * flameLength;

            sendDrawCommand(tailX, tailY, flameEndX, flameEndY, rocketColors.flame, 3);

            const flame2X = flameEndX - cosA * 5 + perpX * 0.3;
            const flame2Y = flameEndY - sinA * 5 + perpY * 0.3;
            const flame3X = flameEndX - cosA * 5 - perpX * 0.3;
            const flame3Y = flameEndY - sinA * 5 - perpY * 0.3;

            sendDrawCommand(tailX, tailY, flame2X, flame2Y, rocketColors.thruster, 2);
            sendDrawCommand(tailX, tailY, flame3X, flame3Y, rocketColors.thruster, 2);
        }

        sendDrawCommand(currentX, currentY, nextX, nextY, '#87CEEB', 1);
    }

async function rocketExplosion(centerX, centerY) {
    if (stopSignal) { console.log('rocketExplosion detenida.'); return; }
    const explosionSteps = 20; // REDUCIDO de 30 a 20
    const maxRadius = 70; // REDUCIDO de 80 a 70

    // Coordenadas enteras para evitar sub-pixel rendering[3]
    centerX = Math.floor(centerX);
    centerY = Math.floor(centerY);

    console.log(`rocketExplosion: ¡Explosión ULTRA optimizada en (${centerX}, ${centerY})!`);

    // Pre-calcular ángulos para batch rendering[1]
    const fragmentsPerStep = 12; // REDUCIDO de 15 a 12
    const explosionColors = ['#FF4500', '#FFD700', '#FF6B6B']; // REDUCIDO de 5 a 3 colores
    const preCalculatedAngles = [];

    for (let i = 0; i < fragmentsPerStep; i++) {
        preCalculatedAngles.push((i / fragmentsPerStep) * 2 * Math.PI);
    }

    for (let step = 0; step < explosionSteps; step++) {
        if (stopSignal) { console.log('rocketExplosion detenida en bucle.'); return; }
        if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
            console.log('rocketExplosion: Detenida por interrupción.');
            break;
        }

        const progress = step / explosionSteps;
        const currentRadius = Math.floor(maxRadius * progress); // Coordenadas enteras[3]

        // ULTRA BATCH RENDERING: Una sola operación por color[1][2]
        for (let colorIdx = 0; colorIdx < explosionColors.length; colorIdx++) {
            if (stopSignal) return;
            const color = explosionColors[colorIdx];
            const commandBatch = [];

            // Preparar TODOS los comandos de este color antes de enviar[2]
            for (let fragment = 0; fragment < fragmentsPerStep; fragment++) {
                // Solo procesar fragmentos de este color
                if (fragment % explosionColors.length !== colorIdx) continue;

                const angle = preCalculatedAngles[fragment] + Math.random() * 0.3;
                const fragmentDistance = Math.floor(currentRadius + Math.random() * 20);

                const endX = Math.floor(centerX + fragmentDistance * Math.cos(angle));
                const endY = Math.floor(centerY + fragmentDistance * Math.sin(angle));

                const thickness = Math.max(1, Math.floor(6 - progress * 4));

                commandBatch.push({
                    startX: centerX,
                    startY: centerY,
                    endX,
                    endY,
                    thickness
                });
            }

            // BATCH: Enviar todos los comandos del mismo color juntos[1][4]
            commandBatch.forEach(cmd => {
                sendDrawCommand(cmd.startX, cmd.startY, cmd.endX, cmd.endY, color, cmd.thickness);
            });

            // Delay MÍNIMO entre colores
            if (colorIdx < explosionColors.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 25)); // 25ms entre colores
                if (stopSignal) return;
            }
        }

        // Chispas ULTRA REDUCIDAS - solo en pasos específicos[5]
        if (step % 4 === 0 && progress < 0.6) {
            const sparkCount = 3; // ULTRA REDUCIDO
            for (let spark = 0; spark < sparkCount; spark++) {
                const sparkAngle = (spark / sparkCount) * 2 * Math.PI;
                const sparkRadius = Math.floor(currentRadius * 1.1);
                const sparkX = Math.floor(centerX + sparkRadius * Math.cos(sparkAngle));
                const sparkY = Math.floor(centerY + sparkRadius * Math.sin(sparkAngle));

                const sparkEndX = Math.floor(sparkX + (Math.random() - 0.5) * 8);
                const sparkEndY = Math.floor(sparkY + (Math.random() - 0.5) * 8);

                sendDrawCommand(sparkX, sparkY, sparkEndX, sparkEndY, '#FFFF00', 1);
            }

            await new Promise(resolve => setTimeout(resolve, 30)); // Delay para chispas
            if (stopSignal) return;
        }

        // Delay ULTRA AUMENTADO para evitar sobrecarga[4]
        const baseDelay = 80 + progress * 40; // Era 40 + progress * 20
        await new Promise(resolve => setTimeout(resolve, Math.max(baseDelay, 100))); // Mínimo 100ms
    }

    // Flash final ULTRA SIMPLIFICADO
    if (!stopSignal) {
        await ultraSimplifiedFlash(centerX, centerY);
    }

    console.log('rocketExplosion: Explosión ULTRA optimizada completada.');
}

// Flash final ultra simplificado para evitar crashes
async function ultraSimplifiedFlash(centerX, centerY) {
    if (stopSignal) return;
    const flashSteps = 6; // ULTRA REDUCIDO de 8
    const flashColors = ['#FFFFFF', '#FFD700']; // Solo 2 colores

    for (let step = 0; step < flashSteps; step++) {
        if (stopSignal) return;
        if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) break;

        const progress = step / flashSteps;
        const intensity = 1 - progress;
        const flashRadius = Math.floor(50 * intensity); // Coordenadas enteras[3]

        // BATCH: Solo 1 color por step para máxima optimización[1]
        const color = flashColors[step % flashColors.length];
        const rayCount = 8; // REDUCIDO

        // Pre-calcular todos los rayos antes de enviar[2]
        const rayBatch = [];
        for (let ray = 0; ray < rayCount; ray++) {
            const rayAngle = (ray / rayCount) * 2 * Math.PI;
            const rayEndX = Math.floor(centerX + flashRadius * Math.cos(rayAngle));
            const rayEndY = Math.floor(centerY + flashRadius * Math.sin(rayAngle));

            rayBatch.push({ endX: rayEndX, endY: rayEndY });
        }

        // Enviar batch completo[4]
        rayBatch.forEach(ray => {
            sendDrawCommand(centerX, centerY, ray.endX, ray.endY, color, Math.max(1, 4 * intensity));
        });

        await new Promise(resolve => setTimeout(resolve, 120)); // DELAY ULTRA AUMENTADO
    }
}


    // Efecto: Flashlight Supernova
    async function flashlightStarChaser(targetPlayerId) {
        if (stopSignal) { console.log('flashlightStarChaser detenida.'); return; }
        console.log(`flashlightStarChaser: Iniciando efecto en ${targetPlayerId}...`);
        if (!socket) {
            console.warn('flashlightStarChaser: Socket no disponible.');
            return;
        }

        const cRect = canvas.getBoundingClientRect();

        const getTargetCoordsDynamic = () => { // Usar la versión dinámica para seguir al jugador
            const currentAvatar = document.querySelector(`.spawnedavatar[data-playerid="${targetPlayerId}"]`);
            if (!currentAvatar) return null;
            const currentARect = currentAvatar.getBoundingClientRect();
            return {
                x: Math.round((currentARect.left - cRect.left) + (currentARect.width / 2)),
                y: Math.round((currentARect.top - cRect.top) + (currentARect.height / 2))
            };
        };

        const spawnCorners = [
            { x: 30, y: 30 },
            { x: Math.round(canvas.width - 30), y: 30 },
            { x: 30, y: Math.round(canvas.height - 30) },
            { x: Math.round(canvas.width - 30), y: Math.round(canvas.height - 30) }
        ];

        const spawnPoint = spawnCorners[Math.floor(Math.random() * spawnCorners.length)];
        let starX = spawnPoint.x;
        let starY = spawnPoint.y;

        const totalSteps = 25; // Reducido significativamente
        const starSpeed = 0.2; // Más rápido para compensar
        const baseDelay = 110; // Más tiempo entre frames

        for (let step = 0; step < totalSteps; step++) {
            if (stopSignal) { console.log('flashlightStarChaser detenida en bucle.'); return; }
            if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
                console.log('flashlightStarChaser: Detenido por interrupción.');
                break;
            }

            const targetCoords = getTargetCoordsDynamic(); // Usar la versión dinámica
            if (!targetCoords) {
                console.log('flashlightStarChaser: Objetivo perdido.');
                break;
            }

            const directionX = targetCoords.x - starX;
            const directionY = targetCoords.y - starY;
            const distance = Math.sqrt(directionX * directionX + directionY * directionY);

            if (distance < 25) {
                console.log('flashlightStarChaser: ¡Colisión! Iniciando explosión optimizada...');
                await veryOptimizedExplosion(starX, starY);
                return;
            }

            const normalizedX = directionX / distance;
            const normalizedY = directionY / distance;

            starX = starX + normalizedX * distance * starSpeed;
            starY = starY + normalizedY * distance * starSpeed;

            await drawVeryOptimizedStar(starX, starY, step);
            if (stopSignal) return;

            const progress = step / totalSteps;
            const adaptiveDelay = baseDelay + (progress * 30);
            await new Promise(resolve => setTimeout(resolve, adaptiveDelay));
        }

        // Si no colisionó, explotar en la última posición conocida del objetivo
        if (socket && !stopSignal && !(repeatIntervalId && !repeatActionToggle.checked)) {
            const finalTarget = getTargetCoordsDynamic(); // Usar la versión dinámica
            if (finalTarget) {
                console.log('flashlightStarChaser: Camino completo. Iniciando explosión final...');
                await veryOptimizedExplosion(finalTarget.x, finalTarget.y);
            } else {
                console.warn('flashlightStarChaser: Objetivo no encontrado para la explosión final.');
            }
        }
        console.log('flashlightStarChaser: Efecto completado.');
    }

    async function drawVeryOptimizedStar(x, y, step) {
        if (stopSignal) return;
        const colors = ['#FFFFFF', '#9370DB', '#4169E1'];

        const coreSize = 6;
        sendDrawCommand(x - coreSize, y, x + coreSize, y, colors[0], 4);
        sendDrawCommand(x, y - coreSize, x, y + coreSize, colors[0], 4);

        const rayLength = 12;
        for (let ray = 0; ray < 3; ray++) {
            const angle = (ray / 3) * Math.PI * 2 + step * 0.15;
            const endX = x + rayLength * Math.cos(angle);
            const endY = y + rayLength * Math.sin(angle);
            sendDrawCommand(x, y, endX, endY, colors[1], 2);
        }

        const auraSize = 8;
        const auraAngle = step * 0.1;
        const auraX = x + auraSize * Math.cos(auraAngle);
        const auraY = y + auraSize * Math.sin(auraAngle);
        sendDrawCommand(x, y, auraX, auraY, colors[2], 1);
    }

    async function veryOptimizedExplosion(centerX, centerY) {
        if (stopSignal) { console.log('veryOptimizedExplosion detenida.'); return; }
        console.log(`veryOptimizedExplosion: Explosión en (${centerX}, ${centerY})`);

        await veryOptimizedFlash(centerX, centerY);
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) return;

        await veryOptimizedWave(centerX, centerY);
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) return;

        console.log('veryOptimizedExplosion: Explosión completada.');
    }

    async function veryOptimizedFlash(centerX, centerY) {
        if (stopSignal) return;
        const flashSteps = 5;
        const maxRadius = 35;
        const colors = ['#FFFFFF', '#E0E6FF'];

        for (let step = 0; step < flashSteps; step++) {
            if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;

            const progress = step / flashSteps;
            const radius = maxRadius * (1 - progress * 0.6);
            const intensity = 1 - progress;

            const rayCount = 6;
            for (let ray = 0; ray < rayCount; ray++) {
                const angle = (ray / rayCount) * 2 * Math.PI;
                const rayLength = radius * intensity;

                const endX = centerX + rayLength * Math.cos(angle);
                const endY = centerY + rayLength * Math.sin(angle);

                const color = colors[step % colors.length];
                const thickness = Math.max(1, intensity * 4);

                sendDrawCommand(centerX, centerY, endX, endY, color, thickness);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async function veryOptimizedWave(centerX, centerY) {
        if (stopSignal) return;
        const waveSteps = 10;
        const maxRadius = 70;
        const color = '#4169E1';

        for (let step = 0; step < waveSteps; step++) {
            if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;

            const progress = step / waveSteps;
            const waveRadius = maxRadius * progress;
            const intensity = 1 - progress;

            const segments = 8;
            for (let seg = 0; seg < segments; seg++) {
                const angle1 = (seg / segments) * 2 * Math.PI;
                const angle2 = ((seg + 1) / segments) * 2 * Math.PI;

                const x1 = centerX + waveRadius * Math.cos(angle1);
                const y1 = centerY + waveRadius * Math.sin(angle1);
                const x2 = centerX + waveRadius * Math.cos(angle2);
                const y2 = centerY + waveRadius * Math.sin(angle2);

                const thickness = Math.max(1, intensity * 3);
                sendDrawCommand(x1, y1, x2, y2, color, thickness);
            }
            await new Promise(resolve => setTimeout(resolve, 120));
        }
    }

    // Efecto: Arco y Flecha Perseguidor
    async function drawArrowChaser(targetPlayerId) {
        if (stopSignal) { console.log('drawArrowChaser detenida.'); return; }
        console.log(`drawArrowChaser: Iniciando efecto en ${targetPlayerId}.`);

        const ownPlayerId = getOwnPlayerId(); // Get own player ID
        if (!ownPlayerId) { console.warn('drawArrowChaser: No se pudo encontrar tu jugador propio.'); return; }

        await drawJsonCommands(ownPlayerId, ARCO_JSON_URL, 'grip_right', 'right', 1.0);
        if (stopSignal) return;

        const bowAttachPoint = _getAttachmentPoint(ownPlayerId, 'grip_right');
        if (!bowAttachPoint) { console.warn('drawArrowChaser: No se pudo determinar el punto de agarre del arco.'); return; }

        const arrowLaunchOffsetX = 50;
        const arrowLaunchOffsetY = 0;

        const arrowOrigin = {
            x: bowAttachPoint.x + arrowLaunchOffsetX,
            y: bowAttachPoint.y + arrowLaunchOffsetY
        };

        const totalSteps = 40;
        const arrowSpeedFactor = 0.1;
        const wobbleIntensity = 15;
        const arrowColor = '#A52A2A';
        const featherColor = '#FFFFFF';

        let currentX = arrowOrigin.x;
        let currentY = arrowOrigin.y;

        for (let step = 0; step < totalSteps; step++) {
            if (stopSignal) { console.log('drawArrowChaser detenida en bucle.'); return; }
            if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) {
                console.log('drawArrowChaser: Detenido por interrupción.'); break;
            }

            const targetCoords = getTargetCoords(targetPlayerId);
            if (!targetCoords) { console.log('drawArrowChaser: Objetivo perdido.'); break; }

            const directionX = targetCoords.x - currentX;
            const directionY = targetCoords.y - currentY;
            const dist = distance(currentX, currentY, targetCoords.x, targetCoords.y);

            if (dist < 15) {
                await bulletImpact(currentX, currentY);
                return;
            }

            const normalizedX = directionX / dist;
            const normalizedY = directionY / dist;

            const wobbleOffset = Math.sin(step * 0.8) * wobbleIntensity * (1 - step / totalSteps);
            const perpX = -normalizedY;
            const perpY = normalizedX;

            const nextX = currentX + normalizedX * dist * arrowSpeedFactor + perpX * wobbleOffset;
            const nextY = currentY + normalizedY * dist * arrowSpeedFactor + perpY * wobbleOffset;

            const angle = Math.atan2(directionY, directionX);

            await _drawArrow(currentX, currentY, nextX, nextY, angle, arrowColor, featherColor);
            if (stopSignal) return;

            currentX = nextX;
            currentY = nextY;

            await new Promise(resolve => setTimeout(resolve, 50));
        }

        const finalTarget = getTargetCoords(targetPlayerId);
        if (finalTarget && socket && !stopSignal && !(repeatIntervalId && !repeatActionToggle.checked)) {
            await bulletImpact(finalTarget.x, finalTarget.y);
        }
        console.log('drawArrowChaser: Efecto completado.');
    }

    // Dibuja una flecha (segmento principal y plumas simplificadas)
    async function _drawArrow(x1, y1, x2, y2, angle, color, featherColor) {
        if (stopSignal) return;
        const arrowHeadLength = 10;
        const featherLength = 8;
        const featherAngleOffset = Math.PI / 6;

        sendDrawCommand(x1, y1, x2, y2, color, 2);

        const tipX1 = x2 - arrowHeadLength * Math.cos(angle - Math.PI / 6);
        const tipY1 = y2 - arrowHeadLength * Math.sin(angle - Math.PI / 6);
        const tipX2 = x2 - arrowHeadLength * Math.cos(angle + Math.PI / 6);
        const tipY2 = y2 - arrowHeadLength * Math.sin(angle + Math.PI / 6);

        sendDrawCommand(x2, y2, tipX1, tipY1, color, 2);
        sendDrawCommand(x2, y2, tipX2, tipY2, color, 2);

        const tailX = x1 - (Math.cos(angle) * 5);
        const tailY = y1 - (Math.sin(angle) * 5);

        const feather1X = tailX - featherLength * Math.cos(angle + featherAngleOffset);
        const feather1Y = tailY - featherLength * Math.sin(angle + featherAngleOffset);
        const feather2X = tailX - featherLength * Math.cos(angle - featherAngleOffset);
        const feather2Y = tailY - featherLength * Math.sin(angle - featherAngleOffset);

        sendDrawCommand(tailX, tailY, feather1X, feather1Y, featherColor, 1);
        sendDrawCommand(tailX, tailY, feather2X, feather2Y, featherColor, 1);
    }

// Efecto: Escopeta - Portal Mágico (ULTRA DELAYS para servidor)
async function drawShotgunBlast(targetPlayerId) {
    if (stopSignal) { console.log('drawShotgunBlast detenida.'); return; }
    console.log(`drawShotgunBlast: Iniciando portal mágico en ${targetPlayerId}.`);

    const ownPlayerId = getOwnPlayerId();
    if (!ownPlayerId) { console.warn('drawShotgunBlast: No se pudo encontrar tu jugador propio.'); return; }

    await drawJsonCommands(ownPlayerId, ESCOPETA_JSON_URL, 'grip_right', 'right', 1.0);
    if (stopSignal) return;

    await new Promise(resolve => setTimeout(resolve, 300));
    if (stopSignal) return;

    const shotgunAttachPoint = _getAttachmentPoint(ownPlayerId, 'grip_right');
    if (!shotgunAttachPoint) { console.warn('drawShotgunBlast: No se pudo determinar el punto de agarre de la escopeta.'); return; }

    const portalCenter = {
        x: shotgunAttachPoint.x + 80,
        y: shotgunAttachPoint.y + -20
    };

    const targetCoords = getTargetCoords(targetPlayerId);
    if (!targetCoords) { console.warn('drawShotgunBlast: No se pudo determinar el objetivo.'); return; }

    console.log('drawShotgunBlast: Abriendo portal dimensional...');

    await openMagicPortalUltraDelayed(portalCenter.x, portalCenter.y);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    if (stopSignal) return;
    await launchMagicProjectilesUltraDelayed(portalCenter, targetCoords);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    if (stopSignal) return;
    await closeMagicPortalUltraDelayed(portalCenter.x, portalCenter.y);

    console.log('drawShotgunBlast: Portal mágico completado.');
}

// Abrir portal con ULTRA delays
async function openMagicPortalUltraDelayed(centerX, centerY) {
    if (stopSignal) return;
    const openingSteps = 20;
    const maxRadius = 50;
    const portalColors = ['#9400D3', '#4B0082', '#8A2BE2', '#9932CC'];
    const starColors = ['#FFD700', '#FFFFFF', '#00FFFF'];

    centerX = Math.floor(centerX);
    centerY = Math.floor(centerY);

    for (let step = 0; step < openingSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;

        const progress = step / openingSteps;
        const currentRadius = maxRadius * Math.sin((progress * Math.PI) / 2);

        for (let colorIdx = 0; colorIdx < portalColors.length; colorIdx += 2) {
            if (stopSignal) return;
            const ringSegments = 16;
            for (let segBatch = 0; segBatch < ringSegments; segBatch += 4) {
                if (stopSignal) return;
                for (let seg = segBatch; seg < Math.min(segBatch + 4, ringSegments); seg++) {
                    if (Math.floor((seg + step) % portalColors.length) !== colorIdx) continue;
                    const angle1 = (seg / ringSegments) * 2 * Math.PI + step * 0.1;
                    const angle2 = ((seg + 1) / ringSegments) * 2 * Math.PI + step * 0.1;
                    const x1 = Math.floor(centerX + currentRadius * Math.cos(angle1));
                    const y1 = Math.floor(centerY + currentRadius * Math.sin(angle1) * 0.7);
                    const x2 = Math.floor(centerX + currentRadius * Math.cos(angle2));
                    const y2 = Math.floor(centerY + currentRadius * Math.sin(angle2) * 0.7);
                    const thickness = Math.max(2, 6 - progress * 2);
                    sendDrawCommand(x1, y1, x2, y2, portalColors[colorIdx], thickness);
                }
                await new Promise(resolve => setTimeout(resolve, 15));
                if (stopSignal) return;
            }
            await new Promise(resolve => setTimeout(resolve, 25));
            if (stopSignal) return;
        }

        if (step > 5) {
            const energyLines = 8;
            for (let lineBatch = 0; lineBatch < energyLines; lineBatch += 2) {
                if (stopSignal) return;
                for (let line = lineBatch; line < Math.min(lineBatch + 2, energyLines); line++) {
                    const angle = (line / energyLines) * 2 * Math.PI + Math.random() * 0.3;
                    const startRadius = currentRadius * 1.2;
                    const endRadius = currentRadius * 0.3;
                    const startX = Math.floor(centerX + startRadius * Math.cos(angle));
                    const startY = Math.floor(centerY + startRadius * Math.sin(angle) * 0.7);
                    const endX = Math.floor(centerX + endRadius * Math.cos(angle));
                    const endY = Math.floor(centerY + endRadius * Math.sin(angle) * 0.7);
                    const color = starColors[Math.floor(Math.random() * starColors.length)];
                    sendDrawCommand(startX, startY, endX, endY, color, 2);
                }
                await new Promise(resolve => setTimeout(resolve, 20));
                if (stopSignal) return;
            }
        }

        for (let particle = 0; particle < 3; particle++) {
            if (stopSignal) return;
            const particleAngle = Math.random() * 2 * Math.PI;
            const particleRadius = currentRadius * (0.8 + Math.random() * 0.4);
            const px = Math.floor(centerX + particleRadius * Math.cos(particleAngle));
            const py = Math.floor(centerY + particleRadius * Math.sin(particleAngle) * 0.7);
            sendDrawCommand(px - 2, py - 2, px + 2, py + 2, '#FFD700', 2);
            if (particle < 2) {
                await new Promise(resolve => setTimeout(resolve, 10));
                if (stopSignal) return;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 150));
    }
}

// Proyectiles con delays ULTRA aumentados
async function launchMagicProjectilesUltraDelayed(portalCenter, targetCoords) {
    if (stopSignal) return;
    const numProjectiles = 5;
    const projectileColors = ['#FF1493', '#00CED1', '#32CD32', '#FFD700', '#FF69B4'];

    for (let i = 0; i < numProjectiles; i++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        console.log(`Lanzando proyectil ${i + 1}/${numProjectiles}`);
        await launchSingleMagicProjectileUltraDelayed(portalCenter, targetCoords, projectileColors[i], i);
        if (stopSignal) return;
        await new Promise(resolve => setTimeout(resolve, 400));
    }
}

// Proyectil individual ULTRA ralentizado
async function launchSingleMagicProjectileUltraDelayed(startPoint, targetCoords, color, index) {
    if (stopSignal) return;
    const totalSteps = 25;
    const sparkTrail = [];
    const offsetAngle = (index - 2) * 0.3;
    const curveIntensity = 30;

    let currentX = Math.floor(startPoint.x);
    let currentY = Math.floor(startPoint.y);

    for (let step = 0; step < totalSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;

        const progress = step / totalSteps;
        const baseX = startPoint.x + (targetCoords.x - startPoint.x) * progress;
        const baseY = startPoint.y + (targetCoords.y - startPoint.y) * progress;
        const curve = Math.sin(progress * Math.PI) * curveIntensity;
        const nextX = Math.floor(baseX + Math.cos(offsetAngle) * curve);
        const nextY = Math.floor(baseY + Math.sin(offsetAngle) * curve - curve * 0.5);

        sendDrawCommand(currentX, currentY, nextX, nextY, color, 4);
        await new Promise(resolve => setTimeout(resolve, 15));
        if (stopSignal) return;

        const auraRadius = 8;
        const auraSpokes = 6;
        for (let spokeBatch = 0; spokeBatch < auraSpokes; spokeBatch += 2) {
            if (stopSignal) return;
            for (let spoke = spokeBatch; spoke < Math.min(spokeBatch + 2, auraSpokes); spoke++) {
                const spokeAngle = (spoke / auraSpokes) * 2 * Math.PI + step * 0.2;
                const auraX = Math.floor(nextX + auraRadius * Math.cos(spokeAngle));
                const auraY = Math.floor(nextY + auraRadius * Math.sin(spokeAngle));
                sendDrawCommand(nextX, nextY, auraX, auraY, color, 1);
            }
            await new Promise(resolve => setTimeout(resolve, 8));
            if (stopSignal) return;
        }

        sparkTrail.push({ x: nextX, y: nextY, life: 1.0 });
        if (sparkTrail.length > 8) sparkTrail.shift();
        const trailBatch = 4;
        for (let t = 0; t < sparkTrail.length; t += trailBatch) {
            if (stopSignal) return;
            for (let idx = t; idx < Math.min(t + trailBatch, sparkTrail.length); idx++) {
                const spark = sparkTrail[idx];
                const trailIntensity = spark.life * (idx / sparkTrail.length);
                if (trailIntensity > 0.3) {
                    sendDrawCommand(spark.x - 1, spark.y - 1, spark.x + 1, spark.y + 1, color, Math.max(1, 3 * trailIntensity));
                }
                spark.life -= 0.1;
            }
            if (t + trailBatch < sparkTrail.length) {
                await new Promise(resolve => setTimeout(resolve, 5));
                if (stopSignal) return;
            }
        }
        currentX = nextX;
        currentY = nextY;
        await new Promise(resolve => setTimeout(resolve, 85));
    }
    if (!stopSignal) await magicImpactBurstUltraDelayed(currentX, currentY, color);
}

// Impacto ULTRA ralentizado
async function magicImpactBurstUltraDelayed(x, y, color) {
    if (stopSignal) return;
    const burstSteps = 10;
    const burstRadius = 25;
    x = Math.floor(x);
    y = Math.floor(y);

    for (let step = 0; step < burstSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / burstSteps;
        const currentRadius = burstRadius * progress;
        const intensity = 1 - progress;
        const sparkCount = 8;
        for (let spark = 0; spark < sparkCount; spark++) {
            if (stopSignal) return;
            const angle = (spark / sparkCount) * 2 * Math.PI + Math.random() * 0.5;
            const sparkDistance = currentRadius + Math.random() * 10;
            const endX = Math.floor(x + sparkDistance * Math.cos(angle));
            const endY = Math.floor(y + sparkDistance * Math.sin(angle));
            sendDrawCommand(x, y, endX, endY, color, Math.max(1, 3 * intensity));
            await new Promise(resolve => setTimeout(resolve, 12));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Cierre ULTRA ralentizado
async function closeMagicPortalUltraDelayed(centerX, centerY) {
    if (stopSignal) return;
    const closingSteps = 15;
    const startRadius = 50;
    centerX = Math.floor(centerX);
    centerY = Math.floor(centerY);

    for (let step = 0; step < closingSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / closingSteps;
        const currentRadius = startRadius * (1 - progress);
        const intensity = 1 - progress;
        const implosionLines = 12;
        for (let lineBatch = 0; lineBatch < implosionLines; lineBatch += 3) {
            if (stopSignal) return;
            for (let line = lineBatch; line < Math.min(lineBatch + 3, implosionLines); line++) {
                const angle = (line / implosionLines) * 2 * Math.PI;
                const startX = Math.floor(centerX + currentRadius * Math.cos(angle));
                const startY = Math.floor(centerY + currentRadius * Math.sin(angle) * 0.7);
                const endRadius = currentRadius * 0.3;
                const endX = Math.floor(centerX + endRadius * Math.cos(angle));
                const endY = Math.floor(centerY + endRadius * Math.sin(angle) * 0.7);
                sendDrawCommand(startX, startY, endX, endY, '#9400D3', Math.max(1, 4 * intensity));
            }
            await new Promise(resolve => setTimeout(resolve, 30));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 180));
    }
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    if (stopSignal) return;
    sendDrawCommand(centerX - 15, centerY, centerX + 15, centerY, '#FFFFFF', 6);
    await new Promise(resolve => setTimeout(resolve, 100));
    if (stopSignal) return;
    sendDrawCommand(centerX, centerY - 15, centerX, centerY + 15, '#FFFFFF', 6);
}

// Proyectiles optimizados
async function launchMagicProjectilesOptimized(portalCenter, targetCoords) {
    if (stopSignal) return;
    const numProjectiles = 3;
    const projectileColors = ['#FF1493', '#00CED1', '#FFD700'];

    for (let i = 0; i < numProjectiles; i++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        await launchSingleMagicProjectileOptimized(portalCenter, targetCoords, projectileColors[i], i);
        if (stopSignal) return;
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

// Proyectil individual optimizado
async function launchSingleMagicProjectileOptimized(startPoint, targetCoords, color, index) {
    if (stopSignal) return;
    const totalSteps = 15;
    const curveIntensity = 20;
    let currentX = startPoint.x;
    let currentY = startPoint.y;

    for (let step = 0; step < totalSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / totalSteps;
        const offsetAngle = (index - 1) * 0.4;
        const baseX = startPoint.x + (targetCoords.x - startPoint.x) * progress;
        const baseY = startPoint.y + (targetCoords.y - startPoint.y) * progress;
        const curve = Math.sin(progress * Math.PI) * curveIntensity;
        const nextX = baseX + Math.cos(offsetAngle) * curve;
        const nextY = baseY - curve * 0.3;

        sendDrawCommand(currentX, currentY, nextX, nextY, color, 3);

        if (step % 2 === 0) {
            const auraRadius = 6;
            const auraSpokes = 3;
            for (let spoke = 0; spoke < auraSpokes; spoke++) {
                const spokeAngle = (spoke / auraSpokes) * 2 * Math.PI;
                const auraX = nextX + auraRadius * Math.cos(spokeAngle);
                const auraY = nextY + auraRadius * Math.sin(spokeAngle);
                sendDrawCommand(nextX, nextY, auraX, auraY, color, 1);
            }
        }
        currentX = nextX;
        currentY = nextY;
        await new Promise(resolve => setTimeout(resolve, 70));
    }
    if (!stopSignal) await magicImpactBurstOptimized(currentX, currentY, color);
}

// Impacto optimizado
async function magicImpactBurstOptimized(x, y, color) {
    if (stopSignal) return;
    const burstSteps = 6;
    const burstRadius = 20;

    for (let step = 0; step < burstSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / burstSteps;
        const currentRadius = burstRadius * progress;
        const intensity = 1 - progress;
        const sparkCount = 4;
        for (let spark = 0; spark < sparkCount; spark++) {
            const angle = (spark / sparkCount) * 2 * Math.PI;
            const sparkDistance = currentRadius + Math.random() * 8;
            const endX = x + sparkDistance * Math.cos(angle);
            const endY = y + sparkDistance * Math.sin(angle);
            sendDrawCommand(x, y, endX, endY, color, Math.max(1, 2 * intensity));
        }
        await new Promise(resolve => setTimeout(resolve, 80));
    }
}

// Cierre optimizado del portal
async function closeMagicPortalOptimized(centerX, centerY) {
    if (stopSignal) return;
    const closingSteps = 8;
    const startRadius = 40;

    for (let step = 0; step < closingSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / closingSteps;
        const currentRadius = startRadius * (1 - progress);
        const intensity = 1 - progress;
        const implosionLines = 6;
        for (let line = 0; line < implosionLines; line++) {
            const angle = (line / implosionLines) * 2 * Math.PI;
            const startX = centerX + currentRadius * Math.cos(angle);
            const startY = centerY + currentRadius * Math.sin(angle) * 0.7;
            sendDrawCommand(startX, startY, centerX, centerY, '#9400D3', Math.max(1, 3 * intensity));
        }
        await new Promise(resolve => setTimeout(resolve, 120));
    }
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 300));
    if (stopSignal) return;
    sendDrawCommand(centerX - 10, centerY, centerX + 10, centerY, '#FFFFFF', 4);
    sendDrawCommand(centerX, centerY - 10, centerX, centerY + 10, '#FFFFFF', 4);
}


    // Efecto: Lanzagranadas (Arco + Explosión Retardada)
    async function drawGrenadeLauncher(targetPlayerId) {
        if (stopSignal) { console.log('drawGrenadeLauncher detenida.'); return; }
        console.log(`drawGrenadeLauncher: Iniciando efecto en ${targetPlayerId}.`);

        const ownPlayerId = getOwnPlayerId();
        if (!ownPlayerId) { console.warn('drawGrenadeLauncher: No se pudo encontrar tu jugador propio.'); return; }

        await drawJsonCommands(ownPlayerId, LANZAGRANADAS_JSON_URL, 'grip_right', 'right', 1.0);
        if (stopSignal) return;

        const launcherAttachPoint = _getAttachmentPoint(ownPlayerId, 'grip_right');
        if (!launcherAttachPoint) { console.warn('drawGrenadeLauncher: No se pudo determinar el punto de agarre del lanzagranadas.'); return; }

        const launchPoint = {
            x: launcherAttachPoint.x + 40,
            y: launcherAttachPoint.y - 20
        };

        const targetCoords = getTargetCoords(targetPlayerId);
        if (!launchPoint || !targetCoords) { console.warn('drawGrenadeLauncher: No se pudo determinar el punto de lanzamiento.'); return; }

        const grenadeColor = '#6A5ACD';
        const arcHeight = 80;
        const totalFrames = 40;
        const fuseTimeMs = 2000;

        let grenadeX = launchPoint.x;
        let grenadeY = launchPoint.y;

        console.log('drawGrenadeLauncher: Lanzando granada...');
        for (let frame = 0; frame < totalFrames; frame++) {
            if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
            const progress = frame / totalFrames;
            const nextX = launchPoint.x + (targetCoords.x - launchPoint.x) * progress;
            const nextY = launchPoint.y + (targetCoords.y - launchPoint.y) * progress - arcHeight * Math.sin(Math.PI * progress);
            sendDrawCommand(grenadeX, grenadeY, nextX, nextY, grenadeColor, 3);
            grenadeX = nextX;
            grenadeY = nextY;
            await new Promise(resolve => setTimeout(resolve, 40));
        }
        if (stopSignal) return;
        await new Promise(resolve => setTimeout(resolve, fuseTimeMs));
        if (stopSignal) return;

        if (socket && !(repeatIntervalId && !repeatActionToggle.checked)) {
            await explosionBlast(grenadeX, grenadeY, 1.5);
        }
        console.log('drawGrenadeLauncher: Granada explotada.');
    }

async function blueMuzzleBall(x, y) {
    if (stopSignal) return;
    const steps = 8;
    const maxRadius = 20;
    const colors = ['#87CEEB', '#ADD8E6', '#00BFFF', '#1E90FF'];

    for (let step = 0; step < steps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / steps;
        const currentRadius = maxRadius * Math.sin(Math.PI * progress);
        const intensity = 1 - progress;
        const coreRays = 8;
        for (let ray = 0; ray < coreRays; ray++) {
            const angle = (ray / coreRays) * 2 * Math.PI;
            const rayLength = currentRadius * intensity;
            const endX = x + rayLength * Math.cos(angle);
            const endY = y + rayLength * Math.sin(angle);
            const color = colors[Math.min(step, colors.length - 1)];
            const thickness = Math.max(1, 16 * intensity);
            sendDrawCommand(x, y, endX, endY, color, thickness);
        }
        const crossSize = currentRadius * 0.8;
        sendDrawCommand(x - crossSize, y, x + crossSize, y, '#FFFFFF', Math.max(1, 4 * intensity));
        sendDrawCommand(x, y - crossSize, x, y + crossSize, '#FFFFFF', Math.max(1, 4 * intensity));
        await new Promise(resolve => setTimeout(resolve, 40));
    }
}


    // Efecto: Rifle Láser Perforante
    async function drawLaserRifleBeam(targetPlayerId) {
        if (stopSignal) { console.log('drawLaserRifleBeam detenida.'); return; }
        console.log(`drawLaserRifleBeam: Iniciando efecto en ${targetPlayerId}.`);

        const ownPlayerId = getOwnPlayerId();
        if (!ownPlayerId) { console.warn('drawLaserRifleBeam: No se pudo encontrar tu jugador propio.'); return; }

        await drawJsonCommands(ownPlayerId, RIFLE_JSON_URL, 'grip_right', 'right', 1.0);
        if (stopSignal) return;

        const rifleAttachPoint = _getAttachmentPoint(ownPlayerId, 'grip_right');
        if (!rifleAttachPoint) { console.warn('drawLaserRifleBeam: No se pudo determinar el punto de agarre del rifle.'); return; }

        const barrelTip = {
            x: rifleAttachPoint.x + 60,
            y: rifleAttachPoint.y - 16
        };

        const targetCoords = getTargetCoords(targetPlayerId);
        if (!barrelTip || !targetCoords) { console.warn('drawLaserRifleBeam: No se pudo determinar orígen/objetivo.'); return; }

        console.log('drawLaserRifleBeam: Generando fogonazo azul...');
        await blueMuzzleBall(barrelTip.x, barrelTip.y);
        if (stopSignal) return;

        await new Promise(resolve => setTimeout(resolve, 100));
        if (stopSignal) return;

        const laserColorCore = '#FFFFFF';
        const laserColorFringe = '#00FFFF';
        const laserThickness = 6;
        const laserDurationFrames = 15;

        console.log('drawLaserRifleBeam: Disparando láser...');
        for (let frame = 0; frame < laserDurationFrames; frame++) {
            if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
            sendDrawCommand(barrelTip.x, barrelTip.y, targetCoords.x, targetCoords.y, laserColorCore, laserThickness);
            sendDrawCommand(barrelTip.x, barrelTip.y, targetCoords.x, targetCoords.y, laserColorFringe, laserThickness * 1.5);
            for (let i = 0; i < 3; i++) {
                const progress = Math.random();
                const sparkX = barrelTip.x + (targetCoords.x - barrelTip.x) * progress + (Math.random() - 0.5) * 5;
                const sparkY = barrelTip.y + (targetCoords.y - barrelTip.y) * progress + (Math.random() - 0.5) * 5;
                sendDrawCommand(sparkX, sparkY, sparkX + 1, sparkY + 1, '#FFD700', 1);
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        console.log('drawLaserRifleBeam: Láser disparado.');
    }

    // Efecto: Búmeran (Guiado)
    async function drawBoomerangGuided(targetPlayerId) {
        if (stopSignal) { console.log('drawBoomerangGuided detenida.'); return; }
        console.log(`drawBoomerangGuided: Iniciando efecto en ${targetPlayerId}.`);

        const ownPlayerId = getOwnPlayerId();
        if (!ownPlayerId) { console.warn('drawBoomerangGuided: No se pudo encontrar tu jugador propio.'); return; }

        await drawJsonCommands(ownPlayerId, BOOMERANG_JSON_URL, 'grip_right', 'none', 1.0);
        if (stopSignal) return;

        const boomerangAttachPoint = _getAttachmentPoint(ownPlayerId, 'grip_right');
        if (!boomerangAttachPoint) { console.warn('drawBoomerangGuided: No se pudo determinar el punto de agarre del bumerán.'); return; }

        const startPoint = {
            x: boomerangAttachPoint.x + 40,
            y: boomerangAttachPoint.y - 5
        };

        const targetCoords = getTargetCoords(targetPlayerId);
        if (!startPoint || !targetCoords) { console.warn('drawBoomerangGuided: No se pudo determinar orígen/objetivo.'); return; }

        const controlPointOffset = 100;
        const totalFrames = 60;
        const spinSpeed = 0.2;
        const boomerangColor = '#8B4513';
        const trailColor = '#D2B48C';
        let boomerangAngle = 0;

        console.log('drawBoomerangGuided: Lanzando bumerán...');
        for (let frame = 0; frame < totalFrames; frame++) {
            if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;

            const progress = frame / totalFrames;
            const curveFactor = Math.sin(Math.PI * progress);

            let currentTargetX = (progress < 0.5) ? targetCoords.x : startPoint.x;
            let currentTargetY = (progress < 0.5) ? targetCoords.y : startPoint.y;

            const t = progress;
            const mt = 1 - t;
            const controlX = startPoint.x + (targetCoords.x - startPoint.x) / 2 + controlPointOffset * curveFactor * Math.cos(boomerangAngle * 2);
            const controlY = startPoint.y + (targetCoords.y - startPoint.y) / 2 + controlPointOffset * curveFactor * Math.sin(boomerangAngle * 2);
            const boomerangX = mt * mt * startPoint.x + 2 * mt * t * controlX + t * t * currentTargetX;
            const boomerangY = mt * mt * startPoint.y + 2 * mt * t * controlY + t * t * currentTargetY;

            boomerangAngle += spinSpeed;
            await _drawBoomerangShape(boomerangX, boomerangY, boomerangAngle, boomerangColor);
            if (stopSignal) return;

            if (frame > 0) {
                const prevProgress = (frame - 1) / totalFrames;
                const prevControlX = startPoint.x + (targetCoords.x - startPoint.x) / 2 + controlPointOffset * Math.sin(Math.PI * prevProgress) * Math.cos((boomerangAngle - spinSpeed) * 2);
                const prevControlY = startPoint.y + (targetCoords.y - startPoint.y) / 2 + controlPointOffset * Math.sin(Math.PI * prevProgress) * Math.sin((boomerangAngle - spinSpeed) * 2);
                const prevBoomerangX = (1 - prevProgress) * ((1 - prevProgress) * startPoint.x + prevProgress * prevControlX) + prevProgress * ((1 - prevProgress) * prevControlX + prevProgress * (prevProgress < 0.5 ? targetCoords.x : startPoint.x));
                const prevBoomerangY = (1 - prevProgress) * ((1 - prevProgress) * startPoint.y + prevProgress * prevControlY) + prevProgress * ((1 - prevProgress) * prevControlY + prevProgress * (prevProgress < 0.5 ? targetCoords.y : startPoint.y));
                sendDrawCommand(prevBoomerangX, prevBoomerangY, boomerangX, boomerangY, trailColor, 1);
            }

            if (progress < 0.5 && distance(boomerangX, boomerangY, targetCoords.x, targetCoords.y) < 20) {
                console.log('drawBoomerangGuided: Búmeran impacta objetivo!');
                await bulletImpact(targetCoords.x, targetCoords.y);
                if (stopSignal) return;
                await new Promise(resolve => setTimeout(resolve, 500));
                if (stopSignal) return;
            }
            if (progress >= 0.5 && distance(boomerangX, boomerangY, startPoint.x, startPoint.y) < 20) {
                console.log('drawBoomerangGuided: Búmeran regresa al origen!');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 60));
        }
        console.log('drawBoomerangGuided: Búmeran finalizado.');
    }

    // Función auxiliar para dibujar la forma del bumerán (simplificada)
    async function _drawBoomerangShape(x, y, angle, color) {
        if (stopSignal) return;
        const armLength = 20;
        const armAngle = Math.PI / 4;
        const cx = x;
        const cy = y;
        const p1x = cx + armLength * Math.cos(angle);
        const p1y = cy + armLength * Math.sin(angle);
        const p2x = cx + armLength * Math.cos(angle + armAngle);
        const p2y = cy + armLength * Math.sin(angle + armAngle);
        const p3x = cx + armLength * Math.cos(angle - armAngle);
        const p3y = cy + armLength * Math.sin(angle - armAngle);
        sendDrawCommand(cx, cy, p1x, p1y, color, 4);
        sendDrawCommand(cx, cy, p2x, p2y, color, 4);
        sendDrawCommand(cx, cy, p3x, p3y, color, 4);
    }

// Efecto: Espada - Absorción de Energía (ULTRA RALENTIZADO para servidor)
async function drawSwordSlashArc(targetPlayerId) {
    if (stopSignal) { console.log('drawSwordSlashArc detenida.'); return; }
    console.log(`drawSwordSlashArc: Iniciando absorción de energía ultra optimizada en ${targetPlayerId}.`);

    const ownPlayerId = getOwnPlayerId();
    if (!ownPlayerId) { console.warn('drawSwordSlashArc: No se pudo encontrar tu jugador propio.'); return; }

    await drawJsonCommands(ownPlayerId, ESPADA_JSON_URL, 'grip_right', 'right', 1.0);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    if (stopSignal) return;

    const swordAttachPoint = _getAttachmentPoint(ownPlayerId, 'grip_right');
    if (!swordAttachPoint) { console.warn('drawSwordSlashArc: No se pudo determinar el punto de agarre de la espada.'); return; }

    const targetCoords = getTargetCoords(targetPlayerId);
    if (!targetCoords) { console.warn('drawSwordSlashArc: No se pudo determinar el objetivo.'); return; }

    const absorptionPoint = {
        x: Math.floor(swordAttachPoint.x + 60),
        y: Math.floor(swordAttachPoint.y - 15)
    };

    console.log('drawSwordSlashArc: Iniciando drenaje ultra ralentizado...');
    await createEnergyConnectionUltra(targetCoords, absorptionPoint);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 800));
    if (stopSignal) return;
    await drainEnergyFlowUltra(targetCoords, absorptionPoint, targetPlayerId);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 800));
    if (stopSignal) return;
    await finalizeEnergyAbsorptionUltra(absorptionPoint);

    console.log('drawSwordSlashArc: Absorción ultra optimizada completada.');
}

// Conexión inicial con batches ultra pequeños
async function createEnergyConnectionUltra(sourceCoords, absorptionPoint) {
    if (stopSignal) return;
    const connectionSteps = 12;
    const energyColors = ['#9400D3', '#FF1493', '#00FFFF', '#FFD700'];
    sourceCoords.x = Math.floor(sourceCoords.x);
    sourceCoords.y = Math.floor(sourceCoords.y);

    for (let step = 0; step < connectionSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / connectionSteps;
        const tentacles = 4;
        for (let tentacle = 0; tentacle < tentacles; tentacle++) {
            if (stopSignal) return;
            const tentacleAngle = (tentacle / tentacles) * 2 * Math.PI;
            const tentacleRadius = 30 * progress;
            const tentacleStartX = Math.floor(sourceCoords.x + tentacleRadius * Math.cos(tentacleAngle));
            const tentacleStartY = Math.floor(sourceCoords.y + tentacleRadius * Math.sin(tentacleAngle));
            const midProgress = progress * 0.7;
            const tentacleEndX = Math.floor(tentacleStartX + (absorptionPoint.x - tentacleStartX) * midProgress);
            const tentacleEndY = Math.floor(tentacleStartY + (absorptionPoint.y - tentacleStartY) * midProgress);
            const color = energyColors[tentacle % energyColors.length];
            const thickness = Math.max(2, 5 - progress * 2);
            sendDrawCommand(tentacleStartX, tentacleStartY, tentacleEndX, tentacleEndY, color, thickness);
            await new Promise(resolve => setTimeout(resolve, 60));
            if (stopSignal) return;

            if (step % 3 === 0) {
                const sparkX = Math.floor(tentacleEndX + (Math.random() - 0.5) * 10);
                const sparkY = Math.floor(tentacleEndY + (Math.random() - 0.5) * 10);
                sendDrawCommand(tentacleEndX, tentacleEndY, sparkX, sparkY, '#FFFFFF', 1);
                await new Promise(resolve => setTimeout(resolve, 20));
                if (stopSignal) return;
            }
        }
        const pulseRadius = 25 + Math.sin(step * 0.8) * 10;
        const pulseSegments = 8;
        for (let seg = 0; seg < pulseSegments; seg++) {
            if (stopSignal) return;
            const angle = (seg / pulseSegments) * 2 * Math.PI;
            const pulseX = Math.floor(sourceCoords.x + pulseRadius * Math.cos(angle));
            const pulseY = Math.floor(sourceCoords.y + pulseRadius * Math.sin(angle));
            const pulseIntensity = 1 - progress;
            const pulseColor = `rgba(255, 0, 100, ${pulseIntensity * 0.6})`;
            sendDrawCommand(sourceCoords.x, sourceCoords.y, pulseX, pulseY, pulseColor, Math.max(1, 3 * pulseIntensity));
            await new Promise(resolve => setTimeout(resolve, 25));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

// Drenaje con batches microscópicos
async function drainEnergyFlowUltra(sourceCoords, absorptionPoint, targetPlayerId) {
    if (stopSignal) return;
    const drainDuration = 4000;
    const startTime = Date.now();
    let frame = 0;
    const flowColors = ['#9400D3', '#8A2BE2', '#FF1493', '#00FFFF', '#FFD700'];
    const streamCount = 3;

    while (Date.now() - startTime < drainDuration) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        frame++;
        const currentTargetCoords = getTargetCoords(targetPlayerId) || sourceCoords;
        currentTargetCoords.x = Math.floor(currentTargetCoords.x);
        currentTargetCoords.y = Math.floor(currentTargetCoords.y);

        for (let stream = 0; stream < streamCount; stream++) {
            if (stopSignal) return;
            const streamOffset = (stream / streamCount) * 2 * Math.PI;
            const streamPhase = frame * 0.1 + streamOffset;
            const particleCount = 4;
            for (let particle = 0; particle < particleCount; particle++) {
                if (stopSignal) return;
                const particleProgress = (particle / particleCount) + (frame * 0.05) % 1;
                const baseX = currentTargetCoords.x + (absorptionPoint.x - currentTargetCoords.x) * particleProgress;
                const baseY = currentTargetCoords.y + (absorptionPoint.y - currentTargetCoords.y) * particleProgress;
                const waveIntensity = 15 * Math.sin(particleProgress * Math.PI);
                const waveX = Math.floor(baseX + waveIntensity * Math.cos(streamPhase + particleProgress * 4));
                const waveY = Math.floor(baseY + waveIntensity * Math.sin(streamPhase + particleProgress * 4) * 0.5);
                const color = flowColors[stream % flowColors.length];
                const intensity = 1 - particleProgress;
                const thickness = Math.max(1, 4 * intensity);
                sendDrawCommand(waveX - 2, waveY - 2, waveX + 2, waveY + 2, color, thickness);
                await new Promise(resolve => setTimeout(resolve, 30));
                if (stopSignal) return;

                if (particleProgress > 0.1) {
                    const trailX = Math.floor(waveX - 8 * Math.cos(streamPhase));
                    const trailY = Math.floor(waveY - 8 * Math.sin(streamPhase) * 0.5);
                    sendDrawCommand(waveX, waveY, trailX, trailY, color, Math.max(1, thickness * 0.6));
                    await new Promise(resolve => setTimeout(resolve, 15));
                    if (stopSignal) return;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            if (stopSignal) return;
        }
        if (frame % 6 === 0) {
            const drainPulse = Math.sin(frame * 0.3) * 20 + 30;
            const drainSegments = 8;
            for (let seg = 0; seg < drainSegments; seg++) {
                if (stopSignal) return;
                const angle = (seg / drainSegments) * 2 * Math.PI + frame * 0.1;
                const drainX = Math.floor(currentTargetCoords.x + drainPulse * Math.cos(angle));
                const drainY = Math.floor(currentTargetCoords.y + drainPulse * Math.sin(angle));
                const drainColor = `rgba(255, ${100 - frame % 100}, 0, 0.7)`;
                sendDrawCommand(currentTargetCoords.x, currentTargetCoords.y, drainX, drainY, drainColor, 2);
                await new Promise(resolve => setTimeout(resolve, 40));
                if (stopSignal) return;
            }
        }
        if (frame % 8 === 0) {
            const accumulation = Math.sin(frame * 0.2) * 15 + 20;
            const accumulationSpokes = 6;
            for (let spoke = 0; spoke < accumulationSpokes; spoke++) {
                if (stopSignal) return;
                const spokeAngle = (spoke / accumulationSpokes) * 2 * Math.PI + frame * 0.15;
                const accX = Math.floor(absorptionPoint.x + accumulation * Math.cos(spokeAngle));
                const accY = Math.floor(absorptionPoint.y + accumulation * Math.sin(spokeAngle));
                sendDrawCommand(absorptionPoint.x, absorptionPoint.y, accX, accY, '#FFD700', 3);
                await new Promise(resolve => setTimeout(resolve, 35));
                if (stopSignal) return;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 150));
    }
}

// Finalización ultra ralentizada
async function finalizeEnergyAbsorptionUltra(absorptionPoint) {
    if (stopSignal) return;
    const finalizationSteps = 15;
    const maxRadius = 40;
    const finalColors = ['#FFFFFF', '#FFD700', '#00FFFF'];

    for (let step = 0; step < finalizationSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / finalizationSteps;
        const currentRadius = maxRadius * Math.sin(progress * Math.PI);
        const intensity = 1 - progress;
        const burstRays = 12;
        for (let colorIdx = 0; colorIdx < finalColors.length; colorIdx++) {
            if (stopSignal) return;
            for (let ray = 0; ray < burstRays; ray += 6) {
                if (stopSignal) return;
                for (let r = ray; r < Math.min(ray + 2, burstRays); r++) {
                    if (r % finalColors.length !== colorIdx) continue;
                    const rayAngle = (r / burstRays) * 2 * Math.PI + step * 0.2;
                    const rayLength = Math.floor(currentRadius + Math.random() * 15);
                    const rayX = Math.floor(absorptionPoint.x + rayLength * Math.cos(rayAngle));
                    const rayY = Math.floor(absorptionPoint.y + rayLength * Math.sin(rayAngle));
                    const thickness = Math.max(1, 5 * intensity);
                    sendDrawCommand(absorptionPoint.x, absorptionPoint.y, rayX, rayY, finalColors[colorIdx], thickness);
                    await new Promise(resolve => setTimeout(resolve, 45));
                    if (stopSignal) return;
                }
                await new Promise(resolve => setTimeout(resolve, 80));
                if (stopSignal) return;
            }
            await new Promise(resolve => setTimeout(resolve, 120));
            if (stopSignal) return;
        }
        const coreSize = Math.floor(12 * intensity);
        const coreSegments = 4;
        for (let seg = 0; seg < coreSegments; seg++) {
            if (stopSignal) return;
            const coreAngle = (seg / coreSegments) * 2 * Math.PI;
            const coreX = Math.floor(absorptionPoint.x + coreSize * Math.cos(coreAngle));
            const coreY = Math.floor(absorptionPoint.y + coreSize * Math.sin(coreAngle));
            sendDrawCommand(absorptionPoint.x, absorptionPoint.y, coreX, coreY, '#FFFFFF', Math.max(2, 6 * intensity));
            await new Promise(resolve => setTimeout(resolve, 50));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 600));
    if (stopSignal) return;
    sendDrawCommand(absorptionPoint.x - 20, absorptionPoint.y, absorptionPoint.x + 20, absorptionPoint.y, '#FFFFFF', 8);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (stopSignal) return;
    sendDrawCommand(absorptionPoint.x, absorptionPoint.y - 20, absorptionPoint.x, absorptionPoint.y + 20, '#FFFFFF', 8);
}


// Efecto: Martillo - Red Trampa que Encierra al Objetivo
async function drawSeismicSmashWave(targetPlayerId) {
    if (stopSignal) { console.log('drawSeismicSmashWave detenida.'); return; }
    console.log(`drawSeismicSmashWave: Iniciando red trampa en ${targetPlayerId}.`);

    const ownPlayerId = getOwnPlayerId();
    if (!ownPlayerId) { console.warn('drawSeismicSmashWave: No se pudo encontrar tu jugador propio.'); return; }

    await drawJsonCommands(ownPlayerId, MARTILLO_JSON_URL, 'grip_right', 'down', 1.0);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 300));
    if (stopSignal) return;

    const hammerPoint = _getAttachmentPoint(ownPlayerId, 'grip_right');
    const targetPoint = getTargetCoords(targetPlayerId);
    if (!hammerPoint || !targetPoint) { console.warn('drawSeismicSmashWave: No se pudieron determinar los puntos.'); return; }

    const hammerX = Math.floor(hammerPoint.x);
    const hammerY = Math.floor(hammerPoint.y);
    const targetX = Math.floor(targetPoint.x);
    const targetY = Math.floor(targetPoint.y);

    console.log('drawSeismicSmashWave: ¡Lanzando red trampa!');

    await launchNetProjectiles(hammerX, hammerY, targetX, targetY);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 400));
    if (stopSignal) return;
    await expandTrapNet(targetX, targetY);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 400));
    if (stopSignal) return;
    await closeTrapNet(targetX, targetY);

    console.log('drawSeismicSmashWave: Red trampa completada.');
}

// Lanzar proyectiles de red con batch rendering
async function launchNetProjectiles(startX, startY, targetX, targetY) {
    if (stopSignal) return;
    const projectileSteps = 15;
    const netColors = ['#8B4513', '#A0522D', '#CD853F'];

    for (let step = 0; step < projectileSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / projectileSteps;
        for (let colorIdx = 0; colorIdx < netColors.length; colorIdx++) {
            if (stopSignal) return;
            const color = netColors[colorIdx];
            const projectilesThisColor = [];
            const projectileCount = 3;
            for (let proj = 0; proj < projectileCount; proj++) {
                if (proj % netColors.length !== colorIdx) continue;
                const angle = (proj / projectileCount) * 0.6 - 0.3;
                const currentX = Math.floor(startX + (targetX - startX) * progress);
                const currentY = Math.floor(startY + (targetY - startY) * progress - 20 * Math.sin(Math.PI * progress));
                const offsetX = Math.floor(Math.cos(angle) * 15);
                const offsetY = Math.floor(Math.sin(angle) * 15);
                projectilesThisColor.push({ x: currentX + offsetX, y: currentY + offsetY });
            }
            projectilesThisColor.forEach(proj => {
                const prevX = Math.floor(startX + (targetX - startX) * Math.max(0, progress - 0.1));
                const prevY = Math.floor(startY + (targetY - startY) * Math.max(0, progress - 0.1));
                sendDrawCommand(prevX, prevY, proj.x, proj.y, color, 3);
                sendDrawCommand(proj.x - 3, proj.y - 3, proj.x + 3, proj.y + 3, color, 2);
            });
            await new Promise(resolve => setTimeout(resolve, 15));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 60));
    }
}

// Expandir red trampa alrededor del objetivo
async function expandTrapNet(centerX, centerY) {
    if (stopSignal) return;
    const expansionSteps = 18;
    const maxRadius = 80;
    const netColor = '#8B4513';
    const accentColor = '#CD853F';

    for (let step = 0; step < expansionSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / expansionSteps;
        const currentRadius = Math.floor(maxRadius * progress);
        const netCommands = [];
        const rings = Math.min(4, Math.floor(progress * 4) + 1);
        for (let ring = 0; ring < rings; ring++) {
            const ringRadius = Math.floor((currentRadius / rings) * (ring + 1));
            const segments = 12;
            for (let seg = 0; seg < segments; seg++) {
                const angle1 = (seg / segments) * 2 * Math.PI;
                const angle2 = ((seg + 1) / segments) * 2 * Math.PI;
                const x1 = Math.floor(centerX + ringRadius * Math.cos(angle1));
                const y1 = Math.floor(centerY + ringRadius * Math.sin(angle1));
                const x2 = Math.floor(centerX + ringRadius * Math.cos(angle2));
                const y2 = Math.floor(centerY + ringRadius * Math.sin(angle2));
                netCommands.push({ x1, y1, x2, y2, color: netColor, thickness: 2 });
            }
        }
        const radialLines = 8;
        for (let line = 0; line < radialLines; line++) {
            const angle = (line / radialLines) * 2 * Math.PI;
            const endX = Math.floor(centerX + currentRadius * Math.cos(angle));
            const endY = Math.floor(centerY + currentRadius * Math.sin(angle));
            netCommands.push({ x1: centerX, y1: centerY, x2: endX, y2: endY, color: netColor, thickness: 2 });
        }
        netCommands.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.color, cmd.thickness));
        await new Promise(resolve => setTimeout(resolve, 25));
        if (stopSignal) return;

        if (step % 3 === 0) {
            const nodeCommands = [];
            for (let ring = 1; ring <= rings; ring++) {
                const ringRadius = Math.floor((currentRadius / rings) * ring);
                const nodes = 6;
                for (let node = 0; node < nodes; node++) {
                    const angle = (node / nodes) * 2 * Math.PI;
                    const nodeX = Math.floor(centerX + ringRadius * Math.cos(angle));
                    const nodeY = Math.floor(centerY + ringRadius * Math.sin(angle));
                    nodeCommands.push({ x1: nodeX - 2, y1: nodeY - 2, x2: nodeX + 2, y2: nodeY + 2, color: accentColor, thickness: 3 });
                }
            }
            nodeCommands.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.color, cmd.thickness));
            await new Promise(resolve => setTimeout(resolve, 20));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 180));
    }
}

// Cerrar la trampa con efecto de captura
async function closeTrapNet(centerX, centerY) {
    if (stopSignal) return;
    const closingSteps = 12;
    const initialRadius = 80;
    const finalRadius = 25;
    const trapColor = '#654321';
    const sparkColor = '#DAA520';

    for (let step = 0; step < closingSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / closingSteps;
        const currentRadius = Math.floor(initialRadius - (initialRadius - finalRadius) * progress);
        const intensity = 1 - progress;
        const contractionCommands = [];
        const contractionLines = 10;
        for (let line = 0; line < contractionLines; line++) {
            const angle = (line / contractionLines) * 2 * Math.PI;
            const outerX = Math.floor(centerX + currentRadius * Math.cos(angle));
            const outerY = Math.floor(centerY + currentRadius * Math.sin(angle));
            const innerX = Math.floor(centerX + (currentRadius * 0.3) * Math.cos(angle));
            const innerY = Math.floor(centerY + (currentRadius * 0.3) * Math.sin(angle));
            contractionCommands.push({ x1: outerX, y1: outerY, x2: innerX, y2: innerY, color: trapColor, thickness: Math.max(1, 4 * intensity) });
        }
        contractionCommands.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.color, cmd.thickness));
        await new Promise(resolve => setTimeout(resolve, 30));
        if (stopSignal) return;

        if (step % 2 === 0) {
            const sparkCommands = [];
            const sparkCount = 6;
            for (let spark = 0; spark < sparkCount; spark++) {
                const sparkAngle = (spark / sparkCount) * 2 * Math.PI + Math.random() * 0.5;
                const sparkRadius = currentRadius + Math.random() * 10;
                const sparkX = Math.floor(centerX + sparkRadius * Math.cos(sparkAngle));
                const sparkY = Math.floor(centerY + sparkRadius * Math.sin(sparkAngle));
                const sparkEndX = Math.floor(sparkX + (Math.random() - 0.5) * 15);
                const sparkEndY = Math.floor(sparkY + (Math.random() - 0.5) * 15);
                sparkCommands.push({ x1: sparkX, y1: sparkY, x2: sparkEndX, y2: sparkEndY, color: sparkColor, thickness: 1 });
            }
            sparkCommands.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.color, cmd.thickness));
            await new Promise(resolve => setTimeout(resolve, 25));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 200));
    if (stopSignal) return;
    const pulseRadius = finalRadius;
    for (let pulse = 0; pulse < 3; pulse++) {
        if (stopSignal) return;
        const pulseSegments = 8;
        for (let seg = 0; seg < pulseSegments; seg++) {
            const angle = (seg / pulseSegments) * 2 * Math.PI;
            const pulseX = Math.floor(centerX + pulseRadius * Math.cos(angle));
            const pulseY = Math.floor(centerY + pulseRadius * Math.sin(angle));
            sendDrawCommand(centerX, centerY, pulseX, pulseY, sparkColor, 3);
        }
        await new Promise(resolve => setTimeout(resolve, 150));
    }
}

// Efecto: Látigo - Solo Clones + Sol + Quemado (ULTRA OPTIMIZADO)
async function drawElectricWhipSnap(targetPlayerId) {
    if (stopSignal) { console.log('drawElectricWhipSnap detenida.'); return; }
    console.log(`drawElectricWhipSnap: Iniciando efecto ultra optimizado en ${targetPlayerId}.`);

    const ownPlayerId = getOwnPlayerId();
    if (!ownPlayerId) { console.warn('drawElectricWhipSnap: No se pudo encontrar tu jugador propio.'); return; }

    await drawJsonCommands(ownPlayerId, LATIGO_JSON_URL, 'grip_right', 'right', 1.0);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 600));
    if (stopSignal) return;

    const targetCoords = getTargetCoords(targetPlayerId);
    if (!targetCoords) { console.warn('drawElectricWhipSnap: No se pudo determinar el objetivo.'); return; }

    const centerX = Math.floor(targetCoords.x);
    const centerY = Math.floor(targetCoords.y);

    console.log('drawElectricWhipSnap: Iniciando ritual ultra optimizado...');
    await createClonesUltraOptimized(centerX, centerY);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 800));
    if (stopSignal) return;
    await emergingSunUltraOptimized(centerX, centerY);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 800));
    if (stopSignal) return;
    await burnPlayerUltraOptimized(centerX, centerY);

    console.log('drawElectricWhipSnap: Ritual ultra optimizado completado.');
}

// Clones ultra optimizados con batch rendering completo
async function createClonesUltraOptimized(centerX, centerY) {
    if (stopSignal) return;
    const cloneSteps = 12;
    const maxRadius = 90;
    const cloneCount = 5;
    const cloneColors = ['#FFD700', '#FFA500'];

    for (let step = 0; step < cloneSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / cloneSteps;
        const currentRadius = Math.floor(maxRadius * progress);
        for (let colorIdx = 0; colorIdx < cloneColors.length; colorIdx++) {
            if (stopSignal) return;
            const color = cloneColors[colorIdx];
            const allCloneCommands = [];
            for (let clone = 0; clone < cloneCount; clone++) {
                if (clone % cloneColors.length !== colorIdx) continue;
                const angle = (clone / cloneCount) * 2 * Math.PI + step * 0.1;
                const cloneX = Math.floor(centerX + currentRadius * Math.cos(angle));
                const cloneY = Math.floor(centerY + currentRadius * Math.sin(angle));
                const size = Math.floor(12 + Math.sin(step * 0.4) * 4);
                allCloneCommands.push(
                    { x1: cloneX - size, y1: cloneY, x2: cloneX + size, y2: cloneY },
                    { x1: cloneX, y1: cloneY - size, x2: cloneX, y2: cloneY + size },
                    { x1: cloneX - size, y1: cloneY - size, x2: cloneX + size, y2: cloneY + size }
                );
            }
            allCloneCommands.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, color, colorIdx === 0 ? 3 : 1));
            await new Promise(resolve => setTimeout(resolve, 80));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 180));
    }
}

// Sol emergente ultra optimizado
async function emergingSunUltraOptimized(centerX, centerY) {
    if (stopSignal) return;
    const sunSteps = 15;
    const maxSunRadius = 70;
    const sunColors = ['#FFFF00', '#FFA500'];

    for (let step = 0; step < sunSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / sunSteps;
        const currentRadius = Math.floor(maxSunRadius * Math.sin((progress * Math.PI) / 2));
        for (let colorIdx = 0; colorIdx < sunColors.length; colorIdx++) {
            if (stopSignal) return;
            const color = sunColors[colorIdx];
            const layerRadius = Math.floor(currentRadius * (1 - colorIdx * 0.3));
            const rayCount = 10 - colorIdx * 2;
            const allSunCommands = [];
            for (let ray = 0; ray < rayCount; ray++) {
                const angle = (ray / rayCount) * 2 * Math.PI + step * 0.1;
                const rayLength = Math.floor(layerRadius + Math.sin(step * 0.3 + ray) * 8);
                const rayEndX = Math.floor(centerX + rayLength * Math.cos(angle));
                const rayEndY = Math.floor(centerY + rayLength * Math.sin(angle));
                allSunCommands.push({ x1: centerX, y1: centerY, x2: rayEndX, y2: rayEndY, thickness: Math.max(1, (3 - colorIdx) * (1 - progress * 0.2)) });
            }
            const coronaSegments = 8;
            for (let seg = 0; seg < coronaSegments; seg++) {
                const segAngle = (seg / coronaSegments) * 2 * Math.PI;
                const coronaX = Math.floor(centerX + layerRadius * 0.7 * Math.cos(segAngle));
                const coronaY = Math.floor(centerY + layerRadius * 0.7 * Math.sin(segAngle));
                allSunCommands.push({ x1: centerX, y1: centerY, x2: coronaX, y2: coronaY, thickness: Math.max(1, 2 - colorIdx) });
            }
            allSunCommands.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, color, cmd.thickness));
            await new Promise(resolve => setTimeout(resolve, 100));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

// Quemado del jugador ultra optimizado
async function burnPlayerUltraOptimized(centerX, centerY) {
    if (stopSignal) return;
    const burnSteps = 12;
    const fireColors = ['#FF4500', '#FFD700'];

    for (let step = 0; step < burnSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / burnSteps;
        const intensity = 1 - progress;
        const burnRadius = Math.floor(50 * progress);
        for (let colorIdx = 0; colorIdx < fireColors.length; colorIdx++) {
            if (stopSignal) return;
            const color = fireColors[colorIdx];
            const allFireCommands = [];
            const flameCount = 8;
            for (let flame = 0; flame < flameCount; flame++) {
                if (flame % fireColors.length !== colorIdx) continue;
                const flameAngle = (flame / flameCount) * 2 * Math.PI + step * 0.15;
                const flameDistance = Math.floor(burnRadius + Math.random() * 15);
                const flameX = Math.floor(centerX + flameDistance * Math.cos(flameAngle));
                const flameY = Math.floor(centerY + flameDistance * Math.sin(flameAngle) - Math.random() * 10);
                allFireCommands.push({ x1: centerX, y1: centerY, x2: flameX, y2: flameY, thickness: Math.max(1, Math.floor(4 * intensity)) });
                if (Math.random() < 0.3) {
                    const sparkX = Math.floor(flameX + (Math.random() - 0.5) * 8);
                    const sparkY = Math.floor(flameY + (Math.random() - 0.5) * 8);
                    allFireCommands.push({ x1: flameX, y1: flameY, x2: sparkX, y2: sparkY, thickness: 1 });
                }
            }
            allFireCommands.forEach(cmd => {
                const fireColor = cmd.thickness === 1 ? '#FFFF00' : color;
                sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, fireColor, cmd.thickness);
            });
            await new Promise(resolve => setTimeout(resolve, 90));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 220));
    }
}


    // Efecto: Granada Pegajosa
    async function drawStickyGrenadeProj(playerId) {
        if (stopSignal) { console.log('drawStickyGrenadeProj detenida.'); return; }
        console.log(`drawStickyGrenadeProj: Iniciando efecto en ${playerId}.`);
        const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]`);
        if (!avatar) { console.warn('drawStickyGrenadeProj: Avatar no encontrado.'); return; }

        await drawJsonCommands(playerId, GRANADA_JSON_URL, 'grip_right', 'none', 0.8);
        if (stopSignal) return;

        const grenadeAttachPoint = _getAttachmentPoint(playerId, 'grip_right');
        if (!grenadeAttachPoint) { console.warn('drawStickyGrenadeProj: No se pudo determinar el punto de agarre de la granada.'); return; }

        const throwOrigin = {
            x: grenadeAttachPoint.x + 20,
            y: grenadeAttachPoint.y + 0
        };

        const targetCoords = getTargetCoords(playerId);
        if (!throwOrigin || !targetCoords) { console.warn('drawStickyGrenadeProj: No se pudo determinar origen/objetivo.'); return; }

        const fuseTimeMs = 2500;
        const flightTimeMs = 800;
        const flightSteps = 20;
        let grenadeCurrentX = throwOrigin.x;
        let grenadeCurrentY = throwOrigin.y;

        console.log('drawStickyGrenadeProj: Lanzando granada pegajosa...');
        for (let step = 0; step < flightSteps; step++) {
            if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
            const progress = step / flightSteps;
            const nextX = throwOrigin.x + (targetCoords.x - throwOrigin.x) * progress;
            const nextY = throwOrigin.y + (targetCoords.y - throwOrigin.y) * progress - 50 * Math.sin(Math.PI * progress);
            sendDrawCommand(grenadeCurrentX, grenadeCurrentY, nextX, nextY, '#808080', 3);
            grenadeCurrentX = nextX;
            grenadeCurrentY = nextY;
            await new Promise(resolve => setTimeout(resolve, flightTimeMs / flightSteps));
        }
        if (stopSignal) return;

        const finalGrenadeX = targetCoords.x;
        const finalGrenadeY = targetCoords.y - 15;

        console.log('drawStickyGrenadeProj: Granada se ha pegado al avatar. Iniciando temporizador...');
        const blinkInterval = setInterval(() => {
            if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) { clearInterval(blinkInterval); return; }
            const blinkColor = Math.random() > 0.5 ? '#FF0000' : '#FFFF00';
            sendDrawCommand(finalGrenadeX - 5, finalGrenadeY, finalGrenadeX + 5, finalGrenadeY, blinkColor, 2);
            sendDrawCommand(finalGrenadeX, finalGrenadeY - 5, finalGrenadeX, finalGrenadeY + 5, blinkColor, 2);
        }, 100);

        await new Promise(resolve => setTimeout(resolve, fuseTimeMs));
        clearInterval(blinkInterval);
        if (stopSignal) return;

        if (socket && !(repeatIntervalId && !repeatActionToggle.checked)) {
            await explosionBlast(finalGrenadeX, finalGrenadeY, 1.0);
        }
        console.log('drawStickyGrenadeProj: Granada explotada.');
    }

// Efecto: Campo de Fuerza Protector (ULTRA OPTIMIZADO)
async function drawProximityMineTrap(playerId) {
    if (stopSignal) { console.log('drawProximityMineTrap detenida.'); return; }
    console.log(`drawProximityMineTrap: Iniciando campo de fuerza ULTRA optimizado en ${playerId}.`);
    const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]`);
    if (!avatar) { console.warn('drawProximityMineTrap: Avatar no encontrado.'); return; }

    const mineGroundPosition = _getAttachmentPoint(playerId, 'bottom');
    if (!mineGroundPosition) { console.warn('drawProximityMineTrap: No se pudo determinar la posición para el generador.'); return; }

    await drawJsonCommands(playerId, MINA_JSON_URL, 'bottom', 'none', 1.0);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 800));
    if (stopSignal) return;

    const centerX = Math.floor(mineGroundPosition.x);
    const centerY = Math.floor(mineGroundPosition.y);

    console.log('drawProximityMineTrap: ¡Activando campo ULTRA optimizado!');

    await initializeForceFieldUltra(centerX, centerY);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (stopSignal) return;
    await activeForceFieldUltra(centerX, centerY);
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (stopSignal) return;
    // await deactivateForceFieldUltra(centerX, centerY); // This function was missing, commented out

    console.log('drawProximityMineTrap: Campo ULTRA optimizado finalizado.');
}

// Inicialización ULTRA optimizada con batch rendering completo
async function initializeForceFieldUltra(centerX, centerY) {
    if (stopSignal) return;
    const initSteps = 10;
    const maxRadius = 80;
    const fieldColors = ['#00BFFF', '#4169E1'];
    const preCalculatedAngles = [];
    const segments = 12;
    for (let seg = 0; seg < segments; seg++) {
        preCalculatedAngles.push((seg / segments) * 2 * Math.PI);
    }

    for (let step = 0; step < initSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / initSteps;
        const currentRadius = Math.floor(maxRadius * Math.sin((progress * Math.PI) / 2));
        for (let colorIdx = 0; colorIdx < fieldColors.length; colorIdx++) {
            if (stopSignal) return;
            const color = fieldColors[colorIdx];
            const allCommands = [];
            const ringRadius = Math.floor(currentRadius * (1 - colorIdx * 0.3));
            preCalculatedAngles.forEach((baseAngle, segIdx) => {
                const angle1 = baseAngle + step * 0.1;
                const angle2 = preCalculatedAngles[(segIdx + 1) % preCalculatedAngles.length] + step * 0.1;
                const x1 = Math.floor(centerX + ringRadius * Math.cos(angle1));
                const y1 = Math.floor(centerY + ringRadius * Math.sin(angle1));
                const x2 = Math.floor(centerX + ringRadius * Math.cos(angle2));
                const y2 = Math.floor(centerY + ringRadius * Math.sin(angle2));
                allCommands.push({ x1, y1, x2, y2 });
            });
            const energyRays = 4;
            for (let ray = 0; ray < energyRays; ray++) {
                const rayAngle = (ray / energyRays) * 2 * Math.PI + step * 0.15;
                const rayStartX = Math.floor(centerX + ringRadius * Math.cos(rayAngle));
                const rayStartY = Math.floor(centerY + ringRadius * Math.sin(rayAngle));
                const rayEndX = Math.floor(centerX + (ringRadius * 0.4) * Math.cos(rayAngle));
                const rayEndY = Math.floor(centerY + (ringRadius * 0.4) * Math.sin(rayAngle));
                allCommands.push({ x1: rayStartX, y1: rayStartY, x2: rayEndX, y2: rayEndY });
            }
            const thickness = Math.max(1, (3 - colorIdx) * (0.5 + progress * 0.5));
            allCommands.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, color, thickness));
            await new Promise(resolve => setTimeout(resolve, 120));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 250));
    }
}
async function activeForceFieldUltra(centerX, centerY) {
    // Placeholder for the missing function to prevent errors
    // A real implementation would go here
    if (stopSignal) return;
    console.log("activeForceFieldUltra (placeholder) executed.");
    await new Promise(resolve => setTimeout(resolve, 1000));
}

    // Efecto: Tormenta de Hielo
    async function drawIceStormArea(playerId) {
        console.log(`drawIceStormArea: Iniciando efecto en ${playerId}.`);
        const avatarCenter = getTargetCoords(playerId);
        if (!avatarCenter) { console.warn('drawIceStormArea: Avatar no encontrado.'); return; }

        const stormDurationMs = 5000;
        const startTime = Date.now();
        let frame = 0;
        const stormColors = ['#ADD8E6', '#E0FFFF', '#FFFFFF', '#B0E0E6']; // Tonos de azul claro y blanco

        console.log('drawIceStormArea: Desatando tormenta de hielo...');
        while (Date.now() - startTime < stormDurationMs) {
            if (!socket || (repeatIntervalId && !repeatActionToggle.checked)) { break; }

            frame++;
            const currentAvatarCenter = getTargetCoords(playerId);
            if (!currentAvatarCenter) { console.log('drawIceStormArea: Objetivo desaparecido.'); return; }
            const centerX = currentAvatarCenter.x;
            const centerY = currentAvatarCenter.y;

            // Partículas que caen (copos de nieve)
            for (let i = 0; i < 5; i++) {
                const x = centerX + (Math.random() - 0.5) * 150;
                const y = centerY - 80 + Math.random() * 160; // Área vertical
                const size = Math.random() * 3 + 1;
                sendDrawCommand(x, y, x + size, y + size, '#FFFFFF', 1); // Pequeños puntos
            }

            // Estalactitas/Fragmentos de hielo al azar
            if (Math.random() < 0.2) { // Menos frecuentes
                const x = centerX + (Math.random() - 0.5) * 100;
                const y1 = centerY - 50 + Math.random() * 20;
                const y2 = y1 + 10 + Math.random() * 20;
                const color = stormColors[Math.floor(Math.random() * stormColors.length)];
                sendDrawCommand(x, y1, x, y2, color, Math.max(1, Math.random() * 3));
            }

            // Anillo gélido que pulsa
            const pulseRadius = 60 + 10 * Math.sin(frame * 0.1);
            const pulseThickness = 2 + 1 * Math.sin(frame * 0.1);
            const segments = 12;
            for(let i=0; i<segments; i++) {
                const angle1 = (i / segments) * 2 * Math.PI;
                const angle2 = ((i + 1) / segments) * 2 * Math.PI;
                const x1 = centerX + pulseRadius * Math.cos(angle1);
                const y1 = centerY + pulseRadius * Math.sin(angle1);
                const x2 = centerX + pulseRadius * Math.cos(angle2);
                const y2 = centerY + pulseRadius * Math.sin(angle2);
                sendDrawCommand(x1, y1, x2, y2, '#B0E0E6', pulseThickness);
            }

            await new Promise(resolve => setTimeout(resolve, 100)); // Frame rate para la tormenta
        }
        console.log('drawIceStormArea: Tormenta de hielo finalizada.');
    }

// Inicialización de cristales con batch rendering completo
async function initializeCrystals(centerX, centerY) {
    if (stopSignal) return;
    const initSteps = 8;
    const crystalColors = ['#E0FFFF', '#B0E0E6'];
    const crystalPositions = [];
    const crystalCount = 6;
    for (let i = 0; i < crystalCount; i++) {
        const angle = (i / crystalCount) * 2 * Math.PI;
        const distance = 40 + Math.random() * 30;
        crystalPositions.push({ x: Math.floor(centerX + distance * Math.cos(angle)), y: Math.floor(centerY + distance * Math.sin(angle)), baseAngle: angle });
    }

    for (let step = 0; step < initSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / initSteps;
        for (let colorIdx = 0; colorIdx < crystalColors.length; colorIdx++) {
            if (stopSignal) return;
            const color = crystalColors[colorIdx];
            const allCrystalCommands = [];
            crystalPositions.forEach((crystal, crystalIdx) => {
                if (crystalIdx % crystalColors.length !== colorIdx) return;
                const size = Math.floor(15 * progress);
                const rotation = step * 0.1 + crystal.baseAngle;
                const hexPoints = [];
                for (let point = 0; point < 6; point++) {
                    const pointAngle = (point / 6) * 2 * Math.PI + rotation;
                    const pointDistance = size * (0.8 + Math.sin(step * 0.2 + point) * 0.2);
                    hexPoints.push({ x: Math.floor(crystal.x + pointDistance * Math.cos(pointAngle)), y: Math.floor(crystal.y + pointDistance * Math.sin(pointAngle)) });
                }
                for (let i = 0; i < hexPoints.length; i++) {
                    const nextIndex = (i + 1) % hexPoints.length;
                    allCrystalCommands.push({ x1: hexPoints[i].x, y1: hexPoints[i].y, x2: hexPoints[nextIndex].x, y2: hexPoints[nextIndex].y });
                }
                allCrystalCommands.push({ x1: crystal.x - 2, y1: crystal.y - 2, x2: crystal.x + 2, y2: crystal.y + 2 });
            });
            const thickness = Math.max(1, (3 - colorIdx) * (0.5 + progress * 0.5));
            allCrystalCommands.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, color, thickness));
            await new Promise(resolve => setTimeout(resolve, 180));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// Crecimiento detallado de cristales con optimización extrema
async function growDetailedCrystals(centerX, centerY) {
    if (stopSignal) return;
    const growthSteps = 10;
    const detailColors = ['#FFFFFF', '#E0FFFF', '#B0E0E6'];
    const detailedCrystals = [];
    const mainCrystals = 5;
    for (let main = 0; main < mainCrystals; main++) {
        const mainAngle = (main / mainCrystals) * 2 * Math.PI;
        const mainDistance = 50;
        const mainX = Math.floor(centerX + mainDistance * Math.cos(mainAngle));
        const mainY = Math.floor(centerY + mainDistance * Math.sin(mainAngle));
        detailedCrystals.push({ centerX: mainX, centerY: mainY, baseAngle: mainAngle, branches: [] });
        const branches = 4;
        for (let branch = 0; branch < branches; branch++) {
            const branchAngle = mainAngle + (branch / branches) * Math.PI;
            detailedCrystals[main].branches.push({ angle: branchAngle, length: 20 + Math.random() * 15 });
        }
    }

    for (let step = 0; step < growthSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / growthSteps;
        for (let colorIdx = 0; colorIdx < detailColors.length; colorIdx++) {
            if (stopSignal) return;
            const color = detailColors[colorIdx];
            const allDetailCommands = [];
            detailedCrystals.forEach((crystal, crystalIdx) => {
                if (crystalIdx % detailColors.length !== colorIdx) return;
                const crystalSize = Math.floor(25 * progress);
                const rotation = step * 0.08;
                const starPoints = 8;
                for (let point = 0; point < starPoints; point++) {
                    const isOuter = point % 2 === 0;
                    const pointAngle = (point / starPoints) * 2 * Math.PI + rotation;
                    const pointDistance = crystalSize * (isOuter ? 1.0 : 0.6);
                    const pointX = Math.floor(crystal.centerX + pointDistance * Math.cos(pointAngle));
                    const pointY = Math.floor(crystal.centerY + pointDistance * Math.sin(pointAngle));
                    allDetailCommands.push({ x1: crystal.centerX, y1: crystal.centerY, x2: pointX, y2: pointY });
                    if (point < starPoints - 1) {
                        const nextPoint = point + 1;
                        const nextIsOuter = nextPoint % 2 === 0;
                        const nextAngle = (nextPoint / starPoints) * 2 * Math.PI + rotation;
                        const nextDistance = crystalSize * (nextIsOuter ? 1.0 : 0.6);
                        const nextX = Math.floor(crystal.centerX + nextDistance * Math.cos(nextAngle));
                        const nextY = Math.floor(crystal.centerY + nextDistance * Math.sin(nextAngle));
                        allDetailCommands.push({ x1: pointX, y1: pointY, x2: nextX, y2: nextY });
                    }
                }
                crystal.branches.forEach(branch => {
                    const branchLength = Math.floor(branch.length * progress);
                    const branchEndX = Math.floor(crystal.centerX + branchLength * Math.cos(branch.angle));
                    const branchEndY = Math.floor(crystal.centerY + branchLength * Math.sin(branch.angle));
                    allDetailCommands.push({ x1: crystal.centerX, y1: crystal.centerY, x2: branchEndX, y2: branchEndY });
                    const subBranches = 2;
                    for (let sub = 0; sub < subBranches; sub++) {
                        const subAngle = branch.angle + (sub - 0.5) * 0.5;
                        const subLength = Math.floor(branchLength * 0.6);
                        const subX = Math.floor(branchEndX + subLength * Math.cos(subAngle));
                        const subY = Math.floor(branchEndY + subLength * Math.sin(subAngle));
                        allDetailCommands.push({ x1: branchEndX, y1: branchEndY, x2: subX, y2: subY });
                    }
                });
            });
            const microBatchSize = 8;
            for (let batch = 0; batch < allDetailCommands.length; batch += microBatchSize) {
                if (stopSignal) return;
                const microBatch = allDetailCommands.slice(batch, batch + microBatchSize);
                const thickness = Math.max(1, (4 - colorIdx) * (0.3 + progress * 0.7));
                microBatch.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, color, thickness));
                await new Promise(resolve => setTimeout(resolve, 60));
                if (stopSignal) return;
            }
            await new Promise(resolve => setTimeout(resolve, 200));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 400));
    }
}

// Cristalización final ultra optimizada
async function finalCrystallization(centerX, centerY) {
    if (stopSignal) return;
    const finalSteps = 6;
    const finalColor = '#FFFFFF';
    const finalPattern = [];
    const layers = 3;
    for (let layer = 0; layer < layers; layer++) {
        const layerRadius = 60 + layer * 20;
        const layerElements = 8 - layer * 2;
        for (let element = 0; element < layerElements; element++) {
            const angle = (element / layerElements) * 2 * Math.PI;
            const elementX = Math.floor(centerX + layerRadius * Math.cos(angle));
            const elementY = Math.floor(centerY + layerRadius * Math.sin(angle));
            finalPattern.push({ centerX: elementX, centerY: elementY, layer: layer, size: 15 - layer * 3 });
        }
    }

    for (let step = 0; step < finalSteps; step++) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        const progress = step / finalSteps;
        const intensity = 1 - progress;
        const allFinalCommands = [];
        finalPattern.forEach(element => {
            const currentSize = Math.floor(element.size * (0.5 + progress * 0.5));
            const diamond = [ { x: element.centerX, y: element.centerY - currentSize }, { x: element.centerX + currentSize, y: element.centerY }, { x: element.centerX, y: element.centerY + currentSize }, { x: element.centerX - currentSize, y: element.centerY }];
            for (let i = 0; i < diamond.length; i++) {
                const nextIndex = (i + 1) % diamond.length;
                allFinalCommands.push({ x1: diamond[i].x, y1: diamond[i].y, x2: diamond[nextIndex].x, y2: diamond[nextIndex].y, thickness: Math.max(1, Math.floor((3 - element.layer) * intensity)) });
            }
            allFinalCommands.push({ x1: element.centerX - currentSize / 2, y1: element.centerY, x2: element.centerX + currentSize / 2, y2: element.centerY, thickness: Math.max(1, Math.floor(2 * intensity)) });
            allFinalCommands.push({ x1: element.centerX, y1: element.centerY - currentSize / 2, x2: element.centerX, y2: element.centerY + currentSize / 2, thickness: Math.max(1, Math.floor(2 * intensity)) });
        });
        const ultraMicroBatch = 6;
        for (let batch = 0; batch < allFinalCommands.length; batch += ultraMicroBatch) {
            if (stopSignal) return;
            const microBatch = allFinalCommands.slice(batch, batch + ultraMicroBatch);
            microBatch.forEach(cmd => sendDrawCommand(cmd.x1, cmd.y1, cmd.x2, cmd.y2, finalColor, cmd.thickness));
            await new Promise(resolve => setTimeout(resolve, 80));
            if (stopSignal) return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (stopSignal) return;
    await new Promise(resolve => setTimeout(resolve, 800));
    if (stopSignal) return;
    sendDrawCommand(centerX - 20, centerY, centerX + 20, centerY, '#FFFFFF', 8);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (stopSignal) return;
    sendDrawCommand(centerX, centerY - 20, centerX, centerY + 20, '#FFFFFF', 8);
}

// Efecto: Tornado de Viento (Solo delays - efecto circular mantenido exacto)
async function drawWindTornadoSpin(playerId) {
    if (stopSignal) { console.log('drawWindTornadoSpin detenida.'); return; }
    console.log(`drawWindTornadoSpin: Iniciando efecto en ${playerId}.`);
    const avatarCenter = getTargetCoords(playerId);
    if (!avatarCenter) { console.warn('drawWindTornadoSpin: Avatar no encontrado.'); return; }

    const tornadoDurationMs = 5000;
    const startTime = Date.now();
    let frame = 0;
    const tornadoHeight = 150;
    const tornadoRadius = 50;
    const rotationSpeed = 0.15;
    const spiralCount = 3;
    const windColors = ['#D3D3D3', '#A9A9A9', '#778899'];

    console.log('drawWindTornadoSpin: Generando tornado de viento...');
    while (Date.now() - startTime < tornadoDurationMs) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        frame++;
        const currentAvatarCenter = getTargetCoords(playerId);
        if (!currentAvatarCenter) { console.log('drawWindTornadoSpin: Objetivo desaparecido.'); return; }

        const centerX = Math.floor(currentAvatarCenter.x);
        const centerY = Math.floor(currentAvatarCenter.y);

        for (let i = 0; i < spiralCount; i++) {
            if (stopSignal) return;
            const spiralOffset = (2 * Math.PI / spiralCount) * i;
            for (let seg = 0; seg < 20; seg++) {
                const progress = seg / 20;
                const currentAngle = frame * rotationSpeed + spiralOffset + progress * Math.PI * 4;
                const currentHeight = tornadoHeight * progress;
                const currentRadius = tornadoRadius * (1 - progress * 0.5);
                const x1 = Math.floor(centerX + currentRadius * Math.cos(currentAngle));
                const y1 = Math.floor(centerY - tornadoHeight / 2 + currentHeight + currentRadius * Math.sin(currentAngle));
                const nextAngle = frame * rotationSpeed + spiralOffset + (seg + 1) / 20 * Math.PI * 4;
                const nextHeight = tornadoHeight * ((seg + 1) / 20);
                const nextRadius = tornadoRadius * (1 - ((seg + 1) / 20) * 0.5);
                const x2 = Math.floor(centerX + nextRadius * Math.cos(nextAngle));
                const y2 = Math.floor(centerY - tornadoHeight / 2 + nextHeight + nextRadius * Math.sin(nextAngle));
                const color = windColors[i % windColors.length];
                sendDrawCommand(x1, y1, x2, y2, color, Math.max(1, 3 * (1 - progress)));
                if (seg > 0 && seg % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 2));
                    if (stopSignal) return;
                }
            }
            if (i < spiralCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 8));
                if (stopSignal) return;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 140));
    }
    console.log('drawWindTornadoSpin: Tornado de viento finalizado.');
}


    // Efecto: Muro de Tierra
    async function drawEarthWallShield(playerId) {
        if (stopSignal) { console.log('drawEarthWallShield detenida.'); return; }
        console.log(`drawEarthWallShield: Iniciando efecto en ${playerId}.`);
        const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]`);
        if (!avatar) { console.warn('drawEarthWallShield: Avatar no encontrado.'); return; }

        const avatarCenter = getTargetCoords(playerId);
        if (!avatarCenter) { console.warn('drawEarthWallShield: Avatar no encontrado para el muro.'); return; }

        const wallDurationMs = 3000;
        const startTime = Date.now();
        let frame = 0;
        const wallWidth = 100;
        const wallHeight = 80;
        const earthColors = ['#8B4513', '#A0522D', '#D2B48C'];
        const initialWallX = avatarCenter.x;
        const initialWallY = avatarCenter.y + avatar.getBoundingClientRect().height / 2 + 10;

        console.log('drawEarthWallShield: Levantando muro de tierra...');
        while (Date.now() - startTime < wallDurationMs) {
            if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
            frame++;
            const progress = (Date.now() - startTime) / wallDurationMs;
            const opacity = 1 - progress;
            const currentHeight = Math.min(wallHeight, frame * 5);
            const currentWallX = initialWallX;
            const currentWallY = initialWallY - currentHeight;

            for (let i = 0; i < 5; i++) {
                const startX = currentWallX - wallWidth / 2 + (Math.random() - 0.5) * 10;
                const endX = currentWallX + wallWidth / 2 + (Math.random() - 0.5) * 10;
                const y = currentWallY + (Math.random() * currentHeight);
                const thickness = Math.max(1, 8 * opacity * Math.random());
                const color = earthColors[Math.floor(Math.random() * earthColors.length)];
                sendDrawCommand(startX, y, endX, y, color, thickness);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log('drawEarthWallShield: Muro de tierra finalizado.');
    }

// Efecto: Dron Seguidor con Rayo
async function drawDroneFollowerRay(playerId) {
    if (stopSignal) { console.log('drawDroneFollowerRay detenida.'); return; }
    console.log(`drawDroneFollowerRay: Iniciando efecto en ${playerId}.`);

    console.log('drawDroneFollowerRay: Dibujando dron JSON...');
    await drawJsonCommands(playerId, DRON_JSON_URL, 'head', 'none', 1.0);
    if (stopSignal) return;

    await new Promise(resolve => setTimeout(resolve, 1000));
    if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) return;

    const avatarCenter = getTargetCoords(playerId);
    if (!avatarCenter) { console.warn('drawDroneFollowerRay: Avatar no encontrado.'); return; }

    const droneDurationMs = 8000;
    const startTime = Date.now();
    let frame = 0;
    const orbitRadius = 60;
    const droneSize = 10;
    const droneColor = '#800080';
    const laserColor = '#FF00FF';

    console.log('drawDroneFollowerRay: Iniciando efecto de seguimiento y disparo...');
    while (Date.now() - startTime < droneDurationMs) {
        if (stopSignal || !socket || (repeatIntervalId && !repeatActionToggle.checked)) break;
        frame++;
        const currentAvatarCenter = getTargetCoords(playerId);
        if (!currentAvatarCenter) { console.log('drawDroneFollowerRay: Objetivo desaparecido.'); return; }
        const centerX = currentAvatarCenter.x;
        const centerY = currentAvatarCenter.y;
        const droneAngle = frame * 0.1;
        const droneX = centerX + orbitRadius * Math.cos(droneAngle);
        const droneY = centerY + orbitRadius * Math.sin(droneAngle) * 0.5;

        sendDrawCommand(droneX - droneSize / 2, droneY - droneSize / 2, droneX + droneSize / 2, droneY + droneSize / 2, droneColor, 3);

        if (frame % 10 === 0) {
            console.log('drawDroneFollowerRay: Dron disparando rayo!');
            const rayTargetX = centerX + (Math.random() - 0.5) * 20;
            const rayTargetY = centerY + (Math.random() - 0.5) * 20;
            sendDrawCommand(droneX, droneY, rayTargetX, rayTargetY, laserColor, 2);
        }
        await new Promise(resolve => setTimeout(resolve, 80));
    }
    console.log('drawDroneFollowerRay: Dron finalizado.');
}



    /* ----------  EVENTOS  ---------- */

    // NUEVO: Event listener para el botón de detener
    stopBtn.addEventListener('click', () => {
        console.log('Botón de detener presionado. Enviando señal de parada.');
        stopSignal = true;

        if (repeatIntervalId) {
            clearInterval(repeatIntervalId);
            repeatIntervalId = null;
            console.log('Intervalo de repetición detenido.');
        }

        // Restaurar el estado de los botones inmediatamente
        drawBtn.textContent = 'Dibujar en avatar';
        drawBtn.style.background = 'linear-gradient(145deg, #4CAF50, #45a049)';
        drawBtn.disabled = false;
        stopBtn.disabled = true;
        isDrawing = false; // Forzar el reseteo del estado de dibujo
    });

    drawBtn.addEventListener('click', async () => {
        const pid = playerSelect.value;
        if (!pid) {
            alert('Por favor, selecciona un jugador.');
            return;
        }

        const selectedDrawingUrl = jsonUrlSelect.value;
        const selectedEffectValue = effectSelect.value;

        // Si el botón dice "Detener", significa que una repetición está activa
        if (repeatIntervalId) {
            console.log('Botón de detener repetición presionado.');
            stopSignal = true; // También detiene la animación actual
            clearInterval(repeatIntervalId);
            repeatIntervalId = null;

            // Restaurar estado de los botones
            drawBtn.textContent = 'Dibujar en avatar';
            drawBtn.style.background = 'linear-gradient(145deg, #4CAF50, #45a049)';
            stopBtn.disabled = true; // Deshabilitar el botón de detener dedicado
            isDrawing = false;
            return;
        }

        // Determinar qué acción ejecutar
        let actionToExecute = null;
        let effectiveWaitDelay = WAIT_ACTION_DELAY;

        // Establecer el estado inicial para la nueva acción
        stopSignal = false; // Resetear la señal de parada
        isDrawing = true;
        drawBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            if (selectedEffectValue && selectedEffectValue.startsWith('effect:')) {
                // ... (toda la lógica de switch para efectos procedurales)
                 switch (selectedEffectValue) {
                    case 'effect:bomb': actionToExecute = () => drawBombWithExplosion(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 2500; break;
                    case 'effect:lightning_zigzag': actionToExecute = () => lightningZigzagChaser(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 2500; break;
                    case 'effect:fire_aura_circular': actionToExecute = () => circularFireAura(pid, 500); effectiveWaitDelay = WAIT_ACTION_DELAY + 500; break;
                    case 'effect:space_rocket': actionToExecute = () => spaceRocketChaser(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 4500; break;
                    case 'effect:pistol_shoot': actionToExecute = () => pistolShootEffect(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 1500; break;
                    case 'effect:flashlight_star': actionToExecute = () => flashlightStarChaser(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 2500; break;
                    case 'effect:arrow_chaser': actionToExecute = () => drawArrowChaser(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 2000; break;
                    case 'effect:shotgun_blast': actionToExecute = () => drawShotgunBlast(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 1000; break;
                    case 'effect:grenade_launcher': actionToExecute = () => drawGrenadeLauncher(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 3000; break;
                    case 'effect:laser_rifle_beam': actionToExecute = () => drawLaserRifleBeam(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 1000; break;
                    case 'effect:boomerang_guided': actionToExecute = () => drawBoomerangGuided(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 4000; break;
                    case 'effect:sword_slash_arc': actionToExecute = () => drawSwordSlashArc(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 1000; break;
                    case 'effect:seismic_smash_wave': actionToExecute = () => drawSeismicSmashWave(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 2000; break;
                    case 'effect:electric_whip_snap': actionToExecute = () => drawElectricWhipSnap(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 1500; break;
                    case 'effect:sticky_grenade_proj': actionToExecute = () => drawStickyGrenadeProj(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 3500; break;
                    case 'effect:proximity_mine_trap': actionToExecute = () => drawProximityMineTrap(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 1000; break;
                    case 'effect:ice_storm_area': actionToExecute = () => drawIceStormArea(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 5000; break;
                    case 'effect:wind_tornado_spin': actionToExecute = () => drawWindTornadoSpin(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 5000; break;
                    case 'effect:earth_wall_shield': actionToExecute = () => drawEarthWallShield(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 3000; break;
                    case 'effect:drone_follower_ray': actionToExecute = () => drawDroneFollowerRay(pid); effectiveWaitDelay = WAIT_ACTION_DELAY + 8000; break;
                    default:
                        console.error('Efecto procedural no reconocido:', selectedEffectValue);
                        alert('Efecto procedural no reconocido o no implementado.');
                        return; // Salir y resetear en finally
                }
            } else if (selectedEffectValue && selectedEffectValue !== JSON_EFFECTS['Ninguno']) {
                actionToExecute = () => drawJsonCommands(pid, selectedEffectValue);
            } else if (selectedDrawingUrl && selectedDrawingUrl !== JSON_SOURCES['Ninguno']) {
                actionToExecute = () => drawJsonCommands(pid);
            } else {
                alert('Por favor, selecciona un Dibujo o un Efecto.');
                return; // Salir y resetear en finally
            }

            if (repeatActionToggle.checked) {
                drawBtn.textContent = 'Detener Repetición';
                drawBtn.style.background = 'linear-gradient(145deg, #f44336, #d32f2f)';
                drawBtn.disabled = false; // El botón de repetir ahora es el de detener
                console.log('Evento click: Iniciando repetición...');

                const repeatedAction = async () => {
                    if (stopSignal || !socket || !repeatActionToggle.checked) {
                        if (repeatIntervalId) clearInterval(repeatIntervalId);
                        repeatIntervalId = null;
                        drawBtn.textContent = 'Dibujar en avatar';
                        drawBtn.style.background = 'linear-gradient(145deg, #4CAF50, #45a049)';
                        stopBtn.disabled = true;
                        isDrawing = false;
                        console.log('Repetición detenida automáticamente.');
                        return;
                    }
                    if (isDrawing) {
                        console.log('Saltando repetición: Una acción aún está en progreso.');
                        return;
                    }
                    isDrawing = true;
                    try {
                        await actionToExecute();
                    } finally {
                        isDrawing = false;
                    }
                    console.log(`Evento click: Acción repetida. Próximo en ${effectiveWaitDelay / 1000} segundos.`);
                };

                await repeatedAction(); // Ejecutar la primera vez
                if (!stopSignal) { // No establecer intervalo si se detuvo durante la primera ejecución
                    repeatIntervalId = setInterval(repeatedAction, effectiveWaitDelay);
                }
            } else {
                // Ejecutar la acción una sola vez
                console.log('Evento click: Ejecutando acción una vez.');
                await actionToExecute();
                console.log('Evento click: Acción única finalizada.');
            }
        } finally {
            // Este bloque se ejecuta después de que la acción termine (naturalmente o por detención)
            // Solo restaurar la UI si no estamos en un ciclo de repetición
            if (!repeatIntervalId) {
                drawBtn.disabled = false;
                stopBtn.disabled = true;
                isDrawing = false;
                console.log("Acción finalizada, estado de UI restaurado.");
            }
        }
    });

/**
 * Obtiene el ID del jugador propio usando las clases CSS de Drawaria
 * @returns {string|null} - ID del jugador propio o null si no se encuentra
 */
function getOwnPlayerId() {
    // Método 1: Buscar por clase CSS en lista de jugadores
    const ownPlayerName = document.querySelector('.playerlist-row .playerlist-name-self');
    if (ownPlayerName) {
        const ownPlayerRow = ownPlayerName.closest('.playerlist-row');
        if (ownPlayerRow) {
            return ownPlayerRow.dataset.playerid;
        }
    }

    // Método 2: Buscar directamente en el avatar si está visible
    const ownAvatar = document.querySelector('.spawnedavatar-self');
    if (ownAvatar) {
        return ownAvatar.dataset.playerid;
    }

    console.warn('getOwnPlayerId: No se pudo encontrar el jugador propio.');
    return null;
}

/**
 * Obtiene las coordenadas del centro del jugador propio
 * @returns {object|null} - {x, y} o null si no se encuentra
 */
function getOwnPlayerCoords() {
    const ownPlayerId = getOwnPlayerId();
    if (!ownPlayerId) return null;
    return getTargetCoords(ownPlayerId); // Reutilizar getTargetCoords que usa _getAttachmentPoint
}


    // Asegurarse de limpiar el intervalo si el usuario cambia de página o cierra el script
    window.addEventListener('beforeunload', () => {
        if (repeatIntervalId) {
            clearInterval(repeatIntervalId);
            repeatIntervalId = null;
        }
        stopSignal = true; // Señal de parada al salir
    });

    const plEl = document.getElementById('playerlist');
    if (plEl) {
        new MutationObserver(debouncedRefresh).observe(plEl, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-playerid']
        });
    }

    refreshPlayerList();

})();