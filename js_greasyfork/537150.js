// ==UserScript==
// @name         Drawaria.online Selection Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds pixel selection, copy, paste, and delete tool to Drawaria.online (client-side only).
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537150/Drawariaonline%20Selection%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/537150/Drawariaonline%20Selection%20Tool.meta.js
// ==/UserScript==

(function() {
    'use_strict';

    let gameCanvas = null;
    let ctx = null;
    let overlayCanvas = null;
    let overlayCtx = null;

    let isSelecting = false;
    let selectionActive = false;
    let startX, startY, currentX, currentY;
    let selectionRect = { x: 0, y: 0, w: 0, h: 0 };
    let copiedImageData = null;
    let currentToolIsSelect = false;
    let selectionContextMenu = null;
    let selectToolButtonElement = null;

    GM_addStyle(`
        #selectionToolButton {
            cursor: pointer; padding: 5px; margin: 2px; border: 1px solid #ccc;
            background-color: #f0f0f0; display: flex; align-items: center;
            justify-content: center; width: 40px; height: 40px; /* Ajustar a los botones de Drawaria */
            box-sizing: border-box; font-size: 20px; user-select: none;
        }
        #selectionToolButton.active {
            background-color: #a0e0a0 !important; border-color: #508050 !important;
        }
        #selectionContextMenu {
            position: fixed; /* Usar fixed para posicionar relativo al viewport */
            display: none; background: white; border: 1px solid #ccc;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2); padding: 8px; z-index: 10001;
            font-size: 14px;
        }
        #selectionContextMenu button {
            display: block; width: 100%; margin-bottom: 5px; padding: 5px;
            border: 1px solid #ddd; background-color: #f8f8f8; cursor: pointer;
            text-align: left;
        }
        #selectionContextMenu button:hover { background-color: #e8e8e8; }
        #selectionContextMenu button:disabled {
            color: #aaa; cursor: default; background-color: #f0f0f0;
        }
    `);

    function updateOverlayPositionAndSize() {
        if (!gameCanvas || !overlayCanvas) return;
        const rect = gameCanvas.getBoundingClientRect();

        overlayCanvas.style.position = 'fixed'; // Usar fixed para que coincida con getBoundingClientRect
        overlayCanvas.style.left = rect.left + 'px';
        overlayCanvas.style.top = rect.top + 'px';
        overlayCanvas.style.width = rect.width + 'px';
        overlayCanvas.style.height = rect.height + 'px';

        // Sincronizar el tamaño del canvas interno con el tamaño renderizado del gameCanvas
        // Esto es importante si el gameCanvas es escalado por CSS.
        overlayCanvas.width = gameCanvas.offsetWidth;
        overlayCanvas.height = gameCanvas.offsetHeight;

        if (overlayCtx) { // Limpiar si el contexto ya existe
            overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            if (selectionActive && selectionRect.w > 0 && selectionRect.h > 0) {
                // Redibujar la selección si está activa, ya que el canvas se recreó/redimensionó
                overlayCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                overlayCtx.lineWidth = 1;
                overlayCtx.setLineDash([3, 3]);
                overlayCtx.strokeRect(selectionRect.x, selectionRect.y, selectionRect.w, selectionRect.h);
            }
        }
    }

    function initializeTool() {
        gameCanvas = document.getElementById('canvas');
        const controlsParent = document.getElementById('drawcontrols');

        if (!gameCanvas || !controlsParent) return false;

        if (!ctx) ctx = gameCanvas.getContext('2d', { willReadFrequently: true });

        if (!overlayCanvas) {
            overlayCanvas = document.createElement('canvas');
            overlayCanvas.id = 'selectionOverlay';
            overlayCanvas.style.pointerEvents = 'none';
            overlayCanvas.style.zIndex = '3'; // Encima del gameCanvas
            document.body.appendChild(overlayCanvas);
            overlayCtx = overlayCanvas.getContext('2d');
            setupMouseListeners();
        }
        updateOverlayPositionAndSize();

        if (!selectionContextMenu) setupContextMenu();
        if (!addSelectButton(controlsParent)) return false;

        window.addEventListener('resize', updateOverlayPositionAndSize);
        // Escuchar scroll en el contenedor del canvas si es relevante (Drawaria no parece tenerlo a nivel de canvas)
        // gameCanvas.parentElement.addEventListener('scroll', updateOverlayPositionAndSize);
        return true;
    }

    function addSelectButton(controlsParent) {
        let controlsContainer = controlsParent.querySelector('.tools-left'); // Contenedor específico
        if (!controlsContainer) {
             // Fallback más general si el anterior no se encuentra
            const groups = controlsParent.querySelectorAll('div[data-ctrlgroup]');
            if (groups.length > 0) {
                controlsContainer = groups[0]; // Añadir al primer grupo de herramientas
            } else {
                controlsContainer = controlsParent; // Último fallback
            }
        }

        if (selectToolButtonElement && selectToolButtonElement.parentElement === controlsContainer) {
            return true;
        }
        if (selectToolButtonElement && selectToolButtonElement.parentElement) {
            selectToolButtonElement.parentElement.removeChild(selectToolButtonElement); // Quitar del lugar antiguo si existe
        }

        if (!selectToolButtonElement) {
            selectToolButtonElement = document.createElement('div');
            selectToolButtonElement.innerHTML = '✂️';
            selectToolButtonElement.title = 'Herramienta de Selección';
            selectToolButtonElement.id = 'selectionToolButton';
            selectToolButtonElement.onclick = toggleSelectTool; // Función separada para el toggle
        }

        controlsContainer.appendChild(selectToolButtonElement);
        return true;
    }

    function toggleSelectTool() {
        currentToolIsSelect = !currentToolIsSelect;
        if (currentToolIsSelect) {
            selectToolButtonElement.classList.add('active');
            if (overlayCanvas) overlayCanvas.style.pointerEvents = 'auto';
            document.addEventListener('mousedown', handleDocumentMouseDown, true); // Captura para ejecutarse primero
        } else {
            selectToolButtonElement.classList.remove('active');
            if (overlayCanvas) overlayCanvas.style.pointerEvents = 'none';
            clearSelectionRectangle();
            if(selectionContextMenu) selectionContextMenu.style.display = 'none';
            document.removeEventListener('mousedown', handleDocumentMouseDown, true);
        }
        console.log("Herramienta de selección activa:", currentToolIsSelect);
    }

    function handleDocumentMouseDown(e) {
        if (!currentToolIsSelect) return;

        // Si el clic es en el botón de selección, overlay, o menú, no hacer nada aquí
        if (e.target === selectToolButtonElement ||
            e.target === overlayCanvas ||
            (selectionContextMenu && selectionContextMenu.contains(e.target))) {
            return;
        }

        // Si el clic es en otra parte (p.ej. otra herramienta del juego), desactivar la selección.
        console.log("Document click detected, deselecting tool.");
        toggleSelectTool(); // Esto cambiará currentToolIsSelect a false y limpiará
    }


    function setupMouseListeners() {
        // ... (igual que en la versión 0.3, asegurándose de usar overlayCanvas.getBoundingClientRect() para las coords)
        const oldOverlay = overlayCanvas;
        overlayCanvas = oldOverlay.cloneNode(true);
        oldOverlay.parentNode.replaceChild(overlayCanvas, oldOverlay);
        overlayCtx = overlayCanvas.getContext('2d');

        overlayCanvas.addEventListener('mousedown', function(e) {
            if (!currentToolIsSelect) return;
            if (selectionContextMenu && selectionContextMenu.contains(e.target)) return;

            const rect = overlayCanvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            isSelecting = true;
            selectionActive = false; // Una nueva selección se está iniciando
            // No limpiar copiedImageData aquí, para permitir pegar después de una nueva selección (si no se copió nada nuevo)
            if (selectionContextMenu) selectionContextMenu.style.display = 'none';
        });

        overlayCanvas.addEventListener('mousemove', function(e) {
            if (!currentToolIsSelect || !isSelecting) return;
            const rect = overlayCanvas.getBoundingClientRect();
            currentX = e.clientX - rect.left;
            currentY = e.clientY - rect.top;
            drawSelectionRectangle();
        });

        overlayCanvas.addEventListener('mouseup', function(e) {
            if (!currentToolIsSelect || !isSelecting) return;
            isSelecting = false;

            // Definir el rectángulo de selección final
            selectionRect.x = Math.min(startX, currentX);
            selectionRect.y = Math.min(startY, currentY);
            selectionRect.w = Math.abs(currentX - startX);
            selectionRect.h = Math.abs(currentY - startY);

            if (selectionRect.w < 2 || selectionRect.h < 2) { // Ignorar selecciones muy pequeñas
                clearSelectionRectangle(); // Esto pone selectionActive = false
            } else {
                selectionActive = true; // Solo activar si la selección es válida
                console.log("Selección hecha:", selectionRect);
            }
        });

        overlayCanvas.addEventListener('contextmenu', function(e) {
            if (!currentToolIsSelect || !selectionActive || !selectionRect || selectionRect.w === 0 || selectionRect.h === 0) {
                if(selectionContextMenu) selectionContextMenu.style.display = 'none';
                return;
            }
            e.preventDefault();
            if (!selectionContextMenu) setupContextMenu();

            selectionContextMenu.style.left = e.clientX + 'px';
            selectionContextMenu.style.top = e.clientY + 'px';
            selectionContextMenu.style.display = 'block';
            document.getElementById('ctxPaste').disabled = !copiedImageData;
        });
    }

    function drawSelectionRectangle() {
        // ... (igual que en la versión 0.3)
        if (!overlayCtx || !overlayCanvas) return;
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        overlayCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        overlayCtx.lineWidth = 1; // Línea delgada para más precisión visual
        overlayCtx.setLineDash([2, 2]); // Puntos más pequeños
        overlayCtx.strokeRect(startX, startY, currentX - startX, currentY - startY);
    }

    function clearSelectionRectangle() {
        // ... (igual que en la versión 0.3)
        if (!overlayCtx || !overlayCanvas) return;
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        selectionActive = false;
        selectionRect = { x: 0, y: 0, w: 0, h: 0 };
    }

    function setupContextMenu() {
        // ... (igual que en la versión 0.3, pero asegurar posicionamiento 'fixed')
        if (document.getElementById('selectionContextMenu')) return;

        selectionContextMenu = document.createElement('div');
        selectionContextMenu.id = 'selectionContextMenu';
        // Estilos ahora son GM_addStyle
        selectionContextMenu.innerHTML = `
            <button id="ctxCopy">Copiar</button><button id="ctxPaste" disabled>Pegar</button>
            <button id="ctxDelete">Eliminar</button><hr style="margin: 5px 0;">
            <button id="ctxClearSel">Limpiar Selección</button>`;
        document.body.appendChild(selectionContextMenu);

        document.getElementById('ctxCopy').onclick = function() {
            if (selectionActive && selectionRect.w > 0 && selectionRect.h > 0 && ctx) {
                try {
                    copiedImageData = ctx.getImageData(selectionRect.x, selectionRect.y, selectionRect.w, selectionRect.h);
                } catch (err) { console.error("Error copying:", err); alert("Error al copiar: " + err.message); copiedImageData = null; }
            }
            selectionContextMenu.style.display = 'none';
        };
        document.getElementById('ctxPaste').onclick = function() {
            if (copiedImageData && overlayCanvas && ctx) {
                alert("Haz clic en el canvas donde quieras pegar.");
                overlayCanvas.style.pointerEvents = 'auto'; overlayCanvas.style.cursor = 'crosshair';
                const pasteHandler = function(e) {
                    const rect = overlayCanvas.getBoundingClientRect();
                    const pasteX = e.clientX - rect.left - copiedImageData.width / 2;
                    const pasteY = e.clientY - rect.top - copiedImageData.height / 2;
                    ctx.putImageData(copiedImageData, pasteX, pasteY);
                    overlayCanvas.removeEventListener('click', pasteHandler);
                    overlayCanvas.style.cursor = '';
                    overlayCanvas.style.pointerEvents = currentToolIsSelect ? 'auto' : 'none';
                };
                overlayCanvas.addEventListener('click', pasteHandler, { once: true });
            }
            selectionContextMenu.style.display = 'none';
        };
        document.getElementById('ctxDelete').onclick = function() {
            if (selectionActive && selectionRect.w > 0 && selectionRect.h > 0 && ctx) {
                ctx.fillStyle = 'white'; ctx.fillRect(selectionRect.x, selectionRect.y, selectionRect.w, selectionRect.h);
                clearSelectionRectangle();
            }
            selectionContextMenu.style.display = 'none';
        };
        document.getElementById('ctxClearSel').onclick = function() {
            clearSelectionRectangle(); selectionContextMenu.style.display = 'none';
        };
        document.addEventListener('mousedown', function(e) { // Cambiado a mousedown
            if (selectionContextMenu && selectionContextMenu.style.display === 'block' &&
                !selectionContextMenu.contains(e.target) && e.target !== overlayCanvas) {
                selectionContextMenu.style.display = 'none';
            }
        }, true); // Usar captura
    }

    // --- Lógica de inicialización ---
    let initializationAttempts = 0;
    const MAX_INIT_ATTEMPTS = 20; // Más intentos
    let toolFullyInitialized = false;

    const observer = new MutationObserver((mutationsList, obs) => {
        if (!toolFullyInitialized) {
            toolFullyInitialized = initializeTool();
        } else {
            updateOverlayPositionAndSize(); // Mantener overlay alineado
            const controlsParent = document.getElementById('drawcontrols');
            if (controlsParent && selectToolButtonElement && !selectToolButtonElement.parentElement) {
                // Si el botón fue removido del DOM por alguna razón, intentar re-añadirlo
                addSelectButton(controlsParent);
            } else if (controlsParent && selectToolButtonElement && selectToolButtonElement.parentElement.id !== controlsParent.id &&
                       !controlsParent.contains(selectToolButtonElement)) {
                // Si el padre cambió o ya no lo contiene, intentar re-añadirlo
                addSelectButton(controlsParent);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function delayedInitializeCheck() {
        if (toolFullyInitialized || initializationAttempts >= MAX_INIT_ATTEMPTS) {
            if (!toolFullyInitialized) console.error("Drawaria Tool: Failed to init.");
            return;
        }
        initializationAttempts++;
        toolFullyInitialized = initializeTool();
        if (!toolFullyInitialized) setTimeout(delayedInitializeCheck, 500);
    }
    setTimeout(delayedInitializeCheck, 500); // Reducido el primer delay

})();