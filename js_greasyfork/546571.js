// ==UserScript==
// @name         Epic Pixel Laser Destroyer for Drawaria
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Capture drawn pixels from canvas and DESTROY them with epic laser beams!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/546571/Epic%20Pixel%20Laser%20Destroyer%20for%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/546571/Epic%20Pixel%20Laser%20Destroyer%20for%20Drawaria.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------  CONFIGURACIÓN DEL SISTEMA LÁSER  ---------- */

    const LASER_MODES = {
        'Láser Rojo Clásico': {
            color: '#ff0000',
            name: '🔴 Classic Red Laser',
            particles: 'fire',
            speed: 'fast'
        },
        'Láser Azul Industrial': {
            color: '#00ffff',
            name: '🔵 Industrial Blue Laser',
            particles: 'electric',
            speed: 'medium'
        },
        'Láser Verde Militar': {
            color: '#00ff00',
            name: '🟢 Military Green Laser',
            particles: 'smoke',
            speed: 'precise'
        },
        'Plasma Púrpura': {
            color: '#ff00ff',
            name: '🟣 Purple Plasma Beam',
            particles: 'energy',
            speed: 'slow'
        },
        'Láser Dorado Épico': {
            color: '#ffd700',
            name: '🟡 Epic Golden Laser',
            particles: 'golden',
            speed: 'instant'
        }
    };

    /* ----------  VARIABLES GLOBALES  ---------- */

    let canvas, ctx, socket;
    let currentLaserMode = 'Láser Rojo Clásico';
    let laserIntensity = 3;
    let isDestroying = false;
    let drawingPixels = []; // Almacena píxeles dibujados capturados
    let sampleRate = 4; // Rate de muestreo para reducir píxeles por rendimiento
    let originalWebSocketSend;

    /* ----------  SISTEMA DE CAPTURA DE PÍXELES  ---------- */

    function captureDrawingPixels() {
        if (!canvas || !ctx) {
            console.warn("Canvas no encontrado o no inicializado");
            return false;
        }

        const cw = canvas.width;
        const ch = canvas.height;
        const imageData = ctx.getImageData(0, 0, cw, ch);
        const data = imageData.data;
        drawingPixels = [];

        // Usar la misma lógica que GenerativeAnimatorTool
        for (let y = 0; y < ch; y += sampleRate) {
            for (let x = 0; x < cw; x += sampleRate) {
                const i = (y * cw + x) * 4;

                // Un píxel se considera "dibujado" si no es totalmente transparente (alpha > 100)
                // Y si no es un blanco casi puro (R, G, B < 250)
                if (data[i + 3] > 100 && (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250)) {
                    drawingPixels.push({
                        x: x,
                        y: y,
                        normalizedX: x / cw,
                        normalizedY: y / ch,
                        color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
                        r: data[i],
                        g: data[i + 1],
                        b: data[i + 2],
                        a: data[i + 3]
                    });
                }
            }
        }

        console.log(`🎨 Píxeles capturados: ${drawingPixels.length} puntos detectados`);
        return drawingPixels.length > 0;
    }

    /* ----------  FUNCIONES AUXILIARES DE WEBSOCKET  ---------- */

    function initializeWebSocketInterceptor() {
        originalWebSocketSend = WebSocket.prototype.send;

        WebSocket.prototype.send = function (data) {
            if (!socket) socket = this;
            return originalWebSocketSend.call(this, data);
        };
    }

    function getGameSocket() {
        return socket;
    }

    function sendLaserToServer(x1, y1, x2, y2, color, thickness) {
        if (!socket || !canvas) return;

        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);

        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${thickness},"${color}",0,0,{}]]`;
        originalWebSocketSend.call(socket, cmd);
    }

    function sendEraseCommand(x, y, size) {
        if (!socket || !canvas) return;

        const normX1 = ((x - size) / canvas.width).toFixed(4);
        const normY1 = ((y - size) / canvas.height).toFixed(4);
        const normX2 = ((x + size) / canvas.width).toFixed(4);
        const normY2 = ((y + size) / canvas.height).toFixed(4);

        const eraseCmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-(size * 2)},"#000000",0,0,{}]]`;
        originalWebSocketSend.call(socket, eraseCmd);
    }

    /* ----------  EFECTOS VISUALES DEL LÁSER  ---------- */

    function drawLaserBeam(startX, startY, endX, endY, laserColor, intensity = 3) {
        if (!ctx) return;

        // Núcleo brillante del láser
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3 + intensity;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = laserColor;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Halo exterior
        ctx.strokeStyle = laserColor;
        ctx.lineWidth = 8 + intensity * 2;
        ctx.shadowBlur = 25;
        ctx.globalAlpha = 0.8;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Limpiar efectos
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // Enviar al servidor
        sendLaserToServer(startX, startY, endX, endY, laserColor, 8 + intensity * 2);
    }

    function createVaporizationParticles(x, y, originalPixel, particleType) {
        if (!ctx) return;

        const particleCount = 8 + laserIntensity * 2;
        let particleColors;

        switch (particleType) {
            case 'fire':
                particleColors = ['#ff4500', '#ff6600', '#ffa500', '#ff0000'];
                break;
            case 'electric':
                particleColors = ['#00ffff', '#87ceeb', '#ffffff', '#add8e6'];
                break;
            case 'smoke':
                particleColors = ['#696969', '#808080', '#a0a0a0', '#778899'];
                break;
            case 'energy':
                particleColors = ['#ff00ff', '#ff69b4', '#da70d6', '#dda0dd'];
                break;
            case 'golden':
                particleColors = ['#ffd700', '#ffdf00', '#fff700', '#f0e68c'];
                break;
            default:
                particleColors = [originalPixel.color, '#ffffff', '#f0f0f0'];
        }

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
                const distance = 15 + Math.random() * 25;
                const particleX = x + distance * Math.cos(angle);
                const particleY = y + distance * Math.sin(angle);
                const color = particleColors[Math.floor(Math.random() * particleColors.length)];

                // Dibujar partícula local
                ctx.fillStyle = color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = color;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(particleX - 2, particleY - 2, 4, 4);
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 0;

                // Enviar partícula al servidor
                sendLaserToServer(x, y, particleX, particleY, color, 3);

            }, i * 30);
        }
    }

    function createPixelShockwave(x, y, intensity) {
        if (!ctx) return;

        const maxRadius = 30 + intensity * 8;
        let currentRadius = 0;

        const shockwaveInterval = setInterval(() => {
            currentRadius += 4;

            if (currentRadius > maxRadius) {
                clearInterval(shockwaveInterval);
                return;
            }

            const alpha = 1 - (currentRadius / maxRadius);
            const color = LASER_MODES[currentLaserMode].color;

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = alpha * 0.6;
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;

            ctx.beginPath();
            ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
        }, 50);
    }

    /* ----------  SISTEMA DE DESTRUCCIÓN LÁSER POR PÍXELES  ---------- */

    async function laserDestroyPixels() {
        if (isDestroying) {
            console.log('🚫 Ya hay una destrucción en curso');
            return;
        }

        // Capturar píxeles actuales
        const captured = captureDrawingPixels();

        if (!captured || drawingPixels.length === 0) {
            alert('🚫 No hay píxeles dibujados para destruir. ¡Dibuja algo primero!');
            return;
        }

        if (!getGameSocket()) {
            alert('🚫 No hay conexión WebSocket. Conéctate a una sala primero.');
            return;
        }

        isDestroying = true;
        console.log(`🔫 Iniciando destrucción láser de ${drawingPixels.length} píxeles`);

        const laserMode = LASER_MODES[currentLaserMode];
        const pixelsCopy = [...drawingPixels];

        // Agrupar píxeles cercanos para mayor eficiencia
        const pixelGroups = groupNearbyPixels(pixelsCopy, 20);
        console.log(`📊 ${pixelsCopy.length} píxeles agrupados en ${pixelGroups.length} grupos`);

        // Configurar velocidad según el modo
        let destroySpeed;
        switch (laserMode.speed) {
            case 'instant': destroySpeed = 30; break;
            case 'fast': destroySpeed = 80; break;
            case 'medium': destroySpeed = 150; break;
            case 'precise': destroySpeed = 300; break;
            case 'slow': destroySpeed = 500; break;
            default: destroySpeed = 150;
        }

        for (let i = 0; i < pixelGroups.length; i++) {
            if (!isDestroying) break;

            const group = pixelGroups[i];
            const centerPixel = group[Math.floor(group.length / 2)]; // Pixel central del grupo
            const targetX = centerPixel.x;
            const targetY = centerPixel.y;

            // Puntos de origen del láser (variados)
            const laserOrigins = [
                { x: targetX + (Math.random() - 0.5) * 100, y: -30 }, // Desde arriba
                { x: -30, y: targetY + (Math.random() - 0.5) * 50 },  // Desde la izquierda
                { x: canvas.width + 30, y: targetY + (Math.random() - 0.5) * 50 }, // Desde la derecha
                { x: targetX + (Math.random() - 0.5) * 100, y: canvas.height + 30 } // Desde abajo
            ];

            const origin = laserOrigins[i % laserOrigins.length];

            // Efectos de pre-carga
            setTimeout(() => {
                if (!isDestroying) return;

                // Punto de carga del láser
                ctx.fillStyle = laserMode.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = laserMode.color;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(origin.x - 2, origin.y - 2, 4, 4);
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 0;

            }, i * destroySpeed);

            // Disparo del láser
            setTimeout(() => {
                if (!isDestroying) return;

                // Rayo láser principal
                drawLaserBeam(origin.x, origin.y, targetX, targetY, laserMode.color, laserIntensity);

                // Efectos de impacto
                createPixelShockwave(targetX, targetY, laserIntensity);
                createVaporizationParticles(targetX, targetY, centerPixel, laserMode.particles);

            }, i * destroySpeed + 100);

            // Borrado de píxeles del grupo
            setTimeout(() => {
                if (!isDestroying) return;

                // Borrar cada píxel del grupo
                group.forEach(pixel => {
                    // Borrar localmente
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(pixel.x - 2, pixel.y - 2, 4, 4);
                    ctx.globalCompositeOperation = 'source-over';
                });

                // Enviar comando de borrado al servidor para el grupo
                const eraseSize = Math.max(4, group.length / 3);
                sendEraseCommand(targetX, targetY, eraseSize);

            }, i * destroySpeed + 250);
        }

        // Finalizar destrucción
        setTimeout(() => {
            drawingPixels = [];
            isDestroying = false;
            console.log('🔥 ¡Destrucción por píxeles completada!');
        }, pixelGroups.length * destroySpeed + 1000);
    }

    function groupNearbyPixels(pixels, maxDistance) {
        const groups = [];
        const used = new Set();

        pixels.forEach((pixel, index) => {
            if (used.has(index)) return;

            const group = [pixel];
            used.add(index);

            // Buscar píxeles cercanos
            for (let i = index + 1; i < pixels.length; i++) {
                if (used.has(i)) continue;

                const otherPixel = pixels[i];
                const distance = Math.sqrt(
                    Math.pow(pixel.x - otherPixel.x, 2) +
                    Math.pow(pixel.y - otherPixel.y, 2)
                );

                if (distance <= maxDistance) {
                    group.push(otherPixel);
                    used.add(i);
                }
            }

            groups.push(group);
        });

        return groups;
    }

    function stopDestruction() {
        isDestroying = false;
        console.log('🛑 Destrucción láser detenida por el usuario');
    }

    /* ----------  INTERFAZ DE USUARIO  ---------- */

    function createLaserUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 9999;
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            color: #fff; padding: 20px; border-radius: 15px;
            font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif; font-size: 13px;
            display: flex; flex-direction: column; gap: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
            border: 2px solid #ff6b35; min-width: 320px;
            backdrop-filter: blur(10px);
        `;

        // Título
        const title = document.createElement('div');
        title.innerHTML = '🎨 PIXEL LASER DESTROYER 🔫';
        title.style.cssText = `
            font-weight: bold; font-size: 16px; text-align: center; cursor: grab;
            background: linear-gradient(45deg, #ff6b35, #f7931e, #ffcc02);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
            margin: -20px -20px 10px -20px; padding: 20px;
            border-bottom: 2px solid rgba(255, 107, 53, 0.3);
            border-radius: 15px 15px 0 0;
        `;
        container.appendChild(title);

        // Estado de conexión
        const connectionStatus = document.createElement('div');
        connectionStatus.style.cssText = `
            background: rgba(255, 107, 53, 0.2); padding: 10px; border-radius: 8px;
            text-align: center; font-size: 12px; display: flex; align-items: center; gap: 8px;
        `;
        container.appendChild(connectionStatus);

        // Información de píxeles capturados
        const pixelInfo = document.createElement('div');
        pixelInfo.style.cssText = `
            background: rgba(0, 255, 255, 0.1); padding: 10px; border-radius: 8px;
            text-align: center; font-size: 14px; font-weight: bold;
        `;
        container.appendChild(pixelInfo);

        // Botón de captura manual
        const captureBtn = document.createElement('button');
        captureBtn.textContent = '📷 Scan Drawing Pixels';
        captureBtn.style.cssText = `
            padding: 12px 15px; border-radius: 8px; border: none; font-size: 14px;
            background: linear-gradient(145deg, #00ffff, #0080ff); color: #000;
            font-weight: bold; cursor: pointer; transition: all 0.3s ease;
        `;
        captureBtn.addEventListener('click', () => {
            const captured = captureDrawingPixels();
            if (captured) {
                console.log(`📷 Captura manual: ${drawingPixels.length} píxeles detectados`);
            }
        });
        container.appendChild(captureBtn);

        // Selector de modo láser
        const modeRow = createControlRow('🎯 Laser Mode:');
        const modeSelect = document.createElement('select');
        modeSelect.style.cssText = getSelectStyle();

        Object.keys(LASER_MODES).forEach(modeName => {
            const option = document.createElement('option');
            option.value = modeName;
            option.textContent = LASER_MODES[modeName].name;
            modeSelect.appendChild(option);
        });

        modeSelect.value = currentLaserMode;
        modeSelect.addEventListener('change', (e) => {
            currentLaserMode = e.target.value;
            console.log(`🔫 Modo láser: ${currentLaserMode}`);
        });

        modeRow.appendChild(modeSelect);
        container.appendChild(modeRow);

        // Control de intensidad
        const intensityRow = createControlRow('⚡ Power:');
        const intensitySlider = document.createElement('input');
        intensitySlider.type = 'range';
        intensitySlider.min = '1';
        intensitySlider.max = '5';
        intensitySlider.value = laserIntensity.toString();
        intensitySlider.style.cssText = getSliderStyle();

        intensitySlider.addEventListener('input', (e) => {
            laserIntensity = parseInt(e.target.value);
        });

        intensityRow.appendChild(intensitySlider);
        container.appendChild(intensityRow);

        // Control de sample rate
        const sampleRow = createControlRow('🔍 Quality:');
        const sampleSlider = document.createElement('input');
        sampleSlider.type = 'range';
        sampleSlider.min = '1';
        sampleSlider.max = '8';
        sampleSlider.value = sampleRate.toString();
        sampleSlider.style.cssText = getSliderStyle();

        sampleSlider.addEventListener('input', (e) => {
            sampleRate = parseInt(e.target.value);
            console.log(`🔍 Sample rate: ${sampleRate} (menor = más píxeles)`);
        });

        sampleRow.appendChild(sampleSlider);
        container.appendChild(sampleRow);

        // Botón principal de destrucción
        const destroyBtn = document.createElement('button');
        destroyBtn.textContent = '🔥 VAPORIZE ALL PIXELS 🔥';
        destroyBtn.style.cssText = `
            padding: 15px 20px; border-radius: 10px; border: none; font-size: 16px;
            background: linear-gradient(145deg, #ff6b35, #f7931e); color: white;
            font-weight: bold; cursor: pointer; transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); text-transform: uppercase;
        `;

        destroyBtn.addEventListener('click', laserDestroyPixels);
        container.appendChild(destroyBtn);

        // Botón de parada
        const stopBtn = document.createElement('button');
        stopBtn.textContent = '🛑 STOP VAPORIZATION';
        stopBtn.style.cssText = `
            padding: 12px 18px; border-radius: 8px; border: none; font-size: 14px;
            background: linear-gradient(145deg, #ff1744, #d50000); color: white;
            font-weight: bold; cursor: pointer; transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 23, 68, 0.4);
        `;

        stopBtn.addEventListener('click', stopDestruction);
        container.appendChild(stopBtn);

        // Botón para limpiar píxeles
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️ Clear Pixel Memory';
        clearBtn.style.cssText = `
            padding: 10px 15px; border-radius: 8px; border: none; font-size: 12px;
            background: linear-gradient(145deg, #666, #444); color: white;
            cursor: pointer; transition: all 0.3s ease;
        `;

        clearBtn.addEventListener('click', () => {
            drawingPixels = [];
            console.log('🗑️ Memoria de píxeles limpiada');
        });
        container.appendChild(clearBtn);

        document.body.appendChild(container);
        makeDraggable(container, title);

        // Actualizar información periódicamente
        setInterval(() => {
            const isConnected = getGameSocket() !== null;

            connectionStatus.innerHTML = `
                <span style="width: 12px; height: 12px; border-radius: 50%; background: ${isConnected ? '#00ff00' : '#ff0000'}; display: inline-block;"></span>
                <span>WebSocket: ${isConnected ? 'Connected' : 'Disconnected'}</span>
            `;

            pixelInfo.innerHTML = `
                📊 Detected Pixels: <span style="color: #ff6b35;">${drawingPixels.length}</span><br>
                🔍 Sample Rate: ${sampleRate} | ⚡ Power: ${laserIntensity}<br>
                💡 Draw something, then VAPORIZE!
            `;
        }, 1000);
    }

    function createControlRow(label) {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; gap: 12px;';

        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.cssText = 'color: #ff6b35; font-weight: bold; min-width: 110px;';
        row.appendChild(labelEl);

        return row;
    }

    function getSelectStyle() {
        return `
            flex-grow: 1; padding: 8px 12px; border-radius: 8px;
            border: 2px solid #ff6b35; background: rgba(20, 20, 40, 0.8);
            color: #ff6b35; font-size: 13px; cursor: pointer;
        `;
    }

    function getSliderStyle() {
        return `
            flex-grow: 1; -webkit-appearance: none; height: 6px; border-radius: 5px;
            background: linear-gradient(to right, #ff6b35 0%, #f7931e 100%);
        `;
    }

    function makeDraggable(container, handle) {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffsetX = e.clientX - container.offsetLeft;
            dragOffsetY = e.clientY - container.offsetTop;
            handle.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = (e.clientX - dragOffsetX) + 'px';
                container.style.top = (e.clientY - dragOffsetY) + 'px';
                container.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            handle.style.cursor = 'grab';
        });
    }

    /* ----------  INICIALIZACIÓN  ---------- */

    function initialize() {
        console.log('🎨 Iniciando Pixel Laser Destroyer...');

        const checkCanvas = setInterval(() => {
            canvas = document.getElementById('canvas');
            ctx = canvas ? canvas.getContext('2d') : null;

            if (canvas && ctx) {
                clearInterval(checkCanvas);

                initializeWebSocketInterceptor();
                createLaserUI();

                console.log('🔫 Pixel Laser Destroyer listo!');
                console.log('🎨 Dibuja algo, luego usa VAPORIZE ALL PIXELS');
                console.log('📷 El script detecta píxeles automáticamente usando getImageData()');
            }
        }, 500);
    }

    // Inicializar cuando la página esté lista
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
