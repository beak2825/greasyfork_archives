// ==UserScript==
// @name         AI Studio - Ir al primer prompt de un chat
// @name:en      AI Studio - Go to the first prompt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade un botón flotante para ir al primer prompt en AI Studio
// @description:en Adds a floating button to go to the first prompt in AI Studio.
// @author       BambuSergio
// @match        https://aistudio.google.com/app/prompts/*
// @match        https://aistudio.google.com/prompts/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539415/AI%20Studio%20-%20Ir%20al%20primer%20prompt%20de%20un%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/539415/AI%20Studio%20-%20Ir%20al%20primer%20prompt%20de%20un%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para encontrar el contenedor principal de scroll
    function findScrollContainer() {
        // Priorizar contenedores específicos de AI Studio
        const prioritySelectors = [
            '.chat-view-container',
            '.chat-container',
            '.layout-main',
            'div[class*="chat-view-container"]',
            'div[class*="layout-main"]'
        ];

        for (let selector of prioritySelectors) {
            const container = document.querySelector(selector);
            if (container) {
                console.log('Contenedor de scroll encontrado:', selector, container);
                return container;
            }
        }

        return null;
    }

    // Función para hacer scroll al inicio
    function scrollToTop() {
        console.log('Iniciando scroll al inicio...');

        // Método 1: Buscar el contenedor específico de AI Studio
        const chatContainer = findScrollContainer();
        if (chatContainer) {
            console.log('Haciendo scroll en contenedor específico:', chatContainer);
            chatContainer.scrollTo({ top: 0, behavior: 'smooth' });
            chatContainer.scrollTop = 0;
        }

        // Método 2: Scroll en window y document
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.scrollTo({ top: 0, behavior: 'smooth' });

        // Método 3: Asegurar scroll directo
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            if (chatContainer) {
                chatContainer.scrollTop = 0;
            }
        }, 100);

        // Método 4: Intentar con todos los contenedores scrollables
        const scrollableElements = document.querySelectorAll('*');
        scrollableElements.forEach(el => {
            if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
                if (el.scrollTop > 0) {
                    console.log('Scroll detectado en:', el);
                    el.scrollTop = 0;
                }
            }
        });

        // Método 5: Simular Ctrl+Home
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Home',
                keyCode: 36,
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            }));
        }, 200);

        console.log('Todos los métodos de scroll aplicados');
    }

    // Función para crear el botón flotante
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑ Inicio';
        button.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 99999;
            background: #1976d2;
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            backdrop-filter: blur(10px);
        `;

        // Efectos hover
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.backgroundColor = '#1565c0';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '#1976d2';
        });

        // Funcionalidad del botón
        button.addEventListener('click', function() {
            console.log('Botón pulsado - iniciando scroll');

            scrollToTop();

            // Feedback visual
            this.innerHTML = '✓ ¡Arriba!';
            this.style.backgroundColor = '#4caf50';

            setTimeout(() => {
                this.innerHTML = '↑ Inicio';
                this.style.backgroundColor = '#1976d2';
            }, 1500);
        });

        return button;
    }

    // Función para detectar si hay scroll disponible
    function hasScrollableContent() {
        const body = document.body;
        const html = document.documentElement;
        const chatContainer = findScrollContainer();

        const bodyHasScroll = body.scrollHeight > body.clientHeight;
        const htmlHasScroll = html.scrollHeight > html.clientHeight;
        const chatHasScroll = chatContainer ? chatContainer.scrollHeight > chatContainer.clientHeight : false;
        const windowHasScroll = window.scrollY > 0;

        return bodyHasScroll || htmlHasScroll || chatHasScroll || windowHasScroll;
    }

    // Función para mostrar/ocultar el botón
    function toggleButtonVisibility(button) {
        const scrollTop = Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
        );

        const chatContainer = findScrollContainer();
        const chatScrollTop = chatContainer ? chatContainer.scrollTop : 0;

        const shouldShow = scrollTop > 100 || chatScrollTop > 100 || hasScrollableContent();

        if (shouldShow) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
            button.style.display = 'block';
        } else {
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'auto';
        }
    }

    // Función de observación mejorada
    function observeScrollChanges(button) {
        // Observar cambios en el scroll
        const checkScroll = () => toggleButtonVisibility(button);

        window.addEventListener('scroll', checkScroll, { passive: true });
        document.addEventListener('scroll', checkScroll, { passive: true });

        // Observar cambios en contenedores específicos
        const chatContainer = findScrollContainer();
        if (chatContainer) {
            chatContainer.addEventListener('scroll', checkScroll, { passive: true });
        }

        // Detectar cambios en el DOM
        const observer = new MutationObserver((mutations) => {
            let shouldRecheck = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldRecheck = true;
                }
            });

            if (shouldRecheck) {
                setTimeout(checkScroll, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        return observer;
    }

    // Inicializar el script
    function init() {
        // Esperar a que cargue la interfaz de AI Studio
        const initButton = () => {
            const button = createFloatingButton();
            button.id = 'ai-studio-scroll-button';
            document.body.appendChild(button);

            // Configurar visibilidad inicial
            toggleButtonVisibility(button);

            // Configurar observadores
            observeScrollChanges(button);

            console.log('AI Studio - Botón de scroll al inicio cargado y configurado');
        };

        // Intentar inicializar varias veces hasta que AI Studio esté completamente cargado
        let attempts = 0;
        const maxAttempts = 10;

        const tryInit = () => {
            attempts++;

            if (document.querySelector('.chat-container') || document.querySelector('.layout-main')) {
                initButton();
            } else if (attempts < maxAttempts) {
                setTimeout(tryInit, 1000);
            } else {
                // Fallback: inicializar de todos modos
                initButton();
            }
        };

        setTimeout(tryInit, 1000);
    }

    // Ejecutar cuando la página esté lista
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // También ejecutar después de un delay para asegurar que AI Studio haya cargado
    setTimeout(init, 3000);
})();