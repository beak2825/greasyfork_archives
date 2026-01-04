// ==UserScript==
// @name         Drawaria Symbols Loader Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Load symbols from BarsikSymbols.json and allow inserting them into the chat with a click. Improved and draggable menu
// @author       YouTubeDrawaria, Barsik Hacker
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/544866/Drawaria%20Symbols%20Loader%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/544866/Drawaria%20Symbols%20Loader%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SYM_URL = "https://raw.githubusercontent.com/NuevoMundoOficial/DrawariaWordList/main/BarsikSymbols.json";
    const PAGE_SIZE = 30; // Número de símbolos por página

    let allSymbols = []; // Almacena todos los símbolos cargados
    let currentPage = 0;
    let symLoaderBox; // Referencia al cuadro principal de la UI

    // Variables para la funcionalidad de arrastre
    let isDragging = false;
    let offsetX, offsetY;

    /**
     * Crea y añade la interfaz de usuario al DOM.
     * Incluye estilos CSS y la estructura HTML básica.
     */
    function createUI() {
        // --- Estilos CSS ---
        const style = document.createElement('style');
        style.textContent = `
            #symLoaderBox {
                position: fixed;
                top: 60px;
                right: 20px;
                background: #2b2b2b; /* Fondo oscuro */
                color: #e0e0e0; /* Texto claro */
                z-index: 9999; /* Asegura que esté por encima de otros elementos */
                border-radius: 10px;
                padding: 15px;
                width: 280px; /* Ancho ligeramente mayor */
                font-size: 15px;
                box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4); /* Sombra suave */
                font-family: 'Arial', sans-serif;
                border: 1px solid #444; /* Borde sutil */
                cursor: grab; /* Cursor para indicar que es arrastrable */
            }

            #symLoaderHeader {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px solid #3a3a3a; /* Separador */
                cursor: grab; /* Cursor para indicar que el header es arrastrable */
            }
            #symLoaderHeader span {
                font-size: 18px;
                font-weight: bold;
                color: #fff;
            }

            #symLoaderBox button {
                margin: 0 2px;
                padding: 5px 9px;
                font-size: 17px;
                vertical-align: middle;
                border-radius: 5px;
                border: none;
                background: #444;
                color: #fff;
                cursor: pointer;
                transition: background 0.2s ease, transform 0.1s ease; /* Transiciones suaves */
            }
            #symLoaderBox button:hover {
                background: #666;
                transform: translateY(-1px); /* Efecto de "levantar" */
            }
            #symLoaderBox button:active {
                transform: translateY(0);
            }

            #symLoaderDL {
                background: #3a7bd5; /* Color distintivo para descargar */
            }
            #symLoaderDL:hover {
                background: #2a6bc5;
            }

            #symLoaderClose {
                background: #d32f2f; /* Rojo para cerrar */
            }
            #symLoaderClose:hover {
                background: #c31f1f;
            }

            #symLoaderSymbols {
                max-height: 280px; /* Altura máxima para el scroll */
                overflow-y: auto;
                word-break: break-all; /* Rompe palabras largas */
                white-space: normal;
                padding-right: 5px; /* Espacio para la barra de desplazamiento */
                margin-bottom: 10px;
            }

            /* Estilos de la barra de desplazamiento (para navegadores Webkit como Chrome, Safari) */
            #symLoaderSymbols::-webkit-scrollbar {
                width: 8px;
            }
            #symLoaderSymbols::-webkit-scrollbar-track {
                background: #333;
                border-radius: 10px;
            }
            #symLoaderSymbols::-webkit-scrollbar-thumb {
                background: #666;
                border-radius: 10px;
            }
            #symLoaderSymbols::-webkit-scrollbar-thumb:hover {
                background: #888;
            }

            .symBtn { /* Estilo para los botones de símbolos individuales */
                display: inline-block;
                background: #555;
                color: #fff;
                padding: 4px 8px;
                margin: 3px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.15s ease, transform 0.05s ease;
                user-select: none; /* Previene la selección de texto */
            }
            .symBtn:hover {
                background: #777;
                transform: scale(1.02);
            }
            .symBtn:active {
                transform: scale(1.0);
            }

            #symLoaderPager {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 5px;
                padding-top: 5px;
                border-top: 1px solid #3a3a3a; /* Separador */
            }
            #symLoaderPager .pager-button { /* Clase para los botones de paginación */
                background: #007bff;
                color: #fff;
                padding: 3px 8px;
                margin: 0 5px;
                font-size: 15px;
                border-radius: 4px;
                transition: background 0.2s ease;
            }
            #symLoaderPager .pager-button:hover {
                background: #0056b3;
            }
            #symLoaderPager .pager-button:disabled {
                background: #555;
                cursor: not-allowed;
            }
            #symLoaderPager span {
                font-size: 15px;
                color: #bbb;
            }
        `;
        document.head.appendChild(style);

        // --- Estructura HTML ---
        symLoaderBox = document.createElement('div');
        symLoaderBox.id = 'symLoaderBox';
        symLoaderBox.innerHTML = `
            <div id="symLoaderHeader">
                <span>Drawaria Symbols</span>
                <div>
                    <button id="symLoaderDL">💾</button>
                    <button id="symLoaderClose">❌</button>
                </div>
            </div>
            <div id="symLoaderSymbols">
                Cargando símbolos...
            </div>
            <div id="symLoaderPager">
                <!-- Los botones de paginación se insertarán aquí -->
            </div>
        `;
        document.body.appendChild(symLoaderBox);

        // --- Event Listeners ---
        document.getElementById('symLoaderClose').onclick = () => symLoaderBox.remove();
        document.getElementById('symLoaderDL').onclick = downloadJSON;

        // Delegación de eventos para los botones de símbolos (eficiente para muchos botones)
        document.getElementById('symLoaderBox').addEventListener('click', e => {
            if (e.target.classList.contains('symBtn')) {
                insertToChat(e.target.dataset.symbol);
            }
        });

        // --- Draggable functionality ---
        const symLoaderHeader = document.getElementById('symLoaderHeader');

        symLoaderHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            // Calcular el desplazamiento del cursor dentro del elemento
            offsetX = e.clientX - symLoaderBox.getBoundingClientRect().left;
            offsetY = e.clientY - symLoaderBox.getBoundingClientRect().top;
            symLoaderBox.style.cursor = 'grabbing'; // Cambiar cursor al arrastrar
            // Prevenir la selección de texto durante el arrastre
            symLoaderBox.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            // Calcular la nueva posición del elemento
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            // Opcional: Limitar el arrastre dentro de la ventana
            const maxX = window.innerWidth - symLoaderBox.offsetWidth;
            const maxY = window.innerHeight - symLoaderBox.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));

            symLoaderBox.style.left = `${newLeft}px`;
            symLoaderBox.style.top = `${newTop}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            symLoaderBox.style.cursor = 'grab'; // Restaurar cursor
            symLoaderBox.style.userSelect = 'auto'; // Habilitar selección de texto
        });
    }

    /**
     * Rellena el contenedor de símbolos con los símbolos de la página actual.
     * Siempre usa `allSymbols` ya que no hay filtro.
     * @param {number} page - El número de página a mostrar (0-indexado).
     */
    function populateSymbols(page = 0) {
        if (!allSymbols || allSymbols.length === 0) {
            fillSymbols('No hay símbolos disponibles.');
            updatePager(0, 0, 0); // Actualiza la paginación a "sin páginas"
            return;
        }

        currentPage = page;
        const wrap = document.getElementById('symLoaderSymbols');
        wrap.innerHTML = ''; // Limpia los símbolos anteriores

        let start = page * PAGE_SIZE;
        let end = Math.min(start + PAGE_SIZE, allSymbols.length);

        const fragment = document.createDocumentFragment(); // Para mejor rendimiento al añadir muchos elementos
        for (let i = start; i < end; i++) {
            const symbol = allSymbols[i];
            const button = document.createElement('button');
            button.classList.add('symBtn');
            button.dataset.symbol = symbol; // Almacena el símbolo en un atributo de datos
            button.textContent = symbol;
            fragment.appendChild(button);
        }
        wrap.appendChild(fragment);

        updatePager(page, allSymbols.length, PAGE_SIZE);
    }

    /**
     * Actualiza los botones y la información de la paginación.
     * @param {number} currentPage - La página actual (0-indexada).
     * @param {number} totalSymbols - El número total de símbolos disponibles.
     * @param {number} pageSize - El número de símbolos por página.
     */
    function updatePager(currentPage, totalSymbols, pageSize) {
        const pager = document.getElementById('symLoaderPager');
        pager.innerHTML = ''; // Limpia la paginación existente

        if (totalSymbols <= pageSize) {
            return; // No se necesita paginación si hay una sola página o menos
        }

        const totalPages = Math.ceil(totalSymbols / pageSize);

        // Botón "Anterior"
        const prevButton = document.createElement('button');
        prevButton.classList.add('pager-button');
        prevButton.textContent = '<';
        prevButton.disabled = currentPage === 0; // Deshabilitar si es la primera página
        prevButton.onclick = () => populateSymbols(currentPage - 1);
        pager.appendChild(prevButton);

        // Información de la página (ej: "1/5")
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `${currentPage + 1}/${totalPages}`;
        pager.appendChild(pageInfo);

        // Botón "Siguiente"
        const nextButton = document.createElement('button');
        nextButton.classList.add('pager-button');
        nextButton.textContent = '>';
        nextButton.disabled = currentPage >= totalPages - 1; // Deshabilitar si es la última página
        nextButton.onclick = () => populateSymbols(currentPage + 1);
        pager.appendChild(nextButton);
    }

    /**
     * Rellena el contenedor de símbolos con un mensaje de estado.
     * @param {string} msg - El mensaje a mostrar.
     */
    function fillSymbols(msg) {
        document.getElementById('symLoaderSymbols').textContent = msg;
    }

    /**
     * Descarga los símbolos cargados como un archivo JSON.
     */
    function downloadJSON() {
        const a = document.createElement('a');
        // Convierte el array a JSON con indentación para que sea legible
        a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allSymbols, null, 2));
        a.download = 'BarsikSymbols.json';
        a.click();
    }

    /**
     * Inserta el texto dado en el campo de entrada del chat.
     * Se actualizó el selector para el chatbox de Drawaria.
     * @param {string} txt - El texto a insertar.
     */
    function insertToChat(txt) {
        const chatInput = document.getElementById('chatbox_textinput'); // Selector actualizado
        if (!chatInput) {
            alert('No se ha encontrado el input de chat con ID "chatbox_textinput".');
            return;
        }
        chatInput.value = txt;
        // Dispara un evento 'input' para asegurar que frameworks como React/Vue detecten el cambio
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Opcional: enviar el mensaje (descomenta la siguiente línea, ¡bajo tu responsabilidad!)
        // document.querySelector('.chat__message-form button')?.click();
    }

    /**
     * Carga los símbolos desde la URL especificada.
     */
    async function loadSymbols() {
        fillSymbols("Cargando símbolos..."); // Mostrar mensaje de carga
        try {
            const response = await fetch(SYM_URL);
            if (!response.ok) {
                throw new Error(`Error HTTP! estado: ${response.status}`);
            }
            const obj = await response.json();
            // Soporta si el JSON es un array directamente o un objeto con una propiedad 'symbols'
            allSymbols = Array.isArray(obj) ? obj : obj.symbols ?? [];

            if (allSymbols.length === 0) {
                fillSymbols("No se encontraron símbolos en el archivo JSON o el formato es incorrecto.");
            } else {
                populateSymbols(0); // Carga la página inicial de símbolos
            }
        } catch (e) {
            console.error("Error al cargar símbolos:", e);
            fillSymbols(`Error al cargar símbolos: ${e.message}. Por favor, intenta recargar la página.`);
        }
    }

    // Inicializa la interfaz de usuario y carga los símbolos al iniciar el script
    createUI();
    loadSymbols();
})();