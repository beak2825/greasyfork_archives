// ==UserScript==
// @name         Drawaria Timer Control
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Control visual del temporizador en Drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537147/Drawaria%20Timer%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/537147/Drawaria%20Timer%20Control.meta.js
// ==/UserScript==


/* globals $, jQuery, GM_addStyle, GM_setValue, GM_getValue */

(function() {
    'use strict';

    // --- Estilos para el menú ---
    GM_addStyle(`
        #timerControlMenu {
            position: fixed;
            top: 100px;
            left: 20px;
            background-color: #2c3e50; /* Color de fondo oscuro */
            border: 2px solid #3498db; /* Borde azul */
            border-radius: 8px;
            padding: 15px;
            z-index: 10001; /* Muy alto para estar encima de todo */
            color: #ecf0f1; /* Texto claro */
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            cursor: grab;
            min-width: 250px;
        }
        #timerControlMenu h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #3498db; /* Título azul */
            text-align: center;
            font-size: 18px;
        }
        #timerControlMenu label {
            display: block;
            margin-top: 10px;
            font-size: 14px;
        }
        #timerControlMenu input[type="number"],
        #timerControlMenu input[type="text"] {
            width: calc(100% - 22px);
            padding: 8px 10px;
            margin-top: 5px;
            border: 1px solid #7f8c8d;
            border-radius: 4px;
            background-color: #34495e; /* Input oscuro */
            color: #ecf0f1;
            font-size: 14px;
        }
        #timerControlMenu button {
            background-color: #3498db; /* Botón azul */
            color: white;
            border: none;
            padding: 10px 15px;
            margin-top: 15px;
            margin-right: 5px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }
        #timerControlMenu button:hover {
            background-color: #2980b9; /* Azul más oscuro al pasar el mouse */
        }
        #timerControlMenu button:disabled {
            background-color: #7f8c8d;
            cursor: not-allowed;
        }
        #timerControlMenu .button-group {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
        .timer-status {
            margin-top: 10px;
            font-style: italic;
            color: #95a5a6;
            font-size: 12px;
            text-align: center;
        }
    `);

    // --- Crear el HTML del menú ---
    const menuHtml = `
        <div id="timerControlMenu">
            <h3>Timer Control</h3>
            <label for="customTimeInput">Tiempo (segundos):</label>
            <input type="number" id="customTimeInput" value="60" min="1" max="999">

            <div class="button-group">
                <button id="setCustomTimerBtn">Fijar Tiempo</button>
                <button id="startCustomTimerBtn">Iniciar Custom</button>
            </div>
            <div class="button-group">
                <button id="stopCustomTimerBtn">Detener Custom</button>
                <button id="resetToGameTimerBtn">Resetear a Juego</button>
            </div>
             <div class="button-group">
                <button id="hideGameTimerBtn">Ocultar Timer Juego</button>
                <button id="showGameTimerBtn">Mostrar Timer Juego</button>
            </div>
            <div class="timer-status" id="timerControlStatus">Esperando...</div>
        </div>
    `;
    $('body').append(menuHtml);

    // --- Lógica para hacer el menú arrastrable ---
    let menu = $('#timerControlMenu');
    let offsetX, offsetY, isDragging = false;

    menu.on('mousedown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
            return; // No arrastrar si se hace clic en input/button
        }
        isDragging = true;
        offsetX = e.clientX - menu.offset().left;
        offsetY = e.clientY - menu.offset().top;
        menu.css('cursor', 'grabbing');
    });

    $(document).on('mousemove', function(e) {
        if (!isDragging) return;
        menu.offset({
            top: e.clientY - offsetY,
            left: e.clientX - offsetX
        });
    }).on('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            menu.css('cursor', 'grab');
        }
    });

    // --- Variables para controlar el temporizador ---
    let customTimerInterval = null;
    let customTimeRemaining = 0;
    let customTotalTime = 0;
    let originalGameTimerObserver = null;
    let gameTimerIsHidden = false;

    const $timerTextElement = () => $('#rightbar .timer .timer-text'); // El texto del número
    const $timerSvgPath = () => $('#rightbar .timer .timer-bar svg path'); // La barra de progreso SVG
    const $gameTimerElement = () => $('#rightbar .timer');

    // --- Funciones del temporizador ---
    function updateStatus(message) {
        $('#timerControlStatus').text(message);
    }

    function getSvgPathLength() {
        const path = $timerSvgPath()[0];
        return path ? path.getTotalLength() : 295.416; // Valor por defecto si no se encuentra
    }
    const svgPathLength = getSvgPathLength(); // Obtener una vez

    function updateVisualTimer(seconds, totalSeconds) {
        const timerTextEl = $timerTextElement();
        const timerSvgPathEl = $timerSvgPath();

        if (timerTextEl.length) {
            timerTextEl.text(Math.max(0, Math.ceil(seconds)));
        }

        if (timerSvgPathEl.length) {
            let progress = 0;
            if (totalSeconds > 0) {
                progress = Math.max(0, seconds) / totalSeconds;
            }
            const offset = svgPathLength * (1 - progress);
            timerSvgPathEl.css('stroke-dashoffset', offset + 'px');
        }
    }

    function stopCustomTimer() {
        if (customTimerInterval) {
            clearInterval(customTimerInterval);
            customTimerInterval = null;
            updateStatus('Temporizador custom detenido.');
            $('#startCustomTimerBtn').prop('disabled', false);
             $('#stopCustomTimerBtn').prop('disabled', true);
        }
    }

    $('#setCustomTimerBtn').on('click', function() {
        const time = parseInt($('#customTimeInput').val());
        if (isNaN(time) || time <= 0) {
            alert("Por favor, introduce un tiempo válido en segundos.");
            return;
        }
        customTotalTime = time;
        customTimeRemaining = time;
        stopCustomTimer(); // Detiene cualquier temporizador custom anterior
        updateVisualTimer(customTimeRemaining, customTotalTime);
        updateStatus(`Tiempo fijado a ${customTotalTime}s. Haz clic en "Iniciar Custom".`);
        $('#startCustomTimerBtn').prop('disabled', false);
    });

    $('#startCustomTimerBtn').on('click', function() {
        if (customTotalTime <= 0) {
            alert("Fija un tiempo primero usando 'Fijar Tiempo'.");
            return;
        }
        if (customTimerInterval) { // Si ya hay uno corriendo, lo reinicia
            stopCustomTimer();
        }
        customTimeRemaining = customTotalTime; // Reinicia el conteo
        updateVisualTimer(customTimeRemaining, customTotalTime);

        updateStatus(`Temporizador custom iniciado (${customTotalTime}s).`);
        $('#startCustomTimerBtn').prop('disabled', true);
        $('#stopCustomTimerBtn').prop('disabled', false);


        customTimerInterval = setInterval(() => {
            customTimeRemaining--;
            updateVisualTimer(customTimeRemaining, customTotalTime);
            if (customTimeRemaining <= 0) {
                stopCustomTimer();
                updateStatus('Temporizador custom finalizado.');
                // Aquí podrías añadir un sonido o alguna otra indicación
            }
        }, 1000);
    });


    $('#stopCustomTimerBtn').on('click', function() {
        stopCustomTimer();
    });

    $('#resetToGameTimerBtn').on('click', function() {
        stopCustomTimer();
        // Intentar que el juego retome su visualización original es complejo
        // porque no sabemos el estado real del timer del juego.
        // Por ahora, solo detenemos el custom y el juego debería seguir su curso.
        // Si el timer del juego estaba oculto, lo mostramos.
        if(gameTimerIsHidden) {
            $gameTimerElement().show();
            gameTimerIsHidden = false;
        }
        updateStatus('Intentando resetear al temporizador del juego.');
        $('#startCustomTimerBtn').prop('disabled', false);
    });

    $('#hideGameTimerBtn').on('click', function() {
        $gameTimerElement().hide();
        gameTimerIsHidden = true;
        updateStatus('Temporizador del juego oculto.');
    });

    $('#showGameTimerBtn').on('click', function() {
        $gameTimerElement().show();
        gameTimerIsHidden = false;
        updateStatus('Temporizador del juego mostrado.');
    });


    // --- Observador para intentar detectar el temporizador del juego ---
    // Esto es experimental y podría no funcionar perfectamente.
    // La idea es resetear nuestro estado cuando el timer del juego se vuelve visible.
    const gameTimerNode = $gameTimerElement()[0];
    if (gameTimerNode) {
        originalGameTimerObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'style') {
                    const displayStyle = $gameTimerElement().css('display');
                    if (displayStyle === 'block' || displayStyle === 'flex') { // O cualquier estilo que use para mostrarse
                        if (!customTimerInterval) { // Si no hay un timer custom activo
                            // El timer del juego se ha mostrado, podría ser un nuevo turno
                            // Aquí podríamos intentar leer el valor inicial del juego, pero es difícil
                            // Por ahora, solo logueamos
                            // console.log("Game timer became visible.");
                            // updateStatus("Temporizador del juego detectado.");
                        }
                    }
                }
            });
        });
        originalGameTimerObserver.observe(gameTimerNode, { attributes: true });
    }

    updateStatus("Menú de control de timer cargado.");
    $('#stopCustomTimerBtn').prop('disabled', true); // Deshabilitar stop al inicio

    console.log("Drawaria Timer Control script loaded.");

})();