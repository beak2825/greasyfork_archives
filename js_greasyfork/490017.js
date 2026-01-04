// ==UserScript==
// @name         AccesSight Pro
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  outils d'accessibilité pour les malvoyants
// @author       Yglsan
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490017/AccesSight%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/490017/AccesSight%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration initiale
    const defaultConfig = {
        textSize: 16,
        contrastMode: 'normal',
        speechRate: 1,
        highlightLinks: true,
        darkMode: false,
        savedPosition: { x: 20, y: 20 }
    };

    // État courant
    let config = {
        ...defaultConfig,
        ...GM_getValue('accessightConfig', {})
    };

    // Création de l'interface utilisateur
    function createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.id = 'accessight-panel';
        panel.style.cssText = `
            position: fixed;
            top: ${config.savedPosition.y}px;
            left: ${config.savedPosition.x}px;
            background: ${config.darkMode ? '#333' : '#FFF'};
            color: ${config.darkMode ? '#FFF' : '#000'};
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
            min-width: 250px;
            cursor: move;
        `;

        // Header avec titre et bouton de fermeture
        const header = document.createElement('div');
        header.innerHTML = `
            <h2 style="margin: 0 0 1rem 0; font-size: 1.2rem;">AccesSight</h2>
            <button aria-label="Fermer" style="position: absolute; top: 5px; right: 5px; background: none; border: none; cursor: pointer;">×</button>
        `;
        panel.appendChild(header);

        // Contrôles principaux
        const controls = [
            { type: 'range', label: 'Taille du texte', min: 12, max: 24, value: config.textSize, key: 'textSize' },
            { type: 'select', label: 'Contraste', options: ['Normal', 'Élevé', 'Inversé'], value: config.contrastMode, key: 'contrastMode' },
            { type: 'button', label: 'Lecture vocale', action: 'toggleSpeech' },
            { type: 'toggle', label: 'Mode sombre', value: config.darkMode, key: 'darkMode' },
            { type: 'toggle', label: 'Surbrillance liens', value: config.highlightLinks, key: 'highlightLinks' }
        ];

        controls.forEach(control => {
            const controlGroup = document.createElement('div');
            controlGroup.style.marginBottom = '0.5rem';

            switch (control.type) {
                case 'range':
                    controlGroup.innerHTML = `
                        <label style="display: block; margin-bottom: 0.3rem;">
                            ${control.label}: <output>${control.value}px</output>
                        </label>
                        <input type="range" 
                               min="${control.min}" 
                               max="${control.max}" 
                               value="${control.value}" 
                               style="width: 100%;"
                               data-key="${control.key}">
                    `;
                    break;

                case 'select':
                    controlGroup.innerHTML = `
                        <label style="display: block; margin-bottom: 0.3rem;">${control.label}</label>
                        <select style="width: 100%;" data-key="${control.key}">
                            ${control.options.map(opt => 
                                `<option value="${opt.toLowerCase()}" ${opt.toLowerCase() === control.value ? 'selected' : ''}>${opt}</option>`
                            ).join('')}
                        </select>
                    `;
                    break;

                case 'toggle':
                    controlGroup.innerHTML = `
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" ${control.value ? 'checked' : ''} data-key="${control.key}">
                            ${control.label}
                        </label>
                    `;
                    break;

                case 'button':
                    controlGroup.innerHTML = `
                        <button style="width: 100%; padding: 0.5rem;" data-action="${control.action}">
                            ${control.label}
                        </button>
                    `;
                    break;
            }

            panel.appendChild(controlGroup);
        });

        // Gestion des événements
        panel.querySelectorAll('input, select').forEach(element => {
            element.addEventListener('change', handleSettingChange);
        });

        panel.querySelector('[data-action="toggleSpeech"]').addEventListener('click', toggleTextToSpeech);

        // Déplacement du panel
        let isDragging = false;
        let initialX, initialY, currentX, currentY;

        panel.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', dragPanel);
        document.addEventListener('mouseup', stopDragging);

        function startDragging(e) {
            isDragging = true;
            initialX = e.clientX - panel.offsetLeft;
            initialY = e.clientY - panel.offsetTop;
        }

        function dragPanel(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                panel.style.left = `${currentX}px`;
                panel.style.top = `${currentY}px`;
            }
        }

        function stopDragging() {
            isDragging = false;
            GM_setValue('accessightConfig', {
                ...config,
                savedPosition: { x: currentX, y: currentY }
            });
        }

        document.body.appendChild(panel);
        applyAccessibilitySettings();
    }

    // Appliquer les paramètres d'accessibilité
    function applyAccessibilitySettings() {
        // Taille du texte
        document.documentElement.style.fontSize = `${config.textSize}px`;

        // Contraste
        switch (config.contrastMode) {
            case 'élevé':
                GM_addStyle(`
                    body {
                        filter: contrast(150%);
                    }
                `);
                break;
            case 'inversé':
                GM_addStyle(`
                    body {
                        filter: invert(1) hue-rotate(180deg);
                    }
                `);
                break;
        }

        // Mode sombre
        if (config.darkMode) {
            GM_addStyle(`
                body {
                    background: #111 !important;
                    color: #FFF !important;
                }
            `);
        }

        // Surbrillance des liens
        if (config.highlightLinks) {
            GM_addStyle(`
                a {
                    outline: 2px solid #FF0000 !important;
                    padding: 2px !important;
                }
            `);
        }
    }

    // Gestion des changements de paramètres
    function handleSettingChange(e) {
        const key = e.target.dataset.key;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        if (key === 'textSize') value = parseInt(value);
        
        config[key] = value;
        GM_setValue('accessightConfig', config);
        applyAccessibilitySettings();

        if (key === 'textSize') {
            e.target.parentNode.querySelector('output').textContent = `${value}px`;
        }
    }

    // Synthèse vocale
    let speech = null;
    function toggleTextToSpeech() {
        if (!speech) {
            speech = new window.SpeechSynthesisUtterance();
            speech.text = document.body.textContent;
            speech.rate = config.speechRate;
            window.speechSynthesis.speak(speech);
        } else {
            window.speechSynthesis.cancel();
            speech = null;
        }
    }

    // Initialisation
    function init() {
        if (!document.getElementById('accessight-panel')) {
            createAccessibilityPanel();
        }
    }

    // Démarrage
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();