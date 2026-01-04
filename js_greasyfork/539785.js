// ==UserScript==
// @name         Drawaria Thought Bubble
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Agrega una burbuja de pensamiento personalizable con forma de nube sobre el avatar de perfil en Drawaria.online, con textos iniciales adaptados al idioma del navegador (Inglés/Español).
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/539785/Drawaria%20Thought%20Bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/539785/Drawaria%20Thought%20Bubble.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para inyectar estilos CSS
    function addGlobalStyle(css) {
        GM_addStyle(css);
    }

    // Determinar el idioma del navegador
    function getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith('en')) {
            return 'en'; // Inglés
        } else if (lang.startsWith('es')) {
            return 'es'; // Español
        }
        return 'en'; // Por defecto a inglés si no se detecta español
    }

    const browserLang = getBrowserLanguage();
    let defaultGreeting = '¡Hola!'; // Español por defecto
    if (browserLang === 'en') {
        defaultGreeting = 'Hello!'; // Inglés si el navegador es inglés
    }

    // CSS para la burbuja de pensamiento (ahora en forma de nube) y el editor
    addGlobalStyle(`
        .avatar-container {
            position: relative;
            display: inline-block; /* Para que el contenedor se ajuste al tamaño del avatar */
        }

        .thought-bubble {
            position: absolute;
            top: -65px; /* Ajusta la posición vertical por encima del avatar */
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            border: 1px solid #333; /* Borde oscuro para el contorno de la nube */
            /* Propiedades para la forma de la nube */
            border-radius: 50% 60% 40% 50% / 60% 40% 50% 50%; /* Forma de nube irregular */
            padding: 10px 15px; /* Espaciado interno para el texto */
            font-size: 12px;
            color: #333;
            white-space: normal; /* Permite que el texto salte de línea */
            word-wrap: break-word; /* Rompe palabras largas */
            max-width: 150px; /* Ancho máximo de la burbuja */
            min-height: 30px; /* Altura mínima, se expande con el contenido */
            height: auto; /* Permite que la altura se ajuste al contenido */
            line-height: 1.3; /* Espaciado de línea */
            z-index: 1000; /* Asegura que la burbuja esté por encima del avatar */
            box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* Sombra ligera */
            opacity: 0.9;
            visibility: hidden; /* Oculto por defecto hasta que el texto se cargue */
            display: flex; /* Para centrar el texto vertical y horizontalmente */
            align-items: center;
            justify-content: center;
            text-align: center;
            box-sizing: border-box; /* Incluye padding y borde en el tamaño */
        }

        /* Estilos para la cola de la nube (dos círculos) */
        .thought-bubble::before {
            content: '';
            position: absolute;
            background: #fff;
            border: 1px solid #333;
            border-radius: 50%; /* Forma circular */
            width: 15px; /* Círculo más grande de la cola */
            height: 15px;
            bottom: -15px; /* Posición por debajo de la burbuja principal */
            left: 20%; /* Origen horizontal de la cola */
            transform: translateX(-50%); /* Centra el círculo */
            z-index: 999; /* Detrás de la burbuja principal */
        }

        .thought-bubble::after {
            content: '';
            position: absolute;
            background: #fff;
            border: 1px solid #333;
            border-radius: 50%; /* Forma circular */
            width: 10px; /* Círculo medio de la cola */
            height: 10px;
            bottom: -25px; /* Más abajo que el primer círculo */
            left: calc(20% - 8px); /* Desplazado a la izquierda para el efecto en cascada */
            transform: translateX(-50%); /* Centra el círculo */
            z-index: 998; /* Detrás del primer círculo de la cola */
        }

        .thought-editor {
            position: fixed;
            top: 10px;
            left: 10px;
            background: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            resize: both; /* Permite redimensionar */
            overflow: auto; /* Para barras de desplazamiento si el contenido es grande */
            min-width: 200px;
            min-height: 120px;
            cursor: grab; /* Cursor para indicar que es arrastrable */
        }

        .thought-editor:active {
            cursor: grabbing;
        }

        .thought-editor h4 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
            color: #333;
            text-align: center;
        }

        .thought-editor textarea {
            width: calc(100% - 10px);
            height: 60px;
            margin-bottom: 10px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            resize: vertical; /* Solo permite redimensionar verticalmente */
        }

        .thought-editor button {
            display: block;
            width: 100%;
            padding: 8px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .thought-editor button:hover {
            background-color: #45a049;
        }
    `);

    function initializeScript() {
        const avatarImg = document.querySelector('img.turnresults-avatar');

        if (avatarImg) {
            let avatarContainer = avatarImg.closest('.avatar-container');
            if (!avatarContainer) {
                avatarContainer = document.createElement('div');
                avatarContainer.className = 'avatar-container';
                avatarImg.parentNode.insertBefore(avatarContainer, avatarImg);
                avatarContainer.appendChild(avatarImg);
            }

            let thoughtBubble = avatarContainer.querySelector('.thought-bubble');
            if (!thoughtBubble) {
                thoughtBubble = document.createElement('div');
                thoughtBubble.className = 'thought-bubble';
                thoughtBubble.textContent = defaultGreeting; // Usa el saludo predeterminado del idioma
                avatarContainer.appendChild(thoughtBubble);
            }

            setTimeout(() => {
                thoughtBubble.style.visibility = 'visible';
            }, 500);

            let editorDiv = document.querySelector('.thought-editor');
            if (!editorDiv) {
                editorDiv = document.createElement('div');
                editorDiv.className = 'thought-editor';
                editorDiv.innerHTML = `
                    <h4>Edit Thought Bubble</h4>
                    <textarea id="thoughtContent" placeholder="Escribe aquí tu pensamiento..."></textarea>
                    <button id="applyThought">Aplicar</button>
                `;
                document.body.appendChild(editorDiv);
            }

            const thoughtContentTextArea = editorDiv.querySelector('#thoughtContent');
            const applyButton = editorDiv.querySelector('#applyThought');

            const savedThought = localStorage.getItem('drawariaThoughtBubbleContent');
            if (savedThought) {
                thoughtContentTextArea.value = savedThought;
                thoughtBubble.textContent = savedThought;
            } else {
                thoughtContentTextArea.value = defaultGreeting; // Asegura que el editor también tenga el texto inicial correcto
                thoughtBubble.textContent = defaultGreeting;
            }

            applyButton.addEventListener('click', () => {
                const newText = thoughtContentTextArea.value;
                thoughtBubble.textContent = newText;
                localStorage.setItem('drawariaThoughtBubbleContent', newText); // Guardar en localStorage
            });

            // Lógica para hacer el editor arrastrable
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            editorDiv.addEventListener('mousedown', (e) => {
                if (e.target === editorDiv || e.target.tagName === 'H4') {
                    e.preventDefault();
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                    isDragging = true;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                localStorage.setItem('drawariaThoughtEditorPosition', JSON.stringify({
                    left: editorDiv.offsetLeft,
                    top: editorDiv.offsetTop
                }));
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    xOffset = currentX;
                    yOffset = currentY;

                    editorDiv.style.left = currentX + 'px';
                    editorDiv.style.top = currentY + 'px';
                }
            });

            const savedPosition = localStorage.getItem('drawariaThoughtEditorPosition');
            if (savedPosition) {
                const pos = JSON.parse(savedPosition);
                editorDiv.style.left = pos.left + 'px';
                editorDiv.style.top = pos.top + 'px';
                xOffset = pos.left;
                yOffset = pos.top;
            }

            new ResizeObserver(() => {
                localStorage.setItem('drawariaThoughtEditorPosition', JSON.stringify({
                    left: editorDiv.offsetLeft,
                    top: editorDiv.offsetTop
                }));
            }).observe(editorDiv);

        } else {
            console.log('Avatar de Drawaria no encontrado. Reintentando...');
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('img.turnresults-avatar')) {
                    obs.disconnect();
                    initializeScript();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    window.addEventListener('load', initializeScript);
    initializeScript();

})();