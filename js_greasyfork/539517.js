// ==UserScript==
// @name         Netflix Subtitle Customizer
// @namespace    https://greasyfork.org/de/users/1476487-hyperr
// @version      1.2
// @description  Customize Netflix subtitles appearance
// @author       HYPERR.
// @match        https://www.netflix.com/*
// @icon         https://www.netflix.com/favicon.ico
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/539517/Netflix%20Subtitle%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/539517/Netflix%20Subtitle%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaults = {
        fontSize: '100%',
        textColor: '#FFFFFF',
        backgroundColor: '#000000',
        backgroundOpacity: '0.5',
        bold: false,
        italic: false
    };

    let settings = Object.assign({}, defaults, GM_getValue('subtitleSettings', {}));
    let styleElement = null;

    function applyStyles() {
        if (!styleElement) {
            styleElement = document.createElement('style');
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            .player-timedtext-text-container span {
                font-size: ${settings.fontSize} !important;
                color: ${settings.textColor} !important;
                background-color: rgba(${hexToRgb(settings.backgroundColor)}, ${settings.backgroundOpacity}) !important;
                font-weight: ${settings.bold ? 'bold' : 'normal'} !important;
                font-style: ${settings.italic ? 'italic' : 'normal'} !important;
            }
        `;
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'subtitle-control-panel';
        
        panel.innerHTML = `
            <h3>Subtitle Settings <span id="close-panel">×</span></h3>
            <div>
                <label>Size: </label>
                <input type="range" id="fontSize" min="50" max="200" value="${parseInt(settings.fontSize)}">
                <span id="fontSizeValue">${settings.fontSize}</span>%
            </div>
            <div>
                <label>Color: </label>
                <input type="color" id="textColor" value="${settings.textColor}">
            </div>
            <div>
                <label>Background: </label>
                <input type="color" id="backgroundColor" value="${settings.backgroundColor}">
                <input type="range" id="backgroundOpacity" min="0" max="1" step="0.1" value="${settings.backgroundOpacity}">
            </div>
            <div>
                <label><input type="checkbox" id="bold" ${settings.bold ? 'checked' : ''}> Bold</label>
                <label><input type="checkbox" id="italic" ${settings.italic ? 'checked' : ''}> Italic</label>
            </div>
            <button id="resetSettings">Reset</button>
        `;

        document.body.appendChild(panel);

        // Apply initial styles
        applyStyles();

        // Event listeners
        document.getElementById('close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        document.getElementById('fontSize').addEventListener('input', (e) => {
            settings.fontSize = e.target.value + '%';
            document.getElementById('fontSizeValue').textContent = settings.fontSize;
            GM_setValue('subtitleSettings', settings);
            applyStyles();
        });

        document.getElementById('textColor').addEventListener('input', (e) => {
            settings.textColor = e.target.value;
            GM_setValue('subtitleSettings', settings);
            applyStyles();
        });

        document.getElementById('backgroundColor').addEventListener('input', (e) => {
            settings.backgroundColor = e.target.value;
            GM_setValue('subtitleSettings', settings);
            applyStyles();
        });

        document.getElementById('backgroundOpacity').addEventListener('input', (e) => {
            settings.backgroundOpacity = e.target.value;
            GM_setValue('subtitleSettings', settings);
            applyStyles();
        });

        document.getElementById('bold').addEventListener('change', (e) => {
            settings.bold = e.target.checked;
            GM_setValue('subtitleSettings', settings);
            applyStyles();
        });

        document.getElementById('italic').addEventListener('change', (e) => {
            settings.italic = e.target.checked;
            GM_setValue('subtitleSettings', settings);
            applyStyles();
        });

        document.getElementById('resetSettings').addEventListener('click', () => {
            settings = Object.assign({}, defaults);
            GM_setValue('subtitleSettings', settings);
            applyStyles();
            location.reload(); // Only reload for reset to ensure clean state
        });
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('.player-timedtext-text-container')) {
            observer.disconnect();
            createControlPanel();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    GM_registerMenuCommand('Show Subtitle Controls', () => {
        const panel = document.getElementById('subtitle-control-panel');
        if (panel) panel.style.display = 'block';
    });
})();