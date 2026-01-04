// ==UserScript==
// @name         Perzonalizar columnas de videos y shorts en youtube.
// @name:en      Row Customizer for YouTube Feeds and Shorts
// @namespace    EterveNallo
// @version      1.1
// @description  Personaliza la cantidad de elementos por fila en el feed de YouTube y los shorts.
// @description:en  Customize the number of items per row in your YouTube feed and Shorts.
// @author       EterveNallo
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/534700/Perzonalizar%20columnas%20de%20videos%20y%20shorts%20en%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/534700/Perzonalizar%20columnas%20de%20videos%20y%20shorts%20en%20youtube.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Valores por defecto o cargados
    let configFeedEnabled = GM_getValue('configFeedEnabled', true);
    let feedCount = GM_getValue('feedCount', 4);
    let configShortsEnabled = GM_getValue('configShortsEnabled', true);
    let hideShorts = GM_getValue('hideShorts', false);
    let shortsCount = GM_getValue('shortsCount', 4);

    // Aplicar estilos CSS dinámicamente
    function applyStyles() {
        const style = document.createElement('style');
        style.id = 'custom-youtube-style';
        style.textContent = '';

        if (configFeedEnabled) {
            style.textContent += `
                ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer {
                    --ytd-rich-grid-items-per-row: ${feedCount} !important;
                }
            `;
        }

        if (configShortsEnabled) {
            style.textContent += `
                ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer {
                    --ytd-rich-grid-slim-items-per-row: ${shortsCount} !important;
                    --ytd-rich-grid-game-cards-per-row: ${shortsCount} !important;
                }
            `;
        }

        document.getElementById('custom-youtube-style')?.remove();
        document.head.appendChild(style);
    }

    // Aplicar cambios a los shorts
    function applyShortsBehavior() {
        if (!configShortsEnabled) return;

        const container = document.querySelector('#contents-container.ytd-rich-shelf-renderer');
        if (!container) return;

        const shorts = container.querySelectorAll('ytd-rich-item-renderer');
        let visibleCount = 0;

        shorts.forEach((short, index) => {
            if (hideShorts) {
                short.style.display = 'none';
                return;
            }

            short.style.display = '';
            if (visibleCount < shortsCount) {
                if (short.hasAttribute('hidden')) {
                    short.removeAttribute('hidden');
                    short.setAttribute('style', '');
                }
                visibleCount++;
            } else {
                short.setAttribute('hidden', '');
            }
        });
    }

    // Crear interfaz para Feed
    function createFeedUI() {
        closeAllUI();
        const container = document.createElement('div');
        container.id = 'feed-config-ui';
        container.style.cssText = uiStyle();
        container.innerHTML = `
            <h3>🧩 Configurar Feed</h3>
            <label><strong>¿Configurar?</strong>
                <select id="feed-enable">
                    <option value="true" ${configFeedEnabled ? 'selected' : ''}>Sí</option>
                    <option value="false" ${!configFeedEnabled ? 'selected' : ''}>No</option>
                </select>
            </label><br><br>
            <label><strong>🎚 Cantidad por fila:</strong><br>
                <input type="range" min="3" max="10" value="${feedCount}" id="feed-range">
                <span id="feed-range-value">${feedCount}</span>
            </label><br><br>
            <small>🔄 Recargue la página para aplicar cambios completos</small><br><br>
            <button id="close-feed-ui">Cerrar</button>
        `;
        document.body.appendChild(container);

        document.getElementById('feed-enable').addEventListener('change', (e) => {
            configFeedEnabled = e.target.value === 'true';
            GM_setValue('configFeedEnabled', configFeedEnabled);
            applyStyles();
        });

        document.getElementById('feed-range').addEventListener('input', (e) => {
            feedCount = parseInt(e.target.value);
            GM_setValue('feedCount', feedCount);
            document.getElementById('feed-range-value').innerText = feedCount;
            applyStyles();
        });

        document.getElementById('close-feed-ui').addEventListener('click', () => {
            closeAllUI();
        });
    }

    // Crear interfaz para Shorts
    function createShortsUI() {
        closeAllUI();
        const container = document.createElement('div');
        container.id = 'shorts-config-ui';
        container.style.cssText = uiStyle();
        container.innerHTML = `
            <h3>🎬 Configurar Shorts</h3>
            <label><strong>✔ Activar script:</strong>
                <input type="checkbox" id="shorts-toggle" ${configShortsEnabled ? 'checked' : ''}></label><br><br>

            <label><strong>🙈 Ocultar shorts:</strong>
                <select id="shorts-visibility">
                    <option value="visible" ${!hideShorts ? 'selected' : ''}>Visible</option>
                    <option value="hidden" ${hideShorts ? 'selected' : ''}>Oculto</option>
                </select><br><br>

            <label><strong>🎚 Shorts visibles:</strong><br>
                <input type="range" min="3" max="9" value="${shortsCount}" id="shorts-range">
                <span id="shorts-range-value">${shortsCount}</span>
            </label><br><br>
            <small>🔄 Recargue la página para aplicar cambios completos</small><br><br>
            <button id="close-shorts-ui">Cerrar</button>
        `;
        document.body.appendChild(container);

        document.getElementById('shorts-toggle').addEventListener('change', (e) => {
            configShortsEnabled = e.target.checked;
            GM_setValue('configShortsEnabled', configShortsEnabled);
            applyStyles();
            applyShortsBehavior();
        });

        document.getElementById('shorts-visibility').addEventListener('change', (e) => {
            hideShorts = e.target.value === 'hidden';
            GM_setValue('hideShorts', hideShorts);
            applyShortsBehavior();
        });

        document.getElementById('shorts-range').addEventListener('input', (e) => {
            shortsCount = parseInt(e.target.value);
            GM_setValue('shortsCount', shortsCount);
            document.getElementById('shorts-range-value').innerText = shortsCount;
            applyStyles();
            applyShortsBehavior();
        });

        document.getElementById('close-shorts-ui').addEventListener('click', () => {
            closeAllUI();
        });
    }

    // Estilo compartido
    function uiStyle() {
        return `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            background: #111;
            color: white;
            border: 2px solid #555;
            border-radius: 10px;
            padding: 15px;
            font-family: sans-serif;
            font-size: 14px;
            max-width: 240px;
        `;
    }

    // Cerrar interfaces
    function closeAllUI() {
        document.getElementById('feed-config-ui')?.remove();
        document.getElementById('shorts-config-ui')?.remove();
    }

    // Comandos del menú de Tampermonkey
    GM_registerMenuCommand("Configurar Feed - YouTube", createFeedUI);
    GM_registerMenuCommand("Configurar Shorts - YouTube", createShortsUI);

    // Activar estilos y comportamiento al cargar
    window.addEventListener('load', () => {
        applyStyles();
        applyShortsBehavior();
    });

    // Observer por si carga dinámica
    const observer = new MutationObserver(() => {
        applyShortsBehavior();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
