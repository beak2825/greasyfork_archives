// ==UserScript==
// @name         Custom Token Rain with Spinner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click button to start token rain with your chosen token image, bigger and spinning!
// @author       ChatGPT
// @match        *://blacket.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538508/Custom%20Token%20Rain%20with%20Spinner.user.js
// @updateURL https://update.greasyfork.org/scripts/538508/Custom%20Token%20Rain%20with%20Spinner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Container to hold drag bar + button
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '999999';
    container.style.userSelect = 'none';
    container.style.width = 'max-content';
    container.style.cursor = 'default';

    // Drag bar
    const dragBar = document.createElement('div');
    dragBar.textContent = '☰ Drag Here';
    dragBar.style.background = '#444';
    dragBar.style.color = 'white';
    dragBar.style.padding = '4px 10px';
    dragBar.style.borderTopLeftRadius = '6px';
    dragBar.style.borderTopRightRadius = '6px';
    dragBar.style.fontSize = '12px';
    dragBar.style.fontWeight = 'bold';
    dragBar.style.textAlign = 'center';
    dragBar.style.cursor = 'grab';
    dragBar.style.userSelect = 'none';

    // Button
    const btn = document.createElement('button');
    btn.textContent = 'Start Custom Token Rain';
    btn.style.padding = '8px 12px';
    btn.style.background = '#222';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderBottomLeftRadius = '6px';
    btn.style.borderBottomRightRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.userSelect = 'none';
    btn.style.transition = 'background 0.3s';
    btn.style.display = 'block';
    btn.style.width = '100%';

    container.appendChild(dragBar);
    container.appendChild(btn);
    document.body.appendChild(container);

    let tokenRainContainer = null;
    let spawnInterval = null;
    let raining = false;

    // Add CSS for spinning and falling tokens
    const styleId = 'customTokenRainStyle';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes fallspin {
                0% { transform: translateY(0) rotate(0deg); }
                100% { transform: translateY(100vh) rotate(360deg); }
            }
            .token-rain-token {
                position: absolute;
                width: 48px !important;
                height: 48px !important;
                pointer-events: none;
                animation: fallspin 4s linear forwards;
            }
        `;
        document.head.appendChild(style);
    }

    function startTokenRain(imgSrc) {
        if (tokenRainContainer) {
            tokenRainContainer.remove();
            tokenRainContainer = null;
        }
        if (spawnInterval) {
            clearInterval(spawnInterval);
            spawnInterval = null;
        }

        tokenRainContainer = document.createElement('div');
        tokenRainContainer.style.position = 'fixed';
        tokenRainContainer.style.top = '0';
        tokenRainContainer.style.left = '0';
        tokenRainContainer.style.width = '100vw';
        tokenRainContainer.style.height = '100vh';
        tokenRainContainer.style.pointerEvents = 'none';
        tokenRainContainer.style.zIndex = '999998';
        document.body.appendChild(tokenRainContainer);

        spawnInterval = setInterval(() => {
            const token = document.createElement('img');
            token.src = imgSrc;
            token.className = 'token-rain-token';

            token.style.left = Math.random() * (window.innerWidth - 48) + 'px';
            token.style.top = '-50px';

            token.addEventListener('animationend', () => token.remove());

            tokenRainContainer.appendChild(token);
        }, 150);
    }

    function stopTokenRain() {
        if (spawnInterval) {
            clearInterval(spawnInterval);
            spawnInterval = null;
        }
        if (tokenRainContainer) {
            tokenRainContainer.remove();
            tokenRainContainer = null;
        }
    }

    btn.addEventListener('click', () => {
        if (!raining) {
            const url = prompt('Enter the URL of the token image you want to use:', 'https://blacket.org/content/tokenIcon.webp');
            if (url && url.trim() !== '') {
                startTokenRain(url.trim());
                btn.textContent = 'Stop Token Rain';
                btn.style.background = '#b22222';
                raining = true;
            }
        } else {
            stopTokenRain();
            btn.textContent = 'Start Custom Token Rain';
            btn.style.background = '#222';
            raining = false;
        }
    });

    // Make the container draggable by dragBar only
    let isDragging = false;
    let dragStartX, dragStartY;
    let containerStartX, containerStartY;

    dragBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        const rect = container.getBoundingClientRect();
        containerStartX = rect.left;
        containerStartY = rect.top;

        dragBar.style.cursor = 'grabbing';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = containerStartX + (e.clientX - dragStartX);
        let newY = containerStartY + (e.clientY - dragStartY);

        // Keep container inside viewport
        newX = Math.min(window.innerWidth - container.offsetWidth, Math.max(0, newX));
        newY = Math.min(window.innerHeight - container.offsetHeight, Math.max(0, newY));

        container.style.left = newX + 'px';
        container.style.top = newY + 'px';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
        container.style.position = 'fixed';
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dragBar.style.cursor = 'grab';
        }
    });
})();
