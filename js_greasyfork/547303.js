// ==UserScript==
// @name Drawaria Video Editor
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Advanced video editor for Drawaria.online Audio, effects and loaded images
// @author YouTubeDrawaria
// @match https://drawaria.online/*
// @grant none
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/547303/Drawaria%20Video%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/547303/Drawaria%20Video%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para crear e inyectar el editor de video
    function createVideoEditor() {
        // Crear contenedor principal del editor
        const editorContainer = document.createElement('div');
        editorContainer.id = 'drawaria-video-editor';
        editorContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999999;
            background: #1a1a1a;
            display: none;
        `;

        // Inyectar el CSS
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos generales del editor de video */
            #drawaria-video-editor {
                font-family: 'Arial', sans-serif;
                color: white;
                overflow: hidden;
            }

            #drawaria-video-editor * {
                box-sizing: border-box;
            }

            #drawaria-video-editor #main-container {
                display: flex;
                height: 100vh;
                width: 100vw;
                background: #222;
                color: white;
            }

            /* Panel izquierdo para controles */
            #drawaria-video-editor #left-panel {
                flex: 1;
                display: flex;
                flex-direction: column;
                background: #111;
                padding: 10px;
                overflow-y: auto;
                transition: transform 0.3s ease;
                border-right: 3px solid #444;
            }

            #drawaria-video-editor #controls {
                width: 100%;
                box-sizing: border-box;
            }

            #drawaria-video-editor .control-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
                background: #1c1c1c;
                padding: 10px;
                border-radius: 8px;
            }

            #drawaria-video-editor .control-row {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                justify-content: center;
                width: 100%;
            }

            #drawaria-video-editor .url-container {
                display: flex;
                gap: 10px;
                align-items: center;
                width: 100%;
                max-width: 500px;
            }

            /* Panel derecho para el canvas */
            #drawaria-video-editor #right-panel {
                flex: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #222;
                position: relative;
                transition: transform 0.3s ease;
            }

            /* Estilos para el canvas */
            #drawaria-video-editor #canvas {
                display: block;
                max-width: 100%;
                max-height: 80vh;
                border: 1px solid #444;
                cursor: crosshair;
                background-color: black;
                border-radius: 4px;
                box-shadow: 0 0 15px rgba(0, 100, 255, 0.3);
            }

            /* Estilos de botones */
            #drawaria-video-editor .button {
                padding: 10px 20px;
                font-weight: bold;
                border: none;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.2s ease;
                font-size: 14px;
                min-width: 120px;
            }

            #drawaria-video-editor .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }

            #drawaria-video-editor .start-btn { background: #0f0; color: #000; }
            #drawaria-video-editor .stop-btn { background: #ff0; color: #000; }
            #drawaria-video-editor .emergency-btn { background: #f44336; color: #fff; }
            #drawaria-video-editor .download-btn { background: #0ff; color: #000; }
            #drawaria-video-editor .single-image-btn { background: #666; color: #fff; }
            #drawaria-video-editor .multi-image-btn { background: #007bff; color: #fff; }
            #drawaria-video-editor .size-btn { background: #555; color: #fff; }
            #drawaria-video-editor .playback-btn { background: #337ab7; color: #fff; }
            #drawaria-video-editor .diagonal-btn { background: #2a5a8a; color: #fff; }
            #drawaria-video-editor .effect-btn { background: #d9534f; color: #fff; }
            #drawaria-video-editor .zoom-btn { background: #5cb85c; color: #fff; }
            #drawaria-video-editor .preview-btn { background: #f0ad4e; color: #000; }
            #drawaria-video-editor .file-nav-btn { background: #6c757d; color: #fff; }
            #drawaria-video-editor .audio-btn { background: #666; color: #fff; }
            #drawaria-video-editor .remove-effects-btn { background: #a52a2a; color: #fff; }
            #drawaria-video-editor .load-url-btn { background: #17a2b8; color: #fff; }
            #drawaria-video-editor .soundcloud-btn { background: #ff5500; color: #fff; }
            #drawaria-video-editor .screen-rec-btn { background: #9c27b0; color: #fff; }
            #drawaria-video-editor .close-editor-btn { background: #dc3545; color: #fff; }

            #drawaria-video-editor .widget-btn {
                background: #ff5500;
                color: #fff;
                font-size: 12px;
                padding: 5px 10px;
                min-width: auto;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* Animaciones */
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            #drawaria-video-editor .recording-btn {
                animation: pulse 1.5s infinite;
                background: #f44336 !important;
            }

            /* Controles de grabación de pantalla */
            #drawaria-video-editor #screen-recording-controls {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 10001;
                background: rgba(0,0,0,0.7);
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 0 15px rgba(0, 100, 255, 0.5);
                backdrop-filter: blur(5px);
                border: 1px solid #333;
            }

            #drawaria-video-editor #recording-timer {
                color: #00ffff;
                font-weight: bold;
                font-size: 18px;
                margin-top: 5px;
                text-align: center;
            }

            /* Toast notifications */
            #drawaria-video-editor #toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: 300px;
            }

            #drawaria-video-editor .toast {
                background: rgba(30, 30, 30, 0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #007bff;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                transition: transform 0.3s ease, opacity 0.3s ease;
            }

            #drawaria-video-editor .toast.success { border-left-color: #28a745; }
            #drawaria-video-editor .toast.error { border-left-color: #dc3545; }
            #drawaria-video-editor .toast.warning { border-left-color: #ffc107; }
            #drawaria-video-editor .toast.info { border-left-color: #17a2b8; }

            #drawaria-video-editor .soundcloud-badge {
                background: linear-gradient(135deg, #f55125, #ff8800);
                padding: 4px 10px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 12px;
                display: inline-block;
                margin: 5px 0;
            }

            #drawaria-video-editor .newgrounds-badge {
                background: linear-gradient(135deg, #00b4ff, #004799);
                padding: 4px 10px;
                border-radius: 12px;
                font-weight: bold;
                font-size: 12px;
                display: inline-block;
                margin: 5px 0;
            }

            #drawaria-video-editor input[type="text"],
            #drawaria-video-editor input[type="range"] {
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 4px;
                color: white;
                padding: 8px;
            }

            #drawaria-video-editor input[type="range"] {
                padding: 0;
                height: 30px;
            }

            /* Widget de SoundCloud */
            #drawaria-video-editor #soundcloud-widget-container {
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: rgba(0,0,0,0.8);
                padding: 10px;
                border-radius: 8px;
                border: 1px solid #333;
                z-index: 10000;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(3px);
            }

            #drawaria-video-editor #soundcloud-widget-container.hidden {
                display: none;
            }

            #drawaria-video-editor #soundcloud-widget {
                width: 300px;
                height: 166px;
                border: none;
                border-radius: 4px;
            }

            #drawaria-video-editor .widget-controls {
                display: flex;
                gap: 10px;
                margin-top: 5px;
                align-items: center;
            }

            #drawaria-video-editor .widget-info {
                color: #fff;
                font-size: 12px;
                margin-top: 5px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 280px;
            }

            /* Responsive */
            @media (max-width: 768px) {
                #drawaria-video-editor #main-container {
                    flex-direction: column;
                    height: auto;
                }

                #drawaria-video-editor #left-panel,
                #drawaria-video-editor #right-panel {
                    width: 100%;
                    flex: none;
                }

                #drawaria-video-editor #canvas {
                    margin: 20px auto;
                    max-width: 90%;
                    max-height: 50vh;
                }
            }


            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);

        // HTML del editor
        editorContainer.innerHTML = `
            <div id="toast-container"></div>

            <div id="main-container">
                <div id="left-panel">
                    <div id="controls">
                        <div class="control-group">
                            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                <p style="font-size: 19px; margin: 0; font-weight: bold;">Drawaria.online Video Editor</p>
                                <button class="button close-editor-btn" onclick="window.drawariaVideoEditor.close()">✖ Cerrar</button>
                            </div>
                            <p style="font-size: 14px; margin: 0; color: #aaa;">Imagen URL:</p>
                            <div class="url-container">
                                <input type="text" id="imageUrl" placeholder="https://i.ibb.co/QFnyrtyD/drawaria-video-editor.png"
                                       value="https://i.ibb.co/WWhBWyMG/editor-video-drawaria.png" style="flex: 1;">
                                <button class="button load-url-btn" onclick="window.drawariaVideoEditor.loadImageFromUrl()">🔗 Cargar URL</button>
                            </div>
                        </div>

                        <div class="control-group">
                            <p style="font-size: 14px; margin: 0; color: #aaa;">🎶 Cargar Audio:</p>
                            <div class="url-container">
                                <input type="text" id="audioUrl"
                                       placeholder="SoundCloud, Newgrounds o URL directa de audio..."
                                       value="https://audio.ngfiles.com/581000/581799_Remix--Super-Mario-Bros.mp3?f1405275853"
                                       style="flex: 1;">
                                <button class="button soundcloud-btn" onclick="window.drawariaVideoEditor.loadAudioFromUrl()">🎵 Cargar Audio</button>
                            </div>
                            <div class="control-row">
                                <button class="button load-url-btn" onclick="window.drawariaVideoEditor.testAudioUrl()">🔍 Comprobar URL</button>
                                <button class="button load-url-btn" onclick="window.drawariaVideoEditor.testAudioCapture()">🔊 Probar Captura</button>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
                                <span class="soundcloud-badge">SoundCloud</span>
                                <span class="newgrounds-badge">Newgrounds</span>
                            </div>
                        </div>

                        <div class="control-group">
                            <p style="font-size: 14px; margin: 0; color: #aaa;">Ajustar Tamaño:</p>
                            <div class="control-row">
                                <button class="button size-btn" onclick="window.drawariaVideoEditor.setCanvasSize('small')">Pequeño</button>
                                <button class="button size-btn" onclick="window.drawariaVideoEditor.setCanvasSize('medium')">Mediano</button>
                                <button class="button size-btn" onclick="window.drawariaVideoEditor.setCanvasSize('large')">Grande</button>
                                <button class="button size-btn" onclick="window.drawariaVideoEditor.setCanvasSize('drawaria')">Drawaria</button>
                            </div>
                        </div>

                        <div class="control-group">
                            <div class="control-row">
                                <label for="speedSlider">Velocidad: <span id="speedValue">2.0x</span></label>
                                <input type="range" id="speedSlider" min="0.1" max="10" step="0.1" value="2"
                                       oninput="window.drawariaVideoEditor.updateSpeed()" style="flex: 1; margin: 0 10px;">
                            </div>
                            <div class="control-row">
                                <button class="button zoom-btn" onclick="window.drawariaVideoEditor.zoomImage(0.1)">🔍 Zoom In</button>
                                <button class="button zoom-btn" onclick="window.drawariaVideoEditor.zoomImage(-0.1)">🔎 Zoom Out</button>
                            </div>
                        </div>

                        <div class="control-group">
                            <p style="font-size: 14px; margin: 0; color: #aaa;">Dirección de Scroll:</p>
                            <div class="control-row">
                                <button class="button playback-btn" onclick="window.drawariaVideoEditor.setScrollMode('right')">Derecha</button>
                                <button class="button playback-btn" onclick="window.drawariaVideoEditor.setScrollMode('left')">Izquierda</button>
                                <button class="button playback-btn" onclick="window.drawariaVideoEditor.setScrollMode('up')">Arriba</button>
                                <button class="button playback-btn" onclick="window.drawariaVideoEditor.setScrollMode('down')">Abajo</button>
                                <button class="button playback-btn" onclick="window.drawariaVideoEditor.setScrollMode('static')">Estático</button>
                            </div>
                        </div>

                        <div class="control-group">
                            <button class="button preview-btn" id="previewBtn" onclick="window.drawariaVideoEditor.togglePreviewMode()">🖼️ Previsualizar</button>
                            <button class="button start-btn" id="startBtn" onclick="window.drawariaVideoEditor.startAnimation()">▷ Iniciar Grabación</button>
                            <button class="button screen-rec-btn" onclick="window.drawariaVideoEditor.startScreenRecording()">🎥 Compartir Pantalla</button>
                        </div>



                        <div class="control-group">
                            <button class="button playback-btn" id="pauseBtn" onclick="window.drawariaVideoEditor.togglePause()">⏸ Pausar/Reanudar</button>
                            <button class="button stop-btn" id="stopBtn" style="display:none;" onclick="window.drawariaVideoEditor.stopRecording()">⏹ Parar y Descargar</button>
                            <button class="button emergency-btn" id="emergencyBtn" style="display:none;" onclick="window.drawariaVideoEditor.emergencyStop()">🛑 PARAR AHORA</button>
                        </div>

                        <div class="control-group">
                            <p style="font-size: 14px; margin: 0; color: #aaa;">Efectos Visuales:</p>
                            <div class="control-row">
                                <button class="button effect-btn" onclick="window.drawariaVideoEditor.toggleEffect('snow')">❄️ Nieve</button>
                                <button class="button effect-btn" onclick="window.drawariaVideoEditor.toggleEffect('sparkles')">✨ Destellos</button>
                                <button class="button effect-btn" onclick="window.drawariaVideoEditor.toggleEffect('fire')">🔥 Fuego</button>
                            </div>
                            <div class="control-row">
                                <button class="button remove-effects-btn" onclick="window.drawariaVideoEditor.removeAllEffects()">❌ Remover Efectos</button>
                            </div>
                        </div>

                        <div id="status" style="margin-top: 10px; font-size: 14px; color: #888; text-align: center; min-height: 20px;"></div>
                    </div>
                </div>

                <div id="right-panel">
                    <div style="position: relative; width: 100%;">
                        <canvas id="canvas"></canvas>
                        <button class="button download-btn" id="downloadBtn" style="display:none; width: 90%; margin-top: 15px;"
                                onclick="window.drawariaVideoEditor.downloadVideo()">
                            ↓ Descargar como WebM ↓
                        </button>
                        <div style="position: absolute; top: 5px; right: 5px; color: #aaa; font-size: 12px; background: rgba(0,0,0,0.5); padding: 3px 10px; border-radius: 5px;">
                            Resolución: <span id="resolutionDisplay">862x718</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="screen-recording-controls" style="display:none;">
                <button class="button recording-btn" id="screenStopBtn" onclick="window.drawariaVideoEditor.stopScreenRecording()">
                    ■ Detener Grabación
                </button>
                <div id="recording-timer">00:00</div>
            </div>

            <div id="soundcloud-widget-container" class="hidden">
                <iframe id="soundcloud-widget"
                    scrolling="no"
                    frameborder="no"
                    allow="autoplay; encrypted-media; fullscreen"
                    sandbox="allow-scripts allow-presentation">
                </iframe>
                <div class="widget-controls">
                    <button class="button widget-btn" onclick="window.drawariaVideoEditor.soundCloudManager.play()">▶</button>
                    <button class="button widget-btn" onclick="window.drawariaVideoEditor.soundCloudManager.pause()">⏸</button>
                    <button class="button widget-btn" onclick="window.drawariaVideoEditor.toggleWidgetVisibility()">✖</button>
                </div>
                <div class="widget-info" id="widget-info">Widget SoundCloud</div>
            </div>

            <audio id="backgroundMusic" loop crossOrigin="anonymous"></audio>

                        <div class="control-group">
                            <button class="button multi-image-btn" onclick="document.getElementById('multiFileInput').click()">🖼️ Múltiples Imágenes</button>
                            <input type="file" id="multiFileInput" accept="image/*" multiple style="display: none;">
                            <button class="button single-image-btn" onclick="document.getElementById('singleFileInput').click()">Importar imagen</button>
                            <input type="file" id="singleFileInput" accept="image/*" style="display: none;">
                            <button class="button audio-btn" onclick="document.getElementById('audioInput').click()">Archivo Local</button>
                            <input type="file" id="audioInput" accept="audio/*" style="display: none;">
                        </div>
        `;

        document.body.appendChild(editorContainer);
        return editorContainer;
    }

    // ==========================================
    //  MANAGER DE SOUNDCLOUD WIDGET API (MEJORADO)
    // ==========================================
    class SoundCloudWidgetManager {
        constructor() {
            this.widget = null;
            this.isLoaded = false;
            this.currentTrack = null;
            this.isPlaying = false;
            this.hasUserInteracted = false;
            this.detectUserInteraction();
        }

        isSoundCloudUrl(url) {
            const soundcloudPatterns = [
                /^https?:\/\/(www\.)?soundcloud\.com\//,
                /^https?:\/\/on\.soundcloud\.com\//
            ];
            return soundcloudPatterns.some(pattern => pattern.test(url));
        }

        async loadSoundCloudTrack(soundcloudUrl) {
            try {
                window.drawariaVideoEditor.updateStatus('🎵 Cargando SoundCloud (API oficial)...');

                const iframe = window.drawariaVideoEditor.container.querySelector('#soundcloud-widget');
                const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&auto_play=false&hide_related=true&show_comments=false&show_user=true&visual=true`;

                iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
                iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
                iframe.src = widgetUrl;

                window.drawariaVideoEditor.container.querySelector('#soundcloud-widget-container').classList.remove('hidden');

                return new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Timeout cargando SoundCloud'));
                    }, 15000);

                    iframe.onload = () => {
                        clearTimeout(timeout);
                        resolve({ title: 'SoundCloud Track', user: { username: 'Usuario' }});

                        window.drawariaVideoEditor.container.querySelector('#widget-info').textContent = 'SoundCloud Track cargado';
                        window.drawariaVideoEditor.updateStatus('✅ SoundCloud cargado', 'success');
                        this.isLoaded = true;
                    };
                });

            } catch (error) {
                console.error('Error con SoundCloud:', error);
                throw new Error(`SoundCloud: ${error.message}`);
            }
        }

        play() {
            if (!this.hasUserInteracted) {
                window.drawariaVideoEditor.updateStatus('👆 Haz clic en cualquier botón primero', 'warning');
                return;
            }

            if (this.widget && this.isLoaded) {
                this.widget.play();
                this.isPlaying = true;
                window.drawariaVideoEditor.updateStatus('▶️ Reproduciendo SoundCloud', 'info');
            }
        }

        pause() {
            if (this.widget && this.isLoaded) {
                this.widget.pause();
                this.isPlaying = false;
                window.drawariaVideoEditor.updateStatus('⏸ SoundCloud pausado', 'info');
            }
        }

        detectUserInteraction() {
            const detectInteraction = () => {
                this.hasUserInteracted = true;
                document.removeEventListener('click', detectInteraction);
                document.removeEventListener('keydown', detectInteraction);
            };

            document.addEventListener('click', detectInteraction);
            document.addEventListener('keydown', detectInteraction);
        }
    }

    // ==========================================
    //  SISTEMA DE MÚLTIPLES ARCHIVOS DE AUDIO
    // ==========================================
    class MultiAudioManager {
        constructor() {
            this.audioContext = null;
            this.audioSources = new Map();
            this.masterGain = null;
            this.outputDestination = null;
        }

        async init() {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.audioContext.createGain();
                this.outputDestination = this.audioContext.createMediaStreamDestination();

                this.masterGain.connect(this.outputDestination);

                window.drawariaVideoEditor.updateStatus('🎵 Sistema de múltiple audio inicializado', 'success');
                return true;
            } catch (error) {
                console.error('Error inicializando Web Audio API:', error);
                window.drawariaVideoEditor.updateStatus('❌ Error inicializando sistema de audio', 'error');
                return false;
            }
        }

        async loadAudioFile(file, id = null) {
            if (!this.audioContext) {
                await this.init();
            }

            const audioId = id || `audio_${Date.now()}`;

            try {
                const arrayBuffer = await file.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();

                source.buffer = audioBuffer;
                source.loop = true;

                source.connect(gainNode);
                gainNode.connect(this.masterGain);

                this.audioSources.set(audioId, {
                    source: source,
                    gain: gainNode,
                    buffer: audioBuffer,
                    isPlaying: false,
                    file: file
                });

                window.drawariaVideoEditor.updateStatus(`✅ Audio ${file.name} cargado (ID: ${audioId})`, 'success');
                return audioId;

            } catch (error) {
                console.error('Error cargando audio:', error);
                window.drawariaVideoEditor.updateStatus(`❌ Error cargando ${file.name}`, 'error');
                throw error;
            }
        }

        getAudioStream() {
            return this.outputDestination ? this.outputDestination.stream : null;
        }

        listLoadedAudio() {
            const list = [];
            this.audioSources.forEach((audio, id) => {
                list.push({
                    id: id,
                    name: audio.file.name,
                    isPlaying: audio.isPlaying,
                    volume: audio.gain.gain.value
                });
            });
            return list;
        }
    }

    // Clase principal del editor
    class DrawariaVideoEditor {
        constructor(container) {
            this.container = container;
            this.initializeVariables();
            this.setupEventListeners();
            this.initializeCanvas();
            this.showNotification('Editor de Video cargado - ¡Listo para usar!', 'success');
        }

        initializeVariables() {
            // Variables globales del editor
            this.mediaRecorder = null;
            this.recordedChunks = [];
            this.videoBlob = null;
            this.isRecording = false;
            this.animationRunning = false;
            this.animationFrameId = null;
            this.scrollSpeed = 2;
            this.scrollMode = 'right';
            this.isPaused = false;
            this.zoomLevel = 1.0;
            this.isPreviewMode = false;
            this.imageLoaded = false;
            this.previewOffset = { x: 0, y: 0 };
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.scrollPos = { x: 0, y: 0, directionX: 1, directionY: 1 };
            this.activeEffects = new Set();
            this.snowFlakes = [];
            this.sparkles = [];
            this.fireParticles = [];
            this.isScreenRecording = false;
            this.recordingStartTime = null;
            this.recordingTimerInterval = null;

            this.sizePresets = {
                'small': { width: 640, height: 480 },
                'medium': { width: 960, height: 720 },
                'large': { width: 1280, height: 960 },
                'drawaria': { width: 862, height: 718 }
            };

            this.canvasSize = 'drawaria';
            this.img = new Image();
            this.img.crossOrigin = "anonymous";
            this.img.oncontextmenu = () => false;

            // Inicializar managers de audio
            this.soundCloudManager = new SoundCloudWidgetManager();
            this.multiAudioManager = new MultiAudioManager();
        }

        setupEventListeners() {
            // Configurar manejo de archivos
            const singleFileInput = this.container.querySelector('#singleFileInput');
            const multiFileInput = this.container.querySelector('#multiFileInput');
            const audioInput = this.container.querySelector('#audioInput');

            singleFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    this.handleSingleFile(e.target.files);
                }
                e.target.value = '';
            });

            multiFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    this.handleMultiFiles(Array.from(e.target.files));
                }
                e.target.value = '';
            });

            audioInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    this.handleAudioFile(e.target.files);
                }
                e.target.value = '';
            });

            // Configurar canvas para arrastrar
            const canvas = this.container.querySelector('#canvas');
            canvas.addEventListener('mousedown', (e) => this.startDrag(e));
            canvas.addEventListener('mousemove', (e) => this.drag(e));
            canvas.addEventListener('mouseup', (e) => this.stopDrag(e));

            // Atajos de teclado
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        initializeCanvas() {
            this.setCanvasSize('drawaria');
            this.updateSpeed();

            // Cargar imagen por defecto
            const defaultUrl = this.container.querySelector('#imageUrl').value;
            if (defaultUrl) {
                this.loadImageFromUrl();
            }
        }

        // ==========================================
        //  FUNCIONES DE AUDIO MEJORADAS (DESDE TU PÁGINA)
        // ==========================================

        checkBrowserCompatibility() {
            const issues = [];

            if (!window.MediaRecorder || !MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                issues.push('MediaRecorder API no soportado');
            }

            if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getDisplayMedia) {
                issues.push('getDisplayMedia API no soportado');
            }

            if (issues.length > 0) {
                const message = `⚠️ Problemas de compatibilidad: ${issues.join(', ')}`;
                this.showNotification(message, 'warning');
                return false;
            }

            return true;
        }

        isNewgroundsUrl(url) {
            return url.includes('audio.ngfiles.com') || url.includes('newgrounds.com/audio');
        }

        async loadNewgroundsAudio(newgroundsUrl) {
            try {
                this.updateStatus('🎵 Cargando Newgrounds (audio.ngfiles.com)...', 'info');

                const proxyHosts = [
                    'https://corsproxy.io/?',
                    'https://thingproxy.freeboard.io/fetch/',
                    'https://api.codetabs.com/v1/proxy?quest='
                ];

                for (const proxy of proxyHosts) {
                    try {
                        const proxyUrl = `${proxy}${encodeURIComponent(newgroundsUrl)}`;
                        const response = await fetch(proxyUrl, { mode: 'cors' });

                        if (!response.ok) continue;

                        const blob = await response.blob();
                        if (blob.size === 0) continue;

                        const audioPlayer = this.container.querySelector('#backgroundMusic');
                        const audioUrl = URL.createObjectURL(blob);
                        audioPlayer.src = audioUrl;

                        return new Promise((resolve) => {
                            audioPlayer.addEventListener('canplaythrough', () => {
                                const fileName = newgroundsUrl.split('/').pop();
                                this.updateStatus(`✅ Audio Newgrounds cargado: ${fileName}`, 'success');
                                this.showNotification(`Audio Newgrounds cargado: ${fileName}`, 'success');
                                resolve();
                            }, { once: true });
                        });

                    } catch (error) {
                        console.warn(`Proxy ${proxy} falló:`, error);
                        continue;
                    }
                }

                throw new Error('No se pudo cargar el audio de Newgrounds');

            } catch (error) {
                console.error('Error con Newgrounds:', error);
                this.updateStatus(`❌ Error Newgrounds: ${error.message}`, 'error');
                throw error;
            }
        }

        async loadAudioFromUrl() {
            const audioUrl = this.container.querySelector('#audioUrl').value.trim();
            if (!audioUrl) {
                this.showNotification('❌ URL de audio requerida', 'error');
                return;
            }

            try {
                if (this.soundCloudManager.isSoundCloudUrl(audioUrl)) {
                    await this.soundCloudManager.loadSoundCloudTrack(audioUrl);
                    return;
                }

                if (this.isNewgroundsUrl(audioUrl)) {
                    await this.loadNewgroundsAudio(audioUrl);
                    return;
                }

                this.updateStatus('🎶 Cargando audio desde URL...', 'info');
                const audioPlayer = this.container.querySelector('#backgroundMusic');
                audioPlayer.crossOrigin = "anonymous";

                const testAudio = new Audio();
                testAudio.src = audioUrl;

                return new Promise((resolve, reject) => {
                    testAudio.onloadeddata = function() {
                        audioPlayer.src = audioUrl;
                        audioPlayer.load();

                        audioPlayer.addEventListener('canplaythrough', function() {
                            const fileName = audioUrl.split('/').pop().split('?') || 'Audio cargado';
                            window.drawariaVideoEditor.updateStatus(`✅ Audio cargado: ${fileName}`, 'success');
                            window.drawariaVideoEditor.showNotification(`Audio cargado: ${fileName}`, 'success');
                            resolve();
                        }, { once: true });
                    };

                    testAudio.onerror = function() {
                        reject(new Error('No se pudo cargar el audio'));
                    };

                    testAudio.load();
                });

            } catch (error) {
                console.error('Error cargando audio:', error);
                this.updateStatus(`❌ Error de audio: ${error.message}`, 'error');
                this.showNotification(`Error de audio: ${error.message}`, 'error');
            }
        }

        async testAudioUrl() {
            const audioUrl = this.container.querySelector('#audioUrl').value.trim();
            if (!audioUrl) {
                this.showNotification('❌ Ingresa una URL para probar', 'error');
                return;
            }

            this.updateStatus('🔍 Analizando URL de audio...', 'info');

            try {
                const testAudio = new Audio();
                testAudio.src = audioUrl;

                return new Promise((resolve) => {
                    testAudio.onloadeddata = () => {
                        if (this.soundCloudManager.isSoundCloudUrl(audioUrl)) {
                            this.updateStatus('✅ SoundCloud detectado - Compatible con API', 'success');
                        } else if (this.isNewgroundsUrl(audioUrl)) {
                            this.updateStatus('✅ Newgrounds detectado - Compatible', 'success');
                        } else if (audioUrl.match(/\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i)) {
                            this.updateStatus('✅ Formato de audio directo detectado', 'success');
                        } else {
                            this.updateStatus('⚠️ Tipo de URL desconocido - Podría funcionar', 'warning');
                        }
                        resolve();
                    };

                    testAudio.onerror = () => {
                        this.updateStatus('❌ Error al probar la URL', 'error');
                    };

                    testAudio.load();
                });

            } catch (error) {
                this.updateStatus(`❌ Error probando URL: ${error.message}`, 'error');
            }
        }

        testAudioCapture() {
            const audioPlayer = this.container.querySelector('#backgroundMusic');

            if (!audioPlayer || !audioPlayer.src) {
                this.showNotification('❌ No hay audio cargado para probar', 'error');
                return;
            }

            try {
                const audioStream = audioPlayer.captureStream();

                if (audioStream.getAudioTracks().length > 0) {
                    this.showNotification('✅ Audio compatible con captura', 'success');
                    console.log('✅ Pistas de audio encontradas:', audioStream.getAudioTracks().length);

                    audioPlayer.play().then(() => {
                        console.log('✅ Audio reproduciéndose correctamente');
                        this.updateStatus('🎵 Audio funcionando - Listo para grabación', 'success');
                    }).catch(e => {
                        console.warn('⚠️ Error auto-play:', e);
                        this.updateStatus('⚠️ Audio cargado - Requiere interacción del usuario', 'warning');
                    });

                } else {
                    this.showNotification('⚠️ Audio cargado pero no tiene pistas capturables', 'warning');
                }

            } catch (error) {
                this.showNotification('❌ Error en captura de audio: ' + error.message, 'error');
                console.error('❌ Error probando captura:', error);
            }
        }

        async prepareAudioForRecording() {
            const audioPlayer = this.container.querySelector('#backgroundMusic');

            if (!audioPlayer || !audioPlayer.src) {
                console.log('ℹ️ No hay audio cargado');
                return false;
            }

            try {
                audioPlayer.load();
                audioPlayer.currentTime = 0;

                return new Promise((resolve) => {
                    const timeoutId = setTimeout(() => {
                        console.warn('⚠️ Timeout preparando audio');
                        resolve(false);
                    }, 3000);

                    audioPlayer.addEventListener('canplaythrough', () => {
                        clearTimeout(timeoutId);
                        console.log('✅ Audio listo para grabación');
                        resolve(true);
                    }, { once: true });

                    audioPlayer.addEventListener('error', (e) => {
                        clearTimeout(timeoutId);
                        console.error('❌ Error preparando audio:', e);
                        resolve(false);
                    }, { once: true });
                });

            } catch (error) {
                console.error('❌ Error en preparación de audio:', error);
                return false;
            }
        }

        // Métodos principales
        async startAnimation() {
            if (this.isRecording) {
                this.showNotification('🛑 Ya hay una grabación en curso', 'warning');
                return;
            }

            if (!this.imageLoaded) {
                this.showNotification('⚠️ Debes cargar una imagen primero', 'warning');
                return;
            }

            // Salir del modo preview
            if (this.isPreviewMode) {
                this.togglePreviewMode(false);
            }

            // Preparar audio ANTES de iniciar grabación
            await this.prepareAudioForRecording();

            const canvas = this.container.querySelector('#canvas');
            const currentSize = this.sizePresets[this.canvasSize];

            canvas.width = Math.min(currentSize.width, 1920);
            canvas.height = Math.min(currentSize.height, 1080);

            try {
                const stream = canvas.captureStream(30);

                // Intentar agregar audio
                let hasAudio = false;
                const audioPlayer = this.container.querySelector('#backgroundMusic');
                if (audioPlayer && audioPlayer.src) {
                    try {
                        const audioStream = audioPlayer.captureStream();
                        if (audioStream.getAudioTracks().length > 0) {
                            audioStream.getAudioTracks().forEach(track => {
                                stream.addTrack(track);
                            });

                            audioPlayer.currentTime = 0;
                            audioPlayer.play().catch(e => console.warn('Error auto-play:', e));
                            hasAudio = true;
                            console.log('✅ Audio tradicional agregado al stream');
                        }
                    } catch (e) {
                        console.warn('Error capturando audio tradicional:', e);
                    }
                }

                this.recordedChunks = [];

                const selectedMimeType = 'video/webm;codecs=vp9';
                this.mediaRecorder = new MediaRecorder(stream, {
                    mimeType: selectedMimeType,
                    videoBitsPerSecond: 2000000
                });

                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        this.recordedChunks.push(event.data);
                    }
                };

                this.mediaRecorder.onstop = () => {
                    if (this.recordedChunks.length === 0) {
                        this.showNotification('❌ No se grabaron datos', 'error');
                        this.restoreInterface();
                        return;
                    }

                    this.videoBlob = new Blob(this.recordedChunks, { type: selectedMimeType });
                    this.container.querySelector('#downloadBtn').style.display = 'inline-block';
                    this.showNotification('✅ Grabación completada', 'success');
                    this.updateStatus('✅ Grabación completada. Haz clic en descargar');
                    this.restoreInterface();
                };

                this.mediaRecorder.start(100);

                this.isRecording = true;
                this.animationRunning = true;

                this.container.querySelector('#stopBtn').style.display = 'inline-block';
                this.container.querySelector('#emergencyBtn').style.display = 'inline-block';
                this.container.querySelector('#downloadBtn').style.display = 'none';

                setTimeout(() => {
                    this.animate();
                }, 100);

                if (hasAudio) {
                    this.showNotification('🎵 Grabando video con audio', 'success');
                } else {
                    this.showNotification('ℹ️ Grabando solo video (sin audio)', 'info');
                }

                this.updateStatus('🔴 Grabando scroll de imagen...');

            } catch (error) {
                console.error('Error iniciando grabación:', error);
                this.showNotification(`❌ Error al iniciar: ${error.message}`, 'error');
                this.restoreInterface();
            }
        }

        animate() {
            if (!this.animationRunning) {
                cancelAnimationFrame(this.animationFrameId);
                return;
            }

            const canvas = this.container.querySelector('#canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const viewWidth = canvas.width / this.zoomLevel;
            const viewHeight = canvas.height / this.zoomLevel;
            const maxScrollX = this.img.width - viewWidth;
            const maxScrollY = this.img.height - viewHeight;

            if (!this.isPaused) {
                switch (this.scrollMode) {
                    case 'right':
                        this.scrollPos.x = Math.min(this.scrollPos.x + this.scrollSpeed, maxScrollX);
                        break;
                    case 'left':
                        this.scrollPos.x = Math.max(this.scrollPos.x - this.scrollSpeed, 0);
                        break;
                    case 'up':
                        this.scrollPos.y = Math.max(this.scrollPos.y - this.scrollSpeed, 0);
                        break;
                    case 'down':
                        this.scrollPos.y = Math.min(this.scrollPos.y + this.scrollSpeed, maxScrollY);
                        break;
                    case 'static':
                        break;
                }
            }

            // Dibujar la imagen
            ctx.drawImage(this.img,
                this.scrollPos.x, this.scrollPos.y,
                viewWidth, viewHeight,
                0, 0,
                canvas.width, canvas.height
            );

            // Efectos visuales
            if (this.activeEffects.has('snow')) this.drawSnow(ctx, canvas);
            if (this.activeEffects.has('sparkles')) this.drawSparkles(ctx, canvas);
            if (this.activeEffects.has('fire')) this.drawFire(ctx, canvas);

            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }

        stopRecording() {
            if (!this.isRecording) return;

            this.animationRunning = false;
            cancelAnimationFrame(this.animationFrameId);

            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            this.isRecording = false;
            this.updateStatus('⏸️ Grabación detenida. Preparando video...', 'info');
        }

        emergencyStop() {
            this.stopRecording();
            this.showNotification('🛑 Parada de emergencia activada', 'warning');
        }

        downloadVideo() {
            if (!this.videoBlob) {
                this.showNotification('❌ No hay video para descargar', 'error');
                return;
            }

            const url = URL.createObjectURL(this.videoBlob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 16).replace(/:/g, '-');

            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = `drawaria-video-${timestamp}.webm`;
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 1000);

            this.showNotification('✅ Video descargado con éxito', 'success');
            this.videoBlob = null;
            this.recordedChunks = [];
            this.container.querySelector('#downloadBtn').style.display = 'none';
        }

        restoreInterface() {
            this.container.querySelector('#stopBtn').style.display = 'none';
            this.container.querySelector('#emergencyBtn').style.display = 'none';

            const audioPlayer = this.container.querySelector('#backgroundMusic');
            if (audioPlayer && audioPlayer.src) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
        }

        // Métodos de control
        loadImageFromUrl() {
            const imageUrl = this.container.querySelector('#imageUrl').value.trim();

            if (!imageUrl) {
                this.showNotification('❌ URL de imagen requerida', 'error');
                return;
            }

            this.updateStatus('🔄 Cargando imagen desde URL...', 'info');

            this.img.onload = () => {
                this.imageLoaded = true;
                this.updateStatus('✅ Imagen cargada con éxito', 'success');
                this.togglePreviewMode(true);
                this.showNotification('Imagen cargada correctamente', 'success');
            };

            this.img.onerror = () => {
                this.updateStatus('❌ Error al cargar imagen', 'error');
                this.showNotification('Error al cargar imagen', 'error');
                this.imageLoaded = false;
            };

            this.img.src = imageUrl;
        }

        setCanvasSize(size) {
            const canvas = this.container.querySelector('#canvas');
            if (!this.sizePresets[size]) return;

            canvas.width = this.sizePresets[size].width;
            canvas.height = this.sizePresets[size].height;
            this.canvasSize = size;

            this.container.querySelector('#resolutionDisplay').textContent =
                `${this.sizePresets[size].width}x${this.sizePresets[size].height}`;

            this.updateStatus(`📏 Tamaño: ${size.toUpperCase()}`, 'info');
            this.showNotification(`Tamaño cambiado a ${size.toUpperCase()}`, 'info');
        }

        updateSpeed() {
            const slider = this.container.querySelector('#speedSlider');
            this.scrollSpeed = parseFloat(slider.value);
            this.container.querySelector('#speedValue').textContent = `${this.scrollSpeed.toFixed(1)}x`;
            this.updateStatus(`⚡ Velocidad: ${this.scrollSpeed.toFixed(1)}x`, 'info');
        }

        zoomImage(amount) {
            const canvas = this.container.querySelector('#canvas');
            this.zoomLevel = Math.max(0.1, Math.min(5.0, this.zoomLevel + amount));
            this.updateStatus(`🔍 Zoom: ${(this.zoomLevel * 100).toFixed(0)}%`, 'info');

            if (this.imageLoaded && this.isPreviewMode) {
                this.drawPreviewOverlay();
            }
        }

        setScrollMode(mode) {
            this.scrollMode = mode;
            this.updateStatus(`🎬 Dirección: ${mode.toUpperCase()}`, 'info');
        }

        togglePause() {
            this.isPaused = !this.isPaused;
            const button = this.container.querySelector('#pauseBtn');
            button.textContent = this.isPaused ? '▶ Reanudar' : '⏸ Pausar';
            this.updateStatus(this.isPaused ? '⏸ Animación pausada' : '▶ Animación reanudada', 'info');
        }

        togglePreviewMode(forceState) {
            this.isPreviewMode = (typeof forceState !== 'undefined') ? forceState : !this.isPreviewMode;
            const canvas = this.container.querySelector('#canvas');
            const previewBtn = this.container.querySelector('#previewBtn');

            if (!this.imageLoaded) {
                this.updateStatus('❌ Carga una imagen para usar previsualización', 'error');
                this.isPreviewMode = false;
                return;
            }

            if (this.isPreviewMode) {
                previewBtn.textContent = '🔄 Salir de Previ';
                canvas.style.cursor = 'move';
                this.drawPreviewOverlay();
                this.updateStatus('🔄 Modo Previsualización activado', 'info');
            } else {
                previewBtn.textContent = '🖼 Previsualizar';
                canvas.style.cursor = 'crosshair';
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.updateStatus('🎮 Editor listo para comenzar', 'success');
            }
        }

        drawPreviewOverlay() {
            if (!this.imageLoaded) return;

            const canvas = this.container.querySelector('#canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const viewWidth = canvas.width / this.zoomLevel;
            const viewHeight = canvas.height / this.zoomLevel;

            ctx.drawImage(this.img,
                this.previewOffset.x, this.previewOffset.y,
                viewWidth, viewHeight,
                0, 0,
                canvas.width, canvas.height
            );

            ctx.strokeStyle = "#4da6ff";
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }

        // Efectos visuales
        toggleEffect(effect) {
            if (this.activeEffects.has(effect)) {
                this.activeEffects.delete(effect);
                this.updateStatus(`❌ Efecto '${effect}' desactivado`, 'info');

                if (effect === 'fire') this.fireParticles = [];
                else if (effect === 'sparkles') this.sparkles = [];
                else if (effect === 'snow') this.snowFlakes = [];
            } else {
                this.activeEffects.add(effect);
                this.updateStatus(`🎨 Efecto '${effect}' activado`, 'success');
            }
        }

        removeAllEffects() {
            this.activeEffects.clear();
            this.snowFlakes = [];
            this.sparkles = [];
            this.fireParticles = [];
            this.updateStatus('💥 Todos los efectos removidos', 'info');
        }

        drawSnow(ctx, canvas) {
            if (Math.random() < 0.3) {
                this.snowFlakes.push({
                    x: Math.random() * canvas.width,
                    y: -10,
                    size: 2 + Math.random() * 3,
                    speed: 0.5 + Math.random() * 2
                });
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.snowFlakes.forEach((flake, index) => {
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.size, 0, 2 * Math.PI);
                ctx.fill();

                flake.y += flake.speed;
                if (flake.y > canvas.height) this.snowFlakes.splice(index, 1);
            });
        }

        drawSparkles(ctx, canvas) {
            if (Math.random() < 0.5) {
                this.sparkles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: 1 + Math.random() * 2,
                    opacity: 1,
                    fadeSpeed: 0.02 + Math.random() * 0.03
                });
            }

            this.sparkles.forEach((sparkle, index) => {
                ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.opacity})`;
                ctx.beginPath();
                ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
                ctx.fill();

                sparkle.opacity -= sparkle.fadeSpeed;
                if (sparkle.opacity <= 0) this.sparkles.splice(index, 1);
            });
        }

        drawFire(ctx, canvas) {
            if (Math.random() < 0.5) {
                const size = 5 + Math.random() * 10;
                this.fireParticles.push({
                    x: Math.random() * canvas.width,
                    y: canvas.height,
                    size: size,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -1 - Math.random() * 3,
                    opacity: 1,
                    color: `hsl(50, 100%, ${70 + Math.random() * 30}%)`
                });
            }

            this.fireParticles.forEach((p, index) => {
                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= 0.02;
                p.size *= 0.98;

                if (p.opacity <= 0 || p.size < 0.5) {
                    this.fireParticles.splice(index, 1);
                }
            });
        }

        // Manejo de archivos
        handleSingleFile(file) {
            if (!file || !file.type.startsWith('image/')) {
                this.showNotification('❌ Solo se permiten archivos de imagen', 'error');
                return;
            }

            const fileURL = URL.createObjectURL(file);
            this.container.querySelector('#imageUrl').value = fileURL;

            this.img.onload = () => {
                this.imageLoaded = true;
                this.updateStatus(`✅ ${file.name} cargado`, 'success');
                this.showNotification(`Imagen ${file.name} cargada`, 'success');
                this.togglePreviewMode(true);
            };

            this.img.src = fileURL;
        }

        handleMultiFiles(files) {
            const imageFiles = files.filter(file => file.type && file.type.startsWith('image/'));
            if (imageFiles.length === 0) {
                this.showNotification('❌ No se encontraron imágenes válidas', 'error');
                return;
            }

            this.updateStatus(`✅ ${imageFiles.length} imágenes cargadas`, 'success');
            this.showNotification(`${imageFiles.length} imágenes cargadas`, 'success');
        }

        handleAudioFile(file) {
            if (!file || !file.type || !file.type.startsWith('audio/')) {
                this.showNotification('❌ Solo se permiten archivos de audio válidos', 'error');
                return;
            }

            // Método tradicional
            const audioPlayer = this.container.querySelector('#backgroundMusic');
            const fileURL = URL.createObjectURL(file);
            audioPlayer.src = fileURL;

            audioPlayer.addEventListener('canplaythrough', () => {
                this.updateStatus(`✅ ${file.name} cargado`, 'success');
                this.showNotification(`Audio ${file.name} cargado`, 'success');
            }, { once: true });

            // Método múltiple (Web Audio API)
            this.multiAudioManager.loadAudioFile(file).then(audioId => {
                this.showNotification(`🎵 ${file.name} agregado al mixer multiaudio`, 'info');
            }).catch(error => {
                console.warn('Fallback al método tradicional:', error);
            });
        }

        // Controles de arrastre
        startDrag(e) {
            if (!this.isPreviewMode && this.scrollMode !== 'static') return;
            this.isDragging = true;
            this.dragStartX = e.offsetX;
            this.dragStartY = e.offsetY;
        }

        drag(e) {
            if (!this.isDragging || (!this.isPreviewMode && this.scrollMode !== 'static')) return;

            const canvas = this.container.querySelector('#canvas');
            const dx = (e.offsetX - this.dragStartX) / this.zoomLevel;
            const dy = (e.offsetY - this.dragStartY) / this.zoomLevel;

            if (this.isPreviewMode) {
                this.previewOffset.x -= dx;
                this.previewOffset.y -= dy;
                this.drawPreviewOverlay();
            }

            this.dragStartX = e.offsetX;
            this.dragStartY = e.offsetY;
        }

        stopDrag() {
            this.isDragging = false;
        }

        // Grabación de pantalla
        async startScreenRecording() {
            if (this.isRecording) {
                this.showNotification('🛑 Ya hay una grabación en curso', 'warning');
                return;
            }

            if (!this.checkBrowserCompatibility()) {
                this.showNotification('❌ Navegador no compatible', 'error');
                return;
            }

            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: { cursor: "always" },
                    audio: true
                });

                this.recordedChunks = [];
                this.mediaRecorder = new MediaRecorder(displayStream, {
                    mimeType: 'video/webm;codecs=vp9',
                    videoBitsPerSecond: 5000000
                });

                this.mediaRecorder.ondataavailable = e => {
                    if (e.data.size > 0) {
                        this.recordedChunks.push(e.data);
                    }
                };

                this.mediaRecorder.onstop = () => {
                    this.videoBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
                    this.container.querySelector('#downloadBtn').style.display = 'inline-block';
                    this.container.querySelector('#screen-recording-controls').style.display = 'none';
                    this.isRecording = false;
                    this.isScreenRecording = false;
                    displayStream.getTracks().forEach(track => track.stop());
                    this.showNotification('✅ Grabación de pantalla completada', 'success');
                };

                this.mediaRecorder.start(100);
                this.isRecording = true;
                this.isScreenRecording = true;

                this.container.querySelector('#screen-recording-controls').style.display = 'block';
                this.recordingStartTime = Date.now();
                this.recordingTimerInterval = setInterval(() => this.updateRecordingTimer(), 1000);

                this.showNotification('🔴 Grabando pantalla...', 'info');

            } catch (error) {
                this.showNotification(`❌ Error en grabación: ${error.message}`, 'error');
            }
        }

        stopScreenRecording() {
            if (this.mediaRecorder && this.isScreenRecording) {
                this.mediaRecorder.stop();
                clearInterval(this.recordingTimerInterval);
                this.showNotification('⏹ Grabación detenida', 'info');
            }
        }

        updateRecordingTimer() {
            if (!this.isScreenRecording) return;

            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');

            this.container.querySelector('#recording-timer').textContent = `${minutes}:${seconds}`;
        }

        // Manejo de teclado
        handleKeyDown(e) {
            if (e.target.tagName === 'INPUT' || e.target.isContentEditable) return;

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    if (this.animationRunning) this.togglePause();
                    break;
                case 'r':
                    e.preventDefault();
                    if (!this.isRecording) this.startAnimation();
                    break;
                case 's':
                    e.preventDefault();
                    if (this.isRecording) this.stopRecording();
                    break;
                case 'p':
                    e.preventDefault();
                    this.togglePreviewMode();
                    break;
                case 'escape':
                    e.preventDefault();
                    if (this.isRecording) this.emergencyStop();
                    break;
            }
        }

        // Utilidades
        showNotification(message, type = 'info') {
            const container = this.container.querySelector('#toast-container');

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;

            container.appendChild(toast);

            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
                toast.style.opacity = '1';
            }, 10);

            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                toast.style.opacity = '0';

                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 5000);
        }

        updateStatus(message, type = 'info') {
            const statusElement = this.container.querySelector('#status');
            statusElement.textContent = message;

            let color = '#888';
            switch(type) {
                case 'success': color = '#4CAF50'; break;
                case 'error': color = '#F44336'; break;
                case 'warning': color = '#FFC107'; break;
                case 'info': color = '#2196F3'; break;
            }

            statusElement.style.color = color;
        }

        toggleWidgetVisibility() {
            const container = this.container.querySelector('#soundcloud-widget-container');
            container.classList.toggle('hidden');
        }

        // Método para cerrar el editor
        close() {
            if (this.isRecording) {
                this.emergencyStop();
            }

            this.container.style.display = 'none';
            this.showNotification('Editor cerrado', 'info');
        }

        // Método para mostrar el editor
        show() {
            this.container.style.display = 'block';
            this.showNotification('Editor de Video abierto', 'success');
        }
    }

    // Función para crear botón de acceso al editor
    function createEditorButton() {
        const button = document.createElement('button');
        button.innerHTML = '🎥 Video Editor';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999998;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.05)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });

        button.addEventListener('click', () => {
            if (window.drawariaVideoEditor) {
                window.drawariaVideoEditor.show();
            }
        });

        document.body.appendChild(button);
        return button;
    }

    // Inicialización
    function initializeEditor() {
        console.log('🎬 Inicializando Drawaria Video Editor...');

        try {
            // Crear el editor
            const editorContainer = createVideoEditor();
            const editor = new DrawariaVideoEditor(editorContainer);

            // Crear botón de acceso
            createEditorButton();

            // Hacer el editor accesible globalmente
            window.drawariaVideoEditor = editor;

            console.log('✅ Drawaria Video Editor inicializado correctamente');

            setTimeout(() => {
                console.log('🎉 Editor completamente funcional');
                console.log('📌 Usa el botón flotante en la esquina superior derecha');
                console.log('⌨️ Atajos: Espacio=Pausa, R=Grabar, S=Parar, P=Preview, ESC=Emergencia');
                console.log('🎵 Sistema de audio mejorado con SoundCloud y Newgrounds');
            }, 1000);

        } catch (error) {
            console.error('❌ Error inicializando editor:', error);

            const errorNotification = document.createElement('div');
            errorNotification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                background: #f44336;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            `;
            errorNotification.textContent = '❌ Error cargando Video Editor';
            document.body.appendChild(errorNotification);

            setTimeout(() => {
                if (errorNotification.parentNode) {
                    errorNotification.parentNode.removeChild(errorNotification);
                }
            }, 5000);
        }
    }

    // Función para verificar si estamos en drawaria.online
    function isDrawariaPage() {
        return window.location.hostname.includes('drawaria.online');
    }

    // Función para esperar a que la página cargue
    function waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // Función principal de inicialización
    async function main() {
        try {
            if (!isDrawariaPage()) {
                console.log('🔄 Script cargado pero no está en drawaria.online');
                return;
            }

            await waitForPageLoad();

            setTimeout(() => {
                initializeEditor();
            }, 2000);

            console.log('✅ Script de Drawaria Video Editor cargado exitosamente');

        } catch (error) {
            console.error('❌ Error en inicialización principal:', error);
        }
    }

    // Función para limpiar recursos al cerrar la página
    function cleanup() {
        if (window.drawariaVideoEditor) {
            try {
                if (window.drawariaVideoEditor.isRecording) {
                    window.drawariaVideoEditor.emergencyStop();
                }
                console.log('🧹 Recursos del editor limpiados');
            } catch (error) {
                console.error('Error durante limpieza:', error);
            }
        }
    }

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);

    // Agregar comando de menú de Tampermonkey
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('🎥 Abrir Video Editor', function() {
            if (window.drawariaVideoEditor) {
                window.drawariaVideoEditor.show();
            } else {
                alert('El editor no está disponible. Recarga la página.');
            }
        });

        GM_registerMenuCommand('🛑 Cerrar Video Editor', function() {
            if (window.drawariaVideoEditor) {
                window.drawariaVideoEditor.close();
            }
        });
    }

    // Detectar cambios de página
    let currentUrl = window.location.href;
    const urlChangeObserver = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log('🔄 URL cambió, verificando si reinicializar editor...');

            if (isDrawariaPage() && !window.drawariaVideoEditor) {
                setTimeout(() => {
                    initializeEditor();
                }, 1000);
            }
        }
    });

    urlChangeObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Agregar estilos CSS globales
    const globalStyles = document.createElement('style');
    globalStyles.textContent = `
        body.drawaria-video-editor-active {
            overflow: hidden !important;
        }

        @keyframes drawaria-editor-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }

        #drawaria-video-editor button:focus {
            outline: 2px solid #4da6ff !important;
            outline-offset: 2px;
        }

        @media (prefers-color-scheme: dark) {
            #drawaria-video-editor {
                filter: brightness(1.1);
            }
        }
    `;
    document.head.appendChild(globalStyles);

    // Inicializar cuando la página esté lista
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

       // Mensaje de bienvenida en consola
    console.log(`
    🎬 ================================
    📹 DRAWARIA VIDEO EDITOR v1.0
    ================================
    ✅ Script cargado correctamente
    🌐 Sitio: ${window.location.hostname}
    📅 Fecha: ${new Date().toLocaleDateString()}

    📋 CARACTERÍSTICAS MEJORADAS:
    • 🎥 Grabación de canvas con audio
    • 🖼️ Soporte para múltiples imágenes
    • 🎵 SoundCloud Widget API mejorado
    • 🎶 Newgrounds con proxies CORS
    • ✨ Efectos visuales avanzados
    • 📱 Grabación de pantalla
    • 🔊 Test de captura de audio
    • ⌨️ Controles de teclado

    🎯 USO:
    1. Busca el botón flotante "🎥 Video Editor"
    2. Carga una imagen desde URL o archivo
    3. Configura velocidad y dirección
    4. Carga audio desde SoundCloud/Newgrounds
    5. ¡Graba tu video con audio!

    🎵 AUDIO MEJORADO:
    • SoundCloud: URLs completas soportadas
    • Newgrounds: Múltiples proxies CORS
    • Test de captura: Verifica compatibilidad
    • Multi-audio: Web Audio API integrado

    📞 SOPORTE:
    • GitHub: Reporta issues y sugerencias
    • Consola: Logs detallados disponibles
    • Hotkeys: Espacio, R, S, P, ESC
    • Audio test: Botón "🔊 Probar Captura"
    ================================
    `);

    // Función para mostrar información de depuración
    window.drawariaDebugInfo = function() {
        console.log('🐛 INFORMACIÓN DE DEPURACIÓN:');
        console.log('📊 Estado del Editor:', window.drawariaVideoEditor ? 'Iniciado' : 'No iniciado');
        console.log('🌐 URL actual:', window.location.href);
        console.log('📱 User Agent:', navigator.userAgent);
        console.log('🎥 MediaRecorder:', typeof MediaRecorder !== 'undefined' ? 'Soportado' : 'No soportado');
        console.log('🖥️ Screen Capture:', navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia ? 'Soportado' : 'No soportado');
        console.log('🔊 Audio Context:', typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined' ? 'Soportado' : 'No soportado');

        if (window.drawariaVideoEditor) {
            console.log('🎬 Estado de grabación:', window.drawariaVideoEditor.isRecording);
            console.log('🖼️ Imagen cargada:', window.drawariaVideoEditor.imageLoaded);
            console.log('▶️ Modo de scroll:', window.drawariaVideoEditor.scrollMode);
            console.log('⚡ Velocidad:', window.drawariaVideoEditor.scrollSpeed);
            console.log('🎵 SoundCloud Manager:', window.drawariaVideoEditor.soundCloudManager ? 'Disponible' : 'No disponible');
            console.log('🎚️ Multi Audio Manager:', window.drawariaVideoEditor.multiAudioManager ? 'Disponible' : 'No disponible');
        }
    };

    // Función para mostrar información de compatibilidad de audio
    window.drawariaAudioInfo = function() {
        console.log('🎵 INFORMACIÓN DE AUDIO:');

        // Test MediaRecorder
        const supportedTypes = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8'
        ];

        console.log('📊 Codecs soportados:');
        supportedTypes.forEach(type => {
            const supported = MediaRecorder.isTypeSupported ? MediaRecorder.isTypeSupported(type) : false;
            console.log(`  ${supported ? '✅' : '❌'} ${type}`);
        });

        // Test Audio Context
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const testContext = new AudioContext();
                console.log('✅ AudioContext disponible');
                console.log('📊 Sample Rate:', testContext.sampleRate);
                console.log('📊 State:', testContext.state);
                testContext.close();
            }
        } catch (e) {
            console.log('❌ AudioContext error:', e.message);
        }

        // Test HTMLMediaElement.captureStream()
        try {
            const testAudio = document.createElement('audio');
            if (typeof testAudio.captureStream === 'function' || typeof testAudio.mozCaptureStream === 'function') {
                console.log('✅ HTMLMediaElement.captureStream() disponible');
            } else {
                console.log('❌ HTMLMediaElement.captureStream() no disponible');
            }
        } catch (e) {
            console.log('❌ Error testing captureStream:', e.message);
        }
    };

    // Función para test rápido de SoundCloud
    window.testSoundCloud = function(url) {
        if (!url) {
            console.log('❌ Proporciona una URL de SoundCloud');
            console.log('Ejemplo: testSoundCloud("https://soundcloud.com/artist/track")');
            return;
        }

        if (window.drawariaVideoEditor && window.drawariaVideoEditor.soundCloudManager) {
            const isValid = window.drawariaVideoEditor.soundCloudManager.isSoundCloudUrl(url);
            console.log(isValid ? '✅ URL de SoundCloud válida' : '❌ URL de SoundCloud inválida');

            if (isValid) {
                console.log('🎵 Puedes usar esta URL en el editor');
                console.log('📋 Copia y pega en el campo "🎶 Cargar Audio"');
            }
        } else {
            console.log('❌ Editor no inicializado. Abre el editor primero.');
        }
    };

    // Función para mostrar ayuda
    window.drawariaHelp = function() {
        console.log(`
        🆘 AYUDA - DRAWARIA VIDEO EDITOR
        ================================

        📋 COMANDOS DISPONIBLES EN CONSOLA:
        • drawariaDebugInfo() - Información de depuración
        • drawariaAudioInfo() - Compatibilidad de audio
        • testSoundCloud("url") - Test URL SoundCloud
        • drawariaHelp() - Mostrar esta ayuda

        ⌨️ ATAJOS DE TECLADO:
        • ESPACIO - Pausar/Reanudar grabación
        • R - Iniciar grabación
        • S - Parar grabación
        • P - Toggle previsualización
        • ESC - Parada de emergencia

        🎵 FORMATOS DE AUDIO SOPORTADOS:
        • SoundCloud: URLs completas de tracks
        • Newgrounds: audio.ngfiles.com/*
        • Archivos: MP3, WAV, OGG, M4A, AAC
        • URLs directas con headers CORS

        🎥 FORMATOS DE GRABACIÓN:
        • WebM VP9 con Opus (preferido)
        • WebM VP8 con Opus (fallback)
        • WebM VP9 solo video
        • WebM VP8 solo video

        🛠️ SOLUCIÓN DE PROBLEMAS:
        1. Audio no se graba: Usar "🔊 Probar Captura"
        2. Imagen no carga: Verificar dominio CORS
        3. Grabación falla: Revisar compatibilidad navegador
        4. SoundCloud no funciona: Verificar URL completa

        📞 SOPORTE:
        • Consola del navegador (F12) para logs
        • GitHub issues para reportes
        • Documentación en código fuente
        ================================
        `);
    };

    // Event listener para detectar errores de audio específicamente
    window.addEventListener('error', (event) => {
        if (event.error && event.error.message) {
            const message = event.error.message.toLowerCase();

            if (message.includes('audio') || message.includes('sound') || message.includes('media')) {
                console.warn('🎵 Error relacionado con audio detectado:', event.error.message);
                console.log('💡 Sugerencia: Ejecuta drawariaAudioInfo() para verificar compatibilidad');
            }

            if (message.includes('cors') || message.includes('cross-origin')) {
                console.warn('🌐 Error CORS detectado:', event.error.message);
                console.log('💡 Sugerencia: Usa dominios compatibles como i.ibb.co o imgur.com para imágenes');
            }
        }
    });

    // Agregar script de SoundCloud Widget API si no existe
    function loadSoundCloudWidgetAPI() {
        if (typeof SC !== 'undefined' && SC.Widget) {
            console.log('✅ SoundCloud Widget API ya disponible');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://w.soundcloud.com/player/api.js';
            script.async = true;

            script.onload = () => {
                console.log('✅ SoundCloud Widget API cargado');
                resolve();
            };

            script.onerror = () => {
                console.warn('⚠️ No se pudo cargar SoundCloud Widget API');
                reject(new Error('SoundCloud API load failed'));
            };

            document.head.appendChild(script);
        });
    }

    // Función para verificar y preparar el entorno
    async function prepareEnvironment() {
        console.log('🔧 Preparando entorno...');

        try {
            // Cargar SoundCloud Widget API
            await loadSoundCloudWidgetAPI();
        } catch (error) {
            console.warn('⚠️ SoundCloud Widget API no disponible, continuando sin él');
        }

        // Verificar permisos necesarios
        if (navigator.permissions) {
            try {
                const micPermission = await navigator.permissions.query({ name: 'microphone' });
                console.log('🎤 Permisos de micrófono:', micPermission.state);

                if ('display-capture' in navigator.permissions) {
                    const displayPermission = await navigator.permissions.query({ name: 'display-capture' });
                    console.log('🖥️ Permisos de pantalla:', displayPermission.state);
                }
            } catch (error) {
                console.log('ℹ️ No se pudieron verificar permisos, continuando...');
            }
        }

        console.log('✅ Entorno preparado');
    }

    // Función de inicialización principal mejorada
    async function initializeEditorWithEnvironment() {
        try {
            console.log('🚀 Inicializando Drawaria Video Editor con entorno completo...');

            // Preparar entorno
            await prepareEnvironment();

            // Inicializar editor
            initializeEditor();

            // Mostrar comandos disponibles
            setTimeout(() => {
                console.log('🎉 ¡Editor listo!');
                console.log('💡 Tip: Ejecuta drawariaHelp() para ver todos los comandos disponibles');
                console.log('🔊 Tip: Usa drawariaAudioInfo() para verificar compatibilidad de audio');
            }, 2000);

        } catch (error) {
            console.error('❌ Error en inicialización completa:', error);
            // Intentar inicialización básica como fallback
            initializeEditor();
        }
    }

    // Detectar si el usuario tiene SoundCloud abierto en otras pestañas
    function detectExistingSoundCloud() {
        try {
            // Intentar detectar si hay SoundCloud en localStorage
            const soundCloudData = localStorage.getItem('sc_anonymous_id');
            if (soundCloudData) {
                console.log('🎵 SoundCloud detectado en el navegador - Compatibilidad mejorada disponible');
            }
        } catch (error) {
            // Ignorar errores de localStorage
        }
    }

    // Modificar la inicialización principal para usar la nueva función
    async function main() {
        try {
            if (!isDrawariaPage()) {
                console.log('🔄 Script cargado pero no está en drawaria.online');
                return;
            }

            await waitForPageLoad();

            // Detectar entorno SoundCloud existente
            detectExistingSoundCloud();

            setTimeout(() => {
                // Usar la función de inicialización mejorada
                initializeEditorWithEnvironment();
            }, 2000);

            console.log('✅ Script de Drawaria Video Editor cargado exitosamente');

        } catch (error) {
            console.error('❌ Error en inicialización principal:', error);
        }
    }

    // Llamada principal
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
