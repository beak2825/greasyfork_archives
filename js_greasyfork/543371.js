// ==UserScript==
// @name           RedDragon Wings.io - Advanced Mod Menu
// @namespace      https://youtube.com/@x-RedDragonYT
// @version        4.5
// @description    Enhance your Wings.io experience with an advanced mod menu featuring auto respawn, real-time FPS & Ping display, performance optimization (FPS+ mode), screen recording, and an integrated AdBlocker for seamless gameplay.
// @match          *://wings.io/*
// @icon           https://i.postimg.cc/rFBT1m44/DALL-E-2025-03-01-16-29-55-A-futuristic-cyberpunk-style-logo-for-a-Mod-Menu-Client-The-icon-feat.webp
// @author         Mega Hacker (Mega Hacker)
// @license        MIT
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543371/RedDragon%20Wingsio%20-%20Advanced%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/543371/RedDragon%20Wingsio%20-%20Advanced%20Mod%20Menu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isMenuOpen = false;
    let isAutoRespawnActive = false;
    let autoRespawnInterval;
    let isFPSPlusActive = false;
    let mediaRecorder;
    let recordedChunks = [];
    let isRecording = false;

    // Utility function to create a switch element
    function createSwitch(labelText, onChange) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginBottom = '10px';

        const label = document.createElement('span');
        label.textContent = labelText;
        label.style.flex = '1';
        label.style.color = 'white';

        const switchContainer = document.createElement('label');
        switchContainer.style.position = 'relative';
        switchContainer.style.display = 'inline-block';
        switchContainer.style.width = '34px';
        switchContainer.style.height = '20px';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.style.opacity = '0';
        input.style.width = '0';
        input.style.height = '0';

        const slider = document.createElement('span');
        slider.style.position = 'absolute';
        slider.style.cursor = 'pointer';
        slider.style.top = '0';
        slider.style.left = '0';
        slider.style.right = '0';
        slider.style.bottom = '0';
        slider.style.backgroundColor = '#ccc';
        slider.style.transition = '0.4s';
        slider.style.borderRadius = '20px';

        const knob = document.createElement('span');
        knob.style.position = 'absolute';
        knob.style.height = '14px';
        knob.style.width = '14px';
        knob.style.left = '3px';
        knob.style.bottom = '3px';
        knob.style.backgroundColor = 'white';
        knob.style.transition = '0.4s';
        knob.style.borderRadius = '50%';

        slider.appendChild(knob);
        switchContainer.appendChild(input);
        switchContainer.appendChild(slider);
        container.appendChild(label);
        container.appendChild(switchContainer);

        input.addEventListener('change', (e) => {
            knob.style.transform = e.target.checked ? 'translateX(14px)' : 'translateX(0)';
            slider.style.backgroundColor = e.target.checked ? '#4CAF50' : '#ccc';
            onChange(e.target.checked);
        });

        return container;
    }

    // Function to toggle auto respawn
    function toggleAutoRespawn(active) {
        isAutoRespawnActive = active;
        if (isAutoRespawnActive) {
            autoRespawnInterval = setInterval(() => {
                const playButton = document.querySelector("#playButton");
                const nickInput = document.getElementById('nick');
                if (playButton && nickInput && nickInput.value) {
                    playButton.click();
                }
            }, 200);
        } else {
            clearInterval(autoRespawnInterval);
        }
    }

// Function to toggle FPS and Ping display with real data
function toggleFPSPing(active) {
    const existingDisplay = document.getElementById('fpsPingDisplay');

    if (!active && existingDisplay) {
        existingDisplay.remove();
        return;
    }

    if (active && !existingDisplay) {
        // Crear el contenedor de estadísticas
        const display = document.createElement('div');
        display.id = 'fpsPingDisplay';
        display.style.position = 'fixed';
        display.style.top = '10px';
        display.style.left = '50%';
        display.style.transform = 'translateX(-50%)';
        display.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        display.style.color = 'white';
        display.style.padding = '8px 12px';
        display.style.borderRadius = '5px';
        display.style.zIndex = '10000';
        display.style.fontFamily = 'Courier New, monospace';
        display.style.fontSize = '14px';
        display.style.fontWeight = 'bold';
        display.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(display);

        // Variables para FPS y Ping
        let fps = 0, ping = 0;
        let frameCount = 0;
        let lastTime = performance.now();
        let pingTimes = [];

        // Función optimizada para calcular FPS
        function updateFPS() {
            const now = performance.now();
            frameCount++;

            if (now - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (now - lastTime));
                frameCount = 0;
                lastTime = now;
            }

            requestAnimationFrame(updateFPS);
        }
        updateFPS();

        // Función optimizada para calcular el Ping con múltiples mediciones
        function updatePing() {
            const startTime = performance.now();

            fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
                .then(() => {
                    const latency = Math.round(performance.now() - startTime);
                    pingTimes.push(latency);

                    if (pingTimes.length > 10) pingTimes.shift();
                    ping = Math.round(pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length);
                })
                .catch(() => {
                    ping = 'N/A';
                });

            setTimeout(updatePing, 500);
        }
        updatePing();

        // Actualización de la UI en tiempo real
        function updateStats() {
            display.textContent = `FPS: ${fps} | Ping: ${ping}ms`;
            setTimeout(updateStats, 250);
        }
        updateStats();
    }
}

 // Function to toggle FPS+ mode (Performance Boost)
