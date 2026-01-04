// ==UserScript==
// @name         Drawaria.online Neon
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modern, realistic, neon theme for Drawaria.online with animations and effects.
// @author       YouTubeDrawaria
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @match        https://drawaria.online/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @connect      fonts.googleapis.com
// @connect      fonts.gstatic.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536006/Drawariaonline%20Neon.user.js
// @updateURL https://update.greasyfork.org/scripts/536006/Drawariaonline%20Neon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fetch and inject Google Font
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap",
        onload: function(response) {
            GM_addStyle(response.responseText);
        }
    });

    const neonStyles = `
        /* --- Variables de Color Neón --- */
        :root {
            --neon-cyan: #00ffff;
            --neon-magenta: #ff00ff;
            --neon-pink: #ff33cc;
            --neon-blue: #3366ff;
            --neon-green: #39ff14;
            --dark-bg: #0f0c29; /* Fondo principal oscuro */
            --dark-bg-alt: #1a123f; /* Fondo alternativo para paneles */
            --glow-text-shadow: 0 0 5px var(--neon-cyan),
                                0 0 10px var(--neon-cyan),
                                0 0 15px var(--neon-cyan),
                                0 0 20px var(--neon-blue);
            --glow-box-shadow: 0 0 8px var(--neon-magenta),
                               0 0 15px var(--neon-magenta),
                               0 0 20px var(--neon-pink);
            --glow-border: 2px solid var(--neon-cyan);
        }

        /* --- Estilos Globales --- */
        body, html {
            background: var(--dark-bg) !important;
            background-image: linear-gradient(to right top, #0f0c29, #120e30, #151037, #18123e, #1b1445) !important;
            color: var(--neon-cyan) !important;
            font-family: 'Orbitron', sans-serif !important;
            height: 100%;
            overflow-x: hidden; /* Evitar scroll horizontal por glows */
        }

        /* Eliminar el patrón de fondo original */
        body {
            background-image: none !important;
        }


        a {
            color: var(--neon-pink) !important;
            text-decoration: none !important;
            transition: color 0.3s ease, text-shadow 0.3s ease;
        }
        a:hover {
            color: var(--neon-cyan) !important;
            text-shadow: var(--glow-text-shadow);
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--neon-magenta) !important;
            text-shadow: 0 0 5px var(--neon-magenta), 0 0 10px var(--neon-pink);
        }

        /* --- Layout Principal y Paneles --- */
        #main {
            background-color: transparent !important;
        }

        #leftbar, #rightbar {
            background: var(--dark-bg-alt) !important;
            border-color: var(--neon-blue) !important;
            box-shadow: var(--glow-box-shadow), inset 0 0 10px rgba(51, 102, 255, 0.3);
            border-radius: 10px !important;
            padding: 1em !important;
            transition: box-shadow 0.3s ease;
            width: 18% !important; /* Un poco más de ancho */
        }
        #leftbar:hover, #rightbar:hover {
             box-shadow: 0 0 15px var(--neon-blue),
                               0 0 30px var(--neon-blue),
                               0 0 40px var(--neon-pink),
                               inset 0 0 15px rgba(51, 102, 255, 0.5);
        }
        #leftbar { border-right: var(--glow-border) !important; }
        #rightbar { border-left: var(--glow-border) !important; }


        /* --- Área de Login y Central --- */
        #login {
            padding-top: 2vh !important; /* Menos padding arriba */
        }
        .sitelogo img {
            filter: drop-shadow(0 0 8px var(--neon-cyan)) drop-shadow(0 0 15px var(--neon-blue));
            animation: logoPulse 3s infinite alternate;
        }
        @keyframes logoPulse {
            0% { filter: drop-shadow(0 0 8px var(--neon-cyan)) drop-shadow(0 0 15px var(--neon-blue)); }
            100% { filter: drop-shadow(0 0 12px var(--neon-pink)) drop-shadow(0 0 25px var(--neon-magenta)); }
        }

        #login-midcol {
            background: var(--dark-bg-alt) !important;
            padding: 1.5em !important;
            border-radius: 10px !important;
            box-shadow: var(--glow-box-shadow);
            border: var(--glow-border) !important;
            max-width: 300px !important;
        }
        #login-leftcol > div, #login-rightcol > div:not(.loginbox) { /* Anuncios */
            background: rgba(0,0,0,0.3) !important;
            border-radius: 8px;
            padding: 10px;
            border: 1px solid var(--neon-blue);
        }
        #login-leftcol > div img, #login-rightcol > div img {
            opacity: 0.8;
        }

        /* --- Formularios (Inputs, Selects, Botones) --- */
        input[type="text"], .custom-select {
            background-color: rgba(10, 5, 30, 0.8) !important;
            color: var(--neon-cyan) !important;
            border: 1px solid var(--neon-blue) !important;
            border-radius: 5px !important;
            padding: 0.5em !important;
            box-shadow: inset 0 0 5px rgba(0, 255, 255, 0.3);
        }
        input[type="text"]::placeholder {
            color: rgba(0, 255, 255, 0.5) !important;
        }
        .input-group-text { /* Para el   junto al nombre de usuario */
            background: transparent !important;
            border: none !important;
        }
        #avatarcontainer img {
             border: 2px solid var(--neon-magenta) !important;
             box-shadow: 0 0 10px var(--neon-magenta);
             border-radius: 50% !important; /* Hacer avatar circular */
        }


        .btn {
            color: #fff !important;
            border-radius: 5px !important;
            text-shadow: 0 0 5px #000;
            transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
            position: relative; /* Para pseudo-elementos si se necesitan */
            overflow: hidden;
        }
        .btn:before { /* Efecto de línea brillante en hover */
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: all 0.5s;
        }
        .btn:hover:before {
            left: 100%;
        }

        .btn-warning { /* Jugar */
            background-color: var(--neon-pink) !important;
            border: 1px solid var(--neon-magenta) !important;
            box-shadow: 0 0 8px var(--neon-magenta), 0 0 15px var(--neon-pink);
        }
        .btn-warning:hover {
            background-color: var(--neon-magenta) !important;
            box-shadow: 0 0 12px var(--neon-magenta), 0 0 25px var(--neon-pink), 0 0 5px #fff;
            transform: translateY(-2px);
        }

        .btn-secondary, .btn-info, .btn-primary:not(#login-rightcol .loginbox .btn-primary) { /* Crear Espacio, etc. */
            background-color: var(--neon-blue) !important;
            border: 1px solid var(--neon-cyan) !important;
            box-shadow: 0 0 8px var(--neon-cyan), 0 0 15px var(--neon-blue);
        }
         .btn-secondary:hover, .btn-info:hover, .btn-primary:not(#login-rightcol .loginbox .btn-primary):hover {
            background-color: var(--neon-cyan) !important;
            color: var(--dark-bg) !important;
            text-shadow: none;
            box-shadow: 0 0 12px var(--neon-cyan), 0 0 25px var(--neon-blue), 0 0 5px #fff;
            transform: translateY(-2px);
        }

        .btn-outline-info { /* Restaurar dibujo, etc. */
            color: var(--neon-cyan) !important;
            border-color: var(--neon-cyan) !important;
        }
        .btn-outline-info:hover {
            background-color: var(--neon-cyan) !important;
            color: var(--dark-bg) !important;
            text-shadow: none;
        }

        /* Enlaces en la parte inferior de login-midcol */
        #login-midcol a {
            color: var(--neon-green) !important;
            text-shadow: 0 0 3px var(--neon-green);
            font-weight: bold;
        }
        #login-midcol a:hover {
            color: #fff !important;
            text-shadow: 0 0 5px var(--neon-green), 0 0 10px var(--neon-green);
        }

        /* --- Chat y elementos del juego (ejemplos) --- */
        #chatbox_messages {
            background-color: rgba(10, 5, 30, 0.5) !important;
            border: 1px solid var(--neon-blue);
            border-radius: 5px;
            padding: 5px;
        }
        .playerchatmessage {
            padding: 3px 5px;
            border-radius: 3px;
            margin-bottom: 3px;
        }
        .playerchatmessage-name {
            color: var(--neon-magenta) !important;
            font-weight: bold;
        }
        .playerchatmessage-selfname {
            color: var(--neon-green) !important;
        }
        #chatbox_messages > div:nth-child(odd) {
            background: rgba(0,0,0,0.1) !important;
        }

        .roomlist-item {
            background: var(--dark-bg-alt) !important;
            border: 1px solid var(--neon-blue) !important;
            box-shadow: 0 0 5px var(--neon-blue);
        }
        .roomlist-preview {
            border-color: var(--neon-cyan) !important;
        }

        .wordchooser-row {
            background-color: var(--dark-bg-alt) !important;
            color: var(--neon-cyan);
            border: 1px solid var(--neon-blue);
        }
        .wordchooser-row:hover {
            background-color: var(--neon-blue) !important;
            color: #fff !important;
            box-shadow: 0 0 10px var(--neon-blue);
        }

        /* --- Footer --- */
        .footer, .footer a {
            color: var(--neon-cyan) !important;
            opacity: 0.8;
        }
        .footer a:hover {
            color: var(--neon-pink) !important;
            opacity: 1;
        }
        #discordprombox a, #discordprombox2 a { /* Discord Promos */
           border: 1px solid var(--neon-magenta) !important;
           padding: 0.5em !important;
           border-radius: 5px !important;
           background-color: rgba(255,0,255,0.1) !important;
           box-shadow: 0 0 8px var(--neon-magenta);
           display: inline-block;
        }
         #discordprombox a:hover, #discordprombox2 a:hover {
            background-color: rgba(255,0,255,0.3) !important;
            box-shadow: 0 0 15px var(--neon-magenta);
         }
         #discordprombox img, #discordprombox2 img {
             animation: discordSpin 5s linear infinite;
         }
         @keyframes discordSpin {
             from { transform: rotate(0deg); }
             to { transform: rotate(360deg); }
         }

        /* --- Estilos para Modales --- */
        .modal-content {
            background-color: var(--dark-bg) !important;
            border: 2px solid var(--neon-magenta) !important;
            box-shadow: 0 0 20px var(--neon-magenta), 0 0 30px var(--neon-pink);
            color: var(--neon-cyan) !important;
        }
        .modal-header {
            border-bottom: 1px solid var(--neon-pink) !important;
        }
        .modal-header .close { /* Botón X para cerrar modal */
            color: var(--neon-pink) !important;
            text-shadow: 0 0 5px var(--neon-pink);
        }
        .modal-footer {
            border-top: 1px solid var(--neon-pink) !important;
        }

        /* Scrollbars con estilo neón */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: var(--dark-bg-alt);
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--neon-blue);
            border-radius: 5px;
            box-shadow: inset 0 0 3px var(--neon-cyan);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--neon-cyan);
            box-shadow: 0 0 5px var(--neon-cyan);
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }
    `;

    // Aplicar estilos cuando el DOM esté listo para evitar FOUC (Flash Of Unstyled Content)
    // Usamos document-start y esperamos a que head exista.
    function applyStylesWhenReady() {
        if (document.head) {
            GM_addStyle(neonStyles);
        } else {
            setTimeout(applyStylesWhenReady, 50); // Reintentar pronto
        }
    }
    applyStylesWhenReady();

    // Pequeños ajustes de JS si son necesarios después de que la página cargue completamente
    window.onload = function() {
        // Ejemplo: cambiar texto si es necesario, aunque CSS es preferible
        // const loginButton = document.getElementById('quickplay');
        // if (loginButton) {
        //     // loginButton.innerHTML = ">>> ENTER NEON ZONE <<<";
        // }

        // Forzar que el área de login (midcol) sea visible si otros elementos lo ocultan
        // Esto es un hack, idealmente se maneja con CSS o entendiendo la lógica del sitio
        const midCol = document.getElementById('login-midcol');
        if (midCol && midCol.style.display === 'none') {
            // midCol.style.display = 'block'; // O el display que use
        }
    };

})();