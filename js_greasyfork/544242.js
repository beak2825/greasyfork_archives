// ==UserScript==
// @name         Desbloquear Facemojikeyboard
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Desbloquea los textos artísticos, previene popups, copia al portapapeles sin notificaciones, sin afectar el scroll, y elimina "@Facemojikeyboard" del texto.
// @author       YouTubeDrawaria
// @match        https://www.facemojikeyboard.com/text-art-collection
// @grant        none
// @license      MIT
// @icon         https://cdn.facemojikeyboard.com/website/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/544242/Desbloquear%20Facemojikeyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/544242/Desbloquear%20Facemojikeyboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cadena a eliminar de los textos
    const STRING_TO_REMOVE = '@Facemojikeyboard';

    /**
     * Copia el texto dado al portapapeles. Sin notificaciones.
     * @param {string} text El texto a copiar.
     */
    function copyTextToClipboard(text) {
        // Eliminar la cadena no deseada antes de copiar
        const cleanedText = text.replace(new RegExp(STRING_TO_REMOVE, 'g'), '').trim();

        if (navigator.clipboard) {
            navigator.clipboard.writeText(cleanedText).catch(err => {
                console.error('No se pudo copiar el texto usando navigator.clipboard: ', err);
                fallbackCopyTextToClipboard(cleanedText);
            });
        } else {
            fallbackCopyTextToClipboard(cleanedText);
        }
    }

    /**
     * Fallback para copiar texto al portapapeles usando un textarea temporal.
     * @param {string} text El texto a copiar.
     */
    function fallbackCopyTextToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('No se pudo copiar el texto con execCommand: ', err);
        }
        document.body.removeChild(textarea);
    }

    /**
     * Aplica las modificaciones a los elementos de arte de texto (eliminar candado, hacer seleccionable, añadir listener de copia).
     */
    function applyModifications() {
        const textArtWrappers = document.querySelectorAll('.emojiwrapper-list-tool__wrapper');

        textArtWrappers.forEach(item => {
            // 1. Elimina el icono de candado si existe
            const lockIcon = item.querySelector('img.lock');
            if (lockIcon) {
                lockIcon.remove();
            }

            // 2. Asegura que el texto sea seleccionable
            item.style.userSelect = 'text';
            item.style.webkitUserSelect = 'text';
            item.style.mozUserSelect = 'text';
            item.style.msUserSelect = 'text';

            // 3. Añade un listener de clic para copiar texto y prevenir popups
            if (!item.dataset.listenerAdded) {
                item.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    const textSpan = this.querySelector('span');
                    if (textSpan && textSpan.textContent) {
                        copyTextToClipboard(textSpan.textContent.trim());
                    }
                }, { capture: true });
                item.dataset.listenerAdded = 'true';
            }
        });
    }

    /**
     * Oculta elementos específicos de pop-up y asegura que el scroll no esté bloqueado.
     * Se usa `!important` para asegurar la anulación de estilos existentes.
     */
    function hideSpecificPopupsAndRestoreScroll() {
        const popper = document.querySelector('.el-popper.tooltip-popper-class');
        if (popper) {
            popper.style.setProperty('display', 'none', 'important');
            popper.setAttribute('aria-hidden', 'true');
        }

        const modal = document.querySelector('.dialog-container.default-modal');
        if (modal) {
            modal.style.setProperty('display', 'none', 'important');
        }

        document.body.style.setProperty('overflow', 'auto', 'important');
        document.documentElement.style.setProperty('overflow', 'auto', 'important');
    }

    // --- Lógica de Ejecución y Observación ---

    // 1. Añadir reglas CSS globales para ocultar los popups de forma persistente
    // y asegurar que el scroll siempre funcione.
    function addGlobalCSSRules() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            /* Ocultar los popups de información/descarga */
            .el-popper.tooltip-popper-class,
            .dialog-container.default-modal {
                display: none !important;
            }
            /* Asegurar que el scroll siempre funcione */
            body, html {
                overflow: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
    addGlobalCSSRules();

    // 2. Ejecutar las modificaciones iniciales y ocultar popups al cargar la página
    applyModifications();
    hideSpecificPopupsAndRestoreScroll();

    // 3. Observar cambios en el DOM para manejar contenido cargado dinámicamente y nuevos popups
    const observer = new MutationObserver((mutationsList, observer) => {
        let needsModifications = false;
        let needsPopupHiding = false;

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Solo si es un elemento HTML
                        if (node.classList.contains('emojiwrapper-list-tool') || node.querySelector('.emojiwrapper-list-tool__wrapper')) {
                            needsModifications = true;
                        }
                        if (node.classList.contains('el-popper') || node.classList.contains('dialog-container')) {
                             needsPopupHiding = true;
                        }
                    }
                });
            } else if (mutation.type === 'attributes' && (mutation.target === document.body || mutation.target === document.documentElement) && mutation.attributeName === 'style') {
                if (mutation.target.style.overflow === 'hidden') {
                    needsPopupHiding = true;
                }
            }
        }

        if (needsModifications) {
            applyModifications();
        }
        if (needsPopupHiding) {
            hideSpecificPopupsAndRestoreScroll();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

})();