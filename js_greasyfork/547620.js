// ==UserScript==
// @name         Drawaria Pixel Art Studio
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A pixelart tool with colors and figures to draw
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/547620/Drawaria%20Pixel%20Art%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/547620/Drawaria%20Pixel%20Art%20Studio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Canvas and WebSocket Setup ===
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let socket;
    let canvasCenter = { x: 0, y: 0 };
    let canvasDimensions = { width: 0, height: 0 };

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) {
            socket = this;
        }
        return originalSend.apply(this, args);
    };

    // === Canvas Detection and Center Calculation ===
    function detectCanvasInfo() {
        // Intentar obtener el canvas principal
        const drawingCanvas = document.querySelector("#drawing-assistant-overlay") ||
                             document.getElementById('canvas') ||
                             document.querySelector('canvas');

        if (drawingCanvas) {
            // Obtener dimensiones reales del canvas
            const rect = drawingCanvas.getBoundingClientRect();
            canvasDimensions.width = drawingCanvas.width || rect.width;
            canvasDimensions.height = drawingCanvas.height || rect.height;

            // Calcular centro
            canvasCenter.x = Math.floor(canvasDimensions.width / 2);
            canvasCenter.y = Math.floor(canvasDimensions.height / 2);

            console.log(`📐 Canvas detectado - Tamaño: ${canvasDimensions.width}x${canvasDimensions.height} - Centro: (${canvasCenter.x}, ${canvasCenter.y})`);

            return true;
        }
        return false;
    }

    // === Console Status System (Replaces Visual Panel) ===
    function updateStatus(message, show = true) {
        if (show) {
            // Limpiar HTML tags para consola
            const cleanMessage = message.replace(/<br\/>/g, ' | ').replace(/<[^>]*>/g, '');
            console.log(`🎨 PIXEL STUDIO: ${cleanMessage}`);
        }
    }

    // === Drawing Functions with Local Rendering ===
    function sendDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!socket || !canvas) return;
        const normX1 = (x1 / canvasDimensions.width).toFixed(4);
        const normY1 = (y1 / canvasDimensions.height).toFixed(4);
        const normX2 = (x2 / canvasDimensions.width).toFixed(4);
        const normY2 = (y2 / canvasDimensions.height).toFixed(4);
        const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(command);
    }

    // === LOCAL PIXEL DRAWING FUNCTION ===
    function drawPixelLocally(x, y, width, height, color) {
        if (!ctx || !canvas) return;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    // === ADVANCED PIXEL FILL WITH LOCAL RENDERING ===
    function fillPixelAdvanced(x, y, pixelSize, color, thickness = 2) {
        drawPixelLocally(x, y, pixelSize, pixelSize, color);

        const step = Math.max(1, Math.floor(thickness));

        // Líneas horizontales para rellenar
        for (let i = 0; i < pixelSize; i += step) {
            sendDrawCommand(x, y + i, x + pixelSize, y + i, color, thickness);
        }

        // Líneas verticales adicionales para mayor cobertura
        for (let i = 0; i < pixelSize; i += step * 2) {
            sendDrawCommand(x + i, y, x + i, y + pixelSize, color, Math.max(1, thickness - 1));
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // === PIXEL ART PATTERNS ===
    const pixelPatterns = {
        'smiley': [
            "  YYYYYYY  ",
            " Y       Y ",
            "Y  BB BB  Y",
            "Y         Y",
            "Y  B   B  Y",
            "Y   BBB   Y",
            " Y       Y ",
            "  YYYYYYY  "
        ],
        'heart': [
            " RR   RR ",
            "RRRR RRRR",
            "RRRRRRRRR",
            " RRRRRRR ",
            "  RRRRR  ",
            "   RRR   ",
            "    R    "
        ],
        'mushroom': [
            "   RRRRR   ",
            "  RRR RRR  ",
            " RRR W RRR ",
            "RRRRRRRRRRR",
            "   WWWWW   ",
            "   WWWWW   ",
            "   WWWWW   ",
            "  WWWWWWW  "
        ],
        'flower': [
            "  R   R  ",
            " RRR RRR ",
            "RRR Y RRR",
            "RRR Y RRR",
            "  RRRRR  ",
            "   GGG   ",
            "   GGG   ",
            "   GGG   "
        ],
        'cat': [
            "W   W W   W",
            " W W   W W ",
            "  WWWWWWW  ",
            " WWWWWWWWW ",
            "WW RR RR WW",
            "W    B    W",
            "W  BBBBB  W",
            " WWWWWWWWW "
        ],
        'tree': [
            "    GGG    ",
            "   GGGGG   ",
            "  GGGGGGG  ",
            " GGGGGGGGG ",
            "GGGGGGGGGGG",
            "    BBB    ",
            "    BBB    ",
            "    BBB    "
        ],
        'house': [
            "   RRRRR   ",
            "  RRRRRRR  ",
            " RRRRRRRRR ",
            "RRRRRRRRRRR",
            "BBBBBBBBBBB",
            "B YY B BB B",
            "B YY B BB B",
            "B    B    B",
            "BBBBBBBBBBB"
        ]
    };

    const colorSchemes = {
        classic: {
            'Y': '#FFFF00', 'B': '#000000', 'R': '#FF0000', 'W': '#FFFFFF', 'G': '#00FF00', ' ': null
        },
        neon: {
            'Y': '#FFFF00', 'B': '#FF00FF', 'R': '#00FFFF', 'W': '#FFFFFF', 'G': '#00FF00', ' ': null
        },
        pastel: {
            'Y': '#FFE4B5', 'B': '#87CEEB', 'R': '#FFB6C1', 'W': '#F5F5F5', 'G': '#98FB98', ' ': null
        },
        dark: {
            'Y': '#DAA520', 'B': '#2F2F2F', 'R': '#8B0000', 'W': '#D3D3D3', 'G': '#006400', ' ': null
        },
        rainbow: {
            'Y': '#FFFF00', 'B': '#4B0082', 'R': '#FF1493', 'W': '#FFFFFF', 'G': '#32CD32', ' ': null
        },
        fire: {
            'Y': '#FFD700', 'B': '#8B0000', 'R': '#FF4500', 'W': '#FFA500', 'G': '#FF6347', ' ': null
        }
    };

    // === PIXEL ART CREATION WITH POSITIONING ===
    async function createCustomPixelArt(patternName, colorScheme, pixelSize, offsetX = 0, offsetY = 0) {
        if (!socket || !canvas || !ctx) return;

        const pattern = pixelPatterns[patternName];
        const colors = colorSchemes[colorScheme];

        if (!pattern || !colors) return;

        const totalWidth = pattern.length * pixelSize;
        const totalHeight = pattern.length * pixelSize;

        // Calcular posición con offset personalizado
        const startX = Math.max(0, canvasCenter.x - totalWidth / 2 + offsetX);
        const startY = Math.max(0, canvasCenter.y - totalHeight / 2 + offsetY);

        console.log(`🎨 Iniciando dibujo: ${patternName.toUpperCase()} - Posición: (${Math.floor(startX)}, ${Math.floor(startY)}) - Tamaño: ${pixelSize}px`);

        let pixelsDrawn = 0;
        let totalPixels = 0;

        // Contar píxeles totales
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (colors[pattern[row][col]]) totalPixels++;
            }
        }

        // Dibujar patrón
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                const char = pattern[row][col];
                if (!colors[char]) continue;

                const x = startX + col * pixelSize;
                const y = startY + row * pixelSize;

                fillPixelAdvanced(x, y, pixelSize, colors[char], Math.max(1, pixelSize <= 2 ? 1 : 2));

                pixelsDrawn++;

                if (pixelsDrawn % 10 === 0) {
                    const progress = Math.round((pixelsDrawn / totalPixels) * 100);
                    console.log(`🎨 Progreso ${patternName.toUpperCase()}: ${progress}% - Píxeles: ${pixelsDrawn}/${totalPixels}`);
                }

                if (pixelsDrawn % 3 === 0) {
                    await sleep(pixelSize <= 2 ? 2 : 5);
                }
            }

            await sleep(pixelSize <= 2 ? 5 : 10);
        }

        console.log(`✅ ${patternName.toUpperCase()} COMPLETADO - Total píxeles: ${pixelsDrawn} - Posición final: (${Math.floor(startX)}, ${Math.floor(startY)})`);
    }

    // === INTERFACE CREATION ===
    function createPixelStudio() {
        const studio = document.createElement('div');
        studio.style.position = 'fixed';
        studio.style.top = '20px';
        studio.style.left = '1400px';
        studio.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        studio.style.padding = '20px';
        studio.style.zIndex = '1001';
        studio.style.border = '3px solid #4a90e2';
        studio.style.borderRadius = '12px';
        studio.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
        studio.style.fontFamily = 'Arial, sans-serif';
        studio.style.width = '300px';
        studio.style.maxHeight = '80vh';
        studio.style.overflowY = 'auto';

        // === HEADER ===
        const header = document.createElement('div');
        header.innerHTML = '🎨 PIXEL ART STUDIO';
        header.style.fontSize = '16px';
        header.style.fontWeight = 'bold';
        header.style.color = '#4a90e2';
        header.style.textAlign = 'center';
        header.style.marginBottom = '15px';
        header.style.textShadow = '1px 1px 2px rgba(0,0,0,0.1)';
        studio.appendChild(header);

        // === CANVAS INFO ===
        const infoSection = document.createElement('div');
        infoSection.style.marginBottom = '15px';
        infoSection.style.padding = '8px';
        infoSection.style.backgroundColor = '#f8f9fa';
        infoSection.style.borderRadius = '5px';
        infoSection.style.fontSize = '12px';
        infoSection.style.color = '#666';

        const canvasInfo = document.createElement('div');
        canvasInfo.id = 'canvas-info';
        canvasInfo.innerHTML = `📐 Canvas: ${canvasDimensions.width}x${canvasDimensions.height}<br/>🎯 Centro: (${canvasCenter.x}, ${canvasCenter.y})`;

        infoSection.appendChild(canvasInfo);
        studio.appendChild(infoSection);

        // === PATTERN SELECTOR ===
        const patternSection = document.createElement('div');
        patternSection.style.marginBottom = '15px';

        const patternLabel = document.createElement('label');
        patternLabel.innerText = '🖼️ Selecciona Patrón:';
        patternLabel.style.display = 'block';
        patternLabel.style.fontWeight = 'bold';
        patternLabel.style.color = '#333';
        patternLabel.style.marginBottom = '5px';

        const patternSelect = document.createElement('select');
        patternSelect.id = 'pattern-select';
        patternSelect.style.width = '100%';
        patternSelect.style.padding = '8px';
        patternSelect.style.borderRadius = '5px';
        patternSelect.style.border = '2px solid #4a90e2';
        patternSelect.style.fontSize = '14px';

        Object.keys(pixelPatterns).forEach(pattern => {
            const option = document.createElement('option');
            option.value = pattern;
            option.textContent = pattern.charAt(0).toUpperCase() + pattern.slice(1);
            patternSelect.appendChild(option);
        });

        patternSection.appendChild(patternLabel);
        patternSection.appendChild(patternSelect);

        // === COLOR SCHEME SELECTOR ===
        const colorSection = document.createElement('div');
        colorSection.style.marginBottom = '15px';

        const colorLabel = document.createElement('label');
        colorLabel.innerText = '🎨 Esquema de Colores:';
        colorLabel.style.display = 'block';
        colorLabel.style.fontWeight = 'bold';
        colorLabel.style.color = '#333';
        colorLabel.style.marginBottom = '5px';

        const colorSelect = document.createElement('select');
        colorSelect.id = 'color-select';
        colorSelect.style.width = '100%';
        colorSelect.style.padding = '8px';
        colorSelect.style.borderRadius = '5px';
        colorSelect.style.border = '2px solid #e74c3c';
        colorSelect.style.fontSize = '14px';

        Object.keys(colorSchemes).forEach(scheme => {
            const option = document.createElement('option');
            option.value = scheme;
            option.textContent = scheme.charAt(0).toUpperCase() + scheme.slice(1);
            colorSelect.appendChild(option);
        });

        colorSection.appendChild(colorLabel);
        colorSection.appendChild(colorSelect);

        // === SIZE SELECTOR (1px minimum) ===
        const sizeSection = document.createElement('div');
        sizeSection.style.marginBottom = '15px';

        const sizeLabel = document.createElement('label');
        sizeLabel.innerText = '📏 Tamaño de Píxel:';
        sizeLabel.style.display = 'block';
        sizeLabel.style.fontWeight = 'bold';
        sizeLabel.style.color = '#333';
        sizeLabel.style.marginBottom = '5px';

        const sizeRange = document.createElement('input');
        sizeRange.type = 'range';
        sizeRange.id = 'size-range';
        sizeRange.min = '1';
        sizeRange.max = '50';
        sizeRange.value = '15';
        sizeRange.style.width = '100%';
        sizeRange.style.marginBottom = '5px';

        const sizeValue = document.createElement('span');
        sizeValue.id = 'size-value';
        sizeValue.innerText = '15px';
        sizeValue.style.fontSize = '12px';
        sizeValue.style.color = '#666';

        sizeRange.oninput = () => {
            sizeValue.innerText = sizeRange.value + 'px';
            if (parseInt(sizeRange.value) <= 3) {
                sizeValue.style.color = '#e74c3c';
                sizeValue.innerText += ' (Ultra Preciso)';
            } else {
                sizeValue.style.color = '#666';
            }
        };

        sizeSection.appendChild(sizeLabel);
        sizeSection.appendChild(sizeRange);
        sizeSection.appendChild(sizeValue);

        // === POSITION CONTROLS (X/Y) ===
        const positionSection = document.createElement('div');
        positionSection.style.marginBottom = '15px';
        positionSection.style.padding = '10px';
        positionSection.style.backgroundColor = '#f8f9fa';
        positionSection.style.borderRadius = '8px';
        positionSection.style.border = '2px solid #28a745';

        const positionLabel = document.createElement('label');
        positionLabel.innerText = '🎯 Posicionamiento:';
        positionLabel.style.display = 'block';
        positionLabel.style.fontWeight = 'bold';
        positionLabel.style.color = '#28a745';
        positionLabel.style.marginBottom = '10px';

        // X Position Slider
        const xPositionDiv = document.createElement('div');
        xPositionDiv.style.marginBottom = '8px';

        const xLabel = document.createElement('label');
        xLabel.innerText = '↔️ Posición X:';
        xLabel.style.display = 'block';
        xLabel.style.fontSize = '12px';
        xLabel.style.color = '#333';
        xLabel.style.marginBottom = '3px';

        const xRange = document.createElement('input');
        xRange.type = 'range';
        xRange.id = 'x-range';
        xRange.min = -canvasDimensions.width / 2;
        xRange.max = canvasDimensions.width / 2;
        xRange.value = '0';
        xRange.style.width = '100%';

        const xValue = document.createElement('span');
        xValue.id = 'x-value';
        xValue.innerText = 'Centro (0)';
        xValue.style.fontSize = '11px';
        xValue.style.color = '#666';

        xRange.oninput = () => {
            const val = parseInt(xRange.value);
            xValue.innerText = val === 0 ? 'Centro (0)' :
                             val > 0 ? `Derecha (+${val})` : `Izquierda (${val})`;
        };

        xPositionDiv.appendChild(xLabel);
        xPositionDiv.appendChild(xRange);
        xPositionDiv.appendChild(xValue);

        // Y Position Slider
        const yPositionDiv = document.createElement('div');

        const yLabel = document.createElement('label');
        yLabel.innerText = '↕️ Posición Y:';
        yLabel.style.display = 'block';
        yLabel.style.fontSize = '12px';
        yLabel.style.color = '#333';
        yLabel.style.marginBottom = '3px';

                const yRange = document.createElement('input');
        yRange.type = 'range';
        yRange.id = 'y-range';
        yRange.min = -canvasDimensions.height / 2;
        yRange.max = canvasDimensions.height / 2;
        yRange.value = '0';
        yRange.style.width = '100%';

        const yValue = document.createElement('span');
        yValue.id = 'y-value';
        yValue.innerText = 'Centro (0)';
        yValue.style.fontSize = '11px';
        yValue.style.color = '#666';

        yRange.oninput = () => {
            const val = parseInt(yRange.value);
            yValue.innerText = val === 0 ? 'Centro (0)' :
                             val > 0 ? `Abajo (+${val})` : `Arriba (${val})`;
        };

        yPositionDiv.appendChild(yLabel);
        yPositionDiv.appendChild(yRange);
        yPositionDiv.appendChild(yValue);

        // Center Reset Button
        const centerButton = document.createElement('button');
        centerButton.innerHTML = '🎯 CENTRAR';
        centerButton.style.width = '100%';
        centerButton.style.padding = '5px';
        centerButton.style.backgroundColor = '#6c757d';
        centerButton.style.color = 'white';
        centerButton.style.border = 'none';
        centerButton.style.borderRadius = '4px';
        centerButton.style.fontSize = '11px';
        centerButton.style.marginTop = '8px';
        centerButton.style.cursor = 'pointer';

        centerButton.onclick = () => {
            xRange.value = '0';
            yRange.value = '0';
            xValue.innerText = 'Centro (0)';
            yValue.innerText = 'Centro (0)';
            console.log('🎯 Posicionamiento centrado: X=0, Y=0');
        };

        positionSection.appendChild(positionLabel);
        positionSection.appendChild(xPositionDiv);
        positionSection.appendChild(yPositionDiv);
        positionSection.appendChild(centerButton);

        // === PREVIEW AREA ===
        const previewSection = document.createElement('div');
        previewSection.style.marginBottom = '15px';
        previewSection.style.textAlign = 'center';

        const previewLabel = document.createElement('label');
        previewLabel.innerText = '👁️ Vista Previa:';
        previewLabel.style.display = 'block';
        previewLabel.style.fontWeight = 'bold';
        previewLabel.style.color = '#333';
        previewLabel.style.marginBottom = '8px';

        const previewCanvas = document.createElement('canvas');
        previewCanvas.id = 'preview-canvas';
        previewCanvas.width = 120;
        previewCanvas.height = 120;
        previewCanvas.style.border = '2px solid #ccc';
        previewCanvas.style.borderRadius = '8px';
        previewCanvas.style.backgroundColor = '#f9f9f9';

        previewSection.appendChild(previewLabel);
        previewSection.appendChild(previewCanvas);

        // === ACTION BUTTONS ===
        const buttonSection = document.createElement('div');
        buttonSection.style.textAlign = 'center';

        const drawButton = document.createElement('button');
        drawButton.innerHTML = '🎨 DIBUJAR PIXEL ART';
        drawButton.style.width = '100%';
        drawButton.style.padding = '12px';
        drawButton.style.backgroundColor = '#27ae60';
        drawButton.style.color = 'white';
        drawButton.style.border = 'none';
        drawButton.style.borderRadius = '8px';
        drawButton.style.fontSize = '14px';
        drawButton.style.fontWeight = 'bold';
        drawButton.style.cursor = 'pointer';
        drawButton.style.marginBottom = '10px';
        drawButton.style.transition = 'all 0.3s ease';

        drawButton.onmouseover = () => drawButton.style.backgroundColor = '#229954';
        drawButton.onmouseout = () => drawButton.style.backgroundColor = '#27ae60';

        drawButton.onclick = () => {
            const pattern = patternSelect.value;
            const colorScheme = colorSelect.value;
            const pixelSize = parseInt(sizeRange.value);
            const offsetX = parseInt(xRange.value);
            const offsetY = parseInt(yRange.value);

            console.log(`🎮 Iniciando pixel art - Patrón: ${pattern} | Colores: ${colorScheme} | Tamaño: ${pixelSize}px | Offset: (${offsetX}, ${offsetY})`);

            createCustomPixelArt(pattern, colorScheme, pixelSize, offsetX, offsetY);
        };

        const randomButton = document.createElement('button');
        randomButton.innerHTML = '🎲 ALEATORIO';
        randomButton.style.width = '100%';
        randomButton.style.padding = '8px';
        randomButton.style.backgroundColor = '#f39c12';
        randomButton.style.color = 'white';
        randomButton.style.border = 'none';
        randomButton.style.borderRadius = '8px';
        randomButton.style.fontSize = '12px';
        randomButton.style.fontWeight = 'bold';
        randomButton.style.cursor = 'pointer';
        randomButton.style.transition = 'all 0.3s ease';

        randomButton.onmouseover = () => randomButton.style.backgroundColor = '#e67e22';
        randomButton.onmouseout = () => randomButton.style.backgroundColor = '#f39c12';

        randomButton.onclick = () => {
            const patterns = Object.keys(pixelPatterns);
            const colors = Object.keys(colorSchemes);

            const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
            const selectedColor = colors[Math.floor(Math.random() * colors.length)];
            const selectedSize = Math.floor(Math.random() * 30) + 3;

            patternSelect.value = selectedPattern;
            colorSelect.value = selectedColor;
            sizeRange.value = selectedSize;
            sizeValue.innerText = selectedSize + 'px';

            // Posición aleatoria pero no muy extrema
            const randomX = Math.floor(Math.random() * 200) - 100;
            const randomY = Math.floor(Math.random() * 200) - 100;

            xRange.value = randomX;
            yRange.value = randomY;
            xRange.oninput();
            yRange.oninput();

            console.log(`🎲 Configuración aleatoria generada - Patrón: ${selectedPattern} | Color: ${selectedColor} | Tamaño: ${selectedSize}px | Posición: (${randomX}, ${randomY})`);

            updatePreview();
        };

        buttonSection.appendChild(drawButton);
        buttonSection.appendChild(randomButton);

        // === ASSEMBLY ===
        studio.appendChild(patternSection);
        studio.appendChild(colorSection);
        studio.appendChild(sizeSection);
        studio.appendChild(positionSection);
        studio.appendChild(previewSection);
        studio.appendChild(buttonSection);

        document.body.appendChild(studio);

        // === PREVIEW FUNCTION ===
        function updatePreview() {
            const ctx = previewCanvas.getContext('2d');
            ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

            const pattern = pixelPatterns[patternSelect.value];
            const colors = colorSchemes[colorSelect.value];

            if (!pattern || !colors) return;

            const cellSize = Math.min(
                previewCanvas.width / pattern.length,
                previewCanvas.height / pattern.length
            );

            const offsetX = (previewCanvas.width - pattern.length * cellSize) / 2;
            const offsetY = (previewCanvas.height - pattern.length * cellSize) / 2;

            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    const char = pattern[row][col];
                    if (!colors[char]) continue;

                    ctx.fillStyle = colors[char];
                    ctx.fillRect(
                        offsetX + col * cellSize,
                        offsetY + row * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }

        // === EVENT LISTENERS ===
        patternSelect.addEventListener('change', updatePreview);
        colorSelect.addEventListener('change', updatePreview);

        // Initial preview
        updatePreview();

        // Actualizar información del canvas periódicamente
        setInterval(() => {
            if (detectCanvasInfo()) {
                document.getElementById('canvas-info').innerHTML =
                    `📐 Canvas: ${canvasDimensions.width}x${canvasDimensions.height}<br/>🎯 Centro: (${canvasCenter.x}, ${canvasCenter.y})`;

                // Actualizar rangos de posición
                xRange.min = -canvasDimensions.width / 2;
                xRange.max = canvasDimensions.width / 2;
                yRange.min = -canvasDimensions.height / 2;
                yRange.max = canvasDimensions.height / 2;
            }
        }, 2000);
    }

    // === INITIALIZATION ===
    // Detectar canvas info al inicio
    setTimeout(() => {
        if (detectCanvasInfo() && canvas && ctx) {
            createPixelStudio();
            console.log('🎨 PIXEL ART STUDIO v1.1 CARGADO EXITOSAMENTE');
            console.log('✨ Precisión hasta 1px habilitada');
            console.log('🎯 Control de posición XY activado');
            console.log('📡 Sistema de notificaciones movido a consola');
        } else {
            console.error('❌ Error: Canvas no detectado');
        }
    }, 1000);

})();
