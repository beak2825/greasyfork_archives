// ==UserScript==
// @name         Amazon Sponsored Content Dimmer
// @namespace    https://greasyfork.org/users/
// @version      1.0
// @description  Oscurece parcialmente el contenido patrocinado en Amazon sin eliminarlo
// @author       Mauricio Bridge
// @license      MIT
// @match        *://www.amazon.com/*
// @match        *://www.amazon.co.jp/*
// @match        *://www.amazon.co.uk/*
// @match        *://www.amazon.de/*
// @match        *://www.amazon.es/*
// @match        *://www.amazon.fr/*
// @match        *://www.amazon.it/*
// @match        *://www.amazon.nl/*
// @match        *://www.amazon.ca/*
// @match        *://www.amazon.com.mx/*
// @match        *://www.amazon.com.br/*
// @match        *://www.amazon.com.au/*
// @match        *://www.amazon.cn/*
// @match        *://www.amazon.in/*
// @match        *://www.amazon.com.sg/*
// @match        *://www.amazon.com.tr/*
// @match        *://www.amazon.ae/*
// @match        *://smile.amazon.com/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/516175/Amazon%20Sponsored%20Content%20Dimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/516175/Amazon%20Sponsored%20Content%20Dimmer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos CSS para el oscurecimiento
    const styles = `
        .sponsored-content-dimmed {
            position: relative !important;
            pointer-events: auto !important;
        }

        .sponsored-content-dimmed::before {
            content: "Contenido Patrocinado";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 14px;
            text-align: center;
            cursor: pointer;
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        .sponsored-content-dimmed:hover::before {
            opacity: 0.3;
        }

        .sponsored-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #ff9900;
            color: black;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 1001;
            pointer-events: none;
        }
    `;

    // Agregar estilos al documento
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Palabras clave que indican contenido patrocinado
    const SPONSORED_KEYWORDS = [
        'sponsored',
        'patrocinado',
        'sponsorisé',
        'gesponsert',
        'スポンサー',
        '赞助'
    ];

    // Selectores específicos de anuncios
    const SPONSORED_SELECTORS = [
        '[data-component-type="sp-sponsored-result"]',
        '.AdHolder',
        '.sp_desktop_sponsored_label',
        '[data-cel-widget*="adplacements"]',
        '[class*="_adPlacements"]',
        '.celwidget .s-sponsored-info-icon'
    ];

    // Función para verificar si un elemento contiene texto patrocinado
    function containsSponsoredText(element) {
        const text = element.textContent.toLowerCase().trim();
        return SPONSORED_KEYWORDS.some(keyword => text.includes(keyword));
    }

    // Función para aplicar el efecto de oscurecimiento
    function dimElement(element) {
        if (element.classList.contains('sponsored-content-dimmed')) {
            return; // Ya está oscurecido
        }

        // Asegurar que el elemento tenga posición relativa para el posicionamiento absoluto
        element.style.position = 'relative';
        
        // Agregar clase para el oscurecimiento
        element.classList.add('sponsored-content-dimmed');
        
        // Agregar badge de patrocinado
        const badge = document.createElement('div');
        badge.className = 'sponsored-badge';
        badge.textContent = 'Sponsored';
        element.appendChild(badge);

        // Hacer que el contenido sea interactivo al hacer hover
        element.style.cursor = 'pointer';
    }

    // Función principal para procesar elementos
    function processSponsoredContent() {
        // Procesar por selectores específicos
        SPONSORED_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const productCard = element.closest('[data-asin]') || 
                                  element.closest('[data-component-type="s-search-result"]') ||
                                  element;
                if (productCard) {
                    dimElement(productCard);
                }
            });
        });

        // Procesar por texto
        document.querySelectorAll('span').forEach(span => {
            if (containsSponsoredText(span)) {
                const productCard = span.closest('[data-asin]') || 
                                  span.closest('[data-component-type="s-search-result"]');
                if (productCard) {
                    dimElement(productCard);
                }
            }
        });
    }

    // Crear y configurar el observador de mutaciones
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
            }
        });
        
        if (shouldProcess) {
            setTimeout(processSponsoredContent, 100);
        }
    });

    // Iniciar el observador
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Procesamiento inicial
    setTimeout(processSponsoredContent, 1000);

    // Ejecutar en eventos de carga
    window.addEventListener('load', processSponsoredContent);
    window.addEventListener('urlchange', processSponsoredContent);

    console.log('Amazon Sponsored Content Dimmer - Loaded Successfully');
})();