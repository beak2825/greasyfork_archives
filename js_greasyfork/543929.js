// ==UserScript==
// @name         Drawaria.online - 3D Effect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ¡La transformación visual MÁS COMPLETA! Rediseña CADA elemento de Drawaria.online con un estilo 2.5D/Neuromórfico ultra detallado y luego proyecta la interfaz completa en un entorno 3D manipulable. ¡Una experiencia visual totalmente nueva y sorprendente!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @require      https://unpkg.com/three@0.128.0/examples/js/renderers/CSS3DRenderer.js
// @require      https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543929/Drawariaonline%20-%203D%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/543929/Drawariaonline%20-%203D%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Drawaria.online - Iniciando Transformación Definitiva 2.5D/3D...');

    /**
     * Inyecta CSS personalizado en la página.
     * @param {string} css El string CSS a inyectar.
     */
    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
        console.log('CSS de estilización 2.5D/Neuromórfica inyectado.');
    }

    // --- Estilos CSS para el rediseño 2.5D/Neuromórfico ---
    // Este CSS aplica las sombras, relieves y colores para simular el efecto 2.5D en elementos 2D.
    const customCSS = `
        :root {
            --bg-color: #e0e5ec; /* Fondo principal claro */
            --main-bg: #f0f3f8; /* Fondo de paneles principales */
            --panel-bg: linear-gradient(145deg, #e6ecf3, #ffffff); /* Degradado para el efecto de relieve */
            --panel-shadow: 8px 8px 20px #a3b1c6, -8px -8px 20px #ffffff; /* Sombra exterior para un efecto saliente */
            --inset-shadow: inset 4px 4px 9px #a3b1c6, inset -4px -4px 9px #ffffff; /* Sombra interior para un efecto hundido */
            --text-color: #4a5a70; /* Color de texto principal */
            --primary-color: #2979ff; /* Color primario para acentos */
            --primary-gradient: linear-gradient(145deg, #448aff, #0d47a1); /* Degradado para botones primarios */
            --secondary-color: #ff5722; /* Color secundario */
            --border-radius-main: 20px; /* Radio de borde principal para paneles */
            --border-radius-small: 12px; /* Radio de borde para botones e inputs */
            --hover-transform: translateY(-3px) scale(1.01); /* Efecto al pasar el ratón */
            --active-transform: translateY(1px) scale(0.99); /* Efecto al hacer clic */
        }

        /* --- ESTILOS GLOBALES Y DE FONDO --- */
        body, html {
            background-color: var(--bg-color) !important;
            color: var(--text-color);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-shadow: 0.5px 0.5px 1px rgba(255, 255, 255, 0.7);
            /* Evita el overflow del body ya que Three.js lo manejará */
            overflow: hidden !important;
            margin: 0;
            padding: 0;
            width: 100vw;
            height: 100vh;
        }

        /* Contenedores principales y de login */
        #main, .loginbox, #loading > div {
            background: var(--main-bg) !important;
            border-radius: var(--border-radius-main);
            box-shadow: var(--panel-shadow);
            transition: all 0.4s ease;
        }
        /* Asegurarse de que los elementos de layout no tengan sombras redundantes */
        #login-midcol, #login-leftcol, #login-rightcol {
            background: transparent !important;
            box-shadow: none !important;
        }

        /* --- SCROLLBARS (Estilo Neumórfico) --- */
        ::-webkit-scrollbar { width: 14px; height: 14px; }
        ::-webkit-scrollbar-track {
            background: var(--bg-color);
            border-radius: var(--border-radius-small);
            box-shadow: var(--inset-shadow);
        }
        ::-webkit-scrollbar-thumb {
            background: #aab8cc;
            border-radius: var(--border-radius-small);
            border: 3px solid var(--bg-color);
            transition: background 0.2s ease;
        }
        ::-webkit-scrollbar-thumb:hover { background: #8e9cb3; }
        ::-webkit-scrollbar-corner { background: transparent; }

        /* --- PANELES, LIENZO Y CONTENEDORES INTERNOS --- */
        #leftbar, #rightbar, #roomlist, #customvotingbox {
            background: var(--panel-bg) !important;
            border: none !important;
            border-radius: var(--border-radius-main) !important;
            box-shadow: var(--panel-shadow) !important;
            transition: all 0.3s ease;
            padding: 15px; /* Ajuste para dar más espacio interno */
        }
        #leftbar:hover, #rightbar:hover, #roomlist:hover { transform: var(--hover-transform); }

        /* Lienzo de dibujo */
        #canvas {
            border-radius: var(--border-radius-main);
            box-shadow: var(--inset-shadow) !important;
            background: #ffffff !important; /* Fondo del lienzo siempre blanco */
            border: 1px solid #d0d7e0; /* Borde sutil */
        }

        /* Modales y Popups (también con estilo neuromórfico) */
        .modal-content, #wordchooser .modal-content, #turnresults, #roundresults,
        #waitplayersmsg, #startingroundmsg, #targetword, #targetword_tip {
             background: var(--main-bg) !important;
             border-radius: var(--border-radius-main) !important;
             box-shadow: var(--panel-shadow) !important;
             padding: 20px; /* Más padding para estética */
             border: none !important;
             overflow: hidden; /* Controlar contenido interno */
        }
        .modal-header, .modal-footer {
            border: none !important;
            background-color: transparent !important;
            padding: 15px 20px !important;
        }
        .modal-title { color: var(--text-color); font-weight: bold; }
        .modal-backdrop.show { opacity: 0.6 !important; background-color: #a3b1c6 !important; } /* Fondo opaco */

        /* --- BOTONES (Estilo Neumórfico Universal) --- */
        .btn, .drawcontrols-button, .drawcontrols-popupbutton, .palettechooser-row,
        .roomlist-item, .playerlist-row, .modal-content .close {
            border-radius: var(--border-radius-small) !important;
            border: none !important;
            background: var(--panel-bg) !important;
            color: var(--text-color) !important;
            font-weight: 600;
            text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.7);
            box-shadow: 6px 6px 14px #a3b1c6, -6px -6px 14px #ffffff !important;
            transition: all 0.15s ease-out !important;
            transform: translateY(0);
            cursor: pointer;
            padding: 10px 18px; /* Ajuste de padding para botones */
            min-width: 80px; /* Ancho mínimo para consistencia */
            text-align: center;
            display: inline-flex; /* Para centrar contenido si es un icono + texto */
            align-items: center;
            justify-content: center;
        }
        .btn:hover, .drawcontrols-button:hover, .drawcontrols-popupbutton:hover,
        .palettechooser-row:hover, .roomlist-item:hover, .playerlist-row:hover,
        .modal-content .close:hover {
            transform: var(--hover-transform);
            box-shadow: 9px 9px 18px #a3b1c6, -9px -9px 18px #ffffff !important;
            color: var(--primary-color) !important; /* Resaltar al pasar el ratón */
        }
        .btn:active, .drawcontrols-button:active, .drawcontrols-popupbutton-active,
        .playerlist-row:active, .modal-content .close:active {
            transform: var(--active-transform) !important;
            background: #e5e8ec !important;
            box-shadow: var(--inset-shadow) !important;
            color: var(--primary-color) !important;
        }

        /* Botones de acción principal (color) */
        .btn-primary, .btn-warning, button#quickplay, button#createroom,
        .btn-outline-info { /* También para 'Restore Drawing' */
             background: var(--primary-gradient) !important;
             color: white !important;
             text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
             border: none !important;
        }
        .btn-warning { background: linear-gradient(145deg, #ffca28, #fb8c00) !important; } /* Amarillo más vibrante */
        .btn-outline-secondary, .btn-info { /* Botones secundarios */
             background: var(--panel-bg) !important;
             color: var(--text-color) !important;
        }
        .btn-outline-secondary:hover, .btn-info:hover {
            background: linear-gradient(145deg, #e0e5ec, #f0f3f8) !important;
        }

        /* Iconos dentro de botones */
        .btn i, .drawcontrols-button i { margin-right: 5px; }

        /* --- INPUTS, SELECTS, TEXTAREAS (Estilo Neumórfico) --- */
        input[type="text"], input[type="number"], .form-control, select, textarea, .custom-select {
            border: none !important;
            border-radius: var(--border-radius-small) !important;
            background-color: var(--bg-color) !important;
            box-shadow: var(--inset-shadow) !important;
            padding: 12px 18px !important;
            color: var(--text-color) !important;
            transition: all 0.2s ease;
            font-size: 1em;
            outline: none; /* Eliminar el contorno de enfoque por defecto */
        }
        input[type="text"]:focus, input[type="number"]:focus, .form-control:focus,
        select:focus, textarea:focus, .custom-select:focus {
            box-shadow: inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff !important;
        }
        .custom-select {
            -webkit-appearance: none; /* Eliminar flecha por defecto en WebKit */
            -moz-appearance: none;    /* Eliminar flecha por defecto en Mozilla */
            appearance: none;         /* Eliminar flecha por defecto */
            background-image: url('data:image/svg+xml;utf8,<svg fill="%234a5a70" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>') !important;
            background-repeat: no-repeat !important;
            background-position: right 10px center !important;
            background-size: 20px !important;
        }


        /* --- INTERFAZ DETALLADA ESPECÍFICA --- */
        /* Lista de jugadores */
        .playerlist-row {
            margin: 8px 0;
            padding: 12px !important;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .playerlist-avatar {
            border-radius: 10px !important;
            box-shadow: 0 0 8px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
        }
        .playerlist-avatar:hover { transform: scale(1.05); }
        .playerlist-medal, .playerlist-star > div {
            filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.4));
        }

        /* Chat */
        #chatbox_messages {
            background: var(--bg-color);
            box-shadow: var(--inset-shadow);
            border-radius: var(--border-radius-main);
            padding: 15px;
            max-height: 200px; /* Ajuste si es necesario */
            overflow-y: auto;
        }
        .playerchatmessage, .systemchatmessage {
            background: rgba(255,255,255,0.6);
            padding: 8px 12px;
            margin: 5px 0;
            border-radius: var(--border-radius-small);
            box-shadow: 2px 2px 4px #d0d7e0, -2px -2px 4px #ffffff;
            transition: all 0.2s ease;
            font-size: 0.95em;
            word-wrap: break-word; /* Asegura que el texto largo se ajuste */
            overflow-wrap: break-word;
        }
        .playerchatmessage:hover, .systemchatmessage:hover {
            box-shadow: 3px 3px 6px #d0d7e0, -3px -3px 6px #ffffff;
        }
        .playerchatmessage-selfname, .playerchatmessage-name {
            color: var(--primary-color);
            font-weight: bold;
            text-shadow: none;
        }
        #chatbox_textinput { /* Barra de entrada del chat */
            padding: 12px 18px !important;
            font-size: 1em;
        }

        /* Controles de dibujo específicos */
        #drawcontrols {
            padding: 15px;
            background: rgba(224, 229, 236, 0.8); /* Ligeramente transparente para un blur */
            backdrop-filter: blur(10px); /* Efecto de cristal esmerilado */
            -webkit-backdrop-filter: blur(10px);
            border-radius: var(--border-radius-main);
            box-shadow: var(--panel-shadow);
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 10px; /* Espacio entre botones */
        }
        .drawcontrols-color, .palettechooser-colorset > div {
             border-radius: 50% !important;
             transform: scale(1.0);
             transition: transform 0.2s, box-shadow 0.2s;
             width: 40px; height: 40px; /* Tamaño de los selectores de color */
             border: 2px solid var(--bg-color);
             box-shadow: 2px 2px 5px #a3b1c6, -2px -2px 5px #ffffff;
        }
        .drawcontrols-color:hover, .palettechooser-colorset > div:hover {
             transform: scale(1.2);
             box-shadow: 4px 4px 10px #a3b1c6, -4px -4px 10px #ffffff;
        }
        .drawcontrols-color.selected {
            border: 3px solid var(--primary-color); /* Borde para el color seleccionado */
            box-shadow: inset 3px 3px 7px #a3b1c6, inset -3px -3px 7px #ffffff, 0 0 10px var(--primary-color);
        }

        /* Temporizador */
        .timer {
             transform: scale(1.1); /* Hacerlo un poco más grande */
             filter: drop-shadow(0 0 5px rgba(0,0,0,0.3)); /* Sombra para destacarlo */
        }
        .timer-bg, .timer-barbg, .timer-bar {
            box-shadow: none !important; /* El Three.js se encarga de la proyección 3D */
            border-radius: 50%;
        }
        .timer-face {
            background-color: var(--main-bg);
            box-shadow: var(--panel-shadow);
            border-radius: 50%;
            padding: 15px;
        }
        .timer-text {
            color: var(--primary-color) !important;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
        }

        /* Burbujas de texto y avatares */
        .bubble, .spawnedavatar-bubble {
            background: var(--main-bg) !important;
            border-radius: var(--border-radius-main) !important;
            box-shadow: var(--panel-shadow) !important;
            padding: 12px 18px !important;
            color: var(--text-color);
            font-size: 1.1em;
            font-weight: 500;
            text-shadow: 0.5px 0.5px 1px rgba(255, 255, 255, 0.7);
        }
        .bubble::before, .spawnedavatar-bubble::after {
            display: none !important; /* Estas flechas no funcionan bien con el efecto 3D global */
        }
        .spawnedavatar {
            filter: drop-shadow(0 0 5px rgba(0,0,0,0.3));
        }

        /* Enlaces de pie de página y otros */
        .footer a, .promlinks a {
            color: var(--primary-color) !important;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s ease;
        }
        .footer a:hover, .promlinks a:hover {
            text-decoration: underline;
            color: var(--secondary-color) !important;
            transform: scale(1.02);
        }
        .discordlink, #mobapplink {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: white !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .discordlink img, #mobapplink img {
            filter: drop-shadow(0 0 3px rgba(0,0,0,0.3));
        }

        /* Animaciones para la carga */
        #loading .spinner-border {
            color: var(--primary-color);
            width: 50px; height: 50px;
            border-width: 5px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #loading {
            background: linear-gradient(180deg, var(--bg-color), var(--main-bg));
            box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        }
        #loading .h3 { color: var(--text-color); }

        /* Estilos para el wrapper 3D */
        #drawaria-3d-wrapper {
            position: absolute; /* Debe ser absoluto para Three.js */
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            /* Estos estilos aseguran que el contenido se comporte como un plano 2D antes de la transformación 3D */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transform-style: preserve-3d; /* Crucial para elementos anidados */
        }
    `;

    // --- Configuración de Three.js para la proyección 3D de la interfaz ---
    // Esta parte toma TODO el HTML de la página y lo convierte en un único panel 3D.
    const THREE_GLOBAL_ROT_X = -Math.PI / 64; // Inclinación sutil hacia arriba/abajo
    const THREE_GLOBAL_ROT_Y = Math.PI / 64;  // Rotación sutil hacia izquierda/derecha
    const THREE_GLOBAL_Z_OFFSET = 0;         // Profundidad inicial del panel principal

    let scene, camera, renderer, controls, mainUIPanel;
    let originalBodyChildren = []; // Para almacenar los elementos originales del body

    function initThreeJS() {
        // 1. Configurar la escena
        scene = new THREE.Scene();

        // 2. Configurar la cámara
        // FOV más alto para una perspectiva más dramática
        camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 5000);

        // 3. Configurar el renderizador CSS3D
        renderer = new THREE.CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0px';
        renderer.domElement.style.left = '0px';
        renderer.domElement.style.zIndex = '99999'; // Asegura que esté absolutamente encima de todo
        document.body.appendChild(renderer.domElement);

        // 4. Mover el contenido original del body a un wrapper para Three.js
        const drawariaContentWrapper = document.createElement('div');
        drawariaContentWrapper.id = 'drawaria-3d-wrapper';

        // Mueve todos los hijos directos de body al nuevo wrapper, excepto el renderizador de Three.js
        // ¡Importante hacerlo ANTES de que el renderizador de Three.js esté en el body!
        // Como el renderizador ya se añadió, lo omitimos.
        Array.from(document.body.children).forEach(child => {
            if (child !== renderer.domElement) { // No mover el renderizador de Three.js
                drawariaContentWrapper.appendChild(child);
            }
        });
        document.body.appendChild(drawariaContentWrapper); // Añadir el wrapper con el contenido de Drawaria de nuevo al body

        // 5. Crear el objeto 3D de CSS a partir del wrapper de Drawaria
        mainUIPanel = new THREE.CSS3DObject(drawariaContentWrapper);
        scene.add(mainUIPanel);

        // 6. Posicionar el panel 3D y la cámara
        // Estos valores pueden requerir ajuste para diferentes resoluciones/diseños
        const initialPanelScale = 1; // Escala inicial para la interfaz 2D dentro del panel 3D

        mainUIPanel.position.set(0, 0, THREE_GLOBAL_Z_OFFSET);
        mainUIPanel.rotation.x = THREE_GLOBAL_ROT_X;
        mainUIPanel.rotation.y = THREE_GLOBAL_ROT_Y;
        mainUIPanel.scale.set(initialPanelScale, initialPanelScale, initialPanelScale); // Escala para ajustar el tamaño del panel en la vista 3D

        // Calcular la posición de la cámara para que la interfaz se vea bien
        // Se calcula basándose en el campo de visión (FOV) y la altura de la ventana
        const distance = (window.innerHeight / 2) / Math.tan(camera.fov / 2 * Math.PI / 180);
        camera.position.set(0, 0, distance + THREE_GLOBAL_Z_OFFSET); // Ajustar la cámara para ver todo el panel
        camera.lookAt(scene.position); // Mirar al centro de la escena (donde está el panel)

        // 7. Configurar OrbitControls para interacción con la cámara
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Para un movimiento más suave
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2; // No permitir rotar por debajo del "suelo"
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.minDistance = distance / 2; // Zoom mínimo
        controls.maxDistance = distance * 2; // Zoom máximo
        controls.target.set(0, 0, THREE_GLOBAL_Z_OFFSET); // El punto alrededor del cual la cámara orbita
        controls.update();

        // Deshabilitar la capacidad de selección de texto dentro del panel 3D
        drawariaContentWrapper.style.userSelect = 'none';
        drawariaContentWrapper.style.pointerEvents = 'auto'; // Re-habilitar eventos de puntero

        console.log('Three.js: Interfaz de Drawaria proyectada en un entorno 3D.');

        animate(); // Iniciar el bucle de animación
    }

    // --- Bucle de Animación ---
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Actualizar los controles (movimiento, zoom)
        renderer.render(scene, camera); // Renderizar la escena 3D
    }

    // --- Manejar el redimensionamiento de la ventana ---
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix(); // Actualizar la matriz de proyección de la cámara

        renderer.setSize(newWidth, newHeight); // Actualizar el tamaño del renderizador

        // Recalcular la distancia de la cámara para mantener la proporción visual
        const distance = (newHeight / 2) / Math.tan(camera.fov / 2 * Math.PI / 180);
        camera.position.z = distance + THREE_GLOBAL_Z_OFFSET;
        controls.minDistance = distance / 2;
        controls.maxDistance = distance * 2;
        controls.update();
    });

    // --- Punto de entrada principal del script ---
    // Asegurarse de que el DOM esté completamente cargado antes de manipularlo extensamente
    window.addEventListener('load', () => {
        addGlobalStyle(customCSS); // Primero, aplicar el estilo 2.5D/Neuromórfico
        initThreeJS();             // Luego, envolver toda la interfaz estilizada en 3D
        console.log('Drawaria.online - Transformación Definitiva 2.5D/3D COMPLETADA.');
    });

    // Fallback por si el script se ejecuta cuando la página ya está cargada (aunque 'load' es lo ideal)
    if (document.readyState === 'complete') {
        window.dispatchEvent(new Event('load'));
    }

})();