// ==UserScript==
// @name         Amateur.tv Mostrar solo modelos de España
// @namespace    Violentmonkey Scripts
// @version      2.2
// @description  Filtra y muestra solo modelos de España en Amateur.tv con botón ON/OFF
// @author       Sergi0
// @match        https://es.amateur.tv/*
// @grant        none
// @icon         https://es.amateur.tv/favicon.ico
// @language     es
// @license      MIT
// @homepageURL  https://greasyfork.org/es/scripts/498257-amateur-tv-mostrar-solo-modelos-de-espa%C3%B1a
// @supportURL   https://greasyfork.org/es/scripts/498257-amateur-tv-mostrar-solo-modelos-de-espa%C3%B1a/feedback
// @downloadURL https://update.greasyfork.org/scripts/498257/Amateurtv%20Mostrar%20solo%20modelos%20de%20Espa%C3%B1a.user.js
// @updateURL https://update.greasyfork.org/scripts/498257/Amateurtv%20Mostrar%20solo%20modelos%20de%20Espa%C3%B1a.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        modoTratamiento: 2, // 1 = opacidad | 2 = ocultar
        excludedUrls: ['https://es.amateur.tv/privados', 'https://es.amateur.tv/siguiendo'],
        storageKey: 'amateur_tv_filter_enabled'
    };

    // Verificar que el script se ejecute solo en la ventana principal
    if (window.self !== window.top) return;

    // Estado del filtro (cargar desde localStorage)
    let filterEnabled = localStorage.getItem(CONFIG.storageKey) !== 'false'; // true por defecto

    // Crear botón de control
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = `<span>Filtro España: <strong>${filterEnabled ? 'ON' : 'OFF'}</strong></span>`;
    toggleButton.style.cssText = `
        position: fixed;
        bottom: 60px;
        right: 20px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        background: ${filterEnabled ? '#DE001A' : '#666'};
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease, opacity 0.5s ease, visibility 0.5s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.transform = 'scale(1.05)';
        toggleButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    });

    toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.transform = 'scale(1)';
        toggleButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });

    toggleButton.addEventListener('click', () => {
        filterEnabled = !filterEnabled;
        localStorage.setItem(CONFIG.storageKey, filterEnabled);
        toggleButton.querySelector('strong').textContent = filterEnabled ? 'ON' : 'OFF';
        toggleButton.style.background = filterEnabled ? '#DE001A' : '#666';
        applyFilter();
        updateInfoDiv();
    });

    document.body.appendChild(toggleButton);

    // Crear barra de información inferior
    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = `
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: #DE001A;
        color: white;
        font-weight: bold;
        text-align: center;
        padding: 10px;
        z-index: 9999;
        transform: translateY(100%);
        transition: transform 1.5s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.body.appendChild(infoDiv);

    let previousMessage = '';

    function isExcludedUrl() {
        const currentUrl = window.location.href;
        // Verificar URLs específicas excluidas
        if (CONFIG.excludedUrls.some(url => currentUrl.startsWith(url))) {
            return true;
        }
        // Verificar si estamos en página de modelo (no hay grid de modelos)
        const hasModelGrid = document.querySelector('[class*="gridCardContent"]');
        return !hasModelGrid;
    }

    function updateInfoDiv() {
        const excluded = isExcludedUrl();
        
        // Ocultar/mostrar botón según la página
        if (excluded) {
            toggleButton.style.opacity = '0';
            toggleButton.style.visibility = 'hidden';
            infoDiv.style.transform = 'translateY(100%)';
            return; // Salir sin actualizar mensaje
        } else {
            toggleButton.style.opacity = '1';
            toggleButton.style.visibility = 'visible';
        }
        
        let message;
        
        if (!filterEnabled) {
            message = 'Filtro desactivado - Mostrando modelos de <span style="color: #FDDB00;">todos los países</span>';
        } else {
            message = 'Mostrando solo modelos de <span style="color: #FDDB00;">España</span>';
        }

        if (message !== previousMessage) {
            infoDiv.style.transform = 'translateY(100%)';
            setTimeout(() => {
                infoDiv.innerHTML = message;
                infoDiv.style.transform = 'translateY(0)';
                previousMessage = message;
            }, 1500);
        } else {
            infoDiv.style.transform = 'translateY(0)';
        }
    }

    function applyFilter() {
        // Si el filtro está desactivado o estamos en URL excluida, mostrar todo
        if (!filterEnabled || isExcludedUrl()) {
            const allCards = document.querySelectorAll('[class*="gridCardContent"]');
            allCards.forEach(card => {
                const cardContainer = card.closest('.cardAmateurContent');
                if (cardContainer) {
                    cardContainer.style.display = '';
                }
                card.style.opacity = '1';
            });
            
            if (allCards.length === 0) {
                infoDiv.style.transform = 'translateY(100%)';
            }
            return;
        }

        // Seleccionar todas las cards excepto las de "Siguiendo"
        const modelCards = document.querySelectorAll('[class*="gridCardContent"]:not([data-testid="ti_newHomeTrending-following"] [class*="gridCardContent"])');

        if (modelCards.length === 0) {
            infoDiv.style.transform = 'translateY(100%)';
            return;
        }

        modelCards.forEach(card => {
            // Buscar el div con la clase que indica modelo española (usando selector parcial)
            const spainIcon = card.querySelector('[class*="contentSpainIcon"]');
            const isSpanish = spainIcon !== null;

            // Buscar el contenedor padre correcto (.cardAmateurContent)
            const cardContainer = card.closest('.cardAmateurContent');

            if (isSpanish) {
                if (cardContainer) {
                    cardContainer.style.display = '';
                }
                card.style.opacity = '1';
            } else {
                if (CONFIG.modoTratamiento === 1) {
                    if (cardContainer) {
                        cardContainer.style.display = '';
                    }
                    card.style.opacity = '0.5';
                } else if (CONFIG.modoTratamiento === 2) {
                    if (cardContainer) {
                        cardContainer.style.display = 'none';
                    }
                }
            }
        });
    }

    // Aplicar filtro cuando carga la página
    window.addEventListener('load', () => {
        applyFilter();
        updateInfoDiv();
    });

    // Observer para detectar cambios en el DOM
    const observer = new MutationObserver(() => {
        applyFilter();
        updateInfoDiv();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Detectar cambios de URL (SPA)
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            applyFilter();
            updateInfoDiv();
        }
    }, 1000);

    // Aplicar filtro inmediatamente
    applyFilter();
    updateInfoDiv();
})();