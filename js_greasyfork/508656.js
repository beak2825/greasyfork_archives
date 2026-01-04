// ==UserScript==
// @name         JanitorAI Context Maker
// @namespace    http://tampermonkey.net/
// @version      5.7.3
// @license MIT
// @description  Adds a Location and Character System to JanitorAI with nested grouping functionality
// @match        https://janitorai.com/chats/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://janitorai.com/
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/508656/JanitorAI%20Context%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/508656/JanitorAI%20Context%20Maker.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let c_radius = 300;
    let c_labelFontSize = 12;
    let c_nodeSize = 24;
    let l_radius = 300;
    let l_labelFontSize = 12;
    let l_nodeSize = 24;

    let customContextMenu;
    let initialMouseX;
    let initialMouseY;
    const hideDistance = 100; // Distance in pixels to hide the menu
    let ItemTransferTarget = null;

    //.addEventListener('contextmenu', showMenu);
    function CreateContextMenu(mainColor, textColor, borderColor, optionNames, optionFunctions) {
        // Destroy existing menu if present
        DestroyContextMenu();

        // Create a new custom menu
        customContextMenu = document.createElement('div');
        customContextMenu.style.position = 'absolute';
        customContextMenu.style.background = mainColor;
        customContextMenu.style.color = textColor;
        customContextMenu.style.border = `1px solid ${borderColor}`; // Use the borderColor parameter

        // Adjusted padding for 2/3 size
        customContextMenu.style.padding = '3.33px 6.67px';
        customContextMenu.style.display = 'none';
        customContextMenu.style.zIndex = '99999999'; // High z-index

        // Add menu items with dividers
        optionNames.forEach((name, index) => {
            const menuItem = document.createElement('div');

            // Adjusted padding and font size for 2/3 size
            menuItem.style.padding = '3.33px 0';
            menuItem.style.cursor = 'pointer';
            menuItem.style.fontSize = '0.67em';
            menuItem.textContent = name;
            menuItem.addEventListener('click', () => {
                optionFunctions[index]();
                hideMenu();
            });

            // Append menu item
            customContextMenu.appendChild(menuItem);

            // Add a divider except after the last item
            if (index < optionNames.length - 1) {
                const divider = document.createElement('div');
                divider.style.borderTop = `1px solid ${borderColor}`; // Use the borderColor parameter
                customContextMenu.appendChild(divider);
            }
        });

        // Append the menu to the body
        document.body.appendChild(customContextMenu);

        // Check mouse distance
        document.addEventListener('mousemove', trackMouseDistance);
    }

    function DestroyContextMenu() {
        if (customContextMenu) {
            customContextMenu.remove();
            document.removeEventListener('contextmenu', showMenu);
            document.removeEventListener('click', hideMenu);
            document.removeEventListener('mousemove', trackMouseDistance);
            customContextMenu = null;
        }
    }

    function showMenu(event) {
        event.preventDefault();
        initialMouseX = event.clientX;
        initialMouseY = event.clientY;
        if (customContextMenu) {
            customContextMenu.style.top = `${event.clientY}px`;
            customContextMenu.style.left = `${event.clientX}px`;
            customContextMenu.style.display = 'block';
        }
    }

    function hideMenu() {
        if (customContextMenu) {
            customContextMenu.style.display = 'none';
        }
    }

    function trackMouseDistance(event) {
        if (customContextMenu && customContextMenu.style.display === 'block') {
            const distance = Math.sqrt(
                Math.pow(event.clientX - initialMouseX, 2) +
                Math.pow(event.clientY - initialMouseY, 2)
            );
            if (distance > hideDistance && !customContextMenu.contains(event.target)) {
                hideMenu();
            }
        }
    }

    // Define Themes
    const themes = {
        // Default Dark Theme
        dark: {
            '--bg-color': 'rgba(34, 34, 34, var(--ui-transparency))',
            '--bg-color-full': 'rgba(34, 34, 34, 1)',
            '--bg-tool': 'rgba(34, 34, 34, 0.8)',
            '--text-color': '#ffffff',
            '--text-color-darker': '#cccccc',
            '--border-color': 'rgba(68, 68, 68, var(--ui-transparency))',
            '--button-bg-color': 'rgba(0, 123, 255, var(--ui-transparency))',
            '--active-char-color': 'rgba(173, 216, 230, var(--ui-transparency))',
            '--success-bg-color': 'rgba(40, 167, 69, var(--ui-transparency))',
            '--info-bg-color': 'rgba(23, 162, 184, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 193, 7, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(108, 117, 125, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(220, 53, 69, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.5)',
            '--link-color': '#8cb3ff',
            '--code-bg-color': 'rgba(0, 0, 0, 0.3)',
            '--code-text-color': '#ff9d00'
        },

        // Default Light Theme
        light: {
            '--bg-color': 'rgba(255, 255, 255, var(--ui-transparency))',
            '--bg-color-full': 'rgba(255, 255, 255, 1)',
            '--bg-tool': 'rgba(255, 255, 255, 0.8)',
            '--text-color': '#000000',
            '--text-color-darker': '#333333',
            '--border-color': 'rgba(204, 204, 204, var(--ui-transparency))',
            '--button-bg-color': 'rgba(0, 123, 255, var(--ui-transparency))',
            '--active-char-color': 'rgba(173, 216, 230, var(--ui-transparency))',
            '--success-bg-color': 'rgba(40, 167, 69, var(--ui-transparency))',
            '--info-bg-color': 'rgba(23, 162, 184, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 193, 7, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(108, 117, 125, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(220, 53, 69, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.1)',
            '--link-color': '#007bff',
            '--code-bg-color': 'rgba(0, 0, 0, 0.05)',
            '--code-text-color': '#d63384'
        },

        // Sepia Themes
        sepia_light: {
            '--bg-color': 'rgba(244, 232, 208, var(--ui-transparency))',
            '--bg-color-full': 'rgba(244, 232, 208, 1)',
            '--bg-tool': 'rgba(244, 232, 208, 0.8)',
            '--text-color': '#2e241c',
            '--text-color-darker': '#1a140f',
            '--border-color': 'rgba(193, 154, 107, var(--ui-transparency))',
            '--button-bg-color': 'rgba(160, 82, 45, var(--ui-transparency))',
            '--active-char-color': 'rgba(210, 180, 140, var(--ui-transparency))',
            '--success-bg-color': 'rgba(107, 68, 35, var(--ui-transparency))',
            '--info-bg-color': 'rgba(194, 148, 110, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(215, 172, 116, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(160, 130, 94, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(168, 96, 50, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.3)',
            '--link-color': '#6c757d',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#a0522d'
        },
        sepia_dark: {
            '--bg-color': 'rgba(60, 45, 31, var(--ui-transparency))',
            '--bg-color-full': 'rgba(60, 45, 31, 1)',
            '--bg-tool': 'rgba(60, 45, 31, 0.8)',
            '--text-color': '#d8c6b2',
            '--text-color-darker': '#b8a493',
            '--border-color': 'rgba(102, 75, 50, var(--ui-transparency))',
            '--button-bg-color': 'rgba(139, 69, 19, var(--ui-transparency))',
            '--active-char-color': 'rgba(210, 180, 140, var(--ui-transparency))',
            '--success-bg-color': 'rgba(107, 68, 35, var(--ui-transparency))',
            '--info-bg-color': 'rgba(139, 101, 68, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(205, 133, 63, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(122, 91, 62, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(165, 42, 42, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.6)',
            '--link-color': '#d2b48c',
            '--code-bg-color': 'rgba(0, 0, 0, 0.3)',
            '--code-text-color': '#deb887'
        },

        // Solarized Themes
        solarized_light: {
            '--bg-color': 'rgba(253, 246, 227, var(--ui-transparency))',
            '--bg-color-full': 'rgba(253, 246, 227, 1)',
            '--bg-tool': 'rgba(253, 246, 227, 0.8)',
            '--text-color': '#47565c',
            '--text-color-darker': '#2c3438',
            '--border-color': 'rgba(238, 232, 213, var(--ui-transparency))',
            '--button-bg-color': 'rgba(38, 139, 210, var(--ui-transparency))',
            '--active-char-color': 'rgba(133, 153, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(133, 153, 0, var(--ui-transparency))',
            '--info-bg-color': 'rgba(38, 139, 210, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(181, 137, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(147, 161, 161, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(220, 50, 47, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.2)',
            '--link-color': '#2aa198',
            '--code-bg-color': 'rgba(0, 43, 54, 0.7)',
            '--code-text-color': '#cb4b16'
        },
        solarized_dark: {
            '--bg-color': 'rgba(0, 43, 54, var(--ui-transparency))',
            '--bg-color-full': 'rgba(0, 43, 54, 1)',
            '--bg-tool': 'rgba(0, 43, 54, 0.8)',
            '--text-color': '#eee8d5',
            '--text-color-darker': '#cdc5b0',
            '--border-color': 'rgba(7, 54, 66, var(--ui-transparency))',
            '--button-bg-color': 'rgba(38, 139, 210, var(--ui-transparency))',
            '--active-char-color': 'rgba(133, 153, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(133, 153, 0, var(--ui-transparency))',
            '--info-bg-color': 'rgba(38, 139, 210, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(181, 137, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(88, 110, 117, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(220, 50, 47, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.4)',
            '--link-color': '#2aa198',
            '--code-bg-color': 'rgba(253, 246, 227, 0.1)',
            '--code-text-color': '#cb4b16'
        },

        // Forest Themes (Green)
        forest_light: {
            '--bg-color': 'rgba(233, 245, 233, var(--ui-transparency))',
            '--bg-color-full': 'rgba(233, 245, 233, 1)',
            '--bg-tool': 'rgba(233, 245, 233, 0.8)',
            '--text-color': '#2f4f2f',
            '--text-color-darker': '#1c2f1c',
            '--border-color': 'rgba(209, 230, 209, var(--ui-transparency))',
            '--button-bg-color': 'rgba(60, 179, 113, var(--ui-transparency))',
            '--active-char-color': 'rgba(34, 139, 34, var(--ui-transparency))',
            '--success-bg-color': 'rgba(144, 238, 144, var(--ui-transparency))',
            '--info-bg-color': 'rgba(60, 179, 113, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(240, 230, 140, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(152, 251, 152, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(205, 92, 92, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.2)',
            '--link-color': '#3cb371',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#8b4513'
        },
        forest_dark: {
            '--bg-color': 'rgba(34, 49, 34, var(--ui-transparency))',
            '--bg-color-full': 'rgba(34, 49, 34, 1)',
            '--bg-tool': 'rgba(34, 49, 34, 0.8)',
            '--text-color': '#e0f7e9',
            '--text-color-darker': '#b0c7b9',
            '--border-color': 'rgba(46, 61, 46, var(--ui-transparency))',
            '--button-bg-color': 'rgba(60, 179, 113, var(--ui-transparency))',
            '--active-char-color': 'rgba(144, 238, 144, var(--ui-transparency))',
            '--success-bg-color': 'rgba(34, 139, 34, var(--ui-transparency))',
            '--info-bg-color': 'rgba(144, 238, 144, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(189, 183, 107, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(85, 107, 47, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(139, 69, 19, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.4)',
            '--link-color': '#8fbc8f',
            '--code-bg-color': 'rgba(0, 0, 0, 0.3)',
            '--code-text-color': '#ffd700'
        },

        // Ocean Themes (Blue)
        ocean_light: {
            '--bg-color': 'rgba(224, 244, 252, var(--ui-transparency))',
            '--bg-color-full': 'rgba(224, 244, 252, 1)',
            '--bg-tool': 'rgba(224, 244, 252, 0.8)',
            '--text-color': '#004766',
            '--text-color-darker': '#00334c',
            '--border-color': 'rgba(204, 232, 245, var(--ui-transparency))',
            '--button-bg-color': 'rgba(0, 123, 255, var(--ui-transparency))',
            '--active-char-color': 'rgba(173, 216, 230, var(--ui-transparency))',
            '--success-bg-color': 'rgba(60, 179, 113, var(--ui-transparency))',
            '--info-bg-color': 'rgba(23, 162, 184, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 193, 7, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(108, 117, 125, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(220, 53, 69, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.2)',
            '--link-color': '#0077b6',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#ff7f50'
        },
        ocean_dark: {
            '--bg-color': 'rgba(0, 30, 60, var(--ui-transparency))',
            '--bg-color-full': 'rgba(0, 30, 60, 1)',
            '--bg-tool': 'rgba(0, 30, 60, 0.8)',
            '--text-color': '#ffffff',
            '--text-color-darker': '#cccccc',
            '--border-color': 'rgba(0, 53, 102, var(--ui-transparency))',
            '--button-bg-color': 'rgba(0, 123, 255, var(--ui-transparency))',
            '--active-char-color': 'rgba(135, 206, 235, var(--ui-transparency))',
            '--success-bg-color': 'rgba(46, 139, 87, var(--ui-transparency))',
            '--info-bg-color': 'rgba(0, 96, 100, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 140, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(47, 79, 79, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(139, 0, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.5)',
            '--link-color': '#00ffff',
            '--code-bg-color': 'rgba(0, 0, 0, 0.4)',
            '--code-text-color': '#ff7f50'
        },

        // Sunset Themes (Red/Orange)
        sunset_light: {
            '--bg-color': 'rgba(255, 237, 219, var(--ui-transparency))',
            '--bg-color-full': 'rgba(255, 237, 219, 1)',
            '--bg-tool': 'rgba(255, 237, 219, 0.8)',
            '--text-color': '#5d1a1a',
            '--text-color-darker': '#3b0f0f',
            '--border-color': 'rgba(255, 214, 170, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 87, 34, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 152, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(255, 179, 71, var(--ui-transparency))',
            '--info-bg-color': 'rgba(255, 138, 101, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 112, 67, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(255, 224, 178, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(183, 28, 28, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.2)',
            '--link-color': '#e65100',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#d50000'
        },
        sunset_dark: {
            '--bg-color': 'rgba(66, 28, 82, var(--ui-transparency))',
            '--bg-color-full': 'rgba(66, 28, 82, 1)',
            '--bg-tool': 'rgba(66, 28, 82, 0.8)',
            '--text-color': '#fce4ec',
            '--text-color-darker': '#f8bbd0',
            '--border-color': 'rgba(127, 63, 152, var(--ui-transparency))',
            '--button-bg-color': 'rgba(233, 30, 99, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 64, 129, var(--ui-transparency))',
            '--success-bg-color': 'rgba(186, 104, 200, var(--ui-transparency))',
            '--info-bg-color': 'rgba(142, 36, 170, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(216, 27, 96, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(123, 31, 162, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(74, 20, 140, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.4)',
            '--link-color': '#d81b60',
            '--code-bg-color': 'rgba(0, 0, 0, 0.3)',
            '--code-text-color': '#f50057'
        },

        // Sunshine Themes (Yellow)
        sunshine_light: {
            '--bg-color': 'rgba(255, 249, 196, var(--ui-transparency))',
            '--bg-color-full': 'rgba(255, 249, 196, 1)',
            '--bg-tool': 'rgba(255, 249, 196, 0.8)',
            '--text-color': '#795548',
            '--text-color-darker': '#5d4037',
            '--border-color': 'rgba(255, 241, 118, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 235, 59, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 179, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(253, 216, 53, var(--ui-transparency))',
            '--info-bg-color': 'rgba(255, 202, 40, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 193, 7, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(255, 224, 130, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 152, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.2)',
            '--link-color': '#ffab00',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#ff6f00'
        },
        sunshine_dark: {
            '--bg-color': 'rgba(50, 50, 0, var(--ui-transparency))',
            '--bg-color-full': 'rgba(50, 50, 0, 1)',
            '--bg-tool': 'rgba(50, 50, 0, 0.8)',
            '--text-color': '#fff9c4',
            '--text-color-darker': '#fff59d',
            '--border-color': 'rgba(85, 85, 0, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 214, 0, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 171, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(255, 238, 88, var(--ui-transparency))',
            '--info-bg-color': 'rgba(255, 235, 59, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 193, 7, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(212, 175, 55, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 111, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.4)',
            '--link-color': '#ffab00',
            '--code-bg-color': 'rgba(0, 0, 0, 0.3)',
            '--code-text-color': '#ff6f00'
        },

        // Twilight Themes (Indigo/Violet)
        twilight_light: {
            '--bg-color': 'rgba(230, 230, 250, var(--ui-transparency))',
            '--bg-color-full': 'rgba(230, 230, 250, 1)',
            '--bg-tool': 'rgba(230, 230, 250, 0.8)',
            '--text-color': '#4b0082',
            '--text-color-darker': '#2e0047',
            '--border-color': 'rgba(216, 191, 216, var(--ui-transparency))',
            '--button-bg-color': 'rgba(75, 0, 130, var(--ui-transparency))',
            '--active-char-color': 'rgba(138, 43, 226, var(--ui-transparency))',
            '--success-bg-color': 'rgba(111, 0, 255, var(--ui-transparency))',
            '--info-bg-color': 'rgba(153, 50, 204, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(186, 85, 211, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(148, 0, 211, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(199, 21, 133, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.2)',
            '--link-color': '#8a2be2',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#9400d3'
        },
        twilight_dark: {
            '--bg-color': 'rgba(18, 10, 30, var(--ui-transparency))',
            '--bg-color-full': 'rgba(18, 10, 30, 1)',
            '--bg-tool': 'rgba(18, 10, 30, 0.8)',
            '--text-color': '#d8bfd8',
            '--text-color-darker': '#dda0dd',
            '--border-color': 'rgba(49, 24, 73, var(--ui-transparency))',
            '--button-bg-color': 'rgba(138, 43, 226, var(--ui-transparency))',
            '--active-char-color': 'rgba(153, 50, 204, var(--ui-transparency))',
            '--success-bg-color': 'rgba(186, 85, 211, var(--ui-transparency))',
            '--info-bg-color': 'rgba(148, 0, 211, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(221, 160, 221, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(123, 104, 238, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(199, 21, 133, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.4)',
            '--link-color': '#ba55d3',
            '--code-bg-color': 'rgba(0, 0, 0, 0.3)',
            '--code-text-color': '#ee82ee'
        },

        // Terminal Themes
        terminal_light: {
            '--bg-color': 'rgba(255, 255, 255, var(--ui-transparency))',
            '--bg-color-full': 'rgba(255, 255, 255, 1)',
            '--bg-tool': 'rgba(255, 255, 255, 0.8)',
            '--text-color': '#00ff00',
            '--text-color-darker': '#00cc00',
            '--border-color': 'rgba(0, 200, 0, var(--ui-transparency))',
            '--button-bg-color': 'rgba(0, 125, 0, var(--ui-transparency))',
            '--active-char-color': 'rgba(0, 75, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(0, 128, 0, var(--ui-transparency))',
            '--info-bg-color': 'rgba(0, 125, 0, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(100, 125, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(0, 128, 0, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(100, 0, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 50, 0, 0.5)',
            '--link-color': '#00ffff',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#7fff00'
        },
        terminal_dark: {
            '--bg-color': 'rgba(0, 0, 0, var(--ui-transparency))',
            '--bg-color-full': 'rgba(0, 0, 0, 1)',
            '--bg-tool': 'rgba(0, 0, 0, 0.8)',
            '--text-color': '#00ff00',
            '--text-color-darker': '#00cc00',
            '--border-color': 'rgba(0, 200, 0, var(--ui-transparency))',
            '--button-bg-color': 'rgba(0, 125, 0, var(--ui-transparency))',
            '--active-char-color': 'rgba(0, 75, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(0, 128, 0, var(--ui-transparency))',
            '--info-bg-color': 'rgba(0, 125, 0, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(100, 125, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(0, 128, 0, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(100, 0, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 50, 0, 0.5)',
            '--link-color': '#00ffff',
            '--code-bg-color': 'rgba(0, 0, 0, 0.8)',
            '--code-text-color': '#7fff00'
        },

        // Retro Themes
        retro_light: {
            '--bg-color': 'rgba(196, 182, 187, var(--ui-transparency))',
            '--bg-color-full': 'rgba(196, 182, 187, 1)',
            '--bg-tool': 'rgba(196, 182, 187, 0.8)',
            '--text-color': '#191919',
            '--text-color-darker': '#000000',
            '--border-color': 'rgba(128, 128, 128, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 105, 180, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 255, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(50, 205, 50, var(--ui-transparency))',
            '--info-bg-color': 'rgba(135, 206, 235, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 165, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(128, 128, 128, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 0, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.3)',
            '--link-color': '#1e90ff',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#ff1493'
        },
        retro_dark: {
            '--bg-color': 'rgba(34, 32, 52, var(--ui-transparency))',
            '--bg-color-full': 'rgba(34, 32, 52, 1)',
            '--bg-tool': 'rgba(34, 32, 52, 0.8)',
            '--text-color': '#c2c3c7',
            '--text-color-darker': '#8b8d90',
            '--border-color': 'rgba(69, 40, 60, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 0, 77, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 163, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(0, 232, 216, var(--ui-transparency))',
            '--info-bg-color': 'rgba(44, 232, 245, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 236, 39, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(96, 86, 107, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(172, 50, 50, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.5)',
            '--link-color': '#ff004d',
            '--code-bg-color': 'rgba(69, 40, 60, 0.8)',
            '--code-text-color': '#ff77a8'
        },

        // Neon Themes
        neon_light: {
            '--bg-color': 'rgba(255, 255, 255, var(--ui-transparency))',
            '--bg-color-full': 'rgba(255, 255, 255, 1)',
            '--bg-tool': 'rgba(255, 255, 255, 0.8)',
            '--text-color': '#000000',
            '--text-color-darker': '#333333',
            '--border-color': 'rgba(0, 0, 0, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 0, 255, var(--ui-transparency))',
            '--active-char-color': 'rgba(0, 255, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(0, 255, 0, var(--ui-transparency))',
            '--info-bg-color': 'rgba(0, 255, 255, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 255, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(128, 128, 128, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 0, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.5)',
            '--link-color': '#ff00ff',
            '--code-bg-color': 'rgba(255, 255, 255, 0.8)',
            '--code-text-color': '#00ffff'
        },
        neon_dark: {
            '--bg-color': 'rgba(0, 0, 0, var(--ui-transparency))',
            '--bg-color-full': 'rgba(0, 0, 0, 1)',
            '--bg-tool': 'rgba(0, 0, 0, 0.8)',
            '--text-color': '#ffffff',
            '--text-color-darker': '#cccccc',
            '--border-color': 'rgba(255, 255, 255, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 0, 255, var(--ui-transparency))',
            '--active-char-color': 'rgba(0, 255, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(0, 255, 0, var(--ui-transparency))',
            '--info-bg-color': 'rgba(0, 255, 255, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 255, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(255, 0, 255, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 0, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 255, 255, 0.5)',
            '--link-color': '#ff00ff',
            '--code-bg-color': 'rgba(0, 0, 0, 0.8)',
            '--code-text-color': '#00ffff'
        },

        // Vintage Themes
        vintage_light: {
            '--bg-color': 'rgba(240, 230, 140, var(--ui-transparency))',
            '--bg-color-full': 'rgba(240, 230, 140, 1)',
            '--bg-tool': 'rgba(240, 230, 140, 0.8)',
            '--text-color': '#360505',
            '--text-color-darker': '#200303',
            '--border-color': 'rgba(139, 69, 19, var(--ui-transparency))',
            '--button-bg-color': 'rgba(128, 0, 0, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 215, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(50, 205, 50, var(--ui-transparency))',
            '--info-bg-color': 'rgba(70, 130, 180, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(218, 165, 32, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(128, 128, 0, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(178, 34, 34, var(--ui-transparency))',
            '--shadow-color': 'rgba(139, 69, 19, 0.5)',
            '--link-color': '#8b0000',
            '--code-bg-color': 'rgba(245, 222, 179, 0.5)',
            '--code-text-color': '#8b0000'
        },
        vintage_dark: {
            '--bg-color': 'rgba(60, 47, 34, var(--ui-transparency))',
            '--bg-color-full': 'rgba(60, 47, 34, 1)',
            '--bg-tool': 'rgba(60, 47, 34, 0.8)',
            '--text-color': '#e0d4b3',
            '--text-color-darker': '#c0b297',
            '--border-color': 'rgba(139, 69, 19, var(--ui-transparency))',
            '--button-bg-color': 'rgba(128, 0, 0, var(--ui-transparency))',
            '--active-char-color': 'rgba(218, 165, 32, var(--ui-transparency))',
            '--success-bg-color': 'rgba(107, 142, 35, var(--ui-transparency))',
            '--info-bg-color': 'rgba(70, 130, 180, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(184, 134, 11, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(128, 128, 0, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(178, 34, 34, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.5)',
            '--link-color': '#8b0000',
            '--code-bg-color': 'rgba(245, 222, 179, 0.3)',
            '--code-text-color': '#ffa07a'
        },

        // Pastel Themes
        pastel_light: {
            '--bg-color': 'rgba(255, 228, 225, var(--ui-transparency))',
            '--bg-color-full': 'rgba(255, 228, 225, 1)',
            '--bg-tool': 'rgba(255, 228, 225, 0.8)',
            '--text-color': '#4d4d4d',
            '--text-color-darker': '#333333',
            '--border-color': 'rgba(255, 192, 203, var(--ui-transparency))',
            '--button-bg-color': 'rgba(135, 206, 235, var(--ui-transparency))',
            '--active-char-color': 'rgba(175, 238, 238, var(--ui-transparency))',
            '--success-bg-color': 'rgba(152, 251, 152, var(--ui-transparency))',
            '--info-bg-color': 'rgba(135, 206, 235, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 228, 181, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(238, 130, 238, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(240, 128, 128, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.1)',
            '--link-color': '#ff69b4',
            '--code-bg-color': 'rgba(255, 250, 205, 0.8)',
            '--code-text-color': '#dc143c'
        },
        pastel_dark: {
            '--bg-color': 'rgba(75, 75, 75, var(--ui-transparency))',
            '--bg-color-full': 'rgba(75, 75, 75, 1)',
            '--bg-tool': 'rgba(75, 75, 75, 0.8)',
            '--text-color': '#e6e6e6',
            '--text-color-darker': '#cccccc',
            '--border-color': 'rgba(105, 105, 105, var(--ui-transparency))',
            '--button-bg-color': 'rgba(176, 196, 222, var(--ui-transparency))',
            '--active-char-color': 'rgba(119, 136, 153, var(--ui-transparency))',
            '--success-bg-color': 'rgba(144, 238, 144, var(--ui-transparency))',
            '--info-bg-color': 'rgba(135, 206, 250, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 160, 122, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(205, 133, 63, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(205, 92, 92, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.5)',
            '--link-color': '#ff69b4',
            '--code-bg-color': 'rgba(255, 182, 193, 0.3)',
            '--code-text-color': '#dc143c'
        },

        // Monokai Themes
        monokai_light: {
            '--bg-color': 'rgba(248, 248, 242, var(--ui-transparency))',
            '--bg-color-full': 'rgba(248, 248, 242, 1)',
            '--bg-tool': 'rgba(248, 248, 242, 0.8)',
            '--text-color': '#272822',
            '--text-color-darker': '#49483e',
            '--border-color': 'rgba(220, 220, 217, var(--ui-transparency))',
            '--button-bg-color': 'rgba(249, 38, 114, var(--ui-transparency))',
            '--active-char-color': 'rgba(166, 226, 46, var(--ui-transparency))',
            '--success-bg-color': 'rgba(166, 226, 46, var(--ui-transparency))',
            '--info-bg-color': 'rgba(102, 217, 239, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(253, 151, 31, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(117, 113, 94, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(249, 38, 114, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.2)',
            '--link-color': '#ae81ff',
            '--code-bg-color': 'rgba(230, 230, 230, 0.8)',
            '--code-text-color': '#f92672'
        },
        monokai_dark: {
            '--bg-color': 'rgba(39, 40, 34, var(--ui-transparency))',
            '--bg-color-full': 'rgba(39, 40, 34, 1)',
            '--bg-tool': 'rgba(39, 40, 34, 0.8)',
            '--text-color': '#f8f8f2',
            '--text-color-darker': '#e6e6dc',
            '--border-color': 'rgba(73, 72, 62, var(--ui-transparency))',
            '--button-bg-color': 'rgba(249, 38, 114, var(--ui-transparency))',
            '--active-char-color': 'rgba(166, 226, 46, var(--ui-transparency))',
            '--success-bg-color': 'rgba(102, 217, 239, var(--ui-transparency))',
            '--info-bg-color': 'rgba(102, 217, 239, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(253, 151, 31, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(117, 113, 94, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(249, 38, 114, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.5)',
            '--link-color': '#ae81ff',
            '--code-bg-color': 'rgba(39, 40, 34, 0.8)',
            '--code-text-color': '#f92672'
        },

        // Dracula Themes
        dracula_light: {
            '--bg-color': 'rgba(248, 248, 242, var(--ui-transparency))',
            '--bg-color-full': 'rgba(248, 248, 242, 1)',
            '--bg-tool': 'rgba(248, 248, 242, 0.8)',
            '--text-color': '#282a36',
            '--text-color-darker': '#44475a',
            '--border-color': 'rgba(211, 212, 219, var(--ui-transparency))',
            '--button-bg-color': 'rgba(98, 114, 164, var(--ui-transparency))',
            '--active-char-color': 'rgba(189, 147, 249, var(--ui-transparency))',
            '--success-bg-color': 'rgba(80, 250, 123, var(--ui-transparency))',
            '--info-bg-color': 'rgba(139, 233, 253, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(241, 250, 140, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(98, 114, 164, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 85, 85, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.2)',
            '--link-color': '#6272a4',
            '--code-bg-color': 'rgba(225, 225, 232, 0.8)',
            '--code-text-color': '#ff79c6'
        },
        dracula_dark: {
            '--bg-color': 'rgba(40, 42, 54, var(--ui-transparency))',
            '--bg-color-full': 'rgba(40, 42, 54, 1)',
            '--bg-tool': 'rgba(40, 42, 54, 0.8)',
            '--text-color': '#f8f8f2',
            '--text-color-darker': '#e6e6dc',
            '--border-color': 'rgba(68, 71, 90, var(--ui-transparency))',
            '--button-bg-color': 'rgba(98, 114, 164, var(--ui-transparency))',
            '--active-char-color': 'rgba(189, 147, 249, var(--ui-transparency))',
            '--success-bg-color': 'rgba(80, 250, 123, var(--ui-transparency))',
            '--info-bg-color': 'rgba(139, 233, 253, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(241, 250, 140, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(98, 114, 164, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 85, 85, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.5)',
            '--link-color': '#6272a4',
            '--code-bg-color': 'rgba(68, 71, 90, 0.8)',
            '--code-text-color': '#ff79c6'
        },

        // Gruvbox Themes
        gruvbox_light: {
            '--bg-color': 'rgba(251, 241, 199, var(--ui-transparency))',
            '--bg-color-full': 'rgba(251, 241, 199, 1)',
            '--bg-tool': 'rgba(251, 241, 199, 0.8)',
            '--text-color': '#282828',
            '--text-color-darker': '#1d2021',
            '--border-color': 'rgba(213, 196, 161, var(--ui-transparency))',
            '--button-bg-color': 'rgba(184, 187, 38, var(--ui-transparency))',
            '--active-char-color': 'rgba(184, 187, 38, var(--ui-transparency))',
            '--success-bg-color': 'rgba(121, 116, 14, var(--ui-transparency))',
            '--info-bg-color': 'rgba(7, 102, 120, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(215, 153, 33, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(146, 131, 116, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(204, 36, 29, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.2)',
            '--link-color': '#458588',
            '--code-bg-color': 'rgba(235, 219, 178, 0.8)',
            '--code-text-color': '#9d0006'
        },
        gruvbox_dark: {
            '--bg-color': 'rgba(40, 40, 40, var(--ui-transparency))',
            '--bg-color-full': 'rgba(40, 40, 40, 1)',
            '--bg-tool': 'rgba(40, 40, 40, 0.8)',
            '--text-color': '#ebdbb2',
            '--text-color-darker': '#d5c4a1',
            '--border-color': 'rgba(60, 56, 54, var(--ui-transparency))',
            '--button-bg-color': 'rgba(213, 196, 161, var(--ui-transparency))',
            '--active-char-color': 'rgba(184, 187, 38, var(--ui-transparency))',
            '--success-bg-color': 'rgba(121, 116, 14, var(--ui-transparency))',
            '--info-bg-color': 'rgba(7, 102, 120, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(215, 153, 33, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(146, 131, 116, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(204, 36, 29, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.4)',
            '--link-color': '#83a598',
            '--code-bg-color': 'rgba(60, 56, 54, 0.8)',
            '--code-text-color': '#fb4934'
        },

        // Nord Themes
        nord_light: {
            '--bg-color': 'rgba(236, 239, 244, var(--ui-transparency))',
            '--bg-color-full': 'rgba(236, 239, 244, 1)',
            '--bg-tool': 'rgba(236, 239, 244, 0.8)',
            '--text-color': '#2e3440',
            '--text-color-darker': '#3b4252',
            '--border-color': 'rgba(208, 211, 216, var(--ui-transparency))',
            '--button-bg-color': 'rgba(94, 129, 172, var(--ui-transparency))',
            '--active-char-color': 'rgba(136, 192, 208, var(--ui-transparency))',
            '--success-bg-color': 'rgba(163, 190, 140, var(--ui-transparency))',
            '--info-bg-color': 'rgba(129, 161, 193, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(235, 203, 139, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(186, 190, 194, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(191, 97, 106, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.2)',
            '--link-color': '#5e81ac',
            '--code-bg-color': 'rgba(208, 211, 216, 0.8)',
            '--code-text-color': '#bf616a'
        },
        nord_dark: {
            '--bg-color': 'rgba(46, 52, 64, var(--ui-transparency))',
            '--bg-color-full': 'rgba(46, 52, 64, 1)',
            '--bg-tool': 'rgba(46, 52, 64, 0.8)',
            '--text-color': '#d8dee9',
            '--text-color-darker': '#eceff4',
            '--border-color': 'rgba(59, 66, 82, var(--ui-transparency))',
            '--button-bg-color': 'rgba(94, 129, 172, var(--ui-transparency))',
            '--active-char-color': 'rgba(136, 192, 208, var(--ui-transparency))',
            '--success-bg-color': 'rgba(163, 190, 140, var(--ui-transparency))',
            '--info-bg-color': 'rgba(129, 161, 193, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(235, 203, 139, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(76, 86, 106, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(191, 97, 106, var(--ui-transparency))',
            '--shadow-color': 'rgba(0,0,0,0.5)',
            '--link-color': '#88c0d0',
            '--code-bg-color': 'rgba(59, 66, 82, 0.8)',
            '--code-text-color': '#bf616a'
        },

        // High Contrast Themes
        high_contrast_light: {
            '--bg-color': 'rgba(255, 255, 255, var(--ui-transparency))',
            '--bg-color-full': 'rgba(255, 255, 255, 1)',
            '--bg-tool': 'rgba(255, 255, 255, 0.8)',
            '--text-color': '#000000',
            '--text-color-darker': '#333333',
            '--border-color': 'rgba(0, 0, 0, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 255, 0, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 0, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(0, 255, 0, var(--ui-transparency))',
            '--info-bg-color': 'rgba(0, 255, 255, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 255, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(128, 128, 128, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 0, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.5)',
            '--link-color': '#0000ff',
            '--code-bg-color': 'rgba(0, 0, 0, 0.1)',
            '--code-text-color': '#0000ff'
        },
        high_contrast_dark: {
            '--bg-color': 'rgba(0, 0, 0, var(--ui-transparency))',
            '--bg-color-full': 'rgba(0, 0, 0, 1)',
            '--bg-tool': 'rgba(0, 0, 0, 0.8)',
            '--text-color': '#ffffff',
            '--text-color-darker': '#cccccc',
            '--border-color': 'rgba(255, 255, 255, var(--ui-transparency))',
            '--button-bg-color': 'rgba(255, 255, 0, var(--ui-transparency))',
            '--active-char-color': 'rgba(255, 0, 0, var(--ui-transparency))',
            '--success-bg-color': 'rgba(0, 255, 0, var(--ui-transparency))',
            '--info-bg-color': 'rgba(0, 255, 255, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 255, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(128, 128, 128, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(255, 0, 0, var(--ui-transparency))',
            '--shadow-color': 'rgba(255, 255, 255, 0.5)',
            '--link-color': '#00ffff',
            '--code-bg-color': 'rgba(255, 255, 255, 0.1)',
            '--code-text-color': '#ffff00'
        },

        // Material Design Themes
        material_light: {
            '--bg-color': 'rgba(250, 250, 250, var(--ui-transparency))',
            '--bg-color-full': 'rgba(250, 250, 250, 1)',
            '--bg-tool': 'rgba(250, 250, 250, 0.8)',
            '--text-color': '#212121',
            '--text-color-darker': '#000000',
            '--border-color': 'rgba(224, 224, 224, var(--ui-transparency))',
            '--button-bg-color': 'rgba(33, 150, 243, var(--ui-transparency))',
            '--active-char-color': 'rgba(0, 188, 212, var(--ui-transparency))',
            '--success-bg-color': 'rgba(76, 175, 80, var(--ui-transparency))',
            '--info-bg-color': 'rgba(3, 169, 244, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 152, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(158, 158, 158, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(244, 67, 54, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.2)',
            '--link-color': '#009688',
            '--code-bg-color': 'rgba(238, 238, 238, .8)',
            '--code-text-color': '#ff5722'
        },
        material_dark: {
            '--bg-color': 'rgba(33, 33, 33, var(--ui-transparency))',
            '--bg-color-full': 'rgba(33, 33, 33, 1)',
            '--bg-tool': 'rgba(33, 33, 33, 0.8)',
            '--text-color': '#ffffff',
            '--text-color-darker': '#bdbdbd',
            '--border-color': 'rgba(66, 66, 66, var(--ui-transparency))',
            '--button-bg-color': 'rgba(33, 150, 243, var(--ui-transparency))',
            '--active-char-color': 'rgba(0, 188, 212, var(--ui-transparency))',
            '--success-bg-color': 'rgba(76, 175, 80, var(--ui-transparency))',
            '--info-bg-color': 'rgba(3, 169, 244, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(255, 152, 0, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(117, 117, 117, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(244, 67, 54, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.5)',
            '--link-color': '#009688',
            '--code-bg-color': 'rgba(55, 71, 79, 0.8)',
            '--code-text-color': '#ff5722'
        },

        // Desert Themes
        desert_light: {
            '--bg-color': 'rgba(250, 243, 221, var(--ui-transparency))',
            '--bg-color-full': 'rgba(250, 243, 221, 1)',
            '--bg-tool': 'rgba(250, 243, 221, 0.8)',
            '--text-color': '#5e4a1e',
            '--text-color-darker': '#3e300f',
            '--border-color': 'rgba(230, 216, 173, var(--ui-transparency))',
            '--button-bg-color': 'rgba(205, 133, 63, var(--ui-transparency))',
            '--active-char-color': 'rgba(244, 164, 96, var(--ui-transparency))',
            '--success-bg-color': 'rgba(218, 165, 32, var(--ui-transparency))',
            '--info-bg-color': 'rgba(210, 180, 140, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(184, 134, 11, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(222, 184, 135, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(139, 69, 19, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.2)',
            '--link-color': '#cd853f',
            '--code-bg-color': 'rgba(245, 222, 179, 0.8)',
            '--code-text-color': '#8b4513'
        },
        desert_dark: {
            '--bg-color': 'rgba(74, 60, 42, var(--ui-transparency))',
            '--bg-color-full': 'rgba(74, 60, 42, 1)',
            '--bg-tool': 'rgba(74, 60, 42, 0.8)',
            '--text-color': '#f0e68c',
            '--text-color-darker': '#d2b48c',
            '--border-color': 'rgba(92, 64, 51, var(--ui-transparency))',
            '--button-bg-color': 'rgba(205, 133, 63, var(--ui-transparency))',
            '--active-char-color': 'rgba(244, 164, 96, var(--ui-transparency))',
            '--success-bg-color': 'rgba(218, 165, 32, var(--ui-transparency))',
            '--info-bg-color': 'rgba(210, 180, 140, var(--ui-transparency))',
            '--warning-bg-color': 'rgba(184, 134, 11, var(--ui-transparency))',
            '--muted-bg-color': 'rgba(210, 105, 30, var(--ui-transparency))',
            '--danger-bg-color': 'rgba(139, 69, 19, var(--ui-transparency))',
            '--shadow-color': 'rgba(0, 0, 0, 0.4)',
            '--link-color': '#cd853f',
            '--code-bg-color': 'rgba(92, 64, 51, 0.8)',
            '--code-text-color': '#ffa07a'
        }
    };

    // Define a global object to store the status data
    const globalStatus = {
        time: '',
        weather: '',
        plot: ''
    };

    // Initialize CSS variables
    function setTheme(themeName) {
        const theme = themes[themeName];
        Object.keys(theme).forEach(key => {
            document.documentElement.style.setProperty(key, theme[key]);
        });
    }

    // Retrieve saved settings or set defaults
    const defaultTransparency = await GM.getValue('transparency', '0.9');
    const defaultTheme = await GM.getValue('theme', 'dark');

    // Initialize transparency and theme
    document.documentElement.style.setProperty('--ui-transparency', defaultTransparency);
    setTheme(defaultTheme);

    // Add placeholder styles
    const style = document.createElement('style');
    style.innerHTML = `
    input::placeholder, textarea::placeholder {
        color: var(--text-color);
    }
    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
        color: var(--text-color);
    }
    input::-ms-input-placeholder, textarea::-ms-input-placeholder {
        color: var(--text-color);
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        color: var(--text-color);
    }
    `;
    document.head.appendChild(style);

    // --- Context Menu and Tool Buttons ---
    const menuButtonsContainer = document.createElement('div');
    menuButtonsContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        z-index: 10000;
    `;
    document.body.appendChild(menuButtonsContainer);

    const contextMenuButton = document.createElement('button');
    contextMenuButton.textContent = '⚙️';
    contextMenuButton.title = 'Menu';
    contextMenuButton.style.cssText = `
        width: 40px;
        height: 40px;
        margin-right: 5px;
        padding: 0;
        border: none;
        background-color: var(--button-bg-color);
        color: var(--text-color);
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        z-index: 10000;
    `;
    menuButtonsContainer.appendChild(contextMenuButton);

    const toolButtonsData = [
        { emoji: '🧮', title: 'Calculator', iframeSrc: 'https://www.desmos.com/fourfunction', id: 'calculator' },
        { emoji: '🎲', title: 'Dice Roller', iframeSrc: '', id: 'dice' },
        { emoji: '🎮', title: 'Game', iframeSrc: 'https://freepacman.org/', id: 'game' },
    ];

    toolButtonsData.forEach(tool => {
        const button = document.createElement('button');
        button.textContent = tool.emoji;
        button.title = tool.title;
        button.style.cssText = `
            width: 40px;
            height: 40px;
            margin-right: 5px;
            padding: 0;
            border: none;
            background-color: var(--button-bg-color);
            color: var(--text-color);
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
        `;
        button.addEventListener('click', () => {
            openToolWindow(tool);
        });
        menuButtonsContainer.appendChild(button);
    });

    const openWindows = new Set();

    function openToolWindow(tool) {
        if (openWindows.has(tool.id)) {
            return;
        }

        // Create the window container
        const windowContainer = document.createElement('div');
        windowContainer.style.cssText = `
        position: fixed;
        top: 100px;
        left: 100px;
        width: 500px;
        height: 400px;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        box-shadow: 0 0 10px var(--shadow-color);
        border-radius: 5px;
        z-index: 10002;
        display: flex;
        flex-direction: column;
    `;

        // Add a header with the title and close button
        const header = document.createElement('div');
        header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px;
        background-color: var(--button-bg-color);
        color: var(--text-color);
        cursor: move;
    `;
        const title = document.createElement('span');
        title.textContent = tool.title;
        header.appendChild(title);
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖️';
        closeButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
    `;
        closeButton.addEventListener('click', () => {
            document.body.removeChild(windowContainer);
            openWindows.delete(tool.id);
        });
        header.appendChild(closeButton);

        windowContainer.appendChild(header);

        // Add iframe
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
    flex-grow: 1;
    width: 100%;
    border: none;
    background-color: var(--bg-color);
    color: var(--text-color);
`;
        let src = tool.iframeSrc;

        // Adjust dice URL based on theme
        if (tool.id === 'dice') {
            const dicehex = getComputedHexValue('--button-bg-color').slice(1);
            const chromahex = getComputedHexValue('--bg-color').slice(1);
            const labelhex = getComputedHexValue('--text-color').slice(1);
            src = `https://dice.bee.ac/?dicehex=${dicehex}&chromahex=${chromahex}&labelhex=${labelhex}`;
        }

        // Adjust calculator URL based on theme
        if (tool.id === 'calculator') {
            const bgColor = getComputedHexValue('--bg-color').slice(1);
            const textColor = getComputedHexValue('--text-color').slice(1);
            const buttonBgColor = getComputedHexValue('--button-bg-color').slice(1);
            src = `https://www.desmos.com/fourfunction?backgroundColor=${bgColor}&textColor=${textColor}&buttonBackgroundColor=${buttonBgColor}`;
        }

        iframe.src = src;
        windowContainer.appendChild(iframe);

        // Make window draggable
        makeElementDraggable(windowContainer, header);

        document.body.appendChild(windowContainer);
        openWindows.add(tool.id);

        document.body.appendChild(windowContainer);
        openWindows.add(tool.id);
    }

    function getComputedHexValue(variableName) {
        const computedStyle = getComputedStyle(document.documentElement);
        const colorValue = computedStyle.getPropertyValue(variableName).trim();

        // Create a temporary div to get the computed color
        const tempDiv = document.createElement('div');
        tempDiv.style.color = colorValue;
        document.body.appendChild(tempDiv);
        const computedColor = getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);

        // Now computedColor is in 'rgb(r, g, b)' or 'rgba(r, g, b, a)' format
        const rgba = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

        if (rgba) {
            const r = parseInt(rgba[1]).toString(16).padStart(2, '0');
            const g = parseInt(rgba[2]).toString(16).padStart(2, '0');
            const b = parseInt(rgba[3]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        } else {
            // Fallback to default
            return '#FFFFFF';
        }
    }

    function makeElementDraggable(elmnt, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (handle) {
            handle.onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Helper functions for tooltip
    let tooltipElement = null;

    function showTooltip(event, content, set, url, imageMaxWidth = 580, imageMaxHeight = 380) {
        hideTooltip(); // Remove existing tooltip if any

        // Create new tooltip element
        tooltipElement = document.createElement('div');
        tooltipElement.style.cssText = `
        position: absolute;
        z-index: 10000;
        background-color: var(--bg-tool);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        padding: 5px;
        border-radius: 5px;
        font-size: 12px;
        max-width: 600px;
        white-space: pre-wrap;
        box-shadow: 0 0 10px var(--shadow-color);
    `;
        tooltipElement.innerHTML = content;

        // Append tooltip to body first to calculate its size later
        document.body.appendChild(tooltipElement);

        // Get the parent node's bounding rectangle
        const parentRect = event.currentTarget.parentNode.parentNode.getBoundingClientRect();

        if (!set) {
            // Tooltip to the right of the parent element
            tooltipElement.style.left = `${parentRect.right + 4}px`;
            tooltipElement.style.top = `${parentRect.top}px`;
        } else {
            // Tooltip to the left of the parent element
            const tooltipWidth = tooltipElement.offsetWidth; // Get the tooltip width after it's appended
            tooltipElement.style.left = `${parentRect.left - tooltipWidth + 15}px`; // Adjust to the left
            tooltipElement.style.top = `${parentRect.top}px`;
        }

        // Adjust position if the tooltip goes off screen
        const tooltipRect = tooltipElement.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth) {
            tooltipElement.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
        }
        if (tooltipRect.left < 0) {
            tooltipElement.style.left = `10px`; // Move it a bit to the right if it goes off screen on the left
        }
        if (tooltipRect.bottom > window.innerHeight) {
            tooltipElement.style.top = `${window.innerHeight - tooltipRect.height - 10}px`;
        }

        // If a valid image URL is provided, attempt to load it
        if (url && isValidImageUrl(url)) {
            const img = document.createElement('img');
            img.src = url;

            // When the image loads, call a function to add it to the tooltip
            img.onload = () => {
                addImageToTooltip(tooltipElement, url, imageMaxWidth, imageMaxHeight);
            };

            // Optionally handle image loading errors
            img.onerror = () => {
                console.warn(`Failed to load image from URL: ${url}`);
            };
        }
    }

    function addImageToTooltip(tooltipElement, url, imageMaxWidth, imageMaxHeight) {
        // Create a container for the image with a background color
        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
        display: block;
        margin-top: 10px;
        width: 100%; /* Match the tooltip's width */
        background-color: var(--shadow-color);
        border-radius: 5px;
        overflow: hidden; /* Ensures the image stays within the container's bounds */
        padding: 5px; /* Optional: adds padding inside the background */
    `;

        // Create the image element
        const img = document.createElement('img');
        img.src = url;
        img.style.cssText = `
        display: block; /* Behave like a block element */
        margin: 0 auto; /* Center the image horizontally */
        max-width: ${imageMaxWidth}px; /* Scale down if larger than max width */
        max-height: ${imageMaxHeight}px; /* Scale down if larger than max height */
        width: auto; /* Maintain aspect ratio based on max-width and max-height */
        height: auto; /* Maintain aspect ratio */
        border-radius: 5px; /* Optional: rounded corners for the image */
    `;

        // Append the image to the container
        imgContainer.appendChild(img);

        // Append the container to the tooltip
        tooltipElement.appendChild(imgContainer);

        // Recalculate the tooltip position if necessary (e.g., if the image changes its size)
        const tooltipRect = tooltipElement.getBoundingClientRect();

        if (tooltipRect.right > window.innerWidth) {
            tooltipElement.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
        }
        if (tooltipRect.left < 0) {
            tooltipElement.style.left = `10px`; // Move it a bit to the right if it goes off screen on the left
        }
        if (tooltipRect.bottom > window.innerHeight) {
            tooltipElement.style.top = `${window.innerHeight - tooltipRect.height - 10}px`;
        }
    }

    function hideTooltip() {
        if (tooltipElement && tooltipElement.parentNode) {
            tooltipElement.parentNode.removeChild(tooltipElement);
            tooltipElement = null; // Set to null after removing
        }
    }

    // --- Context Panel ---
    const contextPanel = document.createElement('div');
    contextPanel.id = 'context-panel';
    contextPanel.style.cssText = `
    position: fixed; /* Keep position fixed to center the panel */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    padding: 20px;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    box-shadow: 0 0 10px var(--shadow-color);
    border-radius: 5px;
    display: none;
    z-index: 10001;
    /* Remove position: relative; */
`;
    document.body.appendChild(contextPanel);

    // Add close button to contextPanel
    const contextCloseButton = document.createElement('button');
    contextCloseButton.textContent = '✖️';
    contextCloseButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: var(--text-color);
    `;
    contextCloseButton.addEventListener('click', () => {
        contextPanel.style.display = 'none';
    });
    contextPanel.appendChild(contextCloseButton);

    const transparencyLabel = document.createElement('label');
    transparencyLabel.textContent = 'UI Transparency';
    transparencyLabel.style.cssText = `
        color: var(--text-color);
        display: block;
        margin-bottom: 5px;
    `;
    contextPanel.appendChild(transparencyLabel);

    const transparencySlider = document.createElement('input');
    transparencySlider.type = 'range';
    transparencySlider.min = '0.1';
    transparencySlider.max = '1';
    transparencySlider.step = '0.1';
    transparencySlider.value = defaultTransparency;
    transparencySlider.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
    `;
    transparencySlider.addEventListener('input', () => {
        document.documentElement.style.setProperty('--ui-transparency', transparencySlider.value);
        // Re-apply current theme to update transparency
        setTheme(themeDropdown.value);
        GM.setValue('transparency', transparencySlider.value);
    });
    contextPanel.appendChild(transparencySlider);

    const dropperLabel = document.createElement('label');
    dropperLabel.textContent = 'UI Theme';
    dropperLabel.style.cssText = `
        color: var(--text-color);
        display: block;
        margin-bottom: 5px;
    `;
    contextPanel.appendChild(dropperLabel);

    const themeDropdown = document.createElement('select');
    themeDropdown.style.cssText = `
        width: 100%;
        padding: 5px;
        margin-bottom: 10px;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        background-color: var(--bg-color);
        color: var(--text-color);
    `;
    Object.keys(themes).forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        themeDropdown.appendChild(option);
    });

    themeDropdown.value = defaultTheme;

    themeDropdown.addEventListener('change', () => {
        setTheme(themeDropdown.value);
        GM.setValue('theme', themeDropdown.value);
    });
    contextPanel.appendChild(themeDropdown);

    // Add divider
    const divider = document.createElement('hr');
    divider.style.cssText = `
        border: none;
        border-top: 1px solid var(--border-color);
        margin: 10px 0;
    `;
    contextPanel.appendChild(divider);

    const contextLabel = document.createElement('label');
    contextLabel.textContent = 'Primary Context';
    contextLabel.style.cssText = `
        color: var(--text-color);
        display: block;
        margin-bottom: 5px;
    `;
    contextPanel.appendChild(contextLabel);

    const primaryContextInput = document.createElement('textarea');
    primaryContextInput.placeholder = 'Primary context goes here...';
    primaryContextInput.style.cssText = `
        width: 100%;
        height: 100px;
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        box-sizing: border-box;
        background-color: var(--bg-color);
        color: var(--text-color);
    `;
    contextPanel.appendChild(primaryContextInput);

    // Define the sleep function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const updateContextButton = document.createElement('button');
    updateContextButton.textContent = 'Update Context';
    updateContextButton.style.cssText = `
        width: 100%;
        padding: 10px;
        border: none;
        background-color: var(--success-bg-color);
        color: var(--text-color);
        border-radius: 5px;
        cursor: pointer;
    `;

    updateContextButton.addEventListener('click', async () => {

        const textarea = document.createElement('textarea');
        var fullContext = `Context;\n"` + (primaryContextInput.value == undefined ? 'Nothing in particular' : primaryContextInput.value) + `"\n`;
        fullContext += `\n` + window.getContext();
        textarea.value = fullContext;
        console.log("setting context; " + textarea.value);
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        // Display a dialog box
        alert("Context copied\nPlease paste it into the chat memory as automated insertion is broken.");

        /*const primaryContext = primaryContextInput.value;
        var fullContext = `Context;\n"` + primaryContext + `"\n`;
        fullContext += `\n` + window.getContext();
        console.log("setting context; " + fullContext);

        window.manuClick('//*[@id="menu-button-:rb:"]');
        await sleep(250);

        window.manuClick('//*[@id="menu-list-:rb:-menuitem-:ru:"]');
        await sleep(250);

        window.manuWrite("/html/body/div[10]/div[3]/div/section/div/textarea", fullContext);
        await sleep(250);

        window.manuClick("/html/body/div[9]/div[3]/div/section/footer/button[2]");*/
    });

    window.manuWrite = function(xpath, text) {
        var result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );

        var node = result.singleNodeValue;

        if (node) {
            node.focus();

            // Since the node is an HTMLTextAreaElement, get the value setter from its prototype
            const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
            ).set;

            nativeTextAreaValueSetter.call(node, text);

            // Dispatch the 'input' event to simulate user input
            var event = new Event('input', { bubbles: true });
            node.dispatchEvent(event);

        } else {
            console.error("Node not found for XPath:", xpath);
        }
    }

    window.manuClick = function(xpath) {
        var result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );

        var node = result.singleNodeValue;

        if (node) {
            node.click();
        }
    }

    contextPanel.appendChild(updateContextButton);

    contextMenuButton.addEventListener('click', () => {
        contextPanel.style.display = contextPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Helper function to find the active location recursively
    function findActiveLocation(items) {
        for (const item of items) {
            if (item.active) {
                return item;
            }
            if (item.children && item.children.length > 0) {
                const activeChild = findActiveLocation(item.children);
                if (activeChild) {
                    return activeChild;
                }
            }
        }
        return null;
    }

    // Helper function to collect all active characters recursively
    function collectActiveCharacters(items, result = []) {
        for (const item of items) {
            if (item.active) {
                result.push(item);
            }
            if (item.children && item.children.length > 0) {
                collectActiveCharacters(item.children, result);
            }
        }
        return result;
    }

    // Modify the getContext function to utilize the helper functions
    window.getContext = function() {
        const activeLocation = findActiveLocation(locationGroups.flatMap(g => g.items));
        if (!activeLocation) return '';

        let context = ``;

        if (globalStatus.plot && globalStatus.plot.trim() !== '') {
            context += `Plot:\n"${globalStatus.plot}"\n`;
        } else {
            context += `Plot:\n"No specific plot."\n`;
        }

        context += `\nSetting;\n"${activeLocation.name}" (${globalStatus.time}, ${globalStatus.weather}):\n`
        context += `\u0009"${activeLocation.description}"\n`;

        context += `\n{{user}}'s characters;\n`;

        const activeUserCharacters = collectActiveCharacters(characterGroups.flatMap(g => g.items)).filter(char => char.characterType == 1);

        activeUserCharacters.forEach(char => {
            context += `"${char.name}" (${char.sex}, ${char.species}, ${char.age}, ${char.bodyType}, ${char.personality}):\n`;
            context += `\u0009"${char.bio}"\n`;
        });

        context += `\n{{char}}'s characters;\n`;

        const activeCharCharacters = collectActiveCharacters(characterGroups.flatMap(g => g.items)).filter(char => char.characterType == 0);

        activeCharCharacters.forEach(char => {
            context += `"${char.name}" (${char.sex}, ${char.species}, ${char.age}, ${char.bodyType}, ${char.personality}):\n`;
            context += `\u0009"${char.bio}"\n`;
        });

        return context;
    };

    // --- Character Sidebar with Groups and Nested Characters ---
    const characterSidebar = document.createElement('div');
    characterSidebar.id = 'character-sheet-sidebar';
    characterSidebar.style.cssText = `
        position: fixed;
        top: 0;
        right: -350px;
        width: 350px;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-color);
        border-left: 2px solid var(--border-color);
        box-shadow: -2px 0 5px var(--shadow-color);
        box-sizing: border-box;
        transition: right 0.3s;
        z-index: 9999;
    `;
    document.body.appendChild(characterSidebar);

    const characterToggleButton = document.createElement('button');
    characterToggleButton.textContent = '☰';
    characterToggleButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        border: none;
        background-color: var(--button-bg-color);
        color: var(--text-color);
        border-radius: 5px;
        cursor: pointer;
        transition: right 0.3s;
        z-index: 10000;
    `;
    characterToggleButton.addEventListener('click', () => {
        const isOpen = characterSidebar.style.right === '0px';
        characterSidebar.style.right = isOpen ? '-350px' : '0';
        characterToggleButton.style.right = isOpen ? '10px' : '360px';
    });
    document.body.appendChild(characterToggleButton);

    const characterHeader = document.createElement('div');
    characterHeader.style.cssText = `
        padding: 10px;
        background-color: var(--border-color);
        text-align: center;
        font-weight: bold;
        color: var(--text-color);
    `;
    characterHeader.textContent = 'Characters';
    characterSidebar.appendChild(characterHeader);

    // Add fifth button: "Load" for Character
    function loadCharacter(index = -1) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const character = JSON.parse(e.target.result);
                    if (character && character.id) {
                        // Add to Ungrouped
                        const ungrouped = characterGroups.find(g => g.name === 'Ungrouped');
                        if (index < 0 && ungrouped) {
                            ungrouped.items.push(character);
                        } else if (index >= characterGroups.length && ungrouped) {
                            ungrouped.items.push(character);
                        } else {
                            characterGroups[index].items.push(character);
                        }
                        renderCharacterGroups();
                    } else {
                        alert('Invalid character format.');
                    }
                } catch (error) {
                    alert('Failed to load character: ' + error.message);
                }
            };
            reader.readAsText(file);
        });
        fileInput.click();
    }

    const characterGroupList = document.createElement('div');
    characterGroupList.id = 'character-group-list';
    characterGroupList.style.cssText = `
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
    `;
    characterSidebar.appendChild(characterGroupList);

    // Initialize Character Groups
    let characterGroups = [
        { name: 'Ungrouped', items: [], collapsed: false }
    ];

    // Function to create a new Character
    function createNewCharacter(index = -1) {
        const newCharacter = {
            id: generateId(),
            active: true,
            emoji: '😀',
            avatar: 'Url goes here...',
            name: 'New Character',
            sex: '',
            species: '',
            age: '',
            bodyType: '',
            personality: '',
            bio: '',
            characterType: 0,
            children: [],
            collapsed: false
        };
        // Add to Ungrouped
        const ungrouped = characterGroups.find(g => g.name === 'Ungrouped');
        if (index < 0 && ungrouped) {
            ungrouped.items.push(newCharacter);
        } else if (index >= characterGroups.length && ungrouped) {
            ungrouped.items.push(newCharacter);
        } else {
            characterGroups[index].items.push(newCharacter);
        }
        renderCharacterGroups();
    }

    // Function to create a new Character Group
    function createNewCharacterGroup() {
        const groupName = prompt('Enter group name:', `Group ${characterGroups.length}`);
        if (groupName && groupName.trim() !== '') {
            characterGroups.push({ name: groupName.trim(), items: [], collapsed: false });
            renderCharacterGroups();
        }
    }

    // Function to render Character Groups and Items
    function renderCharacterGroups() {
        characterGroupList.innerHTML = '';

        characterGroups.forEach((group, groupIndex) => {
            // Sort items alphabetically by name
            group.items.sort((a, b) => a.name.localeCompare(b.name));

            const groupContainer = document.createElement('div');
            groupContainer.className = 'character-group';
            groupContainer.style.cssText = `
                margin-bottom: 10px;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                background-color: var(--active-char-color);
            `;

            const groupHeader = document.createElement('div');
            groupHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 10px;
                background-color: var(--button-bg-color);
                color: var(--text-color);
                cursor: pointer;
                user-select: none;
                position: relative;
            `;
            groupHeader.textContent = group.name;
            groupHeader.addEventListener('click', () => {
                group.collapsed = !group.collapsed;
                renderCharacterGroups();
            });

            // Add context menu functionality
            groupHeader.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                CreateContextMenu(
                    'var(--bg-tool)',
                    'var(--text-color)',
                    'var(--border-color)',
                    ['✏️ Rename','📝 Create', '🗃️ Import', '🗑️ Delete'],
                    [
                        () => renameGroup(groupIndex),
                        () => createNewCharacter(groupIndex),
                        () => loadCharacter(groupIndex),
                        () => deleteGroup(groupIndex),
                    ]
                );
                showMenu(e);
            });

            groupContainer.appendChild(groupHeader);

            if (!group.collapsed) {
                const itemsContainer = document.createElement('div');
                itemsContainer.style.cssText = `
                    padding: 5px 10px;
                    display: block;
                `;
                if (group.items.length === 0) {
                    const emptyInfo = document.createElement('div');
                    emptyInfo.className = 'character-slot';
                    emptyInfo.style.cssText = `
                        display: flex;
                        align-items: center;
                        padding: 10px;
                        border: 1px solid var(--border-color);
                        border-radius: 5px;
                        height: 20px;
                        margin-bottom: 5px;
                        background-color: var(--bg-color);
                        cursor: default;
                    `;

                    const infoText = document.createElement('span');
                    infoText.textContent = `Group is empty`;
                    infoText.style.cssText = `
                        color: var(--text-color);
                    `;

                    emptyInfo.appendChild(infoText);
                    itemsContainer.appendChild(emptyInfo);
                } else {
                    group.items.forEach((character) => {
                        const characterSlot = createCharacterSlot(character, groupIndex);
                        itemsContainer.appendChild(characterSlot);
                    });
                }
                groupContainer.appendChild(itemsContainer);
            } else {
                const collapsedInfo = document.createElement('div');
                collapsedInfo.className = 'character-slot';
                collapsedInfo.style.cssText = `
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    margin-bottom: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: 5px;
                    height: 20px;
                    margin-top: 5px;
                    background-color: var(--bg-color);
                    cursor: default;
                    margin-left: 10px;
                    margin-right: 10px;
                `;
                const infoText = document.createElement('span');
                infoText.textContent = `${group.items.length} items hidden`;

                const activeCount = countActiveCharacters(group.items);
                const totalCount = countTotalCharacters(group.items);
                if (activeCount === totalCount && totalCount > 0) {
                    infoText.style.cssText = `color: rgba(36, 242, 0, 0.75);`;
                } else if (activeCount === 0) {
                    infoText.style.cssText = `color: var(--text-color-darker);`;
                } else {
                    infoText.style.cssText = `color: rgba(242, 198, 0, 0.75);`;
                }

                collapsedInfo.appendChild(infoText);
                groupContainer.appendChild(collapsedInfo);
            }

            const groupActions = document.createElement('div');
            groupActions.style.cssText = `
                display: flex;
                align-items: center;
            `;

            // Activate/Deactivate All Button
            const toggleAllButton = document.createElement('button');
            toggleAllButton.title = 'Activate/Deactivate All';
            toggleAllButton.style.cssText = `
                background: none;
                border: none;
                color: var(--text-color);
                cursor: pointer;
                margin-right: 3px;
                font-size: 16px;
            `;
            updateToggleAllButton(toggleAllButton, group);
            toggleAllButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleAllGroupCharacters(group);
                updateToggleAllButton(toggleAllButton, group);
                renderCharacterGroups();
            });
            groupActions.appendChild(toggleAllButton);
            groupHeader.appendChild(groupActions);

            // Add dragover and drop events for grouping
            groupContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                groupContainer.style.border = `2px dashed var(--info-bg-color)`;
            });

            groupContainer.addEventListener('dragleave', (e) => {
                groupContainer.style.border = `1px solid var(--border-color)`;
            });

            groupContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                groupContainer.style.border = `1px solid var(--border-color)`;
                const data = e.dataTransfer.getData('text/plain');
                const { type, id } = JSON.parse(data);
                if (type === 'character') {
                    moveCharacterToGroup(id, groupIndex);
                }
            });

            characterGroupList.appendChild(groupContainer);
        });

        // Ensure at least one group exists
        if (characterGroups.length === 0) {
            characterGroups.push({ name: 'Ungrouped', items: [], collapsed: false });
            renderCharacterGroups();
        }
    }

    // Function to update the Toggle All Button appearance
    function updateToggleAllButton(button, group) {
        const activeCount = countActiveCharacters(group.items);
        const totalCount = countTotalCharacters(group.items);
        if (activeCount === totalCount && totalCount > 0) {
            // All active
            button.textContent = '🟢';
        } else if (activeCount === 0) {
            // All inactive
            button.textContent = '🔴';
        } else {
            // Mixed
            button.textContent = '🟡';
        }
    }

    function countActiveCharacters(items) {
        let count = 0;
        items.forEach(item => {
            if (item.active) count++;
            if (item.children && item.children.length > 0) {
                count += countActiveCharacters(item.children);
            }
        });
        return count;
    }

    function countTotalCharacters(items) {
        let count = items.length;
        items.forEach(item => {
            if (item.children && item.children.length > 0) {
                count += countTotalCharacters(item.children);
            }
        });
        return count;
    }

    // Function to toggle all characters in a group
    function toggleAllGroupCharacters(group) {
        const allActive = countActiveCharacters(group.items) === countTotalCharacters(group.items);
        toggleCharacters(group.items, !allActive);
    }

    function toggleCharacters(items, state) {
        items.forEach(item => {
            item.active = state;
            if (item.children && item.children.length > 0) {
                toggleCharacters(item.children, state);
            }
        });
    }

    // Function to generate tooltip content for a character
    function getCharacterTooltipContent(character, isRadial = false) {
        if (isRadial && character.emoji === '📁') {
            // If it's a group node in the radial tree, only show the name
            return `<strong>"${character.name}"</strong>`;
        }
        var content = `<strong>"${character.name}"</strong>`;

        if(character.characterType != 2){
            content += ` <small>(${character.sex || 'Unknown'}, ${character.species || 'Unknown'}, ${character.age || 'Unknown'}, ${character.bodyType || 'Unknown'}, ${character.personality || 'Unknown'})</small>`;
        }

        content += `:<br><em>"${character.bio || 'No bio available.'}"</em>`;
        return content;
    }

    // Function to create a Character Slot DOM element (recursive)
    function createCharacterSlot(character, groupIndex, parent = null, level = 0) {
        const characterSlot = document.createElement('div');
        characterSlot.className = 'character-slot';
        characterSlot.draggable = true;
        characterSlot.dataset.id = character.id;
        characterSlot.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px;
            margin-bottom: 5px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            background-color: ${character.characterType == 1 ? 'var(--active-char-color)' : 'var(--bg-color)'};
            cursor: grab;
            margin-left: ${level * 20}px;
        `;

        // Drag events
        characterSlot.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'character', id: character.id }));
            e.currentTarget.style.opacity = '0.5';
        });

        characterSlot.addEventListener('dragend', (e) => {
            e.currentTarget.style.opacity = '1';
        });

        characterSlot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            characterSlot.style.border = `2px dashed var(--info-bg-color)`;
        });

        characterSlot.addEventListener('dragleave', (e) => {
            characterSlot.style.border = `1px solid var(--border-color)`;
        });

        characterSlot.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            characterSlot.style.border = `1px solid var(--border-color)`;
            const data = e.dataTransfer.getData('text/plain');
            const { type, id } = JSON.parse(data);
            if (type === 'character' && id !== character.id) {
                moveCharacterToParent(id, character);
            }
        });

        // Context menu (right-click)
        characterSlot.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            CreateContextMenu(
                'var(--bg-tool)',
                'var(--text-color)',
                'var(--border-color)',
                ['ℹ️ Status', '✏️ Edit', '🗑️ Delete', '⬇️ Export'],
                [
                    () => console.log('Status clicked'), // Replace with the correct status function
                    () => editCharacter(character),
                    () => deleteCharacter(character.id),
                    () => exportCharacter(character),
                ]
            );
            showMenu(e);
        });

        // Left Div (Emoji, Name)
        const leftDiv = document.createElement('div');
        leftDiv.style.cssText = `
            display: flex;
            align-items: center;
            flex-grow: 1;
            overflow: hidden;
        `;

        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = character.emoji;
        emojiSpan.style.marginRight = '5px';
        leftDiv.appendChild(emojiSpan);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = character.name;
        nameSpan.style.cssText = `
            flex-grow: 1;
            min-width: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--text-color);
        `;
        leftDiv.appendChild(nameSpan);

        // Remove Collapse/Expand Button
        // (Not needed as per new requirement)
        const activeButton = document.createElement('button');
        activeButton.textContent = character.active ? '🟢' : '🔴';
        activeButton.title = 'Toggle Active';
        activeButton.style.cssText = `
            padding: 3px;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-color);
            margin-right: 5px;
        `;
        activeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            character.active = !character.active;
            updateAllToggleButtons();
            renderCharacterGroups();
        });
        leftDiv.appendChild(activeButton);

        if(character.characterType == 2) {
            activeButton.style.display = 'none';
        }

        characterSlot.appendChild(leftDiv);

        // Recursive rendering of children
        const container = document.createElement('div');
        container.appendChild(characterSlot);

        if (character.children && character.children.length > 0) {
            if (!character.collapsed) {
                character.children.forEach((child) => {
                    const childSlot = createCharacterSlot(child, groupIndex, character, level + 1);
                    container.appendChild(childSlot);
                });
            } else {
                const collapsedInfo = document.createElement('div');
                collapsedInfo.className = 'character-slot';
                collapsedInfo.style.cssText = `
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    margin-bottom: 5px;
                    border: 1px solid var(--border-color);
                    border-radius: 5px;
                    background-color: var(--bg-color);
                    height: 20px;
                    cursor: default;
                    margin-left: ${(level + 1) * 20}px;
                `;
                const infoText = document.createElement('span');
                infoText.textContent = `${character.children.length} items hidden`;

                const activeCount = countActiveCharacters(character.children);
                const totalCount = countTotalCharacters(character.children);
                if (activeCount === totalCount && totalCount > 0) {
                    infoText.style.cssText = `color: rgba(36, 242, 0, 0.75);`;
                } else if (activeCount === 0) {
                    infoText.style.cssText = `color: var(--text-color-darker);`;
                } else {
                    infoText.style.cssText = `color: rgba(242, 198, 0, 0.75);`;
                }

                collapsedInfo.appendChild(infoText);
                container.appendChild(collapsedInfo);
            }
        }

        // Add tooltip event listeners
        nameSpan.addEventListener('mouseenter', (e) => {
            showTooltip(e, getCharacterTooltipContent(character), true, character.avatar);
        });
        nameSpan.addEventListener('mouseleave', hideTooltip);
        nameSpan.addEventListener('dragover', hideTooltip);

        return container;
    }

    function updateAllToggleButtons() {
        characterGroups.forEach((group, groupIndex) => {
            const toggleAllButton = toggleAllButtonForGroup(groupIndex);
            if (toggleAllButton) {
                updateToggleAllButton(toggleAllButton, group);
            }
        });
    }

    // Function to get the toggle all button for a group
    function toggleAllButtonForGroup(groupIndex) {
        const groupContainer = characterGroupList.children[groupIndex];
        if (groupContainer) {
            const toggleAllButton = groupContainer.querySelector('button[title="Activate/Deactivate All"]');
            return toggleAllButton;
        }
        return null;
    }

    // Function to rename a group
    function renameGroup(groupIndex) {
        const newName = prompt('Enter new group name:', characterGroups[groupIndex].name);
        if (newName && newName.trim() !== '') {
            characterGroups[groupIndex].name = newName.trim();
            renderCharacterGroups();
        }
    }

    // Function to delete a group
    function deleteGroup(groupIndex) {
        if (characterGroups.length === 1) {
            alert('At least one group must exist.');
            return;
        }
        if (confirm(`Are you sure you want to delete the group "${characterGroups[groupIndex].name}"? All characters in this group will be moved to "Ungrouped".`)) {
            const group = characterGroups.splice(groupIndex, 1)[0];
            const ungrouped = characterGroups.find(g => g.name === 'Ungrouped');
            if (ungrouped) {
                ungrouped.items = ungrouped.items.concat(group.items);
            } else {
                characterGroups.unshift({ name: 'Ungrouped', items: group.items, collapsed: false });
            }
            renderCharacterGroups();
        }
    }

    // Default randomizer options
    const defaultRandomizerOptions = {
        emoji: {
            'Smileys': "😀%😃%😄%😁%😆%😅%😂%🤣",
            'People': "😊%😇%🙂%🙃%😉%😌%😍",
            // Add more categories if needed
        },
        name: {
            'Common': "Alex%Charlie%Sam%Jessie%Max%Taylor%Jordan%Casey%Jamie%Robin",
            'Fantasy': "Aragorn%Legolas%Gandalf%Frodo%Bilbo%Galadriel%Sauron",
            // Add more categories if needed
        },
        sex: {
            'Standard': "male*48%female*48%other*4",
            // It's possible to have other options
        },
        species: {
            'Realistic': "Human",
            'Fantasy': "Human%Elf%Dwarf%Orc%Demon",
            '25% Human | 75% Fantasy':"Human*2%Elf%Dwarf%Orc%Demon",
            '50% Human | 50% Fantasy':"Human*4%Elf%Dwarf%Orc%Demon",
            '75% Human | 25% Fantasy':"Human*12%Elf%Dwarf%Orc%Demon",
            'Sci-fi': "Human%Synth%Alien%Hybrid%Cyborg",
            '25% Human | 75% Sci-fi':"Human*2%Synth%Alien%Hybrid%Cyborg",
            '50% Human | 50% Sci-fi':"Human*4%Synth%Alien%Hybrid%Cyborg",
            '75% Human | 25% Sci-fi':"Human*12%Synth%Alien%Hybrid%Cyborg",
            'Animals':"",
            '25% Human | 75% Animals':"",
            '50% Human | 50% Animals':"",
            '75% Human | 25% Animals':"",
            'Mythological':"",
            '25% Human | 75% Mythos':"",
            '50% Human | 50% Mythos':"",
            '75% Human | 25% Mythos':"",
            'Mythos + Animals':"",
            '25% Human | 75% Mythos + Animals':"",
            '50% Human | 50% Mythos + Animals':"",
            '75% Human | 25% Mythos + Animals':"",
            'Pokemon':"",
            '25% Human | 75% Pokemon':"",
            '50% Human | 50% Pokemon':"",
            '75% Human | 25% Pokemon':"",
            'Digimon':"",
            '25% Human | 75% Digimon':"",
            '50% Human | 50% Digimon':"",
            '75% Human | 25% Digimon':"",
            'Pokemon + Digimon':"",
            '25% Human | 75% Pokemon + Digimon':"",
            '50% Human | 50% Pokemon + Digimon':"",
            '75% Human | 25% Pokemon + Digimon':"",
            'Things':"pencil%chair%table%lamp%book%eraser%stapler%binder clip%paperclip%sticky note%whiteboard%highlighter%filing cabinet%desk%trash can%recycling bin%mouse%laptop%smartphone%charger%power bank%USB drive%light bulb%extension cord%surge protector%adapter%router%modem%switch%hub%camera%lens%memory card%case%suitcase%wallet%purse%handbag%umbrella%sunglasses%watch%bracelet%necklace%ring%earrings%belt%shoelace%mirror%comb%hairbrush%toothbrush%toothpaste%soap%shampoo%conditioner%towel%washcloth%razor%shaving cream%deodorant%nail clippers%nail file%tweezers%cotton swabs%tissue box%toilet paper%plunger%shower curtain%bath mat%sink%bathtub%toilet%tiles%floor mat%vacuum cleaner%broom%dustpan%mop%scrub brush%cleaning cloth%cleaning spray%detergent%laundry basket%clothes hanger%ironing board%iron%sewing machine%needle%scissors%safety pin%buttons%zipper%velcro%glue%adhesive tape%duct tape%masking tape%packing tape%measuring cup%mixing bowl%cutting board%knife%spoon%fork%spatula%whisk%ladle%tongs%peeler%grater%colander%strainer%can opener%bottle opener%corkscrew%baking sheet%cake pan%muffin tin%rolling pin%cookie cutter%oven mitt%potholder%stove%oven%microwave%refrigerator%freezer%blender%toaster%coffee maker%kettle%teapot%cup%mug%glass%plate%bowl%serving tray%pitcher%thermos%lunchbox%picnic basket%water bottle%ice cube tray%salt shaker%pepper grinder%napkin%tablecloth%placemat%coaster%candle%candlestick%matchbox%lighter%fire extinguisher%smoke detector%carbon monoxide detector%thermostat%air conditioner%heater%radiator%humidifier%dehumidifier%filter%blinds%curtains%drapes%curtain rod%window%door%door handle%keychain%padlock%hinge%doormat%intercom%doorbell%security camera%safe%toolbox%tape measure%level%nails%screws%bolts%nuts%washers%brackets%clamps%vice%workbench%ladder%paint tray%drop cloth%paint can%primer%varnish%stain%wallpaper%cable ties%zip ties%carabiner%bungee cord%crowbar%sledgehammer%hatchet%shovel%spade%rake%hoe%pitchfork%wheelbarrow%garden hose%sprinkler%watering can%flower pot%planter%pruning shears%hedge trimmer%lawn mower%weed eater%leaf blower%chainsaw%wood chipper%compost bin%birdhouse%bird feeder%birdbath%mailbox%traffic cone%road sign%bulletin board%chalkboard%corkboard%push pin%staple remover%correction fluid%hole punch%paper cutter%laminator%binding machine%shredder%podium%stage%spotlight%microphone stand%speaker stand%flute%metronome%record player%reel%album%photograph%canvas%easel%paint%paint palette%paintbrush%crayon%marker%colored pencil%charcoal%pastel%ink%pen%ruler%protractor%globe%atlas%microscope%magnifying glass%binoculars%lab coat%goggles%test tube%beaker%flask%graduated cylinder%pipette%dropper%Bunsen burner%tripod%retort stand%test tube rack%petri dish%microscope slide%cover slip%centrifuge%spectrometer%oscilloscope%voltmeter%ammeter%thermometer%barometer%anemometer%GPS device%walkie-talkie%remote control%joystick%game controller%console%VR headset%arcade machine%pinball machine%board game%chess set%checkers%backgammon%dice%playing cards%poker chips%dominoes%puzzle%Rubik's cube%yo-yo%kite%slinky%marbles%jacks%spinning top%toy car%toy train%doll%action figure%stuffed animal%building blocks%LEGO%model kit%RC car%skateboard%roller skates%bicycle%helmet%knee pads%elbow pads%backpack%sleeping bag%lantern%camping stove%flashlight%first aid kit%signal mirror%flare%emergency blanket%water filter%canteen%multi-tool%pocket knife%axe%machete%fishing rod%tackle box%bait%net%cooler%boat%paddle%oar%anchor%buoy%life jacket%wetsuit%snorkel%mask%fins%scuba tank%spear gun%kayak%canoe%raft%surfboard%paddleboard%jet ski%sailboat%yacht%motorboat%fishing boat%cargo ship%cruise ship%submarine%jet%airplane%helicopter%glider%hot air balloon%zeppelin%rocket%drone%parachute%wingsuit%spacesuit%space shuttle%rover%telescope%observatory%planetarium%sundial%clock%wristwatch%stopwatch%timer%alarm clock%grandfather clock%cuckoo clock%calendar%planner%diary%journal%notebook%sketchbook%scrapbook%photo album%painting%figurine%model%diorama%trophy%medal%certificate%diploma%award%plaque%banner%flag%sign%poster%billboard%advertisement%marquee%neon sign%streetlight%lamp post%traffic light%crosswalk signal%barricade%cone%detour sign%map%compass%GPS%sextant%radar%sonar%satellite%antenna%radio%television%monitor%projector%speaker%microphone%headphones%headset%amplifier%mixer%equalizer%synthesizer%keyboard%piano%guitar%drum set%violin%cello%clarinet%saxophone%trumpet%trombone%tuba%harmonica%accordion%tambourine%maracas%xylophone%cymbals%triangle%music stand%sheet music%vinyl record%cassette tape%CD%DVD%Blu-ray%VHS tape%film reel%film strip%projector screen%transparencies%slide%binder%folder%clipboard%envelope%stamp%ink pad%seal%wax%string%rubber band%pin%tack%staple%clip%latch%lock%key%chain%rope%cable%wire%hook%pulley%winch%jack%wrench%screwdriver%hammer%pliers%saw%drill%nail%screw%bolt%nut%washer%bracket%clamp%vise%chisel%file%rasp%sandpaper%sander%grinder%welder%torch%soldering iron%glue gun%adhesive%cement%resin%epoxy%sealant%tape%ribbon%thread%yarn%fabric%leather%lace%felt%foam%sponge%brush%roller%tray%bucket%can%jar%bottle%tube%nozzle%spray%pump%valve%faucet%spigot%hose%pipe%duct%vent%fan%motor%engine%turbine%generator%alternator%battery%cell%capacitor%resistor%transistor%diode%circuit board%chip%processor%memory%hard drive%SSD%USB stick%CD drive%DVD drive%Blu-ray drive%floppy disk%diskette%tape drive%printer%scanner%copier%fax machine%typewriter%calculator%abacus%cash register%ATM%vending machine%kiosk%ticket machine%turnstile%gate%barrier%fence%wall%partition%screen%curtain%drape%blind%shade%awning%canopy%tent%pavilion%gazebo%pergola%arbor%trellis%lattice%post%joist%rafter%truss%column%pillar%arch%dome%roof%ceiling%floor%tile%brick%block%stone%slab%board%sheet%panel%plank%beam%girder%frame%structure%bridge%tunnel%dam%tower%spire%skyscraper%monument%statue%sculpture%fountain%obelisk%pyramid%temple%church%mosque%synagogue%shrine%altar%cross%crucifix%star%crescent%wheel%buzzer%bell%chime%gong%drum%rattle%clapper%whistle%horn%siren%alarm%stapler remover%door wedge%thermometer stand%shoehorn%coat rack%mousepad%stencil%rubber stamp%tripod stool%firewood rack%bike pump%water timer%tool apron%screen protector%note holder%calendar stand%cable organizer%photo mat%step stool%window screen%metal detector",
            'Food':"Apple%Banana%Orange%Grapes%Watermelon%Strawberries%Blueberries%Raspberries%Pineapple%Mango%Papaya%Kiwi%Peach%Pear%Plum%Apricot%Cherries%Pomegranate%Guava%Lychee%Avocado%Tomato%Cucumber%Bell Pepper%Carrot%Potato%Sweet Potato%Broccoli%Cauliflower%Spinach%Kale%Lettuce%Cabbage%Celery%Asparagus%Artichoke%Eggplant%Zucchini%Squash%Pumpkin%Radish%Beet%Onion%Garlic%Leek%Shallot%Ginger%Chili Pepper%Jalapeño%Corn%Green Beans%Peas%Chickpeas%Lentils%Kidney Beans%Black Beans%Soybeans%Tofu%Tempeh%Seitan%Quinoa%Rice%Brown Rice%Jasmine Rice%Basmati Rice%Wild Rice%Oats%Barley%Rye%Wheat%Bread%Pasta%Noodles%Spaghetti%Fettuccine%Linguine%Ravioli%Tortellini%Lasagna%Macaroni%Couscous%Polenta%Pizza%Bagel%English Muffin%Croissant%Danish Pastry%Cinnamon Roll%Waffle%Pancake%French Toast%Muffin%Cupcake%Cake%Cheesecake%Pie%Tart%Brownie%Cookie%Biscuit%Cracker%Chips%Popcorn%Nuts%Beef%Pork%Lamb%Veal%Chicken%Turkey%Duck%Goose%Quail%Eggs%Milk%Yogurt%Cheese%Cheddar%Mozzarella%Parmesan%Gouda%Brie%Camembert%Feta%Cottage Cheese%Cream Cheese%Sour Cream%Butter%Olive Oil%Canola Oil%Coconut Oil%Sesame Oil%Peanut Oil%Sunflower Oil%Vegetable Oil%Vinegar%Balsamic Vinegar%Apple Cider Vinegar%White Vinegar%Worcestershire Sauce%Ketchup%Mustard%Mayonnaise%Hot Sauce%Sriracha%Tabasco%Salsa%Marinara Sauce%Alfredo Sauce%Gravy%Honey%Maple Syrup%Jam%Jelly%Marmalade%Peanut Butter%Almond Butter%Nutella%Chocolate%Dark Chocolate%Milk Chocolate%White Chocolate%Candy%Gummy Bears%Jelly Beans%Licorice%Marshmallows%Ice Cream%Gelato%Sorbet%Popsicle%Milkshake%Smoothie%Juice%Apple Juice%Orange Juice%Grapefruit Juice%Cranberry Juice%Tomato Juice%Carrot Juice%Lemonade%Iced Tea%Coffee%Espresso%Cappuccino%Latte%Tea%Green Tea%Black Tea%Chamomile Tea%Peppermint Tea%Ginger Tea%Herbal Tea%Soda%Cola%Root Beer%Ginger Ale%Sparkling Water%Energy Drink%Sports Drink%Beer%Wine%Red Wine%White Wine%Rosé Wine%Champagne%Whiskey%Bourbon%Scotch%Vodka%Gin%Rum%Tequila%Brandy%Cognac%Liqueur%Sake%Miso%Natto%Kimchi%Sauerkraut%Pickles%Olives%Capers%Anchovies%Sardines%Tuna%Salmon%Cod%Halibut%Trout%Catfish%Shrimp%Crab%Lobster%Clams%Mussels%Oysters%Scallops%Squid%Octopus%Caviar%Snails%Frog Legs%Alligator%Bison%Venison%Elk%Rabbit%Goat%Wild Boar%Ostrich%Pheasant%Cornish Hen%Foie Gras%Truffles%Morels%Chanterelles%Shiitake%Portobello%Button Mushrooms%Cremini Mushrooms%Enoki Mushrooms%Oyster Mushrooms%Maitake Mushrooms%Lion's Mane Mushrooms%Chia Seeds%Flax Seeds%Hemp Seeds%Pumpkin Seeds%Sesame Seeds%Sunflower Seeds%Poppy Seeds%Peanuts%Cashews%Almonds%Walnuts%Pecans%Pistachios%Macadamia Nuts%Hazelnuts%Brazil Nuts%Pine Nuts%Chestnuts%Coconut%Cacao Nibs%Cacao Powder%Cocoa Powder%Almond Flour%Coconut Flour%Chickpea Flour%Rice Flour%Tapioca Flour%Potato Flour%Cornstarch%Baking Powder%Baking Soda%Yeast%Vanilla Extract%Almond Extract%Peppermint Extract%Lemon Extract%Orange Extract%Rose Water%Saffron%Turmeric%Cumin%Coriander%Cardamom%Cinnamon%Nutmeg%Cloves%Allspice%Paprika%Cayenne Pepper%Red Pepper Flakes%Thyme%Rosemary%Oregano%Basil%Parsley%Cilantro%Mint%Dill%Bay Leaves%Curry Powder%Garam Masala%Chinese Five Spice%Italian Seasoning%Herbes de Provence%Cajun Seasoning%Taco Seasoning%Chili Powder%Garlic Powder%Onion Powder%Celery Salt%Smoked Paprika%Liquid Smoke%Vanilla Beans%Cacao Beans%Coffee Beans%Loose Leaf Tea%Matcha Powder%Protein Powder%Spirulina%Chlorella%Wheat Grass%Barley Grass%Alfalfa%Brewer's Yeast%Nutritional Yeast%Carob%Stevia%Agave Nectar%Molasses%Brown Sugar%Coconut Sugar%Date Sugar%Cane Sugar%Confectioner's Sugar%Xylitol%Erythritol%Monk Fruit Sweetener%Artificial Sweeteners%Margarine%Shortening%Lard%Beef Tallow%Duck Fat%Goose Fat%Chicken Fat%Bacon Grease%Schmaltz%Ghee%Avocado Oil%Grapeseed Oil%Flaxseed Oil%Walnut Oil%Hazelnut Oil%Almond Oil%Macadamia Nut Oil%Balsamic Glaze%Soy Sauce%Liquid Aminos%Coconut Aminos%Miso Paste%Hoisin Sauce%Oyster Sauce%Fish Sauce%Shrimp Paste%Curry Paste%Chili Paste%Harissa%Tahini%Pesto%Chimichurri%Gochujang%Mole%Enchilada Sauce%Tomatillo Salsa%Pico de Gallo%Salsa Verde%Mango Salsa%Peach Salsa%Pineapple Salsa%Corn Salsa%Black Bean Salsa%Guacamole%Hummus%Baba Ghanoush%Tzatziki%Raita%Queso%Nacho Cheese Sauce%Salad Dressing%Ranch Dressing%Italian Dressing%Vinaigrette%Caesar Dressing%Blue Cheese Dressing%Thousand Island Dressing%French Dressing%Russian Dressing%Green Goddess Dressing%Honey Mustard Dressing%Poppy Seed Dressing%Raspberry Vinaigrette%Balsamic Vinaigrette%Olive Oil & Vinegar%Soup%Tomato Soup%Vegetable Soup%Chicken Noodle Soup%Minestrone%Clam Chowder%Lobster Bisque%French Onion Soup%Miso Soup%Hot and Sour Soup%Egg Drop Soup%Wonton Soup%Ramen%Pho%Tom Yum%Gazpacho%Borscht%Vichyssoise%Goulash%Bouillabaisse%Cioppino%Jambalaya%Gumbo%Étouffée%Paella%Biryani%Risotto%Pilaf%Fried Rice%Congee%Oatmeal%Grits%Porridge%Granola%Muesli%Trail Mix%Beef Jerky%Fruit Leather%Dried Fruit%Raisins%Craisins%Apricots%Figs%Dates%Prunes%Freeze-Dried Fruit%Fruit Snacks%Fruit Roll-Ups%Canned Fruit%Applesauce%Fruit Cup%Fruit Salad%Ambrosia Salad%Jello Salad%Waldorf Salad%Coleslaw%Macaroni Salad%Potato Salad%Egg Salad%Chicken Salad%Tuna Salad%Crab Salad%Shrimp Salad%Lobster Salad%Seafood Salad%Caesar Salad%Cobb Salad%Chef Salad%Greek Salad%Caprese Salad%Niçoise Salad%Taco Salad%Burrito Bowl%Poke Bowl%Buddha Bowl%Acai Bowl%Smoothie Bowl%Yogurt Parfait%Chia Pudding%Rice Pudding%Tapioca Pudding%Bread Pudding%Crème Brûlée%Flan%Panna Cotta%Tiramisu%Trifle%Pavlova%Meringue%Macarons%Éclairs%Cream Puffs%Profiteroles%Cannoli%Baklava%Strudel%Rugelach%Hamantaschen%Biscotti%Madeleines%Financiers%Palmiers%Elephant Ears%Churros%Sopapillas%Beignets%Doughnuts%Cronut%Cake Pop%Cake Ball%Truffle%Chocolate Truffle%Caramel%Toffee%Brittle%Nougat%Marzipan%Fudge%Divinity%Turkish Delight%Gummies%Hard Candy%Lollipops%Taffy%Caramels%Salt Water Taffy%Peanut Brittle%Almond Roca%English Toffee%Butterscotch%Pralines%Peppermint Patties%Peanut Butter Cups%Chocolate Covered Raisins%Chocolate Covered Nuts%Chocolate Covered Pretzels%Chocolate Covered Espresso Beans%Chocolate Covered Bacon%Chocolate Fondue%Caramel Apples%Candy Apples%Cotton Candy%Popcorn Balls%Caramel Corn%Kettle Corn%Cheese Popcorn%Flavored Popcorn%Pork Rinds%Cracklins%Chicharrones%Plantain Chips%Tortilla Chips%Potato Chips%Corn Chips%Pretzels%Bagel Chips%Pita Chips%Rice Cakes%Croutons%Bread Crumbs%Panko%Stuffing%Cornbread%Biscuits%Rolls%Brioche%Challah%Naan%Pita%Tortillas%Taco Shells%Wonton Wrappers%Spring Roll Wrappers%Rice Paper%Seaweed%Nori",
            'Chaos':""
        },
        age: {
            'All': "1%2%3%4%5%6%7%8%9%10%11%12%13%14%15%16%17%18%19%20%21%22%23%24%25%26%27%28%29%30%31%32%33%34%35%36%37%38%39%40%41%42%43%44%45%46%47%48%49%50%51%52%53%54%55%56%57%58%59%60%61%62%63%64%65%66%67%68%69%70%71%72%73%74%75%76%77%78%79%80%81%82%83%84%85%86%87%88%89%90%91%92%93%94%95%96%97%98%99%100+", // ages 1 to 99
            'Child': "1%2%3%4%5%6%7%8%9%10%11%12%13%14%15%16%17", // ages 1 to 17
            'Adult': "18%19%20%21%22%23%24%25%26%27%28%29%30%31%32%33%34%35%36%37%38%39%40%41%42%43%44%45%46%47%48%49%50%51%52%53%54%55%56%57%58%59%60%61%62%63%64%65%66%67%68%69%70", // ages 18 to 7
            'Elderly':"%71%72%73%74%75%76%77%78%79%80%81%82%83%84%85%86%87%88%89%90%91%92%93%94%95%96%97%98%99%100+",
            'Ancient': "100%200%300%400%500%600%700%800%900%1000%1100%1200%1300%1400%1500%1600%1700%1800%1900%2000%2100%2200%2300%2400%2500%2600%2700%2800%2900%3000%3100%3200%3300%3400%3500%3600%3700%3800%3900%4000%4100%4200%4300%4400%4500%4600%4700%4800%4900%5000%5100%5200%5300%5400%5500%5600%5700%5800%5900%6000%6100%6200%6300%6400%6500%6600%6700%6800%6900%7000%7100%7200%7300%7400%7500%7600%7700%7800%7900%8000%8100%8200%8300%8400%8500%8600%8700%8800%8900%9000%9100%9200%9300%9400%9500%9600%9700%9800%9900%10000+",
        },
        bodyType: {
            'All': "Slim%Athletic%Average%Curvy%Muscular%Stocky%Petite%Lean%Toned%Fit%Slender%Shapely%Voluptuous%Chubby%Overweight%Obese%Hefty%Skinny%Scrawny%Gangly%Lanky%Wiry%Sinewy%Flabby%Pudgy%Plump%Portly%Stout%Rotund%Paunchy%Potbellied%Willowy%Statuesque%Towering%Diminutive%Stubby%Squat%Deformed%Grotesque%Hideous%Unsightly%Repulsive%Revolting%Monstrous%Misshapen%Disfigured%Malformed%Gorgeous%Stunning%Handsome%Beautiful%Attractive%Pleasing%Alluring%Captivating%Charming%Elegant",
            'Slender': "Slim%Lean%Slender%Skinny%Scrawny%Gangly%Lanky%Wiry%Sinewy%Willowy%Lithe%Graceful%Svelte%Sylphlike",
            'Fit': "Athletic%Toned%Fit%Muscular%Sinewy%Strapping%Brawny%Burly%Powerful%Robust%Vigorous%Mighty%Herculean",
            'Average': "Average%Shapely%Stocky%Ordinary%Common%Typical%Regular%Unremarkable%Nondescript%Plain%Homely",
            'Curvy': "Curvy%Voluptuous%Shapely%Buxom%Full-figured%Hourglass%Zaftig%Rubenesque%Lush%Ample%Curvaceous%Bodacious",
            'Overweight': "Chubby%Overweight%Obese%Hefty%Flabby%Pudgy%Plump%Portly%Stout%Rotund%Paunchy%Potbellied%Corpulent%Fleshy%Bloated",
            'Short': "Petite%Diminutive%Stubby%Squat%Pint-sized%Compact%Teeny%Miniature%Elfin%Dainty%Tiny%Wee",
            'Tall': "Towering%Statuesque%Lofty%Gigantic%Colossal%Enormous%Huge%Immense%Mammoth%Gargantuan%Titanic%Mountainous",
            'Ugly': "Deformed%Grotesque%Hideous%Unsightly%Repulsive%Revolting%Monstrous%Misshapen%Disfigured%Malformed%Unpleasant%Homely%Unappealing%Unattractive",
            'Attractive': "Gorgeous%Stunning%Handsome%Beautiful%Attractive%Pleasing%Alluring%Captivating%Charming%Elegant%Exquisite%Magnificent%Dazzling%Radiant",
        },
        personality: {
            'All': "Cheerful%Serious%Energetic%Calm%Average%Shy%Outgoing%Snarky%Kind%Brave%Cautious%Adventurous%Ambitious%Analytical%Charismatic%Confident%Creative%Curious%Dependable%Diplomatic%Disciplined%Empathetic%Enthusiastic%Extroverted%Friendly%Generous%Gentle%Honest%Humble%Humorous%Idealistic%Independent%Introverted%Intuitive%Logical%Loyal%Mysterious%Observant%Optimistic%Passionate%Patient%Perfectionist%Persistent%Pessimistic%Philosophical%Practical%Resourceful%Romantic%Sarcastic%Selfless%Sensible%Sensitive%Skeptical%Sociable%Spontaneous%Stoic%Stubborn%Sympathetic%Thoughtful%Trustworthy%Unpredictable%Wise%Witty%Zealous",
            'Positive': "Cheerful%Energetic%Kind%Brave%Adventurous%Ambitious%Charismatic%Confident%Creative%Curious%Dependable%Empathetic%Enthusiastic%Friendly%Generous%Gentle%Honest%Humble%Humorous%Idealistic%Independent%Intuitive%Loyal%Optimistic%Passionate%Patient%Persistent%Resourceful%Romantic%Selfless%Sensible%Sensitive%Sociable%Spontaneous%Sympathetic%Thoughtful%Trustworthy%Wise%Witty%Zealous",
            'Neutral': "Average%Analytical%Calm%Cautious%Diplomatic%Disciplined%Extroverted%Introverted%Logical%Mysterious%Observant%Philosophical%Practical%Stoic",
            'Negative': "Serious%Shy%Snarky%Cautious%Pessimistic%Perfectionist%Sarcastic%Skeptical%Stubborn%Unpredictable",
            'Extroverted': "Cheerful%Energetic%Outgoing%Adventurous%Charismatic%Confident%Enthusiastic%Extroverted%Friendly%Humorous%Sociable%Spontaneous%Witty",
            'Introverted': "Serious%Calm%Shy%Analytical%Cautious%Independent%Introverted%Mysterious%Observant%Thoughtful",
            'Thinking': "Analytical%Logical%Practical%Skeptical%Resourceful%Sensible%Wise%Philosophical%Perfectionist%Stoic%Disciplined%Persistent",
            'Feeling': "Kind%Empathetic%Gentle%Romantic%Selfless%Sensitive%Sympathetic%Idealistic%Passionate%Sentimental%Compassionate%Nurturing",
            'Judging': "Serious%Ambitious%Disciplined%Dependable%Honest%Loyal%Persistent%Practical%Responsible%Sensible%Trustworthy%Decisive%Organized%Punctual",
            'Perceiving': "Energetic%Adventurous%Creative%Curious%Adaptable%Easygoing%Flexible%Open-minded%Spontaneous%Tolerant%Improvising%Relaxed",
            'Assertive': "Confident%Independent%Ambitious%Decisive%Determined%Dominant%Firm%Strong-willed%Competitive%Bold%Daring%Fearless",
            'Turbulent': "Snarky%Sarcastic%Unpredictable%Chaotic%Impulsive%Moody%Paranoid%Pessimistic%Quarrelsome%Resentful%Temperamental%Volatile",
        },
        bio: {
            'Standard': "Loves exploring new places.%Enjoys reading books and learning new things.%Has a passion for music and the arts.%A dedicated athlete and fitness enthusiast.%An adventurous spirit with a love for travel.%Loyal friend who values honesty and integrity.%Tech-savvy individual with a knack for gadgets.%Creative thinker who enjoys solving problems.%Animal lover who spends time volunteering at shelters.%An aspiring chef who loves experimenting in the kitchen.",
            // Add more categories if needed
        },
    };

    // the "Animals" category was seperated into several different sections as to make it not so absurd in length
    // A section
    defaultRandomizerOptions.species["Animals"] += "Aardvark%Aardwolf%Abyssinian%Abyssinian Guinea Pig%Acadian Flycatcher%Achrioptera Manga%Ackie Monitor%Addax%Adélie Penguin%Admiral Butterfly%Aesculapian Snake%Affenpinscher%Afghan Hound%African Bullfrog%African Bush Elephant%African Civet%African Clawed Frog%African Elephant%African Fish Eagle%African Forest Elephant%African Golden Cat%African Grey Parrot%African Jacana%African Palm Civet%African Penguin%African Sugarcane Borer%African Tree Toad%African Wild Dog%Africanized bee (killer bee)%Agama Lizard%Agkistrodon Contortrix%Agouti%Aidi%Ainu%Airedale Terrier%Airedoodle%Akbash%Akita%Akita Shepherd%Alabai (Central Asian Shepherd)%Alaskan Husky%Alaskan Klee Kai%Alaskan Malamute%Alaskan Pollock%Alaskan Shepherd%Albacore Tuna%Albatross%Albertonectes%Albino (Amelanistic) Corn Snake%Aldabra Giant Tortoise%Alligator Gar%Allosaurus%Allosaurus%Alpaca%Alpine Dachsbracke%Alpine Goat%Alusky%Amano Shrimp%Amargasaurus%Amazon Parrot%Amazon River Dolphin (Pink Dolphin)%Amazon Tree Boa%Amazonian Royal Flycatcher%Amberjack%Ambrosia Beetle%American Alligator%American Alsatian%American Bulldog%American Bully%American Cocker Spaniel%American Cockroach%American Coonhound%American Dog Tick%American Eel%American Eskimo Dog%American Foxhound%American Hairless Terrier%American Leopard Hound%American Paddlefish%American Pit Bull Terrier%American Pugabull%American Pygmy Goat%American Robin%American Staffordshire Terrier%American Toad%American Water Spaniel%American Wirehair%Amethystine Python (Scrub Python)%Amphicoelias Fragillimus%Amur Leopard%Anaconda%Anatolian Shepherd Dog%Anchovies%Andrewsarchus%Angelfish%Angelshark%Angled Sunbeam Caterpillar%Anglerfish%Angora Ferret%Angora Goat%Anhinga%Anna’s Hummingbird%Anole Lizard%Anomalocaris%Ant%Antarctic Scale Worm%Anteater%Antelope%Anteosaurus%Antiguan Racer Snake%Aoudad Sheep%Ape%Apennine Wolf%Appenzeller Dog%Apple Head Chihuahua%Apple Moth%Arabian Cobra%Arabian Wolf%Arafura File Snake%Arambourgiania%Arapaima%Archaeoindris%Archaeopteryx%Archaeotherium%Archelon Turtle%Archerfish%Arctic Char%Arctic Fox%Arctic Hare%Arctic Wolf%Arctodus%Arctotherium%Argentavis Magnificens%Argentine Black and White Tegu%Argentine Horned Frog%Argentinosaurus%Arizona Bark Scorpion%Arizona Black Rattlesnake%Arizona Blonde Tarantula%Arizona Coral Snake%Armadillo%Armadillo Lizard%Armenian Gampr%Armored Catfish%Armyworm%Arsinoitherium%Arthropleura%Aruba Rattlesnake%Ashy Mining Bee%Asian Arowana%Asian Carp%Asian Cockroach%Asian Elephant%Asian Giant Hornet%Asian Lady Beetle%Asian Longhorn Beetle%Asian Palm Civet%Asian Vine Snake%Asian Water Monitor%Asiatic Black Bear%Asp%Assassin Bug%Assassin Snail%Atlantic Cod%Atlantic Salmon%Atlantic Sturgeon%Atlas Beetle%Atlas Moth%Aurochs%Aussiedoodle%Aussiedor%Aussiepom%Australian Bulldog%Australian Cattle Dog%Australian Cockroach%Australian Firehawk%Australian Flathead Perch%Australian Gecko%Australian Kelpie Dog%Australian Labradoodle%Australian Mist%Australian Retriever%Australian Shepherd%Australian Shepherd Mix%Australian Terrier%Australopithecus%Australorp Chicken%Avocet%Axanthic Ball Python%Axolotl%Ayam Cemani%Aye-aye%Azawakh%";
    // B section
    defaultRandomizerOptions.species["Animals"] += "Babirusa%Baboon%Bactrian Camel%Badger%Bagle – Basset Hound Mix%Bagworm Moth%Bagworm Moth Caterpillar%Baird’s Rat Snake%Bald Eagle%Baleen Whale%Balinese%Balkan Lynx%Ball Python%Bamboo Rat%Bamboo Shark%Bamboo Worms%Banana Ball Python%Banana Cinnamon Ball Python%Banana Spider%Banded Krait%Banded Palm Civet%Banded Water Snake%Bandicoot%Banjo Catfish%Barb%Barbet%Barbut’s Cuckoo Bumblebee%Barinasuchus%Bark Beetle%Bark Scorpion%Barn Owl%Barn Spider%Barn Swallow%Barnacle%Barnevelder%Barosaurus%Barracuda%Barramundi Fish%Barred Owl%Barreleye Fish (Barrel Eye)%Barylambda%Basenji Dog%Basenji Mix%Basilisk Lizard%Basilosaurus%Basking Shark%Bass%Bassador%Basset Fauve de Bretagne%Basset Hound%Bassetoodle%Bat-Eared Fox%Batfish%Bavarian Mountain Hound%Baya%Bea-Tzu%Beabull%Beagador%Beagle%Beagle Mix%Beagle Shepherd%Beaglier%Beago%Bear%Bearded Collie%Bearded Dragon%Bearded Fireworm%Bearded Vulture%Beaski%Beauceron%Beauty rat snake%Beaver%Bed Bugs%Bedlington Terrier%Bee%Bee-Eater%Beefalo%Beetle%Beewolf wasp%Belgian Canary%Belgian Laekenois%Belgian Malinois%Belgian Malinois Mix%Belgian Sheepdog%Belgian Shepherd%Belgian Tervuren%Belted Kingfisher%Beluga Sturgeon%Beluga Sturgeon%Bengal Tiger%Bergamasco%Berger Blanc Suisse%Berger Picard%Bernedoodle%Bernese Mountain Dog%Bernese Mountain Dog Mix%Bernese Shepherd%Betta Fish (Siamese Fighting Fish)%Bhutan Takin%Bichir%Bichon Frise%Bichpoo%Biewer Terrier%Bigfin Reef Squid %Bighorn Sheep%Bilby%Binturong%Bird%Bird Of Paradise%Bird Snake%Birman%Biscuit Beetle%Bismarck Ringed Python%Bison%Black And Tan Coonhound%Black and White Warbler%Black Aphids%Black Bass%Black Crappie%Black Dragon Lizard%Black German Shepherd%Black Mamba%Black Marlin%Black Mouth Cur%Black Pastel Ball Python%Black Rat Snake%Black Rhinoceros%Black Russian Terrier%Black Sea Bass%Black Swallowtail Caterpillar%Black Tarantula%Black Throat Monitor%Black Wasp%Black Widow Spider%Black Witch Moth%Black-Bellied Whistling Duck%Black-Capped Chickadee%Black-Footed Ferret%Black-headed python%Black-Tailed Rattlesnake%Blackburnian Warbler%Blackfin Tuna%Blacknose Shark%Blackpoll Warbler%Blacktip Reef Shark%Blacktip Shark %Bladefin Basslet%Blanket Octopus%Blind Snake%Blister Beetle%Blister Beetle%Blobfish%Blood Python%Bloodhound%Blowfly%Blue Andalusian%Blue Belly Lizard%Blue Catfish%Blue Death Feigning Beetle%Blue Dragon Sea Slug%Blue Eyed Pleco%Blue German Shepherd%Blue Gray Gnatcatcher%Blue grosbeak%Blue Iguana%Blue Jay%Blue Lacy Dog%Blue Nose Pit Bull%Blue Picardy Spaniel%Blue Racer%Blue Shark%Blue Tanager (Blue-Grey Tanager)%Blue Tang%Blue Tit%Blue Whale%Blue-Ringed Octopus%Bluefin Tuna%Bluefish%Bluegill%Bluetick Coonhound%Boas%Bobcat%Bobolink%Boelen’s python%Boer Goat%Boerboel%Boggle%Boglen Terrier%Boiga%Bolivian Anaconda%Bolognese Dog%Bombardier Beetle%Bombay%Bonefish%Bongo%Bonito Fish%Bonnethead Shark%Bonobo%Booby%Boomslang%Booted Bantam%Borador%Border Collie%Border Collie Mix%Border Terrier%Bordoodle%Borkie%Bornean Orangutan%Borneo Elephant%Boskimo%Boston Terrier%Bottlenose Dolphin%Bouvier Des Flandres%Bowfin%Bowhead Whale%Box Jellyfish%Box Tree Moth%Box Turtle%Box-Headed Blood Bee%Boxachi%Boxador%Boxer Dog%Boxer Mix%Boxerdoodle%Boxfish%Boxsky%Boxweiler%Bracco Italiano%Brachiosaurus%Brahma Chicken%Brahminy Blindsnake%Braque du Bourbonnais%Braque Francais%Brazilian Black Tarantula%Brazilian Terrier%Brazilian Treehopper%Bredl’s Python%Briard%British Timber%Brittany%Brontosaurus%Bronze Whaler Shark%Bronze-winged Jacana%Brook Trout%Brookesia Micra%Brown Bear%Brown Dog Tick%Brown Headed Cowbird%Brown Hyena%Brown Snake%Brown Tree Snake%Brown Water Snake%Brown-banded Cockroach%Brug%Brussels Griffon%Budgerigar%Buff Orpington Chicken%Buffalo%Buffalo Fish%Bull and Terrier%Bull Shark%Bull Terrier%Bull Trout%Bullboxer%Bulldog%Bulldog Mix%Bullfrog%Bullmastiff%Bullsnake%Bumblebee%Burmese%Burmese Python%Burrowing Frog%Burrowing Owl%Bush Baby%Bush Dog%Bush Viper%Bushmaster Snake%Butterfly%Butterfly Fish%";
    // C section
    defaultRandomizerOptions.species["Animals"] += "Cabbage Moth%Cactus Moth%Cactus Mouse%Cactus Wren%Caecilian%Caiman%Caiman Lizard%Cairn Terrier%California Condor%California Kingsnake%California Tarantula%Camel%Camel Cricket%Camel Spider%Campine Chicken%Canaan Dog%Canada Lynx%Canada Warbler%Canadian Eskimo Dog%Canadian Horse%Cane Corso%Cane Rat%Cane Spider%Cantil%Canvasback%Cape Lion%Capuchin%Capybara%Caracal%Cardinal%Caribbean Reef Shark%Caribou%Carolina Dog%Carolina Parakeet%Carp%Carpenter Ant%Carpet Beetle%Carpet Python%Carpet Viper%Carrion Beetle%Cascabel%Cashmere Goat%Cassowary%Cat%Cat Snake%Cat-Eyed Snake%Cat-Faced Spider%Catahoula Bulldog%Catahoula Leopard%Catalan Sheepdog%Caterpillar%Catfish%Caucasian Mountain Dog (Shepherd)%Caucasian Shepherd%Cava Tzu%Cavador%Cavalier King Charles Spaniel%Cavapoo%Cave Bear%Cave Lion%Cecropia Moth%Cedar Waxwing%Centipede%Central Ranges Taipan%Cephalaspis%Ceratopsian%Ceratosaurus%Cervalces latifrons (Broad-Fronted Moose)%Cesky Fousek%Cesky Terrier%Chain Pickerel%Chameleon%Chamois%Chartreux%Cheagle%Checkered Garter Snake%Cheetah%Chesapeake Bay Retriever%Chestnut-Sided Warbler%Chi Chi%Chickadee%Chicken%Chicken Snake%Chigger%Chihuahua%Chihuahua Mix%Children’s python%Chilean Recluse Spider%Chilean Rose Tarantula%Chilesaurus%Chimaera%Chimpanzee%Chinchilla%Chinese Alligator%Chinese Cobra%Chinese Crested Dog%Chinese Geese%Chinese Paddlefish%Chinese Shar-Pei%Chinese Water Deer%Chinook%Chinook Salmon%Chinstrap Penguin%Chipit%Chipmunk%Chipoo%Chipping Sparrow%Chiton%Chiweenie%Chorkie%Chow Chow%Chow Pom%Chow Shepherd%Christmas Beetle%Christmas Island Red Crab%Chromodoris Willani%Chusky%Cicada%Cichlid%Cinereous Vulture%Cinnamon Ball Python%Cinnamon Bear%Cinnamon Ferret%Clark’s Grebe%Clearnose Skate%Click Beetle%Clock Spider%Clothes Moth%Clouded Leopard%Clownfish%Clumber Spaniel%Coachwhip Snake%Coastal Carpet Python%Coastal Taipan%Coati%Cobalt Blue Tarantula%Cobia Fish%Cobras%Cochin Chicken%Cockalier%Cockapoo%Cockatiel%Cockatoo%Cocker Spaniel%Cockle%Cockroach%Coconut Crab %Codfish%Codling Moth%Coelacanth%Collared Peccary%Collett’s Snake%Collie%Collie Mix%Colossal Squid%Comb Jellyfish%Comb-crested Jacana%Comet Moth%Comfort Retriever%Common Buzzard%Common Carp%Common European Adder%Common Frog%Common Furniture Beetle%Common Goldeneye%Common Grackle%Common Green Magpie%Common House Spider%Common Loon%Common Raven%Common Spotted Cuscus%Common Toad%Common Yellowthroat%Compsognathus%Cone Snail%Conger Eel%Congo Snake%Conure%Cookiecutter Shark%Cooper’s Hawk%Copperhead%Coral%Coral Snake%Corella%Corgidor%Corgipoo%Corkie%Corman Shepherd%Cormorant%Corn Earworm%Corn Rex Cat (Cornish Rex)%Corn Snake%Cory Catfish%Coryphodon%Cosmic Caterpillar%Costa’s Hummingbird%Coton de Tulear%Cotton-top Tamarin%Cottonmouth%Coues Deer%Cougar%Cow%Cow Reticulated Python%Coyote%Crab%Crab Spider%Crab-Eating Fox%Crab-Eating Macaque%Crabeater Seal%Crane%Crappie Fish%Crayfish%Crested Gecko%Crested Penguin%Cricket%Croatian Sheepdog%Crocodile%Crocodile Monitor%Crocodile Shark%Crocodylomorph%Cross Fox%Cross River Gorilla%Crow%Crucian Carp%Cryolophosaurus%Cuban Boa%Cuban Cockroach%Cubera Snapper%Cuckoo%Cucumber Beetle%Curly Coated Retriever%Curly Hair Tarantula%Cuttlefish%Czechoslovakian Wolfdog%";
    // D section
    defaultRandomizerOptions.species["Animals"] += "Dachsador%Dachshund%Dachshund Mix%Daeodon%Dalmadoodle%Dalmador%Dalmatian%Damselfish%Dandie Dinmont Terrier%Daniff%Danios%Danish Swedish Farmdog%Dapple Dachshund%Dark-Eyed Junco%Dark-Eyed Junco%Darkling Beetle%Darwin’s fox%Darwin’s Frog%Daug%De Brazza’s Monkey%De Kay’s Brown Snake%Death Adder%Death’s Head Cockroach%Deathwatch Beetle%Decorator Crab%Deer%Deer Head Chihuahua%Deer Mouse%Deer Tick%Deinocheirus%Deinosuchus%Desert Ghost Ball Python%Desert Kingsnake%Desert Locust%Desert Rain Frog%Desert Tortoise%Desert Wolf%Desmostylus%Deutsche Bracke%Devil’s Coach Horse Beetle%Devon Rex%Dhole%Diamond Python%Diamondback Moth%Dickcissel%Dickinsonia%Dik-Dik%Dilophosaurus%Dimetrodon%Diminutive Woodrat%Dingo%Dinocrocuta%Dinofelis%Dinopithecus%Dinosaur Shrimp%Dinosaurs%Diplodocus%Diprotodon%Dire Wolf%Disco Clam%Discus%Diving Bell Spider (Water Spider)%Diving Duck%Doberman Pinscher%Dobsonfly%Dodo%Doedicurus%Dog%Dog Tick%Dogo Argentino%Dogue De Bordeaux%Dolphin%Donkey%Dorgi%Dorkie%Dorking Chicken%Dormouse%Double Doodle%Douc%Downy Woodpecker%Doxiepoo%Doxle%Draco Volans Lizard%Dragon Eel%Dragon Snake (Javan Tubercle Snake% Javan Mudsnake)%Dragonfish%Dragonfly%Dreadnoughtus%Drever%Dried Fruit Moth%Drum Fish%Dubia Cockroach%Duck%Dugong%Dumeril’s Boa%Dung Beetle%Dungeness Crab%Dunker%Dunkleosteus%Dunnock%Dusky Dolphin%Dusky Shark%Dutch Rabbit%Dutch Shepherd%Dwarf Boa%Dwarf Crocodile%Dwarf Gourami%Dwarf Hamster%";
    // E section
    defaultRandomizerOptions.species["Animals"] += "Eagle%Eagle Ray%Eared Grebe%Earless Monitor Lizard%Earthworm%Earwig%East Siberian Laika%Eastern Barred Bandicoot%Eastern Bluebird%Eastern Box Turtle%Eastern Brown Snake%Eastern Chipmunk%Eastern Coral Snake%Eastern Cottontail%Eastern Diamondback Rattlesnake%Eastern Dobsonfly%Eastern Fence Lizard%Eastern Glass Lizard%Eastern Gorilla%Eastern Gray Squirrel%Eastern Green Mamba%Eastern Hognose Snake%Eastern Indigo Snake%Eastern Kingbird%Eastern Lowland Gorilla%Eastern Meadowlark%Eastern Phoebe%Eastern Racer%Eastern Rat Snake%Eastern Tiger Snake%Eastern Turkey (Wild Turkey)%Eastern Woodrat%Echidna%Eclectus Parrot%Edible Frog%Eel%Eel catfish%Eelpout%Egret%Egyptian Cobra (Egyptian Asp)%Egyptian Goose%Egyptian Mau%Egyptian Tortoise%Egyptian Vulture%Eider%Eland%Elasmosaurus%Elasmotherium%Electric Catfish%Electric Eel%Elegant Tern%Elephant%Elephant Beetle%Elephant Bird%Elephant Fish%Elephant Seal%Elephant Shrew%Elf Owl%Elk%Ember Tetra%Embolotherium%Emerald Toucanet%Emerald Tree Boa%Emerald Tree Monitor%Emperor Angelfish%Emperor Goose%Emperor Penguin%Emperor Tamarin%Emu%Enchi Ball Python%English Angora Rabbit%English Bulldog%English Cocker Spaniel%English Cream Golden Retriever%English Crested Guinea Pig%English Foxhound%English Longhorn Cattle%English Pointer%English Setter%English Shepherd%English Springer Spaniel%English Toy Terrier%Entlebucher Mountain Dog%Epagneul Pont Audemer%Epicyon haydeni%Epidexipteryx%Equatorial Spitting Cobra%Equus giganteus%Ermine%Eryops%Escolar%Eskimo Dog%Eskipoo%Estrela Mountain Dog%Euoplocephalus%Eurasian Beaver%Eurasian Bullfinch%Eurasian Collared Dove%Eurasian Eagle-owl%Eurasian Jay%Eurasian Lynx%Eurasian Nuthatch%Eurasian Wolf%Eurasier%European Bee-Eater%European Corn Borer%European Goldfinch%European Polecat%European Robin%European Starling%European Wildcat%Eurypterus%Evening Bat%Evening Grosbeak%Executioner Wasp %Eyelash Viper%";
    // F section
    defaultRandomizerOptions.species["Animals"] += "Fairy-Wren%Falcon%Fallow deer%False Cobra%False coral snake%False Killer Whale%False Water Cobra%False Widow Spider%Fancy Mouse%Fangtooth%Feather Star%Feist%Fennec Fox%Fer-de-lance Snake%Ferret%Ferruginous Hawk%Fiddler Crab%Field Cuckoo Bumblebee%Field Spaniel%Fierce Snake%Figeater Beetle%Fila Brasileiro%Fin Whale%Finch%Finnish Lapphund%Finnish Spitz%Fire Ball Python%Fire Eel%Fire Salamander%Fire-Bellied Toad%Firefly%Firefly Ball Python%Fish%Fisher%Fishing Cat%Flamingo%Flat-Coated Retriever%Flathead Catfish%Flea%Flea Beetle%Fleckvieh Cattle%Florida Gar%Florida Mouse%Florida Panther%Florida Woods Cockroach%Flounder%Flounder Fish%Flour Beetle%Flowerhorn Fish%Fluke Fish (summer flounder)%Fly%Flycatcher%Flying Fish%Flying Lemur%Flying Snake%Flying Squirrel%Football Fish%Forest Cobra%Forest Cuckoo Bumblebee%Formosan Mountain Dog%Fossa%Fox%Fox Snakes%Fox Squirrel%Fox Terrier%Freeway Ball Python%French Bulldog%French Bulldog Mix%French Lop%Frenchton%Frengle%Freshwater Crocodile%Freshwater Drum%Freshwater Eel%Freshwater Jellyfish%Freshwater Sunfish%Frigatebird%Frilled Lizard%Frilled Shark%Fritillary Butterfly%Frizzle Chicken%Frog%Frogfish%Frug%Fruit Bat%Fruit Fly%Fulvous Whistling Duck%Fur Seal%Furrow Bee%";
    // G section
    defaultRandomizerOptions.species["Animals"] += "Gaboon Viper%Gadwall%Galapagos Penguin%Galapagos Shark%Galapagos Tortoise%Gar%Garden Eel%Garden Spider%Gargoyle Gecko%Garter Snake%Gastornis%Gazelle%Gecko%Genet%Gentoo Penguin%Geoffroys Tamarin%Gerberian Shepsky%Gerbil%German Cockroach%German Longhaired Pointer%German Pinscher%German Shepherd Guide%German Shepherd Mix%German Sheppit%German Sheprador%German Shorthaired Pointer%German Spitz%German Wirehaired Pointer%Gharial%Ghost Catfish%Ghost Crab%Giant African Land Snail%Giant Armadillo%Giant Beaver%Giant Clam%Giant Desert Centipede%Giant Golden Mole%Giant House Spider%Giant Isopod%Giant Leopard Moth%Giant Panda Bear%Giant Salamander%Giant Schnauzer%Giant Schnoodle%Giant Siphonophore%Giant Trevally%Giant Weta%Giant Wood Moth%Gibbon%Gigantopithecus%Gila Monster%Giraffe%Glass Frog%Glass Lizard%Glechon%Glen Of Imaal Terrier%Glowworm%Gnat%Goat%Goberian%Goblin Shark%Goby Fish%Goldador%Goldcrest%Golden Dox%Golden Eagle%Golden Irish%Golden Jackal%Golden Lancehead%Golden Lion Tamarin%Golden Masked Owl%Golden Mole%Golden Newfie%Golden Oriole%Golden Pyrenees%Golden Retriever%Golden Retriever Mix%Golden Saint%Golden Shepherd%Golden Shiner%Golden Tortoise Beetle%Golden Trout%Golden-Crowned Flying Fox%Golden-Crowned Kinglet%Goldendoodle%Goldfish%Goliath Beetle%Goliath Frog%Goliath Grouper%Goliath Tigerfish%Gollie%Gomphotherium%Goonch Catfish%Goose%Gooty Sapphire Tarantula%Gopher%Gopher Tortoise%Goral%Gordon Setter%Gorgosaurus%Gorilla%Goshawk%Gouldian Finch%Gourami%Grapevine Beetle%Grass Carp%Grass Snake%Grass Spider%Grasshopper%Grasshopper Mouse%Gray Catbird%Gray Fox%Gray Tree Frog%Great Blue Heron%Great Crested Flycatcher%Great Dane%Great Dane Mix%Great Danoodle%Great Egret%Great Hammerhead Shark%Great Kiskadee%Great Plains Rat Snake%Great Potoo Bird%Great Pyrenees%Great Pyrenees Mix%Great White Shark%Greater Swiss Mountain Dog%Grebe%Green Anaconda%Green Anole%Green Aphids%Green Bee-Eater%Green Bottle Blue Tarantula%Green Frog%Green Heron%Green June Beetle%Green Mamba%Green Rat Snake%Green Snake%Green Sunfish%Green Tree Frog%Green Tree Python%Greenland Dog%Greenland Shark%Grey Heron%Grey Mouse Lemur%Grey Reef Shark%Grey Seal%Greyhound%Griffon Vulture%Griffonshire%Grizzly Bear%Groenendael%Ground Snake%Ground Squirrel%Groundhog (Woodchuck)%Groundhog Tick%Grouper%Grouse%Grunion%Guadalupe Bass%Guinea Fowl%Guinea Pig%Gulper Catfish %Gulper Eel %Guppy%Gypsy Cuckoo Bumblebee%Gypsy Moth%";
    // H section
    defaultRandomizerOptions.species["Animals"] += "Haast’s Eagle%Habu Snake%Haddock%Hagfish%Haikouichthys%Hainosaurus%Hairy Frogfish%Hairy Woodpecker%Hairy-footed Flower Bee%Halibut%Hallucigenia%Hamburg Chicken%Hammerhead Shark%Hammerhead Worm%Hammond’s flycatcher%Hamster%Harbor Porpoise%Harbor Seal%Hardhead Catfish%Hare%Harlequin Coral Snake%Harlequin Rabbit%Harp Seal%Harpy Eagle%Harrier%Harris’s Hawk%Hartebeest%Hatzegopteryx%Havamalt%Havanese%Havapoo%Havashire%Havashu%Hawaiian Crow%Hawaiian Goose (Nene)%Hawaiian Monk Seal%Hawk%Hawk Moth Caterpillar%Hedgehog%Helicoprion%Hellbender%Hepatic Tanager (Red Tanager)%Hercules Beetle%Hercules Moth%Hermit Crab%Heron%Herrerasaurus%Herring%Herring Gull%Highland Cattle%Himalayan%Hippopotamus%Hippopotamus gorgops%Hoary Bat%Hobo Spider%Hognose snake%Hokkaido%Holy Cross Frog%Honduran White Bat%Honey Badger%Honey Bee%Honey Buzzard%Hooded Oriole%Hooded Seal%Hook-Nosed Sea Snake%Hoopoe%Horgi%Horn Shark%Hornbill%Horned Adder%Horned Beetle%Horned Grebe%Horned Lizard%Horned Viper%Hornet%Horse%Horse Mackerel%Horsefly%Horseshoe Crab%Houdan Chicken%House Finch%House Sparrow (English Sparrow)%House wren%Housefly%Hovasaurus%Hovawart%Howler Monkey%Human%Humboldt Penguin%Humboldt Squid%Hummingbird%Hummingbird Hawk-Moth%Humpback Whale%Huntaway%Huntsman Spider%Huskador%Huskita%Husky%Husky Jack%Huskydoodle%Hyacinth Macaw%Hyaenodon%Hyena%";
    // I section
    defaultRandomizerOptions.species["Animals"] += "Ibex%Ibis%Ibizan Hound%Icadyptes%Icelandic Sheepdog%Ichthyosaurus%Ichthyostega%Iguana%Iguanodon%IMG Boa Constrictor%Immortal Jellyfish%Impala%Imperial Moth%Inchworm%Indian Cobra%Indian Elephant%Indian Giant Squirrel%Indian Palm Squirrel%Indian python%Indian Rhinoceros%Indian Star Tortoise%Indianmeal Moth%Indigo Snake%Indochinese Tiger%Indri%Inland Taipan%Insect%Insects%Io Moth%Irish Doodle%Irish Elk%Irish Setter%Irish Terrier%Irish Water Spaniel%Irish WolfHound%Italian Greyhound%Ivory-billed woodpecker%Ivy Bee%";
    // J section
    defaultRandomizerOptions.species["Animals"] += "Jabiru%Jacana%Jack Crevalle%Jack Russells%Jack-Chi%Jackabee%Jackal%Jackdaw%Jackrabbit%Jackson’s Chameleon%Jagdterrier%Jaguar%Jaguarundi Cat%Jamaican Boa%Jamaican Iguana%Japanese Bantam Chicken%Japanese Beetle%Japanese Chin%Japanese Macaque%Japanese rat snake%Japanese Spitz%Japanese Squirrel%Japanese Terrier%Javan Leopard%Javan Rhinoceros%Javanese%Jellyfish%Jerboa%Jewel Beetle %John Dory%Jonah Crab%Joro Spider%Josephoartigasia monesi%Jumping Spider%Jungle Carpet Python%Junglefowl%";
    // K section
    defaultRandomizerOptions.species["Animals"] += "Kagu%Kai Ken%Kakapo%Kaluga Sturgeon%Kamehameha Butterfly%Kangal Shepherd Dog%Kangaroo%Kangaroo Mouse%Kangaroo Rat%Katydid%Kaua’i ‘Ō‘ō%Keagle%Keel-Billed Toucan%Keelback%Keeshond%Kelp Greenling%Kentucky Warbler%Kenyan Sand Boa%Kermode Bear (Spirit Bear)%Kerry Blue Terrier%Kestrel%Keta Salmon%Key Deer%Keyhole Cichlid%Khao Manee%Khapra Beetle%Kiang%Kiko Goat%Killdeer%Killer Clown Ball Python%Killer Whale%Killifish%Kinabalu Giant Red Leech%Kinder Goat%King Cobra%King Crab%King Eider%King Mackerel%King Penguin%King Rat Snake%King Salmon%King Shepherd%King Snake%King Vulture%Kingfisher%Kingklip%Kinkajou%Kirtland’s Snake%Kishu%Kissing Bugs%Kissing Gourami%Kit Fox%Kitefin Shark%Kiwi%Klipspringer%Knifefish%Knight Anole%Koala%Kodiak Bear%Kodkod%Koi Fish%Kokanee Salmon%Komodo Dragon%Komondor%Kooikerhondje%Koolie%Korean Jindo%Kori Bustard%Kouprey%Kowari%Krait%Krill%Kudu%Kudzu Bug%Kuvasz%";
    // L section
    defaultRandomizerOptions.species["Animals"] += "Labahoula%Labmaraner%Labout’s Fairy Wrasse%Labrabull%Labradane%Labradoodle%Labrador Retriever%Labraheeler%Labrottie%Lace Bug%Lace Monitor%Ladybug%Ladyfish%Lagotto Romagnolo%Lake Sturgeon%Lake Trout%Lakeland Terrier%LaMancha Goat%Lamprey%Lancashire Heeler%Lancetfish%Landseer Newfoundland%Lappet-faced Vulture%Lapponian Herder%Larder Beetle%Large Munsterlander%Largemouth Bass%Laughing Kookaburra%Lavender Albino Ball Python%Lawnmower Blenny%Lazarus Lizard%Leaf-Tailed Gecko%Leafcutter Ant%Leafcutter Bee%Least Flycatcher%Leatherback Sea Turtle%Leech%Leedsichthys%Leghorn Chicken%Leichhardt’s Grasshopper%Lemming%Lemon Blast Ball Python%Lemon Cuckoo Bumblebee%Lemon Shark%Lemur%Leonberger%Leopard%Leopard Cat%Leopard Frog%Leopard Gecko%Leopard Lizard%Leopard Seal%Leopard Shark%Leopard Tortoise%Leptocephalus%Lesser Jacana%Lesser Scaup%Lhasa Apso%Lhasapoo%Liger%Limpet%Lineback Cattle%Linnet%Lion%Lion’s Mane Jellyfish%Lionfish%Liopleurodon%Liopleurodon%Lipstick Albino Boa%Little Brown Bat%Little Penguin%Livyatan%Lizard%Lizardfish%Llama%Loach%Lobster%Locust%Loggerhead Shrike%Lone Star Tick%Long-Eared Owl%Long-Haired Rottweiler%Long-Tailed Tit%Long-Winged Kite Spider%Longfin Mako Shark%Longnose Gar%Lorikeet%Loris%Lowchen%Lumpfish%Luna Moth%Luna Moth Caterpillar%Lungfish%Lurcher%Lykoi Cat%Lynx%Lyrebird%Lystrosaurus%";
    // M section
    defaultRandomizerOptions.species["Animals"] += "Macaque%Macaroni Penguin%Macaw%MacGillivray’s Warbler%Machaeroides%Mackenzie Valley Wolf%Macrauchenia%Madagascar Hissing Cockroach%Madagascar Jacana%Madagascar Tree Boa%Madora Moth%Magellanic Penguin%Maggot%Magnolia Warbler%Magpie%Magyarosaurus%Mahi Mahi (Dolphin Fish)%Maiasaura%Maine Coon%Mal Shi%Malayan Civet%Malayan Krait%Malayan Tiger%Malchi%Mallard%Malteagle%Maltese%Maltese Mix%Maltese Shih Tzu%Maltipom%Maltipoo%Mamba%Mamushi Snake%Man of War Jellyfish%Manatee%Manchester Terrier%Mandarin Rat Snake%Mandrill%Maned Wolf%Mangrove Snake%Mangrove Snapper%Manta Ray%Mantella Frog%Marabou Stork%Marans Chicken%Marble Fox%Maremma Sheepdog%Margay%Marine Iguana%Marine Toad%Markhor%Marmoset%Marmot%Marsh Frog%Marsican Brown Bear%Masiakasaurus%Masked Angelfish%Masked Palm Civet%Mason Bee%Massasauga%Mastador%Mastiff%Mastiff Mix%Mauzer%May Beetle%Mayan Cichlid%Meagle%Mealworm Beetle%Mealybug%Meerkat%Megalania%Megalochelys%Megalodon%Megamouth Shark%Meganeura%Megatherium%Meiolania%Mekong Giant Catfish%Merganser%Mexican Alligator Lizard%Mexican Black Kingsnake%Mexican Eagle (Northern crested caracara)%Mexican Fireleg Tarantula%Mexican Free-Tailed Bat%Mexican Mole Lizard%Microraptor%Midget Faded Rattlesnake%Miki%Milk Snake%Milkfish%Milkweed aphids%Millipede%Mini Labradoodle%Mini Lop%Miniature Bull Terrier%Miniature Husky%Miniature Pinscher%Mink%Minke Whale%Mississippi Kite%Moccasin Snake%Mockingbird%Modern Game Chicken%Mojarra%Mojave Ball Python%Mojave Rattlesnake%Mola mola (Ocean Sunfish)%Mole%Mole Crab (Sand Flea)%Mole Cricket%Mole Snake%Mollusk%Molly%Monarch Butterfly%Mongoose%Mongrel%Monitor Lizard%Monkey%Monkfish%Monocled Cobra%Monte Iberia Eleuth%Moon Jellyfish%Moonglow Boa%Moorhen%Moose%Moray Eel%Morkie%Morpho Butterfly%Mosasaurus%Moscow Watchdog%Mosquito%Moth%Mountain Beaver%Mountain Bluebird%Mountain Cur%Mountain Feist%Mountain Gorilla%Mountain Lion%Mourning Dove%Mourning Gecko%Mourning Warbler%Mouse%Mouse Spider%Mouse-Deer (Chevrotain)%Mozambique Spitting Cobra%Mud Snake%Mudi%Mudpuppy%Mudskipper%Mule%Mule Deer%Mulga Snake%Mullet Fish%Muntjac%Muscovy Duck%Musk Deer%Muskellunge (Muskie)%Muskox%Muskrat%Mussurana Snake%Muttaburrasaurus%Muttaburrasaurus%Myna Bird%";
    // N section
    defaultRandomizerOptions.species["Animals"] += "Nabarlek%Naegleria%Naked Mole Rat%Narwhal%Natterjack%Nautilus%Neanderthal%Neapolitan Mastiff%Nebelung%Needlefish%Nelore Cattle%Nematode%Neon Tetra%Neptune Grouper%Netherland Dwarf Rabbit%New Hampshire Red Chicken%Newfoundland%Newfypoo%Newt%Nguni Cattle%Nicobar pigeon%Nigerian Goat%Night Adder%Night Heron%Night Snake%Nightingale%Nightjar%Nile Crocodile%Nile Monitor%Nile Perch%Nilgai%No See Ums%Norfolk Terrier%Norrbottenspets%North American Black Bear%Northern Alligator Lizard%Northern Bobwhite%Northern Cardinal%Northern Flicker%Northern Fur Seal%Northern Harrier%Northern Inuit Dog%Northern Jacana%Northern Parula%Northern Pintail%Northern Potoo%Northern Screamer%Northern Water Snake%Norway Rat%Norwegian Buhund%Norwegian Elkhound%Norwegian Forest%Norwegian Lundehund%Norwich Terrier%Nose-Horned Viper%Nova Scotia Duck Tolling Retriever%Nubian Goat%Nudibranch%Numbat%Nuralagus%Nurse Shark%Nut Weevil%Nuthatch%Nutria%Nyala%";
    // O section
    defaultRandomizerOptions.species["Animals"] += "Oak Toad%Oarfish%Ocean Perch%Ocean Pout%Ocean Whitefish%Oceanic Whitetip Shark%Ocellated Turkey%Ocelot%Octopus%Oenpelli python%Oilfish%Okapi%Old English Sheepdog%Old House Borer%Oleander Hawk Moth%Olingo%Olive Baboon%Olive python%Olive Sea Snake%Olm%Olympic Marmot%Onagadori Chicken%Onager%Opabinia%Opah%Opaleye (Rudderfish)%Opossum%Oranda Goldfish%Orange Baboon Tarantula%Orange Dream Ball Python%Orange Roughy %Orange Spider%Orange Tanager (Orange-Headed Tanager)%Orange-Crowned Warbler%Orangutan%Orb Weaver%Orchard Oriole%Orchid Dottyback%Oregon Spotted Frog%Ori-Pei%Oribi%Oriental Cockroach%Oriental Dwarf Kingfisher%Orinoco Crocodile%Ornate Bichir%Ornate Black-Tailed Rattlesnake%Ornate Box Turtle%Ornithocheirus%Ornithomimus%Ortolan Bunting%Oscar Fish%Osprey%Ostracod%Ostrich%Otter%Otterhound%Ovenbird%Oviraptor%Owl%Owl Butterfly%Owlfly (Ascalaphidae)%Ox%Oxpecker%Oyster%Oyster Toadfish%Ozark Bass%";
    // P section
    defaultRandomizerOptions.species["Animals"] += "Pachycephalosaurus%Pacific Coast Tick%Pacific Sleeper Shark%Pacific Spaghetti Eel%Paddlefish%Pademelon%Painted Bunting%Painted Turtle%Palaeophis%Paleoparadoxia%Palm Rat%Palo Verde Beetle%Panda Pied Ball Python%Pangolin%Panther%Panthera atrox (American Lion)%Papillon%Papillon Mix%Paradise Flying Snake%Parakeet%Parasaurolophus%Parrot%Parrot Snake%Parrotfish%Parrotlet%Parson Russell Terrier%Parti Schnauzer%Partridge%Patagonian Cavy%Patagonian Mara%Patagotitan%Patas Monkey%Patterdale Terrier%Pea Puffer%Peacock%Peacock Bass%Peacock Butterfly%Peacock Spider%Peagle%Peekapoo%Pekingese%Pelagornis%Pelagornithidae%Pelican%Pelycosaurs%Pembroke Welsh Corgi%Penguin%Pennsylvania Wood Cockroach%Peppered Moth%Peppermint Angelfish%Perch Fish%Père David’s Deer%Peregrine Falcon%Peringuey’s Adder%Perro De Presa Canario%Persian%Peruvian Guinea Pig%Peruvian Inca Orchid%Pesquet’s Parrot (Dracula Parrot)%Petit Basset Griffon Vendéen%Petite Goldendoodle%Pharaoh Hound%Pheasant%Pheasant-tailed Jacana%Philippine Cobra%Phoenix Chicken%Phorusrhacos%Phytosaurs%Picardy Spaniel%Pictus Catfish%Piebald Dachshund%Pied Ball Python%Pied Tamarin%Pied-Billed Grebe%Pig%Pig-Nosed Turtle%Pigeon%Pika%Pike Fish%Pileated Woodpecker%Pinacate Beetle%Pine Beetle%Pine Marten%Pine Siskin%Pine Snake%Pine Snake%Pinfish%Pink Bollworm%Pink Fairy Armadillo%Pink Salmon%Pink Toed Tarantula%Pink-Necked Green Pigeon%Pipe Snake%Pipefish%Piranha%Pit Bull%Pit Viper%Pitador%Pitsky%Plains Hognose Snake%Platinum Arowana%Platybelodon%Platypus%Plesiosaur%Pliosaur%Plott Hound Mix%Plott Hounds%Plymouth Rock Chicken%Pocket Beagle%Pocket Pitbull%Podenco Canario%Pointer%Pointer Mix%Poison Dart Frog%Polacanthus%Polar Bear%Polecat%Polish Chicken%Polish Lowland Sheepdog%Polish Tatra Sheepdog%Polka Dot Stingray%Pollock Fish%Polyphemus Moth%Pomapoo%Pomchi%Pomeagle%Pomeranian%Pomeranian Mix%Pompano Fish%Pomsky%Pond Skater%Poochon%Poodle%Poogle%Pool Frog%Porbeagle Shark%Porcupine%Porcupinefish%Portuguese Podengo%Possum%Potato Beetle%Potoo%Potoroo%Powderpost Beetle%Prairie Chicken%Prairie Dog%Prairie Rattlesnake%Prawn%Praying Mantis%Proboscis Monkey%Procoptodon%Pronghorn%Psittacosaurus%Psittacosaurus%Pteranodon%Pterodactyl%Pudelpointer%Puertasaurus%Puff Adder%Pufferfish%Puffin%Pug%Pug Mix%Pugapoo%Puggle%Pugshire%Puli%Puma%Pumi%Pumpkin Patch Tarantula%Purple Emperor Butterfly%Purple Finch%Purple Gallinule%Purple Tarantula%Purussaurus%Puss Caterpillar%Puss Moth%Pygmy Hippopotamus%Pygmy Marmoset (Finger Monkey)%Pygmy python%Pygmy Rattlesnake%Pygmy Shark%Pygora Goat%Pyjama Shark%Pyrador%Pyredoodle%Pyrenean Mastiff%Pyrenean Shepherd%Pyrosome%Python%";
    // Q section
    defaultRandomizerOptions.species["Animals"] += "Quagga%Quahog Clam%Quail%Queen Snake%Quetzal%Quetzalcoatlus northropi%Quokka%Quoll%";
    // R section
    defaultRandomizerOptions.species["Animals"] += "Rabbit%Raccoon%Raccoon Dog%Racer Snake%Radiated Tortoise%Ragamuffin%Ragdoll%Raggle%Rainbow Boa%Rainbow Grasshopper (Dactylotum bicolor)%Rainbow Kribs (Kribensis)%Rainbow Shark%Rat%Rat Snakes%Rat Terrier%Rattlesnake%Red Ackie Monitor%Red Aphids%Red Deer%Red Diamondback Rattlesnake%Red Drum Fish%Red Finch%Red Fox%Red Kite%Red Knee Tarantula%Red Nose Pit Bull%Red Panda%Red Paper Wasp%Red Racer Snake%Red Spitting Cobra%Red Squirrel%Red Star Chicken%Red Tail Boa (common boa)%Red Wolf%Red-Bellied Black Snake%Red-Bellied Woodpecker%Red-Billed Quelea Bird%Red-Eared Slider%Red-Eyed Tree Frog%Red-Footed Tortoise%Red-handed Tamarin%Red-Headed Vulture%Red-Lipped Batfish%Red-Shouldered Hawk%Red-Tailed Cuckoo Bumblebee%Red-winged blackbird%Redback Spider%Redbone Coonhound%Redcap Chicken%Redear Sunfish%Redhump Eartheater%Redstart%Redtail Catfish%Reef Shark%Regal Jumping Spider%Reindeer%Repenomamus%Reticulated python%Rex Rabbit%Rhamphosuchus%Rhea%Rhesus Macaque%Rhino Beetle%Rhino Viper%Rhinoceros%Rhode Island Red Chicken%Rhodesian Ridgeback%Rhombic Egg-Eater Snake%Ribbon Eel%Ribbon Snake%Rim Rock Crowned Snake%Ring-billed Gull%Ringed Kingfisher%Rinkhals Snake%River Otter%River Turtle%Roadrunner%Robber Flies%Robin%Rock Bass%Rock Crab%Rock Hyrax%Rock Python%Rockfish%Rockhopper Penguin%Rodents%Roe Deer%Roosevelt Elk%Rooster%Root Aphids%Rose-Breasted Grosbeak%Roseate Spoonbill%Rosy Boa%Rotterman%Rottle%Rottsky%Rottweiler%Rottweiler Mix%Rough Earth Snake%Rough Green Snake%Rough-Legged Hawk (Rough-Legged Buzzard)%Rove Beetle%Royal Penguin%Rubber Boa%Ruby-Crowned Kinglet%Ruby-Throated Hummingbird%Ruddy Duck%Ruddy Turnstone%Rufous Hummingbird%Russel’s Viper%Russell Terrier%Russian Bear Dog%Russian Blue%Russian Tortoise%";
    // S section
    defaultRandomizerOptions.species["Animals"] += "Saanen Goat%Saarloos Wolfdog%Saber-Toothed Tiger%Sable%Sable Black German Shepherd%Sable Ferret%Sable German Shepherd%Saddleback Caterpillar%Saiga%Sailfish%Saint Berdoodle%Saint Bernard%Saint Shepherd%Salamander%Salmon%Salmon Shark%Saluki%Sambar%Samoyed%San Francisco Garter Snake%Sand Cat%Sand Crab%Sand Dollar%Sand Lizard%Sand Tiger Shark%Sand Viper%Sandhill Crane%Sandpiper%Sandworm%Saola%Sapsali%Sarcosuchus%Sardines%Sarkastodon%Sarplaninac%Sarus Crane%Satanic Leaf-Tailed Gecko%Saturniidae Moth%Sauropoda%Sauropoda%Savanna Goat%Savannah Monitor%Savannah Sparrow%Savu Python%Saw-scaled Viper%Sawfish%Scale-Crested Pygmy Tyrant%Scaleless Ball Python%Scallops%Scarab Beetle%Scarlet Kingsnake%Scarlet Macaw%Scarlet Tanager%Schapendoes%Schipperke%Schneagle%Schnoodle%Scimitar-horned Oryx%Scissor-tailed Flycatcher%Scorpion%Scorpion Fish%Scotch Collie%Scottish Deerhound%Scottish Fold Cat%Scottish Terrier%Scrotum Frog%Sculpin%Scutosaurus%Sea Anemone%Sea Bass%Sea Dragon%Sea Eagle%Sea Lion%Sea Otter%Sea Roach%Sea Slug%Sea Snake%Sea Spider%Sea Squirt%Sea Trout%Sea Turtle%Sea Urchin%Seagull%Seahorse%Seal%Sealyham Terrier%Sedge Warbler%Sehuencas Water Frog%Sei Whale%Senegal Parrot%Senepol Cattle%Sequined Spider%Serval%Seymouria%Shantungosaurus%Shark%Sharp-Shinned Hawk%Sharp-Tailed Snake%Shastasaurus%Sheep%Sheepadoodle%Sheepshead Fish%Shepadoodle%Shepkita%Shepweiler%Shetland Sheepdog%Shiba Inu%Shiba Inu Mix%Shichi%Shih Poo%Shih Tzu%Shih Tzu Mix%Shikoku%Shiloh Shepherd%Shiranian%Shoebill Stork%Shollie%Short-Eared Owl%Short-Faced Bear%Shortfin Mako Shark%Shrew%Shrimp%Siamese%Siberian%Siberian Husky%Siberian Ibex%Siberian Retriever%Siberian Tiger%Siberpoo%Sichuan Takin (Tibetan Takin)%Sidewinder%Sika Deer%Silken Windhound%Silkie Chicken%Silky Shark%Silky Terrier%Silver Dollar%Silver Labrador%Simbakubwa%Sinosauropteryx%Sivatherium%Sixgill shark%Skate Fish%Skeleton Tarantula%Skink Lizard%Skipjack Tuna%Skua%Skunk%Skye Terrier%Sleeper Shark%Sloth%Slovak Cuvac%Slow Worm%Slug%Smallmouth Bass%Smilosuchus%Smokybrown Cockroach%Smooth Earth Snake%Smooth Fox Terrier%Smooth Green Snake%Smooth Hammerhead Shark%Smooth Snake%Snail%Snailfish%Snake%Snapping Turtle%Snook Fish%Snorkie%Snouted Cobra%Snow Bunting%Snow Crab%Snow Goose%Snow Leopard%Snowberry Clearwing Moth%Snowflake Eel%Snowshoe%Snowshoe Hare%Snowy Owl%Sockeye Salmon%Soldier Beetle%Somali%Song Sparrow%Song Thrush%South China Tiger%Southeastern Blueberry Bee%Southern Black Racer%Southern Flannel Moth%Southern Hognose Snake%Southern House Spider%Southern Pacific Rattlesnake%Spadefoot Toad%Spalax%Spanador%Spanish Goat%Spanish Mackerel%Spanish Mastiff%Spanish Water Dog%Sparrow%Sparrowhawk%Speckled Kingsnake%Speckled Trout%Spectacled Bear%Sperm Whale%Sphynx%Spider%Spider Ball Python%Spider Beetle%Spider Monkey%Spider Wasp%Spider-Tailed Horned Viper%Spinner Shark%Spinone Italiano%Spinosaurus%Spiny bush viper%Spiny Dogfish%Spiny Hill Turtle%Spitting Cobra%Spixs Macaw%Sponge%Spongy Moth%Spongy Moth%Spotted Bass%Spotted Gar%Spotted Garden Eel%Spotted Lanternfly%Spotted python%Spotted Skunk%Springador%Springbok%Springerdoodle%Squash Bee%Squash Beetle%Squid%Squirrel%Squirrel Monkey%Squirrelfish%Sri Lankan Elephant%Stabyhoun%Staffordshire Bull Terrier%Stag Beetle%Standard Schnauzer%Star-nosed mole%Starfish%Stargazer Fish%Steelhead Salmon%Steller’s Sea Cow%Stick Insect%Stiletto Snake%Stingray%Stoat%Stone Crab%Stonechat%Stonefish%Stoplight Loosejaw%Stork%Strawberry Hermit Crab%Striped Bass%Striped Hyena%Striped Rocket Frog%Stromatolite%Stupendemys%Sturgeon%Styracosaurus%Suchomimus%Suckerfish%Sugar Glider%Sulcata Tortoise%Sultan Chicken%Sumatran Elephant%Sumatran Orangutan%Sumatran Rhinoceros%Sumatran Tiger%Summer Tanager%Sun Bear%Sunbeam Snake%Sunset Ball Python%Super Pastel Ball Python%Supersaurus%Superworm%Surgeonfish%Sussex Chicken%Swai Fish%Swainson’s Hawk%Swallow%Swallowtail Butterfly%Swallowtail Caterpillar%Swan%Swedish Elkhound%Swedish Lapphund%Swedish Vallhund%Swordfish%Syrian Hamster%";
    // T section
    defaultRandomizerOptions.species["Animals"] += "Taco Terrier%Tailless Whip Scorpion%Taimen Fish%Taipan%Takin%Tamarin%Tamaskan%Tang%Tangerine Leopard Gecko%Tapanuli Orangutan%Tapir%Tarantula%Tarantula Hawk%Tarbosaurus%Tarpon%Tarsier%Tasmanian Devil%Tasmanian Tiger%Tasmanian Tiger Snake%Tawny Frogmouth%Tawny Mining Bee%Tawny Owl%Teacup Chihuahua%Teacup Maltese%Teacup Miniature Horse%Teacup Poodle%Teddy Bear Hamster%Teddy Guinea Pig%Teddy Roosevelt Terrier%Telescope Fish%Ten-Lined June Beetle%Tennessee Walking Horse%Tenrec%Tent Caterpillar%Tentacled Snake%Tenterfield Terrier%Termite%Terrier%Terror Bird%Tetra%Texas Blind Snake%Texas Brown Tarantula%Texas Coral Snake%Texas Garter Snake%Texas Heeler%Texas Indigo Snake%Texas Night Snake%Texas Rat Snake%Texas Spiny Lizard%Thai Ridgeback%Thalassomedon%Thanatosdrakon%Therizinosaurus%Theropod%Thornback Ray%Thorny Devil%Thresher Shark%Thrush%Thylacoleo%Thylacoleo carnifex%Thylacosmilus%Tibetan Fox%Tibetan Mastiff%Tibetan Spaniel%Tibetan Terrier%Tick%Tiffany%Tiger%Tiger Beetle%Tiger Moth%Tiger Muskellunge (Muskie)%Tiger Rattlesnake%Tiger Salamander%Tiger Shark%Tiger snake%Tiger Swallowtail%Tiger Swallowtail Caterpillar%Tiger Trout%Tiktaalik%Timber Rattlesnake (Canebrake Rattlesnake)%Timor python%Tire Track Eel%Titan Beetle%Titanoboa%Titanosaur%Toadfish%Tokay Gecko%Tomato Hornworm%Torkie%Tornjak%Tortoise%Tosa%Toucan%Towhee%Toxodon%Toy Fox Terrier%Toy Poodle%Transylvanian Hound%Trapdoor spider%Tree Cricket%Tree Frog%Tree Kangaroo%Tree Snake%Tree swallow%Tree Viper (Bamboo Viper)%Treecreeper%Treehopper%Treeing Tennessee Brindle%Treeing Walker Coonhound%Triggerfish%Troodon%Tropicbird%Trout%Tsetse Fly%Tuatara%Tufted Coquette%Tufted Titmouse%Tully Monster%Tuna%Tundra Swan%Turaco%Turkey%Turkey Vulture%Turkish Angora%Turnspit%Turtle Frog%Turtles%Tusoteuthis%Tussock Moth Caterpillar%Twig Snake%Tylosaurus%Tyrannosaurus Rex%";
    // U section
    defaultRandomizerOptions.species["Animals"] +=
    "Uakari%Uaru Cichlid%Uguisu%Uinta Ground Squirrel%Uintatherium%Ulysses Butterfly%Umbrellabird%Unau (Linnaeus’s Two-Toed Sloth)%Underwing Moth%Upland Sandpiper%Ural owl%Urechis unicinctus (Penis Fish)%Urial%Uromastyx (Spiny-Tailed Lizard)%Urutu Snake%Utonagan%";
    // V section
    defaultRandomizerOptions.species["Animals"] +=
    "Valley Bulldog%Vampire Bat%Vampire Crab %Vampire Squid%Vaquita%Veery%Vegavis%Velociraptor%Venus Flytrap%Vermilion Flycatcher%Vervet Monkey%Vestal Cuckoo Bumblebee%Vicuña%Vine Snake%Vinegaroon%Viper%Viper Boa%Viper Shark (dogfish)%Viperfish%Virgin Islands Dwarf Gecko%Vizsla%Volcano Snail%Vole%Volpino Italiano%Vulture%";
    // W section
    defaultRandomizerOptions.species["Animals"] +=
    "Wahoo Fish%Waimanu%Walking Catfish%Wallaby%Walleye Fish%Walrus%Wandering Albatross%Warbler%Warthog%Wasp%Water Beetle%Water Buffalo%Water Bug%Water Dragon%Water Vole%Waterbuck%Wattled Jacana%Wax Moth%Weasel%Weaver Bird%Weimaraner%Weimardoodle%Wels Catfish%Welsh Black Cattle%Welsh Corgi%Welsh Springer Spaniel%Welsh Terrier%West Highland Terrier%West Siberian Laika%Western Blacklegged Tick%Western Blind Snake%Western Diamondback Rattlesnake%Western Gorilla%Western Green Mamba%Western Hognose Snake%Western Kingbird%Western Lowland Gorilla%Western Rat Snake%Western Rattlesnake (Northern Pacific Rattlesnake)%Western Tanager%Westiepoo%Whale Shark%Wheaten Terrier%Whimbrel%Whinchat%Whippet%Whiptail Lizard%White Butterfly%White Catfish%White Crappie%White Ferret / Albino Ferrets%White German Shepherd%White Marlin%White Rhinoceros%White Shark%White Sturgeon %White Tiger%White-Crowned Sparrow%White-Eyed Vireo%White-Faced Capuchin%White-tail deer%White-Tailed Eagle%Whitetail Deer%Whiting%Whoodle%Whooping Crane%Wild Boar%Wildebeest%Willow Flycatcher%Willow Warbler%Winter Moth%Wire Fox Terrier%Wirehaired Pointing Griffon%Wirehaired Vizsla%Wiwaxia%Wolf%Wolf Eel%Wolf Snake%Wolf Spider%Wolffish%Wolverine%Woma Python%Wombat%Wood Bison%Wood Duck%Wood Frog%Wood Tick%Wood Turtle%Woodlouse%Woodlouse Spider%Woodpecker%Woodrat%Wool Carder Bee%Woolly Aphids%Woolly Bear Caterpillar%Woolly Mammoth%Woolly Monkey%Woolly Rhinoceros%Worm%Worm Snake%Wrasse%Writing Spider%Wrought Iron Butterflyfish%Wryneck%Wyandotte Chicken%Wyoming Toad%";
    // X section
    defaultRandomizerOptions.species["Animals"] +=
    "X-Ray Tetra%Xeme (Sabine’s Gull)%Xenacanthus%Xenoceratops%Xenoposeidon%Xenotarsosaurus%Xerus%Xiaosaurus%Xiaotingia%Xingu River Ray%Xiphactinus%Xoloitzcuintli%"
    // Y section
    defaultRandomizerOptions.species["Animals"] +=
    "Yabby%Yak%Yakutian Laika%Yarara%Yellow Aphids%Yellow Bass%Yellow Bellied Sapsucker%Yellow Belly Ball Python%Yellow Cobra%Yellow Crazy Ant%Yellow Perch%Yellow Sac Spider%Yellow Spotted Lizard%Yellow Tanager (Black-and-Yellow Tanager)%Yellow Tang%Yellow-Bellied Sea Snake%Yellow-Eyed Penguin%Yellow-faced Bee%Yellowhammer%Yellowish Cuckoo Bumblebee (formerly Fernald’s Cuckoo Bumblebee)%Yellowjacket (Yellow Jacket)%Yellowtail Snapper%Yellowthroat%Yeti Crab%Yokohama Chicken%Yoranian%Yorkie Bichon%Yorkiepoo%Yorkshire Terrier%";
    // Z section
    defaultRandomizerOptions.species["Animals"] +=
    "Zebra%Zebra Finch%Zebra Mussels%Zebra Pleco%Zebra Shark%Zebra Snake%Zebra Spitting Cobra%Zebra Tarantula%Zebrafish (Zebra Fish)%Zebu%Zokor%Zonkey%Zorse%Zuchon";

    // Also the Mythological ones
    // Section 1
    defaultRandomizerOptions.species["Mythological"] += "Bahamut% Bake-kujira% Cetus% Devil Whale% Encantado% Glashtyn% Gveleshapi% Makara% Mug-wamp% Sea goat% Selkie% Water bull% Water Horse% Ceffyl Dŵr% Each-uisge% Enbarr% Hippocampus% Ichthyocentaurs% Kelpie% Morvarc'h% Nixie% Nuckelavee% Nuggle% Tangie% Anansi% Arachne% Carbuncle% Gold-digging ant% Iktomi% Jorōgumo% Karkinos% Khepri% Mothman% Myrmecoleon% Myrmidons% Pabilsag% Scorpion man% Selket% Tsuchigumo% Balayang% Camazotz% Leutogi% Minyades% Tjinimin% Vetala% Ababil% Adarna% Avalerion% Alicanto% Anqa% Anzû% Bare-fronted Hoodwink% Alkonost% Gumyōchō% Harpy% Aello% Ocypete% Celaeno% Podarge% Horus% Inmyeonjo% Kalavinka% Karura% Kinnara% Siren% Achelois% Aglaonoe% Agalaope% Leucosia% Ligeia% Parthenope% Pisinoe% Thelxinoë% Swan maiden% Caladrius% Chalkydri% Chamrosh% Cinnamon bird% Devil Bird% Gagana% Gandabherunda% Gamayun% Garuda% Hakawai% Hudhud% Huginn% Muninn% Itsumade% Jingwei% Lamassu% Luan% Minokawa% Nachtkrapp% Nine-headed Bird% Oozlum bird% Pamola% Paskunji% Peng% Phoenix% Bennu% Chol% Firebird% Fenghuang% Huma bird% Konrul% Toghrul% Vermilion Bird% Piasa% Qingniao% Ra% Rain Bird% Raróg% Roc% Shangyang% Shedu% Simurgh% Stymphalian birds% Tengu% Three-legged bird% Thunderbird% Thoth% Turul% Veðrfölnir% Vucub Caquix% Yatagarasu% Zhenniao% Alectryon% Basan% Cockatrice% Gallic rooster% Gullinkambi% Rooster of Barcelos% Sarimanok% Víðópnir% Aethon% Griffin% Hippogriff% Hræsvelgr% Poukai% Shahbaz% Triple-headed eagle% Wuchowsen% Ziz% Zu% Nyctimene% Owlman% Sirin% Strix% Bjarndyrakongur% Bugbear% Callisto% Stiff-Legged Bear% Adlet% Amarok% Anubis% Aralez% Asena% Axehandle hound% Black dog% Barghest% Black Shuck% Grim% Beast of Gévaudan% Cerberus% Chupacabra% Cu Sith% Crocotta% Cynocephaly% Dogs of Actaeon% Fenrir% Gelert% Hellhound% Huli jing% Kitsune% Kumiho% Huodou% Kludde% Orthrus% Penghou% Psoglav% Salawa% Sigbin% Sky Fox% Shug Monkey% Tanuki% Tulikettu% Vǎrkolak% Werewolf% Bael% Ball-tailed cat% Cactus cat% Cat-sìth% Cath Palug% Demon Cat% Kaibyō% Bakeneko% Kasha% Nekomata% Nue% Pard% Phantom cat% Blue Mountains panther% Glawackus% Tyger% Underwater panther% Vapula% Wampus cat% White Tiger% Winged cat% Arimanius% Ammit% Barong% Beast of the First Kingdom% Brunswick Lion% Chimera% Chinese guardian lions% Komainu% Shisa% Sin-you% Xiezhi% Dawon% Aker% Ȧmi-Pe% Apedemak% Bast% Hert-ketit-s% Ḥuntheth% Ipy% Maahes% Matit% Mehit% Menhit% Pakhet% Repyt% Sekhmet% Seret% Shesmetet% Taweret% Tefnut% Tutu% Urit-en-kru% Lampago% Leo% Lion of Cithaeron% Nemean lion% Lion of Al-lāt% Manticore% Manussiha% Merlion% Narasimha% Nian% Nongshāba% Pixiu% Questing Beast% Sea-lion% Serpopard% Sharabha% Simhamukha% Snow Lion% Sphinx% Criosphinx% Gopaitioshah% Hieracosphinx% Stratford Lyon% Tigris% Vaikuntha Chaturmurti% Winged lion% Yali% Yaghūth% Yaldabaoth% Werehyena% Kishi% Azeban% Gef% Ichneumon% Kamaitachi%";

    // Section 2
    defaultRandomizerOptions.species["Mythological"] += "Kushtaka% Mujina% Ramidreju% Raijū% Mermaid% Merman% Abaia% Gurangatch% Hippocamp% Ika-Roa% Il Belliegha% Isonade% Namazu% Ningyo% Kun% Salmon of Wisdom% Shachihoko% Lavellan% Drop bear% Bunyip% Akkorokamui% Lou Carcolh% Kraken% Shen% Agropelter% Bigfoot% Sasquatch% Hibagon% Jué yuán% Satori% Shōjō% Shug Monkey% Sun Wukong% Vanara% Yeren% Yeti% Yowie% Al-Mi'raj% Jackalope% Moon rabbit% Skvader% Wisakedjak% Wolpertinger% Agoa% Ammut% Bakunawa% Basilisk% Black Tortoise% Chalkydri% Chinese Dragon% Cipactli% Dragon% Dungavenhooter% Knucker% Kurma% Loch Ness Monster% Loveland frog% Mokele Mbembe% Moʻo% Morgawr% Mungoon-Gali% Peluda% Reptilian humanoids% Sewer alligator% Sobek% Taniwha% Whowie% Wyvern% Zaratan% Alicante% Amphisbaena% Amphithere% Apep% Apophis% Azhi Dahaka% Bakonawa% Biscione% Cockatrice% Drake% Echidna% Fáfnir% Feathered serpent% Garafena% Gorgon% Hoop snake% Hydra% Jaculus% Jasconius% Jörmungandr% Lamia% Lindworm% Madame White Snake% Meretseger% Mongolian Death Worm% Naga% Níðhöggr% Orm% Ouroboros% Python% Rainbow serpent% Sea serpent% Tarasque% Typhon% Ur% Yamata no Orochi% Zilant% Afanc% Ratatoskr% Rat king% Actaeon% Ceryneian Hind% Deer Woman% Eikþyrnir% Goldhorn% Jackalope% Keresh% Peryton% Qilin% Tarand% White stag% Xeglun% Auðumbla% Bai Ze% Kujata% Bicorn% Chichevache% Bonnacon% Hodag% Minotaur% Nandi% Sarangay% Shedu% Ushi-oni% Allocamelus% Heavenly Llama% Amalthea% Aries% Barometz% Capricornus% Chimera% Dahu% Faun% Goldhorn% Heiðrún% Khnum% Satyr% Sidehill gouger% Tanngrisnir% Tanngnjóstr% Chrysomallos% Anggitay% Arion% Balius% Xanthus% Buraq% Centaur% Cheval Gauvin% Cheval Mallet% Chiron% Chollima% Drapé% Gytrash% Haizum% Hippogriff% Ipotane% Karkadann% Kotobuki% Longma% Onocentaur% Pegasus% Pooka% Sleipnir% Simurgh% Sihuanaba% Tikbalang% Uchchaihshravas% Unicorn% Winged unicorn% Abath% Baku% Behemoth% Quugaarpak% Taweret% Calydonian Boar% Erymanthian Boar% Zhu Bajie% Mapinguari% Giants% Automaton% Blodeuwedd% Brazen head% Doll Woman% Frankenstein's monster% Galatea% Gingerbread man% Golem% Homunculus% Nephele% Shabti% Tokeloshe% Tilberi% Tsukumogami% Tulpa% Tupilaq% Ushabti% Alan% Dhampir% Preta% Golden Hind% Kappa% Kekkai% Lamia% Manananggal% Mandurugo% Redcap% Rokurokubi% Sigbin% Vampire% Werewolf% Yuki-onna% Bloody Bones% Gashadokuro% Grim Reaper% Skeleton% Argus Panoptes% Catoblepas% Cyclopes% Hitotsume-kozou% Lynx% Mokumokuren% Asura% Deva% Devi% Noppera-bō% Futakuchi-onna% Harionago% Medusa% Amphisbaena% Chimera% Chonchon% Double-headed eagle% Dullahan% Hekatonkheires% Hydra% Lernaean Hydra% Nine-headed Bird% Nukekubi% Orthrus% Shesha% Penanggalan% Wanyūdō% Xing Tian% Yacuruna% Yamata no Orochi% Asura% Deva% Devi% Hekatonkheires% Hinkypunk% Kui% O'nya:ten% Sleipnir% Three-legged bird% Futakuchi-onna% Kuchisake-onna% Selkie% Skin-walker% Swan maiden% Bakeneko% Kitsune% Kumiho% Hulder% Nguruvilu% Serpopard% Rokurokubi% Vampire% Manananggal% Geryon% Pixiu% Androktasiai% Erinyes% Hipag% Hysminai% Keres% Lemures% Makhai% Onryō% Phonoi% Valkyrie% Vengeful ghost% Phoenix% Ubume% Ammit% Banshee% Demon% Devil% Dullahan% Ghost% Grim Reaper% Ox-Head% Horse-Face% Phoenix% Undead% Valkyrie% Vampire% Alp% Baku% Carbuncle% Devil% Drude% Incubus% Succubus% Mermaid% Nightmare% Nue% Oni% Sandman% Satori% Zduhać% Balor% Catoblepas% Gorgon% Medusa% Euryale% Stheno% Abatwa% Alan% Boto% Faun% Gancanagh% Incubus% Succubus% Maenad% Nymph% Pombero% Popobawa% Satyr% Sileni% Silenus% Unicorn% Zemyna% Zemepatis% Simurgh% Dwarf% Egbere% Genie% Leib-Olmai%"

    // Section 3
    defaultRandomizerOptions.species["Mythological"] += "Leprechaun% Matagot% Pixiu% Sarimanok% Sigbin% Yaksha% Yakshini% Angel% Chalkydri% Deity% Lampetia% Will-o'-the-wisp% Dragon% Cupid% Eros% Cherub% Gancanagh% Madame White Snake% Melusine% Tennin% Undine% Banshee% Encantado% Fenghuang% Fossegrim% Mermaid% Nue% Siren% Gef% Satan% Chronos% Father Time% Gremlin% Baba Yaga% Bai Ze% Griffin% Salmon of Wisdom% Sphinx% Valravn% Ala% Feldgeister% Zduhać% Black dog% Bogeyman% Ghost% Grim Reaper% Wechuge% Wendigo% Shadow People% Vampire% Werewolf% Oni% Gashadokuro% Camazotz% Wild Hunt% Hell Hound% Asag% Bluecap% Elemental% Dwarf% Earth Dragon% Gargoyle% Giant% Gnome% Goblin% Golem% Knocker% Monopod% Nymph% Ogre% Oread% Ten Ten-Vilu% Troll% Basan% Bluecap% Cherufe% Chimera% Dragon% Ifrit% Hellhound% Lampad% Phoenix% Salamander% Chalkydri% Light Elf% Rainbow crow% Rainbow Serpent% Alicanto% Pixiu% Carbunclo% Chrysomallos% Cyclopes% Griffin% Gnome% Leprechaun% Bulgasari% Chinese dragon% Cyclopes% Feldgeister% Kitsune% Raijū% Thunderbird% Valkyrie% Afanc% Amefurikozō% Aspidochelone% Bloody Bones% Buggane% Bunyip% Camenae% Capricorn% Cetus% Charybdis% Cai Cai-Vilu% Crinaeae% Davy Jones' Locker% Draug% Each uisge% Fish People% Fossegrim% Fur-bearing trout% Gargouille% Grindylow% Haetae% Hippocamp% Hydra% Ichthyocentaur% Jasconius% Jengu% Kappa% Kelpie% Kraken% Lake monster% Lavellan% Leviathan% Loch Ness monster% Lorelei% Lusca% Makara% Melusine% Mami Wata% Mermaid% Merman% Merrow% Morgens% Muc-sheilch% Naiad% Näkki% Nereid% Nix% Nymph% Pisces% Ponaturi% Potamus% Rusalka% Samebito% Sea monster% Sea serpent% Selkie% Shen% Siren% Taniwha% Tiamat% Triton% Ondine% Vodyanoy% Water dragon% Water leaper% Water sprite% Yacuruna% Zaratan% Dwarf% European dragon% Gnome% Goblin% Golem% Grootslang% Leprechaun% Troll% Yaoguai% Angel% Asteriae% Chalkydri% Feathered serpent% Heavenly Llama% Pegasus% Grim Reaper% Swan Maiden% Tennin% Three-legged bird% Valkyrie% Amphisbaena% Basilisk% Cockatrice% Ghoul% Mongolian Death Worm% Sphinx% Ajatar% Bigfoot% Dryad% Elf% Green Man% Irrwurz% Leshy% Lindworm% Mavka% Moss people% Owlman% Satyr% Unicorn% Curupira% Dingonek% Mapinguari% Manticore% Saci% Fairy% Gnome% Ennedi tiger% Werehyena% Bak% Chinese dragon% Dobhar-chú% Encantado% Grootslang% Iara% Jiaolong% Kappa% Kelpie% Lake monster% Hydra% Loch Ness Monster% Mugwump% Naiad% Nixie% Ogopogo% Ondine% Rainbow serpent% Rusalka% Ryujin% Shellycoat% Warlock% Yacuruna% Alp% Dwarf% Fenghuang% Griffin% Hippogriff% Mountain Giant% Kamaitachi% Mavka% Oread% Patupaiarehe% Rübezahl% Satyr% Tengu% Yeti% Aspidochelone% Bishop-fish% Charybdis% Cai Cai-Vilu% Dragon King% Fish People% Hippocamp% Leviathan% Jormungand% Kraken% Mermaid% Merman% Nereid% Sea monk% Sea monster% Sea serpent% Selkie% Shen% Siren% Tritons% Umibōzu% Water Dragon% Yacuruna% Błudnik% Bunyip% Grootslang% Lernaean Hydra% Honey Island Swamp monster% Mokele-mbembe% Swamp monster% Will-o'-the-wisp% Cherufe% Phoenix% Salamander% Akhlut% Amarok% Hrimthurs% Ijiraq% Jotun% Qiqirn% Saumen Kar% Tizheruk% Wechuge% Wendigo% Yeti% Ymir% Yuki-onna% Banshee% Boggart% Brownie% Domovoi% Dvorovoi% Duende% Jinn% Kobold% Tomte% Vampire% Zashiki-warashi% Cerberus% Ammit% Cyclopes% Demon% Devil% Earth Dragon% Garm% Hekatonkheires% Hellhound% Ifrit% Ox-Head% Horse-Face% Preta%"

    // Same thing had to happen with pokemon
    // Section 1
    defaultRandomizerOptions.species["Pokemon"] += "Bulbasaur%Ivysaur%Venusaur%Charmander%Charmeleon%Charizard%Squirtle%Wartortle%Blastoise%Caterpie%Metapod%Butterfree%Weedle%Kakuna%Beedrill%Pidgey%Pidgeotto%Pidgeot%Rattata%Raticate%Spearow%Fearow%Ekans%Arbok%Pikachu%Raichu%Sandshrew%Sandslash%Nidoran♀%Nidorina%Nidoqueen%Nidoran♂%Nidorino%Nidoking%Clefairy%Clefable%Vulpix%Ninetales%Jigglypuff%Wigglytuff%Zubat%Golbat%Oddish%Gloom%Vileplume%Paras%Parasect%Venonat%Venomoth%Diglett%Dugtrio%Meowth%Persian%Psyduck%Golduck%Mankey%Primeape%Growlithe%Arcanine%Poliwag%Poliwhirl%Poliwrath%Abra%Kadabra%Alakazam%Machop%Machoke%Machamp%Bellsprout%Weepinbell%Victreebel%Tentacool%Tentacruel%Geodude%Graveler%Golem%Ponyta%Rapidash%Slowpoke%Slowbro%Magnemite%Magneton%Farfetch'd%Doduo%Dodrio%Seel%Dewgong%Grimer%Muk%Shellder%Cloyster%Gastly%Haunter%Gengar%Onix%Drowzee%Hypno%Krabby%Kingler%Voltorb%Electrode%Exeggcute%Exeggutor%Cubone%Marowak%Hitmonlee%Hitmonchan%Lickitung%Koffing%Weezing%Rhyhorn%Rhydon%Chansey%Tangela%Kangaskhan%Horsea%Seadra%Goldeen%Seaking%Staryu%Starmie%Mr. Mime%Scyther%Jynx%Electabuzz%Magmar%Pinsir%Tauros%Magikarp%Gyarados%Lapras%Ditto%Eevee%Vaporeon%Jolteon%Flareon%Porygon%Omanyte%Omastar%Kabuto%Kabutops%Aerodactyl%Snorlax%Articuno%Zapdos%Moltres%Dratini%Dragonair%Dragonite%Mewtwo%Mew%";
    // Section 2
    defaultRandomizerOptions.species["Pokemon"] += "Chikorita%Bayleef%Meganium%Cyndaquil%Quilava%Typhlosion%Totodile%Croconaw%Feraligatr%Sentret%Furret%Hoothoot%Noctowl%Ledyba%Ledian%Spinarak%Ariados%Crobat%Chinchou%Lanturn%Pichu%Cleffa%Igglybuff%Togepi%Togetic%Natu%Xatu%Mareep%Flaaffy%Ampharos%Bellossom%Marill%Azumarill%Sudowoodo%Politoed%Hoppip%Skiploom%Jumpluff%Aipom%Sunkern%Sunflora%Yanma%Wooper%Quagsire%Espeon%Umbreon%Murkrow%Slowking%Misdreavus%Unown%Wobbuffet%Girafarig%Pineco%Forretress%Dunsparce%Gligar%Steelix%Snubbull%Granbull%Qwilfish%Scizor%Shuckle%Heracross%Sneasel%Teddiursa%Ursaring%Slugma%Magcargo%Swinub%Piloswine%Corsola%Remoraid%Octillery%Delibird%Mantine%Skarmory%Houndour%Houndoom%Kingdra%Phanpy%Donphan%Porygon2%Stantler%Smeargle%Tyrogue%Hitmontop%Smoochum%Elekid%Magby%Miltank%Blissey%Raikou%Entei%Suicune%Larvitar%Pupitar%Tyranitar%Lugia%Ho-oh%Celebi%";
    // Section 3
    defaultRandomizerOptions.species["Pokemon"] += "Treecko%Grovyle%Sceptile%Torchic%Combusken%Blaziken%Mudkip%Marshtomp%Swampert%Poochyena%Mightyena%Zigzagoon%Linoone%Wurmple%Silcoon%Beautifly%Cascoon%Dustox%Lotad%Lombre%Ludicolo%Seedot%Nuzleaf%Shiftry%Taillow%Swellow%Wingull%Pelipper%Ralts%Kirlia%Gardevoir%Surskit%Masquerain%Shroomish%Breloom%Slakoth%Vigoroth%Slaking%Nincada%Ninjask%Shedinja%Whismur%Loudred%Exploud%Makuhita%Hariyama%Azurill%Nosepass%Skitty%Delcatty%Sableye%Mawile%Aron%Lairon%Aggron%Meditite%Medicham%Electrike%Manectric%Plusle%Minun%Volbeat%Illumise%Roselia%Gulpin%Swalot%Carvanha%Sharpedo%Wailmer%Wailord%Numel%Camerupt%Torkoal%Spoink%Grumpig%Spinda%Trapinch%Vibrava%Flygon%Cacnea%Cacturne%Swablu%Altaria%Zangoose%Seviper%Lunatone%Solrock%Barboach%Whiscash%Corphish%Crawdaunt%Baltoy%Claydol%Lileep%Cradily%Anorith%Armaldo%Feebas%Milotic%Castform%Kecleon%Shuppet%Banette%Duskull%Dusclops%Tropius%Chimecho%Absol%Wynaut%Snorunt%Glalie%Spheal%Sealeo%Walrein%Clamperl%Huntail%Gorebyss%Relicanth%Luvdisc%Bagon%Shelgon%Salamence%Beldum%Metang%Metagross%Regirock%Regice%Registeel%Latias%Latios%Kyogre%Groudon%Rayquaza%Jirachi%Deoxys%";
    // Section 4
    defaultRandomizerOptions.species["Pokemon"] += "Turtwig%Grotle%Torterra%Chimchar%Monferno%Infernape%Piplup%Prinplup%Empoleon%Starly%Staravia%Staraptor%Bidoof%Bibarel%Kricketot%Kricketune%Shinx%Luxio%Luxray%Budew%Roserade%Cranidos%Rampardos%Shieldon%Bastiodon%Burmy%Wormadam%Mothim%Combee%Vespiquen%Pachirisu%Buizel%Floatzel%Cherubi%Cherrim%Shellos%Gastrodon%Ambipom%Drifloon%Drifblim%Buneary%Lopunny%Mismagius%Honchkrow%Glameow%Purugly%Chingling%Stunky%Skuntank%Bronzor%Bronzong%Bonsly%Mime Jr.%Happiny%Chatot%Spiritomb%Gible%Gabite%Garchomp%Munchlax%Riolu%Lucario%Hippopotas%Hippowdon%Skorupi%Drapion%Croagunk%Toxicroak%Carnivine%Finneon%Lumineon%Mantyke%Snover%Abomasnow%Weavile%Magnezone%Lickilicky%Rhyperior%Tangrowth%Electivire%Magmortar%Togekiss%Yanmega%Leafeon%Glaceon%Gliscor%Mamoswine%Porygon-Z%Gallade%Probopass%Dusknoir%Froslass%Rotom%Uxie%Mesprit%Azelf%Dialga%Palkia%Heatran%Regigigas%Giratina%Cresselia%Phione%Manaphy%Darkrai%Shaymin%Arceus%";
    // Section 5
    defaultRandomizerOptions.species["Pokemon"] += "Victini%Snivy%Servine%Serperior%Tepig%Pignite%Emboar%Oshawott%Dewott%Samurott%Patrat%Watchog%Lillipup%Herdier%Stoutland%Purrloin%Liepard%Pansage%Simisage%Pansear%Simisear%Panpour%Simipour%Munna%Musharna%Pidove%Tranquill%Unfezant%Blitzle%Zebstrika%Roggenrola%Boldore%Gigalith%Woobat%Swoobat%Drilbur%Excadrill%Audino%Timburr%Gurdurr%Conkeldurr%Tympole%Palpitoad%Seismitoad%Throh%Sawk%Sewaddle%Swadloon%Leavanny%Venipede%Whirlipede%Scolipede%Cottonee%Whimsicott%Petilil%Lilligant%Basculin%Sandile%Krokorok%Krookodile%Darumaka%Darmanitan%Maractus%Dwebble%Crustle%Scraggy%Scrafty%Sigilyph%Yamask%Cofagrigus%Tirtouga%Carracosta%Archen%Archeops%Trubbish%Garbodor%Zorua%Zoroark%Minccino%Cinccino%Gothita%Gothorita%Gothitelle%Solosis%Duosion%Reuniclus%Ducklett%Swanna%Vanillite%Vanillish%Vanilluxe%Deerling%Sawsbuck%Emolga%Karrablast%Escavalier%Foongus%Amoonguss%Frillish%Jellicent%Alomomola%Joltik%Galvantula%Ferroseed%Ferrothorn%Klink%Klang%Klinklang%Tynamo%Eelektrik%Eelektross%Elgyem%Beheeyem%Litwick%Lampent%Chandelure%Axew%Fraxure%Haxorus%Cubchoo%Beartic%Cryogonal%Shelmet%Accelgor%Stunfisk%Mienfoo%Mienshao%Druddigon%Golett%Golurk%Pawniard%Bisharp%Bouffalant%Rufflet%Braviary%Vullaby%Mandibuzz%Heatmor%Durant%Deino%Zweilous%Hydreigon%Larvesta%Volcarona%Cobalion%Terrakion%Virizion%Tornadus%Thundurus%Reshiram%Zekrom%Landorus%Kyurem%Keldeo%Meloetta%Genesect%";
    // Section 6
    defaultRandomizerOptions.species["Pokemon"] += "Chespin%Quilladin%Chesnaught%Fennekin%Braixen%Delphox%Froakie%Frogadier%Greninja%Bunnelby%Diggersby%Fletchling%Fletchinder%Talonflame%Scatterbug%Spewpa%Vivillon%Litleo%Pyroar%Flabébé%Floette%Florges%Skiddo%Gogoat%Pancham%Pangoro%Furfrou%Espurr%Meowstic%Honedge%Doublade%Aegislash%Spritzee%Aromatisse%Swirlix%Slurpuff%Inkay%Malamar%Binacle%Barbaracle%Skrelp%Dragalge%Clauncher%Clawitzer%Helioptile%Heliolisk%Tyrunt%Tyrantrum%Amaura%Aurorus%Sylveon%Hawlucha%Dedenne%Carbink%Goomy%Sliggoo%Goodra%Klefki%Phantump%Trevenant%Pumpkaboo%Gourgeist%Bergmite%Avalugg%Noibat%Noivern%Xerneas%Yveltal%Zygarde%Diancie%Hoopa%Volcanion%";
    // Section 7
    defaultRandomizerOptions.species["Pokemon"] += "Rowlet%Dartrix%Decidueye%Litten%Torracat%Incineroar%Popplio%Brionne%Primarina%Pikipek%Trumbeak%Toucannon%Yungoos%Gumshoos%Grubbin%Charjabug%Vikavolt%Crabrawler%Crabominable%Oricorio%Cutiefly%Ribombee%Rockruff%Lycanroc%Wishiwashi%Mareanie%Toxapex%Mudbray%Mudsdale%Dewpider%Araquanid%Fomantis%Lurantis%Morelull%Shiinotic%Salandit%Salazzle%Stufful%Bewear%Bounsweet%Steenee%Tsareena%Comfey%Oranguru%Passimian%Wimpod%Golisopod%Sandygast%Palossand%Pyukumuku%Type: Null%Silvally%Minior%Komala%Turtonator%Togedemaru%Mimikyu%Bruxish%Drampa%Dhelmise%Jangmo-o%Hakamo-o%Kommo-o%Tapu Koko%Tapu Lele%Tapu Bulu%Tapu Fini%Cosmog%Cosmoem%Solgaleo%Lunala%Nihilego%Buzzwole%Pheromosa%Xurkitree%Celesteela%Kartana%Guzzlord%Necrozma%Magearna%Marshadow%Poipole%Naganadel%Stakataka%Blacephalon%Zeraora%Meltan%Melmetal%";
    // Section 8
    defaultRandomizerOptions.species["Pokemon"] += "Grookey%Thwackey%Rillaboom%Scorbunny%Raboot%Cinderace%Sobble%Drizzile%Inteleon%Skwovet%Greedent%Rookidee%Corvisquire%Corviknight%Blipbug%Dottler%Orbeetle%Nickit%Thievul%Gossifleur%Eldegoss%Wooloo%Dubwool%Chewtle%Drednaw%Yamper%Boltund%Rolycoly%Carkol%Coalossal%Applin%Flapple%Appletun%Silicobra%Sandaconda%Cramorant%Arrokuda%Barraskewda%Toxel%Toxtricity%Sizzlipede%Centiskorch%Clobbopus%Grapploct%Sinistea%Polteageist%Hatenna%Hattrem%Hatterene%Impidimp%Morgrem%Grimmsnarl%Obstagoon%Perrserker%Cursola%Sirfetch'd%Mr. Rime%Runerigus%Milcery%Alcremie%Falinks%Pincurchin%Snom%Frosmoth%Stonjourner%Eiscue%Indeedee%Morpeko%Cufant%Copperajah%Dracozolt%Arctozolt%Dracovish%Arctovish%Duraludon%Dreepy%Drakloak%Dragapult%Zacian%Zamazenta%Eternatus%Kubfu%Urshifu%Zarude%Regieleki%Regidrago%Glastrier%Spectrier%Calyrex%Wyrdeer%Kleavor%Ursaluna%Basculegion%Sneasler%Overqwil%Enamorus%";
    // Section 9
    defaultRandomizerOptions.species["Pokemon"] += "Sprigatito%Floragato%Meowscarada%Fuecoco%Crocalor%Skeledirge%Quaxly%Quaxwell%Quaquaval%Lechonk%Oinkologne%Tarountula%Spidops%Nymble%Lokix%Pawmi%Pawmo%Pawmot%Tandemaus%Maushold%Fidough%Dachsbun%Smoliv%Dolliv%Arboliva%Squawkabilly%Nacli%Naclstack%Garganacl%Charcadet%Armarouge%Ceruledge%Tadbulb%Bellibolt%Wattrel%Kilowattrel%Maschiff%Mabosstiff%Shroodle%Grafaiai%Bramblin%Brambleghast%Toedscool%Toedscruel%Klawf%Capsakid%Scovillain%Rellor%Rabsca%Flittle%Espathra%Tinkatink%Tinkatuff%Tinkaton%Wiglett%Wugtrio%Bombirdier%Finizen%Palafin%Varoom%Revavroom%Cyclizar%Orthworm%Glimmet%Glimmora%Greavard%Houndstone%Flamigo%Cetoddle%Cetitan%Veluza%Dondozo%Tatsugiri%Annihilape%Clodsire%Farigiraf%Dudunsparce%Kingambit%Great Tusk%Scream Tail%Brute Bonnet%Flutter Mane%Slither Wing%Sandy Shocks%Iron Treads%Iron Bundle%Iron Hands%Iron Jugulis%Iron Moth%Iron Thorns%Frigibax%Arctibax%Baxcalibur%Gimmighoul%Gholdengo%Wo-Chien%Chien-Pao%Ting-Lu%Chi-Yu%Roaring Moon%Iron Valiant%Koraidon%Miraidon%Walking Wake%Iron Leaves%Dipplin%Poltchageist%Sinistcha%Okidogi%Munkidori%Fezandipiti%Ogerpon%Archaludon%Hydrapple%Gouging Fire%Raging Bolt%Iron Boulder%Iron Crown%Terapagos%Pecharunt";

    // And also with the digital monsters too
    // Section 1
    defaultRandomizerOptions.species["Digimon"] += "Invisimon%Oblivimon%Dimetromon%Ryugumon%Cernumon%MarineBullmon%Elizamon%Nezhamon%Dinomon%Skadimon%PolarBearmon%Erlangmon: Blast Mode%(X Antibody) QueenBeemon%(X Antibody) Vespamon%(X Antibody) ForgeBeemon%HeavyMetaldramon%Loudmon%Punkmon%Takutoumon:Wrath Mode%Erlangmon%Cendrillmon%Chaperomon%Zephagamon%GrandGalemon%Fluffymon%Yolkmon%Callismon%Tlalocmon%ShoeShoemon%Shoemon%Galemon%Pteromon%Takutoumon%(X Antibody) Fenriloogamon: Takemikazuchi%BigUkkomon%Ukkomon%Dijiangmon%Xingtianmon%Lianpumon%Dominimon%ArkhaiAngemon%Luxmon%Fanglongmon: Ruin Mode%Moonmon%Sunmon%Brigadramon%Hi-Commandramon%(X Antibody) Fenriloogamon%(X Antibody) Helloogarmon%(X Antibody) Soloogarmon%Cargodramon%(X Antibody) Loogarmon%(X Antibody) Bowmon%(X Antibody) Fusamon%Quantumon%(X Antibody) Loogamon%Proximamon%Arcturusmon%GreyKnightsmon%Zanmetsumon%Bombermon%Ghilliedhumon%Fumamon%Cthyllamon%Regulusmon%Galacticmon%Destromon%Snatchmon%Vemmon%(X Antibody) Baalmon（X antibody）%Amphimon%Diarbbitmon%Siriusmon%ShineGreymon: Ruin Mode%Chamblemon%Publimon%Oleamon%Huankunmon%Xiangpengmon%Xiquemon%Imperialdramon: Fighter Mode (Black)%(X Antibody) Greymon (Blue)((X Antibody) )%Oboromon%Gyuukimon%ShinMonzaemon%HoverEspimon%Espimon%Jupitermon: Wrath Mode%Plutomon%Ceresmon%Bacchusmon%Junomon: Hysteric Mode%Junomon%Thetismon%Lamortmon%Canoweissmon%Sistermon Ciel (Awake.)%Sistermon Noir (Awake.)%Sistermon Blanc (Awake.)%GulusGammamon%TeslaJellymon%SymbareAngoramon%BlackGatomon Uver.%Weddinmon%Shortmon%BlackRapidmon%BlackGargomon%Omnimon Zwart Defeat%WezenGammamon%KausGammamon%BetelGammamon%Abbadomon Core%Luminamon (Nene Version)%(Xros Wars) Shoutmon X7: Superior Mode%Jellymon%Puyoyomon%Puyomon%Angoramon%Bosamon%Pyonmon%Gammamon%Gurimon%Curimon%Abbadomon%Negamon%PileVolcanomon%Raidenmon%Raijinmon%DoKunemon%ModokiBetamon%Hydramon%Bloomlordmon%Ajatarmon%Guardromon (Gold)%Burgamon%Piddomon%SandYanmamon%Yanmamon%MoriShellmon%BomberNanimon%(X Antibody) HerculesKabuterimon%(X Antibody) Starmon%(X Antibody) Growlmon%(X Antibody) Hagurumon%(X Antibody) Gaiomon: Itto Mode%Brachiomon%Kyukimon%Vermilimon%Assaultmon%Tekkamon%Vulturemon%Tumblemon%Sandmon%Burpmon%BlackKingNumemon%GoldNumemon%Calumon%Gladimon%(Xros Wars) Shoutmon X4K%KoDokugumon%Yoxtu!Yoxtu!mon%Minidekachimon%Atamadekachimon%Trailmon%KingSukamon%Shroudmon%FrosVelgrmon%Frozomon%Hiyarimon%BlackSeraphimon%RareRaremon%Climbmon%Divemon%ClearAgumon%BanchoLillymon%(X Antibody) MetalGreymon (Vaccine)%(X Antibody) IceLeomon%(X Antibody) MetalMamemon%(X Antibody) Thundermon%(X Antibody) Monochromon%(X Antibody) Dobermon%";

    // Section 2
    defaultRandomizerOptions.species["Digimon"] += "(X Antibody) Gesomon%(X Antibody) Gotsumon%(X Antibody) Crabmon%(X Antibody) Guilmon%Shoutmon EX6%TorikaraBallmon%Burgamon%Potamon%Achillesmon%Shivamon%Kazuchimon%Pistmon%Tempomon%Shootmon%Boutmon%Mitamamon%LovelyAngemon%Bibimon%Dokimon%Namakemon%Runnermon%Exermon%Bulkmon%Komondomon%Pulsemon%Omnimon: Merciful Mode%DoneDevimon%WereGarurumon: Sagittarius Mode%Imperialdramon: Dragon Mode (Black)%Manticoremon%Mimicmon%Baluchimon%DarkMaildramon%MetalGreymon: Alterous Mode%Rebellimon%Machmon%Junkmon%HeavyLeomon%Hopmon%Ketomon%Nidhoggmon%Entmon%Parasaurmon%Toropiamon%Pomumon%Eyesmon: Scatter Mode%Eyesmon%(X Antibody) Betamon%(X Antibody) Gazimon%Argomon%Ghostmon%Regalecusmon%Piranimon%Gusokumon%MarineChimairamon%Tobiumon%Sangomon%Gogmamon%Baboongamon%Sunarizamon%JewelBeemon%Hudiemon%(Xros Wars) Arresterdramon: Superior Mode%(X Antibody) Garurumon%(X Antibody) Greymon%Argomon%Argomon%Argomon%Spadamon%Morphomon%Eosmon%Gabumon (Bond of Friendship)%Agumon (Bond of Bravery)%Eosmon%Eosmon%TonosamaMamemon%Omnimon Zwart%Terriermon Assistant%CrysPaledramon%Metallicdramon%Jazarichmon%Jazardmon%Jazamon%Hexeblaumon%Paledramon%NoblePumpkinmon%(X Antibody) Ogudomon%(X Antibody) Jesmon GX%(X Antibody) Keramon%(X Antibody) OmniShoutmon%(X Antibody) Meramon%(X Antibody) Pegasusmon%(X Antibody) Rapidmon%(X Antibody) Monzaemon%(X Antibody) Gankoomon%(X Antibody) Examon%(X Antibody) Cyberdramon%(X Antibody) RizeGreymon%(X Antibody) Phoenixmon%(X Antibody) Justimon%(X Antibody) Wizardmon%(X Antibody) Seasarmon%(X Antibody) Cherubimon (Good)%(X Antibody) Ophanimon%(X Antibody) Angewomon%(X Antibody) Diaboromon%(X Antibody) Dynasmon%(X Antibody) Leopardmon%(X Antibody) Magnadramon%(X Antibody) Plesiomon%(X Antibody) Goldramon%(X Antibody) Garudamon%(X Antibody) Gatomon%(X Antibody) Togemon%(X Antibody) Tylomon%(X Antibody) Lopmon%(X Antibody) Syakomon%(X Antibody) Terriermon%(X Antibody) Palmon%(X Antibody) Pteramon%(X Antibody) Mamemon%(X Antibody) Ebemon%(X Antibody) Kentaurosmon%(X Antibody) Craniamon%(X Antibody) UlforceVeedramon%(X Antibody) Magnamon%(X Antibody) MegaSeadramon%(X Antibody) Triceramon%(X Antibody) Okuwamon%(X Antibody) Mantaraymon%(X Antibody) Nefertimon%(X Antibody) Seadramon%(X Antibody) Kuwagamon%(X Antibody) Allomon%(X Antibody) Gomamon%(X Antibody) Kokuwamon%(X Antibody) BlackWarGreymon%(X Antibody) LadyDevimon%(X Antibody) MetalGreymon (Virus)%(X Antibody) Ogremon%(X Antibody) Agumon (Black)%Rasenmon%Rasenmon: Fury Mode%Stefilmon%Filmon%(X Antibody) Rosemon%(X Antibody) PrinceMamemon%(X Antibody) SkullMammothmon%(X Antibody) Mammothmon%(X Antibody) Mephistomon%(X Antibody) Myotismon%(X Antibody) Salamon%(X Antibody) Otamamon%Yaamon%Keemon%(X Antibody) Impmon%(X Antibody) DarkTyrannomon%(X Antibody) Numemon%(X Antibody) Lucemon%(X Antibody) Lilithmon%(X Antibody) Leviamon%(X Antibody) Belphemon%";

    // Section 3
    defaultRandomizerOptions.species["Digimon"] += "(X Antibody) Barbamon%(X Antibody) Creepymon%(X Antibody) DarkKnightmon%(X Antibody) Cherubimon (Black)%(X Antibody) Ophanimon: Falldown Mode%UltimateChaosmon%Pusurimon%Pusumon%Surfimon%Bulucomon%Herissmon%MetalGarurumon (Black)%WereGarurumon (Black)%Garurumon (Black)%Justimon: Blitz Arm%Ginkakumon Promote%IceDevimon%Kuzuhamon Maid Mode%WarGrowlmon (Orange)%Greymon (Blue)%(Xros Wars) Shoutmon (King Version)%(X Antibody) WarGreymon%(X Antibody) MetalGarurumon%(X Antibody) Megidramon%(X Antibody) WereGarurumon%(X Antibody) Lillymon%(X Antibody) Sakuyamon%(X Antibody) Beelzemon%(X Antibody) WarGrowlmon%(X Antibody) Rhinomon%(X Antibody) Renamon%(X Antibody) Tokomon%(X Antibody) BeelStarmon%(X Antibody) Gallantmon%(X Antibody) Cerberusmon%(X Antibody) Tyrannomon%(X Antibody) Dracomon%(X Antibody) Gabumon%(X Antibody) Minervamon%(X Antibody) LordKnightmon%Sistermon Ciel%(X Antibody) MetalTyrannomon%(X Antibody) Leomon%(X Antibody) Agumon%(X Antibody) Jesmon%RagnaLoardmon%Rafflesimon%Ordinemon%(Xros Wars) RaptorSparrowmon%BanchoGolemon%Cerberusmon: Werewolf Mode%Growlmon (Orange)%ToyAgumon (Black)%(Xros Wars) ShootingStarmon%Justimon: Critical Arm%Crowmon%Dinohyumon%Rapidmon%(Xros Wars) JaegerDorulumon%Gundramon%Aegiochusmon: Holy%Gabumon (Black)%Pipimon%Raguelmon%BryweLudramon%Volcanicdramon%Lavogaritamon%Maycrackmon: Vicious Mode%Mastemon%Boltboutamon%RaijiLudomon%TiaLudomon%Lavorvomon%BushiAgumon%Ludomon%Kakkinmon%Cotsucomon%Antylamon%Meicoomon%Whamon (Champion)%Gekomon%Vorvomon%(Xros Wars) AtlurBallistamon%Omnimon Alter-B%BlackMachGaogamon%BlackGaogamon%Falcomon (2006 Anime Version)%Kudamon (2006 Anime Version)%NEO%(Xros Wars) Yakiimon%(Xros Wars) Monimon%(Xros Wars) Monitamon%(Xros Wars) Mervamon%(Xros Wars) MetalGreymon + Cyber Launcher%(Xros Wars) MetalGreymon (2010 Anime Version)%(Xros Wars) MailBirdramon%(Xros Wars) MusouKnightmon%(Xros Wars) MadLeomon: Armed Mode%(Xros Wars) MadLeomon%(Xros Wars) Bommon (2010 Anime Version)%(Xros Wars) Beelzemon (2010 Anime Version)%(Xros Wars) Blastmon%(Xros Wars) Footmon%(Xros Wars) Pillomon%(Xros Wars) Pickmon%(Xros Wars) Ballistamon%(Xros Wars) Bakomon%(Xros Wars) Bagramon%(Xros Wars) Hi-VisionMonitamon%(Xros Wars) Baalmon%(Xros Wars) NeoMyotismon%(Xros Wars) Dondokomon%(Xros Wars) DonShoutmon%(Xros Wars) Dorulumon%(Xros Wars) Dorbickmon%(Xros Wars) Troopmon%(Xros Wars) DeadlyAxemon%(Xros Wars) Deckerdramon%(Xros Wars) DeckerGreymon%(Xros Wars) Tuwarmon%(Xros Wars) ChuuChuumon%(Xros Wars) Chibickmon%(Xros Wars) Chikurimon%";

    // Section 3
    defaultRandomizerOptions.species["Digimon"] += "(Xros Wars) Damemon%(Xros Wars) Tactimon%(Xros Wars) DarknessBagramon%(Xros Wars) DarkKnightmon%(Xros Wars) Zenimon%(Xros Wars) Splashmon%(Xros Wars) Sparrowmon%(Xros Wars) Starmons%(Xros Wars) SkullKnightmon: Mighty Axe Mode%(Xros Wars) SkullKnightmon: Cavalier Mode%(Xros Wars) SkullKnightmon%(Xros Wars) Jokermon%(Xros Wars) Shanitamon%(Xros Wars) Shoutmon + Dorulu Cannon%(Xros Wars) Shoutmon + Star Sword%(Xros Wars) Shoutmon + Jet Sparrow%(Xros Wars) Shoutmon X7%(Xros Wars) Shoutmon X5B%(Xros Wars) Shoutmon X5%(Xros Wars) Shoutmon X4B%(Xros Wars) Shoutmon X4%(Xros Wars) Shoutmon X3%(Xros Wars) Shoutmon X2%(Xros Wars) Shoutmon DX%(Xros Wars) Shoutmon%(Xros Wars) JetMervamon%(Xros Wars) ZeigGreymon%(Xros Wars) Zamielmon%(Xros Wars) Soundbirdmon%(Xros Wars) Cyberdramon%(Xros Wars) Kozenimon%(Xros Wars) Greymon (2010 Anime Version)%(Xros Wars) Gravimon%(Xros Wars) Cutemon%(Xros Wars) Gumdramon%(Xros Wars) Ganemon%(Xros Wars) Gaossmon%(Xros Wars) Olegmon%(Xros Wars) OmniShoutmon%(Xros Wars) Ekakimon%(Xros Wars) Ignitemon%(Xros Wars) Arresterdramon%(Hybrid) Loweemon%(Hybrid) Lanamon%(Hybrid) Rhihimon%(Hybrid) RhinoKabuterimon%(Hybrid) Mercurymon%(Hybrid) MagnaGarurumon%(Hybrid) MetalKabuterimon%(Hybrid) Velgrmon%(Hybrid) Petaldramon%(Hybrid) Beowolfmon%(Hybrid) Flamemon%(Hybrid) Beetlemon%(Hybrid) Korikakumon%(Hybrid) Kazemon%(Hybrid) Kumamon%(Hybrid) Duskmon%(Hybrid) DaiPenmon%(Hybrid) Sephirothmon%(Hybrid) Strabimon%(Hybrid) Zephyrmon%(Hybrid) JetSilphymon%(Hybrid) Grumblemon%(Hybrid) Gigasmon%(Hybrid) KendoGarurumon%(Hybrid) Calmaramon%(Hybrid) EmperorGreymon%(Hybrid) JagerLoweemon%(Hybrid) BurningGreymon%(Hybrid) Lobomon%(Hybrid) Arbormon%(Hybrid) Aldamon%(Hybrid) Agunimon%Rinkmon%Lynxmon%Rhinomon%Lighdramon%Yasyamon%Mothmon%Maildramon%Moosemon%Manbomon%Mantaraymon%Magnamon%Ponchomon%Halsemon%Boarmon%Pegasusmon%Frogmon%Prairiemon%Flamedramon%FlameWizardmon%Bullmon%Flybeemon%Pteramon%Bucchiemon (Green)%Bucchiemon%Pipismon%Rabbitmon%Peacockmon%Baronmon%Honeybeemon%Butterflymon%Harpymon%Nohemon%Nefertimon%Togemogumon%Toucanmon%Depthmon%Tylomon%Digmon%Sepikmon%Sethmon%Swanmon%Stegomon%Shurimon%Shadramon%Seahomon%Sheepmon%Thunderbirdmon%Salamandermon%Submarimon%Sagittarimon%Searchmon%Kongoumon%GoldVeedramon%Goatmon%Kenkimon%Quetzalmon%Kangarumon%Chameleonmon%Kabukimon%Gargoylemon%Orcamon%Opossummon%Elephantmon%Allomon%Archelomon%Aurumon%LordKnightmon%Lotosmon%Rosemon: Burst Mode%Rosemon%Ravemon: Burst Mode%Ravemon%Lucemon: Larva%Lucemon: Satan Mode%Lilithmon%Leviamon%Lampmon%RustTyrannomon%Rasielmon%Jupitermon%Merukimon%MedievalGallantmon%(X Antibody) MetalPiranimon%MetalSeadramon%MetalGarurumon%MetalEtemon%Megidramon%MoonMillenniummon%Murmukusmon%Machinedramon%Millenniummon%";

    // Section 4
    defaultRandomizerOptions.species["Digimon"] += "MirageGaogamon: Burst Mode%MirageGaogamon%Minervamon%Marsmon%MarineAngemon%MagnaKidmon%Boltmon%Magnadramon%Phoenixmon%Belphemon: Rage Mode%Belphemon: Sleep Mode%Beelzemon: Blast Mode%Beelzemon%BeelStarmon%MaloMyotismon%HerculesKabuterimon%Plesiomon%Breakdramon%PrinceMamemon%BlitzGreymon%BlackSaintGargomon%BlackWarGreymon%PlatinumNumemon%Pukumon%Fujinmon%Fanglongmon%Pharaohmon%Puppetmon%VictoryGreymon%Piedmon%BanchoLeomon%BanchoMamemon%BanchoStingmon%Barbamon%Parasimon%Babamon%Baihumon%HiAndromon%Neptunemon%(X Antibody) Dorugoramon%Leopardmon: Leopard Mode%Leopardmon%Durandamon%Dynasmon%Gallantmon: Crimson Mode%Gallantmon%Devitamamon%Ghoulmon (Black)%Ghoulmon%DeathXmon%Creepymon%(X Antibody) DexDorugoramon%(X Antibody) Dinorexmon%(X Antibody) Dinotigermon%Diaboromon%Dianamon%Azulongmon%Darkdramon%TyrantKabuterimon%Titamon%(X Antibody) TigerVespamon%MegaGargomon%Seraphimon%Slayerdramon%Kentaurosmon%SlashAngemon%Spinomon%Susanomon%SkullMammothmon%Zhuqiaomon%Suijinmon%ZeedMillenniummon%ZeedGarurumon%JumboGamemon%Justimon: Accel Arm%Shakamon%ShineGreymon: Burst Mode%ShineGreymon%Jijimon%Ebonwumon%Jesmon%Zanbamon%Sakuyamon: Maid Mode%Sakuyamon%SaberLeomon%Goldramon%Reapermon%Cherubimon (Black)%Cherubimon (Good)%Eaglemon%Craniamon%GraceNovamon%Gryphonmon%GroundLocomon%GranDracmon%(X Antibody) GrandisKuwagamon%GranKuwagamon%ClavisAngemon%Kuzuhamon%Quartzmon%CresGarurumon%QueenChessmon%KingChessmon%KingEtemon%Cannondramon%(X Antibody) GigaSeadramon%Gankoomon%Gulfmon%Chaosmon: Valdur Arm%Chaosmon%(X Antibody) Chaosdramon%Chaosdramon%ChaosGallantmon%(X Antibody) Gaiomon%Omnimon Alter-S%(X Antibody) Omnimon%Omnimon%Ophanimon: Falldown Mode%Ophanimon%Ornismon%Ogudomon%(X Antibody) Ouryumon%AncientWisemon%AncientMegatheriummon%AncientMermaimon%AncientVolcanomon%AncientBeetlemon%AncientTroymon%AncientSphinxmon%AncientGreymon%AncientGarurumon%AncientKazemon%Eldradimon%Examon%Vulcanusmon%WarGreymon%VenomMyotismon%Venusmon%Varodurumon%Valkyrimon%Vikemon%Ebemon%Aegisdramon%Imperialdramon: Fighter Mode%Imperialdramon: Paladin Mode%Imperialdramon: Dragon Mode%King Drasil_7D6%UlforceVeedramon%(X Antibody) Alphamon: Ouryuken%(X Antibody) Alphamon%(X Antibody) UltimateBrachiomon%Argomon%Apollomon%Apocalymon%Anubismon%Armageddemon%AvengeKidmon%WaruMonzaemon%WaruSeadramon%Wisemon%WereGarurumon%Locomon%LoaderLeomon%LadyDevimon%Luminamon%Lucemon: Chaos Mode%RookChessmon%Lillymon%Rapidmon%Lilamon%RizeGreymon%Crowmon (2006 Anime Version)%Monzaemon%Mephistomon%MetalMamemon%";

    // Section 5
    defaultRandomizerOptions.species["Digimon"] += "(X Antibody) MetalPhantomon%MetalTyrannomon%MetalGreymon (Vaccine)%MetalGreymon (Virus)%MetallifeKuwagamon%WarGrowlmon%Megadramon%MegaSeadramon%Maycrackmon%Mihiramon%Mistymon%Mammothmon%MarineDevimon%(X Antibody) Mametyramon%Mamemon%Mummymon%MachGaogamon%Matadormon%MasterTyrannomon%Majiramon%Makuramon%Mermaimon%Volcanomon%MagnaAngemon%Whamon%Betsumon%(X Antibody) Vademon%Vademon%Blossomon%Flaremon%BlueMeramon%BlackWarGrowlmon%Feresmon%Phantomon%HippoGryphonmon%Piximon%BigMamemon%BishopChessmon%(X Antibody) Hisyaryumon%Pumpkinmon%Pandamon%IceLeomon%Divermon%Parrotmon%Bulbmon%Bastemon%Pajiramon%Paildramon%NeoDevimon%Datamon%Knightmon%(X Antibody) DoruGreymon%Triceramon%ShogunGekomon%Doumon%Deramon%Duramon%SkullMeramon%Digitamamon%(X Antibody) DexDoruGreymon%Dinobeemon%Cho-Hakkaimon%Caturamon%Chirinmon%Tankdramon%Dragomon%Taomon%DarkSuperStarmon%Sirenmon%SaviorHuckmon%Zudomon%SkullScorpiomon%(X Antibody) SkullBaluchimon%SkullSatamon%SkullGreymon%SuperStarmon%Sinduramon%Silphymon%Cherrymon%Shakkoumon%Jagamon%Shaujinmon%Sandiramon%Sanzomon%Sagomon%Cyberdramon%Gokuumon%Cerberusmon%Kumbhiramon%Crescemon%(X Antibody) Grademon%GrapLeomon%Groundramon%Giromon%CaptainHookmon%(X Antibody) CannonBeemon%CatchMamemon%Kimeramon%Gigadramon%Garudamon%Karatenmon%Garbagemon%Orochimon%Okuwamon%Angewomon%";

    // Section 6
    defaultRandomizerOptions.species["Digimon"] += "Etemon%ExTyrannomon%AeroVeedramon%Volcdramon%Wingdramon%Vikaralamon%Myotismon%Vajramon%Infermon%Indramon%Meteormon%Andromon%Antylamon (Deva)%Argomon%Arukenimon%(X Antibody) Scorpiomon%Scorpiomon%MegaKabuterimon (Red)%MegaKabuterimon (Blue)%Astamon%Asuramon%Aegiochusmon: Blue%Aegiochusmon: Dark%Aegiochusmon: Green%Aegiochusmon%(X Antibody) Waspmon%Reppamon%RedVegiemon%Lekismon%Leomon%Raremon%Dolphmon%Deputymon%(X Antibody) Raptordramon%Liamon%Youkomon%Unimon%Frigimon%Monochromon%Mojyamon%Meramon%Mekanorimon%Musyamon%Minotarumon%Mikemon%Porcupamon%Peckmon%Vegiemon%BladeKuwagamon%Flarerizamon%Blimpmon%BlackGatomon%BlackGrowlmon%PlatinumSukamon%Flymon%Hookmon%Boogiemon%Fugamon%Veedramon%Fangmon%Firamon%Hyogamon%Petermon%Apemon%Bakemon%BaoHuckmon%Birdramon%Numemon%NiseDrimogemon%Nanimon%KnightChessmon (White)%KnightChessmon (Black)%(X Antibody) Dorugamon%Drimogemon%(X Antibody) TobuCatmon%Doggymon%Togemon%Dokugumon%Dobermon%Tortomon%Turuiemon%Deltamon%Devimon%Devidramon%(X Antibody) DexDorugamon%Gatomon%Tyrannomon%Diatrymon%MudFrigimon%Tankmon%Darcmon%Tuskmon%Targetmon%DarkLizardmon%DarkTyrannomon%Sorcermon%Soulmon%Saberdramon%ZubaEagermon%Snimon%Strikedramon%Stingmon%Starmon%Sukamon%JungleMojyamon%ShimaUnimon%Sistermon Noir%GeoGreymon%Shellmon%Shademon%Sealsdramon%Coelamon%Seadramon%Seasarmon%Sunflowmon%Thundermon%Sangloupmon%Weedmon%Cyclonemon%Gorillamon%Roachmon%Golemon%Kokatorimon%Kogamon%Coredramon (Green)%Coredramon (Blue)%Centarumon%Geremon%Gesomon%Kuwagamon%Clockmon%Greymon%Gururumon%Grizzlymon%Kurisarimon%Growlmon%(X Antibody) Ginryumon%Ginkakumon%Kinkakumon%Kyubimon%Kiwimon%Gawappamon%Garurumon%Gargomon%ShellNumemon%Kabuterimon%Guardromon%Gaogamon%(X Antibody) Omekamon%Octomon%Ogremon%Angemon%Ebidramon%ExVeemon%Airdramon%Woodmon%Wendigomon%Witchmon%Wizardmon%Vilemon%Ikkakumon%Ninjamon%Ankylomon%Aquilamon%Akatorimon%Icemon%Aegiomon%Wormmon%Lopmon%Renamon%Liollmon%Lunamon%Lucemon%(X Antibody) Ryudamon%Lalamon%Labramon%SnowAgumon%Monodramon%Muchomon%Mushroomon%Bokomon%PawnChessmon (White)%";

    // Section 7
    defaultRandomizerOptions.species["Digimon"] += "PawnChessmon (Black)%Hawkmon%Penmon%Betamon%Bearmon%Salamon%Floramon%Veemon%(X Antibody) FunBeemon%Falcomon%Phascomon%Biyomon%DemiDevimon%Palmon%Huckmon%Patamon%Hagurumon%Tapirmon%Neemon%Fake Agumon Expert%(X Antibody) Dorumon%Dracomon%Dracmon%ToyAgumon%Tentomon%Terriermon%Tinkermon%Tsukaimon%Chuumon%Solarmon%Zubamon%SnowGoblimon%Swimmon%Syakomon%Shamamon%Sistermon Blanc%Psychemon%Coronamon%Commandramon%Gomamon%Goblimon%Kotemon%Gotsumon%Kokuwamon%KoKabuterimon%Monmon%Keramon%Kunemon%Kudamon%Guilmon%Candlemon%Gizamon%Kamemon%Gabumon%Crabmon%Gazimon%Gaomon%Otamamon (Red)%Otamamon%Elecmon (Violet)%Elecmon%EbiBurgamon%Impmon%Aruraumon%Armadillomon%Arcadiamon%Agumon Expert%Agumon (Black)%Agumon (2006 Anime Version)%Agumon%Wanyamon%Motimon%Minomon%Missimon%Poromon%Viximon%Bebydomon%(X Antibody) Puroromon%Frimon%DemiMeramon%Bukamon%Yokomon%Pinamon%Budmon%Pagumon%Nyaromon%(X Antibody) Dorimon%Tokomon%Tsumemon%Tsunomon%Kokomon%Chapmon%DemiVeemon%Tanemon%Xiaomon%Sakuttomon%Koromon%Gummymon%(X Antibody) Kyokyomon%Cupimon%Kyaromon%Gigimon%Kapurimon%Upamon%Relemon%Leafmon%Yuramon%YukimiBotamon%Mokumon%Poyomon%Bommon%Popomon%Botamon%Puwamon%Pururumon%(X Antibody) Pupumon%(X Antibody) Fufumon%Punimon%Puttimon%Petitmon%Pichimon%Pafumon%Pabumon%Paomon%Nyokimon%(X Antibody) Dodomon%Tsubumon%Choromon%Chibomon%Zerimon%Zurumon%Jyarimon%Sakumon%Conomon%Kuramon";

    defaultRandomizerOptions.species['25% Human | 75% Animals'] = defaultRandomizerOptions.species.Animals + "%Human*923";
    defaultRandomizerOptions.species['50% Human | 50% Animals'] = defaultRandomizerOptions.species.Animals + "%Human*2770";
    defaultRandomizerOptions.species['75% Human | 25% Animals'] = defaultRandomizerOptions.species.Animals + "%Human*8310";
    defaultRandomizerOptions.species['25% Human | 75% Mythos'] = defaultRandomizerOptions.species.Mythological + "%Human*317";
    defaultRandomizerOptions.species['50% Human | 50% Mythos'] = defaultRandomizerOptions.species.Mythological + "%Human*951";
    defaultRandomizerOptions.species['75% Human | 25% Mythos'] = defaultRandomizerOptions.species.Mythological + "%Human*2853";
    defaultRandomizerOptions.species['Mythos + Animals'] = defaultRandomizerOptions.species.Animals + "," + defaultRandomizerOptions.species.Mythological;
    defaultRandomizerOptions.species['25% Human | 75% Mythos + Animals'] = defaultRandomizerOptions.species['Mythos + Animals'] + "%Human*1240";
    defaultRandomizerOptions.species['50% Human | 50% Mythos + Animals'] = defaultRandomizerOptions.species['Mythos + Animals'] + "%Human*3721";
    defaultRandomizerOptions.species['75% Human | 25% Mythos + Animals'] = defaultRandomizerOptions.species['Mythos + Animals'] + "%Human*11163";
    defaultRandomizerOptions.species['25% Human | 75% Pokemon'] = defaultRandomizerOptions.species.Pokemon + "%Human*512";
    defaultRandomizerOptions.species['50% Human | 50% Pokemon'] = defaultRandomizerOptions.species.Pokemon + "%Human*1024";
    defaultRandomizerOptions.species['75% Human | 25% Pokemon'] = defaultRandomizerOptions.species.Pokemon + "%Human*3072";
    defaultRandomizerOptions.species['25% Human | 75% Digimon'] = defaultRandomizerOptions.species.Digimon + "%Human*614";
    defaultRandomizerOptions.species['50% Human | 50% Digimon'] = defaultRandomizerOptions.species.Digimon + "%Human*1227";
    defaultRandomizerOptions.species['75% Human | 25% Digimon'] = defaultRandomizerOptions.species.Digimon + "%Human*3681";
    defaultRandomizerOptions.species['Pokemon + Digimon'] = defaultRandomizerOptions.species.Pokemon + "," + defaultRandomizerOptions.species.Digimon;
    defaultRandomizerOptions.species['25% Human | 75% Pokemon + Digimon'] = defaultRandomizerOptions.species['Pokemon + Digimon'] + "%Human*1126";
    defaultRandomizerOptions.species['50% Human | 50% Pokemon + Digimon'] = defaultRandomizerOptions.species['Pokemon + Digimon'] + "%Human*2251";
    defaultRandomizerOptions.species['75% Human | 25% Pokemon + Digimon'] = defaultRandomizerOptions.species['Pokemon + Digimon'] + "%Human*6753";
    defaultRandomizerOptions.species.Chaos = defaultRandomizerOptions.species.Realistic + "%" + defaultRandomizerOptions.species.Animals + "%" + defaultRandomizerOptions.species.Mythological + "%" + defaultRandomizerOptions.species.Pokemon + "%" + defaultRandomizerOptions.species.Digimon + "%" + defaultRandomizerOptions.species.Fantasy + "%" + defaultRandomizerOptions.species["Sci-fi"] + "%" + defaultRandomizerOptions.species.Things + "%" + defaultRandomizerOptions.species.Food;

    // User's randomizer settings
    const randomizerSettings = {
        emoji: {
            selectedOption: 'Smileys',
            customList: ''
        },
        name: {
            selectedOption: 'Common',
            customList: ''
        },
        sex: {
            selectedOption: 'Standard',
            customList: ''
        },
        species: {
            selectedOption: 'Realistic',
            customList: ''
        },
        age: {
            selectedOption: 'Adult',
            customList: ''
        },
        bodyType: {
            selectedOption: 'All',
            customList: ''
        },
        personality: {
            selectedOption: 'All',
            customList: ''
        },
        bio: {
            selectedOption: 'Standard',
            customList: ''
        },
    };

    // Function to generate a random character
    function generateRandomCharacter() {
        const character = {};

        // Helper to get pronouns based on sex (male, female, other)
        function getPronouns(sex) {
            const lowerSex = sex.toLowerCase();
            if (lowerSex === 'male') {
                return { subject: 'he', object: 'him', possessive: 'his' };
            } else if (lowerSex === 'female') {
                return { subject: 'she', object: 'her', possessive: 'her' };
            } else {
                return { subject: 'they', object: 'them', possessive: 'their' };
            }
        }

        // Helper to remove comments (>> ... <<) - only for string fields
        function removeComments(text) {
            if (typeof text === 'string') {
                return text.replace(/>>.*?<<\s*/g, '');
            }
            return text; // If it's not a string, just return it unchanged
        }

        // Helper to process sub-lists (&!)
        function processSubLists(items) {
            const mainList = [];
            const subLists = [];

            items.forEach((item, index) => {
                if (index === 0) {
                    // The first item is the main list
                    mainList.push(...item.split(/[%\n]+/).map(i => i.trim()).filter(Boolean));
                } else {
                    // The remaining items are sub-lists, split by commas
                    const subListItems = item.split(/[%\n]+/).map(i => i.trim()).filter(Boolean);
                    subLists.push(subListItems);
                }
            });

            return { mainList, subLists };
        }

        // Process weighting for string items with a "*n" suffix
        function weightItems(list) {
            return list.map(item => {
                if (typeof item === 'string') {
                    const match = item.match(/^(.*)\*(\d+)$/);
                    if (match) {
                        return { value: match[1].trim(), weight: parseInt(match[2], 10) };
                    }
                    return { value: item.trim(), weight: 1 };
                }
                return { value: item, weight: 1 }; // For non-string items (e.g., age), no trimming
            });
        }

        // Function to get random item based on weighted random
        function getRandomFromWeightedList(list) {
            const totalWeight = list.reduce((sum, item) => sum + item.weight, 0);
            let random = Math.random() * totalWeight;
            for (const item of list) {
                if (random < item.weight) {
                    return item.value;
                }
                random -= item.weight;
            }
            return ''; // Fallback
        }

       // Function to handle recursive sub-list resolution and replace tokens
       function resolveSubListReferences(text, subLists, character, recursionDepth = 0) {
            const MAX_RECURSION_DEPTH = 10; // Prevent infinite recursion
            if (recursionDepth > MAX_RECURSION_DEPTH) {
                console.warn('Maximum recursion depth reached while resolving sub-lists.');
                return text;
            }

            // Replace sub-list references like &?n with a random item from sub-list n
            let resolvedText = text.replace(/&\?(\d+)/g, (match, listIndex) => {
                const index = parseInt(listIndex, 10);
                if (subLists[index] && subLists[index].length > 0) {
                    const subList = subLists[index];
                    const randomSubItem = getRandomFromWeightedList(weightItems(subList));
                    // Recursively resolve any sub-list references within the chosen sub-list item
                    return resolveSubListReferences(randomSubItem, subLists, character, recursionDepth + 1);
                }
                return ''; // If sub-list doesn't exist or is empty, return empty string
            });

            // After resolving sub-list references, replace tokens like #?a, #?b, etc.
            const pronouns = getPronouns(character.sex || '');
            resolvedText = resolvedText.replace(/#\?a/g, character.name || '')
                .replace(/#\?b/g, pronouns.subject)
                .replace(/#\?c/g, pronouns.object)
                .replace(/#\?d/g, pronouns.possessive);

            return resolvedText;
        }

        // In the `getRandomItem` function, update where `resolveSubListReferences` is called:
        function getRandomItem(field) {
            let items = [];
            if (randomizerSettings[field].customList.trim() !== '') {
                // Use custom list
                items = randomizerSettings[field].customList
                    .split(/[,\n]+/)
                    .map(item => item.trim())
                    .filter(item => item !== '');
            } else {
                // Use default list
                const selectedOption = randomizerSettings[field].selectedOption;
                items = defaultRandomizerOptions[field][selectedOption]
                    .split(/[,\n]+/)
                    .map(item => item.trim())
                    .filter(item => item !== '');
            }

            // Handle cases where items might be undefined or empty
            if (!items || items.length === 0) {
                return '';
            }

            // Remove comments (only applies to string fields)
            items = items.map(removeComments);

            // First, process the entire string before splitting by commas or newlines
            const inputString = items.join(',');

            // Split the input string on "&!" to separate sub-lists from the main text
            const mainTextAndSubLists = inputString.split('&!');

            // The main text is everything before the first "&!"
            const mainListString = mainTextAndSubLists.shift(); // Get the main text
            const subListStrings = mainTextAndSubLists; // Remaining parts are sub-lists

            // Now process the main list and any sub-lists
            const { mainList, subLists } = processSubLists([mainListString, ...subListStrings]);

            // Get the random item from the main list
            let result = getRandomFromWeightedList(weightItems(mainList));

            // If the field is 'bio', handle dynamic text insertion (e.g., pronouns, names)
            if (field === 'bio' && typeof result === 'string') {
                // Resolve sub-list references and replace tokens for bio
                result = resolveSubListReferences(result, subLists, character);
            } else {
                // For non-bio fields, resolve sub-list references if they exist
                result = resolveSubListReferences(result, subLists, character);
            }

            // For age, convert to numbers
            if (field === 'age') {
                result = parseInt(result, 10);
            }
            return result;
        }

        // Generate character fields
        character.emoji = getRandomItem('emoji');
        character.name = getRandomItem('name');
        character.sex = getRandomItem('sex');
        character.species = getRandomItem('species');
        character.age = getRandomItem('age');
        character.bodyType = getRandomItem('bodyType');
        character.personality = getRandomItem('personality');
        character.bio = getRandomItem('bio');

        return character;
    }

    // Function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Function to open Randomizer Settings dialog
    function openRandomizerSettings() {
        const settingsForm = document.createElement('form');
        console.log(settingsForm);
        settingsForm.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%; min-width: 500px; margin: 0 auto;">
            <!-- Scrollable content container -->
            <div class="scrollable-content" style="flex: 1; overflow-y: auto; max-height: 300px; padding-right: 10px;">
                <!-- Fields will be inserted here dynamically -->
            </div>
            <!-- Buttons at the bottom -->
            <div class="settings-buttons" style="text-align: center; padding-top: 10px;">
                <button type="submit" style="background-color: var(--button-bg-color); color: var(--text-color); border: none; padding: 8px 16px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Save Settings</button>
                <button type="button" style="background-color: var(--button-bg-color); color: var(--text-color); border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;" id="cancel-button">Cancel</button>
            </div>
        </div>
    `;

        const fieldsContainer = settingsForm.querySelector('.scrollable-content');
        // For each randomizable field, create settings UI
        const fields = ['emoji', 'name', 'sex', 'species', 'age', 'bodyType', 'personality', 'bio'];
        fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.style.marginBottom = '10px';

            const label = document.createElement('label');
            label.style.color = 'var(--text-color)';
            label.style.fontSize = '12px';
            label.textContent = `Randomizer for ${capitalizeFirstLetter(field)}:`;

            // Dropdown for default options
            const select = document.createElement('select');
            select.name = field;
            select.style.cssText = 'background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding:5px; width: 100%; box-sizing: border-box;';
            // Populate options
            const options = defaultRandomizerOptions[field];
            for (const optionName in options) {
                const option = document.createElement('option');
                option.value = optionName;
                option.textContent = optionName;
                if (randomizerSettings[field].selectedOption === optionName && !randomizerSettings[field].customList.trim()) {
                    option.selected = true;
                }
                select.appendChild(option);
            }

            // Custom list textarea
            const textarea = document.createElement('textarea');
            textarea.name = field + '_custom';
            textarea.rows = field != 'bio' ? 2 : 4;
            textarea.placeholder = 'Enter custom list, separated by "%" or new lines.';
            textarea.style.cssText = 'background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding:5px; width: 100%; box-sizing: border-box; margin-top: 5px;';
            textarea.value = randomizerSettings[field].customList;

            // If custom list is non-empty, disable the select
            if (randomizerSettings[field].customList.trim() !== '') {
                select.disabled = true;
            }

            // Event listener to disable select if textarea has content
            textarea.addEventListener('input', (e) => {
                if (textarea.value.trim() !== '') {
                    select.disabled = true;
                } else {
                    select.disabled = false;
                }
            });

            fieldDiv.appendChild(label);
            fieldDiv.appendChild(select);
            fieldDiv.appendChild(textarea);
            fieldsContainer.appendChild(fieldDiv);
        });

        const helpLabel = document.createElement('label');
        helpLabel.style.color = 'var(--text-color)';
        helpLabel.style.fontSize = '18px';
        helpLabel.textContent = `Text codes for advanced list creation;`;
        fieldsContainer.appendChild(helpLabel);

        // Create a paragraph element for the help text
        const helpText = document.createElement('p');

        // Apply styling to the paragraph element
        helpText.style.color = 'var(--text-color)';
        helpText.style.fontSize = '12px';

        // Set the content of the help text
        helpText.innerHTML = `
  <em>"%" marks the end of an item.<br>
  "*n" Multiply the odds an item is chosen.<br>
  "&!" Create a new sub list, index is assigned by order.<br>
  "&?n" Get a random item from a sublist.<br>
  "#?a" Get Character name (bio only)<br>
  "#?b" Get character pronoun like "he" (bio only)<br>
  "#?c" Get character pronoun like "him" (bio only)<br>
  "#?d" Get character pronoun like "his" (bio only)<br>
  ">>" Comment start.<br>
  "<<" Comment end.<br></em>
`;

        // Append the paragraph to the container
        fieldsContainer.appendChild(helpText);

        const cancelButton = settingsForm.querySelector('#cancel-button');
        cancelButton.addEventListener('click', () => {
            closeModal(settingsModal);
        });

        const settingsModal = createModal('Randomizer Settings', settingsForm);
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Update randomizerSettings
            fields.forEach(field => {
                const select = settingsForm[field];
                const textarea = settingsForm[field + '_custom'];
                randomizerSettings[field].customList = textarea.value.trim();
                if (randomizerSettings[field].customList !== '') {
                    randomizerSettings[field].selectedOption = '';
                } else {
                    randomizerSettings[field].selectedOption = select.value;
                }
            });
            closeModal(settingsModal);
        });

        settingsForm.parentNode.style.backgroundColor = 'var(--bg-color-full)';
    }

    // Function to edit a character
    function editCharacter(character) {
        const lockState = {
            emoji: false,
            name: false,
            sex: false,
            species: false,
            age: false,
            bodyType: false,
            personality: false,
            bio: false
        };

        const editForm = document.createElement('form');
        editForm.innerHTML = `
<div style="width: 100%; min-width: 500px; margin: 0 auto; position: relative;">
    ${createField('Emoji', 'emoji', character.emoji)}
    ${createAvatarField('Avatar', 'avatar', character.avatar)}
    ${createField('Name', 'name', character.name)}
    ${createSexDropdown('Sex', 'sex', character.sex)}
    ${createField('Species', 'species', character.species)}
    ${createField('Age', 'age', character.age)}
    ${createField('Body Type', 'bodyType', character.bodyType)}
    ${createField('Personality', 'personality', character.personality)}
    ${createTextareaField('Bio', 'bio', character.bio)}
    <label style="color: var(--text-color); font-size: 12px; margin-bottom: 8px; display: block;">Character Type:
        <select name="characterType" style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; width: 100%; box-sizing: border-box;">
            <option value="0" ${character.characterType === 0 ? 'selected' : ''}>Non-User</option>
            <option value="1" ${character.characterType === 1 ? 'selected' : ''}>User</option>
            <option value="2" ${character.characterType === 2 ? 'selected' : ''}>Collection</option>
        </select>
    </label>
    <button type="submit" style="background-color: var(--button-bg-color); color: var(--text-color); border: none; padding: 5px; border-radius: 5px; width: 100%; text-align: center; margin-top: 10px;">Save</button>
</div>
`;

        // Helper functions to create fields
        function createField(labelText, fieldName, value) {
            return `
    <label style="color: var(--text-color); font-size: 12px; margin-bottom: 8px; display: block;">
        ${labelText}:
        <div style="position: relative;">
            <input type="text" name="${fieldName}" value="${value}" autocomplete="off" style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; width: calc(100% - 35px); box-sizing: border-box;"/>
            <button type="button" class="lock-button" data-field="${fieldName}" style="position: absolute; right: 0; top: 0; height: 100%; width: 35px; background-color: var(--button-bg-color); border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer; color: var(--text-color);">${lockState[fieldName] ? '🔒' : '🔓'}</button>
        </div>
    </label>
    `;
        }

        function createAvatarField(labelText, fieldName, value) {
            return `
    <label style="color: var(--text-color); font-size: 12px; margin-bottom: 8px; display: block;">
        ${labelText}:
        <div style="position: relative;">
            <input type="text" name="${fieldName}" value="${value}" autocomplete="off" style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; width: calc(100% - 35px); box-sizing: border-box;" />
            <button type="button" class="open-avatar-button" data-field="${fieldName}" style="position: absolute; right: 0; top: 0; height: 100%; width: 35px; background-color: var(--button-bg-color); border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer; color: var(--text-color);">🔗</button>
        </div>
    </label>
    `;
        }

        function createSexDropdown(labelText, fieldName, value) {
            return `
    <label style="color: var(--text-color); font-size: 12px; margin-bottom: 8px; display: block;">
        ${labelText}:
        <div style="position: relative;">
            <select name="${fieldName}" style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; width: calc(100% - 35px); box-sizing: border-box;">
                <option value="male" ${value === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${value === 'female' ? 'selected' : ''}>Female</option>
                <option value="other" ${value === 'other' ? 'selected' : ''}>Other</option>
            </select>
            <button type="button" class="lock-button" data-field="${fieldName}" style="position: absolute; right: 0; top: 0; height: 100%; width: 35px; background-color: var(--button-bg-color); border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer; color: var(--text-color);">${lockState[fieldName] ? '🔒' : '🔓'}</button>
        </div>
    </label>
    `;
        }

        function createTextareaField(labelText, fieldName, value) {
            return `
    <label style="color: var(--text-color); font-size: 12px; margin-bottom: 8px; display: block;">
        ${labelText}:
        <div style="position: relative;">
            <textarea name="${fieldName}" autocomplete="off" rows="4" style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; width: calc(100% - 35px); box-sizing: border-box;">${value}</textarea>
            <button type="button" class="lock-button" data-field="${fieldName}" style="position: absolute; right: 0; top: 0; height: 100%; width: 35px; background-color: var(--button-bg-color); border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer; color: var(--text-color);">${lockState[fieldName] ? '🔒' : '🔓'}</button>
        </div>
    </label>
    `;
        }

        // Copy Tooltip button
        const copyButton = document.createElement('button');
        copyButton.textContent = '📋';
        copyButton.title = 'Copy Tooltip';
        copyButton.type = 'button'; // Prevent form submission
        copyButton.style.cssText = `
    position: absolute;
    top: 15px;
    right: 50px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-color);
    `;
        copyButton.addEventListener('click', () => {
            const tooltipContent = getCharacterTooltipContent(character);
            const textWithNewlines = tooltipContent.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
            navigator.clipboard.writeText(textWithNewlines);
        });
        editForm.appendChild(copyButton);

        // Randomize button
        const randomizeButton = document.createElement('button');
        randomizeButton.textContent = '🎲';
        randomizeButton.title = 'Randomize';
        randomizeButton.type = 'button'; // Prevent form submission
        randomizeButton.style.cssText = `
    position: absolute;
    top: 15px;
    right: 90px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-color);
    `;
        randomizeButton.addEventListener('click', () => {
            const randomCharacter = generateRandomCharacter();
            const fields = ['emoji', 'name', 'sex', 'species', 'age', 'bodyType', 'personality', 'bio'];
            fields.forEach((field) => {
                if (!lockState[field]) {
                    editForm[field].value = randomCharacter[field];
                }
            });
        });
        editForm.appendChild(randomizeButton);

        // Settings button
        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️';
        settingsButton.title = 'Randomizer Settings';
        settingsButton.type = 'button'; // Prevent form submission
        settingsButton.style.cssText = `
    position: absolute;
    top: 15px;
    right: 130px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-color);
    `;
        settingsButton.addEventListener('click', () => {
            openRandomizerSettings();
        });
        editForm.appendChild(settingsButton);

        // Append the form to a modal or the desired container
        const modal = createModal('Edit Character', editForm);

        // Lock button functionality
        const lockButtons = editForm.querySelectorAll('.lock-button');
        lockButtons.forEach((button) => {
            const fieldName = button.getAttribute('data-field');
            button.addEventListener('click', () => {
                lockState[fieldName] = !lockState[fieldName];
                // Update button icon based on state
                button.textContent = lockState[fieldName] ? '🔒' : '🔓';
            });
        });

        // Open Avatar button functionality
        const avatarButton = editForm.querySelector('.open-avatar-button');
        avatarButton.addEventListener('click', () => {
            const avatarUrl = editForm.avatar.value;
            if (isValidImageUrl(avatarUrl)) {
                window.open(avatarUrl, '_blank');
            } else {
                alert('Invalid image URL');
            }
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            character.emoji = editForm.emoji.value;
            character.avatar = editForm.avatar.value;
            character.name = editForm.name.value;
            character.sex = editForm.sex.value;
            character.species = editForm.species.value;
            character.age = editForm.age.value;
            character.bodyType = editForm.bodyType.value;
            character.personality = editForm.personality.value;
            character.bio = editForm.bio.value;
            character.characterType = parseInt(editForm.characterType.value, 10);
            renderCharacterGroups();
            closeModal(modal);
        });
    }

    // Function to delete a character
    function deleteCharacter(characterId) {
        if (confirm('Are you sure you want to delete this character?')) {
            characterGroups.forEach(group => {
                group.items = deleteCharacterRecursive(group.items, characterId);
            });
            renderCharacterGroups();
        }
    }

    function deleteCharacterRecursive(items, characterId) {
        return items.filter(item => {
            if (item.id === characterId) {
                return false;
            }
            if (item.children && item.children.length > 0) {
                item.children = deleteCharacterRecursive(item.children, characterId);
            }
            return true;
        });
    }

    // Function to export all characters with groups
    function exportCharacters() {
        const data = {
            characterGroups: characterGroups,
            settings: { c_radius, c_labelFontSize } // Save current settings
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `all_characters_with_groups.json`;
        link.click();
    }

    // Function to import characters with settings
    function importCharacters() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (Array.isArray(importedData)) {
                        // Old format
                        characterGroups = importedData;
                        renderCharacterGroups();
                    } else if (importedData.characterGroups) {
                        characterGroups = importedData.characterGroups;

                        // Load settings
                        if (importedData.settings) {
                            // Assign settings
                            c_radius = importedData.settings.c_radius || c_radius;
                            c_labelFontSize = importedData.settings.c_labelFontSize || c_labelFontSize;
                        }

                        renderCharacterGroups();
                    } else {
                        alert('Invalid format for characters import.');
                    }
                } catch (error) {
                    alert('Failed to import characters: ' + error.message);
                }
            };
            reader.readAsText(file);
        });
        fileInput.click();
    }

    // Function to export a single character
    function exportCharacter(character) {
        const json = JSON.stringify(character, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${character.name}.json`;
        link.click();
    }

    // Function to move character to a group (uncoupling from parent)
    function moveCharacterToGroup(characterId, targetGroupIndex) {
        let character = null;
        // Remove character from current group or parent
        characterGroups.forEach(group => {
            group.items = removeCharacterRecursive(group.items, characterId, (item) => {
                character = item;
            });
        });
        // Add to target group
        if (character) {
            characterGroups[targetGroupIndex].items.push(character);
            renderCharacterGroups();
        }
    }

    function removeCharacterRecursive(items, characterId, callback) {
        return items.filter(item => {
            if (item.id === characterId) {
                callback(item);
                return false;
            }
            if (item.children && item.children.length > 0) {
                item.children = removeCharacterRecursive(item.children, characterId, callback);
            }
            return true;
        });
    }

    // Function to move character under another character (nesting)
    function moveCharacterToParent(characterId, parentCharacter) {
        let character = null;
        // Remove character from current group or parent
        characterGroups.forEach(group => {
            group.items = removeCharacterRecursive(group.items, characterId, (item) => {
                character = item;
            });
        });
        if (character) {
            parentCharacter.children.push(character);
            renderCharacterGroups();
        }
    }

    // Utility function to generate unique IDs
    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // --- Location Sidebar with Groups and Nested Locations ---
    const locationSidebar = document.createElement('div');
    locationSidebar.id = 'location-sheet-sidebar';
    locationSidebar.style.cssText = `
        position: fixed;
        top: 0;
        left: -350px;
        width: 350px;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-color);
        border-right: 2px solid var(--border-color);
        box-shadow: 2px 0 5px var(--shadow-color);
        box-sizing: border-box;
        transition: left 0.3s;
        z-index: 9999;
    `;
    document.body.appendChild(locationSidebar);

    const locationToggleButton = document.createElement('button');
    locationToggleButton.textContent = '☰';
    locationToggleButton.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 5px 10px;
        border: none;
        background-color: var(--button-bg-color);
        color: var(--text-color);
        border-radius: 5px;
        cursor: pointer;
        transition: left 0.3s;
        z-index: 10000;
    `;
    locationToggleButton.addEventListener('click', () => {
        const isOpen = locationSidebar.style.left === '0px';
        locationSidebar.style.left = isOpen ? '-350px' : '0';
        locationToggleButton.style.left = isOpen ? '10px' : '360px';
    });
    document.body.appendChild(locationToggleButton);

    const locationHeader = document.createElement('div');
    locationHeader.style.cssText = `
        padding: 10px;
        background-color: var(--border-color);
        text-align: center;
        font-weight: bold;
        color: var(--text-color);
    `;
    locationHeader.textContent = 'Locations';
    // Add context menu functionality
    locationHeader.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        CreateContextMenu(
            'var(--bg-tool)',
            'var(--text-color)',
            'var(--border-color)',
            ['🌐 Radial', '🔍 Search','ℹ️ Status',  '📁 Group', '🗃️ Import', '⬇️ Export'],
            [
                () => {
                    if (radialTreeOpen) {
                        document.getElementById('radial-tree-window').remove();
                        radialTreeOpen = false;
                    }
                    const data = structureData(locationGroups);
                    createRadialTree(data, 'location');
                },
                () => toggleSearchPanel('location'),
                () => openGlobalStatusPanel(),
                () => createNewLocationGroup(),
                () => importLocations(),
                () => exportLocations(),
                ]
            );
        showMenu(e);
    });
    locationSidebar.appendChild(locationHeader);

    // Add fifth button: "Load" for Location
    function loadLocation(index = -1) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const location = JSON.parse(e.target.result);
                    if (location && location.id) {
                        // Add to Ungrouped
                        const ungrouped = locationGroups.find(g => g.name === 'Ungrouped');
                        if (index < 0 && ungrouped) {
                            ungrouped.items.push(location);
                        } else if (index >= locationGroups.length && ungrouped) {
                            ungrouped.items.push(location);
                        } else {
                            locationGroups[index].items.push(location);
                        }
                        renderLocationGroups();
                        ensureActiveLocation();
                    } else {
                        alert('Invalid location format.');
                    }
                } catch (error) {
                    alert('Failed to load location: ' + error.message);
                }
            };
            reader.readAsText(file);
        });
        fileInput.click();
    }

    const locationGroupList = document.createElement('div');
    locationGroupList.id = 'location-group-list';
    locationGroupList.style.cssText = `
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
    `;
    locationSidebar.appendChild(locationGroupList);

    // Initialize Location Groups with a single default location
    let locationGroups = [
        {
            name: 'Ungrouped',
            items: [
                {
                    id: generateId(),
                    active: true,
                    emoji: '📍',
                    reference: 'Url goes here...',
                    name: 'Default Location',
                    description: 'Description of the default location.',
                    children: [],
                    collapsed: false
                }
            ],
            collapsed: false,

        }
    ];

    // Function to create a new Location
    function createNewLocation(index = -1) {
        const newLocation = {
            id: generateId(),
            active: false,
            emoji: '📍',
            reference: 'Url Goes here...',
            name: 'New Location',
            description: '',
            children: [],
            collapsed: false
        };
        // Add to Ungrouped
        const ungrouped = locationGroups.find(g => g.name === 'Ungrouped');
        if (index < 0 && ungrouped) {
            ungrouped.items.push(newLocation);
        } else if (index >= locationGroups.length && ungrouped) {
            ungrouped.items.push(newLocation);
        } else {
            locationGroups[index].items.push(newLocation);
        }
        renderLocationGroups();
        ensureActiveLocation();
    }

    // Function to create a new Location Group
    function createNewLocationGroup() {
        const groupName = prompt('Enter group name:', `Group ${locationGroups.length}`);
        if (groupName && groupName.trim() !== '') {
            locationGroups.push({ name: groupName.trim(), items: [], collapsed: false });
            renderLocationGroups();
        }
    }

    // Function to render Location Groups and Items
    function renderLocationGroups() {
        locationGroupList.innerHTML = '';

        locationGroups.forEach((group, groupIndex) => {
            // Sort items alphabetically by name
            group.items.sort((a, b) => a.name.localeCompare(b.name));

            const groupContainer = document.createElement('div');
            groupContainer.className = 'location-group';
            groupContainer.style.cssText = `
                margin-bottom: 10px;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                background-color: var(--active-char-color);
            `;

            const groupHeader = document.createElement('div');
            groupHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 10px;
                background-color: var(--button-bg-color);
                color: var(--text-color);
                cursor: pointer;
                user-select: none;
                position: relative;
            `;
            groupHeader.textContent = group.name;
            groupHeader.addEventListener('click', () => {
                group.collapsed = !group.collapsed;
                renderLocationGroups();
            });

            // Add context menu functionality
            groupHeader.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                CreateContextMenu(
                    'var(--bg-tool)',
                    'var(--text-color)',
                    'var(--border-color)',
                    ['✏️ Rename','📝 Create', '🗃️ Import', '🗑️ Delete'],
                    [
                        () => renameLocationGroup(groupIndex),
                        () => createNewLocation(groupIndex),
                        () => loadLocation(groupIndex),
                        () => deleteLocationGroup(groupIndex),
                    ]
                );
                showMenu(e);
            });

            groupContainer.appendChild(groupHeader);

            if (!group.collapsed) {
                const itemsContainer = document.createElement('div');
                itemsContainer.style.cssText = `
                    padding: 5px 10px;
                    display: block;
                `;
                if (group.items.length === 0) {
                    const emptyInfo = document.createElement('div');
                    emptyInfo.className = 'location-slot';
                    emptyInfo.style.cssText = `
                        display: flex;
                        align-items: center;
                        padding: 10px;
                        margin-bottom: 5px;
                        border: 1px solid var(--border-color);
                        border-radius: 5px;
                        height: 20px;
                        background-color: var(--bg-color);
                        cursor: default;
                    `;

                    const infoText = document.createElement('span');
                    infoText.textContent = `Group is empty`;
                    infoText.style.cssText = `
                        color: var(--text-color);
                    `;

                    emptyInfo.appendChild(infoText);
                    itemsContainer.appendChild(emptyInfo);
                } else {
                    group.items.forEach((location) => {
                        const locationSlot = createLocationSlot(location, groupIndex);
                        itemsContainer.appendChild(locationSlot);
                    });
                }
                groupContainer.appendChild(itemsContainer);
            } else {
                const collapsedInfo = document.createElement('div');
                collapsedInfo.className = 'location-slot';
                collapsedInfo.style.cssText = `
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    margin-bottom: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: 5px;
                    height: 20px;
                    margin-top: 5px;
                    background-color: var(--bg-color);
                    cursor: default;
                    margin-left: 10px;
                    margin-right: 10px;
                `;
                const infoText = document.createElement('span');
                infoText.textContent = `${group.items.length} items hidden`;

                if (findActiveLocation(group.items)) {
                    infoText.style.cssText = `color: rgba(36, 242, 0, 0.75);`;
                } else {
                    infoText.style.cssText = `color: var(--text-color-darker);`;
                }

                collapsedInfo.appendChild(infoText);
                groupContainer.appendChild(collapsedInfo);
            }

            // Add dragover and drop events for grouping
            groupContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                groupContainer.style.border = `2px dashed var(--info-bg-color)`;
            });

            groupContainer.addEventListener('dragleave', (e) => {
                groupContainer.style.border = `1px solid var(--border-color)`;
            });

            groupContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                groupContainer.style.border = `1px solid var(--border-color)`;
                const data = e.dataTransfer.getData('text/plain');
                const { type, id } = JSON.parse(data);
                if (type === 'location') {
                    moveLocationToGroup(id, groupIndex);
                }
            });

            locationGroupList.appendChild(groupContainer);
        });

        // Ensure at least one group exists
        if (locationGroups.length === 0) {
            locationGroups.push({ name: 'Ungrouped', items: [], collapsed: false });
            renderLocationGroups();
        }

        // Ensure at least one location is active
        ensureActiveLocation();
    }

    // Function to generate tooltip content for a location
    function getLocationTooltipContent(location, isRadial = false) {
        if (isRadial && location.emoji === '📁') {
            // If it's a group node in the radial tree, only show the name
            return `<strong>"${location.name}"</strong>`;
        }
        let content = `<strong>"${location.name}"</strong>:<br><em>"${location.description || 'No description available.'}"</em>`;
        return content;
    }

    // Function to create a Location Slot DOM element (recursive)
    function createLocationSlot(location, groupIndex, parent = null, level = 0) {
        const locationSlot = document.createElement('div');
        locationSlot.className = 'location-slot';
        locationSlot.draggable = true;
        locationSlot.dataset.id = location.id;
        locationSlot.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px;
            margin-bottom: 5px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            background-color: var(--bg-color);
            cursor: grab;
            margin-left: ${level * 20}px;
        `;

        // Drag events
        locationSlot.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'location', id: location.id }));
            e.currentTarget.style.opacity = '0.5';
        });

        locationSlot.addEventListener('dragend', (e) => {
            e.currentTarget.style.opacity = '1';
        });

        locationSlot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            locationSlot.style.border = `2px dashed var(--info-bg-color)`;
        });

        locationSlot.addEventListener('dragleave', (e) => {
            locationSlot.style.border = `1px solid var(--border-color)`;
        });

        locationSlot.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            locationSlot.style.border = `1px solid var(--border-color)`;
            const data = e.dataTransfer.getData('text/plain');
            const { type, id } = JSON.parse(data);
            if (type === 'location' && id !== location.id) {
                moveLocationToParent(id, location);
            }
        });

        // Context menu (right-click)
        locationSlot.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            CreateContextMenu(
                'var(--bg-tool)',
                'var(--text-color)',
                'var(--border-color)',
                ['✏️ Edit', '🗑️ Delete', '⬇️ Export'],
                [
                    () => editLocation(location),
                    () => deleteLocation(location.id),
                    () => exportLocation(location),
                ]
            );
            showMenu(e);
        });

        // Left Div (Emoji, Name)
        const leftDiv = document.createElement('div');
        leftDiv.style.cssText = `
            display: flex;
            align-items: center;
            flex-grow: 1;
            overflow: hidden;
        `;

        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = location.emoji;
        emojiSpan.style.marginRight = '5px';
        leftDiv.appendChild(emojiSpan);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = location.name;
        nameSpan.style.cssText = `
            flex-grow: 1;
            min-width: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--text-color);
        `;
        leftDiv.appendChild(nameSpan);

        // Remove Collapse/Expand Button
        // (Not needed as per new requirement)

        const activeButton = document.createElement('button');
        activeButton.textContent = location.active ? '🟢' : '🔴';
        activeButton.title = 'Toggle Active';
        activeButton.style.cssText = `
            padding: 3px;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-color);
            margin-right: 5px;
        `;
        activeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Since only one active location is allowed, deactivate others
            locationGroups.forEach(group => {
                group.items.forEach(loc => {
                    deactivateLocationRecursive(loc);
                });
            });
            location.active = !location.active;
            renderLocationGroups();
        });
        leftDiv.appendChild(activeButton);

        locationSlot.appendChild(leftDiv);

        // Recursive rendering of children
        const container = document.createElement('div');
        container.appendChild(locationSlot);

        if (location.children && location.children.length > 0) {
            if (!location.collapsed) {
                location.children.forEach((child) => {
                    const childSlot = createLocationSlot(child, groupIndex, location, level + 1);
                    container.appendChild(childSlot);
                });
            } else {
                const collapsedInfo = document.createElement('div');
                collapsedInfo.className = 'location-slot';
                collapsedInfo.style.cssText = `
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    margin-bottom: 5px;
                    border: 1px solid var(--border-color);
                    border-radius: 5px;
                    background-color: var(--bg-color);
                    height: 20px;
                    cursor: default;
                    margin-left: ${(level + 1) * 20}px;
                `;
                const infoText = document.createElement('span');
                infoText.textContent = `${location.children.length} items hidden`;

                if (findActiveLocation(location.children)) {
                    infoText.style.cssText = `color: rgba(36, 242, 0, 0.75);`;
                } else {
                    infoText.style.cssText = `color: var(--text-color-darker);`;
                }

                collapsedInfo.appendChild(infoText);
                container.appendChild(collapsedInfo);
            }
        }

        // Add tooltip event listeners
        nameSpan.addEventListener('mouseenter', (e) => {
            showTooltip(e, getLocationTooltipContent(location), false, location.reference);
        });
        nameSpan.addEventListener('mouseleave', hideTooltip);
        nameSpan.addEventListener('dragover', hideTooltip);

        return container;
    }

    function deactivateLocationRecursive(location) {
        location.active = false;
        if (location.children && location.children.length > 0) {
            location.children.forEach(child => {
                deactivateLocationRecursive(child);
            });
        }
    }

    // Function to rename a location group
    function renameLocationGroup(groupIndex) {
        const newName = prompt('Enter new group name:', locationGroups[groupIndex].name);
        if (newName && newName.trim() !== '') {
            locationGroups[groupIndex].name = newName.trim();
            renderLocationGroups();
        }
    }

    // Function to delete a location group
    function deleteLocationGroup(groupIndex) {
        if (locationGroups.length === 1) {
            alert('At least one group must exist.');
            return;
        }
        if (confirm(`Are you sure you want to delete the group "${locationGroups[groupIndex].name}"? All locations in this group will be moved to "Ungrouped".`)) {
            const group = locationGroups.splice(groupIndex, 1)[0];
            const ungrouped = locationGroups.find(g => g.name === 'Ungrouped');
            if (ungrouped) {
                ungrouped.items = ungrouped.items.concat(group.items);
            } else {
                locationGroups.unshift({ name: 'Ungrouped', items: group.items, collapsed: false });
            }
            renderLocationGroups();
        }
    }

    // Default randomizer options for locations
    const defaultRandomizerOptionsAlt = {
        emoji: {
            'Buildings': "🏠%🏡%🏫%🏭%🏢%🏰%🏩",
            'Nature': "🌲%🌳%🌴%🌵%🌾%🌊%🌋",
            // Add more categories if needed
        },
        name: {
            'Common': "Park%Museum%Library%Coffee Shop%Restaurant%Beach%Mountain%Lake%Forest%City",
            'Fantasy': "Dragon’s Lair%Enchanted Forest%Mystic Mountain%Crystal Lake%Forbidden City",
            // Add more categories if needed
        },
        description: {
            'Standard': "A beautiful place to visit.%Known for its stunning views.%A popular spot among locals.%Rich in history and culture.%Famous for its delicious cuisine.%Home to many rare species.%A tranquil escape from the city.%A bustling hub of activity.%A hidden gem waiting to be explored.%An iconic landmark.",
            // Add more categories if needed
        },
    };

    // User's randomizer settings for locations
    const randomizerSettingsAlt = {
        emoji: {
            selectedOption: 'Buildings',
            customList: ''
        },
        name: {
            selectedOption: 'Common',
            customList: ''
        },
        description: {
            selectedOption: 'Standard',
            customList: ''
        },
    };

    // Function to generate a random location
    function generateRandomLocationAlt() {
        const location = {};

        // Helper to remove comments (>> ... <<) - only for string fields
        function removeComments(text) {
            if (typeof text === 'string') {
                return text.replace(/>>.*?<<\s*/g, '');
            }
            return text; // If it's not a string, just return it unchanged
        }

        // Helper to process sub-lists (&!)
        function processSubLists(items) {
            const mainList = [];
            const subLists = [];

            items.forEach((item, index) => {
                if (index === 0) {
                    // The first item is the main list
                    mainList.push(...item.split(/[%\n]+/).map(i => i.trim()).filter(Boolean));
                } else {
                    // The remaining items are sub-lists, split by commas
                    const subListItems = item.split(/[%\n]+/).map(i => i.trim()).filter(Boolean);
                    subLists.push(subListItems);
                }
            });

            return { mainList, subLists };
        }

        // Process weighting for string items with a "*n" suffix
        function weightItems(list) {
            return list.map(item => {
                if (typeof item === 'string') {
                    const match = item.match(/^(.*)\*(\d+)$/);
                    if (match) {
                        return { value: match[1].trim(), weight: parseInt(match[2], 10) };
                    }
                    return { value: item.trim(), weight: 1 };
                }
                return { value: item, weight: 1 }; // For non-string items (e.g., age), no trimming
            });
        }

        // Function to get random item based on weighted random
        function getRandomFromWeightedList(list) {
            const totalWeight = list.reduce((sum, item) => sum + item.weight, 0);
            let random = Math.random() * totalWeight;
            for (const item of list) {
                if (random < item.weight) {
                    return item.value;
                }
                random -= item.weight;
            }
            return ''; // Fallback
        }

        // Function to handle recursive sub-list resolution and replace tokens
        function resolveSubListReferences(text, subLists, location, recursionDepth = 0) {
            const MAX_RECURSION_DEPTH = 10; // Prevent infinite recursion
            if (recursionDepth > MAX_RECURSION_DEPTH) {
                console.warn('Maximum recursion depth reached while resolving sub-lists.');
                return text;
            }

            // Replace sub-list references like &?n with a random item from sub-list n
            let resolvedText = text.replace(/&\?(\d+)/g, (match, listIndex) => {
                const index = parseInt(listIndex, 10);
                if (subLists[index] && subLists[index].length > 0) {
                    const subList = subLists[index];
                    const randomSubItem = getRandomFromWeightedList(weightItems(subList));
                    // Recursively resolve any sub-list references within the chosen sub-list item
                    return resolveSubListReferences(randomSubItem, subLists, location, recursionDepth + 1);
                }
                return ''; // If sub-list doesn't exist, return empty string
            });

            // After resolving sub-list references, replace tokens like #?a, #?b, etc.
            // In this case, we only use #?a for the location name, but you can extend this
            resolvedText = resolvedText.replace(/#\?a/g, location.name || '');

            return resolvedText;
        }

        // Function to get a random item from a list, including handling sub-lists and weighting
        function getRandomItem(field) {
            let items = [];
            if (randomizerSettingsAlt[field].customList.trim() !== '') {
                // Use custom list
                items = randomizerSettingsAlt[field].customList
                    .split(/[,\n]+/)
                    .map(item => item.trim())
                    .filter(item => item !== '');
            } else {
                // Use default list
                const selectedOption = randomizerSettingsAlt[field].selectedOption;
                items = defaultRandomizerOptionsAlt[field][selectedOption]
                    .split(/[,\n]+/)
                    .map(item => item.trim())
                    .filter(item => item !== '');
            }

            // Handle cases where items might be undefined or empty
            if (!items || items.length === 0) {
                return '';
            }

            // Remove comments (only applies to string fields)
            items = items.map(removeComments);

            // First, process the entire string before splitting by commas or newlines
            const inputString = items.join(',');

            // Split the input string on "&!" to separate sub-lists from the main text
            const mainTextAndSubLists = inputString.split('&!');

            // The main text is everything before the first "&!"
            const mainListString = mainTextAndSubLists.shift(); // Get the main text
            const subListStrings = mainTextAndSubLists; // Remaining parts are sub-lists

            // Now process the main list and any sub-lists
            const { mainList, subLists } = processSubLists([mainListString, ...subListStrings]);

            // Get the random item from the main list
            let result = getRandomFromWeightedList(weightItems(mainList));

            // If the field is 'description', handle dynamic text insertion (e.g., location name)
            if (field === 'description' && typeof result === 'string') {
                // Resolve sub-list references and replace tokens for the description
                result = resolveSubListReferences(result, subLists, location);
            } else {
                // For non-description fields, resolve sub-list references if they exist
                result = resolveSubListReferences(result, subLists, location);
            }

            return result;
        }

        // Generate location fields
        location.emoji = getRandomItem('emoji');
        location.name = getRandomItem('name');
        location.description = getRandomItem('description');

        return location;
    }

    // Function to open Randomizer Settings dialog for locations
    function openRandomizerSettingsAlt() {
        const settingsForm = document.createElement('form');
        settingsForm.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; min-width: 500px; margin: 0 auto;">
        <!-- Scrollable content container -->
        <div class="scrollable-content" style="flex: 1; overflow-y: auto; max-height: 300px; padding-right: 10px;">
            <!-- Fields will be inserted here dynamically -->
        </div>
        <!-- Buttons at the bottom -->
        <div class="settings-buttons" style="text-align: center; padding-top: 10px;">
            <button type="submit" style="background-color: var(--button-bg-color); color: var(--text-color); border: none; padding: 8px 16px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Save Settings</button>
            <button type="button" style="background-color: var(--button-bg-color); color: var(--text-color); border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;" id="cancel-button-alt">Cancel</button>
        </div>
    </div>
    `;

        const fieldsContainer = settingsForm.querySelector('.scrollable-content');

        // For each randomizable field, create settings UI
        const fields = ['emoji', 'name', 'description'];
        fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.style.marginBottom = '10px';

            const label = document.createElement('label');
            label.style.color = 'var(--text-color)';
            label.style.fontSize = '12px';
            label.textContent = `Randomizer for ${capitalizeFirstLetter(field)}:`;

            // Dropdown for default options
            const select = document.createElement('select');
            select.name = field;
            select.style.cssText = 'background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding:5px; width: 100%; box-sizing: border-box;';
            // Populate options
            const options = defaultRandomizerOptionsAlt[field];
            for (const optionName in options) {
                const option = document.createElement('option');
                option.value = optionName;
                option.textContent = optionName;
                if (randomizerSettingsAlt[field].selectedOption === optionName && !randomizerSettingsAlt[field].customList.trim()) {
                    option.selected = true;
                }
                select.appendChild(option);
            }

            // Custom list textarea
            const textarea = document.createElement('textarea');
            textarea.name = field + '_custom';
            textarea.rows = field != 'description' ? 2 : 4;
            textarea.placeholder = 'Enter custom list, separated by "%" or new lines.';
            textarea.style.cssText = 'background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding:5px; width: 100%; box-sizing: border-box; margin-top: 5px;';
            textarea.value = randomizerSettingsAlt[field].customList;

            // If custom list is non-empty, disable the select
            if (randomizerSettingsAlt[field].customList.trim() !== '') {
                select.disabled = true;
            }

            // Event listener to disable select if textarea has content
            textarea.addEventListener('input', (e) => {
                if (textarea.value.trim() !== '') {
                    select.disabled = true;
                } else {
                    select.disabled = false;
                }
            });

            fieldDiv.appendChild(label);
            fieldDiv.appendChild(select);
            fieldDiv.appendChild(textarea);
            fieldsContainer.appendChild(fieldDiv);
        });

        const helpLabel = document.createElement('label');
        helpLabel.style.color = 'var(--text-color)';
        helpLabel.style.fontSize = '18px';
        helpLabel.textContent = `Text codes for advanced list creation;`;
        fieldsContainer.appendChild(helpLabel);

        // Create a paragraph element for the help text
        const helpText = document.createElement('p');

        // Apply styling to the paragraph element
        helpText.style.color = 'var(--text-color)';
        helpText.style.fontSize = '12px';

        // Set the content of the help text
        helpText.innerHTML = `
  <em>"%" marks the end of an item.<br>
  "*n" Multiply the odds an item is chosen.<br>
  "&!" Create a new sub list, index is assigned by order.<br>
  "&?n" Get a random item from a sublist.<br>
  "#?a" Get Location name (Description only)<br>
  ">>" Comment start.<br>
  "<<" Comment end.<br></em>
`;

        // Append the paragraph to the container
        fieldsContainer.appendChild(helpText);

        const cancelButton = settingsForm.querySelector('#cancel-button-alt');
        cancelButton.addEventListener('click', () => {
            closeModal(settingsModal);
        });

        const settingsModal = createModal('Randomizer Settings', settingsForm);
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Update randomizerSettingsAlt
            fields.forEach(field => {
                const select = settingsForm[field];
                const textarea = settingsForm[field + '_custom'];
                randomizerSettingsAlt[field].customList = textarea.value.trim();
                if (randomizerSettingsAlt[field].customList !== '') {
                    randomizerSettingsAlt[field].selectedOption = '';
                } else {
                    randomizerSettingsAlt[field].selectedOption = select.value;
                }
            });
            closeModal(settingsModal);
        });

        settingsForm.parentNode.style.backgroundColor = 'var(--bg-color-full)';
    }

    // Function to edit a location with randomize feature
    function editLocation(location) {
        const lockState = {
            emoji: false,
            name: false,
            description: false
        };

        const editForm = document.createElement('form');
        editForm.innerHTML = `
    <div style="width: 100%; min-width: 500px; margin: 0 auto; position: relative;">
        ${createFieldAlt('Emoji', 'emoji', location.emoji)}
        ${createReferenceField('Reference', 'reference', location.reference)}
        ${createFieldAlt('Name', 'name', location.name)}
        ${createTextareaFieldAlt('Description', 'description', location.description)}
        <button type="submit" style="background-color: var(--button-bg-color); color: var(--text-color); border: none; padding: 5px; border-radius: 5px; width: 100%; text-align: center; margin-top: 10px;">Save</button>
    </div>
    `;

        // Helper functions to create fields with lock buttons
        function createFieldAlt(labelText, fieldName, value) {
            return `
        <label style="color: var(--text-color); font-size: 12px; margin-bottom: 8px; display: block;">
            ${labelText}:
            <div style="position: relative;">
                <input type="text" name="${fieldName}" value="${value}" autocomplete="off" style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; width: calc(100% - 35px); box-sizing: border-box;"/>
                <button type="button" class="lock-button-alt" data-field="${fieldName}" style="position: absolute; right: 0; top: 0; height: 100%; width: 35px; background-color: var(--button-bg-color); border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer; color: var(--text-color);">${lockState[fieldName] ? '🔒' : '🔓'}</button>
            </div>
        </label>
        `;
        }

        function createReferenceField(labelText, fieldName, value) {
            return `
        <label style="color: var(--text-color); font-size: 12px; margin-bottom: 8px; display: block;">
            ${labelText}:
            <div style="position: relative;">
                <input type="text" name="${fieldName}" value="${value}" autocomplete="off" style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; width: calc(100% - 35px); box-sizing: border-box;" />
                <button type="button" class="open-reference-button" data-field="${fieldName}" style="position: absolute; right: 0; top: 0; height: 100%; width: 35px; background-color: var(--button-bg-color); border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer; color: var(--text-color);">🔗</button>
            </div>
        </label>
        `;
        }

        function createTextareaFieldAlt(labelText, fieldName, value) {
            return `
        <label style="color: var(--text-color); font-size: 12px; margin-bottom: 8px; display: block;">
            ${labelText}:
            <div style="position: relative;">
                <textarea name="${fieldName}" autocomplete="off" rows="4" style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding: 5px; width: calc(100% - 35px); box-sizing: border-box;">${value}</textarea>
                <button type="button" class="lock-button-alt" data-field="${fieldName}" style="position: absolute; right: 0; top: 0; height: 100%; width: 35px; background-color: var(--button-bg-color); border: 1px solid var(--border-color); border-radius: 5px; cursor: pointer; color: var(--text-color);">${lockState[fieldName] ? '🔒' : '🔓'}</button>
            </div>
        </label>
        `;
        }

        // Copy Tooltip button
        const copyButton = document.createElement('button');
        copyButton.textContent = '📋';
        copyButton.title = 'Copy Tooltip';
        copyButton.type = 'button'; // Prevent form submission
        copyButton.style.cssText = `
    position: absolute;
    top: 15px;
    right: 50px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-color);
    `;
        copyButton.addEventListener('click', () => {
            const tooltipContent = getLocationTooltipContent(location);
            const textWithNewlines = tooltipContent.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
            navigator.clipboard.writeText(textWithNewlines);
        });
        editForm.appendChild(copyButton);

        // Randomize button
        const randomizeButton = document.createElement('button');
        randomizeButton.textContent = '🎲';
        randomizeButton.title = 'Randomize';
        randomizeButton.type = 'button'; // Prevent form submission
        randomizeButton.style.cssText = `
    position: absolute;
    top: 15px;
    right: 90px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-color);
    `;
        randomizeButton.addEventListener('click', () => {
            const randomLocation = generateRandomLocationAlt();
            const fields = ['emoji', 'name', 'description'];
            fields.forEach((field) => {
                if (!lockState[field]) {
                    editForm[field].value = randomLocation[field];
                }
            });
        });
        editForm.appendChild(randomizeButton);

        // Settings button
        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️';
        settingsButton.title = 'Randomizer Settings';
        settingsButton.type = 'button'; // Prevent form submission
        settingsButton.style.cssText = `
    position: absolute;
    top: 15px;
    right: 130px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-color);
    `;
        settingsButton.addEventListener('click', () => {
            openRandomizerSettingsAlt();
        });
        editForm.appendChild(settingsButton);

        const modal = createModal('Edit Location', editForm);

        // Lock button functionality
        const lockButtons = editForm.querySelectorAll('.lock-button-alt');
        lockButtons.forEach((button) => {
            const fieldName = button.getAttribute('data-field');
            button.addEventListener('click', () => {
                lockState[fieldName] = !lockState[fieldName];
                // Update button icon based on state
                button.textContent = lockState[fieldName] ? '🔒' : '🔓';
            });
        });

        // Open Reference button functionality
        const referenceButton = editForm.querySelector('.open-reference-button');
        referenceButton.addEventListener('click', () => {
            const referenceUrl = editForm.reference.value;
            if (isValidImageUrl(referenceUrl)) {
                window.open(referenceUrl, '_blank');
            } else {
                alert('Invalid image URL');
            }
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            location.emoji = editForm.emoji.value;
            location.reference = editForm.reference.value;
            location.name = editForm.name.value;
            location.description = editForm.description.value;
            renderLocationGroups();
            ensureActiveLocation();
            closeModal(modal);
        });
    }

    // Function to delete a location
    function deleteLocation(locationId) {
        if (confirm('Are you sure you want to delete this location?')) {
            locationGroups.forEach(group => {
                group.items = deleteLocationRecursive(group.items, locationId);
            });
            renderLocationGroups();
            ensureActiveLocation();
        }
    }

    function deleteLocationRecursive(items, locationId) {
        return items.filter(item => {
            if (item.id === locationId) {
                return false;
            }
            if (item.children && item.children.length > 0) {
                item.children = deleteLocationRecursive(item.children, locationId);
            }
            return true;
        });
    }

    // Function to export all locations with groups
    function exportLocations() {
        const data = {
            locationGroups: locationGroups,
            settings: { l_radius, l_labelFontSize } // Save current settings
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `all_locations_with_groups.json`;
        link.click();
    }

    // Function to import locations with groups
    function importLocations() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    // Old format
                    locationGroups = importedData;
                    renderLocationGroups();
                } else if (importedData.locationGroups) {
                    locationGroups = importedData.locationGroups;

                    // Load settings
                    if (importedData.settings) {
                        // Assign settings
                        l_radius = importedData.settings.l_radius || l_radius;
                        l_labelFontSize = importedData.settings.l_labelFontSize || l_labelFontSize;
                    }

                    renderLocationGroups();
                } else {
                    alert('Invalid format for characters import.');
                }
            } catch (error) {
                alert('Failed to import characters: ' + error.message);
            }
        };
            reader.readAsText(file);
        });
        fileInput.click();
    }

    // Function to export a single location
    function exportLocation(location) {
        const json = JSON.stringify(location, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${location.name}.json`;
        link.click();
    }

    // Function to move location to a group (uncoupling from parent)
    function moveLocationToGroup(locationId, targetGroupIndex) {
        let location = null;
        // Remove location from current group or parent
        locationGroups.forEach(group => {
            group.items = removeLocationRecursive(group.items, locationId, (item) => {
                location = item;
            });
        });
        // Add to target group
        if (location) {
            locationGroups[targetGroupIndex].items.push(location);
            renderLocationGroups();
            ensureActiveLocation();
        }
    }

    function removeLocationRecursive(items, locationId, callback) {
        return items.filter(item => {
            if (item.id === locationId) {
                callback(item);
                return false;
            }
            if (item.children && item.children.length > 0) {
                item.children = removeLocationRecursive(item.children, locationId, callback);
            }
            return true;
        });
    }

    // Function to move location under another location (nesting)
    function moveLocationToParent(locationId, parentLocation) {
        let location = null;
        // Remove location from current group or parent
        locationGroups.forEach(group => {
            group.items = removeLocationRecursive(group.items, locationId, (item) => {
                location = item;
            });
        });
        if (location) {
            if(parentLocation.children == undefined){
               parentLocation.children = [];
            }
            parentLocation.children.push(location);
            renderLocationGroups();
            ensureActiveLocation();
        }
    }

    // Function to create a modal
    function createModal(title, content) {
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        `;

        const modalBox = document.createElement('div');
        modalBox.style.cssText = `
            background-color: var(--bg-color);
            padding: 20px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            width: fit-content;
            min-width: 500px;
            max-width: 90%;
            box-shadow: 0 0 10px var(--shadow-color);
            position: relative;
        `;

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        modalTitle.style.cssText = `
            margin-top: 0;
            color: var(--text-color);
        `;
        modalBox.appendChild(modalTitle);

        const closeButton = document.createElement('button');
        closeButton.textContent = '✖️';
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-color);
        `;
        closeButton.addEventListener('click', () => {
            closeModal(modalOverlay);
        });
        modalBox.appendChild(closeButton);

        modalBox.appendChild(content);
        modalOverlay.appendChild(modalBox);
        document.body.appendChild(modalOverlay);

        return modalOverlay;
    }

    // Function to close a modal
    function closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    // Function to ensure at least one location is active
    function ensureActiveLocation() {
        const activeLocations = [];
        locationGroups.forEach(group => {
            group.items.forEach(loc => {
                collectActiveLocations(loc, activeLocations);
            });
        });
        if (activeLocations.length === 0 && locationGroups.flatMap(g => g.items).length > 0) {
            locationGroups[0].items[0].active = true;
        }
    }

    function collectActiveLocations(location, activeLocations) {
        if (location.active) {
            activeLocations.push(location);
        }
        if (location.children && location.children.length > 0) {
            location.children.forEach(child => {
                collectActiveLocations(child, activeLocations);
            });
        }
    }

    // Initial render of Character and Location Groups
    renderCharacterGroups();
    renderLocationGroups();

    // Load D3.js library
    await new Promise((resolve, reject) => {
        const d3Script = document.createElement('script');
        d3Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.4/d3.min.js';
        d3Script.onload = resolve;
        d3Script.onerror = reject;
        document.head.appendChild(d3Script);
    });

    // --- Modifications Start Here ---

    // Variables to keep track of open windows
    let radialTreeOpen = false;
    let searchPanelOpen = { character: false, location: false };

    // Helper function to find an item by ID
    function findItemById(groups, id) {
        let result = null;
        for (let group of groups) {
            if (group.id === id) {
                return group;
            }
            if (group.items) {
                result = findItemInItems(group.items, id);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    function findItemInItems(items, id) {
        for (let item of items) {
            if (item.id === id) {
                return item;
            } else if (item.children && item.children.length > 0) {
                let found = findItemInItems(item.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    function findGroupIndexByName(groups, name) {
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].name === name) {
                return i;
            }
        }
        return null;
    }

    // Helper function to remove an item by ID
    function removeItemById(groups, id) {
        for (let group of groups) {
            if (group.items) {
                group.items = removeItemFromItems(group.items, id);
            }
        }
    }

    function removeItemFromItems(items, id) {
        return items.filter(item => {
            if (item.id === id) {
                return false;
            } else if (item.children && item.children.length > 0) {
                item.children = removeItemFromItems(item.children, id);
            }
            return true;
        });
    }

    // Helper function to check for circular references
    function isAncestor(itemId, possibleAncestorId, type) {
        let targetItem = null;
        if (type === 'character') {
            targetItem = findItemById(characterGroups, itemId);
        } else {
            targetItem = findItemById(locationGroups, itemId);
        }

        if (!targetItem) return false;

        function searchChildren(item) {
            if (item.id === possibleAncestorId) {
                return true;
            }
            if (item.children && item.children.length > 0) {
                for (let child of item.children) {
                    if (searchChildren(child)) {
                        return true;
                    }
                }
            }
            if (item.items && item.items.length > 0) {
                for (let child of item.items) {
                    if (searchChildren(child)) {
                        return true;
                    }
                }
            }
            return false;
        }

        return searchChildren(targetItem);
    }

    // Function to create a radial tree visualization
    function createRadialTree(data, type) {
        // Variables to store settings and use them globally
        c_radius = type === 'character' ? (window.c_radius || 300) : 300;
        c_labelFontSize = type === 'character' ? (window.c_labelFontSize || 12) : 12;
        c_nodeSize = type === 'character' ? (window.c_nodeSize || 24) : 24;
        l_radius = type === 'location' ? (window.l_radius || 300) : 300;
        l_labelFontSize = type === 'location' ? (window.l_labelFontSize || 12) : 12;
        l_nodeSize = type === 'location' ? (window.l_nodeSize || 24) : 24;

        ItemTransferTarget = null;

        // Close any existing radial tree window
        if (document.getElementById('radial-tree-window')) {
            document.body.removeChild(document.getElementById('radial-tree-window'));
        }

        // Create the movable window container
        const windowContainer = document.createElement('div');
        windowContainer.id = 'radial-tree-window';
        windowContainer.style.cssText = `
        position: fixed;
        top: 100px;
        left: 100px;
        width: 600px;
        height: 600px;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        box-shadow: 0 0 10px var(--shadow-color);
        border-radius: 5px;
        z-index: 10002;
        display: flex;
        flex-direction: column;
    `;

        // Add a header with the title and buttons
        const header = document.createElement('div');
        header.style.cssText = `
        display: flex;
        align-items: center;
        padding: 5px;
        background-color: var(--button-bg-color);
        color: var(--text-color);
        cursor: move;
    `;

        const title = document.createElement('span');
        title.textContent = `${type === 'character' ? 'Character' : 'Location'} Radial Tree`;
        title.style.flexGrow = '1';
        header.appendChild(title);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';

        // New Refresh Button
        const NItemButton = document.createElement('button');
        NItemButton.textContent = '📝';
        NItemButton.title = 'New Item';
        NItemButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        margin-right: 5px;
    `;
        buttonContainer.appendChild(NItemButton);

        NItemButton.addEventListener('click', () => {
            if(type === 'character'){createNewCharacter();}else{createNewLocation();}
            ItemTransferTarget = null;
            refreshTree(svgContainer, data, type);
        });

        // New Refresh Button
        const NGroupButton = document.createElement('button');
        NGroupButton.textContent = '🗄️';
        NGroupButton.title = 'New Group';
        NGroupButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        margin-right: 5px;
    `;
        buttonContainer.appendChild(NGroupButton);

        NGroupButton.addEventListener('click', () => {
            if(type === 'character'){createNewCharacterGroup();}else{createNewLocationGroup();}
            ItemTransferTarget = null;
            refreshTree(svgContainer, data, type);
        });

        // New Refresh Button
        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄';
        refreshButton.title = 'Refresh Tree';
        refreshButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        margin-right: 5px;
    `;
        buttonContainer.appendChild(refreshButton);

        // Settings Button
        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️';
        settingsButton.title = 'Settings';
        settingsButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        margin-right: 5px;
    `;
        buttonContainer.appendChild(settingsButton);

        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖️';
        closeButton.style.cssText = `
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
    `;
        closeButton.addEventListener('click', () => {
            document.body.removeChild(windowContainer);
            radialTreeOpen = false;
            ItemTransferTarget = null;
        });
        buttonContainer.appendChild(closeButton);

        header.appendChild(buttonContainer);
        windowContainer.appendChild(header);

        // Create SVG container
        const svgContainer = document.createElement('div');
        svgContainer.style.cssText = `
        flex-grow: 1;
        width: 100%;
        background-color: var(--bg-color);
        overflow: hidden;
        position: relative;
    `;
        windowContainer.appendChild(svgContainer);

        // Append to body
        document.body.appendChild(windowContainer);
        radialTreeOpen = true;

        // Make window draggable
        makeElementDraggable(windowContainer, header);

        // Create settings panel
        const settingsPanel = document.createElement('div');
        settingsPanel.style.cssText = `
        position: absolute;
        top: 50px;
        right: 10px;
        width: 200px;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        box-shadow: 0 0 10px var(--shadow-color);
        border-radius: 5px;
        padding: 10px;
        z-index: 10003;
        display: none;
    `;
        settingsPanel.innerHTML = `
        <label style="color: var(--text-color);">Node Distance: <input type="range" min="100" max="1000" value="${type === 'character' ? c_radius : l_radius}" id="nodeDistanceSlider" style="width: 100%;"></label>
        <label style="color: var(--text-color);">Label Size: <input type="range" min="8" max="24" value="${type === 'character' ? c_labelFontSize : l_labelFontSize}" id="labelSizeSlider" style="width: 100%;"></label>
        <label style="color: var(--text-color);">Node Size: <input type="range" min="8" max="48" value="${type === 'character' ? c_nodeSize : l_nodeSize}" id="nodeSizeSlider" style="width: 100%;"></label>
        <button id="applySettingsButton" style="margin-top: 10px; width: 100%;">Apply</button>
    `;
        windowContainer.appendChild(settingsPanel);

        settingsButton.addEventListener('click', () => {
            settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
            ItemTransferTarget = null;
            refreshTree(svgContainer, data, type);
        });

        const nodeDistanceSlider = settingsPanel.querySelector('#nodeDistanceSlider');
        const labelSizeSlider = settingsPanel.querySelector('#labelSizeSlider');
        const nodeSizeSlider = settingsPanel.querySelector('#nodeSizeSlider');
        const applySettingsButton = settingsPanel.querySelector('#applySettingsButton');

        applySettingsButton.addEventListener('click', () => {
            if (type === 'character') {
                window.c_radius = parseInt(nodeDistanceSlider.value, 10);
                window.c_labelFontSize = parseInt(labelSizeSlider.value, 10);
                window.c_nodeSize = parseInt(nodeSizeSlider.value, 10);
            } else {
                window.l_radius = parseInt(nodeDistanceSlider.value, 10);
                window.l_labelFontSize = parseInt(labelSizeSlider.value, 10);
                window.l_nodeSize = parseInt(nodeSizeSlider.value, 10);
            }

            settingsPanel.style.display = 'none';

            // Regenerate the tree with new settings
            generateRadialTreeVisualization(svgContainer, data, type, type === 'character' ? window.c_radius : window.l_radius, type === 'character' ? window.c_labelFontSize : window.l_labelFontSize, type === 'character' ? window.c_nodeSize : window.l_nodeSize);
        });

        // Add event listener to refresh button
        refreshButton.addEventListener('click', () => {
            ItemTransferTarget = null;
            refreshTree(svgContainer, data, type);
        });

        // Initial rendering of the tree
        generateRadialTreeVisualization(svgContainer, data, type, type === 'character' ? c_radius : l_radius, type === 'character' ? c_labelFontSize : l_labelFontSize, type === 'character' ? c_nodeSize : l_nodeSize);
    }

    function refreshTree(container, data, type) {
        // Clear the existing SVG container (to remove the old tree)
        container.innerHTML = '';

        // Re-use the same data, or if necessary, fetch new data here
        const structuredData = structureData(type === 'character' ? characterGroups : locationGroups);

        // Store the current zoom, pan, and rotation before refresh
        const currentTransform = window.currentTransform || { x: container.clientWidth / 2, y: container.clientHeight / 2, k: 1 };
        const currentRotation = window.currentRotation || 0;

        // Regenerate the tree visualization with the existing settings
        const radius = type === 'character' ? window.c_radius : window.l_radius;
        const labelFontSize = type === 'character' ? window.c_labelFontSize : window.l_labelFontSize;
        const nodeSize = type === 'character' ? window.c_nodeSize : window.l_nodeSize;

        // Regenerate the tree and apply the stored transformation
        generateRadialTreeVisualization(container, structuredData, type, radius, labelFontSize, nodeSize, currentTransform, currentRotation);
    }

    function generateRadialTreeVisualization(container, data, type, radius = 300, labelFontSize = 12, nodeSize = 24, initialTransform = null, initialRotation = 0) {
        // Clear the container
        container.innerHTML = '';

        // Set dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Current zoom, pan, and rotation state
        let currentRotation = initialRotation;
        let currentTransform = initialTransform || { x: width / 2, y: height / 2, k: 1 };

        // Create a D3 zoom behavior
        const zoomBehavior = d3.zoom()
        .scaleExtent([0.5, 5])
        .on('zoom', zoomed);

        // Create SVG element with zoom and pan functionality
        const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoomBehavior) // Apply the zoom behavior
        .append('g')
        .attr('transform', `translate(${currentTransform.x},${currentTransform.y}) scale(${currentTransform.k}) rotate(${currentRotation})`);

        // Apply the initial zoom, pan, and rotation
        d3.select(container).select('svg').call(zoomBehavior.transform, d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(currentTransform.k));

        function zoomed(event) {
            // Update the current pan and zoom values
            currentTransform = event.transform;
            // Apply the combined transformation (zoom, pan, and rotation)
            svg.attr('transform', `translate(${currentTransform.x},${currentTransform.y}) scale(${currentTransform.k}) rotate(${currentRotation})`);

            // Store the transformation globally so we can retain it after refresh
            window.currentTransform = currentTransform;
        }

        // Convert data to D3 hierarchy
        const root = d3.hierarchy({ name: type === 'character' ? 'Characters' : 'Locations', children: data })
        .sum(d => d.children ? 0 : 1);

        // Create the radial tree layout
        const tree = d3.tree()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

        tree(root);

        // Create links
        const link = svg.append('g')
        .selectAll('.link')
        .data(root.links())
        .join('path')
        .attr('class', 'link')
        .attr('d', d3.linkRadial()
              .angle(d => d.x)
              .radius(d => d.y))
        .attr('stroke', 'var(--muted-bg-color)')
        .attr('fill', 'none');

        // Create nodes
        const node = svg.append('g')
        .selectAll('.node')
        .data(root.descendants())
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `
            rotate(${d.x * 180 / Math.PI - 90})
            translate(${d.y},0)
        `);

        // Use emoji as node symbols
        node.append('text')
            .attr('dy', '0.31em')
            .attr('font-size', `${nodeSize}px`) // Use nodeSize for font size
            .attr('text-anchor', 'middle')
            .attr('transform', d => `rotate(0)`) // No flipping of text
            .text(d => d.data.emoji || '⭕') // Use emoji or a default symbol
            .style('font-size', `${nodeSize}px`)
            .style('fill', 'var(--text-color)')
            .on('mouseover', (event, d) => {
            const content = type === 'character' ? getCharacterTooltipContent(d.data, true) : getLocationTooltipContent(d.data, true);
            showTooltip_radial(event, content);
        })
            .on('mousemove', (event) => {
            moveTooltip_radial(event);
        })
            .on('mouseout', hideTooltip_radial)
            .on('contextmenu', (event, d) => {
            event.preventDefault();
            navigateToItem(d.data.id, type); // Navigate to the item in the sidebar
        });

        // Labels (without emoji)
        node.append('text')
            .attr('dy', '0.31em')
            .attr('x', +nodeSize / 2 + 5)
            .attr('text-anchor', 'center') // Always center the text
            .attr('transform', d => `rotate(0)`) // No flipping of text
            .text(d => d.data.name) // Do not include emoji in label
            .style('font-size', `${labelFontSize}px`)
            .style('fill', d => (ItemTransferTarget && d.data.id === ItemTransferTarget.id) ? 'var(--warning-bg-color)' : 'var(--text-color)')
            .on('mouseover', (event, d) => {
            const content = type === 'character' ? getCharacterTooltipContent(d.data, true) : getLocationTooltipContent(d.data, true);
            showTooltip_radial(event, content);
        })
            .on('mousemove', (event) => {
            moveTooltip_radial(event);
        })
            .on('mouseout', hideTooltip_radial)
            .on('contextmenu', (event, d) => {
            event.preventDefault();

            if (ItemTransferTarget == null) {
                // Check if it's an item (not a group)
                if (d.data.description != undefined) { // items undefined means it's not a group
                    CreateContextMenu(
                        'var(--bg-tool)',
                        'var(--text-color)',
                        'var(--border-color)',
                        ['📍 Locate', '✏️ Edit', '📦 Move', '🗑️ Delete'],
                        [
                            // Locate
                            function() { navigateToItem(d.data.id, type); },
                            // Edit
                            function() {
                                const itemId = d.data.id;
                                if (type === 'character') {
                                    const character = findItemById(characterGroups, itemId);
                                    if (character) {
                                        editCharacter(character);
                                        renderCharacterGroups();
                                        refreshTree(container, data, type);
                                    }
                                } else {
                                    const location = findItemById(locationGroups, itemId);
                                    if (location) {
                                        editLocation(location);
                                        renderLocationGroups();
                                        refreshTree(container, data, type);
                                    }
                                }
                            },
                            // Move
                            function() {
                                ItemTransferTarget = d.data;
                                refreshTree(container, data, type);
                            },
                            // Delete
                            function() {
                                const itemId = d.data.id;
                                if (type === 'character') {
                                    deleteCharacter(itemId);
                                    renderCharacterGroups();
                                    refreshTree(container, data, type);
                                } else {
                                    deleteLocation(itemId);
                                    renderLocationGroups();
                                    refreshTree(container, data, type);
                                }
                            }
                        ]
                    );
                } else {
                    // It's a group
                    CreateContextMenu(
                        'var(--bg-tool)',
                        'var(--text-color)',
                        'var(--border-color)',
                        ['✏️ Edit', '🗑️ Delete'],
                        [
                            // Edit Group
                            function() {
                                const groupName = d.data.name;
                                if (type === 'character') {
                                    const groupIndex = findGroupIndexByName(characterGroups, groupName);
                                    if (groupIndex !== null) {
                                        renameGroup(groupIndex);
                                        renderCharacterGroups();
                                        refreshTree(container, data, type);
                                    }
                                } else {
                                    const groupIndex = findGroupIndexByName(locationGroups, groupName);
                                    if (groupIndex !== null) {
                                        renameLocationGroup(groupIndex);
                                        renderLocationGroups();
                                        refreshTree(container, data, type);
                                    }
                                }
                            },
                            // Delete Group
                            function() {
                                const groupName = d.data.name;
                                if (type === 'character') {
                                    const groupIndex = findGroupIndexByName(characterGroups, groupName);
                                    if (groupIndex !== null) {
                                        deleteGroup(groupIndex);
                                        renderCharacterGroups();
                                        refreshTree(container, data, type);
                                    }
                                } else {
                                    const groupIndex = findGroupIndexByName(locationGroups, groupName);
                                    if (groupIndex !== null) {
                                        deleteLocationGroup(groupIndex);
                                        renderLocationGroups();
                                        refreshTree(container, data, type);
                                    }
                                }
                            }
                        ]
                    );
                }
            } else {
                // Moving an item
                if (ItemTransferTarget.id === d.data.id) {
                    // Stop moving
                    CreateContextMenu(
                        'var(--button-bg-color)',
                        'var(--text-color)',
                        ['Stop'],
                        [
                            function() {
                                ItemTransferTarget = null;
                                refreshTree(container, data, type);
                            }
                        ]
                    );
                } else {
                    // Place the item
                    CreateContextMenu(
                        'var(--button-bg-color)',
                        'var(--text-color)',
                        ['Place'],
                        [
                            function() {
                                // Check for circular reference
                                if (isAncestor(ItemTransferTarget.id, d.data.id, type)) {
                                    alert('Cannot move an item into its descendant.');
                                    return;
                                }

                                if (d.data.description != undefined) {
                                    if (type === 'character') {
                                        moveCharacterToParent(ItemTransferTarget.id, findItemById(characterGroups, d.data.id));
                                    } else {
                                        moveLocationToParent(ItemTransferTarget.id, findItemById(locationGroups, d.data.id));
                                    }
                                } else {
                                    // New parent is a group
                                    const groupName = d.data.name;
                                    if (type === 'character') {
                                        const groupIndex = findGroupIndexByName(locationGroups, groupName);
                                        moveCharacterToGroup(ItemTransferTarget.id, groupIndex);
                                    } else {
                                        const groupIndex = findGroupIndexByName(locationGroups, groupName);
                                        moveLocationToGroup(ItemTransferTarget.id, groupIndex);
                                    }
                                }

                                // Clear transfer target
                                ItemTransferTarget = null;

                                // Refresh
                                if (type === 'character') {
                                    renderCharacterGroups();
                                } else {
                                    renderLocationGroups();
                                }

                                refreshTree(container, data, type);
                            }
                        ]
                    );
                }
            }
            showMenu(event);
        });

        // --- Rotation Knob UI ---
        const knobContainer = document.createElement('div');
        knobContainer.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 100px;
        height: 100px;
        z-index: 10003;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    `;

        const knob = document.createElement('div');
        knob.style.cssText = `
        width: 60px;
        height: 60px;
        background-color: var(--button-bg-color);
        border-radius: 50%;
        position: relative;
        transform: rotate(${currentRotation}deg); /* Apply initial rotation */
    `;

        // Add a small indicator inside the knob to show the starting point
        const knobIndicator = document.createElement('div');
        knobIndicator.style.cssText = `
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 10px;
        background-color: var(--text-color);
        border-radius: 50%;
    `;
        knob.appendChild(knobIndicator);

        knobContainer.appendChild(knob);
        container.appendChild(knobContainer);

        let isDragging = false;
        let previousAngle = 0;

        // Utility function to get the angle of the mouse relative to the center of the knob
        function getAngleFromEvent(event, element) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = event.clientX - centerX;
            const deltaY = event.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            return angle;
        }

        // Function to start dragging the knob
        knob.addEventListener('mousedown', (event) => {
            isDragging = true;
            previousAngle = getAngleFromEvent(event, knob);
            event.preventDefault();
        });

        // Function to handle dragging
        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const currentAngle = getAngleFromEvent(event, knob);
                const deltaAngle = currentAngle - previousAngle;

                // Update the current rotation
                currentRotation = (currentRotation + deltaAngle) % 360;
                if (currentRotation < 0) currentRotation += 360; // Ensure positive rotation

                // Apply the combined transformation (rotation, zoom, and pan)
                svg.attr('transform', `translate(${currentTransform.x},${currentTransform.y}) scale(${currentTransform.k}) rotate(${currentRotation})`);

                // Rotate the knob visually
                knob.style.transform = `rotate(${currentRotation}deg)`;

                // Store the updated rotation globally so we can retain it after refresh
                window.currentRotation = currentRotation;

                // Update previous angle for the next move
                previousAngle = currentAngle;
            }
        });

        // Stop dragging when mouse is released
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Resize listener
        window.addEventListener('resize', () => {
            svg.attr('width', container.clientWidth).attr('height', container.clientHeight);
        });
    }

    function navigateToItem(id, type) {
        if (type === 'character') {
            // Expand groups and scroll to the character
            characterGroups.forEach(group => {
                expandItemAndFind(group, id, type);
            });
            renderCharacterGroups();

            const itemElement = document.querySelector(`#character-group-list [data-id="${id}"]`);
            if (itemElement) {
                // Ensure the character menu stays open
                if (characterSidebar.style.right === '-350px') {
                    characterToggleButton.click(); // Open the sidebar if it's closed
                }
                itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Add glow effect
                addGlowEffectWithTransition(itemElement);
            }
        } else {
            // Expand groups and scroll to the location
            locationGroups.forEach(group => {
                expandItemAndFind(group, id, type);
            });
            renderLocationGroups();

            const itemElement = document.querySelector(`#location-group-list [data-id="${id}"]`);
            if (itemElement) {
                // Ensure the location menu stays open
                if (locationSidebar.style.left === '-350px') {
                    locationToggleButton.click(); // Open the sidebar if it's closed
                }
                itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Add glow effect
                addGlowEffectWithTransition(itemElement);
            }
        }
    }

    function addGlowEffectWithTransition(element) {
        // Save the original styles to restore them later
        const originalBoxShadow = element.style.boxShadow;
        const originalTransition = element.style.transition;

        // Set up the transition for box-shadow
        element.style.transition = 'box-shadow 0.5s ease-in-out';

        // Apply the glow effect using the CSS variable --warning-bg-color
        element.style.boxShadow = `0 0 15px 5px var(--warning-bg-color)`;

        // Remove the glow effect after 1 second
        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow || ''; // Restore the original boxShadow
            setTimeout(() => {
                element.style.transition = originalTransition || ''; // Restore the original transition
            }, 500); // Wait for the transition to finish before restoring
        }, 1000);
    }

    // Function to expand groups and find item (recursive)
    function expandItemAndFind(item, id, type) {
        if (item.id === id) {
            return true;
        }

        let found = false;

        if (item.items && item.items.length > 0) {
            for (let i = 0; i < item.items.length; i++) {
                if (expandItemAndFind(item.items[i], id, type)) {
                    item.collapsed = false; // Expand parent
                    found = true;
                }
            }
        }

        if (item.children && item.children.length > 0) {
            for (let i = 0; i < item.children.length; i++) {
                if (expandItemAndFind(item.children[i], id, type)) {
                    item.collapsed = false; // Expand parent
                    found = true;
                }
            }
        }

        return found;
    }

    // Function to create structured data for D3.js
    function structureData(groups) {
        return groups.map(group => ({
            name: group.name,
            emoji: '📁', // Assign folder emoji to groups
            id: group.id || generateId(),
            children: group.items.map(item => mapItem(item))
        }));
    }

    function mapItem(item) {
        return {
            id: item.id,
            name: item.name,
            emoji: item.emoji || '', // Use item's emoji, empty string if none
            description: item.description || item.bio || '',
            children: item.children ? item.children.map(child => mapItem(child)) : []
        };
    }

    // Tooltips for Radial Tree
    let radialTooltipElement = null;

    function showTooltip_radial(event, content) {
        hideTooltip_radial(); // Remove existing tooltip if any

        // Create new tooltip element
        radialTooltipElement = document.createElement('div');
        radialTooltipElement.style.cssText = `
        position: absolute;
        z-index: 100003;
        background-color: var(--bg-tool);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        padding: 5px;
        border-radius: 5px;
        font-size: 12px;
        max-width: 600px;
        white-space: pre-wrap;
        box-shadow: 0 0 10px var(--shadow-color);
        pointer-events: none;
    `;
        radialTooltipElement.innerHTML = content;

        radialTooltipElement.style.left = `${event.pageX + 10}px`;
        radialTooltipElement.style.top = `${event.pageY + 10}px`;

        document.body.appendChild(radialTooltipElement);
    }

    function moveTooltip_radial(event) {
        if (radialTooltipElement) {
            radialTooltipElement.style.left = `${event.pageX + 10}px`;
            radialTooltipElement.style.top = `${event.pageY + 10}px`;
        }
    }

    function hideTooltip_radial() {
        if (radialTooltipElement && radialTooltipElement.parentNode) {
            radialTooltipElement.parentNode.removeChild(radialTooltipElement);
            radialTooltipElement = null; // Set to null after removing
        }
    }
    // Adding buttons to headers

    // Character Header Modifications
    characterHeader.innerHTML = '';

    const characterHeaderContainer = document.createElement('div');
    characterHeaderContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    // Add context menu functionality
    characterHeader.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        CreateContextMenu(
            'var(--bg-tool)',
            'var(--text-color)',
            'var(--border-color)',
            ['🌐 Radial', '🔍 Search', '📁 Group', '🗃️ Import', '⬇️ Export'],
            [
                () => {
                    if (radialTreeOpen) {
                        document.getElementById('radial-tree-window').remove();
                        radialTreeOpen = false;
                    }
                    const data = structureData(characterGroups);
                    createRadialTree(data, 'character');
                },
                () => toggleSearchPanel('character'),
                () => createNewCharacterGroup(),
                () => importCharacters(),
                () => exportCharacters(),
                ]
            );
        showMenu(e);
    });

    // Character Title
    const characterTitle = document.createElement('span');
    characterTitle.textContent = '═════════╣ Characters ╠═════════';
    characterTitle.style.cssText = `
        color: var(--text-color);
        flex-grow: 1;
        text-align: center;
    `;
    characterHeaderContainer.appendChild(characterTitle);

    characterHeader.appendChild(characterHeaderContainer);

    // Location Header Modifications
    locationHeader.innerHTML = '';

    const locationHeaderContainer = document.createElement('div');
    locationHeaderContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Location Title
    const locationTitle = document.createElement('span');
    locationTitle.textContent = '════════╣ Locations ╠════════';
    locationTitle.style.cssText = `
        color: var(--text-color);
        flex-grow: 1;
        text-align: center;
        font-size: large;
        text-overflow: clip;
        overflow: hidden;
    `;
    locationHeaderContainer.appendChild(locationTitle);

    locationHeader.appendChild(locationHeaderContainer);

    // Function to open search panel (Integrated into Sidebar)
    function toggleSearchPanel(type) {
        if (type === 'character') {
            if (searchPanelOpen.character) {
                // Close search panel
                characterSearchContainer.style.display = 'none';
                searchPanelOpen.character = false;
            } else {
                // Open search panel
                characterSearchContainer.style.display = 'block';
                searchPanelOpen.character = true;
                characterSearchInput.focus();
            }
        } else {
            if (searchPanelOpen.location) {
                // Close search panel
                locationSearchContainer.style.display = 'none';
                searchPanelOpen.location = false;
            } else {
                // Open search panel
                locationSearchContainer.style.display = 'block';
                searchPanelOpen.location = true;
                locationSearchInput.focus();
            }
        }
    }

    // Character Search Panel
    const characterSearchContainer = document.createElement('div');
    characterSearchContainer.style.cssText = `
    position: relative;
    display: none;
    padding: 10px;
    background-color: var(--bg-color);
`;
    const characterSearchInput = document.createElement('input');
    characterSearchInput.type = 'text';
    characterSearchInput.placeholder = 'Search...';
    characterSearchInput.style.cssText = `
    width: 100%;
    margin-bottom: 0px;
    padding: 5px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--bg-color);
    color: var(--text-color);
`;

    // Adjust the results container to match the search input width
    const characterResultsContainer = document.createElement('div');
    characterResultsContainer.style.cssText = `
    position: absolute;
    top: 100%; /* Position below the search input */
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    box-shadow: 0 0 10px var(--shadow-color);
    z-index: 1000;
`;
    characterSearchContainer.appendChild(characterSearchInput);
    characterSearchContainer.appendChild(characterResultsContainer);
    characterSidebar.insertBefore(characterSearchContainer, characterGroupList);

    characterSearchInput.addEventListener('input', () => {
        const query = characterSearchInput.value.trim().toLowerCase();
        characterResultsContainer.innerHTML = '';
        if (query.length > 0) {
            const results = searchItems(query, 'character');
            if (results.length > 0) {
                results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.style.cssText = `
                    padding: 5px;
                    border-bottom: 1px solid var(--border-color);
                    cursor: pointer;
                    color: var(--text-color);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                `;
                    resultItem.addEventListener('click', () => {
                        navigateToItem(result.id, 'character');
                        characterSearchInput.value = '';
                        characterResultsContainer.innerHTML = '';
                    });
                    resultItem.innerHTML = formatSearchResult(result);
                    characterResultsContainer.appendChild(resultItem);
                });
            } else {
                characterResultsContainer.textContent = 'No results found.';
            }
        }
    });

    // Location Search Panel
    const locationSearchContainer = document.createElement('div');
    locationSearchContainer.style.cssText = `
    position: relative;
    display: none;
    padding: 10px;
    background-color: var(--bg-color);
`;
    const locationSearchInput = document.createElement('input');
    locationSearchInput.type = 'text';
    locationSearchInput.placeholder = 'Search...';
    locationSearchInput.style.cssText = `
    width: 100%;
    margin-bottom: 0px;
    padding: 5px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--bg-color);
    color: var(--text-color);
`;

    // Adjust the results container to match the search input width
    const locationResultsContainer = document.createElement('div');
    locationResultsContainer.style.cssText = `
    position: absolute;
    top: 100%; /* Position below the search input */
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    box-shadow: 0 0 10px var(--shadow-color);
    z-index: 1000;
`;
    locationSearchContainer.appendChild(locationSearchInput);
    locationSearchContainer.appendChild(locationResultsContainer);
    locationSidebar.insertBefore(locationSearchContainer, locationGroupList);

    locationSearchInput.addEventListener('input', () => {
        const query = locationSearchInput.value.trim().toLowerCase();
        locationResultsContainer.innerHTML = '';
        if (query.length > 0) {
            const results = searchItems(query, 'location');
            if (results.length > 0) {
                results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.style.cssText = `
                    padding: 5px;
                    border-bottom: 1px solid var(--border-color);
                    cursor: pointer;
                    color: var(--text-color);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                `;
                    resultItem.addEventListener('click', () => {
                        navigateToItem(result.id, 'location');
                        locationSearchInput.value = '';
                        locationResultsContainer.innerHTML = '';
                    });
                    resultItem.innerHTML = formatSearchResult(result);
                    locationResultsContainer.appendChild(resultItem);
                });
            } else {
                locationResultsContainer.textContent = 'No results found.';
            }
        }
    });

    // Function to search items
    function searchItems(query, type) {
        const results = [];
        const groups = type === 'character' ? characterGroups : locationGroups;
        groups.forEach(group => {
            searchGroup(group, query, results, []);
        });
        return results;
    }

    function searchGroup(group, query, results, path) {
        const newPath = [...path, group.name];
        group.items.forEach(item => {
            searchItem(item, query, results, newPath);
        });
    }

    function searchItem(item, query, results, path) {
        const newPath = [...path, item.name];
        if (item.name.toLowerCase().includes(query)) {
            results.push({ id: item.id, path: newPath });
        }
        if (item.children && item.children.length > 0) {
            item.children.forEach(child => {
                searchItem(child, query, results, newPath);
            });
        }
    }

    function formatSearchResult(result) {
        let html = '';
        const maxCharacters = 42; // Adjust as needed
        let displayPath = result.path.join(' > ');

        if (displayPath.length > maxCharacters) {
            displayPath = '...' + displayPath.slice(-maxCharacters);
        }

        const pathSegments = displayPath.split(' > ');

        for (let i = 0; i < pathSegments.length - 1; i++) {
            html += `<span style="font-size: 12px; color: var(--text-color-darker); white-space: nowrap;">${pathSegments[i]} > </span>`;
        }
        html += `<strong style="white-space: nowrap;">${pathSegments[pathSegments.length - 1]}</strong>`;

        return `<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${html}</div>`;
    }

    function GetImage(url, callback) {
        // Validate the URL (basic image URL validation)
        if (!isValidImageUrl(url)) {
            console.error("Invalid image URL:", url);
            if (typeof callback === "function") {
                callback(null);
            }
            return;
        }

        // Fetch the image
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "arraybuffer", // Get the raw binary data
            onload: function(response) {
                if (response.status === 200) {
                    // Convert the binary data to a Base64 string
                    const base64Data = arrayBufferToBase64(response.response);

                    // Determine the MIME type from the URL or default to image/jpeg
                    const mimeType = getMimeTypeFromUrl(url) || "image/jpeg";
                    const dataUri = `data:${mimeType};base64,${base64Data}`;

                    // Call the callback with the Base64 data URI
                    if (typeof callback === "function") {
                        callback(dataUri);
                    }
                } else {
                    console.error(`Failed to fetch image. HTTP Status: ${response.status}`);
                    if (typeof callback === "function") {
                        callback(null);
                    }
                }
            },
            onerror: function(error) {
                console.error("Error fetching the image:", error);
                if (typeof callback === "function") {
                    callback(null);
                }
            }
        });
    }

    function isValidImageUrl(url) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp|svg))$/i.test(url);
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function getMimeTypeFromUrl(url) {
        const extension = url.split('.').pop().toLowerCase();
        switch (extension) {
            case 'png': return 'image/png';
            case 'jpg': case 'jpeg': return 'image/jpeg';
            case 'gif': return 'image/gif';
            case 'webp': return 'image/webp';
            case 'bmp': return 'image/bmp';
            case 'svg': return 'image/svg+xml';
            default: return null;
        }
    }

    // Function to open Global Status Panel
    function openGlobalStatusPanel() {
        const statusForm = document.createElement('form');
        statusForm.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%; min-width: 500px; margin: 0 auto;">
            <!-- Scrollable content container -->
            <div class="scrollable-content" style="flex: 1; overflow-y: auto; max-height: 300px; padding-right: 10px;">
                <!-- Fields will be inserted here dynamically -->
            </div>
            <!-- Buttons at the bottom -->
            <div class="status-buttons" style="text-align: center; padding-top: 10px;">
                <button type="submit" style="background-color: var(--button-bg-color); color: var(--text-color); border: none; padding: 8px 16px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Save Status</button>
                <button type="button" style="background-color: var(--button-bg-color); color: var(--text-color); border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;" id="cancel-button-status">Cancel</button>
            </div>
        </div>
        `;

        const fieldsContainer = statusForm.querySelector('.scrollable-content');

        // Define the fields for the Global Status Panel
        const fields = [
            { name: 'time', label: 'Time', type: 'text', multiline: false },
            { name: 'weather', label: 'Weather', type: 'text', multiline: false },
            { name: 'plot', label: 'Plot', type: 'text', multiline: true },
        ];

        // Create UI for each field
        fields.forEach(({ name, label, multiline }) => {
            const fieldDiv = document.createElement('div');
            fieldDiv.style.marginBottom = '10px';

            const fieldLabel = document.createElement('label');
            fieldLabel.style.color = 'var(--text-color)';
            fieldLabel.style.fontSize = '12px';
            fieldLabel.textContent = label + ':';

            if (multiline) {
                // Multi-line textarea
                const textarea = document.createElement('textarea');
                textarea.name = name;
                textarea.rows = 4;
                textarea.placeholder = `Enter ${label.toLowerCase()} here...`;
                textarea.style.cssText = 'background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding:5px; width: 100%; box-sizing: border-box; margin-top: 5px;';
                textarea.value = globalStatus[name]; // Pre-fill with current value
                fieldDiv.appendChild(fieldLabel);
                fieldDiv.appendChild(textarea);
            } else {
                // Single-line input
                const input = document.createElement('input');
                input.type = 'text';
                input.name = name;
                input.placeholder = `Enter ${label.toLowerCase()} here...`;
                input.style.cssText = 'background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 5px; padding:5px; width: 100%; box-sizing: border-box; margin-top: 5px;';
                input.value = globalStatus[name]; // Pre-fill with current value
                fieldDiv.appendChild(fieldLabel);
                fieldDiv.appendChild(input);
            }

            fieldsContainer.appendChild(fieldDiv);
        });

        // Cancel button functionality
        const cancelButton = statusForm.querySelector('#cancel-button-status');
        cancelButton.addEventListener('click', () => {
            closeModal(statusModal);
        });

        // Create modal and handle form submission
        const statusModal = createModal('Global Status', statusForm);
        statusForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Push form data to the globalStatus object
            fields.forEach(({ name }) => {
                const fieldElement = statusForm[name];
                globalStatus[name] = fieldElement.value.trim(); // Save to global object
            });
            console.log('Updated Global Status:', globalStatus); // For debugging
            closeModal(statusModal);
        });

        statusForm.parentNode.style.backgroundColor = 'var(--bg-color-full)';
    }
})();
