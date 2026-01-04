// ==UserScript==
// @name         Chatbots Tiled Windows
// @namespace    https://ejemplo.com
// @version      1.0
// @description  Abre múltiples chatbots en ventanas popup y las organiza en un layout en pantalla (3 o 4 secciones).
// @author       dani7115
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525893/Chatbots%20Tiled%20Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/525893/Chatbots%20Tiled%20Windows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ============================
       CONFIGURACIÓN Y VARIABLES
    ============================ */
    // Número de secciones (ventanas) inicial: 3 o 4
    let currentSections = 3;

    // Lista de chatbots (nombre y URL)
    const defaultBots = [
        { name: 'ChatGPT', url: 'https://chatgpt.com/' },
        { name: 'Bing', url: 'https://copilot.microsoft.com/?dpwa=1' },
        { name: 'DeepSeek', url: 'https://chat.deepseek.com/' },
        { name: 'Claude', url: 'https://claude.ai/new' },
        { name: 'Perplexity', url: 'https://www.perplexity.ai' }
    ];

    // Array para almacenar las referencias a las ventanas abiertas
    let chatWindows = [];

    /* ============================
       CREAR INTERFAZ DE CONTROL
    ============================ */

    // Botón flotante para abrir el panel de control
    function createFloatingButton() {
        const btn = document.createElement('button');
        btn.id = 'ctw-floating-btn';
        btn.textContent = 'Open Chatbot Tiler';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '10000',
            padding: '10px 15px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        btn.addEventListener('click', createModal);
        document.body.appendChild(btn);
    }

    // Crea el panel modal de control
    function createModal() {
        if (document.getElementById('ctw-modal')) return; // Evita crear duplicados

        // Modal a pantalla completa
        const modal = document.createElement('div');
        modal.id = 'ctw-modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column'
        });

        // Cabecera del modal
        const header = document.createElement('div');
        header.id = 'ctw-modal-header';
        Object.assign(header.style, {
            background: '#333',
            color: '#fff',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });

        const title = document.createElement('span');
        title.textContent = 'Chatbot Tiled Windows';

        // Botones de control en la cabecera
        const controls = document.createElement('div');

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Toggle 3/4';
        toggleBtn.style.marginRight = '10px';
        toggleBtn.addEventListener('click', toggleSections);

        const tileBtn = document.createElement('button');
        tileBtn.textContent = 'Tile Windows';
        tileBtn.style.marginRight = '10px';
        tileBtn.addEventListener('click', tileWindows);

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = 'Refresh Windows';
        refreshBtn.style.marginRight = '10px';
        refreshBtn.addEventListener('click', refreshWindows);

        const closeWinBtn = document.createElement('button');
        closeWinBtn.textContent = 'Close Windows';
        closeWinBtn.style.marginRight = '10px';
        closeWinBtn.addEventListener('click', closeWindows);

        const closeModalBtn = document.createElement('button');
        closeModalBtn.textContent = 'Close Panel';
        closeModalBtn.addEventListener('click', function() {
            modal.remove();
        });

        controls.appendChild(toggleBtn);
        controls.appendChild(tileBtn);
        controls.appendChild(refreshBtn);
        controls.appendChild(closeWinBtn);
        controls.appendChild(closeModalBtn);

        header.appendChild(title);
        header.appendChild(controls);
        modal.appendChild(header);

        // Área de contenido: controles para cada ventana/chatbot
        const content = document.createElement('div');
        content.id = 'ctw-content';
        Object.assign(content.style, {
            flex: '1',
            overflowY: 'auto',
            padding: '10px',
            background: '#f9f9f9'
        });
        modal.appendChild(content);

        document.body.appendChild(modal);

        renderModalContent();
    }

    // Renderiza los controles para cada sección (ventana)
    function renderModalContent() {
        const content = document.getElementById('ctw-content');
        if (!content) return;
        content.innerHTML = ''; // Limpiar contenido previo

        for (let i = 0; i < currentSections; i++) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'ctw-section';
            Object.assign(sectionDiv.style, {
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                background: '#fff'
            });

            const label = document.createElement('label');
            label.textContent = `Chatbot ${i + 1}: `;

            // Menú desplegable para elegir la URL
            const select = document.createElement('select');
            select.className = 'ctw-select';
            defaultBots.forEach(bot => {
                const option = document.createElement('option');
                option.value = bot.url;
                option.textContent = bot.name;
                select.appendChild(option);
            });

            // Botón para abrir la ventana del chatbot
            const openBtn = document.createElement('button');
            openBtn.textContent = 'Open Window';
            openBtn.style.marginLeft = '10px';
            openBtn.addEventListener('click', function() {
                openChatWindow(i, select.value);
            });

            sectionDiv.appendChild(label);
            sectionDiv.appendChild(select);
            sectionDiv.appendChild(openBtn);
            content.appendChild(sectionDiv);
        }
    }

    /* ============================
       FUNCIONALIDADES CON LAS VENTANAS
    ============================ */

    // Abre (o reabre) una ventana para la sección dada con la URL indicada
    function openChatWindow(index, url) {
        // Si ya existe y no se ha cerrado, actualiza la URL y enfoca la ventana.
        if (chatWindows[index] && !chatWindows[index].closed) {
            chatWindows[index].location.href = url;
            chatWindows[index].focus();
        } else {
            // Abre una nueva ventana. Nota: Es posible que el navegador bloquee los popups.
            let win = window.open(url, `chatWindow${index}`, 'resizable=yes,scrollbars=yes');
            if (win) {
                chatWindows[index] = win;
            } else {
                alert('Popup blocked. Please allow popups for this site.');
            }
        }
    }

    // Organiza (tilea) las ventanas abiertas en la pantalla
    function tileWindows() {
        const availWidth = window.screen.availWidth;
        const availHeight = window.screen.availHeight;

        if (currentSections === 3) {
            // Disposición para 3 ventanas:
            // - Ventana 1: ocupa la parte superior completa.
            // - Ventana 2: parte inferior izquierda.
            // - Ventana 3: parte inferior derecha.
            if (chatWindows[0] && !chatWindows[0].closed) {
                chatWindows[0].moveTo(0, 0);
                chatWindows[0].resizeTo(availWidth, Math.floor(availHeight / 2));
            }
            if (chatWindows[1] && !chatWindows[1].closed) {
                chatWindows[1].moveTo(0, Math.floor(availHeight / 2));
                chatWindows[1].resizeTo(Math.floor(availWidth / 2), Math.floor(availHeight / 2));
            }
            if (chatWindows[2] && !chatWindows[2].closed) {
                chatWindows[2].moveTo(Math.floor(availWidth / 2), Math.floor(availHeight / 2));
                chatWindows[2].resizeTo(Math.floor(availWidth / 2), Math.floor(availHeight / 2));
            }
        } else if (currentSections === 4) {
            // Disposición para 4 ventanas (grid 2x2)
            const halfWidth = Math.floor(availWidth / 2);
            const halfHeight = Math.floor(availHeight / 2);
            if (chatWindows[0] && !chatWindows[0].closed) {
                chatWindows[0].moveTo(0, 0);
                chatWindows[0].resizeTo(halfWidth, halfHeight);
            }
            if (chatWindows[1] && !chatWindows[1].closed) {
                chatWindows[1].moveTo(halfWidth, 0);
                chatWindows[1].resizeTo(halfWidth, halfHeight);
            }
            if (chatWindows[2] && !chatWindows[2].closed) {
                chatWindows[2].moveTo(0, halfHeight);
                chatWindows[2].resizeTo(halfWidth, halfHeight);
            }
            if (chatWindows[3] && !chatWindows[3].closed) {
                chatWindows[3].moveTo(halfWidth, halfHeight);
                chatWindows[3].resizeTo(halfWidth, halfHeight);
            }
        }
    }

    // Recarga el contenido de todas las ventanas abiertas
    function refreshWindows() {
        chatWindows.forEach(win => {
            if (win && !win.closed) {
                win.location.reload();
            }
        });
    }

    // Cierra todas las ventanas abiertas y limpia el array
    function closeWindows() {
        chatWindows.forEach(win => {
            if (win && !win.closed) {
                win.close();
            }
        });
        chatWindows = [];
    }

    // Alterna entre 3 y 4 secciones y vuelve a renderizar el contenido del panel
    function toggleSections() {
        currentSections = (currentSections === 3) ? 4 : 3;
        renderModalContent();
    }

    /* ============================
       ESTILOS ADICIONALES (OPCIONAL)
    ============================ */
    const style = document.createElement('style');
    style.innerHTML = `
        #ctw-modal button {
            padding: 5px 10px;
            background: #555;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #ctw-modal button:hover {
            background: #777;
        }
    `;
    document.head.appendChild(style);

    /* ============================
       INICIALIZACIÓN DEL SCRIPT
    ============================ */
    function init() {
        createFloatingButton();
    }
    init();

})();
