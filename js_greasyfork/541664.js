// ==UserScript==
// @name         Gemini - Smart Copy Buttons
// @name:es      Gemini - Botones de Copiado Inteligentes
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  Enhances Gemini's copy function. The native chat 'Copy' button now intelligently copies all code blocks if present, separated by newlines. Also adds a direct 'Copy' button to the Canvas/code editor toolbar.
// @description:es Mejora la función de copiado de Gemini. El botón nativo 'Copiar' del chat ahora copia de forma inteligente todos los bloques de código si existen, separados por saltos de línea. También añade un botón de 'Copiar' directo a la barra de herramientas del Canvas/editor de código.
// @author       Gemini
// @match        https://gemini.google.com/app*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541664/Gemini%20-%20Smart%20Copy%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/541664/Gemini%20-%20Smart%20Copy%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inyecta el CSS necesario para el ícono de feedback en el botón del Canvas.
    GM_addStyle(`
        .copiar-canvas-button .copied-icon {
            color: #6dd58c; /* Color verde para el ícono de "check" */
            font-variation-settings: 'FILL' 1;
        }
        .copiar-canvas-button {
            margin-right: 8px; /* Espacio para el botón en el Canvas */
        }
    `);

    /**
     * Modifica el comportamiento del botón de copiar nativo en las respuestas del chat.
     * @param {HTMLElement} responseContainer - El elemento <model-response> que contiene la respuesta.
     */
    function modificarBotonDeCopiaChat(responseContainer) {
        const botonCopiarNativo = responseContainer.querySelector('.response-container-footer copy-button > button');
        if (!botonCopiarNativo) return;

        const botonClonado = botonCopiarNativo.cloneNode(true);
        botonCopiarNativo.parentNode.replaceChild(botonClonado, botonCopiarNativo);

        const icono = botonClonado.querySelector('mat-icon');

        botonClonado.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            // >>> INICIO DE LA MEJORA <<<
            // Selecciona TODOS los bloques de código dentro de la respuesta.
            const bloquesDeCodigo = responseContainer.querySelectorAll('div.code-block');
            let textoACopiar = '';

            if (bloquesDeCodigo.length > 0) {
                // Si hay bloques de código, itera sobre ellos.
                bloquesDeCodigo.forEach(bloque => {
                    const elementoCodigo = bloque.querySelector('code');
                    if (elementoCodigo) {
                        // Concatena el texto de cada bloque, seguido de dos saltos de línea (una línea en blanco).
                        textoACopiar += elementoCodigo.innerText + '\n\n';
                    }
                });
                // Limpia los saltos de línea sobrantes al final del texto completo.
                textoACopiar = textoACopiar.trim();
            } else {
                // Si no hay código, copia el texto completo de la respuesta (comportamiento original).
                const elementoContenido = responseContainer.querySelector('.markdown');
                if (elementoContenido) {
                    textoACopiar = elementoContenido.innerText;
                }
            }
            // >>> FIN DE LA MEJORA <<<

            if (textoACopiar) {
                navigator.clipboard.writeText(textoACopiar).then(() => {
                    if (icono) {
                        const iconoOriginal = icono.textContent;
                        icono.textContent = 'check'; // Feedback visual de éxito.
                        setTimeout(() => {
                            icono.textContent = iconoOriginal;
                        }, 2000);
                    }
                }).catch(err => console.error('Error al copiar el contenido modificado: ', err));
            }
        });

        responseContainer.dataset.nativeCopyModified = 'true';
    }

    /**
     * Agrega un botón de copiar directo a la barra de herramientas del Canvas (editor de código).
     * @param {HTMLElement} panelCanvas - El elemento <code-immersive-panel>.
     */
    function agregarBotonDeCopiaCanvas(panelCanvas) {
        const actionsContainer = panelCanvas.querySelector('toolbar .action-buttons');
        const shareButtonTrigger = panelCanvas.querySelector('toolbar share-button button');

        if (!actionsContainer || !shareButtonTrigger || panelCanvas.querySelector('.copiar-canvas-button')) return;

        const botonCopiar = document.createElement('button');
        botonCopiar.className = 'mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-tooltip-trigger icon-button copiar-canvas-button mat-unthemed';
        botonCopiar.setAttribute('mat-icon-button', '');
        botonCopiar.setAttribute('mattooltip', 'Copiar código');
        botonCopiar.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            shareButtonTrigger.click(); // Abre el menú de compartir para acceder al botón de copia nativo.

            setTimeout(() => {
                const menuPanel = document.querySelector('.mat-mdc-menu-panel.mat-mdc-menu-panel');
                if (menuPanel) {
                    const originalCopyButton = menuPanel.querySelector('copy-button button');
                    if (originalCopyButton) {
                        originalCopyButton.click(); // Usa la lógica de copiado de Gemini.

                        const icono = botonCopiar.querySelector('mat-icon');
                        icono.textContent = 'check';
                        icono.classList.add('copied-icon');
                        setTimeout(() => {
                            icono.textContent = 'content_copy';
                            icono.classList.remove('copied-icon');
                        }, 2000);
                    }
                }
            }, 50);
        });

        const icono = document.createElement('mat-icon');
        icono.className = 'mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color';
        icono.textContent = 'content_copy';
        botonCopiar.appendChild(icono);

        actionsContainer.insertBefore(botonCopiar, shareButtonTrigger.parentElement.parentElement);
        panelCanvas.dataset.canvasCopyButtonAdded = 'true';
    }

    // MutationObserver vigila los cambios en la página para aplicar las mejoras dinámicamente.
    const observer = new MutationObserver(() => {
        document.querySelectorAll('model-response:not([data-native-copy-modified])').forEach(modificarBotonDeCopiaChat);
        document.querySelectorAll('code-immersive-panel:not([data-canvas-copy-button-added])').forEach(agregarBotonDeCopiaCanvas);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();