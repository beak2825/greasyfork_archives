// ==UserScript==
// @name         Drawaria Nintendo 3DS™
// @namespace    http://tampermonkey.net/
// @version      2024-10-25
// @description  You will have access to a brand new Drawaria Interface and Nintendo 3DS Games!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514347/Drawaria%20Nintendo%203DS%E2%84%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/514347/Drawaria%20Nintendo%203DS%E2%84%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let css = `
    /* === 3DS Background Replacement === */
    body {
        background: url('https://i.ytimg.com/vi/XLxmdRxLtyY/hq720.jpg') center fixed no-repeat !important;
        background-size: cover;
        font-family: 'Helvetica', sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* === Fixed Transparent 3DS Screen Overlay === */
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('https://i.ibb.co/Q9RsJzX/ezgif-6-c6f4d7655e.png') center no-repeat;
        background-size: cover;
        pointer-events: none; /* Makes the overlay non-interactive */
        z-index: 1000;
    }

    /* === Header Bar (Top Screen) === */
    .header-bar {
        background: linear-gradient(180deg, #f0f0f0, #c9d4e0);
        width: 100%;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #b0b0b0;
    }

    .header-bar img {
        width: 32px;
        height: 32px;
    }

    /* === Icon Grid (Main UI) === */
    .icon-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        padding: 20px;
    }

    .icon {
        background: linear-gradient(145deg, #ffffff, #d1d1d1);
        border-radius: 12px;
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease-in-out;
    }

    .icon img {
        width: 48px;
        height: 48px;
        margin-bottom: 5px;
    }

    .icon:hover {
        transform: scale(1.05);
        box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.3);
        background: linear-gradient(145deg, #e0e0e0, #b0b0b0);
    }

    /* === Login Box Adjustments === */
    @media (max-width: 1500px) {
        #login-rightcol .loginbox {
            position: inherit;
            border-radius: 1px;
            background: rgba(0, 0, 0, 0);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin: 0 !important;
        }
    }

    #login-midcol {
        padding: 0;
        background: rgba(0, 0, 0, 0);
        max-width: 260px;
    }

    /* === Button Styles === */
    .btn, button {
        background: linear-gradient(145deg, #ffffff, #b3b3b3);
        color: #000000;
        border: 2px solid #3d3d3d;
        border-radius: 15px;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        transition: all 0.3s ease-in-out;
        cursor: pointer;
    }

    .btn:hover, button:hover {
        background: linear-gradient(145deg,  #b3b3b3, #6c757d);
        color: white;
        transform: scale(1.05);
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.4);
    }

    .btn:active, button:active {
        background: linear-gradient(145deg,#b3b3b3, #6c757d);
        color: white;
        box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.5);
    }

    /* === Input Fields === */
    input, select, textarea {
        background: #f0f0f0;
        border: 2px solid #008eff;
        border-radius: 8px;
        padding: 10px;
        font-size: 16px;
        transition: box-shadow 0.2s ease-in-out;
    }

    input:focus, select:focus, textarea:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(0, 162, 255, 0.75);
    }

    /* === Footer (Bottom Screen) === */
    .footer {
        width: 100%;
        background: linear-gradient(180deg, #c9d4e0, #e6eef5);
        padding: 10px;
        text-align: center;
        border-top: 2px solid #b0b0b0;
        color: #222; /* Dark text color */
    }

    .footer a {
        color: #333; /* Darker color for links */
        text-decoration: none;
        font-weight: bold;
    }

    .footer a:hover {
        text-decoration: underline;
    }

    /* === Centered Text Content (Optional) === */
    .content-container {
        color: #222; /* Dark text */
        max-width: 1000px;
        margin: auto;
        text-align: center;
    }

    /* === Modal Styles === */
    .modal {
        display: none;
        position: fixed;
        z-index: 1050;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: white;
        border-radius: 15px;
        padding: 20px;
        width: 600px;
        max-width: 80%;
        text-align: center;
        position: relative;
    }

    .close {
        background: #000000;
        border: none;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        font-weight: bold;
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
    }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement('style');
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector('head') || document.documentElement).appendChild(styleNode);
    }

    // URLs of the images for the grid icons
    const imageUrls = [
        "https://cdn.icon-icons.com/icons2/993/PNG/96/Nintendo_3DS_icon-icons.com_75289.png",
        "https://cdn.icon-icons.com/icons2/58/PNG/96/nintendoNES_11834.png",
        "https://cdn.icon-icons.com/icons2/382/PNG/96/Nintendo_DS_37530.png",
        "https://cdn.icon-icons.com/icons2/1603/PNG/96/video-game-play-pad-boy-gameboy-nintendo_108539.png",
        "https://cdn.icon-icons.com/icons2/41/PNG/96/n64_nintendo_64_7167.png",
        "https://cdn.icon-icons.com/icons2/2429/PNG/96/nintendo_logo_icon_147258.png",
        "https://cdn.icon-icons.com/icons2/2622/PNG/96/brand_nintendo_gamecube_icon_157861.png",
        "https://cdn.icon-icons.com/icons2/58/PNG/96/nintendosnesgamepad_snesnintendo_jueg_11835.png"
    ];

       // Game data
    const games = [
        { name: "Super Mario Bros", iframe: '<iframe src="https://scratch.mit.edu/projects/196684240/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>' },
        { name: "The Legend of Zelda", iframe: '<iframe src="https://scratch.mit.edu/projects/121662453/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>' },
        { name: "Mario Kart", iframe: '<iframe src="https://scratch.mit.edu/projects/36711178/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>' },
        { name: "GTA Chinatown Wars", iframe: '<iframe src="https://scratch.mit.edu/projects/486808355/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>' },
        { name: "Mario And Luigi", iframe: '<iframe src="https://scratch.mit.edu/projects/444391631/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>' },
        { name: "Sonic The Hedgehog", iframe: '<iframe src="https://scratch.mit.edu/projects/277391857/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>' },
        { name: "Pokemon", iframe: '<iframe src="https://scratch.mit.edu/projects/181714/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>' },
        { name: "Minecraft", iframe: '<iframe src="https://scratch.mit.edu/projects/50029544/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>' }
    ];

    // Create 3DS UI elements

    // Reemplazar el logo del juego en el div correspondiente
    const logoContainer = document.querySelector('.sitelogo img');
    if (logoContainer) {
        logoContainer.src = 'https://i.ibb.co/rGY0jH6/3DS.png';

        // Ajustar la posición del logo hacia abajo
        logoContainer.style.position = 'relative';
        logoContainer.style.paddingTop = '10px';
        logoContainer.style.marginTop = '10px';
        logoContainer.style.top = '20px'; // Ajusta este valor según cuánto quieras mover el logo hacia abajo
    }

    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const header = document.createElement('header');
    header.className = 'header-bar';
    header.innerHTML = `
        <div class="header-content">
            <img src="https://drawaria.online/apple-touch-icon.png" alt="Game Logo" class="game-logo">
            <span class="header-text">Nintendo Drawaria 3DS - YoutubeDrawaria</span>
        </div>
    `;

    var elements = document.querySelectorAll("#howtoplaybox, #howtoplaybox a, #howtoplaybox span");
    elements.forEach(function(element) {
        element.style.color = "black";
    });

    // Añadir el encabezado al cuerpo del documento
    document.body.appendChild(header);

    const elements5 = document.querySelectorAll('a[href="/scoreboards/"], a[href="/gallery/"], button#continueautosaved-run');

    elements5.forEach(element => {
        element.style.color = 'black';
    });

    // Estilos CSS para centrar el contenido
    header.style.display = 'flex';
    header.style.justifyContent = 'center';
    header.style.alignItems = 'center';
    header.style.textAlign = 'center';

    const headerContent = header.querySelector('.header-content');
    headerContent.style.display = 'flex';
    headerContent.style.alignItems = 'center';

    const gameLogo = header.querySelector('.game-logo');
    gameLogo.style.marginRight = '10px'; // Espacio entre la imagen y el texto

    const headerText = header.querySelector('.header-text');
    headerText.style.fontSize = '16px'; // Tamaño de fuente del texto
    headerText.style.fontWeight = 'bold'; // Peso de la fuente

    const grid = document.createElement('div');
    grid.className = 'icon-grid';

      // Create the icon grid
    const iconGrid = document.createElement('div');
    iconGrid.classList.add('icon-grid');

    // Create icons dynamically
    games.forEach((game, index) => {
        const icon = document.createElement('div');
        icon.classList.add('icon');
        icon.innerHTML = `
            <img src="${imageUrls[index % imageUrls.length]}" alt="${game.name}">
            <span>${game.name}</span>
        `;

        // Add click event to open the modal
        icon.onclick = () => openModal(game.iframe, game.name);
        iconGrid.appendChild(icon);
    });

    document.body.appendChild(iconGrid);

    // Create modal
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close">×</button>
            <h2 id="modal-title">Game Title</h2>
            <div id="modal-iframe" style="margin-top: 15px;"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Function to open modal
    function openModal(iframe, title) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-iframe').innerHTML = iframe;
        modal.style.display = 'flex';
    }

    // Close modal functionality
    modal.querySelector('.close').onclick = () => {
        modal.style.display = 'none';
        document.getElementById('modal-iframe').innerHTML = ''; // Clear iframe content
    };

    // Close modal on outside click
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.getElementById('modal-iframe').innerHTML = ''; // Clear iframe content
        }
    };

    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = `© 2024 - Nintendo 3DS YoutubeDrawaria`;

    document.body.appendChild(overlay);
    document.body.appendChild(header);
    document.body.appendChild(grid);
    document.body.appendChild(footer);

    // Remove unwanted elements from the page
    const elementsToRemove = [
        '.extimages',
        '#socbuttons',
        '.col text-center',
        '.loginbox'
    ];

    // Selecciona el elemento por su ID
    var elemento = document.getElementById('ytlink');

    // Oculta el elemento
    if (elemento) {
        elemento.style.display = 'none';
    }

    // Función para ocultar y eliminar el botón de Discord
    function removeDiscordButton() {
        var discordButton = document.getElementById('discordprombox');
        if (discordButton) {
            // Oculta el botón de Discord
            discordButton.style.display = 'none';
            // Elimina el botón de Discord del DOM
            discordButton.parentNode.removeChild(discordButton);
        }
    }

    const element5 = document.querySelector('div[style="border-top: #00b7ff solid 1px; margin-top: 1em; padding: 0.5em; padding-bottom: 0;"]');

    if (element5) {
        element5.remove();
    }


    // Ejecuta la función inmediatamente después de que se cargue el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeDiscordButton);
    } else {
        removeDiscordButton();
    }

    elementsToRemove.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    });
})();
