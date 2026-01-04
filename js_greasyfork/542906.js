// ==UserScript==
// @name         REXXXCLOUD Soundcloud Customization
// @namespace    http://tampermonkey.net/
// @version      10.1
// @license MIT
// @description  REXXXCLOUD Customization - Enhanced SoundCloud customization bruh
// @author       rexxx
// @match        https://soundcloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542906/REXXXCLOUD%20Soundcloud%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/542906/REXXXCLOUD%20Soundcloud%20Customization.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage keys for description presets and customization
    const STORAGE_KEYS = {
        description: 'rexxxcloud_description_presets',
        customization: 'rexxxcloud_customization_settings'
    };

    let isScriptActive = false;
    let enhancementAttempts = 0;
    const MAX_ENHANCEMENT_ATTEMPTS = 50;
    let customizationPanel = null;
    let fallingParticles = null;
    let customStyleElement = null; // Consolidated style element
    let animationStyleElement = null; // Consolidated animation style element
    let particleOverlayCanvas = null; // Particle overlay canvas instance

    // Default customization settings with new options
    const defaultCustomization = {
        backgroundType: 'none', // 'none', 'color', 'gradient', 'image', 'gif'
        backgroundColor: '#1a1a1a',
        gradientStart: '#1a1a1a',
        gradientEnd: '#333333',
        gradientDirection: 'to bottom',
        backgroundImage: '',
        backgroundOpacity: 0.3,
        themeColor: '#ff5500',
        textColor: '#ffffff',
        accentColor: '#ff7700',
        borderRadius: 8,
        customCSS: '',

        // Enhanced particle effects
        fallingParticlesEnabled: false,
        fallingParticleCount: 20,
        fallingParticleSpeed: 0.05, // Adjusted speed to be extremely slow
        fallingParticleSize: 2,
        fallingParticleColor: '#ffffff',
        fallingParticleOpacity: 0.7,

        // Smooth animations
        smoothAnimationsEnabled: true,
        hoverAnimationsEnabled: true,
        buttonAnimationsEnabled: true,
        transitionDuration: 0.3,

        // UI Enhancements
        customCursor: false,
        cursorTrail: false,
        buttonGlow: false,
        textShadow: false,
        borderGlow: false,

        // Additional customization options
        cardHoverEffect: true,
        volumeBarColor: true,
        progressBarColor: true,
        scrollBarColor: true,
        waveformColor: true,
        dimUnfocused: false, // New option
        glassmorphism: false, // New option
        neonText: false, // New option
        rainbowText: false, // New option

        // Waveform customization
        waveformCustomEnabled: false,
        waveformHue: 0, // Hue rotation in degrees
        waveformSaturation: 100, // Saturation percentage
        waveformBrightness: 100, // Brightness percentage
        waveformContrast: 100, // Contrast percentage
        waveformBlur: 0, // Blur in pixels
        waveformOpacity: 100, // Opacity percentage
        waveformInvert: false, // Invert colors
        waveformSepia: 0, // Sepia effect percentage
        waveformGrayscale: 0, // Grayscale effect percentage
        toggleKeybind: 'Shift+C' // New keybind setting
    };

    // Enhanced Particle class with more effects
    class Particle {
        constructor(x, y, color, size, speed, type = 'normal') {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * speed * 0.05; // Further reduced horizontal speed
            this.vy = (Math.random() * 0.5 + 0.5) * speed * 0.5; // Adjusted vertical speed to be consistently downwards and slower
            this.color = color;
            this.size = size;
            this.life = 1.0;
            this.decay = 0.005; // Slower decay for longer life
            this.type = type;
            this.angle = Math.random() * Math.PI * 2;
            this.rotation = (Math.random() - 0.5) * 0.01; // Slower rotation
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.angle += this.rotation;

            if (this.type === 'falling') {
                this.vy += 0.005; // Very subtle gravity for falling particles
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        isDead() {
            return this.life <= 0 || this.y > window.innerHeight + 50;
        }
    }

    // Enhanced Particle System
    class ParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
        }

        addParticle(x, y, color, size, speed, type = 'normal') {
            this.particles.push(new Particle(x, y, color, size, speed, type));
        }

        update() {
            this.particles = this.particles.filter(particle => {
                particle.update();
                return !particle.isDead();
            });
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(particle => particle.draw(this.ctx));
        }

        addFallingParticles(count, color, size, speed) {
            for (let i = 0; i < count; i++) {
                const x = Math.random() * this.canvas.width;
                const y = -10;
                this.addParticle(x, y, color, size, speed, 'falling');
            }
        }
    }

    // Get customization settings
    function getCustomizationSettings() {
        const stored = localStorage.getItem(STORAGE_KEYS.customization);
        return stored ? { ...defaultCustomization, ...JSON.parse(stored) } : defaultCustomization;
    }

    // Save customization settings
    function saveCustomizationSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.customization, JSON.stringify(settings));
        applyCustomization(settings);
    }

    // Apply smooth animations
    function applySmoothAnimations(settings) {
        if (!settings.smoothAnimationsEnabled) return;

        const animationCSS = `
            /* Smooth transitions for all interactive elements */
            * {
                transition: all ${settings.transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            /* Button hover animations */
            ${settings.buttonAnimationsEnabled ? `
            button, .sc-button, [role="button"] {
                transform-origin: center !important;
                transition: all ${settings.transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            button:hover, .sc-button:hover, [role="button"]:hover {
                transform: translateY(-2px) scale(1.02) !important;
                box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3) !important;
            }

            button:active, .sc-button:active, [role="button"]:active {
                transform: translateY(0px) scale(0.98) !important;
            }
            ` : ''}

            /* Hover animations for interactive elements */
            ${settings.hoverAnimationsEnabled ? `
            a, .playButton, .soundTitle, [class*="trackItem"] {
                transition: all ${settings.transitionDuration}s ease !important;
            }

            a:hover, .playButton:hover, .soundTitle:hover, [class*="trackItem"]:hover {
                transform: translateX(5px) !important;
                text-shadow: 0 0 10px rgba(255, 85, 0, 0.5) !important;
            }
            ` : ''}

            /* Custom cursor */
            ${settings.customCursor ? `
            * {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="%23ff5500" stroke-width="2"/><circle cx="10" cy="10" r="2" fill="%23ff5500"/></svg>') 10 10, auto !important;
            }
            ` : ''}

            /* Button glow effect */
            ${settings.buttonGlow ? `
            button, .sc-button, [role="button"] {
                box-shadow: 0 0 20px rgba(255, 85, 0, 0.3) !important;
            }
            ` : ''}

            /* Text shadow effect */
            ${settings.textShadow ? `
            h1, h2, h3, .soundTitle, .trackItem__title {
                text-shadow: 0 0 10px rgba(255, 85, 0, 0.5) !important;
            }
            ` : ''}

            /* Border glow effect */
            ${settings.borderGlow ? `
            input, textarea, select, .sc-input {
                box-shadow: 0 0 15px rgba(255, 85, 0, 0.2) !important;
                border: 1px solid rgba(255, 85, 0, 0.5) !important;
            }
            ` : ''}

            /* Card Hover Effect */
            ${settings.cardHoverEffect ? `
            .sound__cover, .trackItem__artwork, .playlistTrack__artwork {
                transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out !important;
            }
            .sound__cover:hover, .trackItem__artwork:hover, .playlistTrack__artwork:hover {
                transform: translateY(-5px) scale(1.02) !important;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4) !important;
            }
            ` : ''}

            /* Dim Unfocused Elements */
            ${settings.dimUnfocused ? `
            body:not(:hover) > *:not(#rexxxcloud-customization-panel):not(#rexxxcloud-customization-toggle) {
                opacity: 0.7 !important;
            }
            body:not(:hover) > *:not(#rexxxcloud-customization-panel):not(#rexxxcloud-customization-toggle):hover {
                opacity: 1 !important;
            }
            ` : ''}

            /* Glassmorphism Effect */
            ${settings.glassmorphism ? `
            .sc-button, .sc-input, .sc-select, .playbackSoundBadge, .sound__header, .l-listen-hero {
                background: rgba(255, 255, 255, 0.1) !important;
                backdrop-filter: blur(10px) saturate(180%) !important;
                -webkit-backdrop-filter: blur(10px) saturate(180%) !important;
                border: 1px solid rgba(209, 213, 219, 0.3) !important;
                border-radius: 10px !important;
            }
            ` : ''}

            /* Neon Text Effect */
            ${settings.neonText ? `
            h1, h2, h3, .soundTitle, .trackItem__title, a {
                text-shadow:
                    0 0 7px #fff,
                    0 0 10px #fff,
                    0 0 21px #fff,
                    0 0 42px ${settings.themeColor},
                    0 0 82px ${settings.themeColor},
                    0 0 92px ${settings.themeColor},
                    0 0 102px ${settings.themeColor},
                    0 0 151px ${settings.themeColor} !important;
            }
            ` : ''}

            /* Rainbow Text Effect */
            ${settings.rainbowText ? `
            @keyframes rexxxcloud-rainbow {
                0% { color: #FF0000; }
                16% { color: #FF7F00; }
                33% { color: #FFFF00; }
                50% { color: #00FF00; }
                66% { color: #0000FF; }
                83% { color: #4B0082; }
                100% { color: #9400D3; }
            }
            h1, h2, h3, .soundTitle, .trackItem__title, a {
                animation: rexxxcloud-rainbow 6s linear infinite !important;
            }
            ` : ''}
        `;

        if (!animationStyleElement) {
            animationStyleElement = document.createElement('style');
            animationStyleElement.id = 'rexxxcloud-animations';
            document.head.appendChild(animationStyleElement);
        }
        animationStyleElement.textContent = animationCSS;
    }

    // Apply customization to the page
    function applyCustomization(settings) {
        if (!customStyleElement) {
            customStyleElement = document.createElement('style');
            customStyleElement.id = 'rexxxcloud-custom-styles';
            document.head.appendChild(customStyleElement);
        }

        let css = `
            /* REXXXCLOUD Customization Styles */
            :root {
                --rexxxcloud-theme-color: ${settings.themeColor};
                --rexxxcloud-text-color: ${settings.textColor};
                --rexxxcloud-accent-color: ${settings.accentColor};
                --rexxxcloud-border-radius: ${settings.borderRadius}px;
            }

            /* Particle overlay canvas */
            #rexxxcloud-particle-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                pointer-events: none !important;
                z-index: 99999 !important; /* Increased z-index */
            }

            /* --- START: Transparent Background CSS --- */
            /* Make the main play controls background transparent */
            .playControls__bg {
              background-color: transparent !important;
              background: transparent !important;
            }

            /* Make all control buttons transparent */
            .playControls__control,
            .playControls__control.sc-button,
            .playControls__control.sc-button-secondary,
            .playControls__control.sc-button-large,
            .playControls__control.sc-button-small,
            .playControls__control.sc-button-icon,
            .playControl,
            .skipControl,
            .shuffleControl,
            .repeatControl {
              background-color: transparent !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
            }

            /* Make sound badge action buttons transparent */
            .playbackSoundBadge__actions .sc-button,
            .sc-button-like,
            .sc-button-follow,
            .playbackSoundBadge__showQueue,
            .playbackSoundBadge__like,
            .sc-button-follow {
              background-color: transparent !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
            }

            /* Make volume control button transparent */
            .volume__button,
            .volume__speakerIcon {
              background-color: transparent !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
            }

            /* Make the control panel transparent */
            .playControls__panel,
            .playControlsPanel {
              background-color: transparent !important;
              background: transparent !important;
            }

            /* Ensure the main play controls container blends well */
            .playControls,
            .playControls__inner,
            .playControls__wrapper,
            .playControls__elements {
              background-color: transparent !important;
              background: transparent !important;
            }

            /* Keep text and icons visible with proper contrast */
            .playControls__control svg,
            .playbackSoundBadge__actions svg,
            .volume__button svg {
              color: inherit !important;
              fill: currentColor !important;
            }

            /* Ensure timeline and progress elements remain visible */
            .playbackTimeline__progressBackground,
            .playbackTimeline__progressBar,
            .playbackTimeline__progressHandle {
              /* Keep these elements as they are for functionality */
            }

            /* Ensure text elements remain visible */
            .playbackTimeline__timePassed,
            .playbackTimeline__duration,
            .playbackSoundBadge__titleLink,
            .playbackSoundBadge__lightLink {
              /* Keep text styling as is for readability */
            }
            /* --- END: Transparent Background CSS --- */
        `;

        // Background customization
        if (settings.backgroundType !== 'none') {
            let backgroundCSS = '';

            switch (settings.backgroundType) {
                case 'color':
                    backgroundCSS = `background-color: ${settings.backgroundColor} !important;`;
                    break;
                case 'gradient':
                    backgroundCSS = `background: linear-gradient(${settings.gradientDirection}, ${settings.gradientStart}, ${settings.gradientEnd}) !important;`;
                    break;
                case 'image':
                case 'gif':
                    if (settings.backgroundImage) {
                        backgroundCSS = `
                            background-image: url('${settings.backgroundImage}') !important;
                            background-size: cover !important;
                            background-position: center !important;
                            background-repeat: no-repeat !important;
                            background-attachment: fixed !important;
                        `;

                        // Add overlay for opacity control
                        css += `
                            body::before {
                                content: '';
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: rgba(0, 0, 0, ${1 - settings.backgroundOpacity});
                                pointer-events: none;
                                z-index: -1;
                            }
                        `;
                    }
                    break;
            }

            css += `
                body {
                    ${backgroundCSS}
                }
            `;
        }

        // Glow effect
        if (settings.glowEffect) {
            css += `
                body {
                    box-shadow: inset 0 0 ${settings.glowIntensity * 10}px var(--rexxxcloud-theme-color) !important;
                }
            `;
        }

        // Theme color customization
        css += `
            /* Button and accent color customization */
            .sc-button-orange,
            .sc-button-cta,
            button[class*="orange"],
            button[class*="cta"],
            .playButton,
            .sc-button-play {
                background-color: var(--rexxxcloud-theme-color) !important;
                border-color: var(--rexxxcloud-theme-color) !important;
            }

            .sc-button-orange:hover,
            .sc-button-cta:hover,
            button[class*="orange"]:hover,
            button[class*="cta"]:hover {
                background-color: var(--rexxxcloud-accent-color) !important;
                border-color: var(--rexxxcloud-accent-color) !important;
            }

            /* Link colors */
            a[class*="soundTitle"],
            a[class*="trackItem"],
            .soundTitle__title {
                color: var(--rexxxcloud-theme-color) !important;
            }

            /* Progress bars and sliders */
            .playbackTimeline__progressBackground {
              background-color: transparent !important;
              background: transparent !important;
            }
            .playbackTimeline__progressWrapper {
                background-color: transparent !important;
            }
            ${settings.progressBarColor ? `
            .playbackTimeline__progressBar,
            .volume__sliderWrapper {
                background-color: var(--rexxxcloud-theme-color) !important;
            }
            ` : ''}

            /* Volume bar color */
            ${settings.volumeBarColor ? `
            .volume__sliderBackground {
                background-color: var(--rexxxcloud-accent-color) !important;
            }
            ` : ''}

            /* Scrollbar color */
            ${settings.scrollBarColor ? `
            ::-webkit-scrollbar-thumb {
                background: var(--rexxxcloud-theme-color) !important;
            }
            ::-webkit-scrollbar-track {
                background: rgba(var(--rexxxcloud-theme-color), 0.2) !important;
            }
            ` : ''}

            /* Waveform color */
            ${settings.waveformColor ? `
            .waveform__layer__progress {
                background-color: var(--rexxxcloud-theme-color) !important;
            }
            .waveform__layer__background {
                background-color: rgba(var(--rexxxcloud-theme-color), 0.3) !important;
            }
            ` : ''}

            /* Advanced Waveform Customization */
            ${settings.waveformCustomEnabled ? `
            .waveform__layer.waveform__scene canvas {
                filter:
                    hue-rotate(${settings.waveformHue}deg)
                    saturate(${settings.waveformSaturation}%)
                    brightness(${settings.waveformBrightness}%)
                    contrast(${settings.waveformContrast}%)
                    blur(${settings.waveformBlur}px)
                    opacity(${settings.waveformOpacity}%)
                    ${settings.waveformInvert ? 'invert(1)' : 'invert(0)'}
                    sepia(${settings.waveformSepia}%)
                    grayscale(${settings.waveformGrayscale}%) !important;
                transition: filter 0.3s ease !important;
            }
            ` : ''}

            /* Hide Master element and its containing iframe */
            .sidebarModule:has(.webiEmbeddedModuleIframe[src*="credit-tracker"]) {
                display: none !important;
            }

            /* Custom border radius */
            .sc-button,
            button,
            input,
            textarea,
            .sc-input,
            .sc-select {
                border-radius: var(--rexxxcloud-border-radius) !important;
            }

            /* Preset dropdown styling */
            .rexxxcloud-preset-container select,
            .rexxxcloud-preset-container button {
                border-radius: var(--rexxxcloud-border-radius) !important;
            }

            /* Customization panel styling */
            #rexxxcloud-customization-panel {
                background: rgba(26, 26, 26, 0.95) !important;
                border: 1px solid var(--rexxxcloud-theme-color) !important;
                border-radius: var(--rexxxcloud-border-radius) !important;
                backdrop-filter: blur(10px) !important;
            }
        `;

        // Add custom CSS if provided
        if (settings.customCSS) {
            css += `\n/* Custom CSS */\n${settings.customCSS}`;
        }

        customStyleElement.textContent = css;

        // Apply smooth animations
        applySmoothAnimations(settings);
    }

    // Create particle overlay canvas for particles and effects
    function createParticleOverlay() {
        if (!particleOverlayCanvas) {
            particleOverlayCanvas = document.createElement('canvas');
            particleOverlayCanvas.id = 'rexxxcloud-particle-overlay';
            document.body.appendChild(particleOverlayCanvas);

            // Resize canvas when window resizes
            window.addEventListener('resize', () => {
                particleOverlayCanvas.width = window.innerWidth;
                particleOverlayCanvas.height = window.innerHeight;
            });
        }
        particleOverlayCanvas.width = window.innerWidth;
        particleOverlayCanvas.height = window.innerHeight;
        return particleOverlayCanvas;
    }

    // Create color picker input
    function createColorPicker(value, onChange) {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        `;

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = value;
        colorInput.style.cssText = `
            width: 40px !important;
            height: 30px !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
        `;

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = value;
        textInput.style.cssText = `
            background: #333 !important;
            color: #fff !important;
            border: 1px solid #555 !important;
            border-radius: 4px !important;
            padding: 4px 8px !important;
            font-size: 12px !important;
            width: 80px !important;
        `;

        colorInput.addEventListener('change', () => {
            textInput.value = colorInput.value;
            onChange(colorInput.value);
        });

        textInput.addEventListener('change', () => {
            if (/^#[0-9A-F]{6}$/i.test(textInput.value)) {
                colorInput.value = textInput.value;
                onChange(textInput.value);
            }
        });

        container.appendChild(colorInput);
        container.appendChild(textInput);
        return container;
    }

    // Create enhanced customization panel
    function createCustomizationPanel() {
        if (customizationPanel) {
            customizationPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'rexxxcloud-customization-panel';
        panel.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 380px !important;
            max-height: 85vh !important;
            background: rgba(26, 26, 26, 0.95) !important;
            border: 1px solid #ff5500 !important;
            border-radius: 8px !important;
            padding: 16px !important;
            z-index: 10000 !important;
            font-family: Arial, sans-serif !important;
            font-size: 12px !important;
            color: #fff !important;
            overflow-y: auto !important;
            backdrop-filter: blur(10px) !important;
            display: none !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
        `;

        const settings = getCustomizationSettings();

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; color: #ff5500; font-size: 16px;">🎨 REXXXCLOUD Customization</h3>
                <button id="rexxxcloud-close-panel" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">✕</button>
            </div>

            <!-- Background Settings -->
            <h4 style="margin-top: 0; margin-bottom: 10px; color: #ff5500;">🖼️ Background</h4>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Background Type:</label>
                <select id="rexxxcloud-bg-type" style="width: 100%; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 6px;">
                    <option value="none">None</option>
                    <option value="color">Solid Color</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Image URL</option>
                    <option value="gif">GIF URL</option>
                </select>
            </div>

            <div id="rexxxcloud-bg-color-section" style="margin-bottom: 16px; display: none;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Background Color:</label>
                <div id="rexxxcloud-bg-color-picker"></div>
            </div>

            <div id="rexxxcloud-gradient-section" style="margin-bottom: 16px; display: none;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Gradient Start:</label>
                <div id="rexxxcloud-gradient-start-picker" style="margin-bottom: 8px;"></div>
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Gradient End:</label>
                <div id="rexxxcloud-gradient-end-picker" style="margin-bottom: 8px;"></div>
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Direction:</label>
                <select id="rexxxcloud-gradient-direction" style="width: 100%; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 6px;">
                    <option value="to bottom">Top to Bottom</option>
                    <option value="to top">Bottom to Top</option>
                    <option value="to right">Left to Right</option>
                    <option value="to left">Right to Left</option>
                    <option value="45deg">Diagonal ↗</option>
                    <option value="-45deg">Diagonal ↖</option>
                </select>
            </div>

            <div id="rexxxcloud-image-section" style="margin-bottom: 16px; display: none;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Image/GIF URL:</label>
                <input type="text" id="rexxxcloud-bg-image" placeholder="https://example.com/image.jpg" style="width: 100%; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 6px; margin-bottom: 8px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Opacity: <span id="rexxxcloud-opacity-value">${settings.backgroundOpacity}</span></label>
                <input type="range" id="rexxxcloud-bg-opacity" min="0" max="1" step="0.1" value="${settings.backgroundOpacity}" style="width: 100%;">
            </div>

            <!-- Theme Settings -->
            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #ff5500;">🎨 Theme</h4>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Theme Color:</label>
                <div id="rexxxcloud-theme-color-picker"></div>
            </div>

            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Accent Color:</label>
                <div id="rexxxcloud-accent-color-picker"></div>
            </div>

            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Border Radius: <span id="rexxxcloud-radius-value">${settings.borderRadius}px</span></label>
                <input type="range" id="rexxxcloud-border-radius" min="0" max="20" value="${settings.borderRadius}" style="width: 100%;">
            </div>

            <!-- Smooth Animations -->
            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #ff5500;">✨ Smooth Animations</h4>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: bold;">
                    <input type="checkbox" id="rexxxcloud-smooth-animations-enabled" ${settings.smoothAnimationsEnabled ? 'checked' : ''}>
                    Enable Smooth Animations
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-hover-animations-enabled" ${settings.hoverAnimationsEnabled ? 'checked' : ''}>
                    Hover Animations
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-button-animations-enabled" ${settings.buttonAnimationsEnabled ? 'checked' : ''}>
                    Button Animations
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Transition Duration: <span id="rexxxcloud-transition-duration-value">${settings.transitionDuration}s</span></label>
                <input type="range" id="rexxxcloud-transition-duration" min="0.1" max="1" step="0.1" value="${settings.transitionDuration}" style="width: 100%;">
            </div>

            <!-- Particle Effects -->
            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #ff5500;">❄️ Particle Effects</h4>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-falling-particles-enabled" ${settings.fallingParticlesEnabled ? 'checked' : ''}>
                    Falling Particles
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Particle Count: <span id="rexxxcloud-falling-particle-count-value">${settings.fallingParticleCount}</span></label>
                <input type="range" id="rexxxcloud-falling-particle-count" min="5" max="100" value="${settings.fallingParticleCount}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Particle Size: <span id="rexxxcloud-falling-particle-size-value">${settings.fallingParticleSize}px</span></label>
                <input type="range" id="rexxxcloud-falling-particle-size" min="1" max="10" value="${settings.fallingParticleSize}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Particle Color:</label>
                <div id="rexxxcloud-falling-particle-color-picker"></div>
            </div>

            <!-- UI Enhancements -->
            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #ff5500;">🎯 UI Enhancements</h4>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-custom-cursor" ${settings.customCursor ? 'checked' : ''}>
                    Custom Cursor
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-button-glow" ${settings.buttonGlow ? 'checked' : ''}>
                    Button Glow
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-text-shadow" ${settings.textShadow ? 'checked' : ''}>
                    Text Shadow
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-border-glow" ${settings.borderGlow ? 'checked' : ''}>
                    Border Glow
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-card-hover-effect" ${settings.cardHoverEffect ? 'checked' : ''}>
                    Card Hover Effect
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-volume-bar-color" ${settings.volumeBarColor ? 'checked' : ''}>
                    Volume Bar Color
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-progress-bar-color" ${settings.progressBarColor ? 'checked' : ''}>
                    Progress Bar Color
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-scroll-bar-color" ${settings.scrollBarColor ? 'checked' : ''}>
                    Scroll Bar Color
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-waveform-color" ${settings.waveformColor ? 'checked' : ''}>
                    Waveform Color
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-dim-unfocused" ${settings.dimUnfocused ? 'checked' : ''}>
                    Dim Unfocused Elements
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-glassmorphism" ${settings.glassmorphism ? 'checked' : ''}>
                    Glassmorphism Effect
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-neon-text" ${settings.neonText ? 'checked' : ''}>
                    Neon Text Effect
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-rainbow-text" ${settings.rainbowText ? 'checked' : ''}>
                    Rainbow Text Effect
                </label>
            </div>

            <!-- Keybind Setting -->
            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #ff5500;">⌨️ Keybind Settings</h4>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Toggle Panel Keybind:</label>
                <input type="text" id="rexxxcloud-toggle-keybind" value="${settings.toggleKeybind}" style="width: 100%; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 6px;">
            </div>

            <!-- Waveform Customization -->
            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #ff5500;">🌊 Waveform Customization</h4>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: bold;">
                    <input type="checkbox" id="rexxxcloud-waveform-custom-enabled" ${settings.waveformCustomEnabled ? 'checked' : ''}>
                    Enable Advanced Waveform Effects
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Hue Rotation: <span id="rexxxcloud-waveform-hue-value">${settings.waveformHue}°</span></label>
                <input type="range" id="rexxxcloud-waveform-hue" min="0" max="360" value="${settings.waveformHue}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Saturation: <span id="rexxxcloud-waveform-saturation-value">${settings.waveformSaturation}%</span></label>
                <input type="range" id="rexxxcloud-waveform-saturation" min="0" max="200" value="${settings.waveformSaturation}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Brightness: <span id="rexxxcloud-waveform-brightness-value">${settings.waveformBrightness}%</span></label>
                <input type="range" id="rexxxcloud-waveform-brightness" min="0" max="200" value="${settings.waveformBrightness}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Contrast: <span id="rexxxcloud-waveform-contrast-value">${settings.waveformContrast}%</span></label>
                <input type="range" id="rexxxcloud-waveform-contrast" min="0" max="200" value="${settings.waveformContrast}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Blur: <span id="rexxxcloud-waveform-blur-value">${settings.waveformBlur}px</span></label>
                <input type="range" id="rexxxcloud-waveform-blur" min="0" max="10" value="${settings.waveformBlur}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Opacity: <span id="rexxxcloud-waveform-opacity-value">${settings.waveformOpacity}%</span></label>
                <input type="range" id="rexxxcloud-waveform-opacity" min="0" max="100" value="${settings.waveformOpacity}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="rexxxcloud-waveform-invert" ${settings.waveformInvert ? 'checked' : ''}>
                    Invert Colors
                </label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Sepia: <span id="rexxxcloud-waveform-sepia-value">${settings.waveformSepia}%</span></label>
                <input type="range" id="rexxxcloud-waveform-sepia" min="0" max="100" value="${settings.waveformSepia}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px;">Grayscale: <span id="rexxxcloud-waveform-grayscale-value">${settings.waveformGrayscale}%</span></label>
                <input type="range" id="rexxxcloud-waveform-grayscale" min="0" max="100" value="${settings.waveformGrayscale}" style="width: 100%;">
            </div>

            <!-- Custom CSS -->
            <h4 style="margin-top: 20px; margin-bottom: 10px; color: #ff5500;">💻 Custom CSS</h4>
            <div style="margin-bottom: 16px;">
                <textarea id="rexxxcloud-custom-css" placeholder="/* Add your custom CSS here */" style="width: 100%; height: 80px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 6px; font-family: monospace; font-size: 11px; resize: vertical;">${settings.customCSS}</textarea>
            </div>

            <div style="display: flex; gap: 8px;">
                <button id="rexxxcloud-save-settings" style="flex: 1; background: #28a745; color: white; border: none; border-radius: 4px; padding: 8px; cursor: pointer; font-size: 12px;">💾 Save</button>
                <button id="rexxxcloud-reset-settings" style="flex: 1; background: #dc3545; color: white; border: none; border-radius: 4px; padding: 8px; cursor: pointer; font-size: 12px;">🔄 Reset</button>
            </div>
        `;

        document.body.appendChild(panel);
        customizationPanel = panel;

        // Initialize all form elements and event listeners
        initializePanelControls(panel, settings);

        return panel;
    }

    // Initialize panel controls with enhanced functionality
    function initializePanelControls(panel, settings) {
        // Get all form elements
        const bgTypeSelect = panel.querySelector('#rexxxcloud-bg-type');
        const bgColorSection = panel.querySelector('#rexxxcloud-bg-color-section');
        const gradientSection = panel.querySelector('#rexxxcloud-gradient-section');
        const imageSection = panel.querySelector('#rexxxcloud-image-section');

        // Set initial values
        bgTypeSelect.value = settings.backgroundType;

        // Create color pickers
        const colorPickers = [
            { id: 'rexxxcloud-bg-color-picker', value: settings.backgroundColor, key: 'backgroundColor' },
            { id: 'rexxxcloud-gradient-start-picker', value: settings.gradientStart, key: 'gradientStart' },
            { id: 'rexxxcloud-gradient-end-picker', value: settings.gradientEnd, key: 'gradientEnd' },
            { id: 'rexxxcloud-theme-color-picker', value: settings.themeColor, key: 'themeColor' },
            { id: 'rexxxcloud-accent-color-picker', value: settings.accentColor, key: 'accentColor' },
            { id: 'rexxxcloud-falling-particle-color-picker', value: settings.fallingParticleColor, key: 'fallingParticleColor' }
        ];

        colorPickers.forEach(({ id, value, key }) => {
            const picker = createColorPicker(value, (color) => {
                settings[key] = color;
            });
            panel.querySelector(`#${id}`).appendChild(picker);
        });

        // Show/hide sections based on settings
        function updateSections() {
            bgColorSection.style.display = bgTypeSelect.value === 'color' ? 'block' : 'none';
            gradientSection.style.display = bgTypeSelect.value === 'gradient' ? 'block' : 'none';
            imageSection.style.display = (bgTypeSelect.value === 'image' || bgTypeSelect.value === 'gif') ? 'block' : 'none';
        }

        updateSections();

        // Add all event listeners
        addEnhancedEventListeners(panel, settings, updateSections);
    }

    // Enhanced event listeners
    function addEnhancedEventListeners(panel, settings, updateSections) {
        // Background controls
        panel.querySelector('#rexxxcloud-bg-type').addEventListener('change', (e) => {
            settings.backgroundType = e.target.value;
            updateSections();
        });

        // Add listeners for all controls
        const controls = [
            // Basic controls
            { id: 'rexxxcloud-bg-image', key: 'backgroundImage', type: 'input' },
            { id: 'rexxxcloud-bg-opacity', key: 'backgroundOpacity', type: 'range', transform: parseFloat },
            { id: 'rexxxcloud-gradient-direction', key: 'gradientDirection', type: 'select' },
            { id: 'rexxxcloud-border-radius', key: 'borderRadius', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-custom-css', key: 'customCSS', type: 'textarea' },

            // Animation controls
            { id: 'rexxxcloud-smooth-animations-enabled', key: 'smoothAnimationsEnabled', type: 'checkbox' },
            { id: 'rexxxcloud-hover-animations-enabled', key: 'hoverAnimationsEnabled', type: 'checkbox' },
            { id: 'rexxxcloud-button-animations-enabled', key: 'buttonAnimationsEnabled', type: 'checkbox' },
            { id: 'rexxxcloud-transition-duration', key: 'transitionDuration', type: 'range', transform: parseFloat },

            // Particle effects
            { id: 'rexxxcloud-falling-particles-enabled', key: 'fallingParticlesEnabled', type: 'checkbox' },
            { id: 'rexxxcloud-falling-particle-count', key: 'fallingParticleCount', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-falling-particle-size', key: 'fallingParticleSize', type: 'range', transform: parseInt },

            // UI enhancements
            { id: 'rexxxcloud-custom-cursor', key: 'customCursor', type: 'checkbox' },
            { id: 'rexxxcloud-button-glow', key: 'buttonGlow', type: 'checkbox' },
            { id: 'rexxxcloud-text-shadow', key: 'textShadow', type: 'checkbox' },
            { id: 'rexxxcloud-border-glow', key: 'borderGlow', type: 'checkbox' },
            { id: 'rexxxcloud-card-hover-effect', key: 'cardHoverEffect', type: 'checkbox' },
            { id: 'rexxxcloud-volume-bar-color', key: 'volumeBarColor', type: 'checkbox' },
            { id: 'rexxxcloud-progressBar-color', key: 'progressBarColor', type: 'checkbox' },
            { id: 'rexxxcloud-scroll-bar-color', key: 'scrollBarColor', type: 'checkbox' },
            { id: 'rexxxcloud-waveform-color', key: 'waveformColor', type: 'checkbox' },
            { id: 'rexxxcloud-dim-unfocused', key: 'dimUnfocused', type: 'checkbox' }, // New control
            { id: 'rexxxcloud-glassmorphism', key: 'glassmorphism', type: 'checkbox' }, // New control
            { id: 'rexxxcloud-neon-text', key: 'neonText', type: 'checkbox' }, // New control
            { id: 'rexxxcloud-rainbow-text', key: 'rainbowText', type: 'checkbox' }, // New control

            // Waveform customization controls
            { id: 'rexxxcloud-waveform-custom-enabled', key: 'waveformCustomEnabled', type: 'checkbox' },
            { id: 'rexxxcloud-waveform-hue', key: 'waveformHue', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-waveform-saturation', key: 'waveformSaturation', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-waveform-brightness', key: 'waveformBrightness', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-waveform-contrast', key: 'waveformContrast', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-waveform-blur', key: 'waveformBlur', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-waveform-opacity', key: 'waveformOpacity', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-waveform-invert', key: 'waveformInvert', type: 'checkbox' },
            { id: 'rexxxcloud-waveform-sepia', key: 'waveformSepia', type: 'range', transform: parseInt },
            { id: 'rexxxcloud-waveform-grayscale', key: 'waveformGrayscale', type: 'range', transform: parseInt },

            // Keybind control
            { id: 'rexxxcloud-toggle-keybind', key: 'toggleKeybind', type: 'input' }
        ];

        controls.forEach(({ id, key, type, transform }) => {
            const element = panel.querySelector(`#${id}`);
            if (element) {
                const eventType = type === 'checkbox' ? 'change' : 'input';
                element.addEventListener(eventType, (e) => {
                    let value = e.target.value;
                    if (type === 'checkbox') {
                        value = e.target.checked;
                    } else if (transform) {
                        value = transform(value);
                    }
                    settings[key] = value;

                    // Update value display for range inputs
                    const valueSpan = panel.querySelector(`#${id}-value`);
                    if (valueSpan && type === 'range') {
                        const unit = id.includes('duration') ? 's' :
                                   id.includes('size') || id.includes('radius') || id.includes('intensity') ? 'px' : '';
                        valueSpan.textContent = value + unit;
                    }
                });
            }
        });

        // Button event listeners
        panel.querySelector('#rexxxcloud-close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        panel.querySelector('#rexxxcloud-save-settings').addEventListener('click', () => {
            saveCustomizationSettings(settings);
            alert('🎉 REXXXCLOUD settings saved! Your enhanced SoundCloud experience is ready!');
        });

        panel.querySelector('#rexxxcloud-reset-settings').addEventListener('click', () => {
            if (confirm('Reset all REXXXCLOUD settings to default?')) {
                saveCustomizationSettings(defaultCustomization);
                panel.remove();
                customizationPanel = null;
                createCustomizationPanel();
                alert('REXXXCLOUD settings reset to default!');
            }
        });
    }

    // Create customization toggle button with enhanced styling
    function createCustomizationToggle() {
        const existingToggle = document.querySelector('#rexxxcloud-customization-toggle');
        if (existingToggle) {
            return;
        }

        const toggle = document.createElement('button');
        toggle.id = 'rexxxcloud-customization-toggle';
        toggle.innerHTML = '🎨';
        toggle.title = 'REXXXCLOUD Customization by rexxx';
        toggle.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 60px !important;
            height: 60px !important;
            background: linear-gradient(45deg, #ff5500, #ff7700, #ff9900) !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 24px !important;
            z-index: 9999 !important;
            box-shadow: 0 6px 20px rgba(255, 85, 0, 0.4) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            animation: rexxxcloud-toggle-pulse 3s infinite !important;
        `;

        // Add enhanced pulsing animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rexxxcloud-toggle-pulse {
                0%, 100% {
                    transform: scale(1) rotate(0deg);
                    box-shadow: 0 6px 20px rgba(255, 85, 0, 0.4);
                }
                25% {
                    transform: scale(1.05) rotate(5deg);
                    box-shadow: 0 8px 25px rgba(255, 85, 0, 0.6);
                }
                50% {
                    transform: scale(1.1) rotate(0deg);
                    box-shadow: 0 10px 30px rgba(255, 85, 0, 0.8);
                }
                75% {
                    transform: scale(1.05) rotate(-5deg);
                    box-shadow: 0 8px 25px rgba(255, 85, 0, 0.6);
                }
            }
        `;
        document.head.appendChild(style);

        toggle.addEventListener('mouseenter', () => {
            toggle.style.transform = 'scale(1.2) rotate(10deg)';
            toggle.style.boxShadow = '0 10px 30px rgba(255, 85, 0, 0.8)';
        });

        toggle.addEventListener('mouseleave', () => {
            toggle.style.transform = 'scale(1)';
            toggle.style.boxShadow = '0 6px 20px rgba(255, 85, 0, 0.4)';
        });

        toggle.addEventListener('click', () => {
            if (!customizationPanel) {
                customizationPanel = createCustomizationPanel();
            }
            const panel = document.querySelector('#rexxxcloud-customization-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });

        document.body.appendChild(toggle);
    }

    // Function to handle keyboard shortcuts
    function setupKeybindListener() {
        document.removeEventListener("keydown", handleKeybind);
        document.addEventListener("keydown", handleKeybind);
    }

    function handleKeybind(event) {
        const settings = getCustomizationSettings();
        const keybind = settings.toggleKeybind;

        if (!keybind) return;

        const parts = keybind.split("+").map(p => p.trim().toLowerCase());
        let matches = true;

        if (parts.includes("shift") && !event.shiftKey) matches = false;
        if (!parts.includes("shift") && event.shiftKey) matches = false;

        if (parts.includes("ctrl") && !event.ctrlKey) matches = false;
        if (!parts.includes("ctrl") && event.ctrlKey) matches = false;

        if (parts.includes("alt") && !event.altKey) matches = false;
        if (!parts.includes("alt") && event.altKey) matches = false;

        const key = parts[parts.length - 1];
        if (event.key.toLowerCase() !== key) matches = false;

        if (matches) {
            event.preventDefault();
            const toggleButton = document.querySelector("#rexxxcloud-customization-toggle");
            if (toggleButton) {
                toggleButton.style.display = toggleButton.style.display === 'none' ? 'block' : 'none';
            }
        }
    }
    function getFieldPresets(field) {
        const stored = localStorage.getItem(STORAGE_KEYS[field]);
        return stored ? JSON.parse(stored) : [];
    }

    // Save presets for description field
    function saveFieldPresets(field, presets) {
        localStorage.setItem(STORAGE_KEYS[field], JSON.stringify(presets));
    }

    // Add a preset for description field
    function addPreset(field, name, value) {
        const presets = getFieldPresets(field);
        const filtered = presets.filter(p => p.name !== name);
        filtered.push({ name, value });
        saveFieldPresets(field, filtered);
    }

    // Delete a preset
    function deletePreset(field, name) {
        const presets = getFieldPresets(field);
        const filtered = presets.filter(p => p.name !== name);
        saveFieldPresets(field, filtered);
    }

    // Create preset dropdown for description field only
    function createPresetDropdown(field, inputElement, labelElement) {
        if (field !== 'description') {
            return;
        }

        const presetContainer = document.createElement('div');
        presetContainer.className = `rexxxcloud-preset-${field} rexxxcloud-preset-container`;
        presetContainer.style.cssText = `
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            margin-left: 10px !important;
            font-size: 11px !important;
            opacity: 0.9 !important;
        `;

        // Create the dropdown select
        const select = document.createElement('select');
        select.style.cssText = `
            background: #333 !important;
            color: #fff !important;
            border: 1px solid #ff5500 !important;
            border-radius: 6px !important;
            padding: 4px 8px !important;
            font-size: 11px !important;
            min-width: 120px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        `;

        // Create save button
        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = '💾';
        saveBtn.title = `Save current ${field} as preset`;
        saveBtn.type = 'button';
        saveBtn.style.cssText = `
            background: linear-gradient(45deg, #ff5500, #ff7700) !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 4px 6px !important;
            cursor: pointer !important;
            font-size: 11px !important;
            line-height: 1 !important;
            transition: all 0.3s ease !important;
        `;

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑';
        deleteBtn.title = `Delete selected ${field} preset`;
        deleteBtn.type = 'button';
        deleteBtn.style.cssText = `
            background: linear-gradient(45deg, #dc3545, #e74c3c) !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 4px 6px !important;
            cursor: pointer !important;
            font-size: 11px !important;
            line-height: 1 !important;
            transition: all 0.3s ease !important;
        `;

        // Update dropdown options
        function updateDropdown() {
            const presets = getFieldPresets(field);
            select.innerHTML = `<option value="">📝 Select preset...</option>`;

            presets.forEach(preset => {
                const option = document.createElement('option');
                option.value = preset.name;
                option.textContent = preset.name.length > 20 ? preset.name.substring(0, 20) + '...' : preset.name;
                select.appendChild(option);
            });
        }

        // Load preset into field
        select.addEventListener('change', () => {
            if (select.value) {
                const presets = getFieldPresets(field);
                const preset = presets.find(p => p.name === select.value);
                if (preset) {
                    inputElement.value = preset.value;
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                    inputElement.focus();

                    if (inputElement.tagName === 'TEXTAREA') {
                        inputElement.style.height = 'auto';
                        inputElement.style.height = inputElement.scrollHeight + 'px';
                    }
                }
            }
        });

        // Save current field value as preset
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentValue = inputElement.value.trim();
            if (!currentValue) {
                alert(`Please enter some ${field} content before saving a preset.`);
                return;
            }

            const presetName = prompt(`Enter a name for this ${field} preset:`, '');
            if (presetName && presetName.trim()) {
                addPreset(field, presetName.trim(), currentValue);
                updateDropdown();
                select.value = presetName.trim();
                alert(`${field.charAt(0).toUpperCase() + field.slice(1)} preset "${presetName}" saved!`);
            }
        });

        // Delete selected preset
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!select.value) {
                alert(`Please select a ${field} preset to delete.`);
                return;
            }

            if (confirm(`Delete the "${select.value}" ${field} preset?`)) {
                deletePreset(field, select.value);
                updateDropdown();
                alert(`${field.charAt(0).toUpperCase() + field.slice(1)} preset deleted!`);
            }
        });

        presetContainer.appendChild(select);
        presetContainer.appendChild(saveBtn);
        presetContainer.appendChild(deleteBtn);

        // Insert in the best available location
        if (labelElement && labelElement.parentNode) {
            labelElement.appendChild(presetContainer);
        } else if (inputElement && inputElement.parentNode) {
            inputElement.parentNode.insertBefore(presetContainer, inputElement);
        }

        updateDropdown();
        return presetContainer;
    }

    // Enhanced field detection for description only
    function findFormElements() {
        const selectors = {
            description: [
                '#description',
                'textarea[name="description"]',
                'textarea[placeholder*="descriptions tend to get"]',
                'textarea[placeholder*="description"]',
                'textarea[aria-label*="description"]'
            ]
        };

        const labelSelectors = {
            description: ['label[for="description"]', 'Description'] // Simplified label search
        };

        const found = {};

        Object.keys(selectors).forEach(field => {
            // Find input element
            for (const selector of selectors[field]) {
                const element = document.querySelector(selector);
                if (element) {
                    found[field] = { input: element };
                    break;
                }
            }

            // Find label element
            if (found[field]) {
                for (const labelText of labelSelectors[field]) {
                    let labelElement = document.querySelector(`label[for="${found[field].input.id}"]`);
                    if (!labelElement) {
                        labelElement = Array.from(document.querySelectorAll('label')).find(
                            label => label.textContent.includes(labelText)
                        );
                    }
                    if (labelElement) {
                        found[field].label = labelElement;
                        break;
                    }
                }
            }
        });

        return found;
    }

    // Enhanced form detection
    function enhanceFormFields() {
        enhancementAttempts++;
        console.log(`🎵 REXXXCLOUD: Enhancement attempt ${enhancementAttempts}/${MAX_ENHANCEMENT_ATTEMPTS}`);

        const foundElements = findFormElements();
        let enhancedCount = 0;

        // Only process description field
        const field = 'description';
        const { input, label } = foundElements[field] || {};
        if (input) {
            const existingPreset = document.querySelector(`.rexxxcloud-preset-${field}`);
            if (!existingPreset) {
                console.log(`🎵 REXXXCLOUD: Adding preset dropdown for ${field}`);
                createPresetDropdown(field, input, label);
                enhancedCount++;
            }
        }

        if (enhancedCount > 0) {
            console.log(`🎵 REXXXCLOUD: Enhanced ${enhancedCount} fields`);
        }

        // Create customization toggle if not exists
        createCustomizationToggle();

        return enhancedCount;
    }

    // Smart initialization
    function smartInit() {
        if (!isScriptActive) {
            isScriptActive = true;
            console.log('🎵 REXXXCLOUD by rexxx - Starting enhanced monitoring...');
        }

        if (!window.location.hostname.includes('soundcloud.com')) {
            return;
        }

        // Apply saved customization settings
        const settings = getCustomizationSettings();
        applyCustomization(settings);

        // Setup keybind listener
        setupKeybindListener();

        // Initialize falling particles if enabled
        if (settings.fallingParticlesEnabled) {
            const particleOverlay = createParticleOverlay();
            fallingParticles = new ParticleSystem(particleOverlay);
            function animateFallingParticles() {
                if (fallingParticles && settings.fallingParticlesEnabled) {
                    if (Math.random() < 0.1) { // Periodically add new particles
                        fallingParticles.addFallingParticles(
                            Math.floor(Math.random() * settings.fallingParticleCount),
                            settings.fallingParticleColor,
                            settings.fallingParticleSize,
                            settings.fallingParticleSpeed
                        );
                    }
                    fallingParticles.update();
                    fallingParticles.draw();
                }
                requestAnimationFrame(animateFallingParticles);
            }
            animateFallingParticles();
        } else if (fallingParticles) { // If particles were enabled and now disabled, stop animation and clear canvas
            fallingParticles = null;
            if (particleOverlayCanvas) {
                const ctx = particleOverlayCanvas.getContext('2d');
                ctx.clearRect(0, 0, particleOverlayCanvas.width, particleOverlayCanvas.height);
            }
        }

        // Look for description field
        const uploadIndicators = [
            'form',
            'textarea[name="description"]',
            '#description'
        ];

        let hasUploadForm = false;
        for (const selector of uploadIndicators) {
            if (document.querySelector(selector)) {
                hasUploadForm = true;
                break;
            }
        }

        if (hasUploadForm) {
            console.log('🎵 REXXXCLOUD: Upload form detected, enhancing description field...');
            const enhanced = enhanceFormFields();

            if (enhanced === 0 && enhancementAttempts < MAX_ENHANCEMENT_ATTEMPTS) {
                setTimeout(smartInit, 1000);
            }
        } else {
            createCustomizationToggle();

            if (enhancementAttempts < MAX_ENHANCEMENT_ATTEMPTS) {
                setTimeout(smartInit, 2000);
            }
        }

        // Custom Top Fans Implementation
        handleTopFans();
    }

    // Function to handle Top Fans
    function handleTopFans() {
        // Hide the original top fans section if it exists
        const originalTopFansSelector = '.ouxtlr0'; // Based on the HTML snippet provided earlier
        const originalTopFansElement = document.querySelector(originalTopFansSelector);
        if (originalTopFansElement) {
            originalTopFansElement.style.display = 'none';
            console.log('🎵 REXXXCLOUD: Original Top Fans section hidden.');
        }

        // Find a suitable parent element to insert our custom top fans section
        // This might need adjustment based on the actual SoundCloud DOM structure
        const parentElement = document.querySelector('.l-listen-hero'); // Example selector, adjust as needed
        if (!parentElement) {
            console.log('🎵 REXXXCLOUD: Could not find parent element for custom Top Fans. Skipping.');
            return;
        }

        // Remove any previously rendered custom top fans section to ensure refresh
        const existingCustomTopFans = document.getElementById('rexxxcloud-custom-top-fans');
        if (existingCustomTopFans) {
            existingCustomTopFans.remove();
        }

        // Simulate fetching top fan data (replace with actual data fetching if possible)
        const topFansData = getSimulatedTopFansData(); // This function needs to be defined

        if (topFansData && topFansData.length > 0) {
            const customTopFansSection = document.createElement('div');
            customTopFansSection.id = 'rexxxcloud-custom-top-fans';
            customTopFansSection.style.cssText = `
                margin-top: 20px;
                padding: 15px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                color: #fff;
            `;

            let fansHtml = '<h4 style="margin-top: 0; color: #ff5500;">🏆 Top Fans (REXXXCLOUD)</h4>';
            fansHtml += '<ul style="list-style: none; padding: 0;">';
            topFansData.forEach((fan, index) => {
                fansHtml += `
                    <li style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: bold; margin-right: 10px;">${index + 1}.</span>
                        <img src="${fan.avatarUrl}" alt="${fan.name}'s Avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                        <a href="${fan.profileUrl}" style="color: #fff; text-decoration: none; font-weight: bold;">${fan.name}</a> <span style="color: #ccc;">(${fan.plays} plays)</span>
                    </li>
                `;
            });
            fansHtml += '</ul>';

            customTopFansSection.innerHTML = fansHtml;
            parentElement.appendChild(customTopFansSection);
            console.log('🎵 REXXXCLOUD: Custom Top Fans section rendered.');
        } else {
            console.log('🎵 REXXXCLOUD: No Top Fans data available, not rendering custom section.');
        }
    }

    // Simulated function to get top fan data
    // In a real scenario, this would involve making an API call to SoundCloud
    function getSimulatedTopFansData() {
        // This is placeholder data. You would replace this with actual data fetched from SoundCloud.
        // Since direct API access for top fans isn't readily available via public SoundCloud APIs
        // without authentication and specific permissions, this remains a simulation.
        // If you can find a way to scrape this data or access a private API, integrate it here.
        const currentTrackId = window.location.pathname.split('/').pop(); // Basic way to get a track ID

        // Return different data based on track ID for demonstration
        if (currentTrackId === 'thoughts') {
            return [
                { name: 'DJDanJam$', avatarUrl: 'https://i1.sndcdn.com/avatars-1vCCKrSYGzWUVRFo-99zWPQ-large.jpg', profileUrl: 'https://soundcloud.com/djdanjams', plays: 4 },
                { name: 'RRA1NYD4Y$$ (quit)', avatarUrl: 'https://i1.sndcdn.com/avatars-eKNK34U68k7LzLXx-iLlkOA-large.jpg', profileUrl: 'https://soundcloud.com/rra1ny901', plays: 4 },
                { name: 'integrity', avatarUrl: 'https://i1.sndcdn.com/avatars-F78bIKKHn7G2RJv3-TWWvkw-large.jpg', profileUrl: 'https://soundcloud.com/hsxrd_cult', plays: 3 },
                { name: 'anonymousUser', avatarUrl: 'https://a1.sndcdn.com/images/default_avatar_large.png', profileUrl: 'https://soundcloud.com/Anonymous%20permalink', plays: 2 },
                { name: 'exsvyssssss', avatarUrl: 'https://i1.sndcdn.com/avatars-jaqQq2ih5jK4tJ7Q-Mg6nBw-large.jpg', profileUrl: 'https://soundcloud.com/exsvy', plays: 2 }
            ];
        } else if (currentTrackId === 'another-track-id') {
            return [
                { name: 'FanA', avatarUrl: 'https://example.com/fanA.jpg', profileUrl: 'https://soundcloud.com/fana', plays: 10 },
                { name: 'FanB', avatarUrl: 'https://example.com/fanB.jpg', profileUrl: 'https://soundcloud.com/fanb', plays: 8 }
            ];
        } else {
            return []; // No top fans for other tracks
        }
    }

    // Comprehensive observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        let shouldReinit = false;
        let trackChanged = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        // Check for description field or track changes
                        if (node.querySelector && (
                            node.querySelector('textarea[name="description"]') ||
                            node.querySelector('#description')
                        )) {
                            shouldReinit = true;
                        }
                        // Detect track change by looking for elements commonly updated on track navigation
                        if (node.querySelector && (
                            node.querySelector(".playbackSoundBadge__titleLink") || // Track title link
                            node.querySelector(".sound__header") // Sound header section
                        )) {
                            trackChanged = true;
                        }
                    }
                }
            }
        });

        // Also check for title changes, which reliably indicates a track change
        if (document.title !== lastDocumentTitle) {
            lastDocumentTitle = document.title;
            trackChanged = true;
        }

        if (shouldReinit) {
            console.log('🎵 REXXXCLOUD: Form changes detected, re-enhancing...');
            setTimeout(smartInit, 500);
        }

        if (trackChanged) {
            console.log('🎵 REXXXCLOUD: Track changed, re-handling Top Fans...');
            setTimeout(handleTopFans, 1000); // Re-run handleTopFans on track change
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // URL change detection for SPA navigation
    let lastUrl = location.href;
    let lastDocumentTitle = document.title; // Initialize with current document title
    setInterval(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('🎵 REXXXCLOUD: URL changed, reinitializing...');
            enhancementAttempts = 0;
            setTimeout(() => {
                smartInit();
                handleTopFans(); // Also re-handle top fans on URL change
            }, 1000);
        }
    }, 1000);

    // Initial start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', smartInit);
    } else {
        smartInit();
    }

    console.log('🎵 REXXXCLOUD by rexxx - Enhanced SoundCloud customization loaded and monitoring!');
})();






