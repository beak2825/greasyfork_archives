// ==UserScript==
// @name         Drawaria Motor de Música y Piano
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Un motor de música y sintetizador avanzado para Drawaria.online con secuenciador, efectos visuales de partículas y una interfaz animada. ¡Crea música mientras juegas!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540177/Drawaria%20Motor%20de%20M%C3%BAsica%20y%20Piano.user.js
// @updateURL https://update.greasyfork.org/scripts/540177/Drawaria%20Motor%20de%20M%C3%BAsica%20y%20Piano.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Estilos CSS para la interfaz del sintetizador ---
    const styles = `
        #music-engine-container {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            background: linear-gradient(145deg, #2c3e50, #34495e);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.1);
            z-index: 9999;
            color: #ecf0f1;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 2px solid #4a6fa5;
            overflow: hidden;
            user-select: none;
        }

        #music-engine-header {
            padding: 10px;
            cursor: move;
            background: linear-gradient(145deg, #4a6fa5, #34495e);
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 0 1px 3px rgba(0,0,0,0.4);
            border-bottom: 1px solid #2c3e50;
        }

        #music-engine-header::before {
            content: '🎶 ';
        }

        #visualizer-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.7;
        }

        #piano-keys {
            display: flex;
            padding: 20px;
            position: relative;
        }

        .piano-key {
            position: relative;
            border: 1px solid #1a252f;
            border-radius: 0 0 8px 8px;
            box-shadow: inset 0 -5px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.05s ease;
        }

        .piano-key.white {
            width: 50px;
            height: 200px;
            background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
            color: #333;
        }

        .piano-key.white:active, .piano-key.white.pressed {
            background: linear-gradient(to bottom, #a8c0ff, #3f2b96);
            box-shadow: inset 0 -2px 5px rgba(0,0,0,0.5);
            transform: scale(0.98, 0.96);
        }

        .piano-key.black {
            position: absolute;
            width: 30px;
            height: 120px;
            background: linear-gradient(to bottom, #434343, #000000);
            z-index: 2;
            color: white;
            border-radius: 0 0 6px 6px;
            box-shadow: inset 0 -4px 8px rgba(0,0,0,0.6), 0 5px 5px rgba(0,0,0,0.3);
        }
        .piano-key.black:active, .piano-key.black.pressed {
            background: linear-gradient(to bottom, #764ba2, #667eea);
            box-shadow: inset 0 -2px 4px rgba(0,0,0,0.8), 0 2px 2px rgba(0,0,0,0.2);
            transform: scale(0.97, 0.95);
        }

        .key-label {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            font-weight: bold;
        }

        #sequencer-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: #2c3e50;
            border-top: 1px solid #4a6fa5;
        }

        .seq-button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            color: white;
        }

        #record-button { background-color: #c0392b; }
        #record-button:hover { background-color: #e74c3c; }
        #record-button.recording {
             background-color: #e74c3c;
             animation: pulse 1.5s infinite;
        }

        #play-button { background-color: #27ae60; }
        #play-button:hover { background-color: #2ecc71; }
        #play-button:disabled { background-color: #7f8c8d; cursor: not-allowed; }

        #stop-button { background-color: #2980b9; }
        #stop-button:hover { background-color: #3498db; }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
            100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
    `;

    // --- Lógica del Sintetizador ---

    // 1. Inicialización
    let audioContext;
    let mainGainNode;
    const activeOscillators = {};
    const particles = [];
    let isRecording = false;
    let sequence = [];
    let recordingStartTime;
    let playbackTimeouts = [];

    // Frecuencias de notas (Octava 4)
    const noteFrequencies = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
        'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
        'A#': 466.16, 'B': 493.88
    };

    // Estructura del piano
    const pianoLayout = [
        { note: 'C', type: 'white' }, { note: 'C#', type: 'black' },
        { note: 'D', type: 'white' }, { note: 'D#', type: 'black' },
        { note: 'E', type: 'white' },
        { note: 'F', type: 'white' }, { note: 'F#', type: 'black' },
        { note: 'G', type: 'white' }, { note: 'G#', type: 'black' },
        { note: 'A', type: 'white' }, { note: 'A#', type: 'black' },
        { note: 'B', type: 'white' }
    ];

    function initAudio() {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                mainGainNode = audioContext.createGain();
                mainGainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volumen maestro
                mainGainNode.connect(audioContext.destination);
            } catch (e) {
                alert('La API de Audio Web no es compatible con este navegador.');
            }
        }
    }

    // 2. Crear la interfaz (UI)
    function createUI() {
        // Inyectar CSS
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Contenedor principal
        const container = document.createElement('div');
        container.id = 'music-engine-container';

        // Lienzo para visuales
        const canvas = document.createElement('canvas');
        canvas.id = 'visualizer-canvas';
        const ctx = canvas.getContext('2d');

        // Cabecera
        const header = document.createElement('div');
        header.id = 'music-engine-header';
        header.textContent = 'Motor de Música y Sintetizador';

        // Teclado
        const pianoContainer = document.createElement('div');
        pianoContainer.id = 'piano-keys';

        // Controles del secuenciador
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'sequencer-controls';

        const recordBtn = document.createElement('button');
        recordBtn.id = 'record-button';
        recordBtn.className = 'seq-button';
        recordBtn.textContent = '● Grabar';
        recordBtn.onclick = toggleRecording;

        const playBtn = document.createElement('button');
        playBtn.id = 'play-button';
        playBtn.className = 'seq-button';
        playBtn.textContent = '▶ Reproducir';
        playBtn.disabled = true;
        playBtn.onclick = playSequence;


        const stopBtn = document.createElement('button');
        stopBtn.id = 'stop-button';
        stopBtn.className = 'seq-button';
        stopBtn.textContent = '■ Detener';
        stopBtn.onclick = stopPlayback;


        controlsContainer.append(recordBtn, playBtn, stopBtn);
        container.append(header, canvas, pianoContainer, controlsContainer);
        document.body.appendChild(container);

        // Redimensionar canvas y generar teclas
        setupCanvas(canvas, container);
        createPianoKeys(pianoContainer, canvas);

        // Hacer que el contenedor sea arrastrable
        makeDraggable(container, header);

        // Iniciar animación del canvas
        animateParticles(canvas, ctx);
    }

    function createPianoKeys(pianoContainer, canvas) {
        let whiteKeyOffset = 0;
        pianoLayout.forEach(keyInfo => {
            const keyElement = document.createElement('div');
            keyElement.className = `piano-key ${keyInfo.type}`;
            keyElement.dataset.note = keyInfo.note;

            const keyLabel = document.createElement('div');
            keyLabel.className = 'key-label';
            keyLabel.textContent = keyInfo.note;
            keyElement.appendChild(keyLabel);

            if (keyInfo.type === 'white') {
                keyElement.style.left = `${whiteKeyOffset}px`;
                whiteKeyOffset += 52; // Ancho de la tecla blanca + margen
            } else { // black
                keyElement.style.left = `${whiteKeyOffset - 17}px`; // Ajuste para posicionar sobre las blancas
            }

            keyElement.addEventListener('mousedown', (e) => playNote(keyInfo.note, keyElement, e));
            keyElement.addEventListener('mouseup', () => stopNote(keyInfo.note));
            keyElement.addEventListener('mouseleave', () => stopNote(keyInfo.note));

            pianoContainer.appendChild(keyElement);
        });
    }

    function setupCanvas(canvas, container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        window.addEventListener('resize', () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        });
    }

    // 3. Motor de Audio
    function playNote(note, element, event) {
        initAudio();
        if (!audioContext || activeOscillators[note]) return;

        const freq = noteFrequencies[note];
        if (!freq) return;

        // Crear oscilador y ganancia
        const oscillator = audioContext.createOscillator();
        const noteGain = audioContext.createGain();

        oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        // Envolvente de volumen (ataque y decaimiento)
        noteGain.gain.setValueAtTime(0, audioContext.currentTime);
        noteGain.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.05); // Ataque rápido
        noteGain.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.15); // Sostenido

        oscillator.connect(noteGain);
        noteGain.connect(mainGainNode);
        oscillator.start();

        activeOscillators[note] = { oscillator, gain: noteGain };

        // Efectos visuales
        element.classList.add('pressed');
        const rect = element.getBoundingClientRect();
        const containerRect = element.closest('#music-engine-container').getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top;
        createParticleEffect(x, y);

        // Lógica del secuenciador
        if (isRecording) {
            const time = audioContext.currentTime - recordingStartTime;
            sequence.push({ note, time, duration: 0.3 }); // Duración fija por ahora
        }
    }

    function stopNote(note) {
        const activeOsc = activeOscillators[note];
        if (activeOsc && audioContext) {
            const { oscillator, gain } = activeOsc;
            const releaseTime = audioContext.currentTime + 0.3; // Tiempo de liberación
            gain.gain.cancelScheduledValues(audioContext.currentTime);
            gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0, releaseTime);

            oscillator.stop(releaseTime);
            delete activeOscillators[note];

            const keyElement = document.querySelector(`.piano-key[data-note="${note}"]`);
            if (keyElement) {
                keyElement.classList.remove('pressed');
            }
        }
    }

    // 4. Lógica del Secuenciador
    function toggleRecording() {
        const recordBtn = document.getElementById('record-button');
        const playBtn = document.getElementById('play-button');
        isRecording = !isRecording;

        if (isRecording) {
            initAudio(); // Asegurar que el contexto de audio esté listo
            sequence = [];
            recordingStartTime = audioContext.currentTime;
            recordBtn.classList.add('recording');
            recordBtn.textContent = '■ Grabando...';
            playBtn.disabled = true;
            stopPlayback(); // Detener cualquier reproducción en curso
        } else {
            recordBtn.classList.remove('recording');
            recordBtn.textContent = '● Grabar';
            playBtn.disabled = sequence.length === 0;
        }
    }

    function playSequence() {
        if (sequence.length === 0) return;
        stopPlayback(); // Limpiar timeouts anteriores

        sequence.forEach(noteEvent => {
            // Simular pulsación visual
            const timeoutIdVisual = setTimeout(() => {
                const keyElement = document.querySelector(`.piano-key[data-note="${noteEvent.note}"]`);
                if (keyElement) {
                    keyElement.classList.add('pressed');
                    setTimeout(() => keyElement.classList.remove('pressed'), noteEvent.duration * 1000);
                     const rect = keyElement.getBoundingClientRect();
                    const containerRect = keyElement.closest('#music-engine-container').getBoundingClientRect();
                    const x = rect.left - containerRect.left + rect.width / 2;
                    const y = rect.top - containerRect.top;
                    createParticleEffect(x, y);
                }
            }, noteEvent.time * 1000);

            // Tocar el sonido
            const timeoutIdAudio = setTimeout(() => {
                playNoteForDuration(noteEvent.note, noteEvent.duration);
            }, noteEvent.time * 1000);

            playbackTimeouts.push(timeoutIdVisual, timeoutIdAudio);
        });
    }

    function stopPlayback() {
        playbackTimeouts.forEach(clearTimeout);
        playbackTimeouts = [];
        // Detener todos los sonidos que puedan estar sonando de la reproducción
        for (const note in activeOscillators) {
            stopNote(note);
        }
    }

    function playNoteForDuration(note, duration) {
        playNote(note, document.querySelector(`.piano-key[data-note="${note}"]`), null);
        setTimeout(() => stopNote(note), duration * 1000);
    }

    // 5. Motor de Efectos Visuales (Canvas)
    function createParticleEffect(x, y) {
        const particleCount = 30;
        const hue = Math.random() * 360;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y, hue));
        }
    }

    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 7 + 3;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * -3 - 1; // Mover hacia arriba
            this.color = `hsl(${hue}, 100%, 70%)`;
            this.life = 1;
            this.gravity = 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.life -= 0.02;
            if (this.size > 0.2) this.size -= 0.1;
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Añadir un brillo
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
        }
    }

    function animateParticles(canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        requestAnimationFrame(() => animateParticles(canvas, ctx));
    }

    // 6. Funcionalidad de Arrastrar
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // --- Iniciar todo ---
    window.addEventListener('load', createUI);

})();