function toggleFPSPlus(active) {
    isFPSPlusActive = active;

    if (isFPSPlusActive) {
        console.log("⚡ FPS+ Mode Activated");

        // Reduce unnecessary rendering and background tasks
        document.body.style.backgroundColor = '#111'; // Darker BG for better contrast & less strain
        document.body.style.overflow = 'hidden'; // Hide overflowing elements to boost performance
        document.body.style.imageRendering = 'pixelated'; // Improve rendering speed

        // Disable heavy animations & transitions
        const styles = document.createElement('style');
        styles.id = 'fpsPlusStyles';
        styles.innerHTML = `
            * {
                transition: none !important;
                animation: none !important;
                filter: none !important;
            }
            canvas {
                image-rendering: optimizeSpeed !important;
            }
        `;
        document.head.appendChild(styles);

        // Optimize canvas for better FPS
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.willChange = 'transform';
            canvas.style.imageRendering = 'pixelated';
        }

        // Lower frame rate limit (optional, adjust if needed)
        let lastFrameTime = performance.now();
        function fpsLimiter() {
            let now = performance.now();
            if (now - lastFrameTime > 16) { // Aim for 60 FPS (1000ms / 60fps = ~16ms per frame)
                lastFrameTime = now;
                requestAnimationFrame(fpsLimiter);
            }
        }
        requestAnimationFrame(fpsLimiter);

    } else {
        console.log("❌ FPS+ Mode Deactivated");

        // Restore original settings
        document.body.style.backgroundColor = '';
        document.body.style.overflow = '';
        document.body.style.imageRendering = '';

        // Remove performance styles
        const styles = document.getElementById('fpsPlusStyles');
        if (styles) styles.remove();
    }
}

    // Function to start/stop screen recording
    function toggleScreenRecording(active) {
        if (active && !isRecording) {
            navigator.mediaDevices.getDisplayMedia({ video: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (e) => {
                        recordedChunks.push(e.data);
                    };
                    mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunks, { type: 'video/webm' });
                        const videoUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = videoUrl;
                        link.download = 'screen-recording.webm';
                        link.click();
                    };
                    mediaRecorder.start();
                    isRecording = true;
                })
                .catch(err => console.error('Error starting screen recording: ', err));
        } else if (isRecording) {
            mediaRecorder.stop();
            isRecording = false;
        }
    }

    // Additional decorative and functional elements
    function addDecorativeFeatures() {
        const footer = document.createElement('div');
        footer.textContent = 'Mod Menu v4.5 | Powered by wings.io';
        footer.style.position = 'fixed';
        footer.style.bottom = '10px';
        footer.style.left = '10px';
        footer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        footer.style.color = 'white';
        footer.style.padding = '5px 10px';
        footer.style.borderRadius = '5px';
        footer.style.fontSize = '12px';
        footer.style.zIndex = '1000';
        document.body.appendChild(footer);
    }

    // Create draggable circle
const circle = document.createElement('div');
circle.id = 'modMenuCircle';
circle.style.width = '40px'; // Tamaño más pequeño
circle.style.height = '40px';
circle.style.position = 'fixed';
circle.style.bottom = '10px';
circle.style.right = '10px';
circle.style.borderRadius = '50%';
circle.style.cursor = 'pointer';
circle.style.zIndex = '1000';
circle.style.transition = 'background-color 0.5s, border-color 0.5s'; // Solo transición de color y borde, sin animaciones continuas

// Establece un color base para el círculo
circle.style.backgroundColor = 'red';
circle.style.border = '3px solid white';
circle.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.8)';

