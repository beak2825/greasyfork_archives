// ==UserScript==
// @name         Drawaria Audio Player Plus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Sound Reproducer for drawaria (paste code in console to work).
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none // Se mantiene 'none' ya que no usamos funciones GM_ específicas.
// @downloadURL https://update.greasyfork.org/scripts/536752/Drawaria%20Audio%20Player%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/536752/Drawaria%20Audio%20Player%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Definición de los sonidos de Drawaria ---
    const drawariaSounds = [
        { name: "Guess", url: "https://drawaria.online/snd/guess.mp3" },
        { name: "Tick", url: "https://drawaria.online/snd/tick.mp3" },
        { name: "AFK", url: "https://drawaria.online/snd/afk.mp3" },
        { name: "Select Word", url: "https://drawaria.online/snd/selword.mp3" },
        { name: "Other Guess", url: "https://drawaria.online/snd/otherguess.mp3" },
        { name: "Turn Results", url: "https://drawaria.online/snd/turnresults.mp3" },
        { name: "Turn Aborted", url: "https://drawaria.online/snd/turnaborted.mp3" },
        { name: "Start Draw", url: "https://drawaria.online/snd/startdraw.mp3" }
    ];

    // --- HTML para el reproductor ---
    const playerHTML = `
        <div id="dap-audio-editor" class="dap-audio-editor">
            <div class="dap-header">
                <span class="dap-title">Drawaria Audio Player</span>
                <button id="dap-toggle-visibility" title="Mostrar/Ocultar Reproductor">🔽</button>
                <button id="dap-close-btn" title="Cerrar Reproductor">✕</button>
            </div>
            <div id="dap-main-content">
                <div class="dap-controls-panel">
                    <div class="dap-playback-controls">
                        <select id="dap-sound-selector">
                            ${drawariaSounds.map(sound => `<option value="${sound.url}">${sound.name}</option>`).join('')}
                        </select>
                        <button id="dap-play-pause-btn" title="Play/Pause">▶️</button>
                        <button id="dap-stop-btn" title="Stop">⏹️</button>
                    </div>
                    <div class="dap-time-display">
                        <span id="dap-current-time">00:00.000</span> / <span id="dap-total-duration">00:00.000</span>
                    </div>
                    <div class="dap-extra-controls">
                        <label for="dap-volume-slider">Vol:</label>
                        <input type="range" id="dap-volume-slider" min="0" max="1" step="0.01" value="0.8" title="Volumen">
                        <label for="dap-speed-slider">Vel:</label>
                        <input type="range" id="dap-speed-slider" min="0.25" max="3" step="0.05" value="1" title="Velocidad">
                    </div>
                </div>
                <div class="dap-waveform-section">
                    <div class="dap-track-info">
                        <span id="dap-track-name" class="dap-track-name">TRACK 1</span>
                        <label class="dap-switch">
                            ON
                            <input type="checkbox" checked disabled>
                            <span class="dap-slider-switch"></span>
                        </label>
                    </div>
                    <canvas id="dap-waveform-canvas"></canvas>
                </div>
            </div>
        </div>
    `;

    // --- CSS para el reproductor ---
    const playerCSS = `
        .dap-audio-editor {
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 450px;
            max-width: 90vw;
            background-color: #34495e;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            color: #ecf0f1;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 12px;
            z-index: 9999;
            overflow: hidden;
            transition: height 0.3s ease-out, width 0.3s ease-out, padding 0.3s ease-out;
            resize: both; /* Permite redimensionar con el ratón */
            min-width: 160px; /* Ancho mínimo para el estado oculto */
            min-height: 40px; /* Alto mínimo para el estado oculto */
        }
        .dap-audio-editor.dap-hidden {
            height: 40px; /* Altura solo para la barra de título */
            width: 160px; /* Ancho reducido cuando está oculto */
            padding: 5px;
            overflow: hidden;
        }
        .dap-audio-editor.dap-hidden #dap-main-content {
            display: none;
        }
        .dap-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 8px;
            border-bottom: 1px solid #2c3e50;
            margin-bottom: 10px;
            cursor: grab; /* Indica que se puede arrastrar */
        }
        .dap-header:active {
            cursor: grabbing; /* Cursor cuando se está arrastrando */
        }
        .dap-title {
            font-weight: bold;
            flex-grow: 1; /* Permite que ocupe el espacio restante */
            user-select: none; /* Evita selección de texto al arrastrar */
        }
        .dap-header button {
            background: #4a6178;
            border: none;
            color: white;
            padding: 3px 6px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 5px;
            flex-shrink: 0; /* Evita que los botones se encojan */
        }
        .dap-header button:hover {
            background-color: #5d7a99;
        }
        .dap-controls-panel {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            flex-wrap: wrap;
            gap: 8px;
        }
        .dap-playback-controls, .dap-extra-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #dap-sound-selector, .dap-playback-controls button, .dap-extra-controls input[type="range"] {
            padding: 6px 8px;
            background-color: #4a6178;
            border: 1px solid #5d7a99;
            color: #ecf0f1;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            white-space: nowrap; /* Evita que los botones se rompan en varias líneas */
        }
        #dap-sound-selector { min-width: 100px; }
        .dap-playback-controls button:hover, #dap-sound-selector:hover { background-color: #5d7a99; }
        .dap-extra-controls input[type="range"] { accent-color: #3498db; max-width: 70px;}
        .dap-time-display {
            font-size: 1em;
            font-variant-numeric: tabular-nums;
            background-color: #222;
            padding: 4px 8px;
            border-radius: 3px;
            color: #fff;
            white-space: nowrap;
        }
        .dap-waveform-section {
            background-color: #283747;
            padding: 8px;
            border-radius: 4px;
        }
        .dap-track-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 0 4px;
        }
        .dap-track-name { font-weight: bold; }
        .dap-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 20px;
            line-height: 20px;
            font-size: 0.8em;
        }
        .dap-switch input { opacity: 0; width: 0; height: 0; }
        .dap-switch .dap-slider-switch {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 25px;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 20px;
            width: 25px;
        }
        .dap-switch .dap-slider-switch:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        .dap-switch input:checked + .dap-slider-switch { background-color: #2196F3; }
        .dap-switch input:checked + .dap-slider-switch:before { transform: translateX(5px); }
        #dap-waveform-canvas {
            width: 100%;
            height: 100px;
            background-color: #1f2b38;
            border-radius: 3px;
            border: 1px solid #4a6178;
            box-sizing: border-box; /* Asegura que padding y border no aumenten el tamaño */
        }
    `;

    // Función para inyectar CSS en el documento (ya que @grant none no permite GM_addStyle)
    function addStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // --- Lógica JavaScript del Reproductor ---
    function initializePlayerLogic() {
        // Obtener el elemento raíz del reproductor, ya que ahora está en el DOM
        const audioEditorDiv = document.getElementById('dap-audio-editor');

        // Verificar si el elemento raíz se encontró. Si no, algo salió mal.
        if (!audioEditorDiv) {
            console.error("Drawaria Audio Player: El elemento raíz 'dap-audio-editor' no se encontró en el DOM. El reproductor no puede inicializarse.");
            return;
        }

        // Obtener elementos usando querySelector dentro del contenedor principal
        const soundSelector = audioEditorDiv.querySelector('#dap-sound-selector');
        const playPauseBtn = audioEditorDiv.querySelector('#dap-play-pause-btn');
        const stopBtn = audioEditorDiv.querySelector('#dap-stop-btn');
        const volumeSlider = audioEditorDiv.querySelector('#dap-volume-slider');
        const speedSlider = audioEditorDiv.querySelector('#dap-speed-slider');
        const currentTimeDisplay = audioEditorDiv.querySelector('#dap-current-time');
        const totalDurationDisplay = audioEditorDiv.querySelector('#dap-total-duration');
        const waveformCanvas = audioEditorDiv.querySelector('#dap-waveform-canvas');
        const trackNameDisplay = audioEditorDiv.querySelector('#dap-track-name');
        const toggleVisibilityBtn = audioEditorDiv.querySelector('#dap-toggle-visibility');
        const closeBtn = audioEditorDiv.querySelector('#dap-close-btn');
        const dapHeader = audioEditorDiv.querySelector('.dap-header'); // Para arrastrar

        // Segunda verificación, más detallada para los sub-elementos.
        // Si uno no se encuentra, hay un problema con la estructura HTML o el CSS.
        if (!soundSelector || !playPauseBtn || !stopBtn || !volumeSlider || !speedSlider || !currentTimeDisplay || !totalDurationDisplay || !waveformCanvas || !trackNameDisplay || !toggleVisibilityBtn || !closeBtn || !dapHeader) {
            console.error("Drawaria Audio Player: Uno o más elementos internos del reproductor no se encontraron. La estructura HTML podría estar incompleta o los selectores son incorrectos.");
            // Opcional: Eliminar el reproductor si está defectuoso
            audioEditorDiv.remove();
            return;
        }

        let canvasCtx = waveformCanvas.getContext('2d'); // Ahora podemos obtener el contexto del canvas
        let audioContext;
        let audioBuffer;
        let sourceNode;
        let gainNode;
        let isPlaying = false;
        let startTime = 0;
        let startOffset = 0;
        let animationFrameId;

        // Variables para hacer el reproductor draggable
        let isDragging = false;
        let offsetX, offsetY;

        function initAudioContext() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                gainNode = audioContext.createGain();
                gainNode.connect(audioContext.destination);
                gainNode.gain.value = parseFloat(volumeSlider.value);
            }
        }

        async function loadSound(soundUrl, soundName) {
            initAudioContext();
            if (sourceNode) {
                try { sourceNode.stop(); } catch (e) { /* Ya podría estar detenido */ }
                sourceNode.disconnect();
                sourceNode = null;
            }
            isPlaying = false;
            playPauseBtn.innerHTML = '▶️';
            startOffset = 0;
            currentTimeDisplay.textContent = formatTime(0);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            updateControlsState(false);
            trackNameDisplay.textContent = soundName || "LOADING...";

            try {
                const response = await fetch(soundUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const arrayBuffer = await response.arrayBuffer();
                audioContext.decodeAudioData(arrayBuffer, (buffer) => {
                    audioBuffer = buffer;
                    totalDurationDisplay.textContent = formatTime(audioBuffer.duration);
                    drawWaveform(audioBuffer);
                    updateControlsState(true);
                    trackNameDisplay.textContent = soundName || "TRACK 1";
                }, (error) => {
                    console.error('Drawaria Audio Player: Error decodificando datos de audio:', error);
                    totalDurationDisplay.textContent = 'Decode Err';
                    trackNameDisplay.textContent = "ERROR";
                    drawWaveform(null); // Limpiar el canvas en caso de error
                });
            } catch (error) {
                console.error('Drawaria Audio Player: Error obteniendo el audio:', error);
                totalDurationDisplay.textContent = 'Fetch Err';
                trackNameDisplay.textContent = "ERROR";
                drawWaveform(null); // Limpiar el canvas en caso de error
            }
        }

        function updateControlsState(enabled) {
            playPauseBtn.disabled = !enabled;
            stopBtn.disabled = !enabled;
            speedSlider.disabled = !enabled;
            // El slider de volumen puede estar siempre habilitado si gainNode existe
        }

        function togglePlayPause() {
            if (!audioBuffer || !audioContext) return;
            // Reanudar el AudioContext si está suspendido (necesario por políticas de navegador)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            if (isPlaying) { // Si está reproduciendo -> Pausar
                if (sourceNode) try { sourceNode.stop(); } catch (e) {}
                startOffset += (audioContext.currentTime - startTime);
                isPlaying = false;
                playPauseBtn.innerHTML = '▶️';
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else { // Si está pausado o detenido -> Reproducir
                sourceNode = audioContext.createBufferSource();
                sourceNode.buffer = audioBuffer;
                sourceNode.playbackRate.value = parseFloat(speedSlider.value);
                sourceNode.connect(gainNode);
                startTime = audioContext.currentTime;
                sourceNode.start(0, startOffset % audioBuffer.duration);
                isPlaying = true;
                playPauseBtn.innerHTML = '⏸️';
                updateCurrentTime();
                sourceNode.onended = () => {
                    // Solo si terminó de forma natural, no por un stop/pause explícito
                    if (isPlaying && (audioContext.currentTime - startTime + startOffset) >= audioBuffer.duration - 0.05) {
                        isPlaying = false;
                        playPauseBtn.innerHTML = '▶️';
                        startOffset = 0;
                        currentTimeDisplay.textContent = formatTime(audioBuffer.duration);
                        if (animationFrameId) cancelAnimationFrame(animationFrameId);
                    }
                };
            }
        }

        function updateCurrentTime() {
            if (!isPlaying || !audioBuffer || !audioContext) return;
            let elapsedTime = (audioContext.currentTime - startTime) + startOffset;
            if (elapsedTime >= audioBuffer.duration) {
                elapsedTime = audioBuffer.duration;
            }
            currentTimeDisplay.textContent = formatTime(elapsedTime);
            animationFrameId = requestAnimationFrame(updateCurrentTime);
        }

        function stopSound() {
            if (sourceNode && isPlaying) {
                try { sourceNode.stop(); } catch (e) {}
            }
            isPlaying = false;
            playPauseBtn.innerHTML = '▶️';
            startOffset = 0;
            currentTimeDisplay.textContent = formatTime(0);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }

        volumeSlider.addEventListener('input', (e) => {
            if (gainNode) gainNode.gain.value = parseFloat(e.target.value);
        });

        speedSlider.addEventListener('input', (e) => {
            const newSpeed = parseFloat(e.target.value);
            if (sourceNode && isPlaying) sourceNode.playbackRate.value = newSpeed;
        });

        function formatTime(timeInSeconds) {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60);
            const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
        }

        function drawWaveform(buffer) {
            // Asegurarse de que el canvas tenga las dimensiones correctas antes de dibujar
            const width = waveformCanvas.offsetWidth;
            const height = waveformCanvas.offsetHeight;

            // Solo redimensionar si es necesario para evitar flickering constante
            if (waveformCanvas.width !== width || waveformCanvas.height !== height) {
                waveformCanvas.width = width;
                waveformCanvas.height = height;
            }

            const amp = height / 2;

            canvasCtx.clearRect(0, 0, width, height);
            canvasCtx.fillStyle = '#1f2b38';
            canvasCtx.fillRect(0, 0, width, height);

            if (!buffer) return;

            const data = buffer.getChannelData(0); // Tomar el primer canal
            const step = Math.ceil(data.length / width);

            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = '#3498db'; // Azul claro
            canvasCtx.beginPath();

            for (let i = 0; i < width; i++) {
                let minVal = 1.0;
                let maxVal = -1.0;
                for (let j = 0; j < step; j++) {
                    const sampleIndex = (i * step) + j;
                    if (sampleIndex < data.length) {
                        const datum = data[sampleIndex];
                        if (datum < minVal) minVal = datum;
                        if (datum > maxVal) maxVal = datum;
                    }
                }
                canvasCtx.moveTo(i, amp - (Math.abs(maxVal) * amp));
                canvasCtx.lineTo(i, amp + (Math.abs(minVal) * amp));
            }
            canvasCtx.stroke();

            // Dibujar línea central roja
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = 'rgba(200, 50, 50, 0.6)'; // Rojo semi-transparente
            canvasCtx.lineWidth = 1;
            canvasCtx.moveTo(0, amp);
            canvasCtx.lineTo(width, amp);
            canvasCtx.stroke();
        }

        soundSelector.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            loadSound(selectedOption.value, selectedOption.textContent);
        });

        playPauseBtn.addEventListener('click', () => {
            if (!audioContext) initAudioContext();
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(togglePlayPause);
            } else {
                togglePlayPause();
            }
        });
        stopBtn.addEventListener('click', stopSound);

        toggleVisibilityBtn.addEventListener('click', () => {
            audioEditorDiv.classList.toggle('dap-hidden');
            if (audioEditorDiv.classList.contains('dap-hidden')) {
                toggleVisibilityBtn.textContent = '🔼'; // Flecha hacia arriba para mostrar
                toggleVisibilityBtn.title = "Mostrar Reproductor";
            } else {
                toggleVisibilityBtn.textContent = '🔽'; // Flecha hacia abajo para ocultar
                toggleVisibilityBtn.title = "Ocultar Reproductor";
                // Redibujar waveform si estaba oculto o fue redimensionado
                if (audioBuffer) drawWaveform(audioBuffer);
            }
        });

        closeBtn.addEventListener('click', () => {
            // Detener cualquier reproducción antes de cerrar
            stopSound();
            // Cerrar el AudioContext para liberar recursos
            if (audioContext) {
                audioContext.close().then(() => {
                    audioContext = null;
                    gainNode = null;
                }).catch(e => console.error("Error al cerrar AudioContext:", e));
            }
            audioEditorDiv.remove(); // Eliminar el elemento del DOM
        });

        // Funcionalidad de arrastrar (draggable) por el encabezado
        dapHeader.addEventListener('mousedown', (e) => {
            // Solo arrastrar si el clic no es en un botón dentro del encabezado
            if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                isDragging = true;
                // Guardar la posición inicial del puntero en relación al elemento
                offsetX = e.clientX - audioEditorDiv.getBoundingClientRect().left;
                offsetY = e.clientY - audioEditorDiv.getBoundingClientRect().top;
                audioEditorDiv.style.cursor = 'grabbing';
                e.preventDefault(); // Prevenir la selección de texto al arrastrar
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                // Calcular las nuevas posiciones
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // Limitar para que no salga demasiado de la ventana
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - audioEditorDiv.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - audioEditorDiv.offsetHeight));

                audioEditorDiv.style.left = `${newLeft}px`;
                audioEditorDiv.style.top = `${newTop}px`;
                // Es importante desactivar 'right' y 'bottom' cuando se usa 'left' y 'top' para arrastrar
                audioEditorDiv.style.right = 'auto';
                audioEditorDiv.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                dapHeader.style.cursor = 'grab'; // Restablecer cursor del encabezado
            }
        });

        // Asegurar que el canvas tenga un tamaño inicial para dibujar
        // Esto es importante porque offsetWidth/offsetHeight pueden ser 0 si el elemento está oculto
        // Se puede redimensionar y dibujar una vez que se muestra o carga el audio
        waveformCanvas.width = waveformCanvas.offsetWidth;
        waveformCanvas.height = waveformCanvas.offsetHeight;


        // Carga inicial y estado
        updateControlsState(false);
        totalDurationDisplay.textContent = '00:00.000';
        currentTimeDisplay.textContent = '00:00.000';
        if (soundSelector.options.length > 0) {
            const firstSound = soundSelector.options[0];
            loadSound(firstSound.value, firstSound.textContent);
        } else {
            trackNameDisplay.textContent = "NO SOUNDS";
        }
        // El reproductor comienza *expandido* por defecto (quitamos .dap-hidden inicial)
        // Si quieres que comience oculto, quita esta línea y re-añade la clase y el icono de toggle
        // audioEditorDiv.classList.add('dap-hidden');
        // toggleVisibilityBtn.textContent = '🔼';
        // toggleVisibilityBtn.title = "Mostrar Reproductor";
        drawWaveform(null); // Dibujar el canvas vacío al inicio
    }

    // --- Inyección de UI y Ejecución ---
    function setupAndRun() {
        // Inyectar CSS
        addStyle(playerCSS);

        // Inyectar el HTML del reproductor directamente al body
        // Esto es más confiable que crear un div intermedio y luego transferir firstChild
        document.body.insertAdjacentHTML('beforeend', playerHTML);

        // Ya que el HTML se inserta como una cadena, necesitamos esperar un momento
        // para que el navegador lo parsee completamente y los elementos estén disponibles
        // en el DOM antes de intentar obtener sus referencias con getElementById/querySelector.
        setTimeout(initializePlayerLogic, 0); // Ejecutar la lógica de inicialización en el siguiente "tick" del navegador
    }

    // Esperar a que el DOM de la página original de Drawaria esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAndRun);
    } else {
        setupAndRun(); // Si ya está cargado (ej. Tampermonkey se ejecuta tarde), ejecutar inmediatamente
    }
})();