// ==UserScript==
// @name         Drawaria Glitter Text Studio
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Texts with particle effects and colors
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547617/Drawaria%20Glitter%20Text%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/547617/Drawaria%20Glitter%20Text%20Studio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Canvas and WebSocket Setup ===
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let socket;
    let isRunning = false;

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) {
            socket = this;
        }
        return originalSend.apply(this, args);
    };

    // === Status Display System ===
    function createStatusDisplay() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'drawaria-status';
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '50px';
        statusDiv.style.right = '20px';
        statusDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        statusDiv.style.color = '#00ff00';
        statusDiv.style.padding = '10px';
        statusDiv.style.borderRadius = '5px';
        statusDiv.style.fontFamily = 'monospace';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.zIndex = '1001';
        statusDiv.style.display = 'none';
        statusDiv.style.minWidth = '200px';
        document.body.appendChild(statusDiv);
        return statusDiv;
    }

    const statusDisplay = createStatusDisplay();

function showStatus(message, duration = 3000) {
    console.log("[GlitterTextStudio][STATUS]", message);
}

function updateProgress(current, total, action) {
    const percentage = Math.round((current / total) * 100);
    const progressBar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    console.log(`[GlitterTextStudio][PROGRESS] ${action} [${progressBar}] ${percentage}% ${current}/${total}`);
}

    // === Utility Functions ===
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // === FUNCIÓN MODIFICADA: RENDERIZADO LOCAL + SERVIDOR ===
    function sendDrawCommand(x1, y1, x2, y2, color, thickness) {
        // *** RENDERIZADO LOCAL (TÚ LO VES) ***
        if (ctx && canvas) {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
        }

        // *** ENVÍO AL SERVIDOR (OTROS LO VEN) ***
        if (!socket || !canvas) return;
        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);
        const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        socket.send(command);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // === ALFABETO COMPLETO ===
    function getLetterPattern(letter) {
        const patterns = {
            'A': [[0,4,1,0], [1,0,2,0], [2,0,3,4], [0,2,3,2]],
            'B': [[0,0,0,4], [0,0,2,0], [0,2,2,2], [2,0,2,2], [2,2,2,4], [0,4,2,4]],
            'C': [[0,0,0,4], [0,0,2,0], [0,4,2,4]],
            'D': [[0,0,0,4], [0,0,2,1], [2,1,2,3], [2,3,0,4]],
            'E': [[0,0,0,4], [0,0,2,0], [0,2,1,2], [0,4,2,4]],
            'F': [[0,0,0,4], [0,0,2,0], [0,2,1,2]],
            'G': [[0,0,0,4], [0,0,2,0], [0,4,2,4], [2,2,2,4], [1,2,2,2]],
            'H': [[0,0,0,4], [2,0,2,4], [0,2,2,2]],
            'I': [[0,0,2,0], [1,0,1,4], [0,4,2,4]],
            'J': [[0,0,2,0], [1,0,1,3], [1,3,0,4]],
            'K': [[0,0,0,4], [0,2,2,0], [0,2,2,4]],
            'L': [[0,0,0,4], [0,4,2,4]],
            'M': [[0,0,0,4], [0,0,1,2], [1,2,2,0], [2,0,2,4]],
            'N': [[0,0,0,4], [0,0,2,4], [2,0,2,4]],
            'O': [[0,0,0,4], [0,0,2,0], [2,0,2,4], [2,4,0,4]],
            'P': [[0,0,0,4], [0,0,2,0], [2,0,2,2], [2,2,0,2]],
            'Q': [[0,0,0,4], [0,0,2,0], [2,0,2,4], [2,4,0,4], [1,3,2,4]],
            'R': [[0,0,0,4], [0,0,2,0], [2,0,2,2], [2,2,0,2], [0,2,2,4]],
            'S': [[0,0,2,0], [0,0,0,2], [0,2,2,2], [2,2,2,4], [2,4,0,4]],
            'T': [[0,0,2,0], [1,0,1,4]],
            'U': [[0,0,0,4], [0,4,2,4], [2,4,2,0]],
            'V': [[0,0,1,4], [2,0,1,4]],
            'W': [[0,0,0,4], [0,4,1,2], [1,2,2,4], [2,4,2,0]],
            'X': [[0,0,2,4], [2,0,0,4]],
            'Y': [[0,0,1,2], [2,0,1,2], [1,2,1,4]],
            'Z': [[0,0,2,0], [2,0,0,4], [0,4,2,4]],
            '0': [[0,0,0,4], [0,0,2,0], [2,0,2,4], [2,4,0,4]],
            '1': [[1,0,1,4], [0,1,1,0], [0,4,2,4]],
            '2': [[0,0,2,0], [2,0,2,2], [2,2,0,2], [0,2,0,4], [0,4,2,4]],
            '3': [[0,0,2,0], [2,0,2,2], [1,2,2,2], [2,2,2,4], [2,4,0,4]],
            '4': [[0,0,0,2], [0,2,2,2], [2,0,2,4]],
            '5': [[2,0,0,0], [0,0,0,2], [0,2,2,2], [2,2,2,4], [2,4,0,4]],
            '6': [[0,0,0,4], [0,0,2,0], [0,2,2,2], [2,2,2,4], [2,4,0,4]],
            '7': [[0,0,2,0], [2,0,1,4]],
            '8': [[0,0,0,4], [0,0,2,0], [2,0,2,4], [2,4,0,4], [0,2,2,2]],
            '9': [[0,0,0,2], [0,0,2,0], [2,0,2,4], [0,2,2,2], [2,4,0,4]],
            ' ': []
        };
        return patterns[letter.toUpperCase()] || [];
    }

    // === ESQUEMAS DE COLOR ===
    const textColorSchemes = {
        golden: {
            text: ['#FFD700', '#FFA500', '#FFFF00', '#FFE4B5'],
            sparkles: ['#FFFFFF', '#FFFFCC', '#F0E68C', '#DAA520'],
            sparkleCount: 8,
            finalSparkles: 50
        },
        rainbow: {
            text: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
            sparkles: ['#FFFFFF', '#FFE4E1', '#F0F8FF', '#FFFAF0'],
            sparkleCount: 12,
            finalSparkles: 75
        },
        neon: {
            text: ['#FF1493', '#00FFFF', '#ADFF2F', '#FF69B4'],
            sparkles: ['#FFFFFF', '#E0E0E0', '#FFFF99', '#FF99FF'],
            sparkleCount: 15,
            finalSparkles: 100
        },
        ice: {
            text: ['#87CEEB', '#B0E0E6', '#ADD8E6', '#E0F6FF'],
            sparkles: ['#FFFFFF', '#F0FFFF', '#E6F3FF', '#CCE7FF'],
            sparkleCount: 10,
            finalSparkles: 60
        },
        fire: {
            text: ['#FF4500', '#FF6347', '#FF0000', '#DC143C'],
            sparkles: ['#FFFF00', '#FFD700', '#FFA500', '#FFFFFF'],
            sparkleCount: 20,
            finalSparkles: 120
        },
        emerald: {
            text: ['#50C878', '#00FF7F', '#32CD32', '#228B22'],
            sparkles: ['#FFFFFF', '#F0FFF0', '#E0FFE0', '#90EE90'],
            sparkleCount: 9,
            finalSparkles: 55
        },
        cosmic: {
            text: ['#4B0082', '#8A2BE2', '#9400D3', '#7B68EE'],
            sparkles: ['#FFFFFF', '#E6E6FA', '#DDA0DD', '#D8BFD8'],
            sparkleCount: 18,
            finalSparkles: 90
        },
        sunset: {
            text: ['#FF6347', '#FF7F50', '#FFD700', '#FFA500'],
            sparkles: ['#FFFFFF', '#FFFAF0', '#FFE4B5', '#FFDAB9'],
            sparkleCount: 14,
            finalSparkles: 70
        }
    };

    // === FUNCIÓN PRINCIPAL CON MÉTODO ORIGINAL DE SPARKLES ===
    async function createAdvancedGlitterText(options) {
        if (!socket || !canvas) return;

        const {
            text,
            letterSize,
            letterSpacing,
            positionX,
            positionY,
            colorScheme,
            textThickness,
            sparkleDelay,
            textSpeed,
            sparkleArea,
            finalSparkleIntensity
        } = options;

        const textColors = textColorSchemes[colorScheme].text;
        const sparkleColors = textColorSchemes[colorScheme].sparkles;
        const sparkleCount = Math.floor(textColorSchemes[colorScheme].sparkleCount * (sparkleArea / 100));
        const finalSparkleCount = Math.floor(textColorSchemes[colorScheme].finalSparkles * (finalSparkleIntensity / 100));

        const totalWidth = text.length * letterSpacing;
        let startX, startY;

        switch(positionX) {
            case 'left': startX = 50; break;
            case 'center': startX = Math.max(50, (canvas.width - totalWidth) / 2); break;
            case 'right': startX = canvas.width - totalWidth - 50; break;
            default: startX = parseInt(positionX) || (canvas.width - totalWidth) / 2;
        }

        switch(positionY) {
            case 'top': startY = letterSize + 50; break;
            case 'middle': startY = canvas.height / 2; break;
            case 'bottom': startY = canvas.height - letterSize - 50; break;
            default: startY = parseInt(positionY) || canvas.height / 2;
        }

        showStatus(`✨ CREANDO: "${text}"`, 1000);
        statusDisplay.style.display = 'block';

        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            const letterPattern = getLetterPattern(letter);
            const letterX = startX + (i * letterSpacing);
            const baseColor = textColors[i % textColors.length];

            updateProgress(i, text.length, `✨ DIBUJANDO LETRA: ${letter}`);

            for (const line of letterPattern) {
                const [x1, y1, x2, y2] = line;
                const realX1 = letterX + (x1 * letterSize / 3);
                const realY1 = startY + (y1 * letterSize / 4) - letterSize/2;
                const realX2 = letterX + (x2 * letterSize / 3);
                const realY2 = startY + (y2 * letterSize / 4) - letterSize/2;

                sendDrawCommand(realX1, realY1, realX2, realY2, baseColor, textThickness);
                await sleep(textSpeed);

                sendDrawCommand(realX1-1, realY1-1, realX2-1, realY2-1, '#FFFFFF', Math.max(1, textThickness-2));
                await sleep(textSpeed/2);
            }

            // *** BRILLOS POR LETRA (MÉTODO ORIGINAL EXACTO) ***
            for (let sparkle = 0; sparkle < sparkleCount; sparkle++) {
                const sparkleX = letterX + getRandomFloat(-10, letterSize + 10);
                const sparkleY = startY + getRandomFloat(-letterSize, letterSize);
                const sparkleColor = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
                const sparkleSize = getRandomFloat(2, 6);

                sendDrawCommand(sparkleX - sparkleSize, sparkleY, sparkleX + sparkleSize, sparkleY, sparkleColor, 2);
                sendDrawCommand(sparkleX, sparkleY - sparkleSize, sparkleX, sparkleY + sparkleSize, sparkleColor, 2);
                await sleep(sparkleDelay);
            }

            await sleep(200);
        }

        // *** EFECTOS FINALES MASIVOS ***
        updateProgress(90, 100, '✨ APLICANDO BRILLOS FINALES');
        for (let finalSparkle = 0; finalSparkle < finalSparkleCount; finalSparkle++) {
            const x = getRandomFloat(startX - 30, startX + (text.length * letterSpacing) + 30);
            const y = getRandomFloat(startY - letterSize, startY + letterSize);
            const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            const size = getRandomFloat(1, 4);

            sendDrawCommand(x-size, y, x+size, y, color, 1);
            sendDrawCommand(x, y-size, x, y+size, color, 1);
            await sleep(25);
        }

        showStatus('✨ TEXTO BRILLANTE COMPLETADO', 3000);
    }

    // === INTERFAZ MODIFICADA (SIN VISTA PREVIA, SIN INFO TÉCNICA) ===
    function createFullTextStudio() {
        const studio = document.createElement('div');
        studio.style.position = 'fixed';
        studio.style.top = '20px';
        studio.style.left = '20px';
        studio.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        studio.style.padding = '20px';
        studio.style.zIndex = '1001';
        studio.style.border = '3px solid #e74c3c';
        studio.style.borderRadius = '15px';
        studio.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        studio.style.fontFamily = 'Arial, sans-serif';
        studio.style.width = '380px';
        studio.style.maxHeight = '85vh';
        studio.style.overflowY = 'auto';

        // === HEADER ===
        const header = document.createElement('div');
        header.innerHTML = '✨ GLITTER TEXT STUDIO PRO ✨';
        header.style.fontSize = '20px';
        header.style.fontWeight = 'bold';
        header.style.color = '#e74c3c';
        header.style.textAlign = 'center';
        header.style.marginBottom = '25px';
        header.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        header.style.background = 'linear-gradient(45deg, #e74c3c, #f39c12)';
        header.style.WebkitBackgroundClip = 'text';
        header.style.WebkitTextFillColor = 'transparent';
        studio.appendChild(header);

        // === TEXTO INPUT SECTION ===
        const textSection = createAdvancedSection('📝 CONFIGURACIÓN DE TEXTO', '#2c3e50');

        // *** PRESET: "text here" ***
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.id = 'text-input';
        textInput.placeholder = 'Escribe tu texto brillante aquí...';
        textInput.value = 'text here'; // *** PRESET APLICADO ***
        textInput.maxLength = 12;
        styleAdvancedInput(textInput, '100%');

        const charCounter = document.createElement('div');
        charCounter.id = 'char-counter';
        charCounter.innerHTML = `Caracteres: <span style="color: #27ae60;">9</span>/12`; // *** PRESET: 9/12 ***
        charCounter.style.fontSize = '11px';
        charCounter.style.color = '#7f8c8d';
        charCounter.style.textAlign = 'right';
        charCounter.style.marginTop = '5px';

        textInput.oninput = () => {
            const count = textInput.value.length;
            charCounter.innerHTML = `Caracteres: <span style="color: ${count > 10 ? '#e74c3c' : '#27ae60'};">${count}</span>/12`;
        };

        textSection.appendChild(textInput);
        textSection.appendChild(charCounter);

        // === CONTROLES PRINCIPALES (MOVIDO AQUÍ) ===
        const controlsSection = createAdvancedSection('🎮 CONTROLES PRINCIPALES', '#2c3e50');

        const mainDrawBtn = createAdvancedButton('✨ CREAR TEXTO BRILLANTE ✨', executeAdvancedText, '#e74c3c');
        mainDrawBtn.style.fontSize = '16px';
        mainDrawBtn.style.padding = '15px';

        const quickActionsContainer = document.createElement('div');
        quickActionsContainer.style.display = 'flex';
        quickActionsContainer.style.gap = '10px';
        quickActionsContainer.style.marginTop = '10px';

        const randomBtn = createAdvancedButton('🎲 Aleatorio', randomizeAdvancedSettings, '#f39c12', 'small');
        const resetBtn = createAdvancedButton('🔄 Reset', resetToDefaults, '#95a5a6', 'small');

        randomBtn.style.flex = '1';
        resetBtn.style.flex = '1';

        quickActionsContainer.appendChild(randomBtn);
        quickActionsContainer.appendChild(resetBtn);

        controlsSection.appendChild(mainDrawBtn);
        controlsSection.appendChild(quickActionsContainer);

        // === TAMAÑO Y ESPACIADO ===
        const sizeSection = createAdvancedSection('📏 TAMAÑO Y ESPACIADO', '#27ae60');

        // *** PRESETS APLICADOS ***
        const letterSizeControl = createAdvancedSlider('Tamaño Letra:', 'letter-size', 25, 100, 66, 'px', // *** PRESET: 66px ***
            'Controla el tamaño de cada letra del texto');
        const spacingControl = createAdvancedSlider('Espaciado:', 'letter-spacing', 35, 120, 61, 'px', // *** PRESET: 61px ***
            'Distancia entre letras');
        const thicknessControl = createAdvancedSlider('Grosor Trazo:', 'text-thickness', 3, 15, 6, 'px', // *** PRESET: 6px ***
            'Grosor de las líneas del texto');

        sizeSection.appendChild(letterSizeControl);
        sizeSection.appendChild(spacingControl);
        sizeSection.appendChild(thicknessControl);

        // === POSICIONAMIENTO ===
        const positionSection = createAdvancedSection('📍 POSICIONAMIENTO', '#8e44ad');

        const posXContainer = document.createElement('div');
        posXContainer.style.marginBottom = '15px';

        const posXLabel = createLabel('Posición Horizontal:', 'pos-x');
        // *** PRESET: Centro ***
        const posXSelect = createAdvancedSelect('pos-x', [
            {value: 'left', text: '← Izquierda'},
            {value: 'center', text: '↔ Centro'},
            {value: 'right', text: '→ Derecha'}
        ], 'center'); // *** PRESET APLICADO ***

        const posYContainer = document.createElement('div');
        posYContainer.style.marginBottom = '15px';

        const posYLabel = createLabel('Posición Vertical:', 'pos-y');
        // *** PRESET: Centro ***
        const posYSelect = createAdvancedSelect('pos-y', [
            {value: 'top', text: '↑ Arriba'},
            {value: 'middle', text: '↕ Centro'},
            {value: 'bottom', text: '↓ Abajo'}
        ], 'middle'); // *** PRESET APLICADO ***

        posXContainer.appendChild(posXLabel);
        posXContainer.appendChild(posXSelect);
        posYContainer.appendChild(posYLabel);
        posYContainer.appendChild(posYSelect);

        positionSection.appendChild(posXContainer);
        positionSection.appendChild(posYContainer);

        // === ESQUEMAS DE COLOR ===
        const colorSection = createAdvancedSection('🎨 ESQUEMAS DE COLOR', '#e67e22');

        const colorContainer = document.createElement('div');
        colorContainer.style.marginBottom = '15px';

        const colorLabel = createLabel('Esquema de Colores:', 'color-scheme');
        // *** PRESET: Emerald (9 ✨) ***
        const colorSelect = createAdvancedSelect('color-scheme',
            Object.keys(textColorSchemes).map(scheme => ({
                value: scheme,
                text: `${scheme.charAt(0).toUpperCase() + scheme.slice(1)} (${textColorSchemes[scheme].sparkleCount} ✨)`
            })), 'emerald'); // *** PRESET APLICADO ***

        const colorPreview = document.createElement('div');
        colorPreview.id = 'color-preview';
        colorPreview.style.height = '30px';
        colorPreview.style.border = '2px solid #bdc3c7';
        colorPreview.style.borderRadius = '5px';
        colorPreview.style.marginTop = '8px';
        colorPreview.style.display = 'flex';

        const updateColorPreview = () => {
            const scheme = textColorSchemes[colorSelect.value];
            colorPreview.innerHTML = '';
            scheme.text.forEach(color => {
                const colorBlock = document.createElement('div');
                colorBlock.style.backgroundColor = color;
                colorBlock.style.flex = '1';
                colorBlock.style.height = '100%';
                colorPreview.appendChild(colorBlock);
            });
        };

        colorSelect.onchange = updateColorPreview;
        updateColorPreview();

        colorContainer.appendChild(colorLabel);
        colorContainer.appendChild(colorSelect);
        colorContainer.appendChild(colorPreview);
        colorSection.appendChild(colorContainer);

        // === EFECTOS DE BRILLO ===
        const sparkleSection = createAdvancedSection('✨ CONFIGURACIÓN DE BRILLOS', '#f39c12');

        // *** PRESETS APLICADOS ***
        const sparkleAreaControl = createAdvancedSlider('Área de Brillos:', 'sparkle-area', 50, 150, 150, '%', // *** PRESET: 150% ***
            'Controla la dispersión de los brillos alrededor del texto');
        const sparkleDelayControl = createAdvancedSlider('Velocidad Brillos:', 'sparkle-delay', 5, 50, 20, 'ms', // *** PRESET: 20ms ***
            'Tiempo entre cada brillo (menor = más rápido)');
        const finalIntensityControl = createAdvancedSlider('Intensidad Final:', 'final-sparkle-intensity', 25, 200, 200, '%', // *** PRESET: 200% ***
            'Cantidad de brillos al finalizar el texto');

        sparkleSection.appendChild(sparkleAreaControl);
        sparkleSection.appendChild(sparkleDelayControl);
        sparkleSection.appendChild(finalIntensityControl);

        // === VELOCIDAD Y TIMING ===
        const speedSection = createAdvancedSection('⚡ VELOCIDAD Y TIMING', '#16a085');

        // *** PRESET: 30ms ***
        const textSpeedControl = createAdvancedSlider('Velocidad Texto:', 'text-speed', 5, 80, 30, 'ms', // *** PRESET APLICADO ***
            'Velocidad de dibujado del texto');

        speedSection.appendChild(textSpeedControl);

        // === ENSAMBLADO FINAL (SIN PREVIEW, SIN INFO) ===
        studio.appendChild(textSection);
        studio.appendChild(controlsSection); // *** MOVIDO AQUÍ DESPUÉS DEL TEXTO ***
        studio.appendChild(sizeSection);
        studio.appendChild(positionSection);
        studio.appendChild(colorSection);
        studio.appendChild(sparkleSection);
        studio.appendChild(speedSection);

        document.body.appendChild(studio);

        // === FUNCIONES DE UTILIDAD ===
        function createAdvancedSection(title, color) {
            const section = document.createElement('div');
            section.style.marginBottom = '20px';
            section.style.padding = '15px';
            section.style.border = `2px solid ${color}`;
            section.style.borderRadius = '10px';
            section.style.backgroundColor = `${color}10`;
            section.style.position = 'relative';

            const titleElement = document.createElement('div');
            titleElement.innerHTML = title;
            titleElement.style.fontSize = '14px';
            titleElement.style.fontWeight = 'bold';
            titleElement.style.color = color;
            titleElement.style.marginBottom = '12px';
            titleElement.style.textTransform = 'uppercase';
            titleElement.style.letterSpacing = '0.5px';

            section.appendChild(titleElement);
            return section;
        }

        function createAdvancedSlider(label, id, min, max, defaultVal, unit, tooltip) {
            const container = document.createElement('div');
            container.style.marginBottom = '15px';

            const labelEl = createLabel(label, id);
            if (tooltip) {
                labelEl.title = tooltip;
                labelEl.style.cursor = 'help';
            }

            const sliderContainer = document.createElement('div');
            sliderContainer.style.display = 'flex';
            sliderContainer.style.alignItems = 'center';
            sliderContainer.style.gap = '10px';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = id;
            slider.min = min;
            slider.max = max;
            slider.value = defaultVal;
            slider.style.flex = '1';
            slider.style.height = '6px';
            slider.style.borderRadius = '3px';
            slider.style.background = 'linear-gradient(to right, #3498db, #e74c3c)';
            slider.style.outline = 'none';

            const valueLabel = document.createElement('div');
            valueLabel.id = id + '-value';
            valueLabel.innerHTML = defaultVal + unit;
            valueLabel.style.fontSize = '12px';
            valueLabel.style.fontWeight = 'bold';
            valueLabel.style.color = '#2c3e50';
            valueLabel.style.minWidth = '60px';
            valueLabel.style.textAlign = 'center';
            valueLabel.style.backgroundColor = '#ecf0f1';
            valueLabel.style.padding = '4px 8px';
            valueLabel.style.borderRadius = '4px';

            slider.oninput = () => {
                valueLabel.innerHTML = slider.value + unit;
            };

            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(valueLabel);

            container.appendChild(labelEl);
            container.appendChild(sliderContainer);

            return container;
        }

        function createAdvancedSelect(id, options, defaultVal) {
            const select = document.createElement('select');
            select.id = id;
            styleAdvancedInput(select, '100%');

            options.forEach(option => {
                const optEl = document.createElement('option');
                optEl.value = option.value;
                optEl.textContent = option.text;
                if (option.value === defaultVal) optEl.selected = true;
                select.appendChild(optEl);
            });

            return select;
        }

        function createLabel(text, forId) {
            const label = document.createElement('label');
            label.innerText = text;
            label.htmlFor = forId;
            label.style.display = 'block';
            label.style.fontSize = '12px';
            label.style.fontWeight = 'bold';
            label.style.marginBottom = '6px';
            label.style.color = '#2c3e50';
            return label;
        }

        function styleAdvancedInput(input, width) {
            input.style.width = width;
            input.style.padding = '10px';
            input.style.borderRadius = '6px';
            input.style.border = '2px solid #bdc3c7';
            input.style.fontSize = '13px';
            input.style.transition = 'border-color 0.3s ease';
            input.onfocus = () => input.style.borderColor = '#3498db';
            input.onblur = () => input.style.borderColor = '#bdc3c7';
        }

        function createAdvancedButton(text, onClick, color, size = 'normal') {
            const button = document.createElement('button');
            button.innerText = text;
            button.onclick = async () => {
                if (isRunning) return;
                isRunning = true;
                button.style.opacity = '0.6';
                button.disabled = true;

                await onClick();

                button.style.opacity = '1';
                button.disabled = false;
                isRunning = false;
            };

            button.style.width = '100%';
            button.style.padding = size === 'small' ? '8px 12px' : '12px';
            button.style.backgroundColor = color;
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '8px';
            button.style.fontSize = size === 'small' ? '12px' : '14px';
            button.style.fontWeight = 'bold';
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.3s ease';
            button.style.textTransform = 'uppercase';
            button.style.letterSpacing = '0.5px';

            button.onmouseover = () => {
                if (!button.disabled) {
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = `0 4px 12px ${color}40`;
                }
            };
            button.onmouseout = () => {
                button.style.transform = 'translateY(0px)';
                button.style.boxShadow = 'none';
            };

            return button;
        }

        function executeAdvancedText() {
            const options = {
                text: document.getElementById('text-input').value || 'text here',
                letterSize: parseInt(document.getElementById('letter-size').value),
                letterSpacing: parseInt(document.getElementById('letter-spacing').value),
                positionX: document.getElementById('pos-x').value,
                positionY: document.getElementById('pos-y').value,
                colorScheme: document.getElementById('color-scheme').value,
                textThickness: parseInt(document.getElementById('text-thickness').value),
                sparkleDelay: parseInt(document.getElementById('sparkle-delay').value),
                textSpeed: parseInt(document.getElementById('text-speed').value),
                sparkleArea: parseInt(document.getElementById('sparkle-area').value),
                finalSparkleIntensity: parseInt(document.getElementById('final-sparkle-intensity').value)
            };

            createAdvancedGlitterText(options);
        }

        function randomizeAdvancedSettings() {
            const colorSchemes = Object.keys(textColorSchemes);
            const positions = ['left', 'center', 'right'];
            const vPositions = ['top', 'middle', 'bottom'];

            document.getElementById('color-scheme').value = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
            document.getElementById('pos-x').value = positions[Math.floor(Math.random() * positions.length)];
            document.getElementById('pos-y').value = vPositions[Math.floor(Math.random() * vPositions.length)];
            document.getElementById('letter-size').value = 30 + Math.floor(Math.random() * 50);
            document.getElementById('letter-spacing').value = 40 + Math.floor(Math.random() * 60);
            document.getElementById('text-thickness').value = 4 + Math.floor(Math.random() * 8);
            document.getElementById('sparkle-area').value = 75 + Math.floor(Math.random() * 50);
            document.getElementById('final-sparkle-intensity').value = 50 + Math.floor(Math.random() * 100);

            ['letter-size', 'letter-spacing', 'text-thickness', 'sparkle-area', 'final-sparkle-intensity'].forEach(id => {
                document.getElementById(id).oninput();
            });

            document.getElementById('color-scheme').onchange();
        }

        function resetToDefaults() {
            // *** FUNCIÓN RESET CON LOS PRESETS PERSONALIZADOS ***
            document.getElementById('text-input').value = 'text here';
            document.getElementById('letter-size').value = 66;
            document.getElementById('letter-spacing').value = 61;
            document.getElementById('pos-x').value = 'center';
            document.getElementById('pos-y').value = 'middle';
            document.getElementById('color-scheme').value = 'emerald';
            document.getElementById('text-thickness').value = 6;
            document.getElementById('sparkle-delay').value = 20;
            document.getElementById('text-speed').value = 30;
            document.getElementById('sparkle-area').value = 150;
            document.getElementById('final-sparkle-intensity').value = 200;

            ['letter-size', 'letter-spacing', 'text-thickness', 'sparkle-delay', 'text-speed', 'sparkle-area', 'final-sparkle-intensity'].forEach(id => {
                document.getElementById(id).oninput();
            });

            // Actualizar contador de caracteres
            document.getElementById('text-input').oninput();

            document.getElementById('color-scheme').onchange();
        }

        // === EVENT LISTENERS ===
        document.getElementById('color-scheme').addEventListener('change', () => {
            document.getElementById('color-scheme').onchange();
        });
    }

    // === INICIALIZACIÓN ===
    createFullTextStudio();
})();
