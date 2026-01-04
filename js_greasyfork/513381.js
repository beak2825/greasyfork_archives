// ==UserScript==
// @name         YouTube Live Chat in Fullscreen
// @namespace    https://greasyfork.org/en/users/781396
// @version      1.8
// @description  Display live chat while watching YouTube videos in fullscreen mode
// @author       YAD
// @license      MIT
// @icon         https://www.iconpacks.net/icons/1/free-icon-video-837.png
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513381/YouTube%20Live%20Chat%20in%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/513381/YouTube%20Live%20Chat%20in%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load settings from localStorage or set defaults
    let chatboxWidth = localStorage.getItem('chatboxWidth') || 350;
    let chatboxHeight = localStorage.getItem('chatboxHeight') || 600;
    let chatboxOpacity = localStorage.getItem('chatboxOpacity') || 0.65;
    let chatboxPosX = localStorage.getItem('chatboxPosX') || 420;
    let chatboxPosY = localStorage.getItem('chatboxPosY') || -320;
    let backgroundColor = localStorage.getItem('backgroundColor') || '#000000';
    let backgroundOpacity = localStorage.getItem('backgroundOpacity') || 0.5;

    // CSS styles for transparency
    function getStyles() {
        return `
            yt-live-chat-header-renderer,
            yt-live-chat-message-input-renderer,
            #container.yt-live-chat-restricted-participation-renderer,
            yt-live-chat-renderer {
                background: rgba(${hexToRgb(backgroundColor)}, ${backgroundOpacity}) !important; // Adjust background color
                overflow: hidden;
            }
            .draggable {
                cursor: move;
            }
        `;
    }

    // Convert hex color to RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }

    // Function to apply styles to the iframe document
    function applyStylesToIframe(iframeDoc) {
        const styleTag = iframeDoc.createElement('style');
        styleTag.textContent = getStyles();
        iframeDoc.head.appendChild(styleTag);
    }

    // Function to apply styles to the chatbox on load and fullscreen change
    function applyStyles() {
        const iframe = document.querySelector('iframe#chatframe');
        if (iframe) {
            setTimeout(() => {
                applyStylesToIframe(iframe.contentDocument || iframe.contentWindow.document);
            }, 2000); // Adding a 2secs delay to ensure the iframe loads
        }
    }

    // Create settings modal
    const settingsModal = document.createElement('div');
    settingsModal.style.position = 'fixed';
    settingsModal.style.top = '50%';
    settingsModal.style.left = '50%';
    settingsModal.style.transform = 'translate(-50%, -50%)';
    settingsModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    settingsModal.style.color = 'white';
    settingsModal.style.padding = '20px';
    settingsModal.style.borderRadius = '10px';
    settingsModal.style.zIndex = '10001';
    settingsModal.style.display = 'none';

    // Create the title
    const title = document.createElement('h3');
    title.innerText = 'Chatbox Settings';
    settingsModal.appendChild(title);

    // Create width input
    const widthLabel = document.createElement('label');
    widthLabel.innerText = 'Width: ';
    const widthInput = document.createElement('input');
    widthInput.type = 'number';
    widthInput.id = 'chatWidth';
    widthInput.value = chatboxWidth;
    widthInput.style.width = '80px';
    widthLabel.appendChild(widthInput);
    widthLabel.appendChild(document.createTextNode(' px'));
    settingsModal.appendChild(widthLabel);
    settingsModal.appendChild(document.createElement('br'));

    // Create height input
    const heightLabel = document.createElement('label');
    heightLabel.innerText = 'Height: ';
    const heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.id = 'chatHeight';
    heightInput.value = chatboxHeight;
    heightInput.style.width = '80px';
    heightLabel.appendChild(heightInput);
    heightLabel.appendChild(document.createTextNode(' px'));
    settingsModal.appendChild(heightLabel);
    settingsModal.appendChild(document.createElement('br'));

    // Create opacity slider
    const opacityLabel = document.createElement('label');
    opacityLabel.innerText = 'Chat Opacity: ';
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.id = 'chatOpacity';
    opacitySlider.min = '0';
    opacitySlider.max = '1';
    opacitySlider.step = '0.1';
    opacitySlider.value = chatboxOpacity;
    opacityLabel.appendChild(opacitySlider);
    settingsModal.appendChild(opacityLabel);
    settingsModal.appendChild(document.createElement('br'));

    // Create background color input
    const bgColorLabel = document.createElement('label');
    bgColorLabel.innerText = 'Background Color: ';
    const bgColorInput = document.createElement('input');
    bgColorInput.type = 'color';
    bgColorInput.value = backgroundColor;
    bgColorLabel.appendChild(bgColorInput);
    settingsModal.appendChild(bgColorLabel);
    settingsModal.appendChild(document.createElement('br'));

    // Create background opacity slider
    const bgOpacityLabel = document.createElement('label');
    bgOpacityLabel.innerText = 'Background Transparency: ';
    const bgOpacitySlider = document.createElement('input');
    bgOpacitySlider.type = 'range';
    bgOpacitySlider.id = 'bgOpacity';
    bgOpacitySlider.min = '0';
    bgOpacitySlider.max = '1';
    bgOpacitySlider.step = '0.1';
    bgOpacitySlider.value = backgroundOpacity;
    bgOpacityLabel.appendChild(bgOpacitySlider);
    settingsModal.appendChild(bgOpacityLabel);
    settingsModal.appendChild(document.createElement('br'));

    // Create X position slider
    const posXLabel = document.createElement('label');
    posXLabel.innerText = 'X Position: ';
    const posXSlider = document.createElement('input');
    posXSlider.type = 'range';
    posXSlider.id = 'chatPosX';
    posXSlider.min = `-${window.innerWidth}`;
    posXSlider.max = `${window.innerWidth}`;
    posXSlider.value = chatboxPosX;
    posXLabel.appendChild(posXSlider);
    settingsModal.appendChild(posXLabel);
    settingsModal.appendChild(document.createElement('br'));

    // Create Y position slider
    const posYLabel = document.createElement('label');
    posYLabel.innerText = 'Y Position: ';
    const posYSlider = document.createElement('input');
    posYSlider.type = 'range';
    posYSlider.id = 'chatPosY';
    posYSlider.min = `-${window.innerHeight}`;
    posYSlider.max = `${window.innerHeight}`;
    posYSlider.value = chatboxPosY;
    posYLabel.appendChild(posYSlider);
    settingsModal.appendChild(posYLabel);
    settingsModal.appendChild(document.createElement('br'));

    // Create apply button
    const applyButton = document.createElement('button');
    applyButton.innerText = 'Apply';
    applyButton.id = 'applySettings';
    settingsModal.appendChild(applyButton);

    // Create reset button
    const resetButton = document.createElement('button');
    resetButton.innerText = 'Reset';
    resetButton.id = 'resetSettings';
    settingsModal.appendChild(resetButton);

    document.body.appendChild(settingsModal);

    // Handle settings button click (open modal)
    const settingsButton = document.createElement('button');
    settingsButton.innerText = '⚙';
    settingsButton.style.position = 'fixed';
    settingsButton.style.top = '2%';
    settingsButton.style.right = '2%';
    settingsButton.style.zIndex = '10000';
    settingsButton.style.display = 'none';
    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    document.body.appendChild(settingsButton);

    // Update iframe settings in real-time
    function updateChatbox() {
        const iframe = document.querySelector('iframe#chatframe');
        if (iframe) {
            iframe.style.width = `${chatboxWidth}px`;
            iframe.style.height = `${chatboxHeight}px`;
            iframe.style.position = 'fixed';
            iframe.style.left = `${(window.innerWidth / 2) + parseInt(chatboxPosX)}px`;
            iframe.style.top = `${(window.innerHeight / 2) + parseInt(chatboxPosY)}px`;
            iframe.style.opacity = chatboxOpacity;
            iframe.style.borderRadius = '12px';
            applyStyles();
        }
    }

    // Handle apply button click
    applyButton.addEventListener('click', () => {
        // Update settings
        chatboxWidth = widthInput.value;
        chatboxHeight = heightInput.value;
        chatboxOpacity = opacitySlider.value;
        backgroundColor = bgColorInput.value;
        backgroundOpacity = bgOpacitySlider.value;
        chatboxPosX = posXSlider.value;
        chatboxPosY = posYSlider.value;

        // Save settings to localStorage
        localStorage.setItem('chatboxWidth', chatboxWidth);
        localStorage.setItem('chatboxHeight', chatboxHeight);
        localStorage.setItem('chatboxOpacity', chatboxOpacity);
        localStorage.setItem('backgroundColor', backgroundColor);
        localStorage.setItem('backgroundOpacity', backgroundOpacity);
        localStorage.setItem('chatboxPosX', chatboxPosX);
        localStorage.setItem('chatboxPosY', chatboxPosY);

        settingsModal.style.display = 'none';
        updateChatbox();
    });

    // Handle reset settings
    resetButton.addEventListener('click', () => {
        localStorage.removeItem('chatboxWidth');
        localStorage.removeItem('chatboxHeight');
        localStorage.removeItem('chatboxOpacity');
        localStorage.removeItem('backgroundColor');
        localStorage.removeItem('backgroundOpacity');
        localStorage.removeItem('chatboxPosX');
        localStorage.removeItem('chatboxPosY');

        // Reset to defaults
        chatboxWidth = 350;
        chatboxHeight = 600;
        chatboxOpacity = 0.65;
        backgroundColor = '#000000';
        backgroundOpacity = 0.5;
        chatboxPosX = 420;
        chatboxPosY = -320;

        // Update UI elements
        widthInput.value = chatboxWidth;
        heightInput.value = chatboxHeight;
        opacitySlider.value = chatboxOpacity;
        bgColorInput.value = backgroundColor;
        bgOpacitySlider.value = backgroundOpacity;
        posXSlider.value = chatboxPosX;
        posYSlider.value = chatboxPosY;

        updateChatbox(); // Apply reset settings
    });

    // Handle slider inputs for real-time updates
    opacitySlider.addEventListener('input', () => {
        chatboxOpacity = opacitySlider.value;
        updateChatbox();
    });

    bgOpacitySlider.addEventListener('input', () => {
        backgroundOpacity = bgOpacitySlider.value;
        updateChatbox();
    });

    bgColorInput.addEventListener('input', () => {
        backgroundColor = bgColorInput.value;
        updateChatbox();
    });

    widthInput.addEventListener('input', () => {
        chatboxWidth = widthInput.value;
        updateChatbox();
    });

    heightInput.addEventListener('input', () => {
        chatboxHeight = heightInput.value;
        updateChatbox();
    });

    posXSlider.addEventListener('input', () => {
        chatboxPosX = posXSlider.value;
        updateChatbox();
    });

    posYSlider.addEventListener('input', () => {
        chatboxPosY = posYSlider.value;
        updateChatbox();
    });

    // Function to adjust slider value with scroll wheel
    function adjustSliderValue(slider, delta) {
        const step = parseFloat(slider.step) || 10;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        let value = parseFloat(slider.value) || 0;

        value += delta * step;
        if (value < min) value = min;
        if (value > max) value = max;

        slider.value = value;
        slider.dispatchEvent(new Event('input'));
    }

    // Handle mouse scroll on sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('wheel', event => {
            event.preventDefault();
            const delta = Math.sign(event.deltaY) * -1;
            adjustSliderValue(slider, delta);
        });

        // Handle arrow key controls on sliders
        slider.addEventListener('keydown', event => {
            if (event.key === 'ArrowUp' && slider.id === 'chatPosY') {
                adjustSliderValue(slider, -1);
            } else if (event.key === 'ArrowDown' && slider.id === 'chatPosY') {
                adjustSliderValue(slider, 1);
            } else if (event.key === 'ArrowLeft' && slider.id === 'chatPosX') {
                adjustSliderValue(slider, -1);
            } else if (event.key === 'ArrowRight' && slider.id === 'chatPosX') {
                adjustSliderValue(slider, 1);
            } else if ((event.key === 'ArrowUp' || event.key === 'ArrowRight') && slider.id !== 'chatPosX' && slider.id !== 'chatPosY') {
                adjustSliderValue(slider, 1);
            } else if ((event.key === 'ArrowDown' || event.key === 'ArrowLeft') && slider.id !== 'chatPosX' && slider.id !== 'chatPosY') {
                adjustSliderValue(slider, -1);
            }
        });
    });

    // Handle fullscreen changes
    function handleFullscreenChange() {
        const iframe = document.querySelector('iframe#chatframe');
        if (!iframe) return;

        const isFullscreen = document.fullscreenElement;

        if (isFullscreen) {
            updateChatbox();
            applyStyles();
            settingsButton.style.display = 'block';
        } else {
            settingsButton.style.display = 'none';
            settingsModal.style.display = 'none';
            // Reset to default values (do not remove saved settings)
            iframe.style.width = '';
            iframe.style.height = '';
            iframe.style.position = '';
            iframe.style.left = '';
            iframe.style.top = '';
            iframe.style.opacity = '';
        }
    }

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Initial chatbox update
    updateChatbox();
    applyStylesOnLoad();
})();
