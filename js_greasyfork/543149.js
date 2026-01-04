// ==UserScript==
// @name         Scroll Helper Pro - Controles Inteligentes, Zoom, Ocultar, Auto-Scroll e Mais
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Melhore sua navegação com atalhos, zoom, rolagem automática, controles ajustáveis e interface limpa e responsiva.
// @author       Xxandy
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543149/Scroll%20Helper%20Pro%20-%20Controles%20Inteligentes%2C%20Zoom%2C%20Ocultar%2C%20Auto-Scroll%20e%20Mais.user.js
// @updateURL https://update.greasyfork.org/scripts/543149/Scroll%20Helper%20Pro%20-%20Controles%20Inteligentes%2C%20Zoom%2C%20Ocultar%2C%20Auto-Scroll%20e%20Mais.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configurações ---
    const SCROLL_AMOUNT = 100;
    let autoScrollInterval = null;
    let autoScrollDirection = 1;
    let autoScrollStep = parseInt(localStorage.getItem('autoScrollStep')) || 30;
    let controlsOpacity = parseFloat(localStorage.getItem('controlsOpacity')) || 0.65;
    let controlsVisible = localStorage.getItem('controlsVisible') !== 'false';
    let zoomLevel = parseFloat(localStorage.getItem('zoomLevel')) || 1;

    const fixedInterval = 10;

    // --- Funções de rolagem ---
    function scrollDown() { window.scrollBy({ top: SCROLL_AMOUNT, behavior: 'smooth' }); }
    function scrollUp() { window.scrollBy({ top: -SCROLL_AMOUNT, behavior: 'smooth' }); }
    function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }
    function scrollLeft() { window.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' }); }
    function scrollRight() { window.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' }); }

    function zoomIn() {
        zoomLevel += 0.1;
        document.body.style.zoom = zoomLevel.toFixed(2);
        localStorage.setItem('zoomLevel', zoomLevel);
    }

    function zoomOut() {
        zoomLevel -= 0.1;
        document.body.style.zoom = zoomLevel.toFixed(2);
        localStorage.setItem('zoomLevel', zoomLevel);
    }

    // --- Atalhos de teclado ---
    function handleKeyDown(e) {
        if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") scrollDown();
        if (e.key === "ArrowUp"   || e.key === "w" || e.key === "W") scrollUp();
        if (e.key === "End") scrollToBottom();
        if (e.key === "Home") scrollToTop();

        if (e.key === "+" || e.key === "=") zoomIn();
        if (e.key === "-" || e.key === "_") zoomOut();

        if (e.altKey && e.key === "a") scrollLeft();
        if (e.altKey && e.key === "d") scrollRight();

        if ((e.key === "a" || e.key === "A") && !e.shiftKey) toggleAutoScroll(1);
        if ((e.key === "a" || e.key === "A") && e.shiftKey) toggleAutoScroll(-1);
    }
    window.addEventListener('keydown', handleKeyDown);

    // --- Painel de Controle ---
    const panel = document.createElement('div');
    panel.id = 'scroll-controls-panel';
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        display: ${controlsVisible ? 'flex' : 'none'};
        flex-direction: column;
        gap: 8px;
        opacity: ${controlsOpacity};
        transition: opacity 0.3s ease;
        user-select: none;
        font-family: Arial, sans-serif;
        background-color: #222;
        border-radius: 8px;
        padding: 10px;
        width: max-content;
        max-width: 90vw;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(document.body.insertBefore(panel, document.body.firstChild));

    // --- Botões Estilizados ---
    function createButton(text, onClick, title = '') {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.title = title;
        btn.style.cssText = `
            padding: 6px 8px;
            font-size: 16px;
            background: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        `;
        btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '0.8');
        btn.addEventListener('click', onClick);
        return btn;
    }

    // Linha principal de botões
    const rowMain = document.createElement('div');
    rowMain.style.display = 'flex';
    rowMain.style.gap = '6px';

    rowMain.appendChild(createButton('⏫', scrollToTop, 'Ir ao topo'));
    rowMain.appendChild(createButton('⬆️', scrollUp, 'Rolar para cima'));
    rowMain.appendChild(createButton('⬇️', scrollDown, 'Rolar para baixo'));
    rowMain.appendChild(createButton('⏬', scrollToBottom, 'Ir ao final'));
    rowMain.appendChild(createButton('▶️', () => toggleAutoScroll(1), 'Rolagem automática'));
    rowMain.appendChild(createButton('⮝', () => toggleAutoScroll(-1), 'Rolagem automática para cima'));
    rowMain.appendChild(createButton('🙈', () => {
        controlsVisible = !controlsVisible;
        panel.style.display = controlsVisible ? 'flex' : 'none';
        toggleBtn.textContent = controlsVisible ? '🙈' : '🐵';
        localStorage.setItem('controlsVisible', controlsVisible);
    }, 'Ocultar/Mostrar painel'));

    panel.appendChild(rowMain);

    // Mostrar porcentagem de rolagem
    const percentDisplay = document.createElement('div');
    percentDisplay.style.color = '#fff';
    percentDisplay.style.fontSize = '12px';
    percentDisplay.style.textAlign = 'center';
    percentDisplay.textContent = '0%';
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        const percent = Math.round((scrollTop / scrollHeight) * 100);
        percentDisplay.textContent = `${percent}%`;
    });
    panel.appendChild(percentDisplay);

    // Controles secundários
    const rowSettings = document.createElement('div');
    rowSettings.style.display = 'flex';
    rowSettings.style.flexWrap = 'wrap';
    rowSettings.style.gap = '10px';
    rowSettings.style.justifyContent = 'space-between';
    rowSettings.style.width = '100%';

    // Velocidade
    const speedContainer = document.createElement('div');
    speedContainer.style.flex = '1';
    speedContainer.style.minWidth = '120px';
    speedContainer.innerHTML = `<label style="font-size:12px;color:white;">Velocidade</label>`;
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '5';
    speedSlider.max = '100';
    speedSlider.value = autoScrollStep;
    speedSlider.style.width = '100%';
    speedSlider.addEventListener('input', () => {
        autoScrollStep = Number(speedSlider.value);
        if (autoScrollInterval) {
            stopAutoScroll();
            startAutoScroll(autoScrollDirection);
        }
    });
    speedContainer.appendChild(speedSlider);
    rowSettings.appendChild(speedContainer);

    // Opacidade
    const opacityContainer = document.createElement('div');
    opacityContainer.style.flex = '1';
    opacityContainer.style.minWidth = '120px';
    opacityContainer.innerHTML = `<label style="font-size:12px;color:white;">Opacidade</label>`;
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0.1';
    opacitySlider.max = '1';
    opacitySlider.step = '0.05';
    opacitySlider.value = controlsOpacity;
    opacitySlider.style.width = '100%';
    opacitySlider.addEventListener('input', () => {
        controlsOpacity = Number(opacitySlider.value);
        panel.style.opacity = controlsOpacity;
        localStorage.setItem('controlsOpacity', controlsOpacity);
    });
    opacityContainer.appendChild(opacitySlider);
    rowSettings.appendChild(opacityContainer);

    panel.appendChild(rowSettings);

    // Botão de zoom
    const rowZoom = document.createElement('div');
    rowZoom.style.display = 'flex';
    rowZoom.style.gap = '6px';
    rowZoom.style.justifyContent = 'center';
    rowZoom.style.marginTop = '8px';

    rowZoom.appendChild(createButton('+', zoomIn, 'Zoom In'));
    rowZoom.appendChild(createButton('-', zoomOut, 'Zoom Out'));
    panel.appendChild(rowZoom);

    // --- Funções de rolagem automática ---
    function startAutoScroll(direction = 1) {
        if (autoScrollInterval) return;
        autoScrollDirection = direction;
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, autoScrollStep * direction);
            if ((direction === 1 && (window.innerHeight + window.scrollY) >= document.body.scrollHeight) ||
                (direction === -1 && window.scrollY === 0)) stopAutoScroll();
        }, fixedInterval);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }

    function toggleAutoScroll(direction = 1) {
        if (autoScrollInterval) stopAutoScroll();
        else startAutoScroll(direction);
    }

})();