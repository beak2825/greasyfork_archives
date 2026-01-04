// ==UserScript==
// @name         Picky The Chicken - Drawaria Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Picky The Chicken is here to help you! / ¡Picky The Chicken está aquí para ayudarte!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5ClPC90ZXh0Pjwvc3ZnPg==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537548/Picky%20The%20Chicken%20-%20Drawaria%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/537548/Picky%20The%20Chicken%20-%20Drawaria%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Detect browser language
    const browserLang = (navigator.language || navigator.userLanguage || 'en').substring(0, 2);
    const isSpanish = browserLang === 'es';

    // --- Configuración General ---
    const ANALYSIS_INTERVAL = 3800;
    const PIXEL_SAMPLE_STEP = 25;
    const COLOR_SIMILARITY_THRESHOLD = 55;
    const MIN_PIXEL_PERCENTAGE_FOR_DOMINANT_COLOR = 0.02;
    const DRAWING_CHANGE_THRESHOLD = 0.0008;
    const STATIC_STREAK_LIMIT = 3;
    const MAX_HINTS_PER_TURN = 6;

    // --- Estilos para Picky y el Bocadillo ---
    GM_addStyle(`
        #picky-pista-container {
            position: fixed;
            bottom: 70px;
            right: 10px;
            z-index: 10010;
            display: flex;
            align-items: flex-end;
            transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
            opacity: 1;
            pointer-events: none;
        }
        #picky-avatar-div {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 5px;
            transform-origin: bottom center;
        }
        #picky-avatar-div span {
            font-size: 40px;
            text-shadow: 0px 0px 5px rgba(255,255,0,0.7);
            transition: transform 0.25s ease-out;
        }
        #picky-avatar-div.picky-idle span { animation: pickyBounce 2s infinite ease-in-out; }
        #picky-avatar-div.picky-thinking span { animation: pickyThinking 1.5s infinite linear; }
        #picky-avatar-div.picky-hinting span { transform: scale(1.1) rotate(3deg); animation: pickyHintPop 0.3s ease-out; }
        #picky-avatar-div.picky-happy span { animation: pickyHappyDance 0.8s ease-in-out; }
        #picky-avatar-div.picky-confused span { transform: rotate(-15deg) translateX(-3px); }
        #picky-avatar-div.picky-greeting span { animation: pickyWave 0.7s ease-in-out; }

        @keyframes pickyBounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-3px) scale(1.03); }
        }
        @keyframes pickyThinking {
            0% { transform: rotate(-3deg) scale(1); }
            25% { transform: rotate(3deg) scale(1.02); }
            50% { transform: rotate(-3deg) scale(1); }
            75% { opacity: 0.8; }
            100% { transform: rotate(-3deg) scale(1); opacity: 1;}
        }
        @keyframes pickyHintPop {
            0% { transform: scale(0.8); }
            80% { transform: scale(1.2); }
            100% { transform: scale(1.1) rotate(3deg); }
        }
        @keyframes pickyHappyDance {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(-5deg) scale(1.1); }
            75% { transform: translateY(-5px) rotate(5deg) scale(1.1); }
        }
        @keyframes pickyWave {
             0% { transform: rotate(0deg); } 20% { transform: rotate(15deg); }
             40% { transform: rotate(-10deg); } 60% { transform: rotate(15deg); }
             80% { transform: rotate(-5deg); } 100% { transform: rotate(0deg); }
        }

        #picky-speech-bubble-div {
            background-color: #FFFACD;
            color: #4A4A4A;
            padding: 10px 15px;
            border-radius: 18px 18px 18px 3px;
            max-width: 210px;
            font-size: 11.5px;
            box-shadow: 2px 3px 6px rgba(0,0,0,0.1), 0px 0px 0px 1px #F0E68C;
            opacity: 0;
            transform: scale(0.8) translateY(15px);
            transition: opacity 0.2s ease-out, transform 0.2s ease-out;
            font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
            pointer-events: auto;
        }
        #picky-speech-bubble-div.visible {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        #picky-speech-bubble-div p { margin: 0; line-height: 1.45; }
        #picky-speech-bubble-div strong { color: #FF8C00; }
        .dot-flashing-picky {
          position: relative;
          width: 4px; height: 4px;
          border-radius: 5px;
          background-color: #FFC107; color: #FFC107;
          animation: dotFlashingPicky 1s infinite linear alternate;
          animation-delay: .5s;
          display: inline-block; margin-left: 2px; vertical-align: middle;
        }
        .dot-flashing-picky::before, .dot-flashing-picky::after {
          content: ''; display: inline-block;
          position: absolute; top: 0;
        }
        .dot-flashing-picky::before {
          left: -8px; width: 4px; height: 4px;
          border-radius: 5px; background-color: #FFC107; color: #FFC107;
          animation: dotFlashingPicky 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing-picky::after {
          left: 8px; width: 4px; height: 4px;
          border-radius: 5px; background-color: #FFC107; color: #FFC107;
          animation: dotFlashingPicky 1s infinite alternate;
          animation-delay: 1s;
        }
        @keyframes dotFlashingPicky {
          0% { background-color: #FFC107; }
          50%, 100% { background-color: #FFD54F; }
        }
    `);

    // --- Elementos del DOM y Estado ---
    let pickyContainer, pickyAvatarDiv, pickyAvatarEmoji, speechBubbleDiv;
    let canvas, ctx;
    let lastPixelData = null;
    let firedHintsThisTurn = new Set();
    let isPlayerDrawing = false;
    let currentDrawerId = null;
    let myPlayerId = null;
    let noChangeStreak = 0;
    let hintCounterThisTurn = 0;

    const PICKY_EMOJIS = {
        IDLE: "🐥", THINKING: "🐣", HINTING: "🐤", HAPPY: "🐥💖", CONFUSED: "🐥❓", GREETING: "🐤💫"
    };
    const PICKY_AVATAR_CLASSES = {
        IDLE: "picky-idle", THINKING: "picky-thinking", HINTING: "picky-hinting",
        HAPPY: "picky-happy", CONFUSED: "picky-confused", GREETING: "picky-greeting"
    };

    // English hint bank
    const HINT_BANK_EN = {
        dominantColor: [
            "Peep! Picky sees a lot of <strong>{color}</strong>. Could it be important?",
            "This artist is using a lot of <strong>{color}</strong>. Interesting choice!",
            "The color <strong>{color}</strong> stands out a lot. Peep, peep!",
            "Hmm... could <strong>{color}</strong> be a key clue?"
        ],
        shapeRounded: [
            "Peep! Picky sees lots of curves. Maybe something round?",
            "This drawing has soft contours, like a little cloud... or a ball.",
            "Curves, curves everywhere. How elegant!"
        ],
        shapeStraight: [
            "Peep-peep! Very straight lines. Could it be a house, a box, or a robot?",
            "Picky admires the precision. Very geometric!",
            "This artist has a steady hand for straight lines."
        ],
        manyParts: [
            "So many little things! Picky thinks they're several parts together.",
            "It looks like a set of elements... or a character with many accessories.",
            "This drawing is made of several pieces, like a puzzle!"
        ],
        singleObject: [
            "Picky thinks it's one main thing. Well focused!",
            "It looks like a solitary object or character on the canvas.",
            "A clear protagonist in this drawing, peep!"
        ],
        closedShape: [
            "Peep! The artist is closing their strokes well. Could it be a complete figure?",
            "I see contours that connect. This has a defined shape!",
        ],
        openLines: [
            "Lines that flow freely... could it be something abstract or in motion?",
            "Picky sees strokes that don't close. Very expressive!",
        ],
        staticDrawing: [
            "The artist is taking a break... Picky waits with feathers ready.",
            "Maybe looking for the perfect color? Picky is indecisive too sometimes!",
            "Tick-tock... Picky wonders what's next."
        ],
        fastDrawing: [
            "Peep, what speed! The artist is unstoppable!",
            "Fast and energetic strokes! Picky is impressed.",
            "This drawing advances at full feather. 💨"
        ],
        canvasAlmostEmpty: [
            "A nearly virgin canvas... Picky is anxious to see what appears!",
            "So much space for imagination! What could it be, peep?",
        ],
        newTurnGeneric: [
            "Peep! New turn, new artist. Picky is ready for clues! 👋",
            "Let's see what artwork awaits us this time!",
            "Clean canvas! Picky takes out the detective magnifying glass. 🕵️‍♂️"
        ],
        timeRunningOutShort: [
             "Peep-peep-PEEP! Time's running out! Quick, guessers!",
             "Only a few seconds left! Good luck everyone! ⏳"
        ],
        timeRunningOutMedium: [
            "The clock is ticking... Picky feels the excitement!",
            "There's still time! Focus, you can do it!"
        ],
        someoneGuessed: [
            "Peep, peep! Someone got it! Congratulations! 🎉",
            "Correct! Picky is happy for the guesser!"
        ],
        turnEndedNoGuess: [
            "Oh, peep! Time's up. What a mysterious drawing!",
            "Good try everyone! Next time will be better. 👍"
        ]
    };

    // Spanish hint bank
    const HINT_BANK_ES = {
        dominantColor: [
            "¡Pío! Picky ve mucho <strong>{color}</strong>. ¿Será importante?",
            "Este artista usa bastante <strong>{color}</strong>. ¡Interesante elección!",
            "El color <strong>{color}</strong> destaca mucho, ¡pío, pío!",
            "Mmm... ¿será que el <strong>{color}</strong> es una pista clave?"
        ],
        shapeRounded: [
            "¡Pío! Picky ve formas con muchas curvas. ¿Algo redondo quizás?",
            "Este dibujo tiene contornos suaves, como una nubecita... o una pelota.",
            "Curvas, curvas por todas partes. ¡Qué elegancia!"
        ],
        shapeStraight: [
            "¡Pí-pío! Líneas muy rectas. ¿Será una casa, una caja, o un robot?",
            "Picky admira la precisión. ¡Todo muy geométrico!",
            "Este artista tiene buen pulso para las líneas rectas."
        ],
        manyParts: [
            "¡Cuántas cositas! Picky cree que son varias partes juntas.",
            "Parece un conjunto de elementos... ¿o un personaje con muchos accesorios?",
            "Este dibujo está hecho de varias piezas, ¡como un rompecabezas!"
        ],
        singleObject: [
            "Picky piensa que es una sola cosa principal. ¡Bien enfocada!",
            "Parece un objeto o personaje solitario en el lienzo.",
            "Un protagonista claro en este dibujo, ¡pío!"
        ],
        closedShape: [
            "¡Pío! El artista está cerrando bien sus trazos. ¿Será una figura completa?",
            "Veo contornos que se unen. ¡Esto tiene forma definida!",
        ],
        openLines: [
            "Líneas que fluyen libremente... ¿será algo abstracto o en movimiento?",
            "Picky ve trazos que no se cierran. ¡Mucha expresividad!",
        ],
        staticDrawing: [
            "El artista está tomando un respiro... Picky espera con sus plumitas listas.",
            "¿Quizás buscando el color perfecto? ¡Picky también es indeciso a veces!",
            "Tic-tac... Picky se pregunta qué será lo siguiente."
        ],
        fastDrawing: [
            "¡Pío, qué velocidad! ¡El artista está imparable!",
            "¡Trazos rápidos y energéticos! Picky está impresionado.",
            "Este dibujo avanza a toda pluma. 💨"
        ],
        canvasAlmostEmpty: [
            "Un lienzo casi virgen... ¡Picky está ansioso por ver qué aparece!",
            "¡Tanto espacio para la imaginación! ¿Qué será, pío?",
        ],
        newTurnGeneric: [
            "¡Pío! Nuevo turno, nuevo artista. ¡Picky está listo para las pistas! 👋",
            "¡A ver qué obra de arte nos espera esta vez!",
            "¡Lienzo limpio! Picky saca su lupa de detective. 🕵️‍♂️"
        ],
        timeRunningOutShort: [
             "¡Pío-pío-PÍO! ¡El tiempo se acaba! ¡Rápido, adivinadores!",
             "¡Quedan pocos segundos! ¡Mucha suerte a todos! ⏳"
        ],
        timeRunningOutMedium: [
            "El reloj avanza... ¡Picky siente la emoción!",
            "¡Aún hay tiempo! Concéntrense, ¡pueden lograrlo!"
        ],
        someoneGuessed: [
            "¡Pío, pío! ¡Alguien lo tiene! ¡Felicidades! 🎉",
            "¡Correcto! ¡Picky está feliz por el adivinador!"
        ],
        turnEndedNoGuess: [
            "¡Oh, pío! El tiempo terminó. ¡Qué dibujo tan misterioso!",
            "¡Buen intento a todos! A la próxima será. 👍"
        ]
    };

    // Select hint bank based on language
    const HINT_BANK = isSpanish ? HINT_BANK_ES : HINT_BANK_EN;

    const commonColors = [
        { name: isSpanish ? "rojo" : "red", r: 255, g: 0, b: 0 },
        { name: isSpanish ? "verde" : "green", r: 0, g: 128, b: 0 },
        { name: isSpanish ? "verde lima" : "lime green", r:0, g:255, b:0},
        { name: isSpanish ? "azul" : "blue", r: 0, g: 0, b: 255 },
        { name: isSpanish ? "amarillo" : "yellow", r: 255, g: 255, b: 0 },
        { name: isSpanish ? "negro" : "black", r: 0, g: 0, b: 0 },
        { name: isSpanish ? "naranja" : "orange", r: 255, g: 165, b: 0 },
        { name: isSpanish ? "morado" : "purple", r: 128, g: 0, b: 128 },
        { name: isSpanish ? "rosa" : "pink", r: 255, g: 192, b: 203 },
        { name: isSpanish ? "marrón" : "brown", r: 165, g: 42, b: 42 },
        { name: isSpanish ? "gris" : "gray", r: 128, g: 128, b: 128 },
        { name: isSpanish ? "cian" : "cyan", r: 0, g: 255, b: 255 },
        { name: isSpanish ? "magenta" : "magenta", r: 255, g: 0, b: 255 }
    ];

    // --- FUNCIONES ESENCIALES PARA EL ANÁLISIS ---
    function getPixelData(canvasElement) {
        if (!canvasElement || !ctx) return null;
        try {
            return ctx.getImageData(0, 0, canvasElement.width, canvasElement.height).data;
        } catch (e) {
            // console.error("Picky: Error al obtener pixel data (posiblemente canvas 'tainted'):", e);
            return null;
        }
    }

    function comparePixelData(data1, data2) {
        if (!data1 || !data2 || data1.length !== data2.length) {
            return 1;
        }
        let diffPixels = 0;
        const step = Math.max(1, Math.floor(data1.length / (10000 * 4)));

        for (let i = 0; i < data1.length; i += 4 * step) {
            if (data1[i] !== data2[i] || data1[i+1] !== data2[i+1] || data1[i+2] !== data2[i+2] || data1[i+3] !== data2[i+3]) {
                diffPixels++;
            }
        }
        return diffPixels / (data1.length / (4 * step));
    }

    function colorDistance(r1, g1, b1, r2, g2, b2) {
        return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
    }

    function getNearestColorName(r, g, b) {
        if (r > 250 && g > 250 && b > 250) return isSpanish ? "blanco" : "white";
        let minDistance = Infinity;
        let nearestColorName = isSpanish ? "desconocido" : "unknown";
        for (const color of commonColors) {
            const distance = colorDistance(r, g, b, color.r, color.g, color.b);
            if (distance < minDistance) {
                minDistance = distance;
                nearestColorName = color.name;
            }
        }
        return (minDistance < COLOR_SIMILARITY_THRESHOLD) ? nearestColorName : isSpanish ? "mixto" : "mixed";
    }

    // --- Funciones para Picky UI y Lógica del Juego ---
    function createPickyUI() {
        pickyContainer = document.createElement('div');
        pickyContainer.id = 'picky-pista-container';

        pickyAvatarDiv = document.createElement('div');
        pickyAvatarDiv.id = 'picky-avatar-div';
        pickyAvatarEmoji = document.createElement('span');
        pickyAvatarDiv.appendChild(pickyAvatarEmoji);

        speechBubbleDiv = document.createElement('div');
        speechBubbleDiv.id = 'picky-speech-bubble-div';

        pickyContainer.appendChild(pickyAvatarDiv);
        pickyContainer.appendChild(speechBubbleDiv);
        document.body.appendChild(pickyContainer);
        setPickyExpression('IDLE');
    }

    function setPickyExpression(stateKey) {
        if (!pickyAvatarDiv || !pickyAvatarEmoji) return;

        pickyAvatarEmoji.textContent = PICKY_EMOJIS[stateKey] || PICKY_EMOJIS.IDLE;
        pickyAvatarDiv.className = PICKY_AVATAR_CLASSES[stateKey] || PICKY_AVATAR_CLASSES.IDLE;

        if (stateKey === 'THINKING') {
            speechBubbleDiv.innerHTML = `<p>${isSpanish ? "Picky está emplumando sus ideas" : "Picky is fluffing up ideas"}<span class="dot-flashing-picky"></span></p>`;
            speechBubbleDiv.classList.add('visible');
        } else if (stateKey === 'IDLE' || stateKey === 'CONFUSED' || stateKey === 'GREETING') {
             if(speechBubbleDiv.innerHTML.includes("emplumando sus ideas") || speechBubbleDiv.innerHTML.includes("fluffing up ideas")) {
                speechBubbleDiv.classList.remove('visible');
            }
        }
    }

    function updatePickyHints(hintCategory, params = {}) {
        if (!speechBubbleDiv || hintCounterThisTurn >= MAX_HINTS_PER_TURN) return;

        const hintTemplates = HINT_BANK[hintCategory];
        if (!hintTemplates || hintTemplates.length === 0) {
            setPickyExpression('CONFUSED');
            speechBubbleDiv.innerHTML = `<p>${isSpanish ? "¡Pío! Picky está un poco confundido esta vez... 🤔" : "Peep! Picky is a bit confused this time... 🤔"}</p>`;
            speechBubbleDiv.classList.add('visible');
            return;
        }

        let hintText = hintTemplates[Math.floor(Math.random() * hintTemplates.length)];
        for (const key in params) {
            hintText = hintText.replace(new RegExp(`\\{${key}\\}`, 'g'), `<strong>${params[key]}</strong>`);
        }

        speechBubbleDiv.innerHTML = `<p>${hintText}</p>`;
        setPickyExpression('HINTING');
        speechBubbleDiv.classList.add('visible');
        hintCounterThisTurn++;
    }

    function checkPlayerTurn() {
        const selfAvatarImg = document.getElementById('selfavatarimage');
        if (selfAvatarImg && selfAvatarImg.src && !myPlayerId) {
            const match = selfAvatarImg.src.match(/\/avatar\/cache\/([a-f0-9-]+)\.jpg/);
            if (match && match[1]) myPlayerId = match[1];
        }

        const drawerHighlightElement = document.querySelector('.playerlist-drawerhighlight');
        let drawerChanged = false;
        let newDrawerId = null;

        if (drawerHighlightElement) {
            const parentRow = drawerHighlightElement.closest('.playerlist-row');
            if (parentRow) newDrawerId = parentRow.getAttribute('data-playerid');
        }

        if (currentDrawerId !== newDrawerId) {
            currentDrawerId = newDrawerId;
            drawerChanged = true;
        }
        isPlayerDrawing = (myPlayerId && myPlayerId === currentDrawerId);

        if (drawerChanged) {
            firedHintsThisTurn.clear();
            lastPixelData = null;
            noChangeStreak = 0;
            hintCounterThisTurn = 0;

            if (isPlayerDrawing) {
                pickyContainer.style.opacity = '0.3';
                setPickyExpression('IDLE');
                speechBubbleDiv.innerHTML = `<p>${isSpanish ? "¡A dibujar con alegría, pío! Picky te echa porras. 🎨" : "Draw with joy, peep! Picky is cheering for you. 🎨"}</p>`;
                speechBubbleDiv.classList.add('visible');
            } else if (currentDrawerId) {
                pickyContainer.style.opacity = '1';
                setPickyExpression('GREETING');
                updatePickyHints('newTurnGeneric');
            } else {
                pickyContainer.style.opacity = '1';
                setPickyExpression('IDLE');
                speechBubbleDiv.innerHTML = `<p>${isSpanish ? "Picky espera al próximo artista estrella... ✨" : "Picky waits for the next star artist... ✨"}</p>`;
                speechBubbleDiv.classList.add('visible');
            }
        }
    }

    // --- Placeholder para análisis de formas (MUY simplificado y conceptual) ---
    function analyzeBasicShapes(data, width, height) {
        let hints = {}; // Placeholder
        return hints;
    }

    function analyzeCanvas() {
        checkPlayerTurn();
        if (!canvas || !ctx || isPlayerDrawing || (document.hidden && Math.random() > 0.3)) {
            return;
        }
        if (pickyContainer.style.opacity !== '1' && !isPlayerDrawing) {
             pickyContainer.style.opacity = '1';
        }

        const currentPixelData = getPixelData(canvas);
        if (!currentPixelData) return;

        const pixelDiffPercentage = comparePixelData(currentPixelData, lastPixelData);

        if (pixelDiffPercentage < DRAWING_CHANGE_THRESHOLD && lastPixelData !== null) {
            noChangeStreak++;
            if (noChangeStreak > STATIC_STREAK_LIMIT && !firedHintsThisTurn.has("staticDrawing_long") && speechBubbleDiv.classList.contains('visible') && hintCounterThisTurn < MAX_HINTS_PER_TURN) {
                 updatePickyHints("staticDrawing");
                 firedHintsThisTurn.add("staticDrawing_long");
                 noChangeStreak = 0;
            }
            return;
        }

        if (pixelDiffPercentage > 0.3 && lastPixelData !== null && !firedHintsThisTurn.has("fastDrawing") && hintCounterThisTurn < MAX_HINTS_PER_TURN) {
            updatePickyHints("fastDrawing");
            firedHintsThisTurn.add("fastDrawing");
        }

        noChangeStreak = 0;
        lastPixelData = currentPixelData;

        // --- Lógica de análisis de píxeles ---
        let colorCounts = {};
        let totalAnalyzedPixels = 0;
        let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
        let drawnPixelCount = 0;

        for (let y = 0; y < canvas.height; y += PIXEL_SAMPLE_STEP) {
            for (let x = 0; x < canvas.width; x += PIXEL_SAMPLE_STEP) {
                const i = (y * canvas.width + x) * 4;
                const r = currentPixelData[i], g = currentPixelData[i+1], b = currentPixelData[i+2], a = currentPixelData[i+3];
                if (a > 200 && !(r > 250 && g > 250 && b > 250)) {
                    drawnPixelCount++;
                    minX = Math.min(minX, x); minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
                    const colorName = getNearestColorName(r, g, b);
                    if (colorName !== "blanco" && colorName !== "white" && colorName !== "mixto" && colorName !== "mixed") {
                        colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
                        totalAnalyzedPixels++;
                    }
                }
            }
        }

        // Pista de Color Dominante
        if (totalAnalyzedPixels > 5 && hintCounterThisTurn < MAX_HINTS_PER_TURN) {
            let sortedColors = Object.entries(colorCounts).sort(([,a],[,b]) => b-a);
            if (sortedColors.length > 0 && sortedColors[0][1] / totalAnalyzedPixels > MIN_PIXEL_PERCENTAGE_FOR_DOMINANT_COLOR) {
                const dominantColor = sortedColors[0][0];
                const hintKey = `dominantColor_${dominantColor}`;
                if (!firedHintsThisTurn.has(hintKey)) {
                    updatePickyHints("dominantColor", { color: dominantColor });
                    firedHintsThisTurn.add(hintKey);
                }
            }
        }
        // (Aquí se añadirían más llamadas a updatePickyHints basadas en el análisis de aspect ratio, densidad, y los resultados de analyzeBasicShapes)

        let hasDrawnAnything = drawnPixelCount > 0;

        if (hintCounterThisTurn === 0 && hasDrawnAnything) {
             setPickyExpression('THINKING');
        } else if (!hasDrawnAnything && !isPlayerDrawing && hintCounterThisTurn < 1) {
             if (!firedHintsThisTurn.has("canvasAlmostEmpty")) {
                updatePickyHints("canvasAlmostEmpty");
                firedHintsThisTurn.add("canvasAlmostEmpty");
             }
        }
    }

    function init() {
        canvas = document.getElementById('canvas');
        if (!canvas) { setTimeout(init, 1000); return; }
        try { ctx = canvas.getContext('2d', { willReadFrequently: true }); }
        catch(e){ ctx = canvas.getContext('2d'); }
        if (!ctx) return;

        createPickyUI();
        checkPlayerTurn();
        setInterval(analyzeCanvas, ANALYSIS_INTERVAL);

        const playerList = document.getElementById('playerlist');
        if (playerList) {
            const observer = new MutationObserver(() => { requestAnimationFrame(checkPlayerTurn); });
            observer.observe(playerList, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'], characterData: false });
        }

        const timerElement = document.querySelector('.timer-text');
        if(timerElement) {
            const timerObserver = new MutationObserver((mutationsList) => {
                if (isPlayerDrawing || hintCounterThisTurn >= MAX_HINTS_PER_TURN) return;
                for(let mutation of mutationsList) {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        const currentTimeText = timerElement.textContent;
                        const currentTime = parseInt(currentTimeText);
                        if (!isNaN(currentTime)) {
                            if (currentTime < 20 && currentTime > 5 && !firedHintsThisTurn.has("timeRunningOutShort")) {
                                updatePickyHints("timeRunningOutShort");
                                firedHintsThisTurn.add("timeRunningOutShort");
                                break;
                            } else if (currentTime < 40 && currentTime >=20 && !firedHintsThisTurn.has("timeRunningOutMedium")) {
                                updatePickyHints("timeRunningOutMedium");
                                firedHintsThisTurn.add("timeRunningOutMedium");
                                break;
                            }
                        } else if (timerElement.closest(".timer") && timerElement.closest(".timer").style.display === 'none' && currentDrawerId) {
                            firedHintsThisTurn.clear(); lastPixelData = null; hintCounterThisTurn = 0;
                            setPickyExpression('IDLE');
                            speechBubbleDiv.innerHTML = `<p>${isSpanish ? "¡Pío! El tiempo se fue volando. ¿Adivinaron?" : "Peep! Time flew by. Did you guess?"}</p>`;
                            speechBubbleDiv.classList.add('visible');
                            break;
                        }
                    }
                }
            });
            const timerContainer = timerElement.closest(".timer");
            if (timerContainer) timerObserver.observe(timerContainer, { attributes: true, childList: true, subtree: true, characterData: true });
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(init, 2000);
    } else {
        window.addEventListener('load', ()=>{setTimeout(init, 2000)});
    }
})();
