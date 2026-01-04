// ==UserScript==
// @name         Progress Bar and Quick Up and Down Buttons
// @name:pt-BR    BF - Barra de progressão e Botões de Subida e Decida Rápido
// @namespace    https://github.com/BrunoFortunatto
// @version      1.1
// @description [en] A modern scroll progress bar at the bottom of the screen and smart scroll-to-top/bottom buttons with improved dark mode support (SVG, discreet, SPA & mobile friendly).
// @description:pt-BR Adiciona uma barra de progresso de rolagem moderna na parte inferior da tela e botões de subir/descer inteligentes com suporte a modo escuro aprimorado (SVG, discretos, compatíveis com SPA e mobile).
// @author       Bruno Fortunato
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538583/Progress%20Bar%20and%20Quick%20Up%20and%20Down%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/538583/Progress%20Bar%20and%20Quick%20Up%20and%20Down%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // VERIFICAÇÃO PARA EVITAR IFRAMES
    if (window.self !== window.top) {
        // Se este script estiver rodando dentro de um iframe, ele para aqui.
        return;
    }

    const INACTIVITY_TIMEOUT = 2000; // Tempo em milissegundos (2 segundos) para esconder os botões
    const RIGHT_EDGE_THRESHOLD_PX = 100; // Distância da borda direita para ativar os botões no PC
    let inactivityTimer;
    let buttonContainer;
    let progressBar;

    // --- Funções Auxiliares para Controle de Tema ---

    function applyTheme(isDarkMode) {
        // Cores para os botões
        const lightButtonBg = 'rgba(0, 123, 255, 0.5)'; // Azul claro padrão
        const darkButtonBg = 'rgba(50, 50, 70, 0.7)';  // Cinza escuro para o modo escuro
        const lightButtonHoverBg = 'rgba(0, 123, 255, 0.9)'; // Azul mais forte no hover
        const darkButtonHoverBg = 'rgba(80, 80, 100, 0.9)'; // Cinza mais forte no hover
        const buttonShadow = '0 3px 6px rgba(0,0,0,0.4)'; // Sombra padrão para ambos (ajusta a opacidade para ser visível)
        const darkButtonShadow = '0 3px 10px rgba(0,0,0,0.6)'; // Sombra mais intensa no modo escuro para contraste

        // Cores para a barra de progresso
        const lightProgressBarBg = 'linear-gradient(to right, #007bff, #00c7ff, #007bff)'; // Gradiente azul padrão
        // Gradiente para modo escuro: Mantenho tons escuros no preenchimento mas adiciono um brilho mais evidente
        const darkProgressBarBg = 'linear-gradient(to right, #3498db, #4a69bd, #3498db)'; // Azul mais perceptível no escuro
        const lightProgressBarShadow = '0 -2px 10px rgba(0, 123, 255, 0.7)'; // Sombra azul brilhante padrão
        // Nova sombra para modo escuro: mais intensa e com brilho para "luz"
        const darkProgressBarShadow = '0 -2px 12px rgba(173, 216, 230, 0.8), 0 -0.5px 5px rgba(255, 255, 255, 0.3)'; // Brilho azul claro/branco

        const textColor = 'white'; // Cor do texto/ícones permanece branco

        if (buttonContainer) {
            buttonContainer.querySelectorAll('button').forEach(button => {
                button.style.backgroundColor = isDarkMode ? darkButtonBg : lightButtonBg;
                button.style.boxShadow = isDarkMode ? darkButtonShadow : buttonShadow; // Aplica a sombra específica do tema
                button.onmouseover = () => Object.assign(button.style, { backgroundColor: isDarkMode ? darkButtonHoverBg : lightButtonHoverBg, transform: 'scale(1.05)' });
                button.onmouseout = () => Object.assign(button.style, { backgroundColor: isDarkMode ? darkButtonBg : lightButtonBg, transform: 'scale(1)' });
                button.style.color = textColor;
            });
        }

        if (progressBar) {
            progressBar.style.background = isDarkMode ? darkProgressBarBg : lightProgressBarBg;
            progressBar.style.boxShadow = isDarkMode ? darkProgressBarShadow : lightProgressBarShadow;
        }
    }

    function detectAndApplyTheme() {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDarkMode);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectAndApplyTheme);

    // --- Funções Auxiliares para Controle dos Botões ---

    function hideButtons() {
        if (buttonContainer) {
            buttonContainer.style.opacity = '0';
            buttonContainer.style.pointerEvents = 'none';
        }
    }

    function showButtonsAndResetTimer() {
        const scrolledEnough = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
        const pageIsScrollable = document.body.scrollHeight > window.innerHeight;

        if (scrolledEnough && pageIsScrollable) {
            if (buttonContainer) {
                buttonContainer.style.opacity = '1';
                buttonContainer.style.pointerEvents = 'auto';
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(hideButtons, INACTIVITY_TIMEOUT);
            }
        } else {
            hideButtons();
            clearTimeout(inactivityTimer);
        }
    }

    // --- Funções para a Barra de Progresso e Rolagem ---

    function getScrollableElement() {
        return document.documentElement.scrollTop > 0 || document.documentElement.scrollHeight > document.documentElement.clientHeight ? document.documentElement : document.body;
    }

    function updateProgressBar() {
        const scrollElem = getScrollableElement();
        const scrollTop = scrollElem.scrollTop;
        const scrollHeight = scrollElem.scrollHeight;
        const clientHeight = scrollElem.clientHeight;

        const totalScrollableHeight = scrollHeight - clientHeight;
        let scrollProgress = 0;

        if (totalScrollableHeight > 0) {
            scrollProgress = (scrollTop / totalScrollableHeight) * 100;
            progressBar.style.width = scrollProgress + '%';
            progressBar.style.display = 'block';
        } else {
            progressBar.style.width = '0%';
            progressBar.style.display = 'none';
        }
    }

    // --- Inicialização dos Elementos (Botões e Barra de Progresso) ---

    function initializeScrollElements() {
        // --- Inicialização dos Botões ---
        if (buttonContainer && buttonContainer.parentNode) {
            buttonContainer.parentNode.removeChild(buttonContainer);
        }

        buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.right = '20px';
        buttonContainer.style.top = '50%';
        buttonContainer.style.transform = 'translateY(-50%)';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.opacity = '0';
        buttonContainer.style.transition = 'opacity 0.3s ease-in-out';
        buttonContainer.style.pointerEvents = 'none';

        document.body.appendChild(buttonContainer);

        const baseButtonStyle = {
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            // box-shadow será definido por applyTheme
            transition: 'background-color 0.2s ease, transform 0.2s ease',
        };

        const applyBaseStyle = (button) => Object.assign(button.style, baseButtonStyle);

        const topArrowSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="12 19 12 5"></polyline>
                <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
        `;

        const bottomArrowSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="12 5 12 19"></polyline>
                <polyline points="5 12 12 19 19 12"></polyline>
            </svg>
        `;

        const topButton = document.createElement('button');
        applyBaseStyle(topButton);
        topButton.innerHTML = topArrowSVG;
        topButton.onclick = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            showButtonsAndResetTimer();
        };
        buttonContainer.appendChild(topButton);

        const bottomButton = document.createElement('button');
        applyBaseStyle(bottomButton);
        bottomButton.innerHTML = bottomArrowSVG;
        bottomButton.onclick = () => {
            const scrollElem = getScrollableElement();
            const totalHeight = scrollElem.scrollHeight - scrollElem.clientHeight;
            window.scrollTo({
                top: totalHeight,
                behavior: 'smooth'
            });
            showButtonsAndResetTimer();
        };
        buttonContainer.appendChild(bottomButton);

        // --- Inicialização da Barra de Progresso ---
        if (progressBar && progressBar.parentNode) {
            progressBar.parentNode.removeChild(progressBar);
        }

        progressBar = document.createElement('div');
        progressBar.style.position = 'fixed';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '0%';
        progressBar.style.height = '5px';
        progressBar.style.zIndex = '10000';
        progressBar.style.transition = 'width 0.2s ease-out';
        progressBar.style.display = 'none';
        document.body.appendChild(progressBar);

        // --- Aplica o tema inicial ---
        detectAndApplyTheme();

        // --- Eventos para mostrar/esconder os botões e atualizar a barra de progresso ---

        window.onscroll = () => {
            showButtonsAndResetTimer();
            updateProgressBar();
        };

        document.onmousemove = (event) => {
            if (event.clientX > (window.innerWidth - RIGHT_EDGE_THRESHOLD_PX)) {
                showButtonsAndResetTimer();
            }
        };

        document.addEventListener('touchstart', showButtonsAndResetTimer, { passive: true });
        document.addEventListener('touchmove', showButtonsAndResetTimer, { passive: true });

        // --- Observador de Mutação para SPAs (detecta mudanças no DOM) ---
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    showButtonsAndResetTimer();
                    updateProgressBar();
                    detectAndApplyTheme(); // Reaplicar tema em SPAs que mudam muito o DOM
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // --- Intercepta a API de Histórico para SPAs (detecta mudanças de URL sem reload) ---
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(this, arguments);
            showButtonsAndResetTimer();
            updateProgressBar();
            detectAndApplyTheme(); // Reaplicar tema em SPAs
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            showButtonsAndResetTimer();
            updateProgressBar();
            detectAndApplyTheme(); // Reaplicar tema em SPAs
        };

        // Garante que os elementos apareçam/desapareçam/atualizem corretamente na carga inicial
        window.addEventListener('load', () => {
            showButtonsAndResetTimer();
            updateProgressBar();
            detectAndApplyTheme();
        });
        window.addEventListener('DOMContentLoaded', () => {
            showButtonsAndResetTimer();
            updateProgressBar();
            detectAndApplyTheme();
        });
    }

    // Inicializa todos os elementos quando o script é carregado
    initializeScrollElements();

})();