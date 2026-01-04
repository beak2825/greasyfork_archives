// ==UserScript==
// @name         Drawaria Custom Stencils
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Carga, gestiona y mueve tus propias plantillas SVG personalizadas en Drawaria.online.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        unsafeWindow
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539294/Drawaria%20Custom%20Stencils.user.js
// @updateURL https://update.greasyfork.org/scripts/539294/Drawaria%20Custom%20Stencils.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;
    if (typeof $ === 'undefined') {
        console.error("Drawaria Custom Stencils: jQuery no está disponible en la página.");
        return;
    }

    const STORAGE_KEY = 'drawaria_custom_stencils';

    // --- 1. FUNCIONES DE ALMACENAMIENTO ---
    function getCustomStencils() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            console.error("Error al cargar las plantillas personalizadas:", e);
            return [];
        }
    }

    function saveCustomStencils(stencils) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stencils));
    }


    // --- 2. LÓGICA DE DRAG & DROP (de Cubic Engine) ---
    // Función para hacer un elemento arrastrable.
    function makeDragable(draggableElement, update) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        draggableElement.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            draggableElement.style.top = (draggableElement.offsetTop - pos2) + "px";
            draggableElement.style.left = (draggableElement.offsetLeft - pos1) + "px";
            if (update) {
                update();
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    // --- 3. LÓGICA PRINCIPAL DEL SCRIPT ---

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const stencilName = prompt('Ingresa un nombre para tu plantilla:', file.name.replace('.svg', ''));
                if (stencilName && stencilName.trim() !== "") {
                    const stencils = getCustomStencils();
                    const svgData = e.target.result;
                    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                    stencils.push({ name: stencilName, data: dataUrl });
                    saveCustomStencils(stencils);
                    renderCustomStencils();
                }
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, selecciona un archivo SVG válido.');
        }
        event.target.value = '';
    }

    function renderCustomStencils() {
        const container = $('.inventorydlg-itemscontainer');
        if (!container.length) return;

        $('.custom-stencil-item').remove();

        const stencils = getCustomStencils();
        stencils.forEach((stencil, index) => {
            const stencilEl = $(`
                <span class="accountbox-itemscontainer-slot custom-stencil-item" title="${stencil.name}" style="position: relative;">
                    <div><img src="${stencil.data}" style="padding: 3px;"></div>
                </span>
            `);

            stencilEl.on('click', (e) => {
                e.stopPropagation();
                activateStencil(stencil.data);
                $('#inventorydlg').modal('hide');
            });

            const deleteBtn = $('<button>✖</button>').css({
                position: 'absolute', top: '0', right: '0', zIndex: '10', background: 'rgba(200, 0, 0, 0.7)',
                color: 'white', border: 'none', cursor: 'pointer', borderRadius: '0 0 0 5px', lineHeight: '1',
            });

            deleteBtn.on('click', (e) => {
                e.stopPropagation();
                if (confirm(`¿Seguro que quieres borrar la plantilla "${stencil.name}"?`)) {
                    let currentStencils = getCustomStencils();
                    currentStencils.splice(index, 1);
                    saveCustomStencils(currentStencils);
                    renderCustomStencils();
                }
            });

            stencilEl.append(deleteBtn);
            container.append(stencilEl);
        });
    }

    // --- FUNCIÓN CLAVE MEJORADA ---
    function activateStencil(dataUrl) {
        $('#stencilinstance').remove();

        // 1. Crear el elemento de imagen y darle un estilo inicial
        const imgElement = $('<img id="stencilinstance">').attr('src', dataUrl).css({
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'move',
            'max-width': '150px',
            'max-height': '150px',
            'box-shadow': '0 0 1px 1px cornflowerblue inset' // Estilo del GhostCanvas
        });

        // 2. Añadirlo a la página
        $('body').append(imgElement);

        // 3. Hacerlo arrastrable usando la lógica que proporcionaste
        makeDragable(imgElement[0], null); // Pasamos el elemento DOM, no el objeto jQuery
    }


    // --- 4. INYECCIÓN EN LA INTERFAZ DEL JUEGO ---

    function injectUI() {
        const modalHeader = $('#inventory-title');
        if (modalHeader.length && !$('#custom-stencil-loader').length) {
            const fileInput = $('<input type="file" accept=".svg" style="display: none;" id="custom-stencil-file-input">');
            fileInput.on('change', handleFileSelect);

            const loadButton = $('<button id="custom-stencil-loader" class="btn btn-sm btn-success" style="margin-left: 15px;">Cargar Plantilla</button>');
            loadButton.on('click', () => fileInput.click());

            modalHeader.parent().append(loadButton, fileInput);
            renderCustomStencils();
        }
    }

    const observer = new MutationObserver(() => {
        if ($('#inventorydlg').is(':visible')) {
            injectUI();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();