// Evento para cambiar color al pasar el ratón
circle.addEventListener('mouseenter', () => {
    circle.style.backgroundColor = 'orange';
    circle.style.borderColor = 'yellow';
    circle.style.boxShadow = '0px 0px 10px rgba(255, 165, 0, 0.8)';
});

circle.addEventListener('mouseleave', () => {
    circle.style.backgroundColor = 'red';
    circle.style.borderColor = 'white';
    circle.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.8)';
});

document.body.appendChild(circle);

    const letter = document.createElement('span');
letter.textContent = 'ℛ';
letter.style.position = 'absolute';
letter.style.top = '50%';
letter.style.left = '50%';
letter.style.transform = 'translate(-50%, -50%)';
letter.style.color = 'gold';
letter.style.fontSize = '20px';  // Ajusta el tamaño según sea necesario
letter.style.fontFamily = 'Arial, sans-serif';  // Ajusta la fuente si es necesario
letter.style.pointerEvents = 'none';  // Hace que no sea interactuable
letter.style.userSelect = 'none';  // Hace que no se pueda seleccionar

circle.appendChild(letter);

    let isDragging = false;
    let offsetX, offsetY;

    circle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - circle.getBoundingClientRect().left;
        offsetY = e.clientY - circle.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            circle.style.left = `${e.clientX - offsetX}px`;
            circle.style.top = `${e.clientY - offsetY}px`;
            circle.style.right = 'auto';
            circle.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Create the menu
    const menu = document.createElement('div');
    menu.id = 'modMenu';
    menu.style.display = 'none';
    menu.style.position = 'fixed';
    menu.style.backgroundColor = 'rgba(32, 32, 32, 0.95)';
    menu.style.color = 'white';
    menu.style.padding = '20px';
    menu.style.borderRadius = '10px';
    menu.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    menu.style.width = '300px';
    menu.style.zIndex = '1000';
    menu.style.fontFamily = 'Arial, sans-serif';

    const title = document.createElement('h3');
    title.textContent = 'Mod Menu';
    title.style.marginBottom = '20px';
    title.style.color = '#FFD700';
    title.style.textAlign = 'center';
    menu.appendChild(title);

    const autoRespawnSwitch = createSwitch('Auto Respawn', toggleAutoRespawn);
    const fpsPingSwitch = createSwitch('FPS & Ping', toggleFPSPing);
    const fpsPlusSwitch = createSwitch('FPS+', toggleFPSPlus);
    const screenRecordSwitch = createSwitch('Screen Recording', toggleScreenRecording);

    const adBlockSwitch = createSwitch('AdBlock', () => {
        (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = ('#slot-1 *, #slot-3 *, #slot-4 *, #ads *, #slot-2 *, #slot-1, #slot-3, #slot-4, #ads, #slot-2 { display: none !important; }');
        console.log('AdBlock is now active');
    });

    const openPageButton = document.createElement('button');
    openPageButton.textContent = 'Open YouTube Channel';
    openPageButton.style.display = 'block';
    openPageButton.style.marginTop = '10px';
    openPageButton.style.padding = '10px';
    openPageButton.style.backgroundColor = '#2196F3';
    openPageButton.style.color = 'white';
    openPageButton.style.border = 'none';
    openPageButton.style.borderRadius = '5px';
    openPageButton.style.cursor = 'pointer';
    openPageButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    openPageButton.addEventListener('click', () => {
        window.open('https://youtube.com/@RedDragon_esp', '_blank');
    });

    const minimizeButton = document.createElement('button');
    minimizeButton.textContent = 'Minimize';
    minimizeButton.style.display = 'block';
    minimizeButton.style.marginTop = '20px';
    minimizeButton.style.padding = '10px';
    minimizeButton.style.backgroundColor = '#ff5722';
    minimizeButton.style.color = 'white';
    minimizeButton.style.border = 'none';
    minimizeButton.style.borderRadius = '5px';
    minimizeButton.style.cursor = 'pointer';
    minimizeButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    minimizeButton.addEventListener('click', () => {
        menu.style.display = 'none';
        circle.style.display = 'block';
    });

    menu.appendChild(autoRespawnSwitch);
    menu.appendChild(fpsPingSwitch);
    menu.appendChild(fpsPlusSwitch);
    menu.appendChild(screenRecordSwitch);  // Agregada opción de grabación
    menu.appendChild(adBlockSwitch);
    menu.appendChild(openPageButton);
    menu.appendChild(minimizeButton);
    document.body.appendChild(menu);

    // Open menu with right-click
    circle.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        menu.style.display = 'block';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        circle.style.display = 'none';
    });

    addDecorativeFeatures();
})();
