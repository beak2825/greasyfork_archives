// ==UserScript==
// @name         Drawaria Soundboard Menu
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Menú draggable con botones para reproducir sonidos locales de Drawaria.online y enviar el enlace del sonido al chat.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/544618/Drawaria%20Soundboard%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/544618/Drawaria%20Soundboard%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista de archivos de sonido identificados de la pestaña de red del juego.
    const localSoundFiles = [
        "guess", "tick", "afk", "selword", "otherguess", "turnresults", "turnaborted", "startdraw"
        // Agrega más nombres de sonido si los encuentras en el directorio /snd/
    ];

    // Almacenamiento de elementos de audio
    const audioElements = {};

    // URL base para los archivos de sonido del juego
    const soundBaseUrl = 'https://drawaria.online/snd/';

    // Función para inicializar y precargar elementos de audio
    function initializeAudio() {
        localSoundFiles.forEach(soundName => {
            const audio = new Audio(`${soundBaseUrl}${soundName}.mp3`);
            audio.preload = 'auto'; // Precargar el audio
            audio.volume = 0.5; // Volumen por defecto (puedes ajustarlo)
            audioElements[soundName] = audio;
        });
    }

    // Función para reproducir un sonido localmente
    function playLocalSound(soundName) {
        if (audioElements[soundName]) {
            audioElements[soundName].pause(); // Pausar si ya se está reproduciendo
            audioElements[soundName].currentTime = 0; // Reiniciar al principio
            audioElements[soundName].play().catch(e => {
                // Manejar errores de reproducción (ej. políticas de autoplay del navegador)
                // console.error("Drawaria Soundboard: Error al reproducir el sonido local:", soundName, e);
            });
        } else {
            // console.warn(`Drawaria Soundboard: Sonido "${soundName}" no encontrado o no inicializado.`);
        }
    }

    // Función para enviar el enlace del sonido al chat del juego
    function sendSoundLinkToChat(soundName) {
        const chatInput = document.querySelector("#chatbox_textinput");
        if (!chatInput) {
            updateErrorMessage("Campo de chat no encontrado.");
            return;
        }

        if (chatInput.disabled) {
            updateErrorMessage("El chat está deshabilitado. No se puede enviar el link.");
            return;
        }

        const soundLink = `${soundBaseUrl}${soundName}.mp3`;
        chatInput.value = soundLink; // Poner el link en el campo de chat

        // Simular la pulsación de la tecla Enter para enviar el mensaje
        // Esto depende de que jQuery esté disponible en la página del juego
        if (window.jQuery) {
            // Simula un evento de keydown para la tecla Enter (which: 13)
            window.jQuery(document).trigger(window.jQuery.Event("keydown", { which: 13 }));
            chatInput.value = ''; // Limpiar el campo de chat después de enviar
            updateErrorMessage("Link enviado al chat.", true);
        } else {
            updateErrorMessage("jQuery no encontrado. No se puede enviar el link al chat.", false);
        }
    }

    // Manejo de mensajes de error/éxito en la UI del soundboard
    let errorTimeout;
    function updateErrorMessage(message, isSuccess = false) {
        const errMsgElement = document.querySelector("#drawo-soundboard #error-message");
        if (errMsgElement) {
            errMsgElement.textContent = message;
            errMsgElement.style.color = isSuccess ? "#8f8" : "#f86"; // Verde para éxito, rojo para error

            clearTimeout(errorTimeout);
            errorTimeout = setTimeout(() => {
                errMsgElement.textContent = ""; // Limpiar el mensaje después de 3 segundos
            }, 3000);
        }
    }


    // --- Creación de la Interfaz de Usuario (UI) ---

    const menu = document.createElement('div');
    menu.id = "drawo-soundboard";
    Object.assign(menu.style, {
        position: 'fixed',
        top: '100px',
        left: '30px',
        zIndex: '9999',
        background: '#1d232a',
        padding: '13px',
        border: '2px solid #00b4d8',
        borderRadius: '11px',
        boxShadow: '0 7px 24px rgba(0,0,0,0.28)',
        color: '#eee',
        fontFamily: 'sans-serif',
        userSelect: 'none', // Evita la selección de texto en el soundboard
        minWidth: '140px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    });

    const dragBar = document.createElement('div');
    Object.assign(dragBar.style, {
        cursor: 'grab',
        fontWeight: 'bold',
        marginBottom: '9px',
        textAlign: 'center',
    });
    dragBar.textContent = "🎶 Drawaria Sounds";
    menu.appendChild(dragBar);

    const errMsgDisplay = document.createElement('div');
    errMsgDisplay.id = "error-message"; // ID para facilitar la segmentación
    Object.assign(errMsgDisplay.style, {
        color: "#f86",
        fontSize: "13px",
        marginBottom: "5px",
        textAlign: 'center',
    });
    menu.appendChild(errMsgDisplay);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'grid';
    buttonsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
    buttonsContainer.style.gap = '8px';
    menu.appendChild(buttonsContainer);

    // Crear un botón para cada sonido
    localSoundFiles.forEach(soundName => {
        const btn = document.createElement('button');
        // Formatear el nombre para mostrarlo (ej. "startdraw" -> "Start Draw")
        btn.textContent = soundName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
        Object.assign(btn.style, {
            padding: '5px 10px',
            background: '#023e8a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        });
        btn.onmouseenter = () => btn.style.background = '#0096c7';
        btn.onmouseleave = () => btn.style.background = '#023e8a';
        btn.onclick = () => {
            playLocalSound(soundName); // Reproducir localmente
            sendSoundLinkToChat(soundName); // Enviar el enlace al chat
        };
        buttonsContainer.appendChild(btn);
    });

    document.body.appendChild(menu);

    // --- Funcionalidad de Arrastre (Draggable) ---
    let offsetX = 0, offsetY = 0, dragging = false;

    dragBar.onmousedown = function(e) {
        dragging = true;
        dragBar.style.cursor = 'grabbing';
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
        document.body.style.userSelect = 'none'; // Prevenir la selección de texto
        e.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
    };

    document.onmousemove = function(e) {
        if (dragging) {
            menu.style.left = (e.clientX - offsetX) + "px";
            menu.style.top = (e.clientY - offsetY) + "px";
        }
    };

    document.onmouseup = function() {
        dragging = false;
        dragBar.style.cursor = 'grab';
        document.body.style.userSelect = ''; // Re-habilitar la selección de texto
    };

    // Inicializar los elementos de audio cuando el DOM esté completamente cargado
    window.addEventListener('load', initializeAudio);

})();