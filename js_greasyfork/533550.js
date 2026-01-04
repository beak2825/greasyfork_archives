// ==UserScript==
// @name         Hammer Senpa.io Mod - UI Tweaks & Enhancements v2.2
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  UI Enhancements for Senpa.io: Draggable UI, Optimization, FX, Blur, Freeze, and Help Button
// @author       Hammer
// @match        https://senpa.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533550/Hammer%20Senpaio%20Mod%20-%20UI%20Tweaks%20%20Enhancements%20v22.user.js
// @updateURL https://update.greasyfork.org/scripts/533550/Hammer%20Senpaio%20Mod%20-%20UI%20Tweaks%20%20Enhancements%20v22.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Global variables
    let optimizationEnabled = true;
    let fxOn = true;
    let isFrozen = false;
    let isBlurred = false;
    let isDragging = false;
    let offsetX, offsetY;

    // Default position (bottom-right corner)
    const defaultPosition = { top: 'auto', left: 'auto', bottom: '20px', right: '20px' };

    // Create the small GUI container (button to show/hide the menu)
    const smallGui = document.createElement('div');
    smallGui.id = 'small-gui';
    Object.assign(smallGui.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70px',
        height: '50px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        textAlign: 'center',
        fontSize: '14px',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: '9999',
        border: '2px solid red'
    });
    smallGui.innerText = 'Mods';
    document.body.appendChild(smallGui);

    // Create the GUI menu (hidden by default)
    const guiContainer = document.createElement('div');
    guiContainer.id = 'gui-container';
    Object.assign(guiContainer.style, {
        position: 'fixed',
        top: '60%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '250px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        zIndex: '9999',
        display: 'none',
        fontFamily: 'Arial, sans-serif',
        border: '2px solid red'
    });

    // Create the close button for the menu
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    Object.assign(closeButton.style, {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '5px',
        borderRadius: '50%',
        cursor: 'pointer',
        position: 'absolute',
        top: '10px',
        right: '10px'
    });
    closeButton.addEventListener('click', () => {
        guiContainer.style.display = 'none';
    });

    // Create the "made by hammer" text
    const hammerText = document.createElement('div');
    hammerText.innerText = 'made by hammer <3';
    Object.assign(hammerText.style, {
        color: '#fff',
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '20px',
        display: 'none'
    });

    // Function to create toggle buttons
    function createToggleButton(textOn, textOff, initialState, callback) {
        const btn = document.createElement('button');
        btn.innerText = initialState ? textOff : textOn;
        btn.style.backgroundColor = initialState ? '#28a745' : '#dc3545';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '10px';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.marginBottom = '10px';
        btn.addEventListener('click', () => {
            const newState = callback();
            btn.innerText = newState ? textOff : textOn;
            btn.style.backgroundColor = newState ? '#28a745' : '#dc3545';
        });
        return btn;
    }

    // Append elements to the GUI container
    guiContainer.appendChild(closeButton);
    guiContainer.appendChild(createToggleButton('Enable FPS Optimization', 'Disable FPS Optimization', optimizationEnabled, () => {
        optimizationEnabled = !optimizationEnabled;
        optimizationEnabled ? enableOptimization() : disableOptimization();
        return optimizationEnabled;
    }));
    guiContainer.appendChild(createToggleButton('Enable FX', 'Disable FX', fxOn, () => {
        fxOn = !fxOn;
        applyVisualEffects();
        return fxOn;
    }));
    guiContainer.appendChild(createToggleButton('Freeze on Death', 'Unfreeze on Death', isFrozen, () => {
        isFrozen = !isFrozen;
        return isFrozen;
    }));
    guiContainer.appendChild(createToggleButton('Enable Background Blur', 'Disable Background Blur', isBlurred, () => {
        isBlurred = !isBlurred;
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.filter = isBlurred ? 'blur(3px)' : 'none';
        }
        document.body.style.backdropFilter = isBlurred ? 'blur(2px)' : 'none';
        return isBlurred;
    }));
    guiContainer.appendChild(hammerText);
    document.body.appendChild(guiContainer);

    // Event to toggle the menu visibility
    smallGui.addEventListener('click', () => {
        const isHidden = guiContainer.style.display === 'none';
        guiContainer.style.display = isHidden ? 'block' : 'none';
        hammerText.style.display = isHidden ? 'block' : 'none';
    });

    // Draggable feature for the small GUI
    smallGui.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - parseInt(window.getComputedStyle(smallGui).left);
        offsetY = e.clientY - parseInt(window.getComputedStyle(smallGui).top);
        smallGui.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            smallGui.style.left = `${e.clientX - offsetX}px`;
            smallGui.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        smallGui.style.cursor = 'grab';
        savePosition();
    });

    // Save position of the small GUI box
    function savePosition() {
        localStorage.setItem('gui-position', JSON.stringify({
            left: smallGui.style.left,
            top: smallGui.style.top
        }));
    }

    // Restore position from localStorage or set default
    function restorePosition() {
        const position = JSON.parse(localStorage.getItem('gui-position'));
        if (position) {
            smallGui.style.left = position.left;
            smallGui.style.top = position.top;
        } else {
            smallGui.style.top = defaultPosition.top;
            smallGui.style.left = defaultPosition.left;
            smallGui.style.bottom = defaultPosition.bottom;
            smallGui.style.right = defaultPosition.right;
        }
    }

    // Apply visual effects like brightness, contrast, etc.
    function applyVisualEffects() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.filter = fxOn ? 'brightness(1.1) contrast(1.2) saturate(1.1)' : 'none';
        }
    }

    // Enable FPS optimization
    function enableOptimization() {
        document.body.style.backgroundImage = 'none';
        document.querySelectorAll('img').forEach(img => img.src = '');
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                animation: none !important;
                transition: none !important;
                box-shadow: none !important;
            }
            canvas {
                image-rendering: optimizeSpeed;
                will-change: transform;
            }
            body, html {
                background: #000 !important;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }
        `;
        document.head.appendChild(style);
        document.querySelectorAll('audio').forEach(audio => audio.pause());
        document.querySelectorAll('.ad, .sidebar, .popup').forEach(ad => ad.remove());
    }

    // Disable FPS optimization
    function disableOptimization() {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                animation: initial !important;
                transition: initial !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Freeze player on death (optional)
    function freezeOnDeath() {
        if (!isFrozen) return;
        const player = document.querySelector('.player');
        if (!player) return;

        isFrozen = true;
        const preventMovement = e => { e.preventDefault(); e.stopPropagation(); };

        document.addEventListener('keydown', preventMovement);
        document.addEventListener('mousemove', preventMovement);
        document.addEventListener('mousedown', preventMovement);

        setTimeout(() => {
            isFrozen = false;
            document.removeEventListener('keydown', preventMovement);
            document.removeEventListener('mousemove', preventMovement);
            document.removeEventListener('mousedown', preventMovement);
        }, 3000);
    }

    // Observer to reset position after death or when returning to the main menu
    const observer = new MutationObserver(() => {
        const middleAd = document.querySelector('.middle, .middle-panel, .ad-middle');
        if (middleAd) {
            middleAd.remove();
        }

        const inGame = document.querySelector('.player');
        if (inGame) {
            restorePosition();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Check for death/game start and adjust UI accordingly
    setInterval(() => {
        const deathState = document.querySelector('.dead');
        if (deathState && isFrozen) {
            freezeOnDeath();
        }
    }, 1000);

    // Apply optimization and visual effects on load
    if (optimizationEnabled) enableOptimization();
    if (fxOn) applyVisualEffects();
})();
