// ==UserScript==
// @name         Chatbots Embedded Browser
// @namespace    https://ejemplo.com
// @version      1.0.1
// @description  Crea una pestaña emergente con un navegador embebido dividido en 3 o 4 secciones, cada una con un chatbot distinto.
// @author       dani7115
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525890/Chatbots%20Embedded%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/525890/Chatbots%20Embedded%20Browser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ============================
       CONFIGURACIÓN Y VARIABLES
    ============================ */
    // Número de secciones inicial (3 o 4)
    let currentSections = 3;

    // Lista de chatbots por defecto (nombre y URL)
    const defaultBots = [
        { name: 'ChatGPT', url: 'https://chatgpt.com/' },
        { name: 'Bing', url: 'https://copilot.microsoft.com/?dpwa=1' },
        { name: 'DeepSeek', url: 'https://chat.deepseek.com/' },
        { name: 'Claude', url: 'https://claude.ai/new' },
        { name: 'Perplexity', url: 'https://www.perplexity.ai' }
    ];

    /* ============================
       FUNCIONES DE INTERFAZ
    ============================ */

    // Crea el botón flotante que abre el modal
    function createFloatingButton() {
        const btn = document.createElement('button');
        btn.id = 'cbp-floating-btn';
        btn.textContent = 'Open Chatbots';
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

    // Crea la pestaña emergente (modal) con cabecera y contenedor de iframes
    function createModal() {
        // Si ya existe el modal, no se vuelve a crear
        if (document.getElementById('cbp-modal')) return;

        // Modal a pantalla completa
        const modal = document.createElement('div');
        modal.id = 'cbp-modal';
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
        header.id = 'cbp-modal-header';
        Object.assign(header.style, {
            background: '#333',
            color: '#fff',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });

        const title = document.createElement('span');
        title.textContent = 'Chatbots Embedded Browser';

        // Contenedor de botones de control
        const controls = document.createElement('div');

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Toggle 3/4';
        toggleBtn.style.marginRight = '10px';
        toggleBtn.addEventListener('click', toggleSections);

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = 'Refresh All';
        refreshBtn.style.marginRight = '10px';
        refreshBtn.addEventListener('click', refreshAll);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', closeModal);

        controls.appendChild(toggleBtn);
        controls.appendChild(refreshBtn);
        controls.appendChild(closeBtn);

        header.appendChild(title);
        header.appendChild(controls);
        modal.appendChild(header);

        // Contenedor principal donde se ubicarán las secciones (usaremos CSS grid)
        const content = document.createElement('div');
        content.id = 'cbp-content';
        Object.assign(content.style, {
            flex: '1',
            display: 'grid',
            gap: '5px',
            padding: '5px'
        });
        modal.appendChild(content);

        document.body.appendChild(modal);

        // Renderizamos las secciones (iframes) según el número actual de secciones
        renderIframes();
    }

    // Renderiza (o re-renderiza) las secciones dentro del modal
    function renderIframes() {
        const content = document.getElementById('cbp-content');
        if (!content) return;
        content.innerHTML = ''; // Limpiamos contenido previo

        // Configuramos el grid según currentSections
        if (currentSections === 3) {
            content.style.gridTemplateColumns = 'repeat(3, 1fr)';
            content.style.gridTemplateRows = '1fr';
        } else {
            content.style.gridTemplateColumns = 'repeat(2, 1fr)';
            content.style.gridTemplateRows = 'repeat(2, 1fr)';
        }

        // Creamos cada sección
        for (let i = 0; i < currentSections; i++) {
            const section = document.createElement('div');
            section.className = 'cbp-section';
            Object.assign(section.style, {
                position: 'relative',
                border: '1px solid #ccc',
                overflow: 'hidden',
                minWidth: '100px',
                minHeight: '100px'
            });

            // Cabecera de la sección (contiene el dropdown)
            const secHeader = document.createElement('div');
            secHeader.className = 'cbp-section-header';
            Object.assign(secHeader.style, {
                background: '#f1f1f1',
                padding: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            });

            // Dropdown para cambiar la URL del chatbot
            const select = document.createElement('select');
            select.className = 'cbp-select';
            defaultBots.forEach(bot => {
                const option = document.createElement('option');
                option.value = bot.url;
                option.textContent = bot.name;
                select.appendChild(option);
            });
            // Al cambiar la opción se actualiza el src del iframe
            select.addEventListener('change', function(e) {
                iframe.src = this.value;
            });
            secHeader.appendChild(select);
            section.appendChild(secHeader);

            // Iframe que carga el chatbot (por defecto se carga la primera opción)
            const iframe = document.createElement('iframe');
            iframe.className = 'cbp-iframe';
            iframe.src = defaultBots[0].url;
            Object.assign(iframe.style, {
                width: '100%',
                height: 'calc(100% - 35px)', // descontando el alto aproximado de la cabecera
                border: '0'
            });
            section.appendChild(iframe);

            // Handle para redimensionar la sección (arrastrar esquina inferior derecha)
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'cbp-resize-handle';
            Object.assign(resizeHandle.style, {
                position: 'absolute',
                width: '10px',
                height: '10px',
                right: '0',
                bottom: '0',
                cursor: 'se-resize',
                background: 'rgba(0,0,0,0.3)'
            });
            section.appendChild(resizeHandle);

            // Agregamos la funcionalidad de redimensionar a esta sección
            addResizable(section, resizeHandle);

            content.appendChild(section);
        }
    }

    // Función que agrega redimensionamiento a una sección mediante el "handle"
    function addResizable(section, handle) {
        let isResizing = false,
            startX, startY, startWidth, startHeight;

        handle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = section.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            document.addEventListener('mousemove', resizeMouseMove);
            document.addEventListener('mouseup', resizeMouseUp);
        });

        function resizeMouseMove(e) {
            if (!isResizing) return;
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            section.style.width = newWidth + 'px';
            section.style.height = newHeight + 'px';
        }

        function resizeMouseUp(e) {
            isResizing = false;
            document.removeEventListener('mousemove', resizeMouseMove);
            document.removeEventListener('mouseup', resizeMouseUp);
        }
    }

    // Alterna entre 3 y 4 secciones y re-renderiza el grid
    function toggleSections() {
        currentSections = (currentSections === 3) ? 4 : 3;
        renderIframes();
    }

    // Recarga (refresh) todos los iframes del modal
    function refreshAll() {
        const iframes = document.querySelectorAll('#cbp-content iframe');
        iframes.forEach(iframe => {
            // Se puede recargar asignando de nuevo el src o usando location.reload()
            iframe.contentWindow.location.reload();
        });
    }

    // Cierra el modal y lo elimina del DOM
    function closeModal() {
        const modal = document.getElementById('cbp-modal');
        if (modal) modal.remove();
    }

    /* ============================
       ESTILOS ADICIONALES (opcional)
    ============================ */
    // Si deseas agregar más estilos o usar TailwindCSS, puedes inyectar un link o estilos aquí.
    const style = document.createElement('style');
    style.innerHTML = `
        /* Ejemplo de estilos adicionales */
        #cbp-modal button {
            padding: 5px 10px;
            background: #555;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #cbp-modal button:hover {
            background: #777;
        }
        /* Puedes complementar con clases de TailwindCSS si ya las tienes cargadas en la página */
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
