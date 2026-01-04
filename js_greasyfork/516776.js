// ==UserScript==
// @name         Spectify Private. C.io Staff BUMS
// @namespace    https://your-unique-namespace.com/
// @version      1.1
// @description  Customize gradients and colors on cracked.io, add particle effects, and integrate a YouTube music player with loop functionality.
// @author       SpEc
// @match        https://*.cracked.io/*
// @icon         https://static.cracked.io/uploads/avatars/avatar_3116424.gif?dateline=1719456680
// @grant        none
// @supportURL   https://cracked.io/spec
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516776/Spectify%20Private%20Cio%20Staff%20BUMS.user.js
// @updateURL https://update.greasyfork.org/scripts/516776/Spectify%20Private%20Cio%20Staff%20BUMS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================
    // 1. Define Themes
    // =========================

    const baseThemes = {
        'Custom Theme': {
            '--gradient-1': '#4B0000',
            '--gradient-2': '#2A2A2A',
            '--gradient-3': '#1C1C1C',
            '--gradient-4': '#333333',
            '--background-main': '#000000',
            '--background-secondary': '#1E1E1E',
            '--background-light': '#2C2C2C',
            '--background-floating': '#2A2A2A',
            '--background-floating-alt': '#333333',
            '--background-floating-light': '#262626',
            '--border-color': '#444444',
            '--border': '1px solid var(--border-color)',
            '--radius': '10px',
            '--banner-padding': '20px',
            '--btn': '#4444447a',
            '--btn-hover': 'linear-gradient(45deg, #CCCCCC, #999999)',
            '--dropdown-hover': 'linear-gradient(45deg, #999999, #CCCCCC)',
            '--text-dark': '#FFFFFF',
            '--forumtabs-icon-color': '#2adbf9a3',
            '--panel-upper-icon-color': '#ff302e',
            '--trow-border-top-color': '#ff0000',
            '--trow-border-bottom-color': '#1b1b1b',
            '--trow-text-color': '#f90a0a',
            '--reputation-positive-color': '#a13a3a',
            '--helpdocs-number-color': '#00b6e1',
            '--footer-color': '#1E1E1E',
            '--particle-color': '#FFFFFF',
            '--particle-sway-amplitude': '50px'
        },
        'Ocean Blue': {
            '--gradient-1': '#1A2980',
            '--gradient-2': '#26D0CE',
            '--gradient-3': '#2980B9',
            '--gradient-4': '#6DD5FA',
            '--background-main': '#001f3f',
            '--background-secondary': '#004085',
            '--background-light': '#0b1b2d',
            '--background-floating': '#004085',
            '--background-floating-alt': '#0056b3',
            '--background-floating-light': '#007bff',
            '--border-color': '#0056b3',
            '--border': '1px solid var(--border-color)',
            '--radius': '10px',
            '--banner-padding': '20px',
            '--btn': '#007bff7a',
            '--btn-hover': 'linear-gradient(45deg, #66b3ff, #3399ff)',
            '--dropdown-hover': 'linear-gradient(45deg, #3399ff, #66b3ff)',
            '--text-dark': '#FFFFFF',
            '--forumtabs-icon-color': '#66FF66',
            '--panel-upper-icon-color': '#33CC33',
            '--trow-border-top-color': '#33CC33',
            '--trow-border-bottom-color': '#1b1b1b',
            '--trow-text-color': '#66FF66',
            '--reputation-positive-color': '#3cb371',
            '--helpdocs-number-color': '#7CFC00',
            '--footer-color': '#004085',
            '--particle-color': '#66B2FF',
            '--particle-sway-amplitude': '70px'
        },
        'Neon Lights': {
            '--gradient-1': '#ff00cc',
            '--gradient-2': '#333399',
            '--gradient-3': '#cc00ff',
            '--gradient-4': '#6600ff',
            '--background-main': '#111111',
            '--background-secondary': '#222222',
            '--background-light': '#333333',
            '--background-floating': '#444444',
            '--background-floating-alt': '#555555',
            '--background-floating-light': '#666666',
            '--border-color': '#ff00cc',
            '--border': '1px solid var(--border-color)',
            '--radius': '10px',
            '--banner-padding': '20px',
            '--btn': '#ff00cc7a',
            '--btn-hover': 'linear-gradient(45deg, #ff66cc, #cc33ff)',
            '--dropdown-hover': 'linear-gradient(45deg, #cc33ff, #ff66cc)',
            '--text-dark': '#FFFFFF',
            '--forumtabs-icon-color': '#ff66cc',
            '--panel-upper-icon-color': '#cc33ff',
            '--trow-border-top-color': '#cc33ff',
            '--trow-border-bottom-color': '#1b1b1b',
            '--trow-text-color': '#ff66cc',
            '--reputation-positive-color': '#ff1493',
            '--helpdocs-number-color': '#ff69b4',
            '--footer-color': '#cc33ff',
            '--particle-color': '#FF66CC',
            '--particle-sway-amplitude': '60px'
        },
        'Forest Green': {
            '--gradient-1': '#265d26',
            '--gradient-2': '#006400',
            '--gradient-3': '#2e8b56',
            '--gradient-4': '#3cb372',
            '--background-main': '#0B3D0B',
            '--background-secondary': '#145214',
            '--background-light': '#1E691E',
            '--background-floating': '#256025',
            '--background-floating-alt': '#2E8B57',
            '--background-floating-light': '#3FA06F',
            '--border-color': '#145214',
            '--border': '1px solid var(--border-color)',
            '--radius': '10px',
            '--banner-padding': '20px',
            '--btn': '#1A1A1A',
            '--btn-hover': 'linear-gradient(45deg, #33cc33, #009900)',
            '--dropdown-hover': 'linear-gradient(45deg, #009900, #33cc33)',
            '--text-dark': '#f0f0f0',
            '--forumtabs-icon-color': '#33cc33',
            '--panel-upper-icon-color': '#009900',
            '--trow-border-top-color': '#009900',
            '--trow-border-bottom-color': '#1b1b1b',
            '--trow-text-color': '#33cc33',
            '--reputation-positive-color': '#2E8B57',
            '--helpdocs-number-color': '#6ECB00',
            '--footer-color': '#145214',
            '--particle-color': '#66FF66',
            '--particle-sway-amplitude': '80px'
        },
        'Sunset Glow': {
            '--gradient-1': '#FF5F6D',
            '--gradient-2': '#FFC371',
            '--gradient-3': '#FF9A8B',
            '--gradient-4': '#FF3F4A',
            '--background-main': '#0d0d0d',
            '--background-secondary': '#1E1E1E',
            '--background-light': '#2C2C2C',
            '--background-floating': '#2A2A2A',
            '--background-floating-alt': '#333333',
            '--background-floating-light': '#262626',
            '--border-color': '#444444',
            '--border': '1px solid var(--border-color)',
            '--radius': '10px',
            '--banner-padding': '20px',
            '--btn': '#4444447a',
            '--btn-hover': 'linear-gradient(45deg, #FF5F6D, #FFC371)',
            '--dropdown-hover': 'linear-gradient(45deg, #FFC371, #FF9A8B)',
            '--text-dark': '#FFFFFF',
            '--forumtabs-icon-color': '#2adbf9a3',
            '--panel-upper-icon-color': '#ff302e',
            '--trow-border-top-color': '#ff0000',
            '--trow-border-bottom-color': '#1b1b1b',
            '--trow-text-color': '#f90a0a',
            '--reputation-positive-color': '#a13a3a',
            '--helpdocs-number-color': '#00b6e1',
            '--footer-color': '#1E1E1E',
            '--particle-color': '#FF5F6D',
            '--particle-sway-amplitude': '50px'
        },
        'Christmas': {
            '--gradient-1': '#8B0000',
            '--gradient-2': '#006400',
            '--gradient-3': '#CDA434',
            '--gradient-4': '#B22222',
            '--background-main': '#0A0A0A',
            '--background-secondary': '#141414',
            '--background-light': '#1A1A1A',
            '--background-floating': '#141414',
            '--background-floating-alt': '#1A1A1A',
            '--background-floating-light': '#262626',
            '--border-color': '#004D40',
            '--border': '1px solid var(--border-color)',
            '--radius': '10px',
            '--banner-padding': '20px',
            '--btn': '#004D407a',
            '--btn-hover': 'linear-gradient(45deg, #8B0000, #006400)',
            '--dropdown-hover': 'linear-gradient(45deg, #006400, #8B0000)',
            '--text-dark': '#ECEFF1',
            '--forumtabs-icon-color': '#8B0000',
            '--panel-upper-icon-color': '#006400',
            '--trow-border-top-color': '#006400',
            '--trow-border-bottom-color': '#1b1b1b',
            '--trow-text-color': '#28a745',
            '--reputation-positive-color': '#28a745',
            '--helpdocs-number-color': '#28a745',
            '--footer-color': '#006400',
            '--particle-color': '#FFFFFF',
            '--particle-sway-amplitude': '60px'
        },
        'Space Theme': {
            '--gradient-1': '#000000', /* Black */
            '--gradient-2': '#0d0d0d', /* Darker Gray */
            '--gradient-3': '#1a1a1a', /* Dark Gray */
            '--gradient-4': '#262626', /* Medium Dark Gray */
            '--background-main': '#000000', /* Black */
            '--background-secondary': '#0a0a0a', /* Very Dark Gray */
            '--background-light': '#141414', /* Slightly Lighter Black */
            '--background-floating': '#1c1c1c', /* Dark Gray */
            '--background-floating-alt': '#262626', /* Medium Dark Gray */
            '--background-floating-light': '#2e2e2e', /* Light Dark Gray */
            '--border-color': '#444444', /* Medium Gray */
            '--border': '1px solid var(--border-color)',
            '--radius': '10px',
            '--banner-padding': '20px',
            '--btn': '#3d3d3d7a', /* Semi-transparent Dark Gray */
            '--btn-hover': 'linear-gradient(45deg, #666666, #333333)', /* Light to Medium Gray */
            '--dropdown-hover': 'linear-gradient(45deg, #333333, #666666)', /* Medium to Light Gray */
            '--text-dark': '#ffffff', /* White */
            '--forumtabs-icon-color': '#888888', /* Light Gray */
            '--panel-upper-icon-color': '#aaaaaa', /* Medium Gray */
            '--trow-border-top-color': '#4a4a4a', /* Medium Gray */
            '--trow-border-bottom-color': '#1a1a1a', /* Dark Gray */
            '--trow-text-color': '#ffffff', /* White */
            '--reputation-positive-color': '#4a4a4a', /* Medium Gray */
            '--helpdocs-number-color': '#b3b3b3', /* Light Gray */
            '--footer-color': '#000000', /* Black */
            '--particle-color': '#ffffff', /* White */
            '--particle-sway-amplitude': '50px',
            '--snow-enabled': 'true' /* Enable Snow */
        }
    };

    // =========================
    // 2. Utility Functions
    // =========================

    // Function to apply CSS variables to :root
    function applyCSSVariables(variables) {
        const root = document.documentElement;
        for (let varName in variables) {
            root.style.setProperty(varName, variables[varName]);
        }
    }

    // Function to extract YouTube Video ID using URL API
    function extractYouTubeID(url) {
        try {
            const parsedURL = new URL(url);
            if (parsedURL.hostname.includes('youtube.com')) {
                return parsedURL.searchParams.get('v');
            } else if (parsedURL.hostname === 'youtu.be') {
                return parsedURL.pathname.slice(1);
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    // Function to convert HEX to HSL
    function hexToHSL(hex) {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta === 0)
            h = 0;
        else if (cmax === r)
            h = ((g - b) / delta) % 6;
        else if (cmax === g)
            h = (b - r) / delta + 2;
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);
        if (h < 0)
            h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return {h, s, l};
    }

    // Function to convert HSL to HEX
    function HSLToHex(h, s, l) {
        s /= 100;
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        }
        else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        }
        else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        }
        else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        }
        else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        }
        else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    // Function to adjust hue and saturation
    function adjustHueSaturation(hex, hueShift, saturationShift) {
        const hsl = hexToHSL(hex);
        hsl.h = (hsl.h + hueShift) % 360;
        hsl.s = Math.min(Math.max(hsl.s + saturationShift, 0), 100); // Clamp between 0 and 100
        return HSLToHex(hsl.h, hsl.s, hsl.l);
    }

    // Function to adjust gradient hues and saturations
    function adjustGradient(gradient, hueShift, saturationShift) {
        // Regex to match hex colors in the gradient
        const hexColorRegex = /#([0-9A-Fa-f]{3}){1,2}/g;
        const colors = gradient.match(hexColorRegex);
        if (!colors) return gradient;

        let adjustedGradient = gradient;
        colors.forEach(color => {
            const adjustedColor = adjustHueSaturation(color, hueShift, saturationShift);
            adjustedGradient = adjustedGradient.replace(color, adjustedColor);
        });
        return adjustedGradient;
    }

    // =========================
    // 3. Cookie Management Functions
    // =========================

    // Function to set a cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/; domain=.cracked.io";
    }

    // Function to get a cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    // Function to erase a cookie
    function eraseCookie(name) {
        document.cookie = name+'=; Max-Age=-99999999; path=/; domain=.cracked.io';
    }

    // =========================
    // 4. Initialize Settings
    // =========================

    // Load settings from localStorage or set defaults
    const savedSettings = JSON.parse(localStorage.getItem('spectifySettings')) || {
        theme: 'Custom Theme', // Set to 'Custom Theme' by default
        hue: 0,
        saturation: 0,
        buttonHidden: false,
        particlesEnabled: false,
        particleColor: '#FFFFFF',
        particleWind: 50,
        reputationPositiveColor: '#a13a3a',
        helpdocsNumberColor: '#00b6e1',
        panelUpperIconColor: '#ff302e', // Added default for panel upper icon color
        trowBorderTopColor: '#ff0000', // Added default for table row border top color
        footerColor: '#1E1E1E',
        musicURL: '',
        musicLoop: true,
        musicPlayerOpen: false,
        musicPlaying: false,
        adsRemoved: false,         // New setting
        shoutboxRemoved: false,    // New setting
        pinnedToolsRemoved: false  // New setting
    };

    // Override particlesEnabled from cookie if exists
    const particlesCookie = getCookie('spectifyParticlesEnabled');
    if (particlesCookie !== null) {
        savedSettings.particlesEnabled = (particlesCookie === 'true');
    }

    // Apply base theme
    applyCSSVariables(baseThemes[savedSettings.theme]);

    // Adjust theme based on hue and saturation
    function applyAdjustments(themeVariables, hueShift, saturationShift) {
        const adjustedVariables = { ...themeVariables };
        for (let varName in adjustedVariables) {
            if (varName.startsWith('--gradient')) {
                adjustedVariables[varName] = adjustHueSaturation(
                    themeVariables[varName],
                    hueShift,
                    saturationShift
                );
            } else if (
                varName.startsWith('--btn') ||
                varName.startsWith('--dropdown') ||
                varName.startsWith('--forumtabs-icon-color') ||
                varName.startsWith('--panel-upper-icon-color') ||
                varName.startsWith('--trow-border-top-color') ||
                varName.startsWith('--trow-border-bottom-color') ||
                varName.startsWith('--trow-text-color') ||
                varName.startsWith('--reputation-positive-color') ||
                varName.startsWith('--helpdocs-number-color') ||
                varName.startsWith('--footer-color')
            ) {
                if (themeVariables[varName].startsWith('linear-gradient')) {
                    adjustedVariables[varName] = adjustGradient(
                        themeVariables[varName],
                        hueShift,
                        saturationShift
                    );
                } else {
                    adjustedVariables[varName] = adjustHueSaturation(
                        themeVariables[varName],
                        hueShift,
                        saturationShift
                    );
                }
            } else {
                adjustedVariables[varName] = themeVariables[varName];
            }
        }
        applyCSSVariables(adjustedVariables);
    }

    // Apply initial adjustments based on saved settings
    applyAdjustments(baseThemes[savedSettings.theme], savedSettings.hue, savedSettings.saturation);

    // =========================
    // 5. Create UI Elements
    // =========================

    // Create the Spectify button
    const spectifyButton = document.createElement('button');
    spectifyButton.id = 'spectify-button';
    spectifyButton.innerHTML = `<span style="font-size: 24px;">🎨</span>`;
    document.body.appendChild(spectifyButton);

    // Create Styles
    const style = document.createElement('style');
    style.innerHTML = `
        /* Spectify Button Styles */
        #spectify-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--btn);
            color: #fff;
            border: none;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            font-size: 24px;
            z-index: 10000;
            transition: transform 0.3s, background 0.3s, box-shadow 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: floatButton 3s ease-in-out infinite;
        }
        #spectify-button:hover {
            background: var(--btn-hover);
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }
        #spectify-button:active {
            transform: scale(0.95);
        }
        @keyframes floatButton {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        /* Spectify Panel Styles */
        #spectify-panel {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 320px;
            max-height: 600px;
            background: var(--background-floating);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.5);
            padding: 25px;
            z-index: 9999;
            display: none;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease, transform 0.4s ease;
            overflow-y: auto;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #spectify-panel.visible {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        #spectify-panel.hidden {
            opacity: 0;
            transform: translateY(20px);
        }
        #spectify-panel h2 {
            margin-top: 0;
            text-align: center;
            font-size: 22px;
            margin-bottom: 20px;
            color: #fff;
        }
        .spectify-section {
            margin-bottom: 25px;
        }
        .spectify-section label {
            display: block;
            margin-bottom: 10px;
            font-size: 16px;
            color: #fff;
        }
        .spectify-section input[type="range"],
        .spectify-section input[type="text"],
        .spectify-section input[type="color"] {
            width: 100%;
            padding: 5px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--background-light);
            color: var(--text-dark);
        }
        .spectify-section input[type="text"]::placeholder {
            color: #ccc;
        }
        .theme-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }
        .theme-button {
            flex: 1 1 45%;
            padding: 10px;
            background: var(--btn);
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
            text-align: center;
        }
        .theme-button:hover {
            background: var(--btn-hover);
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .theme-button:active {
            transform: scale(0.95);
        }

        /* Consistent Button Styles for Play/Pause, Loop */
        .control-button {
            padding: 8px 12px;
            background: var(--btn);
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s, transform 0.3s;
        }
        .control-button:hover {
            background: var(--btn-hover);
            transform: scale(1.05);
        }
        .control-button:active {
            transform: scale(0.95);
        }

        /* Button Group Styles */
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .button-group .control-button {
            flex: 1;
            text-align: center;
        }

        /* Reset Button */
        #reset-spectify {
            width: 100%;
            padding: 10px;
            background: #ff4d4d;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s, transform 0.3s;
        }
        #reset-spectify:hover {
            background: #e60000;
            transform: scale(1.02);
        }
        #reset-spectify:active {
            transform: scale(0.98);
        }

        /* Notification Styles */
        #spectify-notification {
            position: fixed;
            top: 30px;
            right: 30px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: none;
            align-items: center;
            gap: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 10001;
            animation: slideIn 0.5s forwards;
            font-size: 16px;
        }
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }

        /* Scrollbar Styling for Panel */
        #spectify-panel::-webkit-scrollbar {
            width: 8px;
        }
        #spectify-panel::-webkit-scrollbar-thumb {
            background: var(--background-secondary);
            border-radius: 4px;
        }
        #spectify-panel::-webkit-scrollbar-thumb:hover {
            background: var(--gradient-2);
        }

        /* Responsive Design */
        @media (max-width: 400px) {
            #spectify-panel {
                width: 90%;
                right: 5%;
            }
            #spectify-notification {
                right: 5%;
                width: 90%;
            }
            /* Adjust button sizes on small screens */
            .theme-button {
                flex: 1 1 100%;
            }
            .button-group {
                flex-direction: column;
            }
        }

        /* Entry and Reset Overlays */
        #spectify-entry-overlay, #spectify-reset-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            flex-direction: column;
            padding: 20px;
            text-align: center;
        }
        #spectify-entry-overlay button,
        #spectify-reset-overlay button {
            margin-top: 20px;
            padding: 10px 20px;
            background: var(--btn);
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s, transform 0.3s;
        }
        #spectify-entry-overlay button:hover,
        #spectify-reset-overlay button:hover {
            background: var(--btn-hover);
            transform: scale(1.05);
        }
        #spectify-entry-overlay button:active,
        #spectify-reset-overlay button:active {
            transform: scale(0.95);
        }

        /* Particle Effects */
        #spectify-particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9997;
            background: transparent;
        }
        @keyframes particle-move {
            0% {
                transform: translateY(-10px) translateX(0);
                opacity: 1;
            }
            25% {
                transform: translateY(25vh) translateX(var(--particle-sway-amplitude));
                opacity: 0.75;
            }
            50% {
                transform: translateY(50vh) translateX(-var(--particle-sway-amplitude));
                opacity: 0.5;
            }
            75% {
                transform: translateY(75vh) translateX(var(--particle-sway-amplitude));
                opacity: 0.25;
            }
            100% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
        }
        .particle {
            position: absolute;
            top: 0;
            width: 5px;
            height: 5px;
            background: var(--particle-color);
            border-radius: 50%;
            animation: particle-move var(--particle-move-duration, 10s) linear infinite;
        }

        /* Note Styling */
        .note {
            font-style: italic;
            font-size: 0.9em;
            color: #ccc;
            margin-left: 5px;
        }

        /* Update additional elements' colors with gradient text */
        .reputation_positive {
            color: var(--reputation-positive-color) !important;
        }
        .helpdocs-number {
            color: var(--helpdocs-number-color) !important;
        }

        .theme_text,
        td.forumdisplay_sticky>.thread_status:before,
        .thread_status.stick_folder:before,
        .thread-lastpost svg:hover,
        .thread_status.newfolder:before,
        .thread_status.dot_newfolder:before,
        .subforum_minion,
        .stat-icon,
        .forum .row .icon,
        .table .stats .flex-one .number,
        .footer-nav h3,
        .rps-stat-icon,
        .forumtabs li a i,
        .credits_nav_item:hover:before,
        .usercp_nav_item:hover:before {
            background: -webkit-linear-gradient(var(--gradient-1), var(--gradient-2));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
        }
        #panel .upper i {
            color: var(--panel-upper-icon-color) !important;
        }
        /* Update .trow1 and .trow2 styles */
        .trow1, .trow2 {
            border-top: 1px solid var(--trow-border-top-color);
            border-bottom: 1px solid var(--trow-border-bottom-color);
            padding: 12px;
            color: var(--trow-text-color);
            transition: border-color 0.5s ease, color 0.5s ease;
        }

        /* New Styles for Element Removal */
        .spectify-hidden {
            opacity: 0;
            transition: opacity 0.5s ease, transform 0.5s ease;
            pointer-events: none;
            transform: translateY(-20px);
        }
        .spectify-visible {
            opacity: 1;
            transition: opacity 0.5s ease, transform 0.5s ease;
            pointer-events: auto;
            transform: translateY(0);
        }

        /* New Buttons for Removing Elements */
        .remove-element-button {
            width: 100%;
            padding: 10px;
            background: var(--btn);
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s, transform 0.3s;
            margin-top: 10px;
        }
        .remove-element-button:hover {
            background: var(--btn-hover);
            transform: scale(1.02);
        }
        .remove-element-button:active {
            transform: scale(0.98);
        }
    `;
    document.head.appendChild(style);

    // Create Spectify Panel
    const spectifyPanel = document.createElement('div');
    spectifyPanel.id = 'spectify-panel';
    spectifyPanel.innerHTML = `
        <h2>Spectify Settings</h2>
        <div class="spectify-section">
            <label for="hue-slider">Adjust Hue:</label>
            <input type="range" id="hue-slider" min="0" max="360" value="${savedSettings.hue}">
        </div>
        <div class="spectify-section">
            <label for="saturation-slider">Adjust Saturation:</label>
            <input type="range" id="saturation-slider" min="-100" max="100" value="${savedSettings.saturation}">
        </div>
        <div class="spectify-section">
            <label>Choose Theme:</label>
            <div class="theme-buttons">
                ${Object.keys(baseThemes).map(theme => `<button class="theme-button" data-theme="${theme}">${theme}</button>`).join('')}
            </div>
        </div>
        <div class="spectify-section">
            <h3>Music Player</h3>
            <label for="music-url">Custom Music (YouTube URL):</label>
            <input type="text" id="music-url" placeholder="https://www.youtube.com/watch?v=VIDEO_ID" value="${savedSettings.musicURL}">
            <button id="save-music" class="control-button">Save Music</button>
            <div class="button-group">
                <button id="play-pause-music" class="control-button">${savedSettings.musicPlaying ? 'Pause Music' : 'Play Music'}</button>
                <button id="loop-button" class="control-button">${savedSettings.musicLoop ? 'Disable Loop' : 'Enable Loop'}</button>
            </div>
            <button id="open-music-player-button" class="control-button">Open Music Player</button>
        </div>
        <div class="spectify-section">
            <h3>Particle Effects</h3>
            <label>
                <input type="checkbox" id="particles-toggle" ${savedSettings.particlesEnabled ? 'checked' : ''}>
                Enable Falling Particles <span class="note">| Only snow if enabled</span>
            </label>
            <label for="particle-color">Particle Color:</label>
            <input type="color" id="particle-color" value="${savedSettings.particleColor}">
            <label for="particle-wind">Falling Randomness:</label>
            <input type="range" id="particle-wind" min="0" max="100" value="${savedSettings.particleWind}">
        </div>
        <div class="spectify-section">
            <h3>Additional Elements</h3>
            <label for="reputation-positive-color">Reputation Positive Color:</label>
            <input type="color" id="reputation-positive-color" value="${savedSettings.reputationPositiveColor || baseThemes[savedSettings.theme]['--reputation-positive-color']}">

            <label for="helpdocs-number-color">Helpdocs Number Color:</label>
            <input type="color" id="helpdocs-number-color" value="${savedSettings.helpdocsNumberColor || baseThemes[savedSettings.theme]['--helpdocs-number-color']}">

            <label for="panel-upper-icon-color">Panel Upper Icon Color:</label>
            <input type="color" id="panel-upper-icon-color" value="${savedSettings.panelUpperIconColor || baseThemes[savedSettings.theme]['--panel-upper-icon-color']}">

            <label for="trow-border-top-color">Table Row Border Top Color:</label>
            <input type="color" id="trow-border-top-color" value="${savedSettings.trowBorderTopColor || baseThemes[savedSettings.theme]['--trow-border-top-color']}">

            <label for="footer-color">Footer Color:</label>
            <input type="color" id="footer-color" value="${savedSettings.footerColor || baseThemes[savedSettings.theme]['--footer-color']}">
        </div>
        <div class="spectify-section">
            <h3>Element Removal</h3>
            <button id="remove-ads-button" class="remove-element-button">${savedSettings.adsRemoved ? 'Show Ads' : 'Remove Ads'}</button>
            <button id="remove-shoutbox-button" class="remove-element-button">${savedSettings.shoutboxRemoved ? 'Show Shoutbox' : 'Remove Shoutbox'}</button>
            <button id="remove-pinned-tools-button" class="remove-element-button">${savedSettings.pinnedToolsRemoved ? 'Show Pinned Tools' : 'Remove Pinned Tools'}</button>
        </div>
        <div class="spectify-section">
            <button id="reset-spectify" class="control-button">Reset to Default</button>
        </div>
        <div class="spectify-section" style="margin-top: 20px; text-align: center; font-size: 14px;">
            <em>Press <strong>F4</strong> to hide/show the Spectify button.</em>
        </div>
    `;
    document.body.appendChild(spectifyPanel);

    // Create Notification Element
    const notification = document.createElement('div');
    notification.id = 'spectify-notification';
    document.body.appendChild(notification);

    // =========================
    // 6. Apply Theme Adjustments and Custom Colors
    // =========================

    // Function to save settings to localStorage
    function saveSettings(settings) {
        localStorage.setItem('spectifySettings', JSON.stringify(settings));
        // Update particlesEnabled in cookie for cross-subdomain persistence
        setCookie('spectifyParticlesEnabled', settings.particlesEnabled, 365); // Expires in 1 year
    }

    // Function to apply custom color settings
    function applyCustomColorSettings() {
        if (savedSettings.reputationPositiveColor) {
            document.documentElement.style.setProperty('--reputation-positive-color', savedSettings.reputationPositiveColor);
        }
        if (savedSettings.helpdocsNumberColor) {
            document.documentElement.style.setProperty('--helpdocs-number-color', savedSettings.helpdocsNumberColor);
        }
        if (savedSettings.panelUpperIconColor) {
            document.documentElement.style.setProperty('--panel-upper-icon-color', savedSettings.panelUpperIconColor);
        }
        if (savedSettings.trowBorderTopColor) {
            document.documentElement.style.setProperty('--trow-border-top-color', savedSettings.trowBorderTopColor);
        }
        if (savedSettings.footerColor) {
            document.documentElement.style.setProperty('--footer-color', savedSettings.footerColor);
        }
    }

    // Apply custom color settings on initialization
    applyCustomColorSettings();

    // =========================
    // 7. Initialize Sliders and Color Pickers
    // =========================

    // Initialize Hue Slider
    const hueSlider = spectifyPanel.querySelector('#hue-slider');
    hueSlider.value = savedSettings.hue;

    // Initialize Saturation Slider
    const saturationSlider = spectifyPanel.querySelector('#saturation-slider');
    saturationSlider.value = savedSettings.saturation;

    // Handle Hue Slider Change
    hueSlider.addEventListener('input', (e) => {
        const hueValue = parseInt(e.target.value, 10);
        savedSettings.hue = hueValue;
        applyAdjustments(baseThemes[savedSettings.theme], savedSettings.hue, savedSettings.saturation);
        saveSettings(savedSettings);
    });

    // Handle Saturation Slider Change
    saturationSlider.addEventListener('input', (e) => {
        const saturationValue = parseInt(e.target.value, 10);
        savedSettings.saturation = saturationValue;
        applyAdjustments(baseThemes[savedSettings.theme], savedSettings.hue, savedSettings.saturation);
        saveSettings(savedSettings);
    });

    // =========================
    // 8. Handle Theme Selection
    // =========================

    const themeButtons = spectifyPanel.querySelectorAll('.theme-button');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTheme = button.getAttribute('data-theme');
            savedSettings.theme = selectedTheme;
            // Apply the selected theme
            applyCSSVariables(baseThemes[selectedTheme]);
            // Re-apply adjustments
            applyAdjustments(baseThemes[selectedTheme], savedSettings.hue, savedSettings.saturation);
            // Apply custom color settings
            applyCustomColorSettings();
            // Apply theme-specific enhancements
            applyThemeEnhancements(selectedTheme);
            // Save settings
            saveSettings(savedSettings);
            showNotification(`🎨 Theme "${selectedTheme}" applied.`);
        });
    });

    // =========================
    // 9. Handle Reset Button
    // =========================

    const resetButton = spectifyPanel.querySelector('#reset-spectify');
    resetButton.addEventListener('click', () => {
        createResetOverlay();
    });

    // Function to create Reset Confirmation Overlay
    function createResetOverlay() {
        // Prevent multiple overlays
        if (document.getElementById('spectify-reset-overlay')) return;

        const resetOverlay = document.createElement('div');
        resetOverlay.id = 'spectify-reset-overlay';
        resetOverlay.innerHTML = `
            <h1>Confirm Reset</h1>
            <p>Are you sure you want to reset all settings to default? This will delete all saved settings and configurations.</p>
            <div style="margin-top: 20px;">
                <button id="confirm-reset" class="control-button" style="margin-right: 10px;">Yes, Reset</button>
                <button id="cancel-reset" class="control-button">Cancel</button>
            </div>
        `;
        document.body.appendChild(resetOverlay);

        // Event Listener for Confirm Reset
        const confirmReset = resetOverlay.querySelector('#confirm-reset');
        confirmReset.addEventListener('click', () => {
            // Reset settings to default
            Object.assign(savedSettings, {
                theme: 'Custom Theme',
                hue: 0,
                saturation: 0,
                buttonHidden: false,
                particlesEnabled: false,
                particleColor: '#FFFFFF',
                particleWind: 50,
                reputationPositiveColor: baseThemes['Custom Theme']['--reputation-positive-color'],
                helpdocsNumberColor: baseThemes['Custom Theme']['--helpdocs-number-color'],
                panelUpperIconColor: baseThemes['Custom Theme']['--panel-upper-icon-color'],
                trowBorderTopColor: baseThemes['Custom Theme']['--trow-border-top-color'],
                footerColor: baseThemes['Custom Theme']['--footer-color'],
                musicURL: '',
                musicLoop: true,
                musicPlayerOpen: false,
                musicPlaying: false,
                adsRemoved: false,
                shoutboxRemoved: false,
                pinnedToolsRemoved: false
            });
            applyCSSVariables(baseThemes['Custom Theme']);
            applyAdjustments(baseThemes['Custom Theme'], 0, 0);
            applyCustomColorSettings();
            // Update sliders
            hueSlider.value = 0;
            saturationSlider.value = 0;
            // Clear music settings
            removeMusicPlayer();
            spectifyPanel.querySelector('#music-url').value = '';
            // Reset play/pause button
            spectifyPanel.querySelector('#play-pause-music').textContent = 'Play Music';
            // Reset loop button
            spectifyPanel.querySelector('#loop-button').textContent = 'Enable Loop';
            // Reset particle settings
            spectifyPanel.querySelector('#particles-toggle').checked = false;
            spectifyPanel.querySelector('#particle-color').value = '#FFFFFF';
            spectifyPanel.querySelector('#particle-wind').value = 50;
            // Reset panel upper icon color
            spectifyPanel.querySelector('#panel-upper-icon-color').value = '#ff302e';
            // Reset table row border top color
            spectifyPanel.querySelector('#trow-border-top-color').value = baseThemes['Custom Theme']['--trow-border-top-color'];
            // Reset element removal settings
            resetElementRemovalSettings();
            // Remove reset overlay
            resetOverlay.remove();
            // Remove particle effects
            removeParticleEffects();
            // Erase the particlesEnabled cookie
            eraseCookie('spectifyParticlesEnabled');
            // Save settings
            saveSettings(savedSettings);
            showNotification('✅ Settings have been reset to default.');
        });

        // Event Listener for Cancel Reset
        const cancelReset = resetOverlay.querySelector('#cancel-reset');
        cancelReset.addEventListener('click', () => {
            resetOverlay.remove();
        });
    }

    // Function to reset element removal settings
    function resetElementRemovalSettings() {
        // Show Ads
        showAds();
        // Show Shoutbox
        showShoutbox();
        // Show Pinned Tools
        showPinnedTools();
    }

    // =========================
    // 10. Show Notification Function
    // =========================

    function showNotification(message) {
        notification.innerHTML = `<span>${message}</span>`;
        notification.style.display = 'flex';
        notification.style.animation = 'slideIn 0.5s forwards';

        // After 3 seconds, slide out and hide
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s forwards';
            // Hide after animation completes
            setTimeout(() => {
                notification.style.display = 'none';
            }, 500);
        }, 3000);
    }

    // =========================
    // 11. Toggle Panel Visibility
    // =========================

    // Toggle panel visibility with animation via button click
    spectifyButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling to document
        if (spectifyPanel.classList.contains('visible')) {
            spectifyPanel.classList.remove('visible');
            spectifyPanel.classList.add('hidden');
            // Wait for the transition to complete before hiding
            setTimeout(() => {
                spectifyPanel.style.display = 'none';
            }, 400); // Match the CSS transition duration
        } else {
            spectifyPanel.style.display = 'block';
            // Force reflow to enable the transition
            void spectifyPanel.offsetWidth;
            spectifyPanel.classList.remove('hidden');
            spectifyPanel.classList.add('visible');
        }
    });

    // Close panel when clicking outside with animation
    document.addEventListener('click', (e) => {
        if (!spectifyPanel.contains(e.target) && !spectifyButton.contains(e.target)) {
            if (spectifyPanel.classList.contains('visible')) {
                spectifyPanel.classList.remove('visible');
                spectifyPanel.classList.add('hidden');
                // Wait for the transition to complete before hiding
                setTimeout(() => {
                    spectifyPanel.style.display = 'none';
                }, 400); // Match the CSS transition duration
            }
        }
    });

    // =========================
    // 12. Toggle Spectify Button Visibility via F4 Key
    // =========================

    // Hide the main Spectify button if it was previously hidden
    if (savedSettings.buttonHidden) {
        spectifyButton.style.display = 'none';
    }

    // Function to toggle the Spectify button via F4 key
    function toggleSpectifyButton() {
        if (spectifyButton.style.display === 'none') {
            spectifyButton.style.display = 'flex';
            savedSettings.buttonHidden = false;
            saveSettings(savedSettings);
            showNotification('✅ Spectify menu shown.');
        } else {
            spectifyButton.style.display = 'none';
            savedSettings.buttonHidden = true;
            saveSettings(savedSettings);
            showNotification('❌ Spectify menu hidden.');
            // Also close the settings panel if open
            if (spectifyPanel.classList.contains('visible')) {
                spectifyPanel.classList.remove('visible');
                spectifyPanel.classList.add('hidden');
                setTimeout(() => {
                    spectifyPanel.style.display = 'none';
                }, 400);
            }
        }
    }

    // Listen for F4 key to toggle Spectify button
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F4') {
            e.preventDefault(); // Prevent default action if necessary
            toggleSpectifyButton();
        }
    });

    // =========================
    // 13. Handle Music Player Integration
    // =========================

    const musicURLInput = spectifyPanel.querySelector('#music-url');
    const saveMusicButton = spectifyPanel.querySelector('#save-music');
    const playPauseButton = spectifyPanel.querySelector('#play-pause-music');
    const loopButton = spectifyPanel.querySelector('#loop-button');
    const openMusicPlayerButton = spectifyPanel.querySelector('#open-music-player-button');

    let musicPlayerWindow = null;

    // Reset musicPlaying to false on script load if musicPlayerWindow is not open
    if (!savedSettings.musicPlayerOpen) {
        savedSettings.musicPlaying = false;
        saveSettings(savedSettings);
        playPauseButton.textContent = 'Play Music';
    }

    // Listen for messages from the music player window
    window.addEventListener('message', (event) => {
        // Ensure the message is coming from the same origin
        if (!event.origin.includes('cracked.io')) return;

        const data = event.data;
        if (data.type === 'playerClosed') {
            // Update settings
            savedSettings.musicPlayerOpen = false;
            savedSettings.musicPlaying = false;
            saveSettings(savedSettings);
            playPauseButton.textContent = 'Play Music';
            showNotification('🎵 Music Player Closed.');
        }
    });

    // Save Music Button Click Event
    saveMusicButton.addEventListener('click', () => {
        const url = musicURLInput.value.trim();
        if (validateYouTubeURL(url)) {
            const videoID = extractYouTubeID(url);
            if (videoID) {
                savedSettings.musicURL = url; // Save the full URL
                saveSettings(savedSettings);
                showNotification('🎵 Custom music saved.');
            } else {
                showNotification('❌ Unable to extract Video ID from the provided URL.');
            }
        } else {
            showNotification('❌ Invalid YouTube URL.');
        }
    });

    // Handle Play/Pause Button
    playPauseButton.addEventListener('click', () => {
        if (savedSettings.musicPlaying && musicPlayerWindow && !musicPlayerWindow.closed) {
            // If music is playing, close the music player window to pause
            removeMusicPlayer();
            playPauseButton.textContent = 'Play Music';
            showNotification('⏸️ Music Paused.');
        } else {
            if (savedSettings.musicURL) {
                checkAndOpenMusicPlayer();
                playPauseButton.textContent = 'Pause Music';
                showNotification('🎵 Music Playing.');
                savedSettings.musicPlaying = true;
                saveSettings(savedSettings);
            } else {
                showNotification('❌ No music URL set.');
            }
        }
    });

    // Handle Loop Toggle Button
    loopButton.addEventListener('click', () => {
        savedSettings.musicLoop = !savedSettings.musicLoop;
        saveSettings(savedSettings);
        if (musicPlayerWindow && !musicPlayerWindow.closed) {
            // Send a message to toggle loop
            musicPlayerWindow.postMessage({ type: 'toggleLoop', loop: savedSettings.musicLoop }, '*');
            loopButton.textContent = savedSettings.musicLoop ? 'Disable Loop' : 'Enable Loop';
            showNotification(`🔁 Loop ${savedSettings.musicLoop ? 'Enabled' : 'Disabled'}.`);
        } else {
            // If music is not playing, just update the loop button text
            loopButton.textContent = savedSettings.musicLoop ? 'Disable Loop' : 'Enable Loop';
            showNotification(`🔁 Loop ${savedSettings.musicLoop ? 'Enabled' : 'Disabled'}.`);
        }
    });

    // Handle Open Music Player Button
    openMusicPlayerButton.addEventListener('click', () => {
        if (savedSettings.musicURL) {
            checkAndOpenMusicPlayer();
        } else {
            showNotification('❌ No music URL set.');
        }
    });

    // Function to validate YouTube URL
    function validateYouTubeURL(url) {
        const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
        return regex.test(url);
    }

    // =========================
    // 14. Handle Remove Music Player
    // =========================

    // Function to remove existing music player window
    function removeMusicPlayer() {
        if (savedSettings.musicPlayerOpen) {
            if (musicPlayerWindow && !musicPlayerWindow.closed) {
                // Send a message to close the music player
                musicPlayerWindow.postMessage({ type: 'playerClosed' }, '*');
                musicPlayerWindow.close();
                savedSettings.musicPlayerOpen = false;
                savedSettings.musicPlaying = false;
                saveSettings(savedSettings);
                showNotification('🎵 Music Player Closed.');
                // Reset play/pause button
                const playPauseButton = spectifyPanel.querySelector('#play-pause-music');
                if (playPauseButton) playPauseButton.textContent = 'Play Music';
            }
        }
    }

    // =========================
    // 15. Apply Theme-Specific Enhancements
    // =========================

    function applyThemeEnhancements(theme) {
        if (theme === 'Christmas') {
            // Always enable particles with white color for snow effect
            savedSettings.particlesEnabled = true;
            savedSettings.particleColor = '#FFFFFF'; // White color
            spectifyPanel.querySelector('#particle-color').value = '#FFFFFF';
            spectifyPanel.querySelector('#particle-color').disabled = true; // Disable color picker
            spectifyPanel.querySelector('#particles-toggle').checked = true;
            spectifyPanel.querySelector('#particles-toggle').disabled = true; // Disable toggle
            addParticleEffects();
            // Apply color-scheme: light;
            document.documentElement.style.colorScheme = 'light';
            // Reset element removal settings
            resetElementRemovalSettings();
            saveSettings(savedSettings);
            showNotification('🎄 Christmas enhancements applied.');
        } else if (theme === 'Space Theme') { // Handle Space Theme
            // Enable particles by default
            savedSettings.particlesEnabled = true;
            spectifyPanel.querySelector('#particles-toggle').checked = true;
            spectifyPanel.querySelector('#particles-toggle').disabled = false; // Ensure toggle is enabled
            addParticleEffects();
            // Apply color-scheme: dark;
            document.documentElement.style.colorScheme = 'dark';
            saveSettings(savedSettings);
            showNotification(`🌌 "${theme}" theme applied with particles enabled.`);
        } else if (theme === 'Forest Green') { // Handle Forest Green theme
            // Enable particles based on user preference
            if (savedSettings.particlesEnabled) {
                addParticleEffects();
            }
            // Apply color-scheme: light;
            document.documentElement.style.colorScheme = 'light';
            saveSettings(savedSettings);
            showNotification(`🌲 "${theme}" theme applied.`);
        } else {
            // Remove color-scheme if not specified
            document.documentElement.style.colorScheme = '';
            // Restore particle settings based on user preference
            if (savedSettings.particlesEnabled) {
                removeParticleEffects(); // Remove existing particles to prevent duplication
                addParticleEffects(); // Add particles with current settings
            } else {
                removeParticleEffects();
            }
            saveSettings(savedSettings);
            showNotification(`🌈 "${theme}" theme applied.`);
        }
    }



    // =========================
    // 17. Handle Particle Settings
    // =========================

    const particlesToggle = spectifyPanel.querySelector('#particles-toggle');
    const particleColorInput = spectifyPanel.querySelector('#particle-color');
    const particleWindSlider = spectifyPanel.querySelector('#particle-wind');

    // Initialize Particle Settings
    particlesToggle.checked = savedSettings.particlesEnabled;
    particleColorInput.value = savedSettings.particleColor;
    particleWindSlider.value = savedSettings.particleWind;

    // Handle Particle Toggle
    particlesToggle.addEventListener('change', (e) => {
        // Prevent disabling particles if theme is Christmas or Space Theme
        if (savedSettings.theme === 'Christmas' || savedSettings.theme === 'Space Theme') {
            showNotification('❗ Particles are always enabled for the selected theme.');
            particlesToggle.checked = true;
            return;
        }

        savedSettings.particlesEnabled = e.target.checked;
        saveSettings(savedSettings);
        if (savedSettings.particlesEnabled) {
            addParticleEffects();
            showNotification('✨ Particle Effects Enabled.');
        } else {
            removeParticleEffects();
            showNotification('✨ Particle Effects Disabled.');
        }
    });

    // Handle Particle Color Change
    particleColorInput.addEventListener('input', (e) => {
        if (savedSettings.theme === 'Christmas') {
            // Force particle color to white for Christmas
            savedSettings.particleColor = '#FFFFFF';
            particleColorInput.value = '#FFFFFF';
            updateParticleStyles();
            showNotification('🎨 Particle color is fixed for the selected theme.');
            return;
        }
        savedSettings.particleColor = e.target.value;
        updateParticleStyles();
        saveSettings(savedSettings);
    });

    // Handle Falling Randomness Change
    particleWindSlider.addEventListener('input', (e) => {
        savedSettings.particleWind = parseInt(e.target.value, 10);
        updateParticleStyles();
        saveSettings(savedSettings);
    });

    // Function to update particle styles based on settings
    function updateParticleStyles() {
        const root = document.documentElement;
        root.style.setProperty('--particle-color', savedSettings.particleColor);
        // Set particle-sway-amplitude based on Falling Randomness
        const swayAmplitude = savedSettings.particleWind;
        root.style.setProperty('--particle-sway-amplitude', `${swayAmplitude}px`);
    }

    // Function to add particle effects
    function addParticleEffects() {
        if (document.getElementById('spectify-particles')) return; // Prevent duplicates

        const particles = document.createElement('div');
        particles.id = 'spectify-particles';
        // Create multiple particles with random sway amplitudes
        for (let i = 0; i < 100; i++) { // Increased to 100 for a denser snow-like effect
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5-10 seconds
            const swayAmplitude = Math.random() * savedSettings.particleWind; // Random amplitude up to Falling Randomness
            particle.style.setProperty('--particle-sway-amplitude', `${swayAmplitude}px`);
            particles.appendChild(particle);
        }
        document.body.appendChild(particles);
        updateParticleStyles();
    }

    // Function to remove particle effects
    function removeParticleEffects() {
        const particles = document.getElementById('spectify-particles');
        if (particles) {
            particles.remove();
        }
    }

    // =========================
    // 18. Handle Additional Color Pickers
    // =========================

    const reputationPositiveColorInput = spectifyPanel.querySelector('#reputation-positive-color');
    const helpdocsNumberColorInput = spectifyPanel.querySelector('#helpdocs-number-color');
    const themeTextColorInput = spectifyPanel.querySelector('#theme-text-color'); // Removed
    const panelUpperIconColorInput = spectifyPanel.querySelector('#panel-upper-icon-color'); // New color picker
    const trowBorderTopColorInput = spectifyPanel.querySelector('#trow-border-top-color'); // Table Row Border Top Color
    const footerColorInput = spectifyPanel.querySelector('#footer-color'); // Footer Color

    reputationPositiveColorInput.addEventListener('input', (e) => {
        const color = e.target.value;
        savedSettings.reputationPositiveColor = color;
        document.documentElement.style.setProperty('--reputation-positive-color', color);
        saveSettings(savedSettings);
    });

    helpdocsNumberColorInput.addEventListener('input', (e) => {
        const color = e.target.value;
        savedSettings.helpdocsNumberColor = color;
        document.documentElement.style.setProperty('--helpdocs-number-color', color);
        saveSettings(savedSettings);
    });

    panelUpperIconColorInput.addEventListener('input', (e) => {
        const color = e.target.value;
        savedSettings.panelUpperIconColor = color;
        document.documentElement.style.setProperty('--panel-upper-icon-color', color);
        saveSettings(savedSettings);
    });

    // Handle Table Row Border Top Color Change
    trowBorderTopColorInput.addEventListener('input', (e) => {
        const color = e.target.value;
        savedSettings.trowBorderTopColor = color;
        document.documentElement.style.setProperty('--trow-border-top-color', color);
        saveSettings(savedSettings);
    });

    // Handle Footer Color Change
    // Append the Footer Color input if not already present
    const footerColorLabel = spectifyPanel.querySelector('label[for="footer-color"]');
    if (!footerColorLabel) {
        const additionalElementsSection = spectifyPanel.querySelector('.spectify-section:nth-child(4)');
        additionalElementsSection.innerHTML += `
            <label for="footer-color">Footer Color:</label>
            <input type="color" id="footer-color" value="${savedSettings.footerColor || baseThemes[savedSettings.theme]['--footer-color']}">
        `;
    }

    const footerColorInputUpdated = spectifyPanel.querySelector('#footer-color');

    footerColorInputUpdated.addEventListener('input', (e) => {
        const color = e.target.value;
        savedSettings.footerColor = color;
        document.documentElement.style.setProperty('--footer-color', color);
        saveSettings(savedSettings);
    });

    // =========================
    // 19. Hotkey F2 to Toggle Particle Effects
    // =========================

    // Function to Toggle Particle Effects
    function toggleParticleEffects() {
        if (savedSettings.particlesEnabled) {
            // Prevent disabling particles if current theme enforces it
            if (savedSettings.theme === 'Christmas' || savedSettings.theme === 'Space Theme') {
                showNotification('❗ Particles are always enabled for the selected theme.');
                spectifyPanel.querySelector('#particles-toggle').checked = true;
                return;
            }
            removeParticleEffects();
            savedSettings.particlesEnabled = false;
            spectifyPanel.querySelector('#particles-toggle').checked = false;
            showNotification('✨ Particle Effects Disabled.');
        } else {
            addParticleEffects();
            savedSettings.particlesEnabled = true;
            spectifyPanel.querySelector('#particles-toggle').checked = true;
            showNotification('✨ Particle Effects Enabled.');
        }
        saveSettings(savedSettings);
    }

    // Listen for F2 key to toggle Particle Effects
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            e.preventDefault();
            toggleParticleEffects();
        }
    });

    // =========================
    // 20. Final Initialization
    // =========================

    function checkAutoplayOnLoad() {
        // Autoplay functionality has been removed
        // No initialization required
    }

    // Apply theme-specific enhancements on initialization
    applyThemeEnhancements(savedSettings.theme);

    checkAutoplayOnLoad();
    updateParticleStyles();

    // =========================
    // 21. Ensure Only One Music Player Instance
    // =========================

    // Ensure the music player is only opened once
    function checkAndOpenMusicPlayer() {
        // Check if the window reference is still valid
        if (musicPlayerWindow && !musicPlayerWindow.closed) {
            // Music player is already open, focus on it
            musicPlayerWindow.focus();
            showNotification('🎵 Music Player is already open.');
            return;
        }
        // Music player is not open, open a new one
        openMusicPlayer();
    }

    // =========================
    // 22. Handle Music Player Messages
    // =========================

    // Function to handle messages from the music player window
    window.addEventListener('message', (event) => {
        // Ensure the message is coming from the correct origin
        if (!event.origin.includes('cracked.io')) return;

        const data = event.data;
        if (data.type === 'playerClosed') {
            // Update settings
            savedSettings.musicPlayerOpen = false;
            savedSettings.musicPlaying = false;
            saveSettings(savedSettings);
            playPauseButton.textContent = 'Play Music';
            showNotification('🎵 Music Player Closed.');
        }
    });

    // =========================
    // Function Definitions
    // =========================

    // Function to open Music Player by creating a Blob URL
    function openMusicPlayer() {
        const videoID = extractYouTubeID(savedSettings.musicURL);
        if (!videoID) {
            showNotification('❌ Invalid YouTube URL.');
            return;
        }

        // Construct iframe src without autoplay
        const loopParam = savedSettings.musicLoop ? `&loop=1&playlist=${videoID}` : '';
        const iframeSrc = `https://www.youtube.com/embed/${videoID}?${loopParam}&controls=0&showinfo=0&rel=0&modestbranding=1`;

        // Define the HTML content for the music player
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Spectify Music Player</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background: #000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        overflow: hidden;
                        position: relative;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    iframe#player {
                        width: 100%;
                        height: 100%;
                        border: none;
                        opacity: 0.9;
                        border-radius: 8px;
                        transition: opacity 0.3s;
                    }
                    #controls {
                        position: absolute;
                        bottom: 10px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 10px;
                    }
                    .control-button {
                        padding: 5px 10px;
                        background: #2323237a;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.3s, transform 0.3s;
                    }
                    .control-button:hover {
                        background: #FF7518;
                        transform: scale(1.05);
                    }
                    .control-button:active {
                        transform: scale(0.95);
                    }
                </style>
            </head>
            <body>
                <iframe id="player" src="${iframeSrc}" allow="autoplay; encrypted-media"></iframe>
                <div id="controls">
                    <button id="close-player" class="control-button">Close</button>
                </div>
                <script>
                    // Function to handle messages from the parent window
                    window.addEventListener('message', (event) => {
                        // Ensure the message is coming from the correct origin
                        if (!event.origin.includes('cracked.io')) return;

                        const data = event.data;
                        const iframe = document.getElementById('player');
                        if (data.type === 'toggleLoop') {
                            const videoID = '${videoID}';
                            if (data.loop) {
                                iframe.src = 'https://www.youtube.com/embed/' + videoID + '?loop=1&playlist=' + videoID + '&controls=0&showinfo=0&rel=0&modestbranding=1';
                            } else {
                                iframe.src = 'https://www.youtube.com/embed/' + videoID + '?controls=0&showinfo=0&rel=0&modestbranding=1';
                            }
                        }
                    });

                    // Handle close button
                    const closeButton = document.getElementById('close-player');
                    closeButton.addEventListener('click', () => {
                        window.opener.postMessage({ type: 'playerClosed' }, '*');
                        window.close();
                    });

                    // Automatically inform the parent window if this window is closed
                    window.addEventListener('beforeunload', () => {
                        window.opener.postMessage({ type: 'playerClosed' }, '*');
                    });
                </script>
            </body>
            </html>
        `;

        // Create a Blob from the HTML content
        const blob = new Blob([htmlContent], {type: 'text/html'});
        const blobURL = URL.createObjectURL(blob);

        // Open a new window with desired features
        musicPlayerWindow = window.open(blobURL, 'SpectifyMusicPlayer', 'width=420,height=300,left=100,top=100,toolbar=no,menubar=no,location=no,status=no,scrollbars=no,resizable=no');

        if (!musicPlayerWindow) {
            showNotification('❌ Unable to open music player window. Please allow popups for cracked.io.');
            return;
        }

        // Update settings
        savedSettings.musicPlayerOpen = true;
        savedSettings.musicPlaying = true;
        saveSettings(savedSettings);
        showNotification('🎵 Music Player Opened.');
    }

    // =========================
    // 23. Handle Element Removal
    // =========================

    const removeAdsButton = spectifyPanel.querySelector('#remove-ads-button');
    const removeShoutboxButton = spectifyPanel.querySelector('#remove-shoutbox-button');
    const removePinnedToolsButton = spectifyPanel.querySelector('#remove-pinned-tools-button');

    // Event Listener for Remove Ads Button
    removeAdsButton.addEventListener('click', () => {
        if (!savedSettings.adsRemoved) {
            removeAds();
        } else {
            showAds();
        }
    });

    // Event Listener for Remove Shoutbox Button
    removeShoutboxButton.addEventListener('click', () => {
        if (!savedSettings.shoutboxRemoved) {
            removeShoutbox();
        } else {
            showShoutbox();
        }
    });

    // Event Listener for Remove Pinned Tools Button
    removePinnedToolsButton.addEventListener('click', () => {
        if (!savedSettings.pinnedToolsRemoved) {
            removePinnedTools();
        } else {
            showPinnedTools();
        }
    });

    // Function to remove Ads
    function removeAds() {
        // Select all ad containers
        const adContainers = [
            ...document.querySelectorAll('div.inner_stuff'),
            ...document.querySelectorAll('div.scaleimages')
        ];

        adContainers.forEach(container => {
            container.classList.add('spectify-hidden');
            // Optional: Remove from DOM after transition
            setTimeout(() => {
                container.style.display = 'none';
            }, 500); // Match the CSS transition duration
        });

        // Update button text
        removeAdsButton.textContent = 'Show Ads';
        // Update settings
        savedSettings.adsRemoved = true;
        saveSettings(savedSettings);
        showNotification('🛑 Ads Removed.');
    }

    // Function to show Ads
    function showAds() {
        // Select all ad containers
        const adContainers = [
            ...document.querySelectorAll('div.inner_stuff'),
            ...document.querySelectorAll('div.scaleimages')
        ];

        adContainers.forEach(container => {
            container.style.display = 'block';
            // Trigger reflow to apply transition
            void container.offsetWidth;
            container.classList.remove('spectify-hidden');
        });

        // Update button text
        removeAdsButton.textContent = 'Remove Ads';
        // Update settings
        savedSettings.adsRemoved = false;
        saveSettings(savedSettings);
        showNotification('✅ Ads Shown.');
    }

    // Function to remove Shoutbox
    function removeShoutbox() {
        const shoutbox = document.getElementById('shoutbox');
        if (shoutbox) {
            shoutbox.classList.add('spectify-hidden');
            setTimeout(() => {
                shoutbox.style.display = 'none';
            }, 500); // Match the CSS transition duration
            removeShoutboxButton.textContent = 'Show Shoutbox';
            savedSettings.shoutboxRemoved = true;
            saveSettings(savedSettings);
            showNotification('🛑 Shoutbox Removed.');
        }
    }

    // Function to show Shoutbox
    function showShoutbox() {
        const shoutbox = document.getElementById('shoutbox');
        if (shoutbox) {
            shoutbox.style.display = 'block';
            void shoutbox.offsetWidth;
            shoutbox.classList.remove('spectify-hidden');
            removeShoutboxButton.textContent = 'Remove Shoutbox';
            savedSettings.shoutboxRemoved = false;
            saveSettings(savedSettings);
            showNotification('✅ Shoutbox Shown.');
        }
    }

    // Function to remove Pinned Tools
    function removePinnedTools() {
        // Assuming Pinned Tools are within a specific div, adjust the selector as needed
        const pinnedToolsContainers = [
            ...document.querySelectorAll('div.align-center'), // Adjust selector based on actual structure
            ...document.querySelectorAll('div[align="center"]')
        ];

        pinnedToolsContainers.forEach(container => {
            container.classList.add('spectify-hidden');
            setTimeout(() => {
                container.style.display = 'none';
            }, 500); // Match the CSS transition duration
        });

        removePinnedToolsButton.textContent = 'Show Pinned Tools';
        savedSettings.pinnedToolsRemoved = true;
        saveSettings(savedSettings);
        showNotification('🛑 Pinned Tools Removed.');
    }

    // Function to show Pinned Tools
    function showPinnedTools() {
        // Assuming Pinned Tools are within a specific div, adjust the selector as needed
        const pinnedToolsContainers = [
            ...document.querySelectorAll('div.align-center'), // Adjust selector based on actual structure
            ...document.querySelectorAll('div[align="center"]')
        ];

        pinnedToolsContainers.forEach(container => {
            container.style.display = 'block';
            void container.offsetWidth;
            container.classList.remove('spectify-hidden');
        });

        removePinnedToolsButton.textContent = 'Remove Pinned Tools';
        savedSettings.pinnedToolsRemoved = false;
        saveSettings(savedSettings);
        showNotification('✅ Pinned Tools Shown.');
    }

    // =========================
    // 24. Initialize Element Removal Based on Saved Settings
    // =========================

    function initializeElementRemoval() {
        if (savedSettings.adsRemoved) {
            removeAds();
        }
        if (savedSettings.shoutboxRemoved) {
            removeShoutbox();
        }
        if (savedSettings.pinnedToolsRemoved) {
            removePinnedTools();
        }
    }

    // Initialize Element Removal on script load only if on the homepage
    if (
        window.location.hostname === 'cracked.io' &&
        (window.location.pathname === '/' || window.location.pathname === '/index.html')
    ) {
        initializeElementRemoval();
    }

    // =========================
    // 25. Additional Enhancements
    // =========================

    // Function to handle particle color updates smoothly
    // Already handled by CSS transitions

    // Function to ensure footer color is applied
    document.documentElement.style.setProperty('--footer-color', savedSettings.footerColor || baseThemes[savedSettings.theme]['--footer-color']);

    // Update the footer background color
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.background = 'var(--footer-color)';
        footer.style.transition = 'background 0.5s ease';
    }

})